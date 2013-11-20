module.exports = function(){
	var app				= require('./common-app.js')(),
		authLib 		= require('../lib/auth-lib.js'),
		memoryPlain		= require('../lib/memory-plain-text.js'),
		memoryHashed	= require('../lib/memory-hashed.js'),
		memoryBcrypt	= require('../lib/memory-bcrypt.js');

	app.get('/example-1.1.html', function(req, res){
		var bag = {
			error: null,
			group : "group1",
			basedir : app.basedir
		};
		res.render('group1/example-1.1.html', bag);
	});

	app.get('/example-1.2.html', function(req, res){
		var bag = {
			error: null,
			group : "group1",
			basedir : app.basedir
		};
		res.render('group1/example-1.2.html', bag);
	});

	app.post('/example-1.2.html', function(req, res){
		var bag = {
			error: null,
			group : "group1",
			basedir : app.basedir
		};
	
		authLib.checkLogin(req, memoryPlain.authenticate, false, function(err, result){
			if(err)
			{
				bag.error = err;
				res.render('group1/example-1.2.html', bag);
			}
			else
			{
				bag.user = result;
				res.render('group1/example-group1-success.html', bag);
			}
		});
	});

	app.get('/example-1.3.html', function(req, res){
		var bag = {
			error: null,
			group : "group1",
			basedir : app.basedir
		};
		res.render('group1/example-1.3.html', bag);
	});

	app.post('/example-1.3.html', function(req, res){
		var bag = {
			error: null,
			group : "group1",
			basedir : app.basedir
		};
	
		authLib.checkLogin(req, memoryHashed.authenticate, false, function(err, result){
			if(err)
			{
				bag.error = err;
				res.render('group1/example-1.3.html', bag);
			}
			else
			{
				bag.user = result;
				res.render('group1/example-group1-success.html', bag);
			}
		});
	});

	app.get('/example-1.4.html', function(req, res){
		var bag = {
			error: null,
			group : "group1",
			basedir : app.basedir
		};
		res.render('group1/example-1.4.html', bag);
	});

	app.post('/example-1.4.html', function(req, res){
		var bag = {
			error: null,
			group : "group1",
			basedir : app.basedir
		};
	
		authLib.checkLogin(req, memoryBcrypt.authenticate, false, function(err, result){
			if(err)
			{
				bag.error = err;
				res.render('group1/example-1.4.html', bag);
			}
			else
			{
				bag.user = result;
				res.render('group1/example-group1-success.html', bag);
			}
		});
	});

	app.get('/example-1.5.html', function(req, res){
		var bag = {
			error: null,
			group : "group1",
			basedir : app.basedir
		};
		res.render('group1/example-1.5.html', bag);
	});

	app.post('/example-1.5.html', function(req, res){
		var bag = {
			error: null,
			group : "group1",
			basedir : app.basedir
		};
	
		authLib.checkLogin(req, memoryBcrypt.authenticate, true, function(err, result){
			if(err)
			{
				bag.error = err;
				res.render('group1/example-1.5.html', bag);
			}
			else
			{
				bag.user = result;
				res.render('group1/example-group1-success.html', bag);
			}
		});
	});

	return app;
}();