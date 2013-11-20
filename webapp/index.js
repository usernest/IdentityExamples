module.exports = function(){
	var app		= require('./common-app.js')();

	app.get('/', function(req, res){
		var bag = {
			error: null,
			group : "",
			basedir : app.basedir
		};
		res.render('index.html', bag);
	});

	app.get('/index', function(req, res){
		var bag = {
			error: null,
			group : "",
			basedir : app.basedir
		};
		res.render('index.html', bag);
	});

	return app;
}();