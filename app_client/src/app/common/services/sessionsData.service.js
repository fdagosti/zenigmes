(function(){

  angular
  .module('zenigmesApp')
  .factory('sessionsData', sessionsData);

  sessionsData.$inject = ["$http", "authentication","$q","zenigmeData"];   
  function sessionsData ($http, authentication, $q,zenigmeData) {

    var sessionById = function(id){
      return $http.get('/api/sessions/'+id, {
        headers: {
          Authorization: "Bearer "+ authentication.getToken()
        }
      });
    };

    var allSessionsWithEnigmes = function(){
      var sessionP = allSessions();
      var enigmesP = zenigmeData.allEnigmes();

      return $q.all([sessionP, enigmesP]).then(function(data){
        sessions = data[0].data;
        enigmes = data[1].data;

        sessions.forEach(function(session){
          session.enigmes.forEach(function(enigme){
            enigmes.forEach(function(dbEnigme){
              if (dbEnigme._id === enigme.enigme){
                enigme.enigme = dbEnigme;
              }

            });

          });
        });
        return sessions;
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



   var participations = function() {
      
      return $http.get("/api/participations", {
        headers: {
          Authorization: "Bearer "+ authentication.getToken() 
        }
      }).then(function(res){
        var parts = res.data;
        promises = [];
        parts.forEach(function(participation){
          promises.push(getEnigmesDuMomentId(participation));
        });
        return $q.all(promises).then(function(res){

          return parts;
        });
      });
   };

var getEnigmesDuMomentId = function(session) {
    var d = new Date().getTime();
    var enigmes = session.enigmes;
    for (enigme of enigmes){
      if ((d >= new Date(enigme.start).getTime()) && (d <= new Date(enigme.end).getTime())){
        return zenigmeData.enigmeById(enigme.enigme).then(function(res){
          session.enigmeDuMoment = res.data;
        });
      }
    }
    
  };

   
   return {
     allSessions : allSessions,
     sessionById: sessionById,
     addSession: addSession,
     deleteSession: deleteSession,
     updateSession: updateSession,
     allSessionsWithEnigmes:allSessionsWithEnigmes,
     participations : participations
   };
 }
})();