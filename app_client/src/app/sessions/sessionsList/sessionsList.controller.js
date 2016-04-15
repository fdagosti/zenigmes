
(function(){
    angular.module('zenigmesApp').controller('sessionsCtrl', function($scope, sessionsData, zenigmeData) {
        var vm = this;
        vm.tagline = 'Jouons un peu';   

        var listSessions = function() {
            sessionsData.allSessionsWithEnigmes().then(function(data){
                vm.sessions = data;
            });
        };

        listSessions();

        vm.deleteSession = function(session){
            sessionsData.deleteSession(session).then(function(){
                listSessions();
            }, function(err){
                console.log(err);
            });
        };

    });
})();
