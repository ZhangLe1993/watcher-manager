Array.prototype.unique = function () {
    var o = {};
    var i = 0;
    var l = this.length;
    var r = [];
    for(i=0;i<l;i++){
        o[this[i]] = this[i];
    }
    for (i in o){
        r.push(o[i]);
    }
    return r;
};

Template.marketingTrafficNewChannelUserFlagRecycleType.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#MarketingTab').addClass('active');
    $('#marketingTrafficNewChannelUserFlagRecycleType').addClass('active');
    var ua=navigator.userAgent.toLowerCase(); 
    var isAndroid=ua.indexOf("android")>-1
    var isIOS=ua.indexOf("iphone")>-1
    var mobile=false;
    if(isAndroid||isIOS){
        $(".sidebar-toggle").click();
        mobile=true;
    }
    $(".search").attr("disabled",true);

    var dateGap = -14;
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

    //$(".endDateSelectLabel").html(endDate);
    $(".startDateSelectLabel").html(startDate+"~"+endDate);
    $('.marketingStartDatePicker').daterangepicker(datePickerOptionsFunc(startDate,endDate,minDate,false), pickStartDateRangeCallback);
    $(".startWeekDateSelectLabel").html(startWeekDate+"~"+endWeekDate);
    $('.marketingWeeklyStartDatePicker').daterangepicker(weekDatePickerOptionsFunc(startWeekDate,endWeekDate,minWeekDate,false), pickStartWeekDateRangeCallback);
    $(".startMonthDateSelectLabel").html(startMonthDate+"~"+endMonthDate);
    $('.marketingMonthlyStartDatePicker').daterangepicker(monthDatePickerOptionsFunc(startMonthDate,endMonthDate,minMonthDate,false), pickStartMonthDateRangeCallback);


    //load filter options
    renderFilterOptions();

    renderPage({"startDate":startDate,"endDate":endDate});

    getUVChartsData({"startDate":startDate,"endDate":endDate});

    
    $(".search").click(function(){
        var dateType =$(document).find(".dateType").val();
        var filter = getSelectedFilter(dateType,mobile);
        $(this).attr("disabled",true);
        renderPage(filter);
        if(dateType=="daily") {
            getUVChartsData(filter)
        }
    });

     $("#datatype").on('change',function () {
        var dateType =$(document).find(".dateType").val();
        var filter = getSelectedFilter(dateType,mobile);
        getUVChartsData(filter);
    })

    $(".dateType").on('change',function(){
        var dateType =$(this).val();
        var filter = getSelectedFilter(dateType,mobile);
        renderPage(filter);
        if(dateType=="daily") {
            getUVChartsData(filter);
        }
    });


}

//load外的函数群

function getSelectedFilter(dateType,Mobile){
    var endDate = "";
    var startDate = "";
    var dt = "";
    if(dateType=="daily"){
        $(".daily").show();
        $(".weekly").hide();
        $(".monthly").hide();
        dt = $(".startDateSelectLabel").text().replace(/ /g,"").split("~");
        startDate = dt[0];
        endDate = dt[1];
        //var dateGap = -15;
        //endDate = new Date().getNewDate(-1);
        //startDate = new Date(endDate).getNewDate(dateGap);
        //$(".endDateSelectLabel").html(endDate);
        //$(".startDateSelectLabel").html(startDate);
    }else if(dateType=="weekly"){
        $(".daily").hide();
        $(".monthly").hide();
        $(".weekly").show();
        dt = $('.startWeekDateSelectLabel').text().replace(/ /g,"").split("~");
        startDate = dt[0];
        endDate = dt[1];
        //startDate = moment().weekday(-70).format("YYYY-MM-DD");
        // endDate = moment().weekday(-7).format("YYYY-MM-DD");
        // $(".endWeekDateSelectLabel").html(endDate);
        // $(".startWeekDateSelectLabel").html(startDate);
    }else if(dateType=="monthly"){
        $(".daily").hide();
        $(".monthly").show();
        $(".weekly").hide();
        dt = $('.startMonthDateSelectLabel').text().replace(/ /g,"").split("~");
        startDate = dt[0];
        endDate = dt[1];
        //endDate = moment().subtract(1,"month").startOf('month').format("YYYY-MM-DD");
        // startDate = moment().subtract(10,"month").startOf('month').format("YYYY-MM-DD");
        // $(".endMonthDateSelectLabel").html(endDate);
        // $(".startMonthDateSelectLabel").html(startDate);
    }
    var filter = {};

        var channelFirst = $(document).find(".channelFirst").val();
        var channelSecond = $(document).find(".channelSecond").val();
        var channelThird = $(document).find(".channelThird").val();

        var userFlag = $(document).find(".userFlag").val();

        //var recycleType = $(document).find(".recycleType").val();

        var cityName = $(document).find(".city").val();
        //if(cityName!=null){
        //    cityName=cityName.join(";");
        //}
        var platform = $(document).find(".platform").val();
        var areaName = $(document).find(".areaName").val();
        var source = $(document).find(".source").val();
        //if(source!=null){
        //    source=source.join(";");
        //}
        var medium = $(document).find(".medium").val();
        medium=medium==""?null:medium.split(",");
        var campaign = $(document).find(".campaign").val();
        campaign=campaign==""?null:campaign.split(",")
        //if(campaign!=null){
        //    campaign=campaign.join(",")
        //}
        filter = {
            "dateType": dateType,
            "startDate": startDate,
            "endDate": endDate,
            "channelFirst": channelFirst,
            "channelSecond": channelSecond,
            "channelThird": channelThird,
            "cityName": cityName,
            "platform": platform,
            "userFlag": userFlag,
/*           "recycleType": recycleType,*/
            "areaName": areaName,
            "source": source,
            "medium": medium,
            "campaign": campaign
        };

    return cleanParams(filter);// todo modify
}



function cleanParams(filter){
    //clean parameters
    var query = _.clone(filter);
    for(var key in query){
        if(!query[key]&&key!="offset"){
            delete query[key]
        }
    }
    return query
}


function renderPage(filter){
    //var dateGap = -15;
    $("#chartContent").hide();
    $("#loading").show();
    //console.log(filter)
    var promise = getAggregateWebTrafficData(filter);
    promise.done(function(ret){
        $("#chartContent").show();
        $("#loading").hide();
        $(".search").attr("disabled",false);
        var obj = getCalcDataByDate(ret);
        var retObj = {
            "uv":[],
            "inquiry_uv":[],
            "inquiry_success_uv":[],
            "trade_uv":[],
            "trade_success_uv":[],
            "select_machine_uv":[],
            "inquiry_uv_rate":[],
            "inquiry_success_uv_rate":[],
            "trade_uv_rate":[],
            "trade_success_uv_rate":[],
            "total_rate":[]
        };
        var dateType='daily';
        if(obj.series.uv.length>0){
            retObj.uv = obj.series.uv[obj.series.uv.length-1]
        }
        if(obj.series.inquiry_uv.length>0){
            retObj.inquiry_uv = obj.series.inquiry_uv[obj.series.inquiry_uv.length-1]
        }
        if(obj.series.inquiry_success_uv.length>0){
            retObj.inquiry_success_uv = obj.series.inquiry_success_uv[obj.series.inquiry_success_uv.length-1]
        }
        if(obj.series.trade_uv.length>0){
            retObj.trade_uv = obj.series.trade_uv[obj.series.trade_uv.length-1]
        }
        if(obj.series.trade_success_uv.length>0){
            retObj.trade_success_uv = obj.series.trade_success_uv[obj.series.trade_success_uv.length-1]
        }
        if(obj.series.select_machine_uv.length>0){
            retObj.select_machine_uv = obj.series.select_machine_uv[obj.series.select_machine_uv.length-1]
        }
        if(obj.series.inquiry_uv_rate.length>0){
            retObj.inquiry_uv_rate = obj.series.inquiry_uv_rate[obj.series.inquiry_uv_rate.length-1]
        }
        if(obj.series.inquiry_success_uv_rate.length>0){
            retObj.inquiry_success_uv_rate = obj.series.inquiry_success_uv_rate[obj.series.inquiry_success_uv_rate.length-1]
        }
        if(obj.series.trade_uv_rate.length>0){
            retObj.trade_uv_rate = obj.series.trade_uv_rate[obj.series.trade_uv_rate.length-1]
        }
        if(obj.series.trade_success_uv_rate.length>0){
            retObj.trade_success_uv_rate = obj.series.trade_success_uv_rate[obj.series.trade_success_uv_rate.length-1]
        }
        if(obj.series.total_rate.length>0){
            retObj.total_rate = obj.series.total_rate[obj.series.total_rate.length-1]
        }
        var lastDate = "";
        if(obj.dateList.length>0){
            lastDate = obj.dateList[obj.dateList.length-1]
        }
        if(filter.dateType != undefined){
            dateType=filter.dateType;
        }
        //渲染市场流量图
        //console.log(lastDate);
        drawDailyTrafficFunnelChart(lastDate,retObj);

        //渲染折线图堆叠
        drawDailyTrafficStackChart(obj);

        //渲染市场流量趋势图
        drawDailyMarketingUVTrend(obj);
        //renderTable
        //渲染表格
        renderTable(filter,obj);
        //渲染UV折线图
        getUVChartsData(filter);

    });

}
var dataService = Meteor.settings.public.dataService.baseUrl;
function getUVChartsData(filter){
    var query = _.clone(filter);
    //requestURLPost(dataService+'/webTraffic/getMarketingAggregateTraffic',query).done(function (data) {
    //    renderUVCharts(data);
    //})
    /*requestURLPost(dataService+"/webTraffic/getMarketingAggregateTraffic_newchannel",query).done(function(ret){
        renderUVCharts(ret)
    });*/
    requestURLPost(dataService+"/webTraffic/getMarketingAggregateTraffic_newchannel_userflag_recycletype",query).done(function(ret){
        //console.log("新市场流量漏斗--测试");
        //console.log(ret);
        //console.log("新市场流量漏斗--测试");
        renderUVCharts(ret)
    });
}


function getAggregateWebTrafficData(filter){
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if(flag=="daily" || !flag) {
        requestURLPost(dataService+"/webTraffic/getDailyAggregateMarketingWebTrafficData_newchannel_userflag_recycletype",query).done(function(ret){
            dfd.resolve(ret)
        });
    }else if(flag=="weekly") {
        requestURLPost(dataService+"/webTraffic/getWeeklyAggregateMarketingWebTrafficData_newchannel_userflag_recycletype",query).done(function(ret){
            dfd.resolve(ret)
        });
    }else if(flag=="monthly") {
        requestURLPost(dataService+"/webTraffic/getMonthlyAggregateMarketingWebTrafficData_newchannel_userflag_recycletype",query).done(function(ret){
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}

//根据日期获取总的数据
function  getCalcDataByDate(data) {
    var dataDict = _.groupBy(data,function(obj){return obj.date});
    var total = {};
    var dateList =[];
    var series = {
        uv:[],
        inquiry_uv:[],
        inquiry_success_uv:[],
        trade_uv:[],
        trade_success_uv:[],
        select_machine_uv:[],
        trade_cnt_num:[],
        trade_success_cnt_num:[],
        trade_success_amount_num:[],
        inquiry_uv_rate:[],
        inquiry_success_uv_rate:[],
        trade_uv_rate:[],
        trade_success_uv_rate:[],
        total_rate:[],
        per_amount_num:[],//客单价
        trade_tranfers_rate:[]
    };
    for(var key in dataDict){
        dateList.push(key);
        var obj = getCalcData(dataDict[key]);
        series.uv.push(obj.uv);
        series.inquiry_uv.push(obj.inquiry_uv);
        series.inquiry_success_uv.push(obj.inquiry_success_uv);
        series.trade_uv.push(obj.trade_uv);
        series.trade_success_uv.push(obj.trade_success_uv);
        series.select_machine_uv.push(obj.select_machine_uv);
        series.trade_cnt_num.push(obj.trade_cnt_num);
        series.trade_success_cnt_num.push(obj.trade_success_cnt_num);
        series.trade_success_amount_num.push(obj.trade_success_amount_num);
        series.inquiry_uv_rate.push(obj.inquiry_uv_rate);
        series.inquiry_success_uv_rate.push(obj.inquiry_success_uv_rate);
        series.trade_uv_rate.push(obj.trade_uv_rate);
        series.trade_success_uv_rate.push(obj.trade_success_uv_rate);
        series.total_rate.push(obj.total_rate);
        series.per_amount_num.push(obj.per_amount_num);
        series.trade_tranfers_rate.push(obj.trade_tranfers_rate);
    }

    total.uv = series.uv.sum();
    total.inquiry_uv = series.inquiry_uv.sum();
    total.inquiry_success_uv = series.inquiry_success_uv.sum();
    total.trade_uv = series.trade_uv.sum();
    total.trade_success_uv = series.trade_success_uv.sum();
    total.select_machine_uv = series.select_machine_uv.sum();
    total.trade_cnt_num = series.trade_cnt_num.sum();
    total.trade_success_cnt_num = series.trade_success_cnt_num.sum();
    total.trade_success_amount_num = series.trade_success_amount_num.sum();
    return {"dateList":dateList,"series":series,"total":total}
}
//获取总的计算数据
function getCalcData(data){
    var uv= 0;
    var inquiry_uv =0;
    var inquiry_success_uv =0;
    var trade_uv =0;
    var trade_success_uv = 0;
    var select_machine_uv = 0;
    var trade_cnt_num = 0;
    var trade_success_cnt_num = 0;
    var trade_success_amount_num = 0;
    data.forEach(function (e) {
        uv += e.uv;
        inquiry_uv += e.inquiry_uv;
        inquiry_success_uv += e.inquiry_success_uv;
        trade_uv += e.trade_uv;
        trade_success_uv += e.trade_success_uv;
        select_machine_uv += e.select_machine_uv;
        trade_cnt_num += e.trade_cnt_num;
        trade_success_cnt_num += e.trade_success_cnt_num;
        trade_success_amount_num += e.trade_success_amount_num;
    });
    var inquiry_uv_date = ((inquiry_uv/uv)*100).toFixed(2);//询价转换率
    var inquiry_success_uv_rate = ((inquiry_success_uv/uv)*100).toFixed(2);//询价完成转化率
    var trade_tranfers_rate = ((trade_uv/uv)*100).toFixed(2);//提交转换率率
    var trade_uv_rate = ((trade_uv/inquiry_success_uv)*100).toFixed(2);//询价完成提交率
    var trade_success_uv_rate = ((trade_success_uv/trade_uv)*100).toFixed(2);//提交成交率
    var total_rate = ((trade_success_uv/uv)*100).toFixed(3);//成交转换率
    var per_amount_num = ((trade_success_amount_num/trade_success_cnt_num)).toFixed(2);
    return {"trade_tranfers_rate":trade_tranfers_rate,"per_amount_num":per_amount_num,"trade_uv_rate":trade_uv_rate,"trade_success_uv_rate":trade_success_uv_rate,"total_rate":total_rate,"inquiry_uv_rate":inquiry_uv_date,"inquiry_success_uv_rate":inquiry_success_uv_rate,"uv":uv,"inquiry_uv":inquiry_uv,"inquiry_success_uv":inquiry_success_uv,"trade_uv":trade_uv,"trade_success_uv":trade_success_uv,"select_machine_uv":select_machine_uv,"trade_cnt_num":trade_cnt_num,"trade_success_cnt_num":trade_success_cnt_num,"trade_success_amount_num":trade_success_amount_num}
}

/**
 *  日期options的回调函数。
 * @param start
 * @param end
 * @param label
 */
function pickStartDateRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.startDateSelectLabel').html(sdt+"~"+edt);
}

function pickStartWeekDateRangeCallback(start, end, label) {
    console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.startWeekDateSelectLabel').html(sdt+"~"+edt);
}

function pickStartMonthDateRangeCallback(start, end, label) {
    console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.startMonthDateSelectLabel').html(sdt+"~"+edt);
}

function renderFilterOptions(){
    var promise = getFilterOptions();
    promise.done(function(data){

        $(".city").attr("multiple","multiple");
        $(".platform").attr("multiple","multiple");
        $(".channelFirst").attr("multiple","multiple");
        $(".channelSecond").attr("multiple","multiple");
        $(".channelThird").attr("multiple","multiple");
        $(".source").attr("multiple","multiple");

        $(".areaName").attr("multiple","multiple");

        $(".userFlag").attr("multiple","multiple");
        //$(".recycleType").attr("multiple","multiple");
        //请选择城市选择框   数据赋值
        renderOptions(".city",data.cityName);

        //请选择用户类型选择框   数据赋值
        renderOptions(".userFlag",data.userFlag);

        //请选择回收类型选择框   数据赋值
        //renderOptions(".recycleType",data.recycleType);

        //请选择平台选择框   数据赋值
        renderOptions(".platform",data.platform);

        //请选择渠道选择框     数据赋值
        renderOptions(".channelFirst",data.channelFirst);

        //请选择分渠道选择框    数据赋值
        renderOptions(".channelSecond",data.channelSecond);

        //请选择细分支渠道选择框   数据赋值
        renderOptions(".channelThird",data.channelThird);

        //请选择source选择框   数据赋值
        renderOptions(".source",data.source);

        //请选择 区域选择框 数据赋值
        renderOptions(".areaName",["物流","华北大区","华东大区","华南大区","华西大区","华中大区"]);

        $(".areaName").multipleSelect({
            placeholder: "全部",
            selectAllText:"全部",
            width: 150,
            selectAll: false
        });

        $(".city").multipleSelect({
            placeholder: "全部",
            selectAllText:"全选",
            width: 150,
            selectAll: true,
            filter: true
        });

        $(".userFlag").multipleSelect({
            placeholder: "全部",
            selectAllText:"全部",
            width: 150,
            selectAll: false
        });

        /*$(".recycleType").multipleSelect({
            placeholder: "全部",
            selectAllText:"全选",
            width: 150,
            selectAll: true,
            filter: true
        });*/

        $(".platform").multipleSelect({
            placeholder: "全部",
            selectAllText:"全部",
            width: 150,
            selectAll: true,
            filter:true
        });
        $(".channelFirst").multipleSelect({
            placeholder: "全部",
            selectAllText:"全部",
            width: 150,
            selectAll: true,
            filter:true
        });
        $(".channelSecond").multipleSelect({
            placeholder: "全部",
            selectAllText:"全部",
            width: 150,
            selectAll: true,
            filter:true
        });
        $(".channelThird").multipleSelect({
            placeholder: "全部",
            selectAllText:"全部",
            width: 150,
            selectAll: true,
            filter:true
        });
        $(".source").multipleSelect({
            placeholder: "全部",
            selectAllText:"全选",
            width: 150,
            selectAll: true,
            filter: true
        });

        $(".search").attr("disabled",false);
    })
}

function renderOptions(sel,data){
    $(sel).empty();
    data.forEach(function(ele){
        $(sel).append("<option value='"+ele+"'>"+ele+"</option>")
    });
}
function getFilterOptions(){
    var dfd = $.Deferred();
    requestURL(dataService+"/webTraffic/getMarketingFilterOptions_newchannel_userflag_recycletype",{}).done(function(ret){
        dfd.resolve(ret)
    });
    return dfd.promise()
}

function drawDailyTrafficFunnelChart(date,obj) {

    var dateType =$(".dateType").val(),date2;
    if(dateType=="daily"){
        date2=date;
    }else if(dateType=="weekly"){
        date2=date+"~"+(new Date(date).getNewDate(7));
    }else if(dateType=="monthly"){
        date2=date+"~"+(new moment(date).endOf('month').format('YYYY-MM-DD'));
    }
    var yAxis = ['总访客数',
        obj.inquiry_uv_rate +
        '%\n询价访客数',
        obj.inquiry_success_uv_rate +
        '%\n询价完成访客数',
        obj.trade_uv_rate +
        '%\n提交访客数',
        obj.trade_success_uv_rate + '%\n成交用户数'
           ].reverse();

    var option = {
        title: {
            text: '市场流量('+date2+")",
            x: "center",
            //y: "bottom"
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            show: false,
            left: '3%',
            right: '4%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'value', show: false
            }
        ],
        yAxis: [
            {
                type: 'category',
                data: yAxis,
                splitLine: {
                    show: true
                }
            }
        ],
        series: [
            {
                name: '市场',
                type: 'bar',
                itemStyle: {normal: {color: '#568FC8', label: {show: true, position: 'right', color: '#568FC8'}}},
                data: [obj.uv,obj.inquiry_uv,obj.inquiry_success_uv,obj.trade_uv,obj.trade_success_uv].reverse()
            }
        ]
    };
    var dailyTrafficFunnelChart = echarts.init(document.getElementById('dailyTrafficFunnelChart'));
    dailyTrafficFunnelChart.setOption(option);
    window.addEventListener('resize',dailyTrafficFunnelChart.resize)
}


function drawDailyMarketingUVTrend(obj){

    var option2 = {
        title: {
            text: '市场流量趋势图',
            x: "center",
            padding:[0,0,0,50]
            //y: "bottom"
        },
        tooltip: {
            trigger: 'axis',
            formatter:function(params,ticket,callback){
                var str = params[0].name + '<br/>';
                params.forEach(function(obj){
                    if(obj.seriesName.indexOf("金额")>-1){
                        str += obj.seriesName + ' : ' + (obj.value*1000).toFixed(0) + '<br/>'
                    }else if(obj.seriesName=="总访客数"){
                        str += obj.seriesName + ' : ' + (obj.value*10).toFixed(0) + '<br/>'
                    }else if(obj.seriesName.indexOf("率")>-1){
                        str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                    }else{
                        str += obj.seriesName + ' : ' + obj.value + '<br/>'
                    }
                });
                return str;
            }
        },
        legend: {
            data:['提交转化率','客单价',"成交金额bar","成交金额line","订单提交量","总访客数"],
            padding: [25,0,0,0],
            selected:{
                "成交金额line":false,
                "提交转化率":false,
                "客单价":false
            },
            selectMode:'multiple',
            tooltip: {
                show: true
            }
        },
        xAxis: [
            {
                type: 'category',
                data: obj.dateList
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel:{
                    formatter: '{value} %'
                }
            },
            {
                type: 'value',
                axisLabel:{
                    show:false
                }
            }
        ],
        series: [
            {
                name: '提交转化率',
                type: 'line',
                yAxisIndex: 0,
                data: obj.series.trade_tranfers_rate
            },
            {
                name: '客单价',
                type: 'line',
                yAxisIndex: 1,
                data: obj.series.per_amount_num
            },
            {
                name: '成交金额bar',
                type: 'bar',
                yAxisIndex: 1,
                itemStyle: {normal: {color: '#568FC8',barWidth:30, label: {show: true,position:'top', formatter: function(obj){
                    return (obj.data*1000).toFixed(0)
                }}}},
                data: _.map(obj.series.trade_success_amount_num, function(num){ return num / 1000; })
            },
            {
                name: '成交金额line',
                type: 'line',
                yAxisIndex: 1,
                data: _.map(obj.series.trade_success_amount_num, function(num){ return num / 1000; })
            },
            {
                name: '订单提交量',
                type: 'bar',
                yAxisIndex: 1,
                itemStyle: {normal: {barWidth:30, label: {show: true ,position:'top'}}},
                data: obj.series.trade_cnt_num
            },
            {
                name: '总访客数',
                type: 'line',
                yAxisIndex: 1,
                data: _.map(obj.series.uv, function(num){ return num / 10; })
            },
        ]
    };


    var dailyMarketingUVTrend2 = echarts.init(document.getElementById('dailyMarketingUVTrend2'));
    dailyMarketingUVTrend2.setOption(option2);
    window.addEventListener('resize',dailyMarketingUVTrend2.resize)

}


function drawDailyTrafficStackChart(obj){

    var option = {
        title: {
            text: '折线图堆叠',
            x:"center",
            padding:[0,0,0,50]
            //y:"bottom"
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
            data:['总访客数','询价访客数','询价完成访客数','提交访客数','成交用户数','品牌选择页访客数','询价转化率','询价完成转化率',"提交询价完成率","提交转化率","成交提交率","成交转化率"],
            padding: [25,0,0,0]
        },
        grid: {
            left: '3%',
            right: '4%',
            containLabel: true
        },
        toolbox: {
            feature: {
                /*saveAsImage: {}*/
            }
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: obj.dateList
        },
        yAxis: [
            {
                type: 'value'
            },
            {
                type: 'value',
                axisLabel: {
                    formatter: function (value, index) {
                        if (value == 0) {
                            return value
                        }
                        return value+"%"
                    }
                }
            }
        ],
        series: [
            {
                name:'总访客数',
                type:'line',
                //stack: '总量',
                data:obj.series.uv
            },
            {
                name:'询价访客数',
                type:'line',
                // stack: '总量',
                data:obj.series.inquiry_uv
            },
            {
                name:'询价完成访客数',
                type:'line',
                // stack: '总量',
                data:obj.series.inquiry_success_uv
            },
            {
                name:'提交访客数',
                type:'line',
                //stack: '总量',
                data:obj.series.trade_uv
            },
            {
                name:'成交用户数',
                type:'line',
                //stack: '总量',
                data:obj.series.trade_success_uv
            },
            {
                name:'品牌选择页访客数',
                type:'line',
                //stack: '总量',
                data:obj.series.select_machine_uv
            },
            {
                name:'询价转化率',
                type:'line',
                yAxisIndex: 1,
                // stack: '总量',
                data:obj.series.inquiry_uv_rate
            },
            {
                name:'询价完成转化率',
                type:'line',
                yAxisIndex: 1,
                // stack: '总量',
                data:obj.series.inquiry_success_uv_rate
            },
            {
                name:'提交询价完成率',
                type:'line',
                yAxisIndex: 1,
                // stack: '总量',
                data:obj.series.trade_uv_rate
            },
            {
                name:'成交提交率',
                type:'line',
                yAxisIndex: 1,
                // stack: '总量',
                data:obj.series.trade_success_uv_rate
            },
            {
                name:'提交转化率',
                type:'line',
                yAxisIndex: 1,
                // stack: '总量',
                data:obj.series.trade_tranfers_rate
            },
            {
                name:'成交转化率',
                type:'line',
                yAxisIndex: 1,
                // stack: '总量',
                data:obj.series.total_rate
            }
        ]
    };
    var dailyTrafficStackChart = echarts.init(document.getElementById('dailyTrafficStackChart'));
    dailyTrafficStackChart.setOption(option);
    window.addEventListener('resize',dailyTrafficStackChart.resize);

}


function renderUVCharts(data){
    //console.log(data);
    var datatype = $("#datatype").val();
    var uv = {
        'date':[],
        'APP':[],
        'SEM':[],
        '小程序':[],
        'APP内页':[],
        '合作':[],
        '其他渠道':[],
        '直接访问':[],
        '召回':[],
        '小程序内页':[],
        '新渠道':[],
        'SEO':[],
        '微信公众号':[],
        '老带新':[],
        '线下门店':[]
    };
    var dayflag = false;
    var Queried = [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];

    //APP
    var APPSeries={
        'date':[],
        'uv':[]
    };
    //SEM
    var SEMSeries={
        'date':[],
        'uv':[]
    };
    //小程序
    var SmartProgramSeries={
        'date':[],
        'uv':[]
    };
    //APP内页
    var APPInnerHtmlSeries={
        'date':[],
        'uv':[]
    };
    //合作
    var TeamSeries={
        'date':[],
        'uv':[]
    };
    //其他渠道
    var OtherSeries = {
        'date':[],
        'uv':[]
    };
    //直接访问	direct
    var DirectSeries = {
        'date':[],
        'uv':[]
    };
    //召回
    var RecallSeries = {
        'date':[],
        'uv':[]
    };
    //小程序内页
    var SmartInnerHtmlSeries = {
        'date':[],
        'uv':[]
    };
    //新渠道
    var NewChannelSeries = {
        'date':[],
        'uv':[]
    };
    //SEO
    var SEOSeries = {
        'date':[],
        'uv':[]
    };
    //微信公众号
    var WeixinPublicSeries = {
        'date':[],
        'uv':[]
    };
    //老带新
    var OldToNewSeries = {
        'date':[],
        'uv':[]
    };
    //线下门店
    var StoreSeries = {
        'date':[],
        'uv':[]
    };
    var date = [];
    var cnt = 0;
    //console.log(data);
    data.forEach(function (e) {
        date.push(e.date);
        if(cnt != 0){
            if(date[cnt] != date[cnt-1]){
                dayflag = true;
            }
        }
        cnt ++;
        if(dayflag == false) {
            switch (e.channel) {
                case 'APP':
                    switch (datatype) {
                        case 'uv':
                            uv.APP.push(e.uv);
                            APPSeries.uv.push(e.uv);
                            APPSeries.date.push(e.date);
                            Queried[1]=1;
                            break;
                        case 'inquiry_uv':
                            uv.APP.push(e.inquiry_uv);
                            APPSeries.uv.push(e.inquiry_uv);
                            APPSeries.date.push(e.date);
                            Queried[1]=1;
                            break;
                        case 'inquiry_success_uv':
                            uv.APP.push(e.inquiry_success_uv);
                            APPSeries.uv.push(e.inquiry_success_uv);
                            APPSeries.date.push(e.date);
                            Queried[1]=1;
                            break;
                        case 'submit_success_uv':
                            uv.APP.push(e.submit_success_uv);
                            APPSeries.uv.push(e.submit_success_uv);
                            APPSeries.date.push(e.date);
                            Queried[1]=1;
                            break;
                        case 'trade_success_uv':
                            uv.APP.push(e.trade_success_uv);
                            APPSeries.uv.push(e.trade_success_uv);
                            APPSeries.date.push(e.date);
                            Queried[1]=1;
                            break;
                        case 'select_machine_uv':
                            uv.APP.push(e.select_machine_uv);
                            APPSeries.uv.push(e.select_machine_uv);
                            APPSeries.date.push(e.date);
                            Queried[1]=1;
                            break;
                        case 'inquiry_uv_rate':
                            uv.APP.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            APPSeries.uv.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            APPSeries.date.push(e.date);
                            Queried[1]=1;
                            break;
                        case 'inquiry_success_uv_rate':
                            uv.APP.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            APPSeries.uv.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            APPSeries.date.push(e.date);
                            Queried[1]=1;
                            break;
                        case 'submit_inquiry_rate':
                            uv.APP.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            APPSeries.uv.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            APPSeries.date.push(e.date);
                            Queried[1]=1;
                            break;
                        case 'submit_uv_rate':
                            uv.APP.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            APPSeries.uv.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            APPSeries.date.push(e.date);
                            Queried[1]=1;
                            break;
                        case 'submit_success_cnt':
                            uv.APP.push(e.submit_success_cnt);
                            APPSeries.uv.push(e.submit_success_cnt);
                            APPSeries.date.push(e.date);
                            Queried[1]=1;
                            break;
                        case 'trade_success_cnt':
                            uv.APP.push(e.trade_success_cnt);
                            APPSeries.uv.push(e.trade_success_cnt);
                            APPSeries.date.push(e.date);
                            Queried[1]=1;
                            break;
                        case 'trade_submit_rate':
                            uv.APP.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            APPSeries.uv.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            APPSeries.date.push(e.date);
                            Queried[1]=1;
                            break;
                        case 'trade_num':
                            uv.APP.push(e.trade_num);
                            APPSeries.uv.push(e.trade_num);
                            APPSeries.date.push(e.date);
                            Queried[1]=1;
                            break;
                        case 'per_trade_num':
                            uv.APP.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            APPSeries.uv.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            APPSeries.date.push(e.date);
                            Queried[1]=1;
                            break;
                    }
                    break;
                case 'SEM':
                    switch (datatype) {
                        case 'uv':
                            uv.SEM.push(e.uv);
                            SEMSeries.uv.push(e.uv);
                            SEMSeries.date.push(e.date);
                            Queried[2]=1;
                            break;
                        case 'inquiry_uv':
                            uv.SEM.push(e.inquiry_uv);
                            SEMSeries.uv.push(e.inquiry_uv);
                            SEMSeries.date.push(e.date);
                            Queried[2]=1;
                            break;
                        case 'inquiry_success_uv':
                            uv.SEM.push(e.inquiry_success_uv);
                            SEMSeries.uv.push(e.inquiry_success_uv);
                            SEMSeries.date.push(e.date);
                            Queried[2]=1;
                            break;
                        case 'submit_success_uv':
                            uv.SEM.push(e.submit_success_uv);
                            SEMSeries.uv.push(e.submit_success_uv);
                            SEMSeries.date.push(e.date);
                            Queried[2]=1;
                            break;
                        case 'trade_success_uv':
                            uv.SEM.push(e.trade_success_uv);
                            SEMSeries.uv.push(e.trade_success_uv);
                            SEMSeries.date.push(e.date);
                            Queried[2]=1;
                            break;
                        case 'select_machine_uv':
                            uv.SEM.push(e.select_machine_uv);
                            SEMSeries.uv.push(e.select_machine_uv);
                            SEMSeries.date.push(e.date);
                            Queried[2]=1;
                            break;
                        case 'inquiry_uv_rate':
                            uv.SEM.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            SEMSeries.uv.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            SEMSeries.date.push(e.date);
                            Queried[2]=1;
                            break;
                        case 'inquiry_success_uv_rate':
                            uv.SEM.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            SEMSeries.uv.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            SEMSeries.date.push(e.date);
                            Queried[2]=1;
                            break;
                        case 'submit_inquiry_rate':
                            uv.SEM.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            SEMSeries.uv.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            SEMSeries.date.push(e.date);
                            Queried[2]=1;
                            break;
                        case 'submit_uv_rate':
                            uv.SEM.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            SEMSeries.uv.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            SEMSeries.date.push(e.date);
                            Queried[2]=1;
                            break;
                        case 'submit_success_cnt':
                            uv.SEM.push(e.submit_success_cnt);
                            SEMSeries.uv.push(e.submit_success_cnt);
                            SEMSeries.date.push(e.date);
                            Queried[2]=1;
                            break;
                        case 'trade_success_cnt':
                            uv.SEM.push(e.trade_success_cnt);
                            SEMSeries.uv.push(e.trade_success_cnt);
                            SEMSeries.date.push(e.date);
                            Queried[2]=1;
                            break;
                        case 'trade_submit_rate':
                            uv.SEM.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            SEMSeries.uv.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            SEMSeries.date.push(e.date);
                            Queried[2]=1;
                            break;
                        case 'trade_num':
                            uv.SEM.push(e.trade_num);
                            SEMSeries.uv.push(e.trade_num);
                            SEMSeries.date.push(e.date);
                            Queried[2]=1;
                            break;
                        case 'per_trade_num':
                            uv.SEM.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            SEMSeries.uv.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            SEMSeries.date.push(e.date);
                            Queried[2]=1;
                            break;
                    }
                    break;
                case '小程序':
                    switch (datatype) {
                        case 'uv':
                            uv.小程序.push(e.uv);
                            SmartProgramSeries.uv.push(e.uv);
                            SmartProgramSeries.date.push(e.date);
                            Queried[3]=1;
                            break;
                        case 'inquiry_uv':
                            uv.小程序.push(e.inquiry_uv);
                            SmartProgramSeries.uv.push(e.inquiry_uv);
                            SmartProgramSeries.date.push(e.date);
                            Queried[3]=1;
                            break;
                        case 'inquiry_success_uv':
                            uv.小程序.push(e.inquiry_success_uv);
                            SmartProgramSeries.uv.push(e.inquiry_success_uv);
                            SmartProgramSeries.date.push(e.date);
                            Queried[3]=1;
                            break;
                        case 'submit_success_uv':
                            uv.小程序.push(e.submit_success_uv);
                            SmartProgramSeries.uv.push(e.submit_success_uv);
                            SmartProgramSeries.date.push(e.date);
                            Queried[3]=1;
                            break;
                        case 'trade_success_uv':
                            uv.小程序.push(e.trade_success_uv);
                            SmartProgramSeries.uv.push(e.trade_success_uv);
                            SmartProgramSeries.date.push(e.date);
                            Queried[3]=1;
                            break;
                        case 'select_machine_uv':
                            uv.小程序.push(e.select_machine_uv);
                            SmartProgramSeries.uv.push(e.select_machine_uv);
                            SmartProgramSeries.date.push(e.date);
                            Queried[3]=1;
                            break;
                        case 'inquiry_uv_rate':
                            uv.小程序.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            SmartProgramSeries.uv.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            SmartProgramSeries.date.push(e.date);
                            Queried[3]=1;
                            break;
                        case 'inquiry_success_uv_rate':
                            uv.小程序.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            SmartProgramSeries.uv.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            SmartProgramSeries.date.push(e.date);
                            Queried[3]=1;
                            break;
                        case 'submit_inquiry_rate':
                            uv.小程序.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            SmartProgramSeries.uv.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            SmartProgramSeries.date.push(e.date);
                            Queried[3]=1;
                            break;
                        case 'submit_uv_rate':
                            uv.小程序.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            SmartProgramSeries.uv.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            SmartProgramSeries.date.push(e.date);
                            Queried[3]=1;
                            break;
                        case 'submit_success_cnt':
                            uv.小程序.push(e.submit_success_cnt);
                            SmartProgramSeries.uv.push(e.submit_success_cnt);
                            SmartProgramSeries.date.push(e.date);
                            Queried[3]=1;
                            break;
                        case 'trade_success_cnt':
                            uv.小程序.push(e.trade_success_cnt);
                            SmartProgramSeries.uv.push(e.trade_success_cnt);
                            SmartProgramSeries.date.push(e.date);
                            Queried[3]=1;
                            break;
                        case 'trade_submit_rate':
                            uv.小程序.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            SmartProgramSeries.uv.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            SmartProgramSeries.date.push(e.date);
                            Queried[3]=1;
                            break;
                        case 'trade_num':
                            uv.小程序.push(e.trade_num);
                            SmartProgramSeries.uv.push(e.trade_num);
                            SmartProgramSeries.date.push(e.date);
                            Queried[3]=1;
                            break;
                        case 'per_trade_num':
                            uv.小程序.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            SmartProgramSeries.uv.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            SmartProgramSeries.date.push(e.date);
                            Queried[3]=1;
                            break;
                    }
                    break;
                case 'APP内页':
                    switch (datatype) {
                        case 'uv':
                            uv.APP内页.push(e.uv);
                            APPInnerHtmlSeries.uv.push(e.uv);
                            APPInnerHtmlSeries.date.push(e.date);
                            Queried[4]=1;
                            break;
                        case 'inquiry_uv':
                            uv.APP内页.push(e.inquiry_uv);
                            APPInnerHtmlSeries.uv.push(e.inquiry_uv);
                            APPInnerHtmlSeries.date.push(e.date);
                            Queried[4]=1;
                            break;
                        case 'inquiry_success_uv':
                            uv.APP内页.push(e.inquiry_success_uv);
                            APPInnerHtmlSeries.uv.push(e.inquiry_success_uv);
                            APPInnerHtmlSeries.date.push(e.date);
                            Queried[4]=1;
                            break;
                        case 'submit_success_uv':
                            uv.APP内页.push(e.submit_success_uv);
                            APPInnerHtmlSeries.uv.push(e.submit_success_uv);
                            APPInnerHtmlSeries.date.push(e.date);
                            Queried[4]=1;
                            break;
                        case 'trade_success_uv':
                            uv.APP内页.push(e.trade_success_uv);
                            APPInnerHtmlSeries.uv.push(e.trade_success_uv);
                            APPInnerHtmlSeries.date.push(e.date);
                            Queried[4]=1;
                            break;
                        case 'select_machine_uv':
                            uv.APP内页.push(e.select_machine_uv);
                            APPInnerHtmlSeries.uv.push(e.select_machine_uv);
                            APPInnerHtmlSeries.date.push(e.date);
                            Queried[4]=1;
                            break;
                        case 'inquiry_uv_rate':
                            uv.APP内页.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            APPInnerHtmlSeries.uv.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            APPInnerHtmlSeries.date.push(e.date);
                            Queried[4]=1;
                            break;
                        case 'inquiry_success_uv_rate':
                            uv.APP内页.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            APPInnerHtmlSeries.uv.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            APPInnerHtmlSeries.date.push(e.date);
                            Queried[4]=1;
                            break;
                        case 'submit_inquiry_rate':
                            uv.APP内页.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            APPInnerHtmlSeries.uv.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            APPInnerHtmlSeries.date.push(e.date);
                            Queried[4]=1;
                            break;
                        case 'submit_uv_rate':
                            uv.APP内页.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            APPInnerHtmlSeries.uv.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            APPInnerHtmlSeries.date.push(e.date);
                            Queried[4]=1;
                            break;
                        case 'submit_success_cnt':
                            uv.APP内页.push(e.submit_success_cnt);
                            APPInnerHtmlSeries.uv.push(e.submit_success_cnt);
                            APPInnerHtmlSeries.date.push(e.date);
                            Queried[4]=1;
                            break;
                        case 'trade_success_cnt':
                            uv.APP内页.push(e.trade_success_cnt);
                            APPInnerHtmlSeries.uv.push(e.trade_success_cnt);
                            APPInnerHtmlSeries.date.push(e.date);
                            Queried[4]=1;
                            break;
                        case 'trade_submit_rate':
                            uv.APP内页.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            APPInnerHtmlSeries.uv.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            APPInnerHtmlSeries.date.push(e.date);
                            Queried[4]=1;
                            break;
                        case 'trade_num':
                            uv.APP内页.push(e.trade_num);
                            APPInnerHtmlSeries.uv.push(e.trade_num);
                            APPInnerHtmlSeries.date.push(e.date);
                            Queried[4]=1;
                            break;
                        case 'per_trade_num':
                            uv.APP内页.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            APPInnerHtmlSeries.uv.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            APPInnerHtmlSeries.date.push(e.date);
                            Queried[4]=1;
                            break;
                    }
                    break;
                case '合作':
                    switch (datatype) {
                        case 'uv':
                            uv.合作.push(e.uv);
                            TeamSeries.uv.push(e.uv);
                            TeamSeries.date.push(e.date);
                            Queried[5]=1;
                            break;
                        case 'inquiry_uv':
                            uv.合作.push(e.inquiry_uv);
                            TeamSeries.uv.push(e.inquiry_uv);
                            TeamSeries.date.push(e.date);
                            Queried[5]=1;
                            break;
                        case 'inquiry_success_uv':
                            uv.合作.push(e.inquiry_success_uv);
                            TeamSeries.uv.push(e.inquiry_success_uv);
                            TeamSeries.date.push(e.date);
                            Queried[5]=1;
                            break;
                        case 'submit_success_uv':
                            uv.合作.push(e.submit_success_uv);
                            TeamSeries.uv.push(e.submit_success_uv);
                            TeamSeries.date.push(e.date);
                            Queried[5]=1;
                            break;
                        case 'trade_success_uv':
                            uv.合作.push(e.trade_success_uv);
                            TeamSeries.uv.push(e.trade_success_uv);
                            TeamSeries.date.push(e.date);
                            Queried[5]=1;
                            break;
                        case 'select_machine_uv':
                            uv.合作.push(e.select_machine_uv);
                            TeamSeries.uv.push(e.select_machine_uv);
                            TeamSeries.date.push(e.date);
                            Queried[5]=1;
                            break;
                        case 'inquiry_uv_rate':
                            uv.合作.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            TeamSeries.uv.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            TeamSeries.date.push(e.date);
                            Queried[5]=1;
                            break;
                        case 'inquiry_success_uv_rate':
                            uv.合作.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            TeamSeries.uv.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            TeamSeries.date.push(e.date);
                            Queried[5]=1;
                            break;
                        case 'submit_inquiry_rate':
                            uv.合作.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            TeamSeries.uv.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            TeamSeries.date.push(e.date);
                            Queried[5]=1;
                            break;
                        case 'submit_uv_rate':
                            uv.合作.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            TeamSeries.uv.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            TeamSeries.date.push(e.date);
                            Queried[5]=1;
                            break;
                        case 'submit_success_cnt':
                            uv.合作.push(e.submit_success_cnt);
                            TeamSeries.uv.push(e.submit_success_cnt);
                            TeamSeries.date.push(e.date);
                            Queried[5]=1;
                            break;
                        case 'trade_success_cnt':
                            uv.合作.push(e.trade_success_cnt);
                            TeamSeries.uv.push(e.trade_success_cnt);
                            TeamSeries.date.push(e.date);
                            Queried[5]=1;
                            break;
                        case 'trade_submit_rate':
                            uv.合作.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            TeamSeries.uv.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            TeamSeries.date.push(e.date);
                            Queried[5]=1;
                            break;
                        case 'trade_num':
                            uv.合作.push(e.trade_num);
                            TeamSeries.uv.push(e.trade_num);
                            TeamSeries.date.push(e.date);
                            Queried[5]=1;
                            break;
                        case 'per_trade_num':
                            uv.合作.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            TeamSeries.uv.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            TeamSeries.date.push(e.date);
                            Queried[5]=1;
                            break;
                    }
                    break;
                case '其他渠道':
                    switch (datatype) {
                        case 'uv':
                            uv.其他渠道.push(e.uv);
                            OtherSeries.uv.push(e.uv);
                            OtherSeries.date.push(e.date);
                            Queried[6]=1;
                            break;
                        case 'inquiry_uv':
                            uv.其他渠道.push(e.inquiry_uv);
                            OtherSeries.uv.push(e.inquiry_uv);
                            OtherSeries.date.push(e.date);
                            Queried[6]=1;
                            break;
                        case 'inquiry_success_uv':
                            uv.其他渠道.push(e.inquiry_success_uv);
                            OtherSeries.uv.push(e.inquiry_success_uv);
                            OtherSeries.date.push(e.date);
                            Queried[6]=1;
                            break;
                        case 'submit_success_uv':
                            uv.其他渠道.push(e.submit_success_uv);
                            OtherSeries.uv.push(e.submit_success_uv);
                            OtherSeries.date.push(e.date);
                            Queried[6]=1;
                            break;
                        case 'trade_success_uv':
                            uv.其他渠道.push(e.trade_success_uv);
                            OtherSeries.uv.push(e.trade_success_uv);
                            OtherSeries.date.push(e.date);
                            Queried[6]=1;
                            break;
                        case 'select_machine_uv':
                            uv.其他渠道.push(e.select_machine_uv);
                            OtherSeries.uv.push(e.select_machine_uv);
                            OtherSeries.date.push(e.date);
                            Queried[6]=1;
                            break;
                        case 'inquiry_uv_rate':
                            uv.其他渠道.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            OtherSeries.uv.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            OtherSeries.date.push(e.date);
                            Queried[6]=1;
                            break;
                        case 'inquiry_success_uv_rate':
                            uv.其他渠道.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            OtherSeries.uv.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            OtherSeries.date.push(e.date);
                            Queried[6]=1;
                            break;
                        case 'submit_inquiry_rate':
                            uv.其他渠道.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            OtherSeries.uv.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            OtherSeries.date.push(e.date);
                            Queried[6]=1;
                            break;
                        case 'submit_uv_rate':
                            uv.其他渠道.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            OtherSeries.uv.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            OtherSeries.date.push(e.date);
                            Queried[6]=1;
                            break;
                        case 'submit_success_cnt':
                            uv.其他渠道.push(e.submit_success_cnt);
                            OtherSeries.uv.push(e.submit_success_cnt);
                            OtherSeries.date.push(e.date);
                            Queried[6]=1;
                            break;
                        case 'trade_success_cnt':
                            uv.其他渠道.push(e.trade_success_cnt);
                            OtherSeries.uv.push(e.trade_success_cnt);
                            OtherSeries.date.push(e.date);
                            Queried[6]=1;
                            break;
                        case 'trade_submit_rate':
                            uv.其他渠道.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            OtherSeries.uv.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            OtherSeries.date.push(e.date);
                            Queried[6]=1;
                            break;
                        case 'trade_num':
                            uv.其他渠道.push(e.trade_num);
                            OtherSeries.uv.push(e.trade_num);
                            OtherSeries.date.push(e.date);
                            Queried[6]=1;
                            break;
                        case 'per_trade_num':
                            uv.其他渠道.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            OtherSeries.uv.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            OtherSeries.date.push(e.date);
                            Queried[6]=1;
                            break;
                    }
                    break;
                case '直接访问':
                    switch (datatype) {
                        case 'uv':
                            uv.直接访问.push(e.uv);
                            DirectSeries.uv.push(e.uv);
                            DirectSeries.date.push(e.date);
                            Queried[7]=1;
                            break;
                        case 'inquiry_uv':
                            uv.直接访问.push(e.inquiry_uv);
                            DirectSeries.uv.push(e.inquiry_uv);
                            DirectSeries.date.push(e.date);
                            Queried[7]=1;
                            break;
                        case 'inquiry_success_uv':
                            uv.直接访问.push(e.inquiry_success_uv);
                            DirectSeries.uv.push(e.inquiry_success_uv);
                            DirectSeries.date.push(e.date);
                            Queried[7]=1;
                            break;
                        case 'submit_success_uv':
                            uv.直接访问.push(e.submit_success_uv);
                            DirectSeries.uv.push(e.submit_success_uv);
                            DirectSeries.date.push(e.date);
                            Queried[7]=1;
                            break;
                        case 'trade_success_uv':
                            uv.直接访问.push(e.trade_success_uv);
                            DirectSeries.uv.push(e.trade_success_uv);
                            DirectSeries.date.push(e.date);
                            Queried[7]=1;
                            break;
                        case 'select_machine_uv':
                            uv.直接访问.push(e.select_machine_uv);
                            DirectSeries.uv.push(e.select_machine_uv);
                            DirectSeries.date.push(e.date);
                            Queried[7]=1;
                            break;
                        case 'inquiry_uv_rate':
                            uv.直接访问.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            DirectSeries.uv.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            DirectSeries.date.push(e.date);
                            Queried[7]=1;
                            break;
                        case 'inquiry_success_uv_rate':
                            uv.直接访问.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            DirectSeries.uv.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            DirectSeries.date.push(e.date);
                            Queried[7]=1;
                            break;
                        case 'submit_inquiry_rate':
                            uv.直接访问.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            DirectSeries.uv.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            DirectSeries.date.push(e.date);
                            Queried[7]=1;
                            break;
                        case 'submit_uv_rate':
                            uv.直接访问.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            DirectSeries.uv.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            DirectSeries.date.push(e.date);
                            Queried[7]=1;
                            break;
                        case 'submit_success_cnt':
                            uv.直接访问.push(e.submit_success_cnt);
                            DirectSeries.uv.push(e.submit_success_cnt);
                            DirectSeries.date.push(e.date);
                            Queried[7]=1;
                            break;
                        case 'trade_success_cnt':
                            uv.直接访问.push(e.trade_success_cnt);
                            DirectSeries.uv.push(e.trade_success_cnt);
                            DirectSeries.date.push(e.date);
                            Queried[7]=1;
                            break;
                        case 'trade_submit_rate':
                            uv.直接访问.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            DirectSeries.uv.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            DirectSeries.date.push(e.date);
                            Queried[7]=1;
                            break;
                        case 'trade_num':
                            uv.直接访问.push(e.trade_num);
                            DirectSeries.uv.push(e.trade_num);
                            DirectSeries.date.push(e.date);
                            Queried[7]=1;
                            break;
                        case 'per_trade_num':
                            uv.直接访问.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            DirectSeries.uv.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            DirectSeries.date.push(e.date);
                            Queried[7]=1;
                            break;
                    }
                    break;
                case '召回':
                    switch (datatype) {
                        case 'uv':
                            uv.召回.push(e.uv);
                            RecallSeries.uv.push(e.uv);
                            RecallSeries.date.push(e.date);
                            Queried[8]=1;
                            break;
                        case 'inquiry_uv':
                            uv.召回.push(e.inquiry_uv);
                            RecallSeries.uv.push(e.inquiry_uv);
                            RecallSeries.date.push(e.date);
                            Queried[8]=1;
                            break;
                        case 'inquiry_success_uv':
                            uv.召回.push(e.inquiry_success_uv);
                            RecallSeries.uv.push(e.inquiry_success_uv);
                            RecallSeries.date.push(e.date);
                            Queried[8]=1;
                            break;
                        case 'submit_success_uv':
                            uv.召回.push(e.submit_success_uv);
                            RecallSeries.uv.push(e.submit_success_uv);
                            RecallSeries.date.push(e.date);
                            Queried[8]=1;
                            break;
                        case 'trade_success_uv':
                            uv.召回.push(e.trade_success_uv);
                            RecallSeries.uv.push(e.trade_success_uv);
                            RecallSeries.date.push(e.date);
                            Queried[8]=1;
                            break;
                        case 'select_machine_uv':
                            uv.召回.push(e.select_machine_uv);
                            RecallSeries.uv.push(e.select_machine_uv);
                            RecallSeries.date.push(e.date);
                            Queried[8]=1;
                            break;
                        case 'inquiry_uv_rate':
                            uv.召回.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            RecallSeries.uv.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            RecallSeries.date.push(e.date);
                            Queried[8]=1;
                            break;
                        case 'inquiry_success_uv_rate':
                            uv.召回.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            RecallSeries.uv.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            RecallSeries.date.push(e.date);
                            Queried[8]=1;
                            break;
                        case 'submit_inquiry_rate':
                            uv.召回.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            RecallSeries.uv.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            RecallSeries.date.push(e.date);
                            Queried[8]=1;
                            break;
                        case 'submit_uv_rate':
                            uv.召回.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            RecallSeries.uv.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            RecallSeries.date.push(e.date);
                            Queried[8]=1;
                            break;
                        case 'submit_success_cnt':
                            uv.召回.push(e.submit_success_cnt);
                            RecallSeries.uv.push(e.submit_success_cnt);
                            RecallSeries.date.push(e.date);
                            Queried[8]=1;
                            break;
                        case 'trade_success_cnt':
                            uv.召回.push(e.trade_success_cnt);
                            RecallSeries.uv.push(e.trade_success_cnt);
                            RecallSeries.date.push(e.date);
                            Queried[8]=1;
                            break;
                        case 'trade_submit_rate':
                            uv.召回.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            RecallSeries.uv.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            RecallSeries.date.push(e.date);
                            Queried[8]=1;
                            break;
                        case 'trade_num':
                            uv.召回.push(e.trade_num);
                            RecallSeries.uv.push(e.trade_num);
                            RecallSeries.date.push(e.date);
                            Queried[8]=1;
                            break;
                        case 'per_trade_num':
                            uv.召回.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            RecallSeries.uv.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            RecallSeries.date.push(e.date);
                            Queried[8]=1;
                            break;
                    }
                    break;
                case '小程序内页':
                    switch (datatype) {
                        case 'uv':
                            uv.小程序内页.push(e.uv);
                            SmartInnerHtmlSeries.uv.push(e.uv);
                            SmartInnerHtmlSeries.date.push(e.date);
                            Queried[9]=1;
                            break;
                        case 'inquiry_uv':
                            uv.小程序内页.push(e.inquiry_uv);
                            SmartInnerHtmlSeries.uv.push(e.inquiry_uv);
                            SmartInnerHtmlSeries.date.push(e.date);
                            Queried[9]=1;
                            break;
                        case 'inquiry_success_uv':
                            uv.小程序内页.push(e.inquiry_success_uv);
                            SmartInnerHtmlSeries.uv.push(e.inquiry_success_uv);
                            SmartInnerHtmlSeries.date.push(e.date);
                            Queried[9]=1;
                            break;
                        case 'submit_success_uv':
                            uv.小程序内页.push(e.submit_success_uv);
                            SmartInnerHtmlSeries.uv.push(e.submit_success_uv);
                            SmartInnerHtmlSeries.date.push(e.date);
                            Queried[9]=1;
                            break;
                        case 'trade_success_uv':
                            uv.小程序内页.push(e.trade_success_uv);
                            SmartInnerHtmlSeries.uv.push(e.trade_success_uv);
                            SmartInnerHtmlSeries.date.push(e.date);
                            Queried[9]=1;
                            break;
                        case 'select_machine_uv':
                            uv.小程序内页.push(e.select_machine_uv);
                            SmartInnerHtmlSeries.uv.push(e.select_machine_uv);
                            SmartInnerHtmlSeries.date.push(e.date);
                            Queried[9]=1;
                            break;
                        case 'inquiry_uv_rate':
                            uv.小程序内页.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            SmartInnerHtmlSeries.uv.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            SmartInnerHtmlSeries.date.push(e.date);
                            Queried[9]=1;
                            break;
                        case 'inquiry_success_uv_rate':
                            uv.小程序内页.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            SmartInnerHtmlSeries.uv.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            SmartInnerHtmlSeries.date.push(e.date);
                            Queried[9]=1;
                            break;
                        case 'submit_inquiry_rate':
                            uv.小程序内页.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            SmartInnerHtmlSeries.uv.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            SmartInnerHtmlSeries.date.push(e.date);
                            Queried[9]=1;
                            break;
                        case 'submit_uv_rate':
                            uv.小程序内页.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            SmartInnerHtmlSeries.uv.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            SmartInnerHtmlSeries.date.push(e.date);
                            Queried[9]=1;
                            break;
                        case 'submit_success_cnt':
                            uv.小程序内页.push(e.submit_success_cnt);
                            SmartInnerHtmlSeries.uv.push(e.submit_success_cnt);
                            SmartInnerHtmlSeries.date.push(e.date);
                            Queried[9]=1;
                            break;
                        case 'trade_success_cnt':
                            uv.小程序内页.push(e.trade_success_cnt);
                            SmartInnerHtmlSeries.uv.push(e.trade_success_cnt);
                            SmartInnerHtmlSeries.date.push(e.date);
                            Queried[9]=1;
                            break;
                        case 'trade_submit_rate':
                            uv.小程序内页.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            SmartInnerHtmlSeries.uv.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            SmartInnerHtmlSeries.date.push(e.date);
                            Queried[9]=1;
                            break;
                        case 'trade_num':
                            uv.小程序内页.push(e.trade_num);
                            SmartInnerHtmlSeries.uv.push(e.trade_num);
                            SmartInnerHtmlSeries.date.push(e.date);
                            Queried[9]=1;
                            break;
                        case 'per_trade_num':
                            uv.小程序内页.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            SmartInnerHtmlSeries.uv.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            SmartInnerHtmlSeries.date.push(e.date);
                            Queried[9]=1;
                            break;
                    }
                    break;
                case '新渠道':
                    switch (datatype) {
                        case 'uv':
                            uv.新渠道.push(e.uv);
                            NewChannelSeries.uv.push(e.uv);
                            NewChannelSeries.date.push(e.date);
                            Queried[10]=1;
                            break;
                        case 'inquiry_uv':
                            uv.新渠道.push(e.inquiry_uv);
                            NewChannelSeries.uv.push(e.inquiry_uv);
                            NewChannelSeries.date.push(e.date);
                            Queried[10]=1;
                            break;
                        case 'inquiry_success_uv':
                            uv.新渠道.push(e.inquiry_success_uv);
                            NewChannelSeries.uv.push(e.inquiry_success_uv);
                            NewChannelSeries.date.push(e.date);
                            Queried[10]=1;
                            break;
                        case 'submit_success_uv':
                            uv.新渠道.push(e.submit_success_uv);
                            NewChannelSeries.uv.push(e.submit_success_uv);
                            NewChannelSeries.date.push(e.date);
                            Queried[10]=1;
                            break;
                        case 'trade_success_uv':
                            uv.新渠道.push(e.trade_success_uv);
                            NewChannelSeries.uv.push(e.trade_success_uv);
                            NewChannelSeries.date.push(e.date);
                            Queried[10]=1;
                            break;
                        case 'select_machine_uv':
                            uv.新渠道.push(e.select_machine_uv);
                            NewChannelSeries.uv.push(e.select_machine_uv);
                            NewChannelSeries.date.push(e.date);
                            Queried[10]=1;
                            break;
                        case 'inquiry_uv_rate':
                            uv.新渠道.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            NewChannelSeries.uv.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            NewChannelSeries.date.push(e.date);
                            Queried[10]=1;
                            break;
                        case 'inquiry_success_uv_rate':
                            uv.新渠道.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            NewChannelSeries.uv.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            NewChannelSeries.date.push(e.date);
                            Queried[10]=1;
                            break;
                        case 'submit_inquiry_rate':
                            uv.新渠道.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            NewChannelSeries.uv.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            NewChannelSeries.date.push(e.date);
                            Queried[10]=1;
                            break;
                        case 'submit_uv_rate':
                            uv.新渠道.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            NewChannelSeries.uv.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            NewChannelSeries.date.push(e.date);
                            Queried[10]=1;
                            break;
                        case 'submit_success_cnt':
                            uv.新渠道.push(e.submit_success_cnt);
                            NewChannelSeries.uv.push(e.submit_success_cnt);
                            NewChannelSeries.date.push(e.date);
                            Queried[10]=1;
                            break;
                        case 'trade_success_cnt':
                            uv.新渠道.push(e.trade_success_cnt);
                            NewChannelSeries.uv.push(e.trade_success_cnt);
                            NewChannelSeries.date.push(e.date);
                            Queried[10]=1;
                            break;
                        case 'trade_submit_rate':
                            uv.新渠道.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            NewChannelSeries.uv.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            NewChannelSeries.date.push(e.date);
                            Queried[10]=1;
                            break;
                        case 'trade_num':
                            uv.新渠道.push(e.trade_num);
                            NewChannelSeries.uv.push(e.trade_num);
                            NewChannelSeries.date.push(e.date);
                            Queried[10]=1;
                            break;
                        case 'per_trade_num':
                            uv.新渠道.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            NewChannelSeries.uv.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            NewChannelSeries.date.push(e.date);
                            Queried[10]=1;
                            break;
                    }
                    break;
                case 'SEO':
                    switch (datatype) {
                        case 'uv':
                            uv.SEO.push(e.uv);
                            SEOSeries.uv.push(e.uv);
                            SEOSeries.date.push(e.date);
                            Queried[11]=1;
                            break;
                        case 'inquiry_uv':
                            uv.SEO.push(e.inquiry_uv);
                            SEOSeries.uv.push(e.inquiry_uv);
                            SEOSeries.date.push(e.date);
                            Queried[11]=1;
                            break;
                        case 'inquiry_success_uv':
                            uv.SEO.push(e.inquiry_success_uv);
                            SEOSeries.uv.push(e.inquiry_success_uv);
                            SEOSeries.date.push(e.date);
                            Queried[11]=1;
                            break;
                        case 'submit_success_uv':
                            uv.SEO.push(e.submit_success_uv);
                            SEOSeries.uv.push(e.submit_success_uv);
                            SEOSeries.date.push(e.date);
                            Queried[11]=1;
                            break;
                        case 'trade_success_uv':
                            uv.SEO.push(e.trade_success_uv);
                            SEOSeries.uv.push(e.trade_success_uv);
                            SEOSeries.date.push(e.date);
                            Queried[11]=1;
                            break;
                        case 'select_machine_uv':
                            uv.SEO.push(e.select_machine_uv);
                            SEOSeries.uv.push(e.select_machine_uv);
                            SEOSeries.date.push(e.date);
                            Queried[11]=1;
                            break;
                        case 'inquiry_uv_rate':
                            uv.SEO.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            SEOSeries.uv.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            SEOSeries.date.push(e.date);
                            Queried[11]=1;
                            break;
                        case 'inquiry_success_uv_rate':
                            uv.SEO.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            SEOSeries.uv.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            SEOSeries.date.push(e.date);
                            Queried[11]=1;
                            break;
                        case 'submit_inquiry_rate':
                            uv.SEO.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            SEOSeries.uv.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            SEOSeries.date.push(e.date);
                            Queried[11]=1;
                            break;
                        case 'submit_uv_rate':
                            uv.SEO.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            SEOSeries.uv.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            SEOSeries.date.push(e.date);
                            Queried[11]=1;
                            break;
                        case 'submit_success_cnt':
                            uv.SEO.push(e.submit_success_cnt);
                            SEOSeries.uv.push(e.submit_success_cnt);
                            SEOSeries.date.push(e.date);
                            Queried[11]=1;
                            break;
                        case 'trade_success_cnt':
                            uv.SEO.push(e.trade_success_cnt);
                            SEOSeries.uv.push(e.trade_success_cnt);
                            SEOSeries.date.push(e.date);
                            Queried[11]=1;
                            break;
                        case 'trade_submit_rate':
                            uv.SEO.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            SEOSeries.uv.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            SEOSeries.date.push(e.date);
                            Queried[11]=1;
                            break;
                        case 'trade_num':
                            uv.SEO.push(e.trade_num);
                            SEOSeries.uv.push(e.trade_num);
                            SEOSeries.date.push(e.date);
                            Queried[11]=1;
                            break;
                        case 'per_trade_num':
                            uv.SEO.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            SEOSeries.uv.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            SEOSeries.date.push(e.date);
                            Queried[11]=1;
                            break;
                    }
                    break;
                case '微信公众号':
                    switch (datatype) {
                        case 'uv':
                            uv.微信公众号.push(e.uv);
                            WeixinPublicSeries.uv.push(e.uv);
                            WeixinPublicSeries.date.push(e.date);
                            Queried[12]=1;
                            break;
                        case 'inquiry_uv':
                            uv.微信公众号.push(e.inquiry_uv);
                            WeixinPublicSeries.uv.push(e.inquiry_uv);
                            WeixinPublicSeries.date.push(e.date);
                            Queried[12]=1;
                            break;
                        case 'inquiry_success_uv':
                            uv.微信公众号.push(e.inquiry_success_uv);
                            WeixinPublicSeries.uv.push(e.inquiry_success_uv);
                            WeixinPublicSeries.date.push(e.date);
                            Queried[12]=1;
                            break;
                        case 'submit_success_uv':
                            uv.微信公众号.push(e.submit_success_uv);
                            WeixinPublicSeries.uv.push(e.submit_success_uv);
                            WeixinPublicSeries.date.push(e.date);
                            Queried[12]=1;
                            break;
                        case 'trade_success_uv':
                            uv.微信公众号.push(e.trade_success_uv);
                            WeixinPublicSeries.uv.push(e.trade_success_uv);
                            WeixinPublicSeries.date.push(e.date);
                            Queried[12]=1;
                            break;
                        case 'select_machine_uv':
                            uv.微信公众号.push(e.select_machine_uv);
                            WeixinPublicSeries.uv.push(e.select_machine_uv);
                            WeixinPublicSeries.date.push(e.date);
                            Queried[12]=1;
                            break;
                        case 'inquiry_uv_rate':
                            uv.微信公众号.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            WeixinPublicSeries.uv.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            WeixinPublicSeries.date.push(e.date);
                            Queried[12]=1;
                            break;
                        case 'inquiry_success_uv_rate':
                            uv.微信公众号.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            WeixinPublicSeries.uv.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            WeixinPublicSeries.date.push(e.date);
                            Queried[12]=1;
                            break;
                        case 'submit_inquiry_rate':
                            uv.微信公众号.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            WeixinPublicSeries.uv.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            WeixinPublicSeries.date.push(e.date);
                            Queried[12]=1;
                            break;
                        case 'submit_uv_rate':
                            uv.微信公众号.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            WeixinPublicSeries.uv.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            WeixinPublicSeries.date.push(e.date);
                            Queried[12]=1;
                            break;
                        case 'submit_success_cnt':
                            uv.微信公众号.push(e.submit_success_cnt);
                            WeixinPublicSeries.uv.push(e.submit_success_cnt);
                            WeixinPublicSeries.date.push(e.date);
                            Queried[12]=1;
                            break;
                        case 'trade_success_cnt':
                            uv.微信公众号.push(e.trade_success_cnt);
                            WeixinPublicSeries.uv.push(e.trade_success_cnt);
                            WeixinPublicSeries.date.push(e.date);
                            Queried[12]=1;
                            break;
                        case 'trade_submit_rate':
                            uv.微信公众号.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            WeixinPublicSeries.uv.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            WeixinPublicSeries.date.push(e.date);
                            Queried[12]=1;
                            break;
                        case 'trade_num':
                            uv.微信公众号.push(e.trade_num);
                            WeixinPublicSeries.uv.push(e.trade_num);
                            WeixinPublicSeries.date.push(e.date);
                            Queried[12]=1;
                            break;
                        case 'per_trade_num':
                            uv.微信公众号.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            WeixinPublicSeries.uv.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            WeixinPublicSeries.date.push(e.date);
                            Queried[12]=1;
                            break;
                    }
                    break;
                case '老带新':
                    switch (datatype) {
                        case 'uv':
                            uv.老带新.push(e.uv);
                            OldToNewSeries.uv.push(e.uv);
                            OldToNewSeries.date.push(e.date);
                            Queried[13]=1;
                            break;
                        case 'inquiry_uv':
                            uv.老带新.push(e.inquiry_uv);
                            OldToNewSeries.uv.push(e.inquiry_uv);
                            OldToNewSeries.date.push(e.date);
                            Queried[13]=1;
                            break;
                        case 'inquiry_success_uv':
                            uv.老带新.push(e.inquiry_success_uv);
                            OldToNewSeries.uv.push(e.inquiry_success_uv);
                            OldToNewSeries.date.push(e.date);
                            Queried[13]=1;
                            break;
                        case 'submit_success_uv':
                            uv.老带新.push(e.submit_success_uv);
                            OldToNewSeries.uv.push(e.submit_success_uv);
                            OldToNewSeries.date.push(e.date);
                            Queried[13]=1;
                            break;
                        case 'trade_success_uv':
                            uv.老带新.push(e.trade_success_uv);
                            OldToNewSeries.uv.push(e.trade_success_uv);
                            OldToNewSeries.date.push(e.date);
                            Queried[13]=1;
                            break;
                        case 'select_machine_uv':
                            uv.老带新.push(e.select_machine_uv);
                            OldToNewSeries.uv.push(e.select_machine_uv);
                            OldToNewSeries.date.push(e.date);
                            Queried[13]=1;
                            break;
                        case 'inquiry_uv_rate':
                            uv.老带新.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            OldToNewSeries.uv.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            OldToNewSeries.date.push(e.date);
                            Queried[13]=1;
                            break;
                        case 'inquiry_success_uv_rate':
                            uv.老带新.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            OldToNewSeries.uv.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            OldToNewSeries.date.push(e.date);
                            Queried[13]=1;
                            break;
                        case 'submit_inquiry_rate':
                            uv.老带新.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            OldToNewSeries.uv.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            OldToNewSeries.date.push(e.date);
                            Queried[13]=1;
                            break;
                        case 'submit_uv_rate':
                            uv.老带新.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            OldToNewSeries.uv.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            OldToNewSeries.date.push(e.date);
                            Queried[13]=1;
                            break;
                        case 'submit_success_cnt':
                            uv.老带新.push(e.submit_success_cnt);
                            OldToNewSeries.uv.push(e.submit_success_cnt);
                            OldToNewSeries.date.push(e.date);
                            Queried[13]=1;
                            break;
                        case 'trade_success_cnt':
                            uv.老带新.push(e.trade_success_cnt);
                            OldToNewSeries.uv.push(e.trade_success_cnt);
                            OldToNewSeries.date.push(e.date);
                            Queried[13]=1;
                            break;
                        case 'trade_submit_rate':
                            uv.老带新.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            OldToNewSeries.uv.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            OldToNewSeries.date.push(e.date);
                            Queried[13]=1;
                            break;
                        case 'trade_num':
                            uv.老带新.push(e.trade_num);
                            OldToNewSeries.uv.push(e.trade_num);
                            OldToNewSeries.date.push(e.date);
                            Queried[13]=1;
                            break;
                        case 'per_trade_num':
                            uv.老带新.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            OldToNewSeries.uv.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            OldToNewSeries.date.push(e.date);
                            Queried[13]=1;
                            break;
                    }
                    break;
                case '线下门店':
                    switch (datatype) {
                        case 'uv':
                            uv.线下门店.push(e.uv);
                            StoreSeries.uv.push(e.uv);
                            StoreSeries.date.push(e.date);
                            Queried[14]=1;
                            break;
                        case 'inquiry_uv':
                            uv.线下门店.push(e.inquiry_uv);
                            StoreSeries.uv.push(e.inquiry_uv);
                            StoreSeries.date.push(e.date);
                            Queried[14]=1;
                            break;
                        case 'inquiry_success_uv':
                            uv.线下门店.push(e.inquiry_success_uv);
                            StoreSeries.uv.push(e.inquiry_success_uv);
                            StoreSeries.date.push(e.date);
                            Queried[14]=1;
                            break;
                        case 'submit_success_uv':
                            uv.线下门店.push(e.submit_success_uv);
                            StoreSeries.uv.push(e.submit_success_uv);
                            StoreSeries.date.push(e.date);
                            Queried[14]=1;
                            break;
                        case 'trade_success_uv':
                            uv.线下门店.push(e.trade_success_uv);
                            StoreSeries.uv.push(e.trade_success_uv);
                            StoreSeries.date.push(e.date);
                            Queried[14]=1;
                            break;
                        case 'select_machine_uv':
                            uv.线下门店.push(e.select_machine_uv);
                            StoreSeries.uv.push(e.select_machine_uv);
                            StoreSeries.date.push(e.date);
                            Queried[14]=1;
                            break;
                        case 'inquiry_uv_rate':
                            uv.线下门店.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            StoreSeries.uv.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            StoreSeries.date.push(e.date);
                            Queried[14]=1;
                            break;
                        case 'inquiry_success_uv_rate':
                            uv.线下门店.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            StoreSeries.uv.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            StoreSeries.date.push(e.date);
                            Queried[14]=1;
                            break;
                        case 'submit_inquiry_rate':
                            uv.线下门店.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            StoreSeries.uv.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            StoreSeries.date.push(e.date);
                            Queried[14]=1;
                            break;
                        case 'submit_uv_rate':
                            uv.线下门店.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            StoreSeries.uv.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            StoreSeries.date.push(e.date);
                            Queried[14]=1;
                            break;
                        case 'submit_success_cnt':
                            uv.线下门店.push(e.submit_success_cnt);
                            StoreSeries.uv.push(e.submit_success_cnt);
                            StoreSeries.date.push(e.date);
                            Queried[14]=1;
                            break;
                        case 'trade_success_cnt':
                            uv.线下门店.push(e.trade_success_cnt);
                            StoreSeries.uv.push(e.trade_success_cnt);
                            StoreSeries.date.push(e.date);
                            Queried[14]=1;
                            break;
                        case 'trade_submit_rate':
                            uv.线下门店.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            StoreSeries.uv.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            StoreSeries.date.push(e.date);
                            Queried[14]=1;
                            break;
                        case 'trade_num':
                            uv.线下门店.push(e.trade_num);
                            StoreSeries.uv.push(e.trade_num);
                            StoreSeries.date.push(e.date);
                            Queried[14]=1;
                            break;
                        case 'per_trade_num':
                            uv.线下门店.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            StoreSeries.uv.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            StoreSeries.date.push(e.date);
                            Queried[14]=1;
                            break;
                    }
                    break;
            }
        }else{
            if(Queried[1] == 0){
                APPSeries.uv.push('-');
            }
            if (Queried[2] == 0){
                SEMSeries.uv.push('-');
            }
            if (Queried[3] == 0){
                SmartProgramSeries.uv.push('-');
            }
            if (Queried[4] == 0){
                APPInnerHtmlSeries.uv.push('-');
            }
            if (Queried[5] == 0){
                TeamSeries.uv.push('-');
            }
            if (Queried[6] == 0){
                OtherSeries.uv.push('-');
            }
            if (Queried[7] == 0){
                DirectSeries.uv.push('-');
            }
            if (Queried[8] == 0){
                RecallSeries.uv.push('-');
            }
            if (Queried[9] == 0){
                SmartInnerHtmlSeries.uv.push('-');
            }
            if (Queried[10] == 0){
                NewChannelSeries.uv.push('-');
            }
            if (Queried[11] == 0){
                SEOSeries.uv.push('-');
            }
            if (Queried[12] == 0){
                WeixinPublicSeries.uv.push('-');
            }
            if (Queried[13] == 0){
                OldToNewSeries.uv.push('-');
            }
            if (Queried[14] == 0){
                StoreSeries.uv.push('-');
            }
            Queried=[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0];
            dayflag=false;
            switch (e.channel) {
                case 'APP':
                    switch (datatype) {
                        case 'uv':
                            uv.APP.push(e.uv);
                            APPSeries.uv.push(e.uv);
                            APPSeries.date.push(e.date);
                            Queried[1]=1;
                            break;
                        case 'inquiry_uv':
                            uv.APP.push(e.inquiry_uv);
                            APPSeries.uv.push(e.inquiry_uv);
                            APPSeries.date.push(e.date);
                            Queried[1]=1;
                            break;
                        case 'inquiry_success_uv':
                            uv.APP.push(e.inquiry_success_uv);
                            APPSeries.uv.push(e.inquiry_success_uv);
                            APPSeries.date.push(e.date);
                            Queried[1]=1;
                            break;
                        case 'submit_success_uv':
                            uv.APP.push(e.submit_success_uv);
                            APPSeries.uv.push(e.submit_success_uv);
                            APPSeries.date.push(e.date);
                            Queried[1]=1;
                            break;
                        case 'trade_success_uv':
                            uv.APP.push(e.trade_success_uv);
                            APPSeries.uv.push(e.trade_success_uv);
                            APPSeries.date.push(e.date);
                            Queried[1]=1;
                            break;
                        case 'select_machine_uv':
                            uv.APP.push(e.select_machine_uv);
                            APPSeries.uv.push(e.select_machine_uv);
                            APPSeries.date.push(e.date);
                            Queried[1]=1;
                            break;
                        case 'inquiry_uv_rate':
                            uv.APP.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            APPSeries.uv.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            APPSeries.date.push(e.date);
                            Queried[1]=1;
                            break;
                        case 'inquiry_success_uv_rate':
                            uv.APP.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            APPSeries.uv.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            APPSeries.date.push(e.date);
                            Queried[1]=1;
                            break;
                        case 'submit_inquiry_rate':
                            uv.APP.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            APPSeries.uv.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            APPSeries.date.push(e.date);
                            Queried[1]=1;
                            break;
                        case 'submit_uv_rate':
                            uv.APP.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            APPSeries.uv.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            APPSeries.date.push(e.date);
                            Queried[1]=1;
                            break;
                        case 'submit_success_cnt':
                            uv.APP.push(e.submit_success_cnt);
                            APPSeries.uv.push(e.submit_success_cnt);
                            APPSeries.date.push(e.date);
                            Queried[1]=1;
                            break;
                        case 'trade_success_cnt':
                            uv.APP.push(e.trade_success_cnt);
                            APPSeries.uv.push(e.trade_success_cnt);
                            APPSeries.date.push(e.date);
                            Queried[1]=1;
                            break;
                        case 'trade_submit_rate':
                            uv.APP.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            APPSeries.uv.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            APPSeries.date.push(e.date);
                            Queried[1]=1;
                            break;
                        case 'trade_num':
                            uv.APP.push(e.trade_num);
                            APPSeries.uv.push(e.trade_num);
                            APPSeries.date.push(e.date);
                            Queried[1]=1;
                            break;
                        case 'per_trade_num':
                            uv.APP.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            APPSeries.uv.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            APPSeries.date.push(e.date);
                            Queried[1]=1;
                            break;
                    }
                    break;
                case 'SEM':
                    switch (datatype) {
                        case 'uv':
                            uv.SEM.push(e.uv);
                            SEMSeries.uv.push(e.uv);
                            SEMSeries.date.push(e.date);
                            Queried[2]=1;
                            break;
                        case 'inquiry_uv':
                            uv.SEM.push(e.inquiry_uv);
                            SEMSeries.uv.push(e.inquiry_uv);
                            SEMSeries.date.push(e.date);
                            Queried[2]=1;
                            break;
                        case 'inquiry_success_uv':
                            uv.SEM.push(e.inquiry_success_uv);
                            SEMSeries.uv.push(e.inquiry_success_uv);
                            SEMSeries.date.push(e.date);
                            Queried[2]=1;
                            break;
                        case 'submit_success_uv':
                            uv.SEM.push(e.submit_success_uv);
                            SEMSeries.uv.push(e.submit_success_uv);
                            SEMSeries.date.push(e.date);
                            Queried[2]=1;
                            break;
                        case 'trade_success_uv':
                            uv.SEM.push(e.trade_success_uv);
                            SEMSeries.uv.push(e.trade_success_uv);
                            SEMSeries.date.push(e.date);
                            Queried[2]=1;
                            break;
                        case 'select_machine_uv':
                            uv.SEM.push(e.select_machine_uv);
                            SEMSeries.uv.push(e.select_machine_uv);
                            SEMSeries.date.push(e.date);
                            Queried[2]=1;
                            break;
                        case 'inquiry_uv_rate':
                            uv.SEM.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            SEMSeries.uv.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            SEMSeries.date.push(e.date);
                            Queried[2]=1;
                            break;
                        case 'inquiry_success_uv_rate':
                            uv.SEM.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            SEMSeries.uv.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            SEMSeries.date.push(e.date);
                            Queried[2]=1;
                            break;
                        case 'submit_inquiry_rate':
                            uv.SEM.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            SEMSeries.uv.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            SEMSeries.date.push(e.date);
                            Queried[2]=1;
                            break;
                        case 'submit_uv_rate':
                            uv.SEM.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            SEMSeries.uv.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            SEMSeries.date.push(e.date);
                            Queried[2]=1;
                            break;
                        case 'submit_success_cnt':
                            uv.SEM.push(e.submit_success_cnt);
                            SEMSeries.uv.push(e.submit_success_cnt);
                            SEMSeries.date.push(e.date);
                            Queried[2]=1;
                            break;
                        case 'trade_success_cnt':
                            uv.SEM.push(e.trade_success_cnt);
                            SEMSeries.uv.push(e.trade_success_cnt);
                            SEMSeries.date.push(e.date);
                            Queried[2]=1;
                            break;
                        case 'trade_submit_rate':
                            uv.SEM.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            SEMSeries.uv.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            SEMSeries.date.push(e.date);
                            Queried[2]=1;
                            break;
                        case 'trade_num':
                            uv.SEM.push(e.trade_num);
                            SEMSeries.uv.push(e.trade_num);
                            SEMSeries.date.push(e.date);
                            Queried[2]=1;
                            break;
                        case 'per_trade_num':
                            uv.SEM.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            SEMSeries.uv.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            SEMSeries.date.push(e.date);
                            Queried[2]=1;
                            break;
                    }
                    break;
                case '小程序':
                    switch (datatype) {
                        case 'uv':
                            uv.小程序.push(e.uv);
                            SmartProgramSeries.uv.push(e.uv);
                            SmartProgramSeries.date.push(e.date);
                            Queried[3]=1;
                            break;
                        case 'inquiry_uv':
                            uv.小程序.push(e.inquiry_uv);
                            SmartProgramSeries.uv.push(e.inquiry_uv);
                            SmartProgramSeries.date.push(e.date);
                            Queried[3]=1;
                            break;
                        case 'inquiry_success_uv':
                            uv.小程序.push(e.inquiry_success_uv);
                            SmartProgramSeries.uv.push(e.inquiry_success_uv);
                            SmartProgramSeries.date.push(e.date);
                            Queried[3]=1;
                            break;
                        case 'submit_success_uv':
                            uv.小程序.push(e.submit_success_uv);
                            SmartProgramSeries.uv.push(e.submit_success_uv);
                            SmartProgramSeries.date.push(e.date);
                            Queried[3]=1;
                            break;
                        case 'trade_success_uv':
                            uv.小程序.push(e.trade_success_uv);
                            SmartProgramSeries.uv.push(e.trade_success_uv);
                            SmartProgramSeries.date.push(e.date);
                            Queried[3]=1;
                            break;
                        case 'select_machine_uv':
                            uv.小程序.push(e.select_machine_uv);
                            SmartProgramSeries.uv.push(e.select_machine_uv);
                            SmartProgramSeries.date.push(e.date);
                            Queried[3]=1;
                            break;
                        case 'inquiry_uv_rate':
                            uv.小程序.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            SmartProgramSeries.uv.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            SmartProgramSeries.date.push(e.date);
                            Queried[3]=1;
                            break;
                        case 'inquiry_success_uv_rate':
                            uv.小程序.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            SmartProgramSeries.uv.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            SmartProgramSeries.date.push(e.date);
                            Queried[3]=1;
                            break;
                        case 'submit_inquiry_rate':
                            uv.小程序.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            SmartProgramSeries.uv.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            SmartProgramSeries.date.push(e.date);
                            Queried[3]=1;
                            break;
                        case 'submit_uv_rate':
                            uv.小程序.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            SmartProgramSeries.uv.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            SmartProgramSeries.date.push(e.date);
                            Queried[3]=1;
                            break;
                        case 'submit_success_cnt':
                            uv.小程序.push(e.submit_success_cnt);
                            SmartProgramSeries.uv.push(e.submit_success_cnt);
                            SmartProgramSeries.date.push(e.date);
                            Queried[3]=1;
                            break;
                        case 'trade_success_cnt':
                            uv.小程序.push(e.trade_success_cnt);
                            SmartProgramSeries.uv.push(e.trade_success_cnt);
                            SmartProgramSeries.date.push(e.date);
                            Queried[3]=1;
                            break;
                        case 'trade_submit_rate':
                            uv.小程序.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            SmartProgramSeries.uv.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            SmartProgramSeries.date.push(e.date);
                            Queried[3]=1;
                            break;
                        case 'trade_num':
                            uv.小程序.push(e.trade_num);
                            SmartProgramSeries.uv.push(e.trade_num);
                            SmartProgramSeries.date.push(e.date);
                            Queried[3]=1;
                            break;
                        case 'per_trade_num':
                            uv.小程序.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            SmartProgramSeries.uv.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            SmartProgramSeries.date.push(e.date);
                            Queried[3]=1;
                            break;
                    }
                    break;
                case 'APP内页':
                    switch (datatype) {
                        case 'uv':
                            uv.APP内页.push(e.uv);
                            APPInnerHtmlSeries.uv.push(e.uv);
                            APPInnerHtmlSeries.date.push(e.date);
                            Queried[4]=1;
                            break;
                        case 'inquiry_uv':
                            uv.APP内页.push(e.inquiry_uv);
                            APPInnerHtmlSeries.uv.push(e.inquiry_uv);
                            APPInnerHtmlSeries.date.push(e.date);
                            Queried[4]=1;
                            break;
                        case 'inquiry_success_uv':
                            uv.APP内页.push(e.inquiry_success_uv);
                            APPInnerHtmlSeries.uv.push(e.inquiry_success_uv);
                            APPInnerHtmlSeries.date.push(e.date);
                            Queried[4]=1;
                            break;
                        case 'submit_success_uv':
                            uv.APP内页.push(e.submit_success_uv);
                            APPInnerHtmlSeries.uv.push(e.submit_success_uv);
                            APPInnerHtmlSeries.date.push(e.date);
                            Queried[4]=1;
                            break;
                        case 'trade_success_uv':
                            uv.APP内页.push(e.trade_success_uv);
                            APPInnerHtmlSeries.uv.push(e.trade_success_uv);
                            APPInnerHtmlSeries.date.push(e.date);
                            Queried[4]=1;
                            break;
                        case 'select_machine_uv':
                            uv.APP内页.push(e.select_machine_uv);
                            APPInnerHtmlSeries.uv.push(e.select_machine_uv);
                            APPInnerHtmlSeries.date.push(e.date);
                            Queried[4]=1;
                            break;
                        case 'inquiry_uv_rate':
                            uv.APP内页.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            APPInnerHtmlSeries.uv.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            APPInnerHtmlSeries.date.push(e.date);
                            Queried[4]=1;
                            break;
                        case 'inquiry_success_uv_rate':
                            uv.APP内页.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            APPInnerHtmlSeries.uv.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            APPInnerHtmlSeries.date.push(e.date);
                            Queried[4]=1;
                            break;
                        case 'submit_inquiry_rate':
                            uv.APP内页.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            APPInnerHtmlSeries.uv.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            APPInnerHtmlSeries.date.push(e.date);
                            Queried[4]=1;
                            break;
                        case 'submit_uv_rate':
                            uv.APP内页.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            APPInnerHtmlSeries.uv.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            APPInnerHtmlSeries.date.push(e.date);
                            Queried[4]=1;
                            break;
                        case 'submit_success_cnt':
                            uv.APP内页.push(e.submit_success_cnt);
                            APPInnerHtmlSeries.uv.push(e.submit_success_cnt);
                            APPInnerHtmlSeries.date.push(e.date);
                            Queried[4]=1;
                            break;
                        case 'trade_success_cnt':
                            uv.APP内页.push(e.trade_success_cnt);
                            APPInnerHtmlSeries.uv.push(e.trade_success_cnt);
                            APPInnerHtmlSeries.date.push(e.date);
                            Queried[4]=1;
                            break;
                        case 'trade_submit_rate':
                            uv.APP内页.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            APPInnerHtmlSeries.uv.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            APPInnerHtmlSeries.date.push(e.date);
                            Queried[4]=1;
                            break;
                        case 'trade_num':
                            uv.APP内页.push(e.trade_num);
                            APPInnerHtmlSeries.uv.push(e.trade_num);
                            APPInnerHtmlSeries.date.push(e.date);
                            Queried[4]=1;
                            break;
                        case 'per_trade_num':
                            uv.APP内页.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            APPInnerHtmlSeries.uv.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            APPInnerHtmlSeries.date.push(e.date);
                            Queried[4]=1;
                            break;
                    }
                    break;
                case '合作':
                    switch (datatype) {
                        case 'uv':
                            uv.合作.push(e.uv);
                            TeamSeries.uv.push(e.uv);
                            TeamSeries.date.push(e.date);
                            Queried[5]=1;
                            break;
                        case 'inquiry_uv':
                            uv.合作.push(e.inquiry_uv);
                            TeamSeries.uv.push(e.inquiry_uv);
                            TeamSeries.date.push(e.date);
                            Queried[5]=1;
                            break;
                        case 'inquiry_success_uv':
                            uv.合作.push(e.inquiry_success_uv);
                            TeamSeries.uv.push(e.inquiry_success_uv);
                            TeamSeries.date.push(e.date);
                            Queried[5]=1;
                            break;
                        case 'submit_success_uv':
                            uv.合作.push(e.submit_success_uv);
                            TeamSeries.uv.push(e.submit_success_uv);
                            TeamSeries.date.push(e.date);
                            Queried[5]=1;
                            break;
                        case 'trade_success_uv':
                            uv.合作.push(e.trade_success_uv);
                            TeamSeries.uv.push(e.trade_success_uv);
                            TeamSeries.date.push(e.date);
                            Queried[5]=1;
                            break;
                        case 'select_machine_uv':
                            uv.合作.push(e.select_machine_uv);
                            TeamSeries.uv.push(e.select_machine_uv);
                            TeamSeries.date.push(e.date);
                            Queried[5]=1;
                            break;
                        case 'inquiry_uv_rate':
                            uv.合作.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            TeamSeries.uv.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            TeamSeries.date.push(e.date);
                            Queried[5]=1;
                            break;
                        case 'inquiry_success_uv_rate':
                            uv.合作.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            TeamSeries.uv.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            TeamSeries.date.push(e.date);
                            Queried[5]=1;
                            break;
                        case 'submit_inquiry_rate':
                            uv.合作.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            TeamSeries.uv.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            TeamSeries.date.push(e.date);
                            Queried[5]=1;
                            break;
                        case 'submit_uv_rate':
                            uv.合作.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            TeamSeries.uv.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            TeamSeries.date.push(e.date);
                            Queried[5]=1;
                            break;
                        case 'submit_success_cnt':
                            uv.合作.push(e.submit_success_cnt);
                            TeamSeries.uv.push(e.submit_success_cnt);
                            TeamSeries.date.push(e.date);
                            Queried[5]=1;
                            break;
                        case 'trade_success_cnt':
                            uv.合作.push(e.trade_success_cnt);
                            TeamSeries.uv.push(e.trade_success_cnt);
                            TeamSeries.date.push(e.date);
                            Queried[5]=1;
                            break;
                        case 'trade_submit_rate':
                            uv.合作.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            TeamSeries.uv.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            TeamSeries.date.push(e.date);
                            Queried[5]=1;
                            break;
                        case 'trade_num':
                            uv.合作.push(e.trade_num);
                            TeamSeries.uv.push(e.trade_num);
                            TeamSeries.date.push(e.date);
                            Queried[5]=1;
                            break;
                        case 'per_trade_num':
                            uv.合作.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            TeamSeries.uv.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            TeamSeries.date.push(e.date);
                            Queried[5]=1;
                            break;
                    }
                    break;
                case '其他渠道':
                    switch (datatype) {
                        case 'uv':
                            uv.其他渠道.push(e.uv);
                            OtherSeries.uv.push(e.uv);
                            OtherSeries.date.push(e.date);
                            Queried[6]=1;
                            break;
                        case 'inquiry_uv':
                            uv.其他渠道.push(e.inquiry_uv);
                            OtherSeries.uv.push(e.inquiry_uv);
                            OtherSeries.date.push(e.date);
                            Queried[6]=1;
                            break;
                        case 'inquiry_success_uv':
                            uv.其他渠道.push(e.inquiry_success_uv);
                            OtherSeries.uv.push(e.inquiry_success_uv);
                            OtherSeries.date.push(e.date);
                            Queried[6]=1;
                            break;
                        case 'submit_success_uv':
                            uv.其他渠道.push(e.submit_success_uv);
                            OtherSeries.uv.push(e.submit_success_uv);
                            OtherSeries.date.push(e.date);
                            Queried[6]=1;
                            break;
                        case 'trade_success_uv':
                            uv.其他渠道.push(e.trade_success_uv);
                            OtherSeries.uv.push(e.trade_success_uv);
                            OtherSeries.date.push(e.date);
                            Queried[6]=1;
                            break;
                        case 'select_machine_uv':
                            uv.其他渠道.push(e.select_machine_uv);
                            OtherSeries.uv.push(e.select_machine_uv);
                            OtherSeries.date.push(e.date);
                            Queried[6]=1;
                            break;
                        case 'inquiry_uv_rate':
                            uv.其他渠道.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            OtherSeries.uv.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            OtherSeries.date.push(e.date);
                            Queried[6]=1;
                            break;
                        case 'inquiry_success_uv_rate':
                            uv.其他渠道.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            OtherSeries.uv.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            OtherSeries.date.push(e.date);
                            Queried[6]=1;
                            break;
                        case 'submit_inquiry_rate':
                            uv.其他渠道.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            OtherSeries.uv.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            OtherSeries.date.push(e.date);
                            Queried[6]=1;
                            break;
                        case 'submit_uv_rate':
                            uv.其他渠道.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            OtherSeries.uv.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            OtherSeries.date.push(e.date);
                            Queried[6]=1;
                            break;
                        case 'submit_success_cnt':
                            uv.其他渠道.push(e.submit_success_cnt);
                            OtherSeries.uv.push(e.submit_success_cnt);
                            OtherSeries.date.push(e.date);
                            Queried[6]=1;
                            break;
                        case 'trade_success_cnt':
                            uv.其他渠道.push(e.trade_success_cnt);
                            OtherSeries.uv.push(e.trade_success_cnt);
                            OtherSeries.date.push(e.date);
                            Queried[6]=1;
                            break;
                        case 'trade_submit_rate':
                            uv.其他渠道.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            OtherSeries.uv.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            OtherSeries.date.push(e.date);
                            Queried[6]=1;
                            break;
                        case 'trade_num':
                            uv.其他渠道.push(e.trade_num);
                            OtherSeries.uv.push(e.trade_num);
                            OtherSeries.date.push(e.date);
                            Queried[6]=1;
                            break;
                        case 'per_trade_num':
                            uv.其他渠道.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            OtherSeries.uv.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            OtherSeries.date.push(e.date);
                            Queried[6]=1;
                            break;
                    }
                    break;
                case '直接访问':
                    switch (datatype) {
                        case 'uv':
                            uv.直接访问.push(e.uv);
                            DirectSeries.uv.push(e.uv);
                            DirectSeries.date.push(e.date);
                            Queried[7]=1;
                            break;
                        case 'inquiry_uv':
                            uv.直接访问.push(e.inquiry_uv);
                            DirectSeries.uv.push(e.inquiry_uv);
                            DirectSeries.date.push(e.date);
                            Queried[7]=1;
                            break;
                        case 'inquiry_success_uv':
                            uv.直接访问.push(e.inquiry_success_uv);
                            DirectSeries.uv.push(e.inquiry_success_uv);
                            DirectSeries.date.push(e.date);
                            Queried[7]=1;
                            break;
                        case 'submit_success_uv':
                            uv.直接访问.push(e.submit_success_uv);
                            DirectSeries.uv.push(e.submit_success_uv);
                            DirectSeries.date.push(e.date);
                            Queried[7]=1;
                            break;
                        case 'trade_success_uv':
                            uv.直接访问.push(e.trade_success_uv);
                            DirectSeries.uv.push(e.trade_success_uv);
                            DirectSeries.date.push(e.date);
                            Queried[7]=1;
                            break;
                        case 'select_machine_uv':
                            uv.直接访问.push(e.select_machine_uv);
                            DirectSeries.uv.push(e.select_machine_uv);
                            DirectSeries.date.push(e.date);
                            Queried[7]=1;
                            break;
                        case 'inquiry_uv_rate':
                            uv.直接访问.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            DirectSeries.uv.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            DirectSeries.date.push(e.date);
                            Queried[7]=1;
                            break;
                        case 'inquiry_success_uv_rate':
                            uv.直接访问.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            DirectSeries.uv.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            DirectSeries.date.push(e.date);
                            Queried[7]=1;
                            break;
                        case 'submit_inquiry_rate':
                            uv.直接访问.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            DirectSeries.uv.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            DirectSeries.date.push(e.date);
                            Queried[7]=1;
                            break;
                        case 'submit_uv_rate':
                            uv.直接访问.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            DirectSeries.uv.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            DirectSeries.date.push(e.date);
                            Queried[7]=1;
                            break;
                        case 'submit_success_cnt':
                            uv.直接访问.push(e.submit_success_cnt);
                            DirectSeries.uv.push(e.submit_success_cnt);
                            DirectSeries.date.push(e.date);
                            Queried[7]=1;
                            break;
                        case 'trade_success_cnt':
                            uv.直接访问.push(e.trade_success_cnt);
                            DirectSeries.uv.push(e.trade_success_cnt);
                            DirectSeries.date.push(e.date);
                            Queried[7]=1;
                            break;
                        case 'trade_submit_rate':
                            uv.直接访问.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            DirectSeries.uv.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            DirectSeries.date.push(e.date);
                            Queried[7]=1;
                            break;
                        case 'trade_num':
                            uv.直接访问.push(e.trade_num);
                            DirectSeries.uv.push(e.trade_num);
                            DirectSeries.date.push(e.date);
                            Queried[7]=1;
                            break;
                        case 'per_trade_num':
                            uv.直接访问.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            DirectSeries.uv.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            DirectSeries.date.push(e.date);
                            Queried[7]=1;
                            break;
                    }
                    break;
                case '召回':
                    switch (datatype) {
                        case 'uv':
                            uv.召回.push(e.uv);
                            RecallSeries.uv.push(e.uv);
                            RecallSeries.date.push(e.date);
                            Queried[8]=1;
                            break;
                        case 'inquiry_uv':
                            uv.召回.push(e.inquiry_uv);
                            RecallSeries.uv.push(e.inquiry_uv);
                            RecallSeries.date.push(e.date);
                            Queried[8]=1;
                            break;
                        case 'inquiry_success_uv':
                            uv.召回.push(e.inquiry_success_uv);
                            RecallSeries.uv.push(e.inquiry_success_uv);
                            RecallSeries.date.push(e.date);
                            Queried[8]=1;
                            break;
                        case 'submit_success_uv':
                            uv.召回.push(e.submit_success_uv);
                            RecallSeries.uv.push(e.submit_success_uv);
                            RecallSeries.date.push(e.date);
                            Queried[8]=1;
                            break;
                        case 'trade_success_uv':
                            uv.召回.push(e.trade_success_uv);
                            RecallSeries.uv.push(e.trade_success_uv);
                            RecallSeries.date.push(e.date);
                            Queried[8]=1;
                            break;
                        case 'select_machine_uv':
                            uv.召回.push(e.select_machine_uv);
                            RecallSeries.uv.push(e.select_machine_uv);
                            RecallSeries.date.push(e.date);
                            Queried[8]=1;
                            break;
                        case 'inquiry_uv_rate':
                            uv.召回.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            RecallSeries.uv.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            RecallSeries.date.push(e.date);
                            Queried[8]=1;
                            break;
                        case 'inquiry_success_uv_rate':
                            uv.召回.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            RecallSeries.uv.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            RecallSeries.date.push(e.date);
                            Queried[8]=1;
                            break;
                        case 'submit_inquiry_rate':
                            uv.召回.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            RecallSeries.uv.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            RecallSeries.date.push(e.date);
                            Queried[8]=1;
                            break;
                        case 'submit_uv_rate':
                            uv.召回.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            RecallSeries.uv.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            RecallSeries.date.push(e.date);
                            Queried[8]=1;
                            break;
                        case 'submit_success_cnt':
                            uv.召回.push(e.submit_success_cnt);
                            RecallSeries.uv.push(e.submit_success_cnt);
                            RecallSeries.date.push(e.date);
                            Queried[8]=1;
                            break;
                        case 'trade_success_cnt':
                            uv.召回.push(e.trade_success_cnt);
                            RecallSeries.uv.push(e.trade_success_cnt);
                            RecallSeries.date.push(e.date);
                            Queried[8]=1;
                            break;
                        case 'trade_submit_rate':
                            uv.召回.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            RecallSeries.uv.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            RecallSeries.date.push(e.date);
                            Queried[8]=1;
                            break;
                        case 'trade_num':
                            uv.召回.push(e.trade_num);
                            RecallSeries.uv.push(e.trade_num);
                            RecallSeries.date.push(e.date);
                            Queried[8]=1;
                            break;
                        case 'per_trade_num':
                            uv.召回.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            RecallSeries.uv.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            RecallSeries.date.push(e.date);
                            Queried[8]=1;
                            break;
                    }
                    break;
                case '小程序内页':
                    switch (datatype) {
                        case 'uv':
                            uv.小程序内页.push(e.uv);
                            SmartInnerHtmlSeries.uv.push(e.uv);
                            SmartInnerHtmlSeries.date.push(e.date);
                            Queried[9]=1;
                            break;
                        case 'inquiry_uv':
                            uv.小程序内页.push(e.inquiry_uv);
                            SmartInnerHtmlSeries.uv.push(e.inquiry_uv);
                            SmartInnerHtmlSeries.date.push(e.date);
                            Queried[9]=1;
                            break;
                        case 'inquiry_success_uv':
                            uv.小程序内页.push(e.inquiry_success_uv);
                            SmartInnerHtmlSeries.uv.push(e.inquiry_success_uv);
                            SmartInnerHtmlSeries.date.push(e.date);
                            Queried[9]=1;
                            break;
                        case 'submit_success_uv':
                            uv.小程序内页.push(e.submit_success_uv);
                            SmartInnerHtmlSeries.uv.push(e.submit_success_uv);
                            SmartInnerHtmlSeries.date.push(e.date);
                            Queried[9]=1;
                            break;
                        case 'trade_success_uv':
                            uv.小程序内页.push(e.trade_success_uv);
                            SmartInnerHtmlSeries.uv.push(e.trade_success_uv);
                            SmartInnerHtmlSeries.date.push(e.date);
                            Queried[9]=1;
                            break;
                        case 'select_machine_uv':
                            uv.小程序内页.push(e.select_machine_uv);
                            SmartInnerHtmlSeries.uv.push(e.select_machine_uv);
                            SmartInnerHtmlSeries.date.push(e.date);
                            Queried[9]=1;
                            break;
                        case 'inquiry_uv_rate':
                            uv.小程序内页.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            SmartInnerHtmlSeries.uv.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            SmartInnerHtmlSeries.date.push(e.date);
                            Queried[9]=1;
                            break;
                        case 'inquiry_success_uv_rate':
                            uv.小程序内页.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            SmartInnerHtmlSeries.uv.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            SmartInnerHtmlSeries.date.push(e.date);
                            Queried[9]=1;
                            break;
                        case 'submit_inquiry_rate':
                            uv.小程序内页.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            SmartInnerHtmlSeries.uv.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            SmartInnerHtmlSeries.date.push(e.date);
                            Queried[9]=1;
                            break;
                        case 'submit_uv_rate':
                            uv.小程序内页.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            SmartInnerHtmlSeries.uv.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            SmartInnerHtmlSeries.date.push(e.date);
                            Queried[9]=1;
                            break;
                        case 'submit_success_cnt':
                            uv.小程序内页.push(e.submit_success_cnt);
                            SmartInnerHtmlSeries.uv.push(e.submit_success_cnt);
                            SmartInnerHtmlSeries.date.push(e.date);
                            Queried[9]=1;
                            break;
                        case 'trade_success_cnt':
                            uv.小程序内页.push(e.trade_success_cnt);
                            SmartInnerHtmlSeries.uv.push(e.trade_success_cnt);
                            SmartInnerHtmlSeries.date.push(e.date);
                            Queried[9]=1;
                            break;
                        case 'trade_submit_rate':
                            uv.小程序内页.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            SmartInnerHtmlSeries.uv.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            SmartInnerHtmlSeries.date.push(e.date);
                            Queried[9]=1;
                            break;
                        case 'trade_num':
                            uv.小程序内页.push(e.trade_num);
                            SmartInnerHtmlSeries.uv.push(e.trade_num);
                            SmartInnerHtmlSeries.date.push(e.date);
                            Queried[9]=1;
                            break;
                        case 'per_trade_num':
                            uv.小程序内页.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            SmartInnerHtmlSeries.uv.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            SmartInnerHtmlSeries.date.push(e.date);
                            Queried[9]=1;
                            break;
                    }
                    break;
                case '新渠道':
                    switch (datatype) {
                        case 'uv':
                            uv.新渠道.push(e.uv);
                            NewChannelSeries.uv.push(e.uv);
                            NewChannelSeries.date.push(e.date);
                            Queried[10]=1;
                            break;
                        case 'inquiry_uv':
                            uv.新渠道.push(e.inquiry_uv);
                            NewChannelSeries.uv.push(e.inquiry_uv);
                            NewChannelSeries.date.push(e.date);
                            Queried[10]=1;
                            break;
                        case 'inquiry_success_uv':
                            uv.新渠道.push(e.inquiry_success_uv);
                            NewChannelSeries.uv.push(e.inquiry_success_uv);
                            NewChannelSeries.date.push(e.date);
                            Queried[10]=1;
                            break;
                        case 'submit_success_uv':
                            uv.新渠道.push(e.submit_success_uv);
                            NewChannelSeries.uv.push(e.submit_success_uv);
                            NewChannelSeries.date.push(e.date);
                            Queried[10]=1;
                            break;
                        case 'trade_success_uv':
                            uv.新渠道.push(e.trade_success_uv);
                            NewChannelSeries.uv.push(e.trade_success_uv);
                            NewChannelSeries.date.push(e.date);
                            Queried[10]=1;
                            break;
                        case 'select_machine_uv':
                            uv.新渠道.push(e.select_machine_uv);
                            NewChannelSeries.uv.push(e.select_machine_uv);
                            NewChannelSeries.date.push(e.date);
                            Queried[10]=1;
                            break;
                        case 'inquiry_uv_rate':
                            uv.新渠道.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            NewChannelSeries.uv.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            NewChannelSeries.date.push(e.date);
                            Queried[10]=1;
                            break;
                        case 'inquiry_success_uv_rate':
                            uv.新渠道.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            NewChannelSeries.uv.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            NewChannelSeries.date.push(e.date);
                            Queried[10]=1;
                            break;
                        case 'submit_inquiry_rate':
                            uv.新渠道.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            NewChannelSeries.uv.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            NewChannelSeries.date.push(e.date);
                            Queried[10]=1;
                            break;
                        case 'submit_uv_rate':
                            uv.新渠道.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            NewChannelSeries.uv.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            NewChannelSeries.date.push(e.date);
                            Queried[10]=1;
                            break;
                        case 'submit_success_cnt':
                            uv.新渠道.push(e.submit_success_cnt);
                            NewChannelSeries.uv.push(e.submit_success_cnt);
                            NewChannelSeries.date.push(e.date);
                            Queried[10]=1;
                            break;
                        case 'trade_success_cnt':
                            uv.新渠道.push(e.trade_success_cnt);
                            NewChannelSeries.uv.push(e.trade_success_cnt);
                            NewChannelSeries.date.push(e.date);
                            Queried[10]=1;
                            break;
                        case 'trade_submit_rate':
                            uv.新渠道.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            NewChannelSeries.uv.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            NewChannelSeries.date.push(e.date);
                            Queried[10]=1;
                            break;
                        case 'trade_num':
                            uv.新渠道.push(e.trade_num);
                            NewChannelSeries.uv.push(e.trade_num);
                            NewChannelSeries.date.push(e.date);
                            Queried[10]=1;
                            break;
                        case 'per_trade_num':
                            uv.新渠道.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            NewChannelSeries.uv.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            NewChannelSeries.date.push(e.date);
                            Queried[10]=1;
                            break;
                    }
                    break;
                case 'SEO':
                    switch (datatype) {
                        case 'uv':
                            uv.SEO.push(e.uv);
                            SEOSeries.uv.push(e.uv);
                            SEOSeries.date.push(e.date);
                            Queried[11]=1;
                            break;
                        case 'inquiry_uv':
                            uv.SEO.push(e.inquiry_uv);
                            SEOSeries.uv.push(e.inquiry_uv);
                            SEOSeries.date.push(e.date);
                            Queried[11]=1;
                            break;
                        case 'inquiry_success_uv':
                            uv.SEO.push(e.inquiry_success_uv);
                            SEOSeries.uv.push(e.inquiry_success_uv);
                            SEOSeries.date.push(e.date);
                            Queried[11]=1;
                            break;
                        case 'submit_success_uv':
                            uv.SEO.push(e.submit_success_uv);
                            SEOSeries.uv.push(e.submit_success_uv);
                            SEOSeries.date.push(e.date);
                            Queried[11]=1;
                            break;
                        case 'trade_success_uv':
                            uv.SEO.push(e.trade_success_uv);
                            SEOSeries.uv.push(e.trade_success_uv);
                            SEOSeries.date.push(e.date);
                            Queried[11]=1;
                            break;
                        case 'select_machine_uv':
                            uv.SEO.push(e.select_machine_uv);
                            SEOSeries.uv.push(e.select_machine_uv);
                            SEOSeries.date.push(e.date);
                            Queried[11]=1;
                            break;
                        case 'inquiry_uv_rate':
                            uv.SEO.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            SEOSeries.uv.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            SEOSeries.date.push(e.date);
                            Queried[11]=1;
                            break;
                        case 'inquiry_success_uv_rate':
                            uv.SEO.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            SEOSeries.uv.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            SEOSeries.date.push(e.date);
                            Queried[11]=1;
                            break;
                        case 'submit_inquiry_rate':
                            uv.SEO.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            SEOSeries.uv.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            SEOSeries.date.push(e.date);
                            Queried[11]=1;
                            break;
                        case 'submit_uv_rate':
                            uv.SEO.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            SEOSeries.uv.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            SEOSeries.date.push(e.date);
                            Queried[11]=1;
                            break;
                        case 'submit_success_cnt':
                            uv.SEO.push(e.submit_success_cnt);
                            SEOSeries.uv.push(e.submit_success_cnt);
                            SEOSeries.date.push(e.date);
                            Queried[11]=1;
                            break;
                        case 'trade_success_cnt':
                            uv.SEO.push(e.trade_success_cnt);
                            SEOSeries.uv.push(e.trade_success_cnt);
                            SEOSeries.date.push(e.date);
                            Queried[11]=1;
                            break;
                        case 'trade_submit_rate':
                            uv.SEO.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            SEOSeries.uv.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            SEOSeries.date.push(e.date);
                            Queried[11]=1;
                            break;
                        case 'trade_num':
                            uv.SEO.push(e.trade_num);
                            SEOSeries.uv.push(e.trade_num);
                            SEOSeries.date.push(e.date);
                            Queried[11]=1;
                            break;
                        case 'per_trade_num':
                            uv.SEO.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            SEOSeries.uv.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            SEOSeries.date.push(e.date);
                            Queried[11]=1;
                            break;
                    }
                    break;
                case '微信公众号':
                    switch (datatype) {
                        case 'uv':
                            uv.微信公众号.push(e.uv);
                            WeixinPublicSeries.uv.push(e.uv);
                            WeixinPublicSeries.date.push(e.date);
                            Queried[12]=1;
                            break;
                        case 'inquiry_uv':
                            uv.微信公众号.push(e.inquiry_uv);
                            WeixinPublicSeries.uv.push(e.inquiry_uv);
                            WeixinPublicSeries.date.push(e.date);
                            Queried[12]=1;
                            break;
                        case 'inquiry_success_uv':
                            uv.微信公众号.push(e.inquiry_success_uv);
                            WeixinPublicSeries.uv.push(e.inquiry_success_uv);
                            WeixinPublicSeries.date.push(e.date);
                            Queried[12]=1;
                            break;
                        case 'submit_success_uv':
                            uv.微信公众号.push(e.submit_success_uv);
                            WeixinPublicSeries.uv.push(e.submit_success_uv);
                            WeixinPublicSeries.date.push(e.date);
                            Queried[12]=1;
                            break;
                        case 'trade_success_uv':
                            uv.微信公众号.push(e.trade_success_uv);
                            WeixinPublicSeries.uv.push(e.trade_success_uv);
                            WeixinPublicSeries.date.push(e.date);
                            Queried[12]=1;
                            break;
                        case 'select_machine_uv':
                            uv.微信公众号.push(e.select_machine_uv);
                            WeixinPublicSeries.uv.push(e.select_machine_uv);
                            WeixinPublicSeries.date.push(e.date);
                            Queried[12]=1;
                            break;
                        case 'inquiry_uv_rate':
                            uv.微信公众号.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            WeixinPublicSeries.uv.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            WeixinPublicSeries.date.push(e.date);
                            Queried[12]=1;
                            break;
                        case 'inquiry_success_uv_rate':
                            uv.微信公众号.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            WeixinPublicSeries.uv.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            WeixinPublicSeries.date.push(e.date);
                            Queried[12]=1;
                            break;
                        case 'submit_inquiry_rate':
                            uv.微信公众号.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            WeixinPublicSeries.uv.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            WeixinPublicSeries.date.push(e.date);
                            Queried[12]=1;
                            break;
                        case 'submit_uv_rate':
                            uv.微信公众号.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            WeixinPublicSeries.uv.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            WeixinPublicSeries.date.push(e.date);
                            Queried[12]=1;
                            break;
                        case 'submit_success_cnt':
                            uv.微信公众号.push(e.submit_success_cnt);
                            WeixinPublicSeries.uv.push(e.submit_success_cnt);
                            WeixinPublicSeries.date.push(e.date);
                            Queried[12]=1;
                            break;
                        case 'trade_success_cnt':
                            uv.微信公众号.push(e.trade_success_cnt);
                            WeixinPublicSeries.uv.push(e.trade_success_cnt);
                            WeixinPublicSeries.date.push(e.date);
                            Queried[12]=1;
                            break;
                        case 'trade_submit_rate':
                            uv.微信公众号.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            WeixinPublicSeries.uv.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            WeixinPublicSeries.date.push(e.date);
                            Queried[12]=1;
                            break;
                        case 'trade_num':
                            uv.微信公众号.push(e.trade_num);
                            WeixinPublicSeries.uv.push(e.trade_num);
                            WeixinPublicSeries.date.push(e.date);
                            Queried[12]=1;
                            break;
                        case 'per_trade_num':
                            uv.微信公众号.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            WeixinPublicSeries.uv.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            WeixinPublicSeries.date.push(e.date);
                            Queried[12]=1;
                            break;
                    }
                    break;
                case '老带新':
                    switch (datatype) {
                        case 'uv':
                            uv.老带新.push(e.uv);
                            OldToNewSeries.uv.push(e.uv);
                            OldToNewSeries.date.push(e.date);
                            Queried[13]=1;
                            break;
                        case 'inquiry_uv':
                            uv.老带新.push(e.inquiry_uv);
                            OldToNewSeries.uv.push(e.inquiry_uv);
                            OldToNewSeries.date.push(e.date);
                            Queried[13]=1;
                            break;
                        case 'inquiry_success_uv':
                            uv.老带新.push(e.inquiry_success_uv);
                            OldToNewSeries.uv.push(e.inquiry_success_uv);
                            OldToNewSeries.date.push(e.date);
                            Queried[13]=1;
                            break;
                        case 'submit_success_uv':
                            uv.老带新.push(e.submit_success_uv);
                            OldToNewSeries.uv.push(e.submit_success_uv);
                            OldToNewSeries.date.push(e.date);
                            Queried[13]=1;
                            break;
                        case 'trade_success_uv':
                            uv.老带新.push(e.trade_success_uv);
                            OldToNewSeries.uv.push(e.trade_success_uv);
                            OldToNewSeries.date.push(e.date);
                            Queried[13]=1;
                            break;
                        case 'select_machine_uv':
                            uv.老带新.push(e.select_machine_uv);
                            OldToNewSeries.uv.push(e.select_machine_uv);
                            OldToNewSeries.date.push(e.date);
                            Queried[13]=1;
                            break;
                        case 'inquiry_uv_rate':
                            uv.老带新.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            OldToNewSeries.uv.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            OldToNewSeries.date.push(e.date);
                            Queried[13]=1;
                            break;
                        case 'inquiry_success_uv_rate':
                            uv.老带新.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            OldToNewSeries.uv.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            OldToNewSeries.date.push(e.date);
                            Queried[13]=1;
                            break;
                        case 'submit_inquiry_rate':
                            uv.老带新.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            OldToNewSeries.uv.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            OldToNewSeries.date.push(e.date);
                            Queried[13]=1;
                            break;
                        case 'submit_uv_rate':
                            uv.老带新.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            OldToNewSeries.uv.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            OldToNewSeries.date.push(e.date);
                            Queried[13]=1;
                            break;
                        case 'submit_success_cnt':
                            uv.老带新.push(e.submit_success_cnt);
                            OldToNewSeries.uv.push(e.submit_success_cnt);
                            OldToNewSeries.date.push(e.date);
                            Queried[13]=1;
                            break;
                        case 'trade_success_cnt':
                            uv.老带新.push(e.trade_success_cnt);
                            OldToNewSeries.uv.push(e.trade_success_cnt);
                            OldToNewSeries.date.push(e.date);
                            Queried[13]=1;
                            break;
                        case 'trade_submit_rate':
                            uv.老带新.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            OldToNewSeries.uv.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            OldToNewSeries.date.push(e.date);
                            Queried[13]=1;
                            break;
                        case 'trade_num':
                            uv.老带新.push(e.trade_num);
                            OldToNewSeries.uv.push(e.trade_num);
                            OldToNewSeries.date.push(e.date);
                            Queried[13]=1;
                            break;
                        case 'per_trade_num':
                            uv.老带新.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            OldToNewSeries.uv.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            OldToNewSeries.date.push(e.date);
                            Queried[13]=1;
                            break;
                    }
                    break;
                case '线下门店':
                    switch (datatype) {
                        case 'uv':
                            uv.线下门店.push(e.uv);
                            StoreSeries.uv.push(e.uv);
                            StoreSeries.date.push(e.date);
                            Queried[14]=1;
                            break;
                        case 'inquiry_uv':
                            uv.线下门店.push(e.inquiry_uv);
                            StoreSeries.uv.push(e.inquiry_uv);
                            StoreSeries.date.push(e.date);
                            Queried[14]=1;
                            break;
                        case 'inquiry_success_uv':
                            uv.线下门店.push(e.inquiry_success_uv);
                            StoreSeries.uv.push(e.inquiry_success_uv);
                            StoreSeries.date.push(e.date);
                            Queried[14]=1;
                            break;
                        case 'submit_success_uv':
                            uv.线下门店.push(e.submit_success_uv);
                            StoreSeries.uv.push(e.submit_success_uv);
                            StoreSeries.date.push(e.date);
                            Queried[14]=1;
                            break;
                        case 'trade_success_uv':
                            uv.线下门店.push(e.trade_success_uv);
                            StoreSeries.uv.push(e.trade_success_uv);
                            StoreSeries.date.push(e.date);
                            Queried[14]=1;
                            break;
                        case 'select_machine_uv':
                            uv.线下门店.push(e.select_machine_uv);
                            StoreSeries.uv.push(e.select_machine_uv);
                            StoreSeries.date.push(e.date);
                            Queried[14]=1;
                            break;
                        case 'inquiry_uv_rate':
                            uv.线下门店.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            StoreSeries.uv.push(e.uv==0?0:((e.inquiry_uv/ e.uv)*100).toFixed(2));
                            StoreSeries.date.push(e.date);
                            Queried[14]=1;
                            break;
                        case 'inquiry_success_uv_rate':
                            uv.线下门店.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            StoreSeries.uv.push(e.inquiry_uv==0?0:((e.inquiry_success_uv/ e.inquiry_uv)*100).toFixed(2));
                            StoreSeries.date.push(e.date);
                            Queried[14]=1;
                            break;
                        case 'submit_inquiry_rate':
                            uv.线下门店.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            StoreSeries.uv.push(e.inquiry_success_uv==0?0:((e.submit_success_uv/ e.inquiry_success_uv)*100).toFixed(2));
                            StoreSeries.date.push(e.date);
                            Queried[14]=1;
                            break;
                        case 'submit_uv_rate':
                            uv.线下门店.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            StoreSeries.uv.push(e.uv==0?0:((e.submit_success_uv/ e.uv)*100).toFixed(2));
                            StoreSeries.date.push(e.date);
                            Queried[14]=1;
                            break;
                        case 'submit_success_cnt':
                            uv.线下门店.push(e.submit_success_cnt);
                            StoreSeries.uv.push(e.submit_success_cnt);
                            StoreSeries.date.push(e.date);
                            Queried[14]=1;
                            break;
                        case 'trade_success_cnt':
                            uv.线下门店.push(e.trade_success_cnt);
                            StoreSeries.uv.push(e.trade_success_cnt);
                            StoreSeries.date.push(e.date);
                            Queried[14]=1;
                            break;
                        case 'trade_submit_rate':
                            uv.线下门店.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            StoreSeries.uv.push(e.submit_success_uv==0?0:((e.trade_success_uv/ e.submit_success_uv)*100).toFixed(2));
                            StoreSeries.date.push(e.date);
                            Queried[14]=1;
                            break;
                        case 'trade_num':
                            uv.线下门店.push(e.trade_num);
                            StoreSeries.uv.push(e.trade_num);
                            StoreSeries.date.push(e.date);
                            Queried[14]=1;
                            break;
                        case 'per_trade_num':
                            uv.线下门店.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            StoreSeries.uv.push(e.trade_success_cnt==0?0:(e.trade_num/ e.trade_success_cnt).toFixed(0));
                            StoreSeries.date.push(e.date);
                            Queried[14]=1;
                            break;
                    }
                    break;
            }
        }


    });
    date = date.unique();

    var option = {

        tooltip:{
            trigger: 'axis',
            formatter:function(params,ticket,callback){
                var str = params[0].name + '<br/>';
                params.forEach(function(obj){
                    if(($("#datatype :checked").text()).indexOf("率")>-1){
                        str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                    }else{
                        str += obj.seriesName + ' : ' + obj.value + '<br/>'
                    }
                });
                return str;
            }
        },
        legend:{
            data:['APP','SEM','小程序','APP内页','合作','其他渠道','直接访问','召回','小程序内页','新渠道','SEO','微信公众号','老带新','线下门店']
        },
        xAxis:{
            type:'category',
            data:date,
            axisTick:{
                alignWithLabel:true
            }
        },
        yAxis:{
            type:'value'
        },
        series:[
            {
                name:'APP',
                type:'line',
                data:APPSeries.uv
            },
            {
                name:'SEM',
                type:'line',
                data:SEMSeries.uv
            },
            {
                name:'小程序',
                type:'line',
                data:SmartProgramSeries.uv
            },
            {
                name:'APP内页',
                type:'line',
                data:APPInnerHtmlSeries.uv
            },
            {
                name:'合作',
                type:'line',
                data:TeamSeries.uv
            },
            {
                name:'其他渠道',
                type:'line',
                data:OtherSeries.uv
            },
            {
                name:'直接访问',
                type:'line',
                data:DirectSeries.uv
            },
            {
                name:'召回',
                type:'line',
                data:RecallSeries.uv
            },
            {
                name:'小程序内页',
                type:'line',
                data:SmartInnerHtmlSeries.uv
            },
            {
                name:'新渠道',
                type:'line',
                data:NewChannelSeries.uv
            },
            {
                name:'SEO',
                type:'line',
                data:SEOSeries.uv
            },
            {
                name:'微信公众号',
                type:'line',
                data:WeixinPublicSeries.uv
            },
            {
                name:'老带新',
                type:'line',
                data:OldToNewSeries.uv
            },
            {
                name:'线下门店',
                type:'line',
                data:StoreSeries.uv
            }
        ]
    };
    var uvchart = echarts.init(document.getElementById('uvlinechart'));
    uvchart.setOption(option);
    window.addEventListener('resize',uvchart.resize)
}




function renderTable(filter,objAll){
    var obj = objAll.total;
    var trade_rate = "";
    var trade_success_rate = "";
    var per_trade_cnt_num = "";
    var per_trade_num = "";
    var inquiry_rate="";
    var inquiry_success_uv_rate="";
    var inquiry_trade_rate="";
    var trade_trade_success_rate= "";//提交成交率
    if(obj.uv==0){
        trade_rate = "0.00%";
        trade_success_rate = "0.00%";
        inquiry_rate = "0.00%";
    }else{
        trade_rate =  ((obj.trade_uv/obj.uv)*100).toFixed(2)+"%";
        trade_success_rate = ((obj.trade_success_uv/obj.uv)*100).toFixed(2)+"%";
        inquiry_success_uv_rate = ((obj.inquiry_success_uv/obj.uv)*100).toFixed(2)+"%";
        inquiry_rate = ((obj.inquiry_uv/obj.uv)*100).toFixed(2)+"%";
    }

    if(obj.inquiry_success_uv==0){
        inquiry_trade_rate = "0.00%"
    }else{
        inquiry_trade_rate = ((obj.trade_uv/obj.inquiry_success_uv)*100).toFixed(2)+"%";
    }

    if(obj.trade_uv==0){
        per_trade_cnt_num = "0.00%";
        trade_trade_success_rate = "0.00%"
    }else{
        per_trade_cnt_num =  ((obj.trade_cnt_num/obj.trade_uv)*100).toFixed(2)+"%";
        trade_trade_success_rate = ((obj.trade_success_uv/obj.trade_uv)*100).toFixed(2)+"%"
    }

    if(obj.trade_success_cnt_num==0){
        per_trade_num = "0.00"
    }else{
        per_trade_num = ((obj.trade_success_amount_num/obj.trade_success_cnt_num)).toFixed(2)
    }

    var fixRow = '"<tr style="background-color: #acc087;"", " ", "", "", " data-index="0"", "", "", ">", "<td  style=""    >总数</td>","<td  style=""    >-</td>","<td  style=""    >-</td>", "<td  style=""    >-</td>","<td  style=""    >-</td>","<td  style=""    >-</td>", "<td  style=""    >-</td>", "<td  style=""    >-</td>", "<td  style=""    >-</td>","<td  style=""    >-</td>","<td  style=""    >-</td>", "<td  style=""    >'+obj.uv+'</td>",,"<td  style=""    >' + obj.select_machine_uv + '</td>" "<td  style=""    >'+obj.inquiry_uv+'</td>","<td  style=""    >' + obj.inquiry_success_uv + '</td>", "<td  style=""    >'+obj.trade_uv+'</td>","<td  style=""    >'+trade_rate+'</td>","<td  style=""    >'+inquiry_rate+'</td>", "<td  style=""    >'+inquiry_success_uv_rate+'</td>","<td  style=""    >'+inquiry_trade_rate+'</td>","<td  style=""    >'+obj.trade_cnt_num+'</td>","<td  style=""    >'+per_trade_cnt_num+'</td>","<td  style=""    >'+obj.trade_success_uv+'</td>", "<td  style=""    >'+obj.trade_success_cnt_num+'</td>", "<td  style=""    >'+trade_success_rate+'</td>","<td  style=""    >'+trade_trade_success_rate+'</td>", "<td  style=""    >'+obj.trade_success_amount_num+'</td>", "<td  style=""    >'+per_trade_num+'</td>", "</tr>"'
    var ajaxQuery = _.clone(filter);
    //渲染数据细分表格
    $('#marketingWebTrafficDataTable').bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        pagination: true,
        sidePagination: 'server',
        ajax:function(params){
            var ajaxParams = $.extend(ajaxQuery,params.data);
            //$("#ctable").hide();
            getMarketingWebTraffic(ajaxParams).done(function(data){
                //$("#ctable").show();
                params.success(data)
            });
        },
        fixRow:fixRow,
        cdataExport:"cdataExport",
        columns: [{
            field: 'date',
            title: '日期',
            sortable:true
        }, {
            field: 'userFlag',
            title: '用户类型'
        }, /*{
            field: 'recycleType',
            title: '回收方式',
            sortable:true
        }, */{
            field: 'areaName',
            title: '区域',
            sortable:true
        }, {
            field: 'cityName',
            title: '城市',
            sortable:true
        }, {
            field: 'platform',
            title: '平台',
            sortable:true
        }, {
            field: 'channelFirst',
            title: '渠道',
            sortable:true
        },  {
            field: 'channelSecond',
            title: '分支渠道',
            sortable:true
        },  {
            field: 'channelThird',
            title: '细分支渠道',
            sortable:true
        },  {
            field: 'source',
            title: 'source',
            sortable:true
        }, {
            field: 'medium',
            title: 'medium',
            sortable:true
        }, {
            field: 'campaign',
            title: 'campaign',
            sortable:true
        }, {
            field: 'uv',
            title: '总访客数',
            sortable:true
        },{
            field: 'select_machine_uv',
            title: '品牌选择页访客数',
            sortable:true
        }, {
            field: 'inquiry_uv',
            title: '询价访客数',
            sortable:true
        }, {
            field: 'inquiry_success_uv',
            title: '询价完成访客数',
            sortable:true
        },{
            field: 'trade_uv',
            title: '提交访客数',
            sortable:true
        }, {
            field: 'trade_rate',
            title: '提交转化率',
            formatter:function(value,row,index){
                if(row.uv==0){
                    return "0.00%"
                }
                return ((row.trade_uv/row.uv)*100).toFixed(2)+"%"
            }
        }, {
            field: 'inquiry_rate',
            title: '询价转化率',
            formatter:function(value,row,index){
                if(row.uv==0){
                    return "0.00%"
                }
                return ((row.inquiry_uv/row.uv)*100).toFixed(2)+"%"
            }
        },{
            field: 'inquiry_success_uv_rate',
            title: '询价完成转化率',
            formatter:function(value,row,index){
                if(row.uv==0){
                    return "0.00%"
                }
                return ((row.inquiry_success_uv/row.uv)*100).toFixed(2)+"%"
            }
        }, {
            field: 'inquiry_trade_rate',
            title: '提交询价完成率',
            formatter:function(value,row,index){
                if(row.inquiry_success_uv==0){
                    return "0.00%"
                }
                return ((row.trade_uv/row.inquiry_success_uv)*100).toFixed(2)+"%"
            }
        }, {
            field: 'trade_cnt_num',
            title: '订单提交量',
            sortable:true
        }, {
            field: 'per_trade_cnt_num',
            title: '人均提交量',
            formatter:function(value,row,index){
                if(row.trade_uv==0){
                    return "0.00%"
                }else{
                    return ((row.trade_cnt_num/row.trade_uv)*100).toFixed(2)+"%"
                }
            }
        }, {
            field: 'trade_success_uv',
            title: '成交用户数',
            sortable:true
        }, {
            field: 'trade_success_cnt_num',
            title: '订单成交量',
            sortable:true
        },{
            field: 'trade_success_rate',
            title: '成交转化率',
            formatter:function(value,row,index){
                if(row.uv==0){
                    return "0.00%"
                }
                return ((row.trade_success_uv/row.uv)*100).toFixed(2)+"%"
            }
        },{
            field: 'trade_trade_success_rate',
            title: '成交提交率',
            formatter:function(value,row,index){
                if(row.trade_uv==0){
                    return "0.00%"
                }
                return ((row.trade_success_uv/row.trade_uv)*100).toFixed(2)+"%"
            }
        },{
            field: 'trade_success_amount_num',
            title: '成交金额',
            sortable:true
        },{
            field: 'per_trade_num',
            title: '客单价',
            formatter:function(value,row,index){
                if(row.trade_success_cnt_num==0){
                    return "0.00"
                }
                return ((row.trade_success_amount_num/row.trade_success_cnt_num)).toFixed(2)
            }
        }],
    });



    $("#cdataExport").click(function(){
        var query = _.clone(filter);
        var sdt = moment(query.startDate);
        var edt = moment(query.endDate);
        var dflag = sdt.add(1,'month')<=edt;
        //query["dateType"]=="daily" &&
        if(dflag){
            alert("导出文件最长间隔时间为1个月!");
            return;
        }

        $("#wholePage").mask({'label':"请等待，文件正在导出..."});
        var flag = query["dateType"];
        delete query["dateType"];
        if(flag=="daily" || !flag){
            //console.log(query);
            requestURLPost(dataService+"/webTraffic/exportDailyMarketingWebTrafficData_newchannel_userflag_recycletype",query).done(function(obj){
                $("#wholePage").unmask();
                var url = Meteor.settings.public.downloadService.baseUrl+obj.fileName;
                var link = document.createElement("a");
                link.href = url;
                link.style = "visibility:hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        }else if(flag=="weekly"){
            requestURLPost(dataService+"/webTraffic/exportWeeklyMarketingWebTrafficData_newchannel_userflag_recycletype",query).done(function(obj){
                $("#wholePage").unmask();
                var url = Meteor.settings.public.downloadService.baseUrl+obj.fileName;
                var link = document.createElement("a");
                link.href = url;
                link.style = "visibility:hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        }else if(flag=="monthly"){
            requestURLPost(dataService+"/webTraffic/exportMonthlyMarketingWebTrafficData_newchannel_userflag_recycletype",query).done(function(obj){
                $("#wholePage").unmask();
                var url = Meteor.settings.public.downloadService.baseUrl+obj.fileName;
                var link = document.createElement("a");
                link.href = url;
                link.style = "visibility:hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        }
    });


    var dateList= objAll.dateList;
    var series = objAll.series;
    var tableJson = [];

    for(var i= 0,len=dateList.length;i<len;i++){
        var tmp = {
            "date":dateList[i],
            "uv":series.uv[i],
            "inquiry_uv":series.inquiry_uv[i],
            "inquiry_success_uv":series.inquiry_success_uv[i],
            "select_machine_uv":series.select_machine_uv[i],
            "trade_uv":series.trade_uv[i],
            "trade_cnt_num":series.trade_cnt_num[i],
            "trade_success_uv":series.trade_success_uv[i],
            "trade_success_cnt_num":series.trade_success_cnt_num[i],
            "trade_success_amount_num":series.trade_success_amount_num[i],

        };
        tableJson.push(tmp);
    }

    var fixRow2 = '"<tr style="background-color: #acc087;"", " ", "", "", " data-index="0"", "", "", ">", "<td  style=""    >总数</td>", "<td  style=""    >'+obj.uv+'</td>","<td  style=""    >'+obj.select_machine_uv+'</td>", "<td  style=""    >'+obj.inquiry_uv+'</td>","<td  style=""    >'+obj.inquiry_success_uv+'</td>","<td  style=""    >'+obj.trade_uv+'</td>","<td  style=""    >'+trade_rate+'</td>","<td  style=""    >'+inquiry_rate+'</td>","<td  style=""    >'+inquiry_success_uv_rate+'</td>","<td  style=""    >'+inquiry_trade_rate+'</td>","<td  style=""    >'+obj.trade_cnt_num+'</td>","<td  style=""    >'+per_trade_cnt_num+'</td>","<td  style=""    >'+obj.trade_success_uv+'</td>", "<td  style=""    >'+obj.trade_success_cnt_num+'</td>", "<td  style=""    >'+trade_success_rate+'</td>","<td  style=""    >'+trade_trade_success_rate+'</td>", "<td  style=""    >'+obj.trade_success_amount_num+'</td>", "<td  style=""    >'+per_trade_num+'</td>", "</tr>"'

    //渲染综合日报表格
    $('#marketingSummaryWebTrafficDataTable').bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        pagination: true,
        fixRow:fixRow2,
        data:tableJson,
        columns: [{
            field: 'date',
            title: '日期',
            sortable:true
        }, {
            field: 'uv',
            title: '总访客数',
            sortable:true
        },{
            field: 'select_machine_uv',
            title: '品牌选择页访客数',
            sortable:true
        }, {
            field: 'inquiry_uv',
            title: '询价访客数',
            sortable:true
        },{
            field: 'inquiry_success_uv',
            title: '询价完成访客数',
            sortable:true
        }, {
            field: 'trade_uv',
            title: '提交访客数',
            sortable:true
        }, {
            field: 'trade_rate',
            title: '提交转化率',
            formatter:function(value,row,index){
                if(row.uv==0){
                    return "0.00%"
                }
                return ((row.trade_uv/row.uv)*100).toFixed(2)+"%"
            }
        }, {
            field: 'inquiry_rate',
            title: '询价转化率',
            formatter:function(value,row,index){
                if(row.uv==0){
                    return "0.00%"
                }
                return ((row.inquiry_uv/row.uv)*100).toFixed(2)+"%"
            }
        },{
            field: 'inquiry_success_uv_rate',
            title: '询价完成转化率',
            formatter:function(value,row,index){
                if(row.uv==0){
                    return "0.00%"
                }
                return ((row.inquiry_success_uv/row.uv)*100).toFixed(2)+"%"
            }
        }, {
            field: 'inquiry_trade_rate',
            title: '提交询价完成率',
            formatter:function(value,row,index){
                if(row.inquiry_success_uv==0){
                    return "0.00%"
                }
                return ((row.trade_uv/row.inquiry_success_uv)*100).toFixed(2)+"%"
            }
        }, {
            field: 'trade_cnt_num',
            title: '订单提交量',
            sortable:true
        }, {
            field: 'per_trade_cnt_num',
            title: '人均提交量',
            formatter:function(value,row,index){
                if(row.trade_uv==0){
                    return "0.00%"
                }else{
                    return ((row.trade_cnt_num/row.trade_uv)*100).toFixed(2)+"%"
                }
            }
        }, {
            field: 'trade_success_uv',
            title: '成交用户数',
            sortable:true
        }, {
            field: 'trade_success_cnt_num',
            title: '订单成交量',
            sortable:true
        },{
            field: 'trade_success_rate',
            title: '成交转化率',
            formatter:function(value,row,index){
                if(row.uv==0){
                    return "0.00%"
                }
                return ((row.trade_success_uv/row.uv)*100).toFixed(2)+"%"
            }
        },{
            field: 'trade_trade_success_rate',
            title: '成交提交率',
            formatter:function(value,row,index){
                if(row.trade_uv==0){
                    return "0.00%"
                }
                return ((row.trade_success_uv/row.trade_uv)*100).toFixed(2)+"%"
            }
        },{
            field: 'trade_success_amount_num',
            title: '成交金额',
            sortable:true
        },{
            field: 'per_trade_num',
            title: '客单价',
            formatter:function(value,row,index){
                if(row.trade_success_cnt_num==0){
                    return "0.00"
                }
                return ((row.trade_success_amount_num/row.trade_success_cnt_num)).toFixed(2)
            }
        }],
    });

}




function  getMarketingWebTraffic(filter){
    //clean parameters
    //var query = cleanParams(filter);
    //only get one day important!!!
    var query = cleanParams(_.clone(filter));
    //query.startDate = query.endDate;
    var flag = query["dateType"];
    delete query["dateType"];
    var dfd = $.Deferred();
     if(flag=="daily" || !flag){
        requestURLPost(dataService+"/webTraffic/getDailyMarketingWebTrafficData_newchannel_userflag_recycletype",query).done(function(ret){
            dfd.resolve(ret)
        });
        //requestURLPost(dataService+"/webTraffic/getDailyMarketingWebTrafficData",{"startDate":"2016-10-27","endDate":"2016-11-05"}).done(function(ret){
        //    dfd.resolve(ret)
        //});
     }else if(flag=="weekly"){
         requestURLPost(dataService+"/webTraffic/getWeeklyMarketingWebTrafficData_newchannel_userflag_recycletype",query).done(function(ret){
             dfd.resolve(ret)
         });
     }else if(flag=="monthly"){
         requestURLPost(dataService+"/webTraffic/getMonthlyMarketingWebTrafficData_newchannel_userflag_recycletype",query).done(function(ret){
             dfd.resolve(ret)
         });
     }
    return dfd.promise()
}
