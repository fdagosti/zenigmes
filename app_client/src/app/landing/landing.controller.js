
(function(){
  angular.module('zenigmesApp').controller('landingCtrl', function($scope, authentication, sessionsData) {
    var vm = this;

    vm.isLoggedIn = authentication.isLoggedIn();

    authentication.subscribe($scope, "landing", function() {
      vm.isLoggedIn = authentication.isLoggedIn();
    });

    

    vm.areButtonEnabled = function(){
      console.log("are buttons enabled ", vm.participations)
      return vm.participations && vm.participations.length >0;
    };

    if (vm.isLoggedIn){
      sessionsData.participations().then(function(participations){
          vm.participations = participations;
          vm.mostRecentDefi = vm.participations[0] && vm.participations[0]._id;
        }).then(function(err){
          vm.error = err;
        });
    }

  });
})();
