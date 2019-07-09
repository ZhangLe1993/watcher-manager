Template.aijihuiAccountBasicInfo.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#VenderPermissionControl').addClass('active');
    $('#aijihuiAccountBasicInfo').addClass('active');

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }


    var dateGap = -30;
    var minDate = "2016-01-01";
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
        renderFilterOptions(filter);
        renderPage(filter);

        $(".search").click(function () {
            var dateType = $(this).parent().parent().find(".dateType").val();
            var filter = getSelectedFilter(dateType, $(this));
            //console.log(filter);
            if(filter == false) {
                zeroModal.error('无此客户');
            }else{
                renderPage(filter);
            }
        });
    //})

};

var filter={};

function pickWebTrafficFunnelDateRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.dateSelectLabel').html(sdt + "~" + edt);
    filter.startDate=sdt;
    filter.endDate=edt;
    //renderPage(filter);
}
var accountList = [];
function renderFilterOptions(filter){
    //选项初始化加载
    requestURL(dataService+"/Vender/getVenderPermissionControlParentVenderBasicInfoOption",filter).done(function(data){

        /*省份*/
        /*$(".account").attr("multiple","multiple");*/
        $(".province").attr("multiple","multiple");

        /*renderOptions(".account",data.vender_parent_name)*/
        renderOptions(".province",data.vender_province_name);
        accountList = data.vender_parent_name;

        /*$(".account").multipleSelect({
            placeholder: "全部",
            width: 150,
            selectAll: false,
            filter: true
        });*/
        //var res = _.find(data.vender_parent_name, function(item) { return item.indexOf(keyword) != -1; });
        insertOptions('.account', accountList);

        $(".province").multipleSelect({
            placeholder: "全部",
//            selectAllText:"全部",
//            allSelected:true,
            width: 150,
            selectAll: false,
            filter: true
        });
    });
}

/*var getResult = function(data, target) {
    var res = [];
    if(data.length > 0) {
        _.each(data, function(item) {
            if(item.indexOf(target)) {
                res.push(item);
            }
        });
    }
    return res;
};*/

var insertOptions = function(selector, result) {
    //console.log(result);
    $(selector).autocomplete({
        source: result
    });
};

function renderOptions(sel,data) {
    $(sel).empty();
    data.forEach(function(ele) {
        $(sel).append("<option value='"+ele+"'>"+ele+"</option>");
    });
}

function getSelectedFilter(dateType, $this) {
    var dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g, "").split("~");
    var startDate = dt[0];
    var endDate = dt[1];
    filter.active = [];
    filter.account = [];
    var active=$(".active :selected").val();  //获取选中值
    if(active=="threeDay"){
        filter.active.push(3);
    }else if(active=="oneWeek"){
        filter.active.push(6);
    }else if(active=="threeWeek"){
        filter.active.push(21);
    }else if(active=="oneMonth"){
        filter.active.push(30);
    }
    var values = $(".account").val();
    //console.log(values);
    //debugger;
    //console.log(values != undefined);
    //console.log(!accountList.contains(values));
    if(values != undefined && !accountList.contains(values)) {
        return false;
    } else {
        if(values != "") {
            filter.account.push($(".account").val());
        }
    }
    console.log(filter.account);
    if($(".province").val() != null) {
        filter.province=$(".province").val();
    }

    filter.startDate = startDate;
    filter.endDate = endDate;

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
    //var dateGap = -15;
        renderParentTable('#tablee',filter);
        renderGroupTable('#tablegroup',filter);
        renderTable('#tablef',filter);
}

function renderParentTable(tableName,filter) {

    $("#loading2").hide();
    var ajaxQuery = _.clone(filter);
    $(tableName).bootstrapTable('destroy').bootstrapTable({
        //exportDataType: 'all',
        pagination:true,
        sidePagination:'server',
        ajax:function(params){
            var ajaxParams = $.extend(ajaxQuery,params.data);
            //$("#ctable").hide();
            //console.log(ajaxParams)
            getVenderPermissionControlParentVenderBasicInfo(ajaxParams).done(function(data){
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
                sortable:false
            },
            {
                field: 'vender_account',
                title: '账户名',
                sortable:true
            },
            {
                field: 'contact_name',
                title: '联系人',
                sortable:true
            },
            /*{
                field: 'vender_mobile_txt',
                title: '手机号',
                sortable:true
            },
            {
                field: 'vender_detail_address',
                title: '客户详细地址',
                sortable:true
            },*/
            {
                field: 'district',
                title: '母账户所在地区',
                sortable:true
            },
            {
                field: 'area_agent_name',
                title: '所属代理商',
                sortable:true
            },
            {
                field: 'observer_account_user_name',
                title: '所属业务员',
                sortable:true
            },
            {
                field: 'vender_status',
                title: '状态',
                sortable:true,
            },
            {
                field: 'contract_start_date',
                title: '合同开始日期',
                sortable:true,
            }
        ]
    });
    $("#cdataExport").click(function() {
        var query = _.clone(filter);
        var sdt = moment(query.startDate);
        var edt = moment(query.endDate);
        var dflag = sdt.add(1, 'month') <= edt;
        //if (dflag) {
        //    alert("导出文件最长间隔时间为1个月");
        //    return;
        //}

        $("#wholePage").mask({'label': "请等待，文件正在导出..."});
        requestURL(dataService + "/Vender/exportVenderPermissionControlParentVenderBasicInfo", query).done(function (obj) {
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

function renderGroupTable(tableName,filter) {

    $("#loadinggroup").hide();
    var ajaxQuery = _.clone(filter);
    $(tableName).bootstrapTable('destroy').bootstrapTable({
        pagination:true,
        sidePagination:'server',
        ajax:function(params){
            var ajaxParams = $.extend(ajaxQuery,params.data);
            //$("#ctable").hide();
            //console.log(ajaxParams)
            getVenderPermissionControlVenderGroupBasicInfo(ajaxParams).done(function(data){
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
                field: 'vender_province_name',
                title: '省份',
                sortable:true
            },
            {
                field: 'vender_group_owner_name',
                title: '店长姓名',
                sortable:true
            },
            /*{
                field: 'vender_group_owner_mobile',
                title: '联系方式',
                sortable:true
            },
            {
                field: 'vender_group_detail_address',
                title: '门店详细地址',
                sortable:true
            },*/
            {
                field: 'area_agent_name',
                title: '所属代理商',
                sortable:true
            },
            {
                field: 'district',
                title: '所在区域',
                sortable:true
            },
            {
                field: 'vender_group_status_flag',
                title: '状态',
                sortable:true,
            },
            {
                field: 'vender_group_create_date',
                title: '门店创建日期',
                sortable:true,
            }
        ]
    });
    $("#cdataExportVenderGroup").click(function() {
        var query = _.clone(filter);
        var sdt = moment(query.startDate);
        var edt = moment(query.endDate);
        var dflag = sdt.add(1, 'month') <= edt;
        //if (dflag) {
        //    alert("导出文件最长间隔时间为1个月");
        //    return;
        //}

        $("#wholePage").mask({'label': "请等待，文件正在导出..."});
        requestURL(dataService + "/Vender/exportVenderPermissionControlVenderGroupBasicInfo", query).done(function (obj) {
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

function renderTable(tableName,filter) {

    $("#loading3").hide();
    var ajaxQuery = _.clone(filter);
    $(tableName).bootstrapTable('destroy').bootstrapTable({
        pagination:true,
        sidePagination:'server',
        ajax:function(params){
            var ajaxParams = $.extend(ajaxQuery,params.data);
            //$("#ctable").hide();
            //console.log(ajaxParams)
            getVenderPermissionControlVenderBasicInfo(ajaxParams).done(function(data){
                //$("#ctable").show();
                params.success(data)
            });
        },
        cdataExport:"cdataExportVender",
        columns:[
            {
                field: 'vender_name',
                title: '子账户名',
                sortable:true
            },
            {
                field: 'vender_key',
                title: '子账户id',
                sortable:true
            },
            {
                field: 'vender_account',
                title: '账户名',
                sortable:true
            },
            {
                field: 'role',
                title: '角色',
                sortable:false
            },
            /*{
                field: 'vender_mobile_txt',
                title: '手机号',
                sortable:true
            },*/
            {
                field: 'vender_group_name',
                title: '所属门店',
                sortable:true
            },
            {
                field: 'vender_group_key',
                title: '所属门店id',
                sortable:true
            },
            {
                field: 'district',
                title: '门店所在地区',
                sortable:true
            },
            {
                field: 'vender_parent_name',
                title: '所属总账户',
                sortable:true
            },
            {
                field: 'vender_parent_key',
                title: '所属总账户id',
                sortable:true
            },
            {
                field: 'area_agent_name',
                title: '所属代理商账户',
                sortable:true
            },
            {
                field: 'vender_status',
                title: '状态',
                sortable:true,
            },
            {
                field: 'vender_create_date',
                title: '子账户注册时间',
                sortable:true,
            }
        ]
    });
    $("#cdataExportVender").click(function() {
        var query = _.clone(filter);
        var sdt = moment(query.startDate);
        var edt = moment(query.endDate);
        var dflag = sdt.add(1, 'month') <= edt;
        //if (dflag) {
        //    alert("导出文件最长间隔时间为1个月");
        //    return;
        //}

        $("#wholePage").mask({'label': "请等待，文件正在导出..."});
        requestURL(dataService + "/Vender/exportVenderPermissionControlVenderBasicInfo", query).done(function (obj) {
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
function getVenderPermissionControlParentVenderBasicInfo(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getVenderPermissionControlParentVenderBasicInfo", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}

//门店
function getVenderPermissionControlVenderGroupBasicInfo(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getVenderPermissionControlVenderGroupBasicInfo", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}

//子账户
function getVenderPermissionControlVenderBasicInfo(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getVenderPermissionControlVenderBasicInfo", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}


