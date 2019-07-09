Template.realTimeSampling.rendered = function () {
    $('.navi-tab').removeClass('active');
    this.autorun(function () {
        var from = Template.currentData().from;
        switch(from){
            case "1":
                $('#pjtrtSideTab').addClass('active');
                $('#realTimeSampling').addClass('active');
                operationCenter = "0";
                break;
            case "2":
                operationCenter = Template.currentData().OperationCenter;
                switch (parseInt(operationCenter)) {
                    case 1:
                        $('#operation').addClass('active');
                        $('#shanghaiRealTimeSampling').addClass('active');
                        $('#shanghaiOperationCenter').addClass('active');
                        break;
                    case 12:
                        $('#operation').addClass('active');
                        $('#shanghaiTestRealTimeSampling').addClass('active');
                        $('#shanghaiTestOperationCenter').addClass('active');
                        break;
                    case 2:
                        $('#operation').addClass('active');
                        $('#beijingRealTimeSampling').addClass('active');
                        $('#beijingOperationCenter').addClass('active');
                        break;
                    case 3:
                        $('#operation').addClass('active');
                        $('#chengduRealTimeSampling').addClass('active');
                        $('#chengduOperationCenter').addClass('active');
                        break;
                    case 4:
                        $('#operation').addClass('active');
                        $('#shenzhenRealTimeSampling').addClass('active');
                        $('#shenzhenOperationCenter').addClass('active');
                        break;
                    case 16:
                        $('#operation').addClass('active');
                        $('#shenzhenNewRealTimeSampling').addClass('active');
                        $('#shenzhenNewOperationCenter').addClass('active');
                        break;
                    case 21:
                        $('#operation').addClass('active');
                        $('#shenzhenTestRealTimeSampling').addClass('active');
                        $('#shenzhenTestOperationCenter').addClass('active');
                        break;
                    case 5:
                        $('#operation').addClass('active');
                        $('#tianjinRealTimeSampling').addClass('active');
                        $('#tianjinOperationCenter').addClass('active');
                        break;
                    case 6:
                        $('#operation').addClass('active');
                        $('#wuhanRealTimeSampling').addClass('active');
                        $('#wuhanOperationCenter').addClass('active');
                        break;
                    case 10:
                        $('#operation').addClass('active');
                        $('#changzhouRealTimeSampling').addClass('active');
                        $('#changzhouOperationCenter').addClass('active');
                        break;
                    case 0:
                        $('#operation').removeClass('active');
                        $('#operationPlatformTab').addClass('active');
                        $("#overviewOperatingCentersTab").addClass('active');
                        $('#chinaRealTimeSampling').addClass('active');
                        break;
                    case 18:
                        $('#operation').addClass('active');
                        $('#changzhouTestRealTimeSampling').addClass('active');
                        $('#changzhouTestOperationCenter').addClass('active');
                        break;
                    default:
                        break;
                }
                break;
        }
        //渲染公共部分
        initForceMap(from);
        initColorMap(from);
        drawPublic();
        initSerialMap();
        initUrlMap();
        initTableColumnMap();
        initExportLinkMap();
        //初始化只显示质检
        switchToShow('qualityInspection');
        //渲染质检页面
        drawQualityInspection();
        //drawRandomInspection();
        //提示框
        toolTipCustom();
    });

};
var operationCenter = "0";

var colorMap = new Map();

var initColorMap = function(from){
    colorMap = new Map();
    //尚未实现的环节
    colorMap.set('提交','#999');
    //colorMap.set('取货','#999');
    colorMap.set('门店仓库','#999');
    colorMap.set('发货','#999');
    colorMap.set('收货','#999');
    colorMap.set('隐私清除','#999');
    colorMap.set('付款','#999');
    colorMap.set('回收商退货','#999');
    colorMap.set('结束','#999');
    //已经实现的环节
    colorMap.set('RQC','#1b9acf');
    colorMap.set('异常','#1b9acf');
    colorMap.set('定级质检','orange');
    colorMap.set('IPQC','#1b9acf');
    colorMap.set('暂存','#1b9acf');
    colorMap.set('UQC','#1b9acf');
    colorMap.set('用户退货','#1b9acf');
    colorMap.set('入库','#1b9acf');
    colorMap.set('退货审核','#1b9acf');
    colorMap.set('隐私清除','#1b9acf');
    colorMap.set('库存','#1b9acf');
    colorMap.set('竞拍','#1b9acf');
    colorMap.set('锁库','#1b9acf');
    colorMap.set('仓库抽检','#1b9acf');
    colorMap.set('出库','#1b9acf');
    switch(from) {
        case "1":
            colorMap.set('维修','#1b9acf');
            serialList = ['异常','定级质检','RQC','IPQC','UQC','维修','隐私清除','仓库抽检','退货审核','入库','暂存','用户退货','出库','库存','竞拍','锁库'];
            break;
        case "2":
            colorMap.set('维修','#999');
            //将维修等环节设置为不可用状态
            serialList = ['异常','定级质检','RQC','IPQC','UQC','仓库抽检','隐私清除','退货审核','入库','暂存','用户退货','出库','库存','竞拍','锁库'];
            break;
        default:
            colorMap.set('维修','#1b9acf');
            serialList = ['异常','定级质检','RQC','IPQC','UQC','维修','仓库抽检','隐私清除','退货审核','入库','暂存','用户退货','出库','库存','竞拍','锁库'];
            break;
    }
};

var forceMap = new Map();
var initForceMap = function(from){
    forceMap = new Map();
    forceMap.set('异常','exception');
    forceMap.set('定级质检','qualityInspection');
    forceMap.set('RQC','RQC');
    forceMap.set('IPQC','IPQC');
    forceMap.set('UQC','UQC');
    forceMap.set('仓库抽检','randomInspection');
    forceMap.set('隐私清除','privacyClear');
    forceMap.set('入库','inWareHouse');
    forceMap.set('暂存','provisionalTally');
    forceMap.set('用户退货','userReturns');
    forceMap.set('出库','outWareHouse');
    forceMap.set('库存','realTimeInventory');
    forceMap.set('竞拍','auction');
    forceMap.set('退货审核','rejectAudit');
    forceMap.set('锁库','lockStock');
    switch(from) {
        case "1":
            forceMap.set('维修','repair');
            break;
        case "2":
            break;
        default:
            forceMap.set('维修','repair');
            break;
    }
};
var serialList = ['异常','定级质检','RQC','IPQC','UQC','维修','隐私清除','仓库抽检','退货审核','入库','暂存','用户退货','出库','库存','竞拍','锁库'];
var serialMap = new Map();
var initSerialMap = function(){
    serialMap = new Map();
    serialMap.set('异常',14);
    serialMap.set('定级质检',3);
    serialMap.set('RQC',16);
    serialMap.set('IPQC',4);
    serialMap.set('UQC',18);
    serialMap.set('维修',19);
    serialMap.set('仓库抽检',20);
    serialMap.set('隐私清除',15);
    serialMap.set('退货审核',21);
    serialMap.set('入库',5);
    serialMap.set('暂存',6);
    serialMap.set('用户退货',17);

    serialMap.set('出库',11);

    serialMap.set('库存',8);
    serialMap.set('竞拍',9);
    serialMap.set('锁库',23);
};


var urlMap = new Map();
var initUrlMap = function(){
    urlMap = new Map();
    //modelName  -->   url
    urlMap.set('exception','/orderAfter/getExceptionDetailByParam');
    urlMap.set('qualityInspection','/orderAfter/getQualityInspectionDetailByParam');
    urlMap.set('RQC','/orderAfter/getRQCDetailByParam');
    urlMap.set('IPQC','/orderAfter/getIPQCDetailByParam');
    urlMap.set('UQC','/orderAfter/getUQCDetailByParam');
    //urlMap.set('维修','');          //维修和仓库抽检   沿用 最开始的逻辑
    //urlMap.set('仓库抽检','');
    urlMap.set('returnInspection','/orderAfter/getReturnInspectionDetailByParam');
    urlMap.set('inWareHouse','/orderAfter/getInWareHouseDetailByParam');
    urlMap.set('provisionalTally','/orderAfter/getProvisionalTallyDetailByParam');
    urlMap.set('userReturns','/orderAfter/getUserReturnsDetailByParam');
    urlMap.set('rejectAudit','/orderAfter/getRejectAuditDetailByParam');
    urlMap.set('outWareHouse','/orderAfter/getOutWareHouseDetailByParam');
    urlMap.set('realTimeInventory','/orderAfter/getRealTimeInventoryDetailByParam');
    urlMap.set('auction','/orderAfter/getAuctionDetailByParam');
    urlMap.set('lockStock','/orderAfter/getLockStockDetailByParam');

    urlMap.set('privacyClear','/orderAfter/getPrivacyClearDetailByParam');
};

var tableColumnMap = new Map();
var initTableColumnMap = function(){
    tableColumnMap = new Map();
    tableColumnMap.set('exception',[
        {
            field:'created_dt',
            title:'异常单创建时间',
            sortable:true
        },
        {
            field:'exception_no',
            title:'异常单号',
            sortable:true
        },
        {
            field:'product_no',
            title:'物品编号',
            sortable:true
        },
        {
            field:'express_serial_no',
            title:'快递单号',
            sortable:true
        },
        {
            field:'receive_serial_no',
            title:'收货单号',
            sortable:true
        },
        {
            field:'hour',
            title:'时长(天)',
            sortable:true
        },
        {
            field:'agent_no',
            title:'业务方',
            sortable:true
        },
        {
            field:'next_agent_no',
            title:'二级业务方',
            sortable:true
        },
        {
            field:'operational_centre_name',
            title:'运营中心',
            sortable:true
        }]);

    tableColumnMap.set('qualityInspection',[
        {
            field:'dt',
            title:'收货完成时间',
            sortable:true
        },
        {
            field:'transfer_product_no',
            title:'物品编号',
            sortable:true
        },
        {
            field:'receive_serial_no',
            title:'收货单号',
            sortable:true
        },
        {
            field:'hour',
            title:'时长(天)',
            sortable:true
        },
        {
            field:'agent_no',
            title:'业务方',
            sortable:true
        },
        {
            field:'next_agent_no',
            title:'二级业务方',
            sortable:true
        },
        {
            field:'operational_centre_name',
            title:'运营中心',
            sortable:true
        },
        {
            field:'is_exception',
            title:'是否异常未处理',
            sortable:true
        }]);

    tableColumnMap.set('RQC',[
        {
            field:'dt',
            title:'收货完成时间',
            sortable:true
        },
        {
            field:'transfer_product_no',
            title:'物品编号',
            sortable:true
        },
        {
            field:'hour',
            title:'时长(天)',
            sortable:true
        },
        {
            field:'serial_no',
            title:'收货单号',
            sortable:true
        },
        {
            field:'agent_no',
            title:'业务方',
            sortable:true
        },
        {
            field:'next_agent_no',
            title:'二级业务方',
            sortable:true
        },
        {
            field:'operational_centre_id',
            title:'运营中心',
            sortable:true
        },
        {
            field:'is_exception',
            title:'是否异常未处理',
            sortable:true
        }]);

    tableColumnMap.set('IPQC',[
        {
            field:'dt',
            title:'定级质检完成时间',
            sortable:true
        },
        {
            field:'transfer_product_no',
            title:'物品编号',
            sortable:true
        },
        {
            field:'receive_serial_no',
            title:'收货单号',
            sortable:true
        },
        {
            field:'hour',
            title:'时长(天)',
            sortable:true
        },
        {
            field:'agent_no',
            title:'业务方',
            sortable:true
        },
        {
            field:'next_agent_no',
            title:'二级业务方',
            sortable:true
        },
        {
            field:'operational_centre_name',
            title:'运营中心',
            sortable:true
        },
        {
            field:'is_exception',
            title:'是否异常未处理',
            sortable:true
        }]);

    tableColumnMap.set('UQC',[
        {
            field:'dt',
            title:'申请重验/退货时间',
            sortable:true
        },
        {
            field:'transfer_product_no',
            title:'物品编号',
            sortable:true
        },
        {
            field:'hour',
            title:'时长(天)',
            sortable:true
        },
        {
            field:'serial_no',
            title:'收货单号',
            sortable:true
        },
        {
            field:'agent_no',
            title:'业务方',
            sortable:true
        },
        {
            field:'next_agent_no',
            title:'二级业务方',
            sortable:true
        },
        {
            field:'operational_centre_id',
            title:'运营中心',
            sortable:true
        },
        {
            field:'is_exception',
            title:'是否异常未处理',
            sortable:true
        }]);
    //urlMap.set('维修','');          //维修和仓库抽检   沿用 最开始的逻辑
    //urlMap.set('仓库抽检','');
    tableColumnMap.set('returnInspection',[
        {
            field:'completeTime',
            title:'退货审核完成时间',
            sortable:true
        },
        {
            field:'transfer_product_no',
            title:'物品编号',
            sortable:true
        },
        {
            field:'serial_no',
            title:'收货单号',
            sortable:true
        },
        {
            field:'hour',
            title:'时长(天)',
            sortable:true
        },
        {
            field:'agent_no',
            title:'业务方',
            sortable:true
        },
        {
            field:'next_agent_no',
            title:'二级业务方',
            sortable:true
        },
        {
            field:'operational_centre_name',
            title:'运营中心',
            sortable:true
        },
        {
            field:'is_exception',
            title:'是否异常未处理',
            sortable:true
        }]);

    tableColumnMap.set('inWareHouse',[
        {
            field:'transfer_product_no',
            title:'物品编号',
            sortable:true
        },

        {
            field:'serial_no',
            title:'收货单号',
            sortable:true
        },
        {
            field:'agent_no',
            title:'业务方',
            sortable:true
        },
        {
            field:'next_agent_no',
            title:'二级业务方',
            sortable:true
        },
        {
            field:'inspection_dt',
            title:'验货完成时间',
            sortable:true
        },
        {
            field:'updated_dt',
            title:'状态变更时间',
            sortable:true
        },
        {
            field:'hour',
            title:'时长',
            sortable:true
        },
        {
            field:'operational_centre_id',
            title:'运营中心',
            sortable:true
        },
        {
            field:'transfer_dept',
            title:'移交部门',
            sortable:true
        }]);

    tableColumnMap.set('provisionalTally',[
        {
            field:'transfer_product_no',
            title:'物品编号',
            sortable:true
        },
        {
            field:'serial_no',
            title:'收货单号',
            sortable:true
        },
        {
            field:'agent_no',
            title:'业务方',
            sortable:true
        },
        {
            field:'next_agent_no',
            title:'二级业务方',
            sortable:true
        },
        {
            field:'inspection_dt',
            title:'验货完成时间',
            sortable:true
        },
        {
            field:'hour',
            title:'时长',
            sortable:true
        },
        {
            field:'operational_centre_id',
            title:'运营中心',
            sortable:true
        }]);

    tableColumnMap.set('userReturns',[
        {
            field:'product_no',
            title:'物品编号',
            sortable:true
        },

        {
            field:'serial_no',
            title:'收货单号',
            sortable:true
        },
        {
            field:'agent_no',
            title:'业务方',
            sortable:true
        },
        {
            field:'next_agent_no',
            title:'二级业务方',
            sortable:true
        },
        {
            field:'created_dt',
            title:'退货单创建时间',
            sortable:true
        },
        {
            field:'hour',
            title:'时长',
            sortable:true
        },
        {
            field:'operational_centre_id',
            title:'运营中心',
            sortable:true
        }]);

    tableColumnMap.set('rejectAudit',[
        {
            field:'receipt_dt',
            title:'退货收货时间',
            sortable:true
        },
        {
            field:'product_no',
            title:'物品编号',
            sortable:true
        },
        {
            field:'receive_serial_no',
            title:'收货单号',
            sortable:true
        },
        {
            field:'hour',
            title:'时长(天)',
            sortable:true
        },
        {
            field:'agent_no',
            title:'业务方',
            sortable:true
        },
        {
            field:'next_agent_no',
            title:'二级业务方',
            sortable:true
        },
        {
            field:'operational_centre_name',
            title:'运营中心',
            sortable:true
        }]);

    tableColumnMap.set('outWareHouse',[
        {
            field:'document_item_serial_number',
            title:'物品编号',
            sortable:true
        },

        {
            field:'document_serial_number',
            title:'出库单号',
            sortable:true
        },
        {
            field:'deliver_type',
            title:'发货方式',
            sortable:true
        },
        {
            field:'hour',
            title:'时长',
            sortable:true
        },
        {
            field:'next_agent_no',
            title:'二级业务方',
            sortable:true
        },
        {
            field:'operational_centre',
            title:'运营中心',
            sortable:true
        },
        {
            field:'document_created_datetime',
            title:'创建时间',
            sortable:true
        }]);

    tableColumnMap.set('realTimeInventory',[
        {
            field:'date',
            title:'入库日期',
            sortable:true
        },
        {
            field:'hour',
            title:'时长(天)',
            sortable:true
        },
        {
            field:'tag',
            title:'标签',
            sortable:true
        },
        {
            field:'next_agent_no',
            title:'二级业务方',
            sortable:true
        },
        {
            field:'product_no',
            title:'物品编号',
            sortable:true
        },
        {
            field:'purchase_no',
            title:'代拍订单号',
            sortable:true
        },
        {
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
            field:'skuId',
            title:'skuId',
            sortable:true
        },
        {
            field:'sku',
            title:'sku',
            sortable:true
        },
        {
            field:'levelId',
            title:'levelId',
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
            field:'shelf_code',
            title:'库位编码',
            sortable:true
        },
        {
            field:'shelf_name',
            title:'库位名称',
            sortable:true
        },
        {
            field:'amount',
            title:'金额',
            sortable:true
        },
        {
            field:'tag_name',
            title:'标签描述',
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
        },
        {
            field:'inventory_product_status',
            title:'上架状态',
            sortable:true
        }
    ]);

    tableColumnMap.set('auction',[
        {
            field:'date',
            title:'入库日期',
            sortable:true
        },
        {
            field:'hour',
            title:'时长(天)',
            sortable:true
        },
        {
            field:'tag',
            title:'标签',
            sortable:true
        },
        {
            field:'next_agent_no',
            title:'二级业务方',
            sortable:true
        },
        {
            field:'product_no',
            title:'物品编号',
            sortable:true
        },
        {
            field:'purchase_no',
            title:'代拍订单号',
            sortable:true
        },
        {
            field:'lock_type',
            title:'锁定状态',
            sortable:true
        },
        {
            field:'lock_no',
            title:'锁定单号',
            sortable:true
        },
        {
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
            field:'skuId',
            title:'skuId',
            sortable:true
        },
        {
            field:'sku',
            title:'sku',
            sortable:true
        },
        {
            field:'levelId',
            title:'levelId',
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
            field:'shelf_code',
            title:'库位编码',
            sortable:true
        },
        {
            field:'shelf_name',
            title:'库位名称',
            sortable:true
        },
        {
            field:'amount',
            title:'金额',
            sortable:true
        },
        {
            field:'tag_name',
            title:'标签描述',
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
        },
        {
            field:'inventory_product_status',
            title:'上架状态',
            sortable:true
        }
    ]);

    tableColumnMap.set('lockStock',[
        {
            field:'date',
            title:'入库日期',
            sortable:true
        },
        {
            field:'hour',
            title:'时长(天)',
            sortable:true
        },
        {
            field:'tag',
            title:'标签',
            sortable:true
        },
        {
            field:'next_agent_no',
            title:'二级业务方',
            sortable:true
        },
        {
            field:'product_no',
            title:'物品编号',
            sortable:true
        },
        {
            field:'purchase_no',
            title:'代拍订单号',
            sortable:true
        },
        {
            field:'lock_type',
            title:'锁定状态',
            sortable:true
        },
        {
            field:'lock_no',
            title:'锁定单号',
            sortable:true
        },
        {
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
            field:'skuId',
            title:'skuId',
            sortable:true
        },
        {
            field:'sku',
            title:'sku',
            sortable:true
        },
        {
            field:'levelId',
            title:'levelId',
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
            field:'shelf_code',
            title:'库位编码',
            sortable:true
        },
        {
            field:'shelf_name',
            title:'库位名称',
            sortable:true
        },
        {
            field:'amount',
            title:'金额',
            sortable:true
        },
        {
            field:'tag_name',
            title:'标签描述',
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
        },
        {
            field:'inventory_product_status',
            title:'上架状态',
            sortable:true
        }
    ]);

    tableColumnMap.set('privacyClear',[
        {
            field:'product_no',
            title:'物品编号',
            sortable:true
        },
        {
            field:'product_category_name',
            title:'品类',
            sortable:true
        },
        {
            field:'product_brand_name',
            title:'品牌',
            sortable:true
        },
        {
            field:'transfer_serial_no',
            title:'业务单号',
            sortable:true
        },
        {
            field:'recycle_source_type_name',
            title:'订单来源',
            sortable:true
        },
        {
            field:'recycle_method_name',
            title:'订单交易方式',
            sortable:true
        },
        {
            field:'agent_name',
            title:'业务方',
            sortable:true
        },
        {
            field:'business_source_name',
            title:'业务来源',
            sortable:true
        },
        {
            field:'operational_centre_name',
            title:'运营中心',
            sortable:true
        },
        {
            field:'hour',
            title:'时长(天)',
            sortable:true
        },
        {
            field:'receive_dept',
            title:'接收部门',
            sortable:true
        },
        {
            field:'status',
            title:'理货状态',
            sortable:true
        }
        ]);
};

var exportArr = ['qualityInspection','realTimeInventory','auction','lockStock'];

var exportLinkMap = new Map();
var initExportLinkMap = function(){
    exportLinkMap = new Map();
    exportLinkMap.set('qualityInspection','/orderAfter/exportQualityInspectionDetailByParam');
    exportLinkMap.set('realTimeInventory','/orderAfter/exportRealTimeInventoryDetailByParam');
    exportLinkMap.set('auction','/orderAfter/exportAuctionDetailByParam');
    exportLinkMap.set('lockStock','/orderAfter/exportLockStockDetailByParam');
};

//渲染公共部分
var drawPublic = function(){
    drawForceChart();
};
//渲染流程图
var drawForceChart = function(){
    var forceOption = {
        tooltip: {
            trigger: 'item',
            formatter: function(para){
                if(para.name == 'x' || para.name == 'y'){
                    return '';
                }else if(para.name.indexOf("y") > -1 || para.name.indexOf("x") > -1){
                    return 'RQC > 入库';
                }else{
                    return para.name;
                }
            }
        },
        animationDurationUpdate: 1500,
        animationEasingUpdate: 'quinticInOut',
        textStyle: {
            color:'#000'
        },
        series : [
            {
                type: 'graph',
                tooltip: {
                    backgroundColor:'skyblue',
//                      formatter: "{b} <br/>{a} : {c} h "
                },
                layout: 'none',
                symbolSize: 10,
                roam: false,
                label: {
                    normal: {
                        show: true,
                        position: 'inside',
                        //offset: [0,-60],//居上 20
                        textStyle: {
                            fontSize: 12,
                            color: '#fff',
                            fontWeight: 'BOLD',
                        },
                        formatter:function(para){
                            //2018-11-28日改版，去除 回收商收货 ，为防止以后添加，不改此处的语句，不影响功能
                            if(para.name == '回收商收货' || para.name == '回收商退货'){
                                //console.log(para.name.substring(0,3)+'\n'+para.name.substring(3,5));
                                return para.name.substring(0,3)+'\n'+para.name.substring(3,5);
                            }else if(para.name == '定级质检' || para.name == '门店仓库' || para.name == '隐私清除' || para.name == '用户退货' || para.name == '质量抽检' || para.name == '退货质检' || para.name == '仓库抽检' || para.name == '退货审核'){
                                //console.log(para.name.substring(0,2)+'\n'+para.name.substring(2,4));
                                return para.name.substring(0,2)+'\n'+para.name.substring(2,4);
                            }else if(para.name == 'x' || para.name == 'y'){
                                //转折点不显示
                                return '';
                            }else{
                                return para.name;
                            }
                        }
                    }
                },
                edgeSymbol: ['circle', 'arrow'],
                edgeSymbolSize: [4, 10],
                edgeLabel: {
                    normal: {
                        textStyle: {
                            fontSize: 18
                        }
                    }
                },
                data: [
                    {
                        name: '提交',
                        x: 100,
                        y: 300,
                        value:'提交',
                        //symbol:'rect', //让节点为矩形显示
                        symbolSize: 50,//节点的长和宽
                        itemStyle: {
                            normal: {
                                color: colorMap.get("提交")
                            }
                        }
                    },
                    {
                        name: '发货',
                        x: 200,
                        y: 300,
                        //symbol:'rect',
                        symbolSize: 50,
                        value:'发货',
                        itemStyle: {
                            normal: {
                                color: colorMap.get("发货")
                            }
                        }
                    },
                    {
                        name: '收货',
                        x: 300,
                        y: 300,
                        value:'收货',
                        //symbol:'rect',
                        symbolSize: [50, 50],
                        itemStyle: {
                            normal: {
                                color: colorMap.get("收货")
                            }
                        }
                    },
                    {
                        name: '定级质检',
                        x: 400,
                        y: 300,
                        //symbol:'rect',
                        symbolSize: [50, 50],
                        value:'定级质检',
                        itemStyle: {
                            normal: {
                                color: colorMap.get("定级质检")
                            }
                        }
                    },
                    {
                        name: 'IPQC',
                        x: 500,
                        y: 300,
                        value:'IPQC',
                        //symbol:'rect',
                        symbolSize: [50, 50],
                        itemStyle: {
                            normal: {
                                color: colorMap.get("IPQC")
                            }
                        }
                    },
                    {
                        name: '入库',
                        x: 600,
                        y: 300,
                        value:'入库',
                        //symbol:'rect',
                        symbolSize: [50, 50],
                        itemStyle: {
                            normal: {
                                color: colorMap.get("入库")
                            }
                        }
                    },
                    {
                        name: '暂存',
                        x: 700,
                        y: 300,
                        value:'暂存',
                        //symbol:'rect',
                        symbolSize: [50, 50],
                        itemStyle: {
                            normal: {
                                color: colorMap.get("暂存")
                            }
                        }
                    },
                    {
                        name: 'y',
                        x: 600,
                        y: 400,
                        value:'',
                        //symbol:'rect',
                        symbolSize: [2,2],
                        itemStyle: {
                            normal: {
                                color: '#1b9acf'
                            }
                        }
                    },
                    {
                        name: '库存',
                        x: 800,
                        y: 300,
                        value:'库存',
                        //symbol:'rect',
                        symbolSize: [50, 50],
                        itemStyle: {
                            normal: {
                                color: colorMap.get("库存")
                            }
                        }
                    },
                    {
                        name: '竞拍',
                        x: 900,
                        y: 300,
                        value:'竞拍',
                        //symbol:'rect',
                        symbolSize: 50,
                        itemStyle: {
                            normal: {
                                color: colorMap.get("竞拍")
                            }
                        }
                    },
                    {
                        name: '付款',
                        x: 1000,
                        y: 300,
                        value:'付款',
                        //symbol:'rect',
                        symbolSize: 50,
                        itemStyle: {
                            normal: {
                                color: colorMap.get("付款")
                            }
                        }
                    },
                    {
                        name: '出库',
                        x: 1100,
                        y: 300,
                        value:'出库',
                        //symbol:'rect',
                        symbolSize: 50,
                        itemStyle: {
                            normal: {
                                color: colorMap.get("出库")
                            }
                        }
                    },
                    {
                        name: '结束',
                        x: 1200,
                        y: 300,
                        value:'结束',
                        //symbol:'rect',
                        symbolSize: 50,
                        itemStyle: {
                            normal: {
                                color: colorMap.get("结束")
                            }
                        }
                    },
                    /*{
                        name: '取货',
                        x: 150,
                        y: 200,
                        value:'取货',
                        //symbol:'rect',
                        symbolSize: 50,
                        itemStyle: {
                            normal: {
                                color: colorMap.get("取货")
                            }
                        }
                    },*/
                    {
                        name: '门店仓库',
                        x: 150,
                        y: 400,
                        value:'门店仓库',
                        //symbol:'rect',
                        symbolSize: 50,
                        itemStyle: {
                            normal: {
                                color: colorMap.get("门店仓库")
                            }
                        }
                    },
                    {
                        name: '异常',
                        x: 350,
                        y: 200,
                        value:'异常',
                        //symbol:'rect',
                        symbolSize: 50,
                        itemStyle: {
                            normal: {
                                color: colorMap.get("异常")
                            }
                        }
                    },
                    {
                        name: '隐私清除',
                        x: 700,
                        y: 200,
                        value:'隐私清除',
                        //symbol:'rect',
                        symbolSize: 50,
                        itemStyle: {
                            normal: {
                                color: colorMap.get("隐私清除")
                            }
                        }
                    },
                    {
                        name: 'RQC',
                        x: 300,
                        y: 400,
                        value:'RQC',
                        //symbol:'rect',
                        symbolSize: 50,
                        itemStyle: {
                            normal: {
                                color: colorMap.get("RQC")
                            }
                        }
                    },
                    {
                        name: '用户退货',
                        x: 800,
                        y: 400,
                        value:'用户退货',
                        //symbol:'rect',
                        symbolSize: 50,
                        itemStyle: {
                            normal: {
                                color: colorMap.get("用户退货")
                            }
                        }
                    },
                    {
                        name: 'UQC',
                        x: 700,
                        y: 400,
                        value:'UQC',
                        //symbol:'rect',
                        symbolSize: 50,
                        itemStyle: {
                            normal: {
                                color: colorMap.get("UQC")
                            }
                        }
                    },
                    /*{
                        name: '退货质检',
                        x: 700,
                        y: 500,
                        value:'退货质检',
                        //symbol:'rect',
                        symbolSize: 50,
                        itemStyle: {
                            normal: {
                                color: colorMap.get("退货质检")
                            }
                        }
                    },*/
                    {
                        name: '维修',
                        x: 800,
                        y: 200,
                        value:'维修',
                        //symbol:'rect',
                        symbolSize: 50,
                        itemStyle: {
                            normal: {
                                color: colorMap.get("维修")
                            }
                        }
                    },
                    {
                        name: '仓库抽检',
                        x: 900,
                        y: 200,
                        value:'仓库抽检',
                        //symbol:'rect',
                        symbolSize: 50,
                        itemStyle: {
                            normal: {
                                color: colorMap.get("仓库抽检")
                            }
                        }
                    },
                    {
                        name: '退货审核',
                        x: 600,
                        y: 500,
                        value:'退货审核',
                        //symbol:'rect',
                        symbolSize: 50,
                        itemStyle: {
                            normal: {
                                color: colorMap.get("退货审核")
                            }
                        }
                    },
                    {
                        name: '回收商退货',
                        x: 1100,
                        y: 500,
                        value:'回收商退货',
                        //symbol:'rect',
                        symbolSize: 50,
                        itemStyle: {
                            normal: {
                                color: colorMap.get("回收商退货")
                            }
                        }
                    },
                    {
                        name: '锁库',
                        x: 900,
                        y: 400,
                        value:'锁库',
                        //symbol:'rect',
                        symbolSize: [50, 50],
                        itemStyle: {
                            normal: {
                                color: colorMap.get("锁库")
                            }
                        }
                    }
                ],
                // links: [],
                links: [
                    {
                        source: '提交',
                        target: '发货'
                    },
                    {
                        source: '发货',
                        target: '收货'
                    },
                    {
                        source: '收货',
                        target: 'RQC'
                    },
                    {
                        source: 'RQC',
                        target: 'y'//x是第一个小转折点
                    },
                    {
                        source: 'y',
                        target: '入库'
                    },
                    {
                        source: '收货',
                        target: '定级质检'
                    },
                    {
                        source: '定级质检',
                        target: 'IPQC'
                    },
                    {
                        source: 'IPQC',
                        target: '入库'
                    },
                    {
                        source: '入库',
                        target: '暂存'
                    },
                    {
                        source: '暂存',
                        target: '库存'
                    },
                    {
                        source: '库存',
                        target: '竞拍'
                    },
                    {
                        source: '竞拍',
                        target: '付款'
                    },
                    {
                        source: '付款',
                        target: '出库'
                    },
                    {
                        source: '出库',
                        target: '结束'
                    },
                    {
                        source: '提交',
                        target: '取货'
                    },
                    {
                        source: '提交',
                        target: '门店仓库'
                    },
                    {
                        source: '取货',
                        target: '发货'
                    },
                    {
                        source: '门店仓库',
                        target: '发货'
                    },
                    {
                        source: '收货',
                        target: '异常'
                    },
                    {
                        source: '异常',
                        target: '定级质检'
                    },
                    {
                        source: '暂存',
                        target: '隐私清除'
                    },
                    {
                        source: '暂存',
                        target: 'UQC'
                    },
                    {
                        source: 'UQC',
                        target: '用户退货'
                    },
                    /*{
                        source: '退货质检',
                        target: '入库'
                    },*/
                    {
                        source: '库存',
                        target: '维修'
                    },
                    {
                        source: '库存',
                        target: '仓库抽检'
                    },
                    {
                        source: '仓库抽检',
                        target: '库存'
                    },
                    {
                        source: '维修',
                        target: '仓库抽检'
                    },
                    {
                        source: '退货审核',
                        target: '入库'
                    },
                    {
                        source: '回收商退货',
                        target: '退货审核'
                    },
                    {
                        source: '出库',
                        target: '回收商退货'
                    },
                    {
                        source: '库存',
                        target: '锁库'
                    },
                    {
                        source: '隐私清除',
                        target: '库存'
                    }
                ],
                lineStyle: {
                    normal: {
                        opacity: 0.9,
                        color:'#53B5EA',
                        type: 'dashed',
                        width: 1
                    }
                }
            }
        ]
    };
    var forceChart = echarts.init(document.getElementById('forceChart'));
    forceChart.setOption(forceOption);

    forceChart.on('click', function (handler,context){
        console.log(handler);
        var objName = handler.data.name;
        //console.log(forceOption.series[0]);
        console.log(objName);
        console.log(forceMap.has(objName));
        if(forceMap.has(objName)){
            /*if(handler.data.name=='维修'){
                forceOption.series[0].data[19].itemStyle.normal.color="#1b9acf";
            }else if(handler.data.name=='库存抽检'){
                forceOption.series[0].data[20].itemStyle.normal.color="#1b9acf";
            }*/
            forceOption.series[0].data[serialMap.get(objName)].itemStyle.normal.color="orange";
            _.each(serialList,function(e){
                if(objName != e){
                    forceOption.series[0].data[serialMap.get(e)].itemStyle.normal.color="#1b9acf";
                }
            });
            /*_.map(serialMap,function(value,key){
                console.log(key)
            });*/

            forceChart.setOption(forceOption, false, false);
            var modelName = forceMap.get(objName);
            switchToShow(modelName);
            callModelFun('draw'+modelName.substring(0,1).toLocaleUpperCase()+modelName.substring(1,modelName.length));
        }
        //获取节点点击的数组序号
        //var arrayIndex = handler.dataIndex;
        //获取数据
        //var urlParam = responseData.data.date[arrayIndex];
    });
    window.addEventListener('resize',forceChart.resize);
};
//选择模块加载
var switchToShow = function(tab){
    $("div .row").each(function(){
        var idValue = $(this).attr("id");
        //console.log(idValue);
        if(idValue != undefined && idValue != null && idValue.indexOf(tab) == -1){
            $(this).hide();
        }else{
            $(this).show();
        }
    });
};
//根据方法名调用方法
function callModelFun(functionName) {
    //根据函数名得到函数类型
    var  func = eval(functionName);
    //创建函数对象，并调用
    new func();
}

/**
 * 根据前缀来设置  如
 * quality  qualityRisk
 * RQC      RQCRisk
 * @param shortModelName   别名或者短模块名  与html中设置的保持一致
 * @param num
 * @param money
 * @param hour
 */
var setNumScrollFactory = function(shortModelName, partName, num,money, hour) {
    if(num != -1){
        $("div[name='" + shortModelName + partName + "Num']").lemCounter({
            value_to: num,
            value_from: 0,
            animate_duration: 3,
            locale: 'en-US'
        });
    }

    if(money != -1) {
        $("div[name='" + shortModelName + partName + "Amount']").lemCounter({
            value_to: money,
            value_from: 0,
            animate_duration: 3,
            locale: 'en-US'
        });
    }

    if(hour != -1) {
        var hours_int = parseInt(hour);
        var flt = accSub(hour,hours_int);

        var flt_ln=(hour.toString()).length-(hours_int.toString()).length-1;
        var hours_smart=(flt.toString()).substring(2,(flt_ln+2));

        if(hours_int == '' || hours_int == null){
            hours_int = 0;
        }
        if(hours_smart == '' || hours_smart == null){
            hours_smart = 0;
        }
        var isFirst = $("div[name='" + shortModelName + partName + "-counter-all-hours']").attr("load-is");
        if(isFirst=='first'){
            $("div[name='" + shortModelName + partName + "-counter-all-hours']").html('');
            $("div[name='" + shortModelName + partName + "-counter-all-hours']").append('<span name="' + shortModelName + partName + '-counter-all-hours-int">0</span>');
            $("div[name='" + shortModelName + partName + "-counter-all-hours']").append('<span name="' + shortModelName + partName + '-counter-all-hours-split">.</span>');
            $("div[name='" + shortModelName + partName + "-counter-all-hours']").append('<span name="' + shortModelName + partName + '-counter-all-hours-smart">0</span>');
            $("div[name='" + shortModelName + partName + "-counter-all-hours']").attr("load-is","other");
        }
        scrollNumForSpan(shortModelName + partName + '-counter-all-hours-int', 0, hours_int);
        scrollNumForSpan(shortModelName + partName + '-counter-all-hours-smart', 0, hours_smart);
    }
};

//公用锁
var UNLOCK_PUBLIC = true;

var clickFunFactory = function(shortModelName, modelName){//quality   qualityInspection
    $("div["+shortModelName+"-to-show-click='true']").each(function(){
        $(this).click(function() {
            if(UNLOCK_PUBLIC){
                UNLOCK_PUBLIC = false;
                $("#"+modelName+"DetailTitle").show();
                $("#"+modelName+"DetailTable").show();
                $("#"+modelName+"TablePanel").hide();
                $("#"+modelName+"LoadingPanel").show();
                $("div["+shortModelName+"-to-show-click='true']").each(function(){
                    $(this).attr("style","cursor:not-allowed;");
                });
                var param = $(this).attr(shortModelName+"-to-show-params");
                try{
                    drawTableFactory(shortModelName,modelName,param);
                }catch(e){
                    UNLOCK_PUBLIC = true;
                }
            }
        });
        //初始化为小手样式
        $(this).attr('style','cursor:pointer;');
    });
};

var drawTableFactory = function(shortModelName, modelName, param){
    switch(param){
        case 'normal':
            console.log('查询:'+modelName+'的总体数据');
            var url = urlMap.get(modelName);
            requestURL(dataService + url,{param:'normal',"operationCenter":operationCenter}).done(function(result){
                if(result.statusText != undefined && result.statusText=='error'){
                    failureReleasePublicLock(false,shortModelName,modelName);
                }else{
                    //此处的modelName为qualityInspection形式
                    $("#"+modelName+"TablePanel").show();
                    $("#"+modelName+"LoadingPanel").hide();
                    if(exportArr.contains(modelName) && result.length > 3000){
                        //执行后端导出
                        $("#"+modelName+"_detail_table").bootstrapTable('destroy').bootstrapTable({
                            data: result,
                            pagination: true,
                            striped: true,
                            pageSize: 10,
                            search: true,
                            pageList: [5, 10, 20, 50, 100, 200],
                            exportDataType:'all',
                            cdataExport: "maintainDataExport",
                            columns:tableColumnMap.get(modelName)
                        });
                        $("#maintainDataExport").click(function(){
                            requestURL(dataService + exportLinkMap.get(modelName),{param:'normal',"operationCenter":operationCenter}).done(function(result){
                                var url = Meteor.settings.public.downloadService.baseUrl+result.path;
                                var link = document.createElement("a");
                                link.href = url;
                                link.style = "visibility:hidden";
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            });
                        });
                    }else{
                        //默认前端bootstrap导出功能
                        $("#"+modelName+"_detail_table").bootstrapTable('destroy').bootstrapTable({
                            data: result,
                            pagination: true,
                            striped: true,
                            pageSize: 10,
                            search: true,
                            pageList: [5, 10, 20, 50, 100, 200],
                            exportDataType:'all',
                            exportTypes: ['csv'],
                            columns:tableColumnMap.get(modelName)
                        });
                    }
                    releasePublicLock(shortModelName);
                }
            });
            break;
        case 'risk':
            console.log('查询:'+modelName+'的风险预警数据');
            var url = urlMap.get(modelName);
            requestURL(dataService + url,{param:'risk',"operationCenter":operationCenter}).done(function(result){
                if(result.statusText != undefined && result.statusText=='error'){
                    failureReleasePublicLock(false,shortModelName,modelName);
                }else{
                    //此处的modelName为qualityInspection形式
                    $("#"+modelName+"TablePanel").show();
                    $("#"+modelName+"LoadingPanel").hide();
                    if(exportArr.contains(modelName) && result.length > 3000){
                        //执行后端导出
                        $("#"+modelName+"_detail_table").bootstrapTable('destroy').bootstrapTable({
                            data: result,
                            pagination: true,
                            striped: true,
                            pageSize: 10,
                            search: true,
                            pageList: [5, 10, 20, 50, 100, 200],
                            exportDataType:'all',
                            cdataExport: "maintainDataExport",
                            columns:tableColumnMap.get(modelName)
                        });
                        $("#maintainDataExport").click(function(){
                            requestURL(dataService + exportLinkMap.get(modelName),{param:'risk',"operationCenter":operationCenter}).done(function(result){
                                var url = Meteor.settings.public.downloadService.baseUrl+result.path;
                                var link = document.createElement("a");
                                link.href = url;
                                link.style = "visibility:hidden";
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                            });
                        });
                    }else{
                        //默认前端bootstrap导出功能
                        $("#"+modelName+"_detail_table").bootstrapTable('destroy').bootstrapTable({
                            data: result,
                            pagination: true,
                            striped: true,
                            pageSize: 10,
                            search: true,
                            pageList: [5, 10, 20, 50, 100, 200],
                            exportDataType:'all',
                            exportTypes: ['csv'],
                            columns:tableColumnMap.get(modelName)
                        });
                    }
                    /*$("#"+modelName+"_detail_table").bootstrapTable('destroy').bootstrapTable({
                        data: result,
                        pagination: true,
                        striped: true,
                        pageSize: 10,
                        search: true,
                        pageList: [5, 10, 20, 50, 100, 200],
                        exportDataType:'all',
                        exportTypes: ['csv'],
                        columns:tableColumnMap.get(modelName)
                    });*/
                    releasePublicLock(shortModelName);
                }
            });
            break;
        case 'high-risk':
            console.log('查询:'+modelName+'的高危预警数据');
            var url = urlMap.get(modelName);
            requestURL(dataService + url,{param:'high',"operationCenter":operationCenter}).done(function(result){
                if(result.statusText != undefined && result.statusText=='error'){
                    failureReleasePublicLock(false,shortModelName,modelName);
                }else{
                    //此处的modelName为qualityInspection形式
                    $("#"+modelName+"TablePanel").show();
                    $("#"+modelName+"LoadingPanel").hide();
                    $("#"+modelName+"_detail_table").bootstrapTable('destroy').bootstrapTable({
                        data: result,
                        pagination: true,
                        striped: true,
                        pageSize: 10,
                        search: true,
                        pageList: [5, 10, 20, 50, 100, 200],
                        exportDataType:'all',
                        exportTypes: ['csv'],
                        columns:tableColumnMap.get(modelName)
                    });
                    releasePublicLock(shortModelName);
                }
            });
            break;
        case 'most-risk':
            console.log('查询:'+modelName+'的极危预警数据');
            var url = urlMap.get(modelName);
            requestURL(dataService + url,{param:'most',"operationCenter":operationCenter}).done(function(result){
                if(result.statusText != undefined && result.statusText == 'error'){
                    failureReleasePublicLock(false,shortModelName,modelName);
                }else{
                    //此处的modelName为qualityInspection形式
                    $("#"+modelName+"TablePanel").show();
                    $("#"+modelName+"LoadingPanel").hide();
                    $("#"+modelName+"_detail_table").bootstrapTable('destroy').bootstrapTable({
                        data: result,
                        pagination: true,
                        striped: true,
                        pageSize: 10,
                        search: true,
                        pageList: [5, 10, 20, 50, 100, 200],
                        exportDataType:'all',
                        exportTypes: ['csv'],
                        columns:tableColumnMap.get(modelName)
                    });
                    releasePublicLock(shortModelName);
                }
            });
            break;
        default:
            var url = urlMap.get(modelName);
            requestURL(dataService + url,{param:'-1'}).done(function(result){
                if(result.statusText != undefined && result.statusText=='error'){
                    failureReleasePublicLock(false,shortModelName,modelName);
                }else{
                    //此处的modelName为qualityInspection形式
                    $("#"+modelName+"TablePanel").show();
                    $("#"+modelName+"LoadingPanel").hide();
                    $("#"+modelName+"_detail_table").bootstrapTable('destroy').bootstrapTable({
                        data: result,
                        pagination: true,
                        striped: true,
                        pageSize: 10,
                        search: true,
                        pageList: [5, 10, 20, 50, 100, 200],
                        exportDataType:'all',
                        exportTypes: ['csv'],
                        columns:tableColumnMap.get(modelName)
                    });
                    releasePublicLock(shortModelName);
                }
            });
            break;
    }

};

var failureReleasePublicLock = function(success, shortModelName, modelName){
    if(!success){
        $("#"+modelName+"LoadingPanel").hide();
        $("#"+modelName+"TablePanel").hide();
    }
    releasePublicLock(shortModelName);
};

/**
 * 释放公共锁
 * @param shortModelName
 */
var releasePublicLock = function(shortModelName){
    UNLOCK_PUBLIC = true;
    $("div["+shortModelName+"-to-show-click='true']").each(function(){
        $(this).attr("style","cursor:pointer;");
    });
};

/***********************************************************************************************************************/
/*                                                  渲染异常部分   开始                                                 */
//渲染异常
var drawException = function(){
    console.log("调用异常");
    var shortModelName = 'exception';
    var modelName = 'exception';
    $("#"+modelName+"DetailTitle").hide();
    $("#"+modelName+"DetailTable").hide();
    /*质检总体情况*/
    //Map("normal" -> Map("num" -> 0,"hour" -> 0),"risk" -> Map("num" -> 0,"hour" -> 0),"highRisk" -> Map("num" -> 0,"hour" -> 0))
    requestURL(dataService+"/orderAfter/getExceptionCollect",{"operationCenter":operationCenter}).done(function(result){

        var num = result['normal'].num;
        var hour = accDiv(Math.round(accMul(result['normal'].hour,10)),10);
        setNumScrollFactory(shortModelName,'All',num,-1,hour);

        var riskNum = result['risk'].num;
        var riskHour = accDiv(Math.round(accMul(result['risk'].hour,10)),10);
        setNumScrollFactory(shortModelName,'Risk',riskNum,-1,riskHour);

        var highRiskNum = result['highRisk'].num;
        var highRiskHour = accDiv(Math.round(accMul(result['highRisk'].hour,10)),10);
        setNumScrollFactory(shortModelName,'HighRisk',highRiskNum,-1,highRiskHour);
        UNLOCK_PUBLIC = true;
        clickFunFactory(shortModelName,modelName);
    });
};


/*                                                  渲染异常部分     结束                                               */
/***********************************************************************************************************************/


/***********************************************************************************************************************/
/*                                                  渲染质检部分   开始                                                 */
//渲染质检
var drawQualityInspection = function(){
    console.log("调用质检");
    var shortModelName = 'quality';
    var modelName = 'qualityInspection';
    $("#"+modelName+"DetailTitle").hide();
    $("#"+modelName+"DetailTable").hide();
    /*质检总体情况*/
    //Map("normal" -> Map("num" -> 0,"hour" -> 0),"risk" -> Map("num" -> 0,"hour" -> 0),"highRisk" -> Map("num" -> 0,"hour" -> 0))
    requestURL(dataService+"/orderAfter/getQualityInspectionCollect",{"operationCenter":operationCenter}).done(function(result){

        var num = result['normal'].num;
        var hour = accDiv(Math.round(accMul(result['normal'].hour,10)),10);
        setNumScrollFactory(shortModelName,'All',num,-1,hour);

        var riskNum = result['risk'].num;
        var riskHour = accDiv(Math.round(accMul(result['risk'].hour,10)),10);
        setNumScrollFactory(shortModelName,'Risk',riskNum,-1,riskHour);

        var highRiskNum = result['highRisk'].num;
        var highRiskHour = accDiv(Math.round(accMul(result['highRisk'].hour,10)),10);
        setNumScrollFactory(shortModelName,'HighRisk',highRiskNum,-1,highRiskHour);
        UNLOCK_PUBLIC = true;
        clickFunFactory(shortModelName,modelName);
    });
};


/*                                                  渲染质检部分     结束                                               */
/***********************************************************************************************************************/


/***********************************************************************************************************************/
/*                                                  渲染RQC部分   开始                                                 */
//渲染RQC
var drawRQC = function(){
    console.log("调用RQC");
    var shortModelName = 'RQC';
    var modelName = 'RQC';
    $("#"+modelName+"DetailTitle").hide();
    $("#"+modelName+"DetailTable").hide();
    /*RQC总体情况*/
    requestURL(dataService+"/orderAfter/getRQCCollect",{"operationCenter":operationCenter}).done(function(result){
        var num = result['normal'].num;
        var hour = accDiv(Math.round(accMul(result['normal'].hour,10)),10);
        setNumScrollFactory(shortModelName,'All',num,-1,hour);

        var riskNum = result['risk'].num;
        var riskHour = accDiv(Math.round(accMul(result['risk'].hour,10)),10);
        setNumScrollFactory(shortModelName,'Risk',riskNum,-1,riskHour);

        var highRiskNum = result['highRisk'].num;
        var highRiskHour = accDiv(Math.round(accMul(result['highRisk'].hour,10)),10);
        setNumScrollFactory(shortModelName,'HighRisk',highRiskNum,-1,highRiskHour);
        UNLOCK_PUBLIC = true;
        clickFunFactory(shortModelName,modelName);
    });
};

/*                                                  渲染RQC部分     结束                                               */
/***********************************************************************************************************************/

/***********************************************************************************************************************/
/*                                                  渲染IPQC部分   开始                                                 */
//渲染IPQC
var drawIPQC = function(){
    console.log("调用IPQC");
    var shortModelName = 'IPQC';
    var modelName = 'IPQC';
    $("#"+modelName+"DetailTitle").hide();
    $("#"+modelName+"DetailTable").hide();
    /*IPQC总体情况*/
    requestURL(dataService+"/orderAfter/getIPQCCollect",{"operationCenter":operationCenter}).done(function(result){
        var num = result['normal'].num;
        var hour = accDiv(Math.round(accMul(result['normal'].hour,10)),10);
        setNumScrollFactory(shortModelName,'All',num,-1,hour);

        var riskNum = result['risk'].num;
        var riskHour = accDiv(Math.round(accMul(result['risk'].hour,10)),10);
        setNumScrollFactory(shortModelName,'Risk',riskNum,-1,riskHour);

        var highRiskNum = result['highRisk'].num;
        var highRiskHour = accDiv(Math.round(accMul(result['highRisk'].hour,10)),10);
        setNumScrollFactory(shortModelName,'HighRisk',highRiskNum,-1,highRiskHour);
        UNLOCK_PUBLIC = true;
        clickFunFactory(shortModelName,modelName);
    });
};

/*                                                  渲染IPQC部分     结束                                               */
/***********************************************************************************************************************/



/***********************************************************************************************************************/
/*                                                  渲染UQC部分   开始                                                 */
//渲染UQC
var drawUQC = function(){
    console.log("调用UQC");
    var shortModelName = 'UQC';
    var modelName = 'UQC';
    $("#"+modelName+"DetailTitle").hide();
    $("#"+modelName+"DetailTable").hide();
    /*UQC总体情况*/
    requestURL(dataService+"/orderAfter/getUQCCollect",{"operationCenter":operationCenter}).done(function(result){
        var num = result['normal'].num;
        var hour = accDiv(Math.round(accMul(result['normal'].hour,10)),10);
        setNumScrollFactory(shortModelName,'All',num,-1,hour);

        var riskNum = result['risk'].num;
        var riskHour = accDiv(Math.round(accMul(result['risk'].hour,10)),10);
        setNumScrollFactory(shortModelName,'Risk',riskNum,-1,riskHour);

        var highRiskNum = result['highRisk'].num;
        var highRiskHour = accDiv(Math.round(accMul(result['highRisk'].hour,10)),10);
        setNumScrollFactory(shortModelName,'HighRisk',highRiskNum,-1,highRiskHour);
        UNLOCK_PUBLIC = true;
        clickFunFactory(shortModelName,modelName);
    });
};

/*                                                  渲染UQC部分     结束                                               */
/***********************************************************************************************************************/


/***********************************************************************************************************************/
/*                                                  渲染隐私清除部分   开始                                              */
//渲染隐私清除
var drawPrivacyClear = function(){
    console.log("调用隐私清除");

    var shortModelName = 'privacyClear';
    var modelName = 'privacyClear';
    $("#"+modelName+"DetailTitle").hide();
    $("#"+modelName+"DetailTable").hide();
    /*UQC总体情况*/
    requestURL(dataService+"/orderAfter/getPrivacyClearCollect",{"operationCenter":operationCenter}).done(function(result){
        var num = result['normal'].num;
        var hour = accDiv(Math.round(accMul(result['normal'].hour,10)),10);
        setNumScrollFactory(shortModelName,'All',num,-1,hour);

        var riskNum = result['risk'].num;
        var riskHour = accDiv(Math.round(accMul(result['risk'].hour,10)),10);
        setNumScrollFactory(shortModelName,'Risk',riskNum,-1,riskHour);

        var highRiskNum = result['highRisk'].num;
        var highRiskHour = accDiv(Math.round(accMul(result['highRisk'].hour,10)),10);
        setNumScrollFactory(shortModelName,'HighRisk',highRiskNum,-1,highRiskHour);
        UNLOCK_PUBLIC = true;
        clickFunFactory(shortModelName,modelName);
    });
};

/*                                                  渲染退货质检部分     结束                                            */
/***********************************************************************************************************************/


/***********************************************************************************************************************/
/*                                                  渲染入库部分   开始                                              */
//渲染入库
var drawInWareHouse = function(){
    console.log("调用入库");

    var shortModelName = 'in';
    var modelName = 'inWareHouse';
    $("#"+modelName+"DetailTitle").hide();
    $("#"+modelName+"DetailTable").hide();
    /*入库总体情况*/
    requestURL(dataService+"/orderAfter/getInWareHouseCollect",{"operationCenter":operationCenter}).done(function(result){
        var num = result['normal'].num;
        var hour = accDiv(Math.round(accMul(result['normal'].hour,10)),10);
        setNumScrollFactory(shortModelName,'All',num,-1,hour);

        var riskNum = result['risk'].num;
        var riskHour = accDiv(Math.round(accMul(result['risk'].hour,10)),10);
        setNumScrollFactory(shortModelName,'Risk',riskNum,-1,riskHour);

        var highRiskNum = result['highRisk'].num;
        var highRiskHour = accDiv(Math.round(accMul(result['highRisk'].hour,10)),10);
        setNumScrollFactory(shortModelName,'HighRisk',highRiskNum,-1,highRiskHour);
        UNLOCK_PUBLIC = true;
        clickFunFactory(shortModelName,modelName);
    });
};

/*                                                  渲染入库部分     结束                                            */
/***********************************************************************************************************************/


/***********************************************************************************************************************/
/*                                                  渲染暂存部分   开始                                              */
//渲染暂存
var drawProvisionalTally = function(){
    console.log("调用暂存");
    var shortModelName = 'provisional';
    var modelName = 'provisionalTally';
    $("#"+modelName+"DetailTitle").hide();
    $("#"+modelName+"DetailTable").hide();
    /*暂存总体情况*/
    requestURL(dataService+"/orderAfter/getProvisionalTallyCollect",{"operationCenter":operationCenter}).done(function(result){
        var num = result['normal'].num;
        var hour = accDiv(Math.round(accMul(result['normal'].hour,10)),10);
        setNumScrollFactory(shortModelName,'All',num,-1,hour);

        var riskNum = result['risk'].num;
        var riskHour = accDiv(Math.round(accMul(result['risk'].hour,10)),10);
        setNumScrollFactory(shortModelName,'Risk',riskNum,-1,riskHour);

        var highRiskNum = result['highRisk'].num;
        var highRiskHour = accDiv(Math.round(accMul(result['highRisk'].hour,10)),10);
        setNumScrollFactory(shortModelName,'HighRisk',highRiskNum,-1,highRiskHour);
        UNLOCK_PUBLIC = true;
        clickFunFactory(shortModelName,modelName);
    });
};

/*                                                  渲染暂存部分     结束                                            */
/***********************************************************************************************************************/


/***********************************************************************************************************************/
/*                                                  渲染用户退货部分   开始                                              */
//渲染用户退货
var drawUserReturns = function(){
    console.log("调用用户退货");
    var shortModelName = 'userReturns';
    var modelName = 'userReturns';
    $("#"+modelName+"DetailTitle").hide();
    $("#"+modelName+"DetailTable").hide();
    /*用户退货总体情况*/
    requestURL(dataService+"/orderAfter/getUserReturnsCollect",{"operationCenter":operationCenter}).done(function(result){
        var num = result['normal'].num;
        var hour = accDiv(Math.round(accMul(result['normal'].hour,10)),10);
        setNumScrollFactory(shortModelName,'All',num,-1,hour);

        var riskNum = result['risk'].num;
        var riskHour = accDiv(Math.round(accMul(result['risk'].hour,10)),10);
        setNumScrollFactory(shortModelName,'Risk',riskNum,-1,riskHour);

        var highRiskNum = result['highRisk'].num;
        var highRiskHour = accDiv(Math.round(accMul(result['highRisk'].hour,10)),10);
        setNumScrollFactory(shortModelName,'HighRisk',highRiskNum,-1,highRiskHour);
        UNLOCK_PUBLIC = true;
        clickFunFactory(shortModelName,modelName);
    });
};

/*                                                  渲染用户退货部分     结束                                            */
/***********************************************************************************************************************/


/***********************************************************************************************************************/
/*                                                  渲染出库部分   开始                                              */
//渲染出库
var drawOutWareHouse = function(){
    console.log("调用出库");
    var shortModelName = 'outWareHouse';
    var modelName = 'outWareHouse';
    $("#"+modelName+"DetailTitle").hide();
    $("#"+modelName+"DetailTable").hide();
    /*出库总体情况*/
    requestURL(dataService+"/orderAfter/getOutWareHouseCollect",{"operationCenter":operationCenter}).done(function(result){
        var num = result['normal'].num;
        var hour = accDiv(Math.round(accMul(result['normal'].hour,10)),10);
        setNumScrollFactory(shortModelName,'All',num,-1,hour);

        var riskNum = result['risk'].num;
        var riskHour = accDiv(Math.round(accMul(result['risk'].hour,10)),10);
        setNumScrollFactory(shortModelName,'Risk',riskNum,-1,riskHour);

        var highRiskNum = result['highRisk'].num;
        var highRiskHour = accDiv(Math.round(accMul(result['highRisk'].hour,10)),10);
        setNumScrollFactory(shortModelName,'HighRisk',highRiskNum,-1,highRiskHour);
        UNLOCK_PUBLIC = true;
        clickFunFactory(shortModelName,modelName);
    });
};

/*                                                  渲染出库部分     结束                                            */
/***********************************************************************************************************************/


/***********************************************************************************************************************/
/*                                                  渲染库存部分   开始                                              */
//渲染库存
var drawRealTimeInventory = function(){
    console.log("调用库存");
    var shortModelName = 'realTimeInventory';
    var modelName = 'realTimeInventory';
    $("#"+modelName+"DetailTitle").hide();
    $("#"+modelName+"DetailTable").hide();
    /*出库总体情况*/
    requestURL(dataService+"/orderAfter/getRealTimeInventoryCollect",{"operationCenter":operationCenter}).done(function(result){
        var num = result['normal'].num;
        var hour = accDiv(Math.round(accMul(result['normal'].hour,10)),10);
        var amount = accMul(result['normal'].amount,1);
        setNumScrollFactory(shortModelName,'All',num,amount,hour);

        var riskNum = result['risk'].num;
        var riskHour = accDiv(Math.round(accMul(result['risk'].hour,10)),10);
        var riskAmount = accMul(result['risk'].amount,1);
        setNumScrollFactory(shortModelName,'Risk',riskNum,riskAmount,riskHour);

        var highRiskNum = result['highRisk'].num;
        var highRiskHour = accDiv(Math.round(accMul(result['highRisk'].hour,10)),10);
        var highRiskAmount = accMul(result['highRisk'].amount,1);
        setNumScrollFactory(shortModelName,'HighRisk',highRiskNum,highRiskAmount,highRiskHour);


        var mostRiskNum = result['mostRisk'].num;
        var mostRiskHour = accDiv(Math.round(accMul(result['mostRisk'].hour,10)),10);
        var mostRiskAmount = accMul(result['mostRisk'].amount,1);
        setNumScrollFactory(shortModelName,'MostRisk',mostRiskNum,mostRiskAmount,mostRiskHour);
        
        UNLOCK_PUBLIC = true;
        clickFunFactory(shortModelName,modelName);
    });
};

/*                                                  渲染库存部分     结束                                            */
/***********************************************************************************************************************/

/***********************************************************************************************************************/
/*                                                  渲染锁库部分   开始                                              */
//渲染锁库
var drawLockStock = function(){
    console.log("调用锁库");
    var shortModelName = 'lockStock';
    var modelName = 'lockStock';
    $("#"+modelName+"DetailTitle").hide();
    $("#"+modelName+"DetailTable").hide();
    /*锁库总体情况*/
    requestURL(dataService+"/orderAfter/getLockStockCollect",{"operationCenter":operationCenter}).done(function(result){
        var num = result['normal'].num;
        var hour = accDiv(Math.round(accMul(result['normal'].hour,10)),10);
        var amount = accMul(result['normal'].amount,1);
        setNumScrollFactory(shortModelName,'All',num,amount,hour);

        var riskNum = result['risk'].num;
        var riskHour = accDiv(Math.round(accMul(result['risk'].hour,10)),10);
        var riskAmount = accMul(result['risk'].amount,1);
        setNumScrollFactory(shortModelName,'Risk',riskNum,riskAmount,riskHour);

        var highRiskNum = result['highRisk'].num;
        var highRiskHour = accDiv(Math.round(accMul(result['highRisk'].hour,10)),10);
        var highRiskAmount = accMul(result['highRisk'].amount,1);
        setNumScrollFactory(shortModelName,'HighRisk',highRiskNum,highRiskAmount,highRiskHour);

        UNLOCK_PUBLIC = true;
        clickFunFactory(shortModelName,modelName);
    });
};

/*                                                  渲染锁库部分     结束                                            */
/***********************************************************************************************************************/


/***********************************************************************************************************************/
/*                                                  渲染竞拍部分   开始                                              */
//渲染竞拍
var drawAuction = function(){
    console.log("调用竞拍");
    var shortModelName = 'auction';
    var modelName = 'auction';
    $("#"+modelName+"DetailTitle").hide();
    $("#"+modelName+"DetailTable").hide();
    /*竞拍总体情况*/
    requestURL(dataService+"/orderAfter/getAuctionCollect",{"operationCenter":operationCenter}).done(function(result){
        var num = result['normal'].num;
        var hour = accDiv(Math.round(accMul(result['normal'].hour,10)),10);
        var amount = accMul(result['normal'].amount,1);
        setNumScrollFactory(shortModelName,'All',num,amount,hour);

        var riskNum = result['risk'].num;
        var riskHour = accDiv(Math.round(accMul(result['risk'].hour,10)),10);
        var riskAmount = accMul(result['risk'].amount,1);
        setNumScrollFactory(shortModelName,'Risk',riskNum,riskAmount,riskHour);

        var highRiskNum = result['highRisk'].num;
        var highRiskHour = accDiv(Math.round(accMul(result['highRisk'].hour,10)),10);
        var highRiskAmount = accMul(result['highRisk'].amount,1);
        setNumScrollFactory(shortModelName,'HighRisk',highRiskNum,highRiskAmount,highRiskHour);

        UNLOCK_PUBLIC = true;
        clickFunFactory(shortModelName,modelName);
    });
};

/*                                                  渲染竞拍部分     结束                                            */
/***********************************************************************************************************************/


/***********************************************************************************************************************/
/*                                                  渲染退货审核部分   开始                                              */
//渲染退货审核
var drawRejectAudit = function(){
    console.log("调用退货审核");
    var shortModelName = 'rejectAudit';
    var modelName = 'rejectAudit';
    $("#"+modelName+"DetailTitle").hide();
    $("#"+modelName+"DetailTable").hide();
    /*出库总体情况*/
    requestURL(dataService+"/orderAfter/getRejectAuditCollect",{"operationCenter":operationCenter}).done(function(result){
        var num = result['normal'].num;
        var hour = accDiv(Math.round(accMul(result['normal'].hour,10)),10);
        var amount = accMul(result['normal'].amount,1);
        setNumScrollFactory(shortModelName,'All',num,amount,hour);

        var riskNum = result['risk'].num;
        var riskHour = accDiv(Math.round(accMul(result['risk'].hour,10)),10);
        var riskAmount = accMul(result['risk'].amount,1);
        setNumScrollFactory(shortModelName,'Risk',riskNum,riskAmount,riskHour);

        var highRiskNum = result['highRisk'].num;
        var highRiskHour = accDiv(Math.round(accMul(result['highRisk'].hour,10)),10);
        var highRiskAmount = accMul(result['highRisk'].amount,1);
        setNumScrollFactory(shortModelName,'HighRisk',highRiskNum,highRiskAmount,highRiskHour);

        UNLOCK_PUBLIC = true;
        clickFunFactory(shortModelName,modelName);
    });
};

/*                                                  渲染退货审核部分     结束                                            */
/***********************************************************************************************************************/


/***********************************************************************************************************************/
/*                                                  渲染抽检部分   开始                                                 */
//渲染抽检
var drawRandomInspection = function(){
    $("#randomInspectionLoadingPanel").show();
    $("#showRandomInspectionTablePanel").hide();
    renderPage();
};

function renderPage(){
    //卖家下单
    requestURL(dataService+"/standard/realTimeSampling",{"operationCenter":operationCenter}).done(function(result){
        var allMoney = 0;
        var allHour = 0;
        var allNum = result.length;
        _.each(result,function(e){
            allMoney = accAdd(allMoney,e.price*1);
            allHour = accAdd(allHour,e.hour*1);
        });
        allHour = accDiv(Math.round(accMul(accDiv(allHour,allNum),10)),10);
        //$("#allNum").html(allNum);
        $("div[name='allNum']").lemCounter({
            value_to: allNum,
            value_from: 0,
            animate_duration: 3,
            locale: 'en-US'
        });
        //$("#AllMoney").html(allMoney);
        $("div[name='allMoney']").lemCounter({
            value_to: allMoney,
            value_from: 0,
            animate_duration: 3,
            locale: 'en-US'
        });

        $("div[name='allHour']").lemCounter({
            value_to: allHour,
            value_from: 0,
            animate_duration: 3,
            locale: 'en-US'
        });
        $("#randomInspectionLoadingPanel").hide();
        $("#showRandomInspectionTablePanel").show();
        drawRandomInspectionDetailTable(result);
        //$("#orderCnt").html(result.orderCnt)
        ///$("#orderNum").html(result.orderNum)
        //$("#amount").html("￥"+(result.amount.toLocaleString()))
        //$('#supplierCnt').html(result.supplierCnt)
    });
}

function drawRandomInspectionDetailTable(data){
    $("#random_inspection_detail_table").bootstrapTable('destroy').bootstrapTable({
        data: data,
        pagination: true,
        striped: true,
        pageSize: 5,
        search: true,
        pageList: [5, 10, 20, 50, 100, 200],
        exportDataType:'all',
        //cdataExport: "maintainDataExport",
        /*rowStyle: function (row, index) {
            var classesArr = ['success', 'info'];
            var strclass = "";
            if (index % 2 === 0) {//偶数行
                strclass = classesArr[0];
            } else {//奇数行
                strclass = classesArr[1];
            }
            return { classes: strclass };
        },//隔行变色*/
        columns:[
            {
                field:'operational_centre_name',
                title:'运营中心',
                sortable:true
            },{
                field:'receive_serial_no',
                title:'收货单号',
                sortable:true
            },{
                field:'is_exception',
                title:'是否异常未处理',
                sortable:true
            },{
                field:'inter_time',
                title:'首次入库日期',
                sortable:true
            },
            {
                field:'created_datetime',
                title:'本次出库时间',
                sortable:true
            },
            {
                field:'hour',
                title:'时长(天)',
                sortable:true
            },
            {
                field:'type',
                title:'物品标签',
                sortable:true
            },
            {
                field:'next_agent_no',
                title:'二级业务方',
                sortable:true
            },
            {
                field:'serial_number',
                title:'出库单',
                sortable:true
            },
            {
                field:'item_serial_number',
                title:'物品编号',
                sortable:true
            },
            {
                field:'sku_name',
                title:'sku名称',
                sortable:true
            },
            {
                field:'level_name',
                title:'等级名称',
                sortable:true
            },
            {
                field:'price',
                title:'价格',
                sortable:true
            },
            {
                field:'warehouse_name',
                title:'物品源仓库',
                sortable:true
            },
            {
                field:'account_name',
                title:'更新人',
                sortable:true
            }
        ]
    });

}

/*                                                  渲染抽检部分     结束                                               */
/***********************************************************************************************************************/
/*                                                  渲染维修部分     开始                                               */
//渲染维修
var drawRepair = function(){
    console.log("调用repair");
    var stay_clecy_width = $("#stay-clecy").width();
    if(stay_clecy_width<=221){
        $("span[myId='lh-c']").each(function(){
            $(this).attr("style","height:55px;font-size:12px;display:block;font-family:Microsoft YaHei;position:relative;padding-top:28px;font-weight:BOLD;margin-left:50px;");
        });

        $(".img-rounded").each(function(){
            $(this).attr("width","30px");
            $(this).attr("height","30px");
        });

        $("span[myId='lh-pic']").each(function(){
            $(this).attr("style","position:relative;float:left;display:block;margin-left: 14px;margin-top:16px;");
        });
    }

    $("div[to-show-click='true']").each(function(){
        $(this).click(function(){
            //console.log(unLock);
            if(unLock){
                //console.log('执行查询明细');
                unLock = false;
                var param = $(this).attr("to-show-params");
                var fix = $(this).attr("fix-show-params");
                //console.log("参数为："+fix+"-----"+param);
                $("#tablePanel").removeAttr("style");
                $("#showTablePanel").hide();
                $("#loadingPanel").show();
                $("div[to-show-click='true']").each(function(){
                    $(this).attr("style","cursor:not-allowed;");
                    $(this).children("div .box-footer").find("ul").find("li").each(function(){
                        $(this).find("a").attr("style","cursor:not-allowed;");
                    })
                });
                try{
                    myTable.getTable(fix,param);
                }catch(e){
                    unLock = true;
                }
            }
        });

        //初始化为小手样式
        $(this).attr('style','cursor:pointer;');
    });

    unLock = true;
    preWhole = {whole_num:0,whole_money:0,whole_hours_int:0,whole_hours_smart:0};
    //留货情况初始值定义
    preStayClecy = {stay_zero_num:0,stay_zero_money:0};
    preStayClecy1 = {stay_one_num:0,stay_one_money:0};
    preStayClecy2 = {stay_two_num:0,stay_two_money:0};
    preToRepairClecy = {to_repair_zero_num:0,to_repair_zero_money:0};
    preToRepairClecy1 = {to_repair_one_num:0,to_repair_one_money:0};
    preToRepairClecy2 = {to_repair_two_num:0,to_repair_two_money:0};
    preRepairClecy = {repair_zero_num:0,repair_zero_money:0};
    preRepairClecy1 = {repair_one_num:0,repair_one_money:0};
    preRepairClecy2 = {repair_two_num:0,repair_two_money:0};
    preToInsClecy = {to_ins_zero_num:0,to_ins_zero_money:0};
    preToInsClecy1 = {to_ins_one_num:0,to_ins_one_money:0};
    preToInsClecy2 = {to_ins_two_num:0,to_ins_two_money:0};
    preNeedToInsClecy = {need_to_ins_zero_num:0,need_to_ins_zero_money:0};
    preNeedToInsClecy1 = {need_to_ins_one_num:0,need_to_ins_one_money:0};
    preNeedToInsClecy2 = {need_ins_to_two_num:0,need_to_ins_two_money:0};
    wholeThing = [];
    apiDone = {stay:false,toRepair:false,repair:false,toIns:false,needIns:false};

    drawNumCartV2();

};

var unLock = true;

var preWhole = {whole_num:0,whole_money:0,whole_hours_int:0,whole_hours_smart:0};

//留货情况初始值定义
var preStayClecy = {stay_zero_num:0,stay_zero_money:0};
var preStayClecy1 = {stay_one_num:0,stay_one_money:0};
var preStayClecy2 = {stay_two_num:0,stay_two_money:0};

var preToRepairClecy = {to_repair_zero_num:0,to_repair_zero_money:0};
var preToRepairClecy1 = {to_repair_one_num:0,to_repair_one_money:0};
var preToRepairClecy2 = {to_repair_two_num:0,to_repair_two_money:0};

var preRepairClecy = {repair_zero_num:0,repair_zero_money:0};
var preRepairClecy1 = {repair_one_num:0,repair_one_money:0};
var preRepairClecy2 = {repair_two_num:0,repair_two_money:0};

var preToInsClecy = {to_ins_zero_num:0,to_ins_zero_money:0};
var preToInsClecy1 = {to_ins_one_num:0,to_ins_one_money:0};
var preToInsClecy2 = {to_ins_two_num:0,to_ins_two_money:0};

var preNeedToInsClecy = {need_to_ins_zero_num:0,need_to_ins_zero_money:0};
var preNeedToInsClecy1 = {need_to_ins_one_num:0,need_to_ins_one_money:0};
var preNeedToInsClecy2 = {need_ins_to_two_num:0,need_to_ins_two_money:0};

var wholeThing = [];

var apiDone = {stay:false,toRepair:false,repair:false,toIns:false,needIns:false};

var myTable = {
    getTable:function(fix,param){
        //console.log('获取table');
        getDetailData(fix,param);
    }
};

/**
 * selector为选择器  1  为 id选择器，默认为ID选择器， 2 为 class选择器（可自行扩展）
 *
 * from  prevNum  to num
 * 从  prevNum  滚动到  num
 * @param selector
 * @param selectorType
 * @param prevNum
 * @param num
 */
function scrollNum(selector,prevNum,num){
    var fromNum = prevNum;
    if(prevNum==undefined || prevNum == null || prevNum==''){
        fromNum = 0;
    }
    //console.log(fromNum+"-->"+num);
    $("div[name='"+selector+"']").lemCounter({
        value_to: num,
        value_from: fromNum,
        animate_duration: 3,
        locale: 'en-US'
    });
}

function scrollNumForSpan(selector,prevNum,num){
    var fromNum = prevNum;
    if(prevNum==undefined || prevNum == null || prevNum==''){
        fromNum = 0;
    }
    //console.log(fromNum+"-->"+num);
    $("span[name='"+selector+"']").lemCounter({
        value_to: num,
        value_from: fromNum,
        animate_duration: 3,
        locale: 'en-US'
    });
}

//渲染小卡片-api拆开 Version2
function drawNumCartV2(){
    //获取缓存
    requestURL(dataService+"/standard/getShelfKey", {}).done(function () {

        //渲染留货情况/风险预警/高危预警
        requestURL(dataService+"/standard/executeStayCycleSummary", {"dayNum": "0;7;10"}).done(function (data) {
            setDone(data,0);
            //console.log(data);
            //渲染留货情况
            drawStayCycle(preStayClecy,data.stay_cycle0);
            drawStayCycle1(preStayClecy1,data.stay_cycle7);
            drawStayCycle2(preStayClecy2,data.stay_cycle10);
            if(isDone()){
                setTimeout(function(){
                    drawWholeThing(preWhole,wholeThing);
                },2000);
            }
        });

        //渲染送修情况/风险预警/高危预警
        requestURL(dataService+"/standard/executeToRepairCycleSummary", {"dayNum": "0;4;6"}).done(function (data) {
            setDone(data,1);
            //console.log(data);
            //渲染送修在途情况
            drawToRepairCycle(preToRepairClecy,data.to_repair_cycle0);
            drawToRepairCycle1(preToRepairClecy1,data.to_repair_cycle4);
            drawToRepairCycle2(preToRepairClecy2,data.to_repair_cycle6);
            if(isDone()){
                setTimeout(function(){
                    drawWholeThing(preWhole,wholeThing);
                },2000);
            }
        });

        //渲染维修情况/风险预警/高危预警
        requestURL(dataService+"/standard/executeRepairBusinessCycleSummary", {"dayNum": "0;7;10"}).done(function (data) {
            setDone(data,2);
            //console.log(data);
            //渲维修接收情况
            drawRepairCycle(preRepairClecy,data.repair_business_cycle0);
            drawRepairCycle1(preRepairClecy1,data.repair_business_cycle7);
            drawRepairCycle2(preRepairClecy2,data.repair_business_cycle10);
            if(isDone()){
                setTimeout(function(){
                    drawWholeThing(preWhole,wholeThing);
                },2000);
            }
        });

        //渲染送检情况/风险预警/高危预警
        requestURL(dataService+"/standard/executeToInsCycleSummary", {"dayNum": "0;3;5"}).done(function (data) {
            setDone(data,3);
            //console.log(data);
            //渲送检在途情况
            drawToInsCycle(preToInsClecy,data.to_ins_cycle0);
            drawToInsCycle1(preToInsClecy1,data.to_ins_cycle3);
            drawToInsCycle2(preToInsClecy2,data.to_ins_cycle5);
            if(isDone()){
                setTimeout(function(){
                    drawWholeThing(preWhole,wholeThing);
                },2000);
            }
        });

        //渲染待检情况/风险预警/高危预警
        requestURL(dataService+"/standard/executeNeedToInsCycleSummary", {"dayNum": "0;3;7"}).done(function (data) {
            setDone(data,4);
            //console.log(data);
            //待质检情况
            drawNeedToInsCycle(preNeedToInsClecy,data.need_to_ins_cycle0);
            drawNeedToInsCycle1(preNeedToInsClecy1,data.need_to_ins_cycle3);
            drawNeedToInsCycle2(preNeedToInsClecy2,data.need_to_ins_cycle7);
            if(isDone()){
                setTimeout(function(){
                    drawWholeThing(preWhole,wholeThing);
                },2000);
            }
        });
    });

}

var setDone = function(source,who){
    switch (who){
        case 0:
            apiDone.stay = true;
            wholeThing.stay_cycle0 = source.stay_cycle0;
            break;
        case 1:
            apiDone.toRepair = true;
            wholeThing.to_repair_cycle0 = source.to_repair_cycle0;
            break;
        case 2:
            apiDone.repair = true;
            wholeThing.repair_business_cycle0 = source.repair_business_cycle0;
            break;
        case 3:
            apiDone.toIns = true;
            wholeThing.to_ins_cycle0 = source.to_ins_cycle0;
            break;
        case 4:
            apiDone.needIns = true;
            wholeThing.need_to_ins_cycle0 = source.need_to_ins_cycle0;
            break;
    }
};

var isDone = function(){
    if(apiDone.stay && apiDone.toRepair && apiDone.repair && apiDone.toIns){// && apiDone.needIns  去掉
        return true;
    }
    return false;
};

//渲染总体情况
function drawWholeThing(from,to){
    /*if (!phoneOrPc()){
        phoneAnimate.clearPhoneLoadingAnimate();
    }*/
    var dir_whole_num = to.stay_cycle0.count*1 + to.to_repair_cycle0.count*1 + to.repair_business_cycle0.count*1 + to.to_ins_cycle0.count*1; // 暂时去掉  + to.need_to_ins_cycle0.count*1
    var dir_whole_money = to.stay_cycle0.amount*1 + to.to_repair_cycle0.amount*1 + to.repair_business_cycle0.amount*1 + to.to_ins_cycle0.amount*1;// 暂时去掉 + to.need_to_ins_cycle0.amount*1

    //var dir_whole_hours = to.repair_cycle.repairCycleAvgTime*1.0 + to.to_ins_cycle.toInsCycleAvgTime*1.0 + to.need_to_ins_cycle.needToInsCycleAvgTime*1.0;
    //var dir_whole_hours = accAdd(to.need_to_ins_cycle0.avgTime*1.0,accAdd(accAdd(to.stay_cycle0.avgTime*1.0,to.to_repair_cycle0.avgTime*1.0),accAdd(to.repair_business_cycle0.avgTime*1.0,to.to_ins_cycle0.avgTime*1.0)));

    var real_whole_hours = accAdd(accAdd(to.stay_cycle0.totalTime*1.0,to.to_repair_cycle0.totalTime*1.0),accAdd(to.repair_business_cycle0.totalTime*1.0,to.to_ins_cycle0.totalTime*1.0));

    var dir_whole_hours = accDiv(real_whole_hours,dir_whole_num).toFixed(1);

    //dir_whole_hours = accAdd(to.repair_cycle.repairCycleAvgTime*1.0,to.to_ins_cycle.toInsCycleAvgTime*1.0);


    scrollNum('counter-goods-num',from.whole_num,dir_whole_num);
    scrollNum('counter-goods-money',from.whole_money,dir_whole_money);

    var dir_whole_hours_int = parseInt(dir_whole_hours);
    var flt = accSub(dir_whole_hours,dir_whole_hours_int);

    var flt_ln=(dir_whole_hours.toString()).length-(dir_whole_hours_int.toString()).length-1;
    var dir_whole_hours_smart=(flt.toString()).substring(2,(flt_ln+2));
    //console.log(dir_whole_hours_int);
    //console.log(dir_whole_hours_smart);
    if(dir_whole_hours_int == '' || dir_whole_hours_int == null){
        dir_whole_hours_int = 0;
    }
    if(dir_whole_hours_smart == '' || dir_whole_hours_smart == null){
        dir_whole_hours_smart = 0;
    }
    var isFirst = $("div[name='counter-all-hours']").attr("load-is");
    if(isFirst=='first'){
        $("div[name='counter-all-hours']").html('');
        $("div[name='counter-all-hours']").append('<span name="counter-all-hours-int">0</span>');
        $("div[name='counter-all-hours']").append('<span name="counter-all-hours-split">.</span>');
        $("div[name='counter-all-hours']").append('<span name="counter-all-hours-smart">0</span>');
        $("div[name='counter-all-hours']").attr("load-is","other");
    }

    scrollNumForSpan('counter-all-hours-int',from.whole_hours_int,dir_whole_hours_int);
    scrollNumForSpan('counter-all-hours-smart',from.whole_hours_smart,dir_whole_hours_smart);

    preWhole.whole_num = dir_whole_num*1;
    preWhole.whole_money = dir_whole_money*1;
    preWhole.whole_hours_int = dir_whole_hours_int*1;
    preWhole.whole_hours_smart = dir_whole_hours_smart*1;
}

//渲染留货情况
function drawStayCycle(from,to){
    //pcAndPhoneCartAnimate.clearPcAndPhoneCartLoadingAnimate();
    $("span[num-appends='0-num-stay']").lemCounter({
        value_to: to.count,
        value_from: from.stay_zero_num,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='0-num-stay']").removeAttr("style");
    $("span[num-appends='0-money-stay']").lemCounter({
        value_to: to.amount,
        value_from: from.stay_zero_money,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='0-money-stay']").removeAttr("style");
    $("span[num-appends='0-hours-stay']").text(to.avgTime);
    $("span[num-appends='0-hours-stay']").removeAttr("style");
    preStayClecy.stay_zero_num = to.count*1;
    preStayClecy.stay_zero_money = to.amount*1;
}

//渲染留货风险预警情况
function drawStayCycle1(from,to){
    $("span[num-appends='1-num-stay']").removeAttr("style");
    $("span[num-appends='1-num-stay']").lemCounter({
        value_to: to.count,
        value_from: from.stay_one_num,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='1-money-stay']").removeAttr("style");
    $("span[num-appends='1-money-stay']").lemCounter({
        value_to: to.amount,
        value_from: from.stay_one_money,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='1-hours-stay']").removeAttr("style");
    $("span[num-appends='1-hours-stay']").text(to.avgTime);

    preStayClecy1.stay_one_num = to.count*1;
    preStayClecy1.stay_one_money = to.amount*1;
}

//渲染留货高危预警情况
function drawStayCycle2(from,to){
    $("span[num-appends='2-num-stay']").removeAttr("style");
    $("span[num-appends='2-num-stay']").lemCounter({
        value_to: to.count,
        value_from: from.stay_two_num,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='2-money-stay']").removeAttr("style");
    $("span[num-appends='2-money-stay']").lemCounter({
        value_to: to.amount,
        value_from: from.stay_two_money,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='2-hours-stay']").removeAttr("style");
    $("span[num-appends='2-hours-stay']").text(to.avgTime);

    preStayClecy2.stay_two_num = to.count*1;
    preStayClecy2.stay_two_money = to.amount*1;
}

//渲染送修在途情况
function drawToRepairCycle(from,to){
    $("span[num-appends='0-num-to-repair']").removeAttr("style");
    $("span[num-appends='0-num-to-repair']").lemCounter({
        value_to: to.count,
        value_from: from.to_repair_zero_num,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='0-money-to-repair']").removeAttr("style");
    $("span[num-appends='0-money-to-repair']").lemCounter({
        value_to: to.amount,
        value_from: from.to_repair_zero_money,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='0-hours-to-repair']").removeAttr("style");
    $("span[num-appends='0-hours-to-repair']").text(to.avgTime);

    preToRepairClecy.to_repair_zero_num = to.count*1;
    preToRepairClecy.to_repair_zero_money = to.amount*1;
}

//渲染送修在途风险预警情况
function drawToRepairCycle1(from,to){
    $("span[num-appends='1-num-to-repair']").removeAttr("style");
    $("span[num-appends='1-num-to-repair']").lemCounter({
        value_to: to.count,
        value_from: from.to_repair_one_num,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='1-money-to-repair']").removeAttr("style");
    $("span[num-appends='1-money-to-repair']").lemCounter({
        value_to: to.amount,
        value_from: from.to_repair_one_money,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='1-hours-to-repair']").removeAttr("style");
    $("span[num-appends='1-hours-to-repair']").text(to.avgTime);

    preToRepairClecy1.to_repair_one_num = to.count*1;
    preToRepairClecy1.to_repair_one_money = to.amount*1;
}

//渲染送修在途高危预警情况
function drawToRepairCycle2(from,to){
    $("span[num-appends='2-num-to-repair']").removeAttr("style");
    $("span[num-appends='2-num-to-repair']").lemCounter({
        value_to: to.count,
        value_from: from.to_repair_two_num,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='2-money-to-repair']").removeAttr("style");
    $("span[num-appends='2-money-to-repair']").lemCounter({
        value_to: to.amount,
        value_from: from.to_repair_two_money,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='2-hours-to-repair']").removeAttr("style");
    $("span[num-appends='2-hours-to-repair']").text(to.avgTime);

    preToRepairClecy2.to_repair_two_num = to.count*1;
    preToRepairClecy2.to_repair_two_money = to.amount*1;
}

//渲染维修接收情况
function drawRepairCycle(from,to){
    $("span[num-appends='0-num-repair']").removeAttr("style");
    $("span[num-appends='0-num-repair']").lemCounter({
        value_to: to.count,
        value_from: from.repair_zero_num,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='0-money-repair']").removeAttr("style");
    $("span[num-appends='0-money-repair']").lemCounter({
        value_to: to.amount,
        value_from: from.repair_zero_money,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='0-hours-repair']").removeAttr("style");
    $("span[num-appends='0-hours-repair']").text(to.avgTime);

    preRepairClecy.repair_zero_num = to.count*1;
    preRepairClecy.repair_zero_money = to.amount*1;
}

//渲染维修接收风险预警情况
function drawRepairCycle1(from,to){
    $("span[num-appends='1-num-repair']").removeAttr("style");
    $("span[num-appends='1-num-repair']").lemCounter({
        value_to: to.count,
        value_from: from.repair_one_num,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='1-money-repair']").removeAttr("style");
    $("span[num-appends='1-money-repair']").lemCounter({
        value_to: to.amount,
        value_from: from.repair_one_money,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='1-hours-repair']").removeAttr("style");
    $("span[num-appends='1-hours-repair']").text(to.avgTime);

    preRepairClecy1.repair_one_num = to.count*1;
    preRepairClecy1.repair_one_money = to.amount*1;
}

//渲染维修接收高危预警情况
function drawRepairCycle2(from,to){
    $("span[num-appends='2-num-repair']").removeAttr("style");
    $("span[num-appends='2-num-repair']").lemCounter({
        value_to: to.count,
        value_from: from.repair_two_num,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='2-money-repair']").removeAttr("style");
    $("span[num-appends='2-money-repair']").lemCounter({
        value_to: to.amount,
        value_from: from.repair_two_money,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='2-hours-repair']").removeAttr("style");
    $("span[num-appends='2-hours-repair']").text(to.avgTime);

    preRepairClecy2.repair_two_num = to.count*1;
    preRepairClecy2.repair_two_money = to.amount*1;
}

//渲染送检在途情况
function drawToInsCycle(from,to){
    $("span[num-appends='0-num-to-ins']").removeAttr("style");
    $("span[num-appends='0-num-to-ins']").lemCounter({
        value_to: to.count,
        value_from: from.to_ins_zero_num,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='0-money-to-ins']").removeAttr("style");
    $("span[num-appends='0-money-to-ins']").lemCounter({
        value_to: to.amount,
        value_from: from.to_ins_zero_money,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='0-hours-to-ins']").removeAttr("style");
    $("span[num-appends='0-hours-to-ins']").text(to.avgTime);

    preToInsClecy.to_ins_zero_num = to.count*1;
    preToInsClecy.to_ins_zero_money = to.amount*1;
}

//渲染送检在途风险预警情况
function drawToInsCycle1(from,to){
    $("span[num-appends='1-num-to-ins']").removeAttr("style");
    $("span[num-appends='1-num-to-ins']").lemCounter({
        value_to: to.count,
        value_from: from.to_ins_one_num,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='1-money-to-ins']").removeAttr("style");
    $("span[num-appends='1-money-to-ins']").lemCounter({
        value_to: to.amount,
        value_from: from.to_ins_one_money,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='1-hours-to-ins']").removeAttr("style");
    $("span[num-appends='1-hours-to-ins']").text(to.avgTime);

    preToInsClecy1.to_ins_one_num = to.count*1;
    preToInsClecy1.to_ins_one_money = to.amount*1;
}

//渲染送检在途高危预警情况
function drawToInsCycle2(from,to){
    $("span[num-appends='2-num-to-ins']").removeAttr("style");
    $("span[num-appends='2-num-to-ins']").lemCounter({
        value_to: to.count,
        value_from: from.to_ins_two_num,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='2-money-to-ins']").removeAttr("style");
    $("span[num-appends='2-money-to-ins']").lemCounter({
        value_to: to.amount,
        value_from: from.to_ins_two_money,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='2-hours-to-ins']").removeAttr("style");
    $("span[num-appends='2-hours-to-ins']").text(to.avgTime);

    preToInsClecy2.to_ins_two_num = to.count*1;
    preToInsClecy2.to_ins_two_money = to.amount*1;
}
//渲染待质检情况
function drawNeedToInsCycle(from,to){
    $("span[num-appends='0-num-need-to-ins']").removeAttr("style");
    $("span[num-appends='0-num-need-to-ins']").lemCounter({
        value_to: to.count,
        value_from: from.need_to_ins_zero_num,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='0-money-need-to-ins']").removeAttr("style");
    $("span[num-appends='0-money-need-to-ins']").lemCounter({
        value_to: to.amount,
        value_from: from.need_to_ins_zero_money,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='0-hours-need-to-ins']").removeAttr("style");
    $("span[num-appends='0-hours-need-to-ins']").text(to.avgTime);

    preNeedToInsClecy.need_to_ins_zero_num = to.count*1;
    preNeedToInsClecy.need_to_ins_zero_money = to.amount*1;
}

//渲染待质检风险预警情况
function drawNeedToInsCycle1(from,to){
    $("span[num-appends='1-num-need-to-ins']").removeAttr("style");
    $("span[num-appends='1-num-need-to-ins']").lemCounter({
        value_to: to.count,
        value_from: from.need_to_ins_one_num,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='1-money-need-to-ins']").removeAttr("style");
    $("span[num-appends='1-money-need-to-ins']").lemCounter({
        value_to: to.amount,
        value_from: from.need_to_ins_one_money,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='1-hours-need-to-ins']").removeAttr("style");
    $("span[num-appends='1-hours-need-to-ins']").text(to.avgTime);

    preNeedToInsClecy1.need_to_ins_one_num = to.count*1;
    preNeedToInsClecy1.need_to_ins_one_money = to.amount*1;
}

//渲染待质检高危预警情况
function drawNeedToInsCycle2(from,to){
    $("span[num-appends='2-num-need-to-ins']").removeAttr("style");
    $("span[num-appends='2-num-need-to-ins']").lemCounter({
        value_to: to.count,
        value_from: from.need_to_ins_two_num,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='2-money-need-to-ins']").removeAttr("style");
    $("span[num-appends='2-money-need-to-ins']").lemCounter({
        value_to: to.amount,
        value_from: from.need_to_ins_two_money,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='2-hours-need-to-ins']").removeAttr("style");
    $("span[num-appends='2-hours-need-to-ins']").text(to.avgTime);

    preNeedToInsClecy2.need_to_ins_two_num = to.count*1;
    preNeedToInsClecy2.need_to_ins_two_money = to.amount*1;
}

//获取明细数据
function getDetailData(fix,param){
    var query = {stage:fix,dayNum:param};
    requestURL(dataService+"/standard/executeMaintainDetail", query).done(function (data) {
        //console.log(data);
        if(data.statusText != undefined && data.statusText=='error'){
            //console.log('服务异常');
            failureReleaseLock(false);
            customWarnModal('温馨提示','myWarnModal','myWarnModalLabel');
        }else{
            drawDetailTable(data,query);
        }
    });
}

//渲染明细表数据
function drawDetailTable(dataList,query){
    $("#detail_table").bootstrapTable('destroy').bootstrapTable({
        data: dataList,
        pagination: true,
        striped: true,
        pageSize: 5,
        search: true,
        pageList: [5, 10, 20, 50, 100, 200],
        exportDataType:'all',
        cdataExport: "maintainDataExport",
        /*rowStyle: function (row, index) {
            var classesArr = ['success', 'info'];
            var strclass = "";
            if (index % 2 === 0) {//偶数行
                strclass = classesArr[0];
            } else {//奇数行
                strclass = classesArr[1];
            }
            return { classes: strclass };
        },//隔行变色*/
        columns:[
            {
                field:'inventory_serial_number',
                title:'订单号',
                sortable:true
            },
            {
                field:'trade_source_type_name',
                title:'订单来源',
                sortable:true

            },
            {
                field:'product_category_name',
                title:'品类',
                sortable:true
            },
            {
                field:'product_brand_name',
                title:'品牌',
                sortable:true
            },
            {
                field:'inventory_product_name',
                title:'型号',
                sortable:true
            },
            {
                field:'inventory_sku_name',
                title:'sku',
                sortable:true
            },
            {
                field:'lock_date',
                title:'留货日期',
                sortable:true

            },
            {
                field:'to_repair_date',
                title:'送修日期',
                sortable:true
            },
            {
                field:'repair_receive_date',
                title:'维修接收日期',
                sortable:true
            },
            {
                field:'repair_send_back_date',
                title:'维修送回日期',
                sortable:true
            },
            {
                field:'send_back_date',
                title:'送回运营中心日期',
                sortable:true
            },
            {
                field:'ins_finish_date',
                title:'质检完成日期',
                sortable:true
            },
            {
                field:'warehouse_name',
                title:'当前仓库',
                sortable:true
            },
            {
                field:'shelf_code',
                title:'库位编码',
                sortable:true
            },
            {
                field:'shelf_name',
                title:'库位名称',
                sortable:true
            },
            {
                field:'document_item_level_name',
                title:'原等级',
                sortable:true
            },
            {
                field:'amount',
                title:'原等级金额',
                sortable:true
            },
            {
                field:'shelf_type_name',
                title:'维修后状态',
                sortable:true
            },
            {
                field:'out_warehouse_name',
                title:'出库仓库',
                sortable:true
            },
            {
                field:'repair_business',
                title:'维修商',
                sortable:true
            },
            {
                field:'f_type_name',
                title:'项目名称',
                sortable:true
            },
            {
                field:'total_cycle',
                title:'整体库存时长',
                sortable:true
            },
            {
                field:'stay_cycle',
                title:'留货时长',
                sortable:true
            },
            {
                field:'to_repair_cycle',
                title:'送修在途时长',
                sortable:true
            },
            {
                field:'repair_business_cycle',
                title:'维修商库存时长',
                sortable:true
            },
            {
                field:'to_ins_cycle',
                title:'送检在途时长',
                sortable:true
            },
            {
                field:'need_to_ins_cycle',
                title:'待质检时长',
                sortable:true
            }/*,
            {
                field:'operate',
                title:'操作',
                formatter: operateFormatter, //自定义方法，添加操作按钮
                events:operateEvents
            }*/
        ]
    });
    $("#maintainDataExport").click(function(){
        delete query.userId;
        delete query.sign;
        requestURL(dataService+"/standard/exportMaintainData",query).done(function(result){
            var url = Meteor.settings.public.downloadService.baseUrl+result.path
            console.log("url:" + url)
            var link = document.createElement("a");
            link.href = url;
            link.style = "visibility:hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    });
    $("#loadingPanel").hide();
    $("#showTablePanel").show();
    unLock = true;
    $("div[to-show-click='true']").each(function(){
        $(this).attr("style","cursor:pointer;");
        $(this).children("div .box-footer").find("ul").find("li").each(function(){
            $(this).find("a").removeAttr("style");
        })
    });
}

var failureReleaseLock = function(success){
    if(!success){
        $("#loadingPanel").hide();
        $("#showTablePanel").hide();
    }
    releaseLock();
};

var releaseLock = function(){
    unLock = true;
    $("div[to-show-click='true']").each(function(){
        $(this).attr("style","cursor:pointer;");
        $(this).children("div .box-footer").find("ul").find("li").each(function(){
            $(this).find("a").removeAttr("style");
        })
    });
};


//自定义弹出层
function customModal(title,data){
    $("#myModal").on('show.bs.modal', function () {
        $("#myModalLabel").text(title);
        /*$("#modalContent").bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data:data,
            columns: colums
        });*/
    });
    $("#myModal").modal();
}

function customWarnModal(title,modelSelector,titleSelector){
    $("#"+modelSelector).on('show.bs.modal', function () {
        $("#"+titleSelector).text(title);

    });
    $("#"+modelSelector).modal();
}

/*                                                  渲染维修部分     结束                                               */
/***********************************************************************************************************************/
/*                                                  工具类部分       开始                                               */
function isNumber(num){
    var regPos = / ^\d+$/; // 非负整数
    var regNeg = /^\-[1-9][0-9]*$/; // 负整数
    if(regPos.test(num) || regNeg.test(num)){
        return true;
    }else{
        return false;
    }
}
/*                                                  工具类部分     结束                                                 */
/***********************************************************************************************************************/