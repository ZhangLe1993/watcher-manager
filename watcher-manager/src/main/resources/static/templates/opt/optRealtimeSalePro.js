Template.optRealtimeSalePro.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#CompetitonPriceTab').addClass('active');
    $('#optRealtimeSaleProTab').addClass('active');

    //renderPage()

    /*showPanelOrLoading(['saleAmountRatioChart'],true);
    drawBToBDPCollectData();

    drawAhsAndAjhCollectData();

    drawAhsAndAjhCollectByOutHouseData();*/

    /*$("#sales").click(function(){
        console.log("渲染销售情况");
        setRealTimeSaleTabLoading();
        showPanelOrLoading(['saleAmountRatioChart'],true);
        drawBToBDPCollectData();

        drawAhsAndAjhCollectData();

        drawAhsAndAjhCollectByOutHouseData();
    });*/

    /*$("#revenue").click(function(){
        console.log("渲染库存情况");
        setRealTimeStockTabLoading();
        showPanelOrLoading(['stockAmountRatioChart'],true);
        showPanelOrLoading(['stockDetail'],true);
        drawRealTimeInventory();
    });*/

    setRealTimeStockTabLoading();
    showPanelOrLoading(['stockAmountRatioChart'],true);
    showPanelOrLoading(['stockDetail'],true);
    drawRealTimeInventory();

    $("li[def-events='on']").mouseenter(function(){
        $(this).children("img").attr("src","/assets/icon/download.png");
    });
    $("li[def-events='on']").mouseleave(function(){
        $(this).children("img").attr("src","/assets/icon/gray-download.png");
    });

    $("li[def-events='on']").click(function(){
        console.log('导出');
        var type = $(this).attr("def-v");
        switch(type){
            case "0":
                console.log('导出结算维度B2B代拍');
                var url = "/opt/exportBToBDPOnSettleData";
                exportData(url);
                break;
            case "1":
                console.log('导出结算维度B2B直营');
                var url = "/opt/exportAJHOnSettleData";
                exportData(url);
                break;
            case "2":
                console.log('导出结算维度爱回收');
                var url = "/opt/exportAHSOnSettleData";
                exportData(url);
                break;
            case "3":
                console.log('导出出库维度B2B直营');
                var url = "/opt/exportAJHOnStockData";
                exportData(url);
                break;
            case "4":
                console.log('导出出库维度爱回收');
                var url = "/opt/exportAHSOnStockData";
                exportData(url);
                break;
            case "5":
                console.log('导出库存情况所有');
                var url = "/opt/exportRealTimeStockData";
                exportData(url);
                break;
            default:
                console.log("不做任何事");
                break;
        }
    });
};


var exportData = function(eUrl){
    requestURL(dataService + eUrl,{"operationCenter":0}).done(function(result){
        var url = Meteor.settings.public.downloadService.baseUrl + result.path;
        console.log("url:" + url);
        var link = document.createElement("a");
        link.href = url;
        link.style = "visibility:hidden";
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    });
};

/**
 * 结算单维度维度  B2B直营和爱回收数据
 */
var drawAhsAndAjhCollectData = function(){
    requestURL(dataService+"/opt/getAhsAndAjhBySettleCollect",{}).done(function(result){
        //直营的数量和金额
        $("#JSWDBToBSaleNum").html(result.tempNum["爱机汇"].toLocaleString());
        $("#JSWDBToBSaleAmount").html("￥"+ result.tempAmount['爱机汇'].toLocaleString());

        //爱回收的数量和金额
        $("#JSWDAHSSalesNum").html(result.tempNum["爱回收"].toLocaleString());
        $("#JSWDAHSSalesAmount").html("￥"+ result.tempAmount['爱回收'].toLocaleString());
    })
};

/**
 * 出库维度  B2B直营和爱回收数据
 */
var drawAhsAndAjhCollectByOutHouseData = function(){
    requestURL(dataService+"/opt/getAhsAndAjhCollect",{}).done(function(result){
        //直营的数量和金额
        $("#CKWDBToBSaleNum").html(result.tempNum["爱机汇"].toLocaleString());
        $("#CKWDBToBSaleAmount").html("￥"+ result.tempAmount['爱机汇'].toLocaleString());

        //爱回收的数量和金额
        $("#CKWDAHSSaleNum").html(result.tempNum["爱回收"].toLocaleString());
        $("#CKWDAHSSaleAmount").html("￥"+ result.tempAmount['爱回收'].toLocaleString());
    })
};

/**
 * 渲染结算单维度--B2B代拍数据
 */
var drawBToBDPCollectData = function(){
    requestURL(dataService+"/opt/getBToBColorAndStandardCollect",{}).done(function(result){
        //成色机（opt）+标品（外采）
        var jswdBToBDPNum = result.tempNum["opt"] + result.tempNum["外采"];
        var jswdBToBDPAmount = result.tempAmount["opt"] + result.tempAmount["外采"];

        //BToB代拍的数量和金额
        $("#JSWDBToBDPNum").html(jswdBToBDPNum.toLocaleString());
        $("#JSWDBToBDPAmount").html("￥"+ jswdBToBDPAmount.toLocaleString());

        var eChartData = [{name:'成色机',value:result.tempAmount["opt"]},{name:'标品',value:result.tempAmount["外采"]}];
        showPanelOrLoading(['saleAmountRatioChart'],false);
        drawBToBDPSaleChart(eChartData);
    })
};

var drawBToBDPSaleChart = function(eChartData){
    $("#saleAmountRatioChart").resize();
    var option = {
        title : {
            text: '销售金额占比',
            subtext: '',
            x: 'center',
            y: 'center',
            textStyle: {
                fontWeight: 'normal',
                fontSize: 16
            }
        },
        tooltip : {
            trigger: 'item',
            formatter:function(data){
                if(data.seriesName != '外边框' && data.seriesName != '里边框'){
                    //console.log(data);
                    return data.name+"<br>金额："+data.value.toLocaleString() + "<br>金额占比："+data.percent+"%";
                }
            }
        },
        legend: {
            orient : 'vertical',
            x : 'left',
            data:['标品','成色机']
        },
        toolbox: {
            show : false
        },
        color: [ '#2bb7ff','#fe9d58'],
        calculable : true,
        series : [
            {
                name:'销售金额占比',
                type:'pie',
                label: {
                    normal: {
                        formatter: '{b}\n{d}%'
                    }
                },
                radius : ['50%', '70%'],
                /*itemStyle : {
                    normal : {
                        label : {
                            show : false
                        },
                        labelLine : {
                            show : false
                        }
                    }
                },*/
                data:eChartData
            },
            {
                name:'里边框',
                type:'pie',
                radius : ['45%', '46%'],
                itemStyle : {
                    normal : {
                        label : {
                            show : false
                        },
                        color: '#eee',
                        labelLine : {
                            show : false
                        }
                    },
                },
                data:[
                    {value:1, name:'标品'}
                ]
            },
            {
                name:'外边框',
                type:'pie',
                radius : ['74%', '75%'],
                itemStyle : {
                    normal : {
                        label : {
                            show : false
                        },
                        color: '#eee',
                        labelLine : {
                            show : false
                        }
                    },
                },
                data:[
                    {value:1, name:'标品'}
                ]
            }
        ]
    };
    var saleAmountRatioChart = echarts.init(document.getElementById("saleAmountRatioChart"));
    saleAmountRatioChart.setOption(option, false, false);
    saleAmountRatioChart.resize();
    window.addEventListener('resize',saleAmountRatioChart.resize);
};

/**
 * 渲染实时库存数据
 */
function drawRealTimeInventory(){
    requestURL(dataService+"/orderAfter/getRealTimeInventoryDetailByParam",{param:'normal',"operationCenter":"0"}).done(function(res){
        if(res.statusText != undefined && res.statusText=='error'){

        }else{
            requestURL(dataService+"/opt/getRealTimeInventoryCollect",{"operationCenter":"0"}).done(function(result){
                var wc_num = result.tempNum["外采OPT"];
                var opt_num = result.tempNum["OPT"];
                var wc_amount = result.tempAmount["外采OPT"];
                var opt_amount = result.tempAmount["OPT"];
                $("#inventoryAHSNum").html(result.tempNum["爱回收"].toLocaleString());
                $("#inventoryAJHNum").html(result.tempNum["爱机汇"].toLocaleString());
                $("#inventoryOPTNum").html((wc_num + opt_num).toLocaleString());

                $("#inventoryAHSAmount").html("￥" + result.tempAmount["爱回收"].toLocaleString());
                $("#inventoryAJHAmount").html("￥" + result.tempAmount["爱机汇"].toLocaleString());
                $("#inventoryOPTAmount").html("￥" + (wc_amount + opt_amount).toLocaleString());
                var eChartData = [{name:'成色机',value:opt_amount},{name:'标品',value:wc_amount}];
                showPanelOrLoading(['stockAmountRatioChart'],false);
                drawRealTimeStockChart(eChartData);
            });
            showPanelOrLoading(['stockDetail'],false);
            /*var filter = {

            };
            var ajaxQuery = _.clone(filter);*/
            $("#stockDetail").bootstrapTable('destroy').bootstrapTable({
                data: res,
                pagination: true,
                /*sidePagination:'server',*/
                striped: true,
                pageSize: 10,
                search: true,
                pageList: [10, 20, 50, 100, 200],
                /*ajax:function(params){
                    var ajaxParams = $.extend(ajaxQuery,params.data);
                    //console.log(ajaxParams);
                    getRealTimeInventoryData(ajaxParams).done(function(ret){
                        params.success(ret)
                    });
                },*/
                columns:[
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
                ]
            });
        }
    });
}

/*function  getRealTimeInventoryData(filter){
    var query = cleanParams(_.clone(filter));
    query.limit = query.limit + query.offset;
    query.keyword = (query.search == undefined ? "" : query.search);
    console.log(query);
    var dfd = $.Deferred();
    requestURL(dataService+"/opt/getRealTimeInventoryDetailPage",query).done(function(ret){
        dfd.resolve(ret);
    });
    return dfd.promise();
}*/

var drawRealTimeStockChart = function(eChartData){
    $("#stockAmountRatioChart").resize();
    var option = {
        title : {
            text: '库存金额占比',
            subtext: '',
            x: 'center',
            y: 'center',
            textStyle: {
                fontWeight: 'normal',
                fontSize: 16
            }
        },
        tooltip : {
            trigger: 'item',
            formatter:function(data){
                if(data.seriesName != '外边框' && data.seriesName != '里边框'){
                    //console.log(data);
                    return data.name+"<br>库存金额："+data.value.toLocaleString() + "<br>金额占比："+data.percent+"%";
                }
            }
        },
        legend: {
            orient : 'vertical',
            x : 'left',
            data:['标品','成色机']
        },
        toolbox: {
            show : false
        },
        color: [ '#2bb7ff','#fe9d58'],
        calculable : true,
        series : [
            {
                name:'库存金额占比',
                type:'pie',
                label: {
                    normal: {
                        formatter: '{b}\n{d}%'
                    }
                },
                radius : ['50%', '70%'],
                /*itemStyle : {
                    normal : {
                        label : {
                            show : false
                        },
                        labelLine : {
                            show : false
                        }
                    }
                },*/
                data:eChartData
            },
            {
                name:'里边框',
                type:'pie',
                radius : ['45%', '46%'],
                itemStyle : {
                    normal : {
                        label : {
                            show : false
                        },
                        color: '#eee',
                        labelLine : {
                            show : false
                        }
                    },
                },
                data:[
                    {value:1, name:'标品'}
                ]
            },
            {
                name:'外边框',
                type:'pie',
                radius : ['74%', '75%'],
                itemStyle : {
                    normal : {
                        label : {
                            show : false
                        },
                        color: '#eee',
                        labelLine : {
                            show : false
                        }
                    },
                },
                data:[
                    {value:1, name:'标品'}
                ]
            }
        ]
    };
    var saleAmountRatioChart = echarts.init(document.getElementById("stockAmountRatioChart"));
    saleAmountRatioChart.setOption(option, false, false);
    saleAmountRatioChart.resize();
    window.addEventListener('resize',saleAmountRatioChart.resize);
};

var drawSaleSituationTab = function(){

};

var showPanelOrLoading = function(selector_perv,on){
    _.each(selector_perv,function(ele){
        var loadingId = ele + 'Loading';
        var panelId = ele + 'Panel';
        if(on){
            //显示动画   隐藏面板
            $('#' + loadingId).show();
            $('#' + panelId).hide();
        }else{
            //显示面板   隐藏动画
            $('#' + loadingId).hide();
            $('#' + panelId).show();
        }
    });
};

/**
 * 初始化销售情况Tab
 */
var setRealTimeSaleTabLoading = function(){

    //结算维度 --B2B代拍
    $("#JSWDBToBDPNum").html('......');
    $("#JSWDBToBDPAmount").html('......');

    //B2B直营
    $("#JSWDBToBSaleNum").html('......');
    $("#JSWDBToBSaleAmount").html('......');

    //爱回收
    $("#JSWDAHSSalesNum").html('......');
    $("#JSWDAHSSalesAmount").html('......');

    //出库维度  -- B2B直营
    $("#CKWDBToBSaleNum").html('......');
    $("#CKWDBToBSaleAmount").html('......');

    //出库维度  -- 爱回收
    $("#CKWDAHSSaleNum").html('......');
    $("#CKWDAHSSaleAmount").html('......');
};

/**
 * 初始化库存情况Tab
 */
var setRealTimeStockTabLoading = function(){

    //库存数据B2B代拍
    $("#inventoryOPTNum").html('......');
    $("#inventoryOPTAmount").html('......');

    //B2B直营
    $("#inventoryAJHNum").html('......');
    $("#inventoryAJHAmount").html('......');

    //爱回收
    $("#inventoryAHSNum").html('......');
    $("#inventoryAHSAmount").html('......');


};

