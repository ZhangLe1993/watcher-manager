Template.realtimeTrafficUv.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#dashboard').addClass('active');
    $('#realtimeTrafficUv').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }
    echarts.registerMap('china', chinaMap);
    renderPage()

    $("#channel").change(function () {
        drawHotPageUvChart()
        drawSourceUvChart()
        drawKeyWordUvChart()
        drawMapChart()
    })

};

function renderPage() {
    drawCurrentUvChart()
    drawRealTimeUvChart()
    drawHotPageUvChart()
    drawSourceUvChart()
    drawKeyWordUvChart()
    drawMapChart()
}

function convertData(data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var geoCoord = geoCoordProvinceMap[data[i].name];
        if (geoCoord) {
            res.push({
                name: data[i].name,
                value: geoCoord.concat(data[i].value)

            });
        }
    }
    return res;
};

function drawMapChart() {
    var query = {
        idsite: $("#channel").val() == undefined ? "1" : $("#channel").val()
    }
    requestURL(dataService + "/dashboard/getHotCityUvCount", query).done(function (data) {
        var option = {};
        if(data.length > 0){
            var max = _.max(data, function (obj) {
                return obj.value;
            }).value;
            option = {
                title: {
                    text: '实时UV活动区域',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                /* legend: {
                 orient: 'vertical',
                 left: 'left',
                 data:['实时UV活动区域']
                 },*/
                visualMap: {
                    min: 0,
                    max: max,
                    left: 'left',
                    top: 'bottom',
                    text: ['高', '低'],           // 文本，默认为数值文本
                    calculable: true
                },

                series: [


                    {
                        name: '实时UV活动区域',
                        type: 'map',
                        mapType: 'china',
                        label: {
                            normal: {
                                formatter: function (params) {
                                    return params.value | 0
                                },
                                show: true
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        itemStyle: {
                            normal: {
                                borderColor: '#FF8C69' //地图边框颜色

                            },
                            emphasis: {
                                //areaColor:'#66CDAA',
                            }
                        },
                        data: data
                    }
                ]
            };
        }else{
            option = {
                title: {
                    text: '实时UV活动区域',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item'
                },
                visualMap: {
                    min: 0,
                    max: 0,
                    left: 'left',
                    top: 'bottom',
                    text: ['高', '低'],           // 文本，默认为数值文本
                    calculable: true
                },
                series: [
                    {
                        name: '实时UV活动区域',
                        type: 'map',
                        mapType: 'china',
                        label: {
                            normal: {
                                formatter: function (params) {
                                    return params.value | 0
                                },
                                show: true
                            },
                            emphasis: {
                                show: true
                            }
                        },
                        itemStyle: {
                            normal: {
                                borderColor: '#FF8C69' //地图边框颜色

                            },
                            emphasis: {
                                //areaColor:'#66CDAA',
                            }
                        },
                        data: []
                    }
                ]
            };
        }
        var realtimeMapUvCount = echarts.init(document.getElementById("realtimeMapUvCount"));
        realtimeMapUvCount.setOption(option);
        window.addEventListener('resize', realtimeMapUvCount.resize);
        if (window.rtuv_realtimeMapUvCount) {
            clearTimeout(window.rtuv_realtimeMapUvCount)
        }
        window.rtuv_realtimeMapUvCount = setTimeout(drawMapChart, 1000 * 60 * 5)
    })
}

function drawKeyWordUvChart() {
    var query = {
        idsite: $("#channel").val() == undefined ? "1" : $("#channel").val()
    };

    requestURL(dataService + "/dashboard/getHotKeyWordUvCount", query).done(function (data) {
        var option = {};
        if(data.length > 0){
            var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3']
            var barData = [];
            var count = 0;
            data.forEach(function (obj) {
                barData.push({
                    value: obj.value,
                    itemStyle: {
                        normal: {
                            color: colors[count % 11]
                        }
                    }
                });
                count++;
            });
            option = {
                title: {
                    text: '主要关键字',
                    left: 'center',
                    //top: 'bottom',

                },
                animation: false,
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                /*dataZoom:[
                 {
                 id: 'dataZoomY',
                 type: 'slider',
                 yAxisIndex: [0],
                 filterMode: 'empty',
                 startValue: 0,
                 endValue: 25
                 }
                 ],*/
                grid: {
                    /*left: '3%',
                     right: '4%',
                     bottom: '3%',*/
                    containLabel: true
                },
                dataZoom: [
                    {
                        show: true,
                        yAxisIndex: 0,
                        start: 50,
                        end: 100
                    }
                ],
                xAxis: [
                    {
                        type: 'value',
                        "axisLabel": {
                            rotate: isMobile() ? 45 : 0
                        },
                    }
                ],
                yAxis: [
                    {
                        type: 'category',
                        axisTick: {show: true},
                        "axisLabel": {
                            interval: 0
                        },
                        data: _.map(data, function (obj) {
                            return obj.name
                        })
                    }
                ],
                series: [
                    {
                        name: '主要关键字',
                        type: 'bar',
                        label: {normal: {show: true, position: 'right', formatter: '{c}'}},
                        data: barData
                    }]

            };

        }else{
            option = {
                title: {
                    text: '主要关键字',
                    left: 'center',
                    //top: 'bottom',

                },
                animation: false,
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    containLabel: true
                },
                dataZoom: [
                    {
                        show: true,
                        yAxisIndex: 0,
                        start: 50,
                        end: 100
                    }
                ],
                xAxis: [
                    {
                        type: 'value',
                        "axisLabel": {
                            rotate: isMobile() ? 45 : 0
                        },
                    }
                ],
                yAxis: [
                    {
                        type: 'category',
                        axisTick: {show: true},
                        "axisLabel": {
                            interval: 0
                        },
                        data: []
                    }
                ],
                series: [
                    {
                        name: '主要关键字',
                        type: 'bar',
                        label: {normal: {show: true, position: 'right', formatter: '{c}'}},
                        data: []
                    }]
            };
        }
        var realtimeKeywordUvChart = echarts.init(document.getElementById("realtimeKeywordUvChart"));
        realtimeKeywordUvChart.setOption(option);
        window.addEventListener('resize', realtimeKeywordUvChart.resize);
        if (window.rtuv_realtimeKeywordUvChart) {
            clearTimeout(window.rtuv_realtimeKeywordUvChart)
        }
        window.rtuv_realtimeKeywordUvChart = setTimeout(drawKeyWordUvChart, 1000 * 60 * 5)
    })
}

function drawSourceUvChart() {
    var query = {
        idsite: $("#channel").val() == undefined ? "1" : $("#channel").val()
    };
    requestURL(dataService + "/dashboard/getHotSourceUvCount", query).done(function (data) {
        var option = {};
        if(data.length > 0){
            var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3']
            var barData = [];
            var count = 0;
            data.forEach(function (obj) {
                barData.push({
                    value: obj.value,
                    itemStyle: {
                        normal: {
                            color: colors[count % 11]
                        }
                    }
                });
                count++;
            });
            option = {
                title: {
                    text: '引荐来源',
                    left: 'center',
                    //top: 'bottom',

                },
                animation: false,
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                dataZoom: [
                    {
                        show: true,
                        yAxisIndex: 0,
                        start: 50,
                        end: 100
                    }
                ],
                grid: {
                    /*left: '3%',
                     right: '4%',
                     bottom: '3%',*/
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'value',
                        "axisLabel": {
                            rotate: isMobile() ? 45 : 0
                        },
                    }
                ],
                yAxis: [
                    {
                        type: 'category',
                        axisTick: {show: true},
                        "axisLabel": {
                            interval: 0
                        },
                        data: _.map(data, function (obj) {
                            return obj.name
                        })
                    }
                ],
                series: [
                    {
                        name: '引荐来源',
                        type: 'bar',
                        label: {normal: {show: true, position: 'right', formatter: '{c}'}},
                        data: barData
                    }]

            };
        }else{
            option = {
                title: {
                    text: '引荐来源',
                    left: 'center',
                },
                animation: false,
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                dataZoom: [
                    {
                        show: true,
                        yAxisIndex: 0,
                        start: 50,
                        end: 100
                    }
                ],
                grid: {
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'value',
                        "axisLabel": {
                            rotate: isMobile() ? 45 : 0
                        },
                    }
                ],
                yAxis: [
                    {
                        type: 'category',
                        axisTick: {show: true},
                        "axisLabel": {
                            interval: 0
                        },
                        data: []
                    }
                ],
                series: [
                    {
                        name: '引荐来源',
                        type: 'bar',
                        label: {normal: {show: true, position: 'right', formatter: '{c}'}},
                        data: []
                    }]

            };
        }
        var realtimeSourceUvChart = echarts.init(document.getElementById("realtimeSourceUvChart"));
        realtimeSourceUvChart.setOption(option);
        window.addEventListener('resize', realtimeSourceUvChart.resize);
        if (window.rtuv_realtimeSourceUvChart) {
            clearTimeout(window.rtuv_realtimeSourceUvChart)
        }
        window.rtuv_realtimeSourceUvChart = setTimeout(drawSourceUvChart, 1000 * 60 * 5)
    })
}

function drawHotPageUvChart() {
    var query = {
        idsite: ($("#channel").val() == undefined || $("#channel").val() == null  || $("#channel").val() == '') ? "1" : $("#channel").val()
    };

    requestURL(dataService + "/dashboard/getHotPageUvCount", query).done(function (data) {
        if(data.length > 0){
            $('#table').bootstrapTable('destroy').bootstrapTable({
                data: data,
                columns: [{
                    field: 'name',
                    halign: 'center',
                    title: '页面',
                }, {
                    field: 'value',
                    halign: 'center',
                    title: 'UV数量',
                }],
            });
            if (window.rtuv_realtimeHotPageUvChart) {
                clearTimeout(window.rtuv_realtimeHotPageUvChart)
            }
            window.rtuv_realtimeHotPageUvChart = setTimeout(drawHotPageUvChart, 1000 * 60 * 5)
        }else{
            $('#table').bootstrapTable('destroy').bootstrapTable({
                data: [],
                columns: [{
                    field: 'name',
                    halign: 'center',
                    title: '页面',
                }, {
                    field: 'value',
                    halign: 'center',
                    title: 'UV数量',
                }],
            });
            if (window.rtuv_realtimeHotPageUvChart) {
                clearTimeout(window.rtuv_realtimeHotPageUvChart)
            }
            window.rtuv_realtimeHotPageUvChart = setTimeout(drawHotPageUvChart, 1000 * 60 * 5)
        }
    })

}

function drawRealTimeUvChart(idsite) {
    var query = {};
    if (idsite) {
        query.idsite = idsite
    }
    requestURL(dataService + "/dashboard/getRealTimeUvCount", query).done(function (data) {
        var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3']
        var barData = [];
        var count = 0;
        data.forEach(function (obj) {
            barData.push({
                value: obj.value,
                itemStyle: {
                    normal: {
                        color: colors[count % 11]
                    }
                }
            });
            count++;
        });

        var option = {
            title: {
                text: '今日累计UV',
                left: 'center',
                //top: 'bottom',

            },
            animation: false,
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            /*dataZoom:[
             {
             id: 'dataZoomY',
             type: 'slider',
             yAxisIndex: [0],
             filterMode: 'empty',
             startValue: 0,
             endValue: 25
             }
             ],*/
            grid: {
                /*left: '3%',
                 right: '4%',
                 bottom: '3%',*/
                containLabel: true
            },
            dataZoom: [
                {
                    show: true,
                    yAxisIndex: 0,
                    start: 50,
                    end: 100
                }
            ],
            xAxis: [
                {
                    type: 'value',
                    "axisLabel": {
                        rotate: isMobile() ? 45 : 0
                    },
                }
            ],
            yAxis: [
                {
                    type: 'category',
                    axisTick: {show: true},
                    "axisLabel": {
                        interval: 0
                    },
                    data: _.map(data, function (obj) {
                        return obj.name
                    })
                }
            ],
            series: [
                {
                    name: '今日累计UV',
                    type: 'bar',
                    label: {normal: {show: true, position: 'right', formatter: '{c}'}},
                    data: barData
                }]

        };
        var realtimeUvChart = echarts.init(document.getElementById("realtimeUvChart"));
        realtimeUvChart.setOption(option);
        window.addEventListener('resize', realtimeUvChart.resize);
        if (window.rtuv_realtimeUvChart) {
            clearTimeout(window.rtuv_realtimeUvChart)
        }
        window.rtuv_realtimeUvChart = setTimeout(drawRealTimeUvChart, 1000 * 60 * 5)
    })
}


function drawCurrentUvChart(idsite) {
    var query = {};
    if (idsite) {
        query.idsite = idsite
    }
    requestURL(dataService + "/dashboard/getCurrentUvCount", query).done(function (data) {
        var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3']
        var barData = []
        var count = 0;
        data.forEach(function (obj) {
            barData.push({
                value: obj.value,
                itemStyle: {
                    normal: {
                        color: colors[count % 11]
                    }
                }
            });
            count++;
        })

        var option = {
            title: {
                text: '当前在线UV',
                left: 'center',
                //top: 'bottom',

            },
            animation: false,
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                }
            },
            /*dataZoom:[
             {
             id: 'dataZoomY',
             type: 'slider',
             yAxisIndex: [0],
             filterMode: 'empty',
             startValue: 0,
             endValue: 25
             }
             ],*/
            grid: {
                /*left: '3%',
                 right: '4%',
                 bottom: '3%',*/
                containLabel: true
            },
            dataZoom: [
                {
                    show: true,
                    yAxisIndex: 0,
                    start: 50,
                    end: 100
                }
            ],
            xAxis: [
                {
                    type: 'value',
                    "axisLabel": {
                        rotate: isMobile() ? 45 : 0
                    },
                }

            ],
            yAxis: [
                {
                    type: 'category',
                    axisTick: {show: true},
                    "axisLabel": {
                        interval: 0
                    },
                    data: _.map(data, function (obj) {
                        return obj.name
                    })
                }
            ],
            series: [
                {
                    name: '当前在线UV',
                    type: 'bar',
                    label: {normal: {show: true, position: 'right', formatter: '{c}'}},
                    data: barData
                }]

        };
        var currentUvChart = echarts.init(document.getElementById("currentUvChart"))
        currentUvChart.setOption(option);
        window.addEventListener('resize', currentUvChart.resize)
        if (window.rtuv_currentUvChart) {
            clearTimeout(window.rtuv_currentUvChart)
        }
        window.rtuv_currentUvChart = setTimeout(drawCurrentUvChart, 1000 * 60 * 5)
    })
}
