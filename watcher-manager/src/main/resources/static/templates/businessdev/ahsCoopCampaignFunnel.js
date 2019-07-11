
Template.ahsCoopCampaignFunnel.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#BDTab').addClass('active');
    $('#ahsCoopCampaignFunnel').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }


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
    $(".dateSelectLabel").html(startDate+"~"+endDate);
    $('.webTrafficFunnelDate').daterangepicker(datePickerOptionsFunc(startDate,endDate,minDate,false), pickWebTrafficFunnelDateRangeCallback);
    $(".weekSelectLabel").html(startWeekDate+"~"+endWeekDate);
    $('.webTrafficFunnelWeek').daterangepicker(weekDatePickerOptionsFunc(startWeekDate,endWeekDate,minWeekDate,false), pickWebTrafficFunnelWeekRangeCallback);
    $(".monthSelectLabel").html(startMonthDate+"~"+endMonthDate);
    $('.webTrafficFunnelMonth').daterangepicker(monthDatePickerOptionsFunc(startMonthDate,endMonthDate,minMonthDate,false), pickWebTrafficFunnelMonthRangeCallback);

    $(".webTrafficFunnelDate").show();
    $(".webTrafficFunnelWeek").hide();
    $(".webTrafficFunnelMonth").hide();
    $(".dateType").on('change',function(){
        var dateType =$(this).val();
        if(dateType=="daily"){
            $(".webTrafficFunnelDate").show();
            $(".webTrafficFunnelWeek").hide();
            $(".webTrafficFunnelMonth").hide();
            dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g,"").split("~");
            var startDate = dt[0];
            var endDate = dt[1];
            var query = {
                "startDate": startDate,
                "endDate": endDate
            };
            renderPage(query);
        }else if(dateType=="weekly"){
            $(".webTrafficFunnelDate").hide();
            $(".webTrafficFunnelWeek").show();
            $(".webTrafficFunnelMonth").hide();
            dt = $('.desktop-only .weekSelectLabel').text().replace(/ /g,"").split("~");
            var startDate = dt[0];
            var endDate = dt[1];
            var query = {
                "startDate": startDate,
                "endDate": endDate
            };
            renderPage(query)
        }else if(dateType=="monthly"){
            $(".webTrafficFunnelDate").hide();
            $(".webTrafficFunnelWeek").hide();
            $(".webTrafficFunnelMonth").show();
            dt = $('.desktop-only .monthSelectLabel').text().replace(/ /g,"").split("~");
            var startDate = dt[0];
            var endDate = dt[1];
            var query = {
                "startDate": startDate,
                "endDate": endDate
            };
            renderPage(query)
        }
    });

    var dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g,"").split("~");
    var startDate = dt[0];
    var endDate = dt[1];
    var query = {
        "startDate": startDate,
        "endDate": endDate
    };

    //数据初始化加载
    renderPage(query);

    //选项初始化加载
    requestURL(dataService+"/bd/getBdRelateCampaignFilterOptions",{}).done(function(data){
        /*城市来源*/
        $(".city").attr("multiple","multiple");
        data.city.forEach(function (e) {
            $(".city").append("<option value='" + e + "'>" + e + "</option>");
        });

        /*渠道来源*/
        $(".source").attr("multiple","multiple");
        data.source.forEach(function (e) {
            $(".source").append("<option value='" + e + "'>" + e + "</option>");
        });

        /*媒介*/
        $(".medium").attr("multiple","multiple");
        data.medium.forEach(function (e) {
            $(".medium").append("<option value='" + e + "'>" + e + "</option>");
        });

        /*活动*/
        $(".campaign").attr("multiple","multiple");
        data.campaign.forEach(function (e) {
            $(".campaign").append("<option value='" + e + "'>" + e + "</option>");
        });
    $(".city").multipleSelect({
        placeholder: "全部",
        //selectAllText:"全部",
        width: 150,
        selectAll: false,
        filter: true
    });
    $(".source").multipleSelect({
        placeholder: "全部",
        //selectAllText:"全部",
        width: 150,
        selectAll: false,
        filter: true
    });
    $(".medium").multipleSelect({
        placeholder: "全部",
        //selectAllText:"全部",
        width: 150,
        selectAll: false,
        filter: true
    });
    $(".campaign").multipleSelect({
        placeholder: "全部",
        //selectAllText:"全部",
        width: 150,
        selectAll: false,
        filter: true
    });
    });


    $(".search").click(function(){
        /*日期*/
        dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g,"").split("~");
        var startDate = dt[0];
        var endDate = dt[1];
        /*周数*/
        dt = $('.desktop-only .weekSelectLabel').text().replace(/ /g,"").split("~");
        var startDateWeek = dt[0];
        var endDateWeek = dt[1];
        /*月数*/
        dt = $('.desktop-only .monthSelectLabel').text().replace(/ /g,"").split("~");
        var startDateMonth = dt[0];
        var endDateMonth = dt[1];

        var city = $(this).parent().find(".city").val();
        var source = $(this).parent().find(".source").val();
        var medium = $(this).parent().find(".medium").val();
        var campaign = $(this).parent().find(".campaign").val();
        var query={
            "startDate":startDate,
            "endDate":endDate,
            "city":city,
            "source":source,
            "medium":medium,
            "campaign":campaign,
        }

        var queryWeek={
            "startDate":startDateWeek,
            "endDate":endDateWeek,
            "city":city,
            "source":source,
            "medium":medium,
            "campaign":campaign
        }

        var queryMonth={
            "startDate":startDateMonth,
            "endDate":endDateMonth,
            "city":city,
            "source":source,
            "medium":medium,
            "campaign":campaign
        }
        $("#chartContent").hide();
        $("#loading").show();
        $(".webTrafficFunnelDate").show();
        $(".webTrafficFunnelWeek").hide();
        $(".webTrafficFunnelMonth").hide();
        var flag=$(".dateType").val();
        if(flag=="daily"){
            query=cleanParams(query);
            $("#chartContent").show();
            renderPage(query);
            $(".webTrafficFunnelDate").show();
            $(".webTrafficFunnelWeek").hide();
            $(".webTrafficFunnelMonth").hide();
        }else if(flag=="weekly"){
            queryWeek=cleanParams(queryWeek);
            $("#chartContent").show();
            $("#loading").hide();
            renderPage(queryWeek);
            $(".webTrafficFunnelDate").hide();
            $(".webTrafficFunnelWeek").show();
            $(".webTrafficFunnelMonth").hide();
        }else if(flag=="monthly") {
            queryMonth = cleanParams(queryMonth);
            $("#chartContent").show();
            $("#loading").hide();
            renderPage(queryMonth);
            $(".webTrafficFunnelDate").hide();
            $(".webTrafficFunnelWeek").hide();
            $(".webTrafficFunnelMonth").show();
        }
    });
};

function pickWebTrafficFunnelDateRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.dateSelectLabel').html(sdt+"~"+edt);
}

function pickWebTrafficFunnelWeekRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.weekSelectLabel').html(sdt+"~"+edt);
}

function pickWebTrafficFunnelMonthRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.monthSelectLabel').html(sdt + "~" + edt);
}

//dataService = Meteor.settings.public.dataService.baseUrl;

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
    var promise = getAggregateWebTrafficData(filter);
    promise.done(function(ret){
        $("#chartContent").show();
        $("#loading").hide();
        //drawtrafficFunnelChart(ret);
        drawtrafficStackChart(ret);

        //renderTable
        var obj = getCalcDataByDate(ret);
        renderTable(filter,obj);
        drawtrafficFunnelChart(obj);
    });

}

function getAggregateWebTrafficData(filter){
    //clean parameters
    var query = _.clone(filter);
//    var flag = query["dateType"];
    var flag = $(".dateType").val();
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if(flag=="daily" || !flag){
        requestURL(dataService+"/bd/getBdRelateDailyAggregateCampaignWebTrafficData",query).done(function(ret){
            dfd.resolve(ret)
        });
    }else if(flag=="weekly"){
        requestURL(dataService+"/bd/getBdRelateDailyAggregateCampaignWebTrafficDataWeek",query).done(function(ret){
            dfd.resolve(ret)
        });
    }else if(flag=="monthly"){
        requestURL(dataService+"/bd/getBdRelateDailyAggregateCampaignWebTrafficDataMonth",query).done(function(ret){
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}


//获取总的数据
function  getCalcDataByDate(data){
    var series = {
        uv:[],
        inquiryUv:[],
        inquirySuccessUV:[],
        tradeMethodUV:[],
        submitSuccessUv:[],
    };
    series.uv[0]=0;
    series.inquiryUv[0]=0;
    series.inquirySuccessUV[0]=0;
    series.tradeMethodUV[0]=0;
    series.submitSuccessUv[0]=0;
    data.forEach(function (e) {
        series.uv[0]+=e.uv;
        series.inquiryUv[0]+=e.inquiryUv;
        series.inquirySuccessUV[0]+=e.inquirySuccessUV;
        series.tradeMethodUV[0]+=e.tradeMethodUV;
        series.submitSuccessUv[0]+=e.submitSuccessUv;
    });
    return series;
}

function renderTable(filter,obj){
        var fixRow = '"<tr style="background-color: #acc087;"", " ", "", "", " data-index="0"", "", "", ">", "<td  style=""    >总数</td>", "<td  style=""    >-</td>","<td  style=""    >-</td>","<td  style=""    >-</td>", "<td  style=""    >-</td>", "<td  style=""    >-</td>", "<td  style=""    >'+obj.uv[0]+'</td>", "<td  style=""    >'+obj.inquiryUv[0]+'</td>","<td  style=""    >'+obj.inquirySuccessUV[0]+'</td>","<td  style=""    >'+obj.tradeMethodUV[0]+'</td>", "<td  style=""    >'+obj.submitSuccessUv[0]+'</td>","</tr>"'
        var ajaxQuery = _.clone(filter);
        $('#table').bootstrapTable('destroy').bootstrapTable({
            // exportDataType: 'all',
            pagination: true,
            sidePagination: 'server',
            ajax:function(params){
                var ajaxParams = $.extend(ajaxQuery,params.data);
                $("#ctable").hide();
                getMarketingWebTraffic(ajaxParams).done(function(data){
                    $("#ctable").show();
                    params.success(data)
                });
            },
            fixRow:fixRow,
        });
}

function  getMarketingWebTraffic(filter){
    //clean parameters
    //var query = cleanParams(filter);
    //only get one day important!!!
    var query = cleanParams(_.clone(filter));
    //query.startDate = query.endDate;
//    var flag = query["dateType"];
    var flag = $(".dateType").val();
    delete query["dateType"];
    var dfd = $.Deferred();
    if(flag=="daily" || !flag){
        requestURL(dataService+"/bd/getBdRelateCampaignWebTraffic",query).done(function(ret){
            dfd.resolve(ret)
        });
    }else if(flag=="weekly"){
        requestURL(dataService+"/bd/getBdRelateCampaignWebTrafficWeek",query).done(function(ret){
            dfd.resolve(ret)
        });
    }else if(flag=="monthly"){
        requestURL(dataService+"/bd/getBdRelateCampaignWebTrafficMonth",query).done(function(ret){
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}


function pickDateRangeCallback(start, end, label) {
//    console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    $('.webTrafficUV').html(start.format('YYYY-MM-DD'));
}

/*漏斗图*/
function drawtrafficFunnelChart(obj) {
    var selectDate;
    var dateType =$(".dateType").val();
    if(dateType=="daily"){
        dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g,"").split("~");
        selectDate = dt[1];
    }else if(dateType=="weekly"){
        dt = $('.desktop-only .weekSelectLabel').text().replace(/ /g,"").split("~");
        selectDate = dt[1];
    }else if(dateType=="monthly"){
        dt = $('.desktop-only .monthSelectLabel').text().replace(/ /g,"").split("~");
        selectDate = dt[1];
    }
    var Data=[];
    Data.push(obj.uv[0]);
    Data.push(obj.inquiryUv[0]);
    Data.push(obj.inquirySuccessUV[0]);
    Data.push(obj.tradeMethodUV[0]);
    Data.push(obj.submitSuccessUv[0]);

    var yData = ['总访客数',
        "询价转化率"+(Data[1] / Data[0] * 100).toFixed(2) + '%\n 询价访客数UV',
        "询价完成转化率"+(Data[2] / Data[0] * 100).toFixed(2) + '%\n 询价完成访客数UV',
        "选择回收方式转化率"+(Data[3] / Data[0] * 100).toFixed(2) + '%\n 选择回收方式访客数UV',
        "提交率"+(Data[4] / Data[0] * 100).toFixed(2) + '%\n 提交访客数UV'].reverse();

    var option = {
            title: {
                text: '活动相关流量漏斗'+"(日期"+selectDate+")",
                x: "center",
                y: "bottom"
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {
                    type: 'shadow'
                },
                  formatter:function(params,ticket,callback){
                      var str;
                      params.forEach(function(obj){
                         var objf=obj.name.split(" ")
                          if(objf[1]){
                              str =obj.name.split(" ")[0]+'<br/>'+obj.name.split(" ")[1] + ' : ' + obj.value + '<br/>';
                          }else{
                             str = obj.name+ ' : ' + obj.value + '<br/>';
                          }
                      });
                     return (str)
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
                    data: yData,
                    splitLine: {
                        show: true
                    }
                }
            ],
            series: [
                {
                    name: 'M版',
                    type: 'bar',
                    itemStyle: {normal: {color: '#568FC8', label: {show: true, position: 'right', color: '#568FC8'}}},
                    data: Data.reverse()
                }
            ]
        };
    var trafficFunnelChart = echarts.init(document.getElementById('trafficFunnelChart'));
    trafficFunnelChart.setOption(option);
    window.addEventListener('resize',trafficFunnelChart.resize)
}

/*折线图堆叠*/
function drawtrafficStackChart(data){
            var xAxis_data = [];
            var series = {
                uv:[],
                inquiryUv:[],
                inquiryRate:[],
                inquirySuccessUV:[],
                inquirySuccessRate:[],
                tradeMethodUV:[],
                tradeMethodRate:[],
                submitSuccessUv:[],
                submitSuccessRate: []
            };
            data.forEach(function(e){
                xAxis_data.push(e.date);
                series.uv.push(e.uv);
                series.inquiryUv.push(e.inquiryUv);
                series.inquiryRate.push(((e.inquiryUv/ e.uv)*100).toFixed(2));
                series.inquirySuccessUV.push(e.inquirySuccessUV);
                series.inquirySuccessRate.push(((e.inquirySuccessUV/ e.uv)*100).toFixed(2));
                series.tradeMethodUV.push(e.tradeMethodUV);
                series.tradeMethodRate.push(((e.tradeMethodUV/ e.uv)*100).toFixed(2));
                series.submitSuccessUv.push(e.submitSuccessUv);
                series.submitSuccessRate.push(((e.submitSuccessUv/ e.uv)*100).toFixed(2));
            });
            var option = {
                title: {
                    text: '折线图堆叠',
                    x:"center",
                    y:"bottom"
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
                    data:['总访客数','询价访客数','询价转化率','报价访客数','报价转化率','选择回收方式访客数','选择回收方式转化率','提交访客数','提交转化率']
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
                    data: xAxis_data
                },
                yAxis: [{
                    type: 'value'
                },{
                    type: 'value',
                    axisLabel: {
                        formatter: function (value, index) {
                            if (value == 0) {
                                return value
                            }
                            return value + "%"
                        }
                    }
                }],
                series: [
                    {
                        name:'总访客数',
                        type:'line',
                        data:series.uv
                    },
                    {
                        name:'询价访客数',
                        type:'line',
                        data:series.inquiryUv
                    },{
                        name:'询价转化率',
                        type:'line',
                        yAxisIndex:1,
                        data:series.inquiryRate
                    },
                    {
                        name:'报价访客数',
                        type:'line',
                        data:series.inquirySuccessUV
                    },{
                        name:'报价转化率',
                        type:'line',
                        yAxisIndex:1,
                        data:series.inquirySuccessRate
                    },
                    {
                        name:'选择回收方式访客数',
                        type:'line',
                        data:series.tradeMethodUV
                    },{
                        name:'选择回收方式转化率',
                        type:'line',
                        yAxisIndex:1,
                        data:series.tradeMethodRate
                    },
                    {
                        name:'提交访客数',
                        type:'line',
                        data:series.submitSuccessUv
                    },{
                        name:'提交转化率',
                        type:'line',
                        yAxisIndex:1,
                        data:series.submitSuccessRate
                    }
                ]
            };
            var trafficStackChart = echarts.init(document.getElementById('trafficStackChart'));
            trafficStackChart.setOption(option);
            window.addEventListener('resize',trafficStackChart.resize)
}
