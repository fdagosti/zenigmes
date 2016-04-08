(function(){

  angular
  .module('zenigmesApp')
  .factory('zenigmeUsers', zenigmeUsers);

  zenigmeUsers.$inject = ["$http", "authentication"];   
  function zenigmeUsers ($http, authentication) {

    

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

   var updateUser = function(enigme) {
      return $http.put("/api/enigmes/"+enigme._id, enigme, {
        headers: {
          Authorization: "Bearer "+ authentication.getToken()
        }
      });
   };


   
   return {
     allUsers : allUsers,
     deleteUser: deleteUser,
     updateUser: updateUser,
   };
 };
})();