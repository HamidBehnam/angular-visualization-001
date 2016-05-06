/**
 * Created by hamidbehnam on 4/19/16.
 */

angular.module("av.directives")
    .directive("avCloseInnerRight", ["dcRedrawService", avCloseInnerRight]);

function avCloseInnerRight(dcRedrawService) {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            $(element).on("click", function (event) {
                var innerRightElement = $(event.target).closest(".inner-right");
                var innerRightMenuWidth = $(event.target).closest(".inner-right").width();
                innerRightElement.closest(".content").animate({"margin-right": 0});
                dcRedrawService.reDrawCharts(["bubbleChart", "workBarChart", "lineChart", "rangeBarChart"], scope.dcController.typeMap, 0);
                innerRightElement.animate({right: "-=".concat(innerRightMenuWidth, "px")});
                innerRightElement.prev().find("li").each(function (index, element) { $(this).removeClass("active");});
            });
        }
    };
}
