/**
 * Created by admin on 2017/8/22.
 */
Template.detailProfitInfo.rendered = function () {

    $('.navi-tab').removeClass('active');
    $('#pricemonitor').addClass('active');
    $('#detailProfitInfo').addClass('active');

    if(isMobile()){
        $('.sidebar-toggle').click();
        mobile = true;
    }
    var dateGap = -6;
    var minDate = "2016-09-01";
    var endDate = new Date().getNewDate(0);
    var startDate = new Date(endDate).getNewDate(dateGap);
    $(".dateSelectLabel").html(startDate + "~" + endDate);
    $('.reportRangeOutlets').daterangepicker(datePickerOptionsFunc(startDate,endDate,minDate,false), pickDateRangeCallback);



    saleAnalyseFunc({"sdt":startDate,"edt":endDate});
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        // 获取已激活的标签页的名称
        var activeTab = e.target.hash;
        var query = getSelectedOptions();
        switch(activeTab) {
            case "#saleAnalyse":
                saleAnalyseFunc(query);
                break;
            case "#biddingAnalysis":
                biddingAnalysisFunc(query);
                break;
            case "#tradeMethod":
                tradeMethodFunc(query)
                break;
            case "#orderSource":
                orderSourceFunc(query)
                break
            case "#profit":
                getProfitByProductFunc(query)
                break
            case "#hotProduct":
                getHotProductFunc(query)
                break
            case "#price":
                getPriceFunc(query)
                break
            case "#smartPrice":
                getSmartPriceFunc(query)
                break

        }
    });

    $("#type").change(function(){
        var type=$(this).val()
        switch (type){
            case "手机":
                $("#priceRange").val("0~300;300~1000;1000~")
                break
            case "平板":
                $("#priceRange").val("0~300;300~1000;1000~")
                break
            case "笔记本":
                $("#priceRange").val("0~500;500~1000;1000~2000;2000~4000;4000~")
                break
            case "摄影摄像":
                $("#priceRange").val("0~200;200~1000;1000~5000;5000~10000;10000~")
                break
            case "智能数码":
                $("#priceRange").val("0~50;50~300;300~800;800~")
                break
        }
    })

    $(".search").click(function(){
        getPriceFunc(getSelectedOptions())
    })

    $("#category").change(function(){
        var query = getSelectedOptions();
        getSmartPriceFunc(query)
    })

};

function getSelectedOptions(){
    var arr = $(".dateSelectLabel").text().split("~")
    return {"sdt":arr[0],"edt":arr[1]}
}

function pickDateRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.dateSelectLabel').html(sdt + "~" + edt);
    var query = {"sdt":sdt,"edt":edt}
    var activeTab = "#"+$(".tab-content>.active").attr("id");
    switch(activeTab) {
        case "#saleAnalyse":
            saleAnalyseFunc(query);
            break;
        case "#biddingAnalysis":
            biddingAnalysisFunc(query);
            break;
        case "#tradeMethod":
            tradeMethodFunc(query)
            break;
        case "#orderSource":
            orderSourceFunc(query)
            break
        case "#profit":
            getProfitByProductFunc(query)
            break
        case "#hotProduct":
            getHotProductFunc(query)
            break
        case "#price":
            getPriceFunc(query)
            break
        case "#smartPrice":
            getSmartPriceFunc(query)
            break
    }
}

//主营与爱机汇销售分析
function saleAnalyseFunc(query){
    var columns = [
        [
            {
                field: 'date',
                title: '日期',
                sortable:true,
                valign:"middle",
                align:"center",
                colspan: 1,
                rowspan: 2
            },

            {
                title: "主营-销售利润分析",
                valign:"middle",
                align:"center",
                colspan: 5,
                rowspan: 1
            },

            {
                title: "爱机汇-销售利润分析",
                valign:"middle",
                align:"center",
                colspan: 5,
                rowspan: 1
            },
        ],

        [
            {
                field: 'ahs_deal',
                title: '回购金额',
                valign:"middle",
                align:"center",
                sortable:true
            },
            {
                field: 'ahs_quotation',
                title: '销售金额',
                valign:"middle",
                align:"center",
                sortable:true
            },
            {
                field: 'ahs_count',
                title: '销售数量',
                valign:"middle",
                align:"center",
                sortable:true
            },
            {
                field: 'ahs_profit',
                title: '利润额',
                valign:"middle",
                align:"center",
                sortable:true
            },
            {
                field: 'ahs_rate',
                title: '利润率',
                valign:"middle",
                align:"center",
                sortable:true,
                formatter:function(value,row,index){
                    return (100*value).toFixed(2)+"%"
                }
            },
            {
                field: 'ajh_deal',
                title: '回购金额',
                valign:"middle",
                align:"center",
                sortable:true
            },
            {
                field: 'ajh_quotation',
                title: '销售金额',
                valign:"middle",
                align:"center",
                sortable:true
            },
            {
                field: 'ajh_count',
                title: '销售数量',
                valign:"middle",
                align:"center",
                sortable:true
            },
            {
                field: 'ajh_profit',
                title: '利润额',
                valign:"middle",
                align:"center",
                sortable:true
            },
            {
                field: 'ajh_rate',
                title: '利润率',
                valign:"middle",
                align:"center",
                sortable:true,
                formatter:function(value,row,index){

                    return isNaN(value)?"-":(100*value).toFixed(2)+"%"
                }
            }
        ]
    ]
    $("#saleAnalyseLoading").show()
    $("#saleAnalyseContent").hide()
    requestURL(dataService+"/profit/getSaleAnalyse",query).done(function(ret){
        $("#saleAnalyseLoading").hide()
        $("#saleAnalyseContent").show()
        var dataList = dataProcess(ret)
        drawChart(dataList,"主营爱机汇销售利润分析","chart");
        drawTable(dataList,columns,"#table")
    });

    requestURL(dataService+"/profit/getSaleAnalyseByCategory", $.extend({},query,{"type":"手机"})).done(function(ret){

        drawTable(dataProcess(ret),columns,"#tableMobile")
    })

    requestURL(dataService+"/profit/getSaleAnalyseByCategory", $.extend({},query,{"type":"平板"})).done(function(ret){

        drawTable(dataProcess(ret),columns,"#tablePad")
    })

    requestURL(dataService+"/profit/getSaleAnalyseByCategory", $.extend({},query,{"type":"笔记本"})).done(function(ret){

        drawTable(dataProcess(ret),columns,"#tableNote")
    })

    requestURL(dataService+"/profit/getSaleAnalyseByCategory", $.extend({},query,{"type":"摄影摄像"})).done(function(ret){
        drawTable(dataProcess(ret),columns,"#tableVideo")
    })

    requestURL(dataService+"/profit/getSaleAnalyseByCategory", $.extend({},query,{"type":"智能数码"})).done(function(ret){
        drawTable(dataProcess(ret),columns,"#tableIntelligent")
    })

    var dataProcess = function(ret){
        var dateObj = _.groupBy(ret,function(obj){return obj.date})
        var dataList=[]
        for(var key in dateObj){
            var tmpObj={
                date:"",
                ahs_deal:"-",
                ahs_quotation:"-",
                ahs_profit:"-",
                ahs_count:"-",
                ajh_deal:"-",
                ajh_quotation:"-",
                ajh_profit:"-",
                ajh_count:"-"
            }
            dateObj[key].forEach(function(obj){
                tmpObj.date=obj.date
                if(obj.tag=="爱机汇"){
                    tmpObj.ajh_deal=parseInt(obj.deal)
                    tmpObj.ajh_quotation=parseInt(obj.quotation)
                    tmpObj.ajh_profit=parseInt(obj.profit)
                    tmpObj.ajh_count=parseInt(obj.count)
                }else if(obj.tag=="爱回收"){
                    tmpObj.ahs_deal=parseInt(obj.deal)
                    tmpObj.ahs_quotation=parseInt(obj.quotation)
                    tmpObj.ahs_profit=parseInt(obj.profit)
                    tmpObj.ahs_count=parseInt(obj.count)
                }
            })
            tmpObj.ahs_rate=(tmpObj.ahs_profit/tmpObj.ahs_quotation)//.toFixed(2)
            tmpObj.ajh_rate=(tmpObj.ajh_profit/tmpObj.ajh_quotation)//.toFixed(2)
            dataList.push(tmpObj)
        }
        return dataList
    }

    var drawTable = function(data,columns,sel){
        //var fixRow = '"<tr style=";"", " ", "", "", " data-index="0"", "", "", ">", "<td  style=""    ></td>", "<td  style="text-align: center"  colspan="5"   >主营-全品类销售利润分析</td>",  "<td  style="text-align: center"   colspan="5" >爱机汇-全品类销售利润情况</td>", "</tr>"'
        $(sel).bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            pagination: true,
            //fixRow:fixRow,
            /*sidePagination: 'server',*/
            data: _.sortBy(data,function(obj){return -new Date(obj.date).getTime()}),
            columns: columns
        });
    }
    var drawChart = function(data,title,id){
        var option = {
            title: {
                text:title,
                x: "center",
                //y: "bottom"
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter:function(params){
                    var str = params[0].name + '<br/>';
                    params.forEach(function(obj){
                        if(obj.seriesName.indexOf("率")>-1){
                            str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                        }else{
                            str += obj.seriesName + ' : ' + obj.value + '<br/>'
                        }
                    });
                    return str;
                }
            },
            legend: {
                data: ['主营_销售额', '爱机汇_销售额','主营_销售量','爱机汇_销售量' ,'主营_利润额','爱机汇_利润额','主营_利润率','爱机汇_利润率'],
                padding:[30,0,0,0],
                selected: {
                    "主营_销售量": false,
                    "爱机汇_销售量": false,
                },
            },
            grid: {
                top:isMobile()?100:50,
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: _.map(data,function(ele){return ele.date})
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel:{
                        formatter: '{value}'
                    }
                },
                {
                    type: 'value',
                    axisLabel:{
                        formatter: '{value}%'
                    }
                }
            ],
            series: [
                {
                    name: '主营_销售额',
                    type: 'bar',
                    data: _.map(data,function(ele){return ele.ahs_quotation})
                }, {
                    name: '爱机汇_销售额',
                    type: 'bar',
                    data: _.map(data,function(ele){return ele.ajh_quotation})
                },
                {
                    name: '主营_销售量',
                    type: 'bar',
                    data: _.map(data,function(ele){return ele.ahs_count})
                }, {
                    name: '爱机汇_销售量',
                    type: 'bar',
                    data: _.map(data,function(ele){return ele.ajh_count})
                },
                {
                    name: '主营_利润额',
                    type: 'bar',
                    data: _.map(data,function(ele){return ele.ahs_profit})
                }, {
                    name: '爱机汇_利润额',
                    type: 'bar',
                    data: _.map(data,function(ele){return ele.ajh_profit})
                },
                {
                    name: '主营_利润率',
                    type: 'line',
                    yAxisIndex:1,
                    data: _.map(data,function(ele){return (ele.ahs_rate*100).toFixed(2)})
                }, {
                    name: '爱机汇_利润率',
                    type: 'line',
                    yAxisIndex:1,
                    data: _.map(data,function(ele){return (ele.ajh_rate*100).toFixed(2)})
                }
            ]
        };
        var chart = echarts.init(document.getElementById(id));
        chart.setOption(option);
        window.addEventListener('resize', chart.resize)
    }
}

//自营、BD与爱机汇竞价分析对比
function biddingAnalysisFunc(query){
    var columns = [
        [
            {
                field: 'date',
                title: '日期',
                sortable:true,
                valign:"middle",
                align:"center",
                colspan: 1,
                rowspan: 2
            },

            {
                title: "自营-竞价分析",
                valign:"middle",
                align:"center",
                colspan: 5,
                rowspan: 1
            },

            {
                title: "BD-竞价分析",
                valign:"middle",
                align:"center",
                colspan: 5,
                rowspan: 1
            },

            {
                title: "爱机汇-竞价分析",
                valign:"middle",
                align:"center",
                colspan: 5,
                rowspan: 1
            },
        ],

        [
            {
                field: 'ahs_count',
                title: '销售数量',
                valign:"middle",
                align:"center",
                sortable:true
            },
            {
                field: 'ahs_quotation',
                title: '销售金额',
                valign:"middle",
                align:"center",
                sortable:true
            },
            {
                field: 'ahs_cost',
                title: '成本',
                valign:"middle",
                align:"center",
                sortable:true
            },
            {
                field: 'ahs_profit',
                title: '利润额',
                valign:"middle",
                align:"center",
                sortable:true
            },
            {
                field: 'ahs_rate',
                title: '利润率',
                valign:"middle",
                align:"center",
                sortable:true,
                formatter:function(value,row,index){
                    return (100*value).toFixed(2)+"%"
                }
            },
            {
                field: 'bd_count',
                title: '销售数量',
                valign:"middle",
                align:"center",
                sortable:true
            },
            {
                field: 'bd_quotation',
                title: '销售金额',
                valign:"middle",
                align:"center",
                sortable:true
            },
            {
                field: 'bd_cost',
                title: '成本',
                valign:"middle",
                align:"center",
                sortable:true
            },
            {
                field: 'bd_profit',
                title: '利润额',
                valign:"middle",
                align:"center",
                sortable:true
            },
            {
                field: 'bd_rate',
                title: '利润率',
                valign:"middle",
                align:"center",
                sortable:true,
                formatter:function(value,row,index){
                    return (100*value).toFixed(2)+"%"
                }
            },
            {
                field: 'ajh_count',
                title: '销售数量',
                valign:"middle",
                align:"center",
                sortable:true
            },
            {
                field: 'ajh_quotation',
                title: '销售金额',
                valign:"middle",
                align:"center",
                sortable:true
            },
            {
                field: 'ajh_cost',
                title: '成本',
                valign:"middle",
                align:"center",
                sortable:true
            },
            {
                field: 'ajh_profit',
                title: '利润额',
                valign:"middle",
                align:"center",
                sortable:true
            },
            {
                field: 'ajh_rate',
                title: '利润率',
                valign:"middle",
                align:"center",
                sortable:true,
                formatter:function(value,row,index){

                    return isNaN(value)?"-":(100*value).toFixed(2)+"%"
                }
            }
        ]
    ]
    $("#biddingAnalysisLoading").show()
    $("#biddingAnalysisContent").hide()
    requestURL(dataService+"/profit/getBiddingAnalysis",query).done(function(ret){
        $("#biddingAnalysisLoading").hide()
        $("#biddingAnalysisContent").show()
        var dataList = dataProcess(ret)
        drawChart(dataList,"自营、BD与爱机汇竞价分析","biddingAnalysisChart");
        drawTable(dataList,columns,"#biddingAnalysisTable")
    });

    requestURL(dataService+"/profit/getBiddingAnalysisByCategory", $.extend({},query,{"type":"手机"})).done(function(ret){

        drawTable(dataProcess(ret),columns,"#biddingAnalysisTableMobile")
    })

    requestURL(dataService+"/profit/getBiddingAnalysisByCategory", $.extend({},query,{"type":"平板电脑"})).done(function(ret){

        drawTable(dataProcess(ret),columns,"#biddingAnalysisTablePad")
    })

    requestURL(dataService+"/profit/getBiddingAnalysisByCategory", $.extend({},query,{"type":"笔记本"})).done(function(ret){

        drawTable(dataProcess(ret),columns,"#biddingAnalysisTableNote")
    })

    requestURL(dataService+"/profit/getBiddingAnalysisByCategory", $.extend({},query,{"type":"摄影摄像"})).done(function(ret){
        drawTable(dataProcess(ret),columns,"#biddingAnalysisTableVideo")
    })

    requestURL(dataService+"/profit/getBiddingAnalysisByCategory", $.extend({},query,{"type":"智能数码"})).done(function(ret){
        drawTable(dataProcess(ret),columns,"#biddingAnalysisTableIntelligent")
    })

    var dataProcess = function(ret){
        var dateObj = _.groupBy(ret,function(obj){return obj.date})
        var dataList=[]
        for(var key in dateObj){
            var tmpObj={
                date:"",
                ahs_count:"-",
                ahs_quotation:"-",
                ahs_profit:"-",
                ahs_cost:"-",
                bd_count:"-",
                bd_quotation:"-",
                bd_profit:"-",
                bd_cost:"-",
                ajh_count:"-",
                ajh_quotation:"-",
                ajh_profit:"-",
                ajh_cost:"-"
            }
            dateObj[key].forEach(function(obj){
                tmpObj.date=obj.date
                if(obj.source=="爱机汇"){
                    tmpObj.ajh_count=parseInt(obj.count)
                    tmpObj.ajh_quotation=parseInt(obj.quotation)
                    tmpObj.ajh_profit=parseInt(obj.profit)
                    tmpObj.ajh_cost=parseInt(obj.cost)
                    //tmpObj.ajh_rate=parseInt(obj.rate)
                }else if(obj.source=="主营"){//主营指的就是爱回收
                    tmpObj.ahs_count=parseInt(obj.count)
                    tmpObj.ahs_quotation=parseInt(obj.quotation)
                    tmpObj.ahs_profit=parseInt(obj.profit)
                    tmpObj.ahs_cost=parseInt(obj.cost)
                    //tmpObj.ahs_rate=parseInt(obj.rate)
                }else if(obj.source=="BD"){
                    tmpObj.bd_count=parseInt(obj.count)
                    tmpObj.bd_quotation=parseInt(obj.quotation)
                    tmpObj.bd_profit=parseInt(obj.profit)
                    tmpObj.bd_cost=parseInt(obj.cost)
                    //tmpObj.bd_rate=parseInt(obj.rate)
                }
            })
            tmpObj.ahs_rate=(tmpObj.ahs_profit/tmpObj.ahs_quotation)//.toFixed(2)
            tmpObj.bd_rate=(tmpObj.bd_profit/tmpObj.bd_quotation)//.toFixed(2)
            tmpObj.ajh_rate=(tmpObj.ajh_profit/tmpObj.ajh_quotation)//.toFixed(2)
            dataList.push(tmpObj)
        }
        return dataList
    }

    var drawTable = function(data,columns,sel){
        $(sel).bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            pagination: true,
            data: _.sortBy(data,function(obj){return -new Date(obj.date).getTime()}),
            columns: columns
        });
    }
    var drawChart = function(data,title,id){
        var option = {
            title: {
                text:title,
                x: "center",
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter:function(params){
                    var str = params[0].name + '<br/>';
                    params.forEach(function(obj){
                        if(obj.seriesName.indexOf("率")>-1){
                            str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                        }else{
                            str += obj.seriesName + ' : ' + obj.value + '<br/>'
                        }
                    });
                    return str;
                }
            },
            legend: {
                data: ['自营_销售额','BD_销售额','爱机汇_销售额','自营_销售量','BD_销售量','爱机汇_销售量' ,'自营_利润额','BD_利润额','爱机汇_利润额','自营_利润率','BD_利润率','爱机汇_利润率'],
                padding:[30,0,0,0],
                selected: {
                    "自营_销售量": false,
                    "BD_销售量": false,
                    "爱机汇_销售量": false,
                },
            },
            grid: {
                top:isMobile()?100:50,
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: _.map(data,function(ele){return ele.date})
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel:{
                        formatter: '{value}'
                    }
                },
                {
                    type: 'value',
                    axisLabel:{
                        formatter: '{value}%'
                    }
                }
            ],
            series: [
                {
                    name: '自营_销售额',
                    type: 'bar',
                    data: _.map(data,function(ele){return ele.ahs_quotation})
                },
                {
                    name: 'BD_销售额',
                    type: 'bar',
                    data: _.map(data,function(ele){return ele.bd_quotation})
                },
                {
                    name: '爱机汇_销售额',
                    type: 'bar',
                    data: _.map(data,function(ele){return ele.ajh_quotation})
                },
                {
                    name: '自营_销售量',
                    type: 'bar',
                    data: _.map(data,function(ele){return ele.ahs_count})
                },
                {
                    name: 'BD_销售量',
                    type: 'bar',
                    data: _.map(data,function(ele){return ele.bd_count})
                },
                {
                    name: '爱机汇_销售量',
                    type: 'bar',
                    data: _.map(data,function(ele){return ele.ajh_count})
                },
                {
                    name: '自营_利润额',
                    type: 'bar',
                    data: _.map(data,function(ele){return ele.ahs_profit})
                },
                {
                    name: 'BD_利润额',
                    type: 'bar',
                    data: _.map(data,function(ele){return ele.bd_profit})
                },
                {
                    name: '爱机汇_利润额',
                    type: 'bar',
                    data: _.map(data,function(ele){return ele.ajh_profit})
                },
                {
                    name: '自营_利润率',
                    type: 'line',
                    yAxisIndex:1,
                    data: _.map(data,function(ele){return (ele.ahs_rate*100).toFixed(2)})
                },
                {
                    name: 'BD_利润率',
                    type: 'line',
                    yAxisIndex:1,
                    data: _.map(data,function(ele){return (ele.bd_rate*100).toFixed(2)})
                },
                {
                    name: '爱机汇_利润率',
                    type: 'line',
                    yAxisIndex:1,
                    data: _.map(data,function(ele){return (ele.ajh_rate*100).toFixed(2)})
                }
            ]
        };
        var biddingAnalysisChart = echarts.init(document.getElementById(id));
        biddingAnalysisChart.setOption(option);
        window.addEventListener('resize', biddingAnalysisChart.resize)
    }
}


//订单来源
function orderSourceFunc(query){
    var columns = [
        {
            field: '日期',
            title: '日期',
            sortable:true
        },
        {
            field: '官网',
            title: '官网',
            sortable:true,
            formatter:function(value,row,index){
                return value=="-"?"-":(100*value).toFixed(2)+"%"
            }
        },
        {
            field: '门店',
            title: '门店',
            sortable:true,
            formatter:function(value,row,index){
                return value=="-"?"-":(100*value).toFixed(2)+"%"
            }
        },
        {
            field: '京东',
            title: '京东',
            sortable:true,
            formatter:function(value,row,index){
                return value=="-"?"-":(100*value).toFixed(2)+"%"
            }
        },
        {
            field: '小米',
            title: '小米',
            sortable:true,
            formatter:function(value,row,index){
                return value=="-"?"-":(100*value).toFixed(2)+"%"
            }
        },
        {
            field: '芝麻信用',
            title: '芝麻信用',
            sortable:true,
            formatter:function(value,row,index){
                return value=="-"?"-":(100*value).toFixed(2)+"%"
            }
        },
        {
            field: '外采',
            title: '外采',
            sortable:true,
            formatter:function(value,row,index){
                return value=="-"?"-":(100*value).toFixed(2)+"%"
            }
        },
        {
            field: 'BD其他',
            title: 'BD其他',
            sortable:true,
            formatter:function(value,row,index){
                return value=="-"?"-":(100*value).toFixed(2)+"%"
            }
        },{
            field: '爱机汇',
            title: '爱机汇',
            sortable:true,
            formatter:function(value,row,index){
                return value=="-"?"-":(100*value).toFixed(2)+"%"
            }
        }
    ]
    $("#orderSourceLoading").show()
    $("#orderSourceContent").hide()
    requestURL(dataService+"/profit/getOrderSource",query).done(function(ret){
        $("#orderSourceLoading").hide()
        $("#orderSourceContent").show()
        var dateList = dataProcess(ret)

        drawTable(dateList,columns,"#orderSourceTable")
        drawChart(_.sortBy(dateList,function(obj){return  new Date(obj['日期']).getTime()}),"全品类订单来源利润率对比","orderSourceChart")})

    requestURL(dataService+"/profit/getOrderSourceByCategory",$.extend({},query,{"type":"手机"})).done(function(ret){

        drawTable(dataProcess(ret),columns,"#orderSourceTableMobile")
    })
    requestURL(dataService+"/profit/getOrderSourceByCategory",$.extend({},query,{"type":"平板"})).done(function(ret){

        drawTable(dataProcess(ret),columns,"#orderSourceTablePad")
    })
    requestURL(dataService+"/profit/getOrderSourceByCategory",$.extend({},query,{"type":"笔记本"})).done(function(ret){
        drawTable(dataProcess(ret),columns,"#orderSourceTableNote")
    })
    requestURL(dataService+"/profit/getOrderSourceByCategory",$.extend({},query,{"type":"摄影摄像"})).done(function(ret){
        drawTable(dataProcess(ret),columns,"#orderSourceTableVideo")
    })
    requestURL(dataService+"/profit/getOrderSourceByCategory",$.extend({},query,{"type":"智能数码"})).done(function(ret){
        drawTable(dataProcess(ret),columns,"#orderSourceTableIntelligent")
    })

    var dataProcess = function(ret){
        var dateObj = _.groupBy(ret,function(obj){return obj.date})
        var dateList=[]
        for(var key in dateObj){
            var tmpObj={
                '日期':key,
                '官网':"-",
                '门店':"-",
                '京东':"-",
                '小米':"-",
                '芝麻信用':"-",
                '外采':"-",
                'BD其他':"-",
                '爱机汇':"-",
            }
            dateObj[key].forEach(function(ele){
                tmpObj[ele.name]=ele.rate
            })
            dateList.push(tmpObj)
        }
        return dateList
    }

    var drawTable = function(dataList,columns,sel){
        $(sel).bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            pagination: true,
            /*sidePagination: 'server',*/
            data: _.sortBy(dataList,function(obj){return  -new Date(obj['日期']).getTime()}),
            columns: columns
        });
    }
    var drawChart = function(data,title,id){
        var option = {
            title: {
                text:title,
                x: "center",
                //y: "bottom"
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter:function(params){
                    var str = params[0].name + '<br/>';
                    params.forEach(function(obj){
                        str += obj.seriesName + ' : ' + (100*obj.value).toFixed(2) + '%<br/>'
                    });
                    return str;
                }
            },
            legend: {
                data: ['官网', '门店','爱机汇','京东' ,'小米','芝麻信用','外采','BD其他'],
                padding:[30,0,0,0],
            },
            grid: {
                top:isMobile()?100:50,
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: _.map(data,function(ele){return ele['日期']})
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel:{
                        //formatter: '{value}%'
                        formatter:function(params){
                            return (100*params).toFixed(2)+"%"
                        }
                    }
                }
            ],
            series: [
                {
                    name: '官网',
                    type: 'line',
                    data: _.map(data,function(ele){return ele['官网']})
                }, {
                    name: '门店',
                    type: 'line',
                    data: _.map(data,function(ele){return ele['门店']})
                },
                {
                    name: '爱机汇',
                    type: 'line',
                    data: _.map(data,function(ele){return ele['爱机汇']})
                }, {
                    name: '京东',
                    type: 'line',
                    data: _.map(data,function(ele){return ele['京东']})
                },
                {
                    name: '小米',
                    type: 'line',
                    data: _.map(data,function(ele){return ele['小米']})
                },{
                    name: '芝麻信用',
                    type: 'line',
                    data: _.map(data,function(ele){return ele['芝麻信用']})
                },{
                    name: '外采',
                    type: 'line',
                    data: _.map(data,function(ele){return ele['外采']})
                },{
                    name: 'BD其他',
                    type: 'line',
                    data: _.map(data,function(ele){return ele['BD其他']})
                }
            ]
        };
        var chart = echarts.init(document.getElementById(id));
        chart.setOption(option);
        window.addEventListener('resize', chart.resize)
    }
}




//智能定价竞争力分析
function getSmartPriceFunc(query) {
    $("#smartPriceLoading").show()
    $("#smartPriceContent").hide()
    query.categoryKey=$("#category").val()
    requestURL(dataService + "/profit/getSmartPrice", query).done(function (ret) {
        $("#smartPriceLoading").hide()
        $("#smartPriceContent").show()
        drawChart(ret,"智能定价竞争力分析","smartPriceChart")
        $("#smartPriceTable").bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            pagination: true,
            data: ret,
            columns: [
                {
                    field: 'date',
                    title: '日期',
                    sortable:true
                },
                {
                    field: 'all_rate_1',
                    title: '大盘绝对竞争力',
                    sortable:true,
                    formatter:function(value,row,index){
                        return (100*value).toFixed(2)+"%"
                    }
                },
                {
                    field: 'all_rate_2',
                    title: '大盘容忍竞争力',
                    sortable:true,
                    formatter:function(value,row,index){
                        return (100*value).toFixed(2)+"%"
                    }
                },
                {
                    field: 'all_rate_3',
                    title: '大盘绝对+容忍竞争力',
                    sortable:true,
                    formatter:function(value,row,index){
                        return (100*value).toFixed(2)+"%"
                    }
                },
                {
                    field: 'a_rate_1',
                    title: 'A级绝对竞争力',
                    sortable:true,
                    formatter:function(value,row,index){
                        return (100*value).toFixed(2)+"%"
                    }
                },
                {
                    field: 'a_rate_2',
                    title: 'A级容忍竞争力',
                    sortable:true,
                    formatter:function(value,row,index){
                        return (100*value).toFixed(2)+"%"
                    }
                },
                {
                    field: 'a_rate_3',
                    title: 'A级绝对+容忍竞争力',
                    sortable:true,
                    formatter:function(value,row,index){
                        return (100*value).toFixed(2)+"%"
                    }
                },
                {
                    field: 'b_rate_1',
                    title: 'B级绝对竞争力',
                    sortable:true,
                    formatter:function(value,row,index){
                        return (100*value).toFixed(2)+"%"
                    }
                },
                {
                    field: 'b_rate_2',
                    title: 'B级容忍竞争力',
                    sortable:true,
                    formatter:function(value,row,index){
                        return (100*value).toFixed(2)+"%"
                    }
                },
                {
                    field: 'b_rate_3',
                    title: 'B级绝对+容忍竞争力',
                    sortable:true,
                    formatter:function(value,row,index){
                        return (100*value).toFixed(2)+"%"
                    }
                },
                {
                    field: 'c_rate_1',
                    title: 'C级绝对竞争力',
                    sortable:true,
                    formatter:function(value,row,index){
                        return (100*value).toFixed(2)+"%"
                    }
                },
                {
                    field: 'c_rate_2',
                    title: 'C级容忍竞争力',
                    sortable:true,
                    formatter:function(value,row,index){
                        return (100*value).toFixed(2)+"%"
                    }
                },
                {
                    field: 'c_rate_3',
                    title: 'C级绝对+容忍竞争力',
                    sortable:true,
                    formatter:function(value,row,index){
                        return (100*value).toFixed(2)+"%"
                    }
                }
            ]
        });
    })

    var drawChart = function (data, title, id) {
        var option = {
            title: {
                text: title,
                x: "center",
                //y: "bottom"
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter: function (params) {
                    var str = params[0].name + '<br/>';
                    params.forEach(function (obj) {
                        str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                    });
                    return str;
                }
            },
            legend: {
                data: ['大盘绝对竞争力','大盘容忍竞争力','大盘绝对+容忍竞争力', 'A级绝对竞争力','A级容忍竞争力','A级绝对+容忍竞争力', 'B级绝对竞争力','B级容忍竞争力','B级绝对+容忍竞争力', 'C级绝对竞争力', 'C级容忍竞争力', 'C级绝对+容忍竞争力'],
                padding: [30, 0, 0, 0]
            },
            grid: {
                top: isMobile() ? 100 : 50,
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: _.map(data, function (ele) {
                        return ele.date
                    })
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}%'
                    }
                },
            ],
            series: [
                {
                    name: '大盘绝对竞争力',
                    type: 'line',
                    data: _.map(data, function (ele) {
                        return (100*ele.all_rate_1).toFixed(2)
                    })
                },{
                    name: '大盘容忍竞争力',
                    type: 'line',
                    data: _.map(data, function (ele) {
                        return (100*ele.all_rate_2).toFixed(2)
                    })
                },{
                    name: '大盘绝对+容忍竞争力',
                    type: 'line',
                    data: _.map(data, function (ele) {
                        return (100*ele.all_rate_3).toFixed(2)
                    })
                }, {
                    name: 'A级绝对竞争力',
                    type: 'line',
                    data: _.map(data, function (ele) {
                        return (100*ele.a_rate_1).toFixed(2)
                    })
                },{
                    name: 'A级容忍竞争力',
                    type: 'line',
                    data: _.map(data, function (ele) {
                        return (100*ele.a_rate_2).toFixed(2)
                    })
                },{
                    name: 'A级绝对+容忍竞争力',
                    type: 'line',
                    data: _.map(data, function (ele) {
                        return (100*ele.a_rate_3).toFixed(2)
                    })
                },
                {
                    name: 'B级绝对竞争力',
                    type: 'line',
                    data: _.map(data, function (ele) {
                        return (100*ele.b_rate_1).toFixed(2)
                    })
                }, {
                    name: 'B级容忍竞争力',
                    type: 'line',
                    data: _.map(data, function (ele) {
                        return (100*ele.b_rate_2).toFixed(2)
                    })
                },{
                    name: 'B级绝对+容忍竞争力',
                    type: 'line',
                    data: _.map(data, function (ele) {
                        return (100*ele.b_rate_3).toFixed(2)
                    })
                },{
                    name: 'C级绝对竞争力',
                    type: 'line',
                    data: _.map(data, function (ele) {
                        return (100*ele.c_rate_1).toFixed(2)
                    })
                },{
                    name: 'C级容忍竞争力',
                    type: 'line',
                    data: _.map(data, function (ele) {
                        return (100*ele.c_rate_2).toFixed(2)
                    })
                },{
                    name: 'C级绝对+容忍竞争力',
                    type: 'line',
                    data: _.map(data, function (ele) {
                        return (100*ele.c_rate_3).toFixed(2)
                    })
                }
            ]
        };
        var chart = echarts.init(document.getElementById(id));
        chart.setOption(option);
        window.addEventListener('resize', chart.resize)
    }
}

//交易方式
function  tradeMethodFunc(query){

    var columns = [
        {
        field: '日期',
        title: '日期',
        sortable:true
        },
        {
            field: '门店订单',
            title: '门店订单',
            sortable:true,
            formatter:function(value,row,index){
                return (100*value).toFixed(2)+"%"
            }
        },
        {
            field: '上门订单',
            title: '上门订单',
            sortable:true,
            formatter:function(value,row,index){
                return (100*value).toFixed(2)+"%"
            }
        },
        {
            field: 'O2O订单',
            title: 'O2O订单',
            sortable:true,
            formatter:function(value,row,index){
                return (100*value).toFixed(2)+"%"
            }
        },
        {
            field: '快递订单',
            title: '快递订单',
            sortable:true,
            formatter:function(value,row,index){
                return (100*value).toFixed(2)+"%"
            }
        },
        {
            field: 'MTA订单',
            title: 'MTA订单',
            sortable:true,
            formatter:function(value,row,index){
                return (100*value).toFixed(2)+"%"
            }
        },
        {
            field: '机柜订单',
            title: '机柜订单',
            sortable:true,
            formatter:function(value,row,index){
                return (100*value).toFixed(2)+"%"
            }
        },
        {
            field: '爱机汇',
            title: '爱机汇',
            sortable:true,
            formatter:function(value,row,index){
                return (100*value).toFixed(2)+"%"
            }
        }]
    $("#tradeMethodLoading").show()
    $("#tradeMethodContent").hide()
    requestURL(dataService+"/profit/getTradeMethod",query).done(function(ret){
        $("#tradeMethodLoading").hide()
        $("#tradeMethodContent").show()
        var dateObj = _.groupBy(ret,function(obj){return obj.date})
        var dataList=[]
        for(var key in dateObj){
            var tmpObj={
                '日期':key,
                '门店订单':0,
                '上门订单':0,
                'O2O订单':0,
                '快递订单':0,
                '机柜订单':0,
                'MTA订单':0,
                '爱机汇':0
            }
            dateObj[key].forEach(function(ele){
                tmpObj[ele.trade_method_name]=ele.rate
            })
            dataList.push(tmpObj)
        }

        drawTable(dataList,columns,"#tradeMethodTable")
        drawChart(_.sortBy(dataList,function(obj){return  new Date(obj['日期']).getTime()}),"全品类交易方式利润率对比","tradeMethodChart")
    })

    requestURL(dataService+"/profit/getTradeMethodByCategory", $.extend({},query,{"type":"手机"})).done(function(ret){
        drawTable(dataProcess(ret),columns,"#tradeMethodTableMobile")
    })
    requestURL(dataService+"/profit/getTradeMethodByCategory", $.extend({},query,{"type":"平板"})).done(function(ret){
        drawTable(dataProcess(ret),columns,"#tradeMethodTablePad")
    })

    requestURL(dataService+"/profit/getTradeMethodByCategory", $.extend({},query,{"type":"笔记本"})).done(function(ret){
        drawTable(dataProcess(ret),columns,"#tradeMethodTableNote")
    })
    requestURL(dataService+"/profit/getTradeMethodByCategory", $.extend({},query,{"type":"摄影摄像"})).done(function(ret){
        drawTable(dataProcess(ret),columns,"#tradeMethodTableVideo")
    })
    requestURL(dataService+"/profit/getTradeMethodByCategory", $.extend({},query,{"type":"智能数码"})).done(function(ret){
        drawTable(dataProcess(ret),columns,"#tradeMethodTableIntelligent")
    })

    var dataProcess = function(ret){
        var dateObj = _.groupBy(ret,function(obj){return obj.date})
        var dateList=[]
        for(var key in dateObj){
            var tmpObj={
                '日期':key,
                '门店订单':0,
                '上门订单':0,
                'O2O订单':0,
                '快递订单':0,
                '机柜订单':0,
                'MTA订单':0,
                '爱机汇':0
            }
            dateObj[key].forEach(function(ele){
                tmpObj[ele.trade_method_name]=ele.rate
            })
            dateList.push(tmpObj)
        }
        return dateList
    }
    var drawTable = function(dataList,columns,sel){
        $(sel).bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            pagination: true,
            /*sidePagination: 'server',*/
            data: _.sortBy(dataList,function(obj){return  -new Date(obj['日期']).getTime()}),
            columns: columns
        });
    }
    var drawChart = function(data,title,id){
        var option = {
            title: {
                text:title,
                x: "center",
                //y: "bottom"
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter:function(params){
                    var str = params[0].name + '<br/>';
                    params.forEach(function(obj){
                        str += obj.seriesName + ' : ' + (100*obj.value).toFixed(2) + '%<br/>'
                    });
                    return str;
                }
            },
            legend: {
                data: ['门店订单', '上门订单','O2O订单','快递订单','MTA订单', '机柜订单','爱机汇'],
                padding:[30,0,0,0],
            },
            grid: {
                top:isMobile()?100:50,
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: _.map(data,function(ele){return ele['日期']})
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel:{
                        //formatter: '{value}%'
                        formatter:function(params){
                            return (100*params).toFixed(2)+"%"
                        }
                    }
                }
            ],
            series: [
                {
                    name: '门店订单',
                    type: 'line',
                    data: _.map(data,function(ele){return ele['门店订单']})
                }, {
                    name: '上门订单',
                    type: 'line',
                    data: _.map(data,function(ele){return ele['上门订单']})
                },
                {
                    name: 'O2O订单',
                    type: 'line',
                    data: _.map(data,function(ele){return ele['O2O订单']})
                }, {
                    name: '快递订单',
                    type: 'line',
                    data: _.map(data,function(ele){return ele['快递订单']})
                }, {
                    name: 'MTA订单',
                    type: 'line',
                    data: _.map(data,function(ele){return ele['MTA订单']})
                }, {
                    name: '机柜订单',
                    type: 'line',
                    data: _.map(data,function(ele){return ele['机柜订单']})
                },
                {
                    name: '爱机汇',
                    type: 'line',
                    data: _.map(data,function(ele){return ele['爱机汇']})
                }
            ]
        };
        var chart = echarts.init(document.getElementById(id));
        chart.setOption(option);
        window.addEventListener('resize', chart.resize)
    }
}

//品牌爱回收爱机汇利润对比
function getProfitByProductFunc(query){
    $("#profitLoading").show()
    $("#profitContent").hide()
    requestURL(dataService+"/profit/getProfitByProduct",$.extend({},query,{"type":"手机"})).done(function(ret){
        $("#profitLoading").hide()
        $("#profitContent").show()
        var obj = dataProcess(ret)
        drawTable(obj.data,obj.columns,"#profitTableMobile")
    })
    requestURL(dataService+"/profit/getProfitByProduct",$.extend({},query,{"type":"平板"})).done(function(ret){
        var obj = dataProcess(ret)
        drawTable(obj.data,obj.columns,"#profitTablePad")
    })
    requestURL(dataService+"/profit/getProfitByProduct",$.extend({},query,{"type":"笔记本"})).done(function(ret){
        var obj = dataProcess(ret)
        drawTable(obj.data,obj.columns,"#profitTableNote")
    })
    requestURL(dataService+"/profit/getProfitByProduct",$.extend({},query,{"type":"摄影摄像"})).done(function(ret){
        var obj = dataProcess(ret)
        drawTable(obj.data,obj.columns,"#profitTableVideo")
    })
    requestURL(dataService+"/profit/getProfitByProduct",$.extend({},query,{"type":"智能数码"})).done(function(ret){
        var obj = dataProcess(ret)
        drawTable(obj.data,obj.columns,"#profitTableIntelligent")
    })

    var dataProcess=function(ret){
        var dataList = []
        var obj = {}
        var columns = [{
            field: "日期",
            title: "日期",
            sortable:true
        },{
            field: "类型",
            title: "类型",
            sortable:true
        }]
        _.keys(_.groupBy(ret,function(ele){return ele.name})).forEach(function(ele){
            obj[ele]="-"
            columns.push({
                field: ele,
                title: ele,
                sortable:true,
            })
        })

        var dateObj = _.groupBy(ret,function(ele){return ele.date})
        for(var key in dateObj){
            var ahsObj = _.extend({},_.clone(obj),{"日期":key,"类型":"主营"})
            var ajhObj = _.extend({},_.clone(obj),{"日期":key,"类型":"爱机汇"})
            dateObj[key].forEach(function(ele){
                var tag = ele.tag;
                if(tag=="爱回收"){
                    ahsObj[ele.name]=(100*(ele.rate)).toFixed(2)+"%"
                }else if(tag=="爱机汇"){
                    ajhObj[ele.name]=(100*(ele.rate)).toFixed(2)+"%"
                }
            })
            var difObj = {"日期":key,"类型":"<span style='font-weight: bold;'>差值</span>"}
            _.keys(obj).forEach(function(ele){
                var difValue=((ahsObj[ele].replace("%","")-ajhObj[ele].replace("%",""))).toFixed(2)
                difObj[ele]=isNumber(difValue)?Math.abs(difValue)<8?("<span style='font-weight: bold;'>"+difValue+"%</span>"):("<span style='font-weight: bold;color:red'>"+difValue+"%</span>"):"-"
            })
            dataList.push(ahsObj)
            dataList.push(ajhObj)
            dataList.push(difObj)
        }
        return {"data":dataList,"columns": _.sortBy(columns,function(ele){return ele.field=="其他品牌"?1:0})}
    }

    var drawTable = function(dataList,columns,sel){
        $(sel).bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            pagination: true,
            /*sidePagination: 'server',*/
            data: _.sortBy(dataList,function(obj){return  -new Date(obj['日期']).getTime()}),
            columns: columns
        });
    }
}
//热性型号
function getHotProductFunc(query){
    $("#hotProductLoading").show()
    $("#hotProductContent").hide()
    requestURL(dataService+"/profit/getHotProductByCategory",$.extend({},query,{"type":"手机"})).done(function(ret){
        $("#hotProductLoading").hide()
        $("#hotProductContent").show()
        var obj = dataProcess(ret)
        drawTable(obj.ahs,obj.columns,"#ahsHotProductMobile")
        drawTable(obj.ajh,obj.columns,"#ajhHotProductMobile")

    })
    requestURL(dataService+"/profit/getHotProductByCategory",$.extend({},query,{"type":"平板"})).done(function(ret){
        var obj = dataProcess(ret)
        drawTable(obj.ahs,obj.columns,"#ahsHotProductPad")
        drawTable(obj.ajh,obj.columns,"#ajhHotProductPad")

    })
    requestURL(dataService+"/profit/getHotProductByCategory",$.extend({},query,{"type":"笔记本"})).done(function(ret){
        var obj = dataProcess(ret)
        drawTable(obj.ahs,obj.columns,"#ahsHotProductNote")
        drawTable(obj.ajh,obj.columns,"#ajhHotProductNote")

    })
    requestURL(dataService+"/profit/getHotProductByCategory",$.extend({},query,{"type":"摄影摄像"})).done(function(ret){
        var obj = dataProcess(ret)
        drawTable(obj.ahs,obj.columns,"#ahsHotProductVideo")
        drawTable(obj.ajh,obj.columns,"#ajhHotProductVideo")

    })
    requestURL(dataService+"/profit/getHotProductByCategory",$.extend({},query,{"type":"智能数码"})).done(function(ret){
        var obj = dataProcess(ret)
        drawTable(obj.ahs,obj.columns,"#ahsHotProductIntelligent")
        drawTable(obj.ajh,obj.columns,"#ajhHotProductIntelligent")

    })
    var dataProcess = function(ret){
        var ahsDataList=[]
        var ajhDataList=[]
        var obj = {}
        var columns = []
        _.keys(_.groupBy(ret,function(ele){return ele.date})).forEach(function(ele){
            obj[ele]="-"
            columns.push({
                field: ele,
                title: ele,
                sortable:true,

            })
        })
        columns.push({
            field: "name",
            title: '型号',
            sortable:true,
        });
        columns.push({
            field: "rank",
            title: 'rank',
            sortable:true,
        });
        columns.push({
            field: "type",
            title: '类型',
            sortable:true,
        });
        columns.reverse();

        var rankObj = _.groupBy(ret,function(ele){return ele.rank})
        for(var rank in rankObj){
            var ahsObj = _.extend({},_.clone(obj),{"rank":rank})
            var ajhObj = _.extend({},_.clone(obj),{"rank":rank})
            rankObj[rank].forEach(function(ele){
                var name = ele.name;
                var tag = ele.tag;
                ahsObj.name=name;
                ajhObj.name=name;
                ahsObj.type="主营";
                ajhObj.type="爱机汇";
                if(tag=="爱回收"){
                    ahsObj[ele.date]=(100*(ele.rate))//.toFixed(2)//+"%"
                }else if(tag=="爱机汇"){
                    ajhObj[ele.date]=(100*(ele.rate))//.toFixed(2)//+"%"
                }
            })
            var ahsMin = getMinValue(ahsObj)
            var ajhMin = getMinValue(ajhObj)
            for(var key in ahsObj){
                if(isNumber(ahsObj[key])&& /^(\d{4})\-(\d{2})\-(\d{2})$/.test(key)){
                    //console.log(ahsMin+"===>"+ahsObj[key])
                    if(ahsObj[key]==ahsMin){
                        ahsObj[key] = "<span style='color: red'>"+(ahsObj[key]).toFixed(2)+"%</span>"
                    }else{
                        ahsObj[key] = "<span  style=''>"+(ahsObj[key]).toFixed(2)+"%</span>"
                    }
                }
            }
            for(var key in ajhObj){
                if(isNumber(ajhObj[key])&& /^(\d{4})\-(\d{2})\-(\d{2})$/.test(key)){
                    if(ajhObj[key]==ajhMin){
                        ajhObj[key] = "<span style='color: red'>"+(ajhObj[key]).toFixed(2)+"%</span>"
                    }else{
                        ajhObj[key] = "<span>"+(ajhObj[key]).toFixed(2)+"%</span>"
                    }
                }

            }
            ahsDataList.push(ahsObj)
            ajhDataList.push(ajhObj)
        }
        return {"columns":columns,"ahs":ahsDataList,"ajh":ajhDataList}
    }
    var getMinValue = function(obj){
        var tmpObj={}
        for(var key in obj){
            if(/^(\d{4})\-(\d{2})\-(\d{2})$/.test(key)&&isNumber(obj[key])){
                tmpObj[key]=obj[key]
            }
        }
        return _.values(tmpObj).sort(function(a,b){return parseFloat(a)-parseFloat(b)})[0]
    }
    var drawTable = function(dataList,columns,sel){
        $(sel).bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            pagination: true,
            pageSize: 20,
            /*sidePagination: 'server',*/
            data: _.sortBy(dataList,function(obj){return  parseInt(obj.rank)}),
            columns: columns
        });
    }
}
//价格区间
function getPriceFunc(query){
    $(".search").attr("disabled",true);
    $("#priceLoading").show()
    $("#priceContent").hide()
    requestURL(dataService+"/profit/getPriceBetweenByCategory",$.extend({},query,{"type":$("#type").val(),"price":$("#priceRange").val(),"isTotal":"false"})).done(function(ret) {
        $("#priceLoading").hide()
        $("#priceContent").show()
        $(".search").attr("disabled",false);
        var dataList=[]
        var obj = {}
        var columns = [];
        _.keys(_.groupBy(ret,function(ele){return ele.date})).forEach(function(ele){
            obj[ele]="-"
            columns.push({
                field: ele,
                title: ele,
                sortable:true,
            })
        })
        columns.push({
            field: "价格区间",
            title: '价格区间',
            sortable:true,
        });
        columns.push({
            field: "类型",
            title: '类型',
            sortable:true,
        });
        columns.reverse();
        var priceObj = _.groupBy(ret,function(ele){return ele.price})
        for(var key in priceObj){
            var bdObj = _.extend({},_.clone(obj),{"价格区间":key,"类型":"BD"})
            var selfObj = _.extend({},_.clone(obj),{"价格区间":key,"类型":"自营"})
            var ajhObj = _.extend({},_.clone(obj),{"价格区间":key,"类型":"爱机汇"})
            priceObj[key].forEach(function(ele){
                var tag = ele.tag
                if(tag=="BD"){
                    bdObj[ele.date]=(1*(ele.rate)).toFixed(2)+"%"
                }else if(tag=="自营"){
                    selfObj[ele.date]=(1*(ele.rate)).toFixed(2)+"%"
                }else if(tag=="爱机汇"){
                    ajhObj[ele.date]=(1*(ele.rate)).toFixed(2)+"%"
                }
            })
            dataList.push(bdObj)
            dataList.push(selfObj)
            dataList.push(ajhObj)
        }
        drawTable(dataList,columns,"#priceTable")
    })

    var drawTable = function(dataList,columns,sel){
        $(sel).bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            pagination: true,
            /*sidePagination: 'server',*/
            data: _.sortBy(dataList,function(obj){return  parseInt(0+(obj['价格区间']).split("~")[0])}),
            columns: columns
        });
    }
}
