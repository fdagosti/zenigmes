(function(){
  angular.module("zenigmesApp")
  .factory("answers", answers);

  answers.$inject = ["$http"];

  function answers($http) {

      var postAnswer = function(enigme, answer){
        console.log("post the answer");
      };

      return {
        postAnswer : postAnswer
      };
  }   
})();