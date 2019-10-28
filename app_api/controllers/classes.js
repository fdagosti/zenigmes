var mongoose = require("mongoose");
var usersDB = mongoose.model("User");




var sendJsonResponse = function(res, status, content) {
    res.status(status);
    res.json(content);
};



module.exports.classesList = function(req, res){
        
    usersDB.find()
    .select("-hash -salt")
    .sort({classe: 1, classeNumber: 1, name: 1})
    .exec(
        function(err, usersInClass){
            if (err){
            sendJsonResponse(res, 404, err);
            }else{
                sendJsonResponse(res, 200, usersInClass);
            }
        }
    );


};






