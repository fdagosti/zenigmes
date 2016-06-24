

var mailConfig = require("../config/mail");
var rest = require("restler");
var app = require("../../app");
var dbUtils = require("./dbUtils");
var base = dbUtils.base;
var mail = require("../controllers/mails/mailsMessages");

var mailTestDefi = {
  "nom" : "Mon defi pour tester les mails",
  "start" : "2016-04-14T19:26:13.471Z",
  "enigmes" : [
    {
      "enigme" : "570536454e07f8817caa067e",
      "start" : "2016-04-14T19:26:13.471Z",
      "end" : "2016-04-21T19:26:13.471Z",
      "_id" : "57191ecbe9230eb273a914c2",
      "answers" : [ ]
    },
    {
      "enigme" : "57067248a28caf6e09f7bc75",
      "start" : "2016-04-24T19:26:13.471Z",
      "end" : "2016-04-30T19:26:13.471Z",
      "_id" : "57191ecbe9230eb273a914c4",
      "answers" : [ ]
    },
    {
      "enigme" : "57067248a28caf6e09f7bc76",
      "start" : "2016-05-24T19:26:13.471Z",
      "end" : "2016-05-30T19:26:13.471Z",
      "_id" : "57191ecbe9230eb273a914c5",
      "answers" : [ ]
    }
  ],
  "niveau" : 1,
  "participants" : [
    "57091325117230600f0d1fae"
  ]
};

describe("The registration process", function(){


  afterEach(function(done){
    console.log("AFTER EACH");
    server.close(function(){
      dbUtils.clearDatabase(done);
    });
  });

    var server;
    beforeEach(function(done){
        console.log("BEFORE EACH 1");
        server = app.listen(9876, function(){
          dbUtils.clearDatabase(function(){
            dbUtils.addFixture(done);
          });
        });
    });
  
  it("should send a mail after user registration", function(done){
  

    mail.cb = function(errors, info){
        if (errors) {
            done.fail("Errors, sending mail");
        } else {
            console.log(info.response.toString());
            done();
        }
    };

    rest.post(base+"/api/register",{data:{email:"toutou@toutou.com",classe:"externe", password:"toutou",name:"toutou"}})
    .on("success", function(data, response){
        
        console.log("Yeah, regitration is done");
        console.log(mailConfig.transporter.sentMail);
    }).on("fail", function(err, response){
        done.fail(err);
    });
    
  });

});

describe("the Defi creation process", function(){

    afterEach(function(done){
    console.log("AFTER EACH");
    server.close(function(){
      dbUtils.clearDatabase(done);
    });
  });
     var server, loginToken;
    beforeEach(function(done){
        console.log("BEFORE EACH 2");
        server = app.listen(9876, function(){
          dbUtils.setupAndLoginAsAdmin(function(token, err){
            if (err){
              done.fail(err);
            }else{
              loginToken = token;
              done();
            }
          });
        });
    });

  it("should send a mail after Defi creation", function(done){

  
 


    mail.cb = function(errors, info){
        if (errors) {
            done.fail("Errors, sending mail");
        } else {
            console.log(info.response.toString());
            done();
        }
    };

    rest.post(base+"/api/sessions", {accessToken: loginToken, data: mailTestDefi})
    .on("success", function(data, response){
        console.log("yeah, session created");
    }).on("fail", function(err, response){
        done.fail(err);
    });

  });
});