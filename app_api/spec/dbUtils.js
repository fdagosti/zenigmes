var mongoose = require("mongoose");
var zngm = mongoose.model("enigmes");
var users = mongoose.model("User");
var sessions = mongoose.model("sessions");
var rest = require("restler");

var async = require("async");

var usersFixture = require("./fixtures/users");
var enigmesFixture = require("./fixtures/enigmes");
var sessionsFixture = require("./fixtures/sessions");

exports.clearDatabase = function(done){
  zngm.remove({}, function(err){
    users.remove({}, function(err){
      sessions.remove({}, function(err){
        done();
      });
    });
  });
};

exports.addFixture = function(done){

  async.each(enigmesFixture, function(enigme, cb){
    zngm.create(enigme, function(err, res){
      cb(err);
    });
  },function(){
    async.each(usersFixture, function(user, cb){
      users.create(user, function(err, res){
        cb(err);
      });
    },function(err){
      if (err){ 
        done.fail("error filling db "+err.message);
        return;
      }
      async.each(sessionsFixture, function(session, cb){
        sessions.create(session, function(err, res){
          cb(err);
        });
      },function(err){
        if (err){
          done.fail("error filling database "+err);
        }else{
        done();
          
        }
      });

    });

  });

};

var base = "http://localhost:9876";
var francoisCredentials = {
  email: "francois.dagostini@gmail.com",
  password: "toto"
};

exports.setupAndLoginAsAdmin = function(done){
  exports.clearDatabase(function(){
    exports.addFixture(function(){
      rest.post(base+"/api/login", {data: francoisCredentials})
      .on("success", function(data, response){
        done(data.token);
      }).on("fail", function(data, response){
        done(null, "unable to login: "+data.message);
      });
    }); 
  });
};