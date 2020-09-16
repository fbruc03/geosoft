var assert = require('assert');
var User = require('../model/User.js');

describe('Creating entries in Users', () => {
    it('creates a user', (done) => {
        var testuser = User({username: 'testuser', password: 'testuser', role:'user'});

        testuser.save()
        .then(() => {
            assert(testuser.IsNew);
            done();
        });
    });
});