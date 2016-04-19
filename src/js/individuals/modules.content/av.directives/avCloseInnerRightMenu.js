/**
 * Created by hamidbehnam on 4/19/16.
 */

angular.module("av.directives")
    .directive("avCloseInnerRightMenu", avCloseInnerRightMenu);

function avCloseInnerRightMenu() {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            $(element).on("click", function (event) {
                var innerRightMenuWidth = $(event.target).closest(".inner-right").width();
                $(event.target).closest(".inner-right").animate({right: "-=".concat(innerRightMenuWidth, "px")});
                $(event.target).closest(".inner-right").prev().find("li").each(function (index, element) { $(this).removeClass("active");});
            });
        }
    };
}
