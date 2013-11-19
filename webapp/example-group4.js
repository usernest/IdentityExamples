module.exports = function(){
	var app				= require('./common-app.js')(),
		keysLib			= require('../lib/keys-lib.js'),
		express 		= require('express'),
		passport 		= require('passport'),
		util 			= require('util'),
		GitHubStrategy  = require('passport-github').Strategy;

	var keys = keysLib.getKeys();

	app.use(express.session({ secret: 'keyboard cat' }));
	app.use(passport.initialize());
	app.use(passport.session());

	app.get('/example-4.1.html', function(req, res){
		var bag = {
			keys : keys
		}
		res.render('group4/example-4.1.html', bag);
	});


	// The example code for Passport-Github come from the
	// the respective project

	passport.serializeUser(function(user, done) {
		done(null, user);
	});

	passport.deserializeUser(function(obj, done) {
		done(null, obj);
	});

	passport.use(new GitHubStrategy({
			clientID: keys.github.clientId,
			clientSecret: keys.github.clientSecret,
			callbackURL: "http://localhost:3000/auth/github/callback"
		},
		function(accessToken, refreshToken, profile, done) {
			// asynchronous verification, for effect...
			process.nextTick(function() {

				// To keep the example simple, the user's GitHub profile is returned to
				// represent the logged-in user. In a typical application, you would want
				// to associate the GitHub account with a user record in your database,
				// and return that user instead.
				//console.log("Got profile: ");
				//console.log(profile);
				return done(null, profile);
			});
		}
	));

	app.get('/example-4.2.html',
		function(req, res){
		var bag = {
			user : req.user,
			error : null,
			keys : keys
		};
		res.render('group4/example-4.2.html', bag);
	});

	app.get('/example-4.2.html/logout.html', function(req, res){
		req.logout();
		res.redirect('/');
	});

	app.get('/auth/github',
		passport.authenticate('github'),
		function(req, res) {
			// The request will be redirected to GitHub for authentication, so this
			// function will not be called.
		});

	app.get('/auth/github/callback',
		passport.authenticate('github', {
			failureRedirect: '/example-4.2.html'
		}),
		function(req, res) {
			res.redirect('/example-4.2.html');
		});

	function ensureAuthenticated(req, res, next) {
		if (req.isAuthenticated()) { return next(); }
		res.redirect('/login')
	}

	return app;
}();