var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');

// This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)
var auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
    }
}
var transport = mg(auth);
if (process.env.NODE_ENV === "test"){
  transport = require("nodemailer-stub-transport")();
}
var toReturn = nodemailer.createTransport(transport);
module.exports = toReturn;
