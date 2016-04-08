var express = require("express");
var router = express.Router();
var jwt = require("express-jwt");
var auth = jwt({
    secret: process.env.JWT_SECRET,
    userProperty: "payload"
});

var ctrlEnigmes = require("../controllers/zenigmes");
var ctrlAuth = require("../controllers/authentication");
var ctrlUsers = require("../controllers/users");

// enigmes
router.get("/enigmes", ctrlEnigmes.enigmesList);
router.post("/enigmes", auth, ctrlEnigmes.enigmeCreate);
router.get("/enigmes/:enigmeid", ctrlEnigmes.enigmeReadOne);
router.put("/enigmes/:enigmeid", auth, ctrlEnigmes.enigmeUpdateOne);
router.delete("/enigmes/:enigmeid", auth, ctrlEnigmes.enigmeDeleteOne);

// authentication
router.post("/register", ctrlAuth.register);
router.post("/login", ctrlAuth.login);

// users
router.get("/users", auth, ctrlUsers.usersList);
router.delete("/users/:userid", auth, ctrlUsers.userDelete);
router.put("/users/:userid", auth, ctrlUsers.userUpdate);

 
module.exports = router;
