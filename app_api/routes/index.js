var express = require("express");
var router = express.Router();
var jwt = require("express-jwt");
var auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: "payload"
});

var ctrlEnigmes = require("../controllers/zenigmes");
var ctrlAuth = require("../controllers/authentication");

// enigmes
router.get("/enigmes", ctrlEnigmes.enigmesList);
router.post("/enigmes", auth, ctrlEnigmes.enigmeCreate);
router.get("/enigmes/:enigmeid", ctrlEnigmes.enigmeReadOne);
router.put("/enigmes/:enigmeid", auth, ctrlEnigmes.enigmeUpdateOne);
router.delete("/enigmes/:enigmeid", auth, ctrlEnigmes.enigmeDeleteOne);

// authentication
router.post("/register", ctrlAuth.register);
router.post("/login", ctrlAuth.login);
 
module.exports = router;
