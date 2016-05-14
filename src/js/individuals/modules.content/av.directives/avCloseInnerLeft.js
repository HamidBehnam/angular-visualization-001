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
                //var innerLeftMenuWidth = $(event.target).closest(".inner-left").width();
                //$(event.target).closest(".inner-left").animate({left: "-=".concat(innerLeftMenuWidth, "px")});

                var innerLeftElement = $(event.target).closest(".inner-left");
                var innerRightElement = $(".av-body").find(".inner-right");
                var reducedWidth = innerRightElement.css("display") === "none" ? 0 : innerRightElement.width();
                innerLeftElement.closest(".content").animate({"margin-left": 0});
                dcRedrawService.reDrawCharts(["bubbleChart", "workBarChart", "lineChart", "rangeBarChart"], scope.dcController.typeMap, reducedWidth);
                innerLeftElement.toggle('slide');
                innerLeftElement.closest(".av-body").find(".inner-left-handle").find("li").each(function (index, element) { $(this).removeClass("active");});
            });
        }
    };
}
