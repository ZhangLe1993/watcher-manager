Template.BDTradeSummary.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#BDTab').addClass('active');
    $('#bdTradeSummary').addClass('active');
    $(".reportWeekRange").hide();
    $(".reportMonthRange").hide();
    $(".ctabtitle").after($("#dateOptions").clone(true, true));
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    //$("#dateSum").html("("+(moment().format('D')-1)+"/"+moment().endOf('month').format('D')+")");
    $("#dateSum").html("("+((moment().format('D')-1)/(moment().endOf('month').format('D'))*100).toFixed(2)+"%"+")");

    var dateGap = -30;
    var minDate = "2016-07-01";
    var minWeekDate = "2016-07-03";
    var minMonthDate = "2016-07-01";
    var endDate = new Date().getNewDate(-1);
    var startDate = new Date(endDate).getNewDate(dateGap);
    var startWeekDate = moment().weekday(-14).format("YYYY-MM-DD");
    var endWeekDate = moment().startOf('week').format("YYYY-MM-DD");
    if(startWeekDate<minWeekDate){
        startWeekDate = minWeekDate;
    }
    var startMonthDate = moment().subtract(1, 'month').startOf('month').format("YYYY-MM-DD");
    var endMonthDate = moment().startOf('month').format("YYYY-MM-DD");
    if(startMonthDate<minMonthDate){
        startMonthDate = minMonthDate;
    }

    $(".weekly").hide();
    $(".monthly").hide();

    //renderFilterOptions();
    //$(".endDateSelectLabel").html(endDate);
    $(".dateSelectLabel").html(startDate+"~"+endDate);
    $('.reportRange').daterangepicker(datePickerOptionsFunc(startDate,endDate,minDate,false), pickDateRangeCallback);
    $(".weekSelectLabel").html(startWeekDate+"~"+endWeekDate);
    $('.reportWeekRange').daterangepicker(weekDatePickerOptionsFunc(startWeekDate,endWeekDate,minWeekDate,false), pickWeekRangeCallback);
    $(".monthSelectLabel").html(startMonthDate+"~"+endMonthDate);
    $('.reportMonthRange').daterangepicker(monthDatePickerOptionsFunc(startMonthDate,endMonthDate,minMonthDate,false), pickMonthRangeCallback);

    $(".dateTypeSelect").change(function () {
        var $type = $(this).val();
        $(".dateTypeSelect").val($type);
        if ($type == "tradeDaily") {
            $(".reportRange").show();
            $(".reportWeekRange").hide();
            $(".reportMonthRange").hide();
        } else if ($type == "tradeWeekly") {
            $(".reportRange").hide();
            $(".reportWeekRange").show();
            $(".reportMonthRange").hide();
        } else if ($type == "tradeMonthly") {
            $(".reportRange").hide();
            $(".reportWeekRange").hide();
            $(".reportMonthRange").show();
        }
    });

    //var endDate = new Date().getNewDate(-1);
    //var startDate = new Date(endDate).getNewDate(-31);
    var query = {"startDate": startDate, "endDate": endDate};
    drawCharts(query)

    var mstrQuery = {
        "accountType": 0
    };
    //getMSTRSession(dataService + "/MSTR/getSessionState", mstrQuery).done(function (data) {
    //    var url = mstrHost + '/microstrategy/servlet/mstrWeb?Server=IZ23DQH4PI3Z&Project=Aihuishou&port=0&evt=4001&src=mstrWeb.4001&visMode=0&reportID=6F09F9DF46308CFDCDB645AFE2077377&reportViewMode=1&hiddensections=header,path,footer&mstrSmgr=' + data;
    //    $('#mainIFrame').attr('src',url );
    //});

    renderFilterOptions();
    getCancelOrderReason();

    $("#search").click(function () {
        getCancelOrderReason();
    });

};
var dataService = Meteor.settings.public.dataService.baseUrl;

function pickDateRangeCallback(start, end, label) {
    var startDate = start.format('YYYY-MM-DD');
    var endDate = end.format('YYYY-MM-DD');
    $('.dateSelectLabel').html(startDate + ' ~ ' + endDate);
    var query = {"startDate": startDate, "endDate": endDate};
    drawCharts(query);
    getCancelOrderReason();
}
function pickWeekRangeCallback(start, end, label) {
    var startWeek = moment(start.format('YYYY-MM-DD'), 'YYYY-MM-DD').day(0).format('YYYY-MM-DD');
    var endWeek = moment(end.format('YYYY-MM-DD'), 'YYYY-MM-DD').day(0).format('YYYY-MM-DD');
    $('.weekSelectLabel').html(startWeek + '周 ~ ' + endWeek + '周');
    var query = {
        "startDate": startWeek,
        "endDate": endWeek
    };
    drawCharts(query);
    getCancelOrderReason();
}
function pickMonthRangeCallback(start, end, label) {
    var startMonth = moment(start.format('YYYY-MM-DD'), 'YYYY-MM-DD').startOf('month').format('YYYY-MM-DD');
    var endMonth = moment(end.format('YYYY-MM-DD'), 'YYYY-MM-DD').startOf('month').format('YYYY-MM-DD');
    $('.monthSelectLabel').html(startMonth + '月 ~ ' + endMonth + '月');
    var query = {
        "startDate": startMonth,
        "endDate": endMonth
    };
    drawCharts(query);
    getCancelOrderReason();
}


function drawCharts(query) {

    queryNew = query;
    var $type = $(".dateTypeSelect").val();
    var summaryUrl = "";
    var methodUrl = "";
    var cityUrl = "";
    var kpiUrl = dataService + "/kpi/getKPI";
    if ($type == "tradeDaily") {
        summaryUrl = dataService + "/bd/getBDTradeSummary";
        methodUrl = dataService + "/bd/getBDTradeMethod";
        cityUrl = dataService + "/bd/getBDTradeCity";
    } else if ($type == "tradeWeekly") {
        summaryUrl = dataService + "/bd/getWeeklyBDTradeSummary";
        methodUrl = dataService + "/bd/getWeeklyBDTradeMethod";
        cityUrl = dataService + "/bd/getWeeklyBDTradeCity";
    } else if ($type == "tradeMonthly") {
        summaryUrl = dataService + "/bd/getMonthlyBDTradeSummary";
        methodUrl = dataService + "/bd/getMonthlyBDTradeMethod";
        cityUrl = dataService + "/bd/getMonthlyBDTradeCity";
    }

    requestURL(summaryUrl, query).done(function (result) {
        //日期为空的数据补数据
        var tempResult = result;
        var dateArray = getDateRangeArray(query.startDate,new Date(query.endDate).getNewDate(1),'day');
        var groupMap = _.groupBy(result, function (obj) {
            return obj.source;
        });
        _.each(groupMap,function(value, key) {
            var existDateArray = _.pluck(value, 'date');
            _.each(dateArray,function(ele) {
                if(!existDateArray.contains(ele)) {
                    tempResult.push(
                        {
                            date: ele,
                            source: key,
                            trade_arrive_rate: 0,
                            trade_cnt: 0,
                            trade_profit: 0,
                            trade_submit_amount: 0,
                            trade_success_amount: 0,
                            trade_success_cnt: 0
                        }
                    );
                }
            });
        });
        //日期为空的数据补数据------结束
        var dataDict = _.groupBy(tempResult, function (obj) {
            return obj.date;
        });
        var dateList = [];
        var chanelList = _.map(tempResult,function(obj){return obj.source}).unique();
        var channel ={};
        chanelList.forEach(function(ele){
            channel[ele] = []
        });
        var obj = {
            trade_cnt: $.extend(true, {}, channel),
            trade_submit_amount: $.extend(true, {}, channel),
            trade_success_cnt: $.extend(true, {}, channel),
            trade_success_amount: $.extend(true, {}, channel),
            trade_arrive_rate: $.extend(true, {}, channel),
            trade_profit: $.extend(true, {}, channel)
        };

        for (var key in dataDict) {
            dateList.push(key);
            var ret = getCalcData(dataDict[key]);
            for (var chan in ret) {
                obj.trade_cnt[chan].push(ret[chan].trade_cnt);
                obj.trade_submit_amount[chan].push(ret[chan].trade_submit_amount);
                obj.trade_success_cnt[chan].push(ret[chan].trade_success_cnt);
                obj.trade_success_amount[chan].push(ret[chan].trade_success_amount);
                obj.trade_arrive_rate[chan].push(ret[chan].trade_arrive_rate);
                obj.trade_profit[chan].push(ret[chan].trade_profit);
            }
        }
        //删除都是0的渠道
        for(var key in obj){
            var keyObj = obj[key];
            for(var subKey in keyObj){
                if(keyObj[subKey].sum()==0){
                    delete keyObj[subKey];
                }
            }
        }

        drawBDSubmitReportChart(dateList, obj.trade_cnt);
        drawBDSubmitAmountReportChart(dateList, obj.trade_submit_amount);
        drawBDTradeReportChart(dateList, obj.trade_success_cnt);
        drawBDTradeAmountReportChart(dateList, obj.trade_success_amount);
        drawBDTradeArriveRateReportChart(dateList, obj.trade_arrive_rate);
        drawBDTradeProfitReportChart(dateList, obj.trade_profit);
    });

    //交易方式
    requestURL(methodUrl, query).done(function (ret) {
        drawBDTradeByMethod(ret);
    });

    //KPI
    requestURL(kpiUrl, ({"startDate": 1, "endDate": 1})).done(function (ret) {
        renderTableKpi(ret);
        $("#loading").hide();
    });
}

var queryNew;

function getCancelOrderReason() {
    var cancelOrderUrl = dataService + "/bd/getBDCancelOrderSummary";
    var source = $(".source").val();
    var queryCancel = {};
    queryCancel.startDate = queryNew.startDate;
    queryCancel.endDate = queryNew.endDate;
    queryCancel.source = source;
    queryCancel = cleanParams(_.clone(queryCancel));
    requestURL(cancelOrderUrl, queryCancel).done(function (ret) {
        drawCancelOrderChart(ret);
    });
}

function renderFilterOptions() {
    $(".source").attr("multiple", "multiple");
    renderOptions(".source", ["58到家", "一号店", "三星", "京东", "大疆", "小米", "腾讯", "金立", "飞凡", "DELL", "喜马拉雅FM", "锤子", "平安", "糯米", "极米", "掌引","科匠","招行","嗖嗖","再生活","努比亚","酷派","芝麻信用"]);

    $(".source").multipleSelect({
        placeholder: "全部",
        selectAllText:"全选",
        width: 150,
        selectAll: true,
        filter: true
    });
}

function renderOptions(sel, data) {
    $(sel).empty();
    data.forEach(function (ele) {
        $(sel).append("<option value='" + ele + "'>" + ele + "</option>")
    });
}

function cleanParams(filter) {
    //clean parameters
    var query = _.clone(filter);
    for (var key in query) {
        if (!query[key] && key != "offset") {
            delete query[key];
        }
    }
    return query;
}

function drawCancelOrderChart(ret) {
    var data = [];
    ret.forEach(function (e) {
        var series = {};
        series.name = e.date;
        series.value = e.source;
        data.push(series);
    });
    var option = {
        title: {
            text: 'TOP10订单失败原因分析',
            x: 'center',
            y: 'bottom'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        series: [
            {
                name: '订单失败原因',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                label: {
                    normal: {
                        show: true,
                        position: 'outside',
                        formatter: "{b}:{c}"
                    }
                },
                data: data,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    var dailyTrafficFunnelChart = echarts.init(document.getElementById('bdCancelOrderPieChart'));
    dailyTrafficFunnelChart.setOption(option, true);
}

function renderTableKpi(ret) {
    //订单取消表格
    var dataJson = [];
    var tempData = {};
    ret.forEach(function (e) {
        if (e.dept == "BD" & e.date == moment().startOf('month').format("YYYY-MM-DD") & e.index == "业务量") {
            if (e.channel == "总体") {
                tempData.targetAll = e.target;
                tempData.actualAll = e.achieved;
                tempData.achievedRateAll = (e.achievedRate*100).toFixed(2)+"%";
            } else if (e.channel == "京东") {
                tempData.targetJD = e.target;
                tempData.actualJD = e.achieved;
                tempData.achievedRateJD = (e.achievedRate*100).toFixed(2)+"%";
            } else if (e.channel == "小米") {
                tempData.targetXM = e.target;
                tempData.actualXM = e.achieved;
                tempData.achievedRateXM = (e.achievedRate*100).toFixed(2)+"%";
            } else if (e.channel == "其它") {
                tempData.targetOther = e.target;
                tempData.actualOther = e.achieved;
                tempData.achievedRateOther = (e.achievedRate*100).toFixed(2)+"%";
            }
        }
    });
    dataJson.push(tempData)

    $("#table").bootstrapTable('destroy').bootstrapTable({
        //exportDataType: 'all',
        pagination: false,
        showExport: false,
        data: dataJson
    });
}

function drawBDTradeByMethod(obj) {
    var options = {
        title: {
            text: '',
            //padding:[0,0,0,50],
            x: 'center',
            y: 'bottom'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        calculable: true,
        grid: {
            //bottom:60
        },
        series: [
            {
                name: '交易方式',
                type: 'pie',
                radius: ['0%', '50%'],
                center: ['50%', '50%'],
                //startAngle:0,
                label: {
                    normal: {
                        show: true,
                        position: 'outside',
                        formatter: "{b}:{c}"
                    }
                },
                labelLine: {
                    normal: {
                        length: 40,
                        length2: 20
                    }
                },
                //clockwise: true,
                data: []
            }
        ]
    };

    var submitOptions = $.extend(true, {}, options);
    submitOptions.title.text = "按交易方式提交对比";
    submitOptions.series[0].data = obj.trade_cnt.sort(getSortOrder('value'));
    var bdSubmitMethodPieChart = echarts.init(document.getElementById('bdSubmitMethodPieChart'));
    bdSubmitMethodPieChart.setOption(submitOptions);

    var submitAmountOptions = $.extend(true, {}, options);
    submitAmountOptions.title.text = "按交易方式提交金额对比";
    submitAmountOptions.series[0].data = obj.trade_submit_amount.sort(getSortOrder('value'));
    var bdSubmitAmountMethodPieChart = echarts.init(document.getElementById('bdSubmitAmountMethodPieChart'));
    bdSubmitAmountMethodPieChart.setOption(submitAmountOptions);

    var tradeOptions = $.extend(true, {}, options);
    tradeOptions.title.text = "按交易方式成交对比";
    tradeOptions.series[0].data = obj.trade_success_cnt.sort(getSortOrder('value'));
    var bdTradeMethodPieChart = echarts.init(document.getElementById('bdTradeMethodPieChart'));
    bdTradeMethodPieChart.setOption(tradeOptions);

    var tradeAmountOptions = $.extend(true, {}, options);
    tradeAmountOptions.title.text = "按交易方式成交金额对比";
    tradeAmountOptions.series[0].data = obj.trade_success_amount.sort(getSortOrder('value'));
    tradeAmountOptions.series[0].label.normal.formatter = "{b}:￥{c}";
    var bdTradeAmountMethodPieChart = echarts.init(document.getElementById('bdTradeAmountMethodPieChart'));
    bdTradeAmountMethodPieChart.setOption(tradeAmountOptions);

    var tradeProfitOptions = $.extend(true, {}, options);
    tradeProfitOptions.title.text = "按交易方式毛利额对比";
    tradeProfitOptions.series[0].data = obj.trade_profit.sort(getSortOrder('value'));
    tradeProfitOptions.series[0].label.normal.formatter = "{b}:￥{c}";
    var bdTradeProfitMethodPieChart = echarts.init(document.getElementById('bdTradeProfitMethodPieChart'));
    bdTradeProfitMethodPieChart.setOption(tradeProfitOptions);

    window.addEventListener('resize', function () {
        bdTradeProfitMethodPieChart.resize();
    })
}

function drawBDTradeByCity(data, field) {
    var options = {
        title: {
            text: '',
            //padding:[0,0,0,50],
            x: 'center',
            y: 'bottom'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        calculable: true,
        grid: {
            //bottom:60
        },
        series: [
            {
                name: '城市',
                type: 'pie',
                radius: ['0%', '50%'],
                center: ['50%', '50%'],
                //startAngle:0,
                label: {
                    normal: {
                        show: true,
                        position: 'outside',
                        formatter: "{b}:{c}"
                    }
                },
                labelLine: {
                    normal: {
                        length: 40,
                        length2: 20
                    }
                },
                //clockwise: true,
                data: []
            }
        ]
    };

    if (field == "trade_cnt") {
        var submitOptions = $.extend(true, {}, options);
        submitOptions.title.text = "小合作方提交对比";
        submitOptions.series[0].data = data.sort(getSortOrder('value'));
        var bdSubmitCityPieChart = echarts.init(document.getElementById('bdSubmitCityPieChart'));
        bdSubmitCityPieChart.setOption(submitOptions);
        window.addEventListener('resize', function () {
            bdSubmitCityPieChart.resize();
        })
    } else if (field == "trade_submit_amount") {

        var submitAmountOptions = $.extend(true, {}, options);
        submitAmountOptions.title.text = "小合作方提交金额对比";
        submitAmountOptions.series[0].data = data.sort(getSortOrder('value'));
        submitAmountOptions.series[0].label.normal.formatter = "{b}:￥{c}";
        var bdSubmitAmountCityPieChart = echarts.init(document.getElementById('bdSubmitAmountCityPieChart'));
        bdSubmitAmountCityPieChart.setOption(submitAmountOptions);
        window.addEventListener('resize', function () {
            bdSubmitAmountCityPieChart.resize();
        })
    } else if (field == "trade_success_cnt") {
        var tradeOptions = $.extend(true, {}, options);
        tradeOptions.title.text = "小合作方成交对比";
        tradeOptions.series[0].data = data.sort(getSortOrder('value'));
        var bdTradeCityPieChart = echarts.init(document.getElementById('bdTradeCityPieChart'));
        bdTradeCityPieChart.setOption(tradeOptions);
        window.addEventListener('resize', function () {
            bdTradeCityPieChart.resize();
        })
    } else if (field == "trade_success_amount") {
        var tradeAmountOptions = $.extend(true, {}, options);
        tradeAmountOptions.title.text = "小合作方成交金额对比";
        tradeAmountOptions.series[0].data = data.sort(getSortOrder('value'));
        tradeAmountOptions.series[0].label.normal.formatter = "{b}:￥{c}";
        var bdTradeAmountCityPieChart = echarts.init(document.getElementById('bdTradeAmountCityPieChart'));
        bdTradeAmountCityPieChart.setOption(tradeAmountOptions);
        window.addEventListener('resize', function () {
            bdTradeAmountCityPieChart.resize();
        })

    } else if (field == "trade_profit") {
        var tradeProfitOptions = $.extend(true, {}, options);
        tradeProfitOptions.title.text = "小合作方毛利额对比";
        tradeProfitOptions.series[0].data = data.sort(getSortOrder('value'));
        tradeProfitOptions.series[0].label.normal.formatter = "{b}:￥{c}";
        var bdTradeProfitCityPieChart = echarts.init(document.getElementById('bdTradeProfitCityPieChart'));
        bdTradeProfitCityPieChart.setOption(tradeProfitOptions);
        window.addEventListener('resize', function () {
            bdTradeProfitCityPieChart.resize();
        })
    }


}

function getCalcData(data) {
    /*var obj = {
        "总体": {},
        "58到家": {},
        "一号店": {},
        "三星": {},
        "京东": {},
        "大疆": {},
        "小米": {},
        "腾讯": {},
        "金立": {},
        "飞凡": {},
        "DELL": {},
        "喜马拉雅FM": {},
        "锤子": {},
        "平安": {},
        "糯米": {},
        "极米": {},
        "掌引": {},
        "科匠":{},
        "招行":{},
        "嗖嗖":{},
        "再生活":{},
        "努比亚":{},
        "酷派":{}
    };*/
    var chanelList = _.map(data,function(tmp){return tmp.source}).unique();
    var obj = {};
    chanelList.forEach(function(ele) {
        obj[ele] = {};
    });
    data.forEach(function (tmp) {
        var source = tmp.source;
        obj[source].trade_cnt = tmp.trade_cnt;
        obj[source].trade_submit_amount = tmp.trade_submit_amount;
        obj[source].trade_success_cnt = (tmp.trade_success_cnt);
        obj[source].trade_success_amount = (tmp.trade_success_amount);
        obj[source].trade_arrive_rate = (tmp.trade_arrive_rate);
        obj[source].trade_profit = (tmp.trade_profit);
    });
    return obj;
}

function drawBDSubmitReportChart(dateList, dataSets) {
    var labels = [];
    var series = [{
        name:'全选',
        type:'line',
        data:[]
    }];
    var pieData = [];
    for (var key in dataSets) {
        labels.push(key);
        series.push({
            name: key,
            type: 'line',
            label: {
                normal: {
                    show: (key == "京东") ? true : false
                }
            },
            lineStyle: {
                normal: {
                    type: 'solid'
                }
            },
            data: dataSets[key]
        });
        if (key != '总体') {
            pieData.push({"name": key, "value": dataSets[key].sum()})
        }
    }

    labels.splice(0,0,{name:'全选',icon: 'circle'})
    var option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: labels,
            //data:[{name:'全选',icon: 'circle'},'总访客数','门店回收访客数','询价访客数','询价完成访客数','选择回收方式访客数','选择支付方式访客数','提交成功访客数','提交成功订单数','询价转化率','询价完成转化率','询价完成率','选择回收方式转化率','选择回收方式率','选择支付方式转化率','选择支付方式率','提交成功转化率','提交成功率','订单转化率'],
            selected:{
                "全选":true
            },
            padding:[0,0,70,0]
        },
        dataZoom: [
            {
                type: 'slider',
                start: 30,
                end: 100
            }
        ],
        calculable: true,
        xAxis: [
            {
                'type': 'category',
                boundaryGap: false,
                'data': dateList
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ]
    };

    var lineOptions = option;
    lineOptions.series = series;
    var bdSubmitReportLineChart = echarts.init(document.getElementById('bdSubmitReportLineChart'));
    bdSubmitReportLineChart.setOption(lineOptions);
    window.addEventListener('resize', function () {
        bdSubmitReportLineChart.resize();
    })
    bdSubmitReportLineChart.on('legendselectchanged',function(params){
        var all=params.selected;
        var key = params.name;
        lineOptions.legend.selected={};
        if(key=='全选'&&params.selected[key]==true){
            for(var a in all){
                all[a]=true;
            }
        }else if(key=='全选'&&params.selected[key]==false)
        {
            for(var a in all){
                all[a]=false;
            }
        }
        lineOptions.legend.selected=all;
        bdSubmitReportLineChart.setOption(lineOptions);
    });

    //划分三个合作方
    var pieThreeData = [];
    var tempPieThreeDataOther = {};
    var tempValue = 0;
    pieData.forEach(function (data) {
        var tempPieThreeData = {};
        if (data.name == "京东" | data.name == "小米" | data.name=="芝麻信用" | data.name=="支付宝小程序" | data.name=="华为") {
            tempPieThreeData.name = data.name;
            tempPieThreeData.value = data.value;
            pieThreeData.push(tempPieThreeData);
        } else {
            tempValue += data.value;
        }
    });
    tempPieThreeDataOther.name = "小合作方";
    tempPieThreeDataOther.value = tempValue;
    pieThreeData.push(tempPieThreeDataOther);

    //小合作方详情
    var pieSmallData = [];
    pieData.forEach(function (data) {
        var tempPieSmallData = {};
        if (data.name != "京东" & data.name != "小米"&data.name!="芝麻信用" & data.name!="支付宝小程序" & data.name!="华为") {
            tempPieSmallData.name = data.name;
            tempPieSmallData.value = data.value;
            pieSmallData.push(tempPieSmallData);
        }
    });
    drawBDTradeByCity(pieSmallData, "trade_cnt");

    var pieOptions = {
        title: {
            text: '按渠道提交对比',

            x: 'center',
            y: 'bottom'
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
                radius: ['0%', '50%'],
                center: ['50%', '50%'],
                //startAngle:0,
                label: {
                    normal: {
                        show: true,
                        position: 'outside',
                        formatter: "{b}:{c}"
                    }
                },
                labelLine: {
                    normal: {
                        length: 30,
                        length2: 20
                    }
                },
                //clockwise: true,
                data: pieThreeData.sort(getSortOrder('value'))
            }
        ]
    };

    var bdSubmitReportPieChart = echarts.init(document.getElementById('bdSubmitReportPieChart'));
    bdSubmitReportPieChart.setOption(pieOptions);
    window.addEventListener('resize', function () {
        bdSubmitReportPieChart.resize();
    })
}


function drawBDSubmitAmountReportChart(dateList, dataSets) {
    var labels = [];
    var series = [{
        name:'全选',
        type:'line',
        data:[]
    }];
    var pieData = [];
    for (var key in dataSets) {
        labels.push(key);
        series.push({
            name: key,
            type: 'line',
            label: {
                normal: {
                    show: (key == "京东") ? true : false,
                    formatter: "￥{c}"
                }
            },
            lineStyle: {
                normal: {
                    type: 'solid'
                }
            },
            data: dataSets[key]
        });
        if (key != '总体') {
            pieData.push({"name": key, "value": dataSets[key].sum()})
        }
    }
    labels.splice(0,0,{name:'全选',icon: 'circle'})
    var option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: labels,
            padding:[0,0,70,0]
        },
        dataZoom: [
            {
                type: 'slider',
                start: 30,
                end: 100
            }
        ],
        calculable: true,
        xAxis: [
            {
                'type': 'category',
                boundaryGap: false,
                'data': dateList
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    formatter: '￥{value}'
                }
            }
        ]
    };

    var lineOptions = option;
    lineOptions.series = series;
    var bdSubmitAmountReportLineChart = echarts.init(document.getElementById('bdSubmitAmountReportLineChart'));
    bdSubmitAmountReportLineChart.setOption(lineOptions);
    window.addEventListener('resize', function () {
        bdSubmitAmountReportLineChart.resize();
    })
    bdSubmitAmountReportLineChart.on('legendselectchanged',function(params){
        var all=params.selected;
        var key = params.name;
        lineOptions.legend.selected={};
        if(key=='全选'&&params.selected[key]==true){
            for(var a in all){
                all[a]=true;
            }
        }else if(key=='全选'&&params.selected[key]==false)
        {
            for(var a in all){
                all[a]=false;
            }
        }
        lineOptions.legend.selected=all;
        bdSubmitAmountReportLineChart.setOption(lineOptions);
    });


    //划分三个合作方
    var pieThreeData = [];
    var tempPieThreeDataOther = {};
    var tempValue = 0;
    pieData.forEach(function (data) {
        var tempPieThreeData = {};
        if (data.name == "京东" | data.name == "小米"|data.name=="芝麻信用" | data.name=="支付宝小程序" | data.name=="华为") {
            tempPieThreeData.name = data.name;
            tempPieThreeData.value = data.value;
            pieThreeData.push(tempPieThreeData);
        } else {
            tempValue += data.value;
        }
    });
    tempPieThreeDataOther.name = "小合作方";
    tempPieThreeDataOther.value = tempValue;
    pieThreeData.push(tempPieThreeDataOther);

    //小合作方详情
    var pieSmallData = [];
    pieData.forEach(function (data) {
        var tempPieSmallData = {};
        if (data.name != "京东" & data.name != "小米"&data.name!="芝麻信用" & data.name!="支付宝小程序" & data.name!="华为") {
            tempPieSmallData.name = data.name;
            tempPieSmallData.value = data.value;
            pieSmallData.push(tempPieSmallData);
        }
    });
    drawBDTradeByCity(pieSmallData, "trade_submit_amount");

    var pieOptions = {
        title: {
            text: '按渠道提交金额对比',
            x: 'center',
            y: "bottom"
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
                radius: ['0%', '50%'],
                center: ['50%', '50%'],
                //startAngle:0,
                label: {
                    normal: {
                        show: true,
                        position: 'outside',
                        formatter: "{b}:￥{c}"

                    }
                },
                labelLine: {
                    normal: {
                        length: 40,
                        length2: 20
                    }
                },
                //clockwise: true,
                data: pieThreeData.sort(getSortOrder('value'))
            }
        ]
    };
    ;

    var bdSubmitAmountReportPieChart = echarts.init(document.getElementById('bdSubmitAmountReportPieChart'));
    bdSubmitAmountReportPieChart.setOption(pieOptions);
    window.addEventListener('resize', function () {
        bdSubmitAmountReportPieChart.resize();
    })
}

function drawBDTradeReportChart(dateList, dataSets) {
    var labels = [];
    var series = [{
        name:'全选',
        type:'line',
        data:[]
    }];
    var pieData = [];
    for (var key in dataSets) {
        labels.push(key);
        series.push({
            name: key,
            type: 'line',
            label: {
                normal: {
                    show: (key == "京东") ? true : false
                }
            },
            lineStyle: {
                normal: {
                    type: 'solid'
                }
            },
            data: dataSets[key]
        });
        if (key != '总体') {
            pieData.push({"name": key, "value": dataSets[key].sum()})
        }
    }
    labels.splice(0,0,{name:'全选',icon: 'circle'})
    var option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: labels,
            padding:[0,0,80,0]
        },
        dataZoom: [
            {
                type: 'slider',
                start: 30,
                end: 100
            }
        ],
        calculable: true,
        xAxis: [
            {
                'type': 'category',
                boundaryGap: false,
                'data': dateList
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ]
    };

    var lineOptions = option;
    lineOptions.series = series;
    var bdTradeReportLineChart = echarts.init(document.getElementById('bdTradeReportLineChart'));
    bdTradeReportLineChart.setOption(lineOptions);
    window.addEventListener('resize', function () {
        bdTradeReportLineChart.resize();
    })
    bdTradeReportLineChart.on('legendselectchanged',function(params){
        var all=params.selected;
        var key = params.name;
        lineOptions.legend.selected={};
        if(key=='全选'&&params.selected[key]==true){
            for(var a in all){
                all[a]=true;
            }
        }else if(key=='全选'&&params.selected[key]==false)
        {
            for(var a in all){
                all[a]=false;
            }
        }
        lineOptions.legend.selected=all;
        bdTradeReportLineChart.setOption(lineOptions);
    });

    //划分三个合作方
    var pieThreeData = [];
    var tempPieThreeDataOther = {};
    var tempValue = 0;
    pieData.forEach(function (data) {
        var tempPieThreeData = {};
        if (data.name == "京东" | data.name == "小米"|data.name=="芝麻信用" | data.name=="支付宝小程序" | data.name=="华为") {
            tempPieThreeData.name = data.name;
            tempPieThreeData.value = data.value;
            pieThreeData.push(tempPieThreeData);
        } else {
            tempValue += data.value;
        }
    });
    tempPieThreeDataOther.name = "小合作方";
    tempPieThreeDataOther.value = tempValue;
    pieThreeData.push(tempPieThreeDataOther);

    //小合作方详情
    var pieSmallData = [];
    pieData.forEach(function (data) {
        var tempPieSmallData = {};
        if (data.name != "京东" & data.name != "小米"&data.name!="芝麻信用" & data.name!="支付宝小程序" & data.name!="华为") {
            tempPieSmallData.name = data.name;
            tempPieSmallData.value = data.value;
            pieSmallData.push(tempPieSmallData);
        }
    });
    drawBDTradeByCity(pieSmallData, "trade_success_cnt");

    var pieOptions = {
        title: {
            text: '按渠道成交对比',

            x: 'center',
            y: 'bottom'
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
                radius: ['0%', '50%'],
                center: ['50%', '50%'],
                //startAngle:0,
                label: {
                    normal: {
                        show: true,
                        position: 'outside',
                        formatter: "{b}:{c}"
                    }
                },
                labelLine: {
                    normal: {
                        length: 40,
                        length2: 20
                    }
                },
                //clockwise: true,
                data: pieThreeData.sort(getSortOrder('value'))
            }
        ]
    };


    var bdTradeReportPieChart = echarts.init(document.getElementById('bdTradeReportPieChart'));
    bdTradeReportPieChart.setOption(pieOptions);
    window.addEventListener('resize', function () {
        bdTradeReportPieChart.resize();
    })

}

function drawBDTradeAmountReportChart(dateList, dataSets) {
    var labels = [];
    var series = [{
        name:'全选',
        type:'line',
        data:[]
    }];
    var pieData = [];
    for (var key in dataSets) {
        labels.push(key);
        series.push({
            name: key,
            type: 'line',
            label: {
                normal: {
                    show: (key == "京东") ? true : false,
                    formatter: "￥{c}"
                }
            },
            lineStyle: {
                normal: {
                    type: 'solid'
                }
            },
            data: dataSets[key]
        });
        if (key != '总体') {
            pieData.push({"name": key, "value": dataSets[key].sum()})
        }
    }
    labels.splice(0,0,{name:'全选',icon: 'circle'})
    var option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: labels,
            padding:[0,0,80,0]
        },
        dataZoom: [
            {
                type: 'slider',
                start: 30,
                end: 100
            }
        ],
        calculable: true,
        xAxis: [
            {
                'type': 'category',
                boundaryGap: false,
                'data': dateList
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    formatter: '￥{value}'
                }
            }
        ]
    };

    var lineOptions = option;
    lineOptions.series = series;
    var bdTradeAmountReportLineChart = echarts.init(document.getElementById('bdTradeAmountReportLineChart'));
    bdTradeAmountReportLineChart.setOption(lineOptions);
    window.addEventListener('resize', function () {
        bdTradeAmountReportLineChart.resize();
    })
    bdTradeAmountReportLineChart.on('legendselectchanged',function(params){
        var all=params.selected;
        var key = params.name;
        lineOptions.legend.selected={};
        if(key=='全选'&&params.selected[key]==true){
            for(var a in all){
                all[a]=true;
            }
        }else if(key=='全选'&&params.selected[key]==false)
        {
            for(var a in all){
                all[a]=false;
            }
        }
        lineOptions.legend.selected=all;
        bdTradeAmountReportLineChart.setOption(lineOptions);
    });

    //划分三个合作方
    var pieThreeData = [];
    var tempPieThreeDataOther = {};
    var tempValue = 0;
    pieData.forEach(function (data) {
        var tempPieThreeData = {};
        if (data.name == "京东" | data.name == "小米"|data.name=="芝麻信用" | data.name=="支付宝小程序" | data.name=="华为") {
            tempPieThreeData.name = data.name;
            tempPieThreeData.value = data.value;
            pieThreeData.push(tempPieThreeData);
        } else {
            tempValue += data.value;
        }
    });
    tempPieThreeDataOther.name = "小合作方";
    tempPieThreeDataOther.value = tempValue;
    pieThreeData.push(tempPieThreeDataOther);

    //小合作方详情
    var pieSmallData = [];
    pieData.forEach(function (data) {
        var tempPieSmallData = {};
        if (data.name != "京东" & data.name != "小米"&data.name!="芝麻信用" & data.name!="支付宝小程序" & data.name!="华为") {
            tempPieSmallData.name = data.name;
            tempPieSmallData.value = data.value;
            pieSmallData.push(tempPieSmallData);
        }
    });
    drawBDTradeByCity(pieSmallData, "trade_success_amount");

    var pieOptions = {
        title: {
            text: '按渠道成交金额对比',
            x: 'center',
            y: "bottom"
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
                radius: ['0%', '50%'],
                center: ['50%', '50%'],
                //startAngle:0,
                label: {
                    normal: {
                        show: true,
                        position: 'outside',
                        formatter: "{b}:￥{c}"

                    }
                },
                labelLine: {
                    normal: {
                        length: 40,
                        length2: 20
                    }
                },
                //clockwise: true,
                data: pieThreeData.sort(getSortOrder('value'))
            }
        ]
    };

    var bdTradeAmountReportPieChart = echarts.init(document.getElementById('bdTradeAmountReportPieChart'));
    bdTradeAmountReportPieChart.setOption(pieOptions);
    window.addEventListener('resize', function () {
        bdTradeAmountReportPieChart.resize();
    })
}

function drawBDTradeArriveRateReportChart(dateList, dataSets) {
    var labels = [];
    var series = [];
    labels.push({name: '全选', icon: 'circle'});
    series.push({
        name: '全选',
        type: 'line',
        data: []
    });
    for (var key in dataSets) {
        labels.push(key);
        series.push({
            name: key,
            type: 'line',
            label: {
                normal: {
                    show: false,
                    //formatter: "￥{c}"
                }
            },
            lineStyle: {
                normal: {
                    type: 'solid'
                }
            },
            data: dataSets[key]
        });
    }
    var option = {
        tooltip: {
            trigger: 'axis',
            formatter:function(params,ticket,callback){
                var str = (params[1]?params[1]:params[0]).name + '<br/>';
                params.forEach(function(obj){
                    if(obj.seriesName.indexOf("率")>-1){
                        str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                    }else if(obj.seriesName.indexOf("全选")>-1){
                        str+='数据如下：'+'<br/>'
                    }else{
                        str += obj.seriesName + ' : ' + obj.value + '<br/>'
                    }
                });
                return str;
            }
        },
        legend: {
            data: labels
        },
        dataZoom: [
            {
                type: 'slider',
                start: 30,
                end: 100
            }
        ],
        calculable: true,
        xAxis: [
            {
                'type': 'category',
                boundaryGap: false,
                'data': dateList
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    //formatter: '￥{value}'
                }
            }
        ]
    };

    var lineOptions = option;
    lineOptions.series = series;
    var bdTradeArriveRateReportLineChart = echarts.init(document.getElementById('bdTradeArriveRateReportLineChart'));
    bdTradeArriveRateReportLineChart.setOption(lineOptions);
    window.addEventListener('resize', function () {
        bdTradeArriveRateReportLineChart.resize();
    })

    bdTradeArriveRateReportLineChart.on('legendselectchanged', function (params) {
        //var legendDict = params.selected;
        //var tmpObj = {}
        //for(var key in legendDict){
        //    if(legendDict[key]){
        //        tmpObj[key]
        //    }
        //}
        var all = params.selected;
        var key = params.name;
        option.legend.selected = {};
        if (key == '全选' && params.selected[key] == true) {
            for (var a in all) {
                all[a] = true;
            }
            //option.legend.selected={'全选':true,'总访客数':true,'门店回收访客数':true,'询价访客数':true,'询价完成访客数':true,'选择回收方式访客数':true,'选择支付方式访客数':true,'提交成功访客数':true,'询价转化率':true,'询价完成转化率':true,'询价完成率':true,'选择回收方式转化率':true,'选择回收方式率':true,'选择支付方式转化率':true,'选择支付方式率':true,'提交成功转化率':true,'提交成功率':true};
        } else if (key == '全选' && params.selected[key] == false) {
            for (var a in all) {
                all[a] = false;
            }
            //option.legend.selected={'全选':false,'总访客数':false,'门店回收访客数':false,'询价访客数':false,'询价完成访客数':false,'选择回收方式访客数':false,'选择支付方式访客数':false,'提交成功访客数':false,'询价转化率':false,'询价完成转化率':false,'询价完成率':false,'选择回收方式转化率':false,'选择回收方式率':false,'选择支付方式转化率':false,'选择支付方式率':false,'提交成功转化率':false,'提交成功率':false};
        }
        option.legend.selected = all;
        bdTradeArriveRateReportLineChart.setOption(option);
    });
}

function drawBDTradeProfitReportChart(dateList, dataSets) {
    var labels = [];
    var series = [{
        name: '全选',
        type: 'line',
        data: []
    }];
    var pieData = [];
    for (var key in dataSets) {
        labels.push(key);
        series.push({
            name: key,
            type: 'line',
            label: {
                normal: {
                    show: (key == "京东") ? true : false,
                    formatter: "￥{c}"
                }
            },
            lineStyle: {
                normal: {
                    type: 'solid'
                }
            },
            data: dataSets[key]
        });
        if (key != '总体') {
            pieData.push({"name": key, "value": dataSets[key].sum()})
        }
    }
    labels.splice(0,0,{name:'全选',icon: 'circle'})
    var option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: labels,
            padding:[0,0,80,0]
        },
        dataZoom: [
            {
                type: 'slider',
                start: 30,
                end: 100
            }
        ],
        calculable: true,
        xAxis: [
            {
                'type': 'category',
                boundaryGap: false,
                'data': dateList
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    formatter: '￥{value}'
                }
            }
        ]
    };

    var lineOptions = option;
    lineOptions.series = series;
    var bdTradeProfitReportLineChart = echarts.init(document.getElementById('bdTradeProfitReportLineChart'));
    bdTradeProfitReportLineChart.setOption(lineOptions);
    window.addEventListener('resize', function () {
        bdTradeProfitReportLineChart.resize();
    })
    bdTradeProfitReportLineChart.on('legendselectchanged',function(params){
        var all=params.selected;
        var key = params.name;
        lineOptions.legend.selected={};
        if(key=='全选'&&params.selected[key]==true){
            for(var a in all){
                all[a]=true;
            }
        }else if(key=='全选'&&params.selected[key]==false)
        {
            for(var a in all){
                all[a]=false;
            }
        }
        lineOptions.legend.selected=all;
        bdTradeProfitReportLineChart.setOption(lineOptions);
    });

    //划分三个合作方
    var pieThreeData = [];
    var tempPieThreeDataOther = {};
    var tempValue = 0;
    pieData.forEach(function (data) {
        var tempPieThreeData = {};
        if (data.name == "京东" | data.name == "小米"|data.name=="芝麻信用" | data.name=="支付宝小程序" | data.name=="华为") {
            tempPieThreeData.name = data.name;
            tempPieThreeData.value = data.value;
            pieThreeData.push(tempPieThreeData);
        } else {
            tempValue += data.value;
        }
    });
    tempPieThreeDataOther.name = "小合作方";
    tempPieThreeDataOther.value = tempValue;
    pieThreeData.push(tempPieThreeDataOther);

    //小合作方详情
    var pieSmallData = [];
    pieData.forEach(function (data) {
        var tempPieSmallData = {};
        if (data.name != "京东" & data.name != "小米"&data.name!="芝麻信用" & data.name!="支付宝小程序" & data.name!="华为") {
            tempPieSmallData.name = data.name;
            tempPieSmallData.value = data.value;
            pieSmallData.push(tempPieSmallData);
        }
    });
    drawBDTradeByCity(pieSmallData, "trade_profit");

    var pieOptions = {
        title: {
            text: '按渠道毛利额对比',
            x: 'center',
            y: "bottom"
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
                //startAngle:0,
                label: {
                    normal: {
                        show: true,
                        position: 'outside',
                        formatter: "{b}:￥{c}"

                    }
                },
                labelLine: {
                    normal: {
                        length: 40,
                        length2: 20
                    }
                },
                //clockwise: true,
                data: pieThreeData.sort(getSortOrder('value'))
            }
        ]
    };

    var bdTradeProfitReportPieChart = echarts.init(document.getElementById('bdTradeProfitReportPieChart'));
    bdTradeProfitReportPieChart.setOption(pieOptions);
    window.addEventListener('resize', function () {
        bdTradeProfitReportPieChart.resize();
    })

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