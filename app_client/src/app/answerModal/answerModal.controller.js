angular.module('zenigmesApp').controller('answerModalCtrl', function ($scope, $uibModalInstance) {

 

  $scope.ok = function (result) {
    $uibModalInstance.close(result);
  };

  
});