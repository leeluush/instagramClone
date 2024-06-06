const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types;

const LikeSchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    required: true,
    ref: 'User',
    index: true,
  },
  post: {
    type: ObjectId,
    ref: 'Post',
    index: true,
  },
  comment: {
    type: ObjectId,
    ref: 'Comment',
    index: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },
});

LikeSchema.pre('save', function (next) {
  if (!this.post && !this.comment) {
    next(new Error('Either post or comment must be provided.'));
  } else if (this.post && this.comment) {
    next(new Error('Only one of post or comment should be provided.'));
  } else {
    next();
  }
});

LikeSchema.index(
  { user: 1, post: 1 },
  { unique: true, partialFilterExpression: { post: { $type: 'objectId' } } },
);
LikeSchema.index(
  { user: 1, comment: 1 },
  { unique: true, partialFilterExpression: { comment: { $type: 'objectId' } } },
);

const Like = mongoose.model('Like', LikeSchema);
module.exports = Like;
