Template.venderSansungOfficeS8OrderInfo.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderSansungDataserviceTab').addClass('active');
    $('#venderSansungOfficeS8OrderInfo').addClass('active');

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    vender_group_key.push(Template.currentData().vender_group_key);
    startDate=Template.currentData().startDate;
    endDate=Template.currentData().endDate;
    account_key=getUserName();

    renderPageVender();

    };

var filter={},vender_group_key=[],startDate,endDate,account_key;

function getSelectedFilter() {

    filter.startDate=startDate;
    filter.endDate=endDate;
    if(vender_group_key[0]!="all") {
        filter.vender_group_key = vender_group_key;
    }
    filter.account_key=account_key;

    return cleanParams(filter);
}

function renderPageVender() {
    var filter=getSelectedFilter();

    $("#tableVenderOrder").hide();
    $("#loading").show();

    var promise = getSansuangS8DetailInfoByGroupkey(filter);
    promise.done(function (ret) {

        $("#tableVenderOrder").show();
        $("#loading").hide();

        //renderTable
        renderTableVender(ret, '#tableVenderOrder');
    });

}

//day
function renderTableVender(data,tableName) {
    data.forEach(function(e){
        if(e.vender_order_status.indexOf("PICKING")>-1){
            e.vender_order_status="待拣货"
        }else if(e.vender_order_status.indexOf("SENDING")>-1){
            e.vender_order_status="待发货"
        }else if(e.vender_order_status.indexOf("RECEIVING")>-1){
            e.vender_order_status="待收货"
        }else if(e.vender_order_status.indexOf("ONDOOR")>-1){
            e.vender_order_status="待收货"
        }else if(e.vender_order_status.indexOf("CHECKING")>-1){
            e.vender_order_status="待验货"
        }else if(e.vender_order_status.indexOf("ADJUSTING")>-1){
            e.vender_order_status="待调价"
        }else if(e.vender_order_status.indexOf("RETURNING")>-1){
            e.vender_order_status="待退货"
        }else if(e.vender_order_status.indexOf("FAIL")>-1){
            e.vender_order_status="交易取消"
        }else if(e.vender_order_status.indexOf("SUCCESS")>-1){
            e.vender_order_status="交易完成"
        }else if(e.vender_order_status.indexOf("CONFIRMING")>-1){
            e.vender_order_status="待用户确认"
        }else if(e.vender_order_status.indexOf("WAIT_FOR_PAYING")>-1){
            e.vender_order_status="待付款"
        }else if(e.vender_order_status.indexOf("PAYING")>-1){
            e.vender_order_status="支付中"
        }
    })
    $(tableName).bootstrapTable('destroy').bootstrapTable({
    exportDataType: 'all',
    data: data,
    columns:[{
        field:'sansung_office',
        title:'办事处',
        sortable:true
    },{
        field:'sansung_group_name',
        title:'专卖店',
        sortable:true
    },{
        field:'vender_order_create_date',
        title:'下单日期',
        sortable:true
    },{
        field:'trade_cd',
        title:'订单号',
        sortable:true
    },{
        field:'product_category_name',
        title:'商品品类',
        sortable:true
    },{
        field:'product_brand_name',
        title:'商品品牌',
        sortable:true
    },{
        field:'product_name',
        title:'具体型号',
        sortable:true
    },{
        field:'order_type',
        title:'是否以旧换新',
        sortable:true
    },{
        field:'vender_order_price_num',
        title:'订单金额',
        sortable:true
    },{
        field:'final_deal_price_num',
        title:'成交价',
        sortable:true
    },{
        field:'vender_order_status',
        title:'交易状态',
        sortable:true
    }]
});
}

function cleanParams(filter) {
    //clean parameters
    var query = _.clone(filter);
    for (var key in query) {
        if (!query[key] && key != "offset") {
            delete query[key]
        }
    }
    return query
}


function getSansuangS8DetailInfoByGroupkey(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender2/getSansuangS8DetailInfoByGroupname", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}



