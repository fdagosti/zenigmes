(function(){

    angular.module("zenigmesApp", ["ngRoute", "ngSanitize", "ui.tinymce"]);

    function config ($routeProvider, $locationProvider) {
        $routeProvider
            .when("/", {
                templateUrl: "enigmesListe/enigmesListe.view.html",
                controller: "enigmesListCtrl",
                controllerAs: "vm"
            })
            .when("/enigmes/new", {
                templateUrl: "/enigmeForm/enigmeForm.view.html",
                controller: "enigmeFormCtrl",
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
            .otherwise({redirectTo: "/"});

        $locationProvider.html5Mode(true);
    };

    angular
        .module("zenigmesApp")
        .config(["$routeProvider", "$locationProvider", config]);
})();