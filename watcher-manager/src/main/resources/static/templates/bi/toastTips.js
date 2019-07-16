Template.toastTipsTmpl.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#BITab').addClass('active');
    $('#toastTipsTmpl').addClass('active');
    if(isMobile()){
        $('.sidebar-toggle').click();
    }
    //renderTable();
    $("#add").click(function(){
        var tips = $("#tips").val()
        if(tips.trim==""){
            alert("请填写消息内容！");
            return
        }
        Meteor.call('ToastTipsInsert', tips, function (error, result) {
            if (error) {
                alert("Execution Failed");
            } else {
                alert("Record Added")
                $('#tips').val("");
                //renderTable()
            }
        });
    })

    $("#table").on('click','.tipsStatus',function(){
        Meteor.call('ToastTipsCancel',$(this).attr("data"), function (error, result) {
            if (error) {
                alert("Execution Failed");
            } else {
                //renderTable()
            }
        })
    })
    // Deps.autorun(function () {
    //     if (location.pathname.indexOf('/bi/toastTips') > -1) {
    //         renderTable();
    //     }
    // });

}

function renderTable(){
    var data = toastTipsStats.find({},{sort: {flag:-1,updateDt: -1}}).fetch()
    $('#table').bootstrapTable('destroy').bootstrapTable({
        data: data,
        pagination: true,
        search: true,
        singleSelect: true,
        columns:[
            {
                field:'updateDt',
                title:'时间',
                sortable:true,

            },
            {
                field:'tips',
                title:'提示内容',
                sortable:true,

            },
            {
                field:'flag',
                title:'状态',
                sortable:true,
                formatter:function(value,row,index){
                    if(value==1){
                        return "<a href='javascript:void(0)' class='tipsStatus' data='"+row._id+"'>正常</a>"
                    }else{
                        return "取消"
                    }
                }
            },
        ]
    })


}
