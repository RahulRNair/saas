/*****************************************************
 * Node Js RestApi For trigger Launch Instances in EC2
 * @Date : 24-OCT-2017
 * @name : Rahul
 * @path : 
 ******************************************************/

/***************** call the packages we need***********/
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8080; // set our port

// User Modal
//var User     = require('./app/models/user');

/*********** ROUTES FOR OUR API **************/
/*
 * POST - For create new request
 * PUT - Update request
 * DELETE - Delete request
 * GET - Get request
 */
// create our router
var router = express.Router();
// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next();
});

// test route to make sure everything is working (accessed at GET http://localhost:8080/api)
router.get('/', function(req, res) {
    res.json({ message: 'hooray! welcome to our api!' });
});

// on routes that end in /bears
// ----------------------------------------------------
router.route('/users')

    // create a user (accessed at POST http://localhost:8080/api/users)
    .post(function(req, res) {

        res.json({ message: 'User created!' });

    })

    // get all the users (accessed at GET http://localhost:8080/api/users)
    .get(function(req, res) {
        res.json({ message: 'Fetched User Details' });
    });




// REGISTER OUR ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

