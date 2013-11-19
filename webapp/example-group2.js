// for the throttling examples in 2.4 and 2.5
var lastRequest = null;
var badCount = 0;
var THROTTLE_TRIGGER = 3;
var THROTTLE_COOLOFF_SECS = 5;

module.exports = function(){
	var app				= require('./common-app.js')(),
		express			= require('express'),
		moment 			= require('moment'),
		check			= require('validator').check,
		keysLib			= require('../lib/keys-lib.js'),
		authLib			= require('../lib/auth-lib.js'),
		recaptchaLib	= require('../lib/recaptcha.js'),
		memoryHashed	= require('../lib/memory-hashed.js');

	var keys = keysLib.getKeys();

	app.get('/example-2.1.html', function(req, res){
		var bag = {
			error: null
		};

		res.render('group2/example-2.1.html', bag);
	});

	app.post('/example-2.1.html', function(req, res){
		var bag = {
			error: null
		};

		// In this demo, there is no SSL, the request will always fail
		// But this is how you check that the request was made
		// 
		// If you are running behind a reverse proxy like nginx,
		// you would then need to check headers set by the proxy
		if(!req.connection.encrypted || req.get('x-forwarded-proto') || req.get('X-Forwarded-Proto'))
		{
			bag.error = "Must submit using SSL";
			res.render('group2/example-2.1.html', bag);
			// alternatively, you could redirect using an absolute URL
			// res.redirect(302, "https://127.0.0.1/example-2.1.html")
		}
		else
		{
			res.render('group2/example-2.1.html', bag);	
		}
	});

	// in production you very like would add CSRF protection to all forms
	// app.use(express.cookieSession( {secret: 'UserNest'}) );
	// app.use(express.csrf() );

	app.get('/example-2.2.html',
		express.cookieSession( {secret: 'UserNest'}),
		express.csrf(),
		function(req, res){
		var bag = {
			error: null
		};

		bag.csrf = req.csrfToken();

		res.render('group2/example-2.2.html', bag);
	});

	app.post('/example-2.2.html',
		express.cookieSession( {secret: 'UserNest'}),
		express.csrf(),
		function(req, res){
			var bag = {
				error: null
			};

			authLib.checkLogin(req, memoryHashed.authenticate, true, function(err, result){
				if(err)
				{
					bag.error = err;
					res.render('group2/example-2.2.html', bag);
				}
				else
				{
					bag.user = result;
					res.render('group2/example-group2-success.html', bag);
				}
			});
		}
	);

	app.get('/example-2.3.html',
		function(req, res){
		var bag = {
			error: null
		};

		res.render('group2/example-2.3.html', bag);
	});

	app.post('/example-2.3.html',
		function(req, res){
			var bag = {
				error: null
			};

			authLib.checkLogin(req, memoryHashed.authenticate, true, function(err, result){
				if(err)
				{
					bag.error = err;
					res.render('group2/example-2.3.html', bag);
				}
				else
				{
					bag.user = result;
					res.render('group2/example-group2-success.html', bag);
				}
			});
		}
	);

	app.get('/example-2.4.html',
		function(req, res){
		var bag = {
			error: null
		};

		res.render('group2/example-2.4.html', bag);
	});

	app.post('/example-2.4.html',
		function(req, res){
			var bag = {
				error: null,
			};

			if(!lastRequest)
				lastRequest = moment();
			if(lastRequest.isBefore(moment().subtract({seconds : THROTTLE_COOLOFF_SECS})))
				badCount = 0;
			lastRequest = moment();

			if(badCount >= THROTTLE_TRIGGER)
			{
				res.render('group2/example-group2-lockout.html', bag);
			}
			else
			{
				authLib.checkLogin(req, memoryHashed.authenticate, true, function(err, result){
					if(err)
					{
						badCount++;
						bag.error = err;
						res.render('group2/example-2.4.html', bag);
					}
					else
					{
						bag.user = result;
						res.render('group2/example-group2-success.html', bag);
					}
				});
			}
		}
	);

	app.get('/example-2.5.html',
		function(req, res){
		var bag = {
			error: null,
			showCaptcha : badCount > THROTTLE_TRIGGER,
			keys : keys
		};

		res.render('group2/example-2.5.html', bag);
	});

	app.post('/example-2.5.html',
		function(req, res){
			var bag = {
				error: null,
				showCaptcha : false,
				keys : keys
			};

			if(!lastRequest)
				lastRequest = moment();
			if(lastRequest.isBefore(moment().subtract({seconds : THROTTLE_COOLOFF_SECS})))
				badCount = 0;
			lastRequest = moment();

			if(badCount >= THROTTLE_TRIGGER || req.body.recaptcha_challenge_field)
			{
				// check the capcha.  If matches, attempt to authenticate.  Otherwise show the lockout page
				recaptchaLib.verifyCaptcha(keys, req.ip, req.body.recaptcha_challenge_field, req.body.recaptcha_response_field).then(function(result){
					authLib.checkLogin(req, memoryHashed.authenticate, true, function(err, result){
						if(err)
						{
							badCount++;
							bag.error = err;
							bag.showCaptcha = badCount >= THROTTLE_TRIGGER;
							res.render('group2/example-2.5.html', bag);
						}
						else
						{
							bag.user = result;
							res.render('group2/example-group2-success.html', bag);
						}
					});
				}).catch(function(err){
					badCount++;
					bag.error = err;
					bag.showCaptcha = badCount >= THROTTLE_TRIGGER;
					res.render('group2/example-2.5.html', bag);
				})
			}
			else
			{
				authLib.checkLogin(req, memoryHashed.authenticate, true, function(err, result){
					if(err)
					{
						badCount++;
						bag.error = err;
						bag.showCaptcha = badCount >= THROTTLE_TRIGGER;
						res.render('group2/example-2.5.html', bag);
					}
					else
					{
						bag.user = result;
						res.render('group2/example-group2-success.html', bag);
					}
				});
			}
		}
	);

	app.get('/example-2.6.html',
		function(req, res){
		var bag = {
			email: null,
			checks: null
		};

		res.render('group2/example-2.6.html', bag);
	});

// http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
var SIMPLE_REGEX = /\S+@\S+\.\S+/;
// http://stackoverflow.com/questions/46155/validate-email-address-in-javascript
var SO_REGEX = /(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
// http://www.regular-expressions.info/email.html
var RFC2822_REGEX = /(?:[a-z0-9!#$%&'*+\/=?^_{|}~-]+(?:.[a-z0-9!#$%&'*+\/=?^_{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/;
var RFC2822_DOMAIN_FILTER = /[a-z0-9!#$%&'*+\/=?^_{|}~-]+(?:.[a-z0-9!#$%&'*+\/=?^_{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+(?:[A-Z]{2}|com|org|net|gov|mil|biz|info|mobi|name|aero|jobs|museum)\b/;
var DEVISE_REGEX = /\A[^@]+@([^@\.]+\.)+[^@\.]+\z/;
	app.post('/example-2.6.html',
		function(req, res){
			var bag = {
				email: req.body.username
			};

			var checks = [];
			if(SIMPLE_REGEX.test(req.body.username)){
				checks.push({
					name: "Simple Regex",
					passed: true
				});
			}
			else
			{
				checks.push({
					name: "Simple Regex",
					passed: false
				});
			}

			try
			{
				check(req.body.username).isEmail();
				checks.push({
					name: "node-validator",
					passed: true
				});
			}catch(e){
				checks.push({
					name: "node-validator",
					passed: false
				});
			}

			if(SO_REGEX.test(req.body.username)){
				checks.push({
					name: "Top Stack Overflow Regex",
					passed: true
				});
			}
			else
			{
				checks.push({
					name: "Top Stack Overflow Regex",
					passed: false
				});
			}

			if(RFC2822_REGEX.test(req.body.username)){
				checks.push({
					name: "RFC2822 Regex",
					passed: true
				});
			}
			else
			{
				checks.push({
					name: "RFC2822 Regex",
					passed: false
				});
			}

			if(RFC2822_DOMAIN_FILTER.test(req.body.username)){
				checks.push({
					name: "RFC2822 Regex with domain filter",
					passed: true
				});
			}
			else
			{
				checks.push({
					name: "RFC2822 Regex with domain filter",
					passed: false
				});
			}

			if(DEVISE_REGEX.test(req.body.username)){
				checks.push({
					name: "Rails Devise regex",
					passed: true
				});
			}
			else
			{
				checks.push({
					name: "Rails Devise regex",
					passed: false
				});
			}

			bag.checks = checks;
			res.render('group2/example-2.6.html', bag);	
		}
	);

	return app;
}();