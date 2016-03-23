(function() {

    angular
        .module("zenigmesApp")
        .controller("enigmeFormCtrl", enigmeFormCtrl);

    function enigmeFormCtrl(){
        var vm = this;
        vm.pageHeader = {
        title: "Créer une nouvelle enigme"
    };

    };
})();