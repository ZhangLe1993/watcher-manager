Template.complaintAnalysis.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#CustomerServiceTab').addClass('active');
    $('#complaintAnalysis').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }
    var dateGap = -14;
    var minWeekDate = "2016-07-03";
    var minMonthDate = "2016-07-01";
    var endDate = new Date().getNewDate(-1);
    var startDate = new Date(endDate).getNewDate(dateGap);
    var startWeekDate = moment().weekday(-14).format("YYYY-MM-DD")
    var endWeekDate = moment().weekday(-7).format("YYYY-MM-DD")
    if(startWeekDate<minWeekDate){
        startWeekDate = minWeekDate;
    }
    var startMonthDate = moment().subtract(1, 'month').startOf('month').format("YYYY-MM-DD");
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
    $(".search1").click(function(){
        var text=$("#textInput1").val();
        if(text!="") {
            insertExplain(text, '1');
        }
    });
    $(".search2").click(function(){
        var text=$("#textInput2").val();
        if(text!="") {
            insertExplain(text, '2');
        }
    });
    $(".search3").click(function(){
        var text=$("#textInput3").val();
        if(text!="") {
            insertExplain(text, '3');
        }
    });
    $(".search4").click(function(){
        var text=$("#textInput4").val();
        if(text!="") {
            insertExplain(text, '4');
        }
    });
    $(".search5").click(function(){
        var text=$("#textInput5").val();
        if(text!="") {
            insertExplain(text, '5');
        }
    });
    $(".search6").click(function(){
        var text=$("#textInput6").val();
        if(text!="") {
            insertExplain(text, '6');
        }
    });
    $(".search7").click(function(){
        var text=$("#textInput7").val();
        if(text!="") {
            insertExplain(text, '7');
        }
    });

    $(".export").click(function(){
        $("li[data-type='csv']").click();
    });

    getValue();
    getComment();
};

function pickWebTrafficFunnelDateRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.dateSelectLabel').html(sdt+"~"+edt);

    getValue();

//    $(".webTrafficFunnelDate").show();
//    $(".webTrafficFunnelWeek").hide();
//    $(".webTrafficFunnelMonth").hide();
//    dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g,"").split("~");
//    var startDate = dt[0];
//    var endDate = dt[1];
//    var query = {
//        "startDate": startDate,
//        "endDate": endDate
//    };
//    requestURL(dataService + "/webTraffic/productTrafficFunnel", query).done(function (data) {
//        getValue(data);
//    });
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

function insertExplain(text,flag){
    var value={
        "text":text,
        "flag":flag
    }
    var promise=insertSample(value);
    promise.done(function(re){
        getComment();
    });
}

function insertSample(query){
    var dfd = $.Deferred();
    requestURL(dataService + "/crm/putComplaintComment", query).done(function(ret){
            dfd.resolve(ret)
        });
    return dfd.promise()
}

function getComment(){
    requestURL(dataService + "/crm/getComplaintComment", {}).done(function (data) {
        data.forEach(function(e){
            if(e.flag=="1"){
                $("#textOutput1").html(e.comment);
                $("#textInput1").val("");
            }else if(e.flag=="2"){
                $("#textOutput2").html(e.comment);
                $("#textInput2").val("");
            }else if(e.flag=="3"){
                $("#textOutput3").html(e.comment);
                $("#textInput3").val("");
            }else if(e.flag=="4"){
                $("#textOutput4").html(e.comment);
                $("#textInput4").val("");
            }else if(e.flag=="5"){
                $("#textOutput5").html(e.comment);
                $("#textInput5").val("");
            }else if(e.flag=="6"){
                $("#textOutput6").html(e.comment);
                $("#textInput6").val("");
            }else if(e.flag=="7"){
                $("#textOutput7").html(e.comment);
                $("#textInput7").val("");
            }
        })
    });
}

function getValue(){
    var dateType ="daily";
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
        requestURL(dataService + "/crm/getComplaintDifficultTable", query).done(function (data) {
            drawWebTrafficFunnelComplaintDifficultChartPortal(data);
            renderTable('#atable',data);
        });
        requestURL(dataService + "/crm/getComplaintResponsibleTable", query).done(function (data) {
            drawWebTrafficComplaintResponsibleChartPortal(data);
            renderTable('#btable',data);
        });
        requestURL(dataService + "/crm/getComplaintTradeMethodTable", query).done(function (data) {
            drawWebTrafficFunnelComplaintTradeMethodChart(data);
            renderTable('#ctable',data);
        });
        requestURL(dataService + "/crm/getComplaintTradePlatformTable", query).done(function (data) {
            drawWebTrafficComplaintTradePlatformChart(data);
            renderTable('#dtable',data);
        });
        requestURL(dataService + "/crm/getComplaintTypeTable", query).done(function (data) {
            drawWebTrafficComplaintComplaintTypeChart(data);
            renderTable('#etable',data);
        });
        requestURL(dataService + "/crm/getComplaintResponsibleReparation", query).done(function (data) {
            drawWebTrafficComplaintComplaintResponsibleChart(data);
            drawWebTrafficComplaintComplaintReparationChart(data);
            //renderTable('#gtable',data);
        });
        //requestURL(dataService + "/crm/getComplaintResponsibleReparationTable", query).done(function (data) {
        //    renderTable('#gtable',data);
        //});
        //renderTable(data);
    }
}

function countPlus(data,key){
    var value=0;
    data.forEach(function(e){
        if(e.mode==key){
            value+= e.count;
        }
    })
    return value;
}

//异议处理量与难度系数分类
function renderTable(tableName,data) {
    $(tableName).bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        data:data
    });
}

function drawWebTrafficFunnelComplaintDifficultChartPortal(data) {

    var colors = ['#172ac1','#172ac1','#172ac1','#172ac1'].reverse();
    var dataSet={
        mode:[],
        count:[]
    }
    var total= 0,keyTotal= 0,tempKey=[];
    data.forEach(function(e){
        if(!_.contains(tempKey, e.mode)){
            tempKey.push(e.mode);
            keyTotal=countPlus(data, e.mode);
            dataSet.mode.push(e.mode+" : "+ keyTotal);
            dataSet.count.push({
                value: keyTotal,
                itemStyle: {
                    normal: {
                        color: colors.pop()
                    }
                }
            });
            total+= keyTotal;
        }
    });
    var rate=[];
    for(var i=0;i<dataSet.count.length;i++){
        rate.push(((dataSet.count[i].value/total)*100).toFixed(2));
    }
    var option = {
        tooltip: {
            trigger: 'axis',
            formatter:function(params,ticket,callback){
                var str = params[0].name + '<br/>';
                params.forEach(function(obj){
                    if(obj.seriesName!="占比"){
                        str += obj.seriesName + ' : ' + obj.value + '<br/>'
                    }else{
                        str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                    }
                });
                return str;
            }
        },
        toolbox: {
            // y: 'bottom',
            feature: {
                saveAsImage: {
                    pixelRatio: 2
                }
            }
        },
        legend: {
            data:['投诉量','占比']
        },
        color:['#172ac1', '#172ac1'],
        xAxis: [
            {
                type: 'category',
                data: dataSet.mode
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '投诉量'
            },
            {
                type: 'value',
                name: '占比',
                axisLabel: {
                    formatter: function (val) {
                        return val + '%';
                    }
                },
                splitLine: {
                    show: false
                }
            }
        ],
        series: [
            {
                name:'投诉量',
                type:'bar',
                //label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                //itemStyle: {
                //    normal: {
                //        color: '#b91212'
                //    }
                //},
                data:dataSet.count
            },
            {
                name:'占比',
                type:'line',
                symbol:'triangle',
                symbolSize:10,
                lineStyle:{
                    normal:{
                        width:3
                    }
                },
                yAxisIndex:1,
                label: {normal: {show: true, position: 'top', formatter: '{c}%',textStyle:{color:'#333333'}}},
                itemStyle: {
                    normal: {
                        color: '#b91212'
                    }
                },
                data:rate
            }
        ]
    };
    var webTrafficFunnelSummaryChart = echarts.init(document.getElementById('webTrafficFunnelComplaintDifficultChart'));
    webTrafficFunnelSummaryChart.setOption(option)
    window.addEventListener('resize',webTrafficFunnelSummaryChart.resize)
}

function drawWebTrafficComplaintResponsibleChartPortal(data) {

    var noResponsible=0;
    var responsible=0;
    data.forEach(function (e) {
        noResponsible+= e.count;
        responsible+= e.sum;
    })
    var option = {
        tooltip : {
            trigger: 'item',
            formatter: "{b} : {c} ({d}%)"
        },
        toolbox: {
            // y: 'bottom',
            feature: {
                saveAsImage: {
                    pixelRatio: 2
                }
            }
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: ['有责投诉','无责投诉']
        },
        color:['#b91212', '#172ac1'],
        series : [
            {
                name: '访问来源',
                type: 'pie',
                label: {normal: {show: true, position: 'inside', formatter: '{b} : {c} ({d}%)'}},
                radius : '75%',
                center: ['50%', '53%'],
                data:[
                    {value:noResponsible, name:'无责投诉'},
                    {value:responsible, name:'有责投诉'}
                ],
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
    var webTrafficFunnelSummaryChart = echarts.init(document.getElementById('webTrafficComplaintResponsibleChart'));
    webTrafficFunnelSummaryChart.setOption(option)
    window.addEventListener('resize',webTrafficFunnelSummaryChart.resize)
}

function drawWebTrafficFunnelComplaintTradeMethodChart(data) {

    var colors = ['#172ac1','#172ac1','#172ac1'].reverse();
    var dataSet={
        mode:[],
        count:[]
    }
    var total= 0,keyTotal= 0,tempKey=[],i=0;
    data.forEach(function(e){
        if(!_.contains(tempKey, e.mode)){
            tempKey.push(e.mode);
            keyTotal=countPlus(data, e.mode);
            dataSet.mode.push(e.mode+" : "+ keyTotal);
            dataSet.count.push({
                value: keyTotal,
                itemStyle: {
                    normal: {
                        color: colors[i%3]
                    }
                }
            });
            i++;
            total+= keyTotal;
        }
    });
    var rate=[];
    for(var i=0;i<dataSet.count.length;i++){
        rate.push(((dataSet.count[i].value/total)*100).toFixed(2));
    }
    var option = {
        tooltip: {
            trigger: 'axis',
            formatter:function(params,ticket,callback){
                var str = params[0].name + '<br/>';
                params.forEach(function(obj){
                    if(obj.seriesName!="占比"){
                        str += obj.seriesName + ' : ' + obj.value + '<br/>'
                    }else{
                        str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                    }
                });
                return str;
            }
        },
        toolbox: {
            // y: 'bottom',
            feature: {
                saveAsImage: {
                    pixelRatio: 2
                }
            }
        },
        legend: {
            data:['投诉量','占比']
        },
        color:['#172ac1', '#172ac1'],
        xAxis: [
            {
                type: 'category',
                data: dataSet.mode
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '投诉量'
            },
            {
                type: 'value',
                name: '占比',
                axisLabel: {
                    formatter: function (val) {
                        return val + '%';
                    }
                },
                splitLine: {
                    show: false
                }
            }
        ],
        series: [
            {
                name:'投诉量',
                type:'bar',
                //label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                data:dataSet.count
            },
            {
                name:'占比',
                type:'line',
                symbol:'triangle',
                symbolSize:10,
                lineStyle:{
                    normal:{
                        width:3
                    }
                },
                yAxisIndex:1,
                label: {normal: {show: true, position: 'top', formatter: '{c}%',textStyle:{color:'#333333'}}},
                itemStyle: {
                    normal: {
                        color: '#b91212'
                    }
                },
                data:rate
            }
        ]
    };
    var webTrafficFunnelSummaryChart = echarts.init(document.getElementById('webTrafficComplaintTradeMethodChart'));
    webTrafficFunnelSummaryChart.setOption(option)
    window.addEventListener('resize',webTrafficFunnelSummaryChart.resize)
}

function drawWebTrafficComplaintTradePlatformChart(data) {

    var colors = ['#172ac1','#172ac1','#172ac1'].reverse();
    var dataSet={
        mode:[],
        count:[]
    }
    var total= 0,keyTotal= 0,tempKey=[],i=0;
    data.forEach(function(e){
        if(!_.contains(tempKey, e.mode)){
            tempKey.push(e.mode);
            keyTotal=countPlus(data, e.mode);
            dataSet.mode.push(e.mode+" : "+ keyTotal);
            dataSet.count.push({
                value: keyTotal,
                itemStyle: {
                    normal: {
                        color: colors[i%3]
                    }
                }
            });
            i++;
            total+= keyTotal;
        }
    });
    var rate=[];
    for(var i=0;i<dataSet.count.length;i++){
        rate.push(((dataSet.count[i].value/total)*100).toFixed(2));
    }
    var option = {
        tooltip: {
            trigger: 'axis',
            formatter:function(params,ticket,callback){
                var str = params[0].name + '<br/>';
                params.forEach(function(obj){
                    if(obj.seriesName!="占比"){
                        str += obj.seriesName + ' : ' + obj.value + '<br/>'
                    }else{
                        str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                    }
                });
                return str;
            }
        },
        toolbox: {
            // y: 'bottom',
            feature: {
                saveAsImage: {
                    pixelRatio: 2
                }
            }
        },
        legend: {
            data:['投诉量','占比']
        },
        color:['#172ac1', '#172ac1'],
        xAxis: [
            {
                type: 'category',
                data: dataSet.mode
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '投诉量'
            },
            {
                type: 'value',
                name: '占比',
                axisLabel: {
                    formatter: function (val) {
                        return val + '%';
                    }
                },
                splitLine: {
                    show: false
                }
            }
        ],
        series: [
            {
                name:'投诉量',
                type:'bar',
                //label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                data:dataSet.count
            },
            {
                name:'占比',
                type:'line',
                symbol:'triangle',
                symbolSize:10,
                lineStyle:{
                    normal:{
                        width:3
                    }
                },
                label: {normal: {show: true, position: 'top', formatter: '{c}%',textStyle:{color:'#333333'}}},
                yAxisIndex:1,
                itemStyle: {
                    normal: {
                        color: '#b91212'
                    }
                },
                data:rate
            }
        ]
    };
    var webTrafficFunnelSummaryChart = echarts.init(document.getElementById('webTrafficComplaintTradePlatformChart'));
    webTrafficFunnelSummaryChart.setOption(option)
    window.addEventListener('resize',webTrafficFunnelSummaryChart.resize)
}

function drawWebTrafficComplaintComplaintTypeChart(data) {

    var colors = ['#172ac1','#172ac1','#172ac1'].reverse();
    var dataSet={
        mode:[],
        count:[]
    }
    var total= 0,keyTotal= 0,tempKey=[],se=[];
    data.forEach(function(e){
        if(!_.contains(tempKey, e.mode)){
            tempKey.push(e.mode);
            keyTotal=countPlus(data, e.mode);
            se.push({mode:e.mode,cnt:keyTotal});
        }
    });
    var tempCnt=[];
    dataSet.mode= _.map(se.sort(getSortOrder('cnt')),function(ele){
        return ele.mode+":"+ele.cnt;
    })
    var j=0;
    tempCnt= _.map(se.sort(getSortOrder('cnt')),function(ele){
        return ele.cnt;
    })
    for(var i=0;i<tempCnt.length;i++){
        total+=tempCnt[i];
        dataSet.count.push({
            value: tempCnt[i],
            itemStyle: {
                normal: {
                    color: colors[j%3]
                }
            }
        });
        j++;
    }
    var rate=[];
    for(var i=0;i<dataSet.count.length;i++){
        rate.push(((dataSet.count[i].value/total)*100).toFixed(2));
    }
    var option = {
        tooltip: {
            trigger: 'axis',
            formatter:function(params,ticket,callback){
                var str = params[0].name + '<br/>';
                params.forEach(function(obj){
                    if(obj.seriesName!="占比"){
                        str += obj.seriesName + ' : ' + obj.value + '<br/>'
                    }else{
                        str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                    }
                });
                return str;
            }
        },
        toolbox: {
            // y: 'bottom',
            feature: {
                saveAsImage: {
                    pixelRatio: 2
                }
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '25%',
            containLabel: true
        },
        legend: {
            data:['投诉量','占比']
        },
        color:['#172ac1', '#172ac1'],
        xAxis: [
            {
                type: 'category',
                data: dataSet.mode,
                axisLabel: {
                    show: true,
                    rotate: 60,
                    interval: 0
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '投诉量'
            },
            {
                type: 'value',
                name: '占比',
                axisLabel: {
                    formatter: function (val) {
                        return val + '%';
                    }
                },
                splitLine: {
                    show: false
                }
            }
        ],
        series: [
            {
                name:'投诉量',
                type:'bar',
                //label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                data:dataSet.count
            },
            {
                name:'占比',
                type:'line',
                symbol:'triangle',
                symbolSize:10,
                lineStyle:{
                    normal:{
                        width:3
                    }
                },
                label: {normal: {show: true, position: 'top', formatter: '{c}%',textStyle:{color:'#333333'}}},
                yAxisIndex:1,
                itemStyle: {
                    normal: {
                        color: '#b91212'
                    }
                },
                data:rate
            }
        ]
    };
    var webTrafficFunnelSummaryChart = echarts.init(document.getElementById('webTrafficComplaintComplaintTypeChart'));
    webTrafficFunnelSummaryChart.setOption(option)
    window.addEventListener('resize',webTrafficFunnelSummaryChart.resize)
}

function drawWebTrafficComplaintComplaintResponsibleChart(data) {

    var colors = ['#172ac1','#172ac1','#172ac1'].reverse();
    var dataSet={
        mode:[],
        count:[]
    }
    var total= 0,i=0;
    var tableJson = [];
    data.forEach(function(e){
        if(e.mode!='投诉专用—客户'& e.mode!='客户安抚') {
            dataSet.mode.push(e.mode + " : " + e.count);
            dataSet.count.push({
                value: e.count,
                itemStyle: {
                    normal: {
                        color: colors[i % 3]
                    }
                }
            });
            i++;
            total += e.count;
            var tmp = {
                "mode": e.mode,
                "count": e.count
            };
            tableJson.push(tmp);
        }
    });
    renderTable('#gtable',tableJson);
    var rate=[];
    for(var i=0;i<dataSet.count.length;i++){
        rate.push(((dataSet.count[i].value/total)*100).toFixed(2));
    }
    var option = {
        tooltip: {
            trigger: 'axis',
            formatter:function(params,ticket,callback){
                var str = params[0].name + '<br/>';
                params.forEach(function(obj){
                    if(obj.seriesName!="占比"){
                        str += obj.seriesName + ' : ' + obj.value + '<br/>'
                    }else{
                        str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                    }
                });
                return str;
            }
        },
        toolbox: {
            // y: 'bottom',
            feature: {
                saveAsImage: {
                    pixelRatio: 2
                }
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '25%',
            containLabel: true
        },
        legend: {
            data:['投诉量','占比']
        },
        color:['#172ac1', '#172ac1'],
        xAxis: [
            {
                type: 'category',
                data: dataSet.mode,
                axisLabel: {
                    show: true,
                    rotate: 60,
                    interval: 0
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '投诉量'
            },
            {
                type: 'value',
                name: '占比',
                axisLabel: {
                    formatter: function (val) {
                        return val + '%';
                    }
                },
                splitLine: {
                    show: false
                }
            }
        ],
        series: [
            {
                name:'投诉量',
                type:'bar',
                //label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                data:dataSet.count
            },
            {
                name:'占比',
                type:'line',
                symbol:'triangle',
                symbolSize:10,
                lineStyle:{
                    normal:{
                        width:3
                    }
                },
                label: {normal: {show: true, position: 'top', formatter: '{c}%',textStyle:{color:'#333333'}}},
                yAxisIndex:1,
                itemStyle: {
                    normal: {
                        color: '#b91212'
                    }
                },
                data:rate
            }
        ]
    };
    var webTrafficFunnelSummaryChart = echarts.init(document.getElementById('webTrafficComplaintComplaintResponsibleChart'));
    webTrafficFunnelSummaryChart.setOption(option)
    window.addEventListener('resize',webTrafficFunnelSummaryChart.resize)
}

//数组对象排序
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


function drawWebTrafficComplaintComplaintReparationChart(data) {

    var colors = ['#172ac1','#172ac1','#172ac1'].reverse();
    var dataSet={
        mode:[],
        cnt:[]
    }
    var total= 0,i=0;
    var se=[];
    data.forEach(function(e){
        if(e.sum>0) {
                se.push({mode: e.mode, cnt: e.sum});
        }
    });
    var tempCnt=[];
    dataSet.mode= _.map(se.sort(getSortOrder('cnt')),function(ele){
        return ele.mode+":"+ele.cnt;
    })
    var j=0;
    tempCnt= _.map(se.sort(getSortOrder('cnt')),function(ele){
        return ele.cnt;
    });
    var tableJson = [];
    for(var i=0;i<tempCnt.length;i++){
        total+=tempCnt[i];
        dataSet.cnt.push({
            value: tempCnt[i],
            itemStyle: {
                normal: {
                    color: colors[j%3]
                }
            }
        });
        j++;
        var tmp = {
            "mode": dataSet.mode[i].split(":")[0],
            "cnt":tempCnt[i]
        };
        tableJson.push(tmp);
    }
    var rate=[];
    for(var i=0;i<dataSet.cnt.length;i++){
        rate.push(((dataSet.cnt[i].value/total)*100).toFixed(2));
    }

    //table
    renderTable('#htable',tableJson);

    var option = {
        tooltip: {
            trigger: 'axis',
            formatter:function(params,ticket,callback){
                var str = params[0].name + '<br/>';
                params.forEach(function(obj){
                    if(obj.seriesName!="占比"){
                        str += obj.seriesName + ' : ' + obj.value + '<br/>'
                    }else{
                        str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                    }
                });
                return str;
            }
        },
        toolbox: {
            // y: 'bottom',
            feature: {
                saveAsImage: {
                    pixelRatio: 2
                }
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '25%',
            containLabel: true
        },
        legend: {
            data:['投诉量','占比']
        },
        color:['#172ac1', '#172ac1'],
        xAxis: [
            {
                type: 'category',
                data: dataSet.mode,
                axisLabel: {
                    show: true,
                    rotate: 60,
                    interval: 0
                }
            }
        ],
        yAxis: [
            {
                type: 'value',
                name: '投诉量'
            },
            {
                type: 'value',
                name: '占比',
                axisLabel: {
                    formatter: function (val) {
                        return val + '%';
                    }
                },
                splitLine: {
                    show: false
                }
            }
        ],
        series: [
            {
                name:'投诉量',
                type:'bar',
                //label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                data:dataSet.cnt
            },
            {
                name:'占比',
                type:'line',
                symbol:'triangle',
                symbolSize:10,
                lineStyle:{
                    normal:{
                        width:3
                    }
                },
                yAxisIndex:1,
                label: {normal: {show: true, position: 'top', formatter: '{c}%',textStyle:{color:'#333333'}}},
                itemStyle: {
                    normal: {
                        color: '#b91212'
                    }
                },
                data:rate
            }
        ]
    };
    var webTrafficFunnelSummaryChart = echarts.init(document.getElementById('webTrafficComplaintComplaintReparationChart'));
    webTrafficFunnelSummaryChart.setOption(option)
    window.addEventListener('resize',webTrafficFunnelSummaryChart.resize)
}