const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');


var User = require(__dirname + '/model/User');
var Ride = require(__dirname + '/model/Ride');

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
    //is cookie available?
    if (req.cookies.cookie !== undefined) {
        res.sendFile(__dirname + '/views/home.html');
    } else {
        res.sendFile(__dirname + '/views/index.html');
    }
})

//GET request to dashboard
router.get('/dashboard', (req, res) => {
    //is cookie available?
    if (req.cookies.cookie !== undefined) {
        if (req.cookies.role == 'doc') {
            res.redirect('/doc');
        }
        else {
            res.sendFile(__dirname + '/views/dashboard.html')
        }
    } else {
        res.sendFile(__dirname + '/views/login.html');
    }
})

//GET request to doc
router.get('/doc', (req, res) => {
    //is cookie available?
    if (req.cookies.cookie !== undefined) {
        res.sendFile(__dirname + '/views/doc.html');
    } else {
        res.sendFile(__dirname + '/views/login.html');
    }
})

//GET request to rides
router.get('/myrides', (req, res) => {
    res.sendFile(__dirname + '/views/rides.html');
})

//GET request to login
router.get('/login', (req, res) => {
    res.sendFile(__dirname + '/views/login.html');
})

/**
 * User Login
 */
router.post('/login', (req, res) => {
    var username = req.body.username;
    var password = req.body.password;
    var apiKey = req.body.apiKey;
    // does this user exists?
    User.exists({ 'username': username, 'password': password, 'role': 'user' }, (err, result) => {
        if (err) {
            res.send(err);
        } else if (result == false) {
            //if not, check if doc exists
            User.exists({ 'username': username, 'password': password, 'role': 'doc' }, (err, result) => {
                if (err) {
                    res.send(err)
                }
                else if (result == false) {
                    res.send('try again');
                }
                //login as doc
                else if (result == true) {
                    //set cookies maxAge 1000*1 = 1 second
                    res.cookie('cookie', username, { maxAge: 1000 * 1 * 60 * 60, httpOnly: false });
                    res.cookie('apiKey', apiKey, { maxAge: 1000 * 1 * 60 * 60, httpOnly: false });
                    res.cookie('role', 'doc', { maxAge: 1000 * 1 * 60 * 60, httpOnly: false });
                    res.redirect('/doc');
                }
            })
        }
        //login as user
        else if (result == true) {
            //set cookies maxAge 1000*1 = 1 second
            res.cookie('cookie', username, { maxAge: 1000 * 1 * 60 * 60, httpOnly: false });
            res.cookie('apiKey', apiKey, { maxAge: 1000 * 1 * 60 * 60, httpOnly: false });
            res.cookie('role', 'user', { maxAge: 1000 * 1 * 60 * 60, httpOnly: false });
            res.redirect('/dashboard');
        }
    })

})

//GET request to register
router.get('/register', (req, res) => {
    res.sendFile(__dirname + '/views/register.html');
})

/**
 * Register new user
 */
router.post('/register', async (req, res) => {
    username = req.body.username;
    role = req.body.role;
    password1 = req.body.password1;
    password2 = req.body.password2;

    //do passwords match?
    if (password2 == password1) {
        // new user object with mongoose schema
        var newuser = new User();
        newuser.username = username;
        newuser.role = role;
        newuser.password = password1;

        //check if user already exists
        User.exists({ 'username': username }, (err, doc) => {
            if (err) {
                res.send(err);
            } else if (doc == true) {
                res.send('Username already exists')
            } else {
                //save new user to db
                newuser.save(function (err, savedUser) {
                    if (err) {
                        res.send(err.message);
                    } else {
                        res.redirect('/login');
                    }
                })
            }
        })
    } else {
        res.send('Password not equal');
    }
})

/**
 * user logout
 */
router.get('/logout', (req, res) => {
    //set cookie to 1 millisecond and the redirect
    res.cookie('cookie', '', { maxAge: 1, httpOnly: false });
    res.cookie('apiKey', '', { maxAge: 1, httpOnly: false });
    res.cookie('role', '', { maxAge: 1, httpOnly: false });
    res.sendFile(__dirname + '/views/index.html');
})


/**
 *add new ride to db
 */
router.post('/addride', (req, res) => {

    var username = req.cookies.cookie;

    busnumber = req.body.busnumber;
    location = req.body.location;
    date = req.body.date;
    name = req.body.name;

    //find user for objectId
    User.findOne({ username: username }, (err, resp) => {
        if (err) {
            console.log(err);
        }
        if (resp) {

            var userId = resp._id;

            //new ride with mongoose schema
            var newRide = new Ride();
            newRide.busnumber = busnumber;
            newRide.location = location;
            newRide.date = date;
            newRide.name = name;
            newRide.risk = "low";
            newRide.user = [userId];

            //save new ride to db
            newRide.save((err, savedRide) => {
                if (err) {
                    res.send(err);
                }
                if (savedRide) {
                    //save objectId from ride to the user
                    User.updateOne({ _id: userId }, { $push: { ride: savedRide._id } }, (err, resp) => {
                        if (err) {
                            console.log(err);
                        }
                        if (resp) {
                            console.log(resp);
                        }
                    })
                }
            })
        }
    })
})

/**
 * get all rides from specific user by username
 */
router.post('/getrides', (req, res) => {

    var username = req.body.username;

    User.findOne({ username: username }, async (err, resp) => {
        if (err) {
            console.log(err);
        }
        if (resp) {
            var data = [];
            for (let i = 0; i < resp.ride.length; i++) {
                var ride = await Ride.findOne({ _id: resp.ride[i] })
                    .exec()
                    .then((resp) => {
                        return resp;
                    })
                    .catch((err) => {
                        return "error occured";
                    })
                data.push(ride);
            }
            res.send(data);
        }
    })
})

/**
 * get all users with user role
 */
router.get('/getusers', (req, res) => {

    User.find({ role: "user" }, (err, resp) => {
        if (err) {
            res.send(err);
        }
        if (resp) {
            res.send(resp)
        }
    })
})

/**
 * get information about a ride by its objectId
 */
router.post('/getrideinfo', (req, res) => {

    var rideId = req.body.id;

    Ride.findOne({ _id: rideId }, (err, resp) => {
        if (err) {
            res.send(err);
        }
        if (resp) {
            res.send(resp)
        }
    })
})

/**
 * update risk of ride to high
 */
router.post('/updaterisk', (req, res) => {

    var busnumber = req.body.busnumber.toString();
    var date = req.body.date;
    date = date.split('T')[0];

    Ride.updateMany({ busnumber: busnumber, date: { "$regex": date } }, { risk: "high" }, (err, resp) => {
        if (err) {
            console.log(err);
            res.send(err);
        }
        if (resp) {
            console.log(resp);
            res.send(resp);
        }
    })
})

/**
 * get all rides
 */
router.get('/rides', (req, res) => {
    Ride.find({}, (err, resp) => {
        if (err) {
            res.send(err);
        }
        if (resp) {
            res.send(resp);
        }
    })
})

/**
 * set risk of rides depending on day and busnumber
 */
router.post('/setriskbydate', (req, res) => {

    var username = req.body.username;
    var from = new Date(req.body.from);
    var to = new Date(req.body.to);

    var dates = getDates(from, to);

    User.findOne({ username: username }, (err, resp) => {
        if (err) {
            return res.send(err);
        }
        if (resp) {
            var rideIds = resp.ride;
            for (let i = 0; i < rideIds.length; i++) {
                Ride.findOne({ _id: rideIds[i] }, (error, response) => {
                    if (error) {
                        return res.send(error)
                    }
                    if (response) {
                        var busnumber = response.busnumber
                        var date = response.date.split('T')[0];
                        if (dates.includes(date)) {
                            Ride.updateMany({ busnumber: busnumber, date: { "$regex": date } }, { risk: "high" }, (er, re) => {
                                if (er) {
                                    res.send(er);
                                }
                                if (re) {
                                    console.log(busnumber, date, re);
                                }
                            })
                        }
                    }
                })

            }
        }
    })
    res.redirect('/doc')
})

/**
 * (code from https://gist.github.com/miguelmota/7905510 (a bit modified))
 * @param {Date} startDate start
 * @param {Date} endDate end
 */
var getDates = function (startDate, endDate) {
    var dates = [],
        currentDate = startDate,
        addDays = function (days) {
            var date = new Date(this.valueOf());
            date.setDate(date.getDate() + days);
            return date;
        };
    while (currentDate <= endDate) {
        dates.push(currentDate.toISOString().split('T')[0]);
        currentDate = addDays.call(currentDate, 1);
    }
    //returns start, end and all dates inbetween
    return dates;
};

app.use("/", router);

app.listen(3000, () => {
    console.log('Listening on port 3000');
})