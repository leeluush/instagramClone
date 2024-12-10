const User = require("../models/user.model");

async function addFollwing(userId, followerId) {
  await User.updateOne({ _id: followerId }, { $push: { following: userId } });
  await User.updateOne({ _id: userId }, { $push: { followers: followerId } });
}

async function removeFollowing(userId, followerId) {
  await User.updateOne({ _id: followerId }, { $pull: { following: userId } });
  await User.updateOne({ _id: userId }, { $pull: { followers: followerId } });
}
