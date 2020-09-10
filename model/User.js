const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: [true, 'Username already taken'],
        minlength: [6, 'Username needs to be at least 6 characters long'],
        maxlength: [64, 'Username cant have more than 12 characters']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password needs to be at least 6 characters long'],
        maxlength: [64, 'Password cant have more than 12 characters']
    },
    role: {
        type: String,
        required: [true, 'Please set your role'],
        enum: ['user','doc']
    },
    danger: {
        type: String,
        enum: ['low', 'medium', 'high']
    },
    takenBusses: {
        type: [{busnumber: String, location: [Number, Number], date: String}]
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;