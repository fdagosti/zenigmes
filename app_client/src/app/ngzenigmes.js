(function(){

    angular.module("zenigmesApp", ["ngRoute", "ngSanitize", "ui.tinymce", "ngAnimate", "angularCSS", "templates-app", "ui.calendar", "ui.bootstrap", "ui.sortable","checklist-model", "ui.grid", "ngFlash"]);

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
            .when("/sessions", {
                templateUrl: "app/sessions/sessionsList/sessionsList.template.html",
                controller: "sessionsCtrl",
                controllerAs: "vm",
                css: "app/common/css/table.css"
            })
            .when("/sessions/new", {
                templateUrl: "app/sessions/sessionCreate/sessionCreateUpdate.template.html",
                controller: "sessionCreateCtrl",
                controllerAs: "vm",
            })
            .when("/sessions/:sessionId/update", {
                templateUrl: "app/sessions/sessionCreate/sessionCreateUpdate.template.html",
                controller: "sessionUpdateCtrl",
                controllerAs: "vm"
            })
            .when("/users", {
                templateUrl: "app/users/users.template.html",
                controller: "usersCtrl",
                controllerAs: "vm",
                css: "app/common/css/table.css"
            })
            .when("/participations", {
                templateUrl: "app/participations/participations.template.html",
                controller: "participationsCtrl",
                controllerAs: "vm",
                css: "app/common/css/table.css"
            })
            .when("/users/:userId", {
                templateUrl: "app/users/userDetails/userDetails.template.html",
                controller: "userDetailsCtrl",
                controllerAs: "vm",
                css: "app/common/css/table.css"
            })
            .otherwise({redirectTo: "/"});

        $locationProvider.html5Mode(true);
    }

    angular
        .module("zenigmesApp")
        .config(["$routeProvider", "$locationProvider","$httpProvider", config]);
})();