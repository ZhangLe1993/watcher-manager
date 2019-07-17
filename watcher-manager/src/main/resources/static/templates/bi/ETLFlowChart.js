Template.ETLFlowChart.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#BITab').addClass('active');
    $('#ETLFlowChart').addClass('active');
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

    initMdmsSearchPanel();

    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }
    $('.sidebar-toggle').click();

    $("#synchronous-click").click(function(){
        drawDataBaseSelect();
    });
    //一个低门槛的演示,更多需求看源码
    //基于bootstrap tab的自定义多标签的jquery实用插件，滚动条依赖jquery.scrollbar，图标依赖font-awesom

    requestURL(dataService+"/mdms/getZTreeData", {}).done(function (data) {
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
        /*var zNodes = [
            { id:1, pId:0, name:"warehouse", isParent:true, open:true,icon:"/assets/zTree_v3/css/metroStyle/img/database.png"},
            /!*{ id:11, pId:1, name:"Tables", isParent:true,open:true,click:false},*!/
            { id:111, pId:1, name:"table_a",icon:"/assets/zTree_v3/css/metroStyle/img/table.png", /!*isParent:true,*!/open:true},
            /!*{ id:112, pId:111, name:"Columns",icon:"/assets/zTree_v3/css/metroStyle/img/columns.png", isParent:true,open:true,click:false},
            { id:113, pId:112, name:"ID",icon:"/assets/zTree_v3/css/metroStyle/img/property.png"},
            { id:114, pId:112, name:"Name",icon:"/assets/zTree_v3/css/metroStyle/img/property.png"},*!/

            { id:115, pId:1, name:"table_b",icon:"/assets/zTree_v3/css/metroStyle/img/table.png", /!*isParent:true,*!/open:true},
            /!*{ id:116, pId:115, name:"Columns",icon:"/assets/zTree_v3/css/metroStyle/img/columns.png", isParent:true,open:true,click:false},
            { id:117, pId:116, name:"Id",icon:"/assets/zTree_v3/css/metroStyle/img/property.png"},
            { id:118, pId:116, name:"Name",icon:"/assets/zTree_v3/css/metroStyle/img/property.png"},*!/

            /!*{ id:12, pId:1, name:"Views", isParent:true},
            { id:13, pId:1, name:"Functions", isParent:true},
            { id:14, pId:1, name:"Stored Procedures", isParent:true},*!/
            { id:2, pId:0, name:"operation"},
            { id:21, pId:2, name:"", open:true},
            { id:211, pId:21, name:"叶子节点211"},
            { id:212, pId:21, name:"叶子节点212"},
            { id:213, pId:21, name:"叶子节点213"},
            { id:214, pId:21, name:"叶子节点214"},
            { id:22, pId:2, name:"父节点22"},
            { id:221, pId:22, name:"叶子节点221"},
            { id:222, pId:22, name:"叶子节点222"},
            { id:223, pId:22, name:"叶子节点223"},
            { id:224, pId:22, name:"叶子节点224"},
            { id:23, pId:2, name:"父节点23"},
            { id:231, pId:23, name:"叶子节点231"},
            { id:232, pId:23, name:"叶子节点232"},
            { id:233, pId:23, name:"叶子节点233"},
            { id:234, pId:23, name:"叶子节点234"},
            { id:3, pId:0, name:"DM", isParent:true}
        ];*/
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
                zNodes.push({ id:i, pId:0, oId:f.id,name:f.alias_name+'['+f.name+']', isParent:true, open:true,icon:"/assets/zTree_v3/css/metroStyle/img/mysql.png",click:false});
            }else{
                zNodes.push({ id:i, pId:0, oId:f.id,name:f.alias_name+'['+f.name+']', isParent:true, open:false,icon:"/assets/zTree_v3/css/metroStyle/img/mysql.png",click:false});
            }
            _.each(second,function(s){
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
                            zNodes.push({ id:k, pId:j, oId:t.id,name:t.name, isParent:false, open:false,icon:"/assets/zTree_v3/css/metroStyle/img/table.png"});
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

    // userId = getUserName();
    // userName = getUserName();

    userName = getUserName();
    //js-mind
    /*$("#jsmind_container").css("height", '800px');
    var mind = {
        "meta":{
            "name":"ETL-job关系导向图",
            "author":"yule.zhang"
        },
        "format":"node_array"
    };

    var dataArr = new Array();
    dataArr.push({"id":'job-0', "isroot":true, "topic":'根节点', "background-color":'#1abc9c'});


    dataArr.push({"id":'job-left-1', "direction":"left","parentid":'job-0', "topic":'右边第一个', "background-color":'#1abc9c'});

    dataArr.push({"id":'job-left-2-1', "direction":"left","parentid":'job-left-1', "topic":'右边第二层第一个', "background-color":'#1abc9c'});

    dataArr.push({"id":'job-left-2-2', "direction":"left","parentid":'job-left-1', "topic":'右边第二层第二个', "background-color":'#1abc9c'});


    dataArr.push({"id":'job-left-2', "direction":"left","parentid":'job-0', "topic":'右边第二个', "background-color":'#1abc9c'});

    dataArr.push({"id":'job-left-3', "direction":"left","parentid":'job-0', "topic":'右边第三个', "background-color":'#1abc9c'});


    dataArr.push({"id":'job-1-1', "parentid":'job-0', "topic":'第二层第一个', "background-color":'#1abc9c'});

    dataArr.push({"id":'job-1-2', "parentid":'job-0', "topic":'第二层第二个', "background-color":'#1abc9c'});

    dataArr.push({"id":'job-1-3', "parentid":'job-0', "topic":'第二层第三个', "background-color":'#1abc9c'});


    dataArr.push({"id":'job-2-1', "parentid":'job-1-1', "topic":'第三层第一个', "background-color":'#1abc9c',"expanded":false});

    dataArr.push({"id":'job-2-2', "parentid":'job-1-2', "topic":'第三层第二个', "background-color":'#1abc9c',"expanded":false});

    dataArr.push({"id":'job-3-1', "parentid":'job-1-1', "topic":'第三层第二个', "background-color":'#1abc9c',"expanded":false});

    mind.data = dataArr;
    var options = {                   // options 将在下一章中详细介绍
        container:'jsmind_container', // [必选] 容器的ID，或者为容器的对象
        ///editable:true,                // [可选] 是否启用编辑
        theme:'primary'                // [可选] 主题
    };
    var jm = new jsMind(options);
    jm.show(mind);

    //var jm = jsMind.current;

    //jm.get_root()   获取根节点
    //jm.add_node(parent_node, nodeid, topic, data);//添加节点
    /!*jm.enable_edit();
    jm.add_node('job-left-2-1', 'job-left-3-1', '右边第三层第一个', {"background-color":'#1abc9c',"expanded":false});
    jm.disable_edit();*!/

    jm.enable_edit();
    jm.add_node('job-left-2-1', 'job-left-3-1', '右边第三层第一个', {"background-color":'#1abc9c',"expanded":false});
    jm.disable_edit();*/

    //jm.select_node('job-left-2-1');

    /*$("jmnode").bind('click',function(e){
        var temp = $(this).attr("nodeid");
        if(temp == null || temp == undefined) {
            console.log('node不存在');
            return;
        }
        var node = jm.get_node(temp);
        queryNode();
    });*/

    /*$("#context-menu").contextMenu({
        width: 110, // width
        itemHeight: 30, // 菜单项height
        bgColor: "#333", // 背景颜色
        color: "#fff", // 字体颜色
        fontSize: 12, // 字体大小
        hoverBgColor: "#99CC66", // hover背景颜色
        target: function(ele) { // 当前元素
            //console.log(ele);
        },
        menu: [
                { // 菜单项
                    text: "新增",
                    icon: "/assets/context-menu/img/add.png",
                    callback: function() {
                        alert("新增");
                    }
                },
                {
                    text: "复制",
                    icon: "/assets/context-menu/img/copy.png",
                    callback: function() {
                        alert("复制");
                    }
                },
                {
                    text: "粘贴",
                    icon: "/assets/context-menu/img/paste.png",
                    callback: function() {
                        alert("粘贴");
                    }
                },
                {
                    text: "删除",
                    icon: "/assets/context-menu/img/del.png",
                    callback: function() {
                        alert("删除");
                    }
                }
        ]
    });*/
    /*$("jmnode").contextMenu({
        width: 110, // width
        itemHeight: 30, // 菜单项height
        bgColor: "#333", // 背景颜色
        color: "#fff", // 字体颜色
        fontSize: 12, // 字体大小
        hoverBgColor: "#99CC66", // hover背景颜色
        target: function(ele) { // 当前元素
            //console.log(ele);
        },
        menu: [
            { // 菜单项
                text: "添加",
                icon: "/assets/context-menu/img/add.png",
                callback: function() {
                    addNode();
                }
            },
            {
                text: "编辑",
                icon: "/assets/context-menu/img/copy.png",
                callback: function() {
                    editNode();
                }
            },
            {
                text: "删除",
                icon: "/assets/context-menu/img/del.png",
                callback: function() {
                    delNode();
                }
            },
            {
                text: "详细",
                icon: "/assets/context-menu/img/paste.png",
                callback: function() {
                    queryNode();
                }
            }
        ]
    });*/
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
        drawTableTable(treeNode.id,treeNode.oId,treeNode.name);
    }
    memoryTreeNode = treeNode;
};


/**
 * 提取出来-- 后期做重新绘制使用
 * @param treeNode
 */
var rendTableFieldHtml = function(treeNode){
    var html = getDrawForTableHtml(treeNode.id);
    $("#home-db-or-table").html('');
    $("#home-db-or-table").append(html);
    showPanelOrLoading([treeNode.id + 'tableTables'],true);
    showPanelOrLoading([treeNode.id+'tableTables'],false);
    drawTableTable(treeNode.id,treeNode.oId,treeNode.name);
};

function drawDataBaseTable(nodeId,param,value){
    requestURL(dataService+"/mdms/getSurfaceFloorData", {parentId:param}).done(function (tables) {
        if (tables.statusText != undefined && tables.statusText == 'error') {

        } else {
            //面板位置显示title
            toDrawHtmlPartHeader(value,tables.length);
            showPanelOrLoading(['toRepertoryClickResult'+nodeId],false);
            /*$("#r"+nodeId).html(value);
            $("#s"+nodeId).html(tables.length);*/
            $("#repertory-click-panel-table"+nodeId).bootstrapTable('destroy').bootstrapTable({
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
                            return index+1;
                        }
                    },
                    {
                        field:'s_name',
                        title:'表名'
                    },
                    {
                        field:'s_chinese_name',
                        title:'表中文名'
                    },
                    {
                        field:'s_descrtiption',
                        title:'表说明'
                    },
                    {
                        field:'s_responsible_name',
                        title:'责任人'
                    },
                    {
                        field:'s_last_update_time',
                        title:'最新修改时间'
                    }/*,
                    {
                        field:'s_last_update_person_name',
                        title:'最新修改人'
                    },
                    {
                        field:'s_last_update_time',
                        title:'最新修改时间'
                    }*/,
                    {
                        field:'operate',
                        title:'操作',
                        width:'70px',
                        events:'operateEvents',
                        formatter: function (value, row, index){
                            var temp = '';
                            var edit = '';
                            var receive = '';
                            if(row.s_responsible_name == userName){
                                temp = '<a data-row="'+JSON.stringify(row).replace(/"/g, '&quot;')+'" operation="show-detail" style="cursor:pointer;height:25px;" class="btn" href="javascript:void(0)"><img src="/assets/icon/mdms-preview.png" width="25px" height="25px"/></a>';
                                edit = '<a table-index="'+ index +'" data-row="'+JSON.stringify(row).replace(/"/g, '&quot;')+'" operation="edit" style="cursor:pointer;height:25px;" class="btn" href="javascript:void(0)"><img src="/assets/icon/mdms-edit.png" width="25px" height="25px"/></a>';
                            }else{
                                temp = '<a data-row="'+JSON.stringify(row).replace(/"/g, '&quot;')+'" operation="show-detail" style="cursor:pointer;height:25px;" class="btn" href="javascript:void(0)"><img src="/assets/icon/mdms-preview.png" width="25px" height="25px"/></a>';
                                receive = '<a data-row="'+JSON.stringify(row).replace(/"/g, '&quot;')+'" operation="receive" style="cursor:pointer;height:25px;" class="btn" href="javascript:void(0)"><img src="/assets/icon/mdms-hand.png" width="25px" height="25px"/></a>';
                            }
                            return [temp].join('');
                        }
                    }
                ]
            });

            $("#toRepertoryClickResult"+ nodeId +"Panel").delegate("a[operation='show-detail']",'click', function (e) {
                    e.stopPropagation();
                    var str = $(this).attr("data-row");
                    var obj = JSON.parse(str);
                    console.log(obj);
                    requestURL(dataService+'/mdms/getTableFieldNum',{parentId:obj.s_id}).done(function(res){
                        if(res.statusText != undefined && res.statusText == 'error'){
                            _error('服务异常');
                        }else{
                            var queryHtml = ''+
                                '<div class="row" style="margin:0 auto;width:98%;">' +
                                '<p>' +
                                '<label>　　　　表名:</label>' +
                                '<span style="margin-left:20px;">'+obj.s_name+'</span>' +
                                '</p>' +
                                '<p>' +
                                '<label>　　中文名称:</label>' +
                                '<input type="text" name="tableChineseName" value="'+obj.s_chinese_name+'" style="width:350px;margin-left:20px;"/>' +
                                '</p>' +
                                '<p>' +
                                '<label>　　　责任人:</label>' +
                                '<span style="margin-left:20px;">'+obj.s_responsible_name+'</span>' +
                                '</p>' +
                                '<p>' +
                                '<label style="position:relative;top:-135px;">　　　表说明:</label>' +
                                '<textarea style="width:350px;height:150px;margin-left:20px" name="description">'+obj.s_descrtiption+'</textarea>' +
                                '</p>' +
                                '<p>' +
                                '<label>　　　表字段:</label>' +
                                '<span style="margin-left:20px;">共计: '+res+' 个字段</span>' +
                                '</p>' +
                                '<p>' +
                                '<label>　最新修改人:</label>' +
                                '<span style="margin-left:20px;">'+obj.s_last_update_person_name+'</span>' +
                                '</p>' +
                                '<p>' +
                                '<label>最新修改时间:</label>' +
                                '<span style="margin-left:20px;">'+obj.s_last_update_time+'</span>' +
                                '</p>' +
                                '<p>' +
                                '<label>　　血缘关系:</label>' +
                                '<div id="jsmind_container'+nodeId+'"></div>' +
                                '</p>' +
                                '</div>';
                            openWin(
                                {
                                    title: '详细',
                                    content: queryHtml,
                                    width: '500px',
                                    height: '800px',
                                    max: true,
                                    min: true,
                                    ok: false,
                                    cancel: false
                                }
                            );
                            drawBloodRelationship(nodeId,obj);
                        }
                    });
            });

            $("#toRepertoryClickResult"+ nodeId +"Panel").delegate("a[operation='edit']",'click', function (e) {
                    e.stopPropagation();
                    var index = $(this).attr("table-index");
                    console.log($(this).attr("data-row"));
                    var str = $(this).attr("data-row");
                    var obj = JSON.parse(str);
                    var isEffect = '<input style="margin-left:20px;" type="radio" value="0" name="state" checked="checked"/>&nbsp;<span style="font-size:15px;font-weight:BOLD;margin-top:-2px;">有效 &nbsp;</span>&nbsp;&nbsp;' +
                        '<input style="margin-left:20px;" type="radio" value="1" name="state"/>&nbsp;<span style="font-size:15px;font-weight:BOLD;margin-top:-2px;">废弃&nbsp;</span>&nbsp;&nbsp;';
                    if(obj.s_state == '1'){
                        isEffect = '<input style="margin-left:20px;" type="radio" value="0" name="state"/>&nbsp;<span style="font-size:15px;font-weight:BOLD;margin-top:-2px;">有效 &nbsp;</span>&nbsp;&nbsp;' +
                            '<input style="margin-left:20px;" type="radio" value="1" name="state" checked="checked"/>&nbsp;<span style="font-size:15px;font-weight:BOLD;margin-top:-2px;">废弃&nbsp;</span>&nbsp;&nbsp;';
                    }
                    var editHtml = '<form id="table_edit_form_' + nodeId + '">'+
                        '<div class="row" style="margin:0 auto;width:98%;">' +
                        '<p>' +
                        '<label>　　　　表名:</label>' +
                        '<span style="margin-left:20px;">'+obj.s_name+'</span>' +
                        '</p>' +
                        '<p>' +
                        '<label>　　中文名称:</label>' +
                        '<input type="text" name="tableChineseName" value="'+obj.s_chinese_name+'" style="width:350px;margin-left:20px;"/>' +
                        '</p>' +
                        '<p>' +
                        '<label>　　是否有效:</label>' +
                            isEffect +
                        '</p>' +
                        '<p>' +
                        '<label style="position:relative;top:-135px;">　　　表说明:</label>' +
                        '<textarea style="width:350px;height:150px;margin-left:20px" name="description">'+obj.s_descrtiption+'</textarea>' +
                        '</p>' +
                        '</div>' +
                        '<div class="row" style="margin:0 auto;width:90%;">' +
                        '<div class="col-md-3" style="margin-left:60px;">' +
                        '<input type="button" name="button" class="search-button" id="table-save-btn'+nodeId+'" value="保存" style="cursor:pointer;"/>' +
                        '</div>' +
                        '<div class="col-md-3" style="margin-left:98px;">' +
                        '<input type="button" name="button" class="search-button" id="table-cancel-btn'+nodeId+'" value="取消" style="cursor:pointer;"/>' +
                        '</div>' +
                        '</div>' +
                        '</form>';
                    openWin(
                        {
                            title: '编辑',
                            content: editHtml,
                            width: '500px',
                            height: '400px',
                            max: true,
                            min: true,
                            ok: false,
                            cancel: false
                        }
                    );
                    $("#table-save-btn"+nodeId).click(function(){
                        console.log("保存");
                        var tableId = obj.s_id;
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
                        });
                    });

                    $("#table-cancel-btn"+nodeId).click(function(){
                        console.log("取消");
                        parent.zeroModal.closeAll();
                    });
            });

            /*$("a[operation='show-detail']").contextMenu({
                width: 110, // width
                itemHeight: 30, // 菜单项height
                bgColor: "#333", // 背景颜色
                color: "#fff", // 字体颜色
                fontSize: 12, // 字体大小
                hoverBgColor: "#99CC66", // hover背景颜色
                target: function(ele) { // 当前元素

                },
                menu: [
                    { // 菜单项
                        text: "添加",
                        icon: "/assets/context-menu/img/add.png",
                        callback: function() {
                            addNode();
                        }
                    },
                    {
                        text: "编辑",
                        icon: "/assets/context-menu/img/copy.png",
                        callback: function() {
                            editNode();
                        }
                    },
                    {
                        text: "删除",
                        icon: "/assets/context-menu/img/del.png",
                        callback: function() {
                            delNode();
                        }
                    },
                    {
                        text: "详细",
                        icon: "/assets/context-menu/img/paste.png",
                        callback: function() {
                            queryNode();
                        }
                    }
                ]
            });*/
        }
    });
};

function drawTableTable(nodeId,param,value){
    requestURL(dataService+"/mdms/getFieldFloorData", {parentId:param}).done(function (fields) {
        if (fields.statusText != undefined && fields.statusText == 'error') {

        } else {
            toDrawForTablePartHeader(value,fields.length,"");
            showPanelOrLoading(['toRepertoryClickResult'+nodeId],false);
            /*$("#r"+nodeId).html(value);
            $("#s"+nodeId).html(fields.length);*/
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
                        field:'f_name',
                        title:'字段名',
                        sortable:true
                    },
                    {
                        field:'f_type',
                        title:'字段类型',
                        sortable:true
                    },
                    {
                        field:'f_is_primary_key',
                        title:'是否为主键',
                        sortable:true,
                        formatter: function (value, row, index){
                            var res = '否';
                            if(value == '1'){
                                res = '是';
                            }
                            return res;
                        }
                    },
                    {
                        field:'f_has_index',
                        title:'是否有索引',
                        sortable:true,
                        formatter: function (value, row, index){
                            var res = '否';
                            if(value == '1'){
                                res = '是';
                            }
                            return res;
                        }
                    },
                    {
                        field:'f_chinese_name',
                        title:'字段中文名',
                        sortable:true
                    },
                    {
                        field:'f_descrtiption',
                        title:'字段逻辑说明',
                        sortable:true
                    },
                    {
                        field:'operate',
                        title:'操作',
                        width:'70px',
                        events:'operateEvents',
                        formatter: function (value, row, index){
                            var temp = '<a data-row="'+JSON.stringify(row).replace(/"/g, '&quot;')+'" operation="show-detail" style="cursor:pointer;height:25px;" class="btn" href="javascript:void(0)"><img src="/assets/icon/mdms-preview.png" width="25px" height="25px"/></a>';
                            var edit = '<a field-index="'+index+'" data-row="'+JSON.stringify(row).replace(/"/g, '&quot;')+'" operation="edit" style="cursor:pointer;height:25px;" class="btn" href="javascript:void(0)"><img src="/assets/icon/mdms-edit.png" width="25px" height="25px"/></a>';
                            return [temp].join('');
                        }
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

var queryNode = function(){
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

var addNodeToChart = function(){
    jm.enable_edit();
    jm.add_node('job-left-2-1', 'job-left-3-1', '右边第三层第一个', {"background-color":'#1abc9c',"expanded":false});
    jm.disable_edit();
};

var addHoverDom = function(treeId, treeNode) {
    var sObj = $("#" + treeNode.tId + "_span");
    if (treeNode.editNameFlag || $("#addBtn_"+treeNode.tId).length>0) return;
    var addStr = "<span class='button add' id='addBtn_" + treeNode.tId
        + "' title='add node' onfocus='this.blur();'></span>";
    sObj.after(addStr);
    var btn = $("#addBtn_"+treeNode.tId);
    if (btn) btn.bind("click", function(){
        var zTree = $.fn.zTree.getZTreeObj("treeDemo");
        zTree.addNodes(treeNode, {id:(100 + newCount), pId:treeNode.id, name:"new node" + (newCount++)});
        return false;
    });
};

var removeHoverDom = function(treeId, treeNode) {
    $("#addBtn_"+treeNode.tId).unbind().remove();
};

var showPanelOrLoading = function(selector_perv,on){
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
    /*
    * '                    <div class="col-md-12 col-sm-12 col-xs-12">' +
        '                        <div class="box box-default">' +
        '                            <div class="box-header with-border" style="background:rgb(28,30,31);">' +
        '                                <div class="pull-left" style="color:#fff;">' +
        '                                    <span id="r'+nodeId+'">...</span>' +
        '                                </div>' +
        '                                <div class="pull-right" style="color:#fff;">' +
        '                                    共:<span id="s'+nodeId+'">...</span>　张表' +
        '                                </div>' +
        '                            </div>' +
        '                            <div class="box-body">' +
        '                                <div class="row">' +

        '                                </div>' +
        '                            </div>' +
        '                        </div>' +
        '                    </div>' +*/
    var html = '' +
        '<div id="repertory-click-panel" class="row" style="margin:0 auto;width:98%;margin-top:10px;">' +
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

var getDrawForTableHtml = function(nodeId){
    /*<div class="col-md-3"><img src="/assets/icon/person-liable.png"><span id="z'+nodeId+'">叶莹</span></div>' +*/
    /*'                    <div class="col-md-12 col-sm-12 col-xs-12">' +
        '                        <div class="box box-default">' +
        '                            <div class="box-header with-border" style="background:rgb(28,30,31);">' +
        '                               <div class="row" style="color:#fff;">' +
        '                                   <div class="col-md-4"><span id="r'+nodeId+'"></span></div>' +
        '                                   <div class="col-md-4">共: <span id="s'+nodeId+'">0</span>　个字段</div>' +
        '                                   <div class="col-md-4">最近一次更新时间: <span id="t'+nodeId+'">2018-10-29 14:47</span> </div>' +
        '                               </div>'+
        '                            </div>' +
        '                            <div class="box-body">' +
        '                                <div class="row">' +

        '                                </div>' +
        '                            </div>' +
        '                        </div>' +
        '                    </div>' +*/
    var html = '' +
        '<div id="repertory-click-panel" class="row" style="margin:0 auto;width:98%;margin-top:10px;">' +
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
        '<table id="repertory-click-panel-table'+nodeId+'" class="table table-striped"' +
        '     data-toggle="table"' +
        '     data-show-export="false"' +
        '     data-pagination="true"' +
        '     data-click-to-select="true">' +
        '</table>' +
        '</div>' +
        '</div>';
    return html;
};

var toDrawForTablePartHeader = function(tableName,fieldNum,lastUpdateTime){
    var html = '' +
        '<div class="row" style="color:#000;font-weight:BOLD;">' +
        '<div class="col-md-4"><span> '+ tableName + ' </span></div>' +
        '<div class="col-md-4">共: <span>' + fieldNum + '</span>　个字段</div>' +
        '<div class="col-md-4">最近一次更新时间: <span>' + lastUpdateTime + '</span> </div>' +
        '</div>';
    $("#header-title").html('');
    $("#header-title").append(html);
};

/**
 * 元数据同步模块
 */
var drawDataBaseSelect = function(){
    $("#search-result-panel").hide();
    $("#synchrinized-example-select").html('');
    $("#synchrinized-example-select").append('<option value="-1"> 请选择实例</option>');

    $("#synchrinized-select").html('');
    $("#synchrinized-select").append('<option value="-1"> 请选择数据库</option>');

    requestURL(dataService+"/mdms/getZTreeFirstFloorData", {}).done(function (data) {
        console.log(data);
        _.each(data,function(ele){
            $("#synchrinized-example-select").append('<option value="'+ele.e_id+'">'+ele.e_name +'【'+ele.e_alias_name+'】'+'</option>');
        });

    });

    $("#synchrinized-example-select").change(function(){
        console.log("切换实例");
        var parentId = $(this).val();
        console.log(parentId);
        if(parentId == "-1"){
            $("#synchrinized-select").html('');
            $("#synchrinized-select").append('<option value="-1"> 请选择数据库</option>');
        }else{
            requestURL(dataService+"/mdms/getZTreeSecondFloorData", {nodeId:parentId}).done(function (data) {
                console.log(data);
                $("#synchrinized-select").html('');
                _.each(data,function(ele){
                    $("#synchrinized-select").append('<option value="'+ele.r_id+'">'+ele.r_name+'</option>');
                });
            });
        }
    });

    $("#synchrinized-search-button").click(function(){
        var e_id = $("#synchrinized-example-select").val();
        var r_id = $("#synchrinized-select").val();
        var r_name = $("#synchrinized-select").find("option:selected").text();
        console.log(e_id  + " " +r_id + " " + r_name);
        if(r_id == '-1'){
            _alert('提示','请选择数据库');
        }else{
            $("#search-result-panel").show();
            showPanelOrLoading(['toResultChart'],true);
        }
        /*requestURL(dataService+"/mdms/getSurfaceFloorData", {nodeId:search}).done(function (data) {
            if(data.statusText != undefined && data.statusText=='error'){

            }else{
                console.log(data);
                showPanelOrLoading(['toResultChart'],false);
                $("#result_detail_table").bootstrapTable('destroy').bootstrapTable({
                    data: data,
                    pagination: true,
                    striped: true,
                    pageSize: 5,
                    search: true,
                    pageList: [5, 10, 20, 50, 100, 200],
                    columns:[
                        {
                            field:'s_id',
                            title:'表ID',
                            sortable:true
                        },
                        {
                            field:'s_name',
                            title:'表名',
                            sortable:true

                        },
                        {
                            field:'s_state',
                            title:'状态',
                            sortable:true,
                            formatter:function(value,row,index){
                                //0 正常状态    1: 实例中已经删除    2 :模拟物理删除（系统中不可见）

                            }
                        },
                        {
                            field:'operate',
                            title:'操作',
                            formatter: operateFormatter, //自定义方法，添加操作按钮
                            events:operateEvents
                        }
                    ]
                });
            }
        });*/

    });
};


var initMdmsSearchPanel = function(){
    $("#mdms-search-res-panel").hide();

    $("#search-panel-search-input").bind("keypress",function(event){
        if (event.keyCode == "13"){
            console.log("回车搜索");
            searchClickOrKeyPress();
            return false;
        }
    });

    $("#search-panel-search-btn").click(function(){
        searchClickOrKeyPress();
    });
};

var getSearchResultHtml = function(randomNum){
    var searchResultHtml =
        '<div class="col-md-12 col-sm-12 col-xs-12">' +
        '<div class="box box-default">' +
        '<div class="box-header with-border" style="background:rgba(22,155,213,1);">' +
        '<div class="pull-right" style="color:#fff;">' +
        '总数:<span id="search-panel-search-result-all-num">...</span>' +
        '</div>' +
        '</div>' +
        '<div class="box-body">' +
        '<div class="row">' +
        '<div class="col-md-12 col-sm-12 col-xs-12 loading" id="toSearchResult'+randomNum+'Loading">' +
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
        '<div class="col-md-12 col-sm-12 col-xs-12" id="toSearchResult'+randomNum+'Panel">' +
        '<table id="search-panel-search-result-table'+randomNum+'" class="table table-striped"' +
        'data-toggle="table"' +
        'data-show-export="true"' +
        'data-pagination="true"' +
        'data-click-to-select="true">' +
        '</table>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>' +
        '</div>';
    return searchResultHtml;
};

var searchClickOrKeyPress = function(){
    var randomNum = getFourPositionNum();
    var searchResultHtml = getSearchResultHtml(randomNum);
    var search_type = $("#search-panel-search-select").val();
    var search_value = $("#search-panel-search-input").val();
    if(search_value == undefined || search_value == '' || search_value.toString().length == 0){
        _alert('提示！','关键字不能为空！');
        return;
    }
    $("#mdms-search-res-panel").html('');
    $("#mdms-search-res-panel").show();
    $("#mdms-search-res-panel").append(searchResultHtml);
    showPanelOrLoading(['toSearchResult'+randomNum],true);
    requestURL(dataService+"/mdms/getSearchResultByKeyWordAndType", {keyword:search_value,sType:search_type}).done(function (data) {
        if(data.statusText != undefined && data.statusText=='error'){

        }else{
            console.log(data);
            showPanelOrLoading(['toSearchResult'+randomNum],false);
            $("#search-panel-search-result-table"+randomNum).bootstrapTable('destroy').bootstrapTable({
                data: data,
                pagination: true,
                striped: true,
                pageSize: 5,
                search: true,
                pageList: [5, 10, 20, 50, 100, 200],
                columns:[
                    {
                        field:'r_name',
                        title:'库名',
                        formatter:function(value,row,index){
                            return '<span search-param="' + row.r_id + '" style="cursor:pointer;" operation="r_name_query">'+ value +'</span>';
                        }
                    },
                    {
                        field:'s_name',
                        title:'表名',
                        formatter:function(value,row,index){
                            return '<span search-param="'+row.s_id+'" style="cursor:pointer;" operation="s_name_query">'+ value +'</span>';
                        }
                    },
                    {
                        field:'s_chinese_name',
                        title:'表中文名'
                    },
                    {
                        field:'s_descrtiption',
                        title:'表说明'
                    },
                    {
                        field:'s_responsible_name',
                        title:'责任人'
                    }
                ],
                onPageChange:function(number, size){
                    $('#search-panel-search-result-table'+randomNum).GL({
                        ocolor:'red',   //设置关键词高亮颜色
                        oshuru:search_value   //设置要显示的关键词
                    });
                }
            });

            $("#search-panel-search-result-all-num").html(data.length);
            $('#search-panel-search-result-table'+randomNum).GL({
                ocolor:'red',   //设置关键词高亮颜色
                oshuru:search_value   //设置要显示的关键词
            });

            $("#toSearchResult"+randomNum+"Panel").delegate("span[operation='r_name_query']",
                'click', function (e) {
                    e.stopPropagation();
                    //console.log($(this).attr("search-param"));
                    var param = $(this).attr("search-param");
                    var value = $(this).text();

                    $("#msa").attr("class","");
                    $("#mgh").attr("class","active");

                    $("#mdms-search").attr("class","tab-pane");
                    $("#home").attr("class","tab-pane active");

                    var zTree = $.fn.zTree.getZTreeObj("treeDemo");//treeDemo界面中加载ztree的div
                    var node = zTree.getNodeByParam("name",value);
                    zTree.cancelSelectedNode();//先取消所有的选中状态
                    zTree.selectNode(node,true);//将指定ID的节点选中
                    zTree.expandNode(node, true, false);//将指定ID节点展开

                    var nextRandomNum = getFourPositionNum();
                    var html = getDrawHtml(nextRandomNum);
                    $("#home-db-or-table").html('');
                    $("#home-db-or-table").append(html);
                    showPanelOrLoading(['toRepertoryClickResult'+nextRandomNum],true);

                    drawDataBaseTable(nextRandomNum,param,value);
                });

            $("#toSearchResult"+randomNum+"Panel").delegate("span[operation='s_name_query']",
                'click', function (e) {
                    e.stopPropagation();
                    var param = $(this).attr("search-param");
                    var value = $(this).text();
                    $("#msa").attr("class","");
                    $("#mgh").attr("class","active");
                    $("#mdms-search").attr("class","tab-pane");
                    $("#home").attr("class","tab-pane active");
                    var zTree = $.fn.zTree.getZTreeObj("treeDemo");//treeDemo界面中加载ztree的div
                    var node = zTree.getNodeByParam("name",value);
                    zTree.cancelSelectedNode();//先取消所有的选中状态
                    zTree.selectNode(node,true);//将指定ID的节点选中
                    zTree.expandNode(node, true, false);//将指定ID节点展开

                    var nextRandomNum = getFourPositionNum();
                    var html = getDrawForTableHtml(nextRandomNum);
                    $("#home-db-or-table").html('');
                    $("#home-db-or-table").append(html);
                    showPanelOrLoading(['toRepertoryClickResult'+nextRandomNum],true);
                    drawTableTable(nextRandomNum,param,value);
                });
        }
    });
};

var drawMdmsSearchPanel = function(){
    $("#mdms-search-res-panel").show();
    showPanelOrLoading(['toSearchResult'],true);

};

function _alert(text,subtext) {
    zeroModal.alert({
        content: text,
        contentDetail: subtext,
        okFn: function() {

        }
    });
}


var getFourPositionNum = function(){
    var num = "";
    for(var i=0; i<4; i++){
        num += Math.floor(Math.random()*10);
    }
    return num;
};


var drawBloodRelationship = function(nodeId,row){
    requestURL(dataService + "/mdms/getBloodRelationship",{tableName:row.s_name}).done(function(data){
        console.log(data);

        if (data.statusText != undefined && data.statusText == 'error') {

        } else {
            $("#jsmind_container"+nodeId).css("height", '500px');
            var mind = {
                "meta":{
                    "name":"ETL-job关系导向图",
                    "author":"yule.zhang"
                },
                "format":"node_array"
            };
            var dataArr = new Array();
            if(data.length > 0){
                _.each(data,function(ele){
                    if(ele.pId == "-1"){
                        dataArr.push({"id":ele.id, "isroot":true, "topic":ele.name, "background-color":'#f1c40f'});
                    }else{
                        dataArr.push({"id":ele.id, "parentid":ele.pId, "topic":ele.name, "background-color":'#1abc9c',"expanded":false});
                    }
                });

                console.log(dataArr);
                mind.data = dataArr;
                var options = {                   // options 将在下一章中详细介绍
                    container:'jsmind_container'+nodeId, // [必选] 容器的ID，或者为容器的对象
                    ///editable:true,                // [可选] 是否启用编辑
                    theme:'ourself',               // [可选] 主题
                    mode:'full'
                };
                var jm = new jsMind(options);
                jm.show(mind);
            }

            /*dataArr.push({"id":'job-left-1', "direction":"left","parentid":'job-0', "topic":'右边第一个', "background-color":'#1abc9c'});

            dataArr.push({"id":'job-left-2-1', "direction":"left","parentid":'job-left-1', "topic":'右边第二层第一个', "background-color":'#1abc9c'});

            dataArr.push({"id":'job-left-2-2', "direction":"left","parentid":'job-left-1', "topic":'右边第二层第二个', "background-color":'#1abc9c'});


            dataArr.push({"id":'job-left-2', "direction":"left","parentid":'job-0', "topic":'右边第二个', "background-color":'#1abc9c'});

            dataArr.push({"id":'job-left-3', "direction":"left","parentid":'job-0', "topic":'右边第三个', "background-color":'#1abc9c'});


            dataArr.push({"id":'job-1-1', "parentid":'job-0', "topic":'第二层第一个', "background-color":'#1abc9c'});

            dataArr.push({"id":'job-1-2', "parentid":'job-0', "topic":'第二层第二个', "background-color":'#1abc9c'});

            dataArr.push({"id":'job-1-3', "parentid":'job-0', "topic":'第二层第三个', "background-color":'#1abc9c'});


            dataArr.push({"id":'job-2-1', "parentid":'job-1-1', "topic":'第三层第一个', "background-color":'#1abc9c',"expanded":false});

            dataArr.push({"id":'job-2-2', "parentid":'job-1-2', "topic":'第三层第二个', "background-color":'#1abc9c',"expanded":false});

            dataArr.push({"id":'job-3-1', "parentid":'job-1-1', "topic":'第三层第二个', "background-color":'#1abc9c',"expanded":false});*/


        }
    });
};

function _success(text) {
    zeroModal.success(text);
}

function _error(text) {
    zeroModal.error(text);
}