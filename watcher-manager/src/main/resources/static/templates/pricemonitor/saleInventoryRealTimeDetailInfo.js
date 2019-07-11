Template.saleInventoryRealTimeDetailInfo.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#pricemonitor').addClass('active');
    $('#saleInventoryRealTimeDetailInfo').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }
    renderPage({})
    $(".search").click(function(){
        var query = {
            category:$(".category").val().trim(),
            brand:$(".brand").val().trim(),
            product:$(".product").val().trim(),
            skuId:$(".skuId").val().trim(),
            skuName:$(".skuName").val().trim(),
            level:$(".level").val().trim()
        };
        renderPage(cleanParams(query))
    })
};

function renderPage(query){
    $("#loading").show()
    $("#chartContent").hide()
    requestURL(dataService+"/pricemonitor/getSaleInventoryRealTimeDetailInfo",query).done(function(data){
        $("#loading").hide()
        $("#chartContent").show()
        $("#inventoryCount").html(data.count);
        $("#inventoryAmount").html("￥"+data.amount.toLocaleString())
        var avgCost = data.count==0?0:Math.round(data.amount/data.count)
        $("#avgCost").html("￥"+avgCost.toLocaleString())
        renderTable(data.data)
    })
}

function renderTable(data){
    $("#table").bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        search: true,
        data: data,
        columns: [{
            field: 'warehouse_name',
            title: '仓库',
            sortable:true
        },{
            field: 'product_category_name',
            title: '品类',
            sortable:true
        }, {
            field: 'product_brand_name',
            title: '品牌',
            sortable:true
        }, {
            field: 'product_name',
            title: '商品',
            sortable:true
        }, {
            field: 'sku_id',
            title: 'skuId',
            sortable:true
        }, {
            field: 'product_sale_sku_name',
            title: 'sku名称',
            sortable:true
        }, {
            field: 'level_name',
            title: '等级',
            sortable:true,
        }, {
            field: 'num',
            title: '数量',
            sortable:true,
        }, {
            field: 'amount',
            title: '金额',
            sortable:true,
        }, {
            field: 'price',
            title: '销售报价',
            sortable:true,
            formatter:function(value,row){
                return value=="-1.0"?"":value
            }
        }]
    })
}



