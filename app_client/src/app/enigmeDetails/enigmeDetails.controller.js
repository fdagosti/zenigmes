(function(){
	angular.module('zenigmesApp').controller('enigmeDetailsCtrl', function($scope, $routeParams, zenigmeData, $uibModal, authentication, $location, $sce, Flash ) {

		var vm = this;
		Flash.clear();
		vm.isLoggedIn = authentication.isLoggedIn();
		vm.isAdmin = vm.isLoggedIn && authentication.currentUser().admin;
		vm.currentPath = $location.path();

		vm.sessionId = $location.search().sessionid;

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
				Flash.create("danger", e.data.message);
		});

		

		vm.sendAnswer = function(reponse){
			zenigmeData.postAnswer(vm.sessionId, vm.enigme, reponse)
				.then(function(reponse){
					var modalInstance = $uibModal.open({
		        templateUrl: "app/answerModal/answerModal.template.html",
		        controller: "answerModalCtrl as vm"
		      });
		      modalInstance.result.then(function(data) {
		      	$location.search("sessionid", null);
		        $location.path("/");
		      });
				}, function(e){
					Flash.create("danger", e.data.message);
				});
			

    };			

			


		vm.reponseResult=null;


	});
})();