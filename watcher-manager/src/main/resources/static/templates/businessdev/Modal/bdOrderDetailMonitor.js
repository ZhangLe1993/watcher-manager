Template.bdOrderDetailMonitor.rendered = function () {

    var channel = this.data.channel;
    var first = true;

    if(isMobile()){
        $('.sidebar-toggle').click();
    }

    //提交
    orderTradeNumMixedChart = echarts.init(document.getElementById('orderTradeNumMixedChart'));
    orderTradeAmountMixedChart = echarts.init(document.getElementById('orderTradeAmountMixedChart'));
    TradeNumMethodMixedChart = echarts.init(document.getElementById("TradeNumMethodMixedChart"));
    TradeAmountMethodMixedChart = echarts.init(document.getElementById('TradeAmountMethodMixedChart'));
    TradeNumCategoryMixedChart = echarts.init(document.getElementById('TradeNumCategoryMixedChart'));
    TradeAmountCategoryMixedChart = echarts.init(document.getElementById('TradeAmountCategoryMixedChart'));
    //成交
    orderTradedNumMixedChart = echarts.init(document.getElementById('orderTradedNumMixedChart'));
    orderTradedAmountMixedChart = echarts.init(document.getElementById('orderTradedAmountMixedChart'));
    TradedNumMethodMixedChart = echarts.init(document.getElementById('TradedNumMethodMixedChart'));
    TradedAmountMethodMixedChart = echarts.init(document.getElementById('TradedAmountMethodMixedChart'));
    TradedNumCategoryMixedChart = echarts.init(document.getElementById('TradedNumCategoryMixedChart'));
    TradedAmountCategoryMixedChart = echarts.init(document.getElementById('TradedAmountCategoryMixedChart'));

    getYesterdayOrderStats(channel);
    // Deps.autorun(function () {
    //     if (location.pathname.indexOf('orderDetailMonitor') > 0||location.pathname.indexOf('JDTradeMonitorJDOnly') > 0) {

    //         draworderTradeNumMixedChart(channel);
    //         draworderTradeAmountMixedChart(channel);
    //         drawTradeNumMethodMixedChart(channel);
    //         drawTradeAmountMethodMixedChart(channel);
    //         drawTradeNumCategoryMixedChart(channel);
    //         drawTradeAmountCategoryMixedChart(channel);

    //         draworderTradedNumMixedChart(channel);
    //         draworderTradedAmountMixedChart(channel);
    //         drawTradedNumMethodMixedChart(channel);
    //         drawTradedAmountMethodMixedChart(channel);
    //         drawTradedNumCategoryMixedChart(channel);
    //         drawTradedAmountCategoryMixedChart(channel);
    //     }

    // });

    setInterval(function (){
        getYesterdayOrderStats(channel);
    },5*60*1000)

};

function getYesterdayOrderStats(channel){
    //提交订单信息
    requestURL(dataService+"/bd/getOrderStatsByChannel",{"channel":channel,"type":"submit"}).done(function (ret) {
        var trade_num = 0;
        var trade_price = 0;
        ret.forEach(function (e) {
            trade_num = trade_num + e.num;
            trade_price = trade_price+e.amount;
        });

        $('#yesterdaySubmitNum').html("\n昨日同时间："+trade_num.toLocaleString());
        $('#yesterdaySubmitPrice').html("\n昨日同时间：￥"+trade_price.toLocaleString());
        draworderTradeNumMixedChart(channel,ret);
        draworderTradeAmountMixedChart(channel,ret);
    });
    requestURL(dataService+"/bd/getOrderStatsByChannel",{"channel":channel,"type":"traded"}).done(function (ret) {
        var trade_num = 0;
        var trade_price = 0;
        ret.forEach(function (e) {
            trade_num = trade_num + e.num;
            trade_price = trade_price+e.amount;
        });

        $('#yesterdaySuccessNum').html("\n昨日同时间："+trade_num.toLocaleString());
        $('#yesterdaySuccessPrice').html("\n昨日同时间：￥"+trade_price.toLocaleString());
        draworderTradedAmountMixedChart(channel,ret);
        draworderTradedNumMixedChart(channel,ret);
    });

    requestURL(dataService+"/bd/getOrderStatsByAddressType",{"channel":channel,"type":"submit"}).done(function (ret) {
        drawTradeNumMethodMixedChart(channel,ret);
        drawTradeAmountMethodMixedChart(channel,ret);
    });

    requestURL(dataService+"/bd/getOrderStatsByAddressType",{"channel":channel,"type":"traded"}).done(function (ret) {
        drawTradedNumMethodMixedChart(channel,ret);
        drawTradedAmountMethodMixedChart(channel,ret);
    });

    requestURL(dataService+"/bd/getOrderStatsByCategory",{"channel":channel,"type":"submit"}).done(function (ret) {
        drawTradeNumCategoryMixedChart(channel,ret);
        drawTradeAmountCategoryMixedChart(channel,ret);
    });

    requestURL(dataService+"/bd/getOrderStatsByCategory",{"channel":channel,"type":"traded"}).done(function (ret) {
        drawTradedNumCategoryMixedChart(channel,ret);
        drawTradedAmountCategoryMixedChart(channel,ret);
    });
}

// Template.bdOrderDetailMonitor.helpers({

//     todayOrderTradeObj: function () {
//         var channel = (this.channel);
//         //return
//         var records = bdOrderTradeDetailStats.find({cooperation:channel}, { sort: { createdDt: -1 } }).fetch();
//         //提交
//         var order_nums = 0;
//         var order_amount = 0;
//         //成交
//         var trade_nums = 0;
//         var trade_amount = 0;
//         var dt;
//         var jdPlatform = "";
//         records.forEach(function (obj) {
//             dt = obj.createdDt;
//             jdPlatform = obj.jdPlatform;
//             if (obj.type == "0") {
//                 order_nums += obj.tradeNum;
//                 order_amount += obj.payAmount;
//             } else if (obj.type == "1") {
//                 trade_nums += obj.tradeNum;
//                 trade_amount += obj.payAmount;
//             }
//         });
//         return {
//             "jdPlatform": jdPlatform,
//             "order_nums": order_nums.toLocaleString(),
//             "order_amount": "￥" + order_amount.toLocaleString(),
//             "trade_nums": trade_nums.toLocaleString(),
//             "trade_amount": "￥" + trade_amount.toLocaleString(),
//             "dt": dt
//         };
//     },

// });


function parseAgentSource(agentSource) {
    var platform = "";
    if (agentSource == "京东APP" || agentSource == "京东APP2") {
        platform = "京东APP版"
    } else if (agentSource == "京东PC" || agentSource == "京东相机" || agentSource == "京东合作报价" || agentSource == "京东3C合作报价") {
        platform = "京东PC版"
    } else if (agentSource == "京东M" || agentSource == "京东M2") {
        platform = "京东M版"
    } else if (agentSource == "京东微信" || agentSource == "京东微信2") {
        platform = "京东微信版"
    }else{
        platform = agentSource
    }
    return platform;
}

//按平台的提交订单量
function draworderTradeNumMixedChart(channel,yesterList) {
    //提交 type=0
    var dataSets = bdOrderTradeDetailStats.find({type: "0" ,cooperation:channel}, { sort: { tradeNum: -1 } }).fetch();
    var labels = [];
    var xLabels = [];
    var barData = [];
    var pieData = [];
    var dataObj=[];
    var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
    var obj = _.groupBy(dataSets,function(obj){return parseAgentSource(obj.subCooperation)});
    for (var key in obj){
        var sum = _.reduce(obj[key], function(num, tmp){ return num + tmp.tradeNum; }, 0);
        dataObj.push({key:key,value:sum})

    }
    _.sortBy(dataObj,function(obj){return -obj.value}).forEach(function(obj){
        labels.push(obj.key);
        if(yesterList){
            var yesterObj = _.groupBy(yesterList,function(obj){return parseAgentSource(obj.name)});
            xLabels.push(obj.key + ":" + obj.value+"\n昨日:"+  _.reduce(yesterObj[obj.key], function(num, tmp){ return num + tmp.num; }, 0));
        }else{
            var yesterAppend='';
            try{
                var tmpXLabels = orderTradeNumMixedChart.getOption().xAxis[0].data;
                tmpXLabels.forEach(function(ele){
                    var tmpKey = ele.split(":")[0];
                    if(tmpKey==obj.key){
                        yesterAppend = (ele.split("\n")[1])
                    }
                })
            }catch (err){
                //console.log(err)
            }
            xLabels.push(obj.key + ":" + obj.value+"\n"+yesterAppend);
        }
        barData.push({
            value: obj.value,
            itemStyle: {
                normal: {
                    color: colors.pop()
                }
            }
        });
        pieData.push({ name: obj.key, value: obj.value })
    })

    var option = {
        title: {
            text: '提交订单量(平台)',
            top: '85%',
            left: 'center'
        },
        tooltip: {
            formatter: '{a}：{c}'
        },
        legend: {
            data: labels
        },
        calculable: true,
        grid: {
            top: 80,
            bottom: 100
        },
        xAxis: [
            {
                'type': 'category',
                'data': xLabels
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '提交订单量',
                type: 'bar',
                label: { normal: { show: true, position: 'top', formatter: '{b}' } },
                data: barData
            }, {
                name: '订单量渠道占比',
                type: 'pie',
                center: ['75%', '30%'],
                radius: '28%',
                data: pieData
            }]
    };
    orderTradeNumMixedChart.setOption(option);
    window.addEventListener('resize', function () {
        orderTradedNumMixedChart.resize();
    })

}

//按回收方式的提交订单量
function drawTradeNumMethodMixedChart(channel,yesterList) {

    //提交 type=0
    var dataSets = bdOrderTradeDetailStats.find({type: "0" ,cooperation:channel}, { sort: { tradeNum: -1 } }).fetch();
    var labels = [];
    var xLabels = [];
    var barData = [];
    var pieData = [];
    var dataObj = [];
    var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
    var obj = _.groupBy(dataSets,function(obj){return obj.addressType});
    for (var key in obj){
        var sum = _.reduce(obj[key], function(num, tmp){ return num + tmp.tradeNum; }, 0);
        key=parseAddressTypeToTradeMethod(key);
        dataObj.push({key:key,value:sum});

    }
    _.sortBy(dataObj,function(obj){return -obj.value}).forEach(function(obj){
        labels.push(obj.key);
        if(yesterList){
            var yesterObj = _.groupBy(yesterList,function(obj){return obj.name});
            xLabels.push(obj.key + ":" + obj.value+"\n昨日:"+_.reduce(yesterObj[obj.key], function(num, tmp){ return num + tmp.num; }, 0));
        }else{
            var yesterAppend='';
            try{
                var tmpXLabels = TradeNumMethodMixedChart.getOption().xAxis[0].data;
                tmpXLabels.forEach(function(ele){
                    var tmpKey = ele.split(":")[0];
                    if(tmpKey==obj.key){
                        yesterAppend = (ele.split("\n")[1])
                    }
                })
            }catch (err){
                //console.log(err)
            }
            xLabels.push(obj.key + ":" + obj.value+"\n"+yesterAppend);
        }
        barData.push({
            value:  obj.value,
            itemStyle: {
                normal: {
                    color: colors.pop()
                }
            }
        });
        pieData.push({ name: obj.key, value:  obj.value })
    })
    var option = {
        title: {
            text: '提交订单量(回收方式)',
            top: '85%',
            left: 'center'
        },
        tooltip: {
            formatter: '{a}：{c}'
        },
        legend: {
            data: labels
        },
        calculable: true,
        grid: {
            top: 80,
            bottom: 100
        },
        xAxis: [
            {
                'type': 'category',
                'data': xLabels
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '提交订单量',
                type: 'bar',
                label: { normal: { show: true, position: 'top', formatter: '{b}' } },
                data: barData
            }, {
                name: '订单量渠道占比',
                type: 'pie',
                center: ['75%', '30%'],
                radius: '28%',
                data: pieData
            }]
    };

    TradeNumMethodMixedChart.setOption(option);
    window.addEventListener('resize', function () {
        TradeNumMethodMixedChart.resize();
    })
}

//按品类的提交订单量
function drawTradeNumCategoryMixedChart(channel,yesterList) {

    //提交 type=0
    var dataSets = bdOrderTradeDetailStats.find({type: "0" ,cooperation:channel}, { sort: { tradeNum: -1 } }).fetch();
    var labels = [];
    var xLabels = [];
    var barData = [];
    var pieData = [];
    var dataObj = [];
    var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
    var obj = _.groupBy(dataSets,function(obj){return obj.categoryName});
    for (var key in obj){
        var sum = _.reduce(obj[key], function(num, tmp){ return num + tmp.tradeNum; }, 0);
        dataObj.push({key:key,value:sum});
    }
    _.sortBy(dataObj,function(obj){return -obj.value}).forEach(function(obj){
        labels.push(obj.key);
        if(yesterList){
            var yesterObj = _.groupBy(yesterList,function(obj){return obj.name});
            xLabels.push(obj.key + ":" + obj.value+"\n昨日:"+_.reduce(yesterObj[obj.key], function(num, tmp){ return num + tmp.num; }, 0));
        }else{
            var yesterAppend='';
            try{
                var tmpXLabels = TradeNumCategoryMixedChart.getOption().xAxis[0].data;
                tmpXLabels.forEach(function(ele){
                    var tmpKey = ele.split(":")[0];
                    if(tmpKey==obj.key){
                        yesterAppend = (ele.split("\n")[1])
                    }
                })
            }catch (err){
                //console.log(err)
            }
            xLabels.push(obj.key + ":" + obj.value+"\n"+yesterAppend);
        }
        barData.push({
            value:  obj.value,
            itemStyle: {
                normal: {
                    color: colors.pop()
                }
            }
        });
        pieData.push({ name: obj.key, value:  obj.value })
    })
    var option = {
        title: {
            text: '提交订单量(品类)',
            top: '85%',
            left: 'center'
        },
        tooltip: {
            formatter: '{a}：{c}'
        },
        legend: {
            data: labels
        },
        calculable: true,
        grid: {
            top: 80,
            bottom: 100
        },
        xAxis: [
            {
                'type': 'category',
                'data': xLabels
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '提交订单量',
                type: 'bar',
                label: { normal: { show: true, position: 'top', formatter: '{b}' } },
                data: barData
            }, {
                name: '订单量渠道占比',
                type: 'pie',
                center: ['75%', '30%'],
                radius: '28%',
                data: pieData
            }]
    };

    TradeNumCategoryMixedChart.setOption(option);
    window.addEventListener('resize', function () {
        TradeNumCategoryMixedChart.resize();
    })
}


function parseAddressTypeToTradeMethod(addressType) {
    var TradeMethod = "";
    switch (addressType){
        case "1":
            TradeMethod = "上门取货";
            break;
        case "2":
            TradeMethod = "地铁站";
            break;
        case "3":
            TradeMethod = "星巴克";
            break;
        case "4":
            TradeMethod = "快递取货";
            break;
        case "5":
            TradeMethod = "门店";
            break;
        default:
            TradeMethod = "无";
            break;
    }
    return TradeMethod;
}

//按平台的成交订单量
function draworderTradedNumMixedChart(channel,yesterList) {
    //成交 type=1
    var dataSets = bdOrderTradeDetailStats.find({type: "1" ,cooperation:channel}, { sort: { tradeNum: -1 } }).fetch();
    var labels = [];
    var xLabels = [];
    var barData = [];
    var pieData = [];
    var dataObj = [];
    var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
    var obj = _.groupBy(dataSets,function(obj){return  parseAgentSource(obj.subCooperation)});
    for (var key in obj){
        var sum = _.reduce(obj[key], function(num, tmp){ return num + tmp.tradeNum; }, 0);
        dataObj.push({key:key,value:sum});

    }
    _.sortBy(dataObj,function(obj){return -obj.value}).forEach(function(obj){
        labels.push(obj.key);
        if(yesterList){
            var yesterObj = _.groupBy(yesterList,function(obj){return parseAgentSource(obj.name)});
            xLabels.push(obj.key + ":" + obj.value+"\n昨日:"+  _.reduce(yesterObj[obj.key], function(num, tmp){ return num + tmp.num; }, 0));
        }else{
            var yesterAppend='';
            try{
                var tmpXLabels = orderTradedNumMixedChart.getOption().xAxis[0].data;
                tmpXLabels.forEach(function(ele){
                    var tmpKey = ele.split(":")[0];
                    if(tmpKey==obj.key){
                        yesterAppend = (ele.split("\n")[1])
                    }
                })
            }catch (err){
                //console.log(err)
            }
            xLabels.push(obj.key + ":" + obj.value+"\n"+yesterAppend);
        }
        barData.push({
            value:  obj.value,
            itemStyle: {
                normal: {
                    color: colors.pop()
                }
            }
        });
        pieData.push({ name: obj.key, value:  obj.value })
    })

    var option = {
        title: {
            text: '成交订单量(平台)',
            top: '85%',
            left: 'center'
        },
        tooltip: {
            formatter: '{a}：{c}'
        },
        legend: {
            data: labels
        },
        calculable: true,
        grid: {
            top: 80,
            bottom: 100
        },
        xAxis: [
            {
                'type': 'category',
                'data': xLabels
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '成交订单量',
                type: 'bar',
                label: { normal: { show: true, position: 'top', formatter: '{b}' } },
                data: barData
            }, {
                name: '订单量渠道占比',
                type: 'pie',
                center: ['75%', '30%'],
                radius: '28%',
                data: pieData
            }]
    };

    orderTradedNumMixedChart.setOption(option);
    window.addEventListener('resize', function () {
        orderTradedAmountMixedChart.resize();
    })
}

//按回收方式的成交订单量
function drawTradedNumMethodMixedChart(channel,yesterList) {
    //成交 type=1
    //提交 type=0
    var dataSets = bdOrderTradeDetailStats.find({type: "1" ,cooperation:channel}, { sort: { tradeNum: -1 } }).fetch();
    var labels = [];
    var xLabels = [];
    var barData = [];
    var pieData = [];
    var dataObj = [];
    var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
    var obj = _.groupBy(dataSets,function(obj){return obj.addressType});
    for (var key in obj){
        var sum = _.reduce(obj[key], function(num, tmp){ return num + tmp.tradeNum; }, 0);
        key=parseAddressTypeToTradeMethod(key);
        dataObj.push({key:key,value:sum});

    }
    _.sortBy(dataObj,function(obj){return -obj.value}).forEach(function(obj){
        labels.push(obj.key);
        if(yesterList){
            var yesterObj = _.groupBy(yesterList,function(obj){return obj.name});
            xLabels.push(obj.key + ":" + obj.value+"\n昨日:"+_.reduce(yesterObj[obj.key], function(num, tmp){ return num + tmp.num; }, 0));
        }else{
            var yesterAppend='';
            try{
                var tmpXLabels = TradedNumMethodMixedChart.getOption().xAxis[0].data;
                tmpXLabels.forEach(function(ele){
                    var tmpKey = ele.split(":")[0];
                    if(tmpKey==obj.key){
                        yesterAppend = (ele.split("\n")[1])
                    }
                })
            }catch (err){
                //console.log(err)
            }
            xLabels.push(obj.key + ":" + obj.value+"\n"+yesterAppend);
        }
        barData.push({
            value:  obj.value,
            itemStyle: {
                normal: {
                    color: colors.pop()
                }
            }
        });
        pieData.push({ name: obj.key, value:  obj.value })
    })

    var option = {
        title: {
            text: '成交订单量(回收方式)',
            top: '85%',
            left: 'center'
        },
        tooltip: {
            formatter: '{a}：{c}'
        },
        legend: {
            data: labels
        },
        calculable: true,
        grid: {
            top: 80,
            bottom: 100
        },
        xAxis: [
            {
                'type': 'category',
                'data': xLabels
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '成交订单量',
                type: 'bar',
                label: { normal: { show: true, position: 'top', formatter: '{b}' } },
                data: barData
            }, {
                name: '订单量渠道占比',
                type: 'pie',
                center: ['75%', '30%'],
                radius: '28%',
                data: pieData
            }]
    };

    TradedNumMethodMixedChart.setOption(option);
    window.addEventListener('resize', function () {
        TradedNumMethodMixedChart.resize();
    })
}

//按品类的成交订单量
function drawTradedNumCategoryMixedChart(channel,yesterList) {
    //成交 type=1
    //提交 type=0
    var dataSets = bdOrderTradeDetailStats.find({type: "1" ,cooperation:channel}, { sort: { tradeNum: -1 } }).fetch();
    var labels = [];
    var xLabels = [];
    var barData = [];
    var pieData = [];
    var dataObj = [];
    var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
    var obj = _.groupBy(dataSets,function(obj){return obj.categoryName});
    for (var key in obj){
        var sum = _.reduce(obj[key], function(num, tmp){ return num + tmp.tradeNum; }, 0);
        dataObj.push({key:key,value:sum});

    }
    _.sortBy(dataObj,function(obj){return -obj.value}).forEach(function(obj){
        labels.push(obj.key);
        if(yesterList){
            var yesterObj = _.groupBy(yesterList,function(obj){return obj.name});
            xLabels.push(obj.key + ":" + obj.value+"\n昨日:"+_.reduce(yesterObj[obj.key], function(num, tmp){ return num + tmp.num; }, 0));
        }else{
            var yesterAppend='';
            try{
                var tmpXLabels = TradedNumCategoryMixedChart.getOption().xAxis[0].data;
                tmpXLabels.forEach(function(ele){
                    var tmpKey = ele.split(":")[0];
                    if(tmpKey==obj.key){
                        yesterAppend = (ele.split("\n")[1])
                    }
                })
            }catch (err){
                //console.log(err)
            }
            xLabels.push(obj.key + ":" + obj.value+"\n"+yesterAppend);
        }
        barData.push({
            value:  obj.value,
            itemStyle: {
                normal: {
                    color: colors.pop()
                }
            }
        });
        pieData.push({ name: obj.key, value:  obj.value })
    })

    var option = {
        title: {
            text: '成交订单量(品类)',
            top: '85%',
            left: 'center'
        },
        tooltip: {
            formatter: '{a}：{c}'
        },
        legend: {
            data: labels
        },
        calculable: true,
        grid: {
            top: 80,
            bottom: 100
        },
        xAxis: [
            {
                'type': 'category',
                'data': xLabels
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '成交订单量',
                type: 'bar',
                label: { normal: { show: true, position: 'top', formatter: '{b}' } },
                data: barData
            }, {
                name: '订单量渠道占比',
                type: 'pie',
                center: ['75%', '30%'],
                radius: '28%',
                data: pieData
            }]
    };

    TradedNumCategoryMixedChart.setOption(option);
    window.addEventListener('resize', function () {
        TradedNumCategoryMixedChart.resize();
    })
}

//提交 type=0   按平台的提交金额
function draworderTradeAmountMixedChart(channel,yesterList) {
    //提交 type=0
    var dataSets = bdOrderTradeDetailStats.find({type: "0" ,cooperation:channel}, { sort: { payAmount: -1 } }).fetch();
    var labels = [];
    var xLabels = [];
    var barData = [];
    var pieData = [];
    var dataObj = [];
    var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
    var obj = _.groupBy(dataSets,function(obj){return  parseAgentSource(obj.subCooperation)});
    for (var key in obj){
        var sum = _.reduce(obj[key], function(num, tmp){ return num + tmp.payAmount; }, 0);
        dataObj.push({key:key,value:sum})

    }

    _.sortBy(dataObj,function(obj){return -obj.value}).forEach(function(obj){
        labels.push(obj.key);
        if(yesterList){
            var yesterObj = _.groupBy(yesterList,function(obj){return parseAgentSource(obj.name)});
            xLabels.push(obj.key + ":" + obj.value+"\n昨日:"+  _.reduce(yesterObj[obj.key], function(num, tmp){ return num + tmp.amount; }, 0));
        }else{
            var yesterAppend='';
            try{
                var tmpXLabels = orderTradeAmountMixedChart.getOption().xAxis[0].data;
                tmpXLabels.forEach(function(ele){
                    var tmpKey = ele.split(":")[0];
                    if(tmpKey==obj.key){
                        yesterAppend = (ele.split("\n")[1])
                    }
                })
            }catch (err){
                //console.log(err)
            }
            xLabels.push(obj.key + ":" + obj.value+"\n"+yesterAppend);
        }
        barData.push({
            value: obj.value,
            itemStyle: {
                normal: {
                    color: colors.pop()
                }
            }
        });
        pieData.push({ name: obj.key, value: obj.value })
    })

    var option = {
        title: {
            text: '提交订单额(平台)',
            top: '85%',
            left: 'center'
        },
        tooltip: {
            formatter: '{a}：{c}'
        },
        legend: {
            data: labels
        },
        calculable: true,
        grid: {
            top: 80,
            bottom: 100
        },
        xAxis: [
            {
                'type': 'category',
                'data': xLabels
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '提交订单额',
                type: 'bar',
                label: { normal: { show: true, position: 'top', formatter: '{b}' } },
                data: barData
            }, {
                name: '订单额渠道占比',
                type: 'pie',
                center: ['75%', '30%'],
                radius: '28%',
                data: pieData
            }]
    };

    orderTradeAmountMixedChart.setOption(option);
    window.addEventListener('resize', function () {
        orderTradeAmountMixedChart.resize();
    })


}

//按回收方式的提交金额
function drawTradeAmountMethodMixedChart(channel,yesterList) {
    //提交 type=0


    var dataSets = bdOrderTradeDetailStats.find({type: "0" ,cooperation:channel}, { sort: { payAmount: -1 } }).fetch();
    var labels = [];
    var xLabels = [];
    var barData = [];
    var pieData = [];
    var dataObj = [];
    var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
    var obj = _.groupBy(dataSets,function(obj){return obj.addressType});
    for (var key in obj){
        var sum = _.reduce(obj[key], function(num, tmp){ return num + tmp.payAmount; }, 0);
        key=parseAddressTypeToTradeMethod(key);
        dataObj.push({key:key,value:sum})

    }
    _.sortBy(dataObj,function(obj){return -obj.value}).forEach(function(obj){
        labels.push(obj.key);
        if(yesterList){
            var yesterObj = _.groupBy(yesterList,function(obj){return obj.name});
            xLabels.push(obj.key + ":" + obj.value+"\n昨日:"+_.reduce(yesterObj[obj.key], function(num, tmp){ return num + tmp.amount; }, 0));
        }else{
            var yesterAppend='';
            try{
                var tmpXLabels = TradeAmountMethodMixedChart.getOption().xAxis[0].data;
                tmpXLabels.forEach(function(ele){
                    var tmpKey = ele.split(":")[0];
                    if(tmpKey==obj.key){
                        yesterAppend = (ele.split("\n")[1])
                    }
                })
            }catch (err){
                //console.log(err)
            }
            xLabels.push(obj.key + ":" + obj.value+"\n"+yesterAppend);
        }
        barData.push({
            value: obj.value,
            itemStyle: {
                normal: {
                    color: colors.pop()
                }
            }
        });
        pieData.push({ name: obj.key, value: obj.value })
    })
    var option = {
        title: {
            text: '提交订单额(回收方式)',
            top: '85%',
            left: 'center'
        },
        tooltip: {
            formatter: '{a}：{c}'
        },
        legend: {
            data: labels
        },
        calculable: true,
        grid: {
            top: 80,
            bottom: 100
        },
        xAxis: [
            {
                'type': 'category',
                'data': xLabels
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '提交订单额',
                type: 'bar',
                label: { normal: { show: true, position: 'top', formatter: '{b}' } },
                data: barData
            }, {
                name: '订单额渠道占比',
                type: 'pie',
                center: ['75%', '30%'],
                radius: '28%',
                data: pieData
            }]
    };

    TradeAmountMethodMixedChart.setOption(option);
    window.addEventListener('resize', function () {
        TradeAmountMethodMixedChart.resize();
    })
}


//按品类的提交金额
function drawTradeAmountCategoryMixedChart(channel,yesterList) {
    //提交 type=0


    var dataSets = bdOrderTradeDetailStats.find({type: "0" ,cooperation:channel}, { sort: { payAmount: -1 } }).fetch();
    var labels = [];
    var xLabels = [];
    var barData = [];
    var pieData = [];
    var dataObj = [];
    var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
    var obj = _.groupBy(dataSets,function(obj){return obj.categoryName});
    for (var key in obj){
        var sum = _.reduce(obj[key], function(num, tmp){ return num + tmp.payAmount; }, 0);
        dataObj.push({key:key,value:sum})

    }
    _.sortBy(dataObj,function(obj){return -obj.value}).forEach(function(obj){
        labels.push(obj.key);
        if(yesterList){
            var yesterObj = _.groupBy(yesterList,function(obj){return obj.name});
            xLabels.push(obj.key + ":" + obj.value+"\n昨日:"+_.reduce(yesterObj[obj.key], function(num, tmp){ return num + tmp.amount; }, 0));
        }else{
            var yesterAppend='';
            try{
                var tmpXLabels = TradeAmountCategoryMixedChart.getOption().xAxis[0].data;
                tmpXLabels.forEach(function(ele){
                    var tmpKey = ele.split(":")[0];
                    if(tmpKey==obj.key){
                        yesterAppend = (ele.split("\n")[1])
                    }
                })
            }catch (err){
                //console.log(err)
            }
            xLabels.push(obj.key + ":" + obj.value+"\n"+yesterAppend);
        }
        barData.push({
            value: obj.value,
            itemStyle: {
                normal: {
                    color: colors.pop()
                }
            }
        });
        pieData.push({ name: obj.key, value: obj.value })
    })
    var option = {
        title: {
            text: '提交订单额(品类)',
            top: '85%',
            left: 'center'
        },
        tooltip: {
            formatter: '{a}：{c}'
        },
        legend: {
            data: labels
        },
        calculable: true,
        grid: {
            top: 80,
            bottom: 100
        },
        xAxis: [
            {
                'type': 'category',
                'data': xLabels
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '提交订单额',
                type: 'bar',
                label: { normal: { show: true, position: 'top', formatter: '{b}' } },
                data: barData
            }, {
                name: '订单额渠道占比',
                type: 'pie',
                center: ['75%', '30%'],
                radius: '28%',
                data: pieData
            }]
    };

    TradeAmountCategoryMixedChart.setOption(option);
    window.addEventListener('resize', function () {
        TradeAmountCategoryMixedChart.resize();
    })
}

//成交 type=1  按平台的成交金额
function draworderTradedAmountMixedChart(channel,yesterList) {
    var dataSets = bdOrderTradeDetailStats.find({type: "1" ,cooperation:channel}, { sort: { payAmount: -1 } }).fetch();
    var labels = [];
    var xLabels = [];
    var barData = [];
    var pieData = [];
    var dataObj = [];
    var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
    var obj = _.groupBy(dataSets,function(obj){return  parseAgentSource(obj.subCooperation)});
    for (var key in obj){
        var sum = _.reduce(obj[key], function(num, tmp){ return num + tmp.payAmount; }, 0);
        dataObj.push({key:key,value:sum});

    }
    _.sortBy(dataObj,function(obj){return -obj.value}).forEach(function(obj){
        labels.push(obj.key);
        if(yesterList){
            var yesterObj = _.groupBy(yesterList,function(obj){return parseAgentSource(obj.name)});
            xLabels.push(obj.key + ":" + obj.value+"\n昨日:"+  _.reduce(yesterObj[obj.key], function(num, tmp){ return num + tmp.amount; }, 0));
        }else{
            var yesterAppend='';
            try{
                var tmpXLabels = orderTradedAmountMixedChart.getOption().xAxis[0].data;
                tmpXLabels.forEach(function(ele){
                    var tmpKey = ele.split(":")[0];
                    if(tmpKey==obj.key){
                        yesterAppend = (ele.split("\n")[1])
                    }
                })
            }catch (err){
                //console.log(err)
            }
            xLabels.push(obj.key + ":" + obj.value+"\n"+yesterAppend);
        }
        barData.push({
            value:  obj.value,
            itemStyle: {
                normal: {
                    color: colors.pop()
                }
            }
        });
        pieData.push({ name: obj.key, value:  obj.value })
    })


    var option = {
        title: {
            text: '成交订单额(平台)',
            top: '85%',
            left: 'center'
        },
        tooltip: {
            formatter: '{a}：{c}'
        },
        legend: {
            data: labels
        },
        calculable: true,
        grid: {
            top: 80,
            bottom: 100
        },
        xAxis: [
            {
                'type': 'category',
                'data': xLabels
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '成交订单额',
                type: 'bar',
                label: { normal: { show: true, position: 'top', formatter: '{b}' } },
                data: barData
            }, {
                name: '订单额渠道占比',
                type: 'pie',
                center: ['75%', '30%'],
                radius: '28%',
                data: pieData
            }]
    };

    orderTradedAmountMixedChart.setOption(option);
    window.addEventListener('resize', function () {
        orderTradedAmountMixedChart.resize();
    })

}

//按回收方式的成交金额
function drawTradedAmountMethodMixedChart(channel,yesterList) {
    //成交 type=1
    var dataSets = bdOrderTradeDetailStats.find({type: "1" ,cooperation:channel}, { sort: { payAmount: -1 } }).fetch();
    var labels = [];
    var xLabels = [];
    var barData = [];
    var pieData = [];
    var dataObj = [];
    var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
    var obj = _.groupBy(dataSets,function(obj){return obj.addressType});
    for (var key in obj){
        var sum = _.reduce(obj[key], function(num, tmp){ return num + tmp.payAmount; }, 0);
        key = parseAddressTypeToTradeMethod(key);
        dataObj.push({key:key,value:sum});

    }
    _.sortBy(dataObj,function(obj){return -obj.value}).forEach(function(obj){
        labels.push(obj.key);
        if(yesterList){
            var yesterObj = _.groupBy(yesterList,function(obj){return obj.name});
            xLabels.push(obj.key + ":" + obj.value+"\n昨日:"+_.reduce(yesterObj[obj.key], function(num, tmp){ return num + tmp.amount; }, 0));
        }else{
            var yesterAppend='';
            try{
                var tmpXLabels = TradedAmountMethodMixedChart.getOption().xAxis[0].data;
                tmpXLabels.forEach(function(ele){
                    var tmpKey = ele.split(":")[0];
                    if(tmpKey==obj.key){
                        yesterAppend = (ele.split("\n")[1])
                    }
                })
            }catch (err){
                //console.log(err)
            }
            xLabels.push(obj.key + ":" + obj.value+"\n"+yesterAppend);
        }
        barData.push({
            value:  obj.value,
            itemStyle: {
                normal: {
                    color: colors.pop()
                }
            }
        });
        pieData.push({ name: obj.key, value:  obj.value })
    })



    var option = {
        title: {
            text: '成交订单额(回收方式)',
            top: '85%',
            left: 'center'
        },
        tooltip: {
            formatter: '{a}：{c}'
        },
        legend: {
            data: labels
        },
        calculable: true,
        grid: {
            top: 80,
            bottom: 100
        },
        xAxis: [
            {
                'type': 'category',
                'data': xLabels
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '成交订单额',
                type: 'bar',
                label: { normal: { show: true, position: 'top', formatter: '{b}' } },
                data: barData
            }, {
                name: '订单额渠道占比',
                type: 'pie',
                center: ['75%', '30%'],
                radius: '28%',
                data: pieData
            }]
    };

    TradedAmountMethodMixedChart.setOption(option);
    window.addEventListener('resize', function () {
        TradedAmountMethodMixedChart.resize();
    })
}


//按品类的成交金额
function drawTradedAmountCategoryMixedChart(channel,yesterList) {
    //成交 type=1
    var dataSets = bdOrderTradeDetailStats.find({type: "1" ,cooperation:channel}, { sort: { payAmount: -1 } }).fetch();
    var labels = [];
    var xLabels = [];
    var barData = [];
    var pieData = [];
    var dataObj = [];
    var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
    var obj = _.groupBy(dataSets,function(obj){return obj.categoryName});
    for (var key in obj){
        var sum = _.reduce(obj[key], function(num, tmp){ return num + tmp.payAmount; }, 0);
        dataObj.push({key:key,value:sum});

    }
    _.sortBy(dataObj,function(obj){return -obj.value}).forEach(function(obj){
        labels.push(obj.key);
        if(yesterList){
            var yesterObj = _.groupBy(yesterList,function(obj){return obj.name});
            xLabels.push(obj.key + ":" + obj.value+"\n昨日:"+_.reduce(yesterObj[obj.key], function(num, tmp){ return num + tmp.amount; }, 0));
        }else{
            var yesterAppend='';
            try{
                var tmpXLabels = TradedAmountCategoryMixedChart.getOption().xAxis[0].data;
                tmpXLabels.forEach(function(ele){
                    var tmpKey = ele.split(":")[0];
                    if(tmpKey==obj.key){
                        yesterAppend = (ele.split("\n")[1])
                    }
                })
            }catch (err){
                //console.log(err)
            }
            xLabels.push(obj.key + ":" + obj.value+"\n"+yesterAppend);
        }
        barData.push({
            value:  obj.value,
            itemStyle: {
                normal: {
                    color: colors.pop()
                }
            }
        });
        pieData.push({ name: obj.key, value:  obj.value })
    })



    var option = {
        title: {
            text: '成交订单额(品类)',
            top: '85%',
            left: 'center'
        },
        tooltip: {
            formatter: '{a}：{c}'
        },
        legend: {
            data: labels
        },
        calculable: true,
        grid: {
            top: 80,
            bottom: 100
        },
        xAxis: [
            {
                'type': 'category',
                'data': xLabels
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '成交订单额',
                type: 'bar',
                label: { normal: { show: true, position: 'top', formatter: '{b}' } },
                data: barData
            }, {
                name: '订单额渠道占比',
                type: 'pie',
                center: ['75%', '30%'],
                radius: '28%',
                data: pieData
            }]
    };

    TradedAmountCategoryMixedChart.setOption(option);
    window.addEventListener('resize', function () {
        TradedAmountCategoryMixedChart.resize();
    })
}

