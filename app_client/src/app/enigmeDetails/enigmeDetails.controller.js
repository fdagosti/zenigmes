(function(){
	angular.module('zenigmesApp').controller('enigmeDetailsCtrl', function($scope, $routeParams, zenigmeData, authentication, $location, $sce ) {

		var vm = this;

		vm.isLoggedIn = authentication.isLoggedIn();
		vm.isAdmin = vm.isLoggedIn && authentication.currentUser().admin;
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
			data.description = $sce.trustAsHtml(data.description);
			vm.enigme = data;
			
		})
		.error(function(e){
			console.log(e);
		});

		var areBothNumbers = function(a, b){
			return !isNaN(parseInt(a)) && !isNaN(parseInt(b));
		};

		var areEqual = function(a, b){
			if (areBothNumbers(a, b)){
				return parseInt(a) === parseInt(b);
			}else {
				return a === b;
			}
		};

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