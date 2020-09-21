var User = require('../model/User');
var chai = require('chai')
var chaiHttp = require('chai-http');

chai.use(chaiHttp);


//Testcase um einen User anzulegen
describe('Creating User', () => {
  it('saves new a user with required info', (done) => {

    // erstellt den User testuser mit passwort und rolle in der DB
    var testuser = new User({ username: 'testuser', password: 'testuser', role: 'user' });

    //Überfrüfung ob der User gespeichert wurde
    testuser.save(done);
  });
});
