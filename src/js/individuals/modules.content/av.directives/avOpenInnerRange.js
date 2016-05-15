/**
 * Created by hamidbehnam on 4/19/16.
 */

angular.module("av.directives")
    .directive("avOpenInnerRange", avOpenInnerRange);

function avOpenInnerRange() {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            $(element).on("click", function (event) {
                var innerRangeElement = $(event.target).closest(".inner-range-handle").next();
                if (innerRangeElement.css("display") === "none") {
                    innerRangeElement.toggle("slide", {direction: "down"});
                }
            });
        }
    };
}
