Template.aijihuiAccountInfo.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#VenderPermissionKAControl').addClass('active');
    $('#aijihuiAccountInfo').addClass('active');

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
        startDateEmbed=startDate;
        endDateEmbed=endDate;
        renderPage(filter);

        $(".search").click(function () {
            var dateType = $(this).parent().parent().find(".dateType").val();
            var filter = getSelectedFilter(dateType, $(this));
            renderPage(filter);
        });
    //})

};

var filter={},startDateEmbed,endDateEmbed;

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
    startDateEmbed=startDate;
    endDateEmbed=endDate;

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
    var dflag = moment(filter.startDate).add(1,'month')<=moment(filter.endDate);
    //query["dateType"]=="daily" &&
    if(dflag){
        alert("查询最长间隔时间为1个月!");
        return;
    }
    //var dateGap = -15;
    $("#tablee").hide();
    $("#loading2").show();
    var promise = getVenderPermissionControlVenderDetailInfo(filter);
    promise.done(function (ret) {
        $("#tablee").show();
        $("#loading2").hide();

        //renderTable
        renderTable(ret,filter);
    });

}

function renderTable(data,filter) {

    data.forEach(function(e){
        e.venderCreateCount= e.vender_parent_key.split(',')[2];
        e.venderStatusCount= e.vender_parent_key.split(',')[3];
        e.localDiffNum= e.vender_parent_key.split(',')[1];
        e.vender_parent_key= e.vender_parent_key.split(',')[0];
        e.group_owner_bonus= e.vender_parent_key.split(',')[4];
    })
    $('#tablee').bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        search: true,
        data:data,
        cdataExport:"cdataExport",
        columns:[
            {
                field:'vender_parent_name',
                title:'客户名称',
                sortable:true
            },
            {
                field:'vender_parent_key',
                title:'客户id',
                sortable:true,
            },
            {
                field:'level',
                title:'级别',
                sortable:true
            },
            {
                field:'registerShopCnt',
                title:'注册门店数',
                sortable:true
            },
            {
                field:'registerAllShopCnt',
                title:'累积注册门店数',
                sortable:true
            },
            {
                field:'liveShopCnt',
                title:'活跃门店(提交)',
                sortable:true
            },
            {
                field:'zeroOrderShopCnt',
                title:'0订单门店数(提交)',
                sortable:true
            },
            {
                field:'loginCount',
                title:'未登录子账户数',
                sortable:true
            },
            {
                field:'venderCreateCount',
                title:'注册子帐户数',
                sortable:true
            },
            {
                field:'venderStatusCount',
                title:'累计启用中的子帐户数',
                sortable:true
            },
            {
                field:'orderCnt',
                title:'订单数(提交)',
                sortable:true
            },
            {
                field:'recycleNum',
                title:'回收额(提交)',
                sortable:true
            },
            {
                field:'tradeNum',
                title:'累计验货成功金额',
                sortable:true
            },
            {
                field:'venderNum',
                title:'商家服务费',
                sortable:true
            },
            {
                field:'subVenderNum',
                title:'店员服务费',
                sortable:true
            },
            {
                field:'group_owner_bonus',
                title:'店长服务费',
                sortable:true
            },
            {
                field:'errorRate',
                title:'重大失误率',
                sortable:true
            },
            {
                field:'localDiffNum',
                title:'本段时间的重大失误金额',
                sortable:true
            },
            {
                field:'localErrorRate',
                title:'本段时间的重大失误率',
                sortable:true
            },
            {
                field:'frozenNum',
                title:'冻结资金',
                sortable:true
            },
            {
                field:'tradeCntAll',
                title:'订单数(成交)',
                sortable:true
            },
            {
                field:'tradeNumAll',
                title:'订单金额(成交)',
                sortable:true
            },
            {
                field:'#',
                title:'更多信息',
                sortable:true,
                formatter:function(value,row,index){
                    //var val=value.replace(/\//g,"%2F")
                    //val=val.replace(/\?/g,"%3F")
                    //return "<a class='cus_modal' data-fancybox-type='iframe' href='/product/pageViewModal/"+val+"/"+row.idsite+"/"+area+"/"+city+"'>"+value+"</a>"
                    return "<a class='cus_modal'  data-fancybox-type='iframe' href='/vender/PermissionControlCollectInfoModal/"+row.vender_parent_name+"/"+row.vender_parent_key+"/"+startDateEmbed+"/"+endDateEmbed+"'>更多信息</a>"
                }
            }]
    });

    $("#cdataExport").click(function(){
        var query = _.clone(filter);
        var sdt = moment(query.startDate);
        var edt = moment(query.endDate);
        var dflag = sdt.add(1, 'month') <= edt;
        if (dflag) {
            alert("导出文件最长间隔时间为1个月");
            return;
        }

        $("#wholePage").mask({'label':"请等待，文件正在导出..."});
        var flag = query["dateType"];
        delete query["dateType"];
        requestURL(dataService+"/Vender/exportVenderPermissionControlVenderDetailInfo",query).done(function(obj){
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


function getVenderPermissionControlVenderDetailInfo(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getVenderPermissionControlVenderDetailInfo", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}



