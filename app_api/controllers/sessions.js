var mongoose = require("mongoose");
var sessionDB = mongoose.model("sessions");
var enigmesCollection = mongoose.model("enigmes");
var async = require("async");
var mails = require("./mails/mailsMessages");
var enigmeMails = require("./mails/enigmesMailScheduler");

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.sessionsList = function(req, res){
    sessionDB.find()
    .exec(
        function(err, session){
            if (err){
                sendJsonResponse(res, 404, err);
            }else{
                sendJsonResponse(res, 200, session);
            }
        }
        );
};

module.exports.sessionCreate = function(req, res){


    sessionDB.create({
        nom: req.body.nom,
        niveau: req.body.niveau,
        start: req.body.start,
        enigmes: req.body.enigmes,
        participants: req.body.participants,
        dureeEnigme: req.body.dureeEnigme,

    }, function(err, session){

        if (err){
            sendJsonResponse(res, 400, err);
        }else{
            mails.defiHasBeenCreated(req, session);
            enigmeMails.scheduleNextDefiEnigmeJob(session);
            sendJsonResponse(res, 201, session);
        }
    });
};
module.exports.sessionsListOne = function(req, res){
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
                // retrieve the enigmes from the session
                var enigmes = session.enigmes;
                async.each(enigmes, function(sessionEnigme, asyncCb){
                    enigmesCollection
                    .findById(sessionEnigme.enigme)
                    .select("-description")
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
module.exports.sessionUpdateOne = function(req, res){
    if (!req.params.sessionid) {
        sendJsonResponse(res, 404, {
            message: "Not found, sessionid is required"
        });
        return;
    }
    sessionDB
    .findById(req.params.sessionid)
    .exec(
        function(err, session) {
            if (!session){
                sendJsonResponse(res, 404, {
                    message: "sessionid not found"
                });
                return;
            } else if (err) {
                sendJsonResponse(res, 400, err);
                return;
            }
            session.nom = req.body.nom;
            session.niveau = parseInt(req.body.niveau);
            session.start = req.body.start;
            session.enigmes = req.body.enigmes;
            session.participants = req.body.participants;
            session.dureeEnigme = req.body.dureeEnigme;
            
            session.save(function(err, session){
                if (err){
                    sendJsonResponse(res, 404, err);
                } else {
                    enigmeMails.scheduleNextDefiEnigmeJob(session);
                    sendJsonResponse(res, 200, session);
                }
            });
        });
};
module.exports.sessionDeleteOne = function(req, res){

    var sessionid = req.params.sessionid;
    if (sessionid){
        sessionDB
        .findByIdAndRemove(sessionid)
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
            message : "No sessionid"
        });
    }
};

sessionDB.find().exec(function(err, sessions){
    enigmeMails.handleEnigmeMails(sessions);
});
