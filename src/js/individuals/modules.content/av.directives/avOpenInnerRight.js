/**
 * Created by hamidbehnam on 4/19/16.
 */

angular.module("av.directives")
    .directive("avOpenInnerRight", ["dcRedrawService", avOpenInnerRight]);

function avOpenInnerRight(dcRedrawService) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            $(element).on("click", function (event) {
                var contentElement = $(".av-body").find(".content");
                var innerRightElement = contentElement.find(".inner-right");
                var innerLeftElement = contentElement.find(".inner-left");
                var innerRangeElement = contentElement.find(".inner-range");
                var reducedWidthForLeft = innerLeftElement.css("display") === "none" ? 0 : innerLeftElement.width();
                var innerRightMenuWidth = innerRightElement.width();

                innerRightElement.closest(".content").animate({"margin-right": innerRightMenuWidth});
                dcRedrawService.reDrawCharts(["bubbleChart", "workBarChart", "lineChart", "rangeBarChart"], scope.dcController.typeMap, innerRightMenuWidth + reducedWidthForLeft);
                if (innerRightElement.css("display") === "none") {
                    innerRightElement.toggle('slide', {direction: 'right'});
                    innerRangeElement.animate({"width": "-=".concat(innerRightElement.width())});
                }
            });
        }
    };
}

