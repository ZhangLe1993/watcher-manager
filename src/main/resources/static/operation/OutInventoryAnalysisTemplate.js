Template.OutInventoryAnalysisTemplate.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operationPlatformTab').addClass('active');
    $("#houseTab").addClass('active');
    $("#outHouseTab").addClass('active');
    $('#OutInventoryAnalysisTemplate').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }
    renderPage()
};

function renderPage(){
    getRTData()
}

//自定义弹出层
function customModal(title,data,colums){
    $("#myModal").on('show.bs.modal', function () {
        $("#myModalLabel").text(title)
        $("#modalContent").bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data:data,
            columns: colums
        });
    })
    $("#myModal").modal()
}

function getRTData(){
    requestURL(dataService+"/operationCenter/getOutInventoryAnalysis",{}).done(function(data){
        //
        var obj = _.groupBy(data,function(obj){return obj.warehouse+obj.logisStatus+obj.settleStatus+obj.value})
        var tableData = _.map(_.values(obj),function(ele){
            var head = ele[0]
          return  {
                "warehouse":head.warehouse,
                "value":head.value,
                "logisStatus":head.logisStatus,
                "settleStatus":head.settleStatus,
                "TotalCount": _.reduce(ele,function(num,tmp){return num+parseInt(tmp.TotalCount)},0),
                "SettleAmount": _.reduce(ele,function(num,tmp){return num+parseInt(tmp.SettleAmount)},0)
            }
        })
        $('#rtTable').bootstrapTable('destroy').bootstrapTable({
            data: tableData,
            exportDataType: 'all',
            columns: [{
                field: 'warehouse',
                title: '仓库',
                sortable: true
            },{
                field: 'value',
                title: '出库单状态',
                sortable: true
            },{
                field: 'logisStatus',
                title: '发货单状态',
                sortable: true
            },{
                field: 'settleStatus',
                title: '结算单状态',
                sortable: true
            },{
                field: 'TotalCount',
                title: '数量',
                sortable: true
            },{
                field: 'SettleAmount',
                title: '金额',
                sortable: true
            },{
                field:'#',
                title:'操作',
                sortable:true,
                formatter:function(value,row,index){
                    return "<a class='rt_cus_modal' value='"+row.warehouse+row.logisStatus+row.settleStatus+row.value+"'>详细信息</a>"
                }
            }
            ]
        })

        $("#rtTable").on('click',".rt_cus_modal",function(){
            var key = ($(this).attr("value"))
            customModal("单号详情",_.map((obj[key]),function(ele){
                return {"key":ele.key}
            }),[{
                field: 'key',
                title: '单号',
                sortable:true
            }])
        })
    })

}