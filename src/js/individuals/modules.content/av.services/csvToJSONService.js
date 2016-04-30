/**
 * Created by hamidbehnam on 4/29/16.
 */

angular.module("av.services")
    .factory("csvToJSONService", ["csvToArrayService", csvToJSONService]);

function csvToJSONService (csvToArrayService) {
    return {
        getJSON: getJSON
    };

    function getJSON(csv) {
        var array = csvToArrayService.getArray(csv);
        var objArray = [];
        for (var i = 1; i < array.length; i++) {
            objArray[i - 1] = {};
            for (var k = 0; k < array[0].length && k < array[i].length; k++) {
                var key = array[0][k];
                objArray[i - 1][key] = array[i][k];
            }
        }

        var json = JSON.stringify(objArray);
        var str = json.replace(/},/g, "},\r\n");

        return str;
    }
}
