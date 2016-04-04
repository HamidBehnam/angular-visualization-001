/**
 * Created by hamidbehnam on 4/4/16.
 */

angular.module("av.controllers")
    .controller("SecondLinkController", SecondLinkController);

function SecondLinkController() {
    var vm = this;
    vm.testField = "this is the second controller";
}
