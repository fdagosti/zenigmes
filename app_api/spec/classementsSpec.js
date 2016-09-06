var rest = require("restler");
var app = require("../../app");
var dbUtils = require("./dbUtils");
var base = dbUtils.base;
var async = require("async");

var answeringGuys = [
  {
    email: "francois.dagostini@gmail.com",
    password: "toto",
    answer: 2
  },
  {
    email: "td@tc.com",
    password: "toto",
    answer: 32
  },
  {
    email: "maskman@maskman.com",
    password: "toto",
    answer: 32
  },
];

var toAnswer = {
  session: "570feedbdc29f6193729d48f",
  enigme: "57067248a28caf6e09f7bc76"
};

describe("the classement API", function(){
  var loginToken;
  function _loginAndAnswer(user, cb){
    rest.post(base+"/api/login", {data: user})
    .on("success", function(data, response){
      loginToken = data.token;
      rest.post(base+"/api/session/"+toAnswer.session+"/enigme/"+toAnswer.enigme+"/answer", {accessToken: loginToken, data: user})
      .on("success", function(data, response){
        cb(null);
      }).on("fail", function(data, response){
        cb(data);
      });
      
    }).on("fail", function(data, response){
      cb("unable to login: "+data.message);
    });
  }

  beforeEach(function(done){
   server = app.listen(9876, function(){
      dbUtils.clearDatabase(function(){
        dbUtils.addFixture(function(){
          async.series([
            function(cb){_loginAndAnswer(answeringGuys[0], cb);},
            function(cb){_loginAndAnswer(answeringGuys[1], cb);},
            function(cb){_loginAndAnswer(answeringGuys[2], cb);},
          ], function(err, results){

            if (err){done.fail(err);}
            else {done();}
          });
        });
      });
    });
  });

  afterEach(function(done){
    server.close(function(){
      dbUtils.clearDatabase(done);
    });
  });

  it("should retrieve the users who answered a defi", function(done){
    rest.get(base+"/api/classements/"+toAnswer.session, {accessToken: loginToken})
    .on("success", function(defi, response){

      var maskmanAnswer = false;

      expect(defi.participants.length).toBe(5);
      defi.participants.forEach(function(p){
        // expect(p.email).toBeUndefined();
        expect(p.status).toBeUndefined();
        expect(p.salt).toBeUndefined();
        expect(p.hash).toBeUndefined();
        expect(p.name).toBeDefined();

        if (p.name === "maskman"){
          expect(p.totalPoints).toBe(1);
          maskmanAnswer = true;
        }
      });

      expect(maskmanAnswer).toBe(true);

      defi.enigmes.forEach(function(enigme){
        expect(enigme.points).toBeDefined();
      });
      done();


    }).on("fail", function(err, response){
      done.fail(err);
    });
  });


  it("should not return the points for an enigme which is ongoing, even if people have already answered", function(done){

      var baseTime = new Date(2016,4,28);
      jasmine.clock().mockDate(baseTime);
      rest.get(base+"/api/classements/"+toAnswer.session, {accessToken: loginToken})
      .on("success", function(defi, response){
        defi.participants.forEach(function(p){

          if (p.name === "maskman"){
            expect(p.totalPoints).toBe(0);
            maskmanAnswer = true;
          }
        });
        expect(maskmanAnswer).toBe(true);
        done();
      }).on("fail", function(error, response){
        done.fail(error);
      });

  });
});