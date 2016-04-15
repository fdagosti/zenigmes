var mongoose = require("mongoose");
var sessionDB = mongoose.model("sessions");

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
    console.log("Creating a session array = "+req.body.enigmes);

    var tab = req.body.enigmes;

    for (i = 0; i < tab.length; i++){
        console.log("tab["+i+"] = "+tab[i].enigme+" "+tab[i].start+" "+tab[i].end);
    }

    sessionDB.create({
        nom: req.body.nom,
        niveau: req.body.niveau,
        start: req.body.start,
        enigmes: req.body.enigmes

    }, function(err, session){

        if (err){
            sendJsonResponse(res, 400, err);
        }else{
            sendJsonResponse(res, 201, session);
        }
    });
};
module.exports.sessionsListOne = function(req, res){
    if (req.params && req.params.sessionid){
        sessionDB.findById(req.params.sessionid).exec(function(err, session){
            if (!session){
                sendJsonResponse(res, 404, {"message":"sessionid not found"});
                return;
            } else if (err){
                sendJsonResponse(res, 404, err);
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
            
            session.save(function(err, session){
                if (err){
                    sendJsonResponse(res, 404, err);
                } else {
                    sendJsonResponse(res, 200, session);
                }
            });
        })
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
