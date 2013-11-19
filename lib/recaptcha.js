var q = require('q');
var http = require('http');

module.exports.verifyCaptcha = function(keys, ipAddress, challenge, response){
	var deferred = q.defer();
	http.get(
		"http://www.google.com/recaptcha/api/verify"
		+ "?privatekey=" + keys.recaptcha.privateKey
		+ "&remoteip=" + ipAddress
		+ "&challenge=" + challenge
		+ "&response=" + response,
		function(res) {
		var pageData = "";
		res.setEncoding('utf8');
		res.on('data', function (chunk) {
			pageData += chunk;
		});

		res.on('end', function(){
			if(pageData && pageData.indexOf('true') == 0)
			{
				console.log("Google approves of the captcha response");
				deferred.resolve(true);
			}
			else
			{
				deferred.reject("CAPTCHA_FAILED");
			}
		});

	}).on('error', function(e) {
		deferred.reject(e);
	});

	return deferred.promise;
};