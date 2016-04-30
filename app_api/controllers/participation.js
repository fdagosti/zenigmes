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

module.exports.postAnswer = function(req, res){
    var sessionId = req.params.sessionid;
    var enigmeId = req.params.enigmeid;
    var answer = {
        user: req.user.email,
        value: req.body.answer
    }

    if (answer.value == undefined) {
        sendJsonResponse(res, 400, {"message":"Vous devez donner une réponse valide"});
        return;
    }

    sessionDB.findOne({_id: sessionId}, function(err, session){
        if (err){
            sendJsonResponse(res, 400, err);
        }else {
            enigme = session.enigmes.find(function(enigme){
                return enigme.enigme === enigmeId;
            });

            if (enigme.answers.find(function(answer){
                return answer.user === req.user.email;
            }) !== undefined){
                sendJsonResponse(res, 403, {message: "Vous ne pouvez pas répondre deux fois à la même énigme, dans le même défi"});
                return;
            } 

             sessionDB.update(
            {_id: sessionId, "enigmes.enigme":enigmeId},
            {"$addToSet": {"enigmes.$.answers":answer}}, function(err){
                if (err){
                    sendJsonResponse(res, 400, err);
                } else {
                    sendJsonResponse(res, 201, answer);
                }
            });
        }
    });

   

    

};