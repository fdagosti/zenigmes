var rest = require("restler");
var app = require("../../app");
var dbUtils = require("./dbUtils");
var base = dbUtils.base;
var mail = require("../controllers/mails/mailsMessages");
var mailConfig = require("../config/mail");

var francoisCredentials = {
  email: "francois.dagostini@gmail.com",
  password: "toto"
};

describe("The registration process", function(){
    
    afterEach(function(done){
    server.close(function(){
      dbUtils.clearDatabase(done);
    });
  });

    var server;
    beforeEach(function(done){
        server = app.listen(9876, function(){
          console.log("CLEAR DATABASE !");
          dbUtils.clearDatabase(function(){

            dbUtils.addFixture(done);
          });
        });
    });

  it("should send a mail when asking for a password recovery", function(done){

    mail.cb = function(errors, info){
      if (errors) {
          done.fail(errors);
      } else {
        // console.log(mailConfig.transport.sentMail[mailConfig.transport.sentMail.length - 1]);
          
         done();
      }
    };

    rest.post(base+"/api/forgot",{data:{email: "francois.dagostini@gmail.com"}})
    .on("success", function(data, response){
      // waiting for mail callback
      expect(data.token).toBeDefined();
    }).on("fail", function(err, response){
      done.fail(err);
    });

  });  

  it("should change the password and send a mail when the reset api is called with a proper token", function(done){

    _askForToken(function(err, passwordResetToken){

      mail.cb = function(errors, info){
      if (errors) {
          done.fail(errors);
      } else {
        // console.log(mailConfig.transport.sentMail[mailConfig.transport.sentMail.length - 1]);
      }
    };
    var newPassword = "passwordSpec";

    rest.post(base+"/api/reset/"+passwordResetToken, {data:{password:newPassword}})
    .on("success", function(data, response){
      
      rest.post(base+"/api/login", {data: francoisCredentials})
        .on("success", function(data, response){
          done.fail("We should not be able to log in with the old password");
        }).on("fail", function(err, response){
         rest.post(base+"/api/login", {data: {email: francoisCredentials.email, password: newPassword}})
         .on("success", function(data, response){
          done();
         }).on("fail", function(err, response){
          done.fail(err);
         }); 
        });

    }).on("fail", function(err, response){
      done.fail(err);
    });


    });
  });


  var _askForToken = function(cb){
    rest.post(base+"/api/forgot",{data:{email: "francois.dagostini@gmail.com"}})
    .on("success", function(data, response){
      
      cb(null, data.token);
    }).on("fail", function(err, response){
      cb(err);
    });
  };

});