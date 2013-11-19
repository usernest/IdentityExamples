// To use the third-party providers you will need your own API IDs and Keys
// These keys are stored in keys.js, which is not checked into source control.
// This file shows the sample layout for the actual keys.js
// Take this file, rename it to keys.js, and add in your own API IDs and Keys

module.exports = {
	facebook : {
		appId: "---- YOUR FB APP ID ------"
	},
	github : {
		clientId : "------ YOUR GITHUB CLIENT ID ------",
		clientSecret : "----- YOUR GITHUB CLIENT SECRET -------"
	},
	recaptcha: {
		domain: 'localhost',
		publicKey: '----- Your reCAPTCHA public key -----',
		privateKey: '----- Your reCAPTCHA private key -----'
	}
};