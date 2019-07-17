Template.aijihuiAccountPointDiffInfo.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#VenderPermissionControl').addClass('active');
    $('#aijihuiAccountPointDiffInfo').addClass('active');

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    vender_company_key='aihuishouBiClairAll'
    vender_company_name=['all'];

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
        renderFilterOptions(filter);
        renderPage(filter);

        $(".search").click(function () {
            var filter = getSelectedFilter();
            renderPage(filter);
        });
    //})

};
var userId = getUserId();
var filter={},vender_company_key,vender_company_name;

function pickWebTrafficFunnelDateRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.dateSelectLabel').html(sdt + "~" + edt);
    filter.startDate=sdt;
    filter.endDate=edt;
    filter.userId = userId;
    //renderPage(filter);
}

function renderFilterOptions(filter){
    //选项初始化加载
    requestURL(dataService+"/Vender/getVenderPermissionControlParentVenderBasicInfoOption",filter).done(function(data) {
        /*总账户*/
        $(".company").attr("multiple", "multiple");

        data.vender_parent_name.forEach(function (e) {
            $(".company").append("<option value='" + e + "'>" + e + "</option>");
        });

        ///*门店*/
        $(".store").attr("multiple", "multiple");
        //data.vender_group_name.forEach(function (e) {
        //    $(".store").append("<option value='" + e + "'>" + e + "</option>");
        //});

        $(".company").multipleSelect({
            placeholder: "全部",
//            selectAllText:"全部",
//            allSelected:true,
            width: 150,
            selectAll: false,
            filter: true
        });
        $(".store").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false,
            filter: true
        });

        $(document).on('change','select.company',function(e){
            getFilterOptionsCompany();
        });
    })

}

function renderOptions(sel,data){
    $(sel).empty();
    data.forEach(function(ele){
        $(sel).append("<option value='"+ele+"'>"+ele+"</option>")
    });
}

function getFilterOptionsCompany(){
    var company= $(".company").val();

    var filter = {
        "vender_company_key":vender_company_key,
        "company":company,
        userId : userId
    };

    filter=cleanParams(filter);
    $(".store").remove();
    $("<select class='store' style='margin-left: 28px;width:150px;border-radius: 4px;padding: 6px 12px;'></select>").insertAfter(".storeOption");
    requestURL(dataService+"/Vender/getVenderFilterOptions",cleanParams(filter)).done(function(ret){
        //store
        $(".store").attr("multiple","multiple");
        ret.vender_store_name.forEach(function (e) {
            $(".store").append("<option value='" + e + "'>" + e + "</option>");
        });
        $(".store").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false,
            filter: true
        });

    });
}

function getSelectedFilter() {
    var dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g, "").split("~");
    var startDate = dt[0];
    var endDate = dt[1];
    filter.Vender=$(".company").val();
    filter.Group=$(".store").val();

    filter.startDate=startDate;
    filter.endDate=endDate;
    filter.userId = userId;
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
    //var dateGap = -15;
        renderParentTable('#tablee',filter);
        renderGroupTable('#tablegroup',filter);
}

function customModal (title,data,colums){
    $("#myModal").on('show.bs.modal', function () {
         $("#myModalLabel").text(title)
         $("#modalContent").bootstrapTable('destroy').bootstrapTable({
             exportDataType: 'all',
             data:data,
             columns: colums
         });
     })
     $("#myModal").modal()
}

function renderParentTable(tableName,filter) {

    $("#loading2").hide();
    var ajaxQuery = _.clone(filter);
    $("#tablee").on('click','a.vender_modal',function(){
        venderCustomModal($(this).attr("data"))
    })
    $(tableName).bootstrapTable('destroy').bootstrapTable({
        //exportDataType: 'all',
        pagination:true,
        sidePagination:'server',
        ajax:function(params){
            var ajaxParams = $.extend(ajaxQuery,params.data);
            //$("#ctable").hide();
            getVenderPermissionControlVenderPointDiffAnalysis(ajaxParams).done(function(data){
                //$("#ctable").show();
                params.success(data)
            });
        },
        cdataExport:"cdataExport",
        columns:[
            {
                field: 'vender_parent_name',
                title: '客户名称',
                sortable:true
            },
            {
                field: 'vender_parent_key',
                title: '客户id',
                sortable:true
            },
            {
                field: 'level',
                title: '客户类型',
                sortable:true,
            },
            {
                field: 'getPoint',
                title: '本段时间客户获得的积分',
                sortable:true
            },
            {
                field: 'usedPoint',
                title: '本段时间客户使用的积分',
                sortable:true
            },
            {
                field: 'getDiff',
                title: '本段时间客户验货差异额',
                sortable:true
            },
            {
                field: 'usedDiff',
                title: '本段时间客户已兑换差异额',
                sortable:true
            },
            {
                field: 'notUsedDiff',
                title: '本段时间客户未兑换差异额',
                sortable:true
            },
            {
                field:'#',
                title:'历史累计信息',
                sortable:true,
                formatter:function(value,row,index){
                    return '<a style="cursor: pointer" class="vender_modal" data='+row.vender_parent_key+'>历史累计信息</a>'
                }
            }
        ]
    });

    $("#cdataExport").click(function() {
        var query = _.clone(filter);
        var sdt = moment(query.startDate);
        var edt = moment(query.endDate);
        var dflag = sdt.add(1, 'month') <= edt;
        if (dflag) {
            alert("导出文件最长间隔时间为1个月");
            return;
        }

        $("#wholePage").mask({'label': "请等待，文件正在导出..."});
        requestURL(dataService + "/Vender/exportVenderPermissionControlVenderPointDiffAnalysis", query).done(function (obj) {
            $("#wholePage").unmask();
            var url = Meteor.settings.public.downloadService.baseUrl + obj.fileName;
            var link = document.createElement("a");
            link.href = url;
            link.style = "visibility:hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    });
}

    function venderCustomModal(venderId){
        var filter={
            "VenderId":venderId
        }
        requestURL(dataService + "/Vender/getVenderPermissionControlVenderPointDiffEmbedAnalysis", filter).done(function (ret) {
            customModal("总账户历史累计数据",ret,[
                {
                field: 'vender_parent_name',
                title: '客户名称',
                sortable:true
                },
                {
                    field: 'vender_parent_key',
                    title: '客户id',
                    sortable:true,
                },
                {
                    field: 'accumulateGetPoint',
                    title: '客户累计获得的积分',
                    sortable:true,
                },
                {
                    field: 'accumulateUsedPoint',
                    title: '客户累计使用的积分',
                    sortable:true,
                },
                {
                    field: 'accumulateGetDiff',
                    title: '客户累计差异额',
                    sortable:true,
                },
                {
                    field: 'accumulateUsedDiff',
                    title: '客户累计已兑换差异额',
                    sortable:true,
                },
                {
                    field: 'accumulateNotUsedDiff',
                    title: '客户累计未兑换差异额',
                    sortable:true,
                }])
        })
    }

    function venderGroupCustomModal(groupId){
        var filter={
            "GroupId":groupId
        }
        requestURL(dataService + "/Vender/getVenderPermissionControlVenderGroupPointDiffEmbedAnalysis", filter).done(function (ret) {
            customModal("门店历史累计数据",ret,[{
                field: 'vender_group_name',
                title: '门店名称',
                sortable:true
            },
                {
                    field: 'vender_group_key',
                    title: '门店id',
                    sortable:true,
                },
                {
                field: 'vender_parent_name',
                title: '总账户名称',
                sortable:true
                },
                {
                    field: 'vender_parent_key',
                    title: '总账户id',
                    sortable:true,
                },
                {
                    field: 'accumulateGetPoint',
                    title: '门店累计获得的积分',
                    sortable:true,
                },
                {
                    field: 'accumulateUsedPoint',
                    title: '门店累计使用的积分',
                    sortable:true,
                },
                {
                    field: 'accumulateGetDiff',
                    title: '门店累计差异额',
                    sortable:true,
                },
                {
                    field: 'accumulateUsedDiff',
                    title: '门店累计已兑换差异额',
                    sortable:true,
                },
                {
                    field: 'accumulateNotUsedDiff',
                    title: '门店累计未兑换差异额',
                    sortable:true,
                }])
        });
    }



function renderGroupTable(tableName,filter) {

    $("#loadinggroup").hide();
    var ajaxQuery = _.clone(filter);
    $("#tablegroup").on('click','a.group_modal',function(e){
        venderGroupCustomModal($(this).attr("data"))
    })
    $(tableName).bootstrapTable('destroy').bootstrapTable({
        pagination:true,
        sidePagination:'server',
        ajax:function(params){
            var ajaxParams = $.extend(ajaxQuery,params.data);
            //$("#ctable").hide();
            getVenderPermissionControlVenderGroupPointDiffAnalysis(ajaxParams).done(function(data){
                //$("#ctable").show();
                params.success(data)
            });
        },
        cdataExport:"cdataExportVenderGroup",
        columns:[
            {
                field: 'vender_group_name',
                title: '门店名称',
                sortable:true
            },
            {
                field: 'vender_group_key',
                title: '门店id',
                sortable:true
            },
            {
                field: 'vender_parent_name',
                title: '客户名称',
                sortable:true
            },
            {
                field: 'vender_parent_key',
                title: '客户id',
                sortable:true
            },
            {
                field: 'getPoint',
                title: '本段时间门店获得的积分',
                sortable:true
            },
            {
                field: 'usedPoint',
                title: '本段时间门店使用的积分',
                sortable:true
            },
            {
                field: 'getDiff',
                title: '本段时间门店验货差异额',
                sortable:true
            },
            {
                field: 'usedDiff',
                title: '本段时间门店已兑换差异额',
                sortable:true
            },
            {
                field: 'notUsedDiff',
                title: '本段时间门店未兑换差异额',
                sortable:true
            },
            {
                field:'#',
                title:'历史累计信息',
                sortable:true,
                formatter:function(value,row,index){
                    return '<a style="cursor: pointer" class="group_modal" data='+row.vender_group_key+'>历史累计信息</a>'
                }
            }
        ]
    });

    $("#cdataExportVenderGroup").click(function() {
        var query = _.clone(filter);
        var sdt = moment(query.startDate);
        var edt = moment(query.endDate);
        var dflag = sdt.add(1, 'month') <= edt;
        if (dflag) {
            alert("导出文件最长间隔时间为1个月");
            return;
        }

        $("#wholePage").mask({'label': "请等待，文件正在导出..."});
        requestURL(dataService + "/Vender/exportVenderPermissionControlVenderGroupPointDiffAnalysis", query).done(function (obj) {
            $("#wholePage").unmask();
            var url = Meteor.settings.public.downloadService.baseUrl + obj.fileName;
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

//总账户
function getVenderPermissionControlVenderPointDiffAnalysis(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    query.userId = userId;
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getVenderPermissionControlVenderPointDiffAnalysis", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}

//门店
function getVenderPermissionControlVenderGroupPointDiffAnalysis(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    query.userId = userId;
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getVenderPermissionControlVenderGroupPointDiffAnalysis", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}



