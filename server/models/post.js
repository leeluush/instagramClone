const mongoose = require ('mongoose');
const ObjectId = mongoose.ObjectId;

const PostSchema = new mongoose.Schema({
    author: {
        type: ObjectId, 
        required: true, 
        ref: 'User',
        index: true,
        },
        category: {
            type: ObjectId,
            required: true,
            ref: 'Category',
            index: true, 
        },
    title: { 
            type: String, 
            required: true },
    content: { 
        type: String, 
        required: true},

    thumbnail: {
        type: String,
         },
    coverImage: {
        type: String,
    },
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

const Post = mongoose.model('Post', PostSchema)

module.exports = Post;