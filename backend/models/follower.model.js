const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;

const FollowerSchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    required: true,
    ref: 'User',
    index: true,
  },
  followee: {
    type: ObjectId,
    required: true,
    ref: 'User',
    index: true,
  },

  created: {
    type: Date,
    default: Date.now,
  },
});

FollowerSchema.index({ user: 1, followee: 1 }, { unique: true });
const Follower = mongoose.model('Follower', FollowerSchema);

module.exports = Follower;
