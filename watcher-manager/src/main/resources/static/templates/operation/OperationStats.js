Template.OperationStats.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operation').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;

    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }
    var operationCenterName = "";
    var operationCenter = Template.OperationCenter;
    switch (parseInt(operationCenter)) {
        case 1:
            $('#shanghaiOperationStats').addClass('active');
            $('#shanghaiOperationCenter').addClass('active');
            operationCenterName = "上海";
            break;
        case 12:
            $('#shanghaiTestOperationStats').addClass('active');
            $('#shanghaiTestOperationCenter').addClass('active');
            operationCenterName = "上海(流程测试专用)";
            break;
        case 2:
            $('#beijingOperationStats').addClass('active');
            $('#beijingOperationCenter').addClass('active');
            operationCenterName = "北京";
            break;
        case 3:
            $('#chengduOperationStats').addClass('active');
            $('#chengduOperationCenter').addClass('active');
            operationCenterName = "成都";
            break;
        case 4:
            $('#shenzhenOperationStats').addClass('active');
            $('#shenzhenOperationCenter').addClass('active');
            operationCenterName = "深圳(物流)";
            break;
        case 16:
            $('#shenzhenNewOperationStats').addClass('active');
            $('#shenzhenNewOperationCenter').addClass('active');
            operationCenterName = "深圳";
            break;
        case 21:
            $('#shenzhenTestOperationStats').addClass('active');
            $('#shenzhenTestOperationCenter').addClass('active');
            operationCenterName = "深圳(流程测试专用)";
            break;
        case 5:
            $('#tianjinOperationStats').addClass('active');
            $('#tianjinOperationCenter').addClass('active');
            operationCenterName = "天津";
            break;
        case 6:
            $('#wuhanOperationStats').addClass('active');
            $('#wuhanOperationCenter').addClass('active');
            operationCenterName = "武汉";
            break;
        case 10:
            $('#changzhouOperationStats').addClass('active');
            $('#changzhouOperationCenter').addClass('active');
            operationCenterName = "常州";
            break;
        case 0:
            $('#ChinaOperationStats').addClass('active');
            $('#chinaOperationCenter').addClass('active');
            operationCenterName = "全国";
            break;
        case 18:
            $('#changzhouTestOperationStats').addClass('active');
            $('#changzhouTestOperationCenter').addClass('active');
            operationCenterName = "常州(流程测试专用)";
            break;
        default:
            break;
    }

    switch ($("ul#pageTab li.active").text()) {
        case '运营指标':
            updateOperationStats(operationCenter);
            break;
        case '日清指标':
            updateClearStats(operationCenter);
            break;
        default:
            break;
    }

    $('a[data-toggle=tab]').on('shown.bs.tab', function (e) {
        var activeTab = (e.target).text;
        switch (activeTab) {
            case '运营指标':
                updateOperationStats(operationCenter);
                break;
            case '日清指标':
                updateClearStats(operationCenter);
                break;
            default:
                break;
        }
    });

    $('#clickThis').click(function () {
        var href = "/operation/ReverseExpressCount/" + operationCenter;
        popModal(href);
    });
    $('#preReturnCount').click(function () {
        var href = "/operation/tradeNoDetail/" + operationCenter + "/待退货";
        popModal(href);
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
            height: 600,
            'width': 800,
            minHeight: 600,
            autoScale: false,
            //fitToView: false,
            //autoSize: false,
            beforeShow: function () {
                this.height = 600;
            }
        });
    }, 400);
};

var updateOperationStats = function (operationCenter) {
    $('h3[name="operationData"]').html('……');

    var query = {
        "date": moment().format("YYYY-MM-DD"),
        "operationCenter": operationCenter
    };

    //质检指标 ---- App验货中转箱订单量  废弃
    /*var yhzzxddl;
    if(operationCenter==0){
        yhzzxddl=operationAppInspectionTurnover.find({}).fetch()
    }else{
        yhzzxddl=operationAppInspectionTurnover.find({operationalCenterId:parseInt(operationCenter)}).fetch()
    }
    $("#yhzzxddl").html(yhzzxddl.length);
    $("#yhzzxddl").click(function(){
        customModal("App验货中转箱订单",yhzzxddl,[{
            field: 'productNo',
            title: '单号',
            sortable:true
        }])
    })*/

    requestURL(dataService + "/operationCenter/getRealTimeReceiptStats", query).done(function (data) {
        $('#tradeExpressCount').html(data.tradeExpressCount);
        $('#tradeReceiptCount').html(data.tradeReceiptCount);
        $("#reverseExpressCount").html(data.reverseExpressCount);
        $("#otherTradeReceiptCount").html(data.otherTradeReceiptCount);
        //$("#transferReceiptCount").html(data.transferReceiptCount);
    });

    requestURL(dataService + "/operationCenter/getRealTimeReturnStats", query).done(function (data) {
        $('#returnedCount').html(data.returnedCount);
        $('#preReturnCount').html(data.preReturnCount);
        //$('#preReturnReceiveCount').html(data.preReturnReceiveCount);
        //$('#preReCheckCount').html(data.preReCheckCount);
    });
    requestURL(dataService + "/operationCenter/realTimeWarehouseStats", query).done(function (data) {
        $('#tallyInWarehouse').html(data.tallyInWarehouse);
        $('#transferInWarehouse').html(data.transferInWarehouse);
        $('#soldOutWarehouse').html(data.soldOutWarehouse);
        $('#transferOutWarehouse').html(data.transferOutWarehouse);
    });

    requestURL(dataService + "/opt/getOptReceiveCnt", query).done(function (data) {
        $('#optshl').html(data.length);
        $('#optshl').parent().click(function(){
            customModal("OPT收货量",data,[{
                field:'product_no',
                title:'订单号',
                sortable:true
            },{
                field:'receive_channel_no',
                title:'收货方式',
                sortable:true
            }
            ])
        });
    });
    //下架
    /*requestURL(dataService + "/opt/getOptCheckCnt", query).done(function (data) {
        $('#optzjl').html(data.length);
        $('#optzjl').parent().click(function(){
            customModal("OPT质检量",data,[{
                field:"report_no",
                title:'订单号',
                sortable:true
            },{
                field:"type",
                title:"质检类型",
                sortable:true
            }])
        });
    });*/
    requestURL(dataService + "/opt/getOptInWarehouse", query).done(function (data) {
        $('#optrkl').html(data);
    });
    requestURL(dataService + "/opt/getOptInventoryCnt", query).done(function (data) {
        $('#optkcl').html(data);
    });

    //下架
    /*requestURL(dataService + "/opt/getOptTodoCheckCnt", query).done(function (data) {
        $('#optdzjl').html(data.length);
        $("#optdzjl").parent().click(function(){
            customModal("OPT待质检",data,[{
                field: 'inspection_product_series_no',
                title: '订单号',
                sortable:true
            },{
                field: 'serial_no',
                title: '收货单号',
                sortable:true
            },{
                field: 'inspection_type',
                title: '质检类型',
                sortable:true
            },{
                field: 'receive_dept',
                title: '接收部门',
                sortable:true
            },{
                field: 'ifReceived',
                title: '是否接收',
                sortable:true
            },{
                field: 'receipt_dt',
                title: '收货时间',
                sortable:true
            }])
        })
    });*/
    requestURL(dataService + "/opt/getOptTodoInWarehouse", query).done(function (data) {
        $('#optdrkl').html(data.length);
        $("#optdrkl").parent().click(function(){
            customModal("OPT待入库",data,[{
                field: 'transfer_product_no',
                title: '订单号',
                sortable:true
            },{
                field: 'transfer_dept',
                title: '移交部门',
                sortable:true
            },{
                field: 'serial_no',
                title: '收货单号',
                sortable:true
            },{
                field: 'receipt_dt',
                title: '收货时间',
                sortable:true
            },{
                field: 'operator_name',
                title: '最后操作人',
                sortable:true
            },{
                field: 'transfer_dt',
                title: '最后操作时间',
                sortable:true
            }])
        })
    });

    requestURL(dataService + "/opt/getOptPutAway",query).done(function(data){
        $('#optsjl').html(data.length);
        $('#optsjl').parent().click(function(){
            customModal("OPT上架量",data,[{
                field:'product_no',
                title:"订单号",
                sortable:true
            },{
                field:'agent_no',
                title:"收货方式",
                sortable:true
            }])
        })
    });
    requestURL(dataService + "/opt/getOptPendingPutAway",query).done(function(data){
        $('#optdsjl').html(data.length);
        $('#optdsjl').parent().click(function(){
            customModal("OPT待上架量",data,[{
                field:'transfer_product_no',
                title:"订单号",
                sortable:true
            },{
                field:'transfer_dept',
                title:"移交部门",
                sortable:true
            }])
        })
    });
    requestURL(dataService + "/opt/getOptTemporaryStock",query).done(function(data){
        $('#optzcl').html(data.length);
        $('#optzcl').parent().click(function(){
            customModal("OPT暂存量",data,[{
                field:'product_no',
                title:"订单号",
                sortable:true
            }])
        })
    });

    requestURL(dataService + "/opt/getOptPendingReturn",query).done(function(data){
        $('#optdthl').html(data.length);
        $('#optdthl').parent().click(function(){
            customModal("OPT待退货量", data,[{
                field:"product_no",
                title:"订单号",
                sortable:true
            },{
                field:"serial_no",
                title:"收货单号",
                sortable:true
            },{
                field:"status",
                title:"是否接收",
                sortable:true
            },{
                field:"updated_dt",
                title:"退货接收时间",
                sortable:true
            },{
                field:"receiver_name",
                title:"退货接收人",
                sortable:true
            },{
                field:"retrieve_no",
                title:"退货单号",
                sortable:true
            },{
                field:"created_dt",
                title:"退货单创建时间",
                sortable:true
            }
            ])
        })
    });

    requestURL(dataService + "/opt/getOptReturn", query).done(function(data){
        $("#optthl").html(data)
    });


    //质检指标- 新逻辑 -----------------------------------------------------------------------------------------------
    //OPT异常量
    requestURL(dataService + "/opt/getOptExceptionCount",query).done(function(data){
        $('#optycl').html(data.length);
        $('#optycl').parent().click(function(){
            customModal("OPT异常量", data,[{
                field:"business_no",
                title:"快递单号",
                sortable:true
            },{
                field:"product_no",
                title:"物品编号",
                sortable:true
            },{
                field:"exception_source",
                title:"异常来源",
                sortable:true
            },{
                field:"exception_type",
                title:"异常类型",
                sortable:true
            },{
                field:"created_dt",
                title:"创建时间",
                sortable:true
            }
            ])
        })
    });

    //OPT代拍提交量
    requestURL(dataService + "/opt/getOptAgentSubmitDetail",query).done(function(data){
        //console.log(data)
        $('#optdptjl').html(data.count);
        $('#optdptjl').parent().click(function(){
            customModal("OPT代拍提交量", data.list,[{
                field:"order_no",
                title:"代拍单号",
                sortable:true
            },{
                field:"logistics_serial_no",
                title:"物流单号",
                sortable:true
            },{
                field:"total_quantity",
                title:"数量",
                sortable:true
            },{
                field:"recycler_id",
                title:"商家名称",
                sortable:true
            }
            ])
        })
    });

    //物流质检量：
    requestURL(dataService + "/operationCenter/getLogisticsQualityInspectionFourGroup", query).done(function (data) {
        var sum = 0;
        _.each(data,function(e){
            sum  += e.sum;
        });
        query = {
            "date": moment().format("YYYY-MM-DD"),
            "operationCenter": operationCenter
        };
        requestURL(dataService + "/operationCenter/getLogisticsQualityInspectionColorSingle", query).done(function (ret) {
            _.each(ret,function(e){
                sum  += e.sum;
            });
            $('#expressInspection').html(sum);
            if(sum>0){
                $('#expressInspection').parent().attr("style","cursor:pointer;");
                $("#expressInspection").parent().click(function(){
                    popModal('/operation/OperationFrame/'+0+'/'+ operationCenter);
                });
            }
        });
    });

    //OPT质检量
    requestURL(dataService + "/operationCenter/getOPTInspectionFourGroup", query).done(function (data) {
        var sum = 0;
        _.each(data,function(e){
            sum  += e.sum;
        });
        query = {
            "date": moment().format("YYYY-MM-DD"),
            "operationCenter": operationCenter
        };
        requestURL(dataService + "/operationCenter/getOPTInspectionColorSingle", query).done(function (ret) {
            _.each(ret,function(e){
                sum  += e.sum;
            });
            $('#OPTInspection').html(sum);
            if(sum>0){
                $('#OPTInspection').parent().attr("style","cursor:pointer;");
                $("#OPTInspection").parent().click(function(){
                    popModal('/operation/OperationFrame/'+1+'/'+ operationCenter);
                });
            }
        });
    });

    //OPT待质检量：
    requestURL(dataService + "/operationCenter/getOPTWaitInspectionFiveGroup", query).done(function (data) {
        var sum = 0;
        //console.log(data);
        sum = data.color.length*1 + data.level.length*1+data.house.length*1+data.reject.length*1+data.quality.length*1;
        $('#OPTWaitInspection').html(sum);
        if(sum>0){
            $('#OPTWaitInspection').parent().attr("style","cursor:pointer;");
            $("#OPTWaitInspection").parent().click(function(){
                popModal('/operation/OperationFrame/'+3+'/'+ operationCenter);
            });
        }
    });

    //APP质检量
    requestURL(dataService + "/operationCenter/getAPPInspectionSum", query).done(function (data) {
        //console.log(data);
        $('#APPInspectionSum').html(data.length);
        if(data.length>0){
            $('#APPInspectionSum').parent().attr("style","cursor:pointer;");
            $("#APPInspectionSum").parent().click(function(){
                customModal("APP质检量", data,[{
                    field:"product_no",
                    title:"物品编号",
                    sortable:true
                }
                ])
            });
        }
    });

    //物流待质检量：
    requestURL(dataService + "/operationCenter/getLogisticsQualityWaitInspectionFiveGroup", query).done(function (data) {
        var sum = 0;
        //console.log(data);
        sum = data.color.length*1 + data.level.length*1+data.house.length*1+data.reject.length*1+data.quality.length*1;
        /*_.each(data,function(e){
            sum  += e.sum;
        });*/
        $('#expressWaitInspection').html(sum);
        if(sum>0){
            $('#expressWaitInspection').parent().attr("style","cursor:pointer;");
            $("#expressWaitInspection").parent().click(function(){
                popModal('/operation/OperationFrame/'+2+'/'+ operationCenter);
            });
        }
    });

    //App待质检量：
    requestURL(dataService + "/operationCenter/getAppWaitInspectionSum", query).done(function (data) {
        $('#AppWaitInspection').html(data.length);
        if(data.length>0){
            $('#AppWaitInspection').parent().attr("style","cursor:pointer;");
            $("#AppWaitInspection").parent().click(function(){
                customModal("APP待质检量", data,[{
                    field:"order_no",
                    title:"订单编号",
                    sortable:true
                }]);
            });
        }
    });
};

var updateClearStats = function (operationCenter) {
    $('h3[name="operationData"]').html('……');
    $('h3[name="clearData"]').html('……');

    var query = {
        "date": moment().format("YYYY-MM-DD"),
        "operationCenter": operationCenter
    };

    requestURL(dataService + "/operationCenter/getCacheUpdateTime", query).done(function (data) {
        console.log("更新时间：" + data);
        $(".unit-s").html(data);
    });


    //配件日清指标
    requestURL(dataService + "/operationCenter/getAccessoriesDailyClean", query).done(function (data) {
        $("#pjckxjl").html(data.pjckdxjl.length)
        $("#pjcksjl").html(data.pjckdsjl.length)
        $('#pjckxjl').parent().click(function(){
            customModal("配件仓库下架量",data.pjckdxjl,[{
                field: 'tradeNo',
                title: '单号',
                sortable:true
            },{
                field: 'trolleyNo',
                title: '货架',
                sortable:true
            }])
        })
        $('#pjcksjl').parent().click(function(){
            customModal("配件仓库上架量",data.pjckdsjl,[{
                field: 'tradeNo',
                title: '单号',
                sortable:true
            }])
        })
    });
    //理货日清指标
    /*requestURL(dataService + "/operationCenter/getTallyDailyClean", query).done(function (data) {
        $("#dbshwrkl").html(data.dbshwrkl.length)
        $("#dbshwrklbak").html(data.dbshwrkl.length)

        $("#wlshwrkl").html(data.wlshwrkl.length)
        $("#wlshwrklbak").html(data.wlshwrkl.length)

        $("#choujwrkl").html(data.choujwrkl.length)

        $('#dbshwrkl').parent().click(function(){
            customModal("调拨收货-未入库量",data.dbshwrkl,[{
                field: 'tradeNo',
                title: '单号',
                sortable:true
            }])
        })
        $('#dbshwrklbak').parent().click(function(){
            customModal("调拨收货-未入库量",data.dbshwrkl,[{
                field: 'tradeNo',
                title: '单号',
                sortable:true
            }])
        })

        $('#wlshwrkl').parent().click(function(){
            customModal("物流收货-未入库量",data.wlshwrkl,[{
                field: 'tradeNo',
                title: '单号',
                sortable:true
            },
                {
                    field: 'name',
                    title: '姓名',
                    sortable:true,
                },{
                    field: 'dept',
                    title: '类型',
                    sortable:true,
                },{
                    field: 'date',
                    title: '时间',
                    sortable:true,
                }])
        })
        $('#wlshwrklbak').parent().click(function(){
            customModal("物流收货-未入库量",data.wlshwrkl,[{
                field: 'tradeNo',
                title: '单号',
                sortable:true
            },
                {
                    field: 'name',
                    title: '姓名',
                    sortable:true,
                },{
                    field: 'dept',
                    title: '类型',
                    sortable:true,
                },{
                    field: 'date',
                    title: '时间',
                    sortable:true,
                }])
        })

        $('#choujwrkl').parent().click(function(){
            customModal("抽检-未入库量",data.choujwrkl,[{
                field: 'tradeNo',
                title: '单号',
                sortable:true
            },
                {
                    field: 'name',
                    title: '姓名',
                    sortable:true,
                }, {
                    field: 'date',
                    title: '时间',
                    sortable:true,
                }])
        })

    })*/

    //退货日清指标--Pro
    requestURL(dataService + "/operationCenter/getReturnDailyCleanPro", query).done(function (data) {
        $("#thdjsl").html(data.thdjsl.length);
        $('#thdjsl').parent().click(function(){
            customModal("待接收",data.thdjsl,[
                {
                    field: 'transfer_product_no',
                    title: '物品编号',
                    sortable:true
                },{
                    field: 'serial_no',
                    title: '收货单号',
                    sortable:true
                },{
                    field: 'agent_name',
                    title: '业务方',
                    sortable:true
                },{
                    field: 'created_dt',
                    title: '退货单创建时间',
                    sortable:true
                },{
                    field: 'transfer_dept',
                    title: '移交部门',
                    sortable:true
                },{
                    field: 'transfer_dt',
                    title: '移交时间',
                    sortable:true
                }])
        });

        $("#thdthl").html(data.thdthl.length);
        $('#thdthl').parent().click(function(){
            customModal("待退货",data.thdthl,[
                {
                    field: 'product_no',
                    title: '物品编号',
                    sortable:true
                },{
                    field: 'serial_no',
                    title: '收货单号',
                    sortable:true
                },{
                    field: 'agent_name',
                    title: '业务方',
                    sortable:true
                },{
                    field: 'created_dt',
                    title: '退货单时间',
                    sortable:true
                },{
                    field: 'receive_type',
                    title: '退货类型',
                    sortable:true
                }])
        })
    });
    //出库日清指标
    /*requestURL(dataService + "/operationCenter/getoutWarehouseDailyClean", query).done(function (data) {
        $("#djhl").html(data.djhl.length)
        $("#dhdl").html(data.dhdl.length)
        $("#zhdckl").html(data.zhdckl.length)
        $("#zfzztdckl").html(data.zfzztdckl.length)
        $('#djhl').parent().click(function(){
            customModal("待拣货量",data.djhl,[{
                field: 'tradeNo',
                title: '单号',
                sortable:true
            }])
        })
        $('#dhdl').parent().click(function(){
            customModal("待核对量",data.dhdl,[{
                field: 'tradeNo',
                title: '单号',
                sortable:true
            }])
        })
        $('#zhdckl').parent().click(function(){
            customModal("直接待出库量",data.zhdckl,[{
                field: 'tradeNo',
                title: '单号',
                sortable:true
            }])
        })
        $('#zfzztdckl').parent().click(function(){
            customModal("直发转自提待出库量",data.zfzztdckl,[{
                field: 'tradeNo',
                title: '单号',
                sortable:true
            }])
        })
    });*/

    requestURL(dataService + "/operationCenter/getoutWarehouseDailyCleanPro", query).done(function (data) {
        $("#ckthshdyjl").html(data.ckthshdyjl.length);
        $('#ckthshdyjl').parent().click(function(){
            customModal("退货收货待移交量",data.ckthshdyjl,[
                {
                    field: 'tradeNo',
                    title: '物品编号',
                    sortable:true
                },
                {
                    field: 'updated_dt',
                    title: '退货收货时间',
                    sortable:true
                },
                {
                    field: 'receive_dept',
                    title: '接收部门',
                    sortable:true
                }])
        });

        //带捡货量
        /*$("#ckdjhl").html(data.ckdjhl.length);
        $('#ckdjhl').parent().click(function(){
            customModal("待捡货量",data.ckdjhl,[
                {
                    field: 'tradeNo',
                    title: '出库单号',
                    sortable:true
                },
                {
                    field: 'created_dt',
                    title: '创建时间',
                    sortable:true
                },
                {
                    field: 'product_num',
                    title: '物品数量',
                    sortable:true
                }])
        });*/

        //待核对量
        /*$("#ckdhdl").html(data.ckdhdl.length);
        $('#ckdhdl').parent().click(function(){
            customModal("待核对量",data.ckdhdl,[
                {
                    field: 'tradeNo',
                    title: '出库单号',
                    sortable:true
                },
                {
                    field: 'created_dt',
                    title: '拣货完成时间',
                    sortable:true
                },
                {
                    field: 'product_num',
                    title: '已拣货数量',
                    sortable:true
                }])
        });*/

        $("#ckdzfl").html(data.ckdzfl.length);
        $('#ckdzfl').parent().click(function(){
            customModal("待直发量",data.ckdzfl,[
                {
                    field: 'tradeNo',
                    title: '发货单号',
                    sortable:true
                },
                {
                    field: 'update_by',
                    title: '最后操作人',
                    sortable:true
                },
                {
                    field: 'allowed_deliver_dt',
                    title: '可发货状态变更时间',
                    sortable:true
                }])
        });

        $("#ckdztl").html(data.ckdztl.length);
        $('#ckdztl').parent().click(function(){
            customModal("待自提量",data.ckdztl,[
                {
                    field: 'tradeNo',
                    title: '单号',
                    sortable:true
                },
                {
                    field: 'update_by',
                    title: '最后操作人',
                    sortable:true
                },
                {
                    field: 'allowed_deliver_dt',
                    title: '可发货状态变更时间',
                    sortable:true
                }])
        });

    });

    //新出库日清
    requestURL(dataService + "/operationCenter/outHouseClear", query).done(function (data) {
        console.log(data);
        $("#temp-to-be-pick").html(data.toBeAppendList.length + data.toBeOffList.length);
        $('#temp-to-be-pick').parent().click(function(){
            customCartModal('待拣货量(新)','tbModal','tbModalLabel','temp_to_be_',{to_be_append:data.toBeAppendList,to_be_off:data.toBeOffList});
        });

        $("#temp-to-be-check").html(data.toBeCheckList.length);
        $('#temp-to-be-check').parent().click(function(){
            customModal("待核对(新)",data.toBeCheckList,[
                {
                    field: 'category_id',
                    title: '出库类型',
                    sortable:true
                },
                {
                    field: 'document_serial_number',
                    title: '出库单号',
                    sortable:true
                },
                {
                    field: 'product_no',
                    title: '物品编号',
                    sortable:true
                },
                {
                    field: 'create_dt',
                    title: '创建时间',
                    sortable:true
                }])
        });

        $("#temp-to-be-package").html(data.toBePackageList.length);
        $('#temp-to-be-package').parent().click(function(){
            customModal("待打包(新)",data.toBePackageList,[
                {
                    field: 'category_id',
                    title: '出库类型',
                    sortable:true
                },
                {
                    field: 'document_serial_number',
                    title: '出库单号',
                    sortable:true
                },
                {
                    field: 'product_no',
                    title: '物品编号',
                    sortable:true
                },
                {
                    field: 'create_dt',
                    title: '创建时间',
                    sortable:true
                }])
        });
    });

    //理货暂存库日清指标
    /*requestURL(dataService + "/operationCenter/getTallyStoreDailyCleanPro", query).done(function (data) {
        //待接收量
        $("#lhzckdjsl").html(data.lhzckdjsl.length);
        $('#lhzckdjsl').parent().click(function(){
            customModal("待接收量",data.lhzckdjsl,[
                {
                    field: 'tradeNo',
                    title: '物品编号',
                    sortable:true
                },
                {
                    field: 'serial_no',
                    title: '收货单号',
                    sortable:true
                },
                {
                    field: 'agent_name',
                    title: '业务方',
                    sortable:true
                },
                {
                    field: 'dept',
                    title: '移交部门',
                    sortable:true
                },
                {
                    field: 'transfer_dt',
                    title: '移交时间',
                    sortable:true
                }])
        });

        //待上架量
        $("#lhzckdsjl").html(data.lhzckdsjl.length);
        $('#lhzckdsjl').parent().click(function(){
            customModal("待上架量",data.lhzckdsjl,[
                {
                    field: 'tradeNo',
                    title: '物品编号',
                    sortable:true
                },
                {
                    field: 'serial_no',
                    title: '收货单号',
                    sortable:true
                },
                {
                    field: 'agent_name',
                    title: '业务方',
                    sortable:true
                },
                {
                    field: 'receive_date',
                    title: '接收时间',
                    sortable:true
                }])
        });

        //待下架量
        $("#lhzckdxjl").html(data.lhzckdxjl.length);
        $('#lhzckdxjl').parent().click(function(){
            customModal("待下架量",data.lhzckdxjl,[
                {
                    field: 'tradeNo',
                    title: '物品编号',
                    sortable:true
                },{
                    field: 'serial_no',
                    title: '收货单号',
                    sortable:true
                },
                {
                    field: 'agent_name',
                    title: '业务方',
                    sortable:true
                },
                {
                    field: 'operation_dt',
                    title: '状态变更时间',
                    sortable:true
                },
                {
                    field: 'target_dept',
                    title: '接收部门',
                    sortable:true
                }])
        });
    });*/

    //入库日清指标
    requestURL(dataService + "/operationCenter/getInStoreDailyClean", query).done(function (data) {
        //待接收量  -- 理货暂存
        /*$("#rkdjsllhzck").html(data.rkdjsllhzck.length);*/
        //todo
        /*$('#rkdjsllhzck').parent().click(function(){
            customModal("待接收量(理货暂存)",data.rkdjsllhzck,[
                {
                    field: 'tradeNo',
                    title: '物品编号',
                    sortable:true
                },
                {
                    field: 'serial_no',
                    title: '收货单号',
                    sortable:true
                },
                {
                    field: 'agent_name',
                    title: '业务方',
                    sortable:true
                },
                {
                    field: 'operation_dt',
                    title: '状态变更时间',
                    sortable:true
                }])
        });*/

        //待接收量   -- 非理货暂存
        $("#rkdjslflhzck").html(data.rkdjslflhzck.length);
        $('#rkdjslflhzck').parent().click(function(){
            customModal("待接收量(非理货暂存)",data.rkdjslflhzck,[
                {
                    field: 'tradeNo',
                    title: '物品编号',
                    sortable:true
                },
                {
                    field: 'serial_no',
                    title: '收货单号',
                    sortable:true
                },
                {
                    field: 'agent_name',
                    title: '业务方',
                    sortable:true
                },
                {
                    field: 'dept',
                    title: '移交部门',
                    sortable:true
                },
                {
                    field: 'transfer_dt',
                    title: '移交时间',
                    sortable:true
                }])
        });

        //待入库量
        $("#rkdrkl").html(data.rkdrkl.length);
        $('#rkdrkl').parent().click(function(){
            customModal("待入库量",data.rkdrkl,[
                {
                    field: 'document_item_serial_number',
                    title: '物品编号',
                    sortable:true
                },
                {
                    field: 'serial_no',
                    title: '收货单号',
                    sortable:true
                },
                {
                    field: 'agent_name',
                    title: '业务方',
                    sortable:true
                },
                {
                    field: 'document_created_datetime',
                    title: '接收时间',
                    sortable:true
                }
            ])
        });
    });

    //理货日清指标  --
    requestURL(dataService + "/operationCenter/getTallyDailyCleanPro", query).done(function (data) {
        //待接收量
        $("#lhdjsl").html(data.lhdjsl.length);
        //todo
        $('#lhdjsl').parent().click(function(){
            customModal("待接收量",data.lhdjsl,[
                {
                    field: 'tradeNo',
                    title: '物品编号',
                    sortable:true
                },
                {
                    field: 'serial_no',
                    title: '收货单号',
                    sortable:true
                },
                {
                    field: 'agent_name',
                    title: '业务方',
                    sortable:true
                },
                {
                    field: 'transfer_dept',
                    title: '移交部门',
                    sortable:true
                },
                {
                    field: 'receive_dept',
                    title: '接收部门',
                    sortable:true
                },
                {
                    field: 'created_dt',
                    title: '创建时间',
                    sortable:true
                }])
        });

        //待移交量（除订单退货,理货暂存）
        $("#lhdtjlcddthlhzc").html(data.lhdtjlcddthlhzc.length);
        $('#lhdtjlcddthlhzc').parent().click(function(){
            customModal("待移交量(除订单退货,理货暂存库)",data.lhdtjlcddthlhzc,[
                {
                    field: 'tradeNo',
                    title: '物品编号',
                    sortable:true
                },
                {
                    field: 'serial_no',
                    title: '收货单号',
                    sortable:true
                },
                {
                    field: 'agent_name',
                    title: '业务方',
                    sortable:true
                },
                {
                    field: 'receive_dept',
                    title: '接收部门',
                    sortable:true
                },
                {
                    field: 'updated_dt',
                    title: '创建时间',
                    sortable:true
                }])
        });

        //待移交量（除订单退货,非理货暂存）
        $("#lhdtjlcddthflhzc").html(data.lhdtjlcddthflhzc.length);
        $('#lhdtjlcddthflhzc').parent().click(function(){
            customModal("待移交量(除订单退货,非理货暂存库)",data.lhdtjlcddthflhzc,[
                {
                    field: 'tradeNo',
                    title: '物品编号',
                    sortable:true
                },
                {
                    field: 'serial_no',
                    title: '收货单号',
                    sortable:true
                },
                {
                    field: 'agent_name',
                    title: '业务方',
                    sortable:true
                },
                {
                    field: 'transfer_dept',
                    title: '移交部门',
                    sortable:true
                },
                {
                    field: 'receive_dept',
                    title: '接收部门',
                    sortable:true
                },
                {
                    field: 'transfer_dt',
                    title: '移交时间',
                    sortable:true
                }])
        });

        //-- 待移交量（订单退货）
        $("#lhdyjlddth").html(data.lhdyjlddth.length);
        $('#lhdyjlddth').parent().click(function(){
            customModal("待移交量(订单退货)",data.lhdyjlddth,[
                {
                    field: 'tradeNo',
                    title: '物品编号',
                    sortable:true
                },
                {
                    field: 'serial_no',
                    title: '收货单号',
                    sortable:true
                },
                {
                    field: 'agent_name',
                    title: '业务方',
                    sortable:true
                },
                {
                    field: 'created_dt',
                    title: '退货单创建时间',
                    sortable:true
                },
                {
                    field: 'transfer_dept',
                    title: '移交部门',
                    sortable:true
                },
                {
                    field: 'receive_dept',
                    title: '接收部门',
                    sortable:true
                },
                {
                    field: 'transfer_dt',
                    title: '移交时间',
                    sortable:true
                }
            ])
        });
    });

    //收货日清-新
    requestURL(dataService + "/operationCenter/getReceiptClear", query).done(function (data) {
        //物流收货待移交量
        $("#shrqwlshdyjl").html(data.shrqwlshdyjl.length);
        $('#shrqwlshdyjl').parent().click(function(){
            customModal("物流收货待移交量",data.shrqwlshdyjl,[
                {
                    field: 'transfer_product_no',
                    title: '物品编号',
                    sortable:true
                },
                {
                    field: 'receipt_dt',
                    title: '收货时间',
                    sortable:true
                },
                {
                    field: 'receive_dept',
                    title: '接收部门',
                    sortable:true
                },
                {
                    field: 'transfer_name',
                    title: '移交人',
                    sortable:true
                }])
        });

        //调拨收货待移交量
        $("#shrqdbshdyjl").html(data.shrqdbshdyjl.length);
        $('#shrqdbshdyjl').parent().click(function(){
            customModal("调拨收货待移交量",data.shrqdbshdyjl,[
                {
                    field: 'transfer_product_no',
                    title: '物品编号',
                    sortable:true
                },
                {
                    field: 'receipt_dt',
                    title: '收货时间',
                    sortable:true
                },
                {
                    field: 'receive_dept',
                    title: '接收部门',
                    sortable:true
                },
                {
                    field: 'transfer_name',
                    title: '移交人',
                    sortable:true
                }])
        });

        //代拍收货待移交量
        $("#shrqdpshdyjl").html(data.shrqdpshdyjl.length);
        $('#shrqdpshdyjl').parent().click(function(){
            customModal("代拍收货待移交量",data.shrqdpshdyjl,[
                {
                    field: 'transfer_product_no',
                    title: '物品编号',
                    sortable:true
                },
                {
                    field: 'serial_no',
                    title: '收货单号',
                    sortable:true
                },
                {
                    field: 'receipt_dt',
                    title: '收货时间',
                    sortable:true
                },
                {
                    field: 'receive_dept',
                    title: '接收部门',
                    sortable:true
                },
                {
                    field: 'transfer_name',
                    title: '移交人',
                    sortable:true
                }])
        });

        //-- 采购收货待移交量
        $("#shrqcgshdyjl").html(data.shrqcgshdyjl.length);
        $('#shrqcgshdyjl').parent().click(function(){
            customModal("采购收货待移交量",data.shrqcgshdyjl,[
                {
                    field: 'transfer_product_no',
                    title: '物品编号',
                    sortable:true
                },
                {
                    field: 'serial_no',
                    title: '收货单号',
                    sortable:true
                },
                {
                    field: 'receipt_dt',
                    title: '收货时间',
                    sortable:true
                },
                {
                    field: 'receive_dept',
                    title: '接收部门',
                    sortable:true
                },
                {
                    field: 'transfer_name',
                    title: '移交人',
                    sortable:true
                }
            ])
        });
    });

    //收货日清-新（异常部分）
    requestURL(dataService + "/operationCenter/getExceptionClear", query).done(function (data) {
        //物流异常待处理量
        $("#shrqwlycdcll").html(data.shrqwlycdcll.length);
        $('#shrqwlycdcll').parent().click(function(){
            customModal("物流异常待处理量",data.shrqwlycdcll,[
                {
                    field: 'exception_no',
                    title: '异常单号',
                    sortable:true
                },
                {
                    field: 'product_no',
                    title: '物品编号',
                    sortable:true
                },
                {
                    field: 'express_serial_no',
                    title: '快递单号',
                    sortable:true
                },
                {
                    field: 'agent_no',
                    title: '业务方',
                    sortable:true
                },
                {
                    field: 'created_dt',
                    title: '创建时间',
                    sortable:true
                }])
        });

        //代拍异常待处理量
        $("#shrqdpycdcll").html(data.shrqdpycdcll.length);
        $('#shrqdpycdcll').parent().click(function(){
            customModal("代拍异常待处理量",data.shrqdpycdcll,[
                {
                    field: 'exception_no',
                    title: '异常单号',
                    sortable:true
                },
                {
                    field: 'product_no',
                    title: '物品编号',
                    sortable:true
                },
                {
                    field: 'express_serial_no',
                    title: '快递单号',
                    sortable:true
                },
                {
                    field: 'agent_no',
                    title: '业务方',
                    sortable:true
                }])
        });

        //验货异常待处理量
        $("#shrqyhycdcll").html(data.shrqyhycdcll.length);
        $('#shrqyhycdcll').parent().click(function(){
            customModal("验货异常待处理量",data.shrqyhycdcll,[
                {
                    field: 'exception_no',
                    title: '异常单号',
                    sortable:true
                },
                {
                    field: 'product_no',
                    title: '物品编号',
                    sortable:true
                },
                {
                    field: 'express_serial_no',
                    title: '快递单号',
                    sortable:true
                },
                {
                    field: 'agent_no',
                    title: '业务方',
                    sortable:true
                },
                {
                    field: 'created_dt',
                    title: '创建时间',
                    sortable:true
                }])
        });

        //-- 已登记待处理量
        $("#shrqydjdcll").html(data.shrqydjdcll.length);
        $('#shrqydjdcll').parent().click(function(){
            customModal("已登记待处理量",data.shrqydjdcll,[
                {
                    field: 'exception_no',
                    title: '异常单号',
                    sortable:true
                },
                {
                    field: 'product_no',
                    title: '物品编号',
                    sortable:true
                },
                {
                    field: 'express_serial_no',
                    title: '快递单号',
                    sortable:true
                },
                {
                    field: 'source',
                    title: '异常来源',
                    sortable:true
                },
                {
                    field: 'status_updated_dt',
                    title: '状态变更时间',
                    sortable:true
                },
                {
                    field: 'agent_no',
                    title: '业务方',
                    sortable:true
                }
            ])
        });

        //-- 异常解除待移交量
        $("#shrqycjcdyjl").html(data.shrqycjcdyjl.length);
        $('#shrqycjcdyjl').parent().click(function(){
            customModal("异常解除待移交量",data.shrqycjcdyjl,[
                {
                    field: 'transfer_product_no',
                    title: '物品编号',
                    sortable:true
                },
                {
                    field: 'serial_no',
                    title: '收货单号',
                    sortable:true
                },
                {
                    field: 'agent_no',
                    title: '业务方',
                    sortable:true
                },
                {
                    field: 'receive_dept',
                    title: '接收部门',
                    sortable:true
                },
                {
                    field: 'created_dt',
                    title: '创建时间',
                    sortable:true
                }
            ])
        });
    });

    //质检日清-新
    /*requestURL(dataService + "/operationCenter/getQualityInspectorClear", query).done(function (data) {
        //待接收量
        $("#zjrqdjsl").html(data.zjrqdjsl_djzj.length + data.zjrqdjsl_ckcj.length + data.zjrqdjsl_thzj.length);
        $('#zjrqdjsl').parent().click(function(){
            customCartModal('待接收量','modal','modalLabel','zjrqdjsl',{djzj:data.zjrqdjsl_djzj,ckcj:data.zjrqdjsl_ckcj,thzj:data.zjrqdjsl_thzj});
        });

        //待验货量
        $("#zjrqdyhl").html(data.zjrqdyhl_djzj.length + data.zjrqdyhl_ckcj.length + data.zjrqdyhl_thzj.length);
        $('#zjrqdyhl').parent().click(function(){
            customCartModal('待验货量','modal','modalLabel','zjrqdyhl',{djzj:data.zjrqdyhl_djzj,ckcj:data.zjrqdyhl_ckcj,thzj:data.zjrqdyhl_thzj});
        });

        //待移交量
        $("#zjrqdyjl").html(data.zjrqdyjl_djzj.length + data.zjrqdyjl_ckcj.length + data.zjrqdyjl_thzj.length);
        $('#zjrqdyjl').parent().click(function(){
            customCartModal('待移交量','modal','modalLabel','zjrqdyjl',{djzj:data.zjrqdyjl_djzj,ckcj:data.zjrqdyjl_ckcj,thzj:data.zjrqdyjl_thzj});
        });
    });*/

    //抽检日清-新
    /*requestURL(dataService + "/operationCenter/getRandomInspectorClear", query).done(function (data) {
        //待接收量
        $("#cjrqdjsl").html(data.cjrqdjsl_ipqc.length + data.cjrqdjsl_rqc.length + data.cjrqdjsl_ckcj.length);
        $('#cjrqdjsl').parent().click(function(){
            customCartModal('待接收量','cjModal','cjModalLabel','cjrqdjsl',{ipqc:data.cjrqdjsl_ipqc,rqc:data.cjrqdjsl_rqc,ckcj:data.cjrqdjsl_ckcj});
        });

        //待验货量
        $("#cjrqdyhl").html(data.cjrqdyhl_ipqc.length + data.cjrqdyhl_rqc.length + data.cjrqdyhl_ckcj.length);
        $('#cjrqdyhl').parent().click(function(){
            customCartModal('待验货量','cjModal','cjModalLabel','cjrqdyhl',{ipqc:data.cjrqdyhl_ipqc,rqc:data.cjrqdyhl_rqc,ckcj:data.cjrqdyhl_ckcj});
        });

        //待移交量
        $("#cjrqdyjl").html(data.cjrqdyjl_ipqc.length + data.cjrqdyjl_rqc.length + data.cjrqdyjl_ckcj.length);
        $('#cjrqdyjl').parent().click(function(){
            customCartModal('待移交量','cjModal','cjModalLabel','cjrqdyjl',{ipqc:data.cjrqdyjl_ipqc,rqc:data.cjrqdyjl_rqc,ckcj:data.cjrqdyjl_ckcj});
        });
    });*/

    //质检日清 + 抽检日清 + 优品复检三合一
    requestURL(dataService + "/operationCenter/getRandomJoinQualityInspectorClear", query).done(function (data) {
        //待接收量
        $("#zjrqdjsl").html(data.quality_djsl_djzj.length + data.quality_djsl_ckcj.length + data.quality_djsl_thzj.length + data.quality_djsl_bjzj.length);
        $('#zjrqdjsl').parent().click(function(){
            customCartModal('待接收量','modal','modalLabel','quality_djsl',{djzj:data.quality_djsl_djzj,ckcj:data.quality_djsl_ckcj,thzj:data.quality_djsl_thzj,bjzj:data.quality_djsl_bjzj});
        });

        //待验货量
        $("#zjrqdyhl").html(data.quality_dyhl_djzj.length + data.quality_dyhl_ckcj.length + data.quality_dyhl_thzj.length + data.quality_dyhl_bjzj.length);
        $('#zjrqdyhl').parent().click(function(){
            customCartModal('待验货量','modal','modalLabel','quality_dyhl',{djzj:data.quality_dyhl_djzj,ckcj:data.quality_dyhl_ckcj,thzj:data.quality_dyhl_thzj,bjzj:data.quality_dyhl_bjzj});
        });

        //待移交量
        $("#zjrqdyjl").html(data.quality_dyjl_djzj.length + data.quality_dyjl_ckcj.length + data.quality_dyjl_thzj.length + data.quality_dyjl_bjzj.length);
        $('#zjrqdyjl').parent().click(function(){
            customCartModal('待移交量','modal','modalLabel','quality_dyjl',{djzj:data.quality_dyjl_djzj,ckcj:data.quality_dyjl_ckcj,thzj:data.quality_dyjl_thzj,bjzj:data.quality_dyjl_bjzj});
        });


        //抽检日清
        //待接收量
        $("#cjrqdjsl").html(data.random_djsl_ipqc.length + data.random_djsl_rqc.length);
        $('#cjrqdjsl').parent().click(function(){
            customCartModal('待接收量','cjModal','cjModalLabel','random_djsl',{ipqc:data.random_djsl_ipqc,rqc:data.random_djsl_rqc});
        });

        //待验货量
        $("#cjrqdyhl").html(data.random_dyhl_ipqc.length + data.random_dyhl_rqc.length);
        $('#cjrqdyhl').parent().click(function(){
            customCartModal('待验货量','cjModal','cjModalLabel','random_dyhl',{ipqc:data.random_dyhl_ipqc,rqc:data.random_dyhl_rqc});
        });

        //待移交量
        $("#cjrqdyjl").html(data.random_dyjl_ipqc.length + data.random_dyjl_rqc.length);
        $('#cjrqdyjl').parent().click(function() {
            customCartModal('待移交量','cjModal','cjModalLabel','random_dyjl',{ipqc:data.random_dyjl_ipqc,rqc:data.random_dyjl_rqc});
        });


        //优品复检
        //待接收量
        $("#ypfjrqdjsl").html(data.djsl_superior.length);
        $('#ypfjrqdjsl').parent().click(function(){
            customNextModal("待接收量", data.djsl_superior, columnsMap.get('quality_djsl'));
        });

        //待验货量
        $("#ypfjrqdyhl").html(data.dyhl_superior.length);
        $('#ypfjrqdyhl').parent().click(function(){
            customNextModal("待接收量", data.dyhl_superior, columnsMap.get('quality_dyhl'));
        });

        //待移交量
        $("#ypfjrqdyjl").html(data.dyjl_superior.length);
        $('#ypfjrqdyjl').parent().click(function() {
            customNextModal("待接收量", data.dyjl_superior, columnsMap.get('quality_dyjl'));
        });

    });

    //复检日清-新
    requestURL(dataService + "/operationCenter/getRepeatInspectorClear", query).done(function (data) {
        //待接收量
        $("#fjrqdjsl").html(data.fjrqdjsl_lhzck.length + data.fjrqdjsl_flhzck.length);
        $('#fjrqdjsl').parent().click(function(){
            customCartModal('待接收量','fjModal','fjModalLabel','fjrqdjsl',{lhzck:data.fjrqdjsl_lhzck,flhzck:data.fjrqdjsl_flhzck});
        });

        //待验货量
        $("#fjrqdyhl").html(data.fjrqdyhl.length);
        $('#fjrqdyhl').parent().click(function(){
            customModal("待验货量",data.fjrqdyhl,[
                {
                    field: 'inspection_product_series_no',
                    title: '物品编号',
                    sortable:true
                },
                {
                    field: 'serial_no',
                    title: '收货单号',
                    sortable:true
                },
                {
                    field: 'agent_no',
                    title: '业务方',
                    sortable:true
                },
                {
                    field: 'receive_date',
                    title: '接收时间',
                    sortable:true
                },
                {
                    field: 'receiver_name',
                    title: '接收人',
                    sortable:true
                }])
        });

        //待移交量
        $("#fjrqdyjl").html(data.fjrqdyjl.length);
        $('#fjrqdyjl').parent().click(function(){
            customModal("待移交量",data.fjrqdyjl,[
                {
                    field: 'transfer_product_no',
                    title: '物品编号',
                    sortable:true
                },
                {
                    field: 'serial_no',
                    title: '收货单号',
                    sortable:true
                },
                {
                    field: 'agent_no',
                    title: '业务方',
                    sortable:true
                },
                {
                    field: 'receive_dept',
                    title: '接收部门',
                    sortable:true
                },
                {
                    field: 'created_dt',
                    title: '创建时间',
                    sortable:true
                },
                {
                    field: 'transfer_name',
                    title: '移交人',
                    sortable:true
                }])
        });
    });

    //退货审核日清-新
    requestURL(dataService + "/operationCenter/getBackAuditClear", query).done(function (data) {
        //待接收量
        $("#thrqdjsl").html(data.thrqdjsl.length);
        $('#thrqdjsl').parent().click(function(){
            customModal("待接收量",data.thrqdjsl,[
                {
                    field: 'transfer_product_no',
                    title: '物品编号',
                    sortable:true
                },
                {
                    field: 'serial_no',
                    title: '收货单号',
                    sortable:true
                },
                {
                    field: 'agent_no',
                    title: '业务方',
                    sortable:true
                },
                {
                    field: 'created_dt',
                    title: '创建时间',
                    sortable:true
                },
                {
                    field: 'transfer_dept',
                    title: '移交部门',
                    sortable:true
                },
                {
                    field: 'transfer_dt',
                    title: '移交时间',
                    sortable:true
                },
                {
                    field: 'operator_name',
                    title: '理货人',
                    sortable:true
                }])
        });

        //待审核量
        $("#thrqdshl").html(data.thrqdshl.length);
        $('#thrqdshl').parent().click(function(){
            customModal("待审核量",data.thrqdshl,[
                {
                    field: 'transfer_product_no',
                    title: '物品编号',
                    sortable:true
                },
                {
                    field: 'serial_no',
                    title: '收货单号',
                    sortable:true
                },
                {
                    field: 'agent_no',
                    title: '业务方',
                    sortable:true
                },
                {
                    field: 'created_dt',
                    title: '创建时间',
                    sortable:true
                },
                {
                    field: 'transfer_dept',
                    title: '移交部门',
                    sortable:true
                },
                {
                    field: 'transfer_dt',
                    title: '移交时间',
                    sortable:true
                },
                {
                    field: 'operator_name',
                    title: '理货人',
                    sortable:true
                }])
        });

        //待移交量
        $("#thrqdyjl").html(data.thrqdyjl.length);
        $('#thrqdyjl').parent().click(function(){
            customModal("待移交量",data.thrqdyjl,[
                {
                    field: 'transfer_product_no',
                    title: '物品编号',
                    sortable:true
                },
                {
                    field: 'serial_no',
                    title: '收货单号',
                    sortable:true
                },
                {
                    field: 'agent_no',
                    title: '业务方',
                    sortable:true
                },
                {
                    field: 'created_dt',
                    title: '创建时间',
                    sortable:true
                },
                {
                    field: 'receive_dept',
                    title: '接收部门',
                    sortable:true
                },
                {
                    field: 'transfer_name',
                    title: '移交人',
                    sortable:true
                }])
        });
    });

    //隐私清除日清-新
    requestURL(dataService + "/operationCenter/getPrivacyClearanceClear", query).done(function (data) {
        //待接收量
        $("#ysqcrqdjsl").html(data.ysqcrqdjsl_lhzck.length + data.ysqcrqdjsl_flhzck.length);
        $('#ysqcrqdjsl').parent().click(function(){
            customCartModal('待接收量','fjModal','fjModalLabel','ysqcrqdjsl',{lhzck:data.ysqcrqdjsl_lhzck,flhzck:data.ysqcrqdjsl_flhzck});
        });

        //待移交量
        $("#ysqcrqdyjl").html(data.ysqcrqdyjl.length);
        $('#ysqcrqdyjl').parent().click(function(){
            customModal("待移交量",data.ysqcrqdyjl,[
                {
                    field: 'transfer_product_no',
                    title: '物品编号',
                    sortable:true
                },
                {
                    field: 'agent_no',
                    title: '业务方',
                    sortable:true
                },
                {
                    field: 'receive_dept',
                    title: '接收部门',
                    sortable:true
                },
                {
                    field: 'transfer_dept',
                    title: '移交部门',
                    sortable:true
                },
                {
                    field: 'created_dt',
                    title: '创建时间',
                    sortable:true
                },
                {
                    field: 'transfer_name',
                    title: '移交人',
                    sortable:true
                }])
        });
    });

    //隐私清除日清-新-新
    /*requestURL(dataService + "/operationCenter/getNewPrivacyClearanceClear", query).done(function (data) {
        //待接收量
        $("#ysqcrqdjsl_new").html(data.nysqcrqdjsl_aqc.length + data.nysqcrqdjsl_blancoo.length);
        $('#ysqcrqdjsl_new').parent().click(function(){
            customCartModal('待接收量','ysModal','ysModalLabel','nysqcrqdjsl',{aqc:data.nysqcrqdjsl_aqc,blancoo:data.nysqcrqdjsl_blancoo});
        });

        //待移交量
        $("#ysqcrqdyjl_new").html(data.nysqcrqdyjl_aqc.length + data.nysqcrqdyjl_blancoo.length);
        $('#ysqcrqdyjl_new').parent().click(function(){
            customCartModal('待移交量','ysModal','ysModalLabel','nysqcrqdjsl',{aqc:data.nysqcrqdyjl_aqc,blancoo:data.nysqcrqdyjl_blancoo});
        });
    });*/

    //隐私清除日清-新-新-待清除
    requestURL(dataService + "/operationCenter/getNewPrivacyClearanceWaitClear", query).done(function (data) {
        //待清除量
        $("#ysqcrqdqcl_new").html(data.nysqcrqdqcl_aqc.length + data.nysqcrqdqcl_blancoo.length);
        $('#ysqcrqdqcl_new').parent().click(function(){
            customCartModal('待清除量','ysModal','ysModalLabel','nysqcrqdjsl',{aqc:data.nysqcrqdqcl_aqc,blancoo:data.nysqcrqdqcl_blancoo});
        });
    });

    initColumnsMap();

};


//自定义弹出层
function customModal(title,data,colums){
    $("#myModal").off('shown.bs.modal').on('shown.bs.modal', function () {
        $("#myModalLabel").text(title);
        $("#modalContent").bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            search: true,
            data:data,
            columns: colums
        });
    });
    $("#myModal").modal()
}

var columnsMap = new Map();
var initColumnsMap = function(){

    //质检
    columnsMap.set("quality_djsl",[
        {
            field: 'transfer_product_no',
            title: '物品编号',
            sortable:true
        },
        {
            field: 'serial_no',
            title: '收货单号',
            sortable:true
        },
        {
            field: 'agent_no',
            title: '业务方',
            sortable:true
        },
        {
            field: 'receipt_dt',
            title: '收货时间',
            sortable:true
        },
        {
            field: 'transfer_dept',
            title: '移交部门',
            sortable:true
        },
        {
            field: 'transfer_dt',
            title: '移交时间',
            sortable:true
        },
        {
            field: 'operator_name',
            title: '理货人',
            sortable:true
        }]);

    columnsMap.set("quality_dyhl",[
        {
            field: 'inspection_product_series_no',
            title: '物品编号',
            sortable:true
        },
        {
            field: 'serial_no',
            title: '收货单号',
            sortable:true
        },
        {
            field: 'agent_no',
            title: '业务方',
            sortable:true
        },
        {
            field: 'receipt_dt',
            title: '收货时间',
            sortable:true
        },
        {
            field: 'receive_date',
            title: '接收时间',
            sortable:true
        },
        {
            field: 'inspector',
            title: '质检查询的质检人',
            sortable:true
        }]);

    columnsMap.set("quality_dyjl",[
        {
            field: 'transfer_product_no',
            title: '物品编号',
            sortable:true
        },
        {
            field: 'serial_no',
            title: '收货单号',
            sortable:true
        },
        {
            field: 'agent_no',
            title: '业务方',
            sortable:true
        },
        {
            field: 'receipt_dt',
            title: '收货时间',
            sortable:true
        },
        {
            field: 'receive_dept',
            title: '接收部门',
            sortable:true
        },
        {
            field: 'created_dt',
            title: '创建时间',
            sortable:true
        },
        {
            field: 'transfer_name',
            title: '移交人',
            sortable:true
        }]);

    //抽检
    columnsMap.set("random_djsl",[
        {
            field: 'transfer_product_no',
            title: '物品编号',
            sortable:true
        },
        {
            field: 'serial_no',
            title: '收货单号',
            sortable:true
        },
        {
            field: 'agent_no',
            title: '业务方',
            sortable:true
        },
        {
            field: 'receipt_dt',
            title: '收货时间',
            sortable:true
        },
        {
            field: 'transfer_dept',
            title: '移交部门',
            sortable:true
        },
        {
            field: 'transfer_dt',
            title: '移交时间',
            sortable:true
        },
        {
            field: 'operator_name',
            title: '理货人',
            sortable:true
        }]);

    columnsMap.set("random_dyhl",[
        {
            field: 'inspection_product_series_no',
            title: '物品编号',
            sortable:true
        },
        {
            field: 'serial_no',
            title: '收货单号',
            sortable:true
        },
        {
            field: 'agent_no',
            title: '业务方',
            sortable:true
        },
        {
            field: 'receipt_dt',
            title: '收货时间',
            sortable:true
        },
        {
            field: 'receive_date',
            title: '接收时间',
            sortable:true
        },
        {
            field: 'receiver_name',
            title: '接收人',
            sortable:true
        }]);

    columnsMap.set("random_dyjl",[
        {
            field: 'transfer_product_no',
            title: '物品编号',
            sortable:true
        },
        {
            field: 'serial_no',
            title: '收货单号',
            sortable:true
        },
        {
            field: 'agent_no',
            title: '业务方',
            sortable:true
        },
        {
            field: 'receipt_dt',
            title: '收货时间',
            sortable:true
        },
        {
            field: 'receive_dept',
            title: '接收部门',
            sortable:true
        },
        {
            field: 'created_dt',
            title: '创建时间',
            sortable:true
        },
        {
            field: 'transfer_name',
            title: '移交人',
            sortable:true
        }]);

    //质检
    columnsMap.set("zjrqdjsl_djzj",[
        {
            field: 'transfer_product_no',
            title: '物品编号',
            sortable:true
        },
        {
            field: 'serial_no',
            title: '收货单号',
            sortable:true
        },
        {
            field: 'agent_no',
            title: '业务方',
            sortable:true
        },
        {
            field: 'receipt_dt',
            title: '收货时间',
            sortable:true
        },
        {
            field: 'transfer_dept',
            title: '移交部门',
            sortable:true
        },
        {
            field: 'transfer_dt',
            title: '移交时间',
            sortable:true
        },
        {
            field: 'operator_name',
            title: '理货人',
            sortable:true
        }]);
    columnsMap.set("zjrqdjsl_ckcj",[
        {
            field: 'transfer_product_no',
            title: '物品编号',
            sortable:true
        },
        {
            field: 'serial_no',
            title: '收货单号',
            sortable:true
        },
        {
            field: 'agent_no',
            title: '业务方',
            sortable:true
        },
        {
            field: 'created_dt',
            title: '创建时间',
            sortable:true
        },
        {
            field: 'transfer_dept',
            title: '移交部门',
            sortable:true
        },
        {
            field: 'transfer_dt',
            title: '移交时间',
            sortable:true
        },
        {
            field: 'operator_name',
            title: '理货人',
            sortable:true
        }]);
    columnsMap.set("zjrqdjsl_thzj",[
        {
            field: 'transfer_product_no',
            title: '物品编号',
            sortable:true
        },
        {
            field: 'serial_no',
            title: '收货单号',
            sortable:true
        },
        {
            field: 'agent_no',
            title: '业务方',
            sortable:true
        },
        {
            field: 'created_dt',
            title: '创建时间',
            sortable:true
        },
        {
            field: 'transfer_dept',
            title: '移交部门',
            sortable:true
        },
        {
            field: 'transfer_dt',
            title: '移交时间',
            sortable:true
        },
        {
            field: 'operator_name',
            title: '理货人',
            sortable:true
        }]);

    columnsMap.set("zjrqdyhl_djzj",[
        {
            field: 'inspection_product_series_no',
            title: '物品编号',
            sortable:true
        },
        {
            field: 'serial_no',
            title: '收货单号',
            sortable:true
        },
        {
            field: 'agent_no',
            title: '业务方',
            sortable:true
        },
        {
            field: 'receipt_dt',
            title: '收货时间',
            sortable:true
        },
        {
            field: 'receive_date',
            title: '接收时间',
            sortable:true
        },
        {
            field: 'receiver_name',
            title: '接收人',
            sortable:true
        }]);
    columnsMap.set("zjrqdyhl_ckcj",[
        {
            field: 'inspection_product_series_no',
            title: '物品编号',
            sortable:true
        },
        {
            field: 'serial_no',
            title: '收货单号',
            sortable:true
        },
        {
            field: 'agent_no',
            title: '业务方',
            sortable:true
        },
        {
            field: 'created_dt',
            title: '创建时间',
            sortable:true
        },
        {
            field: 'receive_date',
            title: '接收时间',
            sortable:true
        },
        {
            field: 'receiver_name',
            title: '接收人',
            sortable:true
        }]);
    columnsMap.set("zjrqdyhl_thzj",[
        {
            field: 'inspection_product_series_no',
            title: '物品编号',
            sortable:true
        },
        {
            field: 'serial_no',
            title: '收货单号',
            sortable:true
        },
        {
            field: 'agent_no',
            title: '业务方',
            sortable:true
        },
        {
            field: 'created_dt',
            title: '创建时间',
            sortable:true
        },
        {
            field: 'receive_date',
            title: '接收时间',
            sortable:true
        },
        {
            field: 'receiver_name',
            title: '接收人',
            sortable:true
        }]);

    columnsMap.set("zjrqdyjl_djzj",[
        {
            field: 'transfer_product_no',
            title: '物品编号',
            sortable:true
        },
        {
            field: 'serial_no',
            title: '收货单号',
            sortable:true
        },
        {
            field: 'agent_no',
            title: '业务方',
            sortable:true
        },
        {
            field: 'receipt_dt',
            title: '收货时间',
            sortable:true
        },
        {
            field: 'receive_dept',
            title: '接收部门',
            sortable:true
        },
        {
            field: 'created_dt',
            title: '创建时间',
            sortable:true
        },
        {
            field: 'transfer_name',
            title: '移交人',
            sortable:true
        }]);
    columnsMap.set("zjrqdyjl_ckcj",[
        {
            field: 'transfer_product_no',
            title: '物品编号',
            sortable:true
        },
        {
            field: 'serial_no',
            title: '收货单号',
            sortable:true
        },
        {
            field: 'agent_no',
            title: '业务方',
            sortable:true
        },
        {
            field: 'receive_dept',
            title: '接收部门',
            sortable:true
        },
        {
            field: 'created_dt',
            title: '创建时间',
            sortable:true
        },
        {
            field: 'transfer_name',
            title: '移交人',
            sortable:true
        }]);
    columnsMap.set("zjrqdyjl_thzj",[
        {
            field: 'transfer_product_no',
            title: '物品编号',
            sortable:true
        },
        {
            field: 'serial_no',
            title: '收货单号',
            sortable:true
        },
        {
            field: 'agent_no',
            title: '业务方',
            sortable:true
        },
        {
            field: 'receive_dept',
            title: '接收部门',
            sortable:true
        },
        {
            field: 'created_dt',
            title: '创建时间',
            sortable:true
        },
        {
            field: 'transfer_name',
            title: '移交人',
            sortable:true
        }]);

    //抽检
    columnsMap.set("cjrqdjsl_ipqc",[
        {
            field: 'transfer_product_no',
            title: '物品编号',
            sortable:true
        },
        {
            field: 'serial_no',
            title: '收货单号',
            sortable:true
        },
        {
            field: 'agent_no',
            title: '业务方',
            sortable:true
        },
        {
            field: 'created_dt',
            title: '创建时间',
            sortable:true
        },
        {
            field: 'transfer_dept',
            title: '移交部门',
            sortable:true
        },
        {
            field: 'transfer_dt',
            title: '移交时间',
            sortable:true
        },
        {
            field: 'operator_name',
            title: '理货人',
            sortable:true
        }]);
    columnsMap.set("cjrqdjsl_rqc",[
        {
            field: 'transfer_product_no',
            title: '物品编号',
            sortable:true
        },
        {
            field: 'serial_no',
            title: '收货单号',
            sortable:true
        },
        {
            field: 'agent_no',
            title: '业务方',
            sortable:true
        },
        {
            field: 'receipt_dt',
            title: '收货时间',
            sortable:true
        },
        {
            field: 'transfer_dept',
            title: '移交部门',
            sortable:true
        },
        {
            field: 'transfer_dt',
            title: '移交时间',
            sortable:true
        },
        {
            field: 'operator_name',
            title: '理货人',
            sortable:true
        }]);
    columnsMap.set("cjrqdjsl_ckcj",[
        {
            field: 'transfer_product_no',
            title: '物品编号',
            sortable:true
        },
        {
            field: 'serial_no',
            title: '收货单号',
            sortable:true
        },
        {
            field: 'agent_no',
            title: '业务方',
            sortable:true
        },
        {
            field: 'created_dt',
            title: '创建时间',
            sortable:true
        },
        {
            field: 'transfer_dept',
            title: '移交部门',
            sortable:true
        },
        {
            field: 'transfer_dt',
            title: '移交时间',
            sortable:true
        },
        {
            field: 'operator_name',
            title: '理货人',
            sortable:true
        }]);

    columnsMap.set("cjrqdyhl_ipqc",[
        {
            field: 'inspection_product_series_no',
            title: '物品编号',
            sortable:true
        },
        {
            field: 'serial_no',
            title: '收货单号',
            sortable:true
        },
        {
            field: 'agent_no',
            title: '业务方',
            sortable:true
        },
        {
            field: 'created_dt',
            title: '创建时间',
            sortable:true
        },
        {
            field: 'receive_date',
            title: '接收时间',
            sortable:true
        },
        {
            field: 'receiver_name',
            title: '接收人',
            sortable:true
        }]);
    columnsMap.set("cjrqdyhl_rqc",[
        {
            field: 'inspection_product_series_no',
            title: '物品编号',
            sortable:true
        },
        {
            field: 'serial_no',
            title: '收货单号',
            sortable:true
        },
        {
            field: 'agent_no',
            title: '业务方',
            sortable:true
        },
        {
            field: 'receipt_dt',
            title: '收货时间',
            sortable:true
        },
        {
            field: 'receive_date',
            title: '接收时间',
            sortable:true
        },
        {
            field: 'receiver_name',
            title: '接收人',
            sortable:true
        }]);
    columnsMap.set("cjrqdyhl_ckcj",[
        {
            field: 'inspection_product_series_no',
            title: '物品编号',
            sortable:true
        },
        {
            field: 'serial_no',
            title: '收货单号',
            sortable:true
        },
        {
            field: 'agent_no',
            title: '业务方',
            sortable:true
        },
        {
            field: 'created_dt',
            title: '创建时间',
            sortable:true
        },
        {
            field: 'receive_date',
            title: '接收时间',
            sortable:true
        },
        {
            field: 'receiver_name',
            title: '接收人',
            sortable:true
        }]);

    columnsMap.set("cjrqdyjl_ipqc",[
        {
            field: 'transfer_product_no',
            title: '物品编号',
            sortable:true
        },
        {
            field: 'serial_no',
            title: '收货单号',
            sortable:true
        },
        {
            field: 'agent_no',
            title: '业务方',
            sortable:true
        },
        {
            field: 'created_dt',
            title: '创建时间',
            sortable:true
        },
        {
            field: 'receive_dept',
            title: '接收部门',
            sortable:true
        },
        {
            field: 'transfer_name',
            title: '移交人',
            sortable:true
        }]);
    columnsMap.set("cjrqdyjl_rqc",[
        {
            field: 'transfer_product_no',
            title: '物品编号',
            sortable:true
        },
        {
            field: 'serial_no',
            title: '收货单号',
            sortable:true
        },
        {
            field: 'agent_no',
            title: '业务方',
            sortable:true
        },
        {
            field: 'receipt_dt',
            title: '接收时间',
            sortable:true
        },
        {
            field: 'receive_dept',
            title: '接收部门',
            sortable:true
        },
        {
            field: 'created_dt',
            title: '创建时间',
            sortable:true
        },
        {
            field: 'transfer_name',
            title: '移交人',
            sortable:true
        }]);
    columnsMap.set("cjrqdyjl_ckcj",[
        {
            field: 'transfer_product_no',
            title: '物品编号',
            sortable:true
        },
        {
            field: 'serial_no',
            title: '收货单号',
            sortable:true
        },
        {
            field: 'agent_no',
            title: '业务方',
            sortable:true
        },
        {
            field: 'receive_dept',
            title: '接收部门',
            sortable:true
        },
        {
            field: 'created_dt',
            title: '创建时间',
            sortable:true
        },
        {
            field: 'transfer_name',
            title: '移交人',
            sortable:true
        }]);

    columnsMap.set("fjrqdjsl_lhzck",[
        {
            field: 'product_no',
            title: '物品编号',
            sortable:true
        },
        {
            field: 'serial_no',
            title: '收货单号',
            sortable:true
        },
        {
            field: 'agent_no',
            title: '业务方',
            sortable:true
        },
        {
            field: 'created_dt',
            title: '创建时间',
            sortable:true
        },
        {
            field: 'transfer_dept',
            title: '移交部门',
            sortable:true
        },
        {
            field: 'transfer_dt',
            title: '移交时间',
            sortable:true
        },
        {
            field: 'operator_name',
            title: '理货人',
            sortable:true
        }]);
    columnsMap.set("fjrqdjsl_flhzck",[
        {
            field: 'transfer_product_no',
            title: '物品编号',
            sortable:true
        },
        {
            field: 'serial_no',
            title: '收货单号',
            sortable:true
        },
        {
            field: 'agent_no',
            title: '业务方',
            sortable:true
        },
        {
            field: 'created_dt',
            title: '创建时间',
            sortable:true
        },
        {
            field: 'transfer_dept',
            title: '移交部门',
            sortable:true
        },
        {
            field: 'transfer_dt',
            title: '移交时间',
            sortable:true
        },
        {
            field: 'operator_name',
            title: '理货人',
            sortable:true
        }]);

    columnsMap.set("ysqcrqdjsl_lhzck",[
        {
            field: 'product_no',
            title: '物品编号',
            sortable:true
        },
        {
            field: 'agent_no',
            title: '业务方',
            sortable:true
        },
        {
            field: 'receive_dept',
            title: '接收部门',
            sortable:true
        },
        {
            field: 'transfer_dept',
            title: '移交部门',
            sortable:true
        },
        {
            field: 'transfer_dt',
            title: '移交时间',
            sortable:true
        },
        {
            field: 'operator_name',
            title: '理货人',
            sortable:true
        }]);
    columnsMap.set("ysqcrqdjsl_flhzck",[
        {
            field: 'transfer_product_no',
            title: '物品编号',
            sortable:true
        },
        {
            field: 'agent_no',
            title: '业务方',
            sortable:true
        },
        {
            field: 'receive_dept',
            title: '接收部门',
            sortable:true
        },
        {
            field: 'transfer_dept',
            title: '移交部门',
            sortable:true
        },
        {
            field: 'transfer_dt',
            title: '移交时间',
            sortable:true
        },
        {
            field: 'operator_name',
            title: '理货人',
            sortable:true
        }]);

    columnsMap.set("nysqcrqdjsl_aqc",[
        {
            field: 'transfer_product_no',
            title: '物品编号',
            sortable:true
        },
        {
            field: 'agent_name',
            title: '业务方',
            sortable:true
        },
        {
            field: 'transfer_dt',
            title: '移交时间',
            sortable:true
        },
        {
            field: 'receive_dept',
            title: '接收部门',
            sortable:true,
            formatter:function(index,row,value){
                return '爱清除';
            }
        },
        {
            field: 'trade_source_type_name',
            title: '订单来源',
            sortable:true
        },
        {
            field: 'trade_method_name',
            title: '订单交易方式',
            sortable:true
        }]);
    columnsMap.set("nysqcrqdjsl_blancoo",[
        {
            field: 'transfer_product_no',
            title: '物品编号',
            sortable:true
        },
        {
            field: 'agent_name',
            title: '业务方',
            sortable:true
        },
        {
            field: 'transfer_dt',
            title: '移交时间',
            sortable:true
        },
        {
            field: 'receive_dept',
            title: '接收部门',
            sortable:true,
            formatter:function(index,row,value){
                return 'blancoo';
            }
        },
        {
            field: 'trade_source_type_name',
            title: '订单来源',
            sortable:true
        },
        {
            field: 'trade_method_name',
            title: '订单交易方式',
            sortable:true
        }]);

    columnsMap.set("temp_to_be_append",[
        {
            field: 'category_id',
            title: '出库类型',
            sortable:true
        },
        {
            field: 'document_serial_number',
            title: '出库单号',
            sortable:true
        },
        {
            field: 'product_no',
            title: '物品编号',
            sortable:true
        },
        {
            field: 'create_dt',
            title: '创建时间',
            sortable:true
        }]);

};
function customCartModal(title,modelSelector,titleSelector,type,listMap){
    $("#"+modelSelector).off('shown.bs.modal').on('shown.bs.modal', function () {
        $("#"+titleSelector).text(title);

        if(type.substring(0,6) == 'random') {
            $("#ipqc").html(listMap.ipqc.length);
            $('#ipqc').parent().click(function(){
                customNextModal("IPQC",listMap.ipqc,columnsMap.get(type));
            });

            $("#rqc").html(listMap.rqc.length);
            $('#rqc').parent().click(function(){
                customNextModal("RQC",listMap.rqc,columnsMap.get(type));
            });
        } else if(type.substring(0,4) == 'cjrq'){
            $("#ipqc").html(listMap.ipqc.length);
            $('#ipqc').parent().click(function(){
                customNextModal("IPQC",listMap.ipqc,columnsMap.get(type+'_ipqc'));
            });

            $("#rqc").html(listMap.rqc.length);
            $('#rqc').parent().click(function(){
                customNextModal("RQC",listMap.rqc,columnsMap.get(type+'_rqc'));
            });

            $("#cjckcj").html(listMap.ckcj.length);
            $('#cjckcj').parent().click(function(){
                customNextModal("仓库抽检（等级）",listMap.ckcj,columnsMap.get(type+'_ckcj'));
            });
        }else if(type.substring(0,4) == 'fjrq'){
            $("#lhzck").html(listMap.lhzck.length);
            $('#lhzck').parent().click(function(){
                customNextModal("理货暂存库",listMap.lhzck,columnsMap.get(type+'_lhzck'));
            });

            $("#flhzck").html(listMap.flhzck.length);
            $('#flhzck').parent().click(function(){
                customNextModal("非理货暂存库",listMap.flhzck,columnsMap.get(type+'_flhzck'));
            });
        }else if(type.substring(0,6) == 'ysqcrq'){
            $("#lhzck").html(listMap.lhzck.length);
            $('#lhzck').parent().click(function(){
                customNextModal("理货暂存库",listMap.lhzck,columnsMap.get(type+'_lhzck'));
            });

            $("#flhzck").html(listMap.flhzck.length);
            $('#flhzck').parent().click(function(){
                customNextModal("非理货暂存库",listMap.flhzck,columnsMap.get(type+'_flhzck'));
            });

        }else if(type.substring(0,7) == 'nysqcrq'){
            $("#aqc").html(listMap.aqc.length);
            $('#aqc').parent().click(function(){
                customNextModal("爱清除",listMap.aqc,columnsMap.get(type+'_aqc'));
            });

            $("#blancoo").html(listMap.blancoo.length);
            $('#blancoo').parent().click(function(){
                customNextModal("blancoo",listMap.blancoo,columnsMap.get(type+'_blancoo'));
            });
        }else if(type.substring(0,11) == 'temp_to_be_'){
            //to_be_append和offs的字段一样，所以用同一个
            $("#to_be_append").html(listMap.to_be_append.length);
            $('#to_be_append').parent().click(function(){
                customNextModal("待指派量(新)",listMap.to_be_append,columnsMap.get(type + 'append'));
            });

            $("#to_be_off").html(listMap.to_be_off.length);
            $('#to_be_off').parent().click(function(){
                customNextModal("待下架量(新)",listMap.to_be_off,columnsMap.get(type + 'append'));
            });
        } else if (type.substring(0,7) == 'quality'){
            $("#djzj").html(listMap.djzj.length);
            $('#djzj').parent().click(function(){
                customNextModal("定级质检（等级）",listMap.djzj,columnsMap.get(type));
            });
            $("#ckcj").html(listMap.ckcj.length);
            $('#ckcj').parent().click(function(){
                customNextModal("仓库抽检（等级）",listMap.ckcj,columnsMap.get(type));
            });

            $("#thzj").html(listMap.thzj.length);
            $('#thzj').parent().click(function(){
                customNextModal("退货质检（等级）",listMap.thzj,columnsMap.get(type));
            });

            $("#bjzj").html(listMap.bjzj.length);
            $('#bjzj').parent().click(function(){
                customNextModal("备件库质检（等级）",listMap.bjzj,columnsMap.get(type));
            });
        } else{
            $("#djzj").html(listMap.djzj.length);
            $('#djzj').parent().click(function(){
                customNextModal("定级质检（等级）",listMap.djzj,columnsMap.get(type+'_djzj'));
            });

            $("#ckcj").html(listMap.ckcj.length);
            $('#ckcj').parent().click(function(){
                customNextModal("仓库抽检（等级）",listMap.ckcj,columnsMap.get(type+'_ckcj'));
            });

            $("#thzj").html(listMap.thzj.length);
            $('#thzj').parent().click(function(){
                customNextModal("退货质检（等级）",listMap.thzj,columnsMap.get(type+'_thzj'));
            });
        }
    });
    $("#"+modelSelector).modal();
}

//自定义弹出层
function customNextModal(title,data,colums){
    $("#myModal").off('shown.bs.modal').on('shown.bs.modal', function () {
        $("#myModalLabel").text(title);
        $("#modalContent").bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            search: true,
            pageSize:5,
            data:data,
            columns: colums
        });
    });
    $("#myModal").modal('show')
}



