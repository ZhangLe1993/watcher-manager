Template.VenderGroupOrderStatistics.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#VenderPermissionControl').addClass('active');
    $('#VenderGroupOrderStatistics').addClass('active');

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

//总账户
    var dateGap = -6;
    var minDate = "2016-07-01";
    var endDate = new Date().getNewDate(-1);
    var startDate = new Date(endDate).getNewDate(dateGap);

    $(".dateSelectLabel").html(startDate+"~"+endDate);
    $(".webTrafficFunnelDate").daterangepicker(datePickerOptionsFunc(startDate,endDate,minDate), pickWebTrafficFunnelDateRangeCallback);

    //门店

    $(".dateSelectLabelGroup").html(startDate+"~"+endDate);
    $(".webTrafficFunnelDateGroup").daterangepicker(datePickerOptionsFunc(startDate,endDate,minDate), pickWebTrafficFunnelDateRangeCallbackGroup);

    //获取权限省份城市
    //var permissionArea=getPermissionArea();
    //permissionArea.done(function(ele){
    //    filter=getVenderCityPermission(ele.controlName);

        var dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g, "").split("~");
        var startDate = dt[0];
        var endDate = dt[1];
        filter.startDate = startDate;
        filter.endDate = endDate;
        filter.userId = userId;
        filter=getSelectedFilter();
        renderPage(filter);
        var filterGroup=getSelectedFilterGroup();
        renderPageGroup(filterGroup);
    //})

    $(".search").click(function () {
        filter=getSelectedFilter();
        renderPage(filter);
    })

    $(".searchGroup").click(function () {
        filterGroup=getSelectedFilterGroup();
        renderPageGroup(filterGroup);
    })

    $(".exportVenderParent").click(function(){
        var filter=getSelectedFilter();
        var query = _.clone(filter);

        $("#wholePage").mask({'label': "请等待，文件正在导出..."});
        requestURL(dataService + "/Vender/exportVenderPermissionControlVenderOrderStatisticsVenderAnalysis", query).done(function (obj) {
            $("#wholePage").unmask();
            var url = Meteor.settings.public.downloadService.baseUrl + obj.fileName;
            var link = document.createElement("a");
            link.href = url;
            link.style = "visibility:hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    })

    $(".exportVenderGroup").click(function(){
        var filter=getSelectedFilter();
        var query = _.clone(filter);

        $("#wholePage").mask({'label': "请等待，文件正在导出..."});
        requestURL(dataService + "/Vender/exportVenderPermissionControlVenderGroupOrderStatisticsVenderAnalysis", query).done(function (obj) {
            $("#wholePage").unmask();
            var url = Meteor.settings.public.downloadService.baseUrl + obj.fileName;
            var link = document.createElement("a");
            link.href = url;
            link.style = "visibility:hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    })

};

var filter={};

function pickWebTrafficFunnelDateRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.dateSelectLabel').html(sdt + "~" + edt);
}

function pickWebTrafficFunnelDateRangeCallbackGroup(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.dateSelectLabelGroup').html(sdt + "~" + edt);
}

function renderOptions(sel,data){
    $(sel).empty();
    data.forEach(function(ele){
        $(sel).append("<option value='"+ele+"'>"+ele+"</option>")
    });
}
var userId = getUserId();
function getSelectedFilter(dateType, $this) {
    var dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g, "").split("~");
    var startDate = dt[0];
    var endDate = dt[1];

    filter.startDate=startDate;
    filter.endDate=endDate;

    filter.userId = userId;
    var orderCnt=$(".cnt").val();
    if (orderCnt == "") {
        orderCnt = "0";
    }else if(new RegExp(/^\d+$/).test(orderCnt)==false){
        alert("请填写数字")
        orderCnt = "0";
    }
    if($(".orderFlag").val()=="提交"){
        var orderFlag="submit"
    }else{
        var orderFlag="trade"
    }

    filter.orderCnt=orderCnt;
    filter.orderFlag=orderFlag;

    return cleanParams(filter);
}

function getSelectedFilterGroup(dateType, $this) {
    var dt = $('.desktop-only .dateSelectLabelGroup').text().replace(/ /g, "").split("~");
    var startDate = dt[0];
    var endDate = dt[1];

    filter.startDate=startDate;
    filter.endDate=endDate;
    filter.userId = userId;
    var orderCnt=$(".cntGroup").val();
    if (orderCnt == "") {
        orderCnt = "0";
    }else if(new RegExp(/^\d+$/).test(orderCnt)==false){
        alert("请填写数字")
        orderCnt = "0";
    }
    if($(".orderFlagGroup").val()=="提交"){
        var orderFlag="submit"
    }else{
        var orderFlag="trade"
    }

    filter.orderCnt=orderCnt;
    filter.orderFlag=orderFlag;

    return cleanParams(filter);
}

function getPermissionArea(){
    //clean parameters
    var dfd = $.Deferred();
    var accountId = userId;
    requestURL(dataService+"/Vender/getProvinceNameJsonByAccountId", {"accountId":accountId}).done(function (ret) {
        dfd.resolve(ret)
    });
    return dfd.promise()
}


function renderPage(filter) {
    $("#venderTable").hide();
    $("#loading1").show();
    var promise = getVenderPermissionControlVenderOrderStatisticsVenderAnalysis(filter);
    promise.done(function (ret) {
        $("#venderTable").show();
        $("#loading1").hide();

        //renderTable
        renderTable(ret,'#venderTable');
    });

}

function renderPageGroup(filter) {

    $("#groupTable").hide();
    $("#loading2").show();
    var promise = getVenderPermissionControlVenderGroupOrderStatisticsVenderAnalysis(filter);
    promise.done(function (ret) {
        $("#groupTable").show();
        $("#loading2").hide();

        //renderTable
        renderTable(ret,'#groupTable');
    });

}

function renderTable(data,tableName) {

    $(tableName).bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        search: true,
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

function getVenderPermissionControlVenderGroupOrderStatisticsVenderAnalysis(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    query.userId = userId;
    var dfd = $.Deferred();
    requestURL(dataService + "/Vender/getVenderPermissionControlVenderGroupOrderStatisticsVenderAnalysis", query).done(function (ret) {
        dfd.resolve(ret)
    });

    return dfd.promise();
}


function getVenderPermissionControlVenderOrderStatisticsVenderAnalysis(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    query.userId = userId;
    var dfd = $.Deferred();
    requestURL(dataService + "/Vender/getVenderPermissionControlVenderOrderStatisticsVenderAnalysis", query).done(function (ret) {
        dfd.resolve(ret)
    });

    return dfd.promise();
}


