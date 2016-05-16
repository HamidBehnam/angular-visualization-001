/**
 * Created by hamidbehnam on 4/18/16.
 */

angular.module("av.directives")
    .directive("avOpenInnerLeft", avOpenInnerLeft);

function avOpenInnerLeft(dcRedrawService) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            $(element).on("click", function (event) {
                var contentElement = $(".av-body").find(".content");
                var innerLeftElement = contentElement.find(".inner-left");
                var innerRightElement = contentElement.find(".inner-right");
                var innerRangeElement = contentElement.find(".inner-range");
                var innerRangeHandleElement = contentElement.find(".inner-range-handle");
                var innerLeftMenuWidth = innerLeftElement.width();
                var reducedWidthForRight = innerRightElement.css("display") === "none" ? 0 : innerRightElement.width();

                innerLeftElement.closest(".content").animate({"margin-left": innerLeftMenuWidth});
                dcRedrawService.reDrawCharts(["bubbleChart", "workBarChart", "lineChart", "rangeBarChart"], scope.dcController.typeMap, innerLeftMenuWidth + reducedWidthForRight);
                if (innerLeftElement.css("display") === "none") {
                    innerLeftElement.toggle('slide');
                    innerRangeElement.animate({"width": "-=".concat(innerLeftElement.width())});
                    innerRangeHandleElement.animate({"width": "-=".concat(innerLeftElement.width())});
                }
            });
        }
    };
}
