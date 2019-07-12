Template.dataWorkshop.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#BITab').addClass('active');
    $('#dataWorkshop').addClass('active');
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

    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }
    $('.sidebar-toggle').click();
    userId = getUserName();
    userName = getUserName();
    drawDataSubscription();
    drawDataDevelopment();
    drawModelDevelopment();

    $("#extbkboxnar").click(function(){
        extbkboxnar();
    });

    $('a[data-toggle=tab]').on('shown.bs.tab', function (e) {
        var activeTab = $(e.target).text();//'dealTable',
        switch (activeTab) {
            case '数据订阅':
                closeLogDiv();
                break;
            case '入仓开发':
                closeLogDiv();
                break;
            case '建模开发':
                closeLogDiv();
                break;
            case '进程监控':
                closeLogDiv();
                break;
            default:
                break;
        }
    });

    toolTipCustom();
};
var postPositionSQLNum = 1;
var basePath = "http://10.252.106.247:8899";
var scriptDATASERVICEURL_EXAMPLE = basePath + "/script/gp/getDBInstance";
var scriptDATASERVICEURL_DB = basePath + "/script/gp/getDBByInstance";
var scriptDATASERVICEURL_TEST_PRE = basePath + "/script/gp/isExistsJob";
var scriptDATASERVICEURL_TEST = basePath + "/script/gp/validJob";
var scriptDATASERVICEURL_SAVE = basePath + "/script/gp/addJob";
var scriptDATASERVICEURL_QUERY = basePath + "/script/gp/getJobList";
var scriptDATASERVICEURL_GENERATE_SQL = basePath + "/script/gp/getSQL";
var scriptDATASERVICEURL_UPDATE = basePath + "/script/gp/updateJob";
var scriptDATASERVICEURL_LOG = basePath + "/script/gp/getJobLog";
var userId;
var userName;
/*渲染数据开发页面*/
var drawDataDevelopment = function(){
    $("#sdbType").text('MySQL');
    $.get(scriptDATASERVICEURL_EXAMPLE,{sdbType:'mysql'},function(res){
        console.log(res);
        //var parseArr = JSON.parse(res.data);
        var parseArr = res.data;
        $("select[name='sourceExample']").html('<option value="0">请选择实例</option>');
        _.each(parseArr,function (ele) {
            $("select[name='sourceExample']").append('<option value="'+ele+'">'+ele+'</option>');
        });
    },'json');

    $("select[name='sdbType']").change(function(){
        var text = $("select[name='sdbType']").find("option:selected").text();
        var param = $("select[name='sdbType']").val();
        if(param != 'mysql'){
            $("#mysql-unique-title-show").hide();
            $("#mysql-unique-panel-show").hide();
        }else{
            $("#mysql-unique-title-show").show();
            $("#mysql-unique-panel-show").show();
        }
        $("#sdbType").text(text);

        /**
         * 获取数据源实例
         */
        $.get(scriptDATASERVICEURL_EXAMPLE,{sdbType:param},function(res){
            console.log(res);
            var parseArr = res.data;
            $("select[name='sourceExample']").html('<option value="0">请选择实例</option>');
            $("#sourceExample").text('');
            _.each(parseArr,function (ele) {
                $("select[name='sourceExample']").append('<option value="'+ele+'">'+ele+'</option>');
            });
        },'json');
        //重置数据库
        $("select[name='sourceDB']").html('<option value="0">请选择数据库</option>');
        $("#sourceDB").text('');
    });

    $("select[name='sourceExample']").change(function(){
        var param = $("select[name='sourceExample']").val();
        var text = $("select[name='sourceExample']").find("option:selected").text();
        console.log(param);
        $.get(scriptDATASERVICEURL_DB,{rdsId:param},function(res){
            var parseArr = res.data;
            $("select[name='sourceDB']").html('<option value="0">请选择数据库</option>');
            _.each(parseArr,function (ele) {
                $("select[name='sourceDB']").append('<option value="'+ele+'">'+ele+'</option>');
            });
        },'json');
        $("#sourceExample").text(text);
        $("#sourceDB").text('');
    });

    $("select[name='sourceDB']").change(function(){
        var param = $("select[name='sourceDB']").val();
        var text = $("select[name='sourceDB']").find("option:selected").text();
        $("#sourceDB").text(text);
    });


    $("#addPostpositionSQL").click(function(){
        var randomNum = getFourPositionNum();
        $("#postpositionSQLPanel").append(
            '<p>' +
            '<label style="position:relative;top:-115px;">　<span style="color:red;">*</span>后置SQL</label>&nbsp;' +
            '<textarea placeholder="1.sql不能存在双引号，请用单引号表示；2.时间变量昨天请使用:ctx_yesterday表示，注意带上冒号；" class="off" onkeyup="value=value.replace(/^[\u4e00-\u9fa5]+$/,\'\')" name="postpositionSQL" style="width:85%;height:130px;"></textarea>' +
            '&nbsp;<label style="position:relative;top:-55px;"><span class="info-box-icon-myself"><i id="removePostpositionSQL'+randomNum+'" class="fa fa-minus-circle" style="cursor:pointer;"></i></span></label>'+
            '</p>');
        postPositionSQLNum++;

        $("#removePostpositionSQL"+randomNum).click(function(){
            $(this).parent().parent().parent().remove();
            postPositionSQLNum--;
        });
    });

    $("#run").click(function(){
        console.log("测试");
        getFormData('test');
    });


    $("#save").click(function(){
        console.log("保存");
        getFormData('save');
    });

    $("#update_test").click(function(){
        console.log("更新-测试");
        getFormData('update_test');
    });

    $("#update").click(function(){
        console.log("更新");
        getFormData('update');
    });

    $("input[name='autoCreate']").change(function(){
        var value = $("input[name='autoCreate']:checked").val();
        console.log("改变");
        console.log(value);
        if(value == 'yes'){
            getGenerateSQLData();
        }
    });

    $("#data-development").on('keyup','.off',function(){
        var value = $(this).val().trim();
        console.log(value);
        var sc = $("#save").attr("style");
        var uc = $("#update").attr("style");
        console.log("save-style:"+sc);
        console.log("update-style:"+uc);
        if(uc == 'display:none;'){
            $("#save").attr("style","cursor:not-allowed;");
            $("#save").attr("disabled","disabled");
        }else if(sc == 'display:none;'){
            $("#update").attr("style","cursor:not-allowed;");
            $("#update").attr("disabled","disabled");
        }
    });

    $("#data-development").bind('change','.soff',function(){
        var value = $(this).val().trim();
        console.log(value);
        var sc = $("#save").attr("style");
        var uc = $("#update").attr("style");
        console.log("save-style:"+sc);
        console.log("update-style:"+uc);
        if(uc == 'display:none;'){
            $("#save").attr("style","cursor:not-allowed;");
            $("#save").attr("disabled","disabled");
        }else if(sc == 'display:none;'){
            $("#update").attr("style","cursor:not-allowed;");
            $("#update").attr("disabled","disabled");
        }
    });

};

/*渲染数据订阅页面*/
var drawDataSubscription = function(){
    /*Tabs.init({ selector: $("#enableCloseTab"), close: true });
    var obj = $("#all-job-table-panel").html();
    console.log(obj);
    Tabs.addtab({ title: "全部任务", bindcode: -1, content:obj,close:false});

    $("#all-job-table").bootstrapTable('destroy').bootstrapTable({
        data: [],
        pagination: true,
        striped: true,
        pageSize: 15,
        search: true,
        pageList: [5, 10, 15,20, 50, 100, 200],
        exportDataType:'all',
        columns:[
            {
                title:'序号',
                formatter: function (value, row, index) {
                    return index+1;
                }
            },
            {
                field:'task_name',
                title:'任务名称',
                sortable:true

            },
            {
                field:'responsible',
                title:'责任人',
                sortable:true
            },
            {
                field:'desc',
                title:'描述',
                sortable:true
            },
            {
                field:'operate',
                title:'操作',
                width:'120px',
                events:operateEvents,
                formatter: function (value, row, index){
                    var temp = '';
                    var edit = '';
                    var receive = '';
                    temp = '<a data-row="'+JSON.stringify(row).replace(/"/g, '&quot;')+'" operation="show-detail" style="cursor:pointer;height:25px;" class="btn" href="javascript:void(0)"><img src="/assets/icon/mdms-preview.png" width="25px" height="25px"/></a>';
                    edit = '<a table-index="'+ index +'" data-row="'+JSON.stringify(row).replace(/"/g, '&quot;')+'" operation="edit" style="cursor:pointer;height:25px;" class="btn" href="javascript:void(0)"><img src="/assets/icon/mdms-edit.png" width="25px" height="25px"/></a>';
                    //receive = '<a data-row="'+JSON.stringify(row).replace(/"/g, '&quot;')+'" operation="receive" style="cursor:pointer;height:25px;" class="btn" href="javascript:void(0)"><img src="/assets/icon/mdms-hand.png" width="25px" height="25px"/></a>';
                    return [temp,edit].join('');
                }
            }
        ]
    });

    $("#addTaskBtn").click(function(){
        console.log("跳转到添加页面");
        var randomNum = getFourPositionNum();
        Tabs.addtab({ title: "新增任务", bindcode: randomNum, content:obj,close:true});
    });*/
    $.get(scriptDATASERVICEURL_QUERY,{},function(res){
        console.log(res);
        if(res.code == 200){
            $("#all-job-table").bootstrapTable('destroy').bootstrapTable({
                data: res.data,
                pagination: true,
                striped: true,
                pageSize: 15,
                search: true,
                pageList: [5, 10, 15,20, 50, 100, 200],
                exportDataType:'all',
                columns:[
                    {
                        title:'序号',
                        formatter: function (value, row, index) {
                            return index+1;
                        }
                    },
                    {
                        field:'name',
                        title:'任务名称',
                        sortable:true

                    },
                    {
                        field:'type',
                        title:'任务类别',
                        sortable:true

                    },
                    {
                        field:'owner',
                        title:'责任人',
                        sortable:true
                    },
                    {
                        field:'desc',
                        title:'描述',
                        sortable:true
                    },
                    {
                        field:'operate',
                        title:'操作',
                        width:'120px',
                        events:operateEvents,
                        formatter: function (value, row, index){
                            var temp = '';
                            var edit = '';
                            var receive = '';
                            temp = '<a data-row="'+JSON.stringify(row).replace(/"/g, '&quot;')+'" operation="show-detail" style="cursor:pointer;height:25px;" class="btn" href="javascript:void(0)"><img src="/assets/icon/mdms-preview.png" width="25px" height="25px"/></a>';
                            edit = '<a table-index="'+ index +'" data-row="'+JSON.stringify(row).replace(/"/g, '&quot;')+'" operation="edit" style="cursor:pointer;height:25px;" class="btn" href="javascript:void(0)"><img src="/assets/icon/mdms-edit.png" width="25px" height="25px"/></a>';
                            //receive = '<a data-row="'+JSON.stringify(row).replace(/"/g, '&quot;')+'" operation="receive" style="cursor:pointer;height:25px;" class="btn" href="javascript:void(0)"><img src="/assets/icon/mdms-hand.png" width="25px" height="25px"/></a>';
                            return [temp,edit].join('');
                        }
                    }
                ]
            });

            $("#all-job-table-panel").delegate("a[operation='show-detail']",
                'click', function (e) {
                    e.stopPropagation();
                    $("#subscription").attr("class","");
                    $("#data-subscription").attr("class","tab-pane");

                    var str = $(this).attr("data-row");
                    var obj = JSON.parse(str);
                    console.log(obj);

                    if(obj.type == '建模'){
                        console.log('建模查看');
                        $("#model").attr("class","active");
                        $("#model-development").attr("class","tab-pane active");
                        var nextList = _.filter(res.data,function(ele){return ele.id != obj.id});
                        console.log(nextList);
                        $("#model-update-run").attr("style","display:none;");
                        $("#model-update").attr("style","display:none;");
                        $("#model-save").attr("style","display:none;");
                        $("#model-run").attr("style","display:none;");
                        /*$("#select-job-table").bootstrapTable('destroy').bootstrapTable({
                            data: nextList,
                            pagination: true,
                            striped: true,
                            pageSize: 15,
                            search: true,
                            pageList: [5, 10, 15,20, 50, 100, 200],
                            exportDataType:'all',
                            columns:[
                                {
                                    title:'序号',
                                    formatter: function (value, row, index) {
                                        return index+1;
                                    }
                                },
                                {
                                    field:'name',
                                    title:'任务名称',
                                    sortable:true
                                },
                                {
                                    field:'type',
                                    title:'任务类别',
                                    sortable:true
                                },
                                {
                                    field:'owner',
                                    title:'责任人',
                                    sortable:true
                                },
                                {
                                    field:'desc',
                                    title:'描述',
                                    sortable:true
                                }
                            ]
                        });*/
                        setModelUpdateData(res.data,obj,'show');
                    }else if(obj.type == '入仓'){
                        console.log('入仓查看');
                        $("#development").attr("class","active");
                        $("#data-development").attr("class","tab-pane active");
                        $("#update_test").attr("style","display:none;");
                        $("#update").attr("style","display:none;");
                        $("#save").attr("style","display:none;");
                        $("#run").attr("style","display:none;");
                        setUpdateData(obj,'show');
                    }
            });
            //编辑
            $("#all-job-table-panel").delegate("a[operation='edit']",
                'click', function (e) {
                    e.stopPropagation();
                    $("#subscription").attr("class","");
                    $("#data-subscription").attr("class","tab-pane");
                    var str = $(this).attr("data-row");
                    var obj = JSON.parse(str);
                    console.log(obj);

                    if(obj.type == '建模'){
                        $("#model").attr("class","active");
                        $("#model-development").attr("class","tab-pane active");

                        var nextList = _.filter(res.data,function(ele){return ele.id != obj.id});
                        console.log(nextList);
                        $("#select-job-table").bootstrapTable('destroy').bootstrapTable({
                            data: nextList,
                            pagination: true,
                            striped: true,
                            pageSize: 15,
                            search: true,
                            pageList: [5, 10, 15,20, 50, 100, 200],
                            exportDataType:'all',
                            columns:[
                                {
                                    title:'序号',
                                    formatter: function (value, row, index) {
                                        return index+1;
                                    }
                                },
                                {
                                    field:'name',
                                    title:'任务名称',
                                    sortable:true
                                },
                                {
                                    field:'type',
                                    title:'任务类别',
                                    sortable:true
                                },
                                {
                                    field:'owner',
                                    title:'责任人',
                                    sortable:true
                                },
                                {
                                    field:'desc',
                                    title:'描述',
                                    sortable:true
                                }/*,
            {
                field:'operate',
                title:'操作',
                width:'120px',
                events:operateEvents,
                formatter: function (value, row, index){
                    var temp = '';
                    var edit = '';
                    var receive = '';
                    temp = '<a data-row="'+JSON.stringify(row).replace(/"/g, '&quot;')+'" operation="show-detail" style="cursor:pointer;height:25px;" class="btn" href="javascript:void(0)"><img src="/assets/icon/mdms-preview.png" width="25px" height="25px"/></a>';
                    edit = '<a table-index="'+ index +'" data-row="'+JSON.stringify(row).replace(/"/g, '&quot;')+'" operation="edit" style="cursor:pointer;height:25px;" class="btn" href="javascript:void(0)"><img src="/assets/icon/mdms-edit.png" width="25px" height="25px"/></a>';
                    //receive = '<a data-row="'+JSON.stringify(row).replace(/"/g, '&quot;')+'" operation="receive" style="cursor:pointer;height:25px;" class="btn" href="javascript:void(0)"><img src="/assets/icon/mdms-hand.png" width="25px" height="25px"/></a>';
                    return [temp,edit].join('');
                }
            }*/
                            ]
                        });
                        $("#model-update-run").attr("style","");
                        //$("#model-update").attr("style","");
                        $("#model-run").attr("style","display:none;");
                        $("#model-save").attr("style","display:none;");

                        $("#model-update").attr("style","cursor:not-allowed;");
                        $("#model-update").attr("disabled","disabled");

                        setModelUpdateData(res.data,obj,'edit');
                    }else if(obj.type == '入仓'){
                        $("#development").attr("class","active");
                        $("#data-development").attr("class","tab-pane active");

                        $("#update_test").attr("style","");
                        $("#update").attr("style","cursor:not-allowed;");
                        $("#update").attr("disabled","disabled");
                        $("#run").attr("style","display:none;");
                        $("#save").attr("style","display:none;");
                        setUpdateData(obj,'edit');
                    }
            });

        }else{
            _error("服务异常");
        }
    },'json');



    $("#addTaskBtn").click(function(){
        console.log("跳转到添加页面");
        $("#development").attr("class","active");
        $("#subscription").attr("class","");

        $("#data-development").attr("class","tab-pane active");
        $("#data-subscription").attr("class","tab-pane");

        $("#run").attr("style","");
        //$("#save").attr("style","");
        $("#save").attr("style","cursor:not-allowed;");
        $("#save").attr("disabled","disabled");
        $("#update_test").attr("style","display:none;");
        $("#update").attr("style","display:none;");
        setUpdateData({},'add');
        postPositionSQLNum = 1;
    });

    $("#addModelTaskBtn").click(function(){
        console.log("跳转到添加建模页面");
        $("#subscription").attr("class","");
        $("#data-subscription").attr("class","tab-pane");

        $("#model").attr("class","active");
        $("#model-development").attr("class","tab-pane active");

        $("#model-run").attr("style","");
        $("#model-save").attr("style","cursor:not-allowed;");
        $("#model-save").attr("disabled","disabled");
        $("#model-update-run").attr("style","display:none;");
        $("#model-update").attr("style","display:none;");
        setModelUpdateData([],{},'add');
        //setUpdateData({},'add');
        //postPositionSQLNum = 1;
    });
};

/**
 * 生成四位随机数
 * @returns {string}
 */
var getFourPositionNum = function(){
    var num = "";
    for(var i=0; i<4; i++){
        num += Math.floor(Math.random()*10);
    }
    return num;
};


/**
 * 右下角弹框  运行日志
 */
function extbkboxnar(){
    var narrowmen = document.getElementById("extbkboxnar");
    var narrowbox = document.getElementById("extbkboxb");
    if (narrowbox.style.display == "block"){
        narrowbox.style.display = "none";
        narrowmen.className = "extbkboxnarove";
    }
    else{
        narrowbox.style.display = "block";
        narrowmen.className = "extbkboxnar";
    }
}

function extbkboxove(str){document.getElementById("extbkbox").style.display = "none";}

var setUpdateData = function(obj,flag){
    $("input[name='autoCreate'][value='no']").prop("checked",true);
    $("#generateSQL").text('');
    if(flag == 'show'){
        /*$("input[name='taskId']").attr("disabled","true");*/
        $("input[name='taskName']").attr("disabled","true");
        $("input[name='taskDesc']").attr("disabled","true");
        //$("input[name='taskResp']").attr("disabled","true");

        $("textarea[name='execCmd']").attr("disabled","true");

        $("select[name='sdbType']").attr("disabled","true");
        $("select[name='sourceExample']").attr("disabled","true");
        $("select[name='sourceDB']").attr("disabled","true");
        $("select[name='sourceTB']").attr("disabled","true");

        $("select[name='targetExample']").attr("disabled","true");
        $("select[name='targetSchema']").attr("disabled","true");
        $("select[name='targetDB']").attr("disabled","true");
        $("input[name='targetTB']").attr("disabled","true");


        /*$("input[name='taskId']").attr("class","disabled-c");*/
        $("input[name='taskName']").attr("class","disabled-c");
        $("input[name='taskDesc']").attr("class","disabled-c");
        //$("input[name='taskResp']").attr("class","disabled-c");
        $("textarea[name='execCmd']").attr("class","disabled-c");
        $("select[name='sdbType']").attr("class","disabled-c");
        $("select[name='sourceExample']").attr("class","disabled-c");
        $("select[name='sourceDB']").attr("class","disabled-c");
        $("select[name='sourceTB']").attr("class","disabled-c");

        $("select[name='targetExample']").attr("class","disabled-c");
        $("select[name='targetSchema']").attr("class","disabled-c");
        $("select[name='targetDB']").attr("class","disabled-c");
        $("input[name='targetTB']").attr("class","disabled-c");
        $("textarea[name='postpositionSQL']").attr("class","disabled-c");
        $("textarea[name='postpositionSQL']").attr("disabled","true");
        $("#addPostpositionSQL").attr("style","cursor:pointer;display:none;");

        //$("input[name='autoCreate']").attr("class","disabled-c");
        //$("input[name='autoCreate']").attr("disabled","disabled");
    }else{
        $("input[name='taskId']").removeAttr("disabled");
        if(flag == 'add'){
            $("input[name='taskName']").removeAttr("disabled");
            $("input[name='taskName']").removeAttr("class");
        }else if(flag == 'edit'){
            $("input[name='taskName']").attr("disabled","true");
            $("input[name='taskName']").attr("class","disabled-c");
        }
        $("input[name='taskDesc']").removeAttr("disabled");
        //$("input[name='taskResp']").removeAttr("disabled");

        $("textarea[name='execCmd']").removeAttr("disabled");
        $("select[name='sdbType']").removeAttr("disabled");
        $("select[name='sourceExample']").removeAttr("disabled");
        $("select[name='sourceDB']").removeAttr("disabled");
        $("select[name='sourceTB']").removeAttr("disabled");

        $("select[name='targetExample']").removeAttr("disabled");
        $("select[name='targetSchema']").removeAttr("disabled");
        $("select[name='targetDB']").removeAttr("disabled");
        $("input[name='targetTB']").removeAttr("disabled");

        $("input[name='taskId']").removeAttr("class");
        $("input[name='taskDesc']").removeAttr("class");
        //$("input[name='taskResp']").removeAttr("class");
        $("textarea[name='execCmd']").attr("class","off");
        $("select[name='sdbType']").attr("class","soff");
        $("select[name='sourceExample']").attr("class","soff");
        $("select[name='sourceDB']").attr("class","soff");
        $("select[name='sourceTB']").attr("class","soff");

        $("select[name='targetExample']").attr("class","soff");
        $("select[name='targetSchema']").attr("class","soff");
        $("select[name='targetDB']").attr("class","soff");
        $("input[name='targetTB']").attr("class","off");
        $("textarea[name='postpositionSQL']").attr("class","off");
        $("textarea[name='postpositionSQL']").removeAttr("disabled");

        $("#addPostpositionSQL").attr("style","cursor:pointer;");
    }

    if(flag != 'add'){
        if(obj.cfg.sdbType != 'mysql'){
            $("#mysql-unique-title-show").hide();
            $("#mysql-unique-panel-show").hide();
        }else{
            $("#mysql-unique-title-show").show();
            $("#mysql-unique-panel-show").show();
        }
        $("input[name='taskId']").val(obj.id);
        $("input[name='taskName']").val(obj.name);
        $("input[name='taskDesc']").val(obj.desc);
        $("textarea[name='execCmd']").val(obj.cfg.sql);

        $("select[name='sdbType']").val(obj.cfg.sdbType);

        $.get(scriptDATASERVICEURL_EXAMPLE,{sdbType:obj.cfg.sdbType},function(res){
            console.log(res);
            var parseArr = res.data;
            $("select[name='sourceExample']").html('<option value="0">请选择实例</option>');
            _.each(parseArr,function (ele) {
                $("select[name='sourceExample']").append('<option value="'+ele+'">'+ele+'</option>');
            });
            $("select[name='sourceExample']").val(obj.cfg.sInstance);
            $.get(scriptDATASERVICEURL_DB,{rdsId:obj.cfg.sInstance},function(res){
                var parseArr = res.data;
                $("select[name='sourceDB']").html('<option value="0">请选择数据库</option>');
                _.each(parseArr,function (ele) {
                    $("select[name='sourceDB']").append('<option value="'+ele+'">'+ele+'</option>');
                });
                $("select[name='sourceDB']").val(obj.cfg.sdb);
            },'json');
        },'json');

        var text = $("select[name='sdbType']").find("option:selected").text();
        $("#sdbType").text(text);

        $("#sourceExample").text(obj.cfg.sInstance);

        $("#sourceDB").text(obj.cfg.sdb);
        /*$("select[name='sourceTB']").val('xx');*/

        $("select[name='targetExample']").val(obj.cfg.tInstance);
        $("select[name='targetSchema']").val(obj.cfg.tSchema);
        $("select[name='targetDB']").val(obj.cfg.tdb);
        $("input[name='targetTB']").val(obj.cfg.tTable);

        var cbSQLArr = obj.cfg.cb_sql;

        $("#postpositionSQLPanel").html('<p>' +
            '<label style="position:relative;top:-115px;">　<span style="color:red;">*</span>后置SQL</label>&nbsp;' +
            '<textarea placeholder="1.sql不能存在双引号，请用单引号表示；2.时间变量昨天请使用:ctx_yesterday表示，注意带上冒号；sql注释仅支持&quot;--&quot;,不支持&quot;#&quot;" class="off" onkeyup="value=value.replace(/^[\u4e00-\u9fa5]+$/,\'\')" name="postpositionSQL" style="width:85%;height:130px;"></textarea>' +
            '&nbsp;<label style="position:relative;top:-55px;"><span class="info-box-icon-myself"><i id="addPostpositionSQL" class="fa fa-plus" style="cursor:pointer;"></i></span></label>' +
            '</p>');
        if(cbSQLArr.length == 1){
            $("textarea[name='postpositionSQL']").val(cbSQLArr[0]);
            postPositionSQLNum = 1;
        }else if(cbSQLArr.length > 1){
            $("#postpositionSQLPanel").html('<p>' +
                '<label style="position:relative;top:-115px;">　<span style="color:red;">*</span>后置SQL</label>&nbsp;' +
                '<textarea placeholder="1.sql不能存在双引号，请用单引号表示；2.时间变量昨天请使用:ctx_yesterday表示，注意带上冒号；sql注释仅支持&quot;--&quot;,不支持&quot;#&quot;" class="off" onkeyup="value=value.replace(/^[\u4e00-\u9fa5]+$/,\'\')" name="postpositionSQL" style="width:85%;height:130px;">'+cbSQLArr[0]+'</textarea>' +
                '&nbsp;<label style="position:relative;top:-55px;"><span class="info-box-icon-myself"><i id="addPostpositionSQL" class="fa fa-plus" style="cursor:pointer;"></i></span></label>' +
                '</p>');
            for(var i=1;i<cbSQLArr.length;i++){
                if(flag =='show'){
                    var randomNum = getFourPositionNum();
                    $("#postpositionSQLPanel").append('<p>' +
                        '<label style="position:relative;top:-115px;">　<span style="color:red;">*</span>后置SQL</label>&nbsp;' +
                        '<textarea placeholder="1.sql不能存在双引号，请用单引号表示；2.时间变量昨天请使用:ctx_yesterday表示，注意带上冒号；sql注释仅支持&quot;--&quot;,不支持&quot;#&quot;" class="off" onkeyup="value=value.replace(/^[\u4e00-\u9fa5]+$/,\'\')" name="postpositionSQL" style="width:85%;height:130px;">'+cbSQLArr[i]+'</textarea>' +
                        '&nbsp;<label style="position:relative;top:-55px;"><span class="info-box-icon-myself"><i id="removePostpositionSQL'+randomNum+'" class="fa fa-minus-circle" style="cursor:pointer;"></i></span></label>' +
                        '</p>');
                    $("#removePostpositionSQL"+randomNum).attr("style","cursor:pointer;display:none;");
                    $("textarea[name='postpositionSQL']").attr("class","disabled-c");
                    $("textarea[name='postpositionSQL']").attr("disabled","true");
                }else if(flag =='edit'){
                    postPositionSQLNum = 1;
                    var randomNum = getFourPositionNum();
                    $("#postpositionSQLPanel").append('<p>' +
                        '<label style="position:relative;top:-115px;">　<span style="color:red;">*</span>后置SQL</label>&nbsp;' +
                        '<textarea placeholder="1.sql不能存在双引号，请用单引号表示；2.时间变量昨天请使用:ctx_yesterday表示，注意带上冒号；sql注释仅支持&quot;--&quot;,不支持&quot;#&quot;" class="off" onkeyup="value=value.replace(/^[\u4e00-\u9fa5]+$/,\'\')" name="postpositionSQL" style="width:85%;height:130px;">'+cbSQLArr[i]+'</textarea>' +
                        '&nbsp;<label style="position:relative;top:-55px;"><span class="info-box-icon-myself"><i id="removePostpositionSQL'+randomNum+'" class="fa fa-minus-circle" style="cursor:pointer;"></i></span></label>' +
                        '</p>');
                    postPositionSQLNum++;
                    $("#removePostpositionSQL"+randomNum).click(function(){
                        $(this).parent().parent().parent().remove();
                        postPositionSQLNum--;
                    });
                    $("#removePostpositionSQL"+randomNum).attr("style","cursor:pointer;");
                    $("textarea[name='postpositionSQL']").attr("class","off");
                    //$("textarea[name='postpositionSQL']").removeAttr("class");
                    $("textarea[name='postpositionSQL']").removeAttr("disabled");
                }
                //$("textarea[name='postpositionSQL']").val(cbSQLArr[i]);
            }
        }
        if(flag =='show'){
            $("#addPostpositionSQL").attr("style","cursor:pointer;display:none;");
            $("textarea[name='postpositionSQL']").attr("class","disabled-c");
            $("textarea[name='postpositionSQL']").attr("disabled","true");

        }else if(flag =='edit'){
            $("#addPostpositionSQL").click(function(){
                var randomNum = getFourPositionNum();
                $("#postpositionSQLPanel").append(
                    '<p>' +
                    '<label style="position:relative;top:-115px;">　<span style="color:red;">*</span>后置SQL</label>&nbsp;' +
                    '<textarea placeholder="1.sql不能存在双引号，请用单引号表示；2.时间变量昨天请使用:ctx_yesterday表示，注意带上冒号；sql注释仅支持&quot;--&quot;,不支持&quot;#&quot;" class="off" onkeyup="value=value.replace(/^[\u4e00-\u9fa5]+$/,\'\')" name="postpositionSQL" style="width:85%;height:130px;"></textarea>' +
                    '&nbsp;<label style="position:relative;top:-55px;"><span class="info-box-icon-myself"><i id="removePostpositionSQL'+randomNum+'" class="fa fa-minus-circle" style="cursor:pointer;"></i></span></label>'+
                    '</p>');
                postPositionSQLNum++;
                $("#removePostpositionSQL"+randomNum).click(function(){
                    $(this).parent().parent().parent().remove();
                    postPositionSQLNum--;
                });
            });

            $("#addPostpositionSQL").attr("style","cursor:pointer;");
            //$("textarea[name='postpositionSQL']").removeAttr("class");
            $("textarea[name='postpositionSQL']").attr("class","off");
            $("textarea[name='postpositionSQL']").removeAttr("disabled");
        }
    }else{
        $("input[name='taskId']").val('');
        $("input[name='taskName']").val('');
        $("input[name='taskDesc']").val('');
        $("textarea[name='execCmd']").val('');

        $("select[name='sdbType']").val('mysql');
        $.get(scriptDATASERVICEURL_EXAMPLE,{sdbType:'mysql'},function(res){
            console.log(res);
            //var parseArr = JSON.parse(res.data);
            var parseArr = res.data;
            $("select[name='sourceExample']").html('<option value="0">请选择实例</option>');
            _.each(parseArr,function (ele) {
                $("select[name='sourceExample']").append('<option value="'+ele+'">'+ele+'</option>');
            });
        },'json');

        $("select[name='sourceExample']").val('0');
        $("select[name='sourceDB']").html('<option value="0">请选择数据库</option>');
        $("select[name='sourceDB']").val('0');

        $("#sourceExample").text('');
        $("#sourceDB").text('');
        /*$("select[name='sourceTB']").val('');*/

        $("select[name='targetExample']").val('gp-bp1j7sa3410948756.gpdb.rds.aliyuncs.com');
        $("select[name='targetSchema']").val('tmp');
        $("select[name='targetDB']").val('warehouse');
        $("input[name='targetTB']").val('');

        $("#postpositionSQLPanel").html('<p>' +
            '<label style="position:relative;top:-115px;">　<span style="color:red;">*</span>后置SQL</label>&nbsp;' +
            '<textarea placeholder="1.sql不能存在双引号，请用单引号表示；2.时间变量昨天请使用:ctx_yesterday表示，注意带上冒号；sql注释仅支持&quot;--&quot;,不支持&quot;#&quot;" class="off" onkeyup="value=value.replace(/^[\u4e00-\u9fa5]+$/,\'\')" name="postpositionSQL" style="width:85%;height:130px;"></textarea>' +
            '&nbsp;<label style="position:relative;top:-55px;"><span class="info-box-icon-myself"><i id="addPostpositionSQL" class="fa fa-plus" style="cursor:pointer;"></i></span></label>' +
            '</p>');
        postPositionSQLNum = 1;

        $("#addPostpositionSQL").click(function(){
            var randomNum = getFourPositionNum();
            $("#postpositionSQLPanel").append(
                '<p>' +
                '<label style="position:relative;top:-115px;">　<span style="color:red;">*</span>后置SQL</label>&nbsp;' +
                '<textarea placeholder="1.sql不能存在双引号，请用单引号表示；2.时间变量昨天请使用:ctx_yesterday表示，注意带上冒号；sql注释仅支持&quot;--&quot;,不支持&quot;#&quot;" class="off" onkeyup="value=value.replace(/^[\u4e00-\u9fa5]+$/,\'\')" name="postpositionSQL" style="width:85%;height:130px;"></textarea>' +
                '&nbsp;<label style="position:relative;top:-55px;"><span class="info-box-icon-myself"><i id="removePostpositionSQL'+randomNum+'" class="fa fa-minus-circle" style="cursor:pointer;"></i></span></label>'+
                '</p>');
            postPositionSQLNum++;
            $("#removePostpositionSQL"+randomNum).click(function(){
                $(this).parent().parent().parent().remove();
                postPositionSQLNum--;
            });
        });
    }
};

var getGenerateSQLData = function(){
    var sourceExample = $("select[name='sourceExample']").val();
    var sourceDB = $("select[name='sourceDB']").val();

    var targetSchema = $("select[name='targetSchema']").val();
    var targetDB = $("select[name='targetDB']").val();
    var targetTB = $("input[name='targetTB']").val();

    var genObj = {sInstance:sourceExample,sdb:sourceDB,
        tSchema:targetSchema,tdb:targetDB,tTable:targetTB,userId:userId,userName:userName
    };

    var flag = checkGenSubmit(genObj);

    switch(flag){
        case 4:
            _alert('提示','数据源实例不能为空');
            $("input[name='autoCreate'][value='no']").attr("checked",true);
            return;
        case 5:
            _alert('提示','源数据库不能为空');
            $("input[name='autoCreate'][value='no']").attr("checked",true);
            return;
        case 7:
            _alert('提示','目标schema不能为空');
            $("input[name='autoCreate'][value='no']").attr("checked",true);
            return;
        case 8:
            _alert('提示','目标数据库不能为空');
            $("input[name='autoCreate'][value='no']").attr("checked",true);
            return;
        case 9:
            _alert('提示','目标表名不能为空');
            $("input[name='autoCreate'][value='no']").attr("checked",true);
            return;
        default:
            break;
    }
    _loading(2);
    generateSQL(genObj);
};

var getFormData = function(type){
    var taskName = $("input[name='taskName']").val();
    var taskDesc = $("input[name='taskDesc']").val();
    var execCmd = $("textarea[name='execCmd']").val();

    var sourceDBType = $("select[name='sdbType']").val();
    var sourceExample = $("select[name='sourceExample']").val();
    var sourceDB = $("select[name='sourceDB']").val();

    var targetExample = $("select[name='targetExample']").val();
    var targetSchema = $("select[name='targetSchema']").val();
    var targetDB = $("select[name='targetDB']").val();
    var targetTB = $("input[name='targetTB']").val();
    var isAutoCreateTemp = $("input[name='autoCreate']:checked").val();

    var callBackSQLArr = [];
    for(var i=0;i < postPositionSQLNum;i++){
        callBackSQLArr.push(document.getElementsByName("postpositionSQL")[i].value.trim());
    }

    var testObj = {jobName:taskName.trim(),jobDesc:taskDesc.trim(),sql:execCmd.trim(),sdbType:sourceDBType.trim(),sInstance:sourceExample.trim(),sdb:sourceDB.trim(),
        tInstance:targetExample.trim(),tSchema:targetSchema.trim(),tdb:targetDB.trim(),tTable:targetTB.trim(),isAutoCreateTemp:isAutoCreateTemp.trim(),
        cb_sql:callBackSQLArr,userId:userId,userName:userName
    };

    var flag = checkSubmit(testObj);

    switch(flag){
        case 1:
            _alert('提示','任务名称不能为空');
            return;
        case 2:
            _alert('提示','任务描述不能为空');
            return;
        case 3:
            _alert('提示','SQL不能为空');
            return;
        case 4:
            _alert('提示','数据源实例不能为空');
            return;
        case 5:
            _alert('提示','源数据库不能为空');
            return;
        case 6:
            _alert('提示','目标实例不能为空');
            return;
        case 7:
            _alert('提示','目标schema不能为空');
            return;
        case 8:
            _alert('提示','目标数据库不能为空');
            return;
        case 9:
            _alert('提示','目标表名不能为空');
            return;
        case 10:
            _alert('提示','表名不符合规范,只能是字母、数字、下划线的组合');
            return;
        case 11:
            _alert('提示','sql不符合规范,请检查是否包含双引号');
            return;
        case 12:
            _alert('提示','后置sql不符合规范,请检查是否包含双引号');
            return;
        default:
            break;
    }

    var addObj = {jobName:taskName.trim(),jobDesc:taskDesc.trim(),userId:userId,userName:userName,
        cfg:{sql:execCmd.trim(),sdbType:sourceDBType.trim(),sInstance:sourceExample.trim(),sdb:sourceDB.trim(),tInstance:targetExample.trim(),tSchema:targetSchema.trim(),
            tdb:targetDB.trim(),tTable:targetTB.trim(),isAutoCreateTemp:isAutoCreateTemp.trim(),cb_sql:callBackSQLArr}};
    console.log(JSON.stringify(testObj));
    if(type == 'test'){
        testObj.type='入仓';
        doSaveOrTestPre(testObj,'test');
    }else if(type == 'save'){
        addObj.type='入仓';
        doSaveOrTestPre(addObj,'save');
        //doSave(addObj);
    }else if(type == 'update_test'){
        testObj.type='入仓';
        //doSaveOrTestPre(addObj,'save');
        doTest(testObj,'update');
    }else if(type == 'update'){
        addObj.id = $("input[name='taskId']").val();
        addObj.type='入仓';
        if(addObj.id== undefined || addObj.id == null || addObj.id.toString().length == 0){
            _alert('提示','主键为空');
            return;
        }
        doUpdate(addObj);
    }
};

var checkGenSubmit = function(obj){
    if(obj.sInstance== undefined || obj.sInstance == null || obj.sInstance.length == 0 || obj.sInstance == '0'){
        return 4;
    }
    if(obj.sdb== undefined || obj.sdb == null || obj.sdb.length == 0 || obj.sdb == '0'){
        return 5;
    }
    if(obj.tSchema== undefined || obj.tSchema == null || obj.tSchema.length == 0){
        return 7;
    }
    if(obj.tdb== undefined || obj.tdb == null || obj.tdb.length == 0){
        return 8;
    }
    if(obj.tTable== undefined || obj.tTable == null || obj.tTable.length == 0){
        return 9;
    }
    var checkTableName = '/^[0-9a-zA-Z ]+$/';  //英文字母、数字、空格
    /*if(!checkTableName.test(obj.tTable)){
        return 10;
    }
    if(!checkTableName.test(obj.sql)){
        return 11;
    }*/
};

var checkSubmit = function(obj){
    if(obj.jobName== undefined || obj.jobName == null || obj.jobName.length == 0){
        return 1;
    }
    if(obj.jobDesc== undefined || obj.jobDesc == null || obj.jobDesc.length == 0){
        return 2;
    }
    if(obj.sql== undefined || obj.sql == null || obj.sql.length == 0){
        return 3;
    }
    if(obj.sInstance== undefined || obj.sInstance == null || obj.sInstance.length == 0 || obj.sInstance == '0'){
        return 4;
    }
    if(obj.sdb== undefined || obj.sdb == null || obj.sdb.length == 0 || obj.sdb == '0'){
        return 5;
    }
    if(obj.tInstance== undefined || obj.tInstance == null || obj.tInstance.length == 0){
        return 6;
    }
    if(obj.tSchema== undefined || obj.tSchema == null || obj.tSchema.length == 0){
        return 7;
    }
    if(obj.tdb== undefined || obj.tdb == null || obj.tdb.length == 0){
        return 8;
    }
    if(obj.tTable== undefined || obj.tTable == null || obj.tTable.length == 0){
        return 9;
    }

    var checkTableName =  /^\w+$/;              //下划线 + 数字 + 字母
    if(!checkTableName.test(obj.tTable)){
        return 10;
    }
    if(obj.sql.search(/"/) > 0){
        return 11;
    }
    _.each(obj.cb_sql,function(ele){
        if(ele.search(/"/) > 0){
            return 12;
        }
    });

};

var doSave = function(param){
    requestURLPost(scriptDATASERVICEURL_SAVE, param).done(function (res) {
        console.log(res);
        if(res.code == 200){
            refreshTab();
            //_successRe('保存成功！');
        }else{
            _error('保存失败！');
        }
    });
    /*$.post(scriptDATASERVICEURL_SAVE,param,function(data){
        console.log(data);
    },'json');*/
};

var doUpdate = function(param){
    requestURLPost(scriptDATASERVICEURL_UPDATE, param).done(function (res) {
        console.log(res);
        if(res.code == 200){
            //_successRe('修改成功！');
            refreshTab();
        }else{
            _error('修改失败！');
        }
    });
};

var doSaveOrTestPre = function(sotObj,type){
    $.get(scriptDATASERVICEURL_TEST_PRE,{jobName:sotObj.jobName},function(res){
        if(res.code == 200 && res.data == 'false'){
            if(type == 'test'){
                doTest(sotObj,'add');
            }else{
                doSave(sotObj);
            }
        }else{
            _error('JOB已经存在');
        }
    },'json').error(function(xhr,errorText,errorType){
        console.log('校验JOB名称是否存在服务发生异常');
    },'json');
};

var doTest = function(param,source){
    $("#extbkbox").attr("style","display:block;");

    $("#extbkboxnar-close").unbind('click').bind('click',function(){
        $("#extbkbox").attr("style","display:none;");
    });

    $("#extbkboxnar-max").unbind("click").bind('click',function(){
        var c = $("#extbkbox").attr("class");
        if(c == 'extbkbox'){
            $("#extbkbox").attr("class","extbkboxmax");
        }else{
            $("#extbkbox").attr("class","extbkbox");
        }
    });

    /*$("#extbkboxnar-max").click(function(){
        //$("#extbkbox").attr("style","display:none;");

    });*/
    $("#logDiv").html('');
    $("#extbkboxnar-refresh").unbind("click").bind('click',function(){
        $("#logDiv").html('');
        $.get(scriptDATASERVICEURL_LOG,{fileName:"gp_"+param.tSchema+"_"+param.tTable+"_"+new Date().format("yyyy-MM-dd")+".log"},function(rret){
            console.log(rret);
            if(rret.code == 200){
                var rStr = rret.data;
                //var rEnd = rStr.replace(RegExp(new Date().getNewDate(0), "g"), "<br>"+new Date().getNewDate(0));
                $("#logDiv").html(rStr);
                scrollWindow();
            }else if(rret.code == 500){
                $("#logDiv").html(rret.message+'<br><br>'+rret.data);
                scrollWindow();
            }
        },'json').error(function(xhr,errorText,errorType){
            /*console.log(xhr);
            console.log(errorText);
            console.log(errorType);*/
            $("#logDiv").html('获取日志文件异常');
            scrollWindow();
            console.log('获取日志文件异常');
        },'json');
        /*document.getElementById('logIframe').src="https://www.baidu.com";*/
    });
    requestURLPost(scriptDATASERVICEURL_TEST, param).done(function (res) {
        console.log(res);
        if(res.code == 200){
            if(source == 'add'){
                $("#save").attr("style","cursor:pointer;");
                $("#save").removeAttr("disabled");
            }else if(source == 'update'){
                $("#update").attr("style","cursor:pointer;");
                $("#update").removeAttr("disabled");
            }
            //_success('执行成功！');
            setTimeout(function(){
                $.get(scriptDATASERVICEURL_LOG,{fileName:"gp_"+param.tSchema+"_"+param.tTable+"_"+new Date().format("yyyy-MM-dd")+".log"},function(ret,status){
                    console.log(ret);
                    if(ret.code == 200){
                        var str = ret.data;
                        //var end = str.replace(RegExp(new Date().getNewDate(0), "g"), "<br>"+new Date().getNewDate(0));
                        $("#logDiv").html(str);
                        scrollWindow();
                    }else if(ret.code == 500){
                        $("#logDiv").html(ret.message+'<br><br>'+ret.data);
                        scrollWindow();
                    }
                },'json').error(function(xhr,errorText,errorType){
                    $("#logDiv").html('获取日志文件异常');
                    scrollWindow();
                    console.log('获取日志文件异常');
                    /*console.log(xhr+" "+errorText+" "+errorType);*/
                },'json');
            },2000);
        }else{
            _error('执行失败！');
        }
    });
};

var generateSQL = function(param){
    $.get(scriptDATASERVICEURL_GENERATE_SQL,param,function(res){
        console.log(res);
        if(res.code == 200){
            //_success('生成成功！');
            $("#generateSQL").text(res.data);
            parent.zeroModal.closeAll();
        }else{
            _error('执行失败！');
        }
    },'json');
};


function _alert(text,subtext) {
    zeroModal.alert({
        content: text,
        contentDetail: subtext,
        okFn: function() {

        }
    });
}

function _success(text) {
    zeroModal.success(text);
}

function _successRe(text) {
    zeroModal.success({
        content: text,
        okFn: function () {
            refreshTab();
        }
    });
}

function _error(text) {
    zeroModal.error(text);
}

function _loading(type) {
    zeroModal.loading(type);
}

var refreshTab = function(){
    window.location.reload();
};

function scrollWindow() {
    var now = new Date().format('yyyy-MM-dd hh:mm:ss');
    var div = document.getElementById('logDiv');
    div.innerHTML = div.innerHTML  + '<br />' + '刷新时间：' + now + '<br />';
    div.scrollTop = div.scrollHeight;
}

/*渲染建模开发页面*/

//建模开发全局变量
var selectedTaskArr = [];
//var currentSQL = "";
var drawModelDevelopment = function(){

    $.get(scriptDATASERVICEURL_QUERY,{},function(res){
        if(res.code == 200){
            $("#select-job-table").bootstrapTable('destroy').bootstrapTable({
                data: res.data,
                pagination: true,
                striped: true,
                pageSize: 15,
                search: true,
                pageList: [5, 10, 15,20, 50, 100, 200],
                exportDataType:'all',
                columns:[
                    {
                        title:'序号',
                        formatter: function (value, row, index) {
                            return index+1;
                        }
                    },
                    {
                        field:'name',
                        title:'任务名称',
                        sortable:true
                    },
                    {
                        field:'type',
                        title:'任务类别',
                        sortable:true
                    },
                    {
                        field:'owner',
                        title:'责任人',
                        sortable:true
                    },
                    {
                        field:'desc',
                        title:'描述',
                        sortable:true
                    }/*,
            {
                field:'operate',
                title:'操作',
                width:'120px',
                events:operateEvents,
                formatter: function (value, row, index){
                    var temp = '';
                    var edit = '';
                    var receive = '';
                    temp = '<a data-row="'+JSON.stringify(row).replace(/"/g, '&quot;')+'" operation="show-detail" style="cursor:pointer;height:25px;" class="btn" href="javascript:void(0)"><img src="/assets/icon/mdms-preview.png" width="25px" height="25px"/></a>';
                    edit = '<a table-index="'+ index +'" data-row="'+JSON.stringify(row).replace(/"/g, '&quot;')+'" operation="edit" style="cursor:pointer;height:25px;" class="btn" href="javascript:void(0)"><img src="/assets/icon/mdms-edit.png" width="25px" height="25px"/></a>';
                    //receive = '<a data-row="'+JSON.stringify(row).replace(/"/g, '&quot;')+'" operation="receive" style="cursor:pointer;height:25px;" class="btn" href="javascript:void(0)"><img src="/assets/icon/mdms-hand.png" width="25px" height="25px"/></a>';
                    return [temp,edit].join('');
                }
            }*/
                ]
            });

            //点击行数据时,进入查看界面
            $("#select-job-table").on("click-row.bs.table",function(e, row, $element){
                //var  index= $element.data('index');
                console.log("已选中的数组："+selectedTaskArr);
                if(!selectedTaskArr.contains(row.id)){
                    selectedTaskArr.push(row.id);
                    var randomNum = getFourPositionNum();
                    console.log(row);
                    $("#selected-panel").append(
                        '<span>' +
                        '<div style="position:relative;border:2px dashed #2EAFBB;height:30px;width:auto;display:inline-block !important; display:inline;padding-top:2px;margin-top:10px;">' +
                        '<span id="selected_cancel_'+randomNum+'" style="position:absolute; top:-10px; right:-7px; z-index:99;color:red;background:#fff;cursor:pointer;">X</span>' +
                        '&nbsp;&nbsp;'+row.name+'&nbsp;&nbsp;' +
                        '</div>' +
                        '&nbsp;&nbsp;&nbsp;&nbsp;' +
                        '</span>');

                    $('#selected_cancel_'+randomNum).unbind('click').bind('click',function(){
                        $(this).parent().parent().remove();
                        //$(this).parent().next().remove();
                        //$("#for_selected_remove_"+randomNum).remove();
                        selectedTaskArr.remove(row.id);
                        console.log("已选中的数组变成："+selectedTaskArr);
                    });
                }
                console.log("已选中的数组变成："+selectedTaskArr);
            });

        }else{
            _error("服务异常");
        }
    },'json');

    /*$("textarea[name='model-exec-sql']").change(function(){
        console.log("发生改变");
        var sql = $("textarea[name='model-exec-sql']").val().trim();
        console.log(sql);
        var sc = $("#model-save").attr("style");
        var uc = $("#model-update").attr("style");
        if(uc == 'display:none;'){
            $("#model-save").attr("style","cursor:not-allowed;");
            $("#model-save").attr("disabled","disabled");
        }else if(sc == 'display:none;'){
            $("#model-update").attr("style","cursor:not-allowed;");
        }
    });*/

    $("textarea[name='model-exec-sql']").bind('keyup',function(){
        console.log("发生改变");
        var sql = $("textarea[name='model-exec-sql']").val().trim();
        console.log(sql);
        var sc = $("#model-save").attr("style");
        var uc = $("#model-update").attr("style");
        console.log("save-style:"+sc);
        console.log("update-style:"+uc);
        if(uc == 'display:none;'){
            $("#model-save").attr("style","cursor:not-allowed;");
            $("#model-save").attr("disabled","disabled");
        }else if(sc == 'display:none;'){
            $("#model-update").attr("style","cursor:not-allowed;");
            $("#model-update").attr("disabled","disabled");
        }
    });

    $("#model-run").click(function(){
        console.log("测试");
        getModelFormData('test');
        //getFormData('test');
    });

    $("#model-save").click(function(){
        console.log("保存");
        getModelFormData('save');
        //getFormData('test');
    });

    $("#model-update-run").click(function(){
        console.log("更新-测试");
        getModelFormData('update_run');
    });

    $("#model-update").click(function(){
        console.log("修改");
        getModelFormData('update');
        //getFormData('test');
    });
};

/**
 * 建模开发测试前验证任务名称是否存在
 * @param sotObj
 * @param type
 */
var doModelSaveOrTestPre = function(sotObj,type){
    $.get(scriptDATASERVICEURL_TEST_PRE,{jobName:sotObj.jobName},function(res){
        if(res.code == 200 && res.data == 'false'){
            if(type == 'test'){
                doModelTest(sotObj,'add');
            }else{
                doModelSave(sotObj);
            }
        }else{
            _error('JOB已经存在');
        }
    },'json').error(function(xhr,errorText,errorType){
        console.log('校验JOB名称是否存在服务发生异常');
    },'json');
};
/**
 * 建模开发测试接口
 * @param param
 */
var doModelTest = function(param,source){
    $("#extbkbox").attr("style","display:block;");

    $("#extbkboxnar-close").unbind('click').bind('click',function(){
        $("#extbkbox").attr("style","display:none;");
    });

    $("#extbkboxnar-max").unbind("click").bind('click',function(){
        var c = $("#extbkbox").attr("class");
        if(c == 'extbkbox'){
            $("#extbkbox").attr("class","extbkboxmax");
        }else{
            $("#extbkbox").attr("class","extbkbox");
        }
    });

    $("#logDiv").html('');
    $("#extbkboxnar-refresh").unbind("click").bind('click',function(){
        $("#logDiv").html('');
        $.get(scriptDATASERVICEURL_LOG,{fileName:"run_gp_sql_"+param.jobName+".sql.tmp_"+new Date().format("yyyy-MM-dd")+".log"},function(rret){
            console.log(rret);
            if(rret.code == 200){
                var rStr = rret.data;
                //var rEnd = rStr.replace(RegExp(new Date().getNewDate(0), "g"), "<br>"+new Date().getNewDate(0));
                $("#logDiv").html(rStr);
                scrollWindow();
            }else if(rret.code == 500){
                $("#logDiv").html(rret.message+'<br><br>'+rret.data);
                scrollWindow();
            }
        },'json').error(function(xhr,errorText,errorType){
            /*console.log(xhr);
            console.log(errorText);
            console.log(errorType);*/
            $("#logDiv").html('获取日志文件异常');
            scrollWindow();
            console.log('获取日志文件异常');
        },'json');
        /*document.getElementById('logIframe').src="https://www.baidu.com";*/
    });
    requestURLPost(scriptDATASERVICEURL_TEST, param).done(function (res) {
        console.log(res);
        if(res.code == 200){
            if(source == 'add'){
                $("#model-save").attr("style","cursor:pointer;");
                $("#model-save").removeAttr("disabled");
            }else if(source == 'update'){
                $("#model-update").attr("style","cursor:pointer;");
                $("#model-update").removeAttr("disabled");
            }

            setTimeout(function(){
                $.get(scriptDATASERVICEURL_LOG,{fileName:"run_gp_sql_"+param.jobName+".sql.tmp_"+new Date().format("yyyy-MM-dd")+".log"},function(ret,status){
                    console.log(ret);
                    if(ret.code == 200){
                        var str = ret.data;
                        //var end = str.replace(RegExp(new Date().getNewDate(0), "g"), "<br>"+new Date().getNewDate(0));
                        $("#logDiv").html(str);
                        scrollWindow();
                    }else if(ret.code == 500){
                        $("#logDiv").html(ret.message+'<br><br>'+ret.data);
                        scrollWindow();
                    }
                },'json').error(function(xhr,errorText,errorType){
                    $("#logDiv").html('获取日志文件异常');
                    scrollWindow();
                    console.log('获取日志文件异常');
                    /*console.log(xhr+" "+errorText+" "+errorType);*/
                },'json');
            },2000);
            //_success('执行成功！');
        }else{
            _error('执行失败！');
        }
    });
};

var doModelSave = function(param){
    requestURLPost(scriptDATASERVICEURL_SAVE, param).done(function (res) {
        if(res.code == 200){
            refreshTab();
            //_success('保存成功');
        }else{
            _error('保存失败！');
        }
    });
};

var doModelUpdate = function(param){
    requestURLPost(scriptDATASERVICEURL_UPDATE, param).done(function (res) {
        console.log(res);
        if(res.code == 200){
            refreshTab();
        }else{
            _error('修改失败！');
        }
    });
};

var getModelFormData = function(type){
    var taskName = $("input[name='modelTaskName']").val();
    var taskDesc = $("input[name='modelTaskDesc']").val();
    var execCmd = $("textarea[name='model-exec-sql']").val();

    var dependItem = arrToString(selectedTaskArr);

    var testObj = {jobName:taskName.trim(),jobDesc:taskDesc.trim(),sql:execCmd.trim(),deps:dependItem,userId:userId,userName:userName};

    var flag = checkModelSubmit(testObj);

    switch(flag){
        case 1:
            _alert('提示','任务名称不能为空');
            return;
        case 2:
            _alert('提示','任务描述不能为空');
            return;
        case 3:
            _alert('提示','SQL不能为空');
            return;
        case 4:
            _alert('提示','请选择依赖项');
            return;
        case 5:
            _alert('提示','SQL不能包含双引号');
            return;
        default:
            break;
    }

    var addObj = {jobName:taskName.trim(),jobDesc:taskDesc.trim(),deps:dependItem,userId:userId,userName:userName,
        cfg:{sql:execCmd.trim()}};
    console.log(JSON.stringify(testObj));

    console.log(JSON.stringify(addObj));

    if(type == 'test'){
        testObj.type='建模';
        doModelSaveOrTestPre(testObj,'test');
    }else if(type == 'save'){
        addObj.type='建模';
        doModelSaveOrTestPre(addObj,'save');
    }else if(type == 'update_run'){
        testObj.type='建模';
        doModelTest(testObj,'update');
    }else if(type == 'update'){
        addObj.id = $("input[name='modelTaskId']").val();
        addObj.type='建模';
        if(addObj.id== undefined || addObj.id == null || addObj.id.toString().length == 0){
            _alert('提示','主键为空');
            return;
        }
        doModelUpdate(addObj);
    }
};

var checkModelSubmit = function(obj){
    if(obj.jobName== undefined || obj.jobName == null || obj.jobName.length == 0){
        return 1;
    }
    if(obj.jobDesc== undefined || obj.jobDesc == null || obj.jobDesc.length == 0){
        return 2;
    }
    if(obj.sql== undefined || obj.sql == null || obj.sql.length == 0){
        return 3;
    }
    if(obj.deps== undefined || obj.deps == null || obj.deps.length == 0){
        return 4;
    }
    if(obj.sql.search(/"/) > 0){
        return 5;
    }
};

var setModelUpdateData = function(list,obj,flag){
    if(flag == 'show'){
        $("input[name='modelTaskName']").attr("disabled","true");
        $("input[name='modelTaskDesc']").attr("disabled","true");

        $("textarea[name='model-exec-sql']").attr("disabled","true");

        $("input[name='modelTaskName']").attr("class","disabled-c");
        $("input[name='modelTaskDesc']").attr("class","disabled-c");
        $("textarea[name='model-exec-sql']").attr("class","disabled-c");

        $("#select-table-panel").hide();
    }else{
        $("#select-table-panel").show();
        $("input[name='modelTaskId']").removeAttr("disabled");
        if(flag == 'add'){
            $("input[name='modelTaskName']").removeAttr("disabled");
            $("input[name='modelTaskName']").removeAttr("class");
        }else if(flag == 'edit'){
            $("input[name='modelTaskName']").attr("disabled","true");
            $("input[name='modelTaskName']").attr("class","disabled-c");
        }
        $("input[name='modelTaskDesc']").removeAttr("disabled");

        $("textarea[name='model-exec-sql']").removeAttr("disabled");

        $("input[name='modelTaskId']").removeAttr("class");
        $("input[name='modelTaskDesc']").removeAttr("class");
        $("textarea[name='model-exec-sql']").removeAttr("class");
    }

    if(flag != 'add'){
        $("input[name='modelTaskId']").val(obj.id);
        $("input[name='modelTaskName']").val(obj.name);
        $("input[name='modelTaskDesc']").val(obj.desc);
        $("textarea[name='model-exec-sql']").val(obj.cfg.sql);
        var tempArr = obj.deps.split(",");
        console.log(tempArr);
        if(flag =='show'){
            selectedTaskArr = [];
            $("#selected-panel").html('<span style="color:#000;font-weight:BOLD;">依赖项 &gt; </span>');
            console.log("已选中的数组变成："+selectedTaskArr);
            _.each(list,function(ele){
                if(tempArr.contains(ele.name)){
                    selectedTaskArr.push(ele.id);
                    var randomNum = getFourPositionNum();
                    console.log(ele.id);
                    $("#selected-panel").append(
                        '<span>' +
                        '<div style="position:relative;border:2px dashed #2EAFBB;height:30px;width:auto;display:inline-block !important; display:inline;padding-top:2px;margin-top:10px;">' +
                        '&nbsp;&nbsp;'+ele.name+'&nbsp;&nbsp;' +
                        '</div>' +
                        '&nbsp;&nbsp;&nbsp;&nbsp;' +
                        '</span>');
                }
            });
            console.log("已选中的数组变成："+selectedTaskArr);
        }else if(flag =='edit'){
            selectedTaskArr = [];
            $("#selected-panel").html('<span style="color:#000;font-weight:BOLD;">依赖项 &gt; </span>');
            console.log("已选中的数组变成："+selectedTaskArr);
            _.each(list,function(ele){
                if(tempArr.contains(ele.name)){
                    selectedTaskArr.push(ele.id);
                    var randomNum = getFourPositionNum();
                    console.log(ele.id);

                    $("#selected-panel").append(
                        '<span>' +
                        '<div style="position:relative;border:2px dashed #2EAFBB;height:30px;width:auto;display:inline-block !important; display:inline;padding-top:2px;margin-top:10px;">' +
                        '<span id="selected_cancel_'+randomNum+'" style="position:absolute; top:-10px; right:-7px; z-index:99;color:red;background:#fff;cursor:pointer;">X</span>' +
                        '&nbsp;&nbsp;'+ele.name+'&nbsp;&nbsp;' +
                        '</div>' +
                        '&nbsp;&nbsp;&nbsp;&nbsp;' +
                        '</span>');

                    $('#selected_cancel_'+randomNum).unbind('click').bind('click',function(){
                        $(this).parent().parent().remove();
                        selectedTaskArr.remove(ele.id);
                        console.log("已选中的数组变成："+selectedTaskArr);
                    });
                }
            });
            console.log("已选中的数组变成："+selectedTaskArr);
        }
    }else{
        $("input[name='modelTaskId']").val('');
        $("input[name='modelTaskName']").val('');
        $("input[name='modelTaskDesc']").val('');
        $("textarea[name='model-exec-sql']").val('');
        //selectedTaskArr = [];
        $("#selected-panel").html('<span style="color:#000;font-weight:BOLD;">依赖项 &gt; </span>');
        selectedTaskArr = [];
    }
};

var closeLogDiv = function(){
    var c = $("#extbkbox").attr("style");
    if(c != 'display:none;'){
        $("#extbkbox").attr("style","display:none;");
    }
};

var arrToString = function(arr) {
    var str = "";
    _.each(arr,function(ele){
        str += ele + ",";
    });
    //去掉最后一个逗号(如果不需要去掉，就不用写)
    if (str.length > 0) {
        str = str.substr(0, str.length - 1);
    }
    return str;
};