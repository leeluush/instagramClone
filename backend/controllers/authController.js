const jwt = require('jsonwebtoken');
const cookie = require('cookie');
const util = require('util');

const User = require('../models/userModel');
const RefreshToken = require('../utils/refreshToken.model');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../middleware/appError');

const signJWT = util.promisify(jwt.sign);
const verifyJWT = util.promisify(jwt.verify);

const createToken = async (id, secret, expiresIn) => {
  const token = await signJWT({ id }, secret, { expiresIn });
  if (!token) {
    throw new AppError('Could not sign the token', 500);
  }
  return token;
};

const verifyToken = async (token, secret) => {
  const decodedToken = await verifyJWT(token, secret);
  if (!decodedToken) {
    throw new AppError('Invalid token', 401);
  }
  return decodedToken;
};

const verifyAccessToken = async (token) =>
  verifyToken(token, process.env.ACCESS_JWT_SECRET);

const verifyRefreshToken = async (token) =>
  verifyToken(token, process.env.REFRESH_JWT_SECRET);

const signAccessToken = async (id) =>
  createToken(
    id,
    process.env.ACCESS_JWT_SECRET,
    process.env.JWT_ACCESS_TOKEN_EXPIRES_IN,
  );
const signRefreshToken = async (id) =>
  createToken(
    id,
    process.env.REFRESH_JWT_SECRET,
    process.env.JWT_REFRESH_TOKEN_EXPIRES_IN,
  );

const setCookie = (res, cookieName, cookieValue, maxAge, path = '/api') => {
  res.cookie(cookieName, cookieValue, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== 'development',
    sameSite: 'strict',
    maxAge: maxAge,
    path: path,
  });
};

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

exports.signUp = catchAsync(async (req, res, next) => {
  const requiredFields = [
    'firstName',
    'lastName',
    'email',
    'password',
    'birthdate',
    'userName',
    'passwordConfirm',
  ];
  const missingFields = [];

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

  const {
    firstName,
    lastName,
    email,
    password,
    birthdate,
    userName,
    passwordConfirm,
  } = req.body;
  const profileImage = req.file ? req.file.path : null;

  const userExists = await User.findOne({ email });

  if (userExists) {
    return next(new AppError('User already exists', 400));
  }

  if (password !== passwordConfirm) {
    return next(new AppError('Passwords do not match', 400));
  }

  // Create user
  const newUser = await User.create({
    firstName,
    lastName,
    email,
    password,
    birthdate,
    userName,
    passwordConfirm,
    profileImage: profileImage,
  });

  const accessToken = await signAccessToken(newUser._id);
  const refreshToken = await signRefreshToken(newUser._id);

  // Send the tokens to the client in cookies
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
      id: newUser.id,
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
