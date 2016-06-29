(function() {
    angular
        .module("zenigmesApp")
        .controller("forgotCtrl", forgotCtrl);

    forgotCtrl.$inject = ["$location", "$uibModal", "authentication"];
    function forgotCtrl($location, $uibModal, authentication) {
        var vm = this;

        vm.pageHeader = {
            title: "Mot de passe oublié ?"
        };

        vm.onSubmit = function() {
            vm.formError = "";
            if (!vm.email) {
                vm.formError = "Tous les champs sont requis, veuillez réessayer";
                return false;
            } else {
                _forgotRequest();
            }
        };

        var _forgotRequest = function() {
            vm.formError = "";
            authentication
                .forgotPassword(vm.email)
                .then(function() {
                    var modalInstance = $uibModal.open({
                        templateUrl: "app/auth/forgot/forgotModal.template.html",
                        controller: "answerModalCtrl as vm"
                    });
                    modalInstance.result.then(function(data) {
                        $location.path("/");
                    });
                }, function(err) {
                    vm.formError = err.data;
                });
        };
    }
})();