var mongoose = require("mongoose");
var sessionDB = mongoose.model("sessions");
var enigmesDB = mongoose.model("enigmes");
var userDB = mongoose.model("User");
var async = require("async");

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

var _sessionFromClasse = function(user){
    var classe = user.classe;
    if (classe == "6eme" || classe == "5eme"){
        return 1;
    } else if (classe == "4eme" || classe == "3eme"){
        return 2;
    } else if (classe == "2nde" || classe == "1ere" || classe == "terminale"){
        return 3;
    } 
    return 0;
};

module.exports.participationsList = function(req, res){

    sessionDB.find({ $or: [
        {participants: {$all: [req.user._id]}},
        {niveau: _sessionFromClasse(req.user)}
        ]
    },function(err, session){
        if (err){
            sendJsonResponse(res, 404, err);
        }else{
            sendJsonResponse(res, 200, session);
        }
    }
    );
};

function _validateAnswer(answer, enigme){
    // doing soft validation as some answers are strings, other are numbers
    return enigme.reponse == answer.value;
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

    async.parallel([
        function(cb){
            enigmesDB
            .findById(enigmeId)
            .select("reponse")
            .exec(function(err, enigme){
                cb(err,enigme);
            });
        },
        function(cb){
            sessionDB.findById(sessionId, function(err, session){
               cb(err, session);
            });
        }
   ], function(err, results){
        if (err){
            sendJsonResponse(res, 400, err);
        }else {
            var enigme = results[0];
            var session = results[1];

            var existingAnswers = session.enigmes.find(function(enigme){
                return enigme.enigme === enigmeId;
            }).answers;

            if (existingAnswers.find(function(answer){
                return answer.user === req.user.email;
            }) !== undefined){
                sendJsonResponse(res, 403, {message: "Vous ne pouvez pas répondre deux fois à la même énigme, dans le même défi"});
                return;
            } 

            answer.correctValue = _validateAnswer(answer, enigme);

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