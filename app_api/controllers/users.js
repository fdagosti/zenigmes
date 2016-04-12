var mongoose = require("mongoose");
var users = mongoose.model("User");

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
