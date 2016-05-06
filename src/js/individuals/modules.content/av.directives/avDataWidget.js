/**
 * Created by hamidbehnam on 4/19/16.
 */

angular.module("av.directives")
    .directive("avDataWidget", avDataWidget);

function avDataWidget() {
    return {
        restrict: "E",
        scope: {
            widgetMetaData: "=",
            widgetType: "@",
            widgetIndex: "="
        },
        templateUrl: "src/views/av-data-widget.html",
        controller: "DataWidgetController",
        controllerAs: "widgetController",
        link: function (scope, element, attrs) {

        }
    };
}
