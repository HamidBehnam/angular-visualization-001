/**
 * Created by hamidbehnam on 4/4/16.
 */

angular.module("av.routes")
    .config(["$routeProvider", DefineRoutes]);

function DefineRoutes($routeProvider) {
    $routeProvider.when("/link1", {
        templateUrl: "src/views/link1.html",
        controller: "FirstLinkController",
        controllerAs: "firstController"
    }).when("/link2", {
        templateUrl: "src/views/link2.html",
        controller: "SecondLinkController",
        controllerAs: "secondController"
    });
}
