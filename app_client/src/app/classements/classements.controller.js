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
    return user.totalPoints?user.totalPoints+" Points":"0 point";
  }
  
  
});

}))();