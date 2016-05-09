
describe('Mes Defis controller', function() {
  beforeEach(module('zenigmesApp'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  }));

  

  
  it("should tell if a session is started or has ended",function(){
    var $scope = {};

    var controller = $controller("mesDefisCtrl", {$scope: $scope});
    expect(controller.isSessionNotStartedYet({start: new Date(new Date().getTime()+60000)})).toBe(true);    

    expect(controller.isSessionNotStartedYet({start: new Date(new Date().getTime()-60000)})).toBe(false);    
    var baseTime = new Date(2016, 4, 19);
    jasmine.clock().mockDate(baseTime);
    expect(controller.isSessionEnded(dummySession)).toBe(true);

    var baseTime = new Date(2016, 4, 15);
    jasmine.clock().mockDate(baseTime);
    expect(controller.isSessionEnded(dummySession)).toBe(false);

  });


});