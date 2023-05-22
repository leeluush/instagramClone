const mongoose = require('mongoose');
const Chance = require('chance');
const Comment = require('./models/comment');
const User = require('./models/user');
const Post = require('./models/post');

const chance = new Chance();

// Replace with your MongoDB connection URI
const mongoUri = 'mongodb://localhost:27017/instagram-clone';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;

connection.once('open', async () => {
  console.log('MongoDB database connection established successfully');

  try {
    // Get all user IDs from the User collection
    const users = await User.find({}, '_id');

    // Get all post IDs from the Post collection
    const posts = await Post.find({}, '_id');

    // Generate fake comments
    const comments = [];
    for (let i = 0; i < 50; i++) {
      const randomAuthorId = chance.pickone(users)._id;
      const randomPostId = chance.pickone(posts)._id;

      const comment = new Comment({
        author: randomAuthorId,
        post: randomPostId,
        content: chance.sentence(),
        likes: chance.integer({ min: 0, max: 100 }),
      });

      comments.push(comment);
    }

    // Insert comments into the database
    await Comment.insertMany(comments);
    console.log('Fake comments added successfully');
  } catch (error) {
    console.error('Error occurred:', error);
  }

  mongoose.connection.close();
});
