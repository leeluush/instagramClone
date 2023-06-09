const mongoose = require('mongoose');

const url = process.env.MONGODB_URL || 'mongodb://localhost/instagram-clone'
let connection;

const connect = async () => {
    try {
         connection = await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        require('../models/user')
        require('../models/post')
        require('../models/comment')
        console.log('Connection to mongo succeed');
    } catch (err) {
        throw new Error(`Failed to connect to mongo: ${err}`)
        process.exit(1)
    }
}

module.exports = connect;
