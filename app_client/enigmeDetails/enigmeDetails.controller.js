(function(){
	angular.module('zenigmesApp').controller('enigmeDetailsCtrl', function($scope, $routeParams, zenigmeData, authentication, $location ) {

		var vm = this;

		vm.isLoggedIn = authentication.isLoggedIn();
		vm.currentPath = $location.path();

		vm.enigme = {};


		zenigmeData.enigmeById($routeParams.enigmeId).success(function(data){
			console.log("success "+data);
			vm.enigme = data;
			
		})
		.error(function(e){
			console.log(e);
		});


	});
})();