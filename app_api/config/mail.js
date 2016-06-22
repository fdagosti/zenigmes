var nodemailer = require('nodemailer');
var mg = require('nodemailer-mailgun-transport');
var app = require("../../app");

// This is your API key that you retrieve from www.mailgun.com/cp (free up to 10K monthly emails)
var auth = {
  auth: {
    api_key: 'key-436fca811b3f1643e817060c6e154584',
    domain: 'sandbox067799b736ae41158183a45305be7cc3.mailgun.org'
    }
}
var transport = mg(auth);
if (process.env.NODE_ENV === "test"){
  transport = require("nodemailer-stub-transport")();
}
var toReturn = nodemailer.createTransport(transport);
module.exports = toReturn;
