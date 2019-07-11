Template.riskControlInspectionMistakeAgingDataInfo.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#RiskControlDataInfoTab').addClass('active');
    $('#riskControlInspectionMistakeAgingDataInfo').addClass('active');

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var dateGap = -6;
    var minWeekDate = "2016-07-03";
    var minMonthDate = "2016-07-01";
    var endDate = new Date().getNewDate(-1);
    var startDate = new Date(endDate).getNewDate(dateGap);
    var startWeekDate = moment().weekday(-7).format("YYYY-MM-DD")
    var endWeekDate = moment().weekday(-1).format("YYYY-MM-DD")
    if (startWeekDate < minWeekDate) {
        startWeekDate = minWeekDate;
    }
    var startMonthDate = moment().subtract(1, 'month').startOf('month').format("YYYY-MM-DD");
    var endMonthDate = moment().subtract(0, 'month').startOf('month').format("YYYY-MM-DD");
    if (startMonthDate < minMonthDate) {
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
        "minDate": transformDate("2016-09-01"),
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

    $(".dateSelectLabel").html(startDate + "~" + endDate);
    $('.webTrafficFunnelDate').daterangepicker(datePickerOptions, pickWebTrafficFunnelDateRangeCallback);

    renderPage();
    renderPageBasicInfo();

    $(".search").click(function(){
        renderPage();
        renderPageBasicInfo();
    })

};

var startDateEmbed,endDateEmbed;

function pickWebTrafficFunnelDateRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.dateSelectLabel').html(sdt + "~" + edt);
    //renderPageBasicInfo();
}

function getSelectedFilter() {

    dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g,"").split("~");
    startDate = dt[0];
    endDate = dt[1];
    startDateEmbed=startDate;
    endDateEmbed=endDate;
    var filter={};
    filter.agingCnt=$(".orderCnt").val();
    filter.startDate=startDate;
    filter.endDate=endDate;
    filter.status="all";

    return cleanParams(filter);
}

function renderPage() {
    //var dateGap = -15;
    var filter = getSelectedFilter();
    $("#tablee").hide();
    $("#loading2").show();
    $("#loading2").mask({'label': "数据聚合中，请等待..."});
    var promise = getVenderPermissionControlVenderDetailInfo(filter);
    promise.done(function (ret) {
        $("#tablee").show();
        $("#loading2").hide();
        $("#loading2").unmask();

        renderGroupTable(ret, '#tablee');
    });
}
function renderPageBasicInfo() {
    var filter = getSelectedFilter();
    $("#tablef").hide();
    $("#loading3").show();
    $("#loadingf").mask({'label':"数据聚合中，请等待..."});
    var promise = getVenderPermissionControlVenderBasicDetailInfo(filter);
    promise.done(function (ret) {
        $("#tablef").show();
        $("#loading3").hide();
        $("#loading3").unmask();

        renderVenderTable(ret,'#tablef');
    });

}

//门店
function renderGroupTable(data,tableName) {
    data.forEach(function(e){
        e.typeRate= ((e.typeCnt/ e.Cnt)*100).toFixed(2)+"%"
        e.profitRate=((e.profit/ e.vender_item_quotation_price_num)*100).toFixed(2)+"%"
    })
    $(tableName).bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        data:data,
        columns:[{
            field:'vender_group_name',
            title:'门店',
            sortable:true
        },{
            field:'vender_parent_name',
            title:'总账户',
            sortable:true
        },{
            field:'level',
            title:'客户属性',
            sortable:true
        },{
            field:'typeCnt',
            title:'严重老化订单数量',
            sortable:true
        },{
            field:'typeRate',
            title:'占比',
            sortable:true
        },{
            field:'profit',
            title:'亏损金额(元)',
            sortable:true
        },{
            field:'profitRate',
            title:'毛利率',
            sortable:true
        },{
            field:'vender_business_mode',
            title:'是否调整为维修类客户',
            sortable:true
        },{
            field:'#',
            title:'操作',
            sortable:true,
            formatter:function(value,row,index){
                return "<a class='cus_modal'  data-fancybox-type='iframe' href='/vender/riskControlVenderParentGroupDetailTradeNoInfoModal/"+row.vender_parent_name+"/"+row.vender_group_name+"/"+startDateEmbed+"/"+endDateEmbed+"/门店/老化'>详细信息</a>"
            }
        }]
    });
}

//总账户
function renderVenderTable(data,tableName) {
    data.forEach(function(e){
        e.typeRate= ((e.typeCnt/ e.Cnt)*100).toFixed(2)+"%"
        e.profitRate=((e.profit/ e.vender_item_quotation_price_num)*100).toFixed(2)+"%"
    })
    $(tableName).bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        data:data,
        columns:[{
            field:'vender_parent_name',
            title:'总账户',
            sortable:true
        },{
            field:'level',
            title:'客户属性',
            sortable:true
        },{
            field:'typeCnt',
            title:'严重老化订单数量',
            sortable:true
        },{
            field:'typeRate',
            title:'占比',
            sortable:true
        },{
            field:'profit',
            title:'亏损金额(元)',
            sortable:true
        },{
            field:'profitRate',
            title:'毛利率',
            sortable:true
        },{
            field:'vender_business_mode',
            title:'是否调整为维修类客户',
            sortable:true
        },{
            field:'#',
            title:'操作',
            sortable:true,
            formatter:function(value,row,index){
                return "<a class='cus_modal'  data-fancybox-type='iframe' href='/vender/riskControlVenderParentGroupDetailTradeNoInfoModal/"+row.vender_parent_name+"/总账户/"+startDateEmbed+"/"+endDateEmbed+"/总账户/老化'>详细信息</a>"
            }
        }]
    });
}

function getVenderPermissionControlVenderDetailInfo(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getRiskControlGroupMistakeAgingPartStatistic", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}

function getVenderPermissionControlVenderBasicDetailInfo(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getRiskControlVenderMistakeAgingPartStatistic", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}



