(function(){
    angular
        .module("zenigmesApp")
        .directive("footerGeneric", footerGeneric);

    function footerGeneric(){
        return {
            restrict: "EA",
            templateUrl: "app/common/directives/footerGeneric/footerGeneric.template.html"
        };
    };
})();