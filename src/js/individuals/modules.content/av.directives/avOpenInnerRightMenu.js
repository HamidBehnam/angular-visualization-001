/**
 * Created by hamidbehnam on 4/19/16.
 */

angular.module("av.directives")
    .directive("avOpenInnerRightMenu", avOpenInnerRightMenu);

function avOpenInnerRightMenu() {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            $(element).on("click", function (event) {
                var innerRightElement = $(event.target).closest(".inner-right-handle").next();
                if (+ innerRightElement.css("right").slice(0, -2) < 0) {
                    var innerRightMenuWidth = innerRightElement.width();
                    innerRightElement.animate({right: "+=".concat(innerRightMenuWidth, "px")});
                }
            });
        }
    };
}

