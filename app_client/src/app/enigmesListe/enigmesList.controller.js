
(function(){
	angular.module('zenigmesApp').controller('enigmesListCtrl', function($scope, zenigmeData) {
		var vm = this;
		vm.tagline = 'Jouons un peu';   

		zenigmeData.allEnigmes()
			.then(function(response){
				vm.enigmes = response.data;
			
			},function(e){
				console.log(e.data);
			}
		);

		vm.filterByLevel = function(level){
			return function(enigme){
				return enigme.niveau == level;
			}
		};

		vm.niveaux = [1,2,3];

	});
})();
