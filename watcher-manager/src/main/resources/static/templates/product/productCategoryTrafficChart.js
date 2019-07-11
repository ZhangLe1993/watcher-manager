
Template.productCategoryTrafficChart.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#productTab').addClass('active');
    $('#productCategoryTrafficChart').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }
    var dateGap = -6;
    var minDate = "2018-02-19";
    var minWeekDate = "2018-02-19";
    var minMonthDate = "2018-03-01";
    var endDate = new Date().getNewDate(-1);
    var startDate = new Date(endDate).getNewDate(dateGap);
    var startWeekDate = moment().weekday(-21).format("YYYY-MM-DD")
    var endWeekDate = moment().weekday(-7).format("YYYY-MM-DD")
    if(startWeekDate<minWeekDate){
        startWeekDate = minWeekDate;
    }
    var startMonthDate = moment().subtract(3, 'month').startOf('month').format("YYYY-MM-DD");
    var endMonthDate = moment().subtract(1, 'month').startOf('month').format("YYYY-MM-DD");
    if(startMonthDate<minMonthDate){
        startMonthDate = minMonthDate;
    }

    $(".dateSelectLabel").html(startDate+"~"+endDate);
    $('.webTrafficFunnelDate').daterangepicker(datePickerOptionsFunc(startDate,endDate,minDate,false), pickWebTrafficFunnelDateRangeCallback);

    $(".weekSelectLabel").html(startWeekDate+"~"+endWeekDate);
    $('.webTrafficFunnelWeek').daterangepicker(weekDatePickerOptionsFunc(startWeekDate,endWeekDate,minWeekDate,false), pickWebTrafficFunnelWeekRangeCallback);

    $(".monthSelectLabel").html(startMonthDate + "~" + endMonthDate);
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
            dt = $('.dateSelectLabel').text().replace(/ /g,"").split("~");
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
            dt = $('.weekSelectLabel').text().replace(/ /g,"").split("~");
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
            dt = $('.monthSelectLabel').text().replace(/ /g,"").split("~");
            var startDate = dt[0];
            var endDate = dt[1];
            var query = {
                "startDate": startDate,
                "endDate": endDate
            };
            renderPage(query)
        }
    });

    var dt = $('.dateSelectLabel').text().replace(/ /g,"").split("~");
    var startDate = dt[0];
    var endDate = dt[1];
    var query = {
        "startDate": startDate,
        "endDate": endDate
    };

    //数据初始化加载
    renderPage(query);

    //选项初始化加载
    requestURL(dataService+"/product/getProductCategoryTrafficFilterOptions",{}).done(function(data){
        /*城市来源*/
        $(".cityName").attr("multiple","multiple");
        renderOptions(".cityName",data.cityName);

        /*平台来源*/
        $(".platform").attr("multiple","multiple");
        renderOptions(".platform",["官网","M版","Android原生APP","Ios原生APP"]);

        /*品类*/
        $(".categoryParentName").attr("multiple","multiple");
        renderOptions(".categoryParentName",data.categoryParentName);

        /*子品类*/
        $(".categoryName").attr("multiple","multiple");
        renderOptions(".categoryName",data.categoryName);

        /*品牌*/
        $(".brandName").attr("multiple","multiple");
        renderOptions(".brandName",data.brandName);

        $(".cityName").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false,
            filter: true
        });
        $(".platform").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false,
            filter: true
        });
        $(".categoryParentName").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false,
            filter: true
        });
        $(".categoryName").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false,
            filter: true
        });

        $(".brandName").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false,
            filter: true
        });
    });


    $(".search").click(function(){
        /*日期*/
        dt = $('.dateSelectLabel').text().replace(/ /g,"").split("~");
        var startDate = dt[0];
        var endDate = dt[1];
        /*周数*/
        dt = $('.weekSelectLabel').text().replace(/ /g,"").split("~");
        var startDateWeek = dt[0];
        var endDateWeek = dt[1];
        /*月数*/
        dt = $('.monthSelectLabel').text().replace(/ /g,"").split("~");
        var startDateMonth = dt[0];
        var endDateMonth = dt[1];

        var cityName = $(this).parent().find(".cityName").val();
        var platform = $(this).parent().find(".platform").val();
        var categoryParentName = $(this).parent().find(".categoryParentName").val();
        var categoryName = $(this).parent().find(".categoryName").val();
        var brandName = $(this).parent().find(".brandName").val();
        var query={
            "startDate":startDate,
            "endDate":endDate,
            "cityName":cityName,
            "platform":platform,
            "categoryParentName":categoryParentName,
            "categoryName":categoryName,
            "brandName":brandName
        }

        var queryWeek={
            "startDate":startDateWeek,
            "endDate":endDateWeek,
            "cityName":cityName,
            "platform":platform,
            "categoryParentName":categoryParentName,
            "categoryName":categoryName,
            "brandName":brandName
        }

        var queryMonth={
            "startDate":startDateMonth,
            "endDate":endDateMonth,
            "cityName":cityName,
            "platform":platform,
            "categoryParentName":categoryParentName,
            "categoryName":categoryName,
            "brandName":brandName
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

function renderOptions(sel,data){
    $(sel).empty();
    data.forEach(function(ele){
        $(sel).append("<option value='"+ele+"'>"+ele+"</option>")
    });
}

function renderPage(filter){
    //var dateGap = -15;
    $("#chartContent").hide();
    $("#loading").show();
    var promise = getAggregateWebTrafficData(filter);
    promise.done(function(ret){
        $("#chartContent").show();
        $("#loading").hide();
        drawtrafficFunnelChart(ret);

        drawtrafficStackChart(ret)
        //renderTable
        var obj = getCalcDataByDate(ret);
        renderTable(filter,obj);
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
        requestURL(dataService+"/product/getProductCategoryTrafficDateCollectInfo",query).done(function(ret){
            dfd.resolve(ret)
        });
    }else if(flag=="weekly"){
        requestURL(dataService+"/product/getProductCategoryTrafficWeekCollectInfo",query).done(function(ret){
            dfd.resolve(ret)
        });
    }else if(flag=="monthly"){
        requestURL(dataService+"/product/getProductCategoryTrafficMonthCollectInfo",query).done(function(ret){
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}


//获取总的数据
function  getCalcDataByDate(data){
    var series = {
        query:[],
        querySuccess:[],
        querySuccessRate:[],
        tradeType:[],
        tradeTypeRate:[],
        submit: [],
        submitRate: []
    };
    series.query[0]=0;
    series.querySuccess[0]=0;
    series.tradeType[0]=0;
    series.submit[0]=0;
    data.forEach(function (e) {
        series.query[0]+=e.query;
        series.querySuccess[0]+=e.querySuccess;
        series.tradeType[0]+=e.tradeType;
        series.submit[0]+=e.submit;
    });
    series.querySuccessRate.push(((series.querySuccess[0]/ series.query[0])*100).toFixed(2));
    series.tradeTypeRate.push(((series.tradeType[0]/ series.query[0])*100).toFixed(2));
    series.submitRate.push(((series.submit[0]/ series.query[0])*100).toFixed(2));
    return series;
}

function renderTable(filter,obj){
        var fixRow = '"<tr style="background-color: #acc087;"", " ", "", "", " data-index="0"", "", "", ">", "<td  style=""    >总数</td>", "<td  style=""    >-</td>","<td  style=""    >-</td>","<td  style=""    >-</td>", "<td  style=""    >-</td>", "<td  style=""    >-</td>", "<td  style=""    >'+obj.query[0]+'</td>", "<td  style=""    >'+obj.querySuccess[0]+'</td>", "<td  style=""    >'+obj.tradeType[0]+'</td>", "<td  style=""    >'+obj.submit[0]+'</td>","</tr>"'
        var ajaxQuery = _.clone(filter);
        $('#table').bootstrapTable('destroy').bootstrapTable({
            //exportDataType: 'all',
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
            cdataExport:"cdataExport",
        });

    $("#cdataExport").click(function(){
        var query = _.clone(filter);
        var sdt = moment(query.startDate);
        var edt = moment(query.endDate);
        var dflag = sdt.add(1,'month')<=edt;
        if(dflag){
            alert("导出文件最长间隔时间为1个月");
            return;
        }


        $("#wholePage").mask({'label':"请等待，文件正在导出..."});
        var flag = query["dateType"];
        delete query["dateType"];
        if(flag=="daily" || !flag){
            requestURL(dataService+"/product/exportProductCategoryTrafficData",query).done(function(obj){
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
            requestURL(dataService+"/product/exportProductCategoryTrafficDataWeek",query).done(function(obj){
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
            requestURL(dataService+"/product/exportProductCategoryTrafficDataMonth",query).done(function(obj){
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
        requestURL(dataService+"/product/getProductCategoryTrafficDateDetailInfo",query).done(function(ret){
            dfd.resolve(ret)
        });
    }else if(flag=="weekly"){
        requestURL(dataService+"/product/getProductCategoryTrafficWeekDetailInfo",query).done(function(ret){
            dfd.resolve(ret)
        });
    }else if(flag=="monthly"){
        requestURL(dataService+"/product/getProductCategoryTrafficMonthDetailInfo",query).done(function(ret){
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
function drawtrafficFunnelChart(data) {
    var selectDate;
    var dateType =$(".dateType").val();
    if(dateType=="daily"){
        dt = $('.dateSelectLabel').text().replace(/ /g,"").split("~");
        selectDate = dt[1];
    }else if(dateType=="weekly"){
        dt = $('.weekSelectLabel').text().replace(/ /g,"").split("~");
        selectDate = dt[1];
    }else if(dateType=="monthly"){
        dt = $('.monthSelectLabel').text().replace(/ /g,"").split("~");
        selectDate = dt[1];
    }
    var Data=[];
    data.forEach(function (e) {
        switch(selectDate){
            case e.date:
                Data.push(e.query);
                Data.push(e.querySuccess);
                Data.push(e.tradeType);
                Data.push(e.submit);
                break;
        }
    });

    var yData = ['询价访客数',
        "询价完成转化率"+(Data[1] / Data[0] * 100).toFixed(2) + '%\n 询价完成访客数UV',
        "选择交易方式率"+(Data[2] / Data[0] * 100).toFixed(2) + '%\n 选择交易方式访客数UV',
        "提交率"+(Data[2] / Data[0] * 100).toFixed(2) + '%\n 提交访客数UV'].reverse();

    var option = {
        title: {
            text: '品类流量漏斗'+"(日期"+selectDate+")",
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
                name: '品类流量漏斗',
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
                query:[],
                querySuccess:[],
                querySuccessRate:[],
                tradeType:[],
                tradeTypeRate:[],
                submit: [],
                submitRate: []
            };
            data.forEach(function(e){
                xAxis_data.push(e.date);
                series.query.push(e.query);
                series.querySuccess.push(e.querySuccess);
                series.querySuccessRate.push(((e.querySuccess/ e.query)*100).toFixed(2));
                series.tradeType.push(e.tradeType);
                series.tradeTypeRate.push(((e.tradeType/ e.query)*100).toFixed(2));
                series.submit.push(e.submit);
                series.submitRate.push(((e.submit/ e.query)*100).toFixed(2));
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
                    data:['询价访客数','询价完成访客数','询价完成转化率','选择交易方式访客数','选择交易方式转化率','提交访客数','提交转化率']
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
                        name:'询价访客数',
                        type:'line',
                        data:series.query
                    },{
                        name:'询价完成访客数',
                        type:'line',
                        data:series.querySuccess
                    },{
                        name:'询价完成转化率',
                        type:'line',
                        yAxisIndex:1,
                        data:series.querySuccessRate
                    },
                    {
                        name:'选择交易方式访客数',
                        type:'line',
                        data:series.tradeType
                    },{
                        name:'选择交易方式转化率',
                        type:'line',
                        yAxisIndex:1,
                        data:series.tradeTypeRate
                    },
                    {
                        name:'提交访客数',
                        type:'line',
                        data:series.submit
                    },{
                        name:'提交转化率',
                        type:'line',
                        yAxisIndex:1,
                        data:series.submitRate
                    }
                ]
            };
            var trafficStackChart = echarts.init(document.getElementById('trafficStackChart'));
            trafficStackChart.setOption(option);
            window.addEventListener('resize',trafficStackChart.resize)
}
