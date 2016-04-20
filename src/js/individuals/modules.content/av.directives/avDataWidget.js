/**
 * Created by hamidbehnam on 4/19/16.
 */

angular.module("av.directives")
    .directive("avDataWidget", avDataWidget);

function avDataWidget() {
    return {
        restrict: "E",
        templateUrl: "src/views/av-data-widget.html",
        link: function (scope, element, attrs) {

        }
    };
}
