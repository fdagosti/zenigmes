var mongoose = require("mongoose");
var zngm = mongoose.model("zenigmes");

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.enigmesList = function(req, res){
    zngm.find()
    .exec(
        function(err, enigmes){
            console.log("after DB query "+err+" "+enigmes);
            sendJsonResponse(res, 200, enigmes);
        }
        );
};

module.exports.enigmeCreate = function(req, res){
        sendJsonResponse(res, 200);
};
module.exports.enigmeReadOne = function(req, res){
        sendJsonResponse(res, 200);
};
module.exports.enigmeUpdateOne = function(req, res){
        sendJsonResponse(res, 200);
};
module.exports.enigmeDeleteOne = function(req, res){
        sendJsonResponse(res, 200);
};
