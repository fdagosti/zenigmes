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

       var isCurrentUserActive() {

       }

       var register = function(user) {
            return $http.post("/api/register", user).then(function(response){
                saveToken(response.data.token);
                notify();
            });
        };

        var login = function(user) {
            return $http.post("/api/login", user).then(function(response) {
                saveToken(response.data.token);
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
                    name: payload.name,
                    admin: payload.admin,
                    status: payload.status,
                };
            }
        };

        var currentUserActive = function() {
            var user = currentUser();
            if (user && user.status == "actif"){
                return $q.when("bien");
            }else {
                return $q(function(resolve, reject){
                    $http.get("/api/users"+user._id, {
                        headers: {
                          Authorization: "Bearer "+ authentication.getToken()
                        }
                    })
                    .then(function(response){
                        console.log(response);
                        var updatedStatus = response.data.status;
                        if (updatedStatus === "actif"){
                            logout();
                        }
                        reject("Votre compte n'est pas encore actif");
                    },function(e){
                        reject("problem retrieving users");
                    });
                });
            }
        };

        var notify = function(){
            $rootScope.$emit('auth-service-event');
        };

        var cbs = [], ids = [];
        var cbf = function(){
            cbs.forEach(function(cb){
                cb();
            });
        };

        return {
            subscribe: function(scope, id, callback) {
                if (ids.indexOf(id) >= 0){
                    cbs[ids.indexOf(id)] = callback;
                    return;
                } else {
                    ids.push(id);
                    cbs.push(callback);    
                }
                var handler = $rootScope.$on('auth-service-event', cbf);
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