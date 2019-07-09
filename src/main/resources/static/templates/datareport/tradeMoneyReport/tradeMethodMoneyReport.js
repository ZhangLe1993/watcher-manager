Template.tradeMethodMoneyReport.rendered = function () {
    var flag = Template.currentData().flag;
    $('#reportrange').daterangepicker({
        "showDropdowns": true,
        "alwaysShowCalendars": true,
        "startDate": "02/24/2016",
        "endDate": "03/01/2016",
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

    var startDate = new Date(new Date().getTime() - 31 * 24 * 3600 * 1000).format("yyyy-MM-dd");
    var endDate = new Date().format("yyyy-MM-dd");

    var query = {
        "startDate": startDate,
        "endDate": endDate,
        "dataType":"trade_success_pay_amount_num",
        "selType":flag
    };

    requestURL(dataService + "/tradeCountDetail/tradeMethod",query).done(function (data) {
        drawTradeMethodReport(data);
    });


    function pickDateRangeCallback(start, end, label) {
        console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
        $('#dateShow').html(start.format('YYYY-MM-DD') + ' ~ ' + end.format('YYYY-MM-DD'));
        var query = {
            "startDate": start.format('YYYY-MM-DD'),
            "endDate": end.format('YYYY-MM-DD'),
            "dataType":"trade_success_pay_amount_num",
            "selType":flag
        };

        requestURL(dataService + "/tradeCountDetail/tradeMethod", query).done(function (data) {
            drawTradeMethodReport(data);
        });
    }

};

function drawTradeMethodReport(tradeNumDataSet) {

    var dateArray = [];
    var tradeNumArrays = {
        total: [],
        outlets: [],
        o2o: [],
        ondoor: [],
        express: []
    };
    tradeNumDataSet.forEach(function (e) {
        dateArray.push(e.date);
        tradeNumArrays.total.push(e.total);
        tradeNumArrays.outlets.push(e.outlets);
        tradeNumArrays.o2o.push(e.o2o);
        tradeNumArrays.ondoor.push(e.ondoor);
        tradeNumArrays.express.push(e.express);
    });
    var option = {
        title: {
            text: '成交金额交易方式对比'
        },
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            show: true,
            feature: {
                mark: {show: true},
                magicType: {show: true, type: ['line', 'bar']},
                restore: {show: true},
                saveAsImage: {show: true}
            }
        },
        calculable: true,
        legend: {
            icon: 'roundRect',
            data: ['快递订单', '门店订单', 'O2O订单', '上门订单', {name: '订单提交总量', icon: 'circle'}]
        },
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: dateArray
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        dataZoom: [
            {   // 这个dataZoom组件，默认控制x轴。
                type: 'slider', // 这个 dataZoom 组件是 slider 型 dataZoom 组件
                start: 30,
                end: 100         // 右边在 60% 的位置。
            }
        ],
        series: [
            {
                name: '快递订单',
                type: 'line',
                stack: 'others',
                areaStyle: {normal: {}},
                data: tradeNumArrays.express
            },
            {
                name: '门店订单',
                type: 'line',
                stack: 'others',
                areaStyle: {normal: {}},
                data: tradeNumArrays.outlets
            },
            {
                name: 'O2O订单',
                type: 'line',
                stack: 'others',
                areaStyle: {normal: {}},
                data: tradeNumArrays.o2o
            },
            {
                name: '上门订单',
                type: 'line',
                stack: 'others',
                areaStyle: {normal: {}},
                data: tradeNumArrays.ondoor
            },
            {
                name: '订单提交总量',
                type: 'line',
                label: {
                    normal: {
                        show: true
                    }
                },
                data: tradeNumArrays.total
            }
        ]
    };
    var tradeMethodMoneyReportChart = echarts.init(document.getElementById('tradeMethodMoneyReport'));
    tradeMethodMoneyReportChart.setOption(option)
    window.addEventListener('resize',tradeMethodMoneyReportChart.resize);
}

