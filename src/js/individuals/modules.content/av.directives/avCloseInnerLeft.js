/**
 * Created by hamidbehnam on 4/18/16.
 */

angular.module("av.directives")
    .directive("avCloseInnerLeft", avCloseInnerLeft);

function avCloseInnerLeft(dcRedrawService) {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            $(element).on("click", function (event) {
                var contentElement = $(".av-body").find(".content");
                var innerLeftElement = contentElement.find(".inner-left");
                var innerRightElement = contentElement.find(".inner-right");
                var innerRangeElement = contentElement.find(".inner-range");
                innerRangeElement.animate({"width": "+=".concat(innerLeftElement.width())});
                var reducedWidth = innerRightElement.css("display") === "none" ? 0 : innerRightElement.width();
                innerLeftElement.closest(".content").animate({"margin-left": 0});
                dcRedrawService.reDrawCharts(["bubbleChart", "workBarChart", "lineChart", "rangeBarChart"], scope.dcController.typeMap, reducedWidth);
                innerLeftElement.toggle('slide');
                innerLeftElement.closest(".av-body").find(".inner-left-handle").find("li").each(function (index, element) { $(this).removeClass("active");});
            });
        }
    };
}
