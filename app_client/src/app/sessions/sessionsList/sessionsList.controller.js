
(function(){
    angular.module('zenigmesApp').controller('sessionsCtrl', function($scope, $uibModal, sessionsData) {
        var vm = this;

        var listSessions = function() {
            sessionsData.allSessionsWithEnigmes().then(function(data){
                vm.sessions = data;
            });
        };

        listSessions();

        vm.deleteSession = function(session){

            var modalInstance = $uibModal.open({
                templateUrl: "app/common/modals/confirmActionModal.template.html",
                controller: "genericModalCtrl as vm"
            });

            modalInstance.result.then(function(deleteDefi) {
                if (deleteDefi){
                    sessionsData.deleteSession(session).then(function(){
                        listSessions();
                    }, function(err){
                        console.log(err);
                    });
                }
            });

        };

    });
})();
