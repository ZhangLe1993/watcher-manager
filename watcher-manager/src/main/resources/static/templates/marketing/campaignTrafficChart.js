/**
 * Created by hsh on 2016/5/13.
 */

Template.campaignTrafficMonitor.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#MarketingTab').addClass('active');
    $("[name='campaignTraffic']").addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }
    $(".weekly").hide();
    var dateGap = -15;
    var endDate = new Date().getNewDate(-1);
    var startDate = new Date(endDate).getNewDate(dateGap);
    renderFilterOptions(endDate);
    $(".endDateSelectLabel").html(endDate);
    $(".startDateSelectLabel").html(startDate);
    renderPage({"startDate":startDate,"endDate":endDate});
    $(".search").click(function(){
        var dateType =$(this).parent().parent().find(".dateType").val();
        var filter = getSelectedFilter(dateType,$(this));
        renderPage(filter);
    });

    $(".dateType").on('change',function(){
        var dateType =$(this).val();
        var filter = getSelectedFilter(dateType,$(this));
        renderPage(filter);
    });
    var transformDate = function (date) {
        var dateStrArray = date.split('-');
        return dateStrArray[1] + '/' + dateStrArray[2] + '/' + dateStrArray[0]
    };

    var pickerOptions = {
        "showDropdowns": true,
        "alwaysShowCalendars": true,
        "singleDatePicker": true,
        "autoApply": true,
/*        "startDate": transformDate(date),*/
        "endDate": transformDate(endDate),
        "minDate": transformDate("2016-07-01"),
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
            "firstDay": 1
        }
    };
    $('.campaignStartDatePicker').daterangepicker(pickerOptions, pickStartDateRangeCallback);
    $('.campaignEndDatePicker').daterangepicker(pickerOptions, pickEndDateRangeCallback);


};

// var dataService = Meteor.settings.public.dataService.baseUrl;

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



function getSelectedFilter(dateType,$this){
    if(dateType=="daily"){
        $(".daily").show();
        $(".weekly").hide();
        startDate = $('.desktop-only .startDateSelectLabel').text();
        endDate = $('.desktop-only .endDateSelectLabel').text();
    }else if(dateType=="weekly"){
        $(".daily").hide();
        $(".weekly").show();
        startDate = $this.parent().parent().find(".startWeek").val();
        endDate = $this.parent().parent().find(".endWeek").val();
    }
    var source = $this.parent().parent().find(".source").val();
    var medium = $this.parent().parent().find(".medium").val();
    var campaign = $this.parent().parent().find(".campaign").val();
    var channel = $this.parent().parent().find(".channel").val();
    var cityName = $this.parent().parent().find(".city").val();
    var platform = $this.parent().parent().find(".platform").val();
    var searchEngine = $this.parent().parent().find(".searchEngine").val();
    var filter = {
        "dateType":dateType,
        "startDate":startDate,
        "endDate":endDate,
        "channel":channel,
        "cityName":cityName,
        "platform":platform,
        "searchEngine":searchEngine,
        "source":source,
        "medium":medium,
        "campaign":campaign
    };
    return cleanParams(filter);
}

function renderPage(filter){
    $("#chartContent").hide();
    $("#loading").show();
    //获取聚合数据
    var promise = getAggregateWebTrafficData(filter);
    promise.done(function(ret){
        $("#chartContent").show();
        $("#loading").hide();
        var obj = getCalcDataByDate(ret);

        var retObj = {
            "uv":[],
            "inquiry_uv":[],
            "trade_uv":[],
            "trade_success_uv":[],
            "inquiry_uv_rate":[],
            "trade_uv_rate":[],
            "trade_success_uv_rate":[],
            "total_rate":[]
        };
        if(obj.series.uv.length>0){
            retObj.uv = obj.series.uv[obj.series.uv.length-1]
        }
        if(obj.series.inquiry_uv.length>0){
            retObj.inquiry_uv = obj.series.inquiry_uv[obj.series.inquiry_uv.length-1]
        }
        if(obj.series.trade_uv.length>0){
            retObj.trade_uv = obj.series.trade_uv[obj.series.trade_uv.length-1]
        }
        if(obj.series.trade_success_uv.length>0){
            retObj.trade_success_uv = obj.series.trade_success_uv[obj.series.trade_success_uv.length-1]
        }
        if(obj.series.inquiry_uv_rate.length>0){
            retObj.inquiry_uv_rate = obj.series.inquiry_uv_rate[obj.series.inquiry_uv_rate.length-1]
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
        drawDailyTrafficFunnelChart(lastDate,retObj);
        drawDailyTrafficStackChart(obj);

        renderTable(filter,obj.total);
    });

}

function renderTable(filter,obj){

    var fixRow = '"<tr style="background-color: #acc087;"", " ", "", "", " data-index="0"", "", "", ">", "<td  style=""    >总数</td>", "<td  style=""    >-</td>", "<td  style=""    >-</td>", "<td  style=""    >-</td>","<td  style=""    >-</td>","<td  style=""    >-</td>","<td  style=""    >-</td>", "<td  style=""    >-</td>", "<td  style=""    >'+obj.uv+'</td>", "<td  style=""    >'+obj.inquiry_uv+'</td>", "<td  style=""    >'+obj.trade_uv+'</td>", "<td  style=""    >'+obj.trade_cnt_num+'</td>", "<td  style=""    >'+obj.trade_success_uv+'</td>", "<td  style=""    >'+obj.trade_success_cnt_num+'</td>", "<td  style=""    >'+obj.trade_success_amount_num+'</td>", "</tr>"'
    var ajaxQuery = _.clone(filter);
    $('#table').bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        pagination: true,
        sidePagination: 'server',
        ajax:function(params){
            var ajaxParams = $.extend(ajaxQuery,params.data);
            $("#ctable").hide();
            getCampaignWebTraffic(ajaxParams).done(function(data){
                $("#ctable").show();
                params.success(data)
            });
        },
        fixRow:fixRow,
        cdataExport:"cdataExport"
    });
    $("#cdataExport").click(function(){
        $("#wholePage").mask({'label':"请等待，文件正在导出..."});
        var query = _.clone(filter);
        var flag = query["dateType"];
        delete query["dateType"];
        if(flag=="daily" || !flag){
            requestURL(dataService+"/webTraffic/exportDailyCampaignWebTrafficData",query).done(function(obj){
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

        }
    });

}


function getFilterOptions(date){
    var dfd = $.Deferred();
    requestURL(dataService+"/webTraffic/getCampaignFilterOptions",{"date":date}).done(function(ret){
        dfd.resolve(ret)
    });
    return dfd.promise()
}

function renderFilterOptions(date){
    var promise = getFilterOptions(date);
    promise.done(function(data){
        renderOptions(".source",data.source,"请选择utm_source");
        renderOptions(".medium",data.medium,"请选择utm_medium");
        renderOptions(".campaign",data.campaign,"请选择utm_campaign");
        renderOptions(".city",data.cityName,"请选择城市");
        renderOptions(".platform",data.platform,"请选择平台");
        renderOptions(".channel",data.channel,"请选择渠道");
        renderOptions(".searchEngine",data.searchEngine,"请选择搜索来源");
    })
}

function renderOptions(sel,data,title){
    $(sel).empty();
    $(sel).append("<option value=''>All</option>");
    data.forEach(function(ele){
        $(sel).append("<option value='"+ele+"'>"+ele+"</option>")
    })
}

function pickStartDateRangeCallback(start, end, label) {
    console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    var dt = start.format('YYYY-MM-DD');
    if(dt<=$('.endDateSelectLabel').html()){
        $('.startDateSelectLabel').html(dt);
    }else{
        alert("起始时间不能晚于结束时间！")
    }
    /*renderFilterOptions(dt);
    renderPage({"startDate":dt,"endDate":dt});*/
}

function pickEndDateRangeCallback(start, end, label) {
    console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    var dt = start.format('YYYY-MM-DD');
    if(dt<$('.startDateSelectLabel').html()){
        alert("结束时间不能早于起始时间！")
    }else{
        $('.endDateSelectLabel').html(dt);
        //renderFilterOptions(dt);
        renderPage({"startDate":$('.startDateSelectLabel').html(),"endDate":dt});
    }
}

function  getCampaignWebTraffic(filter){
    //clean parameters
    var query = cleanParams(_.clone(filter));
    //only get one day important!!!
    //query.startDate = query.endDate;
    var flag = query["dateType"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if(flag=="daily" || !flag){
        requestURL(dataService+"/webTraffic/getCampaignWebTrafficData",query).done(function(ret){
            dfd.resolve(ret)
        });
    }else if(flag=="weekly"){

    }
    return dfd.promise()
}


function getAggregateWebTrafficData(filter){
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["dateType"];
    delete query["userId"];
    delete query["sign"];
    var dfd = $.Deferred();
    if(flag=="daily" || !flag){
        requestURL(dataService+"/webTraffic/getAggregateCampaignWebTrafficData",query).done(function(ret){
            dfd.resolve(ret)
        });
    }else if(flag=="weekly"){

    }
    return dfd.promise()
}

//获取总的计算数据
function getCalcData(data){
    var uv= 0;
    var inquiry_uv =0;
    var trade_uv =0;
    var trade_success_uv = 0;
    var trade_cnt_num = 0;
    var trade_success_cnt_num = 0;
    var trade_success_amount_num = 0;
    data.forEach(function (e) {
        uv += e.uv;
        inquiry_uv += e.inquiry_uv;
        trade_uv += e.trade_uv;
        trade_success_uv += e.trade_success_uv;
        trade_cnt_num += e.trade_cnt_num;
        trade_success_cnt_num += e.trade_success_cnt_num;
        trade_success_amount_num += e.trade_success_amount_num;
    });
    var inquiry_uv_date = ((inquiry_uv/uv)*100).toFixed(2);
    var trade_uv_rate = ((trade_uv/inquiry_uv)*100).toFixed(2);
    var trade_success_uv_rate = ((trade_success_uv/trade_uv)*100).toFixed(2);
    var total_rate = ((trade_success_uv/uv)*100).toFixed(3);
    return {"trade_uv_rate":trade_uv_rate,"trade_success_uv_rate":trade_success_uv_rate,"total_rate":total_rate,"inquiry_uv_rate":inquiry_uv_date,"uv":uv,"inquiry_uv":inquiry_uv,"trade_uv":trade_uv,"trade_success_uv":trade_success_uv,"trade_cnt_num":trade_cnt_num,"trade_success_cnt_num":trade_success_cnt_num,"trade_success_amount_num":trade_success_amount_num}
}
//根据日期获取总的数据
function  getCalcDataByDate(data){
    var dataDict = _.groupBy(data,function(obj){return obj.date});
    var total = {};
    var dateList =[];
    var series = {
        uv:[],
        inquiry_uv:[],
        trade_uv:[],
        trade_success_uv:[],
        trade_cnt_num:[],
        trade_success_cnt_num:[],
        trade_success_amount_num:[],
        inquiry_uv_rate:[],
        trade_uv_rate:[],
        trade_success_uv_rate:[],
        total_rate:[]
    };
    for(var key in dataDict){
        dateList.push(key);
        var obj = getCalcData(dataDict[key]);
        series.uv.push(obj.uv);
        series.inquiry_uv.push(obj.inquiry_uv);
        series.trade_uv.push(obj.trade_uv);
        series.trade_success_uv.push(obj.trade_success_uv);
        series.trade_cnt_num.push(obj.trade_cnt_num);
        series.trade_success_cnt_num.push(obj.trade_success_cnt_num);
        series.trade_success_amount_num.push(obj.trade_success_amount_num);
        series.inquiry_uv_rate.push(obj.inquiry_uv_rate);
        series.trade_uv_rate.push(obj.trade_uv_rate);
        series.trade_success_uv_rate.push(obj.trade_success_uv_rate);
        series.total_rate.push(obj.total_rate);
    }
    total.uv = series.uv.sum();
    total.inquiry_uv = series.inquiry_uv.sum();
    total.trade_uv = series.trade_uv.sum();
    total.trade_success_uv = series.trade_success_uv.sum();
    total.trade_cnt_num = series.trade_cnt_num.sum();
    total.trade_success_cnt_num = series.trade_success_cnt_num.sum();
    total.trade_success_amount_num = series.trade_success_amount_num.sum();
    return {"dateList":dateList,"series":series,"total":total}
}

function drawDailyTrafficFunnelChart(date,obj) {

    //var obj =getCalcData(dataList);
    var yAxis = ['总UV',
        obj.inquiry_uv_rate + '%\n询价UV',
        obj.trade_uv_rate + '%\n提交UV',
        obj.trade_success_uv_rate + '%\n成交UV'].reverse();
    var option = {
        title: {
            text: '市场流量'+date,
            x: "center",
           // y: "bottom"
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
                data: [obj.uv,obj.inquiry_uv,obj.trade_uv,obj.trade_success_uv].reverse()
            }
        ]
    };
    var dailyTrafficFunnelChart = echarts.init(document.getElementById('dailyTrafficFunnelChart'));
    dailyTrafficFunnelChart.setOption(option);
    window.addEventListener('resize',dailyTrafficFunnelChart.resize)
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
                data:['访问用户数','询价用户数','提交用户数','成交用户数','','询价转化率',"提交转化率","成交转化率","总转化率"],
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
                    name:'访问用户数',
                    type:'line',
                    //stack: '总量',
                    data:obj.series.uv
                },
                {
                    name:'询价用户数',
                    type:'line',
                    // stack: '总量',
                    data:obj.series.inquiry_uv
                },
                {
                    name:'提交用户数',
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
                    name:'询价转化率',
                    type:'line',
                    yAxisIndex: 1,
                    //stack: '总量',
                    data:obj.series.inquiry_uv_rate
                },
                {
                    name:'提交转化率',
                    type:'line',
                    yAxisIndex: 1,
                    //stack: '总量',
                    data:obj.series.trade_uv_rate
                },
                {
                    name:'成交转化率',
                    type:'line',
                    yAxisIndex: 1,
                    //stack: '总量',
                    data:obj.series.trade_success_uv_rate
                },
                {
                    name:'总转化率',
                    type:'line',
                    yAxisIndex: 1,
                    //stack: '总量',
                    data:obj.series.total_rate
                }
            ]
        };
        var dailyTrafficStackChart = echarts.init(document.getElementById('dailyTrafficStackChart'));
        dailyTrafficStackChart.setOption(option);
        window.addEventListener('resize',dailyTrafficStackChart.resize)
    /*});*/
}


