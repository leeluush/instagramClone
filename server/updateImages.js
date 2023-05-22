const mongoose = require('mongoose');
const User = require('./models/user');
const Post = require('./models/post');

mongoose.connect('mongodb://localhost:27017/instagram-clone', {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.log('Failed to connect to MongoDB', err));

// You should replace this function with your real image URL generator
function getRandomImageURL() {
    return `https://picsum.photos/200?random=${Math.floor(Math.random() * 1000)}`;
}

async function updateImageUrls() {
    // Update profileImage in User collection
    const users = await User.find({});
    for(let user of users) {
        user.profileImage = getRandomImageURL();
        await user.save();
    }
    
    // Update coverImage and thumbnail in Post collection
    const posts = await Post.find({});
    for(let post of posts) {
        post.coverImage = getRandomImageURL();
        post.thumbnail = getRandomImageURL();
        await post.save();
    }

    console.log("Update finished");
}

updateImageUrls();
