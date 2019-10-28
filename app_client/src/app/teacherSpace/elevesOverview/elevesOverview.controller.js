
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
            "cm2": 0,
            "6eme": 1,
            "5eme": 2,
            "4eme": 3,
            "3eme": 4,
            "2nde": 5,
            "1ere": 6,
            "terminale": 7,
            "externe": 8,
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
