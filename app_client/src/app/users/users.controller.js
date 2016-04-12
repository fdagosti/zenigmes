
(function(){
    angular.module('zenigmesApp').controller('usersCtrl', function($scope, zenigmeUsers) {
        var vm = this;
        vm.tagline = 'Jouons un peu';   

        var listUsers = function() {
            zenigmeUsers.allUsers().then(function(response){
                vm.users = response.data;
            },function(e){
                vm.error=e.data;
            });
        };

        vm.deleteUser = function(user){
            zenigmeUsers.deleteUser(user).then(function(response){
                listUsers();
            },function(e){
                console.log(e.data);
            });
        };

        listUsers();

    });
})();
