(function() {
    angular
        .module("zenigmesApp")
        .controller("resetCtrl", resetCtrl);

    resetCtrl.$inject = ["$location", "$uibModal","$routeParams", "authentication"];
    function resetCtrl($location, $uibModal, $routeParams, authentication) {
        var vm = this;
        vm.pageHeader = {
            title: "Réinitialisation du mot de passe"
        };
        
        var resetToken = $routeParams.resetToken;

        vm.onSubmit = function() {
            vm.formError = "";
            if (!vm.newPassword || !vm.passwordCheck) {
                vm.formError = "Tous les champs sont requis, veuillez réessayer";
                return false;
            } else if (vm.newPassword !== vm.passwordCheck){
                vm.formError = "Les deux mots de passe ne correspondent pas";
                return false;
            } else {
                _resetPassword();
            }
        };

        var _resetPassword = function() {
            vm.formError = "";
            authentication
            .resetPassword(resetToken, vm.newPassword)
            .then(function() {
                var modalInstance = $uibModal.open({
                    templateUrl: "app/auth/reset/resetModal.template.html",
                    controller: "answerModalCtrl as vm"
                });
                modalInstance.result.then(function(data) {
                    $location.path("/");
                });
            }, function(err) {
                vm.formError = err.data.message;
            });
        };
    }
})();