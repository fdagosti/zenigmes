(function(){

  angular
  .module('zenigmesApp')
  .factory('zenigmeUsers', zenigmeUsers);

  zenigmeUsers.$inject = ["$http", "authentication","$q"];   
  function zenigmeUsers ($http, authentication, $q ) {

    

    var allUsers = function () {
     return $http.get('/api/users',{
      headers: {
        Authorization: "Bearer "+ authentication.getToken()
      }
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
    return $http.get("/api/users/"+userId,  {
      headers: {
        Authorization: "Bearer "+ authentication.getToken()
      }
    });
  };


  
  return {
   allUsers : allUsers,
   deleteUser: deleteUser,
   updateUser: updateUser,
   userDetails:userDetails,
 };
}
})();