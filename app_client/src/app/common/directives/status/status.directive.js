(function(){

    angular
        .module("zenigmesApp")
        .directive("userStatus", statusFn);

    function statusFn() {
        return {
            restrict : "EA",
            scope: {
                user: "=user",
                "save": "&saveStatus"
            },
            templateUrl: "app/common/directives/status/status.template.html",
            controller: function(){
                var vm = this;
                vm.getStatusText = function(status){
                    
                    if (status === "actif"){
                        return "Validé";
                    } else if (status === "enValidation"){
                        return "En Validation";
                    } else{
                        return "Erreur: "+status;
                    }

                };
                vm.getStatusClass = function(status){
                    if (status === "actif"){
                        return "btn btn-success";
                    } else if (status === "en Validation"){
                        return "btn btn-warning";
                    } else{
                        return "btn btn-danger";
                    }
                };
            },
            controllerAs: "vm"
        };
    }
})();