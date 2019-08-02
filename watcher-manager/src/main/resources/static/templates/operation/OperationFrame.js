Template.OperationFrame.rendered = function () {

    var listJ = Template.list;
    var type = listJ[0];
    var operationCenter = listJ[1];
    if(isMobile()){
        $('.sidebar-toggle').click();
    }

    //console.log("type"+type);
    //console.log("operationCenter"+operationCenter);
    var query = {
        "date": moment().format("YYYY-MM-DD"),
        "operationCenter": operationCenter
    };
    switch(type*1){
        case 0:
            drawLogisticsQualityInspection(query,operationCenter);
            break;
        case 1:
            drawOPTQualityInspection(query,operationCenter);
            break;
        case 2:
            drawLogisticsQualityWaitInspection(query,operationCenter);
            break;
        case 3:
            drawOPTWaitInspection(query,operationCenter);
            break;
    }

};

var mapObj = {1:'levelCount',16:'levelCount',2:'rejectCount',8:'houseCount',32:'qualityCount'};

//渲染物流质检量数据
var drawLogisticsQualityInspection = function(query,operationCenter){
    //物流质检量 四组：
    requestURL(dataService + "/operationCenter/getLogisticsQualityInspectionFourGroup", query).done(function (data) {
        var levelSum = 0;
        var rejectSum = 0;
        var houseSum = 0;
        var qualitySum = 0;
        _.each(data,function(e){
            if(e.type==1 || e.type==16){
                levelSum = levelSum + e.sum*1;
            }else if(e.type == 2){
                rejectSum = rejectSum + e.sum*1;
            }else if(e.type == 8){
                houseSum = houseSum + e.sum*1;
            }else if(e.type == 32){
                qualitySum = qualitySum + e.sum*1;
            }
        });
        $('#levelCount').html(levelSum);
        $('#rejectCount').html(rejectSum);
        $('#houseCount').html(houseSum);
        $('#qualityCount').html(qualitySum);
    });
    //成色：
    requestURL(dataService + "/operationCenter/getLogisticsQualityInspectionColorSingle", query).done(function (ret) {
        var sum = 0;
        _.each(ret,function(e){
            sum  += e.sum;
        });
        $('#colorCount').html(sum);
        if(sum>0){
            $('#colorCount').parent().attr("style","cursor:pointer");
            $("#colorCount").parent().click(function(){
                popModal('/operation/OperationNextFrame/'+0+'/'+ operationCenter);
            });
        }
    });
};

//渲染OPT质检量数据
var drawOPTQualityInspection = function(query,operationCenter){
    requestURL(dataService + "/operationCenter/getOPTInspectionFourGroup", query).done(function (data) {
        var levelSum = 0;
        var rejectSum = 0;
        var houseSum = 0;
        var qualitySum = 0;
        _.each(data,function(e){
            if(e.type==1 || e.type==16){
                levelSum = levelSum + e.sum*1;
            }else if(e.type == 2){
                rejectSum = rejectSum + e.sum*1;
            }else if(e.type == 8){
                houseSum = houseSum + e.sum*1;
            }else if(e.type == 32){
                qualitySum = qualitySum + e.sum*1;
            }
        });
        $('#levelCount').html(levelSum);
        $('#rejectCount').html(rejectSum);
        $('#houseCount').html(houseSum);
        $('#qualityCount').html(qualitySum);
    });
    //成色 中的四组：
    requestURL(dataService + "/operationCenter/getOPTInspectionColorSingle", query).done(function (ret) {
        var sum = 0;
        _.each(ret,function(e){
            sum  += e.sum;
        });
        $('#colorCount').html(sum);
        if(sum>0){
            $('#colorCount').parent().attr("style","cursor:pointer");
            $("#colorCount").parent().click(function(){
                popModal('/operation/OperationNextFrame/'+1+'/'+ operationCenter);
            });
        }
    });
};

//渲染物流待质检量数据
var drawLogisticsQualityWaitInspection = function(query,operationCenter){

    requestURL(dataService + "/operationCenter/getLogisticsQualityWaitInspectionFiveGroup", query).done(function (data) {
        var levelSum = 0;
        var rejectSum = 0;
        var houseSum = 0;
        var qualitySum = 0;
        var colorSum = 0;
        colorSum = data.color.length*1;
        levelSum = data.level.length*1;
        houseSum = data.house.length*1;
        rejectSum = data.reject.length*1;
        qualitySum = data.quality.length*1;
        $('#levelCount').html(levelSum);
        $('#rejectCount').html(rejectSum);
        $('#houseCount').html(houseSum);
        $('#qualityCount').html(qualitySum);
        $('#colorCount').html(colorSum);
        if(colorSum>0){
            $('#colorCount').parent().attr("style","cursor:pointer;");
            $("#colorCount").parent().click(function(){
                popModal('/operation/OperationNextFrame/'+2+'/'+ operationCenter);
            });
        }
        if(levelSum>0){
            $('#levelCount').parent().attr("style","cursor:pointer;");
            $("#levelCount").parent().click(function(){
                customModal("定级质检明细", data.level,[{
                    field:"product_no",
                    title:"物品编号",
                    sortable:true
                },
                {
                    field:"receipt_dt",
                    title:"收货时间",
                    sortable:true
                },
                {
                    field:"is_receipt",
                    title:"是否接收",
                    sortable:true
                }
                ]);
            });
        }
        if(rejectSum>0){
            $('#rejectCount').parent().attr("style","cursor:pointer;");
            $("#rejectCount").parent().click(function(){
                customModal("定级质检明细", data.reject,[{
                    field:"product_no",
                    title:"物品编号",
                    sortable:true
                },
                {
                    field:"created_dt",
                    title:"创建时间",
                    sortable:true
                },
                {
                    field:"transfer_dt",
                    title:"移交时间",
                    sortable:true
                },
                {
                    field:"is_receipt",
                    title:"是否接收",
                    sortable:true
                }
                ]);
            });
        }
        if(houseSum>0){
            $('#houseCount').parent().attr("style","cursor:pointer;");
            $("#houseCount").parent().click(function(){
                customModal("定级质检明细", data.house,[{
                    field:"product_no",
                    title:"物品编号",
                    sortable:true
                },
                {
                    field:"created_dt",
                    title:"创建时间",
                    sortable:true
                },
                {
                    field:"transfer_dt",
                    title:"移交时间",
                    sortable:true
                },
                {
                    field:"is_receipt",
                    title:"是否接收",
                    sortable:true
                }
                ]);
            });
        }
        if(qualitySum>0){
            $('#qualityCount').parent().attr("style","cursor:pointer;");
            $("#qualityCount").parent().click(function(){
                customModal("定级质检明细", data.quality,[{
                    field:"product_no",
                    title:"物品编号",
                    sortable:true
                },
                {
                    field:"created_dt",
                    title:"创建时间",
                    sortable:true
                },
                {
                    field:"transfer_dt",
                    title:"移交时间",
                    sortable:true
                },
                {
                    field:"is_receipt",
                    title:"是否接收",
                    sortable:true
                }
                ]);
            });
        }
    });
};

//渲染OPT待质检量数据
var drawOPTWaitInspection = function(query,operationCenter){

    requestURL(dataService + "/operationCenter/getOPTWaitInspectionFiveGroup", query).done(function (data) {
        var levelSum = 0;
        var rejectSum = 0;
        var houseSum = 0;
        var qualitySum = 0;
        var colorSum = 0;
        colorSum = data.color.length*1;
        levelSum = data.level.length*1;
        houseSum = data.house.length*1;
        rejectSum = data.reject.length*1;
        qualitySum = data.quality.length*1;
        $('#levelCount').html(levelSum);
        $('#rejectCount').html(rejectSum);
        $('#houseCount').html(houseSum);
        $('#qualityCount').html(qualitySum);
        $('#colorCount').html(colorSum);
        if(colorSum>0){
            $('#colorCount').parent().attr("style","cursor:pointer;");
            $("#colorCount").parent().click(function(){
                popModal('/operation/OperationNextFrame/'+3+'/'+ operationCenter);
            });
        }
        if(levelSum>0){
            $('#levelCount').parent().attr("style","cursor:pointer;");
            $("#levelCount").parent().click(function(){
                customModal("定级质检明细", data.level,[{
                    field:"product_no",
                    title:"物品编号",
                    sortable:true
                },
                {
                    field:"serial_no",
                    title:"收货单号",
                    sortable:true
                },
                {
                    field:"receipt_dt",
                    title:"收货时间",
                    sortable:true
                },
                {
                    field:"is_receipt",
                    title:"是否接收",
                    sortable:true
                }
                ]);
            });
        }
        if(rejectSum>0){
            $('#rejectCount').parent().attr("style","cursor:pointer;");
            $("#rejectCount").parent().click(function(){
                customModal("定级质检明细", data.reject,[{
                    field:"product_no",
                    title:"物品编号",
                    sortable:true
                },
                {
                    field:"serial_no",
                    title:"收货单号",
                    sortable:true
                },
                {
                    field:"created_dt",
                    title:"创建时间",
                    sortable:true
                },
                {
                    field:"transfer_dt",
                    title:"移交时间",
                    sortable:true
                },
                {
                    field:"is_receipt",
                    title:"是否接收",
                    sortable:true
                }
                ]);
            });
        }
        if(houseSum>0){
            $('#houseCount').parent().attr("style","cursor:pointer;");
            $("#houseCount").parent().click(function(){
                customModal("定级质检明细", data.house,[{
                    field:"product_no",
                    title:"物品编号",
                    sortable:true
                },
                {
                    field:"serial_no",
                    title:"收货单号",
                    sortable:true
                },
                {
                    field:"created_dt",
                    title:"创建时间",
                    sortable:true
                },
                {
                    field:"transfer_dt",
                    title:"移交时间",
                    sortable:true
                },
                {
                    field:"is_receipt",
                    title:"是否接收",
                    sortable:true
                }
                ]);
            });
        }
        if(qualitySum>0){
            $('#qualityCount').parent().attr("style","cursor:pointer;");
            $("#qualityCount").parent().click(function(){
                customModal("定级质检明细", data.quality,[{
                    field:"product_no",
                    title:"物品编号",
                    sortable:true
                },
                {
                    field:"serial_no",
                    title:"收货单号",
                    sortable:true
                },
                {
                    field:"created_dt",
                    title:"创建时间",
                    sortable:true
                },
                {
                    field:"transfer_dt",
                    title:"移交时间",
                    sortable:true
                },
                {
                    field:"is_receipt",
                    title:"是否接收",
                    sortable:true
                }
                ]);
            });
        }
    });
};

var popModal = function (href) {
    setTimeout(function () {
        $.fancybox.open([
            {
                type: 'iframe',
                href: href
            }
        ], {
            padding: 0,
            height: 400,
            'width': 500,
            minHeight: 400,
            autoScale: false,
            //fitToView: false,
            //autoSize: false,
            beforeShow: function () {
                this.height = 400;
            }
        });
    }, 400);
};

//自定义弹出层
function customModal(title,data,colums){
    $("#myModal").on('show.bs.modal', function () {
        $("#myModalLabel").text(title)
        $("#modalContent").bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            search: true,
            data:data,
            columns: colums
        });
    })
    $("#myModal").modal()
}
