const Follower = require('../models/follower.model');
const catchAsync = require('../utils/catchAsync'); // Make sure to import catchAsync

exports.followUser = catchAsync(async (req, res, next) => {
  const followee = req.params.id;
  const user = req.user.id;

  const follower = new Follower({
    user,
    followee,
  });

  await follower.save();
  res.status(200).json({ message: 'Followed Successfully' });
});

exports.unfollowUser = catchAsync(async (req, res, next) => {
  const followee = req.params.followeeId;
  const user = req.user.id;

  const deletedFollower = await Follower.findOneAndRemove({ user, followee });

  if (deletedFollower) {
    return res.status(200).json({ message: 'Unfollowed successfully' });
  }
  return res
    .status(400)
    .json({ message: 'Could not unfollow. Relationship does not exist.' });
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
