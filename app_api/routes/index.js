var express = require("express");
var router = express.Router();
var jwt = require("express-jwt");
var auth = jwt({
    secret: process.env.JWT_SECRET,
   
});

var adminCheck = function(req, res, next){
    if (!req.user.admin) return res.sendStatus(401);
    next();
};

var ctrlEnigmes = require("../controllers/zenigmes");
var ctrlAuth = require("../controllers/authentication");
var ctrlUsers = require("../controllers/users");
var ctrlSessions = require("../controllers/sessions");
var ctrlParticipations = require("../controllers/participation");

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

// sessions
router.get("/sessions", auth, adminCheck, ctrlSessions.sessionsList);
router.post("/sessions", auth, adminCheck, ctrlSessions.sessionCreate);
router.get("/sessions/:sessionid", auth, adminCheck, ctrlSessions.sessionsListOne);
router.put("/sessions/:sessionid", auth, adminCheck, ctrlSessions.sessionUpdateOne);
router.delete("/sessions/:sessionid", auth, adminCheck, ctrlSessions.sessionDeleteOne);

// participations
router.get("/participations", auth, ctrlParticipations.participationsList);

// answer
router.post("/session/:sessionid/enigme/:enigmeid/answer", auth, ctrlParticipations.postAnswer);
 
module.exports = router;
