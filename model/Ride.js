const mongoose = require('mongoose');

const rideSchema = new mongoose.Schema({
    location: {
        type: [Number, Number]
    },
    busnumber: {
        type: String
    },
    date: {
        type: String
    },
    name: {
        type: String
    },
    user: {
        type: [mongoose.ObjectId]
    },
    risk: {
        type: String,
        enum: ["low", "high"]
    }
});

const Ride = mongoose.model('Ride', rideSchema);

module.exports = Ride;