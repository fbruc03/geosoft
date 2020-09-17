var mongoose = require('mongoose');

mongoose.Promise = global.Promise;

//Öffnet eine Verbindung zu unserer Datenbank
before((done) => {
  mongoose.connect('mongodb://127.0.0.1/geosoft');
  mongoose.connection
    .once('open', () => { done(); })
    .on('error', (error) => {
      console.warn('Error', error);
    });
});

//Terminiert alle Einträge in der users Collection der Datenbank

beforeEach((done) => {
  mongoose.connection.collections.users.drop(() => {
    done();
  });
});