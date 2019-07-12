Template.divineFlow.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#BITab').addClass('active');
    $('#divineFlow').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    $("#addBtn").click(function() {
        //customWarnModal('新增','myWarnModal','myWarnModalLabel',{},'add');
        _alert("提示","<span style='color:orange;'>新增功能尚未开放，我们会根据您们的反馈进行后续开发。。。。请持续关注。。。。</span>");
    });
    requestURL(dataService + '/divine/getTablePage',{}).done(function(data){

        tempList = data;

        $("#service").attr("multiple","multiple");

        var service = _.filter(_.uniq(_.pluck(data,'domain')),function(ele){ return ele != ""}).sort(
            function compareFunction(param1, param2) {
                return param1.localeCompare(param2,"zh");
            }
        );
        renderOptions(".service", service);
        $(".service").multipleSelect({
            placeholder: "全选",
            allSelected:"全选",
            appendWidth: false,
            selectAll: false,
            filter: true
        });

        $("#service").change(function(){
            refresh();
        });

        temps.service = service;

        $("#platform").attr("multiple","multiple");
        var platform = _.filter(_.uniq(_.pluck(data,'platform')),function(ele){ return ele != ""}).sort(
            function compareFunction(param1, param2) {
                return param1.localeCompare(param2,"zh");
            }
        );
        renderOptions(".platform", platform);
        $(".platform").multipleSelect({
            placeholder: "全选",
            allSelected:"全选",
            appendWidth: false,
            selectAll: false,
            filter: true
        });

        $("#platform").change(function(){
            refresh();
        });

        temps.platform = platform;

        $("#app").attr("multiple","multiple");
        var app = _.filter(_.uniq(_.pluck(data,'app_name')),function(ele){ return ele != ""}).sort(
            function compareFunction(param1, param2) {
                return param1.localeCompare(param2,"zh");
            }
        );
        renderOptions(".app", app);
        $(".app").multipleSelect({
            placeholder: "全选",
            allSelected:"全选",
            appendWidth: false,
            selectAll: false,
            filter: true
        });

        $("#app").change(function(){
            refresh();
        });
        temps.app = app;

        var link = _.filter(_.uniq(_.pluck(data,'page_path')),function(ele){ return ele != ""}).sort(
            function compareFunction(param1, param2) {
                return param1.localeCompare(param2,"zh");
            }
        );
        $(".link").autocomplete({
            source: link
        });

        $("#link").change(function(){
            refresh();
        });

        var name = _.filter(_.uniq(_.pluck(data,'page_name')),function(ele){ return ele != ""}).sort(
            function compareFunction(param1, param2) {
                return param1.localeCompare(param2,"zh");
            }
        );
        $(".name").autocomplete({
            source: name
        });

        $("#name").change(function(){
            refresh();
        });

        $("#page-table").bootstrapTable('destroy').bootstrapTable({
            data: data,
            pagination: true,
            striped: true,
            pageSize: 20,
            search: true,
            pageList: [5, 10, 15, 20, 50, 100, 200],
            exportDataType:'all',
            columns:[
                {
                    field:'domain',
                    title:'服务',
                    sortable:true
                },
                {
                    field:'platform',
                    title:'平台',
                    sortable:true
                },
                {
                    field:'app_name',
                    title:'应用',
                    sortable:true
                },
                {
                    field:'site_name',
                    title:'网站名称',
                    sortable:true
                },
                {
                    field:'page_path',
                    title:'页面链接',
                    sortable:true
                },
                {
                    field:'page_type_name',
                    title:'页面类型',
                    sortable:true
                },
                {
                    field:'page_name',
                    title:'页面名称',
                    sortable:true
                },
                {
                    field:'page_comment',
                    title:'页面备注',
                    sortable:true
                },
                {
                    field:'pv',
                    title:'浏览量',
                    sortable:true
                },
                {
                    field:'fix_user_name',
                    title:'操作人',
                    sortable:true
                },
                {
                    field:'fix_dt',
                    title:'操作日期',
                    sortable:true
                },
                {
                    field:'operate',
                    title:'操作',
                    width:'120px',
                    events:operateEvents,
                    formatter: function (value, row, index) {
                        var temp = '';
                        var edit = '<a table-index="'+ index +'" data-row="' + JSON.stringify(row).replace(/"/g, '&quot;')+'" operation="edit" style="cursor:pointer;height:25px;" class="btn" href="javascript:void(0)"><img src="/assets/icon/mdms-edit.png" width="25px" height="25px"/></a>';;
                        return [temp,edit].join('');
                    }
                }
            ]
        });

        $("#page-table-panel").delegate("a[operation='edit']",
            'click', function (e) {
                e.stopPropagation();
                console.log('编辑');
                var str = $(this).attr("data-row");
                var obj = JSON.parse(str);
                console.log(obj);
                customWarnModal('编辑', 'myWarnModal', 'myWarnModalLabel', obj, 'edit');
        });
    });

    requestURL(dataService + '/divine/getPageType',{}).done(function(data){
        $("#category").attr("multiple","multiple");
        //var category = _.filter(_.uniq(_.pluck(data,'page_type_name')),function(ele){ return ele != ""});
        var category = data.sort(
            function compareFunction(param1, param2) {
                return param1.localeCompare(param2,"zh");
            }
        );
        renderOptions(".category", category);
        $(".category").multipleSelect({
            placeholder: "全选",
            allSelected:"全选",
            appendWidth: false,
            selectAll: false,
            filter: true
        });

        $("#category").change(function(){
            refresh();
        });

        temps.category = category;

    });

};

var tempList = [];


function renderOptions(sel, data) {
    $(sel).empty();
    data.forEach(function(ele) {
        $(sel).append("<option value='" + ele + "'>" + ele + "</option>");
    });
}


var refresh = function() {
    var finalResult = tempList;

    var serviceArr = $(".service").val();
    console.log(serviceArr);
    if(serviceArr != null) {
        console.log('serviceArr不为空');
        finalResult = _.filter(finalResult, function(ele) {
            return serviceArr.contains(ele['domain']);
        });
    }

    var platformArr = $(".platform").val();
    console.log(platformArr);
    if(platformArr != null) {
        console.log('platformArr不为空');
        finalResult = _.filter(finalResult, function(ele) {
            return platformArr.contains(ele['platform']);
        });
    }

    var appArr = $(".app").val();
    console.log(appArr);
    if(appArr != null) {
        console.log('appArr不为空');
        finalResult = _.filter(finalResult, function(ele) {
            return appArr.contains(ele['app_name']);
        });
    }

    var categoryArr = $(".category").val();
    console.log(categoryArr);
    if(categoryArr != null) {
        console.log('categoryArr不为空');
        finalResult = _.filter(finalResult, function(ele) {
            return categoryArr.contains(ele['page_type_name']);
        });
    }


    var address = $(".link").val();
    console.log(address);
    if(address != undefined && address != "" && address != null) {
        console.log('address不为空');
        finalResult = _.filter(finalResult, function(ele) {
            return ele['page_path'] == address;
        });
    }

    var linkName = $(".name").val();
    console.log(linkName);

    if(linkName != undefined && linkName != "" && linkName != null) {
        console.log('linkName不为空');
        finalResult = _.filter(finalResult, function(ele) {
            return ele['page_name'] == linkName;
        });
    }

    console.log(finalResult);

    $("#page-table").bootstrapTable('destroy').bootstrapTable({
        data: finalResult,
        pagination: true,
        striped: true,
        pageSize: 20,
        search: true,
        pageList: [5, 10, 15, 20, 50, 100, 200],
        exportDataType:'all',
        columns:[
            {
                field:'domain',
                title:'服务',
                sortable:true
            },
            {
                field:'platform',
                title:'平台',
                sortable:true
            },
            {
                field:'app_name',
                title:'应用',
                sortable:true
            },
            {
                field:'site_name',
                title:'网站名称',
                sortable:true
            },
            {
                field:'page_path',
                title:'页面链接',
                sortable:true
            },
            {
                field:'page_type_name',
                title:'页面类型',
                sortable:true
            },
            {
                field:'page_name',
                title:'页面名称',
                sortable:true
            },
            {
                field:'page_comment',
                title:'页面备注',
                sortable:true
            },
            {
                field:'pv',
                title:'浏览量',
                sortable:true
            },
            {
                field:'fix_user_name',
                title:'操作人',
                sortable:true
            },
            {
                field:'fix_dt',
                title:'操作日期',
                sortable:true
            },
            {
                field:'operate',
                title:'操作',
                width:'120px',
                events:operateEvents,
                formatter: function (value, row, index) {
                    var temp = '';
                    var edit = '<a table-index="'+ index +'" data-row="' + JSON.stringify(row).replace(/"/g, '&quot;')+'" operation="edit" style="cursor:pointer;height:25px;" class="btn" href="javascript:void(0)"><img src="/assets/icon/mdms-edit.png" width="25px" height="25px"/></a>';;
                    return [temp,edit].join('');
                }
            }
        ]
    });

};

var doneRefresh = function() {

    requestURL(dataService + '/divine/getTablePage',{}).done(function(data){
        tempList = data;
        var finalResult = data;
        var serviceArr = $(".service").val();
        console.log(serviceArr);
        if(serviceArr != null) {
            console.log('serviceArr不为空');
            finalResult = _.filter(finalResult, function(ele) {
                return serviceArr.contains(ele['domain']);
            });
        }

        var platformArr = $(".platform").val();
        console.log(platformArr);
        if(platformArr != null) {
            console.log('platformArr不为空');
            finalResult = _.filter(finalResult, function(ele) {
                return platformArr.contains(ele['platform']);
            });
        }

        var appArr = $(".app").val();
        console.log(appArr);
        if(appArr != null) {
            console.log('appArr不为空');
            finalResult = _.filter(finalResult, function(ele) {
                return appArr.contains(ele['app_name']);
            });
        }

        var categoryArr = $(".category").val();
        console.log(categoryArr);
        if(categoryArr != null) {
            console.log('categoryArr不为空');
            finalResult = _.filter(finalResult, function(ele) {
                return categoryArr.contains(ele['page_type_name']);
            });
        }


        var address = $(".link").val();
        console.log(address);
        if(address != undefined && address != "" && address != null) {
            console.log('address不为空');
            finalResult = _.filter(finalResult, function(ele) {
                return ele['page_path'] == address;
            });
        }

        var linkName = $(".name").val();
        console.log(linkName);

        if(linkName != undefined && linkName != "" && linkName != null) {
            console.log('linkName不为空');
            finalResult = _.filter(finalResult, function(ele) {
                return ele['page_name'] == linkName;
            });
        }

        //console.log(finalResult);

        $("#page-table").bootstrapTable('destroy').bootstrapTable({
            data: finalResult,
            pagination: true,
            striped: true,
            pageSize: 20,
            search: true,
            pageList: [5, 10, 15, 20, 50, 100, 200],
            exportDataType:'all',
            columns:[
                {
                    field:'domain',
                    title:'服务',
                    sortable:true
                },
                {
                    field:'platform',
                    title:'平台',
                    sortable:true
                },
                {
                    field:'app_name',
                    title:'应用',
                    sortable:true
                },
                {
                    field:'site_name',
                    title:'网站名称',
                    sortable:true
                },
                {
                    field:'page_path',
                    title:'页面链接',
                    sortable:true
                },
                {
                    field:'page_type_name',
                    title:'页面类型',
                    sortable:true
                },
                {
                    field:'page_name',
                    title:'页面名称',
                    sortable:true
                },
                {
                    field:'page_comment',
                    title:'页面备注',
                    sortable:true
                },
                {
                    field:'pv',
                    title:'浏览量',
                    sortable:true
                },
                {
                    field:'fix_user_name',
                    title:'操作人',
                    sortable:true
                },
                {
                    field:'fix_dt',
                    title:'操作日期',
                    sortable:true
                },
                {
                    field:'operate',
                    title:'操作',
                    width:'120px',
                    events:operateEvents,
                    formatter: function (value, row, index) {
                        var temp = '';
                        var edit = '<a table-index="'+ index +'" data-row="' + JSON.stringify(row).replace(/"/g, '&quot;')+'" operation="edit" style="cursor:pointer;height:25px;" class="btn" href="javascript:void(0)"><img src="/assets/icon/mdms-edit.png" width="25px" height="25px"/></a>';;
                        return [temp,edit].join('');
                    }
                }
            ]
        });
    });
};

var temps = {service:[],app:[],platform:[],category:[]};
function customWarnModal(title, modelSelector, titleSelector, obj, type){
    $("#" + modelSelector).off('shown.bs.modal').on('shown.bs.modal', function () {
        $("#" + titleSelector).text(title);
        renderOptions("select[name = 'service']",temps.service);
        renderOptions("select[name = 'app']",temps.app);
        renderOptions("select[name = 'platform']",temps.platform);
        renderOptions("select[name = 'category']",temps.category);
        if(type == 'add'){
            $("input[name = 'pageLink']").val('');
            $("input[name = 'pageName']").val('');
            $("textarea[name='pageRemarks']").val('');

        } else {
            $("select[name = 'service']").val(obj.domain);
            $("select[name = 'app']").val(obj.app_name);
            $("select[name = 'platform']").val(obj.platform);
            $("select[name = 'category']").val(obj.page_type_name);

            $("input[name = 'pageLink']").val(obj.page_path);
            $("input[name = 'pageName']").val(obj.page_name);
            $("textarea[name='pageRemarks']").val(obj.page_comment);
        }
    });
    $("#"+modelSelector).modal();
    if(type == 'add'){
        $("#updateBtn").attr("style","display:none;");
        $("#saveBtn").removeAttr("style");
        $("#saveBtn").unbind("click").bind('click',function(){

            var service = $("select[name = 'service']").val();
            var app = $("select[name = 'app']").val();
            var platform = $("select[name = 'platform']").val();
            var category = $("select[name = 'category']").val();

            var pageLink = $("input[name = 'pageLink']").val();
            var pageName = $("input[name = 'pageName']").val();
            //var pagePV = $("input[name = 'pagePV']").val();

            var pageRemarks = $("textarea[name='pageRemarks']").val();

            var result = {service:service,app:app,platform:platform,category:category,pageLink:pageLink.trim(),pageName:pageName.trim(),pageRemarks:pageRemarks.trim()};
            console.log(result);

            var isCheck = check(result);
            if(!isCheck) {
                return;
            }
            $('#loading').modal('show');
            var userId = getUserName();
            var userName = getUserName();
            result.uName = userName;
            result.openId = "";

            requestURLPost(dataService+"/divine/saveInfo", result).done(function (data) {
                $('#loading').modal('hide');
                console.log(data);
                if(data == undefined || data.code == undefined){
                    _error('服务搬家了。。。');
                } else {
                    if (data.code == 200) {
                        _success('保存成功',{},{},'add');
                    } else if(data.code == 200101){
                        _error('保存失败');
                    }
                }
            });

        });
    }else{
        $("#saveBtn").attr("style","display:none;");
        $("#updateBtn").removeAttr("style");
        $("#updateBtn").unbind("click").bind('click',function(){
            var service = $("select[name = 'service']").val();
            var app = $("select[name = 'app']").val();
            var platform = $("select[name = 'platform']").val();
            var category = $("select[name = 'category']").val();

            var pageLink = $("input[name = 'pageLink']").val();
            var pageName = $("input[name = 'pageName']").val();
            //var pagePV = $("input[name = 'pagePV']").val();

            var pageRemarks = $("textarea[name='pageRemarks']").val();

            var result = {service:service,app:app,platform:platform,category:category,pageLink:pageLink.trim(),pageName:pageName.trim(),pageRemarks:pageRemarks.trim()};
            console.log(result);

            var isCheck = check(result);
            if(!isCheck) {
                return;
            }
            $('#loading').modal('show');

            var old = {
                app_name: obj.app_name,
                domain: obj.domain,
                page_comment: obj.page_comment,
                page_name: obj.page_name,
                page_path: obj.page_path,
                page_type_name: obj.page_type_name,
                platform: obj.platform};
            var current = {
                app_name: app,
                domain: service,
                page_comment: pageRemarks,
                page_name: pageName,
                page_path: pageLink,
                page_type_name: category,
                platform: platform};

            var userId = getUserName();
            var userName = getUserName();
            result.uName = userName;
            result.openId = obj.id;

            requestURLPost(dataService+"/divine/updateInfo", result).done(function (data) {
                $('#loading').modal('hide');
                console.log(data);
                if(data == undefined || data.code == undefined) {
                    _error('服务搬家了。。。');
                } else {
                    if (data.code == 200) {
                        _success('修改成功',old,current,'edit');
                    } else if(data.code == 200101){
                        _error('修改失败');
                    } else if(data.code == 200102){
                        _error('操作冲突，已经被其他人捷足先登啦。');
                    }
                }
            });

        });
    }

}

var check = function(obj) {

    /*if(obj.service == "" || obj.service == null) {
        _alert('提示！','服务不可为空！');
        return false;
    }

    if(obj.app == "" || obj.app == null) {
        _alert('提示！','应用不可为空！');
        return false;
    }*/

    /*if(obj.platform == "" || obj.platform == null) {
        _alert('提示！','平台不可为空！');
        return false;
    }*/

    if(obj.category == "" || obj.category == null) {
        _alert('提示！','页面类型不可为空！');
        return false;
    }

    /*if(obj.pageLink == "" || obj.pageLink == null) {
        _alert('提示！','页面链接不能为空！');
        return false;
    }*/

    /*var reg = /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/;
    if(!reg.test(obj.pageLink)) {
        _alert('提示！',"请检查输入的网址是以http://https://开头，切确保是一个网址！");
        return false;
    }*/

    if(obj.pageName == "" || obj.pageName == null){
        _alert('提示！','页面名称不能为空！');
        return false;
    }

    /*if(obj.pageRemarks == "" || obj.pageRemarks == null){
        _alert('提示！','页面备注不能为空！');
        return false;
    }*/

    return true;
};

var _alert = function(text,subtext) {
    zeroModal.alert({
        content: text,
        contentDetail: subtext,
        okFn: function() {

        }
    });
};

function _error(text) {
    zeroModal.error(text);
}


function _success(text,old,current,type) {
    zeroModal.success({
        content: text,
        okFn: function() {
            //zeroModal.closeAll();
            $("#myWarnModal").modal('hide');
            if(type == 'edit') {
                var userId = getUserName();
                var userName = getUserName();
                requestURLPost(dataService+"/divine/saveLogInfo", {uid:userId,uName:userName,old:old,current:current}).done(function (data) {

                });
            }
            setTimeout(function() {
                doneRefresh();
            },1000);
        }
    });
}
