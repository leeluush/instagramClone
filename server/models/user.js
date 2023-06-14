const mongoose = require('mongoose');
const { hashPassword, matchPassword } = require('../middleware/passwordMiddleware');


const UserSchema = new mongoose.Schema({
    userName: {
        type: String,
        required: true,
        unique: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },

    profileImage: {
        type: String,
        required: false
    },
    email: {
        type: String,
        required: true,
        unique: true,
        validate: {
            validator: (value = ' ') => {
                /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(value);
            },
            message: 'Invaild email format',
        },
    },
    password: String,
    created: {
        type: Date,
        default: Date.now
    },
    birthDate: Date,
    followings: {
        type: Number,
        default: () => 0 
    
    },
    followers: {
        type: Number,
        default: () => 0 
    
    },
});


UserSchema.pre('save', hashPassword);
UserSchema.methods.matchPassword = matchPassword;

const User = mongoose.model('User', UserSchema)

module.exports = User;