((function(){

angular.module('zenigmesApp').controller('classementsCtrl', function($scope, $routeParams, classementService, authentication, etablissement) {
  var vm = this;

  vm.classes = etablissement.getEtablissement().classes;

  vm.deleteClassNumberFilter = function(){
    delete vm.filtre["classeNumber"];
  };

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

  var previousPoints;
  var previousClassement;
  vm.getClassement = function(points, idx, first){
    var classement;
    if (!first && points === previousPoints){
      classement = previousClassement;
    }else{
      classement = idx+1;
    }
    previousPoints = points;
    previousClassement = classement;
    return classement;
  }

  vm.min = function(arr) {
    var v = parseInt(arr.$key);
    return -v;
  }


  vm.getNombreDePoints = function(user){
    var tp = user.totalPoints;
    if (!user.answeredOnce){
      return "0 point";
    }else if (tp < 2){
      return tp + " point";
    }else {
      return tp + " points";
    }
  };
  
  
});

}))();