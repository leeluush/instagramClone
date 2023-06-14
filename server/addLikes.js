const mongoose = require('mongoose');
const Chance = require('chance');
const chance = new Chance();

const Post = require('./models/post');  // replace with actual path to your Post model
const User = require('./models/user');  // replace with actual path to your User model
const Comment = require('./models/comment'); // replace with actual path to your Comment model
const Like = require('./models/like');  // replace with actual path to your Like model

const mongoUri = 'mongodb://localhost:27017/instagram-clone';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

async function createFakeLikes() {
  try {
    const users = await User.find();
    const posts = await Post.find();
    const comments = await Comment.find();

    const promises = [];

    for (let i = 0; i < 1000; i++) {
      const randomUser = chance.pickone(users);
      const randomPost = chance.pickone(posts);
      const randomComment = chance.pickone(comments);

      const postLike = new Like({
        user: randomUser._id,
        post: randomPost._id,
      });

      const commentLike = new Like({
        user: randomUser._id,
        comment: randomComment._id,
      });

      promises.push(postLike.save());
      promises.push(commentLike.save());
    }

    await Promise.all(promises);

    console.log('Fake likes created successfully.');
  } catch (err) {
    console.error('Failed to create fake likes: ', err);
  } finally {
    mongoose.connection.close();
  }
}

createFakeLikes();
