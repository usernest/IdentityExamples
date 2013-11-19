module.exports = function(){
	var app		= require('./common-app.js')();

	app.get('/', function(req, res){
		res.render('index.html');
	});

	return app;
}();