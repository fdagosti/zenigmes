(function(){

    angular
        .module("zenigmesApp")
        .directive("points", niveau);

    function niveau() {
        return {
            restrict : "EA",
            scope: {
                enigme: "=enigme"
            },
            templateUrl: "/common/directives/points/points.template.html",
            controller: function(){
                var vm = this;
                vm.points = function(enigme){
                    var points = parseInt(enigme.points);
                    if (points === 1){
                        return "1 point";
                    } else {
                        return points+" points";
                    }
                    

                };
                
            },
            controllerAs: "vm"
        }
    }
})();