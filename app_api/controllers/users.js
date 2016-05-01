var mongoose = require("mongoose");
var users = mongoose.model("User");
var sessions = mongoose.model("sessions");
var zenigmes = mongoose.model("enigmes");
var async = require("async");


var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.usersList = function(req, res){

    users.find()
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
        users
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
    users
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
            user.name = req.body.name;
            user.email = req.body.email;
            
            user.save(function(err, user){
                if (err){
                    sendJsonResponse(res, 404, err);
                } else {
                    sendJsonResponse(res, 200, user);
                }
            });
        })
};

module.exports.userDetails = function(req, res){
    if (!req.params.userid) {
        sendJsonResponse(res, 404, {
            message: "Not found, userid is required"
        });
        return;
    }

    async.parallel([
        function(cb){
            // retrieve user detail
            users
            .findById(req.params.userid)
            .select("-hash -salt")
            .exec(
                function(err, user) {
                    cb(err, user.toObject());
                }
            ); 
        },
        function(cb){
            // retrieve participating sessions
            sessions.find(
            {participants: {$all: [req.params.userid]}},function(err, sessions){
                // transform mongoose object into plain JSON
                cb(err, sessions.map(function(session){
                    return session.toObject();
                }));
            });
        },
        function(cb){
            // retrieve all enigmes, but only title
            zenigmes.find()
            .select("-description")
            .exec(
                function(err, enigmes){
                    cb(err, enigmes);
                }
            );

            
        }
    ],
    function(err, results){
        // aggregates all results into a single user objects, 
        // and strips down all answers given from other users
        if (err){
            sendJsonResponse(res, 404, err);
        } else {
            user = results[0];
            sessions = results[1];
            allEnigmes = results[2];
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
