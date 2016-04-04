(function(){

    angular
        .module("zenigmesApp")
        .directive("niveau", niveau);

    function niveau() {
        return {
            restrict : "EA",
            scope: {
                enigme: "=enigme"
            },
            templateUrl: "/common/directives/niveau/niveau.template.html",
            controller: function(){
                var vm = this;
                vm.getLevelText = function(enigme){
                    var level = parseInt(enigme.niveau);
                    if (level === 1){
                        return "6ème/5ème";
                    } else if (level === 2){
                        return "4ème/3ème";
                    } else if (level === 3){
                        return "Lycée";
                    }else{
                        return "Error !!";
                    }

                };
                vm.getLevelClass = function(enigme){
                     var level = parseInt(enigme.niveau);
                    if (level === 1){
                        return "label-success";
                    } else if (level === 2){
                        return "label-warning";
                    } else if (level === 3){
                        return "label-danger";
                    }else{
                        return "Error !!";
                    }
                };
            },
            controllerAs: "vm"
        }
    }
})();