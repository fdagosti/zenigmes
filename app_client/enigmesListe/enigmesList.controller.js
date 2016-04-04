
(function(){
    angular.module('zenigmesApp').controller('enigmesListCtrl', function($scope, zenigmeData) {
        var vm = this;
        vm.tagline = 'Jouons un peu';   

        vm.enigmes = zenigmeData.allEnigmes();

    });
})();
