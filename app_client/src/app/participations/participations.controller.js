((function(){

angular.module('zenigmesApp').controller('participationsCtrl', function($scope, sessionsData, zenigmeData) {
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

});

}))();