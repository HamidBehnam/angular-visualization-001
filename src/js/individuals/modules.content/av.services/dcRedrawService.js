/**
 * Created by hamidbehnam on 5/6/16.
 */

angular.module("av.services")
    .factory("dcRedrawService", dcRedrawService);

function dcRedrawService() {
    return {
        reDrawCharts: reDrawCharts
    };

    function reDrawCharts(types, typeMap, reduceWidth) {
        for (var index in types) {
            typeMap[types[index]].dcObject
                .width(window.innerWidth - reduceWidth)
                .rescale()
                .redraw();
        }
    }
}
