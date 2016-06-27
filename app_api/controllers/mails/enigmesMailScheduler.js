var schedule = require("node-schedule");
var enigmesCollection = require("mongoose").model("enigmes");
var mail = require("./mailsMessages");

var _getNearestFutureEnigme = function(defi){

  var now = new Date();
  var enigmes = defi.enigmes;
  for (var i = 0; i < enigmes.length; i++) {
    if (new Date(enigmes[i].start) > now){
      return enigmes[i];
    }
  }
  return null;
};

var jobs = {};

var scheduleNextDefiEnigmeJob = function(defi){
  var nextEnigme = _getNearestFutureEnigme(defi);
  if (nextEnigme !== null){
    if (jobs[defi._id] !== undefined){jobs[defi._id].cancel();}

    jobs[defi._id] = schedule.scheduleJob(new Date(nextEnigme.start), function(){
      enigmesCollection
      .findById(nextEnigme.enigme)
      .select("-description")
      .exec(function(err, enigme){
        jobs[defi._id] = undefined;
        mail.enigmeAboutToStart(defi, enigme);
        scheduleNextDefiEnigmeJob(defi);
      });
      
    });  
  }
  
};

var scheduleJobsForDefis = function(defis){
  var now = new Date();
  defis.forEach(function(defi){
      scheduleNextDefiEnigmeJob(defi);
  });
};

module.exports = {
  handleEnigmeMails: scheduleJobsForDefis,
  scheduleNextDefiEnigmeJob:scheduleNextDefiEnigmeJob,
};