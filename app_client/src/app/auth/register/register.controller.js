(function() {
    angular
        .module("zenigmesApp")
        .controller("registerCtrl", registerCtrl);


    

    registerCtrl.$inject = ["$location", "$uibModal", "authentication", "etablissement"];
    function registerCtrl($location, $uibModal, authentication, etablissement) {
        var vm = this;
        vm.classes = etablissement.getEtablissement().classes;
        vm.etablissements = etablissement.getEtablissement().names;

        vm.pageHeader = {
            title: "Création d'un compte pour les 'zenigmes'"
        };
        vm.credentials = {
            name: "",
            email: "",
            email2: "",
            password: ""
        };        

        vm.returnPage = $location.search().page || "/";

        vm.onSubmit = function() {
            vm.formError = "";
            if (!vm.credentials.name || !vm.credentials.email || !vm.credentials.password) {
                vm.formError = "Tous les champs sont requis !";
                return false;
            } else if (vm.credentials.email != vm.credentials.email2){
                vm.formError = "Votre adresse E-mail n'est pas identique dans les deux champs";
                return false;
            }else {
                vm.doRegister();
            }
        };

        vm.doRegister = function() {
            vm.formError = "";
            authentication
                .register(vm.credentials)
                .then(function() {

                    var modalInstance = $uibModal.open({
                        templateUrl: "app/auth/register/registerModal.template.html",
                        controller: "genericModalCtrl as vm"
                    });
                    modalInstance.result.then(function(data) {
                        $location.search("page", null);
                        $location.path(vm.returnPage);
                  });

                    
                }, function(response) {
                    if (response.data.code===11000){
                        vm.formError = "L'adresse Email est déja utilisée";
                    }else{
                        vm.formError = response.data;
                    }
                });
        };
    }
})();