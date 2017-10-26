/*****************************************************
 * Node Js RestApi For SaaS Application
 * @Date : 24-OCT-2017
 * @name : Rahul
 * @path : Todo: mention git path
 ******************************************************/


/******************************************************
 *  Try to follow the Rules
 * 1.All request Should be validated and sanitized
 * 2.use rest api concept for each call(POST,PUT,GET,DELETE)
 * 3.Add Proper Comments
 * 4.use proper naming convention
 /******************************************************/

/***************** call the packages we need***********/
var express    = require('express');
var bodyParser = require('body-parser');
var app        = express();
var morgan     = require('morgan');
var Joi        = require('joi');
var pgp        = require('pg-promise')(/*options*/);


/***************** Database Configuration ***********/
var config = {
    user: 'postgres', 
    database: 'postgres', 
    password:'admin', 
    host:'localhost', 
    port: 5432, 
    max: 100, 
    idleTimeoutMillis: 30000, 
};

var db = pgp(config);

// configure app
app.use(morgan('dev')); // log requests to the console

// configure body parser
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port     = process.env.PORT || 8081; // set our port



/*********** ROUTES FOR OUR API **************/
var router = express.Router();
// middleware to use for all requests
router.use(function(req, res, next) {
    // do logging
    console.log('Something is happening.');
    next();
});

router.get('/', function(req, res) {
    res.json({ message: 'welcome' });
});

// Use the Joi object to create a few schemas for your routes. 
const getCustomersSchema = Joi.object({
  name: Joi.string().min(2).required()
});
const getpreferencesSchema = Joi.object({
  customerid: Joi.number().integer().positive().required(),
  infrastructuresize: Joi.string().min(2).required(),
  industrytype: Joi.string().min(2).required(),
  complianceframework: Joi.string().min(2).required(),
  infastructuretype: Joi.string().min(2).required(),
  noofdailyassesments: Joi.number().integer().positive().required()
});
const getcontactSchema = Joi.object({
  customerid: Joi.number().integer().positive().required(),
  name: Joi.string().min(2).required(),
  addr1: Joi.string().min(2).required(),
  addr2: Joi.string().min(2).required(),
  city: Joi.string().min(2).required(),
  state: Joi.string().min(2).required(),
  zip: Joi.string().min(2).required(),
  phone: Joi.string().min(2).required(),
  email: Joi.string().min(2).required()
});
// on routes that end in /bears
// ----------------------------------------------------
router.route('/customer')

    .post(function(req, res) {
    	// validates and returns the user object on success
		const ret = Joi.validate(req.body, getCustomersSchema, {
		// return an error if body has an unrecognised property
		allowUnknown: false,
		// return all errors a payload contains, not just the first one Joi finds
		//abortEarly: false
		});
		if (ret.error) {
			res.status(400).json({
			          status: 'error',
			          message: ret.error.details[0].message
			        });;
		}
		else
		{
	        db.none('insert into customer(companyname)' +
			      'values(${name})',
			    req.body)
			    .then(function () {
			      res.status(200)
			        .json({
			          status: 'success',
			          message: 'User Inserted Successfully!'
			        });
			    })
			    .catch(function (err) {
			      console.log(err);
			      return err;
			    });
		}

    })
    .get(function(req, res) {
  //   	var secret = Tokens.secretSync()
		// var token = Tokens.create(secret)
        res.render('send', { csrfToken: req.csrfToken() })
    });


router.route('/customer/:userID')
 
 .get(function(req, res) {
        var id = parseInt(req.params.userID);
        db.one('select * from customer where id = $1', id)
	    .then(function (data) {
	      res.status(200)
	        .json({
	          status: 'success',
	          data: data,
	          message: 'Userdetails Fetched'
	        });
	    })
	    .catch(function (err) {
	      //return next(err);
	    });
    });

 router.route('/preference')

 .post(function(req, res) {
 		const ret = Joi.validate(req.body, getpreferencesSchema, {
		// return an error if body has an unrecognised property
		allowUnknown: false,
		// return all errors a payload contains, not just the first one Joi finds
		//abortEarly: false
		});
		if (ret.error) {
			res.status(400).json({
			          status: 'error',
			          message: ret.error.details[0].message
			        });;
		}
		else
		{
	        db.none('insert into preferences(customerid,infrastructuresize,industrytype,complianceframework,infastructuretype,noofdailyassesments)' +
			      'values(${customerid},${infrastructuresize},${industrytype},${complianceframework},${infastructuretype},${noofdailyassesments})',
			    req.body)
			    .then(function () {
			      res.status(200)
			        .json({
			          status: 'success',
			          message: 'preferences Created Successfully!'
			        });
			    })
			    .catch(function (err) {
			    	console.log(err);
			      res.status(500)
			        .json({
			          status: 'failed',
			          message: 'Internal Server Error'
			        });
			});
		}
    });

  router.route('/contact')

 .post(function(req, res) {
 		const ret = Joi.validate(req.body, getcontactSchema, {
		// return an error if body has an unrecognised property
		allowUnknown: false,
		// return all errors a payload contains, not just the first one Joi finds
		//abortEarly: false
		});
		if (ret.error) {
			res.status(400).json({
			          status: 'error',
			          message: ret.error.details[0].message
			        });;
		}
		else
		{
	        db.none('insert into contact(customerid,name,addr1,addr2,city,state,zip,phone,email)' +
			      'values(${customerid},${name},${addr1},${addr2},${city},${state},${zip},${phone},${email})',
			    req.body)
			    .then(function () {
			      res.status(200)
			        .json({
			          status: 'success',
			          message: 'Contact Created Successfully!'
			        });
			    })
			    .catch(function (err) {
			    	console.log(err);
			      res.status(500)
			        .json({
			          status: 'failed',
			          message: 'Internal Server Error'
			        });
			});
		}
    });

 router.route('/launchInstance')
         .get(function(req, res) {
        var id = parseInt(req.params.userID);
       const exec = require('child_process').exec;
                var yourscript = exec('sh script.sh',
        (error, stdout, stderr) => {
            console.log(`${stdout}`);
            console.log(`${stderr}`);
            if (error !== null) {
                console.log(`exec error: ${error}`);
                res.status(200)
                                .json({
                                  status: 'success',
                                  message: error
                                });
            }
            else
            {
                res.status(200)
                                .json({
                                  status: 'success',
                                  message: 'Launch Instance Triggered'
                                });
            }
        });


    });

// REGISTER ROUTES -------------------------------
app.use('/api', router);

// START THE SERVER
// =============================================================================
app.listen(port);
console.log('Magic happens on port ' + port);

