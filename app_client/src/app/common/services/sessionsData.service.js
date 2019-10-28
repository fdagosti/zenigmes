(function(){

  angular
  .module('zenigmesApp')
  .factory('sessionsData', sessionsData);

  sessionsData.$inject = ["$http", "authentication", "zenigmeUsers", "$q","zenigmeData"];   
  function sessionsData ($http, authentication, zenigmeUsers, $q,zenigmeData) {

    var sessionById = function(id){
      return $http.get('/api/sessions/'+id, {
        headers: {
          Authorization: "Bearer "+ authentication.getToken()
        }
      });
    };

    var participationsBySessionId = function(id){
      return $http.get('/api/participations/'+id, {
        headers: {
          Authorization: "Bearer "+ authentication.getToken()
        }
      });
    };

  var _createMailUsernameMapping = function(users){
      var result = {};

      users.forEach(function(user){
        result[user.email] = user.name;
      });
      return result;
  };

  var _createEnigmeIdMapping = function(enigmes){
      var result = {};

      enigmes.forEach(function(enigme){
        result[enigme._id] = enigme;
      });
      return result;
  };

    var allSessionsWithEnigmes = function(){
      var sessionP = allSessions();
      var enigmesP = zenigmeData.allEnigmes();
      var usersP = zenigmeUsers.allUsers();

      return $q.all([sessionP, enigmesP, usersP]).then(function(data){
        var sessions = data[0].data;
        var enigmes = data[1].data;
        var users = data[2].data;

        var usersMap = _createMailUsernameMapping(users);
        var enigmesMap = _createEnigmeIdMapping(enigmes);

        sessions.forEach(function(session){
          session.enigmes.forEach(function(enigme){
            enigme.enigme = enigmesMap[enigme.enigme];
            enigme.answers.forEach(function(answer){
              answer.user = usersMap[answer.user];
            });

          });
        });

        return sessions;
      })
      .then(function(parts){
      var promises = [];
      parts.forEach(function(participation){
        promises.push(getEnigmesDuMomentId(participation));
      });
      return $q.all(promises).then(function(res){

        return parts;
      });
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
      var promises = [];
      parts.forEach(function(participation){
        promises.push(getEnigmesDuMomentId(participation));
      });
      return $q.all(promises).then(function(res){

        return parts;
      });
    });
  };

  var _getEnigmeDuMoment = function(session, enigme){
    return zenigmeData.enigmeById(enigme.enigme).then(function(res){

      session.enigmeDuMoment = res.data;
      var user = authentication.currentUser();
      session.enigmeDuMoment.alreadyAnswered = enigme.answers.filter(function(an){
        return an.user === user.email;
      }).length > 0;
    });
  };

  var getEnigmesDuMomentId = function(session) {
    var d = new Date().getTime();
    var enigmes = session.enigmes;
    var i, enigme;
    for (i = 0; i < enigmes.length; i++){
      enigme = enigmes[i];
      if ((d >= new Date(enigme.start).getTime()) && (d <= new Date(enigme.end).getTime())){
        if (typeof(enigme.enigme) === "string"){
          return _getEnigmeDuMoment(session, enigme);
        }else {
          session.enigmeDuMoment = enigme.enigme;
          return session;
        }

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
   participations : participations,
   participationsBySessionId : participationsBySessionId
 };
}
})();