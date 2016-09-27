
(function(){
    angular.module('zenigmesApp').controller('elevesOverviewCtrl', function($scope, $uibModal, classes, etablissement) {
        var vm = this;
        vm.tagline = 'Jouons un peu';   


        function listUsers(){
            classes.allClasses().then(function(data){
                vm.classes = data;
            },function(error){
                vm.error = error.statusText;
            });
        }

        vm.getGravatarURL = function(email){
            return md5(email.trim().toLowerCase());
        };

        
        vm.filterByStatus = function(status){
            return function(user){
                return user.status == status;
            };
        };

        vm.getGravatarURL = function(email){
            return md5(email.trim().toLowerCase());
        };

        vm.getStudentsNbPerClass = function(classe){
            var result = 0;
            for (var i = 0; i < classe.classeNumbers.length; i++) {
                result += classe.classeNumbers[i].students.length;
            }
            return result;
        }

       
        listUsers();

    });
})();
