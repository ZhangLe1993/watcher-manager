Template.productUserTagDataInfo.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#productTab').addClass('active');
    $('#productUserTagDataInfo').addClass('active');

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }
    renderPage();
    };

function renderPage() {

    $("#dataTableTolenrateVenderDown").hide();
    $("#loadingTolenrateVenderDown").show();

    var promise = getProductUserTagInfo();
    promise.done(function (ret) {
        $("#dataTableTolenrateVenderDown").show();
        $("#loadingTolenrateVenderDown").hide();

        //renderTable
        renderTable(ret);
    });

}

function getProductUserTagInfo() {
    //clean parameters
    var dfd = $.Deferred();
    requestURL(dataService + "/product/getProductUserTagInfo", {}).done(function (ret) {
        dfd.resolve(ret)
    });
    return dfd.promise()
}

//day
function renderTable(data) {
        $('#dataTableTolenrateVenderDown').bootstrapTable('destroy').bootstrapTable({
            data: data,
            select:true,
            columns:[{
                field:'id',
                title:'标签id',
                sortable:true
            },{
                field:'comment',
                title:'标签名称',
                sortable:true
            },{
            field:'#',
            title:'操作',
            sortable:true,
            formatter:function(value,row,index) {
                return "<a href='javascript:;' class='dc-btn' data-id='" + row.id + "'>导出</a>"
                }
            }]
        });
}

$(function () {
    $('.skin-blue').on('click', '.dc-btn', function () {
        $("#wholePage").mask({'label':"请等待，文件正在导出，大约1分钟..."});
        $.ajax({
            url:'http://10.252.106.247:8899/script/hadoop/exportProductUserTagInfo?id=' + $(this).data('id'),
            success: function (data) {
                sleep(60000)
                window.location.href = data;
                $("#wholePage").unmask();
            }
        })
    })
})

function sleep(numberMillis) {
    var now = new Date();
    var exitTime = now.getTime() + numberMillis;
    while (true) {
        now = new Date();
        if (now.getTime() > exitTime)
            return;
    }
}




