(function() {

    angular
    .module("zenigmesApp")
    .controller("sessionUpdateCtrl", sessionUpdateCtrl);

    function sessionUpdateCtrl($scope, $location, sessionsData, $routeParams){

        var vm = this;
        vm.pageHeader = {   
            title: "Modifier le défi",
            strapline: "Une série d'énigmes étalées dans le temps"
        };

        vm.buttonTitle = "Mettre à jour le défi";

        vm.session = {};
        vm.session.niveau = 1;
        vm.session.dureeEnigme = 7;
        vm.session.start = new Date();

        sessionsData.sessionById($routeParams.sessionId).then(function(response){
            response.data.start = new Date(response.data.start);
            vm.session = response.data;
            vm.session.enigmes = response.data.enigmes;
        }, function(err){
            console.log(err);
        });

        $scope.createOrUpdateSession = function(){
            sessionsData.updateSession(vm.session)
            .then(function(){
                $location.path("/");
            }, function(err){
                vm.formError = err.data;
            });
        };
    }
})();