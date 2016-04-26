/**
 * Created by hamidbehnam on 4/25/16.
 */

angular.module("av.directives")
    .directive("avVisualizationProcessor", avVisualizationProcessor);

function avVisualizationProcessor($timeout) {
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            $timeout(function () {
                console.log(element);
            }, 10);
        }
    };
}
