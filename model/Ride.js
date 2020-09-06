const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    agency: {
        type: String
    },
    number: {
        type: Number,
        required: [true, 'Bus number is required']
    },
    user : {
        type: String,
        required: [true, 'Username is required']
    }
});

const Ride = mongoose.model('Ride', rideSchema);

module.exports = Ride;