Template.hrbank.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#TPDataserviceTab').addClass('active');
    $('#hrbank').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }
    var dateRangeSelect = $('.reportRange');
    var weekRangeSelect = $('.reportWeekRange');
    var monthRangeSelect = $('.reportMonthRange');

    dateRangeSelect.daterangepicker({
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
            "firstDay": 7
        },
        "ranges": {
            '昨天': [moment().subtract(1, 'days').toDate(), moment().subtract(1, 'days').toDate()],
            '本周': [moment().startOf('week').toDate(), moment().endOf('week').toDate()],
            '上周': [moment().subtract(1, 'week').startOf('week').toDate(), moment().subtract(1, 'week').endOf('week').toDate()],
            '本月': [moment().startOf('month').toDate(), moment().endOf('month').toDate()],
            '上个月': [moment().subtract(1, 'month').startOf('month').toDate(), moment().subtract(1, 'month').endOf('month').toDate()],
            '今年': [moment().startOf('year').toDate(), moment().endOf('year').toDate()],
            '去年': [moment().subtract(1, 'year').startOf('year').toDate(), moment().subtract(1, 'year').endOf('year').toDate()],
            '最近7天': [moment().subtract(6, 'days').toDate(), moment().toDate()],
            '最近30天': [moment().subtract(29, 'days').toDate(), moment().toDate()],
            '历史所有': [moment().subtract(3000, 'week').toDate(), moment().toDate()]
        }
    }, pickDateRangeCallback);
    weekRangeSelect.daterangepicker({
        "autoUpdateInput": false,
        "showCustomRangeLabel": false,
        "showDropdowns": false,
        "alwaysShowCalendars": false,
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
            "weekLabel": "周数",
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
            "firstDay": 7
        },
        "ranges": {
            '今天': [moment().toDate(), moment().toDate()],
            '本月': [moment().startOf('month').toDate(), moment().endOf('month').toDate()],
            '上个月': [moment().subtract(1, 'month').startOf('month').toDate(), moment().subtract(1, 'month').endOf('month').toDate()],
            '今年': [moment().startOf('year').toDate(), moment().endOf('year').toDate()],
            '去年': [moment().subtract(1, 'year').startOf('year').toDate(), moment().subtract(1, 'year').endOf('year').toDate()],
            '前7周': [moment().subtract(7, 'week').startOf('week').toDate(), moment().subtract(1, 'week').endOf('week').toDate()],
            '前15周': [moment().subtract(15, 'week').startOf('week').toDate(), moment().subtract(1, 'week').endOf('week').toDate()],
            '前30周': [moment().subtract(30, 'week').startOf('week').toDate(), moment().subtract(1, 'week').endOf('week').toDate()],
            '历史所有': [moment().subtract(3000, 'week').startOf('week').toDate(), moment().subtract(1, 'week').endOf('week').toDate()]
        }
    }, pickWeekRangeCallback);
    monthRangeSelect.daterangepicker({
        "autoUpdateInput": false,
        "showCustomRangeLabel": false,
        "showDropdowns": false,
        "alwaysShowCalendars": false,
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
            "firstDay": 7
        },
        "ranges": {
            '今天': [moment().toDate(), moment().toDate()],
            '本月': [moment().startOf('month').toDate(), moment().endOf('month').toDate()],
            '上个月': [moment().subtract(1, 'month').startOf('month').toDate(), moment().subtract(1, 'month').endOf('month').toDate()],
            '今年': [moment().startOf('year').toDate(), moment().endOf('year').toDate()],
            '去年': [moment().subtract(1, 'year').startOf('year').toDate(), moment().subtract(1, 'year').endOf('year').toDate()],
            '最近6个月': [moment().subtract(6, 'month').startOf('month').toDate(), moment().toDate()],
            '最近12个月': [moment().subtract(12, 'month').startOf('month').toDate(), moment().toDate()],
            '最近24个月': [moment().subtract(24, 'month').startOf('month').toDate(), moment().toDate()],
            '历史所有': [moment().subtract(3000, 'week').toDate(), moment().toDate()]
        }
    }, pickMonthRangeCallback);

    var dateTypeSelect = $('.dateTypeSelect');
    dateTypeSelect.select2({ minimumResultsForSearch: Infinity });
    dateTypeSelect.on("select2:select", function (e) {
        var selectedValue = e.target.value;
        dateTypeSelect.val(selectedValue).trigger("change");

        switch (selectedValue) {
            case "tradeDaily":
                dateRangeSelect.removeClass('hide');
                weekRangeSelect.addClass('hide');
                monthRangeSelect.addClass('hide');
                break;
            case "tradeWeekly":
                dateRangeSelect.addClass('hide');
                weekRangeSelect.removeClass('hide');
                monthRangeSelect.addClass('hide');
                break;
            case "tradeMonthly":
                dateRangeSelect.addClass('hide');
                weekRangeSelect.addClass('hide');
                monthRangeSelect.removeClass('hide');
                break;
        }
    });
    var startDate = new Date(new Date().getTime() - 31 * 24 * 3600 * 1000).format("yyyy-MM-dd");
    var endDate = new Date().format("yyyy-MM-dd");
    function updateCharts(query) {
        var path = dateTypeSelect.val();
        var querypath = "";
        switch (path) {
            case "tradeDaily":
                querypath = "daily";
                break;
            case "tradeWeekly":
                querypath = "weekly";
                break;
            case "tradeMonthly":
                querypath = "monthly";
                break;
        }
        requestURL(dataService + "/totalTrade/" + querypath, query).done(function (data) {
            renderinchart(data);
        });

    }

    var query = {
        "startDate": startDate,
        "endDate": endDate
    };
    function updateOutCharts(query) {
        var path = dateTypeSelect.val();
        var querypath = ""
        switch (path) {
            case "tradeDaily":
                querypath = "shopoutDaily"
                break;
            case "tradeWeekly":
                querypath = "shopoutWeekly"
                break;
            case "tradeMonthly":
                querypath = "shopoutMonthly"
                break;
        }
        requestURL(dataService + "/shopout/" + querypath, query).done(function (data) {
            renderoutchart(data);
        });
    }
    updateCharts(query);
    updateOutCharts(query);
    function renderoutchart(indata) {
        var path = dateTypeSelect.val();

        var legendData = [];
        switch (path) {
            case "tradeDaily":
                legendData = ['订单成交金额', '7天前订单成交金额', '30天前订单成交金额'];
                break;
            default:
                legendData = ['订单成交金额'];
                break;
        }

        var stats = {
            date: [],
            dealNum: [],
            weekAgoDealNum: [],
            monthAgoDealNum: []
        };
        indata.forEach(function (e) {
            stats.date.push(e.date);
            stats.dealNum.push(e.dealPayAmount);
            stats.weekAgoDealNum.push(e.weekAgoDealPayAmount);
            stats.monthAgoDealNum.push(e.monthAgoDealPayAmount);
        });

        var option = {
            title: {
                top: 'top',
                left: 'left',
                text: '出库订单金额时间维度对比',
                // // subtext: '注:不包括人人机、机人人、爱机汇订单和B2B订单；\n门店订单大区对比包括门店自有订单和O2O订单。',
                // subtextStyle: {
                //     color: 'gray',
                //     fontStyle: 'normal',
                //     fontWeight: 'normal'
                // }
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                top: '15%',
                left: 'center',
                data: legendData
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
                    name: '订单成交金额',
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
                },
                {
                    name: '7天前订单成交金额',
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
                    data: stats.weekAgoDealNum
                },
                {
                    name: '30天前订单成交金额',
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
                    data: stats.monthAgoDealNum
                }
            ]
        };
        var dateDealReportChart = echarts.init(document.getElementById('dateOutDealReport'));
        dateDealReportChart.setOption(option);
        window.addEventListener('resize', function () {
            dateDealReportChart.resize();
        })
    }

    function renderinchart(indata) {
        var path = dateTypeSelect.val();

        var legendData = [];
        switch (path) {
            case "tradeDaily":
                legendData = ['订单成交金额', '7天前订单成交金额', '30天前订单成交金额'];
                break;
            default:
                legendData = ['订单成交金额'];
                break;
        }

        var stats = {
            date: [],
            dealNum: [],
            weekAgoDealNum: [],
            monthAgoDealNum: []
        };
        indata.forEach(function (e) {
            stats.date.push(e.date);
            stats.dealNum.push(e.dealPayAmount);
            stats.weekAgoDealNum.push(e.weekAgoDealPayAmount);
            stats.monthAgoDealNum.push(e.monthAgoDealPayAmount);
        });

        var option = {
            title: {
                top: 'top',
                left: 'left',
                text: '成交订单金额时间维度对比',
                // subtext: '注:不包括人人机、机人人、爱机汇订单和B2B订单；\n门店订单大区对比包括门店自有订单和O2O订单。',
                // subtextStyle: {
                //     color: 'gray',
                //     fontStyle: 'normal',
                //     fontWeight: 'normal'
                // }
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                top: '15%',
                left: 'center',
                data: legendData
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
                    name: '订单成交金额',
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
                },
                {
                    name: '7天前订单成交金额',
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
                    data: stats.weekAgoDealNum
                },
                {
                    name: '30天前订单成交金额',
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
                    data: stats.monthAgoDealNum
                }
            ]
        };
        var dateDealReportChart = echarts.init(document.getElementById('dateInDealReport'));
        dateDealReportChart.setOption(option);
        window.addEventListener('resize', function () {
            dateDealReportChart.resize();
        })
    }
    function pickDateRangeCallback(start, end, label) {
        $('.dateSelectLabel').html(start.format('YYYY-MM-DD') + ' ~ ' + end.format('YYYY-MM-DD'));

        var query = {
            "startDate": start.format('YYYY-MM-DD'),
            "endDate": end.format('YYYY-MM-DD')
        };

        updateCharts(query);
        updateOutCharts(query);
    }

    function pickWeekRangeCallback(start, end, label) {
        var startWeek = moment(start.format('YYYY-MM-DD'), 'YYYY-MM-DD').day(0).format('YYYY-MM-DD');
        var endWeek = moment(end.format('YYYY-MM-DD'), 'YYYY-MM-DD').day(0).format('YYYY-MM-DD');

        $('.weekSelectLabel').html(startWeek + '周 ~ ' + endWeek + '周');

        var query = {
            "startDate": startWeek,
            "endDate": endWeek
        };

        updateCharts(query);
        updateOutCharts(query);
    }

    function pickMonthRangeCallback(start, end, label) {
        var startMonth = moment(start.format('YYYY-MM-DD'), 'YYYY-MM-DD').startOf('month').format('YYYY-MM-DD');
        var endMonth = moment(end.format('YYYY-MM-DD'), 'YYYY-MM-DD').startOf('month').format('YYYY-MM-DD');

        $('.monthSelectLabel').html(startMonth + '月 ~ ' + endMonth + '月');

        var query = {
            "startDate": startMonth,
            "endDate": endMonth
        };

        updateCharts(query);
        updateOutCharts(query);
    }

    function getSortOrder(prop) {
        return function (a, b) {
            if (a[prop] > b[prop]) {
                return -1;
            } else if (a[prop] < b[prop]) {
                return 1;
            }
            return 0;
        }
    }

}



