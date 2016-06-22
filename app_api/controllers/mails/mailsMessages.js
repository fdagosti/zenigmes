var _jade = require('jade');
var fs = require('fs');
var usersDB = require("mongoose").model("User");
var transport = require("../../config/mail");
var hostName = require('os').hostname();

var compileJade = function(jadeFile, locals, cb){
  var template = process.cwd()+"/app_api/controllers/mails/"+jadeFile;

  fs.readFile(template, "utf8", function(err, file){
    if (err){
      console.log(err);
      cb(null);
    }else {
      var compiledTmpl = _jade.compile(file);

      var toto = compiledTmpl(locals);
      cb(toto);

    }
  });
};



module.exports = {
  newUserNeedValidations: function(req, newUser){

    usersDB.find({role: "admin"}, "name email", function(err, admins){
      if (err){
        console.error(err);
      }else{

        var toString = "";
        admins.forEach(function(admin){
          toString +=admin.name+" <"+admin.email+">,";
        });

        var userPageUrl = "http://"+req.headers.host+"/users";

        var html = compileJade("newUser.jade", {newUser:newUser, usersUrl: userPageUrl}, function(html){

          // setup e-mail data with unicode symbols
          var mailOptions = {
              from: '"zenigmes" <foo@blurdybloop.com>', // sender address
              to: toString,
              subject: "Un nouvel utilisateur s'est inscrit aux zenigmes", // Subject line
              html: html // html body
          };

          // send mail with defined transport object
          transport.sendMail(mailOptions, module.exports.cb);  
        });
        
      }
    });
  },
  cb: function(error, info){
        if(error){
          console.log("ERROR nodemailer");
          return console.error(error);
        }
      }
}