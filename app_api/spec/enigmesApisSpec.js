var rest = require("restler");
var app = require("../../app");
var base = "http://localhost:9876";
var dbUtils = require("./dbUtils");




var enigme = {
  titre:" Enigme de test pour tester l'API",
  description: "une description",
  numericAnswer: 32
};

var francoisCredentials = {
  email: "francois.dagostini@gmail.com",
  password: "toto"
};

var nonAdminCredentials = {
  email: "toto@toto.com",
  password: "toto"
};

describe("The API in general", function(){

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


  it("should fail with 404 when calling an API path that does not exist", function(done){
    rest.get(base+"/api/toto").on("success", function(){
      done.fail("api call on non existent path should not succeed");
    }).on("fail", function(data, response){
      expect(response.statusCode).toBe(404);
      done();
    });
  });
});

describe("The Enigmes APIs", function(){

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
    }).on("fail", function(data, response){
      done.fail("unable to login: "+data.message);
    });
  });

  it("should always return a numericAnswer field, even with only a reponse field", function(done){
    rest.post(base+"/api/login", {data: francoisCredentials}).on("success", function(data, response){
      rest.get(base+"/api/enigmes/570536454e07f8817caa067e",{accessToken: data.token}).on("success", function(data, response){
        var en = data;
        expect(en.numericAnswer).toBeDefined();
        done();
      }).on("fail", function(data, response){
        done.fail("this enigme should exist "+data);
      });
    }).on("fail", function(data, response){
      done.fail("unable to login");
    });
  });

  it("should return the numericAnswer field with the right value if we are an admin", function(done){
      rest.post(base+"/api/login", {data: francoisCredentials}).on("success", function(data, response){
        rest.get(base+"/api/enigmes/57067248a28caf6e09f7bc74",{accessToken: data.token}).on("success", function(en, response){
          expect(en.numericAnswer).toBe(22222);
          done();
        }).on("fail", function(data, response){
          done.fail("this enigme should exist "+data);
        });
      }).on("fail", function(data, response){
        done.fail("unable to login");
      });
  });

  it("should mask the answer if we log in with a non admin account", function(done){
      rest.post(base+"/api/login", {data: nonAdminCredentials}).on("success", function(data, response){
        rest.get(base+"/api/enigmes/57067248a28caf6e09f7bc74",{accessToken: data.token}).on("success", function(en, response){
          expect(en.numericAnswer).not.toBe(22222);
          done();
        }).on("fail", function(data, response){
          done.fail("this enigme should exist "+data);
        });
      }).on("fail", function(data, response){
        done.fail("unable to login");
      });
  });
});

