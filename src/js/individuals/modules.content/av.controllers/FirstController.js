/**
 * Created by hamidbehnam on 4/2/16.
 */

angular.module("av.controllers")
    .controller("FirstController", FirstController);

function FirstController() {
    var vm = this;
    vm.testField = "hamid behnam";
}
