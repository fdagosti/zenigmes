(function() {
    angular
    .module("zenigmesApp")
    .service("authentication", authentication);

    authentication.$inject = ["$window", "$http", "$rootScope"];
    function authentication($window, $http, $rootScope) {
        var saveToken = function(token) {
            $window.localStorage["zenigme-token"] = token;
        };

        var getToken = function() {
            return $window.localStorage["zenigme-token"];
        };

       

       var register = function(user) {
            return $http.post("/api/register", user).success(function(data){
                saveToken(data.token);
                notify();
            });
        };

        var login = function(user) {
            return $http.post("/api/login", user).success(function(data) {
                saveToken(data.token);
                notify();
            });
        };

        var logout = function(){
            $window.localStorage.removeItem("zenigme-token");
            notify();
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

        var notify = function(){
            console.log("notifying");
            $rootScope.$emit('auth-service-event');
        }

        return {
            subscribe: function(scope, callback) {
                var handler = $rootScope.$on('auth-service-event', callback);
                scope.$on('$destroy', handler);
            },

            notify: notify,
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