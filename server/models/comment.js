const mongoose = require ('mongoose');
const ObjectId = mongoose.ObjectId;

const CommentSchema = new mongoose.Schema({
    author: {
        type: ObjectId, 
        required: true, 
        ref: 'User',
        index: true,
        },
        post: {
            type: ObjectId,
            require: true,
            ref: 'Post',
            index: true,
        },

    content: { 
        type: String, 
        required: true},

    likes: {
        type: Number,
        default: 0,
    },
    created: { 
        type: Date, 
        default: Date.now}, 

    updated: {
         type: Date, 
         default: Date.now}
    
}) 

const Comment = mongoose.model('Comment', CommentSchema)

module.exports = Comment;