((function(){

angular.module('zenigmesApp').controller('classementsCtrl', function($scope, $routeParams, classementService, authentication) {
  var vm = this;

  vm.defiId = $routeParams.defiId;
  classementService.classementByDefis(vm.defiId).then(function(response){

      vm.defi = response.data;
      var currentUser = authentication.currentUser().email;
      for (var i = 0; i < vm.defi.participants.length; i++) {
        if (vm.defi.participants[i].email === currentUser){
          vm.defi.participants[i].isCurrent = true;
          break;
        }
      }
  }, function(err){
      vm.error = err.data.message;
  });

  vm.getGravatarURL = function(email){
    return md5(email.trim().toLowerCase());
  };

  vm.getItemClass = function(user){
    if (user.isCurrent){
      return "list-group-item-success";
    }
    return "";
  }


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