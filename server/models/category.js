const mongoose = require ('mongoose');
const Todo = require('./todo');
const ObjectId = mongoose.ObjectId;

const CategorySchema = new mongoose.Schema({
    title: {
        type: String,
            require: true,
        },
    path: {
        type:String,
        index: true,
        unique: true,

},
    coverImage: String,
    description: String,
    color: {
        type: String,
        enum: ['purple','yellow', 'blue', 'hot-pink', 'green']
    }, 
    created: {
        type:Date,
        default: Date.now
    },

})


 

const Category = mongoose.model('Category', CategorySchema)

module.exports = Category; 