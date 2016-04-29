/**
 * Created by hamidbehnam on 4/4/16.
 */

angular.module("av.controllers")
    .controller("DcController", DcController);

function DcController($scope, $interval, $http) {
    var vm = this;
    vm.testField = "this is the first controller";
    vm.pageMap = {};
    vm.pageData = "hamid";

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
                },
                {
                    "type": "lineChart",
                    "title": "Could be anything"
                },
                {
                    "type": "lineChart",
                    "title": "Could be anything"
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

    vm.getPageData = function () {
        //TODO: this will be replaced with real data

        //$interval(function () {
        //    debugger;
        //    vm.pageData += "something";
        //}, 1000);

        //d3.csv('ndx.csv', function (data) {
        //    debugger;
        //    vm.pageData = data;
        //});

        $http.get('ndx.csv').then(function (response) {
            debugger;
            //vm.pageData += "something";

            var result = CSVtoArray(response.data);

            function CSVtoArray(text) {
                var re_valid = /^\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*(?:,\s*(?:'[^'\\]*(?:\\[\S\s][^'\\]*)*'|"[^"\\]*(?:\\[\S\s][^"\\]*)*"|[^,'"\s\\]*(?:\s+[^,'"\s\\]+)*)\s*)*$/;
                var re_value = /(?!\s*$)\s*(?:'([^'\\]*(?:\\[\S\s][^'\\]*)*)'|"([^"\\]*(?:\\[\S\s][^"\\]*)*)"|([^,'"\s\\]*(?:\s+[^,'"\s\\]+)*))\s*(?:,|$)/g;
                // Return NULL if input string is not well formed CSV string.
                if (!re_valid.test(text)) return null;
                var a = [];                     // Initialize array to receive values.
                text.replace(re_value, // "Walk" the string using replace with callback.
                    function(m0, m1, m2, m3) {
                        // Remove backslash from \' in single quoted values.
                        if      (m1 !== undefined) a.push(m1.replace(/\\'/g, "'"));
                        // Remove backslash from \" in double quoted values.
                        else if (m2 !== undefined) a.push(m2.replace(/\\"/g, '"'));
                        else if (m3 !== undefined) a.push(m3);
                        return ''; // Return empty string.
                    });
                // Handle special case of empty last value.
                if (/,\s*$/.test(text)) a.push('');
                return a;
            }
        });
    };

    vm.Load();
}
