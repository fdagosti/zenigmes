var rest = require("restler");
var app = require("../../app");
var base = "http://localhost:9876";
var dbUtils = require("./dbUtils");

var francoisCredentials = {
  email: "francois.dagostini@gmail.com",
  password: "toto"
}

describe("The Answer API", function(){
  
  beforeEach(function(done){
   server = app.listen(9876, function(){
      dbUtils.clearDatabase(function(){
        dbUtils.addFixture(done);
      
      });
      
    });
  });
  // tests here
  afterEach(function(done){
    server.close(function(){
      dbUtils.clearDatabase(done);
    });
  });

  it("should store the answer inside the enigmes section of a session", function(){

    var answer = {answer: "5"};
    var sessionId = "570e7986a3c7b8b5330b287a";
    var enigmeId = "5706695137a07d5707c2eb42";

    rest.post(base+"/api/login", {data: francoisCredentials}).on("success", function(data, response){
      var token = data.token;
      rest.post("/api/sessionId/enigmeId/answer", {accessToken: token, data: answer}).on("success", function(data, response){
        rest.get("/api/session/sessionId", {accessToken: token}).on("success", function(data, response){
          var session = data.session;
          session.enigmes.forEach(function(enigme){
            if (enigme.enigme === enigmeId){
              expect(enigme.answer).toBe(answer.answer);
            }
          });
        });
      });
    });
  });

});
