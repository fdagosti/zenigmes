
(function(){
  angular.module('zenigmesApp').controller('defiOverviewCtrl', function($scope, sessionsData) {
    var vm = this;

    var listDefis = function() {
        sessionsData.allSessionsWithEnigmes(true).then(function(data){
            vm.defis = data;
        });
    };

    listDefis();

    vm.filterByLevel = function(level){
      return function(defi){
        return defi.niveau == level;
      };
    };

    vm.niveaux = [1,2,3];

    vm.isSessionNotStartedYet = function(defi){
    return new Date(defi.start) > new Date(); 
  };

   vm.getEnigmeDuMomentEndTime = function(defi){
    var enigmeDuMomentId = defi.enigmeDuMoment._id;
    for (var i = 0; i < defi.enigmes.length; i++) {
      if (defi.enigmes[i].enigme._id === enigmeDuMomentId){
        return defi.enigmes[i].end;
      }
    }
  };

   var s = 1000;
  var m = 60*s;
  var h = 60*m;
  var d = 24*h;
  var w = 7*d;

  vm.defiDuration = function(defi){
    var start = new Date(defi.start).getTime();
    var end = vm.getSessionEndDate(defi).getTime();
    var duration = end - start;

    var week = Math.floor(duration / w);
    duration = duration % w;
    var day = Math.floor(duration / d);
    duration = duration % d;
    var hours = Math.floor(duration / h);
    duration = duration % h;
    var mins = Math.floor(duration / m);
    duration = duration % m;
    var secs = Math.floor(duration / s);
    duration = duration % s;

    if (week !== 0){
      return week + (week === 1?" semaine":" semaines");
    } else if (day !== 0){
      return day + " jours";
    } else if (hours !== 0){
      return hours+" heures";
    } else if (mins !== 0){
      return mins+" minutes";
    }
    return secs+" secondes";

  }

  vm.isSessionEnded = function(defi){
    return vm.getSessionEndDate(defi) < new Date(); 
  };

  vm.getSessionEndDate = function(defi){
    var enigmes = defi.enigmes;
    return new Date(enigmes[enigmes.length -1].end);
  };

  vm.orderByDefi = function(defi){
    if (defi.enigmeDuMoment){
      return 1;
    }
    if (vm.isSessionNotStartedYet(defi)){
      return 2;
    }
    var endDate = vm.getSessionEndDate(defi);
    return (new Date).getTime() - endDate;
  };

  });
})();
