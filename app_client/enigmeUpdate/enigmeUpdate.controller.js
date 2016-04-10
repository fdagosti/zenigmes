(function() {

    angular
    .module("zenigmesApp")
    .controller("enigmeUpdateCtrl", enigmeUpdateCtrl);

    function enigmeUpdateCtrl($scope, $location, zenigmeData, $routeParams){
        var vm = this;
        vm.pageHeader = {
            title: "Mettre à jour une énigme"
        };
        vm.buttonTitle = "Mettre à jour l'énigme";

        $scope.tinymceOptions = {
            languages: "fr_FR",
            style_formats_merge: true,
            style_formats:[
            { title: 'Encadré', inline: 'span', styles: { display: 'inline-block', border: '1px solid black', padding: '2px 5px', margin: '0 2px', color: 'black' } },
            ],
            plugins: [
            "advlist autolink lists link image charmap print preview anchor",
            "searchreplace visualblocks code fullscreen",
            "insertdatetime media table contextmenu paste imagetools textcolor colorpicker"
            ],
            toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | forecolor backcolor",
            

        };

        vm.enigme = {};
        zenigmeData.enigmeById($routeParams.enigmeId).success(function(data){
            vm.enigme = data;
        })
        .error(function(e){
            console.log(e);
        });

        vm.updateOrCreate = function(enigme){
            zenigmeData.updateEnigme(enigme).success(function(data){
                $location.path("/enigmes/"+data._id);
            })
            .error(function(data){
                vm.formError = "Votre énigme n'a pas pu être mis à jour ";
            });
            return false
        };





    };
})();