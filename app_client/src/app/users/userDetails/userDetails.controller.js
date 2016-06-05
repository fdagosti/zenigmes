
(function(){
    angular.module('zenigmesApp').controller('userDetailsCtrl', function($scope, $location, $routeParams, zenigmeUsers) {
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
            if (!vm.user.role){
                vm.user.role = "member";
            }
        }, function(err){
            vm.error = err.data;
        });

        vm.updateUser = function(){
            zenigmeUsers.updateUser(vm.user).then(function(response){
                $location.path("/users/");
            }, function(err){
                vm.error = err.data;
            });
        };

    });


})();
