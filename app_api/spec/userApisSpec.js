var rest = require("restler");
var app = require("../../app");
var base = "http://localhost:9876";
var dbUtils = require("./dbUtils");

var francoisCredentials = {
  email: "francois.dagostini@gmail.com",
  password: "toto"
}

describe("The User API", function(){
  
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

it("should provide all participating sessions with each answered enigmes", function(done){
  var atLeastOneAnswer = false;
  rest.get(base+"/api/users", {accessToken: loginToken})
  .on("success", function(users, response){
    francois = users.find(function(user){
      return user.email === francoisCredentials.email;
    });
    rest.get(base+"/api/users/"+francois._id)
    .on("success", function(francoisDetails, response){
      expect(francoisDetails.sessions.length).toBeGreaterThan(0);
      francoisDetails.sessions.forEach(function(session){
        session.enigmes.forEach(function(enigme){
          expect(enigme.enigme).toBeDefined();
          expect(enigme.enigme.titre).toBeDefined();
          if (enigme.answers.length >0){
            enigme.answers.forEach(function(answer){
              atLeastOneAnswer = true;
              expect(answer.user).toBe(francoisCredentials.email);
            });
          }
        });
      });
      expect(atLeastOneAnswer).toBe(true);
      done();
    })
    .on("fail", function(data, response){
      done.fail("failed to fetch francois");
    });
  })
  .on("fail", function(data, response){
    done.fail("failed to get users");
  })
});


});