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
        numericAnswer: req.body.numericAnswer,
        textualAnswer: req.body.textualAnswer,
        answerExplanation: req.body.answerExplanation
    }, function(err, enigme){

        if (err){
            sendJsonResponse(res, 400, err);
        }else{
            sendJsonResponse(res, 201, enigme);
        }
    });
};

function _maskAnswers(admin, enigme){
    // if not admin, the Answers are masked
    if (!admin){
        if (enigme.numericAnswer) enigme.numericAnswer = 9999999;
        if (enigme.textualAnswer) enigme.textualAnswer = "xxxxx";
    }
}


module.exports.enigmeReadOne = function(req, res){
    if (req.params && req.params.enigmeid){

        var adminOrTeacher = req.user && (req.user.admin || req.user.teacher);
        var filter = adminOrTeacher ? {} : {"answerExplanation": 0 };
        zngm.findById(req.params.enigmeid)
        .select(filter)
        .exec(function(err, enigme){
            if (!enigme){
                sendJsonResponse(res, 404, {"message":"enigmeid not found"});
                return;
            } else if (err){
                sendJsonResponse(res, 404, err);
                return;
            }

            _maskAnswers(adminOrTeacher, enigme);
            
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
            enigme.numericAnswer = req.body.numericAnswer;
            enigme.textualAnswer = req.body.textualAnswer;
            enigme.answerExplanation = req.body.answerExplanation;
            enigme.save(function(err, enigme){
                if (err){
                    sendJsonResponse(res, 404, err);
                } else {
                    sendJsonResponse(res, 200, enigme);
                }
            });
        });
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
