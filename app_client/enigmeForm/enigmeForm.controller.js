(function() {

    angular
        .module("zenigmesApp")
        .controller("enigmeFormCtrl", enigmeFormCtrl);

    function enigmeFormCtrl($scope){
        var vm = this;
        vm.pageHeader = {
        title: "Créer une nouvelle enigme"
    	};

    	$scope.tinymceOptions = {
    		menubar: "",
    		statusbar: false
  		};
    };
})();