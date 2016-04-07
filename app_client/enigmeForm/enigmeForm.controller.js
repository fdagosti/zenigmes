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



        vm.create = function(enigme){
            console.log("CREATE "+vm.myFile);
            zenigmeData.addEnigme(enigme).success(function(data){
                console.log("SUCCESS "+data);
                $location.path("/enigmes/"+data._id);
            })
            .error(function(data){
                vm.formError = "Votre enigme n'a pas pu etre sauvegarde ";
            });
            return false
        };
            
            
    


    };
})();