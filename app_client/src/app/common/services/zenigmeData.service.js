(function(){

  angular
  .module('zenigmesApp')
  .service('zenigmeData', zenigmeData);

  zenigmeData.$inject = ["$http", "authentication"];   
  function zenigmeData ($http, authentication) {

    var enigmeById = function(id){
      return $http.get('/api/enigmes/'+id, {
        headers: {
          Authorization: "Bearer "+ authentication.getToken()
        }
      });
    };

    var addEnigme = function(enigme){
      return $http.post("/api/enigmes/", enigme, {
        headers: {
          Authorization: "Bearer "+ authentication.getToken()
        }
      });
    };

    var allEnigmes = function () {
     return $http.get('/api/enigmes', {
        headers: {
          Authorization: "Bearer "+ authentication.getToken()
        }
      });

   };

   var deleteEnigme = function(enigme) {
      return $http.delete("/api/enigmes/"+enigme._id, {
        headers: {
          Authorization: "Bearer "+ authentication.getToken()
        }
      });
   };

   var updateEnigme = function(enigme) {
      return $http.put("/api/enigmes/"+enigme._id, enigme, {
        headers: {
          Authorization: "Bearer "+ authentication.getToken()
        }
      });
   };

    var postAnswer = function(sessionId, enigme, answer){
      return $http.post("/api/session/"+sessionId+"/enigme/"+enigme._id+"/answer", {answer: answer}, {
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
     updateEnigme: updateEnigme,
     postAnswer: postAnswer,
   };
 }
})();