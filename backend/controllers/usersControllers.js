const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');


exports.getAllUsers = catchAsync(async (req,res,next) => {
  const users = await User.find()

  res.status(200).json({
    status:'success',
    results: users.length,
    data:{
      users
    }
  })
})

// @desc Get user data
// @route GET /api/users/profile
// @access Private
exports.getUserProfile = catchAsync(async (req, res, next) => {

  const userId = req.user.id;

  const user = await User.findById(userId)
    .select('firstName userName lastName email birthdate profileImage')
    .exec();

  if (user) {
    res.json(user);
  } else {
    res.status(404).json({ message: 'User not found' });
  }
});

exports.getUserByUserId = catchAsync(async (req, res, next) => {
  const { userId } = req.params;

  const user = await User.findById(userId).sort('-created').exec();
  res.json(user);
});

// @desc Log out user
// @route GET /api/users/logout
// @access Private

// @desc Update user profile
// @route PUT /api/users/profile
// @access Private
exports.updateUserProfile = catchAsync(async (req, res, next) => {
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
