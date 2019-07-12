Template.ETLTaskManage.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#BITab').addClass('active');
    $('#ETLTaskManage').addClass('active');
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

    $("#fileNameHtml").hide();
    autosize(document.querySelectorAll('textarea'));

    $("input[name='file']").bind("change",function(){
        var filePath = $(this).val();
        if(filePath.indexOf("zip")!=-1 || filePath.indexOf("rar")!=-1){
            var f = document.getElementById("file_upload").files;
            var timestamp = f[0].lastModifiedDate.getTime();
            var form = document.getElementById("fileForm");
            var formData = new FormData(form);
            var unique = zeroModal.loading(3);
            $.ajax({
                url:scriptService + '/watcher/temp?timestamp='+timestamp,
                type:'post',
                data:formData,
                async:false,
                contentType:false,
                processData:false,
                cache:false,
                dataType:'json',
                success:function(data){
                    if(data.code == 200){
                        zeroModal.close(unique);
                        var arr = filePath.split('\\');
                        var fileName = arr[arr.length-1];
                        $("#fileNameHtml").show();
                        $("#fileNameHtml").html(fileName);
                        // var userId = getUserName();
                        // var userName = getUserName();
                        var userId = getUserId();
                        var userName = getUserName();
                        //添加访问日志
                        requestURL(dataService+"/withoutBi/generateLogForJobManagePro",{fileName:fileName,sid:userId,userName:userName,opType:'0'}).done(function(rem){
                            if(rem.msg=="OK"){

                            }else{

                            }
                        });
                        _success('上传成功');
                    }else{
                        zeroModal.close(unique);
                        _error('服务异常！');
                    }
                    isCheck = false;
                },
                error:function(data){
                    zeroModal.close(unique);
                    _error('服务异常！');
                }
            });
        }else{
            _error('文件类型错误（*.zip）！');
            return false;
        }
        $("input[name='file']").val("")
    });

    //job目录   slb外网地址

    $('#fileIframe').attr('src', "http://47.97.240.5/etl/newjob/");  //文件信息
    $('#historyLogfile').attr('src', "http://47.97.240.5/etl/newlog/");  //历史日志信息

    $("#refreshhistoryLogfile").click(function () {             //正在运行的Job更新
        if($("input[name='dir']:checked").val()=="new"){
            $('#historyLogfile').attr('src', "http://47.97.240.5/etl/newlog/");
        }else {
            $('#historyLogfile').attr('src', "http://47.97.240.5/etl/log/");
        }
    })

    $("input[name='dir']").click(function () {                  //切换日志目录和文件目录以及审核按钮
        if($("input[name='dir']:checked").val()=="new"){
            $('#fileIframe').attr('src', "http://47.97.240.5/etl/newjob/");
            $('#historyLogfile').attr('src', "http://47.97.240.5/etl/newlog/");
            $("#audit").show()
        }else {
            $('#fileIframe').attr('src', "http://47.97.240.5/etl/job/");
            $('#historyLogfile').attr('src', "http://47.97.240.5/etl/log/");
            $("#audit").hide()
        }
    })

    $("#check").click(function(){
        var fileName = $("#fileNameHtml").html();
        var directory=$("input[name='dir']:checked").val();
        if(fileName != undefined &&  fileName != ''){
            var cmd = $("#cmd").val();
            if(cmd == undefined || cmd == null || cmd.length == 0 || cmd == ''){
                _alert('操作提示！','请填写脚本命令！');
            }else if(cmd.trimLeft().search(/runAt.sh/) < 0 && cmd.trimLeft().search(/runFull.sh/) < 0 && cmd.trimLeft().search(/runFromTo.sh/) < 0 && cmd.trimLeft().search(/runIncr.sh/) < 0){
                _alert('操作提示！','您的命令不符合规范，请修改！');
            }else{
                $.get(scriptService + '/watcher/runJob',{commandInfo:cmd.trimLeft(),fileName:fileName,directory:directory,runType:"check"},function(data){
                    if(data.code==200){
                        isCheck = true;
                        // var userId = getUserName();
                        // var userName = getUserName();
                        var userId = getUserId();
                        var userName = getUserName();
                        //添加访问日志
                        requestURL(dataService+"/withoutBi/generateLogForJobManagePro",{fileName:fileName,sid:userId,userName:userName,opType:'1'}).done(function(rem){
                            if(rem.msg=="OK"){

                            }else{

                            }
                        });
                        // _success('正在运行');
                        // sleep(1000)

                        $('#logIframe').attr('src',"http://47.97.240.5:7003/logMonitoring/logView?fileName="+cmd.split(" ")[1]);
                    }else{
                        isCheck = false;
                        _error('运行失败，请检查命令');
                    }
                },'json')
            }
        }else{
            _error('请选择文件');
        }
    });

    $("#upload_stock").click(function(){
        var fileName = $("#fileNameHtml").html();
        if(fileName.search(/99/) >= 0 ){
            _error('临时性Job不能发布！');
        }else if(fileName != undefined &&  fileName != ''){
            if(isCheck){
                if(fileName.indexOf("zip")!=-1 || fileName.indexOf("rar")!=-1){
                    var directory=$("input[name='dir']:checked").val();
                    $.get(scriptService + '/watcher/prev',{fileName:fileName,directory:directory},function(data){
                        if(data.code == 200){
                            $.post(scriptService + '/watcher/move?fileName='+fileName+ '&directory='+directory,{},function(res){
                                if(res.code == 200){
                                    var form = document.getElementById("fileForm");
                                    form.reset();
                                    // var userId = getUserName();
                                    // var userName = getUserName();
                                    var userId = getUserId();
                                    var userName = getUserName();
                                    //添加访问日志
                                    requestURL(dataService+"/withoutBi/generateLogForJobManagePro",{fileName:fileName,sid:userId,userName:userName,opType:'2'}).done(function(rem){
                                        if(rem.msg=="OK"){

                                        }else{

                                        }
                                    });

                                    _success('发布成功');
                                }else {
                                    _error('发布失败，请联系管理员！');
                                }
                            },'json');
                        }else if(data.code == 200102){
                            _confirm2('检测到同名文件，是否覆盖？','一经覆盖，不可挽回，请谨慎操作',fileName,directory);
                        }else {
                            _error('服务出现异常，请联系管理员');
                        }
                    },'json');
                }else{
                    _error('文件类型错误（*.zip）！');
                }
            }else{
                _error('请先校验文件！');
            }
        }else{
            _error('请选择文件');
        }
    });

    $("#audit").click(function(){
        var cmd = $("#cmd").val();
        if(cmd == undefined || cmd == null || cmd.length == 0 || cmd == ''){
            _alert('操作提示！','请填写脚本命令！');
        }else if(cmd.trimLeft().search(/checkJob.sh/) < 0 && cmd.trimLeft().search(/checkTable.sh/) < 0 ){
            _alert('操作提示！','审核只支持checkJob.sh和checkTable.sh，请修改！');
        }else{
            $.get(scriptService + '/watcher/runJobSerial',{commandInfo:cmd.trimLeft()},function(data){
                if(data.code==200){
                    // _success('正在审核');
                    $('#logIframe').attr('src',"http://47.97.240.5:7003/logMonitoring/logView?fileName="+cmd.split(" ")[1]);
                }else{
                    _error('审核失败，请检查命令');
                }
            },'json')
            // var userId = getUserName();
            var userId = getUserId();
            // var userName = getUserName();
            var userName = getUserName();
            requestURL(dataService+"/withoutBi/generateLogForJobManagePro",{fileName:cmd.trimLeft(),sid:userId,userName:userName,opType:'5'}).done(function(rem){});
        }
    });

    $("#run").click(function(){
            var directory=$("input[name='dir']:checked").val();
            var cmd = $("#cmd").val();
            if(cmd == undefined || cmd == null || cmd.length == 0 || cmd == ''){
                _alert('操作提示！','请填写脚本命令！');
            }else if(cmd.trimLeft().search(/runAt.sh/) < 0 && cmd.trimLeft().search(/runFull.sh/) < 0 && cmd.trimLeft().search(/runFromTo.sh/) < 0 && cmd.trimLeft().search(/runIncr.sh/) < 0){
                _alert('操作提示！','您的命令不符合规范，请修改！');
            }else{
                if(directory == 'old' && (!(cmd.trimLeft().search(/runAt.sh/) < 0) || !(cmd.trimLeft().search(/runFromTo.sh/) < 0))){
                    _alert('操作提示！','老目录不支持runAt.sh 和 runFromTo.sh 命令！');
                    return;
                }else if(directory == 'new' && !(cmd.trimLeft().search(/runIncr.sh/) < 0)){
                    _alert('操作提示！','新目录不支持runlncr.sh 命令！');
                    return;
                }
                $.get(scriptService + '/watcher/runJob',{commandInfo:cmd.trimLeft(),fileName:"runJob",directory:directory,runType:"run"},function(data){
                    if(data.code==200){
                        var userId = getUserId();
                        // var userId = getUserName();
                        // var userName = getUserName();
                        var userName = getUserName();
                        //添加访问日志
                        requestURL(dataService+"/withoutBi/generateLogForJobManagePro",{fileName:cmd.trim(),sid:userId,userName:userName,opType:'3'}).done(function(rem){});

                        // _success('正在运行');
                        $('#logIframe').attr('src',"http://47.97.240.5:7003/logMonitoring/logView?fileName="+cmd.split(" ")[1]);
                    }else{
                        _error('运行失败，请检查命令');
                    }
                },'json')
            }
    });

    renderTable();
    $("#refreshPro").click(function () {
        renderTable();
    })
};

function renderTable(){
    requestURL(scriptService + '/watcher/findRunPro',{}).done(function(ret){
        /*ret.push({proName:'1',proId:'1'});
        ret.push({proName:'2',proId:'2'});
        ret.push({proName:'3',proId:'3'});
        ret.push({proName:'4',proId:'4'});
        ret.push({proName:'5',proId:'5'});
        ret.push({proName:'6',proId:'6'});*/

        $('#dataTable').bootstrapTable('destroy').bootstrapTable({
            pagination: true,
            striped: true,
            pageSize: 5,
            pageList: [5],
            search: true,
            data:ret,
            columns: [{
                field: 'proName',
                title: '进程',
                sortable:true
            },
                {
                    field: 'proId',
                    title: '进程Id',
                    sortable:true
                },
                {
                    field: '#',
                    title: '日志信息',
                    sortable:true,
                    formatter:function(value,row,index){
                        var logName=(row.proName).split(" ")[1];
                        return "<a href='#' onclick='$(\"#logIframe\").attr(\"src\",\"http://47.97.240.5:7003/logMonitoring/logView?fileName="+logName+"\")'>查看</a>"
                    }
                },
                {
                    field: '#',
                    title: '操作',
                    sortable:true,
                    formatter:function(value,row,index){
                        //添加访问日志
                        return "<a href='#' onclick='$.get(\"http://47.97.240.5:8899/script/watcher/killRunPro\",{proId:"+row.proId+"},function(data){$.get(\"http://watcher.intra.aihuishou.com:8809/watcher/withoutBi/generateLogForJobManagePro\",{fileName:\""+row.proName.replace(/ /g,"_")+"\",sid:"+getUserName()+",userName:\""+getUserId()+"\",opType:\"4\"}).done(function(rem){zeroModal.success(\"正在执行关闭，请刷新查看\")})})'>关闭</a>"
                    }
                }
            ]
        });
    });

}

// var scriptService="http://10.180.12.105:8899/script";
var scriptService="http://47.97.240.5:8899/script";

var isCheck = false;
//用于生成uuid
function S4() {
    return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
}
function guid() {
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
}

function _confirm2(text,subtext,fileName,directory) {
    zeroModal.confirm({
        content: text,
        contentDetail: subtext,
        buttons: [{
            className: 'zeromodal-btn zeromodal-btn-primary',
            name: '覆盖',
            fn: function(opt) {
                $.post(scriptService + '/watcher/move?fileName='+fileName+ '&directory='+directory,{},function(ret){
                    if(ret.code == 200){
                        var form = document.getElementById("fileForm");
                        form.reset();
                        // var userId = getUserName();
                        // var userName = getUserName();
                        var userId = getUserId();
                        var userName = getUserName();
                        //添加访问日志
                        requestURL(dataService+"/withoutBi/generateLogForJobManagePro",{fileName:fileName,sid:userId,userName:userName,opType:'2'}).done(function(rem){});
                        _success('发布成功');
                    }else {
                        _error('发布失败，请联系管理员！');
                    }
                },'json');
            }
        },{
            className: 'zeromodal-btn zeromodal-btn-default',
            name: '取消',
            fn: function(opt) {

            }
        }]
    });
}

function _success(text) {
    zeroModal.success(text);
}

function _error(text) {
    zeroModal.error(text);
}

function _alert(text,subtext) {
    zeroModal.alert({
        content: text,
        contentDetail: subtext,
        okFn: function() {

        }
    });
}

function _loading(type) {
    zeroModal.loading(type);
}