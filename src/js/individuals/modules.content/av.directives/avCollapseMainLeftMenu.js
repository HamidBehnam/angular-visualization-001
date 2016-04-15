/**
 * Created by hamidbehnam on 4/14/16.
 */

angular.module("av.directives")
    .directive("avCollapseMainLeftMenu", avCollapseMainLeftMenu);

function avCollapseMainLeftMenu() {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            $(element).on("click", function (event) {
                $(event.target).toggleClass("open");
                var leftMenu = $(event.target).closest(".av-body").find(".left-menu");
                var currentWidth = leftMenu.css("width");
                if (leftMenu.css("left") === "0px") {
                    leftMenu.animate({left: "-=".concat(currentWidth)});
                } else {
                    leftMenu.animate({left: "+=".concat(currentWidth)});
                }
            });
        }
    };
}
