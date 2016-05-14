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
                var innerLeftElement = $(event.target).closest(".inner-left-handle").next();
                var innerLeftMenuWidth = innerLeftElement.width();
                var innerRightElement = $(".av-body").find(".inner-right");
                var reducedWidthForRight = innerRightElement.css("display") === "none" ? 0 : innerRightElement.width();
                //if (+ innerLeftElement.css("left").slice(0, -2) < 0) {
                //    innerLeftElement.animate({left: "+=".concat(innerLeftMenuWidth, "px")});
                //}

                innerLeftElement.closest(".content").animate({"margin-left": innerLeftMenuWidth});
                dcRedrawService.reDrawCharts(["bubbleChart", "workBarChart", "lineChart", "rangeBarChart"], scope.dcController.typeMap, innerLeftMenuWidth + reducedWidthForRight);
                if (innerLeftElement.css("display") === "none") {
                    innerLeftElement.toggle('slide');
                }
            });
        }
    };
}
