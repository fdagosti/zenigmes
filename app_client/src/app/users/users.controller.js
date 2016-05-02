
(function(){
    angular.module('zenigmesApp').controller('usersCtrl', function($scope, zenigmeUsers) {
        var vm = this;
        vm.tagline = 'Jouons un peu';   

        vm.deleteUser = function(user){
            zenigmeUsers.deleteUser(user).then(function(response){
                listUsers();
            },function(e){
                console.log(e.data);
            });
        };

        function listUsers(){
        zenigmeUsers.allUsersWithSessions().then(function(data){
            vm.users = data;
        });

        vm.getGravatarURL = function(email){
            return md5(email.trim().toLowerCase());
        }
    }

    listUsers();

    });
})();
