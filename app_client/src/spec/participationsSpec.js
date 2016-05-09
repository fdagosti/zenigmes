
describe("sessionData Service", function(){
  beforeEach(module('zenigmesApp'));

  var $httpBackend, sessionsData;

  beforeEach(inject(function(_sessionsData_, _$httpBackend_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    sessionsData = _sessionsData_;
    $httpBackend = _$httpBackend_;
  }));

  it("should get the list of participations with the current enigme in it", function(){
    var returnValue;

    jasmine.clock().install();
    var baseTime = new Date(2016, 4, 7);
    jasmine.clock().mockDate(baseTime);

    $httpBackend.expectGET("/api/participations").respond([dummySession]);
    $httpBackend.expectGET("/api/enigmes/570536454e07f8817caa067e").respond("yahoo");

    var promise = sessionsData.participations();
    promise.then(function(res){
      returnValue = "yahoo";
    });
    
    $httpBackend.flush();

    expect(returnValue).toBe("yahoo");

    jasmine.clock().uninstall();
  });

});

describe('mesDefisController', function() {
  beforeEach(module('zenigmesApp'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  }));

  

  
  it("should display the end Date of a session",function(){
    var $scope = {};

    var controller = $controller("mesDefisCtrl", {$scope: $scope});
    expect(controller.getSessionEndDate(dummySession).toISOString()).toBe("2016-05-17T16:52:49.280Z");

    
  });

  


});


