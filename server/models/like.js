const mongoose = require('mongoose');
const ObjectId = mongoose.ObjectId;


const LikeSchema = new mongoose.Schema({
    user: {
        type: ObjectId,
        required: true,
        ref: 'User',
        index: true,
    },
    post: {
        type: ObjectId,
        ref: 'Post',
        required: 'true',
        index: true,
    },

    createdAt: {
        type: Date,
        default: Date.now
    },
    

}
)

LikeSchema.index({ user: 1, post: 1 }, { unique: true });
const Like = mongoose.model('Like', LikeSchema)
module.exports = Like;