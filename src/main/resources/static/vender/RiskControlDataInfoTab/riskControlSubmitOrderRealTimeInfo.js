Template.riskControlSubmitOrderRealTimeInfo.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#RiskControlDataInfoTab').addClass('active');
    $('#riskControlSubmitOrderRealTimeInfo').addClass('active');

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var dateGap = -0;
    var minDate = "2016-09-01";
    var endDate = new Date().getNewDate(-1);
    var startDate = new Date(endDate).getNewDate(dateGap);

    $(".dateSelectLabel").html(startDate + "~" + endDate);
    $('.webTrafficFunnelDate').daterangepicker(datePickerOptionsFunc(startDate, endDate, minDate, false), pickWebTrafficFunnelDateRangeCallback);

    renderPage();
    renderPageBasicInfo();

    $(".search").click(function () {
        renderPage();
    })

    $(".searchHistory").click(function () {
        renderPageBasicInfo();
    })
};

function pickWebTrafficFunnelDateRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.dateSelectLabel').html(sdt + "~" + edt);
    //renderPageBasicInfo();
}

function getSelectedFilter() {

    dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g, "").split("~");
    startDate = dt[0];
    endDate = dt[1];
    var filter = {};
    var orderCnt = $(".orderCnt").val();
    if (orderCnt == "") {
        orderCnt = 3;
    }
    filter.orderCnt = orderCnt;

    var numPerOrder = $(".numPerOrder").val();
    if (numPerOrder == "") {
        numPerOrder = 700;
    }
    filter.orderNumPerUser = numPerOrder;
    filter.startDate = startDate;
    filter.endDate = endDate;

    return cleanParams(filter);
}

function getSelectedFilterHistory() {

    dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g, "").split("~");
    startDate = dt[0];
    endDate = dt[1];
    var filter = {};
    var orderCntHistory = $(".orderCntHistory").val();
    if(orderCntHistory==""){
        orderCntHistory=3;
    }
    filter.orderCnt = orderCntHistory;

    var numPerOrderHistory = $(".numPerOrderHistory").val();
    if(numPerOrderHistory==""){
        numPerOrderHistory=700
    }
    filter.orderNumPerUser = numPerOrderHistory;
    filter.startDate = startDate;
    filter.endDate = endDate;

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

        renderTable(ret, '#tablee');
    });
}
function renderPageBasicInfo() {
    var filter = getSelectedFilterHistory();
    $("#tablef").hide();
    $("#loading3").show();
    $("#loadingf").mask({'label': "数据聚合中，请等待..."});
    var promise = getVenderPermissionControlVenderBasicDetailInfo(filter);
    promise.done(function (ret) {
        $("#tablef").show();
        $("#loading3").hide();
        $("#loading3").unmask();

        renderTable(ret, '#tablef');
    });

    $("#tableg").hide();
    $("#loading4").show();
    $("#loadingg").mask({'label': "数据聚合中，请等待..."});
    var promise = getRiskControlOrderExceptionVenderGroupInfoStatistic(filter);
    promise.done(function (ret) {
        $("#tableg").show();
        $("#loading4").hide();
        $("#loading4").unmask();

        renderTable(ret, '#tableg');
    });

}

//订单取消表格
function renderTable(data, tableName) {
    $(tableName).bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        data: data
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
        requestURL(dataService + "/Vender/getRiskControlSubmitOrderRealTimeStatistic", query).done(function (ret) {
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
        requestURL(dataService + "/Vender/getRiskControlOrderExceptionVenderInfoStatistic", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}

function getRiskControlOrderExceptionVenderGroupInfoStatistic(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getRiskControlOrderExceptionVenderGroupInfoStatistic", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}



