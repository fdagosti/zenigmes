(function(){

    angular.module("zenigmesApp", ["ngRoute", "ngSanitize", "ui.tinymce", "ngAnimate", "angularCSS", "templates-app", "ui.calendar", "ui.bootstrap", "ui.sortable","checklist-model", "ui.grid", "ngFlash", "angular.filter"]);

    function config ($routeProvider, $locationProvider,$httpProvider) {
        $httpProvider.useLegacyPromiseExtensions(false);

        var statusOk = function($q, authentication){
            return authentication.currentUserActive();
        };

        $routeProvider
            .when("/", {
                templateUrl: "app/landing/landing.template.html",
                controller: "landingCtrl",
                controllerAs: "vm"
            })
            .when("/enigmes", {
                templateUrl: "app/enigmesListe/enigmesListe.view.html",
                controller: "enigmesListCtrl",
                controllerAs: "vm",
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
            .when("/forgot", {
                templateUrl: "app/auth/forgot/forgot.template.html",
                controller: "forgotCtrl",
                controllerAs: "vm"
            })
            .when("/reset/:resetToken", {
                templateUrl: "app/auth/reset/reset.template.html",
                controller: "resetCtrl",
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
            .when("/defis", {
                templateUrl: "app/teacherSpace/defiOverview/defiOverview.template.html",
                controller: "defiOverviewCtrl",
                controllerAs: "vm",
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
            .when("/defis/:defiId", {
                templateUrl: "app/mesDefis/defisDetails.template.html",
                controller: "defisDetailsCtrl",
                controllerAs: "vm",
                css: "app/common/css/table.css",
            })
            .when("/classements/:defiId", {
                templateUrl: "app/classements/classements.template.html",
                controller: "classementsCtrl",
                controllerAs: "vm",
                css: "app/classements/classements.css"
            })
            .when("/users", {
                templateUrl: "app/users/users.template.html",
                controller: "usersCtrl",
                controllerAs: "vm",
                css: "app/common/css/table.css"
            })
            .when("/classes", {
                templateUrl: "app/teacherSpace/elevesOverview/elevesOverview.template.html",
                controller: "elevesOverviewCtrl",
                controllerAs: "vm",
                css: "app/classements/classements.css"
            })
            .when("/mesdefis", {
                templateUrl: "app/mesDefis/mesDefis.template.html",
                controller: "mesDefisCtrl",
                controllerAs: "vm",
                css: "app/common/css/table.css",
                resolve: {
                    statusCheck: ["$q","authentication", statusOk],
                }
            })
            .when("/users/:userId", {
                templateUrl: "app/users/userDetails/userDetails.template.html",
                controller: "userDetailsCtrl",
                controllerAs: "vm",
                css: "app/common/css/table.css"
            })
            .when("/inactive", {
                templateUrl: "app/inactive/inactive.template.html",
                controller: "inactiveCtrl",
                controllerAs: "vm",
            })
            .when("/contact", {
                templateUrl: "app/contact/contact.template.html",
                controller: "contactCtrl",
                controllerAs: "vm",
            })
            .otherwise({redirectTo: "/"});

        $locationProvider.html5Mode(true);
    }

    angular
        .module("zenigmesApp")
        .config(["$routeProvider", "$locationProvider","$httpProvider", config])
        .run(["$rootScope", "$location","authentication", function($rootScope, $location, authentication) {
         
            $rootScope.$on("$routeChangeError", function(evt, to, from, error) {
                if (authentication.isLoggedIn()){
                    $location.path("/inactive");
                }else{
                    $location.path("/login");
                }
            });
        }]);

})();