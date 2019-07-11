Template.riskControlErrorRateDataInfo.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#RiskControlDataInfoTab').addClass('active');
    $('#riskControlErrorRateDataInfo').addClass('active');

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var dateGap = -6;
    var minDate = "2016-07-01";
    var endDate = new Date().getNewDate(-1);
    var startDate = new Date(endDate).getNewDate(dateGap);

    $(".dateSelectLabel").html(startDate+"~"+endDate);
    $('.webTrafficFunnelDate').daterangepicker(datePickerOptionsFunc(startDate,endDate,minDate,false), pickWebTrafficFunnelDateRangeCallback);


    var dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g, "").split("~");
    var startDate = dt[0];
    var endDate = dt[1];
    startDateEmbed=startDate;
    endDateEmbed=endDate;
    filter.startDate=startDate;
    filter.endDate=endDate;
    filter.status="all";
    renderPageDay(filter);

    var dt = $('.monthSelectLabel').text().replace(/ /g, "").split("~");
    var startDate = dt[0];
    var endDate = dt[1];
    filter.startDate=startDate;
    filter.endDate=endDate;
    //renderPageMonth(filter);
    };

var filter={},startDateEmbed,endDateEmbed;

function pickWebTrafficFunnelDateRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.dateSelectLabel').html(sdt + "~" + edt);
    startDateEmbed=sdt;
    endDateEmbed=edt;
    filter.startDate=sdt;
    filter.endDate=edt;
    filter.status="all";
    renderPageDay(filter);
}

function pickWebTrafficFunnelMonthRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.monthSelectLabel').html(sdt + "~" + edt);
    filter.startDate=sdt;
    filter.endDate=edt;
    //renderPageMonth(filter);
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
    $("#tableeg").hide();
    $("#tableOneInspectionPassRate").hide();
    $("#loading2").show();
    $("#loading3").show();
    $("#loadingg").show();
    $("#loadingOneInspectionPassRate").show();
    $("#tableOneInspectionPassRate").hide();
    $("#loadingOneInspectionPassRateChart").show();
    $("#venderOneInspectionPassRateMixedChart").hide();
    var promise = getRiskControlErrorRateStatistic(filter);
    promise.done(function (ret) {
        $("#tablee").show();
        $("#loading2").hide();

        getVenderCancelOrderChart(ret);
        //renderTable
        renderTable(ret,'#tablee');
        //履约金模式
    });

    var promise = getRiskControlErrorRateDayVenderStatistic(filter);
    promise.done(function (ret) {
        $("#tableee").show();
        $("#loading3").hide();

        //day
        renderTableDay(ret,'#tableee');
    });

    var promise = getRiskControlErrorRateDayVenderGroupStatistic(filter);
    promise.done(function (ret) {
        $("#tableeg").show();
        $("#loadingg").hide();

        //day
        renderTableGroupDay(ret,'#tableeg');
    });

    var promise = getRiskControlOneInspectionPassRateStatistic(filter);
    promise.done(function (ret) {
        $("#tableOneInspectionPassRate").show();
        $("#loadingOneInspectionPassRate").hide();

        $("#loadingOneInspectionPassRateChart").hide();
        $("#venderOneInspectionPassRateMixedChart").show();

        getRiskControlOneInspectionPassRateStatisticChart(ret);
        //day
        renderTableInspectionInfo(ret,'#tableOneInspectionPassRate');
    });

}

//每日累计重大失误率
function renderTable(data,tableName) {
    data.forEach(function (e) {
        e.date = e.date;
        e.errorRate=((e.cnt/ e.cancelCnt)*100).toFixed(2)+"%";
    })
    data.reverse();
    $(tableName).bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        data:data
    });
}

//Verder-day
function renderTableDay(data,tableName) {
    data.forEach(function (e) {
        e.errorOrderRate=((e.cancelNum/ e.riskCnt)*100).toFixed(2)+"%";
    })
    $(tableName).bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        data:data,
        columns:[{
            field:'date',
            title:'总账户名称',
            sortable:true
        },{
            field:'cancelCnt',
            title:'客户属性',
            sortable:true
        },{
            field:'cnt',
            title:'重大失误率',
            sortable:true
        },{
            field:'cancelNum',
            title:'失误订单数量',
            sortable:true
        },{
            field:'errorOrderRate',
            title:'失误订单占比',
            sortable:true
        },{
            field:'cancelRiskCnt',
            title:'毛利率',
            sortable:true
        },{
            field:'num',
            title:'是否调整为维修类客户',
            sortable:true
        },{
            field:'#',
            title:'操作',
            sortable:true,
            formatter:function(value,row,index){

                //var val=value.replace(/\//g,"%2F")
                //val=val.replace(/\?/g,"%3F")
                //return "<a class='cus_modal' data-fancybox-type='iframe' href='/product/pageViewModal/"+val+"/"+row.idsite+"/"+area+"/"+city+"'>"+value+"</a>"
                return "<a class='cus_modal'  data-fancybox-type='iframe' href='/vender/riskControlVenderQualityErrorAnalysisModal/"+row.date+"/总账户/"+startDateEmbed+"/"+endDateEmbed+"/总账户'>详细信息</a>"
            }
        }]
    });
}

//Group-day
function renderTableGroupDay(data,tableName) {
    data.forEach(function (e) {
        e.errorOrderRate=((e.cancelNum/ e.riskCnt)*100).toFixed(2)+"%";
    })
    $(tableName).bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        data:data,
        columns:[{
            field:'num',
            title:'门店名称',
            sortable:true
        },{
            field:'date',
            title:'总账户名称',
            sortable:true
        },{
            field:'cancelCnt',
            title:'客户属性',
            sortable:true
        },{
            field:'cnt',
            title:'重大失误率',
            sortable:true
        },{
            field:'cancelNum',
            title:'失误订单数量',
            sortable:true
        },{
            field:'errorOrderRate',
            title:'失误订单占比',
            sortable:true
        },{
            field:'cancelRiskCnt',
            title:'毛利率',
            sortable:true
        },{
            field:'#',
            title:'操作',
            sortable:true,
            formatter:function(value,row,index){

                //var val=value.replace(/\//g,"%2F")
                //val=val.replace(/\?/g,"%3F")
                //return "<a class='cus_modal' data-fancybox-type='iframe' href='/product/pageViewModal/"+val+"/"+row.idsite+"/"+area+"/"+city+"'>"+value+"</a>"
                return "<a class='cus_modal'  data-fancybox-type='iframe' href='/vender/riskControlVenderQualityErrorAnalysisModal/"+row.date+"/"+row.num+"/"+startDateEmbed+"/"+endDateEmbed+"/门店'>详细信息</a>"
            }
        }]
    });
}

//month
function renderTableInspectionInfo(data,tableName) {
    data.forEach(function (e) {
        e.inspectionOnePassRate= e.inspectionOnePassRate+"%"
        e.tolerateRate= e.tolerateRate+"%"
    });
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
                text: '每日累计重大失误率',
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
                data: ["重大失误率"],
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
                    name: '重大失误率',
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

//一次性质检通过率
function getRiskControlOneInspectionPassRateStatisticChart(data){

    var dateList=[];
    var series={
        inspectionOnePassRate:[],
        tolerateRate:[]
    }
    data.forEach(function (e) {
        dateList.push(e.date);
        series.inspectionOnePassRate.push(e.inspectionOnePassRate);
        series.tolerateRate.push(e.tolerateRate);
    });
    dateList= _.uniq(dateList);

    var option = {
        title: {
            text: '一次性质检通过率及小微容忍通过率',
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
            data: ["一次性质检通过率","小微容忍通过率"],
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
                name: '一次性质检通过率',
                type: 'line',
                label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                data: series.inspectionOnePassRate
            },
            {
                name: '小微容忍通过率',
                type: 'line',
                label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                data: series.tolerateRate
            }
        ]
    };

    var venderTradeTrendMixedChart = echarts.init(document.getElementById('venderOneInspectionPassRateMixedChart'));
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
function getRiskControlErrorRateStatistic(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getRiskControlErrorRateStatistic", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}

//风控--获取总账户累计失误率统计信息Top20
function getRiskControlErrorRateDayVenderStatistic(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getRiskControlErrorRateDayVenderStatistic", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}

//风控--获取门店累计失误率统计信息Top20
function getRiskControlErrorRateDayVenderGroupStatistic(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getRiskControlErrorRateDayVenderGroupStatistic", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}

//风控--一次性质检通过率
function getRiskControlOneInspectionPassRateStatistic(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getRiskControlOneInspectionPassRateStatistic", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}

