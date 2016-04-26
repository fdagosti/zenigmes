(function(){
	angular.module('zenigmesApp').controller('enigmeDetailsCtrl', function($scope, $routeParams, zenigmeData, authentication, $location, $sce ) {

		var vm = this;

		vm.isLoggedIn = authentication.isLoggedIn();
		vm.isAdmin = vm.isLoggedIn && authentication.currentUser().admin;
		vm.currentPath = $location.path();

		vm.enigme = {};

		vm.delete = function(){
			zenigmeData.deleteEnigme(vm.enigme)
			.then(function(data){
				$location.path("/");
			});
		};

		vm.update = function(){
			$location.path("/enigmes/"+vm.enigme._id+"/update");
		};

		zenigmeData.enigmeById($routeParams.enigmeId)
			.then(function(response){
				response.data.description = $sce.trustAsHtml(response.data.description);
				vm.enigme = response.data;
			},function(e){
				console.log(e);
		});

		

		vm.checkReponse = function(){
			

			if (vm.reponse === vm.enigme.reponse){
				vm.reponseResult = "Bravo";
				vm.reponseClass = "alert alert-success";
			}else {
				vm.reponseResult = "Désolé, ce n'est pas la bonne réponse";
				vm.reponseClass = "alert alert-danger";
			}
		};


		vm.reponseResult=null;


	});
})();