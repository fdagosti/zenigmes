(function(){
	angular.module("zenigmesApp").directive('sessionForm', function(){
		// Runs during compile
		return {
          scope: {
             session: "=",
             saveSession: "&",
             buttonTitle: "="
			 }, // {} = isolate, true = child, false/undefined = no change
			restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
			templateUrl: 'app/sessions/directives/sessionForm.template.html',
			
			controller: function($scope, $element, $attrs, $transclude, zenigmeData) {
               var vm = this;
               var sessionUpdated = false, enigmesUpdated = false;

               vm.events = [];
               vm.eventSources = [vm.events];

               vm.openDatePicker = function(){
                vm.datePickerOpened = true;
                };

                vm.selectedEnigmes = [{ titre: 'Glissez vos enigmes ici', avoid:true }];



                var updateSessionBasedOnSelectedEnigmes = function(){
                    if (!enigmesUpdated || !sessionUpdated){
                        return;
                    }
                    vm.events.length = 0;

                    var _setDuration = function(date){
                        if (vm.testMode){
                            date.setSeconds(date.getSeconds() + 60);
                        }else {
                            date.setDate(date.getDate() + $scope.session.dureeEnigme);
                        }
                    };

                    $scope.session.enigmes = [];
                    var sd = new Date($scope.session.start);
                    var ed = new Date(sd.getTime());
                    _setDuration(ed);
                    vm.selectedEnigmes.forEach(function(enigme){
                        if (!enigme.avoid){
                            vm.events.push({
                                title: enigme.titre,
                                start: new Date(sd.getTime()).toISOString(),
                                end: new Date(ed.getTime()).toISOString(),
                                stick: true,
                                allDay : true
                            });

                            $scope.session.enigmes.push({
                                enigme: enigme._id,
                                start: new Date(sd.getTime()),
                                end: new Date(ed.getTime()),
                            });
                            _setDuration(sd);
                            _setDuration(ed);
                        }

                    });
                };

                function syncViewBasedOnSession(){
                    if (!$scope.session.enigmes){
                        return;
                    }

                    var enigmesList = $scope.session.enigmes;
                    vm.events.length = 0;
                    vm.selectedEnigmes.length = 0;

                    enigmesList.forEach(function(enigme){

                        var idxToRemove;
                        if (vm.enigmes){
                            vm.enigmes.forEach(function(enigmeA, idx){
                                if (enigmeA[0]._id === enigme.enigme._id){
                                    // enigme.titre = enigmeA[0].titre;
                                    vm.selectedEnigmes.push(enigmeA[0]);
                                    idxToRemove = idx;
                                }
                            });
                            vm.enigmes.splice(idxToRemove, 1);
                        }

                        vm.events.push({
                            title: enigme.titre,
                            start: new Date(enigme.start).toISOString(),
                            end: new Date(enigme.end).toISOString(),
                            stick: true,
                            allDay : true
                        });

                    });  

                }

                vm.draggableOptions = {
                    connectWith: ".connected-drop-target-sortable",
                };

                vm.sortableOptions = {
                    connectWith: ".draggable-element-container",
                };

                $scope.$watch("vm.selectedEnigmes", function(){
                    updateSessionBasedOnSelectedEnigmes();
                }, true);

                $scope.$watch("session.start", function(){
                    updateSessionBasedOnSelectedEnigmes();
                });

                
                $scope.$watch("vm.testMode", function(){
                    if (vm.testMode){
                        var now = new Date();

                        var datePlusOneMin = new Date(now.getTime() + 60000);
                        $scope.session.start = datePlusOneMin;
                    }
                    updateSessionBasedOnSelectedEnigmes();
                });

                $scope.$watch("session.dureeEnigme", function(){
                    updateSessionBasedOnSelectedEnigmes();
                });

                $scope.$watch("session", function(newVal, oldVal, scope){
                    syncViewBasedOnSession(newVal.enigmes);    
                    sessionUpdated = true;
                });

                zenigmeData.allEnigmes()
                .then(function(response){
                    vm.enigmes = response.data.map(function(x){
                        return [x];
                    });
                    syncViewBasedOnSession();
                    enigmesUpdated = true;
                },function(e){
                    console.log(e.data);
                }
                );


        },
        controllerAs: "vm"
    };
});
})();
