module.exports = function(){
	var app				= require('./common-app.js')(),
		express			= require('express'),
		moment 			= require('moment'),
		authLib			= require('../lib/auth-lib.js'),
		memoryHashed	= require('../lib/memory-hashed.js');

	app.get('/example-3.1.html', function(req, res){
		var bag = {
			error: null,
			group : "group3",
			basedir : app.basedir
		};
		res.render('group3/example-3.1.html', bag);
	});

	app.get('/example-3.2.html', function(req, res){
		var bag = {
			error: null,
			group : "group3",
			basedir : app.basedir
		};
		res.render('group3/example-3.2.html', bag);
	});

	app.get('/example-3.3.html', function(req, res){
		var bag = {
			error: null,
			group : "group3",
			basedir : app.basedir
		};
		res.render('group3/example-3.3.html', bag);
	});

	app.get('/example-3.4.html', function(req, res){
		var bag = {
			error: null,
			group : "group3",
			basedir : app.basedir
		};
		res.render('group3/example-3.4.html', bag);
	});

	app.post('/example-3.4.html', function(req, res){
		authLib.checkLogin(req, memoryHashed.authenticate, true, function(err, result){
			if(err)
			{
				res.send(400, err);
			}
			else
			{
				res.send(200, result);
			}
		});
	});

	app.get('/example-3.5.html', function(req, res){
		var bag = {
			error: null,
			group : "group3",
			basedir : app.basedir
		};
		res.render('group3/example-3.5.html', bag);
	});

	app.post('/example-3.5.html', function(req, res){
		authLib.checkLogin(req, memoryHashed.authenticate, true, function(err, result){
			if(err)
			{
				res.send(400, err);
			}
			else
			{
				res.send(200, result);
			}
		});
	});

	return app;
}();