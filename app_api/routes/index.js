var express = require("express");
var router = express.Router();


var ctrlEnigmes = require("../controllers/zenigmes");

// locations
router.get("/enigmes", ctrlEnigmes.enigmesList);
router.post("/enigmes", ctrlEnigmes.enigmeCreate);
router.get("/enigmes/:enigmeid", ctrlEnigmes.enigmeReadOne);
router.put("/enigmes/:enigmeid", ctrlEnigmes.enigmeUpdateOne);
router.delete("/enigmes/:enigmeid", ctrlEnigmes.enigmeDeleteOne);

 
module.exports = router;
