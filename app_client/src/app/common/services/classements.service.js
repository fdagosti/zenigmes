(function(){

  angular
  .module('zenigmesApp')
  .factory('classementService', classementService);

  classementService.$inject = ["$http", "authentication","$q","zenigmeData"];   
  function classementService ($http, authentication, $q,zenigmeData) {


    var classementByDefis = function(defiId){
      return $http.get('/api/classements/'+defiId, {
        headers: {
          Authorization: "Bearer "+ authentication.getToken()
        }
      });
    };

  return {
   classementByDefis : classementByDefis
 };
}
})();