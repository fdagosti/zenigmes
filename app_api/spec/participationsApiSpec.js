var rest = require("restler");
var app = require("../../app");
var base = "http://localhost:9876";
var dbUtils = require("./dbUtils");

var francoisCredentials = {
  email: "francois.dagostini@gmail.com",
  password: "toto"
}

var francoisId = "57091325117230600f0d1fae";

describe("The Participations API", function(){
  var server;

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

  it("should not work without any credentials", function(done){
    rest.get(base+"/api/participations").on("success", function(data, response){
      done.fail("The participations api should not work if you do not provide authentication");
    }).on("fail", function(data, response){
      expect(response.statusCode).toBe(401);
      done();
    });

  });

  it("should return a participation for francois", function(done){
    rest.post(base+"/api/login", {data: francoisCredentials}).on("success", function(data, response){
      rest.get(base+"/api/participations", {accessToken: data.token}).on("success", function(data, response){
        expect(response.statusCode).toBe(200);
        expect(data.length).toBeGreaterThan(0);
        data.forEach(function(session){
          expect(session.participants).toEqual(jasmine.arrayContaining([francoisId]));
        });
        done();
      }).on("fail", function(data, response){
        done.fail("getting a list of participations for francois should work");
      });
    }).on("fail", function(data, response){
      done.fail("unable to login: "+data.message);
    });
  });


});


describe('The get One Session API' , function() {
var loginToken;
beforeEach(function(done){
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
  // tests here
  afterEach(function(done){
    server.close(function(){
      dbUtils.clearDatabase(done);
    });
  });


  it('should return a detailed answer, with the real enigmes linked to it, not just its Id', function(done) {
        rest.get(base+"/api/sessions/570e7986a3c7b8b5330b287a",{accessToken: loginToken}).on("success", function(session, response){
          session.enigmes.forEach(function(enigme){
            expect(enigme.enigme._id).toBeDefined();
          });
          done();
        }).on("fail", function(data, response){
          done.fail("unable to get the session "+data);
        })
  });
});