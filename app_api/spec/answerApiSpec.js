var rest = require("restler");
var app = require("../../app");
var base = "http://localhost:9876";
var dbUtils = require("./dbUtils");

var francoisCredentials = {
  email: "francois.dagostini@gmail.com",
  password: "toto"
}

describe("The Answer API", function(){
  
  var loginToken;

  beforeEach(function(done){
   server = app.listen(9876, function(){
      dbUtils.clearDatabase(function(){
        dbUtils.addFixture(function(){
          rest.post(base+"/api/login", {data: francoisCredentials})
          .on("success", function(data, response){
            loginToken = data.token;
            done();
          });
        });
      
      });
      
    });
  });
  // tests here
  afterEach(function(done){
    server.close(function(){
      dbUtils.clearDatabase(done);
    });
  });


  var answerValue = 5;
    var sessionId = "570e7986a3c7b8b5330b287a";
    var enigmeId = "5706689e44be3f420562c667";
 
  it("should store the answer inside the enigmes section of a session", function(done){

    rest.post(base+"/api/session/"+sessionId+"/enigme/"+enigmeId+"/answer", 
              {accessToken: loginToken, data: {answer:answerValue}})
    .on("success", function(data, response){
      rest.get(base+"/api/sessions/"+sessionId, {accessToken: loginToken})
      .on("success", function(session, response){
        
        session.enigmes.forEach(function(enigme){
          if (enigme.enigme === enigmeId){
            enigme.answers.forEach(function(answer){
              expect(parseInt(answer.value)).toBe(answerValue);
              expect(answer.user).toBe(francoisCredentials.email);
            });
            done();                              
          }
        });
      });
    })
    .on("fail", function(data, response){
      done.fail("You should be able to post a new answer");
    });
  });

  it("should not allow empty values for answers", function(done){

    rest.post(base+"/api/session/"+sessionId+"/enigme/"+enigmeId+"/answer", 
              {accessToken: loginToken, data: {}})
    .on("success", function(session, response){
      done.fail("an ampty answer should not be answered successfully");
    })
    .on("fail", function(data, response){
      expect(response.statusCode).toBe(400);
      done();
    });
  });

  it("should not allow the same user to answer twice on the same enigme in the same session", function(done){
    rest.post(base+"/api/session/"+sessionId+"/enigme/"+enigmeId+"/answer", 
              {accessToken: loginToken, data: {answer:answerValue}})
    .on("success", function(session, response){
      rest.post(base+"/api/session/"+sessionId+"/enigme/"+enigmeId+"/answer", 
              {accessToken: loginToken, data: {answer:34}})
      .on("success", function(data, response){
        done.fail("you should not be able to answer to the same session and enigme twice");
      })
      .on("fail", function(data, response){
        expect(response.statusCode).toBe(403);
        done();
      });
    })
    .on("fail", function(data, response){
      done.fail("You should be able to post a new answer");
    });


  });
    
  

});
