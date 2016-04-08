(function(){

    angular.module("zenigmesApp", ["ngRoute", "ngSanitize", "ui.tinymce", "ngAnimate", "angularCSS"]);

    function config ($routeProvider, $locationProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "enigmesListe/enigmesListe.view.html",
                controller: "enigmesListCtrl",
                controllerAs: "vm"
            })
            .when("/enigmes/new", {
                templateUrl: "/common/templates/enigmeForm.template.html",
                controller: "enigmeFormCtrl",
                controllerAs: "vm"
            })
            .when("/enigmes/:enigmeId/update", {
                templateUrl: "/common/templates/enigmeForm.template.html",
                controller: "enigmeUpdateCtrl",
                controllerAs: "vm"
            })
            .when("/enigmes/:enigmeId", {
                templateUrl: "/enigmeDetails/enigmeDetails.view.html",
                controller: "enigmeDetailsCtrl",
                controllerAs: "vm"
            })
            .when("/login", {
                templateUrl: "/auth/login/login.view.html",
                controller: "loginCtrl",
                controllerAs: "vm"
            })
            .when("/register", {
                templateUrl: "/auth/register/register.view.html",
                controller: "registerCtrl",
                controllerAs: "vm"
            })
            .when("/users", {
                templateUrl: "/users/users.template.html",
                controller: "usersCtrl",
                controllerAs: "vm",
                css: "users/users.css"
            })
            .otherwise({redirectTo: "/"});

        $locationProvider.html5Mode(true);
    };

    angular
        .module("zenigmesApp")
        .config(["$routeProvider", "$locationProvider", config]);
})();