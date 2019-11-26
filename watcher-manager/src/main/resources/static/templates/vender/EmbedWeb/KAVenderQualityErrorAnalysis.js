/**
 * Created by hsh on 2016/5/13.
 */
Template.KAVenderQualityErrorAnalysis.rendered = function () {

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
    var minWeekDate = "2016-07-03";
    var minMonthDate = "2016-07-01";
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
            var province=$(this).parent().find(".province").val();
            var city=$(this).parent().find(".city").val();
            var district=$(this).parent().find(".district").val();
            var vender = $(this).parent().find(".vender").val();
            var group = $(this).parent().find(".group").val();

            var query={
                "startDate":startDate,
                "endDate":endDate,
                "vender_company_key":vender_company_key,
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
            var group = $(this).parent().find(".group").val();

            var query={
                "startDate":startDate,
                "endDate":endDate,
                "vender_company_key":vender_company_key,
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
            var group = $(this).parent().find(".group").val();

            var query={
                "startDate":startDate,
                "endDate":endDate,
                "vender_company_key":vender_company_key,
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
    requestURL(thirdService+"/Vender/getKAFilterOptions",query).done(function(data){

        /*门店*/
        $(".group").attr("multiple","multiple");
        renderOptions(".group",data.group)

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

        var group = $(this).parent().find(".group").val();

        var query={
            "startDate":startDate,
            "endDate":endDate,
            "vender_company_key":vender_company_key,
            "group":group
        };
        var queryWeek={
            "startDate":startDateWeek,
            "endDate":endDateWeek,
            "vender_company_key":vender_company_key,
            "group":group
        };
        var queryMonth={
            "startDate":startMonth,
            "endDate":endMonth,
            "vender_company_key":vender_company_key,
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

var orderData,vender_company_key=[],vender_company_name=[];

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
    //var dateGap = -15;
    console.log("111111111111"+filter)
    $("#chartContent").hide();
    $("#loading").show();
    var promise = getAggregateWebTrafficData(filter);
    promise.done(function(ret){
        $("#chartContent").show();
        $("#loading").hide();

        renderTable("#BussinessDataTable",ret);

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
    requestURL(thirdService+"/Vender/getKAQualityErrorAnalysisPro",query).done(function(ret){
        dfd.resolve(ret)
    });
    return dfd.promise()
}
var valueFormatter = function(value, row, index) {
    return value + '%';
};
function renderTable(tableName,data) {
    /*data.forEach(function(e){
        var dataSet=e.venderAll.split(",");
        e.vender_group_name= dataSet[0];
        e.vender_name= dataSet[1];
        e.mistakeCnt= dataSet[2];
        e.venderType= dataSet[3]
    })*/
    $(tableName).bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        data: data,
        pagination: true,
        columns: [{
            field: 'vender_group_name',
            title: '门店名称',
            sortable:true
        }, {
            field: 'vender_name',
            title: '子账户',
            sortable:true
        }, {
            field: 'mistakeCnt',
            title: '质检总量（台）',
            sortable:true
        }, {
            field: 'inlet',
            title: '机身进水或受潮',
            sortable:true,
            formatter: valueFormatter,
        }, {
            field: 'fingerprint',
            title: '指纹功能不正常',
            sortable:true,
            formatter: valueFormatter,
        },{
            field: 'callException',
            title: '通话不正常',
            sortable:true,
            formatter: valueFormatter,
        }, {
            field: 'iCloudCancel',
            title: 'iCloud无法注销',
            sortable:true,
            formatter: valueFormatter,
        }, {
            field: 'bootstrap',
            title: '无法正常开机',
            sortable:true,
            formatter: valueFormatter,
        },{
            field: 'wifi',
            title: '无线不正常',
            sortable:true,
            formatter: valueFormatter,
        }, {
            field: 'touch',
            title: '触摸功能不正常',
            sortable:true,
            formatter: valueFormatter,
        }, {
            field: 'bend',
            title: '机身弯曲',
            sortable:true,
            formatter: valueFormatter,
        }, {
            field: 'charge',
            title: '充电不正常',
            sortable:true,
            formatter: valueFormatter,
        }, {
            field: 'mainBoardRepair',
            title: '主板维修/多处拆修',
            sortable:true,
            formatter: valueFormatter,
        },{
            field: 'screenRepair',
            title: '屏幕维修',
            sortable:true,
            formatter: valueFormatter,
        }, {
            field: 'display',
            title: '屏幕无法显示',
            sortable:true,
            formatter: valueFormatter,
        }, {
            field: 'aging',
            title: '色斑/漏液/错乱/严重老化',
            sortable:true,
            formatter: valueFormatter,
        }, {
            field: 'aberra',
            title: '亮坏点/色差/轻微发黄',
            sortable:true,
            formatter: valueFormatter,
        }, {
            field: 'nick',
            title: '屏幕有划痕',
            sortable:true,
            formatter: valueFormatter,
        }, {
            field: 'fragment',
            title: '屏幕有缺角/碎裂',
            sortable:true,
            formatter: valueFormatter,
        },{
            field: 'paint',
            title: '外壳有磕碰/掉漆',
            sortable:true,
            formatter: valueFormatter,
        }, {
            field: 'gurant',
            title: '国内保修情况错误',
            sortable:true,
            formatter: valueFormatter,
        }, {
            field: 'color',
            title: '机身颜色错误',
            sortable:true,
            formatter: valueFormatter,
        },{
            field: 'channel',
            title: '购买渠道错误',
            sortable:true,
            formatter: valueFormatter,
        }, {
            field: 'storage',
            title: '容量错误',
            sortable:true,
            formatter: valueFormatter,
        }, {
            field: 'venderType',
            title: '型号错误',
            sortable:true,
            formatter: valueFormatter,
        }],
    });
}