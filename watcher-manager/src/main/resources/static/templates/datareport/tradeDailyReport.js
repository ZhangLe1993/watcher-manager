Template.tradeDailyReport.rendered = function () {
    /*$('.navi-tab').removeClass('active');
    //$('#tradeDaily').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }*/

    var autoRun = function() {//自动刷新函数
        var flag = Template.flag;
        var dateRangeSelect = $('.reportRange');
        var weekRangeSelect = $('.reportWeekRange');
        var monthRangeSelect = $('.reportMonthRange');
        var dateTradeReportChart = echarts.init(document.getElementById('dateTradeReport'));

        var sourceTypeTradePieReportChart = echarts.init(document.getElementById('sourceTypeTradePieReport'));
        var tradeMethodPieReportChart = echarts.init(document.getElementById('tradeMethodPieReport'));
        var outletsTradePieReportChart = echarts.init(document.getElementById('outletsTradePieReport'));
        var ondoorTradePieReportChart = echarts.init(document.getElementById('ondoorTradePieReport'));

        var dateDealReportChart = echarts.init(document.getElementById('dateDealReport'));
        var sourceTypeDealPieReportChart = echarts.init(document.getElementById('sourceTypeDealPieReport'));
        var dealMethodPieReportChart = echarts.init(document.getElementById('dealMethodPieReport'));
        var outletsDealPieReportChart = echarts.init(document.getElementById('outletsDealPieReport'));
        var ondoorDealPieReportChart = echarts.init(document.getElementById('ondoorDealPieReport'));

        var dateDealRateReportChart = echarts.init(document.getElementById('dateDealRateReport'));
        var sourceTypeDealRateBarReportChart = echarts.init(document.getElementById('sourceTypeDealRateBarReport'));
        var tradeMethodDealRateBarReportChart = echarts.init(document.getElementById('tradeMethodDealRateBarReport'));
        var dateDealAmountReportChart = echarts.init(document.getElementById('dateDealAmountReport'));

        var sourceTypeDealAmountPieReportChart = echarts.init(document.getElementById('sourceTypeDealAmountPieReport'));
        var tradeMethodDealAmountPieReportChart = echarts.init(document.getElementById('tradeMethodDealAmountPieReport'));
        var outletsDealAmountPieReportChart = echarts.init(document.getElementById('outletsDealAmountPieReport'));
        var ondoorDealAmountPieReportChart = echarts.init(document.getElementById('ondoorDealAmountPieReport'));

        var dateUnitPriceReportChart = echarts.init(document.getElementById('dateUnitPriceReport'));
        var sourceTypeUnitPriceBarReportChart = echarts.init(document.getElementById('sourceTypeUnitPriceBarReport'));
        var tradeMethodUnitPriceBarReportChart = echarts.init(document.getElementById('tradeMethodUnitPriceBarReport'));
        var outletsUnitPriceBarReportChart = echarts.init(document.getElementById('outletsUnitPriceBarReport'));
        var ondoorUnitPriceBarReportChart = echarts.init(document.getElementById('ondoorUnitPriceBarReport'));
        resize = function () {
            dateTradeReportChart.resize();
            sourceTypeTradePieReportChart.resize();
            tradeMethodPieReportChart.resize();
            outletsTradePieReportChart.resize();
            ondoorTradePieReportChart.resize();
            dateDealReportChart.resize();
            sourceTypeDealPieReportChart.resize();
            dealMethodPieReportChart.resize();
            outletsDealPieReportChart.resize();
            ondoorDealPieReportChart.resize();
            dateDealRateReportChart.resize();
            sourceTypeDealRateBarReportChart.resize();
            tradeMethodDealRateBarReportChart.resize();
            dateDealAmountReportChart.resize();
            sourceTypeDealAmountPieReportChart.resize();
            tradeMethodDealAmountPieReportChart.resize();
            outletsDealAmountPieReportChart.resize();
            ondoorDealAmountPieReportChart.resize();
            dateUnitPriceReportChart.resize();
            sourceTypeUnitPriceBarReportChart.resize();
            tradeMethodUnitPriceBarReportChart.resize();
            outletsUnitPriceBarReportChart.resize();
            ondoorUnitPriceBarReportChart.resize();
        }
        window.onresize = function () {
            resize();
        }
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
        dateTypeSelect.select2({minimumResultsForSearch: Infinity});

        //这块是监听下拉框的代码，下拉框不要后就可以删除这些代码！
        /*var dataType = $('.dataType')
         console.log(dataType)*/
        /*dataType.select2({minimumResultsForSearch: Infinity});
         dataType.on("select2:select", function (e) {
         var selectedValue = e.target.value;
         dataType.val(selectedValue).trigger("change");
         /!*var query = {
         "startDate": startDate,
         "endDate": endDate,
         "dataType":$(".dataType").val()
         };

         updateCharts(query);*!/
         })*/


        //嵌入页面-----提交订单相关详细数据页面
        $("#sourceTypeTradeID").attr("href","/datareport/sourceTypeTradeReport/"+flag);
        $("#tradeMethodID").attr("href","/datareport/tradeMethodReport/"+flag);
        $("#outletsTradeID").attr("href","/datareport/outletsTradeReport/"+flag);
        $("#ondoorTradeID").attr("href","/datareport/ondoorTradeReport/"+flag);

        //嵌入页面-----成交订单相关详细数据页面
        $("#sourceTypeDealID").attr("href","/datareport/sourceTypeDealReport/"+flag);
        $("#dealMethodID").attr("href","/datareport/tradeMethodDealReport/"+flag);
        $("#outletsDealID").attr("href","/datareport/outletsDealReport/"+flag);
        $("#ondoorDealID").attr("href","/datareport/ondoorDealsReport/"+flag);

        //嵌入页面-----成交金额相关详细数据页面
        $("#sourceTypeDealAmountID").attr("href","/datareport/sourceTypeMoneyReport/"+flag);
        $("#tradeMethodDealAmountID").attr("href","/datareport/tradeMethodMoneyReport/"+flag);
        $("#outletsDealAmountID").attr("href","/datareport/outletsMoneyReport/"+flag);
        $("#ondoorDealAmountID").attr("href","/datareport/ondoorMoneyReport/"+flag);



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

        /**
         *  提交订单数据图表
         */
        var drawDateTradeReport = function (tradeNumDataSet) {

            var path = dateTypeSelect.val();

            var legendData = [];
            switch (path) {
                case "tradeDaily":
                    legendData = ['订单提交量', '7天前订单提交量', '30天前订单提交量'];
                    break;
                default:
                    legendData = ['订单提交量'];
                    break;
            }


            var stats = {
                date: [],
                tradeNum: [],
                weekAgoNum: [],
                monthAgoNum: []
            };
            tradeNumDataSet.forEach(function (e) {
                stats.date.push(e.date);
                stats.tradeNum.push(e.tradeNum);
                stats.weekAgoNum.push(e.weekAgoNum);
                stats.monthAgoNum.push(e.monthAgoNum);
            });

            var option = {
                title: {
                    text: '订单时间维度对比',
                    left: 'left',
                    top: 'top',
                    fontWeight: "bolder",
                    subtext: '注:不包括人人机、机人人、爱机汇订单和B2B订单；\n门店订单大区对比包括门店自有订单和O2O订单。',
                    subtextStyle: {
                        color: 'gray',
                        fontStyle: 'normal',
                        fontWeight: 'normal',

                    }
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
                    },
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
                    }
                ]
            };
            dateTradeReportChart.clear()
            dateTradeReportChart.setOption(option)
        };

        var drawSourceTypePieReport = function (tradeNumArrays) {
            var dataList = [{value: tradeNumArrays.portal.tradeNum, name: '官网'},
                {value: tradeNumArrays.wap.tradeNum, name: '官网M版'},
                {value: tradeNumArrays.outlets.tradeNum, name: '门店'},
                {value: tradeNumArrays.jdMobile.tradeNum, name: '京东手机'},
                {value: tradeNumArrays.jd3C.tradeNum, name: '京东3C'},
                {value: tradeNumArrays.xiaoMi.tradeNum, name: '小米'},
                {value: tradeNumArrays.yhd.tradeNum, name: '一号店合作'},
                {value: tradeNumArrays.sanXing.tradeNum, name: '三星'},
                {value: tradeNumArrays.partners.tradeNum, name: '小合作方'}
            ]
            if (flag == "AREA") {
                dataList = [{value: tradeNumArrays.portal.tradeNum, name: '官网'},
                    {value: tradeNumArrays.wap.tradeNum, name: '官网M版'},
                    {value: tradeNumArrays.outlets.tradeNum, name: '门店'}
                ]
            }

            var option = {
                title: {
                    text: '订单渠道来源对比',
                    link: '',
                    subtext: '点击查看历史详细数据',
                    subtextStyle: {
                        color: 'red',
                        fontStyle: 'normal',
                        fontWeight: 'bold'
                    },
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                calculable: true,
                series: [
                    {
                        name: '订单渠道',
                        type: 'pie',
                        radius: ['0%', '55%'],
                        center: ['50%', '60%'],
                        clockwise: true,
                        labelLine: {
                            normal: {
                                length: 5,
                                length2: 3
                            }
                        },
                        data: dataList.sort(getSortOrder('value'))
                    }
                ]
            };
            sourceTypeTradePieReportChart.clear()
            sourceTypeTradePieReportChart.setOption(option)
        };

        var drawTradeMethodPieReport = function (tradeNumArrays) {

            var option = {
                title: {
                    text: '订单交易方式对比',
                    subtext: '点击查看历史详细数据',
                    subtextStyle: {
                        color: 'red',
                        fontStyle: 'normal',
                        fontWeight: 'bold'
                    },
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                calculable: true,
                series: [
                    {
                        name: '交易方式',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        labelLine: {
                            normal: {
                                length: 5,
                                length2: 3
                            }
                        },
                        data: [
                            {value: tradeNumArrays.express.tradeNum, name: '快递订单'},
                            {value: tradeNumArrays.outlets.tradeNum, name: '门店订单'},
                            {value: tradeNumArrays.o2o.tradeNum, name: 'O2O订单'},
                            {value: tradeNumArrays.ondoor.tradeNum, name: '上门订单'}
                        ].sort(getSortOrder('value'))
                    }
                ]
            };
            tradeMethodPieReportChart.clear()
            tradeMethodPieReportChart.setOption(option)
        };

        var drawOutletsTradePieReport = function (tradeNumArrays) {

            var option = {
                title: {
                    text: '门店订单大区对比',
                    link: '',
                    subtext: '点击查看历史详细数据',
                    subtextStyle: {
                        color: 'red',
                        fontStyle: 'normal',
                        fontWeight: 'bold'
                    },
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                calculable: true,
                series: [
                    {
                        name: '门店订单',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        labelLine: {
                            normal: {
                                length: 5,
                                length2: 3
                            }
                        },
                        data: [
                            {value: tradeNumArrays.eastChina.tradeNum, name: '华东大区'},
                            {value: tradeNumArrays.northChina.tradeNum, name: '华北大区'},
                            {value: tradeNumArrays.southChina.tradeNum, name: '华南大区'},
                            {value: tradeNumArrays.westChina.tradeNum, name: '华西大区'},
                            {value: tradeNumArrays.centerChina.tradeNum, name: '华中大区'}
                        ].sort(getSortOrder('value'))
                    }
                ]
            };
            outletsTradePieReportChart.clear()
            outletsTradePieReportChart.setOption(option)
        };

        var drawOndoorTradePieReport = function (tradeNumArrays) {

            var option = {
                title: {
                    text: '上门订单大区对比',
                    link: '',
                    subtext: '点击查看历史详细数据',
                    subtextStyle: {
                        color: 'red',
                        fontStyle: 'normal',
                        fontWeight: 'bold'
                    },
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                calculable: true,
                series: [
                    {
                        name: '上门订单',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        labelLine: {
                            normal: {
                                length: 5,
                                length2: 3
                            }
                        },
                        data: [
                            {value: tradeNumArrays.eastChina.tradeNum, name: '华东大区'},
                            {value: tradeNumArrays.northChina.tradeNum, name: '华北大区'},
                            {value: tradeNumArrays.southChina.tradeNum, name: '华南大区'},
                            {value: tradeNumArrays.westChina.tradeNum, name: '华西大区'},
                            {value: tradeNumArrays.centerChina.tradeNum, name: '华中大区'}
                        ].sort(getSortOrder('value'))
                    }
                ]
            };
            ondoorTradePieReportChart.clear()
            ondoorTradePieReportChart.setOption(option)
        };
        /**
         *  成交订单数据图表
         */
        function drawDateDealReport(tradeNumDataSet) {
            var path = dateTypeSelect.val();

            var legendData = [];
            switch (path) {
                case "tradeDaily":
                    legendData = ['订单成交量', '7天前订单成交量', '30天前订单成交量'];
                    break;
                default:
                    legendData = ['订单成交量'];
                    break;
            }

            var stats = {
                date: [],
                dealNum: [],
                weekAgoDealNum: [],
                monthAgoDealNum: []
            };
            tradeNumDataSet.forEach(function (e) {
                stats.date.push(e.date);
                stats.dealNum.push(e.dealNum);
                stats.weekAgoDealNum.push(e.weekAgoDealNum);
                stats.monthAgoDealNum.push(e.monthAgoDealNum);
            });

            var option = {
                title: {
                    top: 'top',
                    left: 'left',
                    text: '成交订单时间维度对比',
                    subtext: '注:不包括人人机、机人人、爱机汇订单和B2B订单；\n门店订单大区对比包括门店自有订单和O2O订单。',
                    subtextStyle: {
                        color: 'gray',
                        fontStyle: 'normal',
                        fontWeight: 'normal'
                    }
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
                    },
                    {
                        name: '7天前订单成交量',
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
                        name: '30天前订单成交量',
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
            dateDealReportChart.clear()
            dateDealReportChart.setOption(option)
        }

        function drawSourceTypeDealPieReport(tradeNumArrays) {
            var dataList = [{value: tradeNumArrays.portal.dealNum, name: '官网'},
                {value: tradeNumArrays.wap.dealNum, name: '官网M版'},
                {value: tradeNumArrays.outlets.dealNum, name: '门店'},
                {value: tradeNumArrays.jdMobile.dealNum, name: '京东手机'},
                {value: tradeNumArrays.jd3C.dealNum, name: '京东3C'},
                {value: tradeNumArrays.xiaoMi.dealNum, name: '小米'},
                {value: tradeNumArrays.yhd.dealNum, name: '一号店合作'},
                {value: tradeNumArrays.sanXing.dealNum, name: '三星'},
                {value: tradeNumArrays.partners.dealNum, name: '小合作方'}
            ]
            if (flag == "AREA") {
                dataList = [{value: tradeNumArrays.portal.dealNum, name: '官网'},
                    {value: tradeNumArrays.wap.dealNum, name: '官网M版'},
                    {value: tradeNumArrays.outlets.dealNum, name: '门店'}
                ]
            }

            var option = {
                title: {
                    text: '成交订单渠道来源对比',
                    link: '',
                    subtext: '点击查看历史详细数据',
                    subtextStyle: {
                        color: 'red',
                        fontStyle: 'normal',
                        fontWeight: 'bold'
                    },
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                calculable: true,
                series: [
                    {
                        name: '订单渠道',
                        type: 'pie',
                        radius: ['0%', '55%'],
                        center: ['50%', '60%'],
                        clockwise: true,
                        labelLine: {
                            normal: {
                                length: 5,
                                length2: 3
                            }
                        },
                        data: dataList.sort(getSortOrder('value'))
                    }
                ]
            };
            sourceTypeDealPieReportChart.clear()
            sourceTypeDealPieReportChart.setOption(option)
        }

        function drawDealMethodPieReport(tradeNumArrays) {

            var option = {
                title: {
                    text: '成交订单交易方式对比',
                    subtext: '点击查看历史详细数据',
                    subtextStyle: {
                        color: 'red',
                        fontStyle: 'normal',
                        fontWeight: 'bold'
                    },
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                calculable: true,
                series: [
                    {
                        name: '交易方式',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        labelLine: {
                            normal: {
                                length: 5,
                                length2: 3
                            }
                        },
                        data: [
                            {value: tradeNumArrays.express.dealNum, name: '快递订单'},
                            {value: tradeNumArrays.outlets.dealNum, name: '门店订单'},
                            {value: tradeNumArrays.o2o.dealNum, name: 'O2O订单'},
                            {value: tradeNumArrays.ondoor.dealNum, name: '上门订单'}
                        ].sort(getSortOrder('value'))
                    }
                ]
            };
            dealMethodPieReportChart.clear()
            dealMethodPieReportChart.setOption(option)
        }

        function drawOutletsDealPieReport(tradeNumArrays) {

            var option = {
                title: {
                    text: '门店成交订单大区对比',
                    link: '',
                    subtext: '点击查看历史详细数据',
                    subtextStyle: {
                        color: 'red',
                        fontStyle: 'normal',
                        fontWeight: 'bold'
                    },
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                calculable: true,
                series: [
                    {
                        name: '门店订单',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        labelLine: {
                            normal: {
                                length: 5,
                                length2: 3
                            }
                        },
                        data: [
                            {value: tradeNumArrays.eastChina.dealNum, name: '华东大区'},
                            {value: tradeNumArrays.northChina.dealNum, name: '华北大区'},
                            {value: tradeNumArrays.southChina.dealNum, name: '华南大区'},
                            {value: tradeNumArrays.westChina.dealNum, name: '华西大区'},
                            {value: tradeNumArrays.centerChina.dealNum, name: '华中大区'}

                        ].sort(getSortOrder('value'))
                    }
                ]
            };
            outletsDealPieReportChart.clear()
            outletsDealPieReportChart.setOption(option)
        }

        function drawOndoorDealPieReport(tradeNumArrays) {

            var option = {
                title: {
                    text: '上门成交订单大区对比',
                    link: '',
                    subtext: '点击查看历史详细数据',
                    subtextStyle: {
                        color: 'red',
                        fontStyle: 'normal',
                        fontWeight: 'bold'
                    },
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                calculable: true,
                series: [
                    {
                        name: '上门订单',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        labelLine: {
                            normal: {
                                length: 5,
                                length2: 3
                            }
                        },
                        data: [
                            {value: tradeNumArrays.eastChina.dealNum, name: '华东大区'},
                            {value: tradeNumArrays.northChina.dealNum, name: '华北大区'},
                            {value: tradeNumArrays.southChina.dealNum, name: '华南大区'},
                            {value: tradeNumArrays.westChina.dealNum, name: '华西大区'},
                            {value: tradeNumArrays.centerChina.dealNum, name: '华中大区'}
                        ].sort(getSortOrder('value'))
                    }
                ]
            };
            ondoorDealPieReportChart.clear()
            ondoorDealPieReportChart.setOption(option)
        }

        /**
         * 成交率数据图表
         */
        function drawDateDealRateReport(tradeNumDataSet) {
            var path = dateTypeSelect.val();

            var legendData = [];
            switch (path) {
                case "tradeDaily":
                    legendData = ['成交率', '7天前成交率', '30天前成交率'];
                    break;
                default:
                    legendData = ['成交率'];
                    break;
            }

            var stats = {
                date: [],
                dealRate: [],
                weekAgoDealRate: [],
                monthAgoDealRate: []
            };
            tradeNumDataSet.forEach(function (e) {
                stats.date.push(e.date);
                stats.dealRate.push((e.dealNum / e.tradeNum * 100).toFixed(2));
                stats.weekAgoDealRate.push((e.weekAgoDealNum / e.weekAgoNum * 100).toFixed(2));
                stats.monthAgoDealRate.push((e.monthAgoDealNum / e.monthAgoNum * 100).toFixed(2));
            });


            var option = {
                title: {
                    top: 'top',
                    left: 'left',
                    text: '成交率时间维度对比',
                    subtext: '注:不包括人人机、机人人、爱机汇订单和B2B订单；\n门店订单大区对比包括门店自有订单和O2O订单。',
                    subtextStyle: {
                        color: 'gray',
                        fontStyle: 'normal',
                        fontWeight: 'normal'
                    }
                },
                tooltip: {
                    trigger: 'axis',
                    formatter: "{b}<br />{a0} : {c0}%<br />{a1} : {c1}%<br />{a2} : {c2}%"
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
                        type: 'value',
                        axisLabel: {
                            formatter: '{value}%'
                        }
                    }
                ],
                animationDuration: 2000,
                series: [
                    {
                        name: '成交率',
                        type: 'line',
                        label: {
                            normal: {
                                show: true,
                                formatter: '{c}%'
                            }
                        },
                        data: stats.dealRate
                    },
                    {
                        name: '7天前成交率',
                        type: 'line',
                        lineStyle: {
                            normal: {
                                type: 'dashed'
                            }
                        },
                        data: stats.weekAgoDealRate
                    },
                    {
                        name: '30天前成交率',
                        type: 'line',
                        lineStyle: {
                            normal: {
                                type: 'dashed'
                            }
                        },
                        data: stats.monthAgoDealRate
                    }
                ]
            };
            dateDealRateReportChart.clear()
            dateDealRateReportChart.setOption(option)
        }

        function drawSourceTypeDealRateBarReport(tradeNumArrays) {
            var dataList = [
                ( tradeNumArrays.outlets.dealNum / tradeNumArrays.outlets.tradeNum * 100).toFixed(2).avoidInfinity(),
                ( tradeNumArrays.portal.dealNum / tradeNumArrays.portal.tradeNum * 100).toFixed(2).avoidInfinity(),
                ( tradeNumArrays.wap.dealNum / tradeNumArrays.wap.tradeNum * 100).toFixed(2).avoidInfinity(),
                ( tradeNumArrays.jdMobile.dealNum / tradeNumArrays.jdMobile.tradeNum * 100).toFixed(2).avoidInfinity(),
                ( tradeNumArrays.jd3C.dealNum / tradeNumArrays.jd3C.tradeNum * 100).toFixed(2).avoidInfinity(),
                ( tradeNumArrays.xiaoMi.dealNum / tradeNumArrays.xiaoMi.tradeNum * 100).toFixed(2).avoidInfinity(),
                ( tradeNumArrays.yhd.dealNum / tradeNumArrays.yhd.tradeNum * 100).toFixed(2).avoidInfinity(),
                ( tradeNumArrays.sanXing.dealNum / tradeNumArrays.sanXing.tradeNum * 100).toFixed(2).avoidInfinity(),
                ( tradeNumArrays.partners.dealNum / tradeNumArrays.partners.tradeNum * 100).toFixed(2).avoidInfinity()]
            var categoryList = ['门店', '\n官网', '官网M版', '\n京东手机', '京东3C', '\n小米', '一号店', '\n三星', '小合作方']
            if (flag == "AREA") {
                dataList = [
                    ( tradeNumArrays.outlets.dealNum / tradeNumArrays.outlets.tradeNum * 100).toFixed(2).avoidInfinity(),
                    ( tradeNumArrays.portal.dealNum / tradeNumArrays.portal.tradeNum * 100).toFixed(2).avoidInfinity(),
                    ( tradeNumArrays.wap.dealNum / tradeNumArrays.wap.tradeNum * 100).toFixed(2).avoidInfinity()]
                categoryList = ['门店', '\n官网', '官网M版']
            }
            var option = {
                title: {
                    text: '成交率渠道来源对比',
                    subtext: '',
                    subtextStyle: {
                        color: '#333',
                        fontStyle: 'normal',
                        fontWeight: 'bold'
                    },
                    x: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    },
                    formatter: "{a}<br />{b}: {c}%"
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        //axisLabel: {interval: 0},
                        data: categoryList
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
                series: [
                    {
                        name: '成交率',
                        type: 'bar',
                        label: {
                            normal: {
                                show: true,
                                formatter: "{b}\n{c}%",
                                position: 'top'
                            }
                        },
                        data: dataList
                    }
                ]
            };
            sourceTypeDealRateBarReportChart.clear()
            sourceTypeDealRateBarReportChart.setOption(option)
        }

        function drawTradeMethodDealRateBarReport(tradeNumArrays) {

            var option = {
                title: {
                    text: '成交率交易方式对比',
                    subtext: '',
                    subtextStyle: {
                        color: '#333',
                        fontStyle: 'normal',
                        fontWeight: 'bold'
                    },
                    x: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    },
                    formatter: "{a}<br />{b}: {c}%"
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: ['门店订单', 'O2O订单', '上门订单', '快递订单']
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
                series: [
                    {
                        name: '成交率',
                        type: 'bar',
                        label: {
                            normal: {
                                show: true,
                                formatter: "{b}\n{c}%",
                                position: 'top'
                            }
                        },
                        data: [
                            (tradeNumArrays.outlets.dealNum / tradeNumArrays.outlets.tradeNum * 100).toFixed(2),
                            (tradeNumArrays.o2o.dealNum / tradeNumArrays.o2o.tradeNum * 100).toFixed(2),
                            (tradeNumArrays.ondoor.dealNum / tradeNumArrays.ondoor.tradeNum * 100).toFixed(2),
                            (tradeNumArrays.express.dealNum / tradeNumArrays.express.tradeNum * 100).toFixed(2)
                        ]
                    }
                ]
            };
            tradeMethodDealRateBarReportChart.clear()
            tradeMethodDealRateBarReportChart.setOption(option)
        }

        /**
         *  成交金额数据图表
         */
        function drawDateAmountReport(tradeNumDataSet) {
            var path = dateTypeSelect.val();

            var legendData = [];
            switch (path) {
                case "tradeDaily":
                    legendData = ['成交金额', '7天前成交金额', '30天前成交金额'];
                    break;
                default:
                    legendData = ['成交金额'];
                    break;
            }

            var stats = {
                date: [],
                dealPayAmount: [],
                weekAgoDealPayAmount: [],
                monthAgoDealPayAmount: []
            };
            tradeNumDataSet.forEach(function (e) {
                stats.date.push(e.date);
                stats.dealPayAmount.push(e.dealPayAmount);
                stats.weekAgoDealPayAmount.push(e.weekAgoDealPayAmount);
                stats.monthAgoDealPayAmount.push(e.monthAgoDealPayAmount);
            });

            var option = {
                title: {
                    top: 'top',
                    left: 'left',
                    text: '成交金额时间维度对比',
                    subtext: '注:不包括人人机、机人人、爱机汇订单和B2B订单；\n门店订单大区对比包括门店自有订单和O2O订单。',
                    subtextStyle: {
                        color: 'gray',
                        fontStyle: 'normal',
                        fontWeight: 'normal'
                    }
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
                        type: 'value',
                        axisLabel: {
                            formatter: '￥{value}'
                        }
                    }
                ],
                animationDuration: 2000,
                series: [
                    {
                        name: '成交金额',
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
                        data: stats.dealPayAmount
                    },
                    {
                        name: '7天前成交金额',
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
                        data: stats.weekAgoDealPayAmount
                    },
                    {
                        name: '30天前成交金额',
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
                        data: stats.monthAgoDealPayAmount
                    }
                ]
            };
            dateDealAmountReportChart.clear()
            dateDealAmountReportChart.setOption(option)
        }

        function drawSourceTypeDealAmountPieReport(tradeNumArrays) {
            var dataList = [{value: tradeNumArrays.portal.dealPayAmount, name: '官网'},
                {value: tradeNumArrays.wap.dealPayAmount, name: '官网M版'},
                {value: tradeNumArrays.outlets.dealPayAmount, name: '门店'},
                {value: tradeNumArrays.jdMobile.dealPayAmount, name: '京东手机'},
                {value: tradeNumArrays.jd3C.dealPayAmount, name: '京东3C'},
                {value: tradeNumArrays.xiaoMi.dealPayAmount, name: '小米'},
                {value: tradeNumArrays.yhd.dealPayAmount, name: '一号店合作'},
                {value: tradeNumArrays.sanXing.dealPayAmount, name: '三星'},
                {value: tradeNumArrays.partners.dealPayAmount, name: '小合作方'}
            ]
            if (flag == "AREA") {
                dataList = [{value: tradeNumArrays.portal.dealPayAmount, name: '官网'},
                    {value: tradeNumArrays.wap.dealPayAmount, name: '官网M版'},
                    {value: tradeNumArrays.outlets.dealPayAmount, name: '门店'}
                ]
            }
            var option = {
                title: {
                    text: '成交金额渠道来源对比',
                    link: '',
                    subtext: '点击查看历史详细数据',
                    subtextStyle: {
                        color: 'red',
                        fontStyle: 'normal',
                        fontWeight: 'bold'
                    },
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                calculable: true,
                series: [
                    {
                        name: '订单渠道',
                        type: 'pie',
                        radius: ['0%', '55%'],
                        center: ['50%', '60%'],
                        labelLine: {
                            normal: {
                                length: 5,
                                length2: 3
                            }
                        },
                        clockwise: true,
                        data: dataList.sort(getSortOrder('value'))
                    }
                ]
            };
            sourceTypeDealAmountPieReportChart.clear()
            sourceTypeDealAmountPieReportChart.setOption(option)
        }

        function drawTradeMethodDealAmountPieReport(tradeNumArrays) {

            var option = {
                title: {
                    text: '成交金额交易方式对比',
                    subtext: '点击查看历史详细数据',
                    subtextStyle: {
                        color: 'red',
                        fontStyle: 'normal',
                        fontWeight: 'bold'
                    },
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                calculable: true,
                series: [
                    {
                        name: '交易方式',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        labelLine: {
                            normal: {
                                length: 5,
                                length2: 3
                            }
                        },
                        data: [
                            {value: tradeNumArrays.express.dealPayAmount, name: '快递'},
                            {value: tradeNumArrays.outlets.dealPayAmount, name: '门店'},
                            {value: tradeNumArrays.o2o.dealPayAmount, name: 'O2O'},
                            {value: tradeNumArrays.ondoor.dealPayAmount, name: '上门'}
                        ].sort(getSortOrder('value'))
                    }
                ]
            };
            tradeMethodDealAmountPieReportChart.clear()
            tradeMethodDealAmountPieReportChart.setOption(option)
        }

        function drawOutletsDealAmountPieReport(tradeNumArrays) {

            var option = {
                title: {
                    text: '门店成交金额大区对比',
                    link: '',
                    subtext: '点击查看历史详细数据',
                    subtextStyle: {
                        color: 'red',
                        fontStyle: 'normal',
                        fontWeight: 'bold'
                    },
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                calculable: true,
                series: [
                    {
                        name: '门店订单',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        labelLine: {
                            normal: {
                                length: 5,
                                length2: 3
                            }
                        },
                        data: [
                            {value: tradeNumArrays.eastChina.dealPayAmount, name: '华东'},
                            {value: tradeNumArrays.northChina.dealPayAmount, name: '华北'},
                            {value: tradeNumArrays.southChina.dealPayAmount, name: '华南'},
                            {value: tradeNumArrays.westChina.dealPayAmount, name: '华西'},
                            {value: tradeNumArrays.centerChina.dealPayAmount, name: '华中'}
                        ].sort(getSortOrder('value'))
                    }
                ]
            };
            outletsDealAmountPieReportChart.clear()
            outletsDealAmountPieReportChart.setOption(option)
        }

        function drawOndoorDealAmountPieReport(tradeNumArrays) {

            var option = {
                title: {
                    text: '上门成交金额大区对比',
                    link: '',
                    subtext: '点击查看历史详细数据',
                    subtextStyle: {
                        color: 'red',
                        fontStyle: 'normal',
                        fontWeight: 'bold'
                    },
                    x: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                calculable: true,
                series: [
                    {
                        name: '上门订单',
                        type: 'pie',
                        radius: '55%',
                        center: ['50%', '60%'],
                        labelLine: {
                            normal: {
                                length: 5,
                                length2: 3
                            }
                        },
                        data: [
                            {value: tradeNumArrays.eastChina.dealPayAmount, name: '华东大区'},
                            {value: tradeNumArrays.northChina.dealPayAmount, name: '华北大区'},
                            {value: tradeNumArrays.southChina.dealPayAmount, name: '华南大区'},
                            {value: tradeNumArrays.westChina.dealPayAmount, name: '华西大区'},
                            {value: tradeNumArrays.centerChina.dealPayAmount, name: '华中大区'}
                        ].sort(getSortOrder('value'))
                    }
                ]
            };
            ondoorDealAmountPieReportChart.clear()
            ondoorDealAmountPieReportChart.setOption(option)
        }

        /**
         *  成交客单价数据图表
         */
        function drawDateUnitPriceReport(tradeNumDataSet) {
            var path = dateTypeSelect.val();

            var legendData = [];
            switch (path) {
                case "tradeDaily":
                    legendData = ['客单价', '7天前客单价', '30天前客单价'];
                    break;
                default:
                    legendData = ['客单价'];
                    break;
            }
            var stats = {
                date: [],
                unitPrice: [],
                weekAgoUnitPrice: [],
                monthAgoUnitPrice: []
            };
            tradeNumDataSet.forEach(function (e) {
                stats.date.push(e.date);
                stats.unitPrice.push((e.dealPayAmount / e.dealNum).toFixed(1));
                stats.weekAgoUnitPrice.push((e.weekAgoDealPayAmount / e.weekAgoDealNum).toFixed(1));
                stats.monthAgoUnitPrice.push((e.monthAgoDealPayAmount / e.monthAgoDealNum).toFixed(1));
            });

            var option = {
                title: {
                    top: 'top',
                    left: 'left',
                    text: '客单价时间维度对比',
                    subtext: '注:不包括人人机、机人人、爱机汇订单和B2B订单；\n门店订单大区对比包括门店自有订单和O2O订单。',
                    subtextStyle: {
                        color: 'gray',
                        fontStyle: 'normal',
                        fontWeight: 'normal'
                    }
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
                        name: '日期',
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
                        name: '客单价',
                        type: 'line',
                        label: {
                            normal: {
                                show: true,
                                formatter: "￥{c}"
                            }
                        },
                        data: stats.unitPrice
                    },
                    {
                        name: '7天前客单价',
                        type: 'line',
                        lineStyle: {
                            normal: {
                                type: 'dashed'
                            }
                        },
                        data: stats.weekAgoUnitPrice
                    },
                    {
                        name: '30天前客单价',
                        type: 'line',
                        lineStyle: {
                            normal: {
                                type: 'dashed'
                            }
                        },
                        data: stats.monthAgoUnitPrice
                    }
                ]
            };
            dateUnitPriceReportChart.clear()
            dateUnitPriceReportChart.setOption(option)
        }

        function drawSourceTypeUnitPriceBarReport(tradeNumArrays) {
            var dataList = [(tradeNumArrays.portal.dealPayAmount / tradeNumArrays.portal.dealNum).toFixed(1),
                (tradeNumArrays.wap.dealPayAmount / tradeNumArrays.wap.dealNum).toFixed(1),
                (tradeNumArrays.outlets.dealPayAmount / tradeNumArrays.outlets.dealNum).toFixed(1),
                (tradeNumArrays.jdMobile.dealPayAmount / tradeNumArrays.jdMobile.dealNum).toFixed(1),
                (tradeNumArrays.jd3C.dealPayAmount / tradeNumArrays.jd3C.dealNum).toFixed(1),
                (tradeNumArrays.xiaoMi.dealPayAmount / tradeNumArrays.xiaoMi.dealNum).toFixed(1),
                (tradeNumArrays.yhd.dealPayAmount / tradeNumArrays.yhd.dealNum).toFixed(1),
                (tradeNumArrays.sanXing.dealPayAmount / tradeNumArrays.sanXing.dealNum).toFixed(1),
                (tradeNumArrays.partners.dealPayAmount / tradeNumArrays.partners.dealNum).toFixed(1)]
            var categoryList = ['官网', '官网M版', '门店', '京东手机', '京东3C', '小米', '一号店', '三星', '小合作方']

            if (flag == "AREA") {
                dataList = [(tradeNumArrays.portal.dealPayAmount / tradeNumArrays.portal.dealNum).toFixed(1),
                    (tradeNumArrays.wap.dealPayAmount / tradeNumArrays.wap.dealNum).toFixed(1),
                    (tradeNumArrays.outlets.dealPayAmount / tradeNumArrays.outlets.dealNum).toFixed(1)]
                categoryList = ['官网', '官网M版', '门店']
            }
            var option = {
                title: {
                    text: '客单价渠道来源对比',
                    subtext: '',
                    subtextStyle: {
                        color: '#333',
                        fontStyle: 'normal',
                        fontWeight: 'bold'
                    },
                    x: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'value'
                },
                yAxis: {
                    type: 'category',
                    data: categoryList
                },
                series: [
                    {
                        name: '客单价',
                        type: 'bar',
                        label: {
                            normal: {
                                show: true,
                                position: 'right',
                                formatter: "￥{c}"
                            }
                        },
                        data: dataList
                    }
                ]
            };
            sourceTypeUnitPriceBarReportChart.clear()
            sourceTypeUnitPriceBarReportChart.setOption(option)
        }

        function drawTradeMethodUnitPriceBarReport(tradeNumArrays) {

            var option = {
                title: {
                    text: '客单价交易方式对比',
                    subtext: '',
                    subtextStyle: {
                        color: '#333',
                        fontStyle: 'normal',
                        fontWeight: 'bold'
                    },
                    x: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: ['快递', '门店', 'O2O', '上门']
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        min: 0,
                        max: 1200,
                        axisLabel: {
                            formatter: '￥{value}'
                        }
                    }
                ],
                series: [
                    {
                        name: '客单价',
                        type: 'bar',
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                formatter: "￥{c}"
                            }
                        },
                        data: [(tradeNumArrays.express.dealPayAmount / tradeNumArrays.express.dealNum).toFixed(1),
                            (tradeNumArrays.outlets.dealPayAmount / tradeNumArrays.outlets.dealNum).toFixed(1),
                            (tradeNumArrays.o2o.dealPayAmount / tradeNumArrays.o2o.dealNum).toFixed(1),
                            (tradeNumArrays.ondoor.dealPayAmount / tradeNumArrays.ondoor.dealNum).toFixed(1)].sort(getSortOrder('value')).sort(getSortOrder('value'))
                    }
                ]
            };
            tradeMethodUnitPriceBarReportChart.clear()
            tradeMethodUnitPriceBarReportChart.setOption(option)
        }

        function drawOutletsUnitPriceBarReport(tradeNumArrays) {

            var option = {
                title: {
                    text: '门店客单价大区对比',
                    subtext: '',
                    subtextStyle: {
                        color: '#333',
                        fontStyle: 'normal',
                        fontWeight: 'bold'
                    },
                    x: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: ['华东', '华北', '华南', '华西','华中']
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        min: 0,
                        max: 1200,
                        axisLabel: {
                            formatter: '￥{value}'
                        }
                    }
                ],
                series: [
                    {
                        name: '客单价',
                        type: 'bar',
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                formatter: "￥{c}"
                            }
                        },
                        data: [
                            (tradeNumArrays.eastChina.dealPayAmount / tradeNumArrays.eastChina.dealNum).toFixed(1),
                            (tradeNumArrays.northChina.dealPayAmount / tradeNumArrays.northChina.dealNum).toFixed(1),
                            (tradeNumArrays.southChina.dealPayAmount / tradeNumArrays.southChina.dealNum).toFixed(1),
                            (tradeNumArrays.westChina.dealPayAmount / tradeNumArrays.westChina.dealNum).toFixed(1),
                            (tradeNumArrays.centerChina.dealPayAmount / tradeNumArrays.centerChina.dealNum).toFixed(1)]
                    }
                ]
            };
            outletsUnitPriceBarReportChart.clear()
            outletsUnitPriceBarReportChart.setOption(option)
        }

        function drawOndoorUnitPriceBarReport(tradeNumArrays) {

            var option = {
                title: {
                    text: '上门客单价大区对比',
                    subtext: '',
                    subtextStyle: {
                        color: '#333',
                        fontStyle: 'normal',
                        fontWeight: 'bold'
                    },
                    x: 'center'
                },
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: ['华东', '华北', '华南', '华西','华中']
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        min: 0,
                        max: 1200,
                        axisLabel: {
                            formatter: '￥{value}'
                        }
                    }
                ],
                series: [
                    {
                        name: '客单价',
                        type: 'bar',
                        label: {
                            normal: {
                                show: true,
                                position: 'top',
                                formatter: "￥{c}"
                            }
                        },
                        data: [
                            (tradeNumArrays.eastChina.dealPayAmount / tradeNumArrays.eastChina.dealNum).toFixed(1),
                            (tradeNumArrays.northChina.dealPayAmount / tradeNumArrays.northChina.dealNum).toFixed(1),
                            (tradeNumArrays.southChina.dealPayAmount / tradeNumArrays.southChina.dealNum).toFixed(1),
                            (tradeNumArrays.westChina.dealPayAmount / tradeNumArrays.westChina.dealNum).toFixed(1),
                            (tradeNumArrays.centerChina.dealPayAmount / tradeNumArrays.centerChina.dealNum).toFixed(1)]
                    }
                ]
            };
            ondoorUnitPriceBarReportChart.clear()
            ondoorUnitPriceBarReportChart.setOption(option)
        }

        /**
         * 重画所有图表
         */
        var updateCharts = function (query) {

            var path = dateTypeSelect.val();

            requestURL(dataService + "/" + path + "/total", query).done(function (data) {
                drawDateTradeReport(data);
                drawDateDealReport(data);
                drawDateDealRateReport(data);
                drawDateAmountReport(data);
                drawDateUnitPriceReport(data);
            });

            requestURL(dataService + "/" + path + "/sourceType", query).done(function (data) {
                var tradeNumArrays = {
                    total: {tradeNum: 0, dealNum: 0, dealPayAmount: 0, tradeFinishNum: 0},
                    portal: {tradeNum: 0, dealNum: 0, dealPayAmount: 0, tradeFinishNum: 0},
                    wap: {tradeNum: 0, dealNum: 0, dealPayAmount: 0, tradeFinishNum: 0},
                    outlets: {tradeNum: 0, dealNum: 0, dealPayAmount: 0, tradeFinishNum: 0},
                    xiaoMi: {tradeNum: 0, dealNum: 0, dealPayAmount: 0, tradeFinishNum: 0},
                    jdMobile: {tradeNum: 0, dealNum: 0, dealPayAmount: 0, tradeFinishNum: 0},
                    jd3C: {tradeNum: 0, dealNum: 0, dealPayAmount: 0, tradeFinishNum: 0},
                    yhd: {tradeNum: 0, dealNum: 0, dealPayAmount: 0, tradeFinishNum: 0},
                    sanXing: {tradeNum: 0, dealNum: 0, dealPayAmount: 0, tradeFinishNum: 0},
                    partners: {tradeNum: 0, dealNum: 0, dealPayAmount: 0, tradeFinishNum: 0}
                };

                data.forEach(function (e) {
                    tradeNumArrays.total.tradeNum = tradeNumArrays.total.tradeNum + e.tradeCount;
                    tradeNumArrays.total.dealNum = tradeNumArrays.total.dealNum + e.tradeSuccessCount;
                    switch (e.sourceType) {
                        case -2:
                            tradeNumArrays.wap.tradeNum = e.tradeCount;
                            tradeNumArrays.wap.dealNum = e.tradeSuccessCount;
                            tradeNumArrays.wap.tradeFinishNum = e.tradeFinishCount;
                            tradeNumArrays.wap.dealPayAmount = e.tradeSuccessPayAmount;
                            break;
                        case 0:
                            tradeNumArrays.portal.tradeNum = e.tradeCount;
                            tradeNumArrays.portal.dealNum = e.tradeSuccessCount;
                            tradeNumArrays.portal.tradeFinishNum = e.tradeFinishCount;
                            tradeNumArrays.portal.dealPayAmount = e.tradeSuccessPayAmount;
                            break;
                        case 36:
                            tradeNumArrays.yhd.tradeNum = e.tradeCount;
                            tradeNumArrays.yhd.dealNum = e.tradeSuccessCount;
                            tradeNumArrays.yhd.tradeFinishNum = e.tradeFinishCount;
                            tradeNumArrays.yhd.dealPayAmount = e.tradeSuccessPayAmount;
                            break;
                        case 42:
                            tradeNumArrays.outlets.tradeNum = e.tradeCount;
                            tradeNumArrays.outlets.dealNum = e.tradeSuccessCount;
                            tradeNumArrays.outlets.tradeFinishNum = e.tradeFinishCount;
                            tradeNumArrays.outlets.dealPayAmount = e.tradeSuccessPayAmount;
                            break;
                        case 48:
                            tradeNumArrays.jdMobile.tradeNum = e.tradeCount;
                            tradeNumArrays.jdMobile.dealNum = e.tradeSuccessCount;
                            tradeNumArrays.jdMobile.tradeFinishNum = e.tradeFinishCount;
                            tradeNumArrays.jdMobile.dealPayAmount = e.tradeSuccessPayAmount;
                            break;
                        case 52:
                            tradeNumArrays.jd3C.tradeNum = e.tradeCount;
                            tradeNumArrays.jd3C.dealNum = e.tradeSuccessCount;
                            tradeNumArrays.jd3C.tradeFinishNum = e.tradeFinishCount;
                            tradeNumArrays.jd3C.dealPayAmount = e.tradeSuccessPayAmount;
                            break;
                        case 61:
                            tradeNumArrays.xiaoMi.tradeNum = e.tradeCount;
                            tradeNumArrays.xiaoMi.dealNum = e.tradeSuccessCount;
                            tradeNumArrays.xiaoMi.tradeFinishNum = e.tradeFinishCount;
                            tradeNumArrays.xiaoMi.dealPayAmount = e.tradeSuccessPayAmount;
                            break;
                        case 63:
                            tradeNumArrays.sanXing.tradeNum = e.tradeCount;
                            tradeNumArrays.sanXing.dealNum = e.tradeSuccessCount;
                            tradeNumArrays.sanXing.tradeFinishNum = e.tradeFinishCount;
                            tradeNumArrays.sanXing.dealPayAmount = e.tradeSuccessPayAmount;
                            break;
                        case 64:
                            tradeNumArrays.partners.tradeNum = e.tradeCount;
                            tradeNumArrays.partners.dealNum = e.tradeSuccessCount;
                            tradeNumArrays.partners.tradeFinishNum = e.tradeFinishCount;
                            tradeNumArrays.partners.dealPayAmount = e.tradeSuccessPayAmount;
                            break;
                    }
                });
                drawSourceTypePieReport(tradeNumArrays);
                drawSourceTypeDealPieReport(tradeNumArrays);
                drawSourceTypeDealRateBarReport(tradeNumArrays);
                drawSourceTypeDealAmountPieReport(tradeNumArrays);
                drawSourceTypeUnitPriceBarReport(tradeNumArrays);
            });

            requestURL(dataService + "/" + path + "/tradeMethod", query).done(function (data) {
                var tradeNumArrays = {
                    total: {tradeNum: 0, dealNum: 0, tradeFinishNum: 0, dealPayAmount: 0},
                    outlets: {tradeNum: 0, dealNum: 0, tradeFinishNum: 0, dealPayAmount: 0},
                    o2o: {tradeNum: 0, dealNum: 0, tradeFinishNum: 0, dealPayAmount: 0},
                    ondoor: {tradeNum: 0, dealNum: 0, tradeFinishNum: 0, dealPayAmount: 0},
                    express: {tradeNum: 0, dealNum: 0, tradeFinishNum: 0, dealPayAmount: 0}
                };

                data.forEach(function (e) {
                    switch (e.tradeMethod) {
                        case 1 :
                            tradeNumArrays.outlets.tradeNum = e.tradeCount;
                            tradeNumArrays.outlets.dealNum = e.tradeSuccessCount;
                            tradeNumArrays.outlets.tradeFinishNum = e.tradeFinishCount;
                            tradeNumArrays.outlets.dealPayAmount = e.tradeSuccessPayAmount;
                            break;
                        case 2 :
                            tradeNumArrays.ondoor.tradeNum = e.tradeCount;
                            tradeNumArrays.ondoor.dealNum = e.tradeSuccessCount;
                            tradeNumArrays.ondoor.tradeFinishNum = e.tradeFinishCount;
                            tradeNumArrays.ondoor.dealPayAmount = e.tradeSuccessPayAmount;
                            break;
                        case 3 :
                            tradeNumArrays.o2o.tradeNum = e.tradeCount;
                            tradeNumArrays.o2o.dealNum = e.tradeSuccessCount;
                            tradeNumArrays.o2o.tradeFinishNum = e.tradeFinishCount;
                            tradeNumArrays.o2o.dealPayAmount = e.tradeSuccessPayAmount;
                            break;
                        case 4 :
                            tradeNumArrays.express.tradeNum = e.tradeCount;
                            tradeNumArrays.express.dealNum = e.tradeSuccessCount;
                            tradeNumArrays.express.tradeFinishNum = e.tradeFinishCount;
                            tradeNumArrays.express.dealPayAmount = e.tradeSuccessPayAmount;
                            break;

                    }
                });

                drawTradeMethodPieReport(tradeNumArrays);
                drawDealMethodPieReport(tradeNumArrays);
                drawTradeMethodDealAmountPieReport(tradeNumArrays);
                drawTradeMethodDealRateBarReport(tradeNumArrays);
                drawTradeMethodUnitPriceBarReport(tradeNumArrays);
            });

            requestURL(dataService + "/" + path + "/outletsArea", query).done(function (data) {
                var tradeNumArrays = {
                    total: {tradeNum: 0, dealNum: 0, dealPayAmount: 0, tradeFinishNum: 0},
                    eastChina: {tradeNum: 0, dealNum: 0, dealPayAmount: 0, tradeFinishNum: 0},
                    northChina: {tradeNum: 0, dealNum: 0, dealPayAmount: 0, tradeFinishNum: 0},
                    southChina: {tradeNum: 0, dealNum: 0, dealPayAmount: 0, tradeFinishNum: 0},
                    westChina: {tradeNum: 0, dealNum: 0, dealPayAmount: 0, tradeFinishNum: 0},
                    centerChina: {tradeNum: 0, dealNum: 0, dealPayAmount: 0, tradeFinishNum: 0}
                };

                data.forEach(function (e) {
                    switch (e.areaKey) {
                        case 1 :
                            tradeNumArrays.eastChina.tradeNum = e.tradeCount;
                            tradeNumArrays.eastChina.dealNum = e.tradeSuccessCount;
                            tradeNumArrays.eastChina.tradeFinishNum = e.tradeFinishCount;
                            tradeNumArrays.eastChina.dealPayAmount = e.tradeSuccessPayAmount;
                            break;
                        case 2 :
                            tradeNumArrays.northChina.tradeNum = e.tradeCount;
                            tradeNumArrays.northChina.dealNum = e.tradeSuccessCount;
                            tradeNumArrays.northChina.tradeFinishNum = e.tradeFinishCount;
                            tradeNumArrays.northChina.dealPayAmount = e.tradeSuccessPayAmount;
                            break;
                        case 3 :
                            tradeNumArrays.southChina.tradeNum = e.tradeCount;
                            tradeNumArrays.southChina.dealNum = e.tradeSuccessCount;
                            tradeNumArrays.southChina.tradeFinishNum = e.tradeFinishCount;
                            tradeNumArrays.southChina.dealPayAmount = e.tradeSuccessPayAmount;
                            break;
                        case 4 :
                            tradeNumArrays.westChina.tradeNum = e.tradeCount;
                            tradeNumArrays.westChina.dealNum = e.tradeSuccessCount;
                            tradeNumArrays.westChina.tradeFinishNum = e.tradeFinishCount;
                            tradeNumArrays.westChina.dealPayAmount = e.tradeSuccessPayAmount;
                            break;
                        case 5 :
                            tradeNumArrays.centerChina.tradeNum = e.tradeCount;
                            tradeNumArrays.centerChina.dealNum = e.tradeSuccessCount;
                            tradeNumArrays.centerChina.tradeFinishNum = e.tradeFinishCount;
                            tradeNumArrays.centerChina.dealPayAmount = e.tradeSuccessPayAmount;
                            break;

                    }
                });

                drawOutletsTradePieReport(tradeNumArrays);
                drawOutletsDealPieReport(tradeNumArrays);
                drawOutletsDealAmountPieReport(tradeNumArrays);
                drawOutletsUnitPriceBarReport(tradeNumArrays);
            });

            requestURL(dataService + "/" + path + "/ondoorArea", query).done(function (data) {
                var tradeNumArrays = {
                    total: {tradeNum: 0, dealNum: 0, dealPayAmount: 0, tradeFinishNum: 0},
                    eastChina: {tradeNum: 0, dealNum: 0, dealPayAmount: 0, tradeFinishNum: 0},
                    northChina: {tradeNum: 0, dealNum: 0, dealPayAmount: 0, tradeFinishNum: 0},
                    southChina: {tradeNum: 0, dealNum: 0, dealPayAmount: 0, tradeFinishNum: 0},
                    westChina: {tradeNum: 0, dealNum: 0, dealPayAmount: 0, tradeFinishNum: 0},
                    centerChina: {tradeNum: 0, dealNum: 0, dealPayAmount: 0, tradeFinishNum: 0}
                };

                data.forEach(function (e) {
                    switch (e.areaKey) {
                        case 1 :
                            tradeNumArrays.eastChina.tradeNum = e.tradeCount;
                            tradeNumArrays.eastChina.dealNum = e.tradeSuccessCount;
                            tradeNumArrays.eastChina.tradeFinishNum = e.tradeFinishCount;
                            tradeNumArrays.eastChina.dealPayAmount = e.tradeSuccessPayAmount;
                            break;
                        case 2 :
                            tradeNumArrays.northChina.tradeNum = e.tradeCount;
                            tradeNumArrays.northChina.dealNum = e.tradeSuccessCount;
                            tradeNumArrays.northChina.tradeFinishNum = e.tradeFinishCount;
                            tradeNumArrays.northChina.dealPayAmount = e.tradeSuccessPayAmount;
                            break;
                        case 3 :
                            tradeNumArrays.southChina.tradeNum = e.tradeCount;
                            tradeNumArrays.southChina.dealNum = e.tradeSuccessCount;
                            tradeNumArrays.southChina.tradeFinishNum = e.tradeFinishCount;
                            tradeNumArrays.southChina.dealPayAmount = e.tradeSuccessPayAmount;
                            break;
                        case 4 :
                            tradeNumArrays.westChina.tradeNum = e.tradeCount;
                            tradeNumArrays.westChina.dealNum = e.tradeSuccessCount;
                            tradeNumArrays.westChina.tradeFinishNum = e.tradeFinishCount;
                            tradeNumArrays.westChina.dealPayAmount = e.tradeSuccessPayAmount;
                            break;
                        case 5 :
                            tradeNumArrays.centerChina.tradeNum = e.tradeCount;
                            tradeNumArrays.centerChina.dealNum = e.tradeSuccessCount;
                            tradeNumArrays.centerChina.tradeFinishNum = e.tradeFinishCount;
                            tradeNumArrays.centerChina.dealPayAmount = e.tradeSuccessPayAmount;
                            break;

                    }
                });

                drawOndoorTradePieReport(tradeNumArrays);
                drawOndoorDealPieReport(tradeNumArrays);
                drawOndoorDealAmountPieReport(tradeNumArrays);
                drawOndoorUnitPriceBarReport(tradeNumArrays);
            });
        };

        /**
         * 选择日期回调函数
         */
        function pickDateRangeCallback(start, end, label) {
            $('.dateSelectLabel').html(start.format('YYYY-MM-DD') + ' ~ ' + end.format('YYYY-MM-DD'));

            var query = {
                "startDate": start.format('YYYY-MM-DD'),
                "endDate": end.format('YYYY-MM-DD'),
                "dataType": flag
            };

            updateCharts(query);
        }

        function pickWeekRangeCallback(start, end, label) {
            var startWeek = moment(start.format('YYYY-MM-DD'), 'YYYY-MM-DD').day(0).format('YYYY-MM-DD');
            var endWeek = moment(end.format('YYYY-MM-DD'), 'YYYY-MM-DD').day(0).format('YYYY-MM-DD');

            $('.weekSelectLabel').html(startWeek + '周 ~ ' + endWeek + '周');

            var query = {
                "startDate": startWeek,
                "endDate": endWeek,
                "dataType": flag
            };

            updateCharts(query);
        }

        function pickMonthRangeCallback(start, end, label) {
            var startMonth = moment(start.format('YYYY-MM-DD'), 'YYYY-MM-DD').startOf('month').format('YYYY-MM-DD');
            var endMonth = moment(end.format('YYYY-MM-DD'), 'YYYY-MM-DD').startOf('month').format('YYYY-MM-DD');

            $('.monthSelectLabel').html(startMonth + '月 ~ ' + endMonth + '月');

            var query = {
                "startDate": startMonth,
                "endDate": endMonth,
                "dataType": flag
            };

            updateCharts(query);
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

        var startDate = new Date(new Date().getTime() - 31 * 24 * 3600 * 1000).format("yyyy-MM-dd");
        var endDate = new Date().format("yyyy-MM-dd");

        var query = {
            "startDate": startDate,
            "endDate": endDate,
            "dataType": flag
        };

        updateCharts(query);
    }

    autoRun();

};

$(".variousTest").fancybox({
    maxWidth: 1300,
    maxHeight: 700,
    fitToView: false,
    width: '100%',
    height: '100%',
    autoSize: false,
    closeClick: false,
    closeBtn: true,
    openEffect: 'elastic',
    closeEffect: 'elastic'
});