Template.etljobTmpl.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#BITab').addClass('active');
   $('#dispatcher').addClass('active');

    if(isMobile()){
        $('.sidebar-toggle').click();
    }

    function _error(text) {
        zeroModal.error(text);
    }

    renderPage()
    $("#add").click(function() {
        if ($("#name").val().trim() == "" || $("#cmd").val().trim() == "") {
            _error('增加失败，名称或脚本不能为空！！！');
        } else {
            //选择的依赖ids
            var selList = $('#ETLJobData').bootstrapTable('getSelections')
            var ids = _.map(selList, function (row) {
                return row.id;
            }).toString();
            var project = $("#project").val().trim()
            var name = $("#name").val().trim()
            var cmd = $("#cmd").val().trim()
            var prior = $("#prior").val().trim()
            var query = {
                "project": project,
                "name": name,
                "cmd": cmd,
                "prior": prior,
                "ids": ids
            }
            requestURLPost(dataService + "/foundation/insertJob", query).done(function (data) {

                if (data.msg == "OK") {
                    renderPage()
                } else {
                    console.log(data)
                    alert("插入失败！！" + data.msg)
                }
            })
        }

    })
    $("#ETLJobData").on("click","#del",function(e){
        var obj = JSON.parse(decodeURI($(this).parent().attr("value")));
        requestURLPost(dataService+"/foundation/delJob",obj).done(function(data){
            if(data.msg=="OK"){
                renderPage()
            }else{
                console.log(data)
                alert("删除失败！！"+data.msg)
            }
        })
    })
    $("#ETLJobData").on("click","#modify",function(e){
        var obj = JSON.parse(decodeURI($(this).parent().attr("value")));
        requestURL(dataService + "/foundation/getCurrentJobList", {}).done(function (dataList) {
            customModal("修改Job",obj,dataList)
        })
    })
    $("#update").click(function(e){
        //选择的依赖ids
        var selList = $('#_ETLJobData').bootstrapTable('getSelections')
        var ids= _.map(selList,function(row){
            return row.id;
        }).toString();
        var project = $("#_project").val().trim()
        var name = $("#_name").val().trim()
        var cmd = $("#_cmd").val().trim()
        var prior = $("#_prior").val().trim()
        var id = $("#_id").val().trim()
        var query = {
            "project":project,
            "name":name,
            "cmd":cmd,
            "prior":prior,
            "ids":ids,
            "id":id
        }
        requestURLPost(dataService+"/foundation/updateJob",query).done(function(data){
            if(data.msg=="OK"){
                $("#close").click()
                renderPage()
            }else{
                alert("更新失败！！"+data.msg)
            }
        })
    })
    $("#myModal").on("hidden.bs.modal", function() {
        $(this).removeData("bs.modal");
    });

}
function customModal(title,data,dataList){
    var count=0;
    $("#myModal").on('show.bs.modal', function () {
        if(++count==1){
            $("#myModalLabel").text(title)
            $("#_project").val(data.project)
            $("#_id").val(data.id)
            $("#_name").val(data.name)
            $("#_cmd").val(data.cmd)
            $("#_prior").val(data.prior)

            $("#_ETLJobData").bootstrapTable('destroy').bootstrapTable({
                data: _.filter(dataList,function(ele){
                    return ele.id!=data.id && ele.flag=='1'
                }),
                pagination: true,
                showExport:false,
                search: true,
                columns: [
                    {
                        field: "",
                        title: "",
                        checkbox: "true",
                        sortable: true
                    }, {
                        field: "id",
                        title: "InternalID",
                        visible: false,
                        sortable: true
                    }, {
                        field: "project",
                        title: "项目",
                        sortable: true
                    }, {
                        field: "name",
                        title: "名称",
                        sortable: true
                    }, {
                        field: "cmd",
                        title: "命令脚本",
                        sortable: true
                    }, {
                        field: "prior",
                        title: "优先级",
                        sortable: true
                    }, {
                        field: "owner",
                        title: "拥有者",
                        sortable: true
                    }]
            });
            $('#_ETLJobData').bootstrapTable("checkBy", {field:'name', values:[data.dep]});
        }

       // })
    })
    $("#myModal").modal()

}
function renderPage(){
    requestURL(dataService+"/foundation/getCurrentJobList",{}).done(function(data){
        $("#ETLJobData").bootstrapTable('destroy').bootstrapTable({
            data: _.sortBy(data,function(obj){return -new Date(obj.update_dt).getTime()}),
            pagination: true,
            search: true,
            columns:[
                {
                    field: "",
                    title: "",
                    checkbox:"true",
                    sortable: false
                },{
                    field: "id",
                    title: "InternalID",
                    visible:false,
                    sortable: true
                }, {
                    field: "project",
                    title: "项目",
                    sortable: false
                },{
                    field: "name",
                    title: "名称",
                    sortable: true
                },{
                    field: "cmd",
                    title: "命令脚本",
                    sortable: true
                },{
                    field: "prior",
                    title: "优先级",
                    sortable: true
                },{
                    field: "owner",
                    title: "拥有者",
                    sortable: true
                },{
                    field: "dep",
                    title: "依赖",
                    width:'500px',
                    sortable: true
                },{
                    field: "update_dt",
                    title: "操作时间",
                    sortable: true
                }/*,{
                    field: "flag",
                    title: "状态",
                    sortable: true,
                    formatter:function(value,row,index){
                        if(value=="1"){
                            return "启用"
                        }else{
                            return "废弃"
                        }

                    }
                }*/,{
                    field: "",
                    title: "操作",
                    sortable: false,
                    formatter:function(value,row,index){
                        if(row.flag=="1"){
                            var strRow = encodeURI(JSON.stringify(row))
                            return '<span value='+(strRow)+'><a id="del" style="cursor:pointer">删除</a> <a id="modify" style="cursor:pointer">修改</a></span>'
                        }else{
                            return ""
                        }

                    }
                }]
        });

    })





}
Template.etljobTmpl.onDestroyed(function () {
    console.log("etljobTmpl.onDestroyed...")
});