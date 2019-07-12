Template.VenderGroupDailyActivityOrderStatistics.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#VenderPermissionControl').addClass('active');
    $('#VenderGroupDailyActivityOrderStatistics').addClass('active');

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
        filter.startDate=startDate;
        filter.endDate=endDate;
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

    //$(".exportVenderParent").click(function(){
    //    var filter=getSelectedFilter();
    //    var query = _.clone(filter);
    //
    //    $("#wholePage").mask({'label': "请等待，文件正在导出..."});
    //    requestURL(dataService + "/Vender/exportVenderPermissionControlVenderOrderStatisticsVenderAnalysis", query).done(function (obj) {
    //        $("#wholePage").unmask();
    //        var url = Meteor.settings.public.downloadService.baseUrl + obj.fileName;
    //        var link = document.createElement("a");
    //        link.href = url;
    //        link.style = "visibility:hidden";
    //        document.body.appendChild(link);
    //        link.click();
    //        document.body.removeChild(link);
    //    });
    //})

    //$(".exportVenderGroup").click(function(){
    //    var filter=getSelectedFilter();
    //    var query = _.clone(filter);
    //
    //    $("#wholePage").mask({'label': "请等待，文件正在导出..."});
    //    requestURL(dataService + "/Vender/exportVenderPermissionControlVenderGroupOrderStatisticsVenderAnalysis", query).done(function (obj) {
    //        $("#wholePage").unmask();
    //        var url = Meteor.settings.public.downloadService.baseUrl + obj.fileName;
    //        var link = document.createElement("a");
    //        link.href = url;
    //        link.style = "visibility:hidden";
    //        document.body.appendChild(link);
    //        link.click();
    //        document.body.removeChild(link);
    //    });
    //})

};

var filter={};

function pickWebTrafficFunnelDateRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.dateSelectLabel').html(sdt + "~" + edt);

    filter=getSelectedFilter();
    renderPage(filter);
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

function getSelectedFilter() {
    var dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g, "").split("~");
    var startDate = dt[0];
    var endDate = dt[1];

    filter.startDate=startDate;
    filter.endDate=endDate;

    return cleanParams(filter);
}

function getSelectedFilterGroup() {
    var dt = $('.desktop-only .dateSelectLabelGroup').text().replace(/ /g, "").split("~");
    var startDate = dt[0];
    var endDate = dt[1];

    filter.startDate=startDate;
    filter.endDate=endDate;

    if($(".orderFlagGroup").val()=="订单量"){
        var orderFlag="cnt"
    }else{
        var orderFlag="num"
    }

    filter.orderFlag=orderFlag;

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


function renderPage(filter) {
    $("#venderTable").hide();
    $("#loading1").show();
    var promise = getVenderPermissionControlGroupDailyActiveAllDataInfo(filter);
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
    var promise = getVenderPermissionControlGroupDailyActiveParDataInfo(filter);
    promise.done(function (ret) {
        $("#groupTable").show();
        $("#loading2").hide();

        //renderTable
        renderGroupTable(ret,'#groupTable');
    });

}

function renderTable(data,tableName) {
    var dateList=[];
    var endDateTmp=moment(filter.endDate).add(1,"days").format("YYYY-MM-DD");
    var startDateTmp=filter.startDate;
    dateList.push("日期");
    for(startDateTmp;startDateTmp!=endDateTmp;startDateTmp=moment(startDateTmp).add(1,"days").format("YYYY-MM-DD")){
        dateList.push(startDateTmp);
    }

    var dataAll=[];
    var dataPartGroupCnt={};
    dataPartGroupCnt.data0="日活门店数";
    var dataPartCnt={};
    dataPartCnt.data0="订单数";
    var dataPartNum={};
    dataPartNum.data0="订单金额";
    var n=0;
    data.forEach(function(e){
        n++;
        dataPartGroupCnt[("data"+n)]= e.groupCnt;
        dataPartCnt[("data"+n)]= e.count;
        dataPartNum[("data"+n)]= e.num;
    });

    dataAll.push(dataPartGroupCnt);
    dataAll.push(dataPartCnt);
    dataAll.push(dataPartNum);

    var columnsList=[];
    for(var i=0;i<=n;i++){
        var temp={
            field:"data"+i,title:dateList[i],sortable:true
        }
        columnsList.push(temp);
    }

    $(tableName).bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        search: true,
        data:dataAll,
        columns:columnsList
    });
}

function renderGroupTable(data,tableName) {
    var dateList=[];
    var endDateTmp=moment(filter.endDate).add(1,"days").format("YYYY-MM-DD");
    var startDateTmp=filter.startDate;
    var dateNum=getSomeDays(startDateTmp,endDateTmp);
    dateList.push("门店id");
    dateList.push("门店名");
    dateList.push("所属客户");
    dateList.push("客户id");
    dateList.push("客户级别");
    for(startDateTmp;startDateTmp!=endDateTmp;startDateTmp=moment(startDateTmp).add(1,"days").format("YYYY-MM-DD")){
        dateList.push(startDateTmp);
    }

    var dataAll=[];
    var dataPartGroupCnt={};
    var n=0;
    data.forEach(function(e){
        if(n!=(dateNum)) {
            if(n==0){
                dataPartGroupCnt.data0= e.venerGroupKey;
                dataPartGroupCnt.data1= e.venerGroupName;
                dataPartGroupCnt.data2= e.vender_parent_name;
                dataPartGroupCnt.data3= e.vender_parent_key;
                dataPartGroupCnt.data4= e.level;
            }
            dataPartGroupCnt[("data" + (n+5))] = e.cnt;
            n++;
        }else{
            dataAll.push(dataPartGroupCnt);
            dataPartGroupCnt={};
            n=0;
            dataPartGroupCnt.data0= e.venerGroupKey;
            dataPartGroupCnt.data1= e.venerGroupName;
            dataPartGroupCnt.data2= e.vender_parent_name;
            dataPartGroupCnt.data3= e.vender_parent_key;
            dataPartGroupCnt.data4= e.level;
            dataPartGroupCnt[("data" + (n+5))] = e.cnt;
            n++;
        }
    });

    dataAll.push(dataPartGroupCnt);

    var columnsList=[];
    for(var i=0;i<=dateNum+4;i++){
        var temp={
            field:"data"+i,title:dateList[i],sortable:true
        }
        columnsList.push(temp);
    }

    $(tableName).bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        search: true,
        data:dataAll,
        columns:columnsList
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

function getVenderPermissionControlGroupDailyActiveAllDataInfo(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    requestURL(dataService + "/Vender/getVenderPermissionControlGroupDailyActiveAllDataInfo", query).done(function (ret) {
        dfd.resolve(ret)
    });

    return dfd.promise();
}


function getVenderPermissionControlGroupDailyActiveParDataInfo(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    requestURL(dataService + "/Vender/getVenderPermissionControlGroupDailyActiveParDataInfo", query).done(function (ret) {
        dfd.resolve(ret)
    });

    return dfd.promise();
}


