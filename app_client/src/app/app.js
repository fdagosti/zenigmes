(function(){

    angular.module("zenigmesApp", ["ngRoute", "ngSanitize", "ui.tinymce", "ngAnimate", "angularCSS", "templates-app", "ui.calendar", "ui.bootstrap", "ui.sortable"]);

    function config ($routeProvider, $locationProvider,$httpProvider) {
        $httpProvider.useLegacyPromiseExtensions(false);

        $routeProvider
            .when("/", {
                templateUrl: "app/enigmesListe/enigmesListe.view.html",
                controller: "enigmesListCtrl",
                controllerAs: "vm"
            })
            .when("/enigmes/new", {
                templateUrl: "app/common/templates/enigmeForm.template.html",
                controller: "enigmeFormCtrl",
                controllerAs: "vm"
            })
            .when("/enigmes/:enigmeId/update", {
                templateUrl: "app/common/templates/enigmeForm.template.html",
                controller: "enigmeUpdateCtrl",
                controllerAs: "vm"
            })
            .when("/enigmes/:enigmeId", {
                templateUrl: "app/enigmeDetails/enigmeDetails.view.html",
                controller: "enigmeDetailsCtrl",
                controllerAs: "vm"
            })
            .when("/login", {
                templateUrl: "app/auth/login/login.view.html",
                controller: "loginCtrl",
                controllerAs: "vm"
            })
            .when("/register", {
                templateUrl: "app/auth/register/register.view.html",
                controller: "registerCtrl",
                controllerAs: "vm"
            })
            .when("/sessions/new", {
                templateUrl: "app/sessionForm/sessionForm.template.html",
                controller: "sessionFormCtrl",
                controllerAs: "vm"
            })
            .when("/users", {
                templateUrl: "app/users/users.template.html",
                controller: "usersCtrl",
                controllerAs: "vm",
                css: "app/users/users.css"
            })
            .otherwise({redirectTo: "/"});

        $locationProvider.html5Mode(true);
    }

    angular
        .module("zenigmesApp")
        .config(["$routeProvider", "$locationProvider","$httpProvider", config]);
})();