angular.module('zenigmesApp').controller('answerModalCtrl', function ($scope, $uibModalInstance) {

 

  $scope.ok = function () {
    $uibModalInstance.close($scope.selected.item);
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };
});