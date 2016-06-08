
(function(){
    angular.module('zenigmesApp').controller('usersCtrl', function($scope, zenigmeUsers) {
        var vm = this;
        vm.tagline = 'Jouons un peu';   

        vm.deleteUser = function(user){
            zenigmeUsers.deleteUser(user).then(function(response){
                listUsers();
            },function(e){
                vm.error = e;
            });
        };

        function listUsers(){
            zenigmeUsers.allUsersWithSessions().then(function(data){
                vm.users = data;
            });
        }

        vm.getGravatarURL = function(email){
            return md5(email.trim().toLowerCase());
        };

        vm.updateUser = function(user){
            zenigmeUsers.updateUser(user).then(function(response){
                listUsers();
            }, function(e){
                vm.error = e;
            });
        };

        vm.filterByStatus = function(status){
            return function(user){
                return user.status == status;
            };
        };

        listUsers();

    });
})();
