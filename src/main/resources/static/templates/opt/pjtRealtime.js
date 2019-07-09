Template.pjtRealtime.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#pjtrtSideTab').addClass('active');
    $('#pjtRealtime').addClass('active');

    renderPage()
};
function renderPage(){
    //卖家下单
    requestURL(dataService+"/opt/getRTOrderInfo",{}).done(function(result){
        $("#orderCnt").html(result.orderCnt);
        $("#orderNum").html(result.orderNum);
        $("#amount").html("￥"+(result.amount.toLocaleString()));
        $('#supplierCnt').html(result.supplierCnt)
    });

    //卖家下单 -- 昨日同时
    requestURL(dataService+"/opt/getRTOrderYesterdayInfo",{}).done(function(result){
        $("#yesOrderCnt").html(result.orderCnt);
        $("#yesOrderNum").html(result.orderNum);
        $("#yesAmount").html("￥"+(result.amount.toLocaleString()));
        $('#yesSupplierCnt').html(result.supplierCnt)
    });

    //全国
    requestURL(dataService + "/opt/getOptReceiveCnt", {"operationCenter": "0"}).done(function (data) {
        $('#actualNum').html(data.length);
    });
    //全国-- 昨日
    requestURL(dataService + "/opt/getYesterdayOptReceiveCnt", {"operationCenter": "0"}).done(function (data) {
        $('#yesActualNum').html(data.length);
    });

    requestURL(dataService+"/opt/getRTSupplyInfo",{}).done(function(result){
        $("#AllCnt").html(result.total_num);
        $("#dayCnt").html(result.day_num);
    });

    //卖家当日提交并发货
    requestURL(dataService+"/opt/getSellerInfo",{}).done(function(result){
        $("#supplyCnt").html(result.orderCnt);
        $("#supplyNum").html(result.itemCnt);
        $("#supplyAmount").html("￥"+(parseInt(result.itemAmount).toLocaleString()));
        $('#recyclerCnt').html(result.recyclerCnt);
    });

    //卖家当日提交并发货  -- 昨日
    requestURL(dataService+"/opt/getYesterdaySellerInfo",{}).done(function(result){
        $("#yesSupplyCnt").html(result.orderCnt);
        $("#yesSupplyNum").html(result.itemCnt);
        $("#yesSupplyAmount").html("￥"+(parseInt(result.itemAmount).toLocaleString()));
        $('#yesRecyclerCnt').html(result.recyclerCnt);
    });

    //卖家发货
    requestURL(dataService+"/opt/getSellerTodayInfo",{}).done(function(result){
        $("#shippmentCnt").html(result.orderCnt);
        $("#shippmentNum").html(result.itemCnt);
        $("#shippmentAmount").html('￥' + parseInt(result.itemAmount).toLocaleString());
        $("#shippmentRecyclerCnt").html(result.recyclerCnt)
    });

    //卖家发货 -- 昨日
    requestURL(dataService+"/opt/getYesterdaySellerTodayInfo",{}).done(function(result){
        $("#yesShippmentCnt").html(result.orderCnt);
        $("#yesShippmentNum").html(result.itemCnt);
        $("#yesShippmentAmount").html('￥' + parseInt(result.itemAmount).toLocaleString());
        $("#yesShippmentRecyclerCnt").html(result.recyclerCnt)
    });

    //质检
    requestURL(dataService+"/opt/getQualityInspectionInfo",{}).done(function(result){
        $("#qualityInspectionCnt").html(result.orderCnt);
        $("#qualityInspectionAmount").html('￥' + parseInt(result.itemAmount).toLocaleString());
        $("#qualityInspectionRecyclerCnt").html(result.supplier_count)
    });

    //质检 --昨日
    requestURL(dataService+"/opt/getYesterdayQualityInspectionInfo",{}).done(function(result){
        $("#yesQualityInspectionCnt").html(result.orderCnt);
        $("#yesQualityInspectionAmount").html('￥' + parseInt(result.itemAmount).toLocaleString());
        $("#yesQualityInspectionRecyclerCnt").html(result.supplier_count)
    });

    //成交
    requestURL(dataService+"/opt/getDealInfo",{}).done(function(result){

        $("#dealCnt").html(result.product_cnt);
        $("#dealAmount").html('￥' + parseInt(result.quoted_price).toLocaleString());
        $("#dealRecyclerCnt").html(result.recycler_cnt)
    });

    //流拍
    requestURL(dataService+"/opt/getAbortiveAuctionInfo",{}).done(function(result){
        $("#abortiveCnt").html(result.productCnt);
        $("#abortiveAmount").html('￥' + parseInt(result.priceSum).toLocaleString());
        $("#abortiveRecyclerCnt").html(result.recyclerCnt)
    });

    requestURL(dataService+"/opt/getNormalAbortiveAuctionRate",{}).done(function(result){
        //console.log(result);
        var rate = accDiv(Math.round(accMul(accDiv(result['count'],result['size']),10000)),100);
        $("#normalAbortiveRate").html(rate + "%");
    });

    //退货
    requestURL(dataService+"/opt/getReturnInfo",{}).done(function(result){
        $("#returnCnt").html(result.orderCnt);
        $("#returnAmount").html("￥" +parseInt(result.itemAmount).toLocaleString());
        $("#returnRecyclerCnt").html(result.supplier_count)
    })
}

