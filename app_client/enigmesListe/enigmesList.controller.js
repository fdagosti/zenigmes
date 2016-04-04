
angular.module('zenigmesApp').controller('enigmesListCtrl', function($scope) {
    var vm = this;
    vm.tagline = 'Jouons un peu';   

    vm.enigmes = [
        {
            titre: "Enigme des trois allumettes",
            niveau: "3",
            points: "1",
        },
        {
            titre: "La roulette maléfique",
            niveau: "3",
            points: "1",
        },
        {
            titre: "La question d'Aristote",
            niveau: "1",
            points: "2",
        },
        {
            titre: "Le casse tête renversant",
            niveau: "3",
            points: "2",
        },
        {
            titre: "La danse de la pieuve",
            niveau: "2",
            points: "3",
        },
        {
            titre: "Tu pèses une tonne, Newton",
            niveau: "1",
            points: "1",
        },
        {
            titre: "Le Cury de Marie",
            niveau: "3",
            points: "3",
        },
        {
            titre: "Gauss repart à la hausse",
            niveau: "2",
            points: "1",
        },
        {
            titre: "Les inégalités entre poissons",
            niveau: "2",
            points: "2",
        },
        
    

    ];

});
