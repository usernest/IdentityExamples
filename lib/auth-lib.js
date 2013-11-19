module.exports.LOGIN_OK = "LOGIN_OK";
module.exports.BAD_USERNAME = "BAD_USERNAME";
module.exports.BAD_PASSWORD = "BAD_PASSWORD";

module.exports.BadUsername = function(){
	return {
		code: module.exports.BAD_USERNAME,
		user: null
	};
}

module.exports.BadPassword = function(username){
	return {
		code: module.exports.BAD_PASSWORD,
		user: {
			id: username
		}
	};
}

module.exports.LoginOK = function(username){
	return {
		code: module.exports.LOGIN_OK,
		user: {
			id: username
		}
	};
}

module.exports.checkLogin = function(req, authFn, sameError, callback){
	var error = null;
	if(!req.body.username)
	{
		error = "Username is required";
	}
	if(!req.body.password)
	{
		error = "Password is required";
	}

	var result = null;
	if(!error)
	{
		var passwordResult = authFn(req.body.username, req.body.password);
		if(passwordResult.code != 'LOGIN_OK')
		{
			if(sameError)
				error = "Username password combination do not match"
			else
				error = passwordResult.code;
		}
		else
		{
			result = passwordResult.user;
		}
	}
	if(callback)
		callback(error, result);
}