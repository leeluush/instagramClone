const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
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
        Default: Date.now
    },
    birthDate: Date,
})



const User = mongoose.model('User', UserSchema)

module.exports = User;