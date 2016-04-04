(function(){
	angular.module('zenigmesApp').controller('enigmeDetailsCtrl', function($scope, $routeParams, zenigmeData ) {

		var vm = this;

		vm.enigme = zenigmeData.enigmeById(parseInt($routeParams.enigmeId));


	});
})();