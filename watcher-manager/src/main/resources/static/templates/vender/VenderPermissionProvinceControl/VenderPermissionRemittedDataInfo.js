Template.VenderPermissionRemittedDataInfo.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#VenderPermissionProvinceControl').addClass('active');
    $('#VenderPermissionRemittedDataInfo').addClass('active');

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
        "minDate": transformDate("2016-09-01"),
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
            '最近15天': [moment().subtract(15, 'days').toDate(), moment().toDate()],
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

    var monthPickerOptions = {
        onlyShowfirstDayOfMonth: true,
        "showDropdowns": true,
        //"alwaysShowCalendars": true,
        "alwaysShowCalendars": false,
        //"singleDatePicker": true,
        "autoApply": true,
        "startDate": transformDate(startMonthDate),
        "endDate": transformDate(endMonthDate),
        "minDate": transformDate(minMonthDate),
        "maxDate": transformDate(endMonthDate),
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
            '上月': [moment().subtract(1, 'month').startOf('month').toDate(), moment().subtract(1, 'month').startOf('month').toDate()],
            '上5月': [moment().subtract(5, 'month').startOf('month').toDate(), moment().subtract(1, 'month').startOf('month').toDate()],
            '上10月': [moment().subtract(10, 'month').startOf('month').toDate(), moment().subtract(1, 'month').startOf('month').toDate()],
            '上15月': [moment().subtract(15, 'month').startOf('month').toDate(), moment().subtract(1, 'month').startOf('month').toDate()],
            '今年': [moment().startOf('year').startOf('month').toDate(), moment().subtract(1, 'month').startOf('month').toDate()],
            '去年': [moment().subtract(1, 'year').startOf('year').startOf('month').toDate(), moment().subtract(1, 'year').endOf('year').startOf('month').toDate()]
        }
    };

    $(".monthSelectLabel").html(startMonthDate + "~" + endMonthDate);
    $('.webTrafficFunnelMonth').daterangepicker(monthPickerOptions, pickWebTrafficFunnelMonthRangeCallback);

    $(".webTrafficFunnelDate").show();
    $(".webTrafficFunnelMonth").show();

    var dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g, "").split("~");
    var startDate = dt[0];
    var endDate = dt[1];
    filter.startDate=startDate;
    filter.endDate=endDate;
    filter.status="part";
    renderPageDay(filter);

    //var dt = $('.monthSelectLabel').text().replace(/ /g, "").split("~");
    //var startDate = dt[0];
    //var endDate = dt[1];
    //filter.startDate=startDate;
    //filter.endDate=endDate;
    //filter.status="part";
    //renderPageMonth(filter);
    };

var filter={};

function pickWebTrafficFunnelDateRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.dateSelectLabel').html(sdt + "~" + edt);
    filter.startDate=sdt;
    filter.endDate=edt;
    filter.status="part";
    renderPageDay(filter);
}

function pickWebTrafficFunnelMonthRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.monthSelectLabel').html(sdt + "~" + edt);
    filter.startDate=sdt;
    filter.endDate=edt;
    filter.status="part";
    renderPageMonth(filter);
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

    filter.startDate=startDate;
    filter.endDate=endDate;

    return cleanParams(filter);
}

function renderPageDay(filter) {
    //var dateGap = -15;
    $("#tablee").hide();
    $("#tableee").hide();
    $("#loading2").hide();
    $("#loading3").hide();
    var promise = getRiskControlRemittedStatistic(filter);
    promise.done(function (ret) {
        $("#tablee").show();
        $("#loading2").hide();

        getVenderCancelOrderChart(ret);
        //renderTable
        renderTable(ret,'#tablee');
        //履约金模式
    });

    var promise = getRiskControlRemittedVenderStatistic(filter);
    promise.done(function (ret) {
        $("#tableee").show();
        $("#loading3").hide();

        //day
        renderTableDay(ret,'#tableee');
    });

}

//每日累计重大失误率
function renderTable(data,tableName) {
    var tableJson={};
    var remittedNum = 0;
    var finalNum= 0;
    data.forEach(function (e) {
        remittedNum += parseInt(e.cnt);
        finalNum+= parseInt(e.cancelCnt);
    })
    tableJson.remittedNum=remittedNum;
    tableJson.rate=((remittedNum/finalNum)*100).toFixed(2)+"%"
    var newData=[];
    newData.push(tableJson);

    $(tableName).bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        data:newData
    });
}

//day
function renderTableDay(data,tableName) {
    $(tableName).bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        data:data
    });
}

//取消订单折线图
function getVenderCancelOrderChart(data){

        var dateList=[];
        var series={
            errorRate:[]
        }
        data.forEach(function (e) {
            dateList.push(e.date);
            series.errorRate.push(((e.cnt/ e.cancelCnt)*100).toFixed(2));
        });
        dateList= _.uniq(dateList);

        var option = {
            title: {
                text: '补贴率的累计走势',
                //top: '80%',
                left: 'center',

            },
            tooltip: {
                trigger: 'axis',
                formatter:function(params,ticket,callback){
                    var str = params[0].name + '<br/>';
                    params.forEach(function(obj){
                        if(obj.seriesName.indexOf("率")>-1){
                            str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                        }else{
                            str += obj.seriesName + ' : ' + obj.value + '<br/>'
                        }
                    });
                    return str;
                }
            },
            legend: {
                data: ["补贴率"],
                padding:[50,0,0,0]
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
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '补贴率',
                    type: 'line',
                    label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                    data: series.errorRate
                }
            ]
        };

        var venderTradeTrendMixedChart = echarts.init(document.getElementById('venderTradeTrendMixedChart'));
        venderTradeTrendMixedChart.setOption(option);
        window.addEventListener('resize', venderTradeTrendMixedChart.resize)

}

//履约金模式下的订单取消表格
function renderRiskTable(data,tableName) {
    data.forEach(function (e) {
        e.dateSubCntRisk = e.date;
        e.cancelCntSubCntRisk = e.cancelRiskCnt;
        e.cancelCntRateSubCntRisk = ((e.cancelRiskCnt / e.riskCnt) * 100).toFixed(2) + "%";
        e.cancelNumSubNumRisk = e.cancelRiskNum;
        e.cancelNumRateSubNumRisk = ((e.cancelRiskNum / e.riskNum) * 100).toFixed(2) + "%";
    })
    $(tableName).bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        data:data
    });
}

//履约金模式下的取消订单折线图
function getVenderRiskCancelOrderChart(data){

    var dateList=[];
    var series={
        cntRate:[],
        numRate:[]
    }
    data.forEach(function (e) {
        dateList.push(e.date);
        series.cntRate.push(((e.cancelCnt/ e.cnt)*100).toFixed(2));
        series.numRate.push(((e.cancelNum/ e.num)*100).toFixed(2));
    });
    dateList= _.uniq(dateList);

    var option = {
        title: {
            text: '履约金模式下的订单取消比例图',
            //top: '80%',
            left: 'center',

        },
        tooltip: {
            trigger: 'axis',
            formatter:function(params,ticket,callback){
                var str = params[0].name + '<br/>';
                params.forEach(function(obj){
                    if(obj.seriesName.indexOf("占比")>-1){
                        str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                    }else{
                        str += obj.seriesName + ' : ' + obj.value + '<br/>'
                    }
                });
                return str;
            }
        },
        legend: {
            data: ["取消订单个数占比","取消订单金额占比"],
            padding:[50,0,0,0]
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
                type: 'value'
            }
        ],
        series: [
            {
                name: '取消订单个数占比',
                type: 'line',
                label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                data: series.cntRate
            },
            {
                name: '取消订单金额占比',
                type: 'line',
                label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                data: series.numRate
            }
        ]
    };

    var venderTradeTrendMixedChart = echarts.init(document.getElementById('venderTradeTrendMixedChartRisk'));
    venderTradeTrendMixedChart.setOption(option);
    window.addEventListener('resize', venderTradeTrendMixedChart.resize)

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

//风控--获取每日累计失误率统计信息
function getRiskControlRemittedStatistic(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getRiskControlRemittedStatistic", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}

//风控--获取每日累计失误率统计信息Top10
function getRiskControlRemittedVenderStatistic(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getRiskControlRemittedVenderStatistic", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}



