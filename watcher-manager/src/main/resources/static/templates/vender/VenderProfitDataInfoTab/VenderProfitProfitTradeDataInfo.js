Template.VenderProfitProfitTradeDataInfo.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#VenderProfitDataInfoTab').addClass('active');
    $('#VenderProfitProfitTradeDataInfo').addClass('active');

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

    $('.webTrafficFunnelDate3').html(endDate);


    $(".webTrafficFunnelDate").show();
    $(".webTrafficFunnelDate2").show();
    $(".webTrafficFunnelDate3").show();

    var dt = $('.desktop-only  .dateSelectLabel').text().replace(/ /g, "").split("~");
    var startDate = dt[0];
    var endDate = dt[1];
    var platform=[];
    platform.push("爱回收");
    filter.startDate=startDate;
    filter.endDate=endDate;
    filter.platform=platform;
    renderPageAll(filter);

    };

var filter={};

function pickWebTrafficFunnelDateRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.dateSelectLabel').html(sdt + "~" + edt);
    filter.startDate=sdt;
    filter.endDate=edt;
    renderPageAll(filter);
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

function renderPageAll(filter) {

    $("#tableCollect").hide();
    $("#loadingCollect").show();
    var promise = getRiskControlProfitRateAllStatistic(filter);
    promise.done(function (ret) {
        $("#tableCollect").show();
        $("#loadingCollect").hide();

        //renderTable
        renderTable(ret,'#tableCollect');
    });


    $("#tableAll").hide();
    $("#loadingAll").show();
    var promise = getRiskControlProfitRateStatistic(filter);
    promise.done(function (ret) {
        $("#tableAll").show();
        $("#loadingAll").hide();
        getRiskControlProfitRateStatisticChart(ret,[]);
        renderTable(ret,'#tableAll');

    });
}

//每日累计重大失误率
function renderAhsTable(data,tableName) {
    var amount=0;
    var profit=0;
    //var profitRate;
    data.forEach(function(e){
        amount+= e.final_sale_amount;
        profit+= e.profit_amount;
    });
    var profitRate=((profit/amount)*100).toFixed(2)+"%";
    var tableJson=[];
    var dataJson={};
    dataJson.amount=amount;
    dataJson.profit=profit;
    dataJson.profitRate=profitRate;
    tableJson.push(dataJson);
    $(tableName).bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        data:tableJson
    });
}

//每日累计重大失误率
function renderTable(data,tableName) {
    data.forEach(function(e){
        e.cnt= ((e.cnt))+"%"
    });
    data=data.reverse();
    $(tableName).bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        data:data
    });
}

//每日累计重大失误率
function renderAhsDayTable(data,tableName) {
    data.forEach(function(e){
        e.profitRate= (((e.profit_amount/ e.final_sale_amount)*100).toFixed(2))+"%"
    });
    data=data.reverse();
    $(tableName).bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        data:data
    });
}

//折线图
function getRiskControlProfitRateStatisticChart(data,dataAhs){

        //data=data.reverse();
        var dateList=[];
        var series={
            profitRate:[]
        }

        data.forEach(function (e) {
            dateList.push(e.date);
            series.profitRate.push(e.cnt);
        });

        dateList= _.uniq(dateList);
        var option = {
            title: {
                text: '每日利润率走势',
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
                data: ["爱机汇利润率"],
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
                    name: '爱机汇利润率',
                    type: 'line',
                    label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                    data: series.profitRate
                }
            ]
        };

        var venderTradeTrendMixedChart = echarts.init(document.getElementById('venderTradeTrendMixedChart'));
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




//风控--获取爱机汇累计利润率统计信息
function getRiskControlProfitRateAllStatistic(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getRiskControlProfitRateAllStatistic", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}

//风控--获取每日累计利润率统计信息
function getRiskControlProfitRateStatistic(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getRiskControlProfitRateStatistic", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}




