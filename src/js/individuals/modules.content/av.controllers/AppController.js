/**
 * Created by hamidbehnam on 4/2/16.
 */

angular.module("av.controllers")
    .controller("AppController", AppController);

function AppController() {
    var vm = this;
    vm.testField = "hamid behnam";
    vm.links = ["dc", "link2"];
}
