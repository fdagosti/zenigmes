(function() {
    angular
    .module("zenigmesApp")
    .service("contact", contact);

    contact.$inject = ["$http", "authentication"];
    function contact($http, authentication) {
        

        return {
            askAdmins: function(message){
                return $http.post("/api/ask", {message:message},{
                headers: {
                 Authorization: "Bearer "+ authentication.getToken()
                }
                });
            }
        };
    }
})();