angular.module('zenigmesApp').controller('genericModalCtrl', function ($scope, $uibModalInstance) {

 

  $scope.ok = function (result) {
    $uibModalInstance.close(result);
  };

  
});