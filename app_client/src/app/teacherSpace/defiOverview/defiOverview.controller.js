
(function(){
  angular.module('zenigmesApp').controller('defiOverviewCtrl', function($scope, sessionsData) {
    var vm = this;

    var listDefis = function() {
        sessionsData.participations(true).then(function(data){
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

  });
})();
