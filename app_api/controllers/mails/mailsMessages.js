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

function _toNodeMailerString(users){
  var res="";
  users.forEach(function(user){
    res +=user.name+" <"+user.email+">,";
  });
  return res;
}



module.exports = {
  newUserNeedValidations: function(req, newUser){

    usersDB.find({role: "admin"}, "name email", function(err, admins){
      if (err){
        console.error(err);
      }else{

        var toString = _toNodeMailerString(admins);
        
        var userPageUrl = "http://"+req.headers.host+"/users";

        var html = compileJade("newUser.jade", {newUser:newUser, usersUrl: userPageUrl}, function(html){

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
  defiHasBeenCreated: function(req, newDefi){

     // retrieve the participants of the session
    usersDB.find({$or: [
      {"_id":{$in: newDefi.participants}},
      {"classe":{$in: _classeFromDefiNiveau(newDefi)}},
    ]},"name email",function(err, users){

      var toString = _toNodeMailerString(users);
      
      var mesDefisPageUrl = "http://"+req.headers.host+"/mesdefis";

      var html = compileJade("newDefi.jade", {defi:newDefi, mesDefis: mesDefisPageUrl}, function(html){

          // setup e-mail data with unicode symbols
          var mailOptions = {
              from: '"zenigmes" <zenigmes@bzenigmes.fr>', // sender address
              to: toString,
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

    var html = compileJade("accountValidated.jade", {mesDefis: mesDefisPageUrl}, function(html){

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
  cb: function(error, info){
        if(error){
          console.error(error);
        }
      }
};