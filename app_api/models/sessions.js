var mongoose = require("mongoose");

var answerSchema = new mongoose.Schema({
  user: {type: String, required: true},
  answerDate: {type: Date, "default": Date.now},
  value: {type: String, required: true},
  correctValue: Boolean
});

var enigmesCollectionSchema = new mongoose.Schema({
  enigme: {type: String, required: true},
  start: {type: Date, required: true},
  end: {type: Date, required: true},
  answers: [answerSchema]
});

var sessionSchema = new mongoose.Schema({
  nom: {type: String, required: true},
  niveau: {type: Number, "default": 1, min: 1, max: 3},
  start: {type: Date, required: true},
  enigmes: [enigmesCollectionSchema],
  participants: [String] 
});

mongoose.model("sessions", sessionSchema);