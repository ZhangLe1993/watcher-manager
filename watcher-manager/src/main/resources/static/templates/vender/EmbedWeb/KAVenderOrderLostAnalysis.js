/**
 * Created by hsh on 2016/5/13.
 */
Template.KAVenderOrderLostAnalysis.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#KAVenderOrderLostAnalysis').addClass('active');

    var listJ = Template.list;
    console.log(listJ);
    vender_company_name.push(listJ[1]);
    vender_company_key.push(listJ[0]);

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }

    var dateGap = -6;
    var minWeekDate = "2017-02-19";
    var minMonthDate = "2017-03-01";
    var endDate = new Date().getNewDate(-1);
    var startDate = new Date(endDate).getNewDate(dateGap);
    var startWeekDate = moment().subtract(4, 'week').startOf('week').format("YYYY-MM-DD");
    var endWeekDate = moment().subtract(1, 'week').endOf('week').format("YYYY-MM-DD");
    if(startWeekDate<minWeekDate){
        startWeekDate = minWeekDate;
    }
    var startMonthDate = moment().subtract(1, 'month').startOf('month').format("YYYY-MM-DD");
    var endMonthDate = moment().subtract(1, 'month').endOf('month').format("YYYY-MM-DD");
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
        "minDate": transformDate("2016-02-17"),
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
            '上周': [moment().subtract(1, 'week').startOf('week').toDate(), moment().subtract(1, 'week').endOf('week').toDate()],
            '上5周': [moment().subtract(5, 'week').startOf('week').toDate(), moment().subtract(1, 'week').endOf('week').toDate()],
            '上10周': [moment().subtract(10, 'week').startOf('week').toDate(), moment().subtract(1, 'week').endOf('week').toDate()],
            '上15周': [moment().subtract(15, 'week').startOf('week').toDate(), moment().subtract(1, 'week').endOf('week').toDate()],
            '今年': [moment().startOf('year').startOf('week').toDate(), moment().subtract(1, 'week').endOf('week').toDate()],
            '去年': [moment().subtract(1, 'year').startOf('year').startOf('week').toDate(), moment().subtract(1, 'year').endOf('year').endOf('week').toDate()]
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
            '上月': [moment().subtract(1, 'month').startOf('month').toDate(), moment().subtract(1, 'month').endOf('month').toDate()],
            '上5月': [moment().subtract(5, 'month').startOf('month').toDate(), moment().subtract(1, 'month').endOf('month').toDate()],
            '上10月': [moment().subtract(10, 'month').startOf('month').toDate(), moment().subtract(1, 'month').endOf('month').toDate()],
            '上15月': [moment().subtract(15, 'month').startOf('month').toDate(), moment().subtract(1, 'month').endOf('month').toDate()],
            '今年': [moment().startOf('year').startOf('month').toDate(), moment().subtract(1, 'month').endOf('month').toDate()],
            '去年': [moment().subtract(1, 'year').startOf('year').startOf('month').toDate(), moment().subtract(1, 'year').endOf('year').endOf('month').toDate()]
        }
    };

    $(".monthSelectLabel").html(startMonthDate+"~"+endMonthDate);
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
            var vender = $(this).parent().find(".vender").val();
            var group = $(this).parent().find(".group").val();

            var query={
                "startDate":startDate,
                "endDate":endDate,
                "vender_company_key":vender_company_key,
                "vender":vender,
                "group":group
            };
            query=cleanParams(query);

            renderPage(query);
        }else if(dateType=="weekly"){
            $(".webTrafficFunnelDate").hide();
            $(".webTrafficFunnelWeek").show();
            $(".webTrafficFunnelMonth").hide();
            dt = $('.desktop-only .weekSelectLabel').text().replace(/ /g,"").split("~");
            var startDate = dt[0];
            var endDate = dt[1];
            var vender = $(this).parent().find(".vender").val();
            var group = $(this).parent().find(".group").val();

            var query={
                "startDate":startDate,
                "endDate":endDate,
                "vender_company_key":vender_company_key,
                "vender":vender,
                "group":group
            };
            query=cleanParams(query);

            renderPage(query)
        }else if(dateType=="monthly"){
             $(".webTrafficFunnelDate").hide();
             $(".webTrafficFunnelWeek").hide();
             $(".webTrafficFunnelMonth").show();
             dt = $('.desktop-only .monthSelectLabel').text().replace(/ /g,"").split("~");
             var startDate = dt[0];
             var endDate = dt[1];
            var vender = $(this).parent().find(".vender").val();
            var group = $(this).parent().find(".group").val();

            var query={
                "startDate":startDate,
                "endDate":endDate,
                "vender_company_key":vender_company_key,
                "vender":vender,
                "group":group
            };
            query=cleanParams(query);
             renderPage(query)
         }
    });

    var dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g,"").split("~");
    var startDate = dt[0];
    var endDate = dt[1];

    var query = {
        "vender_company_key":vender_company_key,
        "vender_company_name":vender_company_name
    };

    var queryAll = {
        "startDate": startDate,
        "endDate": endDate,
        "vender_company_key":vender_company_key,
        "vender_company_name":vender_company_name
    };

    //数据初始化加载
    renderPage(queryAll);

    //选项初始化加载
    requestURL(dataService+"/Vender/getKAFilterOptions",query).done(function(data){

        $(".vender").attr("multiple","multiple");
        renderOptions(".vender",data.subVender)

        $(".group").attr("multiple","multiple");
        renderOptions(".group",data.group)

        $(".vender").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false,
            filter: true
        });
        $(".group").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false,
            filter: true
        });

    });

    $(".search").click(function(){
        dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g,"").split("~");
        var startDate = dt[0];
        var endDate = dt[1];
        dt = $('.desktop-only .weekSelectLabel').text().replace(/ /g,"").split("~");
        var startDateWeek = dt[0];
        var endDateWeek = dt[1];
        dt = $('.desktop-only .monthSelectLabel').text().replace(/ /g,"").split("~");
        var startMonth = dt[0];
        var endMonth = dt[1];

        var vender = $(this).parent().find(".vender").val();
        var group = $(this).parent().find(".group").val();

        var query={
            "startDate":startDate,
            "endDate":endDate,
            "vender_company_key":vender_company_key,
            "vender":vender,
            "group":group
        };
        var queryWeek={
            "startDate":startDateWeek,
            "endDate":endDateWeek,
            "vender_company_key":vender_company_key,
            "vender":vender,
            "group":group
        };
        var queryMonth={
            "startDate":startMonth,
            "endDate":endMonth,
            "vender_company_key":vender_company_key,
            "vender":vender,
            "group":group
        };

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
        }else if(flag=="monthly"){
            queryMonth=cleanParams(queryMonth);
            $("#chartContent").show();
            $("#loading").hide();
            renderPage(queryMonth);
            $(".webTrafficFunnelDate").hide();
            $(".webTrafficFunnelWeek").hide();
            $(".webTrafficFunnelMonth").show();
        }

    });

};

var orderData,vender_company_key=[],vender_company_name=[],allData=[];

function renderOptions(sel,data){
    $(sel).empty();
    data.forEach(function(ele){
        $(sel).append("<option value='"+ele+"'>"+ele+"</option>")
    });
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
    $('.monthSelectLabel').html(sdt+"~"+edt);
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
    $("#chartContent").hide();
    $("#loading").show();
    var promise = getAllWebTrafficData(filter);
    promise.done(function(ret){
        $("#chartContent").show();
        $("#loading").hide();
        allData=ret;
        renderTable("#BussinessDataTable",filter);
        getOrderLostCntChart(ret);
        getOrderLostNumChart(ret);

    });

}

function getAggregateWebTrafficData(filter){
    var query = _.clone(filter);
    var flag = $(".dateType").val();
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    requestURL(dataService+"/Vender/getKAOrderLostAnalysis",query).done(function(ret){
        dfd.resolve(ret)
    });
    return dfd.promise()
}

function getAllWebTrafficData(filter){
    var query = _.clone(filter);
    var flag = $(".dateType").val();
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    requestURL(dataService+"/Vender/getKAOrderLostDayAnalysis",query).done(function(ret){
        dfd.resolve(ret)
    });
    return dfd.promise()
}




function renderTable(tableName,filter) {

    var submitCnt= 0,submitNum= 0,inqueryCnt= 0,inqueryNum= 0,diffCnt= 0,diffNum=0;
    allData.forEach(function(e){
        submitCnt+= parseInt(e.submitCnt);
        submitNum+= parseInt(e.submitNum);
        inqueryCnt+= parseInt(e.inqueryCnt);
        inqueryNum+= parseInt(e.inqueryNum);
        diffCnt+= parseInt(e.differCnt);
        diffNum+= parseInt(e.differNum);
    })

    var fixRow = '"<tr style="background-color: #acc087;"", " ", "", "", " data-index="0"", "", "", ">",' +
        ' "<td  style=""    >总计</td>", "<td  style=""    >-</td>", "<td  style=""    >'+ inqueryCnt +'</td>",' + ''
        + '"<td style="">'+ inqueryNum +'</td>", "<td  style=""    >'+ submitCnt +'</td>", "<td  style=""    >'+ submitNum +'</td>",' +
        ' "<td  style=""    >'+ diffCnt +'</td>", "<td  style=""    >'+ diffNum +'</td>"'

    var ajaxQuery = _.clone(filter);
    $(tableName).bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        pagination: true,
        sidePagination: 'server',
        ajax:function(params){
            var ajaxParams = $.extend(ajaxQuery,params.data);
            getAggregateWebTrafficData(ajaxParams).done(function(data){
                params.success(data)
            });
        },
        fixRow:fixRow,
        cdataExport:"cdataExport",
        columns: [{
            field: 'vender_group_name',
            title: '门店',
            sortable:true
        }, {
            field: 'vender_parent_name',
            title: '子账户',
            sortable:true
        }, {
            field: 'inqueryCnt',
            title: '累计询价次数（次）',
            sortable:true
        }, {
            field: 'inqueryNum',
            title: '累计询价金额（元）',
            sortable:true
        }, {
            field: 'submitCnt',
            title: '实际下单数量（台）',
            sortable:true
        },{
            field: 'submitNum',
            title: '实际下单金额（元）',
            sortable:true
        }, {
            field: 'differCnt',
            title: '询价下单差异量（台）',
            sortable:true
        }, {
            field: 'differNum',
            title: '询价下单差异金额（元）',
            sortable:true
        }],
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
            requestURL(dataService+"/Vender/exportKAOrderLostAnalysis",query).done(function(obj){
                $("#wholePage").unmask();
                var url = Meteor.settings.public.downloadService.baseUrl+obj.fileName;
                var link = document.createElement("a");
                link.href = url;
                link.style = "visibility:hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
    });
}

//飞单个数折线图
function getOrderLostCntChart(data){

    var dateList=[];
    var series={
        inqueryCnt:[],
        submitCnt:[]
    }
    data.forEach(function (e) {
        dateList.push(e.vender_group_name);
        series.inqueryCnt.push(e.inqueryCnt);
        series.submitCnt.push(e.submitCnt);
    });
    dateList= _.uniq(dateList);

    var option = {
        title: {
            text: '单量对比',
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
            data: ["询价次数","下单数量"],
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
                type: 'value',
                name:'订单数(台)'
            }
        ],
        series: [
            {
                name: '询价次数',
                type: 'line',
                label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                data: series.inqueryCnt
            },
            {
                name: '下单数量',
                type: 'line',
                label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                data: series.submitCnt
            }
        ]
    };

    var venderTradeTrendMixedChart = echarts.init(document.getElementById('orderLostCntChart'));
    venderTradeTrendMixedChart.setOption(option);
    window.addEventListener('resize', venderTradeTrendMixedChart.resize)

}

//飞单金额折线图
function getOrderLostNumChart(data){

    var dateList=[];
    var series={
        inqueryNum:[],
        submitNum:[]
    }
    data.forEach(function (e) {
        dateList.push(e.vender_group_name);
        series.inqueryNum.push(e.inqueryNum);
        series.submitNum.push(e.submitNum);
    });
    dateList= _.uniq(dateList);

    var option = {
        title: {
            text: '金额对比',
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
            data: ["询价金额","下单金额"],
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
                type: 'value',
                name:'订单金额(万元)'
            }
        ],
        series: [
            {
                name: '询价金额',
                type: 'line',
                label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                data: series.inqueryNum
            },
            {
                name: '下单金额',
                type: 'line',
                label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                data: series.submitNum
            }
        ]
    };

    var venderTradeTrendMixedChart = echarts.init(document.getElementById('orderLostNumChart'));
    venderTradeTrendMixedChart.setOption(option);
    window.addEventListener('resize', venderTradeTrendMixedChart.resize)

}