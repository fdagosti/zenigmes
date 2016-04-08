
(function(){
    angular.module('zenigmesApp').controller('usersCtrl', function($scope, zenigmeUsers) {
        var vm = this;
        vm.tagline = 'Jouons un peu';   

        console.log("user controller");
                
        var listUsers = function() {
            zenigmeUsers.allUsers().success(function(data){
            vm.users = data;
            
        })
        .error(function(e){
            vm.error=e;
        });
    };

        vm.deleteUser = function(user){
            zenigmeUsers.deleteUser(user).success(function(data){
                listUsers();
            }).error(function(e){
                console.log(e);
            });
        }

        listUsers();

    });
})();
