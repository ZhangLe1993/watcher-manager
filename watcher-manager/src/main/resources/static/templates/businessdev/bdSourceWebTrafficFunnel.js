
Template.bdSourceWebTrafficFunnel.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#BDTab').addClass('active');
    $('#bdSourceWebTrafficFunnel').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }
    var dateGap = -7;
    var minWeekDate = "2015-01-01";
    var minMonthDate = "2015-01-01";
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
        "minDate": transformDate("2015-01-01"),
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


    $(".dateSelectLabel").html(startDate+"~"+endDate);
    $('.webTrafficFunnelDate').daterangepicker(datePickerOptions, pickWebTrafficFunnelDateRangeCallback);

    var weekPickerOptions = {
        onlyShowfirstDayOfWeek:true,
        "showDropdowns": true,
        //"alwaysShowCalendars": true,
        "alwaysShowCalendars": false,
        //"singleDatePicker": true,
        "autoApply": true,
        "startDate": transformDate(startWeekDate),
        "endDate": transformDate(endWeekDate),
        "minDate": transformDate(minWeekDate),
        "maxDate": transformDate(endWeekDate),
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
            '上周': [moment().subtract(1, 'week').startOf('week').toDate(), moment().subtract(1, 'week').startOf('week').toDate()],
            '上5周': [moment().subtract(5, 'week').startOf('week').toDate(), moment().subtract(1, 'week').startOf('week').toDate()],
            '上10周': [moment().subtract(10, 'week').startOf('week').toDate(), moment().subtract(1, 'week').startOf('week').toDate()],
            '上15周': [moment().subtract(15, 'week').startOf('week').toDate(), moment().subtract(1, 'week').startOf('week').toDate()],
            '今年': [moment().startOf('year').startOf('week').toDate(), moment().subtract(1, 'week').startOf('week').toDate()],
            '去年': [moment().subtract(1, 'year').startOf('year').startOf('week').toDate(), moment().subtract(1, 'year').endOf('year').startOf('week').toDate()]
        }
    };

    $(".weekSelectLabel").html(startWeekDate+"~"+endWeekDate);
    $('.webTrafficFunnelWeek').daterangepicker(weekPickerOptions, pickWebTrafficFunnelWeekRangeCallback);

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

    //添加筛选项
    renderFilterOptions();

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

        var source = $(this).parent().find(".source").val();
        var query={
            "startDate":startDate,
            "endDate":endDate,
            "source":source,
        }

        var queryWeek={
            "startDate":startDateWeek,
            "endDate":endDateWeek,
            "source":source,
        }

        var queryMonth={
            "startDate":startDateMonth,
            "endDate":endDateMonth,
            "source":source,
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

function getFilterOptions(){
    var dfd = $.Deferred();
    requestURL(dataService+"/bd/getBdAggregateWebTrafficFilterOptions",{}).done(function(ret){
        dfd.resolve(ret)
    });
    return dfd.promise()
}

function renderFilterOptions(){
    var promise = getFilterOptions();
    promise.done(function(data){
        /*渠道来源*/
        $(".source").attr("multiple","multiple");
        renderOptions(".source",data.source);
        //renderOptions(".source", ["58到家", "一号店", "三星", "京东", "大疆", "小米", "腾讯", "金立", "飞凡", "DELL", "喜马拉雅FM", "锤子", "平安", "糯米", "极米", "掌引","芝麻信用"]);

        $(".source").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false,
            filter: true
        });
    })
}


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

function renderPage(filter){
    //var dateGap = -15;
    $("#chartContent").hide();
    $("#loading").show();
    var promise = getAggregateWebTrafficData(filter);
    promise.done(function(ret){
        $("#chartContent").show();
        $("#loading").hide();
        drawtrafficFunnelChart(ret);
        drawtrafficStackChart(ret);

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
        requestURL(dataService+"/bd/bdAggregateWebTrafficDataDay",query).done(function(ret){
            dfd.resolve(ret)
        });
    }else if(flag=="weekly"){
        requestURL(dataService+"/bd/bdAggregateWebTrafficDataWeek",query).done(function(ret){
            dfd.resolve(ret)
        });
    }else if(flag=="monthly"){
        requestURL(dataService+"/bd/bdAggregateWebTrafficDataMonth",query).done(function(ret){
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}


//获取总的数据
function  getCalcDataByDate(data){
    var series = {
        inquiryUv:[],
        submitUv:[],
        tradeUv:[],
    };
    series.inquiryUv[0]=0;
    series.submitUv[0]=0;
    series.tradeUv[0]=0;
    data.forEach(function (e) {
        series.inquiryUv[0]+=eval(e.inquiryUv);
        series.submitUv[0]+=eval(e.submitUv);
        series.tradeUv[0]+=eval(e.tradeUv);
    });
    return series;
}

function renderTable(filter,obj){
        var fixRow = '"<tr style="background-color: #acc087;"", " ", "", "", " data-index="0"", "", "", ">", "<td  style=""    >总数</td>", "<td  style=""    >-</td>", "<td  style=""    >'+obj.inquiryUv[0]+'</td>", "<td  style=""    >'+obj.submitUv[0]+'</td>", "<td  style=""    >'+obj.tradeUv[0]+'</td>","</tr>"'
        var ajaxQuery = _.clone(filter);
        $('#table').bootstrapTable('destroy').bootstrapTable({
            // exportDataType: 'all',
            //pagination: true,
            //sidePagination: 'server',
            exportDataType: 'all',
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
        requestURL(dataService+"/bd/bdWebTrafficDataDay",query).done(function(ret){
            dfd.resolve(ret)
        });
    }else if(flag=="weekly"){
        requestURL(dataService+"/bd/bdWebTrafficDataWeek",query).done(function(ret){
            dfd.resolve(ret)
        });
    }else if(flag=="monthly"){
        requestURL(dataService+"/bd/bdWebTrafficDataMonth",query).done(function(ret){
            dfd.resolve(ret)
        });
    }
    return dfd.promise();
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
    data.forEach(function (e) {
        switch(selectDate){
           case e.date:
                Data.push(e.inquiryUv);
                Data.push(e.submitUv);
                Data.push(e.tradeUv);
                break;
        }
    });

    var yData = ['询价量',
        "提交转化率"+(Data[1] / Data[0] * 100).toFixed(2) + '%\n 提交量',
        "成交转化率"+(Data[2] / Data[0] * 100).toFixed(2) + '%\n 成交量'].reverse();

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
                inquiryUv:[],
                submitUv:[],
                submitRate:[],
                tradeUv: [],
                tradeRate:[]
            };
            data.forEach(function(e){
                xAxis_data.push(e.date);
                series.inquiryUv.push(e.inquiryUv);
                series.submitUv.push(e.submitUv);
                series.submitRate.push(((e.submitUv/ e.inquiryUv)*100).toFixed(2))
                series.tradeUv.push(e.tradeUv);
                series.tradeRate.push(((e.tradeUv/ e.inquiryUv)*100).toFixed(2))
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
                    data:['询价量','提交量','提交转化率','成交量','成交转化率']
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
                    name:'个数',
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
                }
                ],
                series: [
                    {
                        name:'询价量',
                        type:'line',
                        label: {
                            normal: {
                                show: true,
                                position: 'top'
                            }
                        },
                        data:series.inquiryUv
                    },
                    {
                        name:'提交量',
                        type:'line',
                        data:series.submitUv
                    },{
                        name:'提交转化率',
                        type:'line',
                        yAxisIndex:1,
                        data:series.submitRate
                    },{
                        name:'成交量',
                        type:'line',
                        data:series.tradeUv
                    },{
                        name:'成交转化率',
                        type:'line',
                        yAxisIndex:1,
                        data:series.tradeRate
                    }
                ]
            };
            var trafficStackChart = echarts.init(document.getElementById('trafficStackChart'));
            trafficStackChart.setOption(option);
            window.addEventListener('resize',trafficStackChart.resize)
}
