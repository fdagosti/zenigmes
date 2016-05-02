
(function(){
  angular.module('zenigmesApp').controller('landingCtrl', function($scope, authentication) {
    var vm = this;

    vm.isLoggedIn = authentication.isLoggedIn();

    authentication.subscribe($scope, "landing", function() {
      vm.isLoggedIn = authentication.isLoggedIn();
    });

  });
})();
