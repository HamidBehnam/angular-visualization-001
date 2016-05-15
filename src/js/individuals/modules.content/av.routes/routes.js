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
        .when("/dashboard", {
            templateUrl: "src/views/dashboard.html",
            controller: "DashboardController",
            controllerAs: "dashboardController"
        });
}
