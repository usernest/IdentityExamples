var express 		= require('express'),
	app 			= express();


app.use(express.cookieParser());
app.use(express.bodyParser());
app.use('/', require('./webapp/index.js'));
app.use('/', require('./webapp/example-group1.js'));
app.use('/', require('./webapp/example-group2.js'));
app.use('/', require('./webapp/example-group3.js'));
app.use('/', require('./webapp/example-group4.js'));
app.use('/', express.static(__dirname + '/static'));

console.log('========================================');
console.log('');
console.log('');
console.log('');
console.log('Identity Examples running at http://127.0.0.1:3000');
console.log('Designed to accompany the "Safely Identifying the Human Using Your App" talk');
console.log('At the Environments for Humans: JavaScript Summit 2013');
console.log('by Joe Schulman, CTO of UserNest');
console.log('Examples Copyright 2013. Available under MIT License');
console.log('');
console.log('');
console.log('');
console.log('========================================');
app.listen(3000);