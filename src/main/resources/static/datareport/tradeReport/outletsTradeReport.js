Template.outletsTradeReport.rendered = function () {

    var flag = Template.currentData().flag;
    console.log(flag);

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
        "dataType":"trade_count_num",
        "selType":flag
    };

    requestURL(dataService + "/tradeCountDetail/outletsArea", query).done(function (data) {
        drawOutletsTradeReport(data,flag);
    });

    function pickDateRangeCallback(start, end, label) {
        console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
        $('#dateShow').html(start.format('YYYY-MM-DD') + ' ~ ' + end.format('YYYY-MM-DD'));
        var query = {
            "startDate": start.format('YYYY-MM-DD'),
            "endDate": end.format('YYYY-MM-DD'),
            "dataType":"trade_count_num",
            "selType":flag
        };

        requestURL(dataService + "/tradeCountDetail/outletsArea", query).done(function (data) {
            drawOutletsTradeReport(data,flag);
        });
    }

};

function drawOutletsTradeReport(tradeNumDataSet,flag) {

    var dateArray = [];
    var tradeNumArrays = {
        total: [],
        eastChina: [],
        northChina: [],
        southChina: [],
        westChina: []
    };
    tradeNumDataSet.forEach(function (e) {
        dateArray.push(e.date);
        tradeNumArrays.total.push(e.total);
        tradeNumArrays.eastChina.push(e.eastChina);
        tradeNumArrays.northChina.push(e.northChina);
        tradeNumArrays.southChina.push(e.southChina);
        tradeNumArrays.westChina.push(e.westChina);
    });
    var option = {
        title: {
            text: '门店订单对比'
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
            data: ['华东大区', '华北大区', '华南大区', '华西大区', '总量']
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
            {
                type: 'slider',
                start: 30,
                end: 100
            }
        ],
        legendHoverLink: true,
        series: [
            {
                name: '华东大区',
                type: 'line',
                stack: 'others',
                areaStyle: {normal: {}},
                data: tradeNumArrays.eastChina
            },
            {
                name: '华北大区',
                type: 'line',
                stack: 'others',
                areaStyle: {
                    normal: {},
                    emphasis: {
                        shadowColor: 'rgba(0, 0, 0, 0.5)',
                        shadowBlur: 200
                    }
                },
                data: tradeNumArrays.northChina
            },
            {
                name: '华南大区',
                type: 'line',
                stack: 'others',
                areaStyle: {normal: {}},
                data: tradeNumArrays.southChina
            },
            {
                name: '华西大区',
                type: 'line',
                stack: 'others',
                areaStyle: {normal: {}},
                data: tradeNumArrays.westChina
            },
            {
                name: '总量',
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


    var outletsTradeReportChart = echarts.init(document.getElementById('outletsTradeReport'));
    outletsTradeReportChart.setOption(option)
    window.addEventListener('resize',outletsTradeReportChart.resize);
}

