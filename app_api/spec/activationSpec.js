var rest = require("restler");
var app = require("../../app");
var base = "http://localhost:9876";
var dbUtils = require("./dbUtils");

var nonActiveUserCredentials = {
  email: "inactive@inactive.com",
  password: "toto",
  id: "570d13dd6d04b9ec29d53578"
};

var adminCredentials = {
  email: "francois.dagostini@gmail.com",
  password: "toto",
  id: "57091325117230600f0d1fae"
};

var loginToken;
  function _login(credentials, done){
    rest.post(base+"/api/login", {data: credentials})
    .on("success", function(data, response){
      loginToken = data.token;
      done();
    }).on("fail", function(data, response){
      done.fail("unable to login: "+data.message);
    });
  }

describe("A non activated user", function(){
  
  

  beforeEach(function(done){
   server = app.listen(9876, function(){
      dbUtils.clearDatabase(function(){
        dbUtils.addFixture(function(){
          _login(nonActiveUserCredentials,done);
        });
      });
    });
  });

  afterEach(function(done){
    server.close(function(){
      dbUtils.clearDatabase(done);
    });
  });


  var answerValue = 32;
  var sessionId = "570e7986a3c7b8b5330b287a";
  var enigmeId = "5706689e44be3f420562c667";
 
  it("should not be able to use any auth based api", function(done){

    rest.get(base+"/api/participations/", 
              {accessToken: loginToken})
    .on("success", function(data, response){
      done.fail("An inactive user should not be able to get its participations");
    }).on("fail", function(err, response){
        expect(response.statusCode).toBe(401);
        done();
    });
  });

  it("should be able transition to the validation state without having to logout/login again", function(done){
    dbUtils.activateUserOnDb("570d13dd6d04b9ec29d53578", function(){
      rest.get(base+"/api/participations/", 
              {accessToken: loginToken})
      .on("success", function(data, response){
        console.log("yeahhhh");
        done();
      }).on("fail", function(err, response){
        console.log(err);
        done.fail("An inactive user who has been validated should be able to act as valid");
      });
    });
  });

  

  });
