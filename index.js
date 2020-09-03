const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

var User = require(__dirname + '/model/User');

var router = express.Router();

var app = express();

//Middleware
app.use(cookieParser());

// parse
app.use(bodyParser.json())      // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/leaflet', express.static(__dirname + '/node_modules/leaflet/dist/'));
app.use('/css', express.static(__dirname + '/css/'));
app.use('/script', express.static(__dirname + '/script/'));

mongoose.connect('mongodb://localhost/geosoft', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('connected to database');
});

//GET request to /
router.get('/', (req, res) => {
    res.sendFile(__dirname + '/views/index.html');
})

//GET request to dashboard
router.get('/dashboard', (req, res) => {
    if(req.cookies['cookie'] == 'geosoft') {
        res.sendFile(__dirname + '/views/dashboard.html');
    } else {
        res.sendFile(__dirname + '/views/login.html');
    }
})

//GET request to login
router.get('/login', (req, res) => {
    res.sendFile(__dirname + '/views/login.html');
})

//POST request to login
router.post('/login', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    // Eingabe richtig?
    User.exists({ 'username': username, 'password': password }, (err, result) => {
        if (err) {
            res.send(err);
            //Wenn nein -> Fehlermeldung
        } else if (result == false) {
            res.send('try again');
        }
        //Wenn ja -> User einloggen
        else if (result == true) {
            //Cookie setzen maxAge 1000*1 = 1 Sekunde
            res.cookie('cookie', 'geosoft', {maxAge: 1000 * 1 * 60 * 5, httpOnly: false});
            res.sendFile(__dirname + '/views/dashboard.html')
        }
    })
})

//GET request to register
router.get('/register', (req, res) => {
    res.sendFile(__dirname + '/views/register.html');
})

//POST request to register
router.post('/register', async (req, res) => {
    username = req.body.username;
    password1 = req.body.password1;
    password2 = req.body.password2;

    if(password2 == password1) {
        var newuser = new User();
        newuser.username = username;
        newuser.password = password1;

        newuser.save(function(err, savedUser) {
            if(err) {
                res.send(err.message);
            } else {
                res.send('User added');
            }
        })
    } else {
        res.send('Passwords neew to be the same');
    }
})

router.get('/logout', (req, res) => {
    //Cookie auf eine Millisekunde, dann weiterleiten
    res.cookie('cookie', 'geosoft', {maxAge: 1, httpOnly: false});
    res.sendFile(__dirname + '/views/index.html');
})

app.use("/", router);

app.listen(3000, () => {
    console.log('Listening on port 3000');
})