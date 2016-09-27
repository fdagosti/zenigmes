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

// module.exports.classeCount = function(req, res){
//     if (!req.params.classeName) {
//         sendJsonResponse(res, 404, {
//             message: "Not found, classeName is required"
//         });
//         return;
//     }

//     var query;
//     if (req.params.classeNumber){
//         query = {classe: req.params.classeName, classeNumber: req.params.classeNumber};
//     }else{
//         query = {classe: req.params.classeName};
//     }

//     usersDB.count(query)
//     .exec(
//         function(err, nbUsersInClass){
//             if (err){
//                 sendJsonResponse(res, 404, err);
//             }else{
//                 sendJsonResponse(res, 200, nbUsersInClass);
//             }
//         }
//     );
// };

// module.exports.allClassesCount = function(req, res){
//     var classes = etablissement.classes;

//     var result = {};

//     async.each(classes, function(classe, cb){

//         usersDB.count({classe: classe.name})
//         .exec(
//             function(err, nbUsersInClass){
//                 if (err){
//                     cb(err)
//                 }else{
//                     result[classe.name] = nbUsersInClass;
//                     cb();
//                 }
//             }
//         );
//     }, function(err){
//         if (err){
//             sendJsonResponse(res, 404, err);
//         }else{
//             sendJsonResponse(res, 200, result);
//         }
//     });

// };

// module.exports.classeDetail = function(req, res){
//     if (!req.params.classeName) {
//         sendJsonResponse(res, 404, {
//             message: "Not found, classeName is required"
//         });
//         return;
//     }

//     var query;
//     if (req.params.classeNumber){
//         query = {classe: req.params.classeName, classeNumber: req.params.classeNumber};
//     }else{
//         query = {classe: req.params.classeName};
//     }

//     usersDB.find(query)
//     .exec(
//         function(err, studentsInClass){
//             if (err){
//                 sendJsonResponse(res, 404, err);
//             }else{
//                 sendJsonResponse(res, 200, studentsInClass);
//             }
//         }
//     );
// };





