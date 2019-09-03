Template.realtimeOrder.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#dashboard').addClass('active');
    $('#realtimeOrder').addClass('active');

    if (this.data && this.data.show) {
        $("html").css("background-color", "black");
        $(".content-wrapper").css("margin-left", "0");
        $(".display").hide();

        document.onkeydown = function (event) {
            var e = event || window.event || arguments.callee.caller.arguments[0];
            if (e && e.keyCode == 13) {
                var flag = !$("#show").is(':checked');
                $("#show").prop("checked", flag);

                if (flag) {
                    getTotalByDate().done(function (total) {
                        $("#yestTotal").text("昨日订单:" + total)
                    });

                    $("#currentTotal").show();
                    $("#yestTotal").show()
                } else {
                    $("#yestTotal").text("");
                    $("#currentTotal").hide();
                    $("#yestTotal").hide()
                }
                drawIncomePerMonthChart()
            }
        }

    } else {
        $(".display").show()
    }

    if (isMobile()) {
        $("#submitOrderMapChart").css("height", "400px")
    } else {

    }

    echarts.registerMap('china', chinaMap);

    submitOrderMapChart = echarts.init(document.getElementById('submitOrderMapChart'));

    var bubble = [];
    setInterval(load(), 2000);
    //月营收
    drawIncomePerMonthChart();

    $("#show").click(function () {

        if ($(this).is(':checked')) {

            getTotalByDate().done(function (total) {
                $("#yestTotal").text("昨日订单:" + total)
            });

            $("#currentTotal").show()
        } else {
            $("#yestTotal").text("");
            $("#currentTotal").hide()
        }

        drawIncomePerMonthChart()

    })

};

var item = function (id) {
    /*requestURL(window.origin + "/mongo/realtimeOrderSummaryStats/one", {id: id}).done(function (obj) {
        var provinceName = obj['provinceName'];
        if (!province.contains(provinceName)) {
            province.push(provinceName)
        }
    });*/
};


var load = function () {
    var province = [];
    requestURL(window.origin + "/mongo/realtimeOrderSummaryStats", {}).done(function (data) {
        var cursor = data;
        _.each(cursor, function (ele) {
            var provinceName = ele['provinceName'];
            if (!province.contains(provinceName)) {
                province.push(provinceName)
            }
        });
    });
};

function getTotalByDate() {
    var dfd = $.Deferred();
    var params = {
        "date": moment().subtract(1, 'days').format('YYYY-MM-DD')
    };
    requestURL(dataService + "/tradeDaily/getTotalSubmitOrder", params).done(function (result) {
        dfd.resolve(result)
    });
    return dfd.promise()
}

function getData() {
    var dfd = $.Deferred();
    var params = {
        "startDate": "2013-01-01",
        "endDate": moment().subtract(1, 'months').startOf('month').format('YYYY-MM-DD')
    };
    requestURL(dataService + "/tradeMonthly/getSubmitAmountPerMonth", params).done(function (result) {
        dfd.resolve(result)
    });
    return dfd.promise()
}


function drawIncomePerMonthChart() {
    getData().done(function (data) {

        var dataAxis = _.map(data, function (obj) {
            return (obj.date).substring(0, 7)
        })
        var data = _.map(data, function (obj) {
            return Math.round(obj.amount / 10000)
        })
        var option = {
            title: {
                text: '月营业额',
                subtext: '单位:万',
                left: 'center',
                textStyle: {
                    color: 'white'
                }

            },

            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    if ($('#show').is(':checked')) {
                        return params.name + ":" + params.value
                    } else {
                        return ""
                    }

                }
            },
            xAxis: {
                data: dataAxis,
                axisLabel: {
                    show: true,
                    textStyle: {
                        color: 'white'
                    }
                },
                z: 10
            },
            yAxis: {
                axisLine: {
                    show: false
                },
                axisTick: {
                    show: false
                },
                axisLabel: {
                    show: $('#show').is(':checked'),
                    textStyle: {
                        color: 'white'
                    }
                },
                position: isMobile() ? 'right' : 'left'
            },
            dataZoom: [
                {
                    type: 'inside',
                    start: 0,
                    end: 100
                }
            ],
            series: [

                {
                    name: "柱状图",
                    type: 'bar',
                    label: {
                        normal: {
                            position: 'top',
                            show: false,//$('#show').is(':checked')&&!isMobile(),
                            formatter: function (params) {
                                return _.map(params.data + "", function (ele) {
                                    return ele + "\n"
                                }).join("")
                            },
                            textStyle: {
                                color: 'white'
                            }
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {offset: 0, color: '#83bff6'},
                                    {offset: 0.5, color: '#188df0'},
                                    {offset: 1, color: '#188df0'}
                                ]
                            )
                        },
                        emphasis: {
                            color: new echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {offset: 0, color: '#2378f7'},
                                    {offset: 0.7, color: '#2378f7'},
                                    {offset: 1, color: '#83bff6'}
                                ]
                            )
                        }
                    },
                    data: data
                },
                {
                    name: '折线图',
                    type: 'line',
                    data: data,
                    label: {
                        normal: {
                            position: 'top',
                            show: false,//$('#show').is(':checked'),
                            textStyle: {
                                color: 'white'
                            }
                        }
                    },

                }
            ]
        };


        var incomePerMonthChart = echarts.init(document.getElementById('incomePerMonth'));
        incomePerMonthChart.setOption(option);
        window.addEventListener('resize', function () {
            incomePerMonthChart.resize();
        })
    })
}


function convertData(data) {
    var res = [];
    for (var i = 0; i < data.length; i++) {
        var geoCoord = geoCoordProvinceMap[data[i].name];
        if (geoCoord) {
            res.push({
                name: data[i].name,
                value: geoCoord.concat(data[i].value),
                dt: data[i].dt

            });
        }
    }
    return res;
};


function submitOrderMapChartFunc(data, bubble) {



    //var bubble = JSON.parse(JSON.stringify(bubble1));

    var obj = _.groupBy(data, function (obj) {
        return obj.name
    });
    var max = 0;
    data.forEach(function (obj) {
        if (obj.value > max) {
            max = obj.value
        }
    })

    var series = [
        {
            name: '实时订单量',
            type: 'map',
            mapType: 'china',
            roam: false,
            label: {
                normal: {
                    label: {
                        formatter: "%c:%b",
                        show: true
                    }
                },
                emphasis: {
                    textStyle: {
                        color: 'white'  //省份字体颜色
                    }
                }
            },
            itemStyle: {
                normal: {
                    label: {
                        show: !isMobile(),
                        textStyle: {
                            color: 'white'  //省份字体颜色
                        }
                    },
                    areaColor: 'black', //地图背景色#00CD66
                    borderColor: '#FF8C69' //地图边框颜色

                },
                emphasis: {
                    areaColor: '#66CDAA',
                    /*textStyle:{
                        color:'white'  //省份字体颜色
                    }*/
                }
            },
            zoom: 1.2,
            scaleLimit: {min: 0.8, max: 1.2},
            data: data
        },

        {
            name: '光圈',
            type: 'effectScatter',
            coordinateSystem: 'geo',
            data: convertData(bubble),
            symbolSize: function (val) {
                return isMobile() ? 10 : 30;
            },
            showEffectOn: 'render',
            rippleEffect: {
                brushType: 'stroke'
            },
            hoverAnimation: true,
            label: {
                normal: {
                    formatter: function (params) {
                        return params.value[2]
                    },
                    position: 'top',
                    textStyle: {
                        color: '#F7F7F7' //光圈字体颜色
                    },
                    show: $('#show').is(':checked'),
                }
            },
            itemStyle: {
                normal: {
                    show: true,
                    color: '#fe8a0d' //光圈颜色
                }

            },
            zlevel: 2
        }
    ]


    var option = {
        backgroundColor: 'black',
        title: {
            text: '实时订单量',
            left: 'center',
            textStyle: {
                color: 'white'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: function (params) {
                if ($('#show').is(':checked')) {
                    if (obj[params.name]) {
                        return params.name + ":" + obj[params.name][0].value
                    } else {
                        return params.name + ":0"
                    }
                } else {
                    return ""
                }

            }
        },

        geo: {
            map: 'china',
            label: {
                normal: {
                    show: true,
                    areaColor: 'red'
                },
                emphasis: {
                    show: true,
                    areaColor: 'red'
                }
            },

            roam: false,

            zoom: 1.2,
            scaleLimit: {min: 0.8, max: 1.2},
        },
        visualMap: [
            {
                type: "continuous",
                min: 0,
                max: max,
                calculable: true,
                seriesIndex: 0, // 只作用于第一个series.data
                //color: ['#d94e5d', '#eac736', '#50a3ba'],
                //color:['#0000CD','#1E90FF','#1874CD'],
                //color:['#1510af','#1c1cff','#0f045b'],
                inRange: {
                    color: ['#0f045b', '#1c1cff', '#5CACEE'],
                    symbolSize: isMobile() ? [3, 3, 6, 2] : [100, 100]
                },
                textStyle: {
                    color: '#fff',
                },
                text: ['High', 'Low'],
                formatter: function (value) {
                    if ($('#show').is(':checked')) {
                        return value
                    } else {
                        return ""
                    }
                },
                itemHeight: isMobile() ? 70 : 140,
                left: '10%'


            }
        ],
        series: series
    };

    submitOrderMapChart.setOption(option);
    window.addEventListener('resize', function () {
        submitOrderMapChart.resize();
    })

    //var flag = true
    /*console.log("$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$")
    console.log(option)*/
    /*if(!window.intervalScatterId){
        window.intervalScatterId = setInterval(function(){
            //console.log(_.clone(JSON.parse(JSON.stringify(option))))
            var pre = option.series[1].data//JSON.parse(JSON.stringify(option.series[1].data));
            var tmpData = _.filter(pre,function(obj){return new Date().getTime()-obj.dt<2000})

            /!*console.log(new Date().getTime()+"####################")
            console.log(option)
            //console.log(pre)
            console.log(_.map(pre,function(obj){return obj.name+obj.value[2]}))
            console.log(_.map(tmpData,function(obj){return obj.name+obj.value[2]}))*!/
            option.series[1].data=tmpData
            bubble=_.filter(bubble,function(obj){return new Date().getTime()-obj.dt<2000})

            if(pre.length!=tmpData.length){
                submitOrderMapChart.setOption(option)
            }
        },1200)
    }*/


    window.timeOutScatterId = setTimeout(complexFunction, 2500);

    function complexFunction() {
        var pre = option.series[1].data//JSON.parse(JSON.stringify(option.series[1].data));
        var tmpData = _.filter(pre, function (obj) {
            return new Date().getTime() - obj.dt < 3200
        })

        option.series[1].data = tmpData;
        bubble = _.filter(bubble, function (obj) {
            return new Date().getTime() - obj.dt < 3200
        })

        if (pre.length != tmpData.length) {
            submitOrderMapChart.setOption(option)
        }
        window.timeOutScatterId = setTimeout(complexFunction, 2500);
    }


}