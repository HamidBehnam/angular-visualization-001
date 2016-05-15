/**
 * Created by hamidbehnam on 4/4/16.
 */

angular.module("av.routes")
    .config(["$routeProvider", DefineRoutes]);

function DefineRoutes($routeProvider) {
    $routeProvider
        .when("/dc", {
            templateUrl: "src/views/dc.html",
            controller: "DcController",
            controllerAs: "dcController"
        })
        .when("/", {
            templateUrl: "src/views/dc.html",
            controller: "DcController",
            controllerAs: "dcController"
        })
        .when("/link2", {
            templateUrl: "src/views/link2.html",
            controller: "SecondLinkController",
            controllerAs: "secondController"
        });
}
