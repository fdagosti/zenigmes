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

var statusCheck = function(req, res, next){
  if (req.user.status != "actif") return res.sendStatus(401);
  next();
};

var ctrlEnigmes = require("../controllers/zenigmes");
var ctrlAuth = require("../controllers/authentication");
var ctrlUsers = require("../controllers/users");
var ctrlSessions = require("../controllers/sessions");
var ctrlParticipations = require("../controllers/participation");
var ctrlClassements = require("../controllers/classements");

// enigmes
router.get("/enigmes", ctrlEnigmes.enigmesList);
router.post("/enigmes", auth, statusCheck, adminCheck, ctrlEnigmes.enigmeCreate);
router.get("/enigmes/:enigmeid", auth, ctrlEnigmes.enigmeReadOne);
router.put("/enigmes/:enigmeid", auth, statusCheck, adminCheck, ctrlEnigmes.enigmeUpdateOne);
router.delete("/enigmes/:enigmeid", auth, statusCheck, adminCheck, ctrlEnigmes.enigmeDeleteOne);

// authentication
router.post("/register", ctrlAuth.register);
router.post("/login", ctrlAuth.login);

// users
router.get("/users", auth, statusCheck, adminCheck, ctrlUsers.usersList);
router.delete("/users/:userid", auth, statusCheck, adminCheck, ctrlUsers.userDelete);
router.put("/users/:userid", auth, statusCheck, adminCheck, ctrlUsers.userUpdate);
router.get("/users/:userid", auth, statusCheck, ctrlUsers.userDetails);

// specific activation api
router.get("/activation/", auth, ctrlUsers.userActivated);

// sessions
router.get("/sessions", auth, statusCheck, adminCheck, ctrlSessions.sessionsList);
router.post("/sessions", auth, statusCheck, adminCheck, ctrlSessions.sessionCreate);
router.get("/sessions/:sessionid", auth, statusCheck, adminCheck, ctrlSessions.sessionsListOne);
router.put("/sessions/:sessionid", auth, statusCheck, adminCheck, ctrlSessions.sessionUpdateOne);
router.delete("/sessions/:sessionid", auth, statusCheck, adminCheck, ctrlSessions.sessionDeleteOne);

// participations
router.get("/participations", auth, statusCheck, ctrlParticipations.participationsList);
router.get("/participations/:sessionid", auth, statusCheck, ctrlParticipations.participationsListOne);

// classements
router.get("/classements/:defiId", auth, statusCheck, ctrlClassements.classementsByDefis);

// answer
router.post("/session/:sessionid/enigme/:enigmeid/answer", auth, ctrlParticipations.postAnswer);
 
module.exports = router;
