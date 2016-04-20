/**
 * Created by hamidbehnam on 4/19/16.
 */

angular.module("av.directives")
    .directive("avDataWidget", avDataWidget);

function avDataWidget() {
    return {
        restrict: "E",
        scope: {},
        templateUrl: "src/views/av-data-widget.html",
        link: function (scope, element, attrs) {

        }
    };
}
