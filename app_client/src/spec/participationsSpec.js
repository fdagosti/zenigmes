
describe("sessionData Service", function(){
  beforeEach(module('zenigmesApp'));

  var $httpBackend, sessionsData;

  beforeEach(function () {
      authDep = {
          getToken: function() {
            return "fake";
          },
          currentUser: function () {
              return {
                    email: "francois.dagostini@gmail.com",
                    name: "toto",
                    admin: true,
                };
          }
      };

      module(function ($provide) {
          $provide.value('authentication', authDep);
      });

  });

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

  it("should tell if an enigme has already been answered", function(){

    jasmine.clock().install();
    var baseTime = new Date(2016, 4, 7);
    jasmine.clock().mockDate(baseTime);


    $httpBackend.expectGET("/api/participations").respond([dummySession]);
    $httpBackend.expectGET("/api/enigmes/570536454e07f8817caa067e").respond(dummySession.enigmes[2]);

    var promise = sessionsData.participations();

    promise.then(function(res){
      expect(res[0].enigmeDuMoment.alreadyAnswered).toBe(true);
    });

    $httpBackend.flush();
    jasmine.clock().uninstall();
  });

  it("should tell if an enigme has NOT already been answered", function(){

    jasmine.clock().install();
    var baseTime = new Date(2016, 3, 22);
    jasmine.clock().mockDate(baseTime);


    $httpBackend.expectGET("/api/participations").respond([dummySession]);
    $httpBackend.expectGET("/api/enigmes/5706689e44be3f420562c667").respond(dummySession.enigmes[0]);

    var promise = sessionsData.participations();

    promise.then(function(res){
      expect(res[0].enigmeDuMoment.alreadyAnswered).toBe(false);
    });

    $httpBackend.flush();
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


