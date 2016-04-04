(function() {

    angular
        .module("zenigmesApp")
        .controller("enigmeFormCtrl", enigmeFormCtrl);

    function enigmeFormCtrl($scope, $location, zenigmeData){
        var vm = this;
        vm.pageHeader = {
        title: "Créer une nouvelle enigme"
    	};

    	$scope.tinymceOptions = {
    		menubar: "",
    		statusbar: false
  		};

        vm.create = function(enigme){
            zenigmeData.addEnigme(enigme).success(function(data){
                console.log("SUCCESS "+data);
                $location.url("/enigmes/"+data._id);
            })
            .error(function(data){
                vm.formError = "Votre enigme n'a pas pu etre sauvegarde ";
            });
            return false
        };
            
            
    


    };
})();