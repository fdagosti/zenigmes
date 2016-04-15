
(function(){
    angular.module('zenigmesApp').controller('usersCtrl', function($scope, zenigmeUsers, sessionsData) {
        var vm = this;
        vm.tagline = 'Jouons un peu';   

        var allSessions;

        var listUsers = function() {
            zenigmeUsers.allUsers().then(function(response){
                vm.users = response.data;
                syncUsersWithSessions();
            },function(e){
                vm.error=e.data;
            });
        };



        sessionsData.allSessions().then(function(response){
            allSessions = response.data;
            syncUsersWithSessions();
          },function(e){
            vm.error=e.data;
          });

        vm.deleteUser = function(user){
            zenigmeUsers.deleteUser(user).then(function(response){
                listUsers();
            },function(e){
                console.log(e.data);
            });
        };

        function syncUsersWithSessions(){
            if (!vm.users || !allSessions)
                return;

            vm.users.forEach(function(user){
                allSessions.forEach(function(session){
                    var participant = session.participants.indexOf(user._id);
                    if (participant >= 0){
                        if (!user.sessions){
                            user.sessions=[];
                        }
                        user.sessions.push(session);
                    }
                });
            });
        }

        listUsers();

    });
})();
