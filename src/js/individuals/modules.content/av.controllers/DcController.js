/**
 * Created by hamidbehnam on 4/4/16.
 */

angular.module("av.controllers")
    .controller("DcController", ["$http", "csvToJSONService", DcController]);

function DcController($http, csvToJSONService) {
    var vm = this;
    vm.testField = "this is the first controller";
    vm.pageMap = {};
    vm.typeMap = {};
    vm.pageData = [];

    vm.Load = function () {
        vm.getPageMap();
    };

    vm.getPageMap = function () {
        $http.get("json/pageMap.json").then(function (response) {
            vm.pageMap = response.data;
        });
    };

    vm.getPageData = function () {
        //TODO: this will be replaced with real data
        $http.get('ndx.csv').then(function (response) {
            vm.pageData = JSON.parse(csvToJSONService.getJSON(response.data));
        });
    };

    vm.Load();
}
