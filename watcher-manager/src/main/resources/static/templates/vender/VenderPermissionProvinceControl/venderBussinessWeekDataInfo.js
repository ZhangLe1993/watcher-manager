Template.venderBussinessWeekDataInfo.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#VenderPermissionKAControl').addClass('active');
    $('#venderBussinessWeekDataInfo').addClass('active');

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var minWeekDate = "2016-07-03";
    var endWeekDate = moment().subtract(0, 'week').startOf('week').format('YYYY-MM-DD');
    var startWeekDate = moment(endWeekDate).subtract(6, 'days').format('YYYY-MM-DD');
    if(startWeekDate<minWeekDate){
        startWeekDate = minWeekDate;
    }

    $(".startWeekDateSelectLabel").html(startWeekDate+"~"+endWeekDate);
    $('.marketingWeeklyStartDatePicker').daterangepicker(weekDatePickerOptionsFunc(startWeekDate,endWeekDate,minWeekDate,true), pickStartWeekDateRangeCallback);

    //renderBasicPage();
    //renderLastWeekBasicPage();
    //renderChartBasicInfo();
    $("#allPage").hide();



    $(".search").click(function(){
        if($(".venderParentName").val()==""){
            alert("请输入总账户名!")
        }else {
            $("#allPage").show();
            renderBasicPage();
            renderLastWeekBasicPage();
            renderChartBasicInfo();
        }
    })

};

function pickStartWeekDateRangeCallback(start, end, label) {
    console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    var sdt = moment(end).subtract(6, 'days').format('YYYY-MM-DD');
    var edt = start.format('YYYY-MM-DD');
    $('.startWeekDateSelectLabel').html(sdt+"~"+edt);
}

function getSelectedFilter() {

    dt = $('.startWeekDateSelectLabel').text().replace(/ /g,"").split("~");
    var startDate = dt[0];
    var endDate = dt[1];
    var vender_parent_name=[];
    vender_parent_name.push($(".venderParentName").val());
    var filter={};
    filter.startDate=startDate;
    filter.endDate=endDate;
    filter.vender_parent_name=vender_parent_name;

    return cleanParams(filter);
}

function getLastWeekSelectedFilter() {

    dt = $('.startWeekDateSelectLabel').text().replace(/ /g,"").split("~");
    var startDate = dt[0];
    var endDate = dt[1];
    var vender_parent_name=[];
    vender_parent_name.push($(".venderParentName").val());
    var filter={};
    filter.startDate=moment(startDate).subtract(7, 'days').format('YYYY-MM-DD');
    filter.endDate=moment(endDate).subtract(7, 'days').format('YYYY-MM-DD');
    filter.vender_parent_name=vender_parent_name;

    return cleanParams(filter);
}

function cleanParams(filter) {
    //clean parameters
    var query = _.clone(filter);
    for (var key in query) {
        if ((!query[key] && key != "offset")|query[key]=="") {
            delete query[key]
        }
    }
    return query
}

//本周基本数据
function renderBasicPage() {
    //var dateGap = -15;
    var filter = getSelectedFilter();
    var promise = getBussinessWeekDataInfo(filter);
    promise.done(function (ret) {
        basicDataStatisticChart(ret);
        var sub_count=0;
        var sub_amount=0.00;
        var cancel_count=0;
        var old_count=0;
        var success_count=0;
        var success_amount=0.00;
        var ka_fee_num=0.00;
        var remitted_amount=0.00;
        var inspect_fail_amount=0.00;
        var inspect_fail_count=0;
        var bonus_amount=0.00;
        var between_deduction_price=0.00;
        var add_point=0;
        var ded_points=0;
        var deduction_points=0;
        ret.forEach(function(e){
            sub_count+= e.sub_count;
            sub_amount+= e.sub_amount;
            cancel_count+= e.cancel_count;
            old_count+= e.old_count;
            success_count+= e.success_count;
            success_amount+= e.success_amount;
            ka_fee_num+= e.ka_fee_num;
            remitted_amount+= e.remitted_amount;
            inspect_fail_amount+= e.inspect_fail_amount;
            inspect_fail_count+= e.inspect_fail_count;
            bonus_amount+= e.bonus_amount;
            between_deduction_price+=e.between_deduction_price;
            add_point+=e.add_point;
            ded_points+= e.ded_points;
            deduction_points+= e.deduction_points;
        })

        //提交
        $("#orderSubmitCntId").html(sub_count);
        $("#orderSubmitNumId").html(sub_amount);
        $("#orderCancelSubmitNumId").html(cancel_count);
        $("#orderAvgSubmitNumId").html(((sub_amount/sub_count)).toFixed(2));
        $("#orderJunkSubmitNumId").html(old_count);

        //成交
        $("#orderTradeCntId").html(success_count);
        $("#orderTradeNumId").html(success_amount);
        $("#orderAvgTradeNumId").html(((success_amount/success_count)).toFixed(2));

        //运营数据
        $("#venderParentBonusId").html(bonus_amount.toFixed(2));
        $("#venderParentKaFeeId").html(ka_fee_num);
        $("#remittedAmountNameId").html(remitted_amount);
        $("#venderParentInspectAmountId").html(inspect_fail_amount);
        $("#venderParentPointId").html(add_point);
        $("#betweenDeductionPriceId").html(between_deduction_price);
        $("#deductionPointsId").html(deduction_points);
        $("#dedPointsId").html(ded_points);

        //验货失误情况
        $("#orderInspectAmountId").html(inspect_fail_amount);
        $("#orderInspectAmountRateId").html(((inspect_fail_amount/success_amount)*100).toFixed(2)+"%");
        $("#orderInspectCntId").html(inspect_fail_count);
        $("#orderInspectCntRateId").html(((inspect_fail_count/success_count)*100).toFixed(2)+"%");
    });
}

//上周基本数据
function renderLastWeekBasicPage() {
    //var dateGap = -15;
    var filter = getLastWeekSelectedFilter();
    var promise = getBussinessWeekDataInfo(filter);
    promise.done(function (ret) {
        var sub_count=0;
        var sub_amount=0.00;
        var cancel_count=0;
        var old_count=0;
        var success_count=0;
        var success_amount=0.00;
        var ka_fee_num=0.00;
        var remitted_amount=0.00;
        var inspect_fail_amount=0.00;
        var inspect_fail_count=0;
        var bonus_amount=0.00;
        var between_deduction_price=0.00;
        var add_point=0;
        var ded_points=0;
        var deduction_points=0;
        ret.forEach(function(e){
            sub_count+= e.sub_count;
            sub_amount+= e.sub_amount;
            cancel_count+= e.cancel_count;
            old_count+= e.old_count;
            success_count+= e.success_count;
            success_amount+= e.success_amount;
            ka_fee_num+= e.ka_fee_num;
            remitted_amount+= e.remitted_amount;
            inspect_fail_amount+= e.inspect_fail_amount;
            inspect_fail_count+= e.inspect_fail_count;
            bonus_amount+= e.bonus_amount;
            between_deduction_price+=e.between_deduction_price;
            add_point+=e.add_point;
            ded_points+= e.ded_points;
            deduction_points+= e.deduction_points;
        })

        //提交
        $("#orderSubmitCntIdLastWeek").html(sub_count);
        $("#orderSubmitNumIdLastWeek").html(sub_amount);
        $("#orderCancelSubmitNumIdLastWeek").html(cancel_count);
        $("#orderAvgSubmitNumIdLastWeek").html(((sub_amount/sub_count)).toFixed(2));
        $("#orderJunkSubmitNumIdLastWeek").html(old_count);

        //成交
        $("#orderTradeCntIdLastWeek").html(success_count);
        $("#orderTradeNumIdLastWeek").html(success_amount);
        $("#orderAvgTradeNumIdLastWeek").html(((success_amount/success_count)).toFixed(2));

        //运营数据
        $("#venderParentBonusIdLastWeek").html(bonus_amount);
        $("#venderParentKaFeeIdLastWeek").html(ka_fee_num);
        $("#venderParentInspectAmountIdLastWeek").html(inspect_fail_amount);
        $("#venderParentPointIdLastWeek").html(add_point);

        //验货失误情况
        $("#orderInspectAmountIdLastWeek").html(inspect_fail_amount);
        $("#orderInspectCntIdLastWeek").html(inspect_fail_count);
    });
}
function renderChartBasicInfo() {
    var filter = getSelectedFilter();
    var promise = getBussinessOrderSubmitCntRankDataInfo(filter);
    promise.done(function (ret) {
        groupReasonRankChart(ret,'BussinessOrderSubmitCntRankDataInfoChart');
    });

    var promise = getBussinessInspectErrorCntRankDataInfo(filter);
    promise.done(function (ret) {
        groupReasonRankChart(ret,'BussinessInspectErrorCntRankDataInfoChart');
    });

    var promise = getBussinessInspectErrorReasonCntRankDataInfo(filter);
    promise.done(function (ret) {
        groupReasonRankChart(ret,'BussinessInspectErrorReasonCntRankDataInfoChart');
    });

    filter.vender_company_name=filter.vender_parent_name;
    var promise = getVenderPermissionControlOrderLostDayAnalysis(filter);
    promise.done(function (ret) {
        venderPermissionControlOrderLostDayAnalysisChart(ret)
    });

    var promise = getBussinessGroupOrderCntDataInfo(filter);
    promise.done(function (ret) {
        ret.forEach(function(e){
            $("#activeGroupCntId").html(e.liveCnt)
            $("#weekLiveGroupCntId").html(e.weekAliveCnt)
            $("#weekLiveGroupRateId").html(((e.weekAliveCnt/ e.liveCnt)*100).toFixed(2)+"%")
            $("#zeroGroupCntId").html(e.liveCnt-e.zeroCnt)
        })
    });

    //上周数据
    var filter = getLastWeekSelectedFilter();
    var promise = getBussinessGroupOrderCntDataInfo(filter);
    promise.done(function (ret) {
        ret.forEach(function(e){
            $("#weekLiveGroupCntIdLastWeek").html(e.weekAliveCnt)
            $("#weekLiveGroupRateIdLastWeek").html(((e.weekAliveCnt/ e.liveCnt)*100).toFixed(2)+"%")
            $("#zeroGroupCntIdLastWeek").html(e.liveCnt-e.zeroCnt)
        })
    });

}


//折线图
function basicDataStatisticChart(data){

    //data=data.reverse();
    var dateList=[];
    var series={
        avgPrice:[],
        orderSubmitCnt:[],
        orderSubmitNum:[]
    }

    data.forEach(function (e) {
        dateList.push(e.date);
        series.avgPrice.push(((e.sub_amount/e.sub_count)).toFixed(2));
        series.orderSubmitCnt.push(e.sub_count);
        series.orderSubmitNum.push(e.sub_amount);
    });

    var option = {
        title: {
            text: '提交信息',
            //top: '80%',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data: ["平均单价","订单提交金额","订单提交量"],
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
            },
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '平均单价',
                type: 'line',
                label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                data: series.avgPrice
            },{
                name: '订单提交金额',
                type: 'bar',
                yAxisIndex: 1,
                label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                data: series.orderSubmitNum
            },{
                name: '订单提交量',
                type: 'bar',
                label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                data: series.orderSubmitCnt
            }
        ]
    };

    var venderSubmitTrendMixedChart = echarts.init(document.getElementById('submitDataChart'));
    venderSubmitTrendMixedChart.setOption(option);
    window.addEventListener('resize', venderSubmitTrendMixedChart.resize)

}

//横向柱状图
function groupReasonRankChart(data,tableName) {

    if(tableName=="BussinessOrderSubmitCntRankDataInfoChart"){
        var title="订单量排名前5门店"
    }else if(tableName=="BussinessInspectErrorCntRankDataInfoChart"){
        var title="验货失误前5门店（按差异金额计算）"
    }else if(tableName=="BussinessInspectErrorReasonCntRankDataInfoChart"){
        var title="验货失误前5原因"
    }

    var series={
        vender_group_name:[],
        Cnt:[]
    }

    data.forEach(function (e) {
        series.vender_group_name.push(e.vender_group_name);
        series.Cnt.push(e.Cnt);
    });

    var option = {
        title: {
            text: title,
            x: "center",
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
        },
        yAxis: {
            type: 'category',
            data: series.vender_group_name
        },
        series: [
            {
                name: '订单提交量',
                type: 'bar',
                label: {normal: {show: true, position: 'right', formatter: '{c}'}},
                data: series.Cnt
            }
        ]
    }

    var venderSubmitTrendMixedChart = echarts.init(document.getElementById(tableName));
    venderSubmitTrendMixedChart.setOption(option);
    window.addEventListener('resize', venderSubmitTrendMixedChart.resize)
}

//雷达图
function venderPermissionControlOrderLostDayAnalysisChart(data) {

    var inqueryCnt=0;
    var submitCnt=0;
    var inqueryNum=0;
    var submitNum=0;

    data.forEach(function (e) {
        inqueryCnt+= eval(e.inqueryCnt);
        submitCnt+= eval(e.submitCnt);
        inqueryNum+= eval(e.inqueryNum);
        submitNum+= eval(e.submitNum);
    });

    var optionCnt = {
        title: {
            text: "煮熟的鸭子飞了",
            x: "left",
        },
        tooltip: {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        angleAxis: {
        },
        radiusAxis: {
            type: 'category',
            //data: [],
            z: 10
        },
        polar: {
        },
        series: [{
            type: 'bar',
            data: [submitCnt, 0],
            coordinateSystem: 'polar',
            name: '下单量',
            stack: 'a'
        }, {
            type: 'bar',
            data: [0, inqueryCnt],
            coordinateSystem: 'polar',
            name: '询价量',
            stack: 'a'
        }],
        legend: {
            show: true,
            data: ['下单量', '询价量'],
            right:'right'
        }
    }

    var venderSubmitTrendMixedChart = echarts.init(document.getElementById('PermissionControlOrderLostDayAnalysisCntChart'));
    venderSubmitTrendMixedChart.setOption(optionCnt);
    window.addEventListener('resize', venderSubmitTrendMixedChart.resize)

    var optionNum = {
        angleAxis: {
        },
        radiusAxis: {
            type: 'category',
            //data: ['周一', '周二', '周三', '周四'],
            z: 10
        },
        polar: {
        },
        series: [{
            type: 'bar',
            data: [submitNum, 0],
            coordinateSystem: 'polar',
            name: '下单金额',
            stack: 'a'
        }, {
            type: 'bar',
            data: [0, inqueryNum],
            coordinateSystem: 'polar',
            name: '询价金额',
            stack: 'a'
        }],
        legend: {
            show: true,
            data: ['下单金额', '询价金额'],
            right:'right'
        }
    }

    var venderSubmitTrendMixedChart = echarts.init(document.getElementById('PermissionControlOrderLostDayAnalysisNumChart'));
    venderSubmitTrendMixedChart.setOption(optionNum);
    window.addEventListener('resize', venderSubmitTrendMixedChart.resize)
}

function getBussinessWeekDataInfo(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    requestURL(dataService + "/Vender/getBussinessWeekDataInfo", query).done(function (ret) {
        dfd.resolve(ret)
    });
    return dfd.promise()
}

function getBussinessOrderSubmitCntRankDataInfo(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getBussinessOrderSubmitCntRankDataInfo", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}

function getBussinessInspectErrorCntRankDataInfo(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getBussinessInspectErrorCntRankDataInfo", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}

function getBussinessInspectErrorReasonCntRankDataInfo(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getBussinessInspectErrorReasonCntRankDataInfo", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}

//煮熟的鸭子飞了
function getVenderPermissionControlOrderLostDayAnalysis(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    requestURL(dataService + "/Vender/getVenderPermissionControlOrderLostDayAnalysis", query).done(function (ret) {
        dfd.resolve(ret)
    });

    return dfd.promise()
}

//门店活跃度
function getBussinessGroupOrderCntDataInfo(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    requestURL(dataService + "/Vender/getBussinessGroupOrderCntDataInfo", query).done(function (ret) {
        dfd.resolve(ret)
    });

    return dfd.promise()
}
