
(function(){
    angular.module('zenigmesApp').controller('userDetailsCtrl', function($scope, $routeParams, zenigmeUsers) {
        var vm = this;
        vm.userId = $routeParams.userId;

        vm.bonneReponseRatio = function(session){
            var count = 0;
            session.enigmes.forEach(function(enigme){
                enigme.answers.forEach(function(answer){
                    if (answer.correctValue){
                        count++;
                    }
                });
                
            });
            return ""+count +"/"+ session.enigmes.length;
        };

        vm.points = function(session){
            var points = 0;
            session.enigmes.forEach(function(enigme){
                enigme.answers.forEach(function(answer){
                    if (answer.correctValue){
                        points+=enigme.enigme.points;
                    }
                });
                
            });
            return points;
        };

        vm.answerNumber = function(session){
            var count = 0;
            session.enigmes.forEach(function(enigme){
                enigme.answers.forEach(function(answer){
                        count++;
                });
                
            });
            return ""+count +"/"+ session.enigmes.length;
        };

        zenigmeUsers.userDetails(vm.userId).then(function(response){
            vm.user = response.data;
        }, function(err){
            vm.error = err.data;
        });

    });


})();
