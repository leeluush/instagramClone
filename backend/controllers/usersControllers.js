const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModel');
const AppError = require('../middleware/appError');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getSuggestedUsers = catchAsync(async (req, res, next) => {
  const currentUserId = req.user.id;

  const currentUserFollowing = (
    await User.findById(currentUserId).select('following -_id')
  ).following;

  const followingIds = currentUserFollowing.map(
    (userId) => new mongoose.Types.ObjectId(userId),
  );

  const suggestedUsers = await User.aggregate([
    {
      $match: {
        $and: [
          { _id: { $nin: followingIds } },
          { _id: { $ne: new mongoose.Types.ObjectId(currentUserId) } },
        ],
      },
    },
    {
      $lookup: {
        from: 'users', // Assuming the followers are stored in the same 'users' collection. Adjust if otherwise.
        localField: 'followers',
        foreignField: '_id',
        as: 'mutualFollowers',
      },
    },
    {
      $project: {
        userName: 1,
        profileImage: 1,
        mutualConnections: {
          $size: {
            $filter: {
              input: '$mutualFollowers',
              as: 'mutualFollower',
              cond: { $in: ['$$mutualFollower._id', followingIds] },
            },
          },
        },
      },
    },
    { $sort: { mutualConnections: -1 } }, // Sort by mutual connections
    { $limit: 10 },
  ]);

  res.status(200).json({
    status: 'success',
    data: {
      users: suggestedUsers,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword',
        400,
      ),
    );
  }
  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      users: updatedUser,
    },
  });
});

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
