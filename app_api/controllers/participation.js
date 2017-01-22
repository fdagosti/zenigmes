var mongoose = require("mongoose");
var sessionDB = mongoose.model("sessions");
var enigmesCollection = mongoose.model("enigmes");
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

    
    console.log("parent ",req.user.parent);

    if (req.user.parent){
        sessionDB.find({},function(err, sessions){
            if (err){
                sendJsonResponse(res, 404, err);
            }else{
                sendJsonResponse(res, 200, sessions);
            }
        });
    }else{
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
        });
    }

    
};

var _enigmeInThePast = function(sessionEnigme){
    var now = new Date();
    var enigmeEnd = new Date(sessionEnigme.end);
    return (enigmeEnd < now);
};

module.exports.participationsListOne = function(req, res){
    if (req.params && req.params.sessionid){

        async.waterfall([
            function(cb){
                // retrieve the session
                sessionDB
                .findById(req.params.sessionid)
                .exec(function(err, session){
                    cb(err, session !== undefined?session.toObject():null);
                });
            },
            function(session, cb){
                //set the number of enigmes in total in the session
                session.numberOfEnigmes = session.enigmes.length;

                // filter out the future enigmes
                session.enigmes = session.enigmes.filter(_enigmeInThePast);

                // retrieve the enigmes from the session
                async.each(session.enigmes, function(sessionEnigme, asyncCb){
                    enigmesCollection
                    .findById(sessionEnigme.enigme)
                    // .select("-description")
                    .exec(function(err, enigme){
                        sessionEnigme.enigme = enigme;

                        //filter out the answers from other users
                        userAnswers = sessionEnigme.answers.filter(function(answer){
                            return answer.user === req.user.email;
                        });
                        sessionEnigme.answers = userAnswers;
                        asyncCb(err);
                    });
                }, function(err, enigmes){
                    cb(err, session);
                });
            }
        ],
        function(err, session){   
            if (err){
                sendJsonResponse(res, 404, err);
            }
            if (!session){
                sendJsonResponse(res, 404, {"message":"sessionid not found"});
                return;
            }
            sendJsonResponse(res, 200, session);
        });

    } else {
        sendJsonResponse(res, 404, {
            "message":"No sessionid in request"
        });
    }
};

module.exports.AnswersDeleteOne = function(req, res){
    
    var sessionId = req.params.sessionid;
    var enigmeId = req.params.enigmeid;
    var answerId = req.params.answerid;

    if (answerId){

        sessionDB
        .update({_id: sessionId,"enigmes.enigme":enigmeId},
                {$pull: {"enigmes.$.answers":{_id: answerId}}})
        .exec(
            function(err, session) {
                if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                sendJsonResponse(res, 204, null);
            });
    } else {
        sendJsonResponse(res, 404, {
            message : "No enigmeid"
        });
    }
    
}

module.exports.AnswersUpdateOne = function(req, res){
    
    var sessionId = req.params.sessionid;
    var enigmeId = req.params.enigmeid;
    var answerId = req.params.answerid;

    var data = JSON.parse(req.body.answer);


    if (answerId){
        sessionDB.findOne({_id: sessionId,"enigmes.enigme":enigmeId}, "enigmes.$.answers")
        .exec(function(err, result){
            var answers = result.enigmes[0].answers;
            var answer = answers.find(function(el){return el._id == answerId});
            
            answer.value = data.value;
            answer.correctValue = data.correctValue;

            sessionDB
            .update({_id: sessionId,"enigmes.enigme":enigmeId},
                    {$pull: {"enigmes.$.answers":{_id: answerId}}})
            .exec(function(err, b) {

                if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }

              sessionDB
                .update({_id: sessionId,"enigmes.enigme":enigmeId},
                {$addToSet: {"enigmes.$.answers":answer}})
                .exec(function(err, answer) {

                    if (err) {
                        sendJsonResponse(res, 404, err);
                        return;
                    }
                   
                  sendJsonResponse(res, 200, answer);
                });
            });    
        })
        
    } else {
        sendJsonResponse(res, 404, {
            message : "No enigmeid"
        });
    }
    
}

function _validateAnswer(answer, enigme){
    // doing soft validation as some answers are strings, other are numbers
    return (enigme.numericAnswer == answer.value) || (enigme.textualAnswer == answer.value);
}

module.exports.postAnswer = function(req, res){
    if (req.user.parent){
        sendJsonResponse(res, 401, {"message":"Un parent ne peut pas répondre aux enigmes"});
        return;
    }

    var sessionId = req.params.sessionid;
    var enigmeId = req.params.enigmeid;
    var answer = {
        user: req.user.email,
        value: req.body.answer
    };

    if (answer.value == undefined) {
        sendJsonResponse(res, 400, {"message":"Vous devez donner une réponse valide"});
        return;
    }

    async.parallel([
        function(cb){
            enigmesCollection
            .findById(enigmeId)
            .select("numericAnswer textualAnswer")
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