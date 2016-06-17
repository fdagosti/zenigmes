var mongoose = require("mongoose");
var sessionDB = mongoose.model("sessions");
var userDB = mongoose.model("User");
var enigmeDB = mongoose.model("enigmes");
var async = require("async");

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

var _classeFromDefiNiveau = function(session){
  var niveau = session.niveau;
  if (niveau === 1){
    return ["6eme", "5eme"];
  }else if (niveau === 2){
    return ["4eme", "3eme"];
  }else if (niveau === 3){
    return ["2nde", "1ere", "terminale"];
  }else {
    return "exterieur";
  }
};

module.exports.classementsByDefis = function(req, res){
  console.log("asking for classement");
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
        ]},"name email",function(err, users){

          defi.participants = users.map(function(usr){
            var u = usr.toObject();
            u.totalPoints = 0;
            return u;
          });
          cb(err, defi)
        })
        
    },function(defi, cb){
      // retrieve the enigmes points of the session
      async.each(defi.enigmes, function(enigme, cb){
        enigmeDB.findById(enigme.enigme, "points",function(err, enigmePoints){
          enigme.points = enigmePoints.points;

          // compute total points for each participants
          enigme.answers.forEach(function(answer){
            if (answer.correctValue){
              defi.participants.forEach(function(usr){
                if (usr.email===answer.user){
                  usr.totalPoints+= enigme.points;
                }
              });
            }
          });

          cb(err);    
        })
      }, function(err){
        cb(err, defi);
      }); 
    }],
    function(err, defi){
      console.log("waterfall end");
      


      if (err){
          return sendJsonResponse(res, 404, err);
      }
      sendJsonResponse(res, 200, defi);

    });


};