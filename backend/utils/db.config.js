const mongoose = require('mongoose');
require('../models/userModel');
require('../models/comment.model');
require('../models/follower.model');
require('../models/refreshToken.model');
require('../models/like.model');
require('../models/post.model');

const url = process.env.MONGODB_URL;

async function connect() {
  try {
    await mongoose.connect(url);
    console.log('Connection to mongo succeeded');
  } catch (err) {
    console.error(`Failed to connect to mongo: ${err}`);
    process.exit(1);
  }
}

module.exports = connect;
