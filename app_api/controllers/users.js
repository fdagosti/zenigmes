var mongoose = require("mongoose");
var usersDB = mongoose.model("User");
var sessionDB = mongoose.model("sessions");
var zenigmesDB = mongoose.model("enigmes");
var async = require("async");
var mails = require("./mails/mailsMessages");


var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.usersList = function(req, res){

    usersDB.find()
    .select("-hash -salt")
    .exec(
        function(err, users){
            if (err){
                sendJsonResponse(res, 404, err);
            }else{
                sendJsonResponse(res, 200, users);
            }
        }
        );
};

module.exports.userDelete = function(req, res){

    var userid = req.params.userid;
    if (userid){
        usersDB
        .findByIdAndRemove(userid)
        .exec(
            function(err, user) {
                if (err) {
                    sendJsonResponse(res, 404, err);
                    return;
                }
                sendJsonResponse(res, 204, null);
            });
    } else {
        sendJsonResponse(res, 404, {
            message : "No userid"
        });
    }
};
module.exports.userUpdate = function(req, res){

    if (!req.params.userid) {
        sendJsonResponse(res, 404, {
            message: "Not found, userid is required"
        });
        return;
    }
    usersDB
    .findById(req.params.userid)
    .exec(
        function(err, user) {
            if (!user){
                sendJsonResponse(res, 404, {
                    message: "userid not found"
                });
                return;
            } else if (err) {
                sendJsonResponse(res, 400, err);
                return;
            }
            
            // check if this action is activating the user
            var userActivated = user.status === "enValidation" && req.body.status === "actif";

            user.name = req.body.name;
            user.email = req.body.email;
            user.role = req.body.role;
            user.classe = req.body.classe;
            user.status = req.body.status;

            
            user.save(function(err, user){
                if (err){
                    sendJsonResponse(res, 404, err);
                } else {
                    if (userActivated){mails.accountValidated(req, user);}
                    sendJsonResponse(res, 200, user);
                }
            });
        });
};

module.exports.userActivated = function(req, res){
    usersDB.findById(req.user._id).select("status")
    .exec(function(err, user) {
            if (err){
                sendJsonResponse(res, 404, err);
            }else {
                sendJsonResponse(res, 200, user);
            }
        }
    );
};

module.exports.userDetails = function(req, res){
    if (!req.params.userid) {
        sendJsonResponse(res, 404, {
            message: "Not found, userid is required"
        });
        return;
    }

    var _niveauFromClasse = function(user){
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

    async.waterfall([
        function(cb){
            // retrieve user detail
            usersDB
            .findById(req.params.userid)
            .select("-hash -salt")
            .exec(
                function(err, user) {
                    cb(err, user !== undefined? user.toObject():null);
                }
            ); 
        },
        function(user, cb){
            // retrieve participating sessions
            sessionDB.find(
            { $or: [
                {participants: {$all: [user._id]}},
                {niveau: _niveauFromClasse(user)}
            ]} ,function(err, sessions){
                // transform mongoose object into plain JSON
                cb(err, user, sessions.map(function(session){
                    return session.toObject();
                }));
            });
        },
        function(user, sessions, cb){
            // retrieve all enigmes, but only title
            zenigmesDB.find()
            .select("-description")
            .exec(
                function(err, enigmes){
                    cb(err, user, sessions, enigmes);
                }
            );
        }
    ],
    function(err, user, sessions, allEnigmes){
        // aggregates all results into a single user objects, 
        // and strips down all answers given from other users
        if (err){
            sendJsonResponse(res, 404, err);
        } else {

            sessions.forEach(function(session){
                session.enigmes.forEach(function(enigme){
                    //filter out the answers from other users
                    userAnswers = enigme.answers.filter(function(answer){
                        return answer.user === user.email;
                    });
                    enigme.answers = userAnswers;

                    enigme.enigme = allEnigmes.find(function(enigmeInDb){
                        return (enigmeInDb._id.toString() === enigme.enigme);
                    });
                });
            });
            user.sessions = sessions;
            sendJsonResponse(res, 200, user);
        }
    });
};
