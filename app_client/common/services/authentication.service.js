(function() {
    angular
    .module("zenigmesApp")
    .service("authentication", authentication);

    authentication.$inject = ["$window", "$http", "$q"];
    function authentication($window, $http, $q) {
        var saveToken = function(token) {
            $window.localStorage["zenigme-token"] = token;
        };

        var getToken = function() {
            return $window.localStorage["zenigme-token"];
        };

       

       var register = function(user) {
            return $http.post("/api/register", user).success(function(data){
                saveToken(data.token);
            });
        };

        var login = function(user) {
            return $http.post("/api/login", user).success(function(data) {
                saveToken(data.token);
            });
            
            
        };

        var logout = function(){
            $window.localStorage.removeItem("zenigme-token");
        };

        var isLoggedIn = function() {
            
            var token = getToken();

            if (token) {
                var payload = JSON.parse($window.atob(token.split(".")[1]));

                return payload.exp > Date.now() / 1000;
            } else {
                return false;
            }
        };

        var currentUser = function() {
            if (isLoggedIn()) {
                var token = getToken();
                var payload = JSON.parse($window.atob(token.split(".")[1]));
                return {
                    email: payload.email,
                    name: payload.name
                };
            }
        };

        return {
            saveToken: saveToken,
            getToken: getToken,
            register: register,
            login: login,
            logout: logout,
            isLoggedIn: isLoggedIn,
            currentUser: currentUser
        };
    }
})();