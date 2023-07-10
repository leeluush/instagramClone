const mongoose = require('mongoose');

const Post = require('./server/modules/posts/post.model')

const mongoUri = 'mongodb://localhost:27017/instagram-clone';
mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });

async function updatePostUpdatedTimes() {
  try {
    const posts = await Post.find();

    const updatePromises = posts.map(async (post) => {
      const createdDate = post.created;
      const randomOffset = Math.floor(Math.random() * 60); // Random offset in minutes

      // Update the updated time to be a random time within 24 hours after the created time
      const updatedDate = new Date(createdDate.getTime() + randomOffset * 60 * 1000);
      post.updated = updatedDate;
      await post.save();
    });

    await Promise.all(updatePromises);

    console.log('Post updated times updated successfully.');
  } catch (err) {
    console.error('Failed to update post updated times: ', err);
  } finally {
    mongoose.connection.close();
  }
}

updatePostUpdatedTimes();
