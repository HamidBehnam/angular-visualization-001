/**
 * Created by hamidbehnam on 4/19/16.
 */

angular.module("av.directives")
    .directive("avCloseInnerRange", avCloseInnerRange);

function avCloseInnerRange() {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            $(element).on("click", function (event) {
                var innerRangeHeight = $(event.target).closest(".inner-range").innerHeight();
                $(event.target).closest(".inner-range").animate({bottom: "-=".concat(innerRangeHeight, "px")});
                $(event.target).closest(".inner-range").prev().find("li").each(function (index, element) { $(this).removeClass("active");});
            });
        }
    };
}
