Template.instrumentsPanelAfter.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#pjtrtSideTab').addClass('active');
    $('#instrumentsPanel').addClass('active');
    var ours = Template.currentData().ours;
    switch(ours){
        case 1:
            $("#controller").attr("class","content-wrapper");
            break;
        case 2:
            $("#controller").attr("class","content");
            break;
    }

    var flag = instruments_panel.imPhone(); //PC端
    var scrollWidth = document.body.scrollWidth;

    if(flag){
        if(scrollWidth<=1522){
            forceChartFontStyle.fontSize = 12;
            forceChartFontStyle.sellerReturnPosition = 500;
        }
        if(scrollWidth<=1269){
            forceChartFontStyle.fontSize = 10;
        }
    }
    //进行页面准备
    //整体分析   --  仪表盘
    var selectorArr = ['optGmvChart','b2bGmvChart','sellerGmvChart','buyerGmvChart'];
    showPanelOrLoading(selectorArr,true);

    //交易分析   --  漏斗图  客户转化 （卖家/买家）  物品转化（卖家/买家）
    selectorArr = ['clientSellerChart','clientBuyerChart','productSellerChart',
                    'productBuyerChart','dealTable','bidTable','returnInventoryPieChart',
                    'returnReasonPieChart','supplyDemandLineChart','supplyDemandPieChart'];
    showPanelOrLoading(selectorArr,true);

    //物品流转分析   -- 流拍  ， 卖家确认情况分析   库存分析 （线图，饼图）
    selectorArr = ['passInChart','sellerConfirmChart','stockLineChart','stockPieChart','forceChart'];//,'forceChart'
    showPanelOrLoading(selectorArr,true);

    initForceMap();

    var startDate = new Date().getNewDate(-7);
    var endDate = new Date().getNewDate(-1);
    var currentDate = new Date().getNewDate(0);

    $('#fund-analysis-date-range-btn span').html(startDate + ' - ' + endDate);
    $('#circulation-analysis-date-range-btn span').html(startDate + ' - ' + endDate);

    /*整体分析和交易分析日期范围*/
    var tradeEndDate=new Date().getNewDate(-1);
    var tradeStartDate=new Date().getNewDate(-7);
    $('#whole-analysis-date-range-btn span').html(currentDate);
    $('#trade-analysis-date-range-btn span').html(tradeStartDate + ' - ' + tradeEndDate);
    var minDate="2016-01-01";
    $('#fund-analysis-date-range-btn').daterangepicker(filterPickerOptionsFunc(startDate,endDate,minDate,false), fundDateRangeCallback);
    $('#circulation-analysis-date-range-btn').daterangepicker(filterPickerOptionsFunc(startDate,endDate,minDate,false), circulationDateRangeCallback);
    $('#whole-analysis-date-range-btn').daterangepicker(singlePickerOptionsFunc(currentDate,currentDate,minDate,true), wholeDateRangeCallback);
    $('#trade-analysis-date-range-btn').daterangepicker(filterPickerOptionsFunc(startDate,endDate,minDate,false), tradeDateRangeCallback);

    var phoneCate = $("#category").val(); //品类
    //linkSelectInit(phoneCate);

    $(".category").change(function(){
        var selectorArr = ['passInChart','sellerConfirmChart','stockLineChart','stockPieChart','forceChart','stockPieChart'];
        showPanelOrLoading(selectorArr,true);

        var category = $("#category").val(); //品类
        linkSelectInit(category);

        var serviceLineId = (($(".source").val() == undefined) ? 0 : $(".source").val());
        var categoryId = (category == undefined ? 0 : category);
        var brandId = 0;
        var modelId = 0;
        var cQuery = {serviceLineId:serviceLineId,categoryId:categoryId,brandId:brandId,modelId:modelId,startTime:memoryCirculationDate.startDate,endTime:memoryCirculationDate.endDate};
        //doSearch()
        //console.log(cQuery);
        //console.log("记忆开始日期："+memoryCirculationDate.startDate);
        //console.log("记忆结束日期："+memoryCirculationDate.endDate);
        renderPassIn(cQuery,memoryCirculationDate.startDate,memoryCirculationDate.endDate);
        renderSellerConfirm(cQuery,memoryCirculationDate.startDate,memoryCirculationDate.endDate);

        drawGoodFlowAnalysis(cQuery);
        renderStockLineDemand(cQuery,memoryCirculationDate.startDate,memoryCirculationDate.endDate);
        drawStockPieChart(cQuery);
    });

    $("#brand").change(function(){
        var selectorArr = ['passInChart','sellerConfirmChart','stockLineChart','stockPieChart','forceChart','stockPieChart'];
        showPanelOrLoading(selectorArr,true);

        var brand = $("#brand").val(); //品牌
        productInit(brand);

        var serviceLineId = (($(".source").val() == undefined) ? 0 : $(".source").val());
        var categoryId = (($(".category").val() == undefined) ? 0 : $(".category").val());
        var brandId = (brand == undefined ? 0 : brand);
        var modelId = 0;
        var cQuery = {serviceLineId:serviceLineId,categoryId:categoryId,brandId:brandId,modelId:modelId,startTime:memoryCirculationDate.startDate,endTime:memoryCirculationDate.endDate};

        //console.log(cQuery);
        //console.log("记忆开始日期："+memoryCirculationDate.startDate);
        //console.log("记忆结束日期："+memoryCirculationDate.endDate);
        renderPassIn(cQuery,memoryCirculationDate.startDate,memoryCirculationDate.endDate);
        renderSellerConfirm(cQuery,memoryCirculationDate.startDate,memoryCirculationDate.endDate);

        drawGoodFlowAnalysis(cQuery);
        renderStockLineDemand(cQuery,memoryCirculationDate.startDate,memoryCirculationDate.endDate);
        drawStockPieChart(cQuery);
    });

    $("#model").change(function(){

        var selectorArr = ['passInChart','sellerConfirmChart','stockLineChart','stockPieChart','forceChart','stockPieChart'];
        showPanelOrLoading(selectorArr,true);

        var model = $("#model").val(); //品牌
        var serviceLineId = (($(".source").val() == undefined) ? 0 : $(".source").val());
        var categoryId = (($(".category").val() == undefined) ? 0 : $(".category").val());
        var brandId = (($(".brand").val() == undefined) ? 0 : $(".brand").val());
        var modelId = (model == undefined ? 0 : model);
        var cQuery = {serviceLineId:serviceLineId,categoryId:categoryId,brandId:brandId,modelId:modelId,startTime:memoryCirculationDate.startDate,endTime:memoryCirculationDate.endDate};
        //doSearch()
        //console.log(cQuery);
        //console.log("记忆开始日期："+memoryCirculationDate.startDate);
        //console.log("记忆结束日期："+memoryCirculationDate.endDate);
        renderPassIn(cQuery,memoryCirculationDate.startDate,memoryCirculationDate.endDate);
        renderSellerConfirm(cQuery,memoryCirculationDate.startDate,memoryCirculationDate.endDate);

        drawGoodFlowAnalysis(cQuery);
        renderStockLineDemand(cQuery,memoryCirculationDate.startDate,memoryCirculationDate.endDate);
        drawStockPieChart(cQuery);
        //doSearch()
    });

    $("#source").change(function(){

        var selectorArr = ['passInChart','sellerConfirmChart','stockLineChart','stockPieChart','forceChart','stockPieChart'];
        showPanelOrLoading(selectorArr,true);

        var source = $("#source").val();
        var serviceLineId = ((source == undefined) ? 0 : source);
        var categoryId = (($(".category").val() == undefined) ? 0 : $(".category").val());
        var brandId = (($(".brand").val() == undefined) ? 0 : $(".brand").val());
        var modelId = (($(".model").val() == undefined) ? 0 : $(".model").val());
        var cQuery = {serviceLineId:serviceLineId,categoryId:categoryId,brandId:brandId,modelId:modelId,startTime:memoryCirculationDate.startDate,endTime:memoryCirculationDate.endDate};

        //console.log(cQuery);
        //console.log("记忆开始日期："+memoryCirculationDate.startDate);
        //console.log("记忆结束日期："+memoryCirculationDate.endDate);
        renderPassIn(cQuery,memoryCirculationDate.startDate,memoryCirculationDate.endDate);
        renderSellerConfirm(cQuery,memoryCirculationDate.startDate,memoryCirculationDate.endDate);

        drawGoodFlowAnalysis(cQuery);
        renderStockLineDemand(cQuery,memoryCirculationDate.startDate,memoryCirculationDate.endDate);
        drawStockPieChart(cQuery);
    });

    /*******************************************@Author:LuJia.Chen-Start***********************************************/
    /*1 整体分析*/
    renderOverallAnalysis(currentDate,currentDate);
    /*2 交易分析-获取t+1的数据*/
    /*2a 客户转化*/
    /*2a 客户转化  买家*/
    renderClientTransferBuyer(tradeStartDate, tradeEndDate);
    /*2a 客户转化  卖家*/
    renderClientTransferSaller(tradeStartDate, tradeEndDate);

    /*2b 物品转化 买家*/
    renderProductTransferBuyer(tradeStartDate, tradeEndDate);
    /*2b 物品转化  卖家*/
    renderProductTransferSeller(tradeStartDate, tradeEndDate);

    /*2c 客户分布*/
    renderSuccessTradeCount(tradeStartDate, tradeEndDate);

    renderBidCount(tradeStartDate, tradeEndDate);
    /*d 退货分析 --双环形图*/
    renderReturnDemand(tradeStartDate, tradeEndDate);
    /*d 退货分析 --分布*/
    renderReturn(tradeStartDate,tradeEndDate);
    /*e 供需比分析*/
    renderSupplyDemand(startDate,endDate);

    //renderSupplyDemandSkuLevel(tradeStartDate,tradeEndDate);
    renderSupplyDemandSkuLevelPro(tradeStartDate,tradeEndDate);
    //切换tab
    $('a[data-toggle=tab]').on('shown.bs.tab', function (e) {
        var activeTab = $(e.target).text();//'dealTable',
        switch (activeTab) {
            case '成交量':
                showPanelOrLoading(['dealTable'],true);//显示loading动画
                renderSuccessTradeCount(memoryDate.startDate,memoryDate.endDate);
                memoryActiveTab.first = '成交量';
                break;
            case '成交金额':
                showPanelOrLoading(['dealTable'],true);
                renderSuccessTradePrice(memoryDate.startDate,memoryDate.endDate);
                memoryActiveTab.first = '成交金额';
                break;
            case '竞得量':
                showPanelOrLoading(['bidTable'],true);
                renderBidCount(memoryDate.startDate,memoryDate.endDate);
                memoryActiveTab.second = '竞得量';
                break;
            case '竞得金额':
                showPanelOrLoading(['bidTable'],true);
                renderBidPrice(memoryDate.startDate,memoryDate.endDate);
                memoryActiveTab.second = '竞得金额';
                break;
            default:
                break;
        }
    });

    /*******************************************@Author:LuJia.Chen-End*************************************************/

    /*******************************************@Author:YuLe.Zhang-Start***********************************************/

    //getData(query);
    //getDataPro(query);

    var query = {serviceLineId:0,categoryId:0,brandId:0,modelId:0,startTime:startDate,endTime:endDate};
    renderPassIn(query,startDate,endDate);
    renderSellerConfirm(query,startDate,endDate);
    //渲染物品流转分析(物品流转流程图，库存分析（面积图，环形图），流拍分析，卖家确认情况分析)
    drawGoodFlowAnalysis(query);
    renderStockLineDemand(query,startDate,endDate);
    drawStockPieChart(query);
    //初始化渲染流拍分析图
    //drawPassInChart();
    //初始化渲染卖家确认情况分析
    //drawVendorChart();
    //初始化渲染垫资分析
    /*drawFindAnalysisChart();*/

    toolTipCustom();
    /*******************************************@Author:YuLe.Zhang-End*************************************************/
};
var memoryDate = {startDate:new Date().getNewDate(-7),endDate:new Date().getNewDate(-1)};
var memoryCirculationDate = {startDate:new Date().getNewDate(-7),endDate:new Date().getNewDate(-1),searchEndDate:new Date().getNewDate(0)};
var memoryActiveTab = {first:'成交量',second:'竞得量'};
//日期回调函数  --- 选择时间重新渲染数据
function fundDateRangeCallback(start, end, label) {
    //console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    var sdt = start.format('YYYY-MM-DD');
    var show_edt = end.format('YYYY-MM-DD');
    var search_edt = new Date(end.format('YYYY-MM-DD')).getNewDate(1);
    $('#fund-analysis-date-range-btn span').html(sdt + ' - ' + show_edt);
}
//日期回调函数
function circulationDateRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('#circulation-analysis-date-range-btn span').html(sdt + ' - ' + edt);

    memoryCirculationDate = {startDate:sdt,endDate:edt};

    var selectorArr = ['passInChart','sellerConfirmChart','stockLineChart','stockPieChart','forceChart','stockPieChart'];
    showPanelOrLoading(selectorArr,true);
    var serviceLineId = (($(".source").val() == undefined) ? 0 : $(".source").val());
    var categoryId = (($(".category").val() == undefined) ? 0 : $(".category").val());
    var brandId = (($(".brand").val() == undefined) ? 0 : $(".brand").val());
    var modelId = (($(".model").val() == undefined) ? 0 : $(".model").val());
    var query = {serviceLineId:serviceLineId,categoryId:categoryId,brandId:brandId,modelId:modelId,startTime:sdt,endTime:edt};

    renderPassIn(query,sdt,edt);
    renderSellerConfirm(query,sdt,edt);

    drawGoodFlowAnalysis(query);
    renderStockLineDemand(query,sdt,edt);
    drawStockPieChart(query);
}
//日期回调函数
function tradeDateRangeCallback(start, end, label) {
    //console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('#trade-analysis-date-range-btn span').html(sdt + ' - ' + edt);
    var search_edt = new Date(end.format('YYYY-MM-DD')).getNewDate(1);
    memoryDate = {startDate:sdt,endDate:edt};
    var selectorArr = ['clientSellerChart','clientBuyerChart','productSellerChart',
        'productBuyerChart','returnInventoryPieChart',
        'returnReasonPieChart','supplyDemandLineChart','supplyDemandPieChart'];
    showPanelOrLoading(selectorArr,true);
    /*2 交易分析-获取t+1的数据*/
    /*2a 客户转化   买家*/
    renderClientTransferBuyer(sdt, edt);
    /*2a 客户转化  卖家*/
    renderClientTransferSaller(sdt, edt);
    /*2b 物品转化   买家*/
    renderProductTransferBuyer(sdt, edt);
    /*2b.物品转化-卖家*/
    renderProductTransferSeller(sdt, edt);
    //表格通过选择进行加载
    selectActiveTabToDraw();
    /*/!*2c 客户分布  竞得量*!/
    renderBidCount(sdt, edt);
    /!*2c 客户分布  成交量*!/
    renderSuccessTradeCount(sdt, edt);*/
    /*d 退货分析 --双环形图*/
    renderReturnDemand(sdt,edt);
    /*d 退货分析 --分布*/
    renderReturn(sdt,edt);
    //供需比分析面积图
    renderSupplyDemand(sdt,edt);
    //供需比分布
    //renderSupplyDemandSkuLevel(sdt,edt);  替换成新版，原版不删
    renderSupplyDemandSkuLevelPro(sdt,edt);
}
//日期回调函数
function wholeDateRangeCallback(start, end, label) {
    var edt = end.format('YYYY-MM-DD');
    $('#whole-analysis-date-range-btn span').html(edt);
    var selectorArr = ['optGmvChart','b2bGmvChart','sellerGmvChart','buyerGmvChart'];
    showPanelOrLoading(selectorArr,true);
    renderOverallAnalysis(edt,edt);
}

/***********************************************@Author:LuJia.Chen-Start***********************************************/
/*1.整体分析*/
var renderOverallAnalysis = function(date,endTime){
    var queryArr=date.split("-");    //e.g. date="2018-08-09"
    //console.log(queryArr);
    var query={month:queryArr[0]+ queryArr[1]};     //e.g. 201808
    var getDayCount=new Date(queryArr[0],queryArr[1],0).getDate();  //当月天数
    var dailyTarget = accDiv(Math.round(accMul(accDiv(queryArr[2],getDayCount),10000)),10000);                  //当月的预期目标  百分比
    /*获取当月的目标*/
    requestURL(dataService+'/instrumentsPanel/getMonthGoal',query).done(function(monthGoal){
        var today = new Date().getNewDate(0);
        /*代拍GMV*/
        if(today == endTime){
            //初始化数量和金额
            //console.log("今天");
            //获取今天实时的   OPT  +  外采  GMV
            //更新为新接口（无明细返回到前端）
            requestURL(dataService+"/opt/getBToBColorAndStandardCollect",{}).done(function(result){
                var opt_gmv_part_one = accAdd(result.tempAmount["opt"] , result.tempAmount["外采"]);
                //OPT   GMV
                if(queryArr[2] == '01'){
                    showPanelOrLoading(['optGmvChart'],false);
                    var goal=accMul(monthGoal["opt"],1);                                                     //当月的预期目标
                    var completion = accAdd(0,opt_gmv_part_one);                    //实际完成的数量
                    htmlNumSet(completion,'opt-gmv-cnt');
                    drawGaugeChart(0,"optGmvChart",goal*1,"",completion,dailyTarget*1,0);
                }else{
                    requestURL(dataService+'/instrumentsPanel/getOptGMVIfToday',{endDate:endTime}).done(function(data){
                        showPanelOrLoading(['optGmvChart'],false);
                        var goal=accMul(monthGoal["opt"],1);                                                     //当月的预期目标
                        var completion = accAdd(Math.round(accMul(data,1)),opt_gmv_part_one);                    //实际完成的数量
                        htmlNumSet(completion,'opt-gmv-cnt');
                        drawGaugeChart(0,"optGmvChart",goal*1,"",completion,dailyTarget*1,0);
                    });
                }
            });

            //var tempB2BAmount={'爱机汇':0,"爱回收":0};
            //获取今天实时的  -- 爱机汇  GMV
            requestURL(dataService+"/opt/getAhsAndAjhCollect",{}).done(function(result){
                //将获取的数据按tag分组
                var b2b_gmv_part_one = accMul(result.tempAmount['爱机汇'],1);
                //console.log("b2b_gmv_part_one::" + b2b_gmv_part_one);
                //B2B   GMV
                if(queryArr[2] == '01'){
                    showPanelOrLoading(['b2bGmvChart'],false);
                    var goal=accMul(monthGoal["b2b"],1);                                                     //当月的预期目标
                    var completion = accAdd(0,b2b_gmv_part_one);                    //实际完成的数量
                    htmlNumSet(completion,'b2b-gmv-cnt');
                    drawGaugeChart(0,"b2bGmvChart",goal*1,"",completion,dailyTarget*1,1);
                }else{
                    requestURL(dataService+'/instrumentsPanel/getB2BGMVIfToday',{endDate:endTime}).done(function(data){
                        showPanelOrLoading(['b2bGmvChart'],false);
                        var goal=accMul(monthGoal["b2b"],1);                                                     //当月的预期目标
                        var completion = accAdd(Math.round(accMul(data,1)),b2b_gmv_part_one);                    //实际完成的数量
                        htmlNumSet(completion,'b2b-gmv-cnt');
                        drawGaugeChart(0,"b2bGmvChart",goal*1,"",completion,dailyTarget*1,1);
                    });
                }
            });

        }else{

            //非查询当日  OPT  GMV
            requestURL(dataService+'/instrumentsPanel/getOptGMV',{endDate:endTime}).done(function(data){
                showPanelOrLoading(['optGmvChart'],false);
                var goal=accMul(monthGoal["opt"],1);  //当月的预期目标
                var completion = Math.round(accMul(data,1));                   //实际完成的数量
                htmlNumSet(completion,'opt-gmv-cnt');
                drawGaugeChart(0,"optGmvChart",goal*1,"",completion,dailyTarget*1,0);
            });

            /*非查询当日   b2bGMV*/
            requestURL(dataService+'/instrumentsPanel/getB2bGmv',{endDate:endTime}).done(function(data){
                showPanelOrLoading(['b2bGmvChart'],false);
                var goal = monthGoal["b2b"]*1;
                var completion = data*1;
                htmlNumSet(data*1,'b2b-gmv-cnt');
                drawGaugeChart(0,"b2bGmvChart",goal,"",completion,dailyTarget,1);
            });
        }

        /*当月入驻卖家客户数量*/
        /*requestURL(dataService+"/instrumentsPanel/getCurrentMonthSellerClientCount", {endDate:endTime}).done(function (data) {
            var goal=monthGoal["seller"].toFixed(0);
            var completion = (data/1).toFixed(0);
            /!*卖家客户总数量*!/
            requestURL(dataService+"/instrumentsPanel/getSellerClientCount", {}).done(function (allData) {
                showPanelOrLoading(['sellerGmvChart'],false);
                drawGaugeChart("sellerGmvChart",goal,"",completion,dailyTarget,2);
                htmlNumSet(allData*1,'seller-client-count');
            });
        });*/

        var lastMonth = getLastMonth(queryArr[0],queryArr[1]);
        //console.log(lastMonth);
        requestURL(dataService+'/instrumentsPanel/getMonthGoal',{month:lastMonth}).done(function(lastMonthGoal){
            /* /!*卖家客户总数量*!/*/
            requestURL(dataService+"/instrumentsPanel/getSellerClientCount", {endDate:endTime}).done(function (allData) {
                var lastGoal = lastMonthGoal["seller"].toFixed(0);
                var goal = monthGoal["seller"].toFixed(0);
                var targetNum = accAdd(accMul(accSub(goal,lastGoal),dailyTarget),lastGoal);
                var sellerTarget = accDiv(Math.round(accMul(accDiv(targetNum,goal),10000)),10000);
                var completion = (allData/1).toFixed(0);
                showPanelOrLoading(['sellerGmvChart'],false);
                drawGaugeChart(lastGoal,"sellerGmvChart",goal,"",completion,sellerTarget,2);
                htmlNumSet(allData*1,'seller-client-count');
            });

            /*当月入驻买家客户数量*/
            /*requestURL(dataService+"/instrumentsPanel/getCurrentMonthBuyerClientCount", {endDate:endTime}).done(function (data) {
                var goal=monthGoal["buyer"].toFixed(0);    //todo change to "buyer"
                var completion=(data/1).toFixed(0);
                /!*买家客户总数量*!/
                requestURL(dataService+"/instrumentsPanel/getBuyerClientCount", {}).done(function (allData) {
                    showPanelOrLoading(['buyerGmvChart'],false);
                    drawGaugeChart("buyerGmvChart",goal,"",completion,dailyTarget,3);
                    htmlNumSet(allData*1,'buyer-client-count');
                });
            });*/

            requestURL(dataService+"/instrumentsPanel/getBuyerClientCount", {endDate:endTime}).done(function (allData) {
                var lastGoal = lastMonthGoal["buyer"].toFixed(0);
                var goal = monthGoal["buyer"].toFixed(0);    //todo change to "buyer"

                var targetNum = accAdd(accMul(accSub(goal,lastGoal),dailyTarget),lastGoal);
                var buyerTarget = accDiv(Math.round(accMul(accDiv(targetNum,goal),10000)),10000);

                var completion = (allData/1).toFixed(0);
                showPanelOrLoading(['buyerGmvChart'],false);
                drawGaugeChart(lastGoal,"buyerGmvChart",goal,"",completion,buyerTarget,3);
                htmlNumSet(allData*1,'buyer-client-count');
            });
        });
    });
};
var getLastMonth = function(year,month){
    var lastMonth = "";
    if(month == '1'){
        lastMonth = "12";
    }else{
        lastMonth = accSub(accMul(month,1),1)+"";
    }
    if(lastMonth.length == 1){
        lastMonth = "0" + lastMonth;
    }
    var str = year + lastMonth;
    return str;
};
//整体分析加载动画选择加载
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
/*2.交易分析*/    /*只有四个的话为100-i*25*/
/*2a. 客户转化-买家*/
var renderClientTransferBuyer = function(startDate,endDate){
    var dataArr=[], gapArr=[], minValue,nMax=[];   /*转化率*/
    var showDataArr = [];
    var legendArr=["买家数量","登录买家","竞拍买家","竞得买家"];
    var keyArr=["recycler","login","quoted","confirm"];
    var query={startDate:startDate, endDate:endDate};
    requestURL(dataService + "/instrumentsPanel/getClientTransferBuyer", query).done(function(result){
        _.each(legendArr,function(v,i,arr){
            dataArr.push({"value":result[keyArr[i]],"name":v});
            showDataArr.push({"value":100-(i*25),"name":v});
            if(i){
                if(result[keyArr[i-1]]==0 || result[keyArr[i-1]]== '0'){
                    gapArr.push(0.00 + "%");
                }else{
                    gapArr.push(accDiv(Math.round(accMul(accDiv(result[keyArr[i]],result[keyArr[i-1]]),10000)),100) + "%");
                }
            }
        });
        gapArr.unshift("100%");        //最后一列的转化率默认为100%
        minValue = getMinValue(result,keyArr);
        nMax = getMaxAndSecondMaxValue(result,keyArr);
        showPanelOrLoading(['clientBuyerChart'],false);

        //console.log(showDataArr);
        drawFunnelChart("clientBuyerChart", "",showDataArr,dataArr,legendArr,gapArr,nMax);
    })
};
/*2a. 客户转化-卖家*/
var renderClientTransferSaller = function(startDate,endDate){
    var dataArr=[], gapArr=[], minValue,nMax=[];   /*转化率*/
    var showDataArr = [];
    var legendArr=["卖家数量","登录卖家","下单卖家","成交卖家"];
    var keyArr=["recycler","login","quoted","confirm"];
    var query={startDate:startDate, endDate:endDate};

    requestURL(dataService + "/instrumentsAfterPanel/getClientTransferSaller", query).done(function(result){
        //console.log(result);
        _.each(legendArr,function(v,i,arr){
            dataArr.push({"value":result[keyArr[i]],"name":v});
            showDataArr.push({"value":100-(i*25),"name":v});
            if(i){
                gapArr.push(accDiv(Math.round(accMul(accDiv(result[keyArr[i]],result[keyArr[i-1]]),10000)),100) + "%");
            }
        });
        gapArr.unshift("100%");        //最后一列的转化率默认为100%
        minValue = getMinValue(result,keyArr);
        nMax = getMaxAndSecondMaxValue(result,keyArr);
        showPanelOrLoading(['clientSellerChart'],false);
        drawFunnelChart("clientSellerChart", "",showDataArr,dataArr,legendArr,gapArr,nMax);
    });
};


/*2b.物品转化-买家*/
var renderProductTransferBuyer = function(startDate, endDate){
    var dataArr=[], gapArr=[], minValue,nMax=[];   /*转化率*/
    var showDataArr = [];
    var legendArr=["竞拍数量","竞得数量","支付数量","发货数量","成交数量"];
    var keyArr=["quote","confirm","pay","deliver","success"];
    var query={startDate:startDate, endDate:endDate};

    requestURL(dataService+'/instrumentsPanel/getProductTransferBuyer',query).done(function(result){

        //拼接数据对象，格式：[{value:xxx,name:xxx},...]
        _.each(legendArr,function(v,i,arr){
            dataArr.push({"value":result[keyArr[i]],"name":v});
            showDataArr.push({"value":100-(i*20),"name":v});
            if(i){
                gapArr.push(accDiv(Math.round(accMul(accDiv(result[keyArr[i]],result[keyArr[i-1]]),10000)),100) + "%");
            }
        });
        gapArr.unshift("100%");        //最后一列的转化率默认为100%
        minValue=result[keyArr[keyArr.length-1]];
        nMax = getMaxAndSecondMaxValue(result,keyArr);
        showPanelOrLoading(['productBuyerChart'],false);
        drawFunnelChart("productBuyerChart", "",showDataArr,dataArr,legendArr,gapArr,nMax);
    })
};
/*2b.物品转化-卖家*/
var renderProductTransferSeller = function(startDate, endDate){
    var dataArr=[], gapArr=[], minValue,nMax=[];   /*转化率*/
    var showDataArr = [];
    var legendArr=[/*"询价数量",*/"下单数量","发货数量","收货数量","上拍数量","成交数量"];
    var keyArr=[/*"ask",*/"order","send","collect","pat","deal"];
    var query={startDate:startDate, endDate:endDate};

    requestURL(dataService+'/instrumentsAfterPanel/getProductTransferSeller',query).done(function(result){
        //拼接数据对象，格式：[{value:xxx,name:xxx},...]
        _.each(legendArr,function(v,i,arr){
            dataArr.push({"value":result[keyArr[i]],"name":v});
            showDataArr.push({"value":100-(i*20),"name":v});
            if(i){
                gapArr.push(accDiv(Math.round(accMul(accDiv(result[keyArr[i]],result[keyArr[i-1]]),10000)),100) + "%");
            }
        });
        gapArr.unshift("100%");        //最后一列的转化率默认为100%
        minValue=result[keyArr[keyArr.length-1]];
        nMax = getMaxAndSecondMaxValue(result,keyArr);
        showPanelOrLoading(['productSellerChart'],false);
        drawFunnelChart("productSellerChart", "",showDataArr,dataArr,legendArr,gapArr,nMax);
    })
};

/*2c 客户分布*/

//竞得量
var renderBidCount = function(startDate,endDate){
    /*c.客户分布-竞得量*/
    var intervalDays=getSomeDays(startDate, endDate)+1;
    //var bidBuyerCnt, bidBuyerLastWkCnt;        //本周和上周竞拍买家数量
    var lastDatePeriod=getLastDatePeriod(startDate,endDate);
    /*获取上周竞拍买家数量*/

    //todo 传4 date para？

    requestURL(dataService + '/instrumentsPanel/getBidCount',{"startDate":startDate, "endDate":endDate}).done(function(curWkData){

        requestURL(dataService+ '/instrumentsPanel/getBidCount',{"startDate":lastDatePeriod[0], "endDate":lastDatePeriod[1]}).done(function(lastWkData){


            //bidBuyerCnt = curWkQuotedCnt['quoted'];
            //bidBuyerLastWkCnt = lastWkQuotedCnt["quoted"];

            //&lt; 代表小于号
            var criteriaArr=["0&lt;q&lt;=" + (5*intervalDays) ,
                (5*intervalDays) + "&lt;q&lt;=" + (30*intervalDays),
                (30*intervalDays) + "&lt;q&lt;=" + (100*intervalDays) ,
                (100*intervalDays) + "&lt;q&lt;=" + (200*intervalDays) ,
                (200*intervalDays) + "&lt;q&lt;=" + (500*intervalDays),
                "q>" + (500*intervalDays)];
            var clientCountArr=curWkData["cnt"];
            var productRatioArr=curWkData["ratio"];
            var lastClientCountArr=lastWkData['cnt'];
            var lastProductRatioArr=lastWkData['ratio'];

            var recycler = accMul(curWkData["zero"][0],1);             //获取买家客户数量
            var confirm = accMul(curWkData["zero"][1],1);               //获取竞得买家客户数量
            var one = accSub(recycler,confirm);
            var two = accDiv(Math.round(accMul(accDiv(accSub(recycler,confirm),recycler),10000)),100);

            var lastRecycler = accMul(lastWkData["zero"][0],1);             //获取买家客户数量
            var lastConfirm = accMul(lastWkData["zero"][1],1);               //获取竞得买家客户数量
            var lastOne = accSub(lastRecycler,lastConfirm);
            var lastTwo = accDiv(Math.round(accMul(accDiv(accSub(lastRecycler,lastConfirm),lastRecycler),10000)),100);
            var zCountTrend=getTrend(lastOne,one);
            var zcRatioTrend=getTrend(lastTwo,two);
            var zpRatioTrend=getTrend(1,1);

            //获取数量值得最大位数,用来调整数字长度格式
            var maxCount=_.max(clientCountArr);
            var maxCountLength_new=_.max([maxCount,one]).toString().length;
            //console.log("maxCountLength_new::"+maxCountLength_new);
            var maxCountLength=_.max(clientCountArr).toString().length;
            var maxProductLength=_.max(productRatioArr).toString().length;
            var dataList=[];
            _.each(criteriaArr,function(v,i,arr){
                //获取本周和上周的趋势
                var countTrend = getTrend(lastClientCountArr[i],clientCountArr[i]);

                //客户数量占比 环比趋势比较
                var cRatioTrend = getTrend(accDiv(lastClientCountArr[i],lastRecycler),accDiv(clientCountArr[i],recycler));
                var splitChar=",";        //用于数值和趋势的拼接分割
                var pRatioTrend = getTrend(lastProductRatioArr[i],productRatioArr[i]);
                //客户占比 = 客户数/买家客户数量
                var clientRatio=(accDiv(Math.round(accMul(accDiv(clientCountArr[i],recycler),10000)),100) + "%");
                productRatioArr[i]=accDiv(productRatioArr[i],100) + "%";
                //todo 后台拼？
                dataList.push({
                    "criteria": v,
                    "count":formattedNumber(clientCountArr[i],maxCountLength_new) + splitChar + countTrend,
                    "cRatio":formattedNumber(clientRatio,6) + splitChar + cRatioTrend,
                    "pRatio":formattedNumber(productRatioArr[i],6) + splitChar + pRatioTrend});
            });
            dataList.unshift({
                "criteria": "q=0",
                "count":one +","+zCountTrend,
                "cRatio":two +"%" +","+zcRatioTrend,
                "pRatio":'0.00' +"%" +"&nbsp;&nbsp;"+"," +zpRatioTrend
            });
            showPanelOrLoading(['bidTable'],false);
            if(instruments_panel.imPhone()){
                drawDataTable("bidCountTable", dataList,[
                    {
                        field:'criteria',
                        title:'物品数量分布　<a href="#" class="glyphicon glyphicon-question-sign" data-toggle="tooltip" data-placement="top" title="买家竞得物品数量分布"></a>',
                        width:"25%"
                        /*sortable:true*/
                    },
                    {
                        field:'count',
                        title:'客户数　<a href="#" class="glyphicon glyphicon-question-sign" data-toggle="tooltip" data-placement="top" title="在此区域的买家数量"></a>',
                        width:"25%",
                        formatter: operateFormatter
                    },
                    {
                        field:'cRatio',
                        title:'客户占比　<a href="#" class="glyphicon glyphicon-question-sign" data-toggle="tooltip" data-placement="top" title="在此区域的买家占比"></a>',
                        width:"25%",
                        formatter: operateFormatter
                        /*                sortable:true*/
                    },
                    {
                        field:'pRatio',
                        title:'物品占比　<a href="#" class="glyphicon glyphicon-question-sign" data-toggle="tooltip" data-placement="top" title="在此区域的买家竞得数量占比"></a>',
                        width:"25%",
                        formatter: operateFormatter //自定义方法，添加操作按钮
                        //events:operateEvents
                    }

                ],"bidPriceTable");
            }else{
                drawDataTable("bidCountTable", dataList,[
                    {
                        field:'criteria',
                        title:'物品数量分布　<a href="#" class="glyphicon glyphicon-question-sign" data-toggle="tooltip" data-placement="top" title="买家竞得物品数量分布"></a>',
                        /*sortable:true*/
                    },
                    {
                        field:'count',
                        title:'客户数　<a href="#" class="glyphicon glyphicon-question-sign" data-toggle="tooltip" data-placement="top" title="在此区域的买家数量"></a>',
                        formatter: operateFormatter
                    },
                    {
                        field:'cRatio',
                        title:'客户占比　<a href="#" class="glyphicon glyphicon-question-sign" data-toggle="tooltip" data-placement="top" title="在此区域的买家占比"></a>',
                        formatter: operateFormatter
                        /*                sortable:true*/
                    },
                    {
                        field:'pRatio',
                        title:'物品占比　<a href="#" class="glyphicon glyphicon-question-sign" data-toggle="tooltip" data-placement="top" title="在此区域的买家竞得数量占比"></a>',
                        formatter: operateFormatter //自定义方法，添加操作按钮
                        //events:operateEvents
                    }

                ],"bidPriceTable");
            }


            /*requestURL(dataService + "/instrumentsPanel/getBidBuyerCnt",{"startDate":startDate, "endDate":endDate}).done(function(curWkQuotedCnt){

                requestURL(dataService + "/instrumentsPanel/getBidBuyerCnt",{"startDate":lastDatePeriod[0], "endDate":lastDatePeriod[1]}).done(function(lastWkQuotedCnt){


                });
            });*/
        });
    });
    /*c.客户分布-竞得金额*/
};
//竞得金额
var renderBidPrice = function(startDate,endDate){
    /*c.客户分布-竞得金额*/
    var query={startDate:startDate, endDate:endDate};
    var intervalDays=getSomeDays(startDate, endDate)+1;
    var lastDatePeriod=getLastDatePeriod(startDate,endDate);      //上个周期的开始时间和结束时间
    var query1={startDate:lastDatePeriod[0], endDate:lastDatePeriod[1]};

    requestURL(dataService+"/instrumentsPanel/getBidPrice",query).done(function(curWkData){

        requestURL(dataService+'/instrumentsPanel/getBidPrice',query1).done(function(lastWkData){
            //var bidBuyerCnt = curWkQuotedCnt['quoted'];
            //var bidBuyerLastWkCnt = lastWkQuotedCnt["quoted"];
            //&lt; 代表小于号
            var criteriaArr=[
                /*"p=0",*/
                "0&lt;q&lt;=" + (1000*intervalDays).toLocaleString(),
                (1000*intervalDays).toLocaleString() + "&lt;q&lt;=" + (10000*intervalDays).toLocaleString() ,
                (10000*intervalDays).toLocaleString() + "&lt;q&lt;=" + (100000*intervalDays).toLocaleString() ,
                (100000*intervalDays).toLocaleString() + "&lt;q&lt;=" + (200000*intervalDays).toLocaleString() ,
                (200000*intervalDays).toLocaleString() + "&lt;q&lt;=" + (300000*intervalDays).toLocaleString() ,
                "q>" + (300000*intervalDays).toLocaleString()];
            var clientCountArr = curWkData["cnt"];

            var priceRatioArr = curWkData["ratio"];
            //console.log(priceRatioArr);
            var lastClientCountArr = lastWkData['cnt'];
            var lastPriceRatioArr = lastWkData['ratio'];


            var recycler = accMul(curWkData["zero"][0],1);             //获取买家客户数量
            var confirm = accMul(curWkData["zero"][1],1);               //获取竞得买家客户数量
            var one = accSub(recycler,confirm);
            var two = accDiv(Math.round(accMul(accDiv(accSub(recycler,confirm),recycler),10000)),100);
            //获取上期的客户数据
            var lastRecycler = accMul(lastWkData["zero"][0],1);             //获取买家客户数量
            var lastConfirm = accMul(lastWkData["zero"][1],1);               //获取竞得买家客户数量
            var lastOne = accSub(lastRecycler,lastConfirm);
            var lastTwo = accDiv(Math.round(accMul(accDiv(accSub(lastRecycler,lastConfirm),lastRecycler),10000)),100);
            var zCountTrend=getTrend(lastOne,one);
            var zcRatioTrend=getTrend(lastTwo,two);
            var zpRatioTrend=getTrend(1,1);

            //获取数量值得最大位数,用来调整数字长度格式
            var maxCount=_.max(clientCountArr);
            var maxCountLength_new=_.max([maxCount,one]).toString().length;
            //console.log("maxCountLength_new::"+maxCountLength_new);

            var maxCountLength=_.max(clientCountArr).toString().length;
            var maxPriceLength=_.max(priceRatioArr).toString().length;
            var dataList=[];
            _.each(criteriaArr,function(v,i,arr){
                var countTrend=getTrend(lastClientCountArr[i],clientCountArr[i]);
                var cRatioTrend=getTrend(accDiv(lastClientCountArr[i],lastRecycler),accDiv(clientCountArr[i],recycler));
                var pRatioTrend=getTrend(lastPriceRatioArr[i],priceRatioArr[i]);
                var splitChar=",";      //用于数值和趋势的拼接分割
                var clientRatio=(accDiv(Math.round(accMul(accDiv(clientCountArr[i],recycler),10000)),100) + "%");

                priceRatioArr[i]=accDiv(priceRatioArr[i],100) + "%";
                dataList.push(
                    {
                        "criteria": v,
                        "count":formattedNumber(clientCountArr[i],maxCountLength_new) + splitChar + countTrend,
                        "cRatio":formattedNumber(clientRatio,6) + splitChar + cRatioTrend,
                        "pRatio":formattedNumber(priceRatioArr[i],6)+ splitChar + pRatioTrend
                    }
                );
            });
            dataList.unshift({
                "criteria": "q=0",
                "count":one + "," + zCountTrend,
                "cRatio":two + "%" +"," + zcRatioTrend,
                "pRatio":'0.00' + "%" + "&nbsp;&nbsp;" + "," + zpRatioTrend
            });
            showPanelOrLoading(['bidTable'],false);
            if(instruments_panel.imPhone()){
                drawDataTable("bidPriceTable", dataList,[
                    {
                        field:'criteria',
                        title:'物品金额分布　<a href="#" class="glyphicon glyphicon-question-sign" data-toggle="tooltip" data-placement="top" title="买家竞得物品金额分布"></a>',
                        width:"31%"
                        /*sortable:true*/
                    },
                    {
                        field:'count',
                        title:'客户数　<a href="#" class="glyphicon glyphicon-question-sign" data-toggle="tooltip" data-placement="top" title="在此区域的买家数量"></a>',
                        width:"23%",
                        formatter: operateFormatter
                    },
                    {
                        field:'cRatio',
                        title:'客户占比　<a href="#" class="glyphicon glyphicon-question-sign" data-toggle="tooltip" data-placement="top" title="在此区域的买家占比"></a>',
                        width:"23%",
                        formatter: operateFormatter
                        /*                sortable:true*/
                    },
                    {
                        field:'pRatio',
                        title:'金额占比　<a href="#" class="glyphicon glyphicon-question-sign" data-toggle="tooltip" data-placement="top" title="在此区域的买家竞得金额占比"></a>',
                        width:"23%",
                        formatter: operateFormatter //自定义方法，添加操作按钮
                        //events:operateEvents
                    }

                ],'bidCountTable');
            }else{
                drawDataTable("bidPriceTable", dataList,[
                    {
                        field:'criteria',
                        title:'物品金额分布　<a href="#" class="glyphicon glyphicon-question-sign" data-toggle="tooltip" data-placement="top" title="买家竞得物品金额分布"></a>',
                        /*sortable:true*/
                    },
                    {
                        field:'count',
                        title:'客户数　<a href="#" class="glyphicon glyphicon-question-sign" data-toggle="tooltip" data-placement="top" title="在此区域的买家数量"></a>',
                        formatter: operateFormatter
                    },
                    {
                        field:'cRatio',
                        title:'客户占比　<a href="#" class="glyphicon glyphicon-question-sign" data-toggle="tooltip" data-placement="top" title="在此区域的买家占比"></a>',
                        formatter: operateFormatter
                        /*                sortable:true*/
                    },
                    {
                        field:'pRatio',
                        title:'金额占比　<a href="#" class="glyphicon glyphicon-question-sign" data-toggle="tooltip" data-placement="top" title="在此区域的买家竞得金额占比"></a>',
                        formatter: operateFormatter //自定义方法，添加操作按钮
                        //events:operateEvents
                    }

                ],'bidCountTable');
            }
        })
    })
};

//成交量
var renderSuccessTradeCount = function(startDate,endDate){
    /*c.客户分布-成交量*/
    var intervalDays=getSomeDays(startDate, endDate)+1;
    var dealSellerCnt, dealSellerLastWkCnt;        //本周和上周成交卖家数量
    var lastDatePeriod = getLastDatePeriod(startDate,endDate);
    /*获取上周成交卖家数量*/

    requestURL(dataService + '/instrumentsAfterPanel/getDealCount',{"startDate":startDate, "endDate":endDate}).done(function(curWkData){

        requestURL(dataService+ '/instrumentsAfterPanel/getDealCount',{"startDate":lastDatePeriod[0], "endDate":lastDatePeriod[1]}).done(function(lastWkData){

            requestURL(dataService + "/instrumentsAfterPanel/getDealSellerCnt",{"startDate":startDate, "endDate":endDate}).done(function(curWkQuotedCnt){

                requestURL(dataService + "/instrumentsAfterPanel/getDealSellerCnt",{"startDate":lastDatePeriod[0], "endDate":lastDatePeriod[1]}).done(function(lastWkQuotedCnt){

                    dealSellerCnt=curWkQuotedCnt['deal'];
                    dealSellerLastWkCnt=lastWkQuotedCnt["deal"];

                    //&lt; 代表小于号
                    var criteriaArr=[
                        "0&lt;q&lt;=" + (5*intervalDays) ,
                        (5*intervalDays) + "&lt;q&lt;=" + (50*intervalDays),
                        (50*intervalDays) + "&lt;q&lt;=" + (300*intervalDays),
                        "q>" + (300*intervalDays)];
                    var clientCountArr=curWkData["cnt"];
                    var productRatioArr=curWkData["ratio"];
                    var lastClientCountArr=lastWkData['cnt'];
                    var lastProductRatioArr=lastWkData['ratio'];
                    requestURL(dataService + "/instrumentsAfterPanel/getContractSellerCnt", {startDate:startDate, endDate:endDate}).done(function(ret){
                        var signed = accMul(ret["signed"],1);             //获取签约卖家客户数量
                        var one = accSub(signed,dealSellerCnt);           //q=0  (签约 - 成交)/签约
                        var two = accDiv(Math.round(accMul(accDiv(accSub(signed,dealSellerCnt),signed),10000)),100);
                        requestURL(dataService + "/instrumentsAfterPanel/getContractSellerCnt", {startDate:lastDatePeriod[0], endDate:lastDatePeriod[1]}).done(function(lastRet){
                            var lastSigned = accMul(lastRet["signed"],1);             //获取买家客户数量
                            var lastOne = accSub(lastSigned,dealSellerLastWkCnt);
                            var lastTwo = accDiv(Math.round(accMul(accDiv(accSub(lastSigned,dealSellerLastWkCnt),lastSigned),10000)),100);
                            var zCountTrend=getTrend(lastOne,one);
                            var zcRatioTrend=getTrend(lastTwo,two);
                            var zpRatioTrend=getTrend(1,1);

                            //获取数量值得最大位数,用来调整数字长度格式
                            var maxCount=_.max(clientCountArr);
                            var maxCountLength_new=_.max([maxCount,one]).toString().length;
                            //console.log("maxCountLength_new::"+maxCountLength_new);

                            var maxCountLength=_.max(clientCountArr).toString().length;
                            var maxProductLength=_.max(productRatioArr).toString().length;
                            var dataList=[];
                            _.each(criteriaArr,function(v,i,arr){
                                //获取本周和上周的趋势
                                var countTrend=getTrend(lastClientCountArr[i],clientCountArr[i]);
                                var cRatioTrend=getTrend(accDiv(lastClientCountArr[i],lastSigned),accDiv(clientCountArr[i],signed));
                                var splitChar=",";        //用于数值和趋势的拼接分割
                                var pRatioTrend=getTrend(lastProductRatioArr[i],productRatioArr[i]);
                                var clientRatio=(accDiv(Math.round(accMul(accDiv(clientCountArr[i],signed),10000)),100) + "%");

                                productRatioArr[i]=accDiv(productRatioArr[i],100) + "%";
                                //todo 后台拼？
                                dataList.push({
                                    "criteria": v,
                                    "count":formattedNumber(clientCountArr[i],maxCountLength_new) + splitChar + countTrend,
                                    "cRatio":formattedNumber(clientRatio,6) + splitChar + cRatioTrend,
                                    "pRatio":formattedNumber(productRatioArr[i],6) + splitChar + pRatioTrend});
                            });
                            dataList.unshift({
                                "criteria": "q=0",
                                "count":formattedNumber(one,maxCountLength_new) +","+zCountTrend,
                                "cRatio":formattedNumber(two+"%",6) +","+zcRatioTrend,
                                "pRatio":'0.00' +"%" +"&nbsp;&nbsp;"+"," +zpRatioTrend
                            });
                            showPanelOrLoading(['dealTable'],false);
                            if(instruments_panel.imPhone()){
                                drawDataTable("dealCountTable", dataList,[
                                    {
                                        field:'criteria',
                                        title:'物品数量分布　<a href="#" class="glyphicon glyphicon-question-sign" data-toggle="tooltip" data-placement="top" title="卖家成交物品数量分布（包含非标品、标品，非标品成交指：已与卖家结算；标品的成交指：买家已支付"></a>',
                                        width:"25%"
                                        /*sortable:true*/
                                    },
                                    {
                                        field:'count',
                                        title:'客户数　<a href="#" class="glyphicon glyphicon-question-sign" data-toggle="tooltip" data-placement="top" title="在此区域的卖家数量（包含非标品、标品，非标品成交指：已与卖家结算；标品的成交指：买家已支付）"></a>',
                                        width:"25%",
                                        formatter: operateFormatter
                                    },
                                    {
                                        field:'cRatio',
                                        title:'客户占比　<a href="#" class="glyphicon glyphicon-question-sign" data-toggle="tooltip" data-placement="top" title="在此区域的签约卖家占比（包含非标品、标品，非标品成交指：已与卖家结算；标品的成交指：买家已支付）"></a>',
                                        width:"25%",
                                        formatter: operateFormatter
                                        /*                sortable:true*/
                                    },
                                    {
                                        field:'pRatio',
                                        title:'物品占比　<a href="#" class="glyphicon glyphicon-question-sign" data-toggle="tooltip" data-placement="top" title="卖家成交物品数量分布（包含非标品、标品，非标品成交指：已与卖家结算；标品的成交指：买家已支付）"></a>',
                                        width:"25%",
                                        formatter: operateFormatter //自定义方法，添加操作按钮
                                        //events:operateEvents
                                    }

                                ],"dealAmountTable");
                            }else{
                                drawDataTable("dealCountTable", dataList,[
                                    {
                                        field:'criteria',
                                        title:'物品数量分布　<a href="#" class="glyphicon glyphicon-question-sign" data-toggle="tooltip" data-placement="top" title="卖家成交物品数量分布（包含非标品、标品，非标品成交指：已与卖家结算；标品的成交指：买家已支付"></a>',
                                        /*sortable:true*/
                                    },
                                    {
                                        field:'count',
                                        title:'客户数　<a href="#" class="glyphicon glyphicon-question-sign" data-toggle="tooltip" data-placement="top" title="在此区域的卖家数量（包含非标品、标品，非标品成交指：已与卖家结算；标品的成交指：买家已支付）"></a>',
                                        formatter: operateFormatter
                                    },
                                    {
                                        field:'cRatio',
                                        title:'客户占比　<a href="#" class="glyphicon glyphicon-question-sign" data-toggle="tooltip" data-placement="top" title="在此区域的签约卖家占比（包含非标品、标品，非标品成交指：已与卖家结算；标品的成交指：买家已支付）"></a>',
                                        formatter: operateFormatter
                                        /*                sortable:true*/
                                    },
                                    {
                                        field:'pRatio',
                                        title:'物品占比　<a href="#" class="glyphicon glyphicon-question-sign" data-toggle="tooltip" data-placement="top" title="卖家成交物品数量分布（包含非标品、标品，非标品成交指：已与卖家结算；标品的成交指：买家已支付）"></a>',
                                        formatter: operateFormatter //自定义方法，添加操作按钮
                                        //events:operateEvents
                                    }

                                ],"dealAmountTable");
                            }
                        });
                    });
                });
            });
        });
    });
    /*c.客户分布-竞得金额*/
};
//成交金额
var renderSuccessTradePrice = function(startDate,endDate){
    /*c.客户分布-成交金额*/
    var query={startDate:startDate, endDate:endDate};
    var intervalDays=getSomeDays(startDate, endDate)+1;
    var lastDatePeriod=getLastDatePeriod(startDate,endDate);      //上个周期的开始时间和结束时间
    var query1={startDate:lastDatePeriod[0], endDate:lastDatePeriod[1]};
    requestURL(dataService + "/instrumentsAfterPanel/getDealSellerCnt",{"startDate":startDate, "endDate":endDate}).done(function(curWkQuotedCnt){

        requestURL(dataService + "/instrumentsAfterPanel/getDealSellerCnt",{"startDate":lastDatePeriod[0], "endDate":lastDatePeriod[1]}).done(function(lastWkQuotedCnt){

            requestURL(dataService+"/instrumentsAfterPanel/getDealPrice",query).done(function(curWkData){

                requestURL(dataService+'/instrumentsAfterPanel/getDealPrice',query1).done(function(lastWkData){

                    var dealSellerCnt = curWkQuotedCnt['deal'];             //本期成交卖家数量
                    var dealSellerLastWkCnt = lastWkQuotedCnt["deal"];      //上期成交卖家数量
                    //&lt; 代表小于号
                    var criteriaArr=[
                        "0&lt;q&lt;=" + (20000*intervalDays).toLocaleString(),
                        (20000*intervalDays).toLocaleString() + "&lt;q&lt;=" + (200000*intervalDays).toLocaleString() ,
                        (200000*intervalDays).toLocaleString() + "&lt;q&lt;=" + (500000*intervalDays).toLocaleString() ,
                        "q>" + (500000*intervalDays).toLocaleString()];
                    var clientCountArr = curWkData["cnt"];              //本期成交客户数量
                    var priceRatioArr = curWkData["ratio"];             //本期成交 金额数量/总金额
                    //console.log(priceRatioArr);
                    var lastClientCountArr = lastWkData['cnt'];
                    var lastPriceRatioArr = lastWkData['ratio'];
                    requestURL(dataService + "/instrumentsAfterPanel/getContractSellerCnt", {startDate:startDate, endDate:endDate}).done(function(ret){
                        var signed = accMul(ret["signed"],1);             //获取签约卖家客户数量
                        var one = accSub(signed,dealSellerCnt);
                        var two = accDiv(Math.round(accMul(accDiv(accSub(signed,dealSellerCnt),signed),10000)),100);
                        //获取上期的客户数据
                        requestURL(dataService + "/instrumentsAfterPanel/getContractSellerCnt", {startDate:lastDatePeriod[0], endDate:lastDatePeriod[1]}).done(function(lastRet){
                            var lastSigned = accMul(lastRet["signed"],1);             //获取签约卖家客户数量
                            var lastOne = accSub(lastSigned,dealSellerLastWkCnt);     //签约卖家-成交卖家  q=0
                            var lastTwo = accDiv(Math.round(accMul(accDiv(accSub(lastSigned,dealSellerLastWkCnt),lastSigned),10000)),100);
                            var zCountTrend=getTrend(lastOne,one);
                            var zcRatioTrend=getTrend(lastTwo,two);
                            var zpRatioTrend=getTrend(1,1);

                            //获取数量值得最大位数,用来调整数字长度格式
                            var maxCount=_.max(clientCountArr);
                            var maxCountLength_new=_.max([maxCount,one]).toString().length;
                            //console.log("maxCountLength_new::"+maxCountLength_new);

                            var maxCountLength=_.max(clientCountArr).toString().length;
                            var maxPriceLength=_.max(priceRatioArr).toString().length;
                            var dataList=[];
                            _.each(criteriaArr,function(v,i,arr){
                                var countTrend=getTrend(lastClientCountArr[i],clientCountArr[i]);
                                //客户数量/签约客户数量得到客户占比
                                var cRatioTrend=getTrend(accDiv(lastClientCountArr[i],lastSigned),accDiv(clientCountArr[i],signed));

                                //物品金额/总金额（返回的结果已经进行过除法运算）
                                var pRatioTrend=getTrend(lastPriceRatioArr[i],priceRatioArr[i]);
                                var splitChar=",";      //用于数值和趋势的拼接分割
                                var clientRatio=(accDiv(Math.round(accMul(accDiv(clientCountArr[i],signed),10000)),100) + "%");

                                priceRatioArr[i]=accDiv(priceRatioArr[i],100) + "%";
                                dataList.push(
                                    {
                                        "criteria": v,
                                        "count":formattedNumber(clientCountArr[i],maxCountLength_new) + splitChar + countTrend,
                                        "cRatio":formattedNumber(clientRatio,6) + splitChar + cRatioTrend,
                                        "pRatio":formattedNumber(priceRatioArr[i],6)+ splitChar + pRatioTrend
                                    }
                                );
                            });
                            dataList.unshift({
                                "criteria": "q=0",
                                "count":one + "," + zCountTrend,
                                "cRatio":formattedNumber(two+"%",6)+"," + zcRatioTrend,
                                "pRatio":'0.00' + "%" + "&nbsp;&nbsp;" + "," + zpRatioTrend
                            });
                            showPanelOrLoading(['dealTable'],false);
                            if(instruments_panel.imPhone()){
                                drawDataTable("dealAmountTable", dataList,[
                                    {
                                        field:'criteria',
                                        title:'物品金额分布　<a href="#" class="glyphicon glyphicon-question-sign" data-toggle="tooltip" data-placement="top" title="卖家成交物品金额分布（包含非标品、标品，非标品成交指：已与卖家结算；标品的成交指：买家已支付）"></a>',
                                        width:"31%"
                                        /*sortable:true*/
                                    },
                                    {
                                        field:'count',
                                        title:'客户数　<a href="#" class="glyphicon glyphicon-question-sign" data-toggle="tooltip" data-placement="top" title="在此区域的卖家数量（包含代拍、标品）"></a>',
                                        width:"23%",
                                        formatter: operateFormatter
                                    },
                                    {
                                        field:'cRatio',
                                        title:'客户占比　<a href="#" class="glyphicon glyphicon-question-sign" data-toggle="tooltip" data-placement="top" title="在此区域的卖家数量占比（包含代拍、标品）"></a>',
                                        width:"23%",
                                        formatter: operateFormatter
                                        /*                sortable:true*/
                                    },
                                    {
                                        field:'pRatio',
                                        title:'金额占比　<a href="#" class="glyphicon glyphicon-question-sign" data-toggle="tooltip" data-placement="top" title="在此区域的卖家已结算物品金额占比（包含代拍、标品）"></a>',
                                        width:"23%",
                                        formatter: operateFormatter //自定义方法，添加操作按钮
                                        //events:operateEvents
                                    }

                                ],'dealCountTable');
                            }else{
                                drawDataTable("dealAmountTable", dataList,[
                                    {
                                        field:'criteria',
                                        title:'物品金额分布　<a href="#" class="glyphicon glyphicon-question-sign" data-toggle="tooltip" data-placement="top" title="卖家成交物品金额分布（包含非标品、标品，非标品成交指：已与卖家结算；标品的成交指：买家已支付）"></a>',
                                        /*sortable:true*/
                                    },
                                    {
                                        field:'count',
                                        title:'客户数　<a href="#" class="glyphicon glyphicon-question-sign" data-toggle="tooltip" data-placement="top" title="在此区域的卖家数量（包含代拍、标品）"></a>',
                                        formatter: operateFormatter
                                    },
                                    {
                                        field:'cRatio',
                                        title:'客户占比　<a href="#" class="glyphicon glyphicon-question-sign" data-toggle="tooltip" data-placement="top" title="在此区域的卖家数量占比（包含代拍、标品）"></a>',
                                        formatter: operateFormatter
                                        /*                sortable:true*/
                                    },
                                    {
                                        field:'pRatio',
                                        title:'金额占比　<a href="#" class="glyphicon glyphicon-question-sign" data-toggle="tooltip" data-placement="top" title="在此区域的卖家已结算物品金额占比（包含代拍、标品）"></a>',
                                        formatter: operateFormatter //自定义方法，添加操作按钮
                                        //events:operateEvents
                                    }
                                ],'dealCountTable');
                            }
                        });
                    });
                })
            })
        })
    })
};
//选择日期后判断当前哪个tab是激活状态，进行加载
var selectActiveTabToDraw = function(){
    //console.log(memoryActiveTab);
    showPanelOrLoading(['dealTable','bidTable'],true);
    switch(memoryActiveTab.first){
        case '成交量':
            renderSuccessTradeCount(memoryDate.startDate,memoryDate.endDate);
            break;
        case '成交金额':
            renderSuccessTradePrice(memoryDate.startDate,memoryDate.endDate);
            break;
        default:
            break;
    }

    switch(memoryActiveTab.second){
        case '竞得量':
            renderBidCount(memoryDate.startDate,memoryDate.endDate);
            break;
        case '竞得金额':
            renderBidPrice(memoryDate.startDate,memoryDate.endDate);
            break;
        default:
            break;
    }
};

/*2d 退货分析 */
var renderReturnDemand = function(startDate,endDate){
    var dateLength = getDateRangeLength(startDate,new Date(endDate).getNewDate(1),'day');       //时间差
    //console.log("退货分析时间差"+dateLength);
    var lastStartTime = new Date(startDate).getNewDate(-dateLength);
    var lastEndTime = new Date(endDate).getNewDate(-dateLength);
    requestURL(dataService+'/instrumentsAfterPanel/getReturnGoodsNum',{'startDate':startDate, 'endDate':endDate}).done(function(ret){
        var result = ret;
        var num = result.reject*1;                                                      //卖家退货量
        var pat = result.pat*1;                                                         //代拍质检完成的数量
        var rejectRate = accDiv(Math.round(accMul(accDiv(num,pat),10000)),100);         //退货数量比率
        var rejectAvg = Math.round(accDiv(num,1));                             //本期平均家退货量

        //设置退货量和退货量占比
        var param = {num:rejectAvg,percent:rejectRate,selector:'reject-good-analysis-num',int_selector:'reject-good-analysis-num-int',smart_selector:'reject-good-analysis-num-smart'};
        showPanelOrLoading(['returnInventoryPieChart'],false);
        setPassInData(param);

        requestURL(dataService+'/instrumentsAfterPanel/getReturnGoodsNum',{'startDate':lastStartTime, 'endDate':lastEndTime}).done(function(lastRet) {
            var lastResult = lastRet;
            var lastNum = lastResult.reject * 1;                                                        //上期卖家退货量
            var lastPat = lastResult.pat * 1;                                                           //上期代拍质检完成的数量

            //设置退货量环比及趋势
            var rejectNumCirclePercent = getCircleCompare(lastNum,num);                                       //退货量环比增幅
            var rejectNumCircleTrend = getCircleCompareTrend(lastNum,num);                                    //退货量环比趋势
            var trend = {num:rejectNumCirclePercent,trend:rejectNumCircleTrend,selector:'reject-good-analysis-num',int_selector:'reject-good-analysis-trend-num-int',smart_selector:'reject-good-analysis-trend-num-smart'};
            showPanelOrLoading(['returnInventoryPieChart'],false);
            setPassInTrend(trend);
        });
    });

    requestURL(dataService+'/instrumentsAfterPanel/getReturnGoodsMoney',{'startDate':startDate, 'endDate':endDate}).done(function(ret){
        var result = ret;
        var amount = result.amount*1;                                                                   //卖家退货金额
        var done = result.done*1;                                                                       //质检完成的金额
        var rejectMoneyRate = accDiv(Math.round(accMul(accDiv(amount,done),10000)),100);                //退货金额比率
        var rejectMoneyAvg = Math.round(accDiv(amount,1));                                     //本期平均家退货金额

        //设置退货量和退货量占比
        var param = {num:rejectMoneyAvg,percent:rejectMoneyRate,selector:'reject-good-analysis-money',int_selector:'reject-good-analysis-money-int',smart_selector:'reject-good-analysis-money-smart'};
        showPanelOrLoading(['returnInventoryPieChart'],false);
        setPassInData(param);

        requestURL(dataService+'/instrumentsAfterPanel/getReturnGoodsMoney',{'startDate':lastStartTime, 'endDate':lastEndTime}).done(function(lastRet) {
            var lastResult = lastRet;
            var lastAmount = lastResult.amount * 1;                                                              //上期卖家退货金额
            var lastDone = lastResult.done * 1;                                                                 //上期质检完成的金额

            //设置退货量环比及趋势
            var rejectMoneyCirclePercent = getCircleCompare(lastAmount,amount);                                       //退货金额环比增幅
            var rejectMoneyCircleTrend = getCircleCompareTrend(lastAmount,amount);                                    //退货金额环比趋势
            var trend = {num:rejectMoneyCirclePercent,trend:rejectMoneyCircleTrend,selector:'reject-good-analysis-money',int_selector:'reject-good-analysis-trend-money-int',smart_selector:'reject-good-analysis-trend-money-smart'};
            setPassInTrend(trend);
        });
    });

    requestURL(dataService+'/instrumentsAfterPanel/getReturnGoodsDoubleCircle',{'startDate':startDate, 'endDate':endDate}).done(function(ret) {
        var joinNum = ret.join_pat_money;               //参与竞拍的数量
        var withOutNum = ret.without_join_pat_money;    //未参与竞拍的数量
        var whole = accAdd(joinNum,withOutNum);
        var joinPercent = accDiv(Math.round(accMul(accDiv(joinNum,whole),10000)),100);
        //画环形图
        showPanelOrLoading(['returnInventoryPieChart'],false);
        drawDoublePieChart('returnInventoryFirstPieChart','returnInventorySecondPieChart',joinPercent);
    });

};
/*2d 退货分析  分布*/
var renderReturn = function(startDate, endDate){
    var dateQuery = getLastDatePeriod(startDate,endDate);
    /*买家退货*/
    requestURL(dataService + '/instrumentsPanel/getReturnBuyer',{"startDate": startDate,"endDate": endDate}).done(function(result){
        var rejectCount = accMul(result["cnt"],1);      //本期退货量
        var rejectMoney = accMul(result["amount"],1);   //本期退货金额
        var denyCount = accMul(result["deny_cnt"],1);   //
        var rejectRate = accDiv(Math.round(accMul(accDiv(denyCount,accAdd(rejectCount,denyCount)),10000)),100); //本期退货率

        requestURL(dataService + '/instrumentsPanel/getReturnBuyer',{"startDate": dateQuery[0],"endDate": dateQuery[1]}).done(function(ret){
            var lastRejectCount = accMul(ret["cnt"],1);     //上期退货量
            var lastRejectMoney = accMul(ret["amount"],1);  //上期退货金额
            var lastDenyCount = accMul(ret["deny_cnt"],1);  //
            var lastRejectRate = accDiv(Math.round(accMul(accDiv(lastDenyCount,accAdd(lastRejectCount,lastDenyCount)),10000)),100); //上期退货率

            //设置退货量，退货量占比，退货量环比
            var rejectCountCircle = getCircleCompare(lastRejectCount,rejectCount);
            var rejectCountTrend = getCircleCompareTrend(lastRejectCount,rejectCount);

            //获得出库量和出库金额 作为分母
            requestURL(dataService + '/instrumentsAfterPanel/getReturnDenominator',{"startDate": startDate,"endDate": endDate}).done(function(outData){

                //console.log("outData::");
                //console.log(outData);
                var shopOutNum = outData['shop_out_num'];
                var shopOutAmount = outData['shop_out_amount'];
                var rejectNumPercent = accDiv(Math.round(accMul(accDiv(rejectCount,shopOutNum),10000)),100);

                var rejectCountParam = {num:rejectCount,selector:'reject-cnt-buyer',percent:rejectNumPercent,int_selector:'reject-cnt-buyer-int',smart_selector:'reject-cnt-buyer-smart'};
                showPanelOrLoading(['returnReasonPieChart',false]);
                setPassInData(rejectCountParam);
                var rejectCountTrendParam = {trend:rejectCountTrend,selector:'reject-cnt-buyer',num:rejectCountCircle,int_selector:'reject-cnt-buyer-circle-int',smart_selector:'reject-cnt-buyer-circle-smart'};
                setPassInTrend(rejectCountTrendParam);

                //设置退货金额，退货金额占比，退货金额环比
                var rejectMoneyCircle = getCircleCompare(lastRejectMoney,rejectMoney);
                var rejectMoneyTrend = getCircleCompareTrend(lastRejectMoney,rejectMoney);
                var rejectMoneyPercent = accDiv(Math.round(accMul(accDiv(rejectMoney,shopOutAmount),10000)),100);
                var rejectMoneyParam = {num:rejectMoney,selector:'reject-amt-buyer',percent:rejectMoneyPercent,int_selector:'reject-amt-buyer-int',smart_selector:'reject-amt-buyer-smart'};
                setPassInData(rejectMoneyParam);
                var rejectMoneyTrendParam = {trend:rejectMoneyTrend,selector:'reject-amt-buyer',num:rejectMoneyCircle,int_selector:'reject-amt-buyer-circle-int',smart_selector:'reject-amt-buyer-circle-smart'};
                setPassInTrend(rejectMoneyTrendParam);

                //设置退货率 -- 退货率环比
                htmlPercentSet(rejectRate,'reject-deny-rate-int','reject-deny-rate-smart');
                var rejectRateCircle = getCircleCompare(lastRejectRate,rejectRate);
                var rejectRateTrend = getCircleCompareTrend(lastRejectRate,rejectRate);
                var rejectRateTrendParam = {trend:rejectRateTrend,selector:'reject-deny-rate',num:rejectRateCircle,int_selector:'reject-deny-rate-trend-int',smart_selector:'reject-deny-rate-trend-smart'};
                setPassInTrend(rejectRateTrendParam);
            });
        });
    });

    /*买家退货原因pie chart*/
    requestURL(dataService+'/instrumentsPanel/getReturnReasonBuyer',{"startDate": startDate,"endDate": endDate}).done(function(curData){
        requestURL(dataService+'/instrumentsPanel/getReturnReasonBuyer',{"startDate": dateQuery[0],"endDate":dateQuery[1]}).done(function(lastData){
            var legendArr=_.keys(curData);
            var dataArr=[], trend;
            _.each(curData,function(v,k){
                trend= lastData[k]? getTrend(lastData[k],curData[k]) : "up";//判断上个周期是否有这个退货原因
                dataArr.push({"value": v,"name": k,"trend":trend })
            });
            var sum=_.reduce(dataArr,function(memo,v){return v.value+memo},0);
            var sortedDataArr=_.sortBy(dataArr,function(v,k){return -v.value});
            //{orient:'vertical',x:'right',y:'center'}
            showPanelOrLoading(['returnReasonPieChart',false]);
            drawPieChart("returnReasonPieChart","退货原因分布",sortedDataArr,legendArr,{orient: 'horizontal',bottom: '0%'})
        })
    })
};

/*2e 供需比   -- 比较特殊，要穿参数为后一天的*/
var renderSupplyDemand = function(startDate,endDate){
    //console.log(startDate +"--"+ endDate);
    var dateArray = getDateRangeArray(startDate,new Date(endDate).getNewDate(1),'day');
    //console.log(dateArray);
    var dateLength = getDateRangeLength(startDate,new Date(endDate).getNewDate(1),'day');       //时间差
    //console.log(dateLength);
    requestURL(dataService+'/instrumentsPanel/getSupplyDemandData',{'startDate':startDate, 'endDate':endDate}).done(function(ret){
        var result = ret;
        var supply=_.reduce(result,function(memo,ele){
            return memo + ele.supply*1;
        },0);
        var demand=_.reduce(result,function(memo,ele){
            return memo + ele.demand*1;
        },0);
        var supplyAvg = Math.round(accDiv(supply,dateLength));                  //本期平均卖家上拍
        var demandAvg = Math.round(accDiv(demand,dateLength));                  //本期平均买家竞拍
        var supComDemAvg = accDiv(Math.round(accMul(accDiv(demand,supply),100)),100);   //本期平均供需比

        var dateArr=[];
        var dataArr=[];
        var dateMap = new Map();
        var supComDemAvgArr = [];
        _.each(_.sortBy(result,function(v,k){return v.date}),function(v,k){
            dateArr.push(v.date);
            dataArr.push(accDiv(Math.round(accMul(accDiv(v.demand,v.supply),100)),100));
            dateMap.set(v.date,{"supply":v.supply,"demand":v.demand});
            supComDemAvgArr.push(supComDemAvg);
        });
        if(dateArr.length < dateArray.length){
            _.each(dateArray,function(ele){
                if(!dateArr.contains(ele)){
                    dateArr.push(ele);
                    dataArr.push(0.0);
                    dateMap.set(ele,{"supply":0,"demand":0});
                    supComDemAvgArr.push(supComDemAvg);
                }
            });
        }

        var lastStartTime = new Date(startDate).getNewDate(-dateLength);
        var lastEndTime = new Date(endDate).getNewDate(-dateLength);
        //console.log(lastStartTime +"--"+ lastEndTime);
        requestURL(dataService+'/instrumentsPanel/getSupplyDemandData',{"startDate": lastStartTime,"endDate":lastEndTime}).done(function(lastResult){
            var lastSupply = 0;     //上期平均卖家上拍 sum
            var lastDemand = 0;     //上期平均买家上拍 sum
            _.each(lastResult,function(ele){
                lastSupply += ele.supply*1;
                lastDemand += ele.demand*1;
            });
            var lastSupplyAvg = Math.round(accDiv(lastSupply,dateLength));
            var lastDemandAvg = Math.round(accDiv(lastDemand,dateLength));
            var lastSupComDemAvg = accDiv(Math.round(accMul(accDiv(lastDemand,lastSupply),100)),100);

            //设置平均卖家上拍
            var supCirclePercent = getCircleCompare(lastSupply,supply);
            var supCircleTrend = getCircleCompareTrend(lastSupply,supply);
            var supTrendJoinNum = {num:supplyAvg,percent:supCirclePercent,trend:supCircleTrend,selector:'supply-compare-num',int_selector:'supply-compare-trend-int',smart_selector:'supply-compare-trend-smart'};

            showPanelOrLoading(['supplyDemandLineChart'],false);

            drawLineChart("supplyDemandLineChart",['供需比','平均线'],['供需比','平均线'],dataArr,dateArr,dateMap,supComDemAvgArr);

            setCartData(supTrendJoinNum);

            //设置平均买家上拍
            var demCirclePercent = getCircleCompare(lastDemand,demand);
            var demCircleTrend = getCircleCompareTrend(lastDemand,demand);
            var demTrendJoinNum = {num:demandAvg,percent:demCirclePercent,trend:demCircleTrend,selector:'demand-compare-num',int_selector:'demand-compare-trend-int',smart_selector:'demand-compare-trend-smart'};
            setCartData(demTrendJoinNum);

            //设置平均供需比
            var supComDemCirclePercent = getCircleCompare(lastSupComDemAvg,supComDemAvg);
            var supComDemCircleTrend = getCircleCompareTrend(lastSupComDemAvg,supComDemAvg);
            var supComDemTrendJoinNum = {num:supComDemAvg,percent:supComDemCirclePercent,trend:supComDemCircleTrend,selector:'supply-demand-compare-num',int_selector:'supply-demand-compare-trend-int',smart_selector:'supply-demand-compare-trend-smart',num_int_selector:'supply-demand-compare-num-int',num_smart_selector:'supply-demand-compare-num-smart'};
            setPercentCartData(supComDemTrendJoinNum);
        })
    })

};
/*2e 供需比  分布*/
var renderSupplyDemandSkuLevel = function(startDate, endDate){
    var dateQuery = getLastDatePeriod(startDate,endDate);
    requestURL(dataService+'/instrumentsAfterPanel/getSupplyDemandRatioDistribution',{"startDate": startDate,"endDate": endDate}).done(function(curData){
        var supplyMap = curData[0];
        var requireMap = curData[1];

        //供需比为   需求量/供货量   如果仅仅存在于supplyMap 不存在于requireMap,则需求量为 0 则供需比为 0 ，
        // 如果仅仅存在于requireMap,不存在于supplyMap的话，则供货量为0，供需比为正无穷大，>1
        var supplySkuLevel = _.keys(supplyMap);
        var requireSkuLevel = _.keys(requireMap);
        //var onlyInSup = _.difference(supplySkuLevel, requireSkuLevel);//求供需比小于 0 的
        var onlyInReq = _.difference(requireSkuLevel, supplySkuLevel);
        var joinKey = _.intersection(supplySkuLevel, requireSkuLevel);
        var rowOne = 0,rowTwo = 0,rowThree = 0,rowFour = 0,rowFive = onlyInReq.length;
        _.each(joinKey,function(ele){
            var rate = accDiv(requireMap[ele],supplyMap[ele]);
            if(rate>0 && rate<=0.1){
                rowOne++;
            }else if(rate>0.1 && rate<=0.3){
                rowTwo++;
            }else if(rate>0.3 && rate<=0.5){
                rowThree++;
            }else if(rate>0.5 && rate<=1){
                rowFour++;
            }else if(rate>1){
                rowFive++;
            }
        });
        //console.log(rowOne+","+rowTwo+","+rowThree+","+rowFour+","+rowFive);
        /*var size = joinKey.length;*/
        /*var rowOnePercent = accDiv(rowOne,size);        //供需比(0,0.1]  所占比例
        var rowTwoPercent = accDiv(rowTwo,size);        //供需比(0.0,0.3]  所占比例
        var rowThreePercent = accDiv(rowThree,size);    //供需比(0.3,0.5]  所占比例
        var rowFourPercent = accDiv(rowFour,size);      //供需比(0.5,1]  所占比例
        var rowFivePercent = accDiv(rowFive,size);      //供需比(1,~]  所占比例*/

        var legendArr=['0<r<=0.1','0.1<r<=0.3','0.3<r<=0.5','0.5<r<=1','r>1'];
        var appendData = {'0<r<=0.1':rowOne,'0.1<r<=0.3':rowTwo,'0.3<r<=0.5':rowThree,'0.5<r<=1':rowFour,'r>1':rowFive};

        requestURL(dataService+'/instrumentsAfterPanel/getSupplyDemandRatioDistribution',{"startDate": dateQuery[0],"endDate":dateQuery[1]}).done(function(lastData){
            var lastSupplyMap = lastData[0];
            var lastRequireMap = lastData[1];
            //供需比为   需求量/供货量   如果仅仅存在于supplyMap 不存在于requireMap,则需求量为 0 则供需比为 0 ，
            // 如果仅仅存在于requireMap,不存在于supplyMap的话，则供货量为0，供需比为正无穷大，>1
            var lastSupplySkuLevel = _.keys(lastSupplyMap);
            var lastRequireSkuLevel = _.keys(lastRequireMap);
            //var onlyInSup = _.difference(supplySkuLevel, requireSkuLevel);//求供需比小于 0 的
            var lastOnlyInReq = _.difference(lastRequireSkuLevel, lastSupplySkuLevel);
            var lastJoinKey = _.intersection(lastSupplySkuLevel, lastRequireSkuLevel);
            var lastRowOne = 0,lastRowTwo = 0,lastRowThree = 0,lastRowFour = 0,lastRowFive = lastOnlyInReq.length;
            _.each(lastJoinKey,function(ele){
                var rate = accDiv(lastRequireMap[ele],lastSupplyMap[ele]);
                if(rate>0 && rate<=0.1){
                    lastRowOne++;
                }else if(rate>0.1 && rate<=0.3){
                    lastRowTwo++;
                }else if(rate>0.3 && rate<=0.5){
                    lastRowThree++;
                }else if(rate>0.5 && rate<=1){
                    lastRowFour++;
                }else if(rate>1){
                    lastRowFive++;
                }
            });
            //console.log(lastRowOne+","+lastRowTwo+","+lastRowThree+","+lastRowFour+","+lastRowFive);
            var lastAppendData = {
                '0<r<=0.1':lastRowOne,
                '0.1<r<=0.3':lastRowTwo,
                '0.3<r<=0.5':lastRowThree,
                '0.5<r<=1':lastRowFour,
                'r>1':lastRowFive
            };
            //var lastSupplyMap = lastData.supplyMap;
            //var lastRequireList = lastData.requireList;
            //var legendArr=_.keys(curData);
            var dataArr=[], trend;
            _.each(appendData,function(v,k){
                trend= lastAppendData[k] ? getTrend(lastAppendData[k],appendData[k]) : "up";//判断上个周期是否有这个退货原因
                dataArr.push({"value": v,"name": k,"trend":trend })
            });
            //var sum=_.reduce(dataArr,function(memo,v){return v.value+memo},0);
            var sortedDataArr=_.sortBy(dataArr,function(v,k){return -v.value});
            showPanelOrLoading(['supplyDemandPieChart'],false);
            drawPieChart("supplyDemandPieChart","供需比分布",sortedDataArr,legendArr,{orient: 'horizontal',bottom: '0%'});
        })
    })
};
/*2e 供需比  分布 --SQL优化升级 加强版 Pro*/
var renderSupplyDemandSkuLevelPro = function(startDate, endDate){
    var dateQuery = getLastDatePeriod(startDate,endDate);
    requestURL(dataService+'/instrumentsAfterPanel/getSupplyDemandRatioDistributionPro',{"startDate": startDate,"endDate": endDate}).done(function(curData){
        var curRowOne = 0,curRowTwo = 0,curRowThree = 0,curRowFour = 0/*curRowFive = 0*/;
        curRowOne = accMul(curData['rowOne'],1);
        curRowTwo = accMul(curData['rowTwo'],1);
        curRowThree = accMul(curData['rowThree'],1);
        curRowFour = accMul(curData['rowFour'],1);
        //curRowFive = accMul(curData['rowFive'],1);

        //console.log(curRowOne+","+curRowTwo+","+curRowThree+","+curRowFour+","+curRowFive);

        var legendArr=['0<=r<1','1<=r<3','3<=r<5','5<=r'];
        var appendData = {'0<=r<1':curRowOne,'1<=r<3':curRowTwo,'3<=r<5':curRowThree,'5<=r':curRowFour};

        requestURL(dataService+'/instrumentsAfterPanel/getSupplyDemandRatioDistributionPro',{"startDate": dateQuery[0],"endDate":dateQuery[1]}).done(function(lastData){

            var lastRowOne = 0,lastRowTwo = 0,lastRowThree = 0,lastRowFour = 0/*lastRowFive = 0*/;
            lastRowOne = accMul(lastData['rowOne'],1);
            lastRowTwo = accMul(lastData['rowTwo'],1);
            lastRowThree = accMul(lastData['rowThree'],1);
            lastRowFour = accMul(lastData['rowFour'],1);
            //lastRowFive = accMul(lastData['rowFive'],1);
            //console.log(lastRowOne+","+lastRowTwo+","+lastRowThree+","+lastRowFour+","+lastRowFive);
            var lastAppendData = {
                '0<=r<1':lastRowOne,
                '1<=r<3':lastRowTwo,
                '3<=r<5':lastRowThree,
                '5<=r':lastRowFour
            };
            var dataArr=[], trend;
            _.each(appendData,function(v,k){
                trend= lastAppendData[k] ? getTrend(lastAppendData[k],appendData[k]) : "up";//判断上个周期是否有这个退货原因
                dataArr.push({"value": v,"name": k,"trend":trend })
            });
            var sortedDataArr=_.sortBy(dataArr,function(v,k){return -v.value});
            showPanelOrLoading(['supplyDemandPieChart'],false);
            drawPieChart("supplyDemandPieChart","供需比分布",sortedDataArr,legendArr,{orient: 'horizontal',bottom: '0%'});
        })
    })
};


/*c 流拍分析*/
var renderPassIn = function(obj,startDate,endDate){
    var dateArray = getDateRangeArray(startDate,new Date(endDate).getNewDate(1),'day');
    var dateLength = getDateRangeLength(startDate,new Date(endDate).getNewDate(1),'day');       //时间差
    //console.log(dateArray);
    //console.log(dateLength);
    var lastStartTime = new Date(startDate).getNewDate(-dateLength);
    var lastEndTime = new Date(endDate).getNewDate(-dateLength);
    //每日流拍
    requestURL(dataService+"/instrumentsAfterPanel/getPassInAnalysisChartDataPro", {serviceLineId:obj.serviceLineId,categoryId:obj.categoryId,brandId:obj.brandId,modelId:obj.modelId,startTime:obj.startTime,endTime:obj.endTime}).done(function (curData) {
        //渲染面积图
        var supNum = 0;                     //本期供货量之和
        var passNum = 0;                    //本期流拍量之和
        _.each(curData,function(ele){
            supNum = accAdd(supNum,accMul(ele.supply,1));
            passNum = accAdd(passNum,accMul(ele.pass,1));
        });

        var passRateAvg = accDiv(Math.round(accMul(accDiv(passNum,supNum),10000)),100);     //本期平均流拍比例
        var supAvg = Math.round(accDiv(supNum,dateLength));                                 //本期平均供货量
        var passAvg = Math.round(accDiv(passNum,dateLength));                               //本期平均流拍量
        var dateArr=[];
        var dataArr=[];
        var dateMap = new Map();                     //
        var supComPassAvgArr = [];                   //本期平均线数组
        var curKeyData = _.pluck(curData, 'date');
        if(curData.length < dateArray.length){
            _.each(dateArray,function(ele){
                if(!curKeyData.contains(ele)){
                    curData.push({'date':ele,'supply':0,'pass':0});
                }
            });
        }

        _.each(_.sortBy(curData,function(v,k){return v.date}),function(v,k){
            dateArr.push(v.date);
            dataArr.push(accDiv(Math.round(accMul(accDiv(v.pass,v.supply),10000)),100));
            dateMap.set(v.date,{supply:v.supply,pass:v.pass});
            supComPassAvgArr.push(passRateAvg);
        });


        //上期每日流拍
        requestURL(dataService+"/instrumentsAfterPanel/getPassInAnalysisChartDataPro", {serviceLineId:obj.serviceLineId,categoryId:obj.categoryId,brandId:obj.brandId,modelId:obj.modelId,startTime:lastStartTime,endTime:lastEndTime}).done(function (lastData) {

            var lastSupNum = 0;                     //上期供货量之和
            var lastPassNum = 0;                    //上期流拍量之和
            _.each(lastData,function(ele){
                lastSupNum = accAdd(lastSupNum,accMul(ele.supply,1));
                lastPassNum = accAdd(lastPassNum,accMul(ele.pass,1));
            });

            var lastPassRateAvg = accDiv(Math.round(accMul(accDiv(lastPassNum,lastSupNum),10000)),100);     //上期平均流拍比例
            var lastSupAvg = Math.round(accDiv(lastSupNum,dateLength));                                     //上期平均供货量
            var lastPassAvg = Math.round(accDiv(lastPassNum,dateLength));                                   //上期平均流拍量

            var passCircleRate = getCircleCompare(lastPassAvg,passAvg);                                     //平均每日流拍量环比
            var passCircleTrend = getCircleCompareTrend(lastPassAvg,passAvg);                               //平均每日流拍量环比趋势

            //设置平均每日流拍量 + 流拍量占比  + 环比  + 趋势
            //设置平均每日流拍量 + 流拍量占比  + 环比  + 趋势
            var param = {num:passAvg,percent:passRateAvg,selector:'pass-in-num',int_selector:'pass-in-percent-int',smart_selector:'pass-in-percent-smart'};
            setPassInData(param);
            var trend = {num:passCircleRate,trend:passCircleTrend,selector:'pass-in-trend-percent',int_selector:'pass-in-trend-percent-int',smart_selector:'pass-in-trend-percent-smart'};
            setPassInTrend(trend);

            showPanelOrLoading(['passInChart'],false);
            drawPassInLineChart("passInChart",['每日流拍比例','平均线'],['每日流拍比例','平均线'],dataArr,dateArr,dateMap,supComPassAvgArr);
        });


        //首日流拍
        requestURL(dataService+"/instrumentsAfterPanel/getFirstPassInAnalysisChartDataPro", {serviceLineId:obj.serviceLineId,categoryId:obj.categoryId,brandId:obj.brandId,modelId:obj.modelId,startTime:obj.startTime,endTime:obj.endTime}).done(function (curFData) {
            var firstDayPassNum = accMul(curFData,1);                                   //本期 周期内流拍总量
            var firstDayPassNumAvg = Math.round(accDiv(firstDayPassNum,dateLength));    //本期 周期内流拍平均数
            var firstDayPassNumRate = accDiv(Math.round(accMul(accDiv(firstDayPassNumAvg,supAvg),10000)),100);  //本期平均首日流拍占比
            //上期首日流拍
            requestURL(dataService+"/instrumentsAfterPanel/getFirstPassInAnalysisChartDataPro", {serviceLineId:obj.serviceLineId,categoryId:obj.categoryId,brandId:obj.brandId,modelId:obj.modelId,startTime:lastStartTime,endTime:lastEndTime}).done(function (lastFData) {
                var lastFirstDayPassNum = accMul(lastFData,1);
                var lastFirstDayPassNumAvg = Math.round(accDiv(lastFirstDayPassNum,dateLength));    //本期 周期内流拍平均数
                //首日流拍环比和趋势
                var firstPassCircleRate = getCircleCompare(lastFirstDayPassNumAvg,firstDayPassNumAvg);        //平均每日流拍量环比
                var firstPassCircleTrend = getCircleCompareTrend(lastFirstDayPassNumAvg,firstDayPassNumAvg);   //平均每日流拍量环比趋势

                var param = {num:firstDayPassNumAvg,percent:firstDayPassNumRate,selector:'first-pass-in-num',int_selector:'first-pass-in-percent-int',smart_selector:'first-pass-in-percent-smart'};
                setPassInData(param);
                var trend = {num:firstPassCircleRate,trend:firstPassCircleTrend,selector:'first-pass-in-trend-percent',int_selector:'first-pass-in-trend-percent-int',smart_selector:'first-pass-in-trend-percent-smart'};
                setPassInTrend(trend);
            });
        });
    });

};

/*库龄分析*/
var renderStockLineDemand = function(obj,startDate,endDate){
    var dateArray = getDateRangeArray(startDate,new Date(endDate).getNewDate(1),'day');
    var dateLength = getDateRangeLength(startDate,new Date(endDate).getNewDate(1),'day');       //时间差
    var lastStartTime = new Date(startDate).getNewDate(-dateLength);
    var lastEndTime = new Date(endDate).getNewDate(-dateLength);

    requestURL(dataService+'/instrumentsAfterPanel/getStockChartData',{serviceLineId:obj.serviceLineId,categoryId:obj.categoryId,brandId:obj.brandId,modelId:obj.modelId,startTime:obj.startTime,endTime:obj.endTime,lastStartTime:lastStartTime,lastEndTime:lastEndTime}).done(function(ret){
        var result = ret;
        var curData = JSON.parse(result['curData']);

        var curAllNum = 0;
        _.each(curData,function(ele){
            curAllNum = accAdd(accMul(ele.count_pn,1),curAllNum);
        });
        var stockAvg = Math.round(accDiv(curAllNum,dateLength));                  //本期平均库存量

        var dateArr=[];
        var dataArr=[];
        var dateMap = new Map();
        var stockAvgArr = [];
        var curKeyData = _.pluck(curData, 'created_dt');
        if(curData.length < dateArray.length){
            _.each(dateArray,function(ele){
                if(!curKeyData.contains(ele)){
                    curData.push({'created_dt':ele,'count_pn':0});
                }
            });
        }

        _.each(_.sortBy(curData,function(v,k){return v.created_dt}),function(v,k){
            dateArr.push(v.created_dt);
            dataArr.push(accMul(v.count_pn,1));
            dateMap.set(v.created_dt,{stock:accMul(v.count_pn,1)});
            stockAvgArr.push(stockAvg);
        });

        //获取上一期的数据
        var lastData = JSON.parse(result['lastData']);
        var lastAllNum = 0;
        _.each(lastData,function(ele){
            lastAllNum = accAdd(accMul(ele.count_pn,1),lastAllNum);
        });
        var lastStockAvg = Math.round(accDiv(lastAllNum,dateLength));                  //上期平均库存量

        //设置平均库存量环比
        var stockCirclePercent = getCircleCompare(lastStockAvg,stockAvg);
        var stockCircleTrend = getCircleCompareTrend(lastStockAvg,stockAvg);
        //console.log("lastStockAvg:"+lastStockAvg);
        //console.log("stockAvg:"+stockAvg);

        htmlNumSet(stockAvg,'stock-line-num');
        htmlTrendSet('stock-line-num',stockCircleTrend);
        htmlPercentSet(stockCirclePercent,'stock-line-trend-int','stock-line-trend-smart');
        showPanelOrLoading(['stockLineChart'],false);
        drawStockLineChart("stockLineChart",['每日库存数量','平均线'],['每日库存数量','平均线'],dataArr,dateArr,dateMap,stockAvgArr);
    });


    //平均库龄
    requestURL(dataService+'/instrumentsAfterPanel/getStockAgeData',{serviceLineId:obj.serviceLineId,categoryId:obj.categoryId,brandId:obj.brandId,modelId:obj.modelId,startTime:obj.startTime,endTime:obj.endTime,lastStartTime:lastStartTime,lastEndTime:lastEndTime}).done(function(ret){
        var curData = JSON.parse(ret['curData']);

        var lastData = JSON.parse(ret['lastData']);


        var curStockAge = curData.stock_age;   //本期库龄之和

        var lastStockAge = lastData.stock_age;   //上期库龄之和

        //var curAvgStockAge = accDiv(Math.round(accMul(accDiv(curStockAge,dateLength),10)),10);   //平均库龄
        var curAvgStockAge = accDiv(Math.round(accMul(accDiv(curStockAge,1),10)),10);   //平均库龄

        //var lastAvgStockAge = accDiv(Math.round(accMul(accDiv(lastStockAge,dateLength),10)),10);   //平均库龄
        var lastAvgStockAge = accDiv(Math.round(accMul(accDiv(lastStockAge,1),10)),10);   //平均库龄
        //console.log("平均库龄："+curAvgStockAge);

        htmlNumSet(curAvgStockAge,'stock-line-hour');

        //设置平均库存量环比
        var stockHourCirclePercent = getCircleCompare(lastAvgStockAge,curAvgStockAge);
        var stockHourCircleTrend = getCircleCompareTrend(lastAvgStockAge,curAvgStockAge);
        htmlTrendSet('stock-line-hour',stockHourCircleTrend);
        htmlPercentSet(stockHourCirclePercent,'stock-line-hour-trend-int','stock-line-hour-trend-smart');
    });

};

/*d 卖家确认情况分析*/
var renderSellerConfirm = function(obj,startDate,endDate){
    var dateArray = getDateRangeArray(startDate,new Date(endDate).getNewDate(1),'day');
    var dateLength = getDateRangeLength(startDate,new Date(endDate).getNewDate(1),'day');       //时间差

    if(obj.serviceLineId == 2 || obj.serviceLineId == '2'){
        var dateArr = [];
        var dataArr = [];
        var dateMap = new Map();                                                                        //
        var inspectCompConfirmAvgArr = [];                                                              //本期平均线数组

        _.each(dateArray,function(ele){
            dateArr.push(ele);
            inspectCompConfirmAvgArr.push(0);
            dateMap.set(ele,{inspect:0,confirm:0});
            dataArr.push(0.00);
        });

        var param = {num:0,percent:0,selector:'confirm-num',int_selector:'confirm-num-percent-int',smart_selector:'confirm-num-percent-smart'};
        setPassInData(param);
        var trend = {num:0,trend:2,selector:'confirm-num',int_selector:'confirm-num-trend-int',smart_selector:'confirm-num-trend-smart'};
        setPassInTrend(trend);

        var hourParam = {num:0,percent:-1,selector:'confirm-hour'};
        setPassInData(hourParam);
        var hourTrend = {num:0,trend:2,selector:'confirm-hour',int_selector:'confirm-hour-trend-int',smart_selector:'confirm-hour-trend-smart'};
        setPassInTrend(hourTrend);

        showPanelOrLoading(['sellerConfirmChart'],false);
        drawConfirmLineChart("sellerConfirmChart",['每日确认比例','平均线'],['每日确认比例','平均线'],dataArr,dateArr,dateMap,inspectCompConfirmAvgArr);
    }else{
        //console.log(dateArray);
        //console.log(dateLength);
        var lastStartTime = new Date(startDate).getNewDate(-dateLength);
        var lastEndTime = new Date(endDate).getNewDate(-dateLength);
        //卖家每日确认量：
        requestURL(dataService+"/instrumentsAfterPanel/getSellerMakeSureJoinCheckNum", {serviceLineId:obj.serviceLineId,categoryId:obj.categoryId,brandId:obj.brandId,modelId:obj.modelId,startTime:obj.startTime,endTime:obj.endTime}).done(function (curData) {
            //渲染面积图
            var inspectMap = curData['inspect'];
            var confirmMap = curData['confirm'];

            var inspectNum = 0;                     //本期质检量之和
            var confirmNum = 0;                    //本期确认量之和
            _.each(inspectMap,function(ele){
                inspectNum = accAdd(inspectNum,accMul(ele,1));
            });

            _.each(confirmMap,function(ele){
                confirmNum = accAdd(confirmNum,accMul(ele,1));
            });

            var confirmRateAvg = accDiv(Math.round(accMul(accDiv(confirmNum,inspectNum),10000)),100);       //本期平均确认比例
            var inspectAvg = Math.round(accDiv(inspectNum,dateLength));                                     //本期平均质检量
            var confirmAvg = Math.round(accDiv(confirmNum,dateLength));                                     //本期平均确认量
            var dateArr = [];
            var dataArr = [];
            var dateMap = new Map();                                                                        //
            var inspectCompConfirmAvgArr = [];                                                              //本期平均线数组
            _.each(dateArray,function(ele){
                dateArr.push(ele);
                inspectCompConfirmAvgArr.push(confirmRateAvg);
                if(inspectMap.hasOwnProperty(ele) && confirmMap.hasOwnProperty(ele)){
                    dateMap.set(ele,{inspect:inspectMap[ele],confirm:confirmMap[ele]});
                    dataArr.push(accDiv(Math.round(accMul(accDiv(confirmMap[ele],inspectMap[ele]),10000)),100));
                }else if(inspectMap.hasOwnProperty(ele) && !confirmMap.hasOwnProperty(ele)){
                    dateMap.set(ele,{inspect:inspectMap[ele],confirm:0});
                    dataArr.push(0.00);
                }else if(!inspectMap.hasOwnProperty(ele) && confirmMap.hasOwnProperty(ele)){
                    dateMap.set(ele,{inspect:0,confirm:confirmMap[ele]});
                    dataArr.push(Number.POSITIVE_INFINITY);
                }else{
                    dateMap.set(ele,{inspect:0,confirm:0});
                    dataArr.push(0.00);
                }
            });
            //上期卖家每日确认量：
            requestURL(dataService+"/instrumentsAfterPanel/getSellerMakeSureJoinCheckNum", {serviceLineId:obj.serviceLineId,categoryId:obj.categoryId,brandId:obj.brandId,modelId:obj.modelId,startTime:lastStartTime,endTime:lastEndTime}).done(function (lastData) {
                var lastInspectMap = lastData['inspect'];
                var lastConfirmMap = lastData['confirm'];

                var lastInspectNum = 0;                     //上期质检量之和
                var lastConfirmNum = 0;                    //上期确认量之和
                _.each(lastInspectMap,function(ele){
                    lastInspectNum = accAdd(lastInspectNum,accMul(ele,1));
                });

                _.each(lastConfirmMap,function(ele){
                    lastConfirmNum = accAdd(lastConfirmNum,accMul(ele,1));
                });

                var lastConfirmRateAvg = accDiv(Math.round(accMul(accDiv(lastConfirmNum,lastInspectNum),10000)),100);       //上期平均确认比例
                var lastInspectAvg = Math.round(accDiv(lastInspectNum,dateLength));                                         //上期平均质检量
                var lastConfirmAvg = Math.round(accDiv(lastConfirmNum,dateLength));                                         //上期平均确认量

                var confirmCircleRate = getCircleCompare(lastConfirmAvg,confirmAvg);                                        //平均每日确认量环比
                var confirmCircleTrend = getCircleCompareTrend(lastConfirmAvg,confirmAvg);                                  //平均每日确认量环比趋势



                //设置平均每日确认量 + 时长  + 环比  + 趋势
                //设置平均每日确认量 + 时长  + 环比  + 趋势
                var param = {num:confirmAvg,percent:confirmRateAvg,selector:'confirm-num',int_selector:'confirm-num-percent-int',smart_selector:'confirm-num-percent-smart'};
                setPassInData(param);
                var trend = {num:confirmCircleRate,trend:confirmCircleTrend,selector:'confirm-num',int_selector:'confirm-num-trend-int',smart_selector:'confirm-num-trend-smart'};
                setPassInTrend(trend);

                showPanelOrLoading(['sellerConfirmChart'],false);
                drawConfirmLineChart("sellerConfirmChart",['每日确认比例','平均线'],['每日确认比例','平均线'],dataArr,dateArr,dateMap,inspectCompConfirmAvgArr);

                //确认时长
                requestURL(dataService+"/instrumentsAfterPanel/getConfirmHourLength", {serviceLineId:obj.serviceLineId,categoryId:obj.categoryId,brandId:obj.brandId,modelId:obj.modelId,startTime:obj.startTime,endTime:obj.endTime}).done(function (curFData) {
                    var confirmHourNum = accMul(curFData,1);                                                          //本期 周期内确认时长总数
                    //console.log("confirmHourNum:"+confirmHourNum);
                    //console.log("confirmHourNumAvg:"+accDiv(confirmHourNum,dateLength));

                    var confirmHourNumAvg = accDiv(Math.round(accMul(accDiv(confirmHourNum,dateLength * confirmAvg),10)),10);     //本期 周期内认时长平均数

                    //上期确认时长：
                    requestURL(dataService+"/instrumentsAfterPanel/getConfirmHourLength", {serviceLineId:obj.serviceLineId,categoryId:obj.categoryId,brandId:obj.brandId,modelId:obj.modelId,startTime:lastStartTime,endTime:lastEndTime}).done(function (lastFData) {
                        var lastConfirmHourNum = accMul(lastFData,1);
                        var lastConfirmHourNumAvg = Math.round(accDiv(lastConfirmHourNum,dateLength * lastConfirmAvg));         //本期 周期内确认时长平均数
                        //确认时长：环比和趋势
                        var confirmHourCircleRate = getCircleCompare(lastConfirmHourNumAvg,confirmHourNumAvg);            //平均确认时长环比
                        var confirmHourCircleTrend = getCircleCompareTrend(lastConfirmHourNumAvg,confirmHourNumAvg);      //平均确认时长环比趋势

                        var hourParam = {num:confirmHourNumAvg,percent:-1,selector:'confirm-hour'};
                        setPassInData(hourParam);
                        var hourTrend = {num:confirmHourCircleRate,trend:confirmHourCircleTrend,selector:'confirm-hour',int_selector:'confirm-hour-trend-int',smart_selector:'confirm-hour-trend-smart'};
                        setPassInTrend(hourTrend);
                    });
                });

            });

        });
    }
};

/**
 绘制漏斗图
 @param {string} chartId 图表 id
 @param {string} titleText 图表标题
 @param {Array} showDataArr 用于显示的假数据  使漏斗显示为漏斗形状
 @param {Array} dataArr 图表数据源
 @param {Array} legendArr 图表图例
 @param {Array} gapArr 转化率
 @param {Array} nMax 数据中的最大和次最大值数组
 */
var drawFunnelChart = function(chartId,titleText,showDataArr,dataArr,legendArr,gapArr,nMax){

    var option = {
        title: {
            text: titleText,
            subtext: ''
        },
        tooltip: {
            trigger: 'item',
            formatter:function(param){
                return ''+param.name +': ' + dataArr[param.dataIndex].value.toLocaleString();
            }
            /*formatter: "{a} <br/>{b} : {c}"*/
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
                max: nMax[1],
                min: 0,
                minSize: '0%',
                maxSize: '100%',
                sort: 'none',
                gap: 2,
                label: {
                    normal: {
                        show: true,
                        position: 'center',
                        formatter: function(data){
                            return dataArr[data.dataIndex].value.toLocaleString();
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
                max: nMax[1],
                min: 0,
                minSize: "0%",
                maxSize: '100%',
                sort: 'none',       //不排序，按照给定数据的顺序
                gap: 2,
                label: {
                    normal: {
                        show: true,
                        position: 'left',
                        formatter: function(data){
                            //console.log(data);
                            if(data.name!='买家数量' && data.name!='卖家数量' && data.name!='下单数量' && data.name!='竞拍数量'){
                                return '{per|' + gapArr[data.dataIndex] + '}';/*转化率：*/
                            }else{
                                return '';
                            }
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
                max: nMax[1],
                min: 0,
                minSize: "0%",
                maxSize: '100%',
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
 金字塔版本漏斗图
 @param {string} chartId 图表 id
 @param {string} titleText 图表标题
 @param {Array} showDataArr 用于显示的假数据  使漏斗显示为漏斗形状
 @param {Array} dataArr 图表数据源
 @param {Array} legendArr 图表图例
 @param {Array} gapArr 转化率
 @param {Array} nMax 数据中的最大和次最大值数组
 */
var drawFunnelChartOlds = function(chartId,titleText,showDataArr,dataArr,legendArr,gapArr,nMax){

    var option = {
        title: {
            text: titleText,
            subtext: ''
        },
        tooltip: {
            trigger: 'item',
            formatter:function(param){
                return ''+param.name +': ' + dataArr[param.dataIndex].value.toLocaleString();
            }
            /*formatter: "{a} <br/>{b} : {c}"*/
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
                max: 100,
                min: 0,
                minSize: '0%',
                maxSize: '100%',
                sort: 'none',
                gap: 2,
                label: {
                    normal: {
                        show: true,
                        position: 'center',
                        formatter: function(data){
                            return dataArr[data.dataIndex].value.toLocaleString();
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
                data: showDataArr
            },
            {
                name:'漏斗图',
                type:'funnel',
                left: '20%',
                top: 60,
                //x2: 80,
                bottom: 60,
                width: '60%',
                max: 100,
                min: 0,
                minSize: "0%",
                maxSize: '100%',
                sort: 'none',       //不排序，按照给定数据的顺序
                gap: 2,
                label: {
                    normal: {
                        show: true,
                        position: 'left',
                        formatter: function(data){
                            //console.log(data);
                            if(data.name!='买家数量' && data.name!='卖家数量' && data.name!='下单数量' && data.name!='竞拍数量'){
                                return '{per|转化率：' + gapArr[data.dataIndex] + '}';
                            }else{
                                return '';
                            }
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
                data: showDataArr
            },
            {
                name:'漏斗图',
                type:'funnel',
                left: '20%',
                top: 60,
                bottom: 60,
                width: '60%',
                max: 100,
                min: 0,
                minSize: "0%",
                maxSize: '100%',
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
                data: showDataArr
            }
        ]
    };

    var myChart=echarts.init(document.getElementById(chartId));
    myChart.setOption(option);
    window.addEventListener('resize',myChart.resize)
};
/**
 * 旧版漏斗图
 * @param chartId
 * @param titleText
 * @param dataArr
 * @param legendArr
 * @param gapArr
 * @param nMax
 */
var drawFunnelChartOld = function(chartId,titleText, dataArr,legendArr,gapArr,nMax){
    var temp = dataArr[0].value;
    if(dataArr[0].value < nMax[1]){
        dataArr.splice(0,1,{"value":Math.round(accDiv(nMax[1],0.15)),"name":dataArr[0].name});
        dataArr[0].value == nMax[1];
        nMax.splice(1,1,Math.round(accDiv(nMax[1],0.15)));
    }
    var option = {
        title: {
            text: titleText,
            subtext: ''
        },
        tooltip: {
            trigger: 'item',
            formatter:function(param){
                if(param.name=='卖家数量'){
                    return ''+param.name +': ' + temp.toLocaleString();
                }else{
                    return ''+param.name +': ' + param.value.toLocaleString();
                }
            }
            /*formatter: "{a} <br/>{b} : {c}"*/
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
                max: nMax[1],
                min: nMax[0],
                minSize: '20%',
                maxSize: '100%',
                sort: 'none',
                gap: 2,
                label: {
                    normal: {
                        show: true,
                        position: 'center',
                        formatter: function(data){
                            if(data.name=='卖家数量'){
                                return temp.toLocaleString();
                            }else{
                                return data.value.toLocaleString();
                            }
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
                max: nMax[1],
                min: nMax[0],
                minSize: "20%",
                maxSize: '100%',
                sort: 'none',       //不排序，按照给定数据的顺序
                gap: 2,
                label: {
                    normal: {
                        show: true,
                        position: 'left',
                        formatter: function(data){
                            //console.log(data);
                            if(data.name!='买家数量' && data.name!='卖家数量' && data.name!='询价数量' && data.name!='竞拍数量'){
                                return '{per|转化率：' + gapArr[data.dataIndex] + '}';
                            }else{
                                return '';
                            }
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
                max: nMax[1],
                min: nMax[0],
                minSize: "20%",
                maxSize: '100%',
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
 @param {number} target 当天目标达标度，当月天数/当月总天数
 */
var drawGaugeChart = function(start,chartId,maxValue,unit,curValue,target,type){
    var option={
        tooltip : {
            formatter:function(data){
                switch(type){
                    case 0:
                        return "业务指标（指针为基准线，蓝色为已完成）"
                            +"<br>总代拍GMV目标: " + maxValue.toLocaleString() + ''
                            +"<br>期望达成代拍GMV: " + (Math.round(accMul(maxValue , target))).toLocaleString() + ''
                            +"<br>实际达成代拍GMV: " + curValue.toLocaleString()
                            +"<br>期望完成度: " + accMul(target,100) + '%'
                            +"<br>实际完成度: " + accDiv(Math.round(accMul(accDiv(curValue,maxValue),10000)),100) + '%';
                    case 1:
                        return "业务指标（指针为基准线，蓝色为已完成）"
                            +"<br>总B2B自营GMV目标: " + maxValue.toLocaleString() + ''
                            +"<br>期望达成B2B自营GMV: " + (Math.round(accMul(maxValue , target))).toLocaleString() + ''
                            +"<br>实际达成B2B自营GMV: " + curValue.toLocaleString()
                            +"<br>期望完成度: " + accMul(target,100) + '%'
                            +"<br>实际完成度: " + accDiv(Math.round(accMul(accDiv(curValue,maxValue),10000)),100) + '%';
                    case 2:
                        //var buyerTarget = accAdd(accMul(accSub(maxValue*1,start*1),target),start*1);
                        return "业务指标（指针为基准线，蓝色为已完成）"
                            +"<br>总目标入驻卖家: " + (accMul(maxValue,1)).toLocaleString() + ''
                            +"<br>期望入驻卖家: " + (Math.round(accAdd(accMul(accSub(maxValue*1,start*1),target),start*1))).toLocaleString() + ''
                            +"<br>实际入驻卖家: " + (accMul(curValue,1)).toLocaleString()
                            +"<br>期望完成度: " + accMul(target,100) + '%'
                            +"<br>实际完成度: " + accDiv(Math.round(accMul(accDiv(curValue,maxValue),10000)),100) + '%';
                    case 3:
                        return "业务指标（指针为基准线，蓝色为已完成）"
                            +"<br>总目标入驻买家: " + (accMul(maxValue,1)).toLocaleString() + ''
                            +"<br>期望入驻买家: " + (Math.round(accAdd(accMul(accSub(maxValue*1,start*1),target),start*1))).toLocaleString() + ''
                            +"<br>实际入驻买家: " + (accMul(curValue,1)).toLocaleString()
                            +"<br>期望完成度: " + accMul(target,100) + '%'
                            +"<br>实际完成度: " + accDiv(Math.round(accMul(accDiv(curValue,maxValue),10000)),100) + '%';
                    default:
                        return "业务指标<br>完成度: " + accDiv(Math.round(accMul(accDiv(curValue,maxValue),10000)),100) + '%';
                }
            }
        },
        series: [
            {
                name: '业务指标',
                type: 'gauge',
                min:start,
                max:maxValue,
                splitLine:{
                    show: false
                },
                axisLine:{
                    show:false,
                    lineStyle:{
                        width:20,    //圆弧的宽度
                        color: [[accDiv(Math.round(accMul(accDiv(curValue,maxValue),100)),100), '#3c8dbc'], [1, '#D2D6DE']]        //圆弧的颜色
                    }
                },
                axisTick:{
                    show: false         //坐标小刻度
                },
                axisLabel:{
                    distance: -55,                  //label和仪表盘的距离
                    formatter:function(value){
                        switch(value + ''){          //在仪表盘只显示最大最小值
                            case '0':
                                return value;
                            case maxValue + '':
                                return value.toLocaleString() + unit;
                            case start + '':
                                return value.toLocaleString() + unit;
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
                        return accDiv(Math.round(accMul(accDiv(curValue,maxValue),10000)),100) + '%'
                    }
                },
                data: [{value: Math.round(accMul(maxValue , target)), name: '完成率'}]
            }
        ]
    };
    var myChart=echarts.init(document.getElementById(chartId));
    myChart.setOption(option);
    window.addEventListener('resize',myChart.resize)

};

var drawGaugeChartOld = function(chartId,maxValue,unit,curValue,target,type){
    var option={
        tooltip : {
            formatter:function(data){
                switch(type){
                    case 0:
                        return "业务指标"
                            +"<br>总代拍GMV目标: " + maxValue.toLocaleString() + ''
                            +"<br>期望达成代拍GMV: " + (Math.round(accMul(maxValue , target))).toLocaleString() + ''
                            +"<br>实际达成代拍GMV: " + curValue.toLocaleString()
                            +"<br>期望完成度: " + accMul(target,100) + '%'
                            +"<br>实际完成度: " + accDiv(Math.round(accMul(accDiv(data.value,maxValue),10000)),100) + '%';
                    case 1:
                        return "业务指标"
                            +"<br>总B2B自营GMV目标: " + maxValue.toLocaleString() + ''
                            +"<br>期望达成B2B自营GMV: " + (Math.round(accMul(maxValue , target))).toLocaleString() + ''
                            +"<br>实际达成B2B自营GMV: " + curValue.toLocaleString()
                            +"<br>期望完成度: " + accMul(target,100) + '%'
                            +"<br>实际完成度: " + accDiv(Math.round(accMul(accDiv(data.value,maxValue),10000)),100) + '%';
                    case 2:
                        return "业务指标"
                            +"<br>总目标入驻卖家: " + (accMul(maxValue,1)).toLocaleString() + ''
                            +"<br>期望入驻卖家: " + (Math.round(accMul(maxValue , target))).toLocaleString() + ''
                            +"<br>实际入驻卖家: " + (accMul(curValue,1)).toLocaleString()
                            +"<br>期望完成度: " + accMul(target,100) + '%'
                            +"<br>实际完成度: " + accDiv(Math.round(accMul(accDiv(data.value,maxValue),10000)),100) + '%';
                    case 3:
                        return "业务指标"
                            +"<br>总目标入驻买家: " + (accMul(maxValue,1)).toLocaleString() + ''
                            +"<br>期望入驻买家: " + (Math.round(accMul(maxValue , target))).toLocaleString() + ''
                            +"<br>实际入驻买家: " + (accMul(curValue,1)).toLocaleString()
                            +"<br>期望完成度: " + accMul(target,100) + '%'
                            +"<br>实际完成度: " + accDiv(Math.round(accMul(accDiv(data.value,maxValue),10000)),100) + '%';
                    default:
                        return "业务指标<br>完成度: " + accDiv(Math.round(accMul(accDiv(data.value,maxValue),10000)),100) + '%';
                }
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
                    distance: -55,                  //label和仪表盘的距离
                    formatter:function(value){
                        switch(value + ''){          //在仪表盘只显示最大最小值
                            case '0':
                                return value;
                            case maxValue + '':
                                return value.toLocaleString() + unit;
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
                        return accDiv(Math.round(accMul(accDiv(value,maxValue),10000)),100) + '%'
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
 绘制环形图
 @param {string} chartId 图表id
 @param {string} titleText 图表标题
 @param {Array} dataArr 图表数据源
 @param {Array} legendArr 图标图例
 */
var drawPieChart = function(chartId,titleText, dataArr, legendArr,legendOption){
    //legendOption  {orient:'vertical',x:'right',y:'center'}
    //供需比分布的   {orient:'horizontal',bottom:'0%'}--orient: 'horizontal',bottom: '0%',
    var flag = instruments_panel.imPhone();//PC端
    var scrollWidth = document.body.scrollWidth;
    var fontSize = 12;
    var trendFontSize = 14;
    if(flag){
        if(scrollWidth <= 1522){
            fontSize  = 10;
            trendFontSize = 12;
        }
        if(scrollWidth <= 1269){
            fontSize = 8;
            trendFontSize = 10;
        }
    }
    var option = {
        title : {
            text: titleText,
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
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: legendOption.orient,       /*legend的水平排序*/
            /*x: 'right', // 'center' | 'left' | {number},
            y: 'center',              /!*legend距离底部的距离*!/*/
            itemGap: 2,
            padding: 5,                // 标题内边距，单位px，默认各方向内边距为5，
            formatter:function(name){
                var total=0, target,trend;
                _.each(dataArr,function(value, i){
                    total += dataArr[i].value;
                    if(dataArr[i].name==name){
                        target = dataArr[i].value;
                        trend = dataArr[i].trend;
                    }
                });
                var resultStr = name + ' | ' + ((target/total)*100).toFixed(2)+'%' + " ";
                if(trend=='up'){
                    resultStr+='{g| ↑}'
                }else if(trend=='dw'){
                    resultStr+='{r| ↓}'
                }else if(trend=='eq'){
                    resultStr+='{y| -}'
                }
                if(chartId != 'supplyDemandPieChart'){
                    resultStr+=  '￥ ' + target+"    ";
                }
                return resultStr
            },
            data: legendArr,
            textStyle:{
                fontSize: fontSize,
                rich:{
                    r:{
                        color:'red',
                        fontWeight: 'BOLD',
                        fontSize: fontSize
                    },
                    y:{
                        color:'orange',
                        fontWeight: 'BOLD',
                        fontSize: fontSize
                    },
                    g:{
                        color:'green',
                        fontWeight: 'BOLD',
                        fontSize: fontSize
                    }
                }
            }
        },
        color: ['#3C8DBC', '#00C0EF', '#F39C12', '#37B97D', '#F67360','#B5BBC8'],
        series : [
            {
                name: titleText,
                type: 'pie',
                radius: ['25%', '50%'],
                /*radius : ['30%', '45%'],//圆环宽,*/
                /*center: ['23%', '40%'],*/ /*水平，垂直的位置*/
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

    if(legendOption.orient=='vertical'){
        option.legend.x=legendOption.x;
        option.legend.y=legendOption.y;
    }else if(legendOption.orient=='horizontal'){
        option.legend.bottom = legendOption.bottom;
    }
    var myChart=echarts.init(document.getElementById(chartId));
    myChart.setOption(option);
    window.addEventListener('resize',myChart.resize)
};

/**
 * 绘制双环形图
 * @param chartId
 * @param joinPercent
 */
var drawDoublePieChart = function(firstChartId, secondChartId,joinPercent){


    var firstOption = {
        title: [{
            text: (100-joinPercent)+'%',
            subtext: '  未竞拍',
            x: 'center',
            y: 'center',
            textStyle: {
                fontWeight: 'normal',
                color: '#1abc9c',
                fontSize: '15'
            },
            subtextStyle: {
                color: '#666b74',
                fontSize: 10
            }
        }],
        color: ['#1abc9c'],
        series: [
            {
                    name: '未竞拍',
                    selectedMode: 'single',
                    type: 'pie',
                    clockWise: true,
                    //center: ['25%', '45%'],
                    radius: ['40%', '56%'],
                    itemStyle: {
                        normal: {
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        }
                    },
                    hoverAnimation: false,
                    data: [{
                        value: 100-joinPercent,
                        selected:true,
                        name: '未竞拍',
                        itemStyle: {
                            normal: {
                                color: '#1abc9c',
                                label: {
                                    show: false
                                },
                                labelLine: {
                                    show: false
                                }
                            }
                        }
                    },
                    {
                        name: '参与竞拍',
                        value: joinPercent,
                        itemStyle: {
                            normal: {
                                color: '#E0E3E9'
                            }
                        }
                    }]
                }
            ]
    };

    var secondOption = {
        title: [{
            text: joinPercent+'%',
            subtext: '参与竞拍',
            x: 'center',
            y: 'center',
            textStyle: {
                fontWeight: 'normal',
                color: '#f2c967',
                fontSize: '15'
            },
            subtextStyle: {
                color: '#666b74',
                fontSize: 10
            }
        }],
        color: ['#f2c967'],
        series: [
            {
                name: '参与竞拍',
                selectedMode: 'single',
                type: 'pie',
                clockWise: true,
                //center: ['70%', '45%'],
                radius: ['40%', '56%'],
                itemStyle: {
                    normal: {
                        label: {
                            show: false
                        },
                        labelLine: {
                            show: false
                        }
                    }
                },
                hoverAnimation: false,
                data: [{
                    value: joinPercent,
                    selected:true,
                    name: '参与竞拍',
                    itemStyle: {
                        normal: {
                            color: '#f2c967',
                            label: {
                                show: false
                            },
                            labelLine: {
                                show: false
                            }
                        }
                    }
                }, {
                    name: '未竞拍',
                    value: 100-joinPercent,
                    itemStyle: {
                        normal: {
                            color: '#E0E3E9'
                        }
                    }
                }]
            }]
    };

    var firstChart = echarts.init(document.getElementById(firstChartId));
    firstChart.setOption(firstOption);

    var secondChart = echarts.init(document.getElementById(secondChartId));
    secondChart.setOption(secondOption);

    window.addEventListener('resize',firstChart.resize);
    window.addEventListener('resize',secondChart.resize);
};


/**
 绘制表格
 @param {string} chartId 图表id
 @param {Array} dataList 图表数据源
 @param {Array} columns 表格标题
 @param {string} destroyTableId 被销毁
 */
var drawDataTable = function(chartId,dataList,columns, destroyTableId){
    //为了防止多个table叠加，事先销毁
    $("#" + destroyTableId).bootstrapTable('destroy');
    $("#" + chartId).bootstrapTable('destroy').bootstrapTable({
        height: 231,
        data: dataList,
        striped: true,
        columns:columns
    });
    $(window).resize(function () {
        $("#" + chartId).bootstrapTable('resetView');
    });
};

/*根据趋势生成环比箭头*/
var getTrendHTML = function(trend, spanId){
    switch(trend){
        case 'up':
            return "<span class='description-percentage text-green add-weight'><i class='fa fa-caret-up'></i> <span class='text-letter-down' id=" + spanId + "></span></span>"
        case 'dw':
            return "<span class='description-percentage text-red add-weight'><i class='fa fa-caret-down'></i> <span class='text-letter-down' id=" + spanId + "></span></span>"
        case 'eq':
            return "<span class='description-percentage text-yellow add-weight'><i class='fa fa-caret-left'></i> <span class='text-letter-down' id=" + spanId + "></span></span>"
    }
};

/*环比*/
var getChainIndex = function(prev, cur){
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
var formattedNumber = function(curValue, maxLength){
    var curLength = curValue.toString().length;
    var updateValue = curValue;
    if(curLength < maxLength){
        if(maxLength - curLength === 2){
            updateValue += "&nbsp;&nbsp;&nbsp;&nbsp;";
        }else if(maxLength - curLength === 3){
            updateValue += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
        }else if(maxLength - curLength === 1){
            updateValue += "&nbsp;&nbsp;";
        }else if(maxLength - curLength === 4 && updateValue.toString().indexOf('%') < 0){
            updateValue += "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;";
        }else if(maxLength - curLength === 4 && updateValue.toString().indexOf('%') != -1){
            updateValue = updateValue.toString().substring(0,1)+'.00%'+"&nbsp;&nbsp;";
        }else{
            for(var i=0;i<=maxLength-curLength;i++){
                updateValue += "&nbsp;";
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
var drawGoodFlowAnalysis = function(obj){
    var dateLength = getDateRangeLength(obj.startTime,new Date(obj.endTime).getNewDate(1),'day');       //时间差
    //var query = {serviceLineId: "1",categoryId:"1",brandId:"1",modelId:"1",startTime:"2018-07-25",endTime:"2018-08-01"};
    var lastStartTime = new Date(obj.startTime).getNewDate(-dateLength);
    var lastEndTime = new Date(obj.endTime).getNewDate(-dateLength);
    //获取物品流转分析-物品流转流程图数据
    requestURL(dataService+"/instrumentsAfterPanel/getProductForceData", {serviceLineId:obj.serviceLineId,categoryId:obj.categoryId,brandId:obj.brandId,modelId:obj.modelId,startTime:obj.startTime,endTime:obj.endTime}).done(function (data) {
        //console.log(data);
        if(data.statusText != undefined && data.statusText=='error'){

        }else{
            if(instruments_panel.imPhone()){
                var selectorArr = ['forceChart'];
                showPanelOrLoading(selectorArr,false);
                //初始化渲染流程图
                drawForceChart(data,dateLength);
            }else{
                var selectorArr = ['forceChart'];
                showPanelOrLoading(selectorArr,false);
                drawPhoneForceChart(data,dateLength);
            }
        }
    });

    //获取物品流转分析-物品流转总时长数据
    requestURL(dataService+"/instrumentsAfterPanel/getProductJoinCartData", {serviceLineId:obj.serviceLineId,categoryId:obj.categoryId,brandId:obj.brandId,modelId:obj.modelId,startTime:obj.startTime,endTime:obj.endTime,lastStartTime:lastStartTime,lastEndTime:lastEndTime}).done(function (data) {
        //console.log(data);
        if(data.statusText != undefined && data.statusText=='error'){

        }else{
            drawOperationData(data,dateLength);
        }
    });
};

var drawStockPieChart = function(obj){
    var dateLength = getDateRangeLength(obj.startTime,new Date(obj.endTime).getNewDate(1),'day');       //时间差
    var lastStartTime = new Date(obj.startTime).getNewDate(-dateLength);
    var lastEndTime = new Date(obj.endTime).getNewDate(-dateLength);
    //获取物品流转分析-库存分析（环形图）
    requestURL(dataService+"/instrumentsAfterPanel/getStockPieChartData", {serviceLineId:obj.serviceLineId,categoryId:obj.categoryId,brandId:obj.brandId,modelId:obj.modelId,startTime:obj.startTime,endTime:obj.endTime,lastStartTime:lastStartTime,lastEndTime:lastEndTime}).done(function (ret) {
        var curData = JSON.parse(ret['curData']);
        var lastData = JSON.parse(ret['lastData']);
        //console.log(curData);
        var keyArr = ['0<T<=3','3<T<=7','T>7'];

        var curAll = accAdd(accAdd(accMul(curData['0<T<=3'],1),accMul(curData['3<T<=7'],1)),accMul(curData['T>7'],1));
        var lastAll = accAdd(accAdd(accMul(lastData['0<T<=3'],1),accMul(lastData['3<T<=7'],1)),accMul(lastData['T>7'],1));
        var curKeyOneRate = accDiv(accMul(curData['0<T<=3'],1),curAll);
        var curKeyTwoRate = accDiv(accMul(curData['3<T<=7'],1),curAll);
        var curKeyThreeRate = accDiv(accMul(curData['T>7'],1),curAll);

        var lastKeyOneRate = accDiv(accMul(lastData['0<T<=3'],1),lastAll);
        var lastKeyTwoRate = accDiv(accMul(lastData['3<T<=7'],1),lastAll);
        var lastKeyThreeRate = accDiv(accMul(lastData['T>7'],1),lastAll);

        var oneTrend = getCircleCompareTrend(lastKeyOneRate,curKeyOneRate);
        var twoTrend = getCircleCompareTrend(lastKeyTwoRate,curKeyTwoRate);
        var threeTrend = getCircleCompareTrend(lastKeyThreeRate,curKeyThreeRate);
        var trendMap = {'0<T<=3':oneTrend,'3<T<=7':twoTrend,'T>7':threeTrend};
        var data = [
            {
                value: accMul(curData['0<T<=3'],1),
                name: '0<T<=3'
            },
            {
                value: accMul(curData['3<T<=7'],1),
                name: '3<T<=7'
            },
            {
                value: accMul(curData['T>7'],1),
                name: 'T>7'
            }
        ];
        //渲染库存分析(库龄分布环形图)
        showPanelOrLoading(['stockPieChart'],false);
        drawStockAnalysisChart(data,keyArr,trendMap);
    });
};

var forceMap = new Map();
var forceTitle = ['卖家发货','平台收货','平台验货','平台入库','竞拍成功','平台发货','买家收货','买家退货','退货审核','卖家退货'];
var initForceMap = function(){
    forceMap.set('卖家发货','卖家侧平均每日发货数量<br/>平均时长（卖家发货-运营中心物流签收）');
    forceMap.set('平台收货','平台平均每日收货数量<br/>平均时长（运营中心物流签收-运营中心确认收货），<br/>暂时只能计算物流订单的收货时长');
    forceMap.set('平台验货','平台平均每日验货数量<br/>平均时长（运营中心确认收货-运营中心质检完成）');
    forceMap.set('平台入库','平台平均每日入库数量<br/>平均时长（运营中心验货完成-运营中心入库完成）');
    forceMap.set('竞拍成功','平台平均每日竞拍成功数量<br/>平均时长（运营中心入库完成-物品竞拍成功）');
    forceMap.set('平台发货','平台平均每日发货数量<br/>平均时长（物品竞拍成功-运营中心发货完成）');
    forceMap.set('买家收货','买家侧平均每日收货数量<br/>平均时长（运营中心发货完成-买家收货完成）');
    forceMap.set('买家退货','买家侧平均每日提交退货数量<br/>平均时长（买家发起退货-运营中心物流签收）');
    forceMap.set('退货审核','平台平均每日退货审核数量<br/>平均时长（运营中心物流签收-运营中心退货审核完成）');
    forceMap.set('卖家退货','平台平均每日退货发货数量<br/>平均时长（卖家申请退货-运营中心退货发货）');
};

/*
* 流程图字体大小根据分辨率变化
* */
var forceChartFontStyle = {fontSize:15,sellerReturnPosition:400};

//渲染流程图
var drawForceChart = function(data,dateLength){
    //console.log(forceMap);
    //console.log('开始执行流程图');
    //陈晨的SQL不用除以dateLength了
    var forceOption = {
        tooltip: {
            trigger: 'item',
            formatter: function(para){
                if(forceTitle.contains(para.name)){
                    //console.log(para.name);
                    return forceMap.get(para.name);
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
                        position: 'bottom',
                        offset: [0,-60],//居上 20
                        textStyle: {
                            fontSize: forceChartFontStyle.fontSize
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
                        value:'T:' + accDiv(Math.round(accDiv(accMul(data['卖家发货'].sale_out_dt,10),1)),10) + ' h',
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
                        value:'T:' + accDiv(Math.round(accDiv(accMul(data['平台收货'].platform_receive_dt,10),1)),10) + ' h',
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    }, {
                        name: '平台验货',
                        x: 300,
                        y: 300,
                        value:'T:' + accDiv(Math.round(accDiv(accMul(data['平台验货'].platform_inspection_dt,10),1)),10) + ' h',
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
                        value:'T:' + accDiv(Math.round(accDiv(accMul(data['平台入库'].platform_in_dt,10),1)),10) + ' h',
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    }, {
                        name: '竞拍成功',
                        x: 500,
                        y: 300,
                        value:'T:' + accDiv(Math.round(accDiv(accMul(data['竞拍成功'].supply_success_dt,10),1)),10) + ' h',
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
                        value:'T:' + accDiv(Math.round(accDiv(accMul(data['平台发货'].platform_deliver_dt,10),1)),10) + ' h',
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
                        value:'T:' + accDiv(Math.round(accDiv(accMul(data['买家收货'].buy_receive_dt,10),1)),10) + ' h',
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
                        value:'T:' + accDiv(Math.round(accDiv(accMul(data['买家退货'].buy_return_dt,10),1)),10) + ' h',
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
                        value:'T:' + accDiv(Math.round(accDiv(accMul(data['退货审核'].return_check_dt,10),1)),10) + ' h',
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
                        y: forceChartFontStyle.sellerReturnPosition,
                        value:'T:' + accDiv(Math.round(accDiv(accMul(data['卖家退货'].sale_return_dt,10),/*dateLength*/1)),10) + ' h',
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
                        show: true,
                        position: 'bottom',
                        offset: [0,-90],//居上 20
                        textStyle: {
                            fontSize: forceChartFontStyle.fontSize
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
                        value:'N:' + Math.round(accDiv(accMul(data['卖家发货'].sale_out_count,1),dateLength)) + ' 台',
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
                        value:'N:' + Math.round(accDiv(accMul(data['平台收货'].platform_receive_count,1),dateLength)) + ' 台',
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    }, {
                        name: '平台验货',
                        x: 300,
                        y: 300,
                        value:'N:' + Math.round(accDiv(accMul(data['平台验货'].platform_inspection_count,1),dateLength)) + ' 台',
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
                        value:'N:' + Math.round(accDiv(accMul(data['平台入库'].platform_in_count,1),dateLength)) + ' 台',
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    }, {
                        name: '竞拍成功',
                        x: 500,
                        y: 300,
                        value:'N:' + Math.round(accDiv(accMul(data['竞拍成功'].supply_success_count,1),dateLength)) + ' 台',
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
                        value:'N:' + Math.round(accDiv(accMul(data['平台发货'].platform_deliver_count,1),dateLength)) + ' 台',
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
                        value:'N:' + Math.round(accDiv(accMul(data['买家收货'].buy_receive_count,1),dateLength)) + ' 台',
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
                        value:'N:' + Math.round(accDiv(accMul(data['买家退货'].buy_return_count,1),dateLength)) + ' 台',
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
                        value:'N:' + Math.round(accDiv(accMul(data['退货审核'].return_check_count,1),dateLength)) + ' 台',
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
                        y: forceChartFontStyle.sellerReturnPosition,
                        value:'N:' + Math.round(accDiv(accMul(data['卖家退货'].sale_return_count,1),dateLength)) + ' 台',
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
                            fontSize:forceChartFontStyle.fontSize
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
                        value:'',
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    }, {
                        name: '平台验货',
                        x: 300,
                        y: 300,
                        value:'',
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
                        value:'',
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    }, {
                        name: '竞拍成功',
                        x: 500,
                        y: 300,
                        value:'',
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
                        value:'',
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
                        value:'',
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
                        value:'',
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
                        value:'',
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
                        y: forceChartFontStyle.sellerReturnPosition,
                        value:'',
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
var drawPhoneForceChart = function(data,dateLength){
    //console.log('开始执行手机流程图');
    var forceOption = {
        tooltip: {
            trigger: 'item',
            formatter: function(para){
                if(forceTitle.contains(para.name)){
                    return forceMap.get(para.name);
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
            /*只显示卖家退货的平均时长*/
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
                        offset: [0,40],//居右 20
                        textStyle: {
                            fontSize: '18rem'
                        },
                        formatter:function(para){
                            if(para.name == '卖家退货'){
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
                        value:'',
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
                        value:'',
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    }, {
                        name: '平台验货',
                        x: 600,
                        y: 300,
                        value:'',
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
                        value:'',
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    }, {
                        name: '竞拍成功',
                        x: 600,
                        y: 500,
                        value:'',
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
                        value:'',
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
                        value:'',
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
                        value:'',
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
                        value:'',
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
                        value:'T:' + accDiv(Math.round(accDiv(accMul(data['卖家退货'].sale_return_dt,10),/*dateLength*/1)),10) + ' h',
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
            /*只显示卖家退货的平均数量*/
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
                            if(para.name == '卖家退货'){
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
                        value:'N:' + Math.round(accDiv(accMul(data['卖家发货'].sale_out_count,1),dateLength)) + ' 台',
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
                        value:'N:' + Math.round(accDiv(accMul(data['平台收货'].platform_receive_count,1),dateLength)) + ' 台',
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    }, {
                        name: '平台验货',
                        x: 600,
                        y: 300,
                        value:'N:' + Math.round(accDiv(accMul(data['平台验货'].platform_inspection_count,1),dateLength)) + ' 台',
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
                        value:'N:' + Math.round(accDiv(accMul(data['平台入库'].platform_in_count,1),dateLength)) + ' 台',
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    }, {
                        name: '竞拍成功',
                        x: 600,
                        y: 500,
                        value:'N:' + Math.round(accDiv(accMul(data['竞拍成功'].supply_success_count,1),dateLength)) + ' 台',
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
                        value:'N:' + Math.round(accDiv(accMul(data['平台发货'].platform_deliver_count,1),dateLength)) + ' 台',
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
                        value:'N:' + Math.round(accDiv(accMul(data['买家收货'].buy_receive_count,1),dateLength)) + ' 台',
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
                        value:'N:' + Math.round(accDiv(accMul(data['买家退货'].buy_return_count,1),dateLength)) + ' 台',
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
                        value:'N:' + Math.round(accDiv(accMul(data['退货审核'].return_check_count,1),dateLength)) + ' 台',
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
                        value:'N:' + Math.round(accDiv(accMul(data['卖家退货'].sale_return_count,1),dateLength)) + ' 台',
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
            /*显示除了卖家退货的平均时长*/
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
                        offset: [20,7],//居右 20
                        textStyle: {
                            fontSize: '18rem'
                        },
                        formatter:function(para){
                            if(para.name == '卖家退货'){
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
                        value:'T:' + accDiv(Math.round(accDiv(accMul(data['卖家发货'].sale_out_dt,10),1)),10) + ' h',
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
                        value:'T:' + accDiv(Math.round(accDiv(accMul(data['平台收货'].platform_receive_dt,10),1)),10) + ' h',
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    }, {
                        name: '平台验货',
                        x: 600,
                        y: 300,
                        value:'T:' + accDiv(Math.round(accDiv(accMul(data['平台验货'].platform_inspection_dt,10),1)),10) + ' h',
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
                        value:'T:' + accDiv(Math.round(accDiv(accMul(data['平台入库'].platform_in_dt,10),1)),10) + ' h',
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    }, {
                        name: '竞拍成功',
                        x: 600,
                        y: 500,
                        value:'T:' + accDiv(Math.round(accDiv(accMul(data['竞拍成功'].supply_success_dt,10),1)),10) + ' h',
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
                        value:'T:' + accDiv(Math.round(accDiv(accMul(data['平台发货'].platform_deliver_dt,10),1)),10) + ' h',
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
                        value:'T:' + accDiv(Math.round(accDiv(accMul(data['买家收货'].buy_receive_dt,10),1)),10) + ' h',
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
                        value:'T:' + accDiv(Math.round(accDiv(accMul(data['买家退货'].buy_return_dt,10),1)),10) + ' h',
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
                        value:'T:' + accDiv(Math.round(accDiv(accMul(data['退货审核'].return_check_dt,10),1)),10) + ' h',
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
                        value:'T:' + accDiv(Math.round(accDiv(accMul(data['卖家退货'].sale_return_dt,10),/*dateLength*/1)),10) + ' h',
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
            /*显示除了卖家退货的平均数量*/
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
                        offset: [20,-7],//居右 20
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
                        value:'N:' + Math.round(accDiv(accMul(data['卖家发货'].sale_out_count,1),dateLength)) + ' 台',
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
                        value:'N:' + Math.round(accDiv(accMul(data['平台收货'].platform_receive_count,1),dateLength)) + ' 台',
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    }, {
                        name: '平台验货',
                        x: 600,
                        y: 300,
                        value:'N:' + Math.round(accDiv(accMul(data['平台验货'].platform_inspection_count,1),dateLength)) + ' 台',
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
                        value:'N:' + Math.round(accDiv(accMul(data['平台入库'].platform_in_count,1),dateLength)) + ' 台',
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    }, {
                        name: '竞拍成功',
                        x: 600,
                        y: 500,
                        value:'N:' + Math.round(accDiv(accMul(data['竞拍成功'].supply_success_count,1),dateLength)) + ' 台',
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
                        value:'N:' + Math.round(accDiv(accMul(data['平台发货'].platform_deliver_count,1),dateLength)) + ' 台',
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
                        value:'N:' + Math.round(accDiv(accMul(data['买家收货'].buy_receive_count,1),dateLength)) + ' 台',
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
                        value:'N:' + Math.round(accDiv(accMul(data['买家退货'].buy_return_count,1),dateLength)) + ' 台',
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
                        value:'N:' + Math.round(accDiv(accMul(data['退货审核'].return_check_count,1),dateLength)) + ' 台',
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
                        value:'N:' + Math.round(accDiv(accMul(data['卖家退货'].sale_return_count,1),dateLength)) + ' 台',
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
            /*只显示卖家退货label*/
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
                            offset:[0,-80],//居上 20
                            formatter: function(para){//格式化提示文本
                                if(para.name=='卖家退货'){
                                    return para.name;
                                }else{
                                    return '';
                                }
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
                        value:'',
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
                        value:'',
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    }, {
                        name: '平台验货',
                        x: 600,
                        y: 300,
                        value:'',
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
                        value:'',
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    }, {
                        name: '竞拍成功',
                        x: 600,
                        y: 500,
                        value:'',
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
                        value:'',
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
                        value:'',
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
                        value:'',
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
                        value:'',
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
                        value:'',
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
            /*显示阶段label,如平台发货(除了卖家退货)*/
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
                                if(para.name!='卖家退货'){
                                    return para.name;
                                }else{
                                    return '';
                                }
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
                        value:'',
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
                        value:'',
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    }, {
                        name: '平台验货',
                        x: 600,
                        y: 300,
                        value:'',
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
                        value:'',
                        itemStyle: {
                            normal: {
                                color: '#399'
                            }
                        }
                    }, {
                        name: '竞拍成功',
                        x: 600,
                        y: 500,
                        value:'',
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
                        value:'',
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
                        value:'',
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
                        value:'',
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
                        value:'',
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
                        value:'',
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
//设置运营中心时长数据
var drawOperationData = function(data,dateLength){
    var curData = JSON.parse(data.curData);
    var lastData = JSON.parse(data.lastData);

    var curAllHour = accMul(curData['物流总时长'].all_hour,1);
    var curBuyerAllHour = accMul(curData['买家售后总时长'].buy_all_hour,1);
    var curOperationAllHour = accMul(curData['运营总时长'].operation_all_hour,1);


    var lastAllHour = accMul(lastData['物流总时长'].all_hour,1);
    var lastBuyerAllHour = accMul(lastData['买家售后总时长'].buy_all_hour,1);
    var lastOperationAllHour = accMul(lastData['运营总时长'].operation_all_hour,1);

    //陈晨的SQL不用除以  dataLength
    //var curOperationAvgHour = accDiv(Math.round(accMul(accDiv(curOperationAllHour,dateLength),10)),10);   //平均运营中心时长
    var curOperationAvgHour = accDiv(Math.round(accMul(accDiv(curOperationAllHour,1),10)),10);   //平均运营中心时长
    htmlNumSet(curOperationAvgHour,'operation-all-hour');

    //var curBuyerAvgHour = accDiv(Math.round(accMul(accDiv(curBuyerAllHour,dateLength),10)),10);   //买家售后时长
    var curBuyerAvgHour = accDiv(Math.round(accMul(accDiv(curBuyerAllHour,1),10)),10);   //买家售后时长
    htmlNumSet(curBuyerAvgHour,'buyer-after-all-hour');

    //var curOperationHourPercent = accDiv(Math.round(accMul(accDiv(curOperationAllHour,curAllHour),10000)),100);   //平均运营中心占比
    //htmlPercentSet(curOperationHourPercent,'operation-all-hour-percent-int','operation-all-hour-percent-smart');

    //var curBuyerHourPercent = accDiv(Math.round(accMul(accDiv(curBuyerAllHour,curAllHour),10000)),100);   //平均运营中心时长
    //htmlPercentSet(curBuyerHourPercent,'buyer-after-all-hour-percent-int','buyer-after-all-hour-percent-smart');



    var operationCircle = getCircleCompare(lastOperationAllHour,curOperationAllHour);
    var operationCircleTrend = getCircleCompareTrend(lastOperationAllHour,curOperationAllHour);

    htmlTrendSet('operation-all-hour',operationCircleTrend);
    htmlPercentSet(operationCircle,'operation-all-hour-trend-int','operation-all-hour-trend-smart');

    var buyerCircle = getCircleCompare(lastBuyerAllHour,curBuyerAllHour);
    var buyerCircleTrend = getCircleCompareTrend(lastBuyerAllHour,curBuyerAllHour);
    htmlTrendSet('buyer-after-all-hour',buyerCircleTrend);
    htmlPercentSet(buyerCircle,'buyer-after-all-hour-trend-percent-int','buyer-after-all-hour-trend-percent-smart');

    //console.log(JSON.parse(data.curData));
    //console.log(JSON.parse(data.lastData));
};
//渲染库存分析(库龄分布环形图)
var drawStockAnalysisChart = function(data,keyArr,trendMap){
    //console.log(data);
    var option = {
        backgroundColor: '#fff',
        title: {
            text: '库龄分布',
            subtext: '(天)',
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
            formatter: "{a} <br/> {b}<br/> 数量:{c} <br/>占比:{d}%"
        },
        legend: {
            orient: 'horizontal',
            bottom: '0%',
            //data: ['t<1', '1<t<=2', '2<t<=3', '4<t<=5', '5<t<=6','t>6'],
            data:keyArr,
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
                //console.log(trendMap);
                if(trendMap[name] == 0){
                    arr = [
                        ' '+name+' | '+ target + '台 | '+  ((target/total)*100).toFixed(2)+'%' + ' {up|↑}',
                    ]
                }else if(trendMap[name] == 1){
                    arr = [
                        ' '+name+ ' | '+ target + '台 | '+  ((target/total)*100).toFixed(2)+'%' + ' {down|↓}',
                    ]
                }else{
                    arr = [
                        name+ ' | '+ target + '台 | '+  ((target/total)*100).toFixed(2)+'%' + ' {keep|-}',
                    ]
                }
                //console.log(arr);
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
                    },
                    keep:{
                        color:'#fe9d58',
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
            radius: ['20%', '45%'],
            color: ['#59ADF3','#FF999A','#D55C79'],

            label: {
                normal:
                    {
                        position: 'top',
                        formatter:function(item){
                            return ''+item.name;
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
            labelLine: {
                normal: {
                    show: true
                }
            },
            data: data
        }]
    };

    var stockPieChart = echarts.init(document.getElementById('stockPieChart'));
    stockPieChart.setOption(option);

    setTimeout(function (){
        window.addEventListener('resize',stockPieChart.resize);
    },200);
};

var drawPublicCirclePieChart = function(chartId,data,title,legendData){
    var option = {
        backgroundColor: '#fff',
        title: {
            text: title,
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
            data:legendData,
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
                name:title,
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
                name:title,
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
                                if(item.value > 1544){
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

    var stockPieChart = echarts.init(document.getElementById(chartId));
    stockPieChart.setOption(option);

    setTimeout(function (){
        window.addEventListener('resize',stockPieChart.resize);
    },200);

};

/**
 * 绘制面积图
 * @param chartId
 * @param legendArr
 * @param seriesName
 * @param dataArr
 * @param dateArr
 * @param dateMap
 * @param averageArr
 */
var drawStockLineChart=function(chartId,legendArr, seriesName, dataArr, dateArr,dateMap,averageArr){
    var option = {
        tooltip : {
            trigger: 'axis',
            formatter: function (params) {
                var res = "";
                for (var i = 0, l = params.length; i < l; i++) {
                    if(params[i].seriesName != '平均线'){
                        res += params[i].name;
                        res += '<br/>每日库存量' + ' : ' + dateMap.get(params[i].name).stock + ' 台';
                    }else{
                        res += '<br/>周期平均线' + ' : ' + params[i].value + '';
                    }
                    //鼠标悬浮显示的字符串内容
                }
                return res;
            }
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
                type : 'value',
                axisLabel: {
                    show: true,
                    interval: 'auto',
                    formatter: '{value}'
                },
                show: true
            }
        ],
        series : [
            {
                name:seriesName[0],
                smooth:true,
                type:'line',
                stack: '总量',
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data:dataArr/*[150, 232, 201, 154, 190, 330, 410]*/
            },
            {
                name:seriesName[1],
                type:'line',
                itemStyle: {
                    normal:{
                        color:'#69BFEC',
                        lineStyle:{
                            width:2,
                            type:'dotted'  //'dotted'虚线 'solid'实线
                        }
                    }
                },
                data:averageArr
            }
        ]
    };
    var passInLineChart = echarts.init(document.getElementById(chartId));
    passInLineChart.setOption(option);
    window.addEventListener('resize',passInLineChart.resize);

};

/**
 * 绘制面积图
 * @param chartId
 * @param legendArr
 * @param seriesName
 * @param dataArr
 * @param dateArr
 * @param dateMap
 * @param averageArr
 */
var drawLineChart=function(chartId,legendArr, seriesName, dataArr, dateArr,dateMap,averageArr){
    var option = {
        tooltip : {
            trigger: 'axis',
            formatter: function (params) {
                var res = "";
                for (var i = 0, l = params.length; i < l; i++) {
                    if(params[i].seriesName != '平均线'){
                        res += params[i].name;
                        res += '<br/>卖家上拍量' + ' : ' + dateMap.get(params[i].name).supply + ' 台';
                        res += '<br/>买家竞拍量' + ' : ' + dateMap.get(params[i].name).demand + ' 台';
                        res += '<br/>供需比例' + ' : ' + params[i].value;
                    }else{
                        res += '<br/>周期平均线' + ' : ' + params[i].value;
                    }
                    //鼠标悬浮显示的字符串内容
                }
                return res;
            }
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
                type : 'value',
                axisLabel: {
                    show: true,
                    interval: 'auto',
                    formatter: '{value}'
                },
                show: true
            }
        ],
        series : [
            {
                name:seriesName[0],
                smooth:true,
                type:'line',
                stack: '总量',
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data:dataArr/*[150, 232, 201, 154, 190, 330, 410]*/
            },
            {
                name:seriesName[1],
                type:'line',
                itemStyle: {
                    normal:{
                        color:'#69BFEC',
                        lineStyle:{
                            width:2,
                            type:'dotted'  //'dotted'虚线 'solid'实线
                        }
                    }
                },
                data:averageArr
            }
        ]
    };
    var passInLineChart = echarts.init(document.getElementById(chartId));
    passInLineChart.setOption(option);
    window.addEventListener('resize',passInLineChart.resize);

};

/**
 * 绘制流拍面积图
 * @param chartId
 * @param legendArr
 * @param seriesName
 * @param dataArr
 * @param dateArr
 * @param dateMap
 * @param averageArr
 */
var drawPassInLineChart=function(chartId,legendArr, seriesName, dataArr, dateArr,dateMap,averageArr){
    var option = {
        tooltip : {
            trigger: 'axis',
            formatter: function (params) {
                //console.log(params);
                var res = "";
                for (var i = 0, l = params.length; i < l; i++) {
                    if(params[i].seriesName != '平均线'){
                        res += params[i].name;
                        res += '<br/>供货量' + ' : ' + dateMap.get(params[i].name).supply + ' 台';
                        res += '<br/>流拍量' + ' : ' + dateMap.get(params[i].name).pass + ' 台';
                        res += '<br/>流拍比例' + ' : ' + params[i].value + '%';
                    }else{
                        if(params[i].value==undefined || params[i].value==null){
                            res += '<br/>周期平均线' + ' : ' + '0.00' + '%';
                        }else{
                            res += '<br/>周期平均线' + ' : ' + params[i].value + '%';
                        }

                    }
                    //鼠标悬浮显示的字符串内容
                }
                return res;
            }
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
                type : 'value',
                axisLabel: {
                    show: true,
                    interval: 'auto',
                    formatter: '{value} %'
                },
                show: true
            }
        ],
        series : [
            {
                name:seriesName[0],
                smooth:true,
                type:'line',
                stack: '总量',
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data:dataArr/*[150, 232, 201, 154, 190, 330, 410]*/
            },
            {
                name:seriesName[1],
                type:'line',
                itemStyle: {
                    normal:{
                        color:'#69BFEC',
                        lineStyle:{
                            width:2,
                            type:'dotted'  //'dotted'虚线 'solid'实线
                        }
                    }
                },
                data:averageArr
            }
        ]
    };
    var passInLineChart = echarts.init(document.getElementById(chartId));
    passInLineChart.setOption(option);
    window.addEventListener('resize',passInLineChart.resize);

};

/**
 * 绘制确认面积图
 * @param chartId
 * @param legendArr
 * @param seriesName
 * @param dataArr
 * @param dateArr
 * @param dateMap
 * @param averageArr
 */
var drawConfirmLineChart=function(chartId,legendArr, seriesName, dataArr, dateArr,dateMap,averageArr){
    var option = {
        tooltip : {
            trigger: 'axis',
            formatter: function (params) {
                //console.log(params);
                var res = "";
                for (var i = 0, l = params.length; i < l; i++) {
                    if(params[i].seriesName != '平均线'){
                        res += params[i].name;
                        res += '<br/>质检量' + ' : ' + dateMap.get(params[i].name).inspect + ' 台';
                        res += '<br/>确认量' + ' : ' + dateMap.get(params[i].name).confirm + ' 台';
                        res += '<br/>确认比例' + ' : ' + params[i].value + '%';
                    }else{
                        if(params[i].value==undefined || params[i].value==null){
                            res += '<br/>周期平均线' + ' : ' + '0.00' + '%';
                        }else{
                            res += '<br/>周期平均线' + ' : ' + params[i].value + '%';
                        }

                    }
                    //鼠标悬浮显示的字符串内容
                }
                return res;
            }
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
                type : 'value',
                axisLabel: {
                    show: true,
                    interval: 'auto',
                    formatter: '{value} %'
                },
                show: true
            }
        ],
        series : [
            {
                name:seriesName[0],
                smooth:true,
                type:'line',
                stack: '总量',
                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data:dataArr/*[150, 232, 201, 154, 190, 330, 410]*/
            },
            {
                name:seriesName[1],
                type:'line',
                itemStyle: {
                    normal:{
                        color:'#69BFEC',
                        lineStyle:{
                            width:2,
                            type:'dotted'  //'dotted'虚线 'solid'实线
                        }
                    }
                },
                data:averageArr
            }
        ]
    };
    var passInLineChart = echarts.init(document.getElementById(chartId));
    passInLineChart.setOption(option);
    window.addEventListener('resize',passInLineChart.resize);

};
//渲染流拍分析图

//设置
var setPassInData = function(obj){
    //设置台数等整数
    htmlNumSet(obj.num,obj.selector);
    if(obj.percent != -1){  //-1代表不用设置
        //设置百分比
        htmlPercentSet(obj.percent,obj.int_selector,obj.smart_selector);
    }
};

var setPassInTrend = function(obj){
    //设置趋势箭头
    htmlTrendSet(obj.selector,obj.trend);
    //设置环比百分比
    htmlPercentSet(obj.num,obj.int_selector,obj.smart_selector);
};

//陈璐佳的卡片
var setCartData = function(obj){
    //
    htmlNumSet(obj.num,obj.selector);
    //
    htmlPercentSet(obj.percent,obj.int_selector,obj.smart_selector);

    htmlTrendSet(obj.selector,obj.trend);
};
//陈璐佳的卡片
var setPercentCartData = function(obj){
    // 平均数部分
    htmlPercentSet(obj.num,obj.num_int_selector,obj.num_smart_selector);
    //  环比部分
    htmlPercentSet(obj.percent,obj.int_selector,obj.smart_selector);

    //环比的趋势
    htmlTrendSet(obj.selector,obj.trend);
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

function linkSelectInit(categoryKey){
    requestURL(dataService+"/foundation/getProductBrandByCategoryKey",{"categoryId":categoryKey}).done(function(result){
        $("#brand").html('<option value="0" selected>不限</option>');
        $("#model").html('<option value="0" selected>不限</option>');
        for(var i=0;i<result.length;i++){
            $("#brand").append('<option value="'+result[i].brandKey+'">'+result[i].brandName+'</option>');
        }
        //console.log(result[0].brandKey);
        //productInit(result[0].brandKey);
    });
}

function productInit(brandId){
    requestURL(dataService+"/foundation/getProductByBrandId",{"brandId":brandId}).done(function(result){
        $("#model").html('<option value="0" selected>不限</option>');
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

var instruments_panel = {
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

//设置数量
var htmlNumSet = function(to,selector){
    $("span[data-set='"+selector+"']").lemCounter({
        value_to: to,
        value_from: 0,
        animate_duration: 3,
        locale: 'en-US'
    });
};

//设置百分比
var htmlPercentSet = function(to,selector,_selector){
    var percent_int = parseInt(to);
    var percent_smart = accMul(accSub(to,percent_int),100);
    //console.log(percent_smart);
    if(to == Number.POSITIVE_INFINITY){
        $("span[data-set='"+selector+"']").html(Number.POSITIVE_INFINITY);
        $("span[data-set='"+_selector+"']").html('');
        $("span[data-set='clear']").html('');
    }else{
        if(selector == 'stock-line-trend-int'){
            $("span[data-set='clear']").html('.');
        }
        //整数部分
        $("span[data-set='"+selector+"']").lemCounter({
            value_to: percent_int,
            value_from: 0,
            animate_duration: 3,
            locale: 'en-US'
        });
        //小数部分
        $("span[data-set='"+_selector+"']").lemCounter({
            value_to: percent_smart,
            value_from: 0,
            animate_duration: 3,
            locale: 'en-US'
        });
    }
};

//设置趋势
var htmlTrendSet = function(selector,type){
    switch(type){
        case 0:
            //上升
            $("i[trend-set='"+selector+"']").attr("class","fa fa-caret-up");
            $("span[trend-color-set='"+selector+"']").attr("class","description-percentage text-green text-letter-down add-weight");
            break;
        case 1:
            //下降
            $("i[trend-set='"+selector+"']").attr("class","fa fa-caret-down");
            $("span[trend-color-set='"+selector+"']").attr("class","description-percentage text-red text-letter-down add-weight");
            break;
        case 3:
            //持平
            $("i[trend-set='"+selector+"']").attr("class","fa");
            $("span[trend-color-set='"+selector+"']").attr("class","description-percentage text-green text-letter-down add-weight");
            break;
    }
};

//获得环比
var getCircleCompare = function(preview,current){
    var prev = accMul(preview,1);
    var curr = accMul(current,1);

    if(prev > curr){
        return  accDiv(Math.round(accMul(accDiv(accSub(prev,curr),Math.abs(prev)),10000)),100);
    }else if(prev < curr){
        if(prev == 0){
            return  Number.POSITIVE_INFINITY;
        }
        return  accDiv(Math.round(accMul(accDiv(accSub(curr,prev),Math.abs(prev)),10000)),100);
    }else{
        return  0;
    }
};

//获得环比趋势
var getCircleCompareTrend = function(preview,current){
    var prev = accMul(preview,1);
    var curr = accMul(current,1);
    if(prev > curr){
        return  1;      //下降
    }else if(prev < curr){
        return  0;      //上升
    }else{
        return  3;      //持平
    }
};

//获取数组中最大值和次最大值
var getMaxAndSecondMaxValue = function(dataMap,keyArr){
    var resArr = [];
    var valueArr = [];
    _.each(keyArr,function(ele){
        valueArr.push(dataMap[ele]*1);
    });
    valueArr.sort(function(a,b){return a-b;});
    var max = valueArr[valueArr.length-1];
    var maxN = valueArr[valueArr.length-2];
    resArr.push(maxN);
    resArr.push(max);
    return resArr;
};

//获取数组中最小值
var getMinValue = function(dataMap,keyArr){
    var valueArr = [];
    _.each(keyArr,function(ele){
        valueArr.push(dataMap[ele]*1);
    });
    valueArr.sort(function(a,b){return a-b;});
    var min = valueArr[0];
    return min;
};

var appendAskSignToTable = function(){
    var flag = instruments_panel.imPhone();//PC端
    var scrollWidth = document.body.scrollWidth;
    if(flag){
        if(scrollWidth<=1269){
            forceChartFontStyle.fontSize = 10;
        }
        if(scrollWidth<=1522){
            forceChartFontStyle.fontSize = 12;
            forceChartFontStyle.sellerReturnPosition = 500;
            $("#dealCountTable").attr("style","font-size:10px;");
            $("#dealAmountTable").attr("style","font-size:10px;");
            $("#bidCountTable").attr("style","font-size:10px;");
            $("#bidPriceTable").attr("style","font-size:10px;");
        }
    }

};


/***********************************************@Author:YuLe.Zhang-End*************************************************/