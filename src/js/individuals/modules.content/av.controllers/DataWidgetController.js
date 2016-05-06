/**
 * Created by hamidbehnam on 5/5/16.
 */

angular.module("av.controllers")
    .controller("DataWidgetController", DataWidgetController);

function DataWidgetController($scope, $element, $attrs) {
    var vm = this;

    vm.getIconClass = function (type) {
        switch (type) {
            case "filter":
                return "fa-pie-chart";
            case "work-space":
                return "fa-line-chart";
            case "range":
                return "fa-clock-o";
        }
    };

    vm.resetFilter = function () {
    };
}
