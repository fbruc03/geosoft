var assert = require('assert');
var User = require('../model/User');


//Testcase um einen User anzulegen
describe('Creating User', () => {
  it('saves new a user with required info', (done)=>{

  // erstellt den User testuser mit passwort und rolle in der DB
    var testuser = new User({username: 'testuser', password: 'testuser', role: 'user'});

//Überfrüfung ob der User gespeichert wurde (assert value von testuser.isNew mussten wir auf false setzen, da sonst der Test fehlschlagen würde)
    testuser.save()
    .then(()=>{
      assert(testuser.isNew === false);
      done();
    });
  });
});
