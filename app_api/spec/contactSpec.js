var rest = require("restler");
var app = require("../../app");
var base = "http://localhost:9876";
var dbUtils = require("./dbUtils");

var nonActiveUserCredentials = {
  email: "inactive@inactive.com",
  password: "toto",
  id: "570d13dd6d04b9ec29d53578"
};

describe("An administrator", function(){

    var loginToken;
    function _login(done){
      rest.post(base+"/api/login", {data: nonActiveUserCredentials})
      .on("success", function(data, response){
        loginToken = data.token;
        done();
      }).on("fail", function(data, response){
        done.fail("unable to login: "+data.message);
      });
    };

    beforeEach(function(done){
   server = app.listen(9876, function(){
      dbUtils.clearDatabase(function(){
        dbUtils.addFixture(function(){
          _login(done);
        });
      });
    });
  });

  afterEach(function(done){
    server.close(function(){
      dbUtils.clearDatabase(done);
    });
  });

    it("should be able to be asked a question", function(done){
      console.log("start my test");
      console.log(loginToken);
      rest.post(base+"/api/ask", {accessToken: loginToken, data: {message: "salut ca va ?"}})
      .on("success", function(data, response){
        done();
      }).on("fail", function(error, response){
        done.fail(error);
      })

    });

  });
