
(function(){
    angular.module('zenigmesApp').controller('usersCtrl', function($scope, $uibModal, sessionsData, zenigmeUsers, etablissement) {
        var vm = this;
        vm.tagline = 'Jouons un peu';   

        vm.classes = etablissement.getEtablissement().classes;

        vm.deleteUser = function(user){

            var modalInstance = $uibModal.open({
                templateUrl: "app/common/modals/confirmActionModal.template.html",
                controller: "genericModalCtrl as vm"
            });

            modalInstance.result.then(function(deleteUser) {
                if (deleteUser){
                    zenigmeUsers.deleteUser(user).then(function(response){
                        listUsers();
                    },function(e){
                        listUsers();
                        vm.error = e.data;
                    });
                }
            });
        };

        function listUsers(){
            sessionsData.allUsersWithSessions().then(function(data){
                vm.users = data;
            },function(error){
                vm.error = error.statusText;
            });
        }

        vm.getGravatarURL = function(email){
            return md5(email.trim().toLowerCase());
        };

        vm.updateUser = function(user){
            zenigmeUsers.updateUser(user).then(function(response){
                listUsers();
            }, function(e){
                listUsers();
                vm.error = e.data;
            });
        };

        vm.filterByStatus = function(status){
            return function(user){
                return user.status == status;
            };
        };

        vm.getClasseNumbersFromClasse = function(classeDbValue){
            for (var i = 0; i < vm.classes.length; i++) {
                if (vm.classes[i].dbValue === classeDbValue){
                    return vm.classes[i].classNumbers;
                }
            }
        };

        listUsers();

    });
})();
