var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

before((done) => {
    mongoose.connect('mongodb://127.0.0.1/geosoft');
    mongoose.connection
    .once('open',()=>{ done();})
    .on ('error', (error) => {
        console.warn("Error", error);
    });
});

beforeEach((done) => {
    mongoose.connection.connections.User.drop(() => {
    done();})
});