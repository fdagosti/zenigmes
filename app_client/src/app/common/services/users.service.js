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

   var allUsersWithSessions = function() {
    usersPromise = allUsers();
    sessionPromise = sessionsData.allSessions();
    return $q.all([usersPromise, sessionPromise]).then(function(data){

      var users = data[0].data;
      var sessions = data[1].data;

      users.forEach(function(user){
        sessions.forEach(function(session){
          var participant = session.participants.indexOf(user._id);
          if (participant >= 0){
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

  var updateUser = function(enigme) {
    return $http.put("/api/enigmes/"+enigme._id, enigme, {
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