const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
var Tabulator = require('tabulator-tables');


var User = require(__dirname + '/model/User');

var router = express.Router();

var app = express();

//Middleware
app.use(cookieParser());
app.use(bodyParser.json())      // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}));

app.use('/bootstrap', express.static(__dirname + '/node_modules/bootstrap/dist/'));
app.use('/jquery', express.static(__dirname + '/node_modules/jquery/dist/'));
app.use('/leaflet', express.static(__dirname + '/node_modules/leaflet/dist/'));
app.use('/tabulator-tables', express.static(__dirname + '/node_modules/tabulator-tables/dist/'));
app.use('/css', express.static(__dirname + '/css/'));
app.use('/script', express.static(__dirname + '/script/'));
app.use('/images', express.static(__dirname + '/images/'));

// DB connection
mongoose.connect('mongodb://127.0.0.1/geosoft', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
});
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log('connected to database');
});

//GET request to /
router.get('/', (req, res) => {
    //ist cookie vorhanden?
    if (req.cookies.cookie !== undefined) {
        res.sendFile(__dirname + '/views/home.html');
    } else {
        res.sendFile(__dirname + '/views/index.html');
    }
})

//GET request to dashboard
router.get('/dashboard', (req, res) => {
    //ist cookie vorhanden?
    if (req.cookies.cookie !== undefined) {
        res.sendFile(__dirname + '/views/dashboard.html');
    } else {
        res.sendFile(__dirname + '/views/login.html');
    }
})

//GET request to login
router.get('/login', (req, res) => {
    res.sendFile(__dirname + '/views/login.html');
})

/**
 * @function login
 * @desc login user and set cookies
 * @returns void
 */
router.post('/login', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var apiKey = req.body.apiKey;
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
            res.cookie('cookie', username, { maxAge: 1000 * 1 * 60 * 60, httpOnly: false });
            res.cookie('apiKey', apiKey, { maxAge: 1000 * 1 * 60 * 60, httpOnly: false });
            res.sendFile(__dirname + '/views/dashboard.html')
        }
    })
})

//GET request to register
router.get('/register', (req, res) => {
    res.sendFile(__dirname + '/views/register.html');
})

/**
 * @function register
 * @desc register new user
 * @returns void
 */
router.post('/register', async (req, res) => {
    username = req.body.username;
    role = req.body.role;
    password1 = req.body.password1;
    password2 = req.body.password2;

    //Stimmen passwörter überein?
    if (password2 == password1) {
        // neues user objekt mit userSchema erzeugen
        var newuser = new User();
        newuser.username = username;
        newuser.role = role;
        newuser.password = password1;
        newuser.danger = 'low';

        User.exists({ 'username': username }, (err, doc) => {
            if (err) {
                res.send(err);
            } else if (doc == true) { // username existiert bereits
                res.send('Username already exists')
            } else { // username noch nicht vergeben -> neuen user erstellen
                newuser.save(function (err, savedUser) {
                    if (err) {
                        res.send(err.message);
                    } else {
                        res.sendFile(__dirname + '/views/login.html');
                    }
                })
            }
        })
    } else {
        res.send('Password not equal');
    }
})

/**
 * @function logout
 * @desc log out the user / delete cookies
 * @returns void
 */
router.get('/logout', (req, res) => {
    //Cookie auf eine Millisekunde, dann weiterleiten
    res.cookie('cookie', '', { maxAge: 1, httpOnly: false });
    res.cookie('apiKey', '', { maxAge: 1, httpOnly: false });
    res.sendFile(__dirname + '/views/index.html');
})


/**
 * @function addride
 * @desc add Bus ride to specific user
 * @returns void
 */
router.post('/addride', (req, res) => {

    username = req.cookies.cookie;
    busnumber = req.body.busnumber;
    location = [req.body.location.lat, req.body.location.lng];
    date = req.body.date;

    var takenBus = {
        "busnumber": busnumber,
        "location": location,
        "date": date
    }

    //Add the takenBus ride to the user
    User.findOneAndUpdate(
        { username: username },
        { $push: { takenBusses: takenBus } },
        function (error, success) {
            if (error) {
                console.log(error);
                res.send(error)
            } else {
                console.log(success);
                res.sendFile(__dirname + '/views/dashboard.html')
            }
        });
})

app.use("/", router);

app.listen(3000, () => {
    console.log('Listening on port 3000');
})