(function(){
	angular.module('zenigmesApp').controller('enigmeDetailsCtrl', function($scope, $routeParams, zenigmeData, $uibModal, authentication, $location, $sce, Flash ) {

		var vm = this;
		Flash.clear();
		vm.isLoggedIn = authentication.isLoggedIn();
		vm.isAdmin = vm.isLoggedIn && authentication.currentUser().admin;
		vm.isAdminOrTeacher = vm.isAdmin || (vm.isLoggedIn && authentication.currentUser().teacher);
		vm.currentPath = $location.path();

		vm.sessionId = $location.search().sessionid;

		vm.enigme = {};

		vm.delete = function(){

			var modalInstance = $uibModal.open({
                templateUrl: "app/common/modals/confirmActionModal.template.html",
                controller: "genericModalCtrl as vm"
            });

            modalInstance.result.then(function(deleteEnigme) {
                if (deleteEnigme){
                  zenigmeData.deleteEnigme(vm.enigme)
									.then(function(data){
										$location.path("/");
									});
                }
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
				if (e.status === 401){
					Flash.create("danger", "Vous devez être authentifié pour voir une énigme");	
				}else{
					Flash.create("danger", e.data);
				}
				
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
		      	if (data){
		        	$location.path("/classements/"+vm.sessionId);
		      	}else{
		        	$location.path("/");
		      	}
		      });
				}, function(e){
					Flash.create("danger", e.data.message);
				});
			

    };			

			


		vm.reponseResult=null;


	});
})();