Template.VenderActivityGoldenDataInfo.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#VenderActivityDataInfoTab').addClass('active');
    $('#VenderActivityGoldenDataInfo').addClass('active');

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var dateGap = -13;
    var minWeekDate = "2016-07-03";
    var minMonthDate = "2016-07-01";
    var endDate = new Date().getNewDate(-1);
    var startDate = new Date(endDate).getNewDate(dateGap);
    var startWeekDate = moment().weekday(-7).format("YYYY-MM-DD")
    var endWeekDate = moment().weekday(-1).format("YYYY-MM-DD")
    if (startWeekDate < minWeekDate) {
        startWeekDate = minWeekDate;
    }
    var startMonthDate = moment().subtract(1, 'month').startOf('month').format("YYYY-MM-DD");
    var endMonthDate = moment().subtract(0, 'month').startOf('month').format("YYYY-MM-DD");
    if (startMonthDate < minMonthDate) {
        startMonthDate = minMonthDate;
    }
    var transformDate = function (date) {
        var dateStrArray = date.split('-');
        return dateStrArray[1] + '/' + dateStrArray[2] + '/' + dateStrArray[0]
    };

    var datePickerOptions = {
        "showDropdowns": true,
        //"alwaysShowCalendars": true,
        //"singleDatePicker": true,
        "autoApply": true,
        "alwaysShowCalendars": false,
        "startDate": transformDate(startDate),
        "endDate": transformDate(endDate),
        "minDate": transformDate("2017-01-01"),
        "maxDate": transformDate(endDate),
        "locale": {
            "format": "MM/DD/YYYY",
            "separator": " - ",
            "applyLabel": "确认",
            "cancelLabel": "取消",
            "fromLabel": "从",
            "toLabel": "至",
            "customRangeLabel": "自定义",
            "daysOfWeek": [
                "日",
                "一",
                "二",
                "三",
                "四",
                "五",
                "六"
            ],
            "monthNames": [
                "一月",
                "二月",
                "三月",
                "四月",
                "五月",
                "六月",
                "七月",
                "八月",
                "九月",
                "十月",
                "十一月",
                "十二月"
            ],
            "firstDay": 0
        },
        "ranges": {
            '昨天': [moment().subtract(1, 'days').toDate(), moment().subtract(1, 'days').toDate()],
            '最近7天': [moment().subtract(7, 'days').toDate(), moment().toDate()],
            '最近14天': [moment().subtract(14, 'days').toDate(), moment().toDate()],
            '最近30天': [moment().subtract(30, 'days').toDate(), moment().toDate()],
            '本周': [moment().startOf('week').toDate(), moment().endOf('week').toDate()],
            '上周': [moment().subtract(1, 'week').startOf('week').toDate(), moment().subtract(1, 'week').endOf('week').toDate()],
            '本月': [moment().startOf('month').toDate(), moment().endOf('month').toDate()],
            '上个月': [moment().subtract(1, 'month').startOf('month').toDate(), moment().subtract(1, 'month').endOf('month').toDate()],
            '今年': [moment().startOf('year').toDate(), moment().endOf('year').toDate()],
            '去年': [moment().subtract(1, 'year').startOf('year').toDate(), moment().subtract(1, 'year').endOf('year').toDate()]
        }
    };

    $(".dateSelectLabel").html(startDate + "~" + endDate);
    $('.webTrafficFunnelDate').daterangepicker(datePickerOptions, pickWebTrafficFunnelDateRangeCallback);

    $(".webTrafficFunnelDate").show();

    var dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g, "").split("~");
    var startDate = dt[0];
    var endDate = dt[1];
    filter.startDate = startDate;
    filter.endDate = endDate;
    renderPageDay(filter);

};

var filter = {};

function pickWebTrafficFunnelDateRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.dateSelectLabel').html(sdt + "~" + edt);
    filter.startDate = sdt;
    filter.endDate = edt;
    renderPageDay(filter);
}

function getSelectedFilter(dateType, $this) {
    if (dateType == "daily") {
        var dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g, "").split("~");
        var startDate = dt[0];
        var endDate = dt[1];
    } else if (dateType == "weekly") {
        var dt = $('.desktop-only .weekSelectLabel').text().replace(/ /g, "").split("~");
        var startDate = dt[0];
        var endDate = dt[1];
    } else {
        var dt = $('.desktop-only .monthSelectLabel').text().replace(/ /g, "").split("~");
        var startDate = dt[0];
        var endDate = dt[1];
    }

    filter.startDate = startDate;
    filter.endDate = endDate;

    return cleanParams(filter);
}

function renderPageDay(filter) {
    $("#tablee").hide();
    $("#loading2").show();
    var promise = getRiskControlRemittedStatistic(filter);
    promise.done(function (ret) {
        getVenderCancelOrderChart(ret);
    });

    var promise = getRiskControlVenderGoldenLevelStatistic(filter);
    promise.done(function (ret) {
        $("#tablee").show();
        $("#loading2").hide();
        renderTable(ret, '#tablee');
        //履约金模式
    });

    $("#tabled").hide();
    $("#loading").show();
    var promise = getRiskControlGoldenStatistic(filter);
    promise.done(function (ret) {
        getVenderGoldenChart(ret);
    });

    var promise = getRiskControlVenderFrozenGoldenLevelStatistic(filter);
    promise.done(function (ret) {
        $("#tabled").show();
        $("#loading").hide();

        //renderTable
        renderTable(ret, '#tabled');
        //履约金模式
    });
    //出库订单金蛋金额和比值
    venderShopoutMixedChartFunc(filter).done(function(ret){
        venderShopoutMixedChart(ret)
    })
    venderShopoutLevelMixedChartFunc(filter).done(function(ret){
        $("#venderShopoutTable").bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data: ret
        });
    })
}

//店员金蛋分析
function renderTable(data, tableName) {
    data.forEach(function(e){
        e.numRate=(((e.num/ e.allNum)*100).toFixed(2))+"%"
    })
    $(tableName).bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        data: data
    });
}

//店员金蛋折线图
function getVenderGoldenChart(data) {

    var dateList = [];
    var series = {
        num: [],
        numRate: []
    }
    data.forEach(function (e) {
        dateList.push(e.date);
        series.num.push(e.cnt);
        series.numRate.push(((e.cnt / e.cancelCnt) * 100).toFixed(2));
    });
    dateList = _.uniq(dateList);

    var option = {
        title: {
            text: '店员金蛋金额和比值',
            //top: '80%',
            left: 'center',

        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params, ticket, callback) {
                var str = params[0].name + '<br/>';
                params.forEach(function (obj) {
                    if (obj.seriesName.indexOf("比值") > -1) {
                        str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                    } else {
                        str += obj.seriesName + ' : ' + obj.value + '<br/>'
                    }
                });
                return str;
            }
        },
        legend: {
            data: ["店员金蛋金额", "店员金蛋金额比值"],
            padding: [50, 0, 0, 0]
        },
        calculable: true,
        grid: {
            top: 80,
            bottom: 100
        },
        xAxis: [
            {
                'type': 'category',
                'data': dateList
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '元'
            },
            {
                type: 'value',
                name: '%'
            }
        ],
        series: [
            {
                name: '店员金蛋金额',
                type: 'line',
                label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                data: series.num
            },
            {
                name: '店员金蛋金额比值',
                type: 'line',
                yAxisIndex: 1,
                label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                data: series.numRate
            }
        ]
    };

    var venderTradeTrendMixedChart = echarts.init(document.getElementById('venderGoldenMixedChart'));
    venderTradeTrendMixedChart.setOption(option);
    window.addEventListener('resize', venderTradeTrendMixedChart.resize)

}

//店员解冻金蛋折线图
function getVenderCancelOrderChart(data) {

    var dateList = [];
    var series = {
        num: [],
        numRate: []
    }
    data.forEach(function (e) {
        dateList.push(e.date);
        series.num.push(e.cnt);
        series.numRate.push(((e.cnt / e.cancelCnt) * 100).toFixed(2));
    });
    dateList = _.uniq(dateList);

    var option = {
        title: {
            text: '店员解冻金蛋金额和比值',
            //top: '80%',
            left: 'center',

        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params, ticket, callback) {
                var str = params[0].name + '<br/>';
                params.forEach(function (obj) {
                    if (obj.seriesName.indexOf("比值") > -1) {
                        str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                    } else {
                        str += obj.seriesName + ' : ' + obj.value + '<br/>'
                    }
                });
                return str;
            }
        },
        legend: {
            data: ["店员解冻金蛋金额", "店员解冻金蛋金额比值"],
            padding: [50, 0, 0, 0]
        },
        calculable: true,
        grid: {
            top: 80,
            bottom: 100
        },
        xAxis: [
            {
                'type': 'category',
                'data': dateList
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '元'
            },
            {
                type: 'value',
                name: '%'
            }
        ],
        series: [
            {
                name: '店员解冻金蛋金额',
                type: 'line',
                label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                data: series.num
            },
            {
                name: '店员解冻金蛋金额比值',
                type: 'line',
                yAxisIndex: 1,
                label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                data: series.numRate
            }
        ]
    };

    var venderTradeTrendMixedChart = echarts.init(document.getElementById('venderTradeTrendMixedChart'));
    venderTradeTrendMixedChart.setOption(option);
    window.addEventListener('resize', venderTradeTrendMixedChart.resize)

}

function venderShopoutMixedChart(data) {

    var dateList = [];
    var series = {
        num: [],
        numRate: []
    }
    data.forEach(function (e) {
        dateList.push(e.date);
        series.num.push(e.goldenNum);
        series.numRate.push(((e.goldenNum / e.quotation_price) * 100).toFixed(2));
    });
    dateList = _.uniq(dateList);

    var option = {
        title: {
            text: '出库订单金蛋金额和比值',
            //top: '80%',
            left: 'center',

        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params, ticket, callback) {
                var str = params[0].name + '<br/>';
                params.forEach(function (obj) {
                    if (obj.seriesName.indexOf("比值") > -1) {
                        str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                    } else {
                        str += obj.seriesName + ' : ' + obj.value + '<br/>'
                    }
                });
                return str;
            }
        },
        legend: {
            data: ["出库订单金蛋金额金额", "出库订单金蛋金额比值"],
            padding: [50, 0, 0, 0]
        },
        calculable: true,
        grid: {
            top: 80,
            bottom: 100
        },
        xAxis: [
            {
                'type': 'category',
                'data': dateList
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '元'
            },
            {
                type: 'value',
                name: '%'
            }
        ],
        series: [
            {
                name: '出库订单金蛋金额',
                type: 'line',
                label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                data: series.num
            },
            {
                name: '出库订单金蛋金额比值',
                type: 'line',
                yAxisIndex: 1,
                label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                data: series.numRate
            }
        ]
    };

    var venderShopoutMixedChart = echarts.init(document.getElementById('venderShopoutMixedChart'));
    venderShopoutMixedChart.setOption(option);
    window.addEventListener('resize', venderShopoutMixedChart.resize)

}

function cleanParams(filter) {
    //clean parameters
    var query = _.clone(filter);
    for (var key in query) {
        if (!query[key] && key != "offset") {
            delete query[key]
        }
    }
    return query
}

//风控--店员金蛋分析
function getRiskControlGoldenStatistic(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getRiskControlVenderFrozenGoldenStatistic", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}

//风控--店员解冻金蛋分析
function getRiskControlRemittedStatistic(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getRiskControlVenderGoldenStatistic", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}

//风控--店员金蛋等级分析
function getRiskControlVenderFrozenGoldenLevelStatistic(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getRiskControlVenderFrozenGoldenLevelStatistic", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}

//风控--店员解冻金蛋等级分析
function getRiskControlVenderGoldenLevelStatistic(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getRiskControlVenderGoldenLevelStatistic", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}

//出库订单金蛋金额和比值
function venderShopoutMixedChartFunc(filter){
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getVenderShopoutGoldenStatistics", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}
function venderShopoutLevelMixedChartFunc(filter){
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getVenderShopoutGoldenLevelStatistics", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}




