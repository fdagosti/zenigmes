(function() {

    angular
    .module("zenigmesApp")
    .controller("sessionFormCtrl", sessionFormCtrl);

    function sessionFormCtrl($scope, $location, zenigmeData){

        var vm = this;
        vm.pageHeader = {   
            title: "Créer une nouvelle session"
        };

        $scope.eventSources = [
        {
            events: [
            {
                title: 'Enigmes des 6eme. Semaine 1',
                start: '2016-09-05',
                end: '2016-09-09'
            },
            {
                title: 'Enigmes des 6eme. Semaine 2',
                start: '2016-09-12',
                end: '2016-09-16'
            }           
            ],
            color: 'green',
        },
        {
            events: [
            {
                title: 'Enigmes des 4eme. Semaine 1',
                start: '2016-09-05',
                end: '2016-09-09'
            },
            {
                title: 'Enigmes des 4eme. Semaine 2',
                start: '2016-09-12',
                end: '2016-09-16'
            }           
            ],
            color: 'orange',
        },
        {
            events: [
            {
                title: 'Enigmes des Lycées. Semaine 1',
                start: '2016-09-05',
                end: '2016-09-09'
            },
            {
                title: 'Enigmes des Lycées. Semaine 2',
                start: '2016-09-12',
                end: '2016-09-16'
            }           
            ],
            color: 'red',
        }


        ];
        var vm = this;





    }
})();