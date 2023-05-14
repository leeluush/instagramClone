const mongoose = require('mongoose');
const ObjectId = mongoose.ObjectId;

const UserTokenSchema = new mongoose.Schema({
  user: {
    type: ObjectId,
    required: true,
    ref: 'User',
    index: true,
  },
  token: String,
  created: {
    type: Date,
    default: Date.now
  },
  expires: {
    type: Date,
    default: () => Date.now() + (1000 * 60 * 60 * 24 * 90)
  },
})

const UserToken = mongoose.model('UserToken', UserTokenSchema)

module.exports = UserToken;