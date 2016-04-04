/**
 * Created by hamidbehnam on 4/2/16.
 */

angular.module("av.controllers")
    .controller("MainController", MainController);

function MainController() {
    var vm = this;
    vm.testField = "hamid behnam";
    vm.links = ["link1", "link2"];
}
