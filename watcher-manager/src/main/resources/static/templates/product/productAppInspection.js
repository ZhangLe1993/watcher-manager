Template.productAppInspection.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#productTab').addClass('active');
    $('#productAppInspection').addClass('active');

    if(isMobile()){
        $('.sidebar-toggle').click();
    }

//    var trafficStackChart;
//    var ua = navigator.userAgent.toLowerCase();
//    var isAndroid = ua.indexOf("android") >-1;
//    var isiOS = ua.indexOf("iphone") >-1;
//    if(isAndroid||isiOS){
//        $('.sidebar-toggle').click();
//    }
//    window.onresize=function(){
//        resize();
//    }

    var dateGap = -14;
    var minWeekDate = "2016-07-03";
    var minMonthDate = "2016-07-01";
    var endDate = new Date().getNewDate(-1);
    var startDate = new Date(endDate).getNewDate(dateGap);
    var startWeekDate = moment().weekday(-28).format("YYYY-MM-DD")
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
        onlyShowfirstDayOfMonth:true,
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

    $(".monthSelectLabel").html(startMonthDate+"~"+endMonthDate);
    $('.webTrafficFunnelMonth').daterangepicker(monthPickerOptions, pickWebTrafficFunnelMonthRangeCallback);

    $(".webTrafficFunnelDate").show();
    $(".webTrafficFunnelWeek").hide();
    $(".webTrafficFunnelMonth").hide();
    $(".dateType").on('change',function(){
        getValue();
    });

//    $(".search").click(function(){
//        var dateType =$(".dateType").val();
//        if(dateType=="daily"){
//            $(".webTrafficFunnelDate").show();
//            $(".webTrafficFunnelWeek").hide();
//            dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g,"").split("~");
//            var startDate = dt[0];
//            var endDate = dt[1];
//            var query = {
//                "startDate": startDate,
//                "endDate": endDate
//            };
//            requestURL(dataService + "/webTraffic/productTrafficFunnel", query).done(function (data) {
//                getValue(data);
//            });
//        }else if(dateType=="weekly"){
//            $(".webTrafficFunnelDate").hide();
//            $(".webTrafficFunnelWeek").show();
//            dt = $('.desktop-only .weekSelectLabel').text().replace(/ /g,"").split("~");
//            var startDate = dt[0];
//            var endDate = dt[1];
//            var query = {
//                "startDate": startDate,
//                "endDate": endDate
//            };
//            requestURL(dataService + "/webTraffic/productTrafficFunnelWeek", query).done(function (data) {
//                getValue(data);
//            });
//        }
//    });

    getValue();

};

function getValue(){
        var dateType =$(".dateType").val();
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
            requestURL(dataService + "/product/productAppInspectionDay", query).done(function (data) {
                drawWebTrafficFunnelChartPortal(data);
                renderPage(data);
            });
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
            requestURL(dataService + "/product/productAppInspectionWeek", query).done(function (data) {
                drawWebTrafficFunnelChartPortal(data);
                renderPage(data);
            });
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
            requestURL(dataService + "/product/productAppInspectionMonth", query).done(function (data) {
                drawWebTrafficFunnelChartPortal(data);
                renderPage(data);
            });
        }
}

function renderPage(data){
        var xAxis_data = [];
        var series = {
            mainUrl:[],
            selfInspectionSubmitUv:[],
            inspectionSubmitUv:[],
            selfInspectionSubmitRate:[],
            inspectionSubmitRate:[]
        };
        data.forEach(function (e) {
                    xAxis_data.push(e.date);
                    if(e.idsite==14){
                        series.mainUrl.push("Android");
                    }else{
                        series.mainUrl.push("Ios");
                    }
                    series.selfInspectionSubmitUv.push(e.selfSubmitUv);
                    series.inspectionSubmitUv.push(e.submitUv);
                    series.selfInspectionSubmitRate.push(((e.selfInspectionSubmitPassUv/ e.selfInspectionSubmitUv)*100).toFixed(2));
                    series.inspectionSubmitRate.push(((e.inspectionSubmitPassUv/ e.inspectionSubmitUv)*100).toFixed(2));
        });

        var tableJson = [];

        for(var i= 0,len=xAxis_data.length;i<len;i++){
            var tmp = {
                "date":xAxis_data[i],
                "mainUrl":series.mainUrl[i],
                "selfInspectionSubmitUv":series.selfInspectionSubmitUv[i],
                "inspectionSubmitUv":series.inspectionSubmitUv[i],
                "selfInspectionSubmitRate":(series.selfInspectionSubmitRate[i])+"%",
                "inspectionSubmitRate":(series.inspectionSubmitRate[i])+"%",
            };
            tableJson.push(tmp);
        }

        //var fixRow2 = '"<tr style="background-color: #acc087;"", " ", "", "", " data-index="0"", "", "", ">", "<td  style=""    >总数</td>", "<td  style=""    >-</td>", "<td  style=""    >'+obj.leftHomeRatio+'</td>","</tr>"'
        $('#table').bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            //pagination: true,
            //fixRow:fixRow2,
            data:tableJson,
            columns: [{
                field: 'date',
                title: '日期',
                sortable:true
            },{
                field: 'mainUrl',
                title: '平台',
                sortable:true
            },{
                field: 'selfInspectionSubmitUv',
                title: '自检提交成功数',
                sortable:true
            },{
                field: 'inspectionSubmitUv',
                title: '非自检提交成功数',
                sortable:true
            },{
                field: 'selfInspectionSubmitRate',
                title: '自检一次性质检通过率',
                sortable:true
            },{
                field: 'inspectionSubmitRate',
                title: '非自检一次性质检通过率',
                sortable:true
            }
            ],
        });
}

function drawWebTrafficFunnelChartPortal(data) {
    var xAxis_data = [];
    var series = {
        selfInspectionSubmitUvAnt:[],
        selfInspectionSubmitUvIos:[],
        inspectionSubmitUvAnt:[],
        inspectionSubmitUvIos:[],
        selfInspectionSubmitRateAnt:[],
        selfInspectionSubmitRateIos:[],
        inspectionSubmitRateAnt:[],
        inspectionSubmitRateIos:[]
    };
    data.forEach(function (e) {
        xAxis_data.push(e.date);
        switch (e.idsite) {
            case 14:
                series.selfInspectionSubmitUvAnt.push(e.selfSubmitUv);
                series.inspectionSubmitUvAnt.push(e.submitUv);
                series.selfInspectionSubmitRateAnt.push(((e.selfInspectionSubmitPassUv/ e.selfInspectionSubmitUv)*100).toFixed(2));
                series.inspectionSubmitRateAnt.push(((e.inspectionSubmitPassUv/ e.inspectionSubmitUv)*100).toFixed(2));
                break;
            case 17:
                series.selfInspectionSubmitUvIos.push(e.selfSubmitUv);
                series.inspectionSubmitUvIos.push(e.submitUv);
                series.selfInspectionSubmitRateIos.push(((e.selfInspectionSubmitPassUv/ e.selfInspectionSubmitUv)*100).toFixed(2));
                series.inspectionSubmitRateIos.push(((e.inspectionSubmitPassUv/ e.inspectionSubmitUv)*100).toFixed(2));
                break;
            default:
                break;
        }
    });

    xAxis_data=_.uniq(xAxis_data);

    var option = {
        title: {
            text: '自检通过率',
            x: "center",
            y: "bottom"
        },
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
            fromatter:function(name){
                return name;
            },
            data: [{name:'全选',icon: 'circle'},'Android自检提交成功UV','Android非自检提交成功UV','Android自检一次性通过率','Android非自检一次性通过率','Ios自检提交成功UV','Ios非自检提交成功UV','Ios自检一次性通过率','Ios非自检一次性通过率']
        },
        grid: {
            show: false,
            left: '3%',
            right: '4%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: true,
            data: xAxis_data
        },
        yAxis: [
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
        series: [{
                    name:'全选',
                    type:'line',
                    data:[]
                },
                {
                   name: 'Android自检提交成功UV',
                   type: 'bar',
                   yAxisIndex: 0,
                   data: series.selfInspectionSubmitUvAnt
               },
               {
                   name: 'Android非自检提交成功UV',
                   type: 'bar',
                   yAxisIndex: 0,
                   data: series.inspectionSubmitUvAnt
               },
                {
                    name: 'Android自检一次性通过率',
                    type: 'line',
                    yAxisIndex: 0,
                    data: series.selfInspectionSubmitRateAnt
                },
                {
                    name: 'Android非自检一次性通过率',
                    type: 'line',
                    yAxisIndex: 0,
                    data: series.inspectionSubmitRateAnt
                },
                {
                    name: 'Ios自检提交成功UV',
                    type: 'bar',
                    yAxisIndex: 0,
                    data: series.selfInspectionSubmitUvIos
                },
                {
                    name: 'Ios非自检提交成功UV',
                    type: 'bar',
                    yAxisIndex: 0,
                    data: series.inspectionSubmitUvIos
                },
                {
                    name: 'Ios自检一次性通过率',
                    type: 'line',
                    yAxisIndex: 0,
                    data: series.selfInspectionSubmitRateIos
                },
                {
                    name: 'Ios非自检一次性通过率',
                    type: 'line',
                    yAxisIndex: 0,
                    data: series.inspectionSubmitRateIos
                }
        ]
    };
    var trafficStackChart = echarts.init(document.getElementById('webTrafficStackChartPortal'));
    trafficStackChart.setOption(option);


    setTimeout(function (){
        /*window.onresize = function () {
            dailyTrafficStackChart.resize();
        }*/
        window.addEventListener('resize',function () {
            trafficStackChart.resize();
        })
    },200)

    trafficStackChart.on('legendselectchanged',function(params){
        //var legendDict = params.selected;
        //var tmpObj = {}
        //for(var key in legendDict){
        //    if(legendDict[key]){
        //        tmpObj[key]
        //    }
        //}
        var all=params.selected;
        var key = params.name;
        option.legend.selected={};
        if(key=='全选'&&params.selected[key]==true){
            for(var a in all){
                all[a]=true;
            }
            //option.legend.selected={'全选':true,'总访客数':true,'门店回收访客数':true,'询价访客数':true,'询价完成访客数':true,'选择回收方式访客数':true,'选择支付方式访客数':true,'提交成功访客数':true,'询价转化率':true,'询价完成转化率':true,'询价完成率':true,'选择回收方式转化率':true,'选择回收方式率':true,'选择支付方式转化率':true,'选择支付方式率':true,'提交成功转化率':true,'提交成功率':true};
        }else if(key=='全选'&&params.selected[key]==false)
        {
            for(var a in all){
                all[a]=false;
            }
            //option.legend.selected={'全选':false,'总访客数':false,'门店回收访客数':false,'询价访客数':false,'询价完成访客数':false,'选择回收方式访客数':false,'选择支付方式访客数':false,'提交成功访客数':false,'询价转化率':false,'询价完成转化率':false,'询价完成率':false,'选择回收方式转化率':false,'选择回收方式率':false,'选择支付方式转化率':false,'选择支付方式率':false,'提交成功转化率':false,'提交成功率':false};
        }
        option.legend.selected=all;
        trafficStackChart.setOption(option);
    });
}

function pickWebTrafficFunnelDateRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.dateSelectLabel').html(sdt+"~"+edt);

    getValue();
}

function pickWebTrafficFunnelWeekRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.weekSelectLabel').html(sdt+"~"+edt);

    getValue();
}

function pickWebTrafficFunnelMonthRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.monthSelectLabel').html(sdt+"~"+edt);

    getValue();
}