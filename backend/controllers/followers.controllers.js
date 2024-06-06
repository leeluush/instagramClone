const Follower = require('../models/follower.model');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../middleware/appError');

exports.followUser = catchAsync(async (req, res, next) => {
  const followeeId = req.params.id;
  const userId = req.user.id;

  const existingFollower = await Follower.findOne({
    user: userId,
    followee: followeeId,
  });
  if (existingFollower) {
    return next(new AppError('You are already following this user.', 400));
  }

  const follower = new Follower({ user: userId, followee: followeeId });
  await follower.save();
  await User.findByIdAndUpdate(userId, {
    $addToSet: { following: followeeId },
  });

  await User.findByIdAndUpdate(followeeId, {
    $addToSet: { followers: userId },
  });

  res.status(200).json({
    message: 'Followed Successfully',
    follower: follower,
  });
});

exports.unfollowUser = catchAsync(async (req, res, next) => {
  const followeeId = req.params.id;
  const userId = req.user.id;
  const followerToDelete = await Follower.findOneAndDelete({
    user: userId,
    followee: followeeId,
  });

  if (!followerToDelete) {
    return next(
      new AppError('Could not unfollow. Relationship does not exist.', 400),
    );
  }

  await User.findByIdAndUpdate(userId, {
    $pull: { following: followeeId },
  });

  await User.findByIdAndUpdate(followeeId, {
    $pull: { followers: userId },
  });

  res.status(200).json({ message: 'Unfollowed successfully' });
});

exports.isFollowing = catchAsync(async (req, res, next) => {
  const followeeId = req.params.id;
  const userId = req.user.id;

  const follower = await Follower.findOne({
    user: userId,
    followee: followeeId,
  });
  res.status(200).json({ isFollowing: !!follower });
});
