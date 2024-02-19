const cookie = require('cookie');
const crypto = require('crypto');
const {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  verifyAccessToken,
} = require('./tokenController');
const User = require('../models/userModel');
const RefreshToken = require('../models/refreshToken.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../middleware/appError');
const sendEmail = require('../utils/email');

const setCookie = (res, cookieName, cookieValue, maxAge, path = '/api') => {
  res.cookie(cookieName, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: maxAge,
    path: path,
  });
};

exports.signUp = catchAsync(async (req, res, next) => {
  const requiredFields = [
    'firstName',
    'lastName',
    'email',
    'password',
    'birthdate',
    'userName',
  ];
  const missingFields = [];

  // Check for password confirmation right at the beginning
  if (req.body.password !== req.body.passwordConfirm) {
    return next(new AppError('Passwords do not match', 400));
  }

  // Check for missing fields
  requiredFields.forEach((field) => {
    if (!req.body[field]) {
      missingFields.push(field);
    }
  });

  if (missingFields.length > 0) {
    return next(
      new AppError(`Missing fields: ${missingFields.join(', ')}`, 400),
    );
  }

  const { ...userData } = req.body;
  const profileImage = req.file ? req.file.path : null;

  const userExists = await User.findOne({ email: userData.email });

  if (userExists) {
    return next(new AppError('User already exists', 400));
  }

  let newUser;
  try {
    newUser = await User.create({
      ...userData,
      profileImage,
    });
  } catch (error) {
    return next(new AppError(error.message, 500));
  }

  // Create tokens, set cookies, and send response
  const accessToken = await signAccessToken(newUser._id);
  const refreshToken = await signRefreshToken(newUser._id);

  setCookie(
    res,
    'accessToken',
    accessToken,
    process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
  );
  setCookie(
    res,
    'refreshToken',
    refreshToken,
    process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
  );

  res.status(201).json({
    status: 'success',
    tokens: { accessToken, refreshToken },
    user: {
      id: newUser._id,
      profileImage: newUser.profileImage,
      userName: newUser.userName,
      email: newUser.email,
    },
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('Please provide email and password!', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect password or email', 401));
  }

  const accessToken = await signAccessToken(user._id);
  const refreshToken = await signRefreshToken(user._id);

  const userRefreshToken = new RefreshToken({
    token: refreshToken,
    user: user._id,
  });

  await userRefreshToken.save();

  setCookie(
    res,
    'accessToken',
    accessToken,
    process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
  );
  setCookie(
    res,
    'refreshToken',
    refreshToken,
    process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
  );

  res.status(200).json({
    status: 'success',
    tokens: { accessToken, refreshToken },
    user: {
      id: user.id,
      profileImage: user.profileImage,
      userName: user.userName,
      email: user.email,
    },
  });
});

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return next(new AppError('There is no user with that email address', 404));
  }
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  const resetUrl = `${req.protocol}://${req.get(
    'host',
  )}/api/auth/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetUrl}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message,
    });
    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try agian later',
        500,
      ),
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  const accessToken = await signAccessToken(user._id);
  const refreshToken = await signRefreshToken(user._id);

  const userRefreshToken = new RefreshToken({
    token: refreshToken,
    user: user._id,
  });
  await userRefreshToken.save();

  setCookie(
    res,
    'accessToken',
    accessToken,
    process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
  );
  setCookie(
    res,
    'refreshToken',
    refreshToken,
    process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
  );

  res.status(200).json({
    status: 'success',
    tokens: { accessToken, refreshToken },
    user: {
      id: user.id,
      profileImage: user.profileImage,
      userName: user.userName,
      email: user.email,
    },
  });
});

exports.logOutUser = catchAsync(async (req, res, next) => {
  const existingRefreshToken = req.cookies ? req.cookies.refreshToken : null;

  if (existingRefreshToken) {
    await RefreshToken.deleteOne({ token: existingRefreshToken });
  }
  res.clearCookie('accessToken', { path: '/api' });
  res.clearCookie('refreshToken', { path: '/api' });
  res.status(200).json({ message: 'User logged out' });
});

exports.protect = catchAsync(async (req, res, next) => {
  try {
    const cookies = cookie.parse(req.headers.cookie || '');
    const token = cookies.accessToken;

    if (!token) {
      return next(new AppError('Not Authorized', 401));
    }

    const decoded = await verifyAccessToken(token);
    req.user = { id: decoded.id };
    next();
  } catch (error) {
    next(new AppError(error.message, 401));
  }
});

exports.refreshToken = catchAsync(async (req, res, next) => {
  const existingRefreshToken = req.cookies ? req.cookies.refreshToken : '';

  let decoded;
  try {
    decoded = await verifyRefreshToken(existingRefreshToken);
  } catch (error) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }

  if (!decoded) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }

  const userId = decoded.id;

  const refreshTokenInDb = await RefreshToken.findOne({
    token: existingRefreshToken,
    user: userId,
  });

  if (!refreshTokenInDb) {
    return res
      .status(401)
      .json({ message: 'Refresh token has expired, please log in again.' });
  }

  const accessToken = await signAccessToken(userId);

  setCookie(
    res,
    'accessToken',
    accessToken,
    process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
  );
  setCookie(
    res,
    'refreshToken',
    existingRefreshToken,
    process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
  );

  const user = await User.findById(userId);
  if (!user) {
    return res.status(401).json({ message: 'User not found.' });
  }

  res.status(200).json({
    status: 'success',
    tokens: { accessToken, existingRefreshToken },
    payload: {
      user: {
        _id: user._id,
        userName: user.userName,
        email: user.email,
        profileImage: user.profileImage,
      },
    },
  });
});
