/**
 * Created by hamidbehnam on 4/4/16.
 */

angular.module("av.controllers")
    .controller("DashboardController", DashboardController);

function DashboardController() {
    var vm = this;
    vm.welcomeMessage = "Dashboard controller.";
}
