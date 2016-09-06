var _jade = require('jade');
var fs = require('fs');
var usersDB = require("mongoose").model("User");
var transport = require("../../config/mail");
var hostName = require('os').hostname();
var templateDir = process.cwd()+"/app_api/controllers/mails/";
var centralTo = transport.transport.centralTo;

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

var _classeFromDefiNiveau = function(session){
  var niveau = session.niveau;
  if (niveau === 1){
    return ["6eme", "5eme"];
  }else if (niveau === 2){
    return ["4eme", "3eme"];
  }else if (niveau === 3){
    return ["2nde", "1ere", "terminale"];
  }else {
    return "exterieur";
  }
};

function _toNodeMailerString2(users){
  if (centralTo !== undefined){
    return centralTo;
  }

  var res="";
  var recipientVars = {};
  users.forEach(function(user){
    res +=user.name+" <"+user.email+">,";
    var m = user.email;
    recipientVars[m] = {name: user.name};
  });

  return {
    recipientVars: recipientVars,
    toString: res
  }
};

function _toNodeMailerString(users){
  return _toNodeMailerString2(users).toString;
}


module.exports = {
  newUserNeedValidations: function(req, newUser){

    usersDB.find({role: "admin"}, "name email", function(err, admins){
      if (err){
        console.error(err);
      }else{

        var toString = _toNodeMailerString(admins);
        var userPageUrl = "http://"+req.headers.host+"/users";

        compileJade("newUser.jade", {newUser:newUser, usersUrl: userPageUrl}, function(html){

          // setup e-mail data with unicode symbols
          var mailOptions = {
              from: '"zenigmes" <zenigmes@bzenigmes.fr>', // sender address
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
  messageToAdmin: function(req, message, fromUser){
    usersDB.find({role: "admin"}, "name email", function(err, admins){
      if (err){
        console.error(err);
      }else{
        var recipients = _toNodeMailerString2(admins);
        
        var userPageUrl = "http://"+req.headers.host+"/users";

        var context = {fromUser:fromUser, message: message};

      
        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: '"zenigmes" <zenigmes@bzenigmes.fr>', // sender address
            to: recipients.toString,
            "recipient-variables": recipients.recipientVars,
            subject: context.fromUser.name+" vous contacte directement", // Subject line

            template: {
              name: templateDir+"adminMessage.jade",
              engine: "jade",
              context: context
            },
        };

        // send mail with defined transport object
        transport.sendMail(mailOptions, module.exports.cb);  
        
      }
    });
  },
  defiHasBeenCreated: function(req, newDefi){

     // retrieve the participants of the session
    usersDB.find({$or: [
      {"_id":{$in: newDefi.participants}},
      {"classe":{$in: _classeFromDefiNiveau(newDefi)}},
    ]},"name email",function(err, users){

      var recipients = _toNodeMailerString2(users);

      var mesDefisPageUrl = "http://"+req.headers.host+"/mesdefis";

      compileJade("newDefi.jade", {defi:newDefi, mesDefis: mesDefisPageUrl}, function(html){

          // setup e-mail data with unicode symbols
          var mailOptions = {
              from: '"zenigmes" <zenigmes@bzenigmes.fr>', // sender address
              to: recipients.toString,
              "recipient-variables": recipients.recipientVars,
              subject: "Un nouveau défi vient d'être créé", // Subject line
              html: html // html body
          };

          // send mail with defined transport object
          transport.sendMail(mailOptions, module.exports.cb);  
      });

    });

  },
  accountValidated: function(req, user){


    var toString = _toNodeMailerString([user]);
    
    var mesDefisPageUrl = "http://"+req.headers.host+"/mesdefis";

    compileJade("accountValidated.jade", {mesDefis: mesDefisPageUrl}, function(html){

        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: '"zenigmes" <zenigmes@zenigmes.fr>', // sender address
            to: toString,
            subject: "Votre compte a été validé", // Subject line
            html: html // html body
        };

        // send mail with defined transport object
        transport.sendMail(mailOptions, module.exports.cb);  
      });


  },
  enigmeAboutToStart: function(defi, enigme){
    usersDB.find({$or: [
      {"_id":{$in: defi.participants}},
      {"classe":{$in: _classeFromDefiNiveau(defi)}},
    ]},"name email",function(err, users){
      var recipients = _toNodeMailerString2(users);

      // no request objects for scheduled mail to derive the host name
      // for the moment, I'll put it hardcoded. But this needs to change
      var enigmeUrl = "http://www.zenigmes.fr/enigmes/"+enigme._id+"?sessionid="+defi._id;

      compileJade("enigmeAboutToStart.jade", {enigme: enigme,enigmeAnswer: enigmeUrl}, function(html){

        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: '"zenigmes" <zenigmes@zenigmes.fr>', // sender address
            to: recipients.toString,
            "recipient-variables": recipients.recipientVars,
            subject: "Une énigme de votre défi est disponible: répondez vite ", // Subject line
            html: html // html body
        };

        // send mail with defined transport object
        transport.sendMail(mailOptions, module.exports.cb);  
      }); 

    });
  },
  passwordReset: function(req, user){
      var toString = _toNodeMailerString([user]);

      var passResetUrl = "http://"+req.headers.host+"/reset/"+user.resetPasswordToken;

      compileJade("passwordReset.jade", {passResetUrl: passResetUrl}, function(html){

        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: '"zenigmes" <zenigmes@zenigmes.fr>', // sender address
            to: toString,
            subject: "Demande de nouveau mot de passe pour les Zenigmes", // Subject line
            html: html // html body
        };

        // send mail with defined transport object
        transport.sendMail(mailOptions, module.exports.cb);  
      });
  },
  passwordHasChanged: function(req, user){
      var toString = _toNodeMailerString([user]);

      compileJade("passwordChanged.jade", {user: user}, function(html){

        // setup e-mail data with unicode symbols
        var mailOptions = {
            from: '"zenigmes" <zenigmes@zenigmes.fr>', // sender address
            to: toString,
            subject: "Mot de passe changé", // Subject line
            html: html // html body
        };

        // send mail with defined transport object
        transport.sendMail(mailOptions, module.exports.cb);  
      });
  },
  cb: function(error, info){
        if(error){
          console.error(error);
        }
      }
};