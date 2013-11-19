// There are two main options for bcrypt:
// (JS-only) https://npmjs.org/package/bcrypt-nodejs
// (Wrapper for Unix Program) https://github.com/ncb000gt/node.bcrypt.js.git
// 
// In this example we use the javascript-only version because it makes the
// examples more portable with fewer dependencies
var bcrypt 		= require('bcrypt-nodejs'),
	authLib 	= require('./auth-lib.js');

// This is the in-memory users table
var users = {
	"joe": {
		pw: "$2a$10$zJB7bPPzjmRlnC45L3OpTeLnBUEhHtXTqqXeUcpf1rPQFrjvMwL9K",
		salt: "usable security"
	}
};

// This method illustrates using bcrypt with passwords
// Some in the security field believe strongly that hashing
// is no longer acceptable
module.exports.authenticate = function(username, password){
	if(users[username])
	{
		try
		{
			// We still recommend salting passwords to ensure the greatest
			// entropy that is stored in bcrypt
			var submittedPassword = password + users[username].salt;
			var actualPassword = users[username].pw;

			// NEVER NEVER NEVER
			// NEVER NEVER NEVER
			// NEVER NEVER NEVER
			// NEVER log passwords or security tokens
			var demoOnlySubmittedPassword = bcrypt.hashSync(submittedPassword);
			console.log("Checking submitted password bcrypt '" + demoOnlySubmittedPassword + "' with actual password bcrypt '" + actualPassword + "'");

			if(actualPassword && (bcrypt.compareSync(submittedPassword, actualPassword)))
			{
				return authLib.LoginOK(username);
			}
			else
			{
				return authLib.BadPassword(username);
			}
		}catch(e)
		{
			console.log(e);
			return authLib.BadPassword(username);
		}
	}
	else
	{
		return authLib.BadUsername();
	}
}