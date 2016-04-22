var mongoose = require("mongoose");
var sessionDB = mongoose.model("sessions");
var userDB = mongoose.model("User");

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.participationsList = function(req, res){
    sessionDB.find({
        participants: {$all: [req.user._id]}
    },function(err, session){
        if (err){
            sendJsonResponse(res, 404, err);
        }else{
            sendJsonResponse(res, 200, session);
        }
    }
    );
};

