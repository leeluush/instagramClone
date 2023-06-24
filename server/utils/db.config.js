const mongoose = require('mongoose');
require('../modules/users/user.model');
require('../modules/comments/comment.model');
require('../modules/followers/follower.model');
require('../modules/auth/refreshToken.model');
require('../modules/likes/like.model');
require('../modules/posts/post.model');




const url = process.env.MONGODB_URL || 'mongodb://localhost/instagram-clone'

async function connect() {
    try {
         await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        
        console.log('Connection to mongo succeed');
    } catch (err) {
        throw new Error(`Failed to connect to mongo: ${err}`)
        process.exit(1)
    }
}

module.exports = connect;
