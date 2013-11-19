var crypto 		= require('crypto'),
	authLib 	= require('./auth-lib.js');

// This is the in-memory users table
var users = {
	"joe": {
		pw: "bb756580f63ca2838615cf4436fd4f812c57b5021d38ce639da52a0c292a465c",
		salt: "usable security"
	}
};

// This method illustrates the adding basic hashing
// and per-user salting for passwords
module.exports.authenticate = function(username, password){
	if(users[username])
	{
		// there are various discussions
		var hash = crypto.createHash('sha256');
		// add plaintext password
		hash.update(password + "", "utf8");
		// add per-user salt
		hash.update(users[username].salt + "", "utf8");
		// conver the bytes into a string we can store in the db
		var submittedPasswordHash = hash.digest("hex");
		var actualPassword = users[username].pw;

		// NEVER NEVER NEVER
		// NEVER NEVER NEVER
		// NEVER NEVER NEVER
		// NEVER log passwords or security tokens
		// This is here for the demo
		console.log("Checking submitted password hash '" + submittedPasswordHash + "' with actual password hash '" + actualPassword + "'");

		if(actualPassword && submittedPasswordHash == actualPassword)
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