Template.VenderQualityErrorAnalysisControl.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#VenderPermissionControl').addClass('active');
    $('#VenderQualityErrorAnalysisControl').addClass('active');

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }


    var dateGap = -6;
    var minDate = "2016-09-01";
    var endDate = new Date().getNewDate(-1);
    var startDate = new Date(endDate).getNewDate(dateGap);

    $(".dateSelectLabel").html(startDate + "~" + endDate);
    $('.webTrafficFunnelDate').daterangepicker(datePickerOptionsFunc(startDate,endDate,minDate,false), pickWebTrafficFunnelDateRangeCallback);

    //获取权限省份城市
    //var permissionArea=getPermissionArea();
    //permissionArea.done(function(ele){
    //    filter=getVenderCityPermission(ele.controlName);

        var dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g, "").split("~");
        var startDate = dt[0];
        var endDate = dt[1];
        filter.startDate=startDate;
        filter.endDate=endDate;
        filter.userId = userId;
        renderPage(filter);

        $(".search").click(function () {
            var dateType = $(this).parent().parent().find(".dateType").val();
            var filter = getSelectedFilter(dateType, $(this));
            renderPage(filter);
        });
    //})

};

var filter={};
var userId = getUserId();

function pickWebTrafficFunnelDateRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.dateSelectLabel').html(sdt + "~" + edt);
    filter.startDate=sdt;
    filter.endDate=edt;
    filter.userId = userId;
    renderPage(filter);
}

function pickWebTrafficFunnelWeekRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.weekSelectLabel').html(sdt + "~" + edt);
    filter.startDate=sdt;
    filter.endDate=edt;
    renderPage(filter);
}

function pickWebTrafficFunnelMonthRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.monthSelectLabel').html(sdt + "~" + edt);
    filter.startDate=sdt;
    filter.endDate=edt;
    renderPage(filter);
}

function renderOptions(sel,data){
    $(sel).empty();
    data.forEach(function(ele){
        $(sel).append("<option value='"+ele+"'>"+ele+"</option>")
    });
}

function getSelectedFilter(dateType, $this) {
    if (dateType == "daily") {
        var dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g, "").split("~");
        var startDate = dt[0];
        var endDate = dt[1];
    } else if (dateType == "weekly") {
        var dt = $('.desktop-only .weekSelectLabel').text().replace(/ /g, "").split("~");
        var startDate = dt[0];
        var endDate = dt[1];
    } else {
        var dt = $('.desktop-only .monthSelectLabel').text().replace(/ /g, "").split("~");
        var startDate = dt[0];
        var endDate = dt[1];
    }

    filter.startDate=startDate;
    filter.endDate=endDate;
    filter.userId = userId;

    return cleanParams(filter);
}

function getPermissionArea(){
    //clean parameters
    var dfd = $.Deferred();
    var accountId = getUserName();
    requestURL(dataService+"/Vender/getProvinceNameJsonByAccountId", {"accountId":accountId}).done(function (ret) {
        dfd.resolve(ret)
    });
    return dfd.promise()
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

    $("#tableg").hide();
    $("#loading").show();
    var promise = getAggregateWebTrafficData(filter);
    promise.done(function(ret){
        $("#tableg").show();
        $("#loading").hide();

        renderTable("#tableg",ret);

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
    requestURL(dataService+"/Vender/getVenderPermissionControlProvinceVenderParentQualityErrorAnalysis",query).done(function(ret){
        dfd.resolve(ret)
    });
    return dfd.promise()
}

//子账户
function getAggregateWebTrafficData(filter){
    //clean parameters
    var query = _.clone(filter);
//    var flag = query["dateType"];
    var flag = $(".dateType").val();
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    query.userId = userId;
    var dfd = $.Deferred();
    requestURL(dataService+"/Vender/getVenderPermissionControlProvinceVenderQualityErrorAnalysis",query).done(function(ret){
        dfd.resolve(ret)
    });
    return dfd.promise()
}

function renderParentTable(tableName,data) {
    data.forEach(function(e){
        var dataSet=e.venderAll.split(",");
        e.vender_parent_name= dataSet[0];
        e.mistakeCnt= dataSet[1];
        e.successCnt= dataSet[2];
        e.failCnt= dataSet[3];
        e.mainBoardRepairCnt= dataSet[4];
        e.inletCnt= dataSet[5];
        e.screenRepairCnt= dataSet[6];
        e.paintCnt= dataSet[7];
        e.agingCnt= dataSet[8];
    })
    $(tableName).bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        search: true,
        data:data
    });
}

function renderTable(tableName,data) {
    data.forEach(function(e){
        var dataSet=e.venderAll.split(",");
        e.vender_province_name= dataSet[0];
        e.vender_city_name= dataSet[1];
        e.vender_district_name= dataSet[2];
        e.vender_parent_name= dataSet[3];
        e.vender_group_name= dataSet[4];
        e.vender_name= dataSet[5];
        e.mistakeCnt= dataSet[6];
        e.venderType= dataSet[7];
        e.mainBoardRepairCnt= dataSet[8];
        e.inletCnt= dataSet[9];
    })
    $(tableName).bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        search: true,
        data:data
    });
}



