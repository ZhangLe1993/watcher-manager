Template.profitExceptionMonitor.rendered = function () {
    $('.navi-tab').removeClass('active');
    var flag = Template.channel;
    $(".notAijihuiTab").addClass("active");
    $(".ctab").removeClass("active");
    if(flag=='aijihui'){
        $(".notAijihuiTab").hide()
        $(".notAijihuiTab").removeClass("active");
        $(".ctab").addClass("active")
    }
    if (isMobile()) {
        $('.sidebar-toggle').click();
    }
    var dateGap = 0;
    var endDate = new Date().getNewDate(-1);
    var startDate = new Date(endDate).getNewDate(dateGap);
    $('.dateSelectLabel').html(startDate+"~"+endDate);
    var minDate="2016-01-01";
    $('.dateBtn').daterangepicker(datePickerOptionsFunc(startDate,endDate,minDate,false), pickDateRangeCallback);
    var activeTab =  $("#chartContent li.active>a").attr("href");
    renderPage(activeTab);
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        // 获取已激活的标签页的名称
        var activeTab = e.target.hash;
        renderPage(activeTab)
    });
    $(".search").click(function(e){
        var activeTab =  $("#chartContent li.active>a").attr("href");
        renderPage(activeTab);
    });

    $("#type").change(function(){
        var type=$(this).val();
        switch (type){
            case "Apple":
                $("#profitScope").val("22");
                break
            case "Android":
                $("#profitScope").val("24");
                break
        }
    })
};

function pickDateRangeCallback(start, end, label) {
    console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.dateSelectLabel').html(sdt+"~"+edt);
    var activeTab =  $("#chartContent li.active>a").attr("href");
    renderPage(activeTab)
}

function renderPage(activeTab){
    var dateArray = $('.dateSelectLabel').html().split("~");
    var filter = {"startDate":dateArray[0],"endDate":dateArray[1]};
    switch(activeTab) {
        case "#bdself":
            filter.categoryKey=$("#category").val();
            filter.profitRange=$("#profitRange").val();
            bdSelfTabPage(filter);
            break;
        case "#aijihui":
            filter.typeKey=$("#type").val();
            filter.profitScope=$("#profitScope").val();
            aijihuiTabPage(filter);
            break;
    }
}

function bdSelfTabPage(filter){
    $("#loading").show();
    $("#bd_self_content").hide();
    requestURL(dataService+"/manage/getProfitExceptionMonitor", $.extend({isTotal:true},filter)).done(function(result) {
        $("#loading").hide();
        $("#bd_self_content").show();
        drawSummaryTable(result.totalData[0],result.data,"#bd_self_table_summary");
        //深拷贝
        var result = [].concat(JSON.parse(JSON.stringify(result.data))).reduce(function(acc, obj) {
            var tagObj = acc[obj.category+obj.brand+obj.product];
            if (tagObj) {
                tagObj.profitAmount=parseInt(tagObj.profitAmount)+parseInt(obj.profitAmount);
                tagObj.saleAmount=parseInt(tagObj.saleAmount)+parseInt(obj.saleAmount);
                tagObj.recyclerAmount=parseInt(tagObj.recyclerAmount)+parseInt(obj.recyclerAmount);
                tagObj.saleCount=parseInt(tagObj.saleCount)+parseInt(obj.saleCount)

            } else {
                acc[obj.brand+obj.product] = obj
            }
            return acc
        },{});
        drawTable(_.keys(result).map(function(k){return result[k]}),"#bd_self_table")
    })
    requestURL(dataService+"/manage/getProfitExceptionMonitor", $.extend({isTotal:false},filter)).done(function(result) {
        var totalDataList = result.totalData;//总体
        var dataList = result.data;//异常数据
        var totalDataListBySource = _.groupBy(totalDataList,function(ele){return ele.source});
        var dataListBySource = _.groupBy(dataList,function(ele){return ele.source});
        drawSummaryTable(totalDataListBySource["自营"][0],dataListBySource["自营"],"#self_table_summary");
        drawSummaryTable(totalDataListBySource["BD"][0],dataListBySource["BD"],"#bd_table_summary");
        drawTable(dataListBySource["自营"],"#self_table");
        drawTable(dataListBySource["BD"],"#bd_table");

    });

    requestURL(dataService+"/manage/getExceptionOrderDetail",filter).done(function(result) {
        $("#exception_order_table").bootstrapTable('destroy').bootstrapTable({
            data: _.sortBy(result,function(obj){return parseFloat(obj.profitAmount)}),
            pagination: true,
            search: true,
            exportDataType: 'all',
            columns: [
                {
                    field: 'trade',
                    title: '订单号',
                    sortable: false,
                    formatter:function(value,row){
                        return "'"+value
                    }
                },
                {
                    field: 'source',
                    title: '来源',
                    sortable: false,
                },
                {
                    field: 'category',
                    title: '品类',
                    sortable: false,
                },
                {
                    field: 'brand',
                    title: '品牌',
                    sortable: false,
                },
                {
                    field: 'product',
                    title: '型号',
                    sortable: false,
                },
                {
                    field: 'sku',
                    title: 'sku',
                    sortable: false,
                },
                {
                    field: 'level',
                    title: '等级',
                    sortable: false,
                },
                {
                    field: 'profitAmount',
                    title: '利润额',
                    sortable: true,
                },

                {
                    field: 'saleAmount',
                    title: '销售额',
                    sortable: false,
                },
                {
                    field: 'recyclerAmount',
                    title: '回收额',
                    sortable: false,
                },
                {
                    field: '',
                    title: '利润率',
                    sortable: false,
                    formatter:function(value,row){
                        return (100.0*row.profitAmount/row.saleAmount).toFixed(2)+"%"
                    }
                }
            ]
        })
    })

    function drawTable(dataList,sel){
        var data = _.map(dataList,function(ele){
            ele.profitRate=(100.0*ele.profitAmount/ele.saleAmount).toFixed(2)+"%"
            return ele
        });
        $(sel).bootstrapTable('destroy').bootstrapTable({
            data: _.sortBy(data,function(obj){return parseInt(obj.profitAmount)}),
            pagination: true,
            pageSize: 10,
            search: true,
            exportDataType:'all',
            columns:[
                {
                    field:'category',
                    title:'品类',
                    sortable:true,
                },{
                    field:'brand',
                    title:'品牌',
                    sortable:true,
                },{
                    field:'product',
                    title:'型号',
                    sortable:true,
                },
                {
                    field:'profitAmount',
                    title:'利润额',
                    sortable:true
                },
                {
                    field:'profitRate',
                    title:'利润率',
                    sortable:true,
                    sorter:function(value1,value2){
                        var value1=parseFloat(value1.replace("%",""));
                        var value2=parseFloat(value2.replace("%",""));
                        return value1>value2?1:value1<value2?-1:0
                    }
                },
                {
                    field:'saleAmount',
                    title:'销售额',
                    sortable:true
                },
                {
                    field:'recyclerAmount',
                    title:'回收额',
                    sortable:true
                },
                {
                    field:'saleCount',
                    title:'销售量',
                    sortable:true
                }
            ]

        });
    }

    function drawSummaryTable(totalDataObj,dataList,sel){
        var data=[]
        var profitAmount= 0,saleAmount= 0,recyclerAmount= 0,saleCount= 0;
        dataList.forEach(function(ele){
            profitAmount+=parseInt(ele.profitAmount)
            saleAmount+=parseInt(ele.saleAmount)
            recyclerAmount+=parseInt(ele.recyclerAmount)
            saleCount+=parseInt(ele.saleCount)
        });
        totalDataObj.type="总体订单汇总";
        totalDataObj.profitRate=(100.0*totalDataObj.profitAmount/totalDataObj.saleAmount).toFixed(2)+"%"
        data.push(totalDataObj);
        data.push({
            profitAmount:profitAmount,
            saleAmount:saleAmount,
            recyclerAmount:recyclerAmount,
            saleCount:saleCount,
            type:"异常订单汇总",
            profitRate:(100.0*profitAmount/saleAmount).toFixed(2)+"%"
        });
        data.push({
            profitAmount:(100.0*profitAmount/totalDataObj.profitAmount).toFixed(2)+"%",
            saleAmount:(100.0*saleAmount/totalDataObj.saleAmount).toFixed(2)+"%",
            recyclerAmount:(100.0*recyclerAmount/totalDataObj.recyclerAmount).toFixed(2)+"%",
            saleCount:(100.0*saleCount/totalDataObj.saleCount).toFixed(2)+"%",
            type:"异常占比",
            profitRate:"-"
        });

        $(sel).bootstrapTable('destroy').bootstrapTable({
            data: data,
            pagination: true,
            pageSize: 10,
            search: true,
            exportDataType:'all',
            columns:[
                {
                    field:'type',
                    title:'汇总类型',
                    sortable:false,
                },
                {
                    field:'profitAmount',
                    title:'利润额',
                    sortable:false
                },
                {
                    field:'profitRate',
                    title:'利润率',
                    sortable:false
                },
                {
                    field:'saleAmount',
                    title:'销售额',
                    sortable:false
                },
                {
                    field:'recyclerAmount',
                    title:'回收额',
                    sortable:false
                },
                {
                    field:'saleCount',
                    title:'销售量',
                    sortable:false
                }
            ]

        });
    }
}

function aijihuiTabPage(filter){
    $("#loading").show();
    $("#aijihui_content").hide();
    requestURL(dataService+"/manage/getAijihuiProfitExceptionMonitor",filter).done(function(result) {
        $("#loading").hide();
        $("#aijihui_content").show();
        var totalDataList = result.totalData;//总体
        var dataList = result.data;//异常数据
        var totalDataListBySource = _.groupBy(totalDataList,function(ele){return ele.source});
        var dataListBySource = _.groupBy(dataList,function(ele){return ele.source});
        drawSummaryTable(totalDataListBySource["爱机汇"],dataListBySource["爱机汇"],"#aijihui_table_summary");
    });


    requestURL(dataService+"/manage/getAijihuiProfitExceptionDetailMonitor",filter).done(function(result) {
        $("#loading").hide();
        $("#aijihui_content").show();
        var dataList = result.data;//异常数据
        var dataListBySource = _.groupBy(dataList,function(ele){return ele.source});
        drawTable(dataListBySource["爱机汇"],"#aijihui_table");
    });

    requestURL(dataService+"/manage/getAijihuiExceptionOrderDetail",filter).done(function(result) {
        $("#aijihui_exception_order_table").bootstrapTable('destroy').bootstrapTable({
            data: _.sortBy(result,function(obj){return parseFloat(obj.profitAmount)}),
            pagination: true,
            search: true,
            exportDataType: 'all',
            columns: [
                {
                    field: 'trade',
                    title: '订单号',
                    sortable: false,
                    formatter:function(value,row){
                        return "'"+value
                    }
                },
                {
                    field: 'category',
                    title: '品类',
                    sortable: false,
                },
                {
                    field: 'brand',
                    title: '品牌',
                    sortable: false,
                },
                {
                    field: 'product',
                    title: '型号',
                    sortable: false,
                },
                {
                    field: 'sku',
                    title: 'sku',
                    sortable: false,
                },
                {
                    field: 'level',
                    title: '等级',
                    sortable: false,
                },
                {
                    field: 'profitAmount',
                    title: '利润额',
                    sortable: true,
                },
                {
                    field: 'InspectProfit',
                    title: '质检毛利额',
                    sortable: false,
                },
                {
                    field: 'saleAmount',
                    title: '销售额',
                    sortable: false,
                },
                {
                    field: 'recyclerAmount',
                    title: '回收额',
                    sortable: false,
                },
                {
                    field: '',
                    title: '利润率',
                    sortable: false,
                    formatter:function(value,row){
                        return (100.0*row.profitAmount/row.saleAmount).toFixed(2)+"%"
                    }
                },
                {
                    field: '',
                    title: '质检毛利率',
                    sortable: false,
                    formatter:function(value,row){
                        return (100.0*row.InspectProfit/row.saleAmount).toFixed(2)+"%"
                    }
                }
            ]
        })
    });


    function drawSummaryTable(totalDataObj,dataList,sel){
        var data=[];
        //总体订单汇总数据处理
        var totalInspectProfit= 0,totalProfitAmount= 0,totalSaleAmount= 0,totalRecyclerAmount= 0,totalSaleCount= 0;
        totalDataObj.forEach(function(e){
            totalInspectProfit+=parseInt(e.inspectProfit);
            totalProfitAmount+=parseInt(e.profitAmount);
            totalSaleAmount+=parseInt(e.saleAmount);
            totalRecyclerAmount+=parseInt(e.recyclerAmount);
            totalSaleCount+=parseInt(e.saleCount);
        });
        data.push({
            inspectProfitRate:(100.0*totalInspectProfit/totalSaleAmount).toFixed(2)+"%",
            profitAmount:totalProfitAmount,
            inspectProfit:totalInspectProfit,
            saleAmount:totalSaleAmount,
            recyclerAmount:totalRecyclerAmount,
            saleCount:totalSaleCount,
            type:"总体订单汇总",
            profitRate:(100.0*totalProfitAmount/totalSaleAmount).toFixed(2)+"%"
        });
        //异常订单汇总数据处理
        var inspectProfit= 0,profitAmount= 0,saleAmount= 0,recyclerAmount= 0,saleCount= 0;
        if(dataList){
            dataList.forEach(function(ele){
                inspectProfit+=parseFloat(ele.inspectProfit);
                profitAmount+=parseFloat(ele.profitAmount);
                saleAmount+=parseFloat(ele.saleAmount);
                recyclerAmount+=parseFloat(ele.recyclerAmount);
                saleCount+=parseInt(ele.saleCount);

            });
        }
        data.push({
            inspectProfitRate:(100.0*inspectProfit/saleAmount).toFixed(2)+"%",
            profitAmount:parseInt(profitAmount),
            inspectProfit:parseInt(inspectProfit),
            saleAmount:parseInt(saleAmount),
            recyclerAmount:parseInt(recyclerAmount),
            saleCount:saleCount,
            type:"异常订单汇总",
            profitRate:(100.0*profitAmount/saleAmount).toFixed(2)+"%"
        });
        data.push({
            profitAmount:(100.0*profitAmount/totalProfitAmount).toFixed(2)+"%",
            saleAmount:(100.0*saleAmount/totalSaleAmount).toFixed(2)+"%",
            recyclerAmount:(100.0*recyclerAmount/totalRecyclerAmount).toFixed(2)+"%",
            saleCount:(100.0*saleCount/totalSaleCount).toFixed(2)+"%",
            type:"异常占比",
            profitRate:"-",
            inspectProfitRate:"-",
            inspectProfit:(100.0*inspectProfit/totalInspectProfit).toFixed(2)+"%"
        });

        $(sel).bootstrapTable('destroy').bootstrapTable({
            data: data,
            pagination: true,
            pageSize: 10,
            search: true,
            exportDataType:'all',
            columns:[
                {
                    field:'type',
                    title:'汇总类型',
                    sortable:false,
                },
                {
                    field:'inspectProfit',
                    title:'质检毛利额',
                    sortable:false
                },
                {
                    field:'inspectProfitRate',
                    title:'质检毛利率',
                    sortable:false
                },
                {
                    field:'profitAmount',
                    title:'利润额',
                    sortable:false
                },
                {
                    field:'profitRate',
                    title:'利润率',
                    sortable:false
                },
                {
                    field:'saleAmount',
                    title:'销售额',
                    sortable:false
                },
                {
                    field:'recyclerAmount',
                    title:'回收额',
                    sortable:false
                },
                {
                    field:'saleCount',
                    title:'销售量',
                    sortable:false
                }
            ]
        });
    }

    function drawTable(dataList,sel){
        var data = _.map(dataList,function(ele){
            ele.profitAmount=parseInt(ele.profitAmount).toFixed(0);
            ele.saleAmount=parseInt(ele.saleAmount).toFixed(0);
            ele.inspectProfit=parseInt(ele.inspectProfit).toFixed(0);
            ele.recyclerAmount=parseInt(ele.recyclerAmount).toFixed(0);
            ele.profitRate=(100.0*ele.profitAmount/ele.saleAmount).toFixed(2)+"%";
            ele.inspectProfitRate=(100.0*ele.inspectProfit/ele.saleAmount).toFixed(2)+"%";
            return ele
        });
        $(sel).bootstrapTable('destroy').bootstrapTable({
            data: _.sortBy(data,function(obj){return parseInt(obj.profitAmount)}),
            pagination: true,
            pageSize: 10,
            search: true,
            exportDataType:'all',
            columns:[
                {
                    field:'brand',
                    title:'品牌',
                    sortable:true,
                },{
                    field:'product',
                    title:'型号',
                    sortable:true,
                },
                {
                    field:'inspectProfit',
                    title:'质检毛利额',
                    sortable:true
                },
                {
                    field:'inspectProfitRate',
                    title:'质检毛利率',
                    sortable:true
                },
                {
                    field:'profitAmount',
                    title:'利润额',
                    sortable:true
                },
                {
                    field:'profitRate',
                    title:'利润率',
                    sortable:true,
                    sorter:function(value1,value2){
                        var value1=parseFloat(value1.replace("%",""));
                        var value2=parseFloat(value2.replace("%",""));
                        return value1>value2?1:value1<value2?-1:0
                    }
                },
                {
                    field:'saleAmount',
                    title:'销售额',
                    sortable:true
                },
                {
                    field:'recyclerAmount',
                    title:'回收额',
                    sortable:true
                },
                {
                    field:'saleCount',
                    title:'销售量',
                    sortable:true
                }
            ]

        });
    }

}











