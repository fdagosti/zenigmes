var mongoose = require("mongoose");
var sessionDB = mongoose.model("sessions");
var userDB = mongoose.model("User");
var enigmeDB = mongoose.model("enigmes");
var async = require("async");

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

var _classeFromDefiNiveau = require("./utils").classeFromDefiNiveau;

var _enigmeInThePast = function(sessionEnigme){
    var now = new Date();
    var enigmeEnd = new Date(sessionEnigme.end);
    return (enigmeEnd < now);
};


module.exports.classementsByDefis = function(req, res){
  if (!req.params.defiId) {
        sendJsonResponse(res, 404, {
            message: "Not found, defiId is required"
        });
        return;
    }

    async.waterfall([
      function(cb){
        // retrieve the defi
        sessionDB
        .findById(req.params.defiId)
        .exec(function(err, defi){
            cb(err, defi !== undefined?defi.toObject():null);
        });
      },function(defi, cb){
        // retrieve the participants of the session
        userDB.find({$or: [
          {"_id":{$in: defi.participants}},
          {"classe":{$in: _classeFromDefiNiveau(defi)}},
        ]},"name email classe classeNumber",function(err, users){

          defi.participants = users.map(function(usr){
            var u = usr.toObject();
            u.totalPoints = 0;
            u.answeredOnce = false;
            return u;
          });
          cb(err, defi);
        });
        
    },function(defi, cb){
      // filter out the future enigmes
      defi.enigmes = defi.enigmes.filter(_enigmeInThePast);



      // retrieve the enigmes points of the session
        async.each(defi.enigmes, function(enigme, cb){
        enigmeDB.findById(enigme.enigme, "points",function(err, enigmePoints){
          enigme.points = enigmePoints.points;

          // compute total points for each participants
          enigme.answers.forEach(function(answer){
            var usr;
            for (var i = 0; i < defi.participants.length; i++) {
              usr = defi.participants[i];
              if (usr.email === answer.user){
                usr.answeredOnce = true;
                if (answer.correctValue){
                  usr.totalPoints+= enigme.points;
                }
                break;
              }
            }
          });

          cb(err);    
        });
      }, function(err){
        cb(err, defi);
      }); 
    }],
    function(err, defi){

      if (err){
          return sendJsonResponse(res, 404, err);
      }
      sendJsonResponse(res, 200, defi);

    });


};