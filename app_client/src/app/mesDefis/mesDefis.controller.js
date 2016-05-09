((function(){

angular.module('zenigmesApp').controller('mesDefisCtrl', function($scope, sessionsData, zenigmeData, authentication) {
  var vm = this;
  sessionsData.participations().then(function(res){
    vm.sessionsForUser = res;
  }).then(function(err){
      vm.error = err;
  });

  vm.getSessionEndDate = function(session){
    var enigmes = session.enigmes;
    return new Date(enigmes[enigmes.length -1].end);
  };

  // this page only displays if user is logged in, no need to check
  var user = authentication.currentUser();
  vm.isAdmin = user !== undefined? user.admin:false;

  vm.isSessionNotStartedYet = function(session){
    return new Date(session.start) > new Date(); 
  };

  vm.isSessionEnded = function(session){
    return vm.getSessionEndDate(session) < new Date(); 
  };

});

}))();