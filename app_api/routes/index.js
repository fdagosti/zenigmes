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

var profOrAdminCheck = function(req, res, next){
    if (!req.user.admin && !req.user.teacher) return res.sendStatus(401);
    next();
};

var statusCheck = function(req, res, next){
  if (req.user.status != "actif") return res.sendStatus(401);
  next();
};

var ctrlEnigmes = require("../controllers/zenigmes");
var ctrlAuth = require("../controllers/authentication");
var ctrlUsers = require("../controllers/users");
var ctrlClasses = require("../controllers/classes");
var ctrlSessions = require("../controllers/sessions");
var ctrlParticipations = require("../controllers/participation");
var ctrlClassements = require("../controllers/classements");
var ctrlContact = require("../controllers/contact");

// enigmes
router.get("/enigmes", auth, profOrAdminCheck, ctrlEnigmes.enigmesList);
router.post("/enigmes", auth, statusCheck, adminCheck, ctrlEnigmes.enigmeCreate);
router.get("/enigmes/:enigmeid", auth, ctrlEnigmes.enigmeReadOne);
router.put("/enigmes/:enigmeid", auth, statusCheck, adminCheck, ctrlEnigmes.enigmeUpdateOne);
router.delete("/enigmes/:enigmeid", auth, statusCheck, adminCheck, ctrlEnigmes.enigmeDeleteOne);

// authentication
router.post("/register", ctrlAuth.register);
router.post("/login", ctrlAuth.login);
router.post("/forgot", ctrlAuth.forgot);
router.post("/reset/:token", ctrlAuth.reset);

// users
router.get("/users", auth, statusCheck, profOrAdminCheck, ctrlUsers.usersList);
router.delete("/users/:userid", auth, statusCheck, adminCheck, ctrlUsers.userDelete);
router.put("/users/:userid", auth, statusCheck, adminCheck, ctrlUsers.userUpdate);
router.get("/users/:userid", auth, statusCheck, ctrlUsers.userDetails);

// classes
router.get("/classes/", auth, statusCheck, profOrAdminCheck, ctrlClasses.classesList);
// router.get("/classes/:classeName", auth, statusCheck, profOrAdminCheck, ctrlClasses.classeDetail);
// router.get("/classes/:classeName/count", auth, statusCheck, profOrAdminCheck, ctrlClasses.classeCount);
// router.get("/classes/:classeName/:classeNumber", auth, statusCheck, profOrAdminCheck, ctrlClasses.classeDetail);
// router.get("/classes/:classeName/:classeNumber/count", auth, statusCheck, profOrAdminCheck, ctrlClasses.classeCount);


// specific activation api
router.get("/activation/", auth, ctrlUsers.userActivated);

// sessions
router.get("/sessions", auth, statusCheck, profOrAdminCheck, ctrlSessions.sessionsList);
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
router.post("/session/:sessionid/enigme/:enigmeid/answer", auth, statusCheck, ctrlParticipations.postAnswer);
router.delete("/session/:sessionid/enigme/:enigmeid/answer/:answerid", auth, statusCheck, ctrlParticipations.AnswersDeleteOne);
router.put("/session/:sessionid/enigme/:enigmeid/answer/:answerid", auth, statusCheck, ctrlParticipations.AnswersUpdateOne);

// admin ask
router.post("/ask", auth, ctrlContact.askAdmins);
 
module.exports = router;
