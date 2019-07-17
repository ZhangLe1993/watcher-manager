Template.VenderPermissionControlGroupActiveLevelInfoControl.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#VenderPermissionControl').addClass('active');
    $('#VenderPermissionControlGroupActiveLevelInfoControl').addClass('active');

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }


    var minMonth = "2016-09-01";
    var startMonthDate = moment().subtract(0, 'month').startOf('month').format("YYYY-MM-DD");
    //var endMonthDate = moment().endOf('month').format("YYYY-MM-DD");

    var endMonthDate = moment().subtract(0, 'month').endOf('month').format("YYYY-MM-DD");

    $(".dateSelectLabel").html(startMonthDate + "~" + endMonthDate);
    $('.webTrafficFunnelDate').daterangepicker(monthDatePickerOptionsFunc(startMonthDate,endMonthDate,minMonth,false), pickWebTrafficFunnelDateRangeCallback);

    var dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g, "").split("~");
    var startDate = dt[0];
    var endDate = dt[1];
    filter.startDate=startDate;
    filter.endDate=endDate;
    filter.userId = userId;
    renderPage(filter);

    $(".search").click(function () {
        var filter = getSelectedFilter();
        renderPage(filter);
    });

};
var userId = getUserId();
var filter={};

function pickWebTrafficFunnelDateRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = moment(end).endOf('month').format("YYYY-MM-DD");
    $('.dateSelectLabel').html(sdt + "~" + edt);
    filter.startDate=sdt;
    filter.endDate=edt;
    filter.userId = userId;
    renderPage(filter);
}

function getSelectedFilter() {
    var dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g, "").split("~");
    var startDate = dt[0];
    var endDate = dt[1];

    filter.startDate=startDate;
    filter.endDate=endDate;
    filter.userId = userId;

    return cleanParams(filter);
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
    //$("#chartContent").hide();
    $("#tablea").hide();
    $("#loadinga").show();
    var promise = getAggregateParentWebTrafficData(filter);
    promise.done(function(ret){
        //$("#chartContent").show();
        $("#loadinga").hide();
        $("#tablea").show();

        renderParentTable("#tablea",ret);

    });

}

//总账户
function getAggregateParentWebTrafficData(filter){
    //clean parameters
    var query = _.clone(filter);
//    var flag = query["dateType"];
    var flag = $(".dateType").val();
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    query.userId = userId;
    var dfd = $.Deferred();
    requestURL(dataService+"/Vender/getVenderPermissionControlGroupActiveLevelInfo",query).done(function(ret){
        dfd.resolve(ret)
    });
    return dfd.promise()
}

function renderParentTable(tableName,data) {
    $(tableName).bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        search: true,
        data:data
    });
}



