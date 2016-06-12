((function(){

angular.module('zenigmesApp').controller('defisDetailsCtrl', function($scope, $routeParams, sessionsData) {
  var vm = this;

  vm.defiId = $routeParams.defiId;
  sessionsData.sessionById(vm.defiId).then(function(response){

      vm.defi = response.data;
      vm.defi.enigmes.forEach(function(sessionEnigme){
          var l = sessionEnigme.answers.length;
          if (l == 0) return null;
          sessionEnigme.userAnswer = sessionEnigme.answers[0];
      });
      vm.defi.finishedEnigmes = countNumberOfEnigmesAlreadyShown();
      vm.defi.points = vm.points(vm.defi);
  }, function(err){
      vm.error = err.data;
  });

  var countNumberOfEnigmesAlreadyShown = function(){
    var now = new Date();
    var count = 0;
    vm.defi.enigmes.forEach(function(sessionEnigme){
      if (new Date(sessionEnigme.start) < now){
        count++
      }
    });
    return count;
  };

  vm.points = function(session){
    var points = 0;
    session.enigmes.forEach(function(enigme){
        enigme.answers.forEach(function(answer){
            if (answer.correctValue){
                points+=enigme.enigme.points;
            }
        });
        
    });
    return points;
  };
  
  
});

}))();