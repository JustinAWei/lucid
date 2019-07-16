var express = require('express');
var router = express.Router();
var sentiment = require('sentiment');
var mongoose = require('mongoose');
var bcrypt = require('bcrypt')
var cookieParser = require('cookie-parser')
var bodyParser = require('body-parser')

app = express();

app.use(cookieParser);
app.use(bodyParser);

// Connect to Mongoose
mongoose.connect('mongodb://localhost:27017/lucid', {
    useMongoClient: true
});
mongoose.Promise = global.Promise;

// models
var User = mongoose.model('User', {
    name: String,
    password: String,
    dreams: []
})

var Dream = mongoose.model('Dream', {
    date: {
        type: Date,
        default: Date.now
    },
    user: String,
    text: String,
    sentiment: Object
})

// POST /register
// Registers a user
router.post('/register/', (req, res, next) => {
    bcrypt.hash(req.body.password, 1, function(err, hash) {
        new_user = new User({
            name: req.body.name,
            password: hash,
            dreams: []
        });
        new_user.save();
        console.log('Registered');
        console.log(new_user);
        res.json({
            'user': req.body.name
        });
    });
})

// POST /login
router.post('/login/', (req, res, next) => {
    User.findOne({
        name: req.body.name
    }, function(err, user) {
        if (err) {
            return console.log(err);
        }
        bcrypt.compare(req.body.password, user.password, function(err, result) {
            if (result) {
                console.log(user.name, 'logged in');
                res.cookie('user', user.name)
            }
            res.json(result)
        });
    })
})

// POST /logout
router.get('/logout/', (req, res, next) => {
    res.clearCookie('user');
    res.redirect('/')
})


// POST /dream
// make a dream
router.post('/dream/', (req, res, next) => {
    let new_dream = new Dream({
        user: req.cookies.user,
        text: req.body.text,
        sentiment: sentiment(req.body.text)
    });
    new_dream.save(function(err, product) {
        console.log(product);
        User.findOne({
            name: new_dream.user
        }, function(err, user) {
            if (err) {
                return console.log(err);
            }
            console.log(user);
            user.dreams.push(product['_id']);
            user.save(function(err, updatedUser) {})
        })

        res.json(product)
        console.log(product);
    })
})

// GET /dreams
// get all dreams
router.get('/dreams/', (req, res, next) => {
    Dream.find({
        user: req.cookies.user
    }, function(err, dreams) {
        console.log(dreams);
        res.json(dreams)
    })
})

module.exports = router;
