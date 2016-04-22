describe('ParticipationsController', function() {
  beforeEach(module('zenigmesApp'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  }));

  it("should just work",function(){
    var $scope = {};

    var controller = $controller("participationsCtrl", {$scope: $scope});
    expect($scope.toto()).toBe(1);
  });
});