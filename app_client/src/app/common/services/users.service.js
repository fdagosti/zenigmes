(function(){

  angular
  .module('zenigmesApp')
  .factory('zenigmeUsers', zenigmeUsers);

  zenigmeUsers.$inject = ["$http", "authentication", "sessionsData","$q"];   
  function zenigmeUsers ($http, authentication, sessionsData, $q ) {

    

    var allUsers = function () {
     return $http.get('/api/users',{
      headers: {
        Authorization: "Bearer "+ authentication.getToken()
      }
    });

   };

   var _classeNiveauMatch = function(user, session){
    var classe = user.classe;
    var niveau = session.niveau;
    if (niveau === 1){
      return (classe === "6eme" || classe === "5eme");
    }else if (niveau === 2){
      return (classe === "4eme" || classe === "3eme");
    }else if (niveau ===3){
      return (classe === "2nde" || classe === "1ere" || classe === "terminale");
    }
   };

   var allUsersWithSessions = function() {
    usersPromise = allUsers();
    sessionPromise = sessionsData.allSessions();
    return $q.all([usersPromise, sessionPromise]).then(function(data){

      var users = data[0].data;
      var sessions = data[1].data;

      users.forEach(function(user){
        sessions.forEach(function(session){
          var participant = session.participants.indexOf(user._id);
          if (participant >= 0 || _classeNiveauMatch(user, session)){
            if (!user.sessions){
              user.sessions=[];
            }
            user.sessions.push(session);
          }
        });
      });
      return users;

    });
  };

  var deleteUser = function(user) {
    return $http.delete("/api/users/"+user._id, {
      headers: {
        Authorization: "Bearer "+ authentication.getToken()
      }
    });
  };

  var updateUser = function(user) {
    return $http.put("/api/users/"+user._id, user, {
      headers: {
        Authorization: "Bearer "+ authentication.getToken()
      }
    });
  };

  var userDetails = function(userId){
    return $http.get("/api/users/"+userId);
  };


  
  return {
   allUsers : allUsers,
   deleteUser: deleteUser,
   updateUser: updateUser,
   allUsersWithSessions:allUsersWithSessions,
   userDetails:userDetails,
 };
}
})();