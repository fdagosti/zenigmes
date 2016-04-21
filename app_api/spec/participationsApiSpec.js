var rest = require("restler");

var base = "http://localhost:3000";

var francoisCredentials = {
  email: "francois.dagostini@gmail.com",
  password: "toto"
}

var francoisId = "57091325117230600f0d1fae";

describe("The Participations API", function(){

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
        console.log("status "+response.statusCode);
        done.fail("getting a list of participations for francois should work");
      });
    });
  });

});