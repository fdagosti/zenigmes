(function(){

    angular
        .module("zenigmesApp")
        .directive("pageHeader", pageHeader);

    function pageHeader() {
        return {
            restrict : "EA",
            scope: {
                content: "=content"
            },
            templateUrl: "app/common/directives/pageHeader/pageHeader.template.html"
        }
    }
})();