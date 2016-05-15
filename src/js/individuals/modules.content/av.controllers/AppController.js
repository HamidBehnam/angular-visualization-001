/**
 * Created by hamidbehnam on 4/2/16.
 */

angular.module("av.controllers")
    .controller("AppController", ["$http", AppController]);

function AppController($http) {
    var vm = this;
    vm.links = [];

    vm.load = function() {
        vm.getLeftMenuItems();
    };

    vm.getLeftMenuItems = function () {
        $http.get("json/mainLeftMenuItems.json").then(function (response) {
            vm.links = response.data;
        });
    };

    vm.load();
}

