
(function(){
    angular.module('zenigmesApp').controller('elevesOverviewCtrl', function($scope, $uibModal, classes, etablissement) {
        var vm = this;
        vm.tagline = 'Jouons un peu';   


        function listUsers(){
            classes.allClasses().then(function(data){
                vm.classes = data;
                _computeTotalStudentNumber();
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

        _computeTotalStudentNumber = function(){
            var totalStudents = totalClasses = 0;
            vm.classes.forEach(function(classe){
                if (classe.className !== "externe"){
                    totalClasses += classe.classeNumbers.length;
                    totalStudents += vm.getStudentsNbPerClass(classe);
                }
            });
            vm.totalStudents = totalStudents;
            vm.totalClasses = totalClasses;
        };

        var _classeOrder = {
            "6eme": 0,
            "5eme": 1,
            "4eme": 2,
            "3eme": 3,
            "2nde": 4,
            "1ere": 5,
            "terminale": 6,
            "externe": 7,
        }

        vm.orderByClasse = function(classe){
            return _classeOrder[classe.className];
        };

        vm.classForGroup = function(classe){
            if (classe.className === "externe"){
                return "panel panel-warning";
            }else{
                return "panel panel-default";
            }
        };

       
        listUsers();

    });
})();
