

var mailConfig = require("../config/mail");
var rest = require("restler");
var app = require("../../app");
var dbUtils = require("./dbUtils");
var base = dbUtils.base;
var mail = require("../controllers/mails/mailsMessages");

describe("The registration process", function(){


    var server;
    beforeEach(function(done){
        server = app.listen(9876, function(){
          dbUtils.clearDatabase(function(){
            dbUtils.addFixture(done);
          });
        });
    });
  
  afterEach(function(done){
    server.close(function(){
      dbUtils.clearDatabase(done);
    });
  });

  it("should send a mail after completion", function(done){

    mail.cb = function(errors, info){
        if (errors) {
            done.fail("Errors, sending mail");
        } else {
            console.log(info.response.toString());
            done();
        }
    };

    rest.post(base+"/api/register",{data:{email:"toutou@toutou.com",classe:"externe", password:"toutou",name:"toutou"}}).on("success", function(data, response){
        
        console.log("Yeah, regitration is done");
        console.log(mailConfig.transporter.sentMail);
    }).on("fail", function(data, response){
        done.fail(data);
    });
    
  });
});