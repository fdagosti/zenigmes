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
            zenigmeData.addEnigme(enigme);
            console.log("titre to save "+enigme.titre);
            console.log("description to save "+enigme.description);
            console.log("illustrqtion  to save "+enigme.illustration);
            console.log("niveau  to save "+enigme.niveau);
            console.log("points  to save "+enigme.points);
            console.log("reponse  to save "+enigme.answer);
            $location.url("/enigmes/"+enigme._id);
        };


    };
})();