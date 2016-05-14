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
                //var innerRightMenuWidth = $(event.target).closest(".inner-right").width();
                //innerRightElement.animate({right: "-=".concat(innerRightMenuWidth, "px")});
                var innerRightElement = $(event.target).closest(".inner-right");
                var innerLeftElement = $(".av-body").find(".inner-left");
                var reducedWidth = innerLeftElement.css("display") === "none" ? 0 : innerLeftElement.width();
                innerRightElement.closest(".content").animate({"margin-right": 0});
                dcRedrawService.reDrawCharts(["bubbleChart", "workBarChart", "lineChart", "rangeBarChart"], scope.dcController.typeMap, reducedWidth);
                innerRightElement.toggle("slide", { direction: 'right'});
                innerRightElement.closest(".av-body").find(".inner-right-handle").find("li").each(function (index, element) { $(this).removeClass("active");});
            });
        }
    };
}
