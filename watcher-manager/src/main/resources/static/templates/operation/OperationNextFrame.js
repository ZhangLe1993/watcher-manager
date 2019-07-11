Template.OperationNextFrame.rendered = function () {

    var type = this.data.type;
    var operationCenter = this.data.operationCenter;
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

//渲染物流质检量 -成色 数据
var drawLogisticsQualityInspection = function(query,operationCenter){
    //物流质检量 四组：
    requestURL(dataService + "/operationCenter/getLogisticsQualityInspectionColorSingle", query).done(function (data) {
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
};

//渲染OPT质检量数据
var drawOPTQualityInspection = function(query,operationCenter){
    //物流质检量 四组：
    requestURL(dataService + "/operationCenter/getOPTInspectionColorSingle", query).done(function (data) {
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
};

//渲染物流待质检量数据
var drawLogisticsQualityWaitInspection = function(query,operationCenter){
    requestURL(dataService + "/operationCenter/getLogisticsQualityWaitInspectionColorSingle", query).done(function (data) {
        //console.log(data);
        var levelSum = 0;
        var rejectSum = 0;
        var houseSum = 0;
        var qualitySum = 0;

        var levelArray = [];
        var rejectArray = [];
        var houseArray = [];
        var qualityArray = [];
        _.each(data,function(e){
            if(e.type=='定级质检(成色)'){
                levelSum = levelSum + 1;
                levelArray.push(e);
            }else if(e.type == '退货质检(成色)'){
                rejectSum = rejectSum + 1;
                rejectArray.push(e);
            }else if(e.type == '仓库抽检(成色)'){
                houseSum = houseSum + 1;
                houseArray.push(e);
            }else if(e.type == '质量抽检(成色)'){
                qualitySum = qualitySum + 1;
                qualityArray.push(e);
            }
        });
        $('#levelCount').html(levelSum);
        $('#rejectCount').html(rejectSum);
        $('#houseCount').html(houseSum);
        $('#qualityCount').html(qualitySum);

        if(levelSum>0){
            $('#levelCount').parent().attr("style","cursor:pointer;");
            $("#levelCount").parent().click(function(){
                customModal("定级质检明细", levelArray,[{
                    field:"product_no",
                    title:"物品编号",
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
                customModal("退货质检明细", rejectArray,[{
                    field:"product_no",
                    title:"物品编号",
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
                customModal("仓库抽检明细", houseArray,[{
                    field:"product_no",
                    title:"物品编号",
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
                customModal("质量抽检明细", qualityArray,[{
                    field:"product_no",
                    title:"物品编号",
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

//渲染OPT质检量数据
var drawOPTWaitInspection = function(query,operationCenter){
    requestURL(dataService + "/operationCenter/getOPTWaitInspectionColorSingle", query).done(function (data) {
        //console.log(data);
        var levelSum = 0;
        var rejectSum = 0;
        var houseSum = 0;
        var qualitySum = 0;

        var levelArray = [];
        var rejectArray = [];
        var houseArray = [];
        var qualityArray = [];
        _.each(data,function(e){
            if(e.type=='定级质检(成色)'){
                levelSum = levelSum + 1;
                levelArray.push(e);
            }else if(e.type == '退货质检(成色)'){
                rejectSum = rejectSum + 1;
                rejectArray.push(e);
            }else if(e.type == '仓库抽检(成色)'){
                houseSum = houseSum + 1;
                houseArray.push(e);
            }else if(e.type == '质量抽检(成色)'){
                qualitySum = qualitySum + 1;
                qualityArray.push(e);
            }
        });
        $('#levelCount').html(levelSum);
        $('#rejectCount').html(rejectSum);
        $('#houseCount').html(houseSum);
        $('#qualityCount').html(qualitySum);

        if(levelSum>0){
            $('#levelCount').parent().attr("style","cursor:pointer;");
            $("#levelCount").parent().click(function(){
                customModal("定级质检明细", levelArray,[{
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
                customModal("退货质检明细", rejectArray,[{
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
                customModal("仓库抽检明细", houseArray,[{
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
                customModal("质量抽检明细", qualityArray,[{
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
                    field:"is_receipt",
                    title:"是否接收",
                    sortable:true
                }
                ]);
            });
        }
    });
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