(function() {
    angular
        .module("zenigmesApp")
        .controller("navigationCtrl", navigationCtrl);

    navigationCtrl.$inject = ["$location", "authentication"];
    function navigationCtrl($location, authentication){
        var vm = this;

        vm.currentPath = $location.path();

        vm.isLoggedIn = authentication.isLoggedIn();

        vm.currentUser = authentication.currentUser();
console.log("logged in ? "+vm.isLoggedIn);
console.log("current user ? "+vm.currentUser);
        vm.logout = function() {
            authentication.logout();
            $location.path("/");
        };
    };
})();