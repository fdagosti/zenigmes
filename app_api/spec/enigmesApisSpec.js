var rest = require("restler");

var base = "http://localhost:3000";

var enigme = {
  titre:" Enigme de test pour tester l'API",
  description: "une description",
  reponse: 32
};

var francoisCredentials = {
  email: "francois.dagostini@gmail.com",
  password: "toto"
}

describe("The Enigmes APIs", function(){


  it("should not allow posting an enigmes without authorization", function(done){
    rest.post(base+"/api/enigmes", {data: enigme}).on("success", function(data){
      done.fail("Posting an enigmes without credentials is forbidden");
    }).on("fail", function(data, response){
      expect(response.statusCode).toBe(401);
      done();
    });

  });

  it("should allow to login with default francois credentials", function(done){
    rest.post(base+"/api/login", {data: francoisCredentials}).on("success", function(data, response){
      expect(data.token).not.toBe(null);
      done();
    }).on("fail", function(data, response){
      done.fail("Login failed while good credentials passed");
    });
  });

  it("should allow to create an enigme if authenticated", function(done){
    rest.post(base+"/api/login", {data: francoisCredentials}).on("success", function(data, response){
      rest.post(base+"/api/enigmes", {data: enigme, accessToken: data.token}).on("success", function(data, response){
        expect(response.statusCode).toBe(201);
        done();
      }).on("fail", function(data, response){
        done.fail("enigme post faile while a good auth token was given");
      });
    });
  });
});

