/**
 * Created by hamidbehnam on 4/25/16.
 */

angular.module("av.directives")
    .directive("avVisualizationProcessor", avVisualizationProcessor);

function avVisualizationProcessor($timeout) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            var pageController = angular.element(element).scope().dcController; /*ko.dataFor($(element)[0])*/
            $timeout(function () {
                var idTypeHash = {};
                $(element).closest(".content").find(".chart-place-holder").each(function (index, param2) {
                    idTypeHash["#".concat($(param2).attr("id"))] = ko.dataFor(param2).chartType();
                });

                //******************

                scope.$watch("dcController.pageData", function (newValue, oldValue) {
                    debugger;
                }, true);

                pageController.getPageData(scope);
            }, 10);
        }
    };
}
