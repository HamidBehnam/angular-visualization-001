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
        link: function (scope, element, attrs) {
            scope.getIconClass = function (type) {
                switch (type) {
                    case "filter":
                        return "fa-pie-chart";
                    case "work-space":
                        return "fa-line-chart";
                    case "range":
                        return "fa-clock-o";
                }
            };
        }
    };
}
