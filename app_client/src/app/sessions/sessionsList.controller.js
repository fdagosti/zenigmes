
(function(){
    angular.module('zenigmesApp').controller('sessionsCtrl', function($scope, sessionsData, zenigmeData) {
        var vm = this;
        vm.tagline = 'Jouons un peu';   

        function createCBFunction(enigmeWrapper){
            return function(response){
                enigmeWrapper.enigme = response.data;
            };
        }

        function errCb(){
            return function(err){
                console.log("ERROR retrieving an enigme "+err);
            };
        }

        var listSessions = function() {

            sessionsData.allSessions().then(function(response){
                vm.sessions = response.data;

                vm.sessions.forEach(function(data){
                    data.enigmes.forEach(function(enigme){
                        zenigmeData.enigmeById(enigme.enigme).then(
                        createCBFunction(enigme), errCb());                            
                    });
                });
                
            },function(e){
                vm.error=e.data;
            });
        };

        listSessions();

        vm.deleteSession = function(session){
            sessionsData.deleteSession(session).then(function(){
                listSessions();
            }, function(err){
                console.log(err);
            });
        }

    });
})();
