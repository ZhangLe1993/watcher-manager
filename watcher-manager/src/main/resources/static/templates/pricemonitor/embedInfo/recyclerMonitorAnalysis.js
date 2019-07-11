Template.recyclerMonitorAnalysis.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#recyclerDebt').addClass('active');
    $('#recyclerMonitorAnalysis').addClass('active');

    var recycler_key=Template.currentData().recycler_key;
    var recycler_name=Template.currentData().recycler_name;

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

    var recyclerKey=[];
    var recyclerName=[];
    recyclerKey.push(recycler_key);
    recyclerName.push(recycler_name);
    //选项初始化加载
    requestURL(dataService+"/recycler/getRecyclerEmbedCategoryAnalysisInfoFilterOption",{recyclerKey:recyclerKey,recyclerName:recyclerName}).done(function(data){

        /*品类*/
        $(".category").attr("multiple","multiple");
        renderOptions(".category",data.product_category_name)

        /*品牌*/
        $(".brand").attr("multiple","multiple");
        renderOptions(".brand",data.product_brand_name)

        /*型号*/
        $(".product").attr("multiple","multiple");
        renderOptions(".product",data.product_name)

        $(".category").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false,
            filter: true
        });
        $(".brand").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false,
            filter: true
        });

        $(".product").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false,
            filter: true
        });

    });

    $(".search").click(function(){
        renderPageQuery(recycler_key,recycler_name);
    })

    renderPage(recycler_key,recycler_name);
    renderPageBasic(recycler_key,recycler_name);
    renderPageQuery(recycler_key,recycler_name);
};

function pickWebTrafficFunnelDateRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.dateSelectLabel').html(sdt+"~"+edt);
}

function renderPage(recycler_key,recycler_name){
        var query = {
            RecyclerId: eval(recycler_key),
            recyclerName:recycler_name
        }
        var flag = new Date().getHours()<10?"-10":"+10";
        if(flag=="-10"){
            query.flag="-10"
        }else if(flag=="+10"){
            query.flag="+10"
        }
        query.date=new Date().getNewDate(0)
        var dataSet = recyclerStats.find(query).fetch();
        /*var debtTmp=0;
        dataSet.forEach(function(e){
            debtTmp= e.debt;
        })*/
        $("#tableByMaintainer").bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data: dataSet,
            columns: [
                {
                field:'recyclerName',
                title:'回收商',
                sortable:true
                },{
                    field:'checkOutAmountTotal',
                    title:'待支付结算总金额',
                    sortable:true
                },{
                    field:'accountAmount',
                    title:'回收商账户余额',
                    sortable:true
                },{
                    field:'debt',
                    title:'欠款',
                    sortable:true,
                    formatter:function(value,row,index){
                        return "<font color='red'>"+value+"</font>"
                    }
                }
            ]
        });
}

function getSelectedFilter(recycler_key,recycler_name) {
    var filter={};

    var recyclerKey=[];
    var recyclerName=[];
    recyclerKey.push(recycler_key);
    recyclerName.push(recycler_name);

    dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g,"").split("~");
    var startDate = dt[0];
    var endDate = dt[1];

    var category=$(".category").val();
    var brand=$(".brand").val();
    var product=$(".product").val();

    filter.startDate=startDate;
    filter.endDate=endDate;
    filter.recyclerKey=recyclerKey;
    filter.recyclerName=recyclerName;
    filter.category=category;
    filter.brand=brand;
    filter.product=product;

    return cleanParams(filter);
}

function renderPageBasic(recycler_key,recycler_name) {
    var filter=getSelectedFilter(recycler_key,recycler_name);

    $("#tableByRecyclerBasicInfo").hide();

    $("#loading").show();

    var promise = getRecyclerEmbedBasicAnalysisInfo(filter);
    promise.done(function (ret) {

        $("#tableByRecyclerBasicInfo").show();
        $("#loading").hide();

        //renderTable
        renderRecyclerBasicInfo(ret, '#tableByRecyclerBasicInfo');
    });

    $("#tableByRecyclerLevelInfo").hide();

    $("#loadingLevel").show();

    var promise = getRecyclerEmbedLevelAnalysisInfo(filter);
    promise.done(function (ret) {

        $("#tableByRecyclerLevelInfo").show();
        $("#loadingLevel").hide();

        //renderTable
        renderRecyclerInfo(ret, '#tableByRecyclerLevelInfo');
    });

}

function renderPageQuery(recycler_key,recycler_name) {
    var filter=getSelectedFilter(recycler_key,recycler_name);

    $("#BussinessDataTable").hide();

    $("#loadingQuery").show();

    var promise = getRecyclerEmbedCategoryAnalysisInfo(filter);
    promise.done(function (ret) {

        $("#BussinessDataTable").show();
        $("#loadingQuery").hide();

        //renderTable
        renderRecyclerInfo(ret, '#BussinessDataTable');
    });

}

function renderRecyclerBasicInfo(data,tableName) {
    $(tableName).bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        data:data,
        columns:[{
            field:'#',
            title:'日期',
            sortable:true,
            formatter:function(value,row,index){
                return "本月"
            }
        }]
    });
}

function renderRecyclerInfo(data,tableName) {
    $(tableName).bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        data:data
    });
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


function getRecyclerEmbedBasicAnalysisInfo(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/recycler/getRecyclerEmbedBasicAnalysisInfo", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}

function getRecyclerEmbedLevelAnalysisInfo(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/recycler/getRecyclerEmbedLevelAnalysisInfo", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}

function getRecyclerEmbedCategoryAnalysisInfo(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/recycler/getRecyclerEmbedCategoryAnalysisInfo", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}
