module.exports = function(){
	var express = require('express');
	var app	= express();

	app.engine('html', require('ejs').renderFile);
	app.set('view engine', 'ejs');
	app.set('views', __dirname + '/../views');

	return app;
};