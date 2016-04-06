(function() {
    angular
        .module("zenigmesApp")
        .controller("navigationCtrl", navigationCtrl);

    navigationCtrl.$inject = ["$scope", "$location", "authentication", "$animate"];
    function navigationCtrl($scope, $location, authentication, $animate){
        var vm = this;

        vm.currentPath = function() {
            return $location.path();
        }

        vm.isLoggedIn = authentication.isLoggedIn();

        vm.currentUser = authentication.currentUser();

        vm.logout = function() {
            authentication.logout();
            $location.path("/");
            

        };

        vm.toggleAnims = function(){
            $animate.enabled(!$animate.enabled());
        }

        vm.isAnimOn = function(){
            return $animate.enabled();
        }

       authentication.subscribe($scope, function somethingChanged() {
        console.log("Something has changed, reload navbar");
            vm.isLoggedIn = authentication.isLoggedIn();
        vm.currentUser = authentication.currentUser();        
    });
    };
})();