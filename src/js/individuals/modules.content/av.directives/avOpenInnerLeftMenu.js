/**
 * Created by hamidbehnam on 4/18/16.
 */

angular.module("av.directives")
    .directive("avOpenInnerLeftMenu", avOpenInnerLeftMenu);

function avOpenInnerLeftMenu() {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            $(element).on("click", function (event) {
                var innerLeftElement = $(event.target).closest(".inner-left-handle").next();
                if (+ innerLeftElement.css("left").slice(0, -2) < 0) {
                    var innerLeftMenuWidth = innerLeftElement.width();
                    innerLeftElement.animate({left: "+=".concat(innerLeftMenuWidth, "px")});
                }
            });
        }
    };
}
