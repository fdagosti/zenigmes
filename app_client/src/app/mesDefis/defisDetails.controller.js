((function(){

angular.module('zenigmesApp').controller('defisDetailsCtrl', function($scope, $routeParams, sessionsData) {
  var vm = this;

  vm.defiId = $routeParams.defiId;
  sessionsData.participationsBySessionId(vm.defiId).then(function(response){

      vm.defi = response.data;
      vm.defi.enigmes.forEach(function(sessionEnigme){
          var l = sessionEnigme.answers.length;
          if (l == 0) return null;
          sessionEnigme.userAnswer = sessionEnigme.answers[0];
      });
      vm.defi.finishedEnigmes = vm.defi.enigmes.length;
      vm.defi.points = vm.points(vm.defi);
      vm.defiNotStarted = (new Date(vm.defi.start) > new Date()); 
      vm.defiEnded =  (vm.defi.finishedEnigmes === vm.defi.numberOfEnigmes);
  }, function(err){
      vm.error = err.data;
  });

vm.panelClassBasedOnDefiState = function(){
  if (vm.defiNotStarted){
    return "panel-danger";
  }else if (vm.defiEnded){
    return "panel-success";
  }else{
    return "panel-warning"
  }
}
  

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