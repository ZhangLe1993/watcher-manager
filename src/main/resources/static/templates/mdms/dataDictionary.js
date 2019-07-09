Template.dataDictionary.rendered = function () {
    $('.navi-tab').removeClass('active');
    /*$('#BITab').addClass('active');*/
    $('#dataDictionary').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    setTimeout(function () {
        if (isAndroid || isiOS) {
            $('#mobilenote').show();
        } else {
            $('#mobilenote').hide();
        }
    }, 1000);

    if(isAndroid||isiOS) {
        $('.sidebar-toggle').click();
    }
    $('.sidebar-toggle').click();

    //一个低门槛的演示,更多需求看源码
    //基于bootstrap tab的自定义多标签的jquery实用插件，滚动条依赖jquery.scrollbar，图标依赖font-awesom

    requestURL(dataService+"/mdms/getDictionaryTree", {}).done(function (data) {
        console.log(data);
        var zTreeObj;
        // zTree 的参数配置，深入使用请参考 API 文档（setting 配置详解）
        var setting = {
            data: {
                simpleData: {
                    enable: true
                }
            },
            callback: {
                beforeClick: beforeClick,
                onClick: onClick
            }
        };
        // zTree 的数据属性，深入使用请参考 API 文档（zTreeNode 节点数据详解）
        var zNodes = [];

        var first = data['first'];//[dw,dm,ods]  =3
        var second = data['second'];//[]   x
        var third = data['third'];// []   y
        var i = 1;
        var j = 1 + first.length;//   4
        var k = 1 + first.length + second.length;
        _.each(first,function(f){
            //console.log('i:'+i);
            if(i == 1){
                zNodes.push({ id:i, pId:0,oId:f.id,name:f.alias_name+'['+f.name+']', isParent:true, open:true,icon:"/assets/zTree_v3/css/metroStyle/img/pg.png",click:false});
            }else{
                zNodes.push({ id:i, pId:0,oId:f.id,name:f.alias_name+'['+f.name+']', isParent:true, open:false,icon:"/assets/zTree_v3/css/metroStyle/img/pg.png",click:false});
            }
            _.each(second,function(s) {
                //console.log('j:'+j);
                if(s.parent_id == f.id){
                    if(j == 1 + first.length){
                        zNodes.push({ id:j, pId:i, oId:s.id,name:s.name, isParent:true, open:true,icon:"/assets/zTree_v3/css/metroStyle/img/database.png"});
                    }else{
                        zNodes.push({ id:j, pId:i, oId:s.id,name:s.name, isParent:true, open:false,icon:"/assets/zTree_v3/css/metroStyle/img/database.png"});
                    }
                    _.each(third,function(t){
                        //console.log('k:'+k);
                        if(t.parent_id == s.id){
                            zNodes.push({ id:k, pId:j,pName:s.name, oId:t.id,name:t.name, isParent:false, open:false,icon:"/assets/zTree_v3/css/metroStyle/img/table.png"});
                            k++;
                        }
                    });
                    j++;
                }
            });
            i++;
        });

        zTreeObj = $.fn.zTree.init($("#treeDemo"), setting, zNodes);
    });

    userId = Meteor.user().profile.name;
    userName = Meteor.user().profile.username;
};
var userId = 0;
var userName = "系统";
var log, className = "dark";

var memoryTreeNode;

var beforeClick = function(treeId, treeNode, clickFlag) {
    className = (className === "dark" ? "":"dark");
    console.log("[ "+getTime()+" beforeClick ]  " + treeNode.id+"   " + treeNode.name );
    return (treeNode.click != false);
};

var onClick = function(event, treeId, treeNode, clickFlag) {
    if(treeNode.isParent){
        //渲染数据库
        var html = getDrawHtml(treeNode.id);
        $("#home-db-or-table").html('');
        $("#home-db-or-table").append(html);
        showPanelOrLoading(['toRepertoryClickResult'+treeNode.id],true);
        drawDataBaseTable(treeNode.id,treeNode.oId,treeNode.name);
    }else{
        //渲染表
        var html = getDrawForTableHtml(treeNode.id);
        $("#home-db-or-table").html('');
        $("#home-db-or-table").append(html);
        showPanelOrLoading([treeNode.id + 'tableTables'],true);
        showPanelOrLoading([treeNode.id+'tableTables'],false);
        drawTableTable(treeNode.id,treeNode.oId,treeNode.pName,treeNode.name);
    }
    memoryTreeNode = treeNode;
    $("a").each(function(){
        $(this).removeClass("selfSelectedNode");
    });
    $(".curSelectedNode").addClass("selfSelectedNode");
};


function drawDataBaseTable(nodeId,param,value){
    requestURL(dataService+"/mdms/getDictonarySurfaceData", {parentName:value}).done(function (tables) {
        if (tables.statusText != undefined && tables.statusText == 'error') {

        } else {
            //面板位置显示title
            toDrawHtmlPartHeader(value, tables.length);
            showPanelOrLoading(['toRepertoryClickResult' + nodeId],false);
            $("#repertory-click-panel-table" + nodeId).bootstrapTable('destroy').bootstrapTable({
                data: tables,
                pagination: true,
                striped: true,
                pageSize: 15,
                search: false,
                pageList: [5, 10, 15, 30, 60, 100],
                columns:[
                    {
                        title:'序号',
                        formatter: function (value, row, index) {
                            return index + 1;
                        }
                    },
                    {
                        field:'table_name',
                        title:'表名',
                        formatter:function(value,row,index) {
                            return '<span search-param="' + row.table_name + '" style="cursor:pointer;color:#3c8dbc;" operation="position-href">'+ value +'</span>';
                        }
                    },
                    {
                        field:'table_comment',
                        title:'表说明'
                    }
                ]
            });

            $("#repertory-click-panel-table" + nodeId).delegate("span[operation='position-href']",
                'click', function (e) {
                    e.stopPropagation();
                    var param = $(this).attr("search-param");
                    console.log(param);
                    var value = $(this).text();
                    console.log(value);

                    var zTree = $.fn.zTree.getZTreeObj("treeDemo");//treeDemo界面中加载ztree的div
                    var node = zTree.getNodeByParam("name",value);
                    zTree.cancelSelectedNode();//先取消所有的选中状态
                    zTree.selectNode(node,true);//将指定ID的节点选中
                    zTree.expandNode(node, true, false);//将指定ID节点展开
                    $("a").each(function(){
                       $(this).removeClass("selfSelectedNode");
                    });
                    $(".curSelectedNode").addClass("selfSelectedNode");
                });
        }
    });
};

function drawTableTable(nodeId, param, pValue, value) {
    requestURL(dataService+"/mdms/getFieldData", {parentName:pValue,tableName:value}).done(function (fields) {
        if (fields.statusText != undefined && fields.statusText == 'error') {

        } else {
            toDrawForTablePartHeader(value,fields.length, "");
            showPanelOrLoading(['toRepertoryClickResult'+nodeId],false);

            $("#repertory-click-panel-table"+nodeId).bootstrapTable('destroy').bootstrapTable({
                data: fields,
                pagination: true,
                striped: true,
                pageSize: 15,
                search: false,
                pageList: [5, 10 ,15, 30, 60],
                columns:[
                    {
                        title:'序号',
                        formatter: function (value, row, index) {
                            return index+1;
                        }
                    },
                    {
                        field:'column_name',
                        title:'字段名',
                        sortable:true
                    },
                    {
                        field:'column_type',
                        title:'字段类型',
                        sortable:true
                    },
                    {
                        field:'dis',
                        title:'是否是分布键',
                        sortable:true
                    },
                    {
                        field:'column_comment',
                        title:'字段说明',
                        sortable:true
                    }
                ]
            });

            $("#toRepertoryClickResult"+ nodeId +"Panel").delegate("a[operation='show-detail']",
                'click', function (e) {
                    e.stopPropagation();
                    var str = $(this).attr("data-row");
                    var obj = JSON.parse(str);
                    console.log(obj);
                    var fls = obj.f_is_primary_key;
                    var isKey = "否";
                    if(fls == "1"){
                        isKey = "是";
                    }
                    var hasUnique = "否";
                    var un = obj.f_has_index;
                    if(un == "1"){
                        hasUnique = "是";
                    }
                    var queryHtml = ''+
                        '<div class="row" style="margin:0 auto;width:98%;">' +
                        '<p>' +
                        '<label>　　　字段名:</label>' +
                        '<span style="margin-left:20px;">'+obj.f_name+'</span>' +
                        '</p>' +
                        '<p>' +
                        '<label>　　中文名称:</label>' +
                        '<span style="margin-left:20px;">'+obj.f_chinese_name+'</span>' +
                        '</p>' +
                        '<p>' +
                        '<label>　　字段类型:</label>' +
                        '<span style="margin-left:20px;">'+obj.f_type+'</span>' +
                        '</p>' +
                        '<p>' +
                        '<label>　是否为主键:</label>' +
                        '<span style="margin-left:20px;">'+isKey+'</span>' +
                        '</p>' +
                        '<p>' +
                        '<label>　是否有索引:</label>' +
                        '<span style="margin-left:20px;">'+hasUnique+'</span>' +
                        '</p>' +
                        '<p>' +
                        '<label>　最新修改人:</label>' +
                        '<span style="margin-left:20px;">'+obj.f_last_update_person_name+'</span>' +
                        '</p>' +
                        '<p>' +
                        '<label>最新修改时间:</label>' +
                        '<span style="margin-left:20px;">'+obj.f_last_update_time+'</span>' +
                        '</p>' +
                        '<p>' +
                        '<label style="position:relative;top:-135px;">　　字段说明:</label>' +
                        '<textarea style="width:350px;height:150px;margin-left:20px">'+obj.f_descrtiption+'</textarea>' +
                        '</p>' +
                        '<p>' +
                        '<label style="position:relative;top:-135px;">　　　　SQL:</label>' +
                        '<textarea style="width:350px;height:150px;margin-left:20px">'+obj.f_SQL+'</textarea>' +
                        '</p>' +
                        '</div>';
                    openWin(
                        {
                            title: '详细',
                            content: queryHtml,
                            width: '500px',
                            height: '600px',
                            max: true,
                            min: true,
                            ok: false,
                            cancel: false
                        }
                    );
                });

            $("#toRepertoryClickResult"+ nodeId +"Panel").delegate("a[operation='edit']",
                'click', function (e) {
                    e.stopPropagation();
                    var str = $(this).attr("data-row");
                    var index = $(this).attr("field-index");
                    var obj = JSON.parse(str);
                    console.log(obj);
                    var fls = obj.f_is_primary_key;
                    var isKey = "否";
                    if(fls == "1"){
                        isKey = "是";
                    }

                    var hasUnique = "否";
                    var un = obj.f_has_index;
                    if(un == "1"){
                        hasUnique = "是";
                    }

                    var isEffect = '<input style="margin-left:20px;" type="radio" value="0" name="isValid" checked="checked"/>&nbsp;<span style="font-size:15px;font-weight:BOLD;margin-top:-2px;">有效 &nbsp;</span>&nbsp;&nbsp;' +
                        '<input style="margin-left:20px;" type="radio" value="1" name="isValid"/>&nbsp;<span style="font-size:15px;font-weight:BOLD;margin-top:-2px;">废弃&nbsp;</span>&nbsp;&nbsp;';

                    var editHtml = ''+
                        '<div class="row" style="margin:0 auto;width:98%;">' +
                        '<p>' +
                        '<label>　　　字段名:</label>' +
                        '<span style="margin-left:20px;">'+obj.f_name+'</span>' +
                        '</p>' +
                        '<p>' +
                        '<label>　　中文名称:</label>' +
                        '<input type="text" name="fieldChineseName" value="'+obj.f_chinese_name+'" style="width:350px;margin-left:20px;"/>' +
                        '</p>' +
                        '<p>' +
                        '<label>　　字段类型:</label>' +
                        '<span style="margin-left:20px;">'+obj.f_type+'</span>' +
                        '</p>' +
                        '<p>' +
                        '<label>　是否为主键:</label>' +
                        '<span style="margin-left:20px;">'+isKey+'</span>' +
                        '</p>' +
                        '<p>' +
                        '<label>　是否有索引:</label>' +
                        '<span style="margin-left:20px;">'+hasUnique+'</span>' +
                        '</p>' +
                        '<p>' +
                        '<label>　　是否有效:</label>' +
                            isEffect +
                        '</p>' +
                        '<p>' +
                        '<label>　最新修改人:</label>' +
                        '<span style="margin-left:20px;">'+obj.f_last_update_person_name+'</span>' +
                        '</p>' +
                        '<p>' +
                        '<label>最新修改时间:</label>' +
                        '<span style="margin-left:20px;">'+obj.f_last_update_time+'</span>' +
                        '</p>' +
                        '<p>' +
                        '<label style="position:relative;top:-135px;">　　字段说明:</label>' +
                        '<textarea style="width:350px;height:150px;margin-left:20px" name="description">'+obj.f_descrtiption+'</textarea>' +
                        '</p>' +
                        '<p>' +
                        '<label style="position:relative;top:-135px;">　　　　SQL:</label>' +
                        '<textarea style="width:350px;height:150px;margin-left:20px" name="sql">'+obj.f_SQL+'</textarea>' +
                        '</p>' +
                        '</div>' +
                        '<div class="row" style="margin:0 auto;width:90%;">' +
                        '<div class="col-md-3" style="margin-left:60px;">' +
                        '<input type="button" name="button" class="search-button" id="field-save-btn'+nodeId+'" value="保存" style="cursor:pointer;"/>' +
                        '</div>' +
                        '<div class="col-md-3" style="margin-left:98px;">' +
                        '<input type="button" name="button" class="search-button" id="field-cancel-btn'+nodeId+'" value="取消" style="cursor:pointer;"/>' +
                        '</div>' +
                        '</div>' +
                        '';

                    openWin(
                        {
                            title: '编辑',
                            content: editHtml,
                            width: '500px',
                            height: '700px',
                            max: true,
                            min: true,
                            ok: false,
                            cancel: false
                        }
                    );

                    $("#field-save-btn"+nodeId).click(function(){
                        console.log("保存");

                        var fieldId = obj.f_id;
                        var fieldChineseName = ($("input[name='fieldChineseName']").val() == undefined || $("input[name='fieldChineseName']").val() == null) ? '' : $("input[name='fieldChineseName']").val();
                        var state = $("input[name='isValid']:checked").val();
                        var description = ($("textarea[name='description']").val() == undefined || $("textarea[name='description']").val() == null) ? '' : $("textarea[name='description']").val();
                        var sql = ($("textarea[name='sql']").val() == undefined || $("textarea[name='sql']").val() == null) ? '' : $("textarea[name='sql']").val();
                        var saveParam = {openId:userId,userName:userName,fieldId:fieldId,fieldChineseName:fieldChineseName.trim(),state:state,description:description.trim(),sql:sql.trim()};
                        console.log(saveParam);
                        requestURLPost(dataService + "/mdms/updateFieldInfo", saveParam).done(function (res) {
                            console.log(res);
                            if(res == undefined || res.code == undefined){
                                _error('服务搬家了。。。');
                            }else{
                                if (res.code == 200) {
                                    parent.zeroModal.closeAll();
                                    _success('保存成功');
                                    //数据回显
                                    $("tr[data-index='"+index+"']").find('td').eq(4).html(fieldChineseName);
                                    $("tr[data-index='"+index+"']").find('td').eq(5).html(description);
                                } else if(res.code == 200101){
                                    _error('保存失败');
                                } else if(res.code == 200102){
                                    _error('操作冲突，已经被其他人捷足先登啦。');
                                }
                            }
                        });
                        /*var tableId = obj.f_id;
                        var tableChineseName = $("input[name='tableChineseName']").val();
                        var state = $("input[name='state']:checked").val();
                        var description = $("textarea[name='description']").val();

                        var saveParam = {openId:userId,userName:userName,tableId:tableId,tableChineseName:tableChineseName,state:state,description:description};
                        console.log(saveParam);
                        requestURLPost(dataService + "/mdms/updateTableInfo", saveParam).done(function (res) {
                            console.log(res);
                            if(res == undefined || res.code == undefined){
                                _error('服务搬家了。。。');
                            }else{
                                if (res.code == 200) {
                                    parent.zeroModal.closeAll();
                                    _success('保存成功');
                                    //数据回显
                                    $("tr[data-index='"+index+"']").find('td').eq(2).html(tableChineseName);
                                    $("tr[data-index='"+index+"']").find('td').eq(3).html(description);
                                    $("tr[data-index='"+index+"']").find('td').eq(5).html(userName);
                                    var currentDate = new Date().format("yyyy-MM-dd hh:mm:ss");
                                    $("tr[data-index='"+index+"']").find('td').eq(6).html(currentDate);
                                } else if(res.code == 200101){
                                    _error('保存失败');
                                } else if(res.code == 200102){
                                    _error('操作冲突，已经被其他人捷足先登啦。');
                                }
                            }
                        });*/
                    });

                    $("#field-cancel-btn"+nodeId).click(function(){
                        console.log("取消");
                        parent.zeroModal.closeAll();
                    });
                });
        }
    });

};

var getTime = function(){
    var now= new Date(),
        h=now.getHours(),
        m=now.getMinutes(),
        s=now.getSeconds();
    return (h+":"+m+":"+s);
};

var getCurrentNode = function(){
    var jm = jsMind.current;
    var node = jm.get_selected_node();
    if(node == null || node == undefined) {
        console.log('node不存在');
        return;
    }
    return {node:node,jsMind:jm};
};


/*                                          右键菜单方法--       开始                                                   */
var addNode = function(){
    var content = '<div>' +
        '<span>血缘关系图暂时不支持添加节点功能，可前往xxx进行操作</span>' +
        '<a href="#">立即前往</a>' +
        '</div>';
    openWin(
        {
            title: '添加新节点',
            content: content,
            width: '200px',
            height: '130px',
            max: false,
            min: false,
            ok: true,
            cancel: true
        }
    );
};

var queryNode = function() {
    var obj = getCurrentNode();
    var content = '<div>' +
        '<span>节点ID</span><br>' +
        '<span>节点名称</span><br>' +
        '<span>节点其他信息</span><br>' +
        '' +
        '</div>';
    openWin(
        {
            title: '详细',
            content: content,
            width: '500px',
            height: '300px',
            max: true,
            min: true,
            ok: false,
            cancel: false
        }
    );
};

var delNode = function(){
    var content = '<div>' +
        '<span>血缘关系图暂时不支持删除节点功能，可前往xxx进行操作</span>' +
        '<a href="#">立即前往</a>' +
        '</div>';
    openWin(
        {
            title: '删除新节点',
            content: content,
            width: '200px',
            height: '130px',
            max: false,
            min: false,
            ok: true,
            cancel: true
        }
    );
};

var editNode = function(){
    var content = '<div>' +
        '<span>血缘关系图暂时不支持编辑节点功能，可前往xxx进行操作</span>' +
        '<a href="#">立即前往</a>' +
        '</div>';
    openWin(
        {
            title: '编辑新节点',
            content: content,
            width: '200px',
            height: '130px',
            max: false,
            min: false,
            ok: true,
            cancel: true
        }
    );
};
/*                                          右键菜单方法--       结束                                                   */
var openWin = function(param){
    zeroModal.show({
        title: (param == undefined ||  param.title == undefined || param.title == '') ? '弹出层' : param.title,
        content: (param == undefined ||param.content == undefined || param.content == '') ? '空空如也' : param.content,
        width: (param == undefined ||param.width == undefined) ? '500px' : param.width,
        height: (param == undefined ||param.height == undefined) ? '300px' : param.height,
        max: (param == undefined ||param.max == undefined) ? false : param.max,
        min: (param == undefined ||param.min == undefined) ? false : param.min,
        opacity: 0.8,
        forbidBodyScroll: true,
        ok: (param == undefined ||param.ok == undefined) ? false : param.ok,
        cancel: (param == undefined ||param.cancel == undefined) ? false : param.cancel,
        okFn: function(opt) {
            console.log(opt);
            return true;
        }
    });
};

var addNodeToChart = function() {
    jm.enable_edit();
    jm.add_node('job-left-2-1', 'job-left-3-1', '右边第三层第一个', {"background-color":'#1abc9c',"expanded":false});
    jm.disable_edit();
};

var showPanelOrLoading = function(selector_perv,on) {
    _.each(selector_perv,function(ele){
        var loadingId = ele + 'Loading';
        var panelId = ele + 'Panel';
        if(on){
            //显示动画   隐藏面板
            $('#' + loadingId).show();
            $('#' + panelId).hide();
        }else{
            //显示面板   隐藏动画
            $('#' + loadingId).hide();
            $('#' + panelId).show();
        }
    });
};

var getDrawHtml = function(nodeId){
    var html = '' +
        '<div id="repertory-click-panel" class="row" style="margin:0 auto;margin-top:10px;">' +
        '<div class="col-md-12 col-sm-12 col-xs-12 loading" id="toRepertoryClickResult'+nodeId+'Loading">' +
        '<br>' +
        '<br>' +
        '<br>' +
        '<div class=\'loading-anim\'>' +
        '<div class=\'border out\'></div>' +
        '<div class=\'border in\'></div>' +
        '<div class=\'border mid\'></div>' +
        '<div class=\'circle\'>' +
        '<span class=\'dot\'></span>' +
        '<span class=\'dot\'></span>' +
        '<span class=\'dot\'></span>' +
        '<span class=\'dot\'></span>' +
        '<span class=\'dot\'></span>' +
        '<span class=\'dot\'></span>' +
        '<span class=\'dot\'></span>' +
        '<span class=\'dot\'></span>' +
        '<span class=\'dot\'></span>' +
        '<span class=\'dot\'></span>' +
        '<span class=\'dot\'></span>' +
        '<span class=\'dot\'></span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="col-md-12 col-sm-12 col-xs-12" id="toRepertoryClickResult'+nodeId+'Panel">' +
        '    <table id="repertory-click-panel-table'+nodeId+'" class="table table-striped"' +
        '       data-toggle="table"' +
        '       data-show-export="false"' +
        '       data-pagination="true"' +
        '       data-click-to-select="true">' +
        '   </table>' +
        '</div>' +
        '</div>';
    return html;
};

var toDrawHtmlPartHeader = function(dataBase,length){
    var html = '<div class="pull-left" style="color:#000;font-weight:BOLD;">' +
        '<span>'+dataBase+'</span>' +
        '</div>' +
        '<div class="pull-right" style="color:#000;font-weight:BOLD;">' +
        '共:<span> '+length+' </span>　张表' +
        '</div>' ;

    $("#header-title").html('');
    $("#header-title").append(html);
};

var getDrawForTableHtml = function(nodeId) {
    var html = '' +
        '<div id="repertory-click-panel" class="row" style="margin:0 auto;margin-top:10px;">' +
        '<div class="col-md-12 col-sm-12 col-xs-12 loading" id="toRepertoryClickResult'+nodeId+'Loading">' +
        '<br>' +
        '<br>' +
        '<br>' +
        '<div class=\'loading-anim\'>' +
        '<div class=\'border out\'></div>' +
        '<div class=\'border in\'></div>' +
        '<div class=\'border mid\'></div>' +
        '<div class=\'circle\'>' +
        '<span class=\'dot\'></span>' +
        '<span class=\'dot\'></span>' +
        '<span class=\'dot\'></span>' +
        '<span class=\'dot\'></span>' +
        '<span class=\'dot\'></span>' +
        '<span class=\'dot\'></span>' +
        '<span class=\'dot\'></span>' +
        '<span class=\'dot\'></span>' +
        '<span class=\'dot\'></span>' +
        '<span class=\'dot\'></span>' +
        '<span class=\'dot\'></span>' +
        '<span class=\'dot\'></span>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '<div class="col-md-12 col-sm-12 col-xs-12" id="toRepertoryClickResult' + nodeId + 'Panel">' +
        '<table id="repertory-click-panel-table' + nodeId + '" class="table table-striped"' +
        '     data-toggle="table"' +
        '     data-show-export="false"' +
        '     data-pagination="true"' +
        '     data-click-to-select="true">' +
        '</table>' +
        '</div>' +
        '</div>';
    return html;
};

var toDrawForTablePartHeader = function(tableName, fieldNum, lastUpdateTime) {
    var html = '' +
        '<div class="row" style="color:#000;font-weight:BOLD;">' +
        '<div class="col-md-4"><span> '+ tableName + ' </span></div>' +
        '<div class="col-md-4">共: <span>' + fieldNum + '</span>　个字段</div>' +
        '</div>';
    $("#header-title").html('');
    $("#header-title").append(html);
};

function _alert(text,subtext) {
    zeroModal.alert({
        content: text,
        contentDetail: subtext,
        okFn: function() {

        }
    });
}


var getFourPositionNum = function() {
    var num = "";
    for(var i=0; i<4; i++){
        num += Math.floor(Math.random() * 10);
    }
    return num;
};

function _success(text) {
    zeroModal.success(text);
}

function _error(text) {
    zeroModal.error(text);
}