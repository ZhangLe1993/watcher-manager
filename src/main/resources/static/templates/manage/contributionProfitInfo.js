Template.contributionProfitInfo.rendered = function () {
    $('.navi-tab').removeClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    // var from = Template.currentData().from;
    // switch(from){
    //     case "manage":
    //         $('#managereport').addClass('active');
    //         $('#contributionProfitInfo').addClass('active');
    //         break;
    //     case "price":
    //         $('#pricemonitor').addClass('active');
    //         $('#priceContributionProfitInfo').addClass('active');
    //         break;
    // }

    this.autorun(function () {
        // var from = Template.currentData().from;
        // switch(from){
        //     case "manage":
        //         $('#managereport').addClass('active');
        //         $('#contributionProfitInfo').addClass('active');
        //         break;
        //     case "price":
        //         $('#pricemonitor').addClass('active');
        //         $('#priceContributionProfitInfo').addClass('active');
        //         break;
        // }
    });

    drawPublicPage(0);
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        //获取已激活的标签页的名称
        var activeTab = e.target.hash;
        //console.log(activeTab);
        switch(activeTab){
            case "#all":
                //console.log("");
                currentPage = "all";
                setLoading();
                drawPublicPage(0);
                break;
            case "#phone":
                currentPage = "phone";
                setLoading();
                drawPublicPage(1);
                break;
            case "#computer":
                currentPage = "computer";
                setLoading();
                drawPublicPage(5);
                break;
            case "#photography":
                currentPage = "photography";
                setLoading();
                drawPublicPage(22);
                break;
            case "#digital":
                currentPage = "digital";
                setLoading();
                drawPublicPage(3);
                break;
        }
    });


    $("#search-btn").click(function(){
        setLoading();
        var brandFilter = $("#brand").val();
        if(brandFilter == null){
            brandFilter = allBrand;
        }

        var priceFilter = $("#price").val();
        if(priceFilter == null){
            priceFilter = [0,1,2,3,4,5,6,7,8,9,10,11];
        }
        //console.log(brandFilter);
        var cur = currentPage;
        switch(cur){
            case "all":
                //console.log("");
                currentPage = "all";
                setLoading();
                initFinalResult(sTime,eTime,categoryList,brandFilter,priceFilter);
                break;
            case "phone":
                currentPage = "phone";
                setLoading();
                initFinalResult(sTime,eTime,[1],brandFilter,priceFilter);
                break;
            case "computer":
                currentPage = "computer";
                setLoading();
                initFinalResult(sTime,eTime,[5],brandFilter,priceFilter);
                break;
            case "photography":
                currentPage = "photography";
                setLoading();
                initFinalResult(sTime,eTime,[22],brandFilter,priceFilter);
                break;
            case "digital":
                currentPage = "digital";
                setLoading();
                initFinalResult(sTime,eTime,[3],brandFilter,priceFilter);
                break;
        }
    });
};

var allFilterOptions = [];
var drawPublicPage = function(type){
    var dateGap = -6;
    var endDate = new Date().getNewDate(0);
    var startDate = new Date(endDate).getNewDate(dateGap);
    $('#date-range-btn span').html(startDate+"~"+endDate);
    var minDate="2016-01-01";
    initPriceMap();
    setLoading();
    $('#date-range-btn').daterangepicker(filterPickerOptionsFunc(startDate,endDate,minDate,false), dateRangeCallback);
    var promise = getFilterOptions();
    promise.done(function(ret){
        allFilterOptions = ret;
        var fRet = _.sortBy(ret,function(obj){ return accMul(obj.c_key,1)});
        if(type != 0){
            fRet = _.filter(ret,function(ele){ return ele.c_key == '' + type});
        }
        //console.log(fRet);
        renderSelectOption(fRet);
        var brandArr = [];
        _.each(fRet,function(ele){
            brandArr.push(ele.key);
        });
        allBrand = brandArr;
        if(type != 0){
            initFinalResult(startDate,endDate,[type],brandArr,[0,1,2,3,4,5,6,7,8,9,10,11]);
        }else {
            initFinalResult(startDate,endDate,categoryList,brandArr,[0,1,2,3,4,5,6,7,8,9,10,11]);
        }
    });
};
var allBrand = [];
var currentPage = "all";
//var finalResultList = [];
var categoryList = [1,3,5,6,22];
var priceMap = new Map();
var initPriceMap = function(){
    priceMap.set("0","其他机型");
    priceMap.set("1","0-100");
    priceMap.set("2","100-300");
    priceMap.set("3","300-500");
    priceMap.set("4","500-1000");
    priceMap.set("5","1000-1500");
    priceMap.set("6","1500-2000");
    priceMap.set("7","2000-3000");
    priceMap.set("8","3000-4000");
    priceMap.set("9","4000-6000");
    priceMap.set("10","6000-8000");
    priceMap.set("11","8000+");
    priceMap.set("12","总计");
};

var setLoading = function(){
    //
    $("#C2BChart").hide();
    $("#C2BChartLoading").show();
    $("#C2BTable").bootstrapTable('destroy');
    $("#C2BChartLoadingPanel").show();
    $("#C2BTableLoadingPanel").show();

    $("#C2BBrandTable").bootstrapTable('destroy');
    $("#C2BBrandTableLoadingPanel").show();

    $("#BDChart").hide();
    $("#BDChartLoading").show();
    $("#BDTable").bootstrapTable('destroy');
    $("#BDChartLoadingPanel").show();
    $("#BDTableLoadingPanel").show();

    $("#BDBrandTable").bootstrapTable('destroy');
    $("#BDBrandTableLoadingPanel").show();

    $("#selfChart").hide();
    $("#selfChartLoading").show();
    $("#selfTable").bootstrapTable('destroy');
    $("#selfChartLoadingPanel").show();
    $("#selfTableLoadingPanel").show();

    $("#selfBrandTable").bootstrapTable('destroy');
    $("#selfBrandTableLoadingPanel").show();
};

var initFinalResult = function(startDate,endDate,categoryList,brandArr,priceArr){
    var brand = arrToString(brandArr);
    var price = arrToString(priceArr);
    var category = arrToString(categoryList);
    requestURLPost(dataService+"/mUncheck/getFinalResultList", {startDate:startDate,endDate:endDate,category:category,brand:brand,price:price}).done(function (data) {
        //console.log(data);
        drawPage(data);
    });
};


var drawPage = function(finalResultList){
    //C2B就是全部数据
    var c2BList = finalResultList;
    var c2BDateListMap = _.groupBy(c2BList,'shop_out_date');
    //console.log(c2BDateListMap);
    var c2BChartResult = getChartData(c2BDateListMap);
    //console.log(c2BChartResult);
    //渲染C2B图
    drawChart('C2BChart',c2BChartResult);

    var bDList = _.filter(finalResultList,function(obj){return obj.source_type == 'BD'});
    var bdDateListMap = _.groupBy(bDList,'shop_out_date');
    //console.log(bdDateListMap);
    var bdChartResult = getChartData(bdDateListMap);
    //console.log(bdChartResult);
    //渲染BD图
    drawChart('BDChart',bdChartResult);

    var selfList = _.filter(finalResultList,function(obj){return obj.source_type == '自营'});
    var selfDateListMap = _.groupBy(selfList,'shop_out_date');
    //console.log(selfDateListMap);

    var selfChartResult = getChartData(selfDateListMap);
    drawChart('selfChart',selfChartResult);

    var c2BTableMap = _.groupBy(c2BList,'price_flag');
    //console.log(c2BTableMap);
    var c2BTableResult = getTableData(c2BTableMap);
    drawTable('C2BTable',c2BTableResult);
    var c2BBrandTableMap = _.groupBy(c2BList,'product_key');
    var c2BBrandTableResult = getBrandTableData(c2BBrandTableMap);
    drawBrandTable('C2BBrandTable',c2BBrandTableResult);

    var bdTableMap =  _.groupBy(bDList,'price_flag');
    //console.log(bdTableMap);
    var bdTableResult = getTableData(bdTableMap);
    drawTable('BDTable',bdTableResult);
    var bDBrandTableMap = _.groupBy(bDList,'product_key');
    var bDBrandTableResult = getBrandTableData(bDBrandTableMap);
    drawBrandTable('BDBrandTable',bDBrandTableResult);

    var selfTableMap =  _.groupBy(selfList,'price_flag');
    //console.log(selfTableMap);
    var selfTableResult = getTableData(selfTableMap);
    //console.log(_.sortBy(selfTableResult,'priceKey'));
    drawTable('selfTable',selfTableResult);
    var selfBrandTableMap = _.groupBy(selfList,'product_key');
    var selfBrandTableResult = getBrandTableData(selfBrandTableMap);
    drawBrandTable('selfBrandTable',selfBrandTableResult);
    //console.log(selfBrandTableMap);
    //console.log(selfBrandTableResult);
};

var drawChart = function(chartId,result){
    $("#"+chartId).show();
    $("#"+chartId+"Loading").hide();

    $("#"+chartId+"Panel").show();
    $("#"+chartId+"LoadingPanel").hide();
    var option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            left: 'center',
            data: ['负贡献额','负贡献利润订单量']
        },
        color:['#c23531','#61a0a8'],
        xAxis: [
            {
                type: 'category',
                data: result.dateArr
            }
        ],
        yAxis: [
            {
                type: 'value'
            },
            {
                type: 'value',
                axisLabel: {
                    formatter: '{value}'
                },
                min: -10,
                splitLine:{
                    show:false
                }
            }
        ],
        animationDuration: 2000,
        series: [
            {
                name: '负贡献额',
                type: 'bar',
                barWidth : 30,//柱图宽度
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        formatter: function(para) {
                            return para.value.toLocaleString();
                        }
                    }
                },
                data: result.amount
            },{
                name: '负贡献利润订单量',
                type: 'line',
                yAxisIndex: 1,
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        formatter: function(para) {
                            return para.value.toLocaleString();
                        }
                    }
                },
                data: result.count
            }
        ]
    };
    var chart = echarts.init(document.getElementById(chartId));
    //chart.setOption(option);
    chart.setOption(option, false, false);
    chart.resize();
    window.addEventListener('resize',chart.resize);
};

var drawTable = function(tableId,result){
    $("#"+tableId+"Panel").show();
    $("#"+tableId+"LoadingPanel").hide();
    $("#"+tableId).bootstrapTable('destroy').bootstrapTable({
        data: result,
        pagination: true,
        striped: true,
        pageSize: 13,
        search: true,
        pageList: [13],
        exportDataType:'all',
        exportTypes: ['csv'],
        columns:[
            {
                field:'price',
                title:'价位段',
                sortable:true
            },
            {
                field:'order_num',
                title:'负贡献利润订单量',
                sortable:true,
                formatter:function (value,row,index) {
                    return value.toLocaleString();
                }
            },
            {
                field:'out_num',
                title:'出货量',
                sortable:true,
                formatter:function (value,row,index) {
                    return value.toLocaleString();
                }
            },
            {
                field:'num_rate',
                title:'负贡献订单占比',
                sortable:true,
                formatter:function (value,row,index) {
                    return value+"%";
                }
            },
            {
                field:'amount',
                title:'负贡献毛利额',
                sortable:true,
                formatter:function (value,row,index) {
                    return value.toLocaleString();
                }
            },
            {
                field:'out_amount',
                title:'出货额',
                sortable:true,
                formatter:function (value,row,index) {
                    return value.toLocaleString();
                }
            },
            {
                field:'amount_rate',
                title:'负贡献毛利额占比',
                sortable:true,
                formatter:function (value,row,index) {
                    return value+"%";
                }
            },
            {
                field:'profit_amount',
                title:'券后毛利额',
                sortable:true,
                formatter:function (value,row,index) {
                    return value.toLocaleString();
                }
            },
            {
                field:'profit_rate',
                title:'券后毛利率',
                sortable:true,
                formatter:function (value,row,index) {
                    return value+"%";
                }
            }]
    });
};

var drawBrandTable = function(tableId,result){
    $("#"+tableId+"Panel").show();
    $("#"+tableId+"LoadingPanel").hide();
    $("#"+tableId).bootstrapTable('destroy').bootstrapTable({
        data: result,
        pagination: true,
        striped: true,
        pageSize: 13,
        search: true,
        pageList: [13],
        exportDataType:'all',
        exportTypes: ['csv'],
        columns:[
            {
                field:'brandName',
                title:'型号',
                sortable:true
            },
            {
                field:'order_num',
                title:'负贡献利润订单量',
                sortable:true,
                formatter:function (value,row,index) {
                    return value.toLocaleString();
                }
            },
            {
                field:'out_num',
                title:'出货量',
                sortable:true,
                formatter:function (value,row,index) {
                    return value.toLocaleString();
                }
            },
            {
                field:'num_rate',
                title:'负贡献订单占比',
                sortable:true,
                formatter:function (value,row,index) {
                    return value+"%";
                }
            },
            {
                field:'amount',
                title:'负贡献毛利额',
                sortable:true,
                formatter:function (value,row,index) {
                    return value.toLocaleString();
                }
            },
            {
                field:'out_amount',
                title:'出货额',
                sortable:true,
                formatter:function (value,row,index) {
                    return value.toLocaleString();
                }
            },
            {
                field:'amount_rate',
                title:'负贡献毛利额占比',
                sortable:true,
                formatter:function (value,row,index) {
                    return value+"%";
                }
            },
            {
                field:'profit_amount',
                title:'券后毛利额',
                sortable:true,
                formatter:function (value,row,index) {
                    return value.toLocaleString();
                }
            },
            {
                field:'profit_rate',
                title:'券后毛利率',
                sortable:true,
                formatter:function (value,row,index) {
                    return value+"%";
                }
            }]
    });
};

var getChartData = function(listMap){
    var chartResult = {dateArr:[],count:[],amount:[]};
    _.each(listMap,function(value,key){
        chartResult.dateArr.push(key);
        //负贡献毛利订单量
        var count_temp = _.reduce(value,function(num,temp){ return num + accMul(temp['negative_month_contribution_margin_rate_order'],1)},0);

        chartResult.count.push(count_temp);
        //负贡献毛利额
        var amount_temp = Math.abs(Math.round(_.reduce(value,function(num,temp){ return num + accMul(temp["negative_contribution_amonth"],1)},0)));

        chartResult.amount.push(amount_temp);
    });
    return chartResult;
};

var getTableData = function(listMap){
    var selfTableResult = [];
    _.each(listMap,function(value,key){
        selfTableResult.push({
            priceKey:key,
            //价位段
            price:priceMap.get(key),
            //总出货量
            out_num: _.reduce(value,function(num,temp){ return num + accMul(temp["total_shop_out_count"],1)},0),
            //负贡献利润订单量
            order_num: _.reduce(value,function(num,temp){ return num + accMul(temp["negative_month_contribution_margin_rate_order"],1)},0),
            //负贡献订单占比
            num_rate:accDiv(Math.round(accMul(accDiv(_.reduce(value,function(num,temp){ return num + accMul(temp["negative_month_contribution_margin_rate_order"],1)},0),_.reduce(value,function(num,temp){ return num + accMul(temp["total_shop_out_count"],1)},0)),10000)),100),
            //负贡献毛利额
            amount: Math.round(Math.abs(accDiv(Math.round(accMul(_.reduce(value,function(num,temp){ return num + accMul(temp["negative_contribution_amonth"],1)},0),100)),100))),
            //出货额
            out_amount: Math.round(accDiv(Math.round(accMul(_.reduce(value,function(num,temp){ return num + accMul(temp["item_quotation_price_num"],1)},0),100)),100)),
            //负贡献毛利额占比
            amount_rate:Math.abs(accDiv(Math.round(accMul(accDiv(_.reduce(value,function(num,temp){ return num + accMul(temp["negative_contribution_amonth"],1)},0),_.reduce(value,function(num,temp){ return num + accMul(temp["item_quotation_price_num"],1)},0)),10000)),100)),
            //券后毛利额
            profit_amount: Math.round(accDiv(Math.round(accMul(_.reduce(value,function(num,temp){ return num + accMul(temp["no_conpon_profit_amount"],1)},0),100)),100)),
            //券后毛利额占比
            profit_rate:Math.abs(accDiv(Math.round(accMul(accDiv(Math.round(accDiv(Math.round(accMul(_.reduce(value,function(num,temp){ return num + accMul(temp["no_conpon_profit_amount"],1)},0),100)),100)),Math.round(accDiv(Math.round(accMul(_.reduce(value,function(num,temp){ return num + accMul(temp["item_quotation_price_num"],1)},0),100)),100))),10000)),100))
        });
    });
    var tempList = selfTableResult;
    //计算总计
    selfTableResult.push({
        priceKey:'12',
        //价位段
        price:priceMap.get('12'),
        //总出货量
        out_num: _.reduce(tempList,function(num,temp){ return num + accMul(temp["out_num"],1)},0),
        //负贡献利润订单量
        order_num: _.reduce(tempList,function(num,temp){ return num + accMul(temp["order_num"],1)},0),
        //负贡献订单占比
        num_rate: accDiv(Math.round(accMul(accDiv(_.reduce(tempList,function(num,temp){ return num + accMul(temp["order_num"],1)},0),_.reduce(tempList,function(num,temp){ return num + accMul(temp["out_num"],1)},0)),10000)),100),
        //负贡献毛利额
        amount:_.reduce(tempList,function(num,temp){ return num + accMul(temp["amount"],1)},0),
        //出货额
        out_amount: _.reduce(tempList,function(num,temp){ return num + accMul(temp["out_amount"],1)},0),
        //负贡献毛利额占比总计
        amount_rate:accDiv(Math.round(accMul(accDiv(_.reduce(tempList,function(num,temp){ return num + accMul(temp["amount"],1)},0),_.reduce(tempList,function(num,temp){ return num + accMul(temp["out_amount"],1)},0)),10000)),100),
        //券后毛利额
        profit_amount: _.reduce(tempList,function(num,temp){ return num + accMul(temp["profit_amount"],1)},0),
        //券后毛利额占比
        profit_rate:accDiv(Math.round(accMul(accDiv(_.reduce(tempList,function(num,temp){ return num + accMul(temp["profit_amount"],1)},0),_.reduce(tempList,function(num,temp){ return num + accMul(temp["out_amount"],1)},0)),10000)),100)
    });
    return _.sortBy(selfTableResult,function(ele){return accMul(ele.priceKey,1)});
};

var getBrandTableData = function(listMap){
    var tableResult = [];
    _.each(listMap,function(value,key){
        tableResult.push({
            brandKey:key,
            //价位段
            brandName:value[0]['product_name'],
            //总出货量
            out_num: _.reduce(value,function(num,temp){ return num + accMul(temp["total_shop_out_count"],1)},0),
            //负贡献利润订单量
            order_num: _.reduce(value,function(num,temp){ return num + accMul(temp["negative_month_contribution_margin_rate_order"],1)},0),
            //负贡献订单占比
            num_rate:accDiv(Math.round(accMul(accDiv(_.reduce(value,function(num,temp){ return num + accMul(temp["negative_month_contribution_margin_rate_order"],1)},0),_.reduce(value,function(num,temp){ return num + accMul(temp["total_shop_out_count"],1)},0)),10000)),100),
            //负贡献毛利额
            amount: Math.round(Math.abs(accDiv(Math.round(accMul(_.reduce(value,function(num,temp){ return num + accMul(temp["negative_contribution_amonth"],1)},0),100)),100))),
            //出货额
            out_amount: Math.round(accDiv(Math.round(accMul(_.reduce(value,function(num,temp){ return num + accMul(temp["item_quotation_price_num"],1)},0),100)),100)),
            //负贡献毛利额占比
            amount_rate:Math.abs(accDiv(Math.round(accMul(accDiv(_.reduce(value,function(num,temp){ return num + accMul(temp["negative_contribution_amonth"],1)},0),_.reduce(value,function(num,temp){ return num + accMul(temp["item_quotation_price_num"],1)},0)),10000)),100)),
            //券后毛利额
            profit_amount: Math.round(accDiv(Math.round(accMul(_.reduce(value,function(num,temp){ return num + accMul(temp["no_conpon_profit_amount"],1)},0),100)),100)),
            //券后毛利额占比
            profit_rate:accDiv(Math.round(accMul(accDiv(Math.round(accDiv(Math.round(accMul(_.reduce(value,function(num,temp){ return num + accMul(temp["no_conpon_profit_amount"],1)},0),100)),100)),Math.round(accDiv(Math.round(accMul(_.reduce(value,function(num,temp){ return num + accMul(temp["item_quotation_price_num"],1)},0),100)),100))),10000)),100)
        });
    });
    //var tempList = tableResult;
    /*//计算总计
    selfTableResult.push({
        priceKey:'10',
        //价位段
        price:priceMap.get('10'),
        //总出货量
        out_num: _.reduce(tempList,function(num,temp){ return num + accMul(temp["out_num"],1)},0),
        //负贡献利润订单量
        order_num: _.reduce(tempList,function(num,temp){ return num + accMul(temp["order_num"],1)},0),
        //负贡献订单占比
        num_rate: accDiv(Math.round(accMul(accDiv(_.reduce(tempList,function(num,temp){ return num + accMul(temp["order_num"],1)},0),_.reduce(tempList,function(num,temp){ return num + accMul(temp["out_num"],1)},0)),10000)),100),
        //负贡献毛利额
        amount:_.reduce(tempList,function(num,temp){ return num + accMul(temp["amount"],1)},0),
        //出货额
        out_amount: _.reduce(tempList,function(num,temp){ return num + accMul(temp["out_amount"],1)},0),
        //负贡献毛利额占比总计
        amount_rate:accDiv(Math.round(accMul(accDiv(_.reduce(tempList,function(num,temp){ return num + accMul(temp["amount"],1)},0),_.reduce(tempList,function(num,temp){ return num + accMul(temp["out_amount"],1)},0)),10000)),100),
        //券后毛利额
        profit_amount: _.reduce(tempList,function(num,temp){ return num + accMul(temp["profit_amount"],1)},0),
        //券后毛利额占比
        profit_rate:accDiv(Math.round(accMul(accDiv(_.reduce(tempList,function(num,temp){ return num + accMul(temp["profit_amount"],1)},0),_.reduce(tempList,function(num,temp){ return num + accMul(temp["out_amount"],1)},0)),10000)),100)
    });*/
    return _.sortBy(tableResult,function(ele){return -accMul(ele.amount,1)});
};

var sTime = new Date().getNewDate(-6);
var eTime = new Date().getNewDate(0);
//日期回调函数
function dateRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    var dif = GetDateDiff(sdt, edt, "day");
    if(dif > 7){
        customModal("温馨提示",'时间不要大于7天');
        return;
    }
    $('#date-range-btn span').html(sdt + ' - ' + edt);
    sTime = sdt;
    eTime = edt;
}
function getFilterOptions(){
    var dfd = $.Deferred();
    requestURL(dataService+"/foundation/getProductCategoryJoinBrand",{}).done(function(ret){
        dfd.resolve(ret);
    });
    return dfd.promise();
}
var renderSelectOption = function(ret){
    //console.log(ret);
    $("#brand").attr("multiple","multiple");
    $("#brand").empty();
    if(ret.length > 0){
        var res= _.filter(ret,function(obj){return obj.key != '-1'});
        renderOptions("#brand",res);
        $("#brand").multipleSelect({
            placeholder: "全部",
            selectAllText:"全选",
            width: 200,
            selectAll: false,
            filter:true
        });
        modifyCSS(".brand");
    }

    var priceList = [
        {"key":"1","value":"0-100"},{"key":"2","value":"100-300"},{"key":"3","value":"300-500"},
        {"key":"4","value":"500-1000"},{"key":"5","value":"1000-1500"},{"key":"6","value":"1500-2000"},
        {"key":"7","value":"2000-3000"},{"key":"8","value":"3000-4000"},{"key":"9","value":"4000-6000"},
        {"key":"10","value":"6000-8000"},{"key":"11","value":"8000+"},
        {"key":"0","value":"其他机型"}
    ];
    $("#price").attr("multiple","multiple");
    renderOptions("#price",priceList);
    $("#price").multipleSelect({
        placeholder: "全部",
        selectAllText:"全选",
        width: 200,
        selectAll: true,
        filter:true
    });
    modifyCSS(".price");
};

var renderOptions = function(sel,data){
    $(sel).empty();
    data.forEach(function(ele){
        $(sel).append("<option value='"+ele.key+"'>"+ele.value+"</option>");
    });
};

var modifyCSS = function(sel){
    $(sel).find(".ms-choice").css("height","32px");
    $(sel).find(".ms-choice").css("line-height","32px");
    $(sel).find(".ms-choice").css("font-size","15px");
    $(sel).find(".ms-choice>div").css("height","32px");
    $(sel).find(".ms-choice>div").css("top","3px");

    $(sel).find(".ms-drop").css("font-size","15px");
};


var arrToString = function(arr) {
    var str = "";
    _.each(arr,function(ele){
        str += ele + ",";
    });
    //去掉最后一个逗号(如果不需要去掉，就不用写)
    if (str.length > 0) {
        str = str.substr(0, str.length - 1);
    }
    return str;
};

//自定义弹出层
function customModal(title,data){
    $("#myModal").on('show.bs.modal', function () {
        $("#myModalLabel").text(title);
        $("div[name='showContent']").text(data);
        /*$("#modalContent").bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data:data,
            columns: colums
        });*/
    });
    $("#myModal").modal();
}

function GetDateDiff(startTime, endTime, diffType) {
    //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式
    startTime = startTime.replace(/\-/g, "/");
    endTime = endTime.replace(/\-/g, "/");
    //将计算间隔类性字符转换为小写
    diffType = diffType.toLowerCase();
    var sTime =new Date(startTime); //开始时间
    var eTime =new Date(endTime); //结束时间
    //作为除数的数字
    var timeType =1;
    switch (diffType) {
        case"second":
            timeType =1000;
            break;
        case"minute":
            timeType =1000*60;
            break;
        case"hour":
            timeType =1000*3600;
            break;
        case"day":
            timeType =1000*3600*24;
            break;
        default:
            break;
    }
    return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(timeType));
}








