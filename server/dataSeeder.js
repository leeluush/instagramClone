const mongoose = require('mongoose');
const User = require('./models/user');
const chance = require('chance').Chance();

// Rest of the code remains the same
// ...


async function addProfileImages() {
  try {
    // Connect to the MongoDB database
    await mongoose.connect('mongodb://localhost/instagram-clone', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Fetch users from the database, limiting to 10 users
    const users = await User.find().limit(10);

    // Update each user with a random profile image and username
    for (const user of users) {
      const profileImage = chance.avatar();
      const username = chance.word({ length: 8 });
      user.profileImage = profileImage;
      user.userName = username;
      await user.save();
    }

    console.log('Profile images and usernames added successfully!');
  } catch (error) {
    console.error('Error adding profile images and usernames:', error);
  } finally {
    // Disconnect from the database
    mongoose.disconnect();
  }
}

// Call the function to add profile images and usernames
addProfileImages();
