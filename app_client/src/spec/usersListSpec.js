describe('UsersList controller', function() {
  beforeEach(module('zenigmesApp'));

  var $controller;

  beforeEach(inject(function(_$controller_){
    // The injector unwraps the underscores (_) from around the parameter names when matching
    $controller = _$controller_;
  }));

  

  
  it("should get the Gravatar URL from the email",function(){
    var $scope = {};

    var gravatar = {
      email: "  MyEmailAddress@example.com",
      hash: "0bc83cb571cd1c50ba6f3e8a78ef1346"
    }

    var controller = $controller("usersCtrl", {$scope: $scope});
    expect(controller.getGravatarURL(gravatar.email)).toBe(gravatar.hash);    
  });

  


});