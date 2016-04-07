(function(){

  angular
  .module('zenigmesApp')
  .service('zenigmeData', zenigmeData);

  zenigmeData.$inject = ["$http", "authentication"];   
  function zenigmeData ($http, authentication) {

    var enigmeById = function(id){
      console.log("enigmeId = "+id);
      return $http.get('/api/enigmes/'+id);
    };

    var addEnigme = function(enigme){

      return $http.post("/api/enigmes/", enigme, {
        headers: {
          Authorization: "Bearer "+ authentication.getToken()
        }
      });
    };



    var allEnigmes = function () {
     return $http.get('/api/enigmes');

   };

   var deleteEnigme = function(enigme) {
      return $http.delete("/api/enigmes/"+enigme._id, {
        headers: {
          Authorization: "Bearer "+ authentication.getToken()
        }
      });
   };


   
   return {
     allEnigmes : allEnigmes,
     enigmeById: enigmeById,
     addEnigme: addEnigme,
     deleteEnigme: deleteEnigme,
   };
 };
})();