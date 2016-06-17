(function() {
    angular
        .module("zenigmesApp")
        .controller("registerCtrl", registerCtrl);

    registerCtrl.$inject = ["$location", "authentication"];
    function registerCtrl($location, authentication) {
        var vm = this;

        vm.pageHeader = {
            title: "Création d'un compte pour les 'zenigmes'"
        };
        vm.credentials = {
            name: "",
            email: "",
            password: ""
        };

        vm.returnPage = $location.search().page || "/";

        vm.onSubmit = function() {
            vm.formError = "";
            if (!vm.credentials.name || !vm.credentials.email || !vm.credentials.password) {
                vm.formError = "Tous les champs sont requis !";
                return false;
            } else {
                vm.doRegister();
            }
        };

        vm.doRegister = function() {
            vm.formError = "";
            authentication
                .register(vm.credentials)
                .then(function() {
                    $location.search("page", null);
                    $location.path(vm.returnPage);
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