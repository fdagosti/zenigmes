(function(){
	angular.module('zenigmesApp').controller('enigmeDetailsCtrl', function($scope, $routeParams, zenigmeData, authentication, $location ) {

		var vm = this;

		vm.isLoggedIn = authentication.isLoggedIn();
		vm.currentPath = $location.path();

		vm.enigme = {};

		vm.delete = function(){
			zenigmeData.deleteEnigme(vm.enigme).success(function(data){
				$location.path("/");
			});
		};

		vm.update = function(){
			$location.path("/enigmes/"+vm.enigme._id+"/update");
		};

		zenigmeData.enigmeById($routeParams.enigmeId).success(function(data){
			vm.enigme = data;
			
		})
		.error(function(e){
			console.log(e);
		});

		vm.checkReponse = function(){
			if (vm.reponse === vm.enigme.reponse){
				vm.reponseResult = "Bravo";
				vm.reponseClass = "alert alert-success";
			}else {
				vm.reponseResult = "Faux, tu es Nul !!";
				vm.reponseClass = "alert alert-danger";
			}
		};


		vm.reponseResult=null;


	});
})();