(function() {

    angular
    .module("zenigmesApp")
    .controller("sessionFormCtrl", sessionFormCtrl);

    function sessionFormCtrl($scope, $location, zenigmeData, uiCalendarConfig){


        var vm = this;
        vm.pageHeader = {   
            title: "Créer une nouvelle session"
        };

        vm.enigmes = {};
        vm.session = {};
        vm.session.niveau = 1;
        vm.session.start = new Date();

        
        vm.selectedEnigmes = [{ titre: 'Glissez vos enigmes ici', avoid:true }];

        var updateEvents = function(){
            console.log("update");
            var src = vm.selectedEnigmes;
            $scope.events.length = 0;
            var res = $scope.events;
            var sd = new Date(vm.session.start);
            var ed = new Date(sd.getTime());
            ed.setDate(ed.getDate() + 7);
            for (i = 0; i < src.length;i++){
                if (!src[i].avoid){
                    res.push({
                        title: src[i].titre,
                        start: new Date(sd.getTime()).toISOString(),
                        end: new Date(ed.getTime()).toISOString(),
                        stick: true,
                        allDay : true
                    });
                    sd.setDate(sd.getDate() + 7);
                    ed.setDate(ed.getDate() + 7);
                }
            }
        };

        $scope.$watch("vm.selectedEnigmes", function(){
            updateEvents();
        }, true);

        $scope.$watch("vm.session.start", function(){
            updateEvents();
        }, true);
        

        vm.openDatePicker = function(){
            console.log("DATE PICKER "+vm.selectedEnigmes.length);
            vm.datePickerOpened = true;
        };



        $scope.draggableOptions = {
            connectWith: ".connected-drop-target-sortable",
        };

        $scope.sortableOptions = {
            connectWith: ".draggable-element-container",
        };


        zenigmeData.allEnigmes()
        .then(function(response){
            vm.enigmes = response.data.map(function(x){
                return [x];
            });
        },function(e){
            console.log(e.data);
        }
        );


        


        $scope.events = [];

        

        $scope.eventSources = [$scope.events];

}
})();