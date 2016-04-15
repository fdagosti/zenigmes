(function(){
  angular.module("zenigmesApp")
  .directive('userPicker', function(zenigmeUsers){
    // Runs during compile
    return {
      // name: '',
      // priority: 1,
      // terminal: true,
      scope: true,
      // controller: function($scope, $element, $attrs, $transclude) {},
      // require: 'ngModel', // Array = multiple requires, ? = optional, ^ = check parent elements
      restrict: 'E', // E = Element, A = Attribute, C = Class, M = Comment
      // template: '',
      templateUrl: 'app/common/directives/userPicker/userPicker.template.html',
      // replace: true,
      // transclude: true,
      // compile: function(tElement, tAttrs, function transclude(function(scope, cloneLinkingFn){ return function linking(scope, elm, attrs){}})),
      link: function($scope, iElm, iAttrs, controller) {
          zenigmeUsers.allUsers().then(function(response){
            $scope.allUsers = response.data;
          },function(e){
            vm.error=e.data;
          });
      }
    };
  });
})();