((function(){

angular.module('zenigmesApp').controller('mesDefisCtrl', function($scope, sessionsData, zenigmeData, authentication) {
  var vm = this;
  sessionsData.participations().then(function(res){
    vm.sessionsForUser = res;
  }).then(function(err){
      vm.error = err;
  });

  vm.getSessionEndDate = function(session){
    var enigmes = session.enigmes;
    return new Date(enigmes[enigmes.length -1].end);
  };

  // this page only displays if user is logged in, no need to check
  var user = authentication.currentUser();
  vm.isAdmin = user !== undefined? user.admin:false;

  vm.isSessionNotStartedYet = function(session){
    return new Date(session.start) > new Date(); 
  };

  vm.isSessionEnded = function(session){
    return vm.getSessionEndDate(session) < new Date(); 
  };

  vm.canAnswerEnigme = function(defi){
    return defi.enigmeDuMoment != null && !defi.enigmeDuMoment.alreadyAnswered;
  };

  var s = 1000;
  var m = 60*s;
  var h = 60*m;
  var d = 24*h;

  vm.getEnigmeDuMomentEndTime = function(defi){
    var enigmeDuMomentId = defi.enigmeDuMoment._id;
    for (var i = 0; i < defi.enigmes.length; i++) {
      if (defi.enigmes[i].enigme === enigmeDuMomentId){
        return defi.enigmes[i].end;
      }
    }
  }

  vm.sortValue = function(session){
    if (vm.canAnswerEnigme(session)){
      return 0;
    }
    if (session.enigmeDuMoment){
      return 1;
    }

    return 2;
  }

  vm.getTimeToAnswer = function(defi){
    if (!defi.enigmeDuMoment) {return "";}

    var endTime = vm.getEnigmeDuMomentEndTime(defi);
    var timeToAnswer = new Date(endTime) - new Date();

    var day = Math.floor(timeToAnswer / d);
    timeToAnswer = timeToAnswer % d;
    var hours = Math.floor(timeToAnswer / h);
    timeToAnswer = timeToAnswer % h;
    var mins = Math.floor(timeToAnswer / m);
    timeToAnswer = timeToAnswer % m;
    var secs = Math.floor(timeToAnswer / s);
    timeToAnswer = timeToAnswer % s;

    if (day !== 0){
      return day + " jours, "+hours+" heures et "+mins+" minutes";
    } else if (hours !== 0){
      return hours+" heures et "+mins+" minutes";
    } else if (mins !== 0){
      return mins+" minutes et "+secs+" secondes";
    }
    return secs+" secondes";

  }

});

}))();