(function(){
  angular.module("zenigmesApp")
  .factory("answers", answers);

  answers.$inject = ["$http"];

  function answers($http) {

      var postAnswer = function(session, enigme, answer){
        $http.post("/api/session/"+session._id+"/enigme/"+enigme._id+"/answer", enigme, {
          headers: {
            Authorization: "Bearer "+ authentication.getToken()
          }
        });
      };

      return {
        postAnswer : postAnswer
      };
  }   
})();