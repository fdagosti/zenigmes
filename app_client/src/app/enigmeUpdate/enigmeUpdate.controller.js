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
            extended_valid_elements : "iframe[src|frameborder|style|scrolling|class|width|height|name|align]",
            toolbar: "insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | forecolor backcolor",
            

        };

        vm.enigme = {};
        zenigmeData.enigmeById($routeParams.enigmeId).then(function(response){
            // as answers are string based and the form only accepts number, a conversion is needed
            // to be changed in the future
            response.data.reponse = parseInt(response.data.reponse);
            vm.enigme = response.data;
        },function(e){
            console.log(e);
        });

        vm.updateOrCreate = function(enigme){
            zenigmeData.updateEnigme(enigme).then(function(response){
                $location.path("/enigmes/"+response.data._id);
            },function(data){
                vm.formError = "Votre énigme n'a pas pu être mis à jour ";
            });
            return false;
        };





    }
})();