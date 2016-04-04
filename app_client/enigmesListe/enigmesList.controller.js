
(function(){
	angular.module('zenigmesApp').controller('enigmesListCtrl', function($scope, zenigmeData) {
		var vm = this;
		vm.tagline = 'Jouons un peu';   

		zenigmeData.allEnigmes().success(function(data){
			vm.enigmes = data;
			
		})
		.error(function(e){
			console.log(e);
		});

	});
})();
