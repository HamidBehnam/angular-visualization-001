/**
 * Created by hamidbehnam on 4/4/16.
 */

angular.module("av.controllers")
    .controller("FirstLinkController", FirstLinkController);

function FirstLinkController() {
    var vm = this;
    vm.testField = "this is the first controller";
}
