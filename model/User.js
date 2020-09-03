const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: [true, 'Username already taken'],
        minlength: [6, 'Username needs to be at least 6 characters long'],
        maxlength: [12, 'Username cant have more than 12 characters']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password needs to be at least 6 characters long'],
        maxlength: [12, 'Password cant have more than 12 characters']
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;