Template.RTQuotationData.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#pricemonitor').addClass('active');
    $('#RTQuotationDataTab').addClass('active');

    if(isMobile()){
        $('.sidebar-toggle').click();
    }
    requestURL(dataService+"/profit/getRTQuotationData",{}).done(function(result){
        $("#table").bootstrapTable('destroy').bootstrapTable({
            data: result.data,
            pagination: true,
            pageSize: 10,
            search: true,
            //exportDataType:'all',
            cdataExport: "cdataExport",
            columns:[
                {
                    field:'QuotationDocumentNo',
                    title:'竞价单号',
                    sortable:true,
                },{
                    field:'TradeNo',
                    title:'订单号',
                    sortable:true,
                },{
                    field:'source',
                    title:'渠道',
                    sortable:true,
                },
                {
                    field:'product_category_name',
                    title:'品类',
                    sortable:true,
                },
                {
                    field:'product_brand_name',
                    title:'品牌',
                    sortable:true,
                },
                {
                    field:'product_id',
                    title:'productId',
                    sortable:true,
                },
                {
                    field:'product_name',
                    title:'型号',
                    sortable:true,
                },
                {
                    field:'skuId',
                    title:'skuId',
                    sortable:true,
                },
                {
                    field:'sku',
                    title:'sku',
                    sortable:true,
                },
                {
                    field:'level',
                    title:'level',
                    sortable:true,
                },
                {
                    field:'QuotationPrice',
                    title:'竞价金额',
                    sortable:true,
                },
                {
                    field:'cost',
                    title:'成本',
                    sortable:true,
                },
                {
                    field:'profit',
                    title:'利润',
                    formatter: function (value, row, index) {
                        return parseInt(row.QuotationPrice-row.cost)
                    }
                }
            ]
        })
        $("#cdataExport").click(function(){
            var url = Meteor.settings.public.downloadService.baseUrl+result.path
            var link = document.createElement("a");
            link.href = url;
            link.style = "visibility:hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

        })
    })
};