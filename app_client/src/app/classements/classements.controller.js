((function(){

angular.module('zenigmesApp').controller('classementsCtrl', function($scope, $routeParams, classementService) {
  var vm = this;

  vm.defiId = $routeParams.defiId;
  classementService.classementByDefis(vm.defiId).then(function(response){

      vm.defi = response.data;
  }, function(err){
      vm.error = err.data.message;
  });

  vm.getNombreDePoints = function(user){
    var tp = user.totalPoints;
    if (!user.answeredOnce){
      return "Jamais repondu";
    }else if (tp < 2){
      return tp + " point";
    }else {
      return tp + " points";
    }
  };
  
  
});

}))();