var mongoose = require("mongoose");


var enigmeSchema = new mongoose.Schema({
    titre: {type: String, required: true},
    description: {type: String, required: true},
    niveau: {type: Number, "default": 1, min: 1, max: 3},
    points: {type: Number, "default": 1, min: 1, max: 3},
    trivia: String,
});

mongoose.model("enigmes", enigmeSchema);