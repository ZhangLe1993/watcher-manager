Template.sourceTypeTradeReport.rendered = function () {

    var flag = Template.currentData().flag;

    $('#reportrange').daterangepicker({
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

    var startDate = new Date(new Date().getTime() - 31 * 24 * 3600 * 1000).format("yyyy-MM-dd");
    var endDate = new Date().format("yyyy-MM-dd");

    var query = {
        "startDate": startDate,
        "endDate": endDate,
        "dataType":"trade_count_num",
        "selType":flag
    };

    requestURL(dataService + "/tradeCountDetail/sourceType", query).done(function (data) {
        drawSourceTypeLineReport(data,flag);
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

        requestURL(dataService + "/tradeCountDetail/sourceType", query).done(function (data) {
            drawSourceTypeLineReport(data,flag);
        });

    }

};

function drawSourceTypeLineReport(tradeNumDataSet,flag) {

    var dateArray = [];
    var tradeNumArrays = {
        total: [],
        xiaoMi: [],
        jdMobile: [],
        portal: [],
        wap: [],
        jd3C: [],
        yhd: [],
        outlets: [],
        sanXing: [],
        partners: []
    };

    tradeNumDataSet.forEach(function (e) {
        dateArray.push(e.date);
        tradeNumArrays.total.push(e.total);
        if (e.xiaoMi == undefined) {
            tradeNumArrays.xiaoMi.push(0);
        } else {
            tradeNumArrays.xiaoMi.push(e.xiaoMi);
        }
        if (e.sanXing == undefined) {
            tradeNumArrays.sanXing.push(0);
        } else {
            tradeNumArrays.sanXing.push(e.sanXing);
        }
        tradeNumArrays.jdMobile.push(e.jdMobile);
        tradeNumArrays.portal.push(e.portal);
        tradeNumArrays.wap.push(e.wap);
        tradeNumArrays.jd3C.push(e.jd3C);
        tradeNumArrays.yhd.push(e.yhd);
        tradeNumArrays.outlets.push(e.outlets);
        if (e.partners == undefined) {
            tradeNumArrays.partners.push(0);
        } else {
            tradeNumArrays.partners.push(e.partners);
        }
    });
    var dataList=[
        {
            name: '官网',
            type: 'line',
            stack: 'others',
            areaStyle: {normal: {}},
            data: tradeNumArrays.portal
        },
        {
            name: '官网M版',
            type: 'line',
            stack: 'others',
            areaStyle: {normal: {}},
            data: tradeNumArrays.wap
        },
        {
            name: '门店',
            type: 'line',
            stack: 'others',
            areaStyle: {normal: {}},
            data: tradeNumArrays.outlets
        },
        {
            name: '京东手机',
            type: 'line',
            stack: 'others',
            areaStyle: {normal: {}},
            data: tradeNumArrays.jdMobile
        },
        {
            name: '京东3C',
            type: 'line',
            stack: 'others',
            areaStyle: {normal: {}},
            data: tradeNumArrays.jd3C
        },
        {
            name: '小米',
            type: 'line',
            stack: 'others',
            areaStyle: {normal: {}},
            data: tradeNumArrays.xiaoMi
        },
        {
            name: '三星',
            type: 'line',
            stack: 'others',
            areaStyle: {normal: {}},
            data: tradeNumArrays.sanXing
        },
        {
            name: '一号店合作',
            type: 'line',
            stack: 'others',
            areaStyle: {normal: {}},
            data: tradeNumArrays.yhd
        },
        {
            name: '小合作方',
            type: 'line',
            stack: 'others',
            areaStyle: {normal: {}},
            data: tradeNumArrays.partners
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
    var legendList = [
        {
            name: '官网',
            icon: 'roundRect'
        }, '官网M版', '门店', '京东手机', '京东3C', '小米', '三星', '一号店合作', '小合作方', {name: '订单提交总量', icon: 'circle'}]

    if(flag =="AREA"){
        dataList=[
            {
                name: '官网',
                type: 'line',
                stack: 'others',
                areaStyle: {normal: {}},
                data: tradeNumArrays.portal
            },
            {
                name: '官网M版',
                type: 'line',
                stack: 'others',
                areaStyle: {normal: {}},
                data: tradeNumArrays.wap
            },
            {
                name: '门店',
                type: 'line',
                stack: 'others',
                areaStyle: {normal: {}},
                data: tradeNumArrays.outlets
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
        legendList = [
            {
                name: '官网',
                icon: 'roundRect'
            }, '官网M版', '门店', {name: '订单提交总量', icon: 'circle'}]
    }
    var option = {
        title: {
            text: '订单渠道来源对比'
        },
        tooltip: {
            trigger: 'axis'
        },
        toolbox: {
            show: true,
            feature: {
                dataView: {show: true}
            }
        },
        calculable: true,
        legend: {
            icon: 'roundRect',
            data: legendList
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
                end: 100        // 右边在 60% 的位置。
            }
        ],
        series: dataList
    };
    var sourceTypeTradeReportChart = echarts.init(document.getElementById('sourceTypeTradeLineReport'));
    sourceTypeTradeReportChart.clear()
    sourceTypeTradeReportChart.setOption(option)
    window.addEventListener('resize',sourceTypeTradeReportChart.resize)
}

