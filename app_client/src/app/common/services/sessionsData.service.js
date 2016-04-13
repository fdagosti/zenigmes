(function(){

  angular
  .module('zenigmesApp')
  .factory('sessionsData', sessionsData);

  sessionsData.$inject = ["$http", "authentication"];   
  function sessionsData ($http, authentication) {

    var sessionById = function(id){
      return $http.get('/api/sessions/'+id, {
        headers: {
          Authorization: "Bearer "+ authentication.getToken()
        }
      });
    };

    var addSession = function(session){

      return $http.post("/api/sessions/", session, {
        headers: {
          Authorization: "Bearer "+ authentication.getToken()
        }
      });
    };



    var allSessions = function () {
     return $http.get('/api/sessions', {
        headers: {
          Authorization: "Bearer "+ authentication.getToken()
        }
      });

   };

   var deleteSession = function(session) {
      return $http.delete("/api/sessions/"+session._id, {
        headers: {
          Authorization: "Bearer "+ authentication.getToken()
        }
      });
   };

   var updateSession = function(session) {
      return $http.put("/api/sessions/"+session._id, session, {
        headers: {
          Authorization: "Bearer "+ authentication.getToken()
        }
      });
   };


   
   return {
     allSessions : allSessions,
     sessionById: sessionById,
     addSession: addSession,
     deleteSession: deleteSession,
     updateSession: updateSession,
   };
 }
})();