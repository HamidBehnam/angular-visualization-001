/**
 * Created by hamidbehnam on 4/25/16.
 */

angular.module("av.directives")
    .directive("avVisualizationProcessor", avVisualizationProcessor);

function avVisualizationProcessor($timeout) {
    return {
        restrict: "A",
        scope: {
            pageMap: "=",
            pageData: "="
        },
        link: function (scope, element, attrs) {
            var contentElement = $(element).closest(".content");
            var innerLeftElement = contentElement.find(".inner-left");
            var innerRightElement = contentElement.find(".inner-right");
            var rangeElement = contentElement.find(".inner-range");
            var innerLeftWidth = innerLeftElement.width();
            var innerRightWidth = innerRightElement.width();
            contentElement.css("margin-right", innerRightWidth);
            contentElement.css("margin-left", innerLeftWidth);
            rangeElement.width(contentElement.width() - 10);
            var pageController = angular.element(element).scope().dcController; /*ko.dataFor($(element)[0])*/
            scope.$watch("pageMap", function (newValue, oldValue) {
                if (!Object.keys(newValue).length)
                    return;

                $timeout(function () {
                    var idTypeHash = {};
                    $(".widget-content").each(function (index, element) {
                        idTypeHash["#".concat($(element).attr("id"))] =  $(element).scope().widgetMetaData;
                    });

                    //******************

                    scope.$watch("pageData", function (newValue, oldValue) {
                        if (!newValue.length) {
                            return;
                        }

                        (function (data, idTypeHash) {

                            /* since its a csv file we need to format the data a bit */
                            var dateFormat = d3.time.format('%m/%d/%Y');
                            var numberFormat = d3.format('.2f');

                            data.forEach(function (d) {
                                d.dd = dateFormat.parse(d.date);
                                d.month = d3.time.month(d.dd); // pre-calculate month for better performance
                                d.close = +d.close; // coerce to number
                                d.open = +d.open;
                                d.year = d3.time.year(d.dd).getFullYear();
                            });

                            //console.log(JSON.stringify(data));

                            //### Create Crossfilter Dimensions and Groups
                            //See the [crossfilter API](https://github.com/square/crossfilter/wiki/API-Reference) for reference.
                            var ndx = crossfilter(data);
                            var all = ndx.groupAll();

                            // dimension by year
                            var yearlyDimension = ndx.dimension(function (d) {
                                return d3.time.year(d.dd).getFullYear();
                            });
                            // maintain running tallies by year as filters are applied or removed
                            var yearlyPerformanceGroup = yearlyDimension.group().reduce(
                                /* callback for when data is added to the current filter results */
                                function (p, v) {
                                    ++p.count;
                                    p.absGain += v.close - v.open;
                                    p.fluctuation += Math.abs(v.close - v.open);
                                    p.sumIndex += (v.open + v.close) / 2;
                                    p.avgIndex = p.sumIndex / p.count;
                                    p.percentageGain = p.avgIndex ? (p.absGain / p.avgIndex) * 100 : 0;
                                    p.fluctuationPercentage = p.avgIndex ? (p.fluctuation / p.avgIndex) * 100 : 0;
                                    return p;
                                },
                                /* callback for when data is removed from the current filter results */
                                function (p, v) {
                                    --p.count;
                                    p.absGain -= v.close - v.open;
                                    p.fluctuation -= Math.abs(v.close - v.open);
                                    p.sumIndex -= (v.open + v.close) / 2;
                                    p.avgIndex = p.count ? p.sumIndex / p.count : 0;
                                    p.percentageGain = p.avgIndex ? (p.absGain / p.avgIndex) * 100 : 0;
                                    p.fluctuationPercentage = p.avgIndex ? (p.fluctuation / p.avgIndex) * 100 : 0;
                                    return p;
                                },
                                /* initialize p */
                                function () {
                                    return {
                                        count: 0,
                                        absGain: 0,
                                        fluctuation: 0,
                                        fluctuationPercentage: 0,
                                        sumIndex: 0,
                                        avgIndex: 0,
                                        percentageGain: 0
                                    };
                                }
                            );

                            // dimension by full date
                            var dateDimension = ndx.dimension(function (d) {
                                return d.dd;
                            });

                            // dimension by month
                            var moveMonths = ndx.dimension(function (d) {
                                return d.month;
                            });
                            // group by total movement within month
                            var monthlyMoveGroup = moveMonths.group().reduceSum(function (d) {
                                return Math.abs(d.close - d.open);
                            });
                            // group by total volume within move, and scale down result
                            var volumeByMonthGroup = moveMonths.group().reduceSum(function (d) {
                                return d.volume / 500000;
                            });
                            var indexAvgByMonthGroup = moveMonths.group().reduce(
                                function (p, v) {
                                    ++p.days;
                                    p.total += (v.open + v.close) / 2;
                                    p.avg = Math.round(p.total / p.days);
                                    return p;
                                },
                                function (p, v) {
                                    --p.days;
                                    p.total -= (v.open + v.close) / 2;
                                    p.avg = p.days ? Math.round(p.total / p.days) : 0;
                                    return p;
                                },
                                function () {
                                    return {days: 0, total: 0, avg: 0};
                                }
                            );

                            // create categorical dimension
                            var gainOrLoss = ndx.dimension(function (d) {
                                return d.open > d.close ? 'Loss' : 'Gain';
                            });
                            // produce counts records in the dimension
                            var gainOrLossGroup = gainOrLoss.group();

                            // determine a histogram of percent changes
                            var fluctuation = ndx.dimension(function (d) {
                                return Math.round((d.close - d.open) / d.open * 100);
                            });
                            var fluctuationGroup = fluctuation.group();

                            // summerize volume by quarter
                            var quarter = ndx.dimension(function (d) {
                                var month = d.dd.getMonth();
                                if (month <= 2) {
                                    return 'Q1';
                                } else if (month > 2 && month <= 5) {
                                    return 'Q2';
                                } else if (month > 5 && month <= 8) {
                                    return 'Q3';
                                } else {
                                    return 'Q4';
                                }
                            });
                            var quarterGroup = quarter.group().reduceSum(function (d) {
                                return d.volume;
                            });

                            // counts per weekday
                            var dayOfWeek = ndx.dimension(function (d) {
                                var day = d.dd.getDay();
                                var name = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
                                return day + '.' + name[day];
                            });
                            var dayOfWeekGroup = dayOfWeek.group();

                            //### Define Chart Attributes
                            //Define chart attributes using fluent methods. See the
                            // [dc API Reference](https://github.com/dc-js/dc.js/blob/master/web/docs/api-latest.md) for more information
                            //

                            //#### Bubble Chart
                            //Create a bubble chart and use the given css selector as anchor. You can also specify
                            //an optional chart group for this chart to be scoped within. When a chart belongs
                            //to a specific group then any interaction with such chart will only trigger redraw
                            //on other charts within the same chart group.
                            /* dc.bubbleChart('#yearly-bubble-chart', 'chartGroup') */

                            //---------------------------------------------------------

                            function fullPieChartBuilder(dcObject, chartHeight) {
                                dcObject.width(180) // (optional) define chart width, :default = 200
                                    .height(chartHeight) // (optional) define chart height, :default = 200
                                    .radius(80) // define pie radius
                                    .dimension(gainOrLoss) // set dimension
                                    .group(gainOrLossGroup) // set group
                                    /* (optional) by default pie chart will use group.key as its label
                                     * but you can overwrite it with a closure */
                                    .label(function (d) {
                                        if (dcObject.hasFilter() && !dcObject.hasFilter(d.key)) {
                                            return d.key + '(0%)';
                                        }
                                        var label = d.key;
                                        if (all.value()) {
                                            label += '(' + Math.floor(d.value / all.value() * 100) + '%)';
                                        }
                                        return label;
                                    });
                            }

                            function partialPieChartBuilder(dcObject, chartHeight) {
                                dcObject.width(180)
                                    .height(chartHeight)
                                    .radius(80)
                                    .innerRadius(30)
                                    .dimension(quarter)
                                    .group(quarterGroup);
                            }

                            function rowChartBuilder(dcObject, chartHeight) {
                                dcObject.width(180)
                                    .height(chartHeight)
                                    .margins({top: 20, left: 10, right: 10, bottom: 20})
                                    .group(dayOfWeekGroup)
                                    .dimension(dayOfWeek)
                                    // assign colors to each value in the x scale domain
                                    .ordinalColors(['#3182bd', '#6baed6', '#9ecae1', '#c6dbef', '#dadaeb'])
                                    .label(function (d) {
                                        return d.key.split('.')[1];
                                    })
                                    // title sets the row text
                                    .title(function (d) {
                                        return d.value;
                                    })
                                    .elasticX(true)
                                    .xAxis().ticks(4);
                            }

                            function bubbleChartBuilder(dcObject, chartHeight) {
                                dcObject.width(window.innerWidth - innerRightWidth - innerLeftWidth) // (optional) define chart width, :default = 200
                                    .height(chartHeight)  // (optional) define chart height, :default = 200
                                    .transitionDuration(1500) // (optional) define chart transition duration, :default = 750
                                    .margins({top: 10, right: 50, bottom: 30, left: 40})
                                    .dimension(yearlyDimension)
                                    //Bubble chart expect the groups are reduced to multiple values which would then be used
                                    //to generate x, y, and radius for each key (bubble) in the group
                                    .group(yearlyPerformanceGroup)
                                    .colors(colorbrewer.RdYlGn[9]) // (optional) define color function or array for bubbles
                                    .colorDomain([-500, 500]) //(optional) define color domain to match your data domain if you want to bind data or
                                    //color
                                    //##### Accessors
                                    //Accessor functions are applied to each value returned by the grouping
                                    //
                                    //* `.colorAccessor` The returned value will be mapped to an internal scale to determine a fill color
                                    //* `.keyAccessor` Identifies the `X` value that will be applied against the `.x()` to identify pixel location
                                    //* `.valueAccessor` Identifies the `Y` value that will be applied agains the `.y()` to identify pixel location
                                    //* `.radiusValueAccessor` Identifies the value that will be applied agains the `.r()` determine radius size,
                                    //*     by default this maps linearly to [0,100]
                                    .colorAccessor(function (d) {
                                        return d.value.absGain;
                                    })
                                    .keyAccessor(function (p) {
                                        return p.value.absGain;
                                    })
                                    .valueAccessor(function (p) {
                                        return p.value.percentageGain;
                                    })
                                    .radiusValueAccessor(function (p) {
                                        return p.value.fluctuationPercentage;
                                    })
                                    .maxBubbleRelativeSize(0.3)
                                    .x(d3.scale.linear().domain([-2500, 2500]))
                                    .y(d3.scale.linear().domain([-100, 100]))
                                    .r(d3.scale.linear().domain([0, 4000]))
                                    //##### Elastic Scaling
                                    //`.elasticX` and `.elasticX` determine whether the chart should rescale each axis to fit data.
                                    //The `.yAxisPadding` and `.xAxisPadding` add padding to data above and below their max values in the same unit
                                    //domains as the Accessors.
                                    .elasticY(true)
                                    .elasticX(true)
                                    .yAxisPadding(100)
                                    .xAxisPadding(500)
                                    .renderHorizontalGridLines(true) // (optional) render horizontal grid lines, :default=false
                                    .renderVerticalGridLines(true) // (optional) render vertical grid lines, :default=false
                                    .xAxisLabel('Index Gain') // (optional) render an axis label below the x axis
                                    .yAxisLabel('Index Gain %') // (optional) render a vertical axis lable left of the y axis
                                    //#### Labels and  Titles
                                    //Labels are displaed on the chart for each bubble. Titles displayed on mouseover.
                                    .renderLabel(true) // (optional) whether chart should render labels, :default = true
                                    .label(function (p) {
                                        return p.key;
                                    })
                                    .renderTitle(true) // (optional) whether chart should render titles, :default = false
                                    .title(function (p) {
                                        return [
                                            p.key,
                                            'Index Gain: ' + numberFormat(p.value.absGain),
                                            'Index Gain in Percentage: ' + numberFormat(p.value.percentageGain) + '%',
                                            'Fluctuation / Index Ratio: ' + numberFormat(p.value.fluctuationPercentage) + '%'
                                        ].join('\n');
                                    })
                                    //#### Customize Axis
                                    //Set a custom tick format. Note `.yAxis()` returns an axis object, so any additional method chaining applies
                                    //to the axis, not the chart.
                                    .yAxis().tickFormat(function (v) {
                                    return v + '%';
                                });
                            }

                            function workBarChartBuilder(dcObject, chartHeight) {
                                dcObject.width(window.innerWidth - innerRightWidth - innerLeftWidth)
                                    .height(chartHeight)
                                    .transitionDuration(1500)
                                    .margins({top: 10, right: 50, bottom: 30, left: 40})
                                    .dimension(fluctuation)
                                    .group(fluctuationGroup)
                                    .elasticY(true)
                                    // (optional) whether bar should be center to its x value. Not needed for ordinal chart, :default=false
                                    .centerBar(true)
                                    // (optional) set gap between bars manually in px, :default=2
                                    .gap(1)
                                    // (optional) set filter brush rounding
                                    .round(dc.round.floor)
                                    .alwaysUseRounding(true)
                                    .x(d3.scale.linear().domain([-25, 25]))
                                    .renderHorizontalGridLines(true)
                                    // customize the filter displayed in the control span
                                    .filterPrinter(function (filters) {
                                        var filter = filters[0], s = '';
                                        s += numberFormat(filter[0]) + '% -> ' + numberFormat(filter[1]) + '%';
                                        return s;
                                    });

                                // Customize axis
                                dcObject.xAxis().tickFormat(
                                    function (v) {
                                        return v + '%';
                                    });
                                dcObject.yAxis().ticks(5);
                            }

                            function lineChartBuilder(dcObject, chartHeight, dependencyType, typeMap) {
                                dcObject.renderArea(true)
                                    .width(window.innerWidth - innerRightWidth - innerLeftWidth)
                                    .height(chartHeight)
                                    .transitionDuration(1500)
                                    .margins({top: 30, right: 50, bottom: 25, left: 40})
                                    .dimension(moveMonths)
                                    .mouseZoomable(true)
                                    // Specify a range chart to link the brush extent of the range with the zoom focue of the current chart.
                                    .rangeChart(typeMap[dependencyType].dcObject)
                                    .x(d3.time.scale().domain([new Date(1985, 0, 1), new Date(2012, 11, 31)]))
                                    .round(d3.time.month.round)
                                    .xUnits(d3.time.months)
                                    .elasticY(true)
                                    .renderHorizontalGridLines(true)
                                    .legend(dc.legend().x(800).y(10).itemHeight(13).gap(5))
                                    .brushOn(false)
                                    // Add the base layer of the stack with group. The second parameter specifies a series name for use in the
                                    // legend
                                    // The `.valueAccessor` will be used for the base layer
                                    .group(indexAvgByMonthGroup, 'Monthly Index Average')
                                    .valueAccessor(function (d) {
                                        return d.value.avg;
                                    })
                                    // stack additional layers with `.stack`. The first paramenter is a new group.
                                    // The second parameter is the series name. The third is a value accessor.
                                    .stack(monthlyMoveGroup, 'Monthly Index Move', function (d) {
                                        return d.value;
                                    })
                                    // title can be called by any stack layer.
                                    .title(function (d) {
                                        var value = d.value.avg ? d.value.avg : d.value;
                                        if (isNaN(value)) {
                                            value = 0;
                                        }
                                        return dateFormat(d.key) + '\n' + numberFormat(value);
                                    });
                            }

                            function rangeBarChartBuilder(dcObject, chartHeight) {
                                dcObject.width(window.innerWidth - innerRightWidth - innerLeftWidth)
                                    .height(chartHeight)
                                    .transitionDuration(1500)
                                    .margins({top: 0, right: 60, bottom: 20, left: 40})
                                    .dimension(moveMonths)
                                    .group(volumeByMonthGroup)
                                    .centerBar(true)
                                    .gap(1)
                                    .x(d3.time.scale().domain([new Date(1985, 0, 1), new Date(2012, 11, 31)]))
                                    .round(d3.time.month.round)
                                    .alwaysUseRounding(true)
                                    .xUnits(d3.time.months);
                            }

                            pageController.typeMap = {
                                fullPieChart: {
                                    dcLoader: dc.pieChart,
                                    dcBuilder: fullPieChartBuilder
                                },
                                partialPieChart: {
                                    dcLoader: dc.pieChart,
                                    dcBuilder: partialPieChartBuilder
                                },
                                rowChart: {
                                    dcLoader: dc.rowChart,
                                    dcBuilder: rowChartBuilder
                                },
                                bubbleChart: {
                                    dcLoader: dc.bubbleChart,
                                    dcBuilder: bubbleChartBuilder
                                },
                                workBarChart: {
                                    dcLoader: dc.barChart,
                                    dcBuilder: workBarChartBuilder
                                },
                                lineChart: {
                                    dcLoader: dc.lineChart,
                                    dependency: "rangeBarChart",
                                    dcBuilder: lineChartBuilder
                                },
                                rangeBarChart: {
                                    dcLoader: dc.barChart,
                                    dcBuilder: rangeBarChartBuilder
                                }
                            };

                            var typeUtility;
                            for (var index in idTypeHash) {
                                typeUtility = pageController.typeMap[idTypeHash[index].type];
                                typeUtility.dcObject = typeUtility.dcLoader(index);
                            }

                            for (var indexSecondRound in idTypeHash) {
                                typeUtility = pageController.typeMap[idTypeHash[indexSecondRound].type];
                                typeUtility.dcBuilder(typeUtility.dcObject, idTypeHash[indexSecondRound].height, typeUtility.dependency, pageController.typeMap);
                            }

                            //------------------------------------------------------

                            /*
                             //#### Data Count
                             // Create a data count widget and use the given css selector as anchor. You can also specify
                             // an optional chart group for this chart to be scoped within. When a chart belongs
                             // to a specific group then any interaction with such chart will only trigger redraw
                             // on other charts within the same chart group.
                             <div id='data-count'>
                             <span class='filter-count'></span> selected out of <span class='total-count'></span> records
                             </div>
                             */
                            //dc.dataCount('.dc-data-count')
                            //    .dimension(ndx)
                            //    .group(all)
                            //    // (optional) html, for setting different html for some records and all records.
                            //    // .html replaces everything in the anchor with the html given using the following function.
                            //    // %filter-count and %total-count are replaced with the values obtained.
                            //    .html({
                            //        some: '<strong>%filter-count</strong> selected out of <strong>%total-count</strong> records' +
                            //        ' | <a href=\'javascript:dc.filterAll(); dc.renderAll();\'\'>Reset All</a>',
                            //        all: 'All records selected. Please click on the graph to apply filters.'
                            //    });

                            /*
                             //#### Data Table
                             // Create a data table widget and use the given css selector as anchor. You can also specify
                             // an optional chart group for this chart to be scoped within. When a chart belongs
                             // to a specific group then any interaction with such chart will only trigger redraw
                             // on other charts within the same chart group.
                             <!-- anchor div for data table -->
                             <div id='data-table'>
                             <!-- create a custom header -->
                             <div class='header'>
                             <span>Date</span>
                             <span>Open</span>
                             <span>Close</span>
                             <span>Change</span>
                             <span>Volume</span>
                             </div>
                             <!-- data rows will filled in here -->
                             </div>
                             */
                            dc.dataTable('.dc-data-table')
                                .dimension(dateDimension)
                                // data table does not use crossfilter group but rather a closure
                                // as a grouping function
                                .group(function (d) {
                                    var format = d3.format('02d');
                                    return d.dd.getFullYear() + '/' + format((d.dd.getMonth() + 1));
                                })
                                .size(10) // (optional) max number of records to be shown, :default = 25
                                // There are several ways to specify the columns; see the data-table documentation.
                                // This code demonstrates generating the column header automatically based on the columns.
                                .columns([
                                    'date',    // d['date'], ie, a field accessor; capitalized automatically
                                    'open',    // ...
                                    'close',   // ...
                                    {
                                        label: 'Change', // desired format of column name 'Change' when used as a label with a function.
                                        format: function (d) {
                                            return numberFormat(d.close - d.open);
                                        }
                                    },
                                    'volume'   // d['volume'], ie, a field accessor; capitalized automatically
                                ])

                                // (optional) sort using the given field, :default = function(d){return d;}
                                .sortBy(function (d) {
                                    return d.dd;
                                })
                                // (optional) sort order, :default ascending
                                .order(d3.ascending)
                                // (optional) custom renderlet to post-process chart using D3
                                .renderlet(function (table) {
                                    table.selectAll('.dc-table-group').classed('info', true);
                                });
                            //#### Rendering
                            //simply call renderAll() to render all charts on the page
                            dc.renderAll();

                            //Overriding the event is not a good Idea: http://stackoverflow.com/questions/641857/javascript-window-resize-event
                            //window.onresize = function () {
                            //    pageController.typeMap.workBarChart.dcObject
                            //        .width(window.innerWidth)
                            //        .rescale()
                            //        .redraw();
                            //    pageController.typeMap.lineChart.dcObject
                            //        .width(window.innerWidth)
                            //        .rescale()
                            //        .redraw();
                            //    pageController.typeMap.bubbleChart.dcObject
                            //        .width(window.innerWidth)
                            //        .rescale()
                            //        .redraw();
                            //    pageController.typeMap.rangeBarChart.dcObject
                            //        .width(window.innerWidth)
                            //        .rescale()
                            //        .redraw();
                            //};

                            $(window).resize(function (event) {
                                var reducedForLeftInnerMenu = innerLeftElement.css("display") === "none" ? 0 : innerLeftElement.width();
                                var reducedForRightInnerMenu = innerRightElement.css("display") === "none" ? 0 : innerRightElement.width();
                                rangeElement.width(contentElement.width() - 10);
                                pageController.typeMap.workBarChart.dcObject
                                    .width(window.innerWidth - reducedForLeftInnerMenu - reducedForRightInnerMenu)
                                    .rescale()
                                    .redraw();
                                pageController.typeMap.lineChart.dcObject
                                    .width(window.innerWidth - reducedForLeftInnerMenu - reducedForRightInnerMenu)
                                    .rescale()
                                    .redraw();
                                pageController.typeMap.bubbleChart.dcObject
                                    .width(window.innerWidth - reducedForLeftInnerMenu - reducedForRightInnerMenu)
                                    .rescale()
                                    .redraw();
                                pageController.typeMap.rangeBarChart.dcObject
                                    .width(window.innerWidth - reducedForLeftInnerMenu - reducedForRightInnerMenu)
                                    .rescale()
                                    .redraw();
                            });

                        })(newValue, idTypeHash);
    //#### Versions
    //Determine the current version of dc with `dc.version`
                        d3.selectAll('#version').text(dc.version);

    // Determine latest stable version in the repo via Github API
                        d3.json('https://api.github.com/repos/dc-js/dc.js/releases/latest', function (error, latestRelease) {
                            /*jshint camelcase: false */
                            d3.selectAll('#latest').text(latestRelease.tag_name);
                        });
                    });

                    pageController.getPageData(scope);
                }, 500);
            });
        }
    };
}
