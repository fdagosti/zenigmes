var mongoose = require("mongoose");
var zngm = mongoose.model("enigmes");
var users = mongoose.model("User");
var sessions = mongoose.model("sessions");

var async = require("async");

var usersFixture = require("./fixtures/users");
var enigmesFixture = require("./fixtures/enigmes");
var sessionsFixture = require("./fixtures/sessions");

exports.clearDatabase = function(done){
  zngm.remove({}, function(err){
    users.remove({}, function(err){
      sessions.remove({}, function(err){
        done();
      })
    })
  })
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
    },function(){
      async.each(sessionsFixture, function(session, cb){
        sessions.create(session, function(err, res){
          cb(err);
        });
      },function(err){
        done();
      })

    });

  });

};