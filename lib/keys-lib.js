var fs 			= require('fs');
module.exports.getKeys = function(){
	if(fs.existsSync(__dirname + "/../keys.js"))
	{
		return require('../keys.js');
	}
	else
	{
		return require('../keys.example.js');
	}
}