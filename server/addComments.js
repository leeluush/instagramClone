const mongoose = require('mongoose');
const Chance = require('chance');
const Comment = require('./models/comments'); 
const User = require('./models/user')// Replace with your actual path

// Replace with your MongoDB connection URI
const mongoUri = 'mongodb://localhost:27017/instagram-clone';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

const connection = mongoose.connection;

connection.once('open', async () => {
  console.log('MongoDB database connection established successfully');

  const chance = new Chance();

  try {
    // Get all user IDs from the User collection
    const userIds = await User.find({}, '_id');
    console.log(userIds)

    // Generate fake comments
    const comments = [];
    for (let i = 0; i < 50; i++) {
      const randomAuthorId = userIds[Math.floor(Math.random() * userIds.length)]._id;
      const comment = new Comment({
        author: randomAuthorId,
        content: chance.sentence(),
        likes: chance.integer({ min: 0, max: 100 }),
      });
      console.log(comment);
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
