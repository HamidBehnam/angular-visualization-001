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
                var contentElement = $(".av-body").find(".content");
                var innerRangeElement = $(event.target).closest(".inner-range");
                innerRangeElement.toggle("slide", {direction: "down"});
                contentElement.find(".inner-range-handle").find("li").each(function (index, element) { $(this).removeClass("active");});
                contentElement.find(".work-space-area").css({"padding-bottom": contentElement.find(".inner-range-handle").height()});
            });
        }
    };
}
