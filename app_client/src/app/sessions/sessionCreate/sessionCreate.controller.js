(function() {

    angular
    .module("zenigmesApp")
    .controller("sessionCreateCtrl", sessionCreateCtrl);

    function sessionCreateCtrl($scope, $location, sessionsData){

        var vm = this;
        vm.pageHeader = {   
            title: "Nouveau Défi",
            strapline: "Une série d'énigmes étalées dans le temps"
        };
        vm.buttonTitle = "Créer un défi";

        vm.session = {};
        vm.session.niveau = 1;
        vm.session.dureeEnigme = 7;
        vm.session.start = new Date();


        $scope.createOrUpdateSession = function(){
            sessionsData.addSession(vm.session)
            .then(function(){
                $location.path("/");
            }, function(err){
                vm.formError = err.data;
            });
        };
    }
})();