/**
 * Created by hamidbehnam on 4/18/16.
 */

angular.module("av.directives")
    .directive("avCloseInnerLeftMenu", avCloseInnerLeftMenu);

function avCloseInnerLeftMenu() {
    return {
        restrict: "A",
        link: function(scope, element, attrs) {
            $(element).on("click", function (event) {
                var innerLeftMenuWidth = $(event.target).closest(".inner-left").width();
                $(event.target).closest(".inner-left").animate({left: "-=".concat(innerLeftMenuWidth, "px")});
                $(event.target).closest(".inner-left").prev().find("li").each(function (index, element) { $(this).removeClass("active");});
            });
        }
    };
}
