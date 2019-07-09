Template.tradeWeeklyReport.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#datareport').addClass('active');
    $('#tradeWeekly').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }
    $('.reportWeekRange').daterangepicker({
        "showDropdowns": true,
        "alwaysShowCalendars": true,
        "linkedCalendars": false,
        "autoApply": true,
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
            "firstDay": 1
        },
        "ranges": {
            '上周': [moment().subtract(7, 'days').toDate(), moment().subtract(1, 'days').toDate()],
            '最近7周': [moment().subtract(7, 'weeks').toDate(), moment().toDate()],
            '最近30周': [moment().subtract(29, 'weeks').toDate(), moment().toDate()],
            '本月': [moment().startOf('month').toDate(), moment().endOf('month').toDate()],
            '上个月': [moment().subtract(1, 'month').startOf('month').toDate(), moment().subtract(1, 'month').endOf('month').toDate()],
            '今年': [moment().startOf('year').toDate(), moment().endOf('year').toDate()],
            '去年': [moment().subtract(1, 'year').startOf('year').toDate(), moment().subtract(1, 'year').endOf('year').toDate()]
        }
    }, pickDateRangeCallback);

    drawWeekTradeReport();
    /*    drawTradeMethodPieReport();
     drawSourceTypePieReport();
     drawOutletsTradePieReport();
     drawOndoorTradePieReport();*/

    drawWeekDealReport();
    /*    drawSourceTypeDealPieReport();
     drawDealMethodPieReport();
     drawOutletsDealPieReport();
     drawOndoorDealPieReport();*/

    drawWeekDealRateReport();
    /*drawSourceTypeDealRateBarReport();
     drawTradeMethodDealRateBarReport();*/

    drawWeekAmountReport();
    /*drawSourceTypeDealAmountPieReport();
     drawTradeMethodDealAmountPieReport();
     drawOutletsDealAmountPieReport();
     drawOndoorDealAmountPieReport();*/

    drawWeekUnitPriceReport();
    /*    drawSourceTypeUnitPriceBarReport();
     drawTradeMethodUnitPriceBarReport();
     drawOutletsUnitPriceBarReport();
     drawOndoorUnitPriceBarReport();*/

};

function pickDateRangeCallback(start, end, label) {
    console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    $('.dateSelectLabel').html(start.format('YYYY-MM-DD') + ' ~ ' + end.format('YYYY-MM-DD'));
    drawWeekTradeReport(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
    /*drawTradeMethodPieReport(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
     drawSourceTypePieReport(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
     drawOutletsTradePieReport(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
     drawOndoorTradePieReport(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));*/

    drawWeekDealReport(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
    /*drawSourceTypeDealPieReport(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
     drawDealMethodPieReport(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
     drawOutletsDealPieReport(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
     drawOndoorDealPieReport(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));*/

    drawWeekDealRateReport(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
    /*drawSourceTypeDealRateBarReport(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
     drawTradeMethodDealRateBarReport(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));*/

    drawWeekAmountReport(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
    /*drawSourceTypeDealAmountPieReport(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
     drawTradeMethodDealAmountPieReport(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
     drawOutletsDealAmountPieReport(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
     drawOndoorDealAmountPieReport(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));*/

    drawWeekUnitPriceReport(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
    /*drawSourceTypeUnitPriceBarReport(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
     drawTradeMethodUnitPriceBarReport(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
     drawOutletsUnitPriceBarReport(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
     drawOndoorUnitPriceBarReport(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));*/
}

function drawWeekTradeReport(startDate, endDate) {
    /*var yesterdayStats = weekTradeReport.findOne({}, {sort: {date: -1}});
     var days2Before = new Date(new Date(yesterdayStats.date).getTime() - 24 * 3600 * 1000).format("yyyy-MM-dd");
     var days2BeforeStats = weekTradeReport.findOne({date: days2Before});
     var rate1 = (yesterdayStats.tradeNum - days2BeforeStats.tradeNum) / days2BeforeStats.tradeNum;
     var percent1 = Math.round(rate1 * 10000) / 100;
     var rate7 = (yesterdayStats.tradeNum - yesterdayStats.weekAgoNum) / yesterdayStats.weekAgoNum;
     var percent7 = Math.round(rate7 * 10000) / 100;*/
    if (startDate == undefined) {
        startDate = new Date(new Date().getTime() - 210 * 24 * 3600 * 1000).format("yyyy-MM-dd");
    }
    if (endDate == undefined) {
        endDate = new Date().format("yyyy-MM-dd");
    }
    var tradeNumDataSet = weekTradeReport.find({$and: [{date: {$gte: startDate}}, {date: {$lte: endDate}}]}, {sort: {date: 1}}).fetch();
    var stats = {
        date: [],
        yearWeek: [],
        tradeNum: [],
        weekAgoNum: [],
        monthAgoNum: []
    };
    tradeNumDataSet.forEach(function (e) {
        stats.date.push(e.date + "周");
        stats.yearWeek.push(e.yearWeek);
        stats.tradeNum.push(e.tradeNum);
    });

    var option = {
        title: {
            text: '订单时间维度对比'/*,
             subtext: yesterdayStats.date + ' 提交订单量: ' + yesterdayStats.tradeNum + '  一天增长率: ' + percent1 + '% 七天增长率: ' + percent7 + '%',
             subtextStyle: {
             color: '#333',
             fontStyle: 'normal',
             fontWeight: 'bold'
             }*/
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['订单提交量', '7天前订单提交量', '30天前订单提交量']
        },
        dataZoom: [
            {
                type: 'slider',
                start: 30,
                end: 100
            }
        ],
        toolbox: {
            feature: {
                dataView: {}
            }
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: stats.date
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        animationDuration: 2000,
        series: [
            {
                name: '订单提交量',
                type: 'line',
                label: {
                    normal: {
                        show: true
                    }
                },
                lineStyle: {
                    normal: {
                        type: 'solid'
                    }
                },
                data: stats.tradeNum
            }/*,
             {
             name: '7天前订单提交量',
             type: 'line',
             lineStyle: {
             normal: {
             type: 'dashed'
             }
             },
             itemStyle: {
             normal: {
             opacity: 0
             }
             },
             data: stats.weekAgoNum
             },
             {
             name: '30天前订单提交量',
             type: 'line',
             lineStyle: {
             normal: {
             type: 'dashed'
             }
             },
             itemStyle: {
             normal: {
             opacity: 0
             }
             },
             data: stats.monthAgoNum
             }*/
        ]
    };

    var weekTradeReportChart = echarts.init(document.getElementById('weekTradeReport'));
    weekTradeReportChart.setOption(option)
    window.addEventListener('resize',weekTradeReportChart.resize);
}

function drawWeekDealReport(startDate, endDate) {
    /*var yesterdayStats = weekTradeReport.findOne({}, {sort: {date: -1}});
     var days2Before = new Date(new Date(yesterdayStats.date).getTime() - 24 * 3600 * 1000).format("yyyy-MM-dd");
     var days2BeforeStats = weekTradeReport.findOne({date: days2Before});
     var rate1 = (yesterdayStats.tradeNum - days2BeforeStats.tradeNum) / days2BeforeStats.tradeNum;
     var percent1 = Math.round(rate1 * 10000) / 100;
     var rate7 = (yesterdayStats.tradeNum - yesterdayStats.weekAgoNum) / yesterdayStats.weekAgoNum;
     var percent7 = Math.round(rate7 * 10000) / 100;*/
    if (startDate == undefined) {
        startDate = new Date(new Date().getTime() - 210 * 24 * 3600 * 1000).format("yyyy-MM-dd");
    }
    if (endDate == undefined) {
        endDate = new Date().format("yyyy-MM-dd");
    }
    var tradeNumDataSet = weekTradeReport.find({$and: [{date: {$gte: startDate}}, {date: {$lte: endDate}}]}, {sort: {date: 1}}).fetch();
    var stats = {
        date: [],
        yearWeek: [],
        dealNum: [],
        weekAgoNum: [],
        monthAgoNum: []
    };
    tradeNumDataSet.forEach(function (e) {
        stats.date.push(e.date + "周");
        stats.yearWeek.push(e.yearWeek);
        stats.dealNum.push(e.dealNum);
    });

    var option = {
        title: {
            text: '成交订单时间维度对比'/*,
             subtext: yesterdayStats.date + ' 提交订单量: ' + yesterdayStats.tradeNum + '  一天增长率: ' + percent1 + '% 七天增长率: ' + percent7 + '%',
             subtextStyle: {
             color: '#333',
             fontStyle: 'normal',
             fontWeight: 'bold'
             }*/
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['订单成交量', '7天前订单提交量', '30天前订单提交量']
        },
        dataZoom: [
            {
                type: 'slider',
                start: 30,
                end: 100
            }
        ],
        toolbox: {
            feature: {
                dataView: {}
            }
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: stats.date
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        animationDuration: 2000,
        series: [
            {
                name: '订单成交量',
                type: 'line',
                label: {
                    normal: {
                        show: true
                    }
                },
                lineStyle: {
                    normal: {
                        type: 'solid'
                    }
                },
                data: stats.dealNum
            }/*,
             {
             name: '7天前订单提交量',
             type: 'line',
             lineStyle: {
             normal: {
             type: 'dashed'
             }
             },
             itemStyle: {
             normal: {
             opacity: 0
             }
             },
             data: stats.weekAgoNum
             },
             {
             name: '30天前订单提交量',
             type: 'line',
             lineStyle: {
             normal: {
             type: 'dashed'
             }
             },
             itemStyle: {
             normal: {
             opacity: 0
             }
             },
             data: stats.monthAgoNum
             }*/
        ]
    };

    var weekDealReportChart = echarts.init(document.getElementById('weekDealReport'));
    weekDealReportChart.setOption(option)
    window.addEventListener('resize',weekDealReportChart.resize)
}

function drawWeekDealRateReport(startDate, endDate) {
    /*var yesterdayStats = weekTradeReport.findOne({}, {sort: {date: -1}});
     var days2Before = new Date(new Date(yesterdayStats.date).getTime() - 24 * 3600 * 1000).format("yyyy-MM-dd");
     var days2BeforeStats = weekTradeReport.findOne({date: days2Before});
     var rate1 = (yesterdayStats.tradeNum - days2BeforeStats.tradeNum) / days2BeforeStats.tradeNum;
     var percent1 = Math.round(rate1 * 10000) / 100;
     var rate7 = (yesterdayStats.tradeNum - yesterdayStats.weekAgoNum) / yesterdayStats.weekAgoNum;
     var percent7 = Math.round(rate7 * 10000) / 100;*/
    if (startDate == undefined) {
        startDate = new Date(new Date().getTime() - 210 * 24 * 3600 * 1000).format("yyyy-MM-dd");
    }
    if (endDate == undefined) {
        endDate = new Date().format("yyyy-MM-dd");
    }
    var tradeNumDataSet = weekTradeReport.find({$and: [{date: {$gte: startDate}}, {date: {$lte: endDate}}]}, {sort: {date: 1}}).fetch();
    var stats = {
        date: [],
        yearWeek: [],
        dealRate: [],
        weekAgoNum: [],
        monthAgoNum: []
    };
    tradeNumDataSet.forEach(function (e) {
        stats.date.push(e.date + "周");
        stats.yearWeek.push(e.yearWeek);
        stats.dealRate.push((e.dealNum / e.tradeFinishNum * 100).toFixed(2));
    });

    var option = {
        title: {
            text: '成交率时间维度对比'/*,
             subtext: yesterdayStats.date + ' 提交订单量: ' + yesterdayStats.tradeNum + '  一天增长率: ' + percent1 + '% 七天增长率: ' + percent7 + '%',
             subtextStyle: {
             color: '#333',
             fontStyle: 'normal',
             fontWeight: 'bold'
             }*/
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['订单成交率', '7天前订单提交量', '30天前订单提交量']
        },
        dataZoom: [
            {
                type: 'slider',
                start: 30,
                end: 100
            }
        ],
        toolbox: {
            feature: {
                dataView: {}
            }
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: stats.date
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    formatter: '{value}%'
                }
            }
        ],
        animationDuration: 2000,
        series: [
            {
                name: '订单成交率',
                type: 'line',
                label: {
                    normal: {
                        show: true,
                        formatter: '{c}%'
                    }
                },
                lineStyle: {
                    normal: {
                        type: 'solid'
                    }
                },
                data: stats.dealRate
            }/*,
             {
             name: '7天前订单提交量',
             type: 'line',
             lineStyle: {
             normal: {
             type: 'dashed'
             }
             },
             itemStyle: {
             normal: {
             opacity: 0
             }
             },
             data: stats.weekAgoNum
             },
             {
             name: '30天前订单提交量',
             type: 'line',
             lineStyle: {
             normal: {
             type: 'dashed'
             }
             },
             itemStyle: {
             normal: {
             opacity: 0
             }
             },
             data: stats.monthAgoNum
             }*/
        ]
    };

    var weekDealRateReportChart = echarts.init(document.getElementById('weekDealRateReport'));
    weekDealRateReportChart.setOption(option)
    window.addEventListener('resize',weekDealRateReportChart.resize)
}

function drawWeekAmountReport(startDate, endDate) {
    /*var yesterdayStats = weekTradeReport.findOne({}, {sort: {date: -1}});
     var days2Before = new Date(new Date(yesterdayStats.date).getTime() - 24 * 3600 * 1000).format("yyyy-MM-dd");
     var days2BeforeStats = weekTradeReport.findOne({date: days2Before});
     var rate1 = (yesterdayStats.tradeNum - days2BeforeStats.tradeNum) / days2BeforeStats.tradeNum;
     var percent1 = Math.round(rate1 * 10000) / 100;
     var rate7 = (yesterdayStats.tradeNum - yesterdayStats.weekAgoNum) / yesterdayStats.weekAgoNum;
     var percent7 = Math.round(rate7 * 10000) / 100;*/
    if (startDate == undefined) {
        startDate = new Date(new Date().getTime() - 210 * 24 * 3600 * 1000).format("yyyy-MM-dd");
    }
    if (endDate == undefined) {
        endDate = new Date().format("yyyy-MM-dd");
    }
    var tradeNumDataSet = weekTradeReport.find({$and: [{date: {$gte: startDate}}, {date: {$lte: endDate}}]}, {sort: {date: 1}}).fetch();
    var stats = {
        date: [],
        yearWeek: [],
        dealPayAmount: []
    };
    tradeNumDataSet.forEach(function (e) {
        stats.date.push(e.date + "周");
        stats.yearWeek.push(e.yearWeek);
        stats.dealPayAmount.push(e.dealPayAmount);
    });

    var option = {
        title: {
            text: '成交金额时间维度对比'/*,
             subtext: yesterdayStats.date + ' 提交订单量: ' + yesterdayStats.tradeNum + '  一天增长率: ' + percent1 + '% 七天增长率: ' + percent7 + '%',
             subtextStyle: {
             color: '#333',
             fontStyle: 'normal',
             fontWeight: 'bold'
             }*/
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['订单成交金额', '7天前订单提交量', '30天前订单提交量']
        },
        dataZoom: [
            {
                type: 'slider',
                start: 30,
                end: 100
            }
        ],
        toolbox: {
            feature: {
                dataView: {}
            }
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: stats.date
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    formatter: '￥{value}'
                }
            }
        ],
        animationDuration: 2000,
        series: [
            {
                name: '订单成交金额',
                type: 'line',
                label: {
                    normal: {
                        show: true,
                        formatter: "￥{c}"
                    }
                },
                lineStyle: {
                    normal: {
                        type: 'solid'
                    }
                },
                data: stats.dealPayAmount
            }/*,
             {
             name: '7天前订单提交量',
             type: 'line',
             lineStyle: {
             normal: {
             type: 'dashed'
             }
             },
             itemStyle: {
             normal: {
             opacity: 0
             }
             },
             data: stats.weekAgoNum
             },
             {
             name: '30天前订单提交量',
             type: 'line',
             lineStyle: {
             normal: {
             type: 'dashed'
             }
             },
             itemStyle: {
             normal: {
             opacity: 0
             }
             },
             data: stats.monthAgoNum
             }*/
        ]
    };

    var weekDealAmountReportChart = echarts.init(document.getElementById('weekDealAmountReport'));
    weekDealAmountReportChart.setOption(option)
    window.addEventListener('resize',weekDealAmountReportChart.resize)
}

function drawWeekUnitPriceReport(startDate, endDate) {
    /*var yesterdayStats = weekTradeReport.findOne({}, {sort: {date: -1}});
     var days2Before = new Date(new Date(yesterdayStats.date).getTime() - 24 * 3600 * 1000).format("yyyy-MM-dd");
     var days2BeforeStats = weekTradeReport.findOne({date: days2Before});
     var rate1 = (yesterdayStats.tradeNum - days2BeforeStats.tradeNum) / days2BeforeStats.tradeNum;
     var percent1 = Math.round(rate1 * 10000) / 100;
     var rate7 = (yesterdayStats.tradeNum - yesterdayStats.weekAgoNum) / yesterdayStats.weekAgoNum;
     var percent7 = Math.round(rate7 * 10000) / 100;*/
    if (startDate == undefined) {
        startDate = new Date(new Date().getTime() - 210 * 24 * 3600 * 1000).format("yyyy-MM-dd");
    }
    if (endDate == undefined) {
        endDate = new Date().format("yyyy-MM-dd");
    }
    var tradeNumDataSet = weekTradeReport.find({$and: [{date: {$gte: startDate}}, {date: {$lte: endDate}}]}, {sort: {date: 1}}).fetch();
    var stats = {
        date: [],
        yearWeek: [],
        unitPrice: [],
        weekAgoNum: [],
        monthAgoNum: []
    };
    tradeNumDataSet.forEach(function (e) {
        stats.date.push(e.date + "周");
        stats.yearWeek.push(e.yearWeek);
        stats.unitPrice.push((e.dealPayAmount / e.dealNum).toFixed(1));
    });

    var option = {
        title: {
            text: '客单价时间维度对比'/*,
             subtext: yesterdayStats.date + ' 提交订单量: ' + yesterdayStats.tradeNum + '  一天增长率: ' + percent1 + '% 七天增长率: ' + percent7 + '%',
             subtextStyle: {
             color: '#333',
             fontStyle: 'normal',
             fontWeight: 'bold'
             }*/
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['成交客单价', '7天前订单提交量', '30天前订单提交量']
        },
        dataZoom: [
            {
                type: 'slider',
                start: 30,
                end: 100
            }
        ],
        toolbox: {
            feature: {
                dataView: {}
            }
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: stats.date
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    formatter: '￥{value}'
                }
            }
        ],
        animationDuration: 2000,
        series: [
            {
                name: '成交客单价',
                type: 'line',
                label: {
                    normal: {
                        show: true,
                        formatter: "￥{c}"
                    }
                },
                lineStyle: {
                    normal: {
                        type: 'solid'
                    }
                },
                data: stats.unitPrice
            }/*,
             {
             name: '7天前订单提交量',
             type: 'line',
             lineStyle: {
             normal: {
             type: 'dashed'
             }
             },
             itemStyle: {
             normal: {
             opacity: 0
             }
             },
             data: stats.weekAgoNum
             },
             {
             name: '30天前订单提交量',
             type: 'line',
             lineStyle: {
             normal: {
             type: 'dashed'
             }
             },
             itemStyle: {
             normal: {
             opacity: 0
             }
             },
             data: stats.monthAgoNum
             }*/
        ]
    };

    var weekUnitPriceReportChart = echarts.init(document.getElementById('weekUnitPriceReport'));
    weekUnitPriceReportChart.setOption(option)
}