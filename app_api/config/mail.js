var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');

var transport;
if (process.env.NODE_ENV === "test"){
  transport = require("nodemailer-mock-transport")();
}else {

// This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)
var auth = {
  auth: {
    api_key: process.env.MAILGUN_API_KEY,
    domain: process.env.MAILGUN_DOMAIN
    }
}
transport = mg(auth);

}
var toReturn = nodemailer.createTransport(transport);
module.exports = toReturn;
module.exports.transport = transport;
