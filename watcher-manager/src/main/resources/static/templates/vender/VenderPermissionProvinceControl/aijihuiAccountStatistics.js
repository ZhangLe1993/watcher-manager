Template.aijihuiAccountStatistics.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#VenderPermissionProvinceControl').addClass('active');
    $('#aijihuiAccountStatistics').addClass('active');

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
        renderPage(filter);

        $(".search").click(function () {
            var dateType = $(this).parent().parent().find(".dateType").val();
            var filter = getSelectedFilter(dateType, $(this));
            renderPage(filter);
        });
    //})

};

var filter={},regionFlag= 0,region="";

function pickWebTrafficFunnelDateRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.dateSelectLabel').html(sdt + "~" + edt);
    filter.startDate=sdt;
    filter.endDate=edt;
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

    return cleanParams(filter);
}

function getPermissionArea(){
    //clean parameters
    var dfd = $.Deferred();
    var accountId = Meteor.user().profile.name;
    requestURL(dataService+"/Vender/getProvinceNameJsonByAccountId", {"accountId":accountId}).done(function (ret) {
        dfd.resolve(ret)
    });
    return dfd.promise()
}


function renderPage(filter) {
    $("#tablef").hide();
    $("#loading3").show();
    var promise = getVenderPermissionControlVenderAllInfo(filter);
    promise.done(function (ret) {
        $("#tablef").show();
        $("#loading3").hide();

        //renderTable
        renderTable(ret,'#tablef');
    });

}

function renderTable(data,tableName) {

    var tableJson={};
    tableJson.vender_province_name= "合计";
    tableJson.registerVenderCnt= 0;
    tableJson.liveVenderCnt= 0;
    tableJson.registerShopCnt= 0;
    tableJson.liveShopCnt= 0;
    tableJson.orderCnt= 0;
    tableJson.recycleNum= 0;
    data.forEach(function(e){
        if(regionFlag==1){
            e.vender_parent_name=region;
        }
        tableJson.registerVenderCnt+= e.registerVenderCnt;
        tableJson.liveVenderCnt+= e.liveVenderCnt;
        tableJson.registerShopCnt+= e.registerShopCnt;
        tableJson.liveShopCnt+= e.liveShopCnt;
        tableJson.orderCnt+= e.orderCnt;
        tableJson.recycleNum+= e.recycleNum;
    })
    var fixRow = '"<tr style="background-color: #acc087;"", " ", "", "", " data-index="0"", "", "", ">","<td  style=""    >'+tableJson.vender_province_name+'</td>","<td style="">'+tableJson.registerVenderCnt+'</td>", "<td  style=""    >'+tableJson.liveVenderCnt+'</td>", "<td  style=""    >'+tableJson.registerShopCnt+'</td>", "<td  style=""    >'+tableJson.liveShopCnt+'</td>", "<td  style=""    >'+tableJson.orderCnt+'</td>","<td  style=""    >'+tableJson.recycleNum+'</td>"'
    $(tableName).bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        fixRow:fixRow,
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

function getVenderPermissionControlVenderAllInfo(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getVenderPermissionControlVenderAllInfo", query).done(function (ret) {
            dfd.resolve(ret)
        });
    } else if (flag == "weekly") {
        requestURL(dataService + "/product/getErrorPageMonitorDataWeek", query).done(function (ret) {
            dfd.resolve(ret)
        });
    } else if (flag == "monthly") {
        requestURL(dataService + "/product/getErrorPageMonitorDataMonth", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise();
}



