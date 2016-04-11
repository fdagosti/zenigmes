var express = require("express");
var router = express.Router();
var jwt = require("express-jwt");
var auth = jwt({
    secret: process.env.JWT_SECRET,
   
});

var adminCheck = function(req, res, next){
    console.log("Admin Check");
    if (!req.user.admin) return res.sendStatus(401);
    next();
};

var ctrlEnigmes = require("../controllers/zenigmes");
var ctrlAuth = require("../controllers/authentication");
var ctrlUsers = require("../controllers/users");

// enigmes
router.get("/enigmes", ctrlEnigmes.enigmesList);
router.post("/enigmes", auth, adminCheck, ctrlEnigmes.enigmeCreate);
router.get("/enigmes/:enigmeid", ctrlEnigmes.enigmeReadOne);
router.put("/enigmes/:enigmeid", auth, adminCheck, ctrlEnigmes.enigmeUpdateOne);
router.delete("/enigmes/:enigmeid", auth, adminCheck, ctrlEnigmes.enigmeDeleteOne);

// authentication
router.post("/register", ctrlAuth.register);
router.post("/login", ctrlAuth.login);

// users
router.get("/users", auth, adminCheck, ctrlUsers.usersList);
router.delete("/users/:userid", auth, adminCheck, ctrlUsers.userDelete);
router.put("/users/:userid", auth, adminCheck, ctrlUsers.userUpdate);

 
module.exports = router;
