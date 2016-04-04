(function(){
	angular.module('zenigmesApp').controller('enigmeDetailsCtrl', function($scope, $routeParams, zenigmeData ) {

		var vm = this;
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