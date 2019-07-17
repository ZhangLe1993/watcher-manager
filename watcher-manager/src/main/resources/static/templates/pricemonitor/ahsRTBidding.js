Template.ahsRTBidding.rendered = function () {

    renderPage()
};

function renderPage(){
    getRTAHSAJHSaleNumAndAmount()        /*爱回收，爱机汇的实时数据*/

    getRTInventoryNumAndAmount()
}
    //自定义弹出层
function customModal(category,title,data){
        $("#myModal").on('show.bs.modal', function () {
            $("#myModalLabel").text(title)
            $("#modalContent").bootstrapTable('destroy').bootstrapTable({
                exportDataType: 'all',
                data:data,
                cdataExport: "CSalesdataExport",
                columns: [{
                            field:'CreatedDt',
                            title:'时间',
                            sortable:true
                        },
                        {
                            field:'SettleSerialNo',
                            title:'结算单',
                            sortable:true
                        },
                        {
                            field:'product_no',
                            title:'物品编号',
                            sortable:true
                        },
                        {
                            field:'supply_order_no',
                            title:'订单号',
                            sortable:true
                        },
                        {
                            field:'settlement_list_status',
                            title:'结算单状态',
                            sortable:true
                        },
                        {
                            field:'settlement_detail_status',
                            title:'结算单明细状态',
                            sortable:true
                        },
                        {
                            field:'status',
                            title:'订单状态',
                            sortable:true
                        },
                        {
                            field:'supply_name',
                            title:'供应商',
                            sortable:true
                        },{
                            field:'recycler_name',
                            title:'回收商',
                            sortable:true
                        },{
                            field:'operation',
                            title:'收货运营中心',
                            sortable:true
                        },
                        {
                            field:'category',
                            title:'品类',
                            sortable:true
                        },
                        {
                            field:'brand',
                            title:'品牌',
                            sortable:true
                        },
                        {
                            field:'product',
                            title:'商品',
                            sortable:true
                        },
                        {
                            field:'sku_name',
                            title:'sku',
                            sortable:true
                        },
                        {
                            field:'level_name',
                            title:'level',
                            sortable:true
                        },
                        {
                            field:'imei',
                            title:'imei',
                            sortable:true
                        },
                        {
                            field:'tag',
                            title:'标签',
                            sortable:true
                        },
                        {
                            field:'quotation_price',
                            title:'竞价金额',
                            sortable:true
                        },
                        {
                            field:'inventory_price',
                            title:'供货金额',
                            sortable:true
                        }
                    ]
            });
            $("#CSalesdataExport").click(function(){
                var query={category:"AHS"}

                requestURL(dataService+"/opt/exportAHSRTSaleData",query).done(function(result){
                            var url = Meteor.settings.public.downloadService.baseUrl+result.path
                            console.log("url:" + url)
                            var link = document.createElement("a");
                            link.href = url;
                            link.style = "visibility:hidden";
                            document.body.appendChild(link);
                            link.click();
                            document.body.removeChild(link);
                })
            })
        })
        $("#myModal").modal()
}

function getRTInventoryNumAndAmount(){

    requestURL(dataService+"/opt/getRTInventoryNumAndAmount",{}).done(function(result){
        //按标签分组
        //var groupData=_.groupBy(result.data,"tag");
        var filterData=_.filter(result.data,function(arr){
            return arr["tag"]=="爱回收"
        })
        //var tagMap={"爱回收":"AHS"} //B2B代拍是OPT&OPT外采之和
        //console.log(groupData)
        //初始化分组的数量和金额
        var tempSum={"爱回收":0}
        var tempAmount={"爱回收":0}

        //遍历分组，获取各个分组总数量和总金额
        var key="爱回收"
        tempSum[key]=filterData.length;
       //key=爱回收/爱机汇/OPT/外采OPT
        tempAmount[key]=(_.reduce(filterData,function(num,tmp){return num + parseInt(tmp["amount"])},0))

         $("#inventoryAHSNum").html(tempSum["爱回收"]);
         $("#inventoryAHSAmount").html("￥" + tempAmount["爱回收"].toLocaleString())
         $("#inventoryTable").bootstrapTable('destroy').bootstrapTable({
                         data: filterData,
                         pagination: true,
                         pageSize: 10,
                         search: true,
                         exportDataType:'all',
                         cdataExport: "CInventorydataExport",
                         columns:[
                             {
                                      field:'date',
                                      title:'入库日期',
                                      sortable:true
                                  },
                                  {
                                      field:'tag',
                                      title:'来源分类',
                                      sortable:true
                                  },{
                                      field:'tag_name',
                                      title:'物品标签',
                                      sortable:true
                                  },{
                                      field:'inventory_serial_number',
                                      title:'物品编号',
                                      sortable:true
                                  },{
                                      field:'purchase_no',
                                      title:'代拍订单号',
                                      sortable:true
                                  },{
                                      field:'imei',
                                      title:'imei',
                                      sortable:true
                                  },
                                  {
                                      field:'category',
                                      title:'品类',
                                      sortable:true
                                  },
                                  {
                                      field:'brand',
                                      title:'品牌',
                                      sortable:true
                                  },
                                  {
                                      field:'product',
                                      title:'商品',
                                      sortable:true
                                  },
                                  {
                                      field:'sku',
                                      title:'sku',
                                      sortable:true
                                  },
                                  {
                                      field:'level',
                                      title:'level',
                                      sortable:true
                                  },
                                  {
                                      field:'recyclerName',
                                      title:'供应商',
                                      sortable:true
                                  },
                                  {
                                      field:'operationCenter',
                                      title:'收货运营中心',
                                      sortable:true
                                  },
                                  {
                                      field:'shelf_name',
                                      title:'库位',
                                      sortable:true
                                  },
                                  {
                                      field:'amount',
                                      title:'库存金额',
                                      sortable:true
                                  },
                                {
                                     field:'inventory_operation_datetime',
                                     title:'操作时间',
                                     sortable:true
                                 },
                                  {
                                       field:'warehouse_name',
                                       title:'仓库名称',
                                       sortable:true
                                   }
                         ]
                     })
         $("#CInventorydataExport").click(function(){
             requestURL(dataService+"/opt/exportAHSRTInventoryData",{}).done(function(result){
                var url = Meteor.settings.public.downloadService.baseUrl+result.path
                console.log("url:" + url)
                var link = document.createElement("a");
                link.href = url;
                link.style = "visibility:hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
             })
          })
    })

}
function getRTAHSAJHSaleNumAndAmount(){ //AJH/AHS
    var tempNum={"爱回收":0};
    var tempAmount={"爱回收":0}
    var tagMap={"爱回收":"AHS"}

    requestURL(dataService+"/opt/getRTAHSAJHSaleNumAndAmount",{date:new Date().getNewDate(0)}).done(function(result){
        //var groupData=_.groupBy(result.data,"tag")
         var filterData=_.filter(result.data, function(arr){
            return arr["tag"]=='爱回收'
         })
            //console.log(groupData)
         //遍历分组,将获取的数据放入临时对象
        var key="爱回收"
        tempNum[key]=filterData.length;
        tempAmount[key]=_.reduce(filterData,function(num,temp){ return num+parseInt(temp["quotation_price"])},0)
        $('#sale' + tagMap[key] + "Num").parent().click(function(){
            customModal("AHS",key + "销售详情", filterData)
        });

         //直营的数量和金额
         $("#saleAHSNum").html(tempNum["爱回收"])
         $("#saleAHSAmount").html("￥"+ tempAmount['爱回收'].toLocaleString())
    })

}

