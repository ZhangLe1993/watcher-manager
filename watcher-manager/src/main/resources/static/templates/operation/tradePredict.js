Template.tradePredict.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operation').addClass('active');
    $('#tradePredict').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }
    subs.subscribe('operation_express_trade_predict', 'all');

    $('.reportRangeTradePredict').daterangepicker({
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
            '昨天': [moment().subtract(1, 'days').toDate(), moment().subtract(1, 'days').toDate()],
            '最近7天': [moment().subtract(6, 'days').toDate(), moment().toDate()],
            '最近30天': [moment().subtract(29, 'days').toDate(), moment().toDate()],
            '本周': [moment().startOf('week').toDate(), moment().endOf('week').toDate()],
            '上周': [moment().subtract(1, 'week').startOf('week').toDate(), moment().subtract(1, 'week').endOf('week').toDate()],
            '本月': [moment().startOf('month').toDate(), moment().endOf('month').toDate()],
            '上个月': [moment().subtract(1, 'month').startOf('month').toDate(), moment().subtract(1, 'month').endOf('month').toDate()],
            '今年': [moment().startOf('year').toDate(), moment().endOf('year').toDate()],
            '去年': [moment().subtract(1, 'year').startOf('year').toDate(), moment().subtract(1, 'year').endOf('year').toDate()]
        }
    }, pickDateRangeCallback);

    drawTradePredictChart();
};

// Template.tradePredict.helpers({
//     selector: function () {
//         return {$and: [{date: {$gte: Session.get("start")}},{date: {$lte: Session.get("end")}}]};
//     },
//     todayPredict: function () {
//         var dataSet = operation_express_trade_predict.findOne({date: new Date().format("yyyy-MM-dd")}, {
//             reactive: false
//         });
//         if (dataSet == undefined) {
//             return "数据尚未更新"
//         }
//         return dataSet.tradePredict.toLocaleString();
//     },
//     tomorrowPredict: function () {
//         var dataSet = operation_express_trade_predict.findOne({date: new Date().getNewDate(1)}, {
//             reactive: false
//         });
//         if (dataSet == undefined) {
//             return "数据尚未更新"
//         }
//         return dataSet.tradePredict.toLocaleString();
//     },
//     tomorrow2Predict: function () {
//         var dataSet = operation_express_trade_predict.findOne({date: new Date().getNewDate(2)}, {
//             reactive: false
//         });
//         if (dataSet == undefined) {
//             return "数据尚未更新"
//         }
//         return dataSet.tradePredict.toLocaleString();
//     },
//     yesterdayStats: function () {
//         var dataSet = operation_express_trade_predict.findOne({date: moment().subtract(1, 'days').toDate().format('yyyy-MM-dd')}, {
//             reactive: false
//         });
//         if (dataSet == undefined) {
//             return "数据尚未更新"
//         }
//         var stats = {
//             submitCount: 0,
//             receiptCount: 0,
//             accuracy: 0,
//             tradePredict: 0
//         };
//         stats.submitCount = dataSet.submitCount.toLocaleString();
//         stats.receiptCount = dataSet.receiptCount.toLocaleString();
//         stats.tradePredict = dataSet.tradePredict.toLocaleString();
//         stats.accuracy = (dataSet.accuracy * 100).toFixed(2) + "%";
//         return stats;

//     }
// });

function pickDateRangeCallback(start, end, label) {
    console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    $('.dateSelectLabel').html(start.format('YYYY-MM-DD') + ' ~ ' + end.format('YYYY-MM-DD'));
    drawTradePredictChart(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
}

function drawTradePredictChart(startDate, endDate) {

    if (startDate == undefined) {
        startDate = new Date(new Date().getTime() - 31 * 24 * 3600 * 1000).format("yyyy-MM-dd");
    }
    if (endDate == undefined) {
        endDate = new Date().format("yyyy-MM-dd");
    }
    Session.set({'start': startDate});
    Session.set({"end":endDate});
    var dataSet = operation_express_trade_predict.find({$and: [{date: {$gte: startDate}},{date: {$lte: endDate}}]}, {sort: {date: 1}}).fetch();
    var stats = {
        date: [],
        submitCount: [],
        receiptCount: [],
        transferRate: [],
        tradePredict: [],
        accuracy: []
    };
    dataSet.forEach(function (e) {
        stats.date.push(e.date);
        stats.submitCount.push(e.submitCount);
        stats.receiptCount.push(e.receiptCount);
        stats.transferRate.push((e.transferRate * 100).toFixed(2));
        stats.tradePredict.push(e.tradePredict);
        stats.accuracy.push((e.accuracy * 100).toFixed(2));
    });

    var option = {
        title: {
            text: '快递订单量历史数据',
            x:"center",
            y:"bottom"
        },
        tooltip: {
            trigger: 'axis'
        },
        grid:{
            bottom:'30%'
        },
        legend: {
            data: ['快递订单提交量', '预测准确率', '快递订单收货量', '预测快递订单到货量']
        },
        dataZoom: [
            {
                type: 'slider',
                start: 30,
                end: 100,
                bottom:'10%'
            }
        ],
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
            },
            {
                type: 'value',
                axisLabel: {
                    formatter: function (value, index) {
                        if (value == 0) {
                            return value
                        }
                        return value + "%"
                    }
                }
            }
        ],
        animationDuration: 2000,
        series: [
            {
                name: '快递订单提交量',
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
                data: stats.submitCount
            },
            {
                name: '预测准确率',
                type: 'line',
                lineStyle: {
                    normal: {
                        type: 'solid'
                    }
                },
                label: {
                    normal: {
                        show: true,
                        formatter: '{c}%'
                    }
                },
                yAxisIndex: 1,
                itemStyle: {
                    normal: {
                        show: true
                    }
                },
                data: stats.accuracy
            },
            {
                name: '快递订单收货量',
                type: 'line',
                lineStyle: {
                    normal: {
                        type: 'solid'
                    }
                },
                label: {
                    normal: {
                        show: true
                    }
                },
                itemStyle: {
                    normal: {show: true}
                },
                data: stats.receiptCount
            },
            {
                name: '预测快递订单到货量',
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
                data: stats.tradePredict
            }
        ]
    };

    var dateTradeReportChart = echarts.init(document.getElementById('totalTradePredictChart'));
    dateTradeReportChart.setOption(option);
    window.addEventListener('resize',dateTradeReportChart.resize)
}