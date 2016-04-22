var mongoose = require("mongoose");
var sessionDB = mongoose.model("sessions");
var userDB = mongoose.model("User");

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.participationsList = function(req, res){
    sessionDB.find({
        participants: {$elemMatch: {$eq: req.user._id}}
    },function(err, session){
        console.log("inside participations request "+err);
        console.log(session);
      
            sessionDB.find({}, function(err, session){
                console.log("all sessions "+session.length);
            })
        if (err){
            sendJsonResponse(res, 404, err);
        }else{
            sendJsonResponse(res, 200, session);
        }
    }
    );
};

