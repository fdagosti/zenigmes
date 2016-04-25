var dummySession = {
  "_id" : "570e7986a3c7b8b5330b287a",
  "nom" : "cest mon test de session",
  "start" : "2016-04-19T16:52:49.280Z",
  "enigmes" : [
    {
      "enigme" : "5706689e44be3f420562c667",
      "start" : "2016-04-19T16:52:49.280Z",
      "end" : "2016-04-26T16:52:49.280Z",
      "_id" : "5710f9d903317a1349ecf15f",
      "answers" : [ ]
    },
    {
      "enigme" : "5706695137a07d5707c2eb42",
      "start" : "2016-04-26T16:52:49.280Z",
      "end" : "2016-05-03T16:52:49.280Z",
      "_id" : "5710f9d903317a1349ecf15e",
      "answers" : [ ]
    },
    {
      "enigme" : "570536454e07f8817caa067e",
      "start" : "2016-05-03T16:52:49.280Z",
      "end" : "2016-05-10T16:52:49.280Z",
      "_id" : "5710f9d903317a1349ecf15d",
      "answers" : [ ]
    },
    {
      "enigme" : "5706763aa28caf6e09f7bc75",
      "start" : "2016-05-10T16:52:49.280Z",
      "end" : "2016-05-17T16:52:49.280Z",
      "_id" : "5710f9d903317a1349ecf15c",
      "answers" : [ ]
    }
  ],
  "niveau" : 1,
  "__v" : 3,
  "participants" : [
    "5708fa47837734160d50ad8a",
    "570abd0b03a498f412991d31"
  ]
};

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

describe('ParticipationsController', function() {
  beforeEach(module('zenigmesApp'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  }));

  

  
  it("should display the end Date of a session",function(){
    var $scope = {};

    var controller = $controller("participationsCtrl", {$scope: $scope});
    expect(controller.getSessionEndDate(dummySession).toISOString()).toBe("2016-05-17T16:52:49.280Z");

    
  });

  


});


