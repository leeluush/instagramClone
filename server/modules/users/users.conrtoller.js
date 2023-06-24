const asyncHandler = require('express-async-handler');
const User = require('./user.model');
const RefreshToken = require('../auth/refreshToken.model');
const { encode, verifyRefreshToken } = require('../../services/jwt.service');


const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check for user email
  const user = await User.findOne({ email }).exec();

  if (user && (await user.matchPassword(password))) {
    // Generate new access and refresh tokens for the user
    const { access_token, refresh_token } = encode({ email, userId: user._id });

    // Save the refresh token in the database
    const userRefreshToken = new RefreshToken({ token: refresh_token, user: user._id });
    await userRefreshToken.save();

    // Send the tokens to the client in cookies
    res.cookie('accessToken', access_token, { httpOnly: true, maxAge: 15 * 60 * 1000, path: '/api' }); // 15 minutes
    res.cookie('refreshToken', refresh_token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, path: '/api' }); // 7 days

    res.status(201).json({
      _id: user._id,
      userName: user.userName,
      email: user.email,
      profileImage: user.profileImage,
      tokens: { access_token, refresh_token },
    });
  } else {
    res.status(401);
    throw new Error('Invalid user email or password');
  }
});


// @desc Register new user
// @route POST /api/users
// @access Public
const registerUser = asyncHandler(async (req, res) => {
  const { firstName, lastName, email, password, birthdate, userName } = req.body;
  const profileImage = req.file.path;

  if (!firstName || !lastName || !email || !password || !birthdate || !userName || !profileImage) {
    res.status(400);
    throw new Error('Please add all fields');
  }

  // Check if user exists
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }
  const hashedPassword = await bcrypt.hash(password, 10);

  // Create user
  const user = await User.create({
    firstName,
    userName,
    lastName,
    email,
    password: hashedPassword,
    birthdate,
    profileImage
  });

  // Generate new access and refresh tokens for the user
  const { access_token, refresh_token } = encode({ email, userId: user._id });

  // Save the refresh token in the database
  const userRefreshToken = new RefreshToken({ token: refresh_token, user: user._id });
  await userRefreshToken.save();

  // Send the tokens to the client in cookies
  res.cookie('accessToken', access_token, { httpOnly: true, maxAge: 15 * 60 * 1000, path: '/api' }); // 15 minutes
  res.cookie('refreshToken', refresh_token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, path: '/api' }); // 7 days

  res.status(201).json({
    _id: user.id,
    name: user.name,
    email: user.email,
  });
});


const refreshToken = asyncHandler(async (req, res) => {
  const existingRefreshToken = req.cookies ? req.cookies.refreshToken : '';
  const decoded = verifyRefreshToken(existingRefreshToken);

  if (!decoded) {
    return res.status(401).json({ message: 'Invalid refresh token' });
  }

  const { userId, email } = decoded;

  const refreshTokenInDb = await RefreshToken.findOne({ token: existingRefreshToken, user: userId });

  if (!refreshTokenInDb) {
    throw new Error('Refresh token does not exist in db');
  }

  // Generate new access and refresh tokens
  const { access_token, refresh_token } = encode({ email, userId });

  // Save the new refresh token in the database and delete the old one
  const newRefreshToken = new RefreshToken({ token: refresh_token, user: userId });
  await newRefreshToken.save();
  await RefreshToken.deleteOne({ token: existingRefreshToken, user: userId });

  // Send the new tokens to the client in cookies
  res.cookie('accessToken', access_token, { httpOnly: true, maxAge: 15 * 60 * 1000, path: '/api' }); // 15 minutes
  res.cookie('refreshToken', refresh_token, { httpOnly: true, maxAge: 7 * 24 * 60 * 60 * 1000, path: '/api' }); // 7 days

  const user = await User.findById(userId);
  if (!user) {
    return res.status(401).json({ message: 'User not found.' });
  }

  res.json({
    tokens: { access_token, refresh_token },
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

// @desc Get user data
// @route GET /api/users/profile
// @access Private
const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId)
    .select('firstName lastName email birthdate profileImage')
    .exec();

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

const getUserByUserId = asyncHandler(async (req, res) => {
  const userId = req.params.userId;
  console.log("UserId from request:", req.user.id);

  const user = await User.findById( userId )
    .sort('-created')
    .exec();
  res.json(user);
});

// @desc Log out user
// @route GET /api/users/logout
// @access Private
const logOutUser = function (req, res) {
  res.clearCookie('accessToken', { path: '/api' });
  res.clearCookie('refreshToken', { path: '/api' });
  res.status(200).json({ message: 'User logged out' });
};

// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const user = await User.findById(userId);

  if (user) {
    user.firstName = req.body.firstName || user.firstName;
    user.lastName = req.body.lastName || user.lastName;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({
      _id: updatedUser._id,
      firstName: updatedUser.firstName,
      lastName: updatedUser.lastName,
      email: updatedUser.email,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
});

module.exports = {
  login,
  registerUser,
  getUserProfile,
  refreshToken,
  getUserByUserId,
  logOutUser,
  updateUserProfile,
};
