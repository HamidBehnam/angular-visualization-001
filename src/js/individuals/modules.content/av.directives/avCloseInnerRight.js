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
                var contentElement = $(".av-body").find(".content");
                var innerRightElement = contentElement.find(".inner-right");
                var innerLeftElement = contentElement.find(".inner-left");
                var innerRangeElement = contentElement.find(".inner-range");
                innerRangeElement.animate({"width": "+=".concat(innerRightElement.width())});
                var reducedWidth = innerLeftElement.css("display") === "none" ? 0 : innerLeftElement.width();
                innerRightElement.closest(".content").animate({"margin-right": 0});
                dcRedrawService.reDrawCharts(["bubbleChart", "workBarChart", "lineChart", "rangeBarChart"], scope.dcController.typeMap, reducedWidth);
                innerRightElement.toggle("slide", { direction: 'right'});
                innerRightElement.closest(".av-body").find(".inner-right-handle").find("li").each(function (index, element) { $(this).removeClass("active");});
            });
        }
    };
}
