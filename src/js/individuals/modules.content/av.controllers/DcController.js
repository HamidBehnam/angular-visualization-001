/**
 * Created by hamidbehnam on 4/4/16.
 */

angular.module("av.controllers")
    .controller("DcController", DcController);

function DcController() {
    var vm = this;
    vm.testField = "this is the first controller";
    vm.pageMap = {};

    vm.Load = function () {
        vm.getPageMap();
    };

    vm.getPageMap = function () {
        var resultObject = {
            filters: [
                {
                    "type": "fullPieChart",
                    "title": "Days by Gain/Loss"
                },
                {
                    "type": "partialPieChart",
                    "title": "Quarters"
                },
                {
                    "type": "rowChart",
                    "title": "Day of Week"
                }
            ],
            workSpaces: [
                {
                    "type": "bubbleChart",
                    "title": "Hamid"
                },
                {
                    "type": "workBarChart",
                    "title": "Behnam"
                },
                {
                    "type": "lineChart",
                    "title": "Could be anything"
                }
            ],
            ranges: [
                {
                    "type": "rangeBarChart",
                    "title": "Range Component"
                }
            ],
            leftPanelDesign: {
                "title": "Left Title",
                "info": "Left Info"
            },
            rightPanelDesign: {
                "title": "Right Title",
                "info": "Right Info"
            }
        };

        vm.pageMap = resultObject;
    };

    vm.Load();
}
