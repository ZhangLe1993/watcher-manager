Template.riskControlRebackOrderInfo.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#RiskPermissionControl').addClass('active');
    $('#riskControlRebackOrderInfo').addClass('active');

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

    $(".webTrafficFunnelDate").show();

    var dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g, "").split("~");
    var startDate = dt[0];
    var endDate = dt[1];
    filter.startDate=startDate;
    filter.endDate=endDate;
    renderPageDay(filter);

    };

var filter={};

function pickWebTrafficFunnelDateRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.dateSelectLabel').html(sdt + "~" + edt);
    filter.startDate=sdt;
    filter.endDate=edt;
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

    filter.startDate=startDate;
    filter.endDate=endDate;

    return cleanParams(filter);
}

function renderPageDay(filter) {
    //var dateGap = -15;
    $("#tablee").hide();
    $("#loading2").hide();
    var promise = getRiskControlRemittedStatistic(filter);
    promise.done(function (ret) {
        $("#tablee").show();
        $("#loading2").hide();

        getVenderCancelOrderChart(ret);
        //renderTable
        renderTable(ret,'#tablee');
        //履约金模式
    });

    $("#tablef").hide();
    $("#loading3").hide();
    var promise = getRiskControlReturnOrderStatistic(filter);
    promise.done(function (ret) {
        $("#tablef").show();
        $("#loading3").hide();

        //renderTable
        renderAppReturnTable(ret,'#tablef');
    });

}

//退货率分析
function renderTable(data,tableName) {
    data.forEach(function (e) {
        e.cntRate= ((e.cancelCnt/ e.cnt)*100).toFixed(2)+"%"
        e.numRate= ((e.cancelNum/ e.num)*100).toFixed(2)+"%"
    })

    $(tableName).bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        data:data
    });
}

//APP申请退货率分析
function renderAppReturnTable(data,tableName) {
    data.forEach(function (e) {
        e.applyRate= ((e.orderCount/ e.venderCount)*100).toFixed(2)+"%"
        if(e.orderCount==0){
            e.passRate="0.00%"
        }else {
            e.passRate = ((e.groupCount / e.orderCount) * 100).toFixed(2) + "%"
        }

        if(e.venderCount==0){
            e.cancelRate="0.00%"
        }else {
            e.cancelRate = ((e.cancelCnt / e.venderCount) * 100).toFixed(2) + "%"
        }
    })

    $(tableName).bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        data:data,
        columns:[{
            field:'date',
            title:'时间',
            sortable:true
        },{
            field:'orderCount',
            title:'退货申请数量',
            sortable:true
        },{
            field:'venderCount',
            title:'成交量',
            sortable:true
        },{
            field:'applyRate',
            title:'退货申请率（退货量/成交量）',
            sortable:true
        },{
            field:'groupCount',
            title:'退货审批通过量',
            sortable:true
        },{
            field:'passRate',
            title:'退货审批通过率（通过量/申请量）',
            sortable:true
        },{
            field:'cancelCnt',
            title:'退货取消量',
            sortable:true
        },{
            field:'cancelRate',
            title:'退货取消率（取消量/成交量）',
            sortable:true
        },{
            field:'#',
            title:'申请退货订单详情',
            sortable:true,
            formatter:function(value,row,index){
                return "<a class='cus_modal'  data-fancybox-type='iframe' href='/vender/riskControlVenderParentGroupDetailTradeNoInfoModal/申请退货/申请退货/"+row.date+"/申请退货/申请退货/申请退货'>详细信息</a>"
            }
        }]
    });
}

//退货率折线图
function getVenderCancelOrderChart(data){

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
                text: '退货率走势',
                //top: '80%',
                left: 'center',

            },
            tooltip: {
                trigger: 'axis',
                formatter:function(params,ticket,callback){
                    var str = params[0].name + '<br/>';
                    params.forEach(function(obj){
                        if(obj.seriesName.indexOf("比值")>-1){
                            str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                        }else{
                            str += obj.seriesName + ' : ' + obj.value + '<br/>'
                        }
                    });
                    return str;
                }
            },
            legend: {
                data: ["回收的退货个数和成交的个数的比值","出货的退货个数和成交的个数的比值"],
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
                    type: 'value',
                    name:'%'
                },
                {
                    type: 'value',
                    name:'%'
                }
            ],
            series: [
                {
                    name: '回收的退货个数和成交的个数的比值',
                    type: 'line',
                    label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                    data: series.cntRate
                },
                {
                    name: '出货的退货个数和成交的个数的比值',
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

//风控--退货率分析
function getRiskControlRemittedStatistic(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getRiskControlRebackOrderStatistic", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}


//风控--APP申请退货率分析
function getRiskControlReturnOrderStatistic(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getRiskControlReturnOrderStatistic", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}




