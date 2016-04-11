var mongoose = require("mongoose");
var zngm = mongoose.model("enigmes");

var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};

module.exports.enigmesList = function(req, res){
    zngm.find()
    .select("-description")
    .exec(
        function(err, enigmes){
            console.log("after DB query "+err+" "+enigmes);
            if (err){
                sendJsonResponse(res, 404, err);
            }else{
                sendJsonResponse(res, 200, enigmes);
            }
        }
        );
};

module.exports.enigmeCreate = function(req, res){
    
    zngm.create({
        titre: req.body.titre,
        description: req.body.description,
        niveau: req.body.niveau,
        points: req.body.points,
        reponse: req.body.reponse,

    }, function(err, location){

        if (err){
            sendJsonResponse(res, 400, err);
        }else{
            sendJsonResponse(res, 201, location);
        }
    });
};
module.exports.enigmeReadOne = function(req, res){
    if (req.params && req.params.enigmeid){
        zngm.findById(req.params.enigmeid).exec(function(err, enigme){
            if (!enigme){
                sendJsonResponse(res, 404, {"message":"enigmeid not found"});
                return;
            } else if (err){
                sendJsonResponse(res, 404, err);
                return;
            }
            sendJsonResponse(res, 200, enigme);
        });
    } else {
        sendJsonResponse(res, 404, {
            "message":"No enigmeid in request"
        });
    }
};
module.exports.enigmeUpdateOne = function(req, res){

    if (!req.params.enigmeid) {
        sendJsonResponse(res, 404, {
            message: "Not found, enigmeid is required"
        });
        return;
    }
    zngm
    .findById(req.params.enigmeid)
    .exec(
        function(err, enigme) {
            if (!enigme){
                sendJsonResponse(res, 404, {
                    message: "enigmeid not found"
                });
                return;
            } else if (err) {
                sendJsonResponse(res, 400, err);
                return;
            }
            enigme.titre = req.body.titre;
            enigme.description = req.body.description;
            enigme.points = parseInt(req.body.points);
            enigme.niveau = parseInt(req.body.niveau);
            enigme.reponse = req.body.reponse;
            
            enigme.save(function(err, enigme){
                if (err){
                    sendJsonResponse(res, 404, err);
                } else {
                    sendJsonResponse(res, 200, enigme);
                }
            });
        })
};
module.exports.enigmeDeleteOne = function(req, res){

    var enigmeid = req.params.enigmeid;
    if (enigmeid){
        zngm
        .findByIdAndRemove(enigmeid)
        .exec(
            function(err, enigme) {
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
};
