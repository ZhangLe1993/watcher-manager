Template.instrumentsPanel.rendered = function () {
    console.log('欢迎进入仪表盘页面');
    var dateGap = -6;
    var endDate = new Date().getNewDate(0);
    var startDate = new Date(endDate).getNewDate(dateGap);

    $('#fund-analysis-date-range-btn span').html(startDate + ' - ' + endDate);
    $('#circulation-analysis-date-range-btn span').html(startDate + ' - ' + endDate);

    /*整体分析和交易分析日期范围*/
    var tradeEndDate=new Date().getNewDate(-1);
    var tradeStartDate=new Date().getNewDate(-7);
    $('#whole-analysis-date-range-btn span').html(startDate + ' - ' + endDate);
    $('#trade-analysis-date-range-btn span').html(tradeStartDate + ' - ' + tradeEndDate);
    var minDate="2016-01-01";
    $('#fund-analysis-date-range-btn').daterangepicker(filterPickerOptionsFunc(startDate,endDate,minDate,false), fundDateRangeCallback);
    $('#circulation-analysis-date-range-btn').daterangepicker(filterPickerOptionsFunc(startDate,endDate,minDate,false), circulationDateRangeCallback);

    $('#whole-analysis-date-range-btn').daterangepicker(filterPickerOptionsFunc(startDate,endDate,minDate,false), wholeDateRangeCallback);
    $('#trade-analysis-date-range-btn').daterangepicker(filterPickerOptionsFunc(startDate,endDate,minDate,false), tradeDateRangeCallback);

    //手机品类
    var phoneCate = $("#category").val();
    linkSelectInit(phoneCate);

    $(".category").change(function(){
        var category = $("#category").val(); //手机品类
        linkSelectInit(category);
    });

    $("#brand").change(function(){
        var brand = $("#brand").val(); //手机品牌
        productInit(brand);
    });

    /*******************************************@Author:LuJia.Chen-Start***********************************************/
   console.log(getLastDatePeriod(tradeStartDate,tradeEndDate));
    /*1 整体分析*/
    renderOverallAnalysis(endDate);
    /*2 交易分析-获取t+1的数据*/
    /*2a 客户转化*/
    //drawFunnelChart("clientSellerChart","");
    renderClientTransferBuyer(tradeStartDate, tradeEndDate);

    /*2b 物品转化*/
    //drawFunnelChart("productSellerChart", "");
    renderProductTransferBuyer(tradeStartDate, tradeEndDate);

    /*2c 客户分布*/
    //drawDataTable("dealCountTable");
    renderBidCount(tradeStartDate, tradeEndDate);
    //切换tab
    $('a[data-toggle=tab]').on('shown.bs.tab', function (e) {
        var activeTab = $(e.target).text();
        switch (activeTab) {
            case '成交量':
               // drawDataTable("dealCountTable");
                break;
            case '成交金额':
                //updateClearStats();
                break;
            case '竞得量':
                renderBidCount(tradeStartDate, tradeEndDate);
                break;
            case '竞得金额':
                renderBidPrice(tradeStartDate, tradeEndDate);
                break;
            default:
                break;
        }
    });
    /*d 退货分析*/
    renderReturn(tradeStartDate,tradeEndDate);
    /*e 供需比分析*/
    renderSupplyDemand(tradeStartDate,tradeEndDate);

    /*******************************************@Author:LuJia.Chen-End*************************************************/

    /*******************************************@Author:YuLe.Zhang-Start***********************************************/
    //渲染物品流转分析(物品流转流程图，库存分析（面积图，环形图），流拍分析，卖家确认情况分析)
    //drawGoodFlowAnalysis();
    //初始化渲染流拍分析图
    //drawPassInChart();
    //初始化渲染卖家确认情况分析
    //drawVendorChart();
    //初始化渲染垫资分析
    //drawFindAnalysisChart();

    //toolTipCustom();
    /*******************************************@Author:YuLe.Zhang-End*************************************************/
};
/***********************************************@Author:LuJia.Chen-Start***********************************************/

/*1.整体分析*/
var renderOverallAnalysis=function(date){
    var queryArr=date.split("-");    //e.g. date="2018-08-09"
    var query={month:queryArr[0]+ queryArr[1]};     //e.g. 201808
    var getDayCount=new Date(queryArr[0],queryArr[1],0).getDate();  //当月天数
    var oneHundredMillion=100000000;
    /*获取当月的目标*/
    requestURL(dataService+'/instrumentsPanel/getMonthGoal',query).done(function(monthGoal){
        /*代拍GMV*/
        requestURL(dataService+'/instrumentsPanel/getOptGMV',{}).done(function(data){

            var goal=(monthGoal["opt"]/oneHundredMillion).toFixed(1);
            var completion=(data/oneHundredMillion);
            var dailyTarget=(queryArr[2]/getDayCount*goal).toFixed(1);
            console.log(data + " " +goal + " " + completion+ " "+ dailyTarget+" ");
            $('#optGmvCnt').html(data.toLocaleString());
            drawGaugeChart("optGmvChart",goal,"亿",completion,dailyTarget);
        });

        /*b2bGMV*/
        requestURL(dataService+'/instrumentsPanel/getB2bGmv',{}).done(function(data){
            var goal=(monthGoal["b2b"]/oneHundredMillion).toFixed(1);
            var completion=(data/oneHundredMillion);
            var dailyTarget=(queryArr[2]/getDayCount*goal).toFixed(1);
            $('#b2bGmvCnt').html(data.toLocaleString());
            drawGaugeChart("b2bGmvChart",goal,"亿",completion,dailyTarget);
        });

        /*卖家客户数量*/
         requestURL(dataService+"/instrumentsPanel/getSellerClientCount", {}).done(function (data) {
            var goal=monthGoal["seller"].toFixed(0);
            var completion=(data/1).toFixed(0);
            var dailyTarget=(queryArr[2]/getDayCount*goal).toFixed(1);
            console.log(data + " " +goal + " " + completion+ " "+ dailyTarget+" ");
            $('#sellerClientCount').html(data);
            drawGaugeChart("sellerGmvChart",goal,"",completion,dailyTarget);
         });

        /*买家客户数量*/
         requestURL(dataService+"/instrumentsPanel/getBuyerClientCount", {}).done(function (data) {
            var goal=monthGoal["seller"].toFixed(0);    //todo change to "buyer"
            var completion=(data/1).toFixed(0);
            var dailyTarget=(queryArr[2]/getDayCount*goal).toFixed(1);
            $('#buyerClientCount').html(data);
            drawGaugeChart("buyerGmvChart",goal,"",completion,dailyTarget);
         })
    })


}

/*2.交易分析*/
/*2a. 客户转化-买家*/
var renderClientTransferBuyer=function(startDate,endDate){
    var dataArr=[], gapArr=[], minValue;   /*转化率*/
    var legendArr=["买家数量"/*,"登录买家"*/,"竞拍买家","竞得买家"];
    var valueArr=["recycler","quoted","confirm"];
    var query={startDate:startDate, endDate:endDate};

    requestURL(dataService + "/instrumentsPanel/getClientTransferBuyer", query).done(function(result){

        _.each(legendArr,function(v,i,arr){
            dataArr.push({"value":result[valueArr[i]],"name":v});
            if(i){
                gapArr.push(Math.round(result[valueArr[i]]/result[valueArr[i-1]]*100) + "%")
            }
        });
        gapArr.unshift("100%");        //最后一列的转化率默认为100%
        minValue=result[valueArr[valueArr.length-1]];
        drawFunnelChart("clientBuyerChart", "",dataArr,legendArr,gapArr,minValue);
    })
};
/*2b.物品转化-买家*/
var renderProductTransferBuyer=function(startDate, endDate){
    var dataArr=[], gapArr=[], minValue;   /*转化率*/
    var legendArr=["竞拍数量","竞得数量","支付数量","发货数量","成交数量"];
    var valueArr=["quote","confirm","pay","deliver","success"];
    var query={startDate:startDate, endDate:endDate};

    requestURL(dataService+'/instrumentsPanel/getProductTransferBuyer',query).done(function(result){

        //拼接数据对象，格式：[{value:xxx,name:xxx},...]
        _.each(legendArr,function(v,i,arr){
            dataArr.push({"value":result[valueArr[i]],"name":v});
            if(i){
                gapArr.push(Math.round(result[valueArr[i]]/result[valueArr[i-1]]*100) + "%")
            }
        });
        gapArr.unshift("100%");        //最后一列的转化率默认为100%
        minValue=result[valueArr[valueArr.length-1]];
        drawFunnelChart("productBuyerChart", "",dataArr,legendArr,gapArr,minValue);
    })
};
/*2c 客户分布*/
var renderBidPrice=function(startDate,endDate){
    /*c.客户分布-竞得金额*/
     var query={startDate:startDate, endDate:endDate};
     var intervalDays=getSomeDays(startDate, endDate)+1;
     var lastDatePeriod=getLastDatePeriod(startDate,endDate);      //上个周期的开始时间和结束时间
     var query1={startDate:lastDatePeriod[0], endDate:lastDatePeriod[1]};

     requestURL(dataService + "/instrumentsPanel/getBidBuyerCnt",{"startDate":startDate, "endDate":endDate}).done(function(curWkQuotedCnt){

        requestURL(dataService + "/instrumentsPanel/getBidBuyerCnt",{"startDate":lastDatePeriod[0], "endDate":lastDatePeriod[1]}).done(function(lastWkQuotedCnt){

             requestURL(dataService+"/instrumentsPanel/getBidPrice",query).done(function(curWkData){

                    requestURL(dataService+'/instrumentsPanel/getBidPrice',query1).done(function(lastWkData){
                        var bidBuyerCnt=curWkQuotedCnt['quoted'];
                        var bidBuyerLastWkCnt=lastWkQuotedCnt["quoted"];
                        //&lt; 代表小于号
                        var criteriaArr=["0&lt;p&lt;=" + (1000*intervalDays).toLocaleString(),(1000*intervalDays).toLocaleString() + "&lt;p&lt;=" + (10000*intervalDays).toLocaleString() ,(10000*intervalDays).toLocaleString() + "&lt;p&lt;=" + (100000*intervalDays).toLocaleString() ,(100000*intervalDays).toLocaleString() + "&lt;p&lt;=" + (200000*intervalDays).toLocaleString() ,(200000*intervalDays).toLocaleString() + "&lt;p&lt;=" + (300000*intervalDays).toLocaleString() ,"p>" + (300000*intervalDays).toLocaleString() ];
                        var clientCountArr=curWkData["cnt"];
                        var priceRatioArr=curWkData["ratio"];
                        var lastClientCountArr=lastWkData['cnt'];
                        var lastPriceRatioArr=lastWkData['ratio'];


                        //获取数量值得最大位数,用来调整数字长度格式
                        var maxCountLength=_.max(clientCountArr).toString().length;
                        var maxPriceLength=_.max(priceRatioArr).toString().length;
                        var dataList=[];
                        _.each(criteriaArr,function(v,i,arr){
                            var countTrend=getTrend(lastClientCountArr[i],clientCountArr[i]);
                            var cRatioTrend=getTrend(lastClientCountArr[i]/bidBuyerLastWkCnt,clientCountArr[i]/bidBuyerCnt);
                            var pRatioTrend=getTrend(lastPriceRatioArr[i],priceRatioArr[i]);
                            var splitChar=",";      //用于数值和趋势的拼接分割
                            var clientRatio=(Math.round(clientCountArr[i]/bidBuyerCnt*100) + "%");

                            priceRatioArr[i]=priceRatioArr[i] + "%";
                            dataList.push({"criteria": v,"count":formattedNumber(clientCountArr[i],maxCountLength) + splitChar + countTrend,"cRatio":formattedNumber(clientRatio,3)+splitChar+cRatioTrend , "pRatio":formattedNumber(priceRatioArr[i],maxPriceLength+1)+ splitChar + pRatioTrend});
                        });

                            drawDataTable("bidPriceTable", dataList,[
                                {
                                    field:'criteria',
                                    title:'物品金额分布',
                                    width:"35%"
                                    /*sortable:true*/
                                },
                                {
                                    field:'count',
                                    title:'客户数',
                                    width:"25%",
                                    formatter: operateFormatter
                                },
                                {
                                    field:'cRatio',
                                    title:'客户占比',
                                    width:"25%",
                                    formatter: operateFormatter
                                    /*                sortable:true*/
                                },
                                {
                                    field:'pRatio',
                                    title:'金额占比',
                                    width:"25%",
                                    formatter: operateFormatter //自定义方法，添加操作按钮
                                    //events:operateEvents
                                }

                            ],'bidCountTable');
                    })
             })

        })

    })

};
var renderBidCount=function(startDate,endDate){
    /*c.客户分布-竞得量*/
     var intervalDays=getSomeDays(startDate, endDate)+1;
     var bidBuyerCnt, bidBuyerLastWkCnt;        //本周和上周竞拍买家数量
     var lastDatePeriod=getLastDatePeriod(startDate,endDate);
    /*获取上周竞拍买家数量*/

    //todo 传4 date para？

    requestURL(dataService + '/instrumentsPanel/getBidCount',{"startDate":startDate, "endDate":endDate}).done(function(curWkData){

        requestURL(dataService+ '/instrumentsPanel/getBidCount',{"startDate":lastDatePeriod[0], "endDate":lastDatePeriod[1]}).done(function(lastWkData){

            requestURL(dataService + "/instrumentsPanel/getBidBuyerCnt",{"startDate":startDate, "endDate":endDate}).done(function(curWkQuotedCnt){

                requestURL(dataService + "/instrumentsPanel/getBidBuyerCnt",{"startDate":lastDatePeriod[0], "endDate":lastDatePeriod[1]}).done(function(lastWkQuotedCnt){

                    bidBuyerCnt=curWkQuotedCnt['quoted'];
                    bidBuyerLastWkCnt=lastWkQuotedCnt["quoted"];

                    //&lt; 代表小于号
                    var criteriaArr=["0&lt;v&lt;=" + (5*intervalDays) ,(5*intervalDays) + "&lt;v&lt;=" + (30*intervalDays),(30*intervalDays) + "&lt;v&lt;=" + (100*intervalDays) ,(100*intervalDays) + "&lt;v&lt;=" + (200*intervalDays) ,(200*intervalDays) + "&lt;v&lt;=" + (500*intervalDays),"v>" + (500*intervalDays)]
                    var clientCountArr=curWkData["cnt"];
                    var productRatioArr=curWkData["ratio"];
                    var lastClientCountArr=lastWkData['cnt'];
                    var lastProductRatioArr=lastWkData['ratio'];

                    //获取数量值得最大位数,用来调整数字长度格式
                    var maxCountLength=_.max(clientCountArr).toString().length;
                    var maxProductLength=_.max(productRatioArr).toString().length;
                    var dataList=[];

                    _.each(criteriaArr,function(v,i,arr){
                        //获取本周和上周的趋势
                        var countTrend=getTrend(lastClientCountArr[i],clientCountArr[i]);
                        var cRatioTrend=getTrend(lastClientCountArr[i]/bidBuyerLastWkCnt,clientCountArr[i]/bidBuyerCnt);
                        var splitChar=",";        //用于数值和趋势的拼接分割
                        var pRatioTrend=getTrend(lastProductRatioArr[i],productRatioArr[i]);
                        var clientRatio=(Math.round(clientCountArr[i]/bidBuyerCnt*100) + "%");

                        productRatioArr[i]=productRatioArr[i] + "%";

                        //todo 后台拼？
                        dataList.push({"criteria": v,"count":formattedNumber(clientCountArr[i],maxCountLength) + splitChar + countTrend,"cRatio":formattedNumber(clientRatio,3) +splitChar+cRatioTrend , "pRatio":formattedNumber(productRatioArr[i],maxProductLength+1) + splitChar + pRatioTrend})
                    });

                    drawDataTable("bidCountTable", dataList,[
                        {
                            field:'criteria',
                            title:'物品数量分布',
                            width:"35%"
                            /*sortable:true*/
                        },
                        {
                            field:'count',
                            title:'客户数',
                            width:"25%",
                            formatter: operateFormatter
                        },
                        {
                            field:'cRatio',
                            title:'客户占比',
                            width:"25%",
                            formatter: operateFormatter
                            /*                sortable:true*/
                        },
                        {
                            field:'pRatio',
                            title:'物品占比',
                            width:"25%",
                            formatter: operateFormatter //自定义方法，添加操作按钮
                            //events:operateEvents
                        }

                    ],"bidPriceTable");

                })
            })

        })

    })
    /*c.客户分布-竞得金额*/
};

/*2d 退货分析*/
var renderReturn=function(startDate, endDate){
    var dateQuery=getLastDatePeriod(startDate,endDate);
    /*买家退货*/
    requestURL(dataService + '/instrumentsPanel/getReturnBuyer',{"startDate": startDate,"endDate": endDate}).done(function(result){
        $('#returnCntBuyer').html(result["cnt"]);
        $('#returnAmtBuyer').html(result["amount"].toLocaleString());
        $('#denyReturnRate').html(Math.round(result["deny_cnt"]/(result["cnt"]+result["deny_cnt"])*100)+"%")
    });

    /*买家退货原因pie chart*/
     requestURL(dataService+'/instrumentsPanel/getReturnReasonBuyer',{"startDate": startDate,"endDate": endDate}).done(function(curData){

        requestURL(dataService+'/instrumentsPanel/getReturnReasonBuyer',{"startDate": dateQuery[0],"endDate":dateQuery[1]}).done(function(lastData){
            console.log(curData);
            console.log(lastData);
            var legendArr=_.keys(curData);
            var dataArr=[], trend;
            _.each(curData,function(v,k){
                trend= lastData[k]? getTrend(lastData[k],curData[k]) : "up";//判断上个周期是否有这个退货原因
               // console.log(trend)
                dataArr.push({"value": v,"name": k,"trend":trend })
            });
            var sum=_.reduce(dataArr,function(memo,v){return v.value+memo},0);
            //var filterDataArr=_.filter(dataArr,function(v){return (v.value/sum) >0.01})     //过滤比例小于1%的值
            var sortedDataArr=_.sortBy(dataArr,function(v,k){return -v.value});
            //console.log(filterDataArr)
            console.log(sortedDataArr);
            drawPieChart("returnReasonPieChart","",sortedDataArr,legendArr)


        })


     })
};

/*2e 供需比*/
var renderSupplyDemand=function(startDate,endDate){
    console.log(startDate);
    var internalDays=getSomeDays(startDate,endDate)+1;       //时间差
    requestURL(dataService+'/instrumentsPanel/getSupplyDemandData',{'startDate':startDate, 'endDate':endDate}).done(function(result){

        var lastPeriod=getLastDatePeriod(startDate,endDate);     //上个周期的时间段
        var supply=_.reduce(result,function(memo,v){return memo+parseInt(v.supply)},0);
        var demand=_.reduce(result,function(memo,v){return memo+parseInt(v.demand)},0);
        var supplyAvg=Math.round(supply/internalDays) ;       //平均卖家上拍
        var demandAvg=parseInt(Math.round(demand/internalDays));         //平均买家竞拍
        var avg=(supplyAvg/demandAvg) ;      //平均供需比
        var dateArr=[];
        var dataArr=[];
        _.each(_.sortBy(result,function(v,k){return v.date}),function(v,k){
            dateArr.push(v.date);
            dataArr.push((v.supply/v.demand).toFixed(2))
        });
        console.log(dateArr);

        drawLineChart("supplyDemandLineChart",["供需比"],"供需比",dataArr,dateArr);
        $('#supplyAvg').html(supplyAvg);//平均卖家
        $('#demandAvg').html(demandAvg);//平均买家
        $('#supplyDemandAvg').html(Math.round(avg*100)/100);

        requestURL(dataService+'/instrumentsPanel/getSupplyDemandData',{"startDate": lastPeriod[0],"endDate":lastPeriod[1]}).done(function(lastResult){
            var lastSupply=_.reduce(lastResult,function(memo,v){return memo+parseInt(v.supply)},0);
            var lastDemand=_.reduce(lastResult,function(memo,v){return memo+parseInt(v.demand)},0);
            var lastSupplyAvg=parseInt(Math.round(lastSupply/internalDays));
            var lastDemandAvg=parseInt(Math.round(lastDemand/internalDays));
            var lastAvg=(lastSupplyAvg/lastDemandAvg);
            var supplyTrend=getTrendHTML(getTrend(lastSupplyAvg,supplyAvg),'supplyIndex');
            var demandTrend=getTrendHTML(getTrend(lastDemandAvg,demandAvg),'demandIndex');
            var avgTrend=getTrendHTML(getTrend(lastAvg,avg),'supplyDemandIndex');

            $('#supplyTrend').html(supplyTrend);
            $('#demandTrend').html(demandTrend);
            $('#supplyDemandTrend').html(avgTrend);
            $('#supplyIndex').html(getChainIndex(lastSupply,supply));
            $('#demandIndex').html(getChainIndex(lastDemand,demand));
            $('#supplyDemandIndex').html(getChainIndex(lastAvg,avg))
        })
    })

};

/**
绘制面积图
@param {string} chartId 图表id
*/
var drawLineChart=function(chartId,legendArr, seriesName, dataArr, dateArr){
     var option = {
            tooltip : {
                trigger: 'axis'
            },
            legend: {
                data:legendArr
            },
            color: [ '#69BFEC'],
            calculable : true,
            xAxis : [
                {
                    type : 'category',
                    boundaryGap : false,
                    data : dateArr
                }
            ],
            yAxis : [
                {
                    type : 'value'
                }
            ],
            series : [
                {
                    name:seriesName,
                    type:'line',
                    stack: '总量',
                    itemStyle: {normal: {areaStyle: {type: 'default'}}},
                    data:dataArr/*[150, 232, 201, 154, 190, 330, 410]*/
                }
            ]
        };

        var passInLineChart = echarts.init(document.getElementById(chartId));
        passInLineChart.setOption(option);
        window.addEventListener('resize',passInLineChart.resize);

};

/**
绘制漏斗图
@param {string} chartId 图表 id
@param {string} titleText 图表标题
@param {Array} dataArr 图表数据源
@param {Array} legendArr 图表图例
@param {Array} gapArr 转化率
*/
var drawFunnelChart=function(chartId,titleText, dataArr,legendArr,gapArr,minValue){
    var option = {
        title: {
            text: titleText,
            subtext: ''
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c}"
        },
        legend: {
            data: legendArr
        },
        calculable: true,
        color: ['#3C8DBC','#B1D1E4'],
        series: [
            {
                name:'漏斗图',
                type:'funnel',
                left: '20%',
                top: 60,
                //x2: 80,
                bottom: 60,
                width: '60%',
                min: minValue,
                minSize: '20%',
                maxSize: "100%",
                sort: 'none',
                gap: 2,
                label: {
                    normal: {
                        show: true,
                        position: 'center',
                        formatter: function(data){
                            return data.value
                        },
                        rich: {
                            a: {
                                color: '#999',
                                lineHeight: 18,
                                align: 'center'
                            },
                            hr: {
                                borderColor: '#aaa',
                                width: '100%',
                                borderWidth: 0.5,
                                height: 0
                            },
                            b: {
                                color: '#000',
                                fontSize: 12,
                                lineHeight: 33
                            },
                            per: {
                                color: '#000',
                                padding: [2, 4],
                                borderRadius: 2
                            }
                        }
                    },
                    emphasis: {
                        textStyle: {
                            fontSize: 12
                        }
                    }
                },
                labelLine: {
                    normal: {
                        length: 10,
                        lineStyle: {
                            width: 1,
                            type: 'solid'
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        borderColor: '#fff',
                        borderWidth: 1
                    }
                },
                data: dataArr
            },
            {
                name:'漏斗图',
                type:'funnel',
                left: '20%',
                top: 60,
                //x2: 80,
                bottom: 60,
                width: '60%',
                min: minValue,
                minSize: "20%",
                maxSize: "100%",
                sort: 'none',       //不排序，按照给定数据的顺序
                gap: 2,
                label: {
                    normal: {
                        show: true,
                        position: 'left',
                        formatter: function(data){
                            return '{per|转化率：' + gapArr[data.dataIndex] + '}';
                        },
                        rich: {
                            per: {
                                color: '#000',
                                backgroundColor: '#fff',
                                padding: [2, 4],
                                borderRadius: 2
                            }
                        }
                    },
                    emphasis: {
                        textStyle: {
                            fontSize: 12
                        }
                    }
                },
                labelLine: {
                    normal: {
                        length: 10,
                        lineStyle: {
                            width: 1,
                            type: 'solid'
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        borderColor: '#fff',
                        borderWidth: 1
                    }
                },
                data: dataArr
            },
            {
                name:'漏斗图',
                type:'funnel',
                left: '20%',
                top: 60,
                bottom: 60,
                width: '60%',
                min: minValue,
                minSize: "20%",
                maxSize: "100%",
                sort: 'none',
                gap: 2,
                label: {
                    normal: {
                        show: true,
                        position: 'right',
                        formatter: function(data){
                            return '{b|' + data.name + '}'
                        },
                        rich: {
                            b: {
                                color: '#000',
                                fontSize: 12,
                                lineHeight: 33
                            }
                        }
                    },
                    emphasis: {
                        textStyle: {
                            fontSize: 12
                        }
                    }
                },
                labelLine: {
                    normal: {
                        length: 10,
                        lineStyle: {
                            width: 1,
                            type: 'solid'
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        borderColor: '#fff',
                        borderWidth: 1
                    }
                },
                data: dataArr
            }
        ]
    };

    var myChart=echarts.init(document.getElementById(chartId));
    myChart.setOption(option);
    window.addEventListener('resize',myChart.resize)
};

/**
绘制仪表盘
@param {string} chartId 图表id
@param {number} maxValue 总目标
@param {string} unit 最大值单位，没有可为''
@param {number} curValue 当前值
@param {number} target 当天目标值，当月天数/当月总天数*总目标
*/
var drawGaugeChart = function(chartId,maxValue,unit,curValue,target){
    var option={
        tooltip : {
            formatter:function(data){
                return "业务指标<br>完成度: " + Math.round(data.value/maxValue * 100) + '%'
            }
        },
        series: [
            {
                name: '业务指标',
                type: 'gauge',
                min:0,
                max:maxValue,
                splitLine:{
                    show: false
                },
                axisLine:{
                    show:false,
                    lineStyle:{
                        width:20,    //圆弧的宽度
                        color: [[target, '#3c8dbc'], [1, '#D2D6DE']]        //圆弧的颜色
                    }
                },
                axisTick:{
                    show: false         //坐标小刻度
                },
                axisLabel:{
                    distance: -55,      //label和仪表盘的距离
                    formatter:function(value){
                        switch(value+ ''){      //在仪表盘只显示最大最小值
                            case '0': return value;
                            case maxValue:
                                return value + unit;
                            default:
                                return "";

                        }
                    },
                    color: '#3c8dbc'           //标记颜色

                },
                itemStyle:{
                   normal:{
                        color:'#F38000'         //指针颜色
                   }
                },
                splitNumber:10,
                detail: {
                    fontWeight: 'bolder',
                    borderRadius: 3,
                    backgroundColor: '#444',
                    borderColor: '#aaa',
                    shadowBlur: 5,
                    shadowColor: '#333',
                    shadowOffsetX: 0,
                    shadowOffsetY: 3,
                    borderWidth: 2,
                    textBorderColor: '#000',
                    textBorderWidth: 2,
                    textShadowBlur: 2,
                    textShadowColor: '#fff',
                    textShadowOffsetX: 0,
                    textShadowOffsetY: 0,
                    fontFamily: 'Arial',
                    width: 100,
                    color: '#eee',
                    fontSize:15,    //修改value字体
                    formatter:function(value){
                        return Math.round(value/maxValue * 100) + '%'
                    }
                },
                data: [{value: curValue, name: '完成率'}]
            }
        ]
    };
    var myChart=echarts.init(document.getElementById(chartId));
    myChart.setOption(option);
    window.addEventListener('resize',myChart.resize)

};

/**
绘制仪表盘
@param {string} chartId 图表id
@param {string} titleText 图表标题
@param {Array} dataArr 图表数据源
@param {Array} legendArr 图标图例
*/
var drawPieChart=function(chartId,titleText, dataArr, legendArr){
    var option = {
        title : {
            text: titleText,
            subtext: '',
            x:'center'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'horizontal',       /*legend的水平排序*/
            bottom: '0%',              /*legend距离底部的距离*/
            formatter:function(name){
                var total=0, target,trend;
                _.each(dataArr,function(value, i){
                    total+=dataArr[i].value;
                    if(dataArr[i].name==name){
                        target=dataArr[i].value;
                        trend=dataArr[i].trend
                    }
                });
                var resultStr=name + ' | ' + ((target/total)*100).toFixed(2)+'%' + " ";
                if(trend=='up'){
                    resultStr+='{g| ↑}'
                }else if(trend=='dw'){
                    resultStr+='{r| ↓}'
                }else if(trend=='eq'){
                    resultStr+='{y| ━}'
                }
                resultStr+=  '￥ ' + target;
                return resultStr
            },
            data: legendArr,
            textStyle:{
                rich:{
                    r:{
                        color:'red'
                    },
                    y:{
                        color:'orange'
                    },
                    g:{
                        color:'green'
                    }
                }
            }
        },
        color: ['#3C8DBC', '#00C0EF', '#F39C12', '#37B97D', '#F67360','#B5BBC8'],
        series : [
            {
                name: '访问来源',
                type: 'pie',
                radius : ['30%', '45%'],//圆环宽,
                center: ['50%', '40%'], /*水平，垂直的位置*/
                data:dataArr,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };

    var myChart=echarts.init(document.getElementById(chartId));
    myChart.setOption(option);
    window.addEventListener('resize',myChart.resize)
};


/**
绘制表格
@param {string} chartId 图表id
@param {Array} dataList 图表数据源
@param {Array} columns 表格标题
@param {string} destroyTableId 被销毁
*/
var drawDataTable=function(chartId,dataList,columns, destroyTableId){
    //为了防止多个table叠加，事先销毁
    $("#" + destroyTableId).bootstrapTable('destroy');
    $("#" + chartId).bootstrapTable('destroy').bootstrapTable({
        data: dataList,
        columns:columns
    });
};

/*根据趋势生成环比箭头*/
var getTrendHTML=function(trend, spanId){
    switch(trend){
        case 'up':
            return "<span class='description-percentage text-green add-weight'><i class='fa fa-caret-up'></i><span id=" + spanId + "></span></span>"
        case 'dw':
            return "<span class='description-percentage text-red add-weight'><i class='fa fa-caret-down'></i><span id=" + spanId + "></span></span>"
        case 'eq':
            return "<span class='description-percentage text-yellow add-weight'><i class='fa fa-caret-left'></i><span id=" + spanId + "></span></span>"
    }
};

/*环比*/
var getChainIndex=function(prev, cur){
    return Math.abs(Math.round((cur-prev)/prev*100)) + "%";
};

/*获取上个周期的起始时间和结束时间*/
function getLastDatePeriod(startDate, endDate){
    var intervalDays=getSomeDays(startDate, endDate)+1;
    return [new Date(startDate).getNewDate(-intervalDays),new Date(endDate).getNewDate(-intervalDays)];
}

/*用于datatable， 生成趋势箭头*/
function operateFormatter(value, row, index){
    var arr=value.split(",");
    return arr[0] + arrowStyle(arr[1]);
}

/*用于datatable， 生成趋势箭头*/
function arrowStyle(category){
    switch (category){
        case "up":
            return '<span class="text-green" style="margin-left:10px"><i class="fa fa-long-arrow-up"></i></span>';
        case "dw":
            return '<span class="text-red" style="margin-left:10px"><i class="fa fa-long-arrow-down"></i></span>';
        case "eq":
            return '<span class="text-yellow" style="margin-left:10px">━</span>';
        default:
            return ""
    }
}

//将数字格式化，填补数字和趋势之间的空格
var formattedNumber=function(curValue, maxLength){
    var curLength=curValue.toString().length;
    var updateValue=curValue;
    if(curLength<maxLength){
        if(maxLength-curLength===2){
            updateValue += "&nbsp;&nbsp;&nbsp;&nbsp;"
        }
        else{
            for(var i=0;i<=maxLength-curLength;i++){
                updateValue += "&nbsp;"
            }
        }
    }
    return updateValue;
};

/*比较值大小获取趋势*/
var getTrend = function(preValue, curValue){
    if(curValue>preValue){
        return 'up'
    }else if(curValue==preValue){
        return 'eq'
    }else{
        return 'dw'
    }
};

/***********************************************@Author:LuJia.Chen-End*************************************************/

/***********************************************@Author:YuLe.Zhang-Start***********************************************/


//渲染物品流转分析(物品流转流程图，库存分析（面积图，环形图），流拍分析，卖家确认情况分析)
var drawGoodFlowAnalysis = function(){
    var query = {serviceLineId: "1",categoryId:"1",brandId:"1",modelId:"1",startTime:"2018-07-25",endTime:"2018-08-01"};
    //获取物品流转分析-物品流转流程图数据
    requestURL(dataService+"/instrumentsPanel/getForceChartData", query).done(function (data) {
        console.log(data);
        if(instrumentsPanel.imPhone()){
            //初始化渲染流程图
            drawForceChart(data);
        }else{
            drawPhoneForceChart();
        }
    });

    //获取物品流转分析-库存分析（面积图，环形图）
    requestURL(dataService+"/instrumentsPanel/getStockAnalysisChartData", query).done(function (ret) {
        console.log(ret);
        var data = [
            {
                value: 400,
                name: 't<1'
            },
            {
                value: 1000,
                name: '1<t<=2'
            },
            {
                value: 1544,
                name: '2<t<=3'
            },
            {
                value: 1544,
                name: '4<t<=5'
            },
            {
                value: 1544,
                name: '5<t<=6'
            },
            {
                value: 4544,
                name: 't>6'
            }
        ];
        //渲染库存分析(包含库存分析线图和库龄分布环形图)
        drawStockAnalysisChart(data);
    });
};

//渲染流程图
var drawForceChart = function(data){
    console.log('开始执行流程图');
    var forceOption = {
        tooltip: {},
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
                        position: 'bottom',
                        offset: [0,-60],//居上 20
                        textStyle: {
                            fontSize: 15
                        },
                        formatter:'{c}'
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
                        name: '卖家发货',
                        x: 100,
                        y: 300,
                        value:data['卖家发货'],
                        //symbol:'rect', //让节点为矩形显示
                        symbolSize: 10,//节点的长和宽
                        itemStyle: {
                            normal: {
                                color: '#ee5255'
                            }
                        }
                    }, {
                        name: '平台收货',
                        x: 200,
                        y: 300,
                        //symbol:'rect',
                        symbolSize: 10,
                        value:data['平台收货'],
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    }, {
                        name: '平台验货',
                        x: 300,
                        y: 300,
                        value:data['平台验货'],
                        //symbol:'rect',
                        symbolSize: [10, 10],
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    }, {
                        name: '平台入库',
                        x: 400,
                        y: 300,
                        //symbol:'rect',
                        symbolSize: [10, 10],
                        value:data['平台入库'],
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    }, {
                        name: '竞拍成功',
                        x: 500,
                        y: 300,
                        value:data['竞拍成功'],
                        //symbol:'rect',
                        symbolSize: [10, 10],
                        itemStyle: {
                            normal: {
                                color: '#ee5255'
                            }
                        }
                    },
                    {
                        name: '平台发货',
                        x: 600,
                        y: 300,
                        value:data['平台发货'],
                        //symbol:'rect',
                        symbolSize: [10, 10],
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    },
                    {
                        name: '买家收货',
                        x: 700,
                        y: 300,
                        value:data['买家收货'],
                        //symbol:'rect',
                        symbolSize: [10, 10],
                        itemStyle: {
                            normal: {
                                color: '#ee5255'
                            }
                        }
                    },
                    {
                        name: '买家退货',
                        x: 800,
                        y: 300,
                        value:data['买家退货'],
                        //symbol:'rect',
                        symbolSize: 10,
                        itemStyle: {
                            normal: {
                                color: '#ee5255'
                            }
                        }
                    },
                    {
                        name: '退货审核',
                        x: 900,
                        y: 300,
                        value:data['退货审核'],
                        //symbol:'rect',
                        symbolSize: 10,
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    },
                    {
                        name: '卖家退货',
                        x: 500,
                        y: 400,
                        value:data['卖家退货'],
                        //symbol:'rect',
                        symbolSize: [10, 10],
                        itemStyle: {
                            normal: {
                                color: '#ee5255'
                            }
                        }
                    }
                ],
                // links: [],
                links: [
                    {
                        source: '卖家发货',
                        target: '平台收货'
                    },
                    {
                        source: '平台收货',
                        target: '平台验货'
                    },
                    {
                        source: '平台验货',
                        target: '平台入库'
                    },
                    {
                        source: '平台验货',
                        target: '卖家退货'
                    },
                    {
                        source: '平台入库',
                        target: '竞拍成功'
                    },
                    {
                        source: '竞拍成功',
                        target: '平台发货'
                    },
                    {
                        source: '平台发货',
                        target: '买家收货'
                    },
                    {
                        source: '买家收货',
                        target: '买家退货'
                    },
                    {
                        source: '买家退货',
                        target: '退货审核'
                    },
                    {
                        source: '平台入库',
                        target: '卖家退货'
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
            },
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
                        show: true
                    }
                },
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'bottom',//居下
                            offset:[0,20],//居下 20
                            formatter: function(para){//格式化提示文本
                                return para.name;
                            },
                            fontSize:15
                        }
                    }
                },
                //edgeSymbol: ['circle', 'arrow'],
                edgeSymbol: ['none', 'none'],
                edgeSymbolSize: [4, 10],
                edgeLabel: {
                    normal: {
                        show:false,
                        textStyle: {
                            fontSize: 12
                        }
                    }
                },
                data: [
                    {
                        name: '卖家发货',
                        x: 100,
                        y: 300,
                        value:data['卖家发货'],
                        //symbol:'rect', //让节点为矩形显示
                        symbolSize: 10,//节点的长和宽
                        itemStyle: {
                            normal: {
                                color: '#ee5255'
                            }
                        }
                    }, {
                        name: '平台收货',
                        x: 200,
                        y: 300,
                        //symbol:'rect',
                        symbolSize: 10,
                        value:'1000台/30h',
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    }, {
                        name: '平台验货',
                        x: 300,
                        y: 300,
                        value:'1000台/30h',
                        //symbol:'rect',
                        symbolSize: [10, 10],
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    }, {
                        name: '平台入库',
                        x: 400,
                        y: 300,
                        //symbol:'rect',
                        symbolSize: [10, 10],
                        value:'1000台/30h',
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    }, {
                        name: '竞拍成功',
                        x: 500,
                        y: 300,
                        value:'1000台/30h',
                        //symbol:'rect',
                        symbolSize: [10, 10],
                        itemStyle: {
                            normal: {
                                color: '#ee5255'
                            }
                        }
                    },
                    {
                        name: '平台发货',
                        x: 600,
                        y: 300,
                        value:'10000 台/33 h',
                        //symbol:'rect',
                        symbolSize: [10, 10],
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    },
                    {
                        name: '买家收货',
                        x: 700,
                        y: 300,
                        value:'1000台/30h',
                        //symbol:'rect',
                        symbolSize: [10, 10],
                        itemStyle: {
                            normal: {
                                color: '#ee5255'
                            }
                        }
                    },
                    {
                        name: '买家退货',
                        x: 800,
                        y: 300,
                        value:'1000台/30h',
                        //symbol:'rect',
                        symbolSize: 10,
                        itemStyle: {
                            normal: {
                                color: '#ee5255'
                            }
                        }
                    },
                    {
                        name: '退货审核',
                        x: 900,
                        y: 300,
                        value:'1000台/30h',
                        //symbol:'rect',
                        symbolSize: 10,
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    },
                    {
                        name: '卖家退货',
                        x: 500,
                        y: 400,
                        value:'1000台/30h',
                        //symbol:'rect',
                        symbolSize: [10, 10],
                        itemStyle: {
                            normal: {
                                color: '#ee5255'
                            }
                        }
                    }
                ],
                // links: [],
                links: [
                    {
                        source: '卖家发货',
                        target: '平台收货'
                    },
                    {
                        source: '平台收货',
                        target: '平台验货'
                    },
                    {
                        source: '平台验货',
                        target: '平台入库'
                    },
                    {
                        source: '平台验货',
                        target: '卖家退货'
                    },
                    {
                        source: '平台入库',
                        target: '竞拍成功'
                    },
                    {
                        source: '竞拍成功',
                        target: '平台发货'
                    },
                    {
                        source: '平台发货',
                        target: '买家收货'
                    },
                    {
                        source: '买家收货',
                        target: '买家退货'
                    },
                    {
                        source: '买家退货',
                        target: '退货审核'
                    },
                    {
                        source: '平台入库',
                        target: '卖家退货'
                    }
                ],
                lineStyle: {
                    normal: {
                        opacity: 0.9,
                        type: 'dashed',
                        width: 1
                    }
                }
            }
        ]
    };

    var forceChart = echarts.init(document.getElementById('forceChart'));
    forceChart.setOption(forceOption);
    window.addEventListener('resize',forceChart.resize);
};
//渲染手机流程图
var drawPhoneForceChart = function(){
    console.log('开始执行手机流程图');
    var forceOption = {
        tooltip: {},
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
                        position: 'bottom',
                        offset: [0,20],//居右 20
                        textStyle: {
                            fontSize: '18rem'
                        },
                        formatter:function(para){
                            if(para.name=='卖家退货'){
                                return para.value;
                            }else{
                                return '';
                            }
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'bottom',//居下
                            offset:[0,20],//居下 20
                            formatter: function(para){//格式化提示文本
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
                            fontSize: 12
                        }
                    }
                },
                data: [
                    {
                        name: '卖家发货',
                        x: 600,
                        y: 100,
                        value:'1000台/30h',
                        //symbol:'rect', //让节点为矩形显示
                        symbolSize: 10,//节点的长和宽
                        itemStyle: {
                            normal: {
                                color: '#ee5255'
                            }
                        }
                    }, {
                        name: '平台收货',
                        x: 600,
                        y: 200,
                        //symbol:'rect',
                        symbolSize: 10,
                        value:'1000台/30h',
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    }, {
                        name: '平台验货',
                        x: 600,
                        y: 300,
                        value:'1000台/30h',
                        //symbol:'rect',
                        symbolSize: [10, 10],
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    }, {
                        name: '平台入库',
                        x: 600,
                        y: 400,
                        //symbol:'rect',
                        symbolSize: [10, 10],
                        value:'1000台/30h',
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    }, {
                        name: '竞拍成功',
                        x: 600,
                        y: 500,
                        value:'1000台/30h',
                        //symbol:'rect',
                        symbolSize: [10, 10],
                        itemStyle: {
                            normal: {
                                color: '#ee5255'
                            }
                        }
                    },
                    {
                        name: '平台发货',
                        x: 600,
                        y: 600,
                        value:'10000 台/33 h',
                        //symbol:'rect',
                        symbolSize: [10, 10],
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    },
                    {
                        name: '买家收货',
                        x: 600,
                        y: 700,
                        value:'1000台/30h',
                        //symbol:'rect',
                        symbolSize: [10, 10],
                        itemStyle: {
                            normal: {
                                color: '#ee5255'
                            }
                        }
                    },
                    {
                        name: '买家退货',
                        x: 600,
                        y: 800,
                        value:'1000台/30h',
                        //symbol:'rect',
                        symbolSize: 10,
                        itemStyle: {
                            normal: {
                                color: '#ee5255'
                            }
                        }
                    },
                    {
                        name: '退货审核',
                        x: 600,
                        y: 900,
                        value:'1000台/30h',
                        //symbol:'rect',
                        symbolSize: 10,
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    },
                    {
                        name: '卖家退货',
                        x: 300,
                        y: 500,
                        value:'1000台/30h',
                        //symbol:'rect',
                        symbolSize: [10, 10],
                        itemStyle: {
                            normal: {
                                color: '#ee5255'
                            }
                        }
                    }
                ],
                // links: [],
                links: [
                    {
                        source: '卖家发货',
                        target: '平台收货'
                    },
                    {
                        source: '平台收货',
                        target: '平台验货'
                    },
                    {
                        source: '平台验货',
                        target: '平台入库'
                    },
                    {
                        source: '平台验货',
                        target: '卖家退货'
                    },
                    {
                        source: '平台入库',
                        target: '竞拍成功'
                    },
                    {
                        source: '竞拍成功',
                        target: '平台发货'
                    },
                    {
                        source: '平台发货',
                        target: '买家收货'
                    },
                    {
                        source: '买家收货',
                        target: '买家退货'
                    },
                    {
                        source: '买家退货',
                        target: '退货审核'
                    },
                    {
                        source: '平台入库',
                        target: '卖家退货'
                    }
                ],
                lineStyle: {
                    normal: {
                        opacity: 0.9,
                        type: 'dashed',
                        width: 1
                    }
                }
            },
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
                        position: 'right',
                        offset: [20,0],//居右 20
                        textStyle: {
                            fontSize: '18rem'
                        },
                        formatter:function(para){
                            if(para.name=='卖家退货'){
                                return '';
                            }else{
                                return para.value;
                            }
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'bottom',//居下
                            offset:[0,20],//居下 20
                            formatter: function(para){//格式化提示文本
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
                            fontSize: 12
                        }
                    }
                },
                data: [
                    {
                        name: '卖家发货',
                        x: 600,
                        y: 100,
                        value:'1000台/30h',
                        //symbol:'rect', //让节点为矩形显示
                        symbolSize: 10,//节点的长和宽
                        itemStyle: {
                            normal: {
                                color: '#ee5255'
                            }
                        }
                    }, {
                        name: '平台收货',
                        x: 600,
                        y: 200,
                        //symbol:'rect',
                        symbolSize: 10,
                        value:'1000台/30h',
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    }, {
                        name: '平台验货',
                        x: 600,
                        y: 300,
                        value:'1000台/30h',
                        //symbol:'rect',
                        symbolSize: [10, 10],
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    }, {
                        name: '平台入库',
                        x: 600,
                        y: 400,
                        //symbol:'rect',
                        symbolSize: [10, 10],
                        value:'1000台/30h',
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    }, {
                        name: '竞拍成功',
                        x: 600,
                        y: 500,
                        value:'1000台/30h',
                        //symbol:'rect',
                        symbolSize: [10, 10],
                        itemStyle: {
                            normal: {
                                color: '#ee5255'
                            }
                        }
                    },
                    {
                        name: '平台发货',
                        x: 600,
                        y: 600,
                        value:'10000 台/33 h',
                        //symbol:'rect',
                        symbolSize: [10, 10],
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    },
                    {
                        name: '买家收货',
                        x: 600,
                        y: 700,
                        value:'1000台/30h',
                        //symbol:'rect',
                        symbolSize: [10, 10],
                        itemStyle: {
                            normal: {
                                color: '#ee5255'
                            }
                        }
                    },
                    {
                        name: '买家退货',
                        x: 600,
                        y: 800,
                        value:'1000台/30h',
                        //symbol:'rect',
                        symbolSize: 10,
                        itemStyle: {
                            normal: {
                                color: '#ee5255'
                            }
                        }
                    },
                    {
                        name: '退货审核',
                        x: 600,
                        y: 900,
                        value:'1000台/30h',
                        //symbol:'rect',
                        symbolSize: 10,
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    },
                    {
                        name: '卖家退货',
                        x: 300,
                        y: 500,
                        value:'1000台/30h',
                        //symbol:'rect',
                        symbolSize: [10, 10],
                        itemStyle: {
                            normal: {
                                color: '#ee5255'
                            }
                        }
                    }
                ],
                // links: [],
                links: [
                    {
                        source: '卖家发货',
                        target: '平台收货'
                    },
                    {
                        source: '平台收货',
                        target: '平台验货'
                    },
                    {
                        source: '平台验货',
                        target: '平台入库'
                    },
                    {
                        source: '平台验货',
                        target: '卖家退货'
                    },
                    {
                        source: '平台入库',
                        target: '竞拍成功'
                    },
                    {
                        source: '竞拍成功',
                        target: '平台发货'
                    },
                    {
                        source: '平台发货',
                        target: '买家收货'
                    },
                    {
                        source: '买家收货',
                        target: '买家退货'
                    },
                    {
                        source: '买家退货',
                        target: '退货审核'
                    },
                    {
                        source: '平台入库',
                        target: '卖家退货'
                    }
                ],
                lineStyle: {
                    normal: {
                        opacity: 0.9,
                        type: 'dashed',
                        width: 1
                    }
                }
            },
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
                        show: true
                    }
                },
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            position: 'left',//居下
                            offset:[-20,0],//居下 20
                            formatter: function(para){//格式化提示文本
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
                            fontSize: 12
                        }
                    }
                },
                data: [
                    {
                        name: '卖家发货',
                        x: 600,
                        y: 100,
                        value:'1000台/30h',
                        //symbol:'rect', //让节点为矩形显示
                        symbolSize: 10,//节点的长和宽
                        itemStyle: {
                            normal: {
                                color: '#ee5255'
                            }
                        }
                    }, {
                        name: '平台收货',
                        x: 600,
                        y: 200,
                        //symbol:'rect',
                        symbolSize: 10,
                        value:'1000台/30h',
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    }, {
                        name: '平台验货',
                        x: 600,
                        y: 300,
                        value:'1000台/30h',
                        //symbol:'rect',
                        symbolSize: [10, 10],
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    }, {
                        name: '平台入库',
                        x: 600,
                        y: 400,
                        //symbol:'rect',
                        symbolSize: [10, 10],
                        value:'1000台/30h',
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    }, {
                        name: '竞拍成功',
                        x: 600,
                        y: 500,
                        value:'1000台/30h',
                        //symbol:'rect',
                        symbolSize: [10, 10],
                        itemStyle: {
                            normal: {
                                color: '#ee5255'
                            }
                        }
                    },
                    {
                        name: '平台发货',
                        x: 600,
                        y: 600,
                        value:'10000 台/33 h',
                        //symbol:'rect',
                        symbolSize: [10, 10],
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    },
                    {
                        name: '买家收货',
                        x: 600,
                        y: 700,
                        value:'1000台/30h',
                        //symbol:'rect',
                        symbolSize: [10, 10],
                        itemStyle: {
                            normal: {
                                color: '#ee5255'
                            }
                        }
                    },
                    {
                        name: '买家退货',
                        x: 600,
                        y: 800,
                        value:'1000台/30h',
                        //symbol:'rect',
                        symbolSize: 10,
                        itemStyle: {
                            normal: {
                                color: '#ee5255'
                            }
                        }
                    },
                    {
                        name: '退货审核',
                        x: 600,
                        y: 900,
                        value:'1000台/30h',
                        //symbol:'rect',
                        symbolSize: 10,
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    },
                    {
                        name: '卖家退货',
                        x: 300,
                        y: 500,
                        value:'1000台/30h',
                        //symbol:'rect',
                        symbolSize: [10, 10],
                        itemStyle: {
                            normal: {
                                color: '#ee5255'
                            }
                        }
                    }
                ],
                // links: [],
                links: [
                    {
                        source: '卖家发货',
                        target: '平台收货'
                    },
                    {
                        source: '平台收货',
                        target: '平台验货'
                    },
                    {
                        source: '平台验货',
                        target: '平台入库'
                    },
                    {
                        source: '平台验货',
                        target: '卖家退货'
                    },
                    {
                        source: '平台入库',
                        target: '竞拍成功'
                    },
                    {
                        source: '竞拍成功',
                        target: '平台发货'
                    },
                    {
                        source: '平台发货',
                        target: '买家收货'
                    },
                    {
                        source: '买家收货',
                        target: '买家退货'
                    },
                    {
                        source: '买家退货',
                        target: '退货审核'
                    },
                    {
                        source: '平台入库',
                        target: '卖家退货'
                    }
                ],
                lineStyle: {
                    normal: {
                        opacity: 0.9,
                        type: 'dashed',
                        width: 1
                    }
                }
            }
        ]
    };

    var forceChart = echarts.init(document.getElementById('forceChart'));
    forceChart.setOption(forceOption);
    window.addEventListener('resize',forceChart.resize);
};
//渲染库存分析(包含库存分析线图和库龄分布环形图)
var drawStockAnalysisChart = function(data){
    var option = {
        backgroundColor: '#fff',
        title: {
            text: '库龄分布',
            x: 'center',
            y: 'center',
            textStyle: {
                fontWeight: 'normal',
                fontSize: 16
            }
        },
        tooltip: {
            show: true,
            trigger: 'item',
            formatter: "{a} <br/> {b}: ￥ {c} ({d}%)"
        },
        legend: {
            orient: 'horizontal',
            bottom: '0%',
            //data: ['t<1', '1<t<=2', '2<t<=3', '4<t<=5', '5<t<=6','t>6'],
            data:['t<1', '1<t<=2', '2<t<=3', '4<t<=5', '5<t<=6','t>6'],
            formatter:  function(name){
                var total = 0;
                var target;
                for (var i = 0, l = data.length; i < l; i++) {
                    total += data[i].value;
                    if (data[i].name == name) {
                        target = data[i].value;
                    }
                }
                var arr;
                if(target>1544){
                    arr = [
                        '￥ '+name+ ' {up|↑}',
                    ]
                }else{
                    arr = [
                        '￥ '+name+ ' {down|↓}',
                    ]
                }
                return arr.join('')
            },
            textStyle: {
                fontWeight: 'normal',
                fontSize: 14,
                rich:{
                    up:{
                        color:'#019858',
                        fontWeight: '900',
                        fontSize: 18
                    },
                    down:{
                        color:'#fe0725',
                        fontWeight: '900',
                        fontSize: 18
                    }
                }
            }
        },
        series: [
        {
            name:'库龄分布',
            type: 'pie',
            selectedMode: 'single',
            radius: ['25%', '58%'],
            color: ['#86D560', '#AF89D6', '#59ADF3', '#FF999A', '#FFCC67','#D55C79'],

            label: {
                normal: {
                    position: 'inner',
                    formatter: '{d}%',

                    textStyle: {
                        color: '#fff',
                        fontWeight: 'bold',
                        fontSize: 14
                    }
                }
            },
            labelLine: {
                normal: {
                    show: false
                }
            },
            data: data
        },
        {
            name:'库龄分布',
            type: 'pie',
            radius: ['58%', '83%'],
            itemStyle: {
                normal: {
                    color: '#F2F2F2'
                },
                emphasis: {
                    color: '#ADADAD'
                }
            },
            label: {
                normal:
                {
                    position: 'inner',
                    formatter:function(item){
                        if(item.value>1544){
                            return '￥ '+item.value;//+ ' {up|↑}'
                        }else{
                            return '￥ '+item.value;//+ ' {down|↓}'
                        }
                    },
                    textStyle: {
                        color: '#777777',
                        fontWeight: 'bold',
                        fontSize: 14
                    },
                    rich:{
                        up:{
                            color:'#019858',
                            fontWeight: '900',
                            fontSize: 14
                        },
                        down:{
                            color:'#fe0725',
                            fontWeight: '900',
                            fontSize: 14
                        }
                    }
                }
            },
            data: data
        }]
    };

    var option2 = {
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:['每日库存量']
        },
        color: [ '#69BFEC'],
        calculable : true,
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : ['周一','周二','周三','周四','周五','周六','周日']
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'每日库存量',
                type:'line',
                stack: '总量',
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data:[150, 232, 201, 154, 190, 330, 410]
            }
        ]
    };

    var stockLineChart = echarts.init(document.getElementById('stock-line'));
    stockLineChart.setOption(option2);

    var stockPieChart = echarts.init(document.getElementById('stock-pie'));
    stockPieChart.setOption(option);

    //stockLineChart.connect(stockPieChart);
    //stockPieChart.connect(stockLineChart);

    setTimeout(function (){
        window.addEventListener('resize',stockLineChart.resize);
        window.addEventListener('resize',stockPieChart.resize);
    },200);

    var selectArr = stockPieChart.getOption().legend[0].data;
    console.log(selectArr);
};
//渲染流拍分析图
var drawPassInChart = function(){
    var option = {
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:['首次流拍比例']
        },
        color: [ '#69BFEC'],
        calculable : true,
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : ['周一','周二','周三','周四','周五','周六','周日']
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'首次流拍比例',
                type:'line',
                stack: '总量',
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data:[150, 232, 201, 154, 190, 330, 410]
            }
        ]
    };

    var passInLineChart = echarts.init(document.getElementById('passInChart'));
    passInLineChart.setOption(option);
    window.addEventListener('resize',passInLineChart.resize);

};
//渲染卖家确认情况分析
var drawVendorChart = function(){
    var option = {
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:['每日确认比例']
        },
        color: [ '#69BFEC'],
        calculable : true,
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : ['周一','周二','周三','周四','周五','周六','周日']
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : [
            {
                name:'每日确认比例',
                type:'line',
                stack: '总量',
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data:[150, 232, 201, 154, 190, 330, 410]
            }
        ]
    };

    var vendorChart = echarts.init(document.getElementById('vendorChart'));
    vendorChart.setOption(option);
    window.addEventListener('resize',vendorChart.resize);

};
//渲染垫资分析
var drawFindAnalysisChart = function(){
    var option = {
        /*title : {
            text: '垫资分析'/!*,
            subtext: '纯属虚构'*!/
        },*/
        tooltip : {
            trigger: 'axis'
        },
        legend: {
            data:['总垫资','卖家结算垫资','预付款垫资']
        },
        color: [ '#53B5EA','#FFCC67'],
        calculable : true,
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : ['1/6','1/6','1/6','1/6','1/6','1/6','1/6']
            }
        ],
        yAxis : [
            {
                type : 'value',
                axisLabel : {
                    formatter: '{value} ￥'
                }
            }
        ],
        series : [
            {
                name:'卖家结算垫资',
                type:'line',
                data:[11, 11, 15, 13, 12, 13, 10],
                markPoint : {
                    data : [
                        {type : 'max', name: '最大值'},
                        {type : 'min', name: '最小值'}
                    ]
                },
                markLine : {
                    data : [
                        {type : 'average', name: '平均值'}
                    ]
                }
            },
            {
                name:'预付款垫资',
                type:'line',
                data:[1, -2, 2, 5, 3, 2, 0],
                markPoint : {
                    data : [
                        {name : '周最低', value : -2, xAxis: 1, yAxis: -1.5}
                    ]
                },
                markLine : {
                    data : [
                        {type : 'average', name : '平均值'}
                    ]
                }/*,itemStyle : {
                    normal : {
                        lineStyle:{
                            color:'#53a2cf'
                        }
                    }
                }*/
            }
        ]
    };

    var fundAnalysisChart = echarts.init(document.getElementById('fundAnalysisChart'));
    fundAnalysisChart.setOption(option);
    window.addEventListener('resize',fundAnalysisChart.resize);
};

/***********************************************************************************************************************/
//日期回调函数
function fundDateRangeCallback(start, end, label) {
    console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('#fund-analysis-date-range-btn span').html(sdt + ' - ' + edt);
}
//日期回调函数
function circulationDateRangeCallback(start, end, label) {
    console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('#circulation-analysis-date-range-btn span').html(sdt + ' - ' + edt);
}
//日期回调函数
function tradeDateRangeCallback(start, end, label) {
    console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('#trade-analysis-date-range-btn span').html(sdt + ' - ' + edt);
}
//日期回调函数
function wholeDateRangeCallback(start, end, label) {
    console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('#whole-analysis-date-range-btn span').html(sdt + ' - ' + edt);
}


function linkSelectInit(categoryKey){
    requestURL(dataService+"/foundation/getProductBrandByCategoryKey",{"categoryId":categoryKey}).done(function(result){
        $("#brand").html('');
        /*$("#brand").append('<option value="0" selected>所有</option>');*/
        for(var i=0;i<result.length;i++){
            $("#brand").append('<option value="'+result[i].brandKey+'">'+result[i].brandName+'</option>');
        }
        console.log(result[0].brandKey);
        productInit(result[0].brandKey);
    });
}

function productInit(brandId){
    requestURL(dataService+"/foundation/getProductByBrandId",{"brandId":brandId}).done(function(result){
        $("#model").html('');
        /*$("#model").append('<option value="0" selected>所有</option>');*/
        /*console.log(result);
        for(var k in result){
            console.log(k+"--->"+result[k]);
        }*/
        _.map(result,function(value,key){
            //console.log(key+"--->"+value);
            $("#model").append('<option value="'+key+'">'+value+'</option>');
        })
        /*result._map(ele)
        for(var i=0;i<result.length;i++){
            $("#model").append('<option value="'+result[i].brandKey+'">'+result[i].brandName+'</option>');
        }*/
    });
}

var instrumentsSourcePanel = {
    imPhone:function (){
        var sUserAgent = navigator.userAgent.toLowerCase();
        var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
        var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
        var bIsMidp = sUserAgent.match(/midp/i) == "midp";
        var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
        var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
        var bIsAndroid = sUserAgent.match(/android/i) == "android";
        var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
        var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
        if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
            return false;
        } else {
            return true;
        }
    }
};

/***********************************************@Author:YuLe.Zhang-End*************************************************/