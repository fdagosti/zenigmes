(function() {

    angular
    .module("zenigmesApp")
    .controller("sessionUpdateCtrl", sessionUpdateCtrl);

    function sessionUpdateCtrl($scope, $location, sessionsData, $routeParams){

        var vm = this;
        vm.pageHeader = {   
            title: "Modifier Session",
            strapline: "Une série d'énigmes étalées dans le temps"
        };

        vm.buttonTitle = "Mettre à jour la session";

        vm.session = {};
        vm.session.niveau = 1;
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