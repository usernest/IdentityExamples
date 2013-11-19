var authLib = require('./auth-lib.js');

// This is the in-memory users table
var users = {
	"joe": "jsconf"
};

// This method illustrates the 3 basic error conditions
// of all password-based login attempts
module.exports.authenticate = function(username, password){
	if(users[username])
	{
		var actualPassword = users[username];

		// NEVER NEVER NEVER
		// NEVER NEVER NEVER
		// NEVER NEVER NEVER
		// NEVER log passwords or security tokens
		// This is here for the demo
		console.log("Checking submitted password '" + password + "' with actual password '" + actualPassword + "'");

		// It is important to check that a user has a password
		// Inadvertent nulls or empty passwords have caused havock
		// to a few notable systems
		if(actualPassword && password == actualPassword)
		{
			return authLib.LoginOK(username);
		}
		else
		{
			return authLib.BadPassword(username);
		}
	}
	else
	{
		return authLib.BadUsername();
	}
}