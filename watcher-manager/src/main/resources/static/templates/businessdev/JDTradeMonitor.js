/**
 * Created by Howard on 2016/11/1.
 */
Template.JDTradeMonitor.rendered = function () {
    var yPSD = [{
       "trade_create_date":"0000-00-00",
        "trade_source_type_jingdong_key":-1,
        "trade_source_type_jingdong_name":"",
        "trade_num":0,
        "trade_price_num":0
    }];

    if(isMobile()){
        $('.sidebar-toggle').click();
    }

    //提交
    orderTradeNumMixedChart = echarts.init(document.getElementById('orderTradeNumMixedChart'));
    orderTradeAmountMixedChart = echarts.init(document.getElementById('orderTradeAmountMixedChart'));
    //成交
    orderTradedNumMixedChart = echarts.init(document.getElementById('orderTradedNumMixedChart'));
    orderTradedAmountMixedChart = echarts.init(document.getElementById('orderTradedAmountMixedChart'));
    TradeNumMethodMixedChart = echarts.init(document.getElementById("TradeNumMethodMixedChart"));
    TradeAmountMethodMixedChart = echarts.init(document.getElementById('TradeAmountMethodMixedChart'));
    TradedNumMethodMixedChart = echarts.init(document.getElementById('TradedNumMethodMixedChart'));
    TradedAmountMethodMixedChart = echarts.init(document.getElementById('TradedAmountMethodMixedChart'));

        draworderTradeNumMixedChart(yPSD);
        draworderTradeAmountMixedChart(yPSD);
        draworderTradedNumMixedChart(yPSD);
        draworderTradedAmountMixedChart(yPSD);
        drawTradeNumMethodMixedChart(yPSD);
        drawTradeAmountMethodMixedChart(yPSD);
        drawTradedNumMethodMixedChart(yPSD);
        drawTradedAmountMethodMixedChart(yPSD);

        getYesterdayTradeOrderStats();
        getYesterdayTradeSuccessStats();
        getYesterdayTradeMethodSubmitStats();
        getYesterdayTradeMethodSuccessStats();

        setInterval(function (){
            getYesterdayTradeOrderStats();
            getYesterdayTradeSuccessStats();
            getYesterdayTradeMethodSubmitStats();
            getYesterdayTradeMethodSuccessStats();
        },5*60*1000)


};


Template.JDTradeMonitor.helpers({

    todayOrderTradeObj: function () {
        //return
        var records = jdOrderTradeStats.find({}, { sort: { createdDt: -1 } }).fetch();
        //提交
        var order_nums = 0;
        var order_amount = 0;
        //成交
        var trade_nums = 0;
        var trade_amount = 0;
        var dt;
        var jdPlatform = "";
        records.forEach(function (obj) {
            dt = obj.createdDt;
            jdPlatform = obj.jdPlatform;
            if (obj.type == "0") {
                order_nums += obj.tradeNum;
                order_amount += obj.payAmount;
            } else if (obj.type == "1") {
                trade_nums += obj.tradeNum;
                trade_amount += obj.payAmount;
            }
        });
        return {
            "jdPlatform": jdPlatform,
            "order_nums": order_nums.toLocaleString(),
            "order_amount": "￥" + order_amount.toLocaleString(),
            "trade_nums": trade_nums.toLocaleString(),
            "trade_amount": "￥" + trade_amount.toLocaleString(),
            "dt": dt
        };
    },

});
function getYesterdayTradeOrderStats(){
    var query={};
    var obj = {
        "trade_num":0,
        "trade_price_num":0
    };
    requestURL(dataService+"/dashboard/GetJDyData",query).done(function (ret) {
        var trade_num = 0;
        var trade_price = 0;
        ret.forEach(function (e) {
            trade_num = trade_num + e.trade_num;
            trade_price = trade_price+e.trade_price_num;
        });

        obj.trade_num = trade_num;
        obj.trade_price_num = trade_price;
        $('#yesterdaySubmitNum').html("\n昨日同时间："+trade_num.toLocaleString());
        $('#yesterdaySubmitPrice').html("\n昨日同时间：￥"+trade_price.toLocaleString());
        draworderTradeNumMixedChart(ret);
        draworderTradeAmountMixedChart(ret);
    });
}
function getYesterdayTradeMethodSuccessStats(){
    var query = {};
    requestURL(dataService+"/dashboard/GetJDTradeMethodYData",query).done(function (ret) {
        drawTradedNumMethodMixedChart(ret);
        drawTradedAmountMethodMixedChart(ret);
    });
}
function getYesterdayTradeMethodSubmitStats(){
    var query = {};
    requestURL(dataService+"/dashboard/GetJDSubmitMethodYData",query).done(function (ret) {
        drawTradeNumMethodMixedChart(ret);
        drawTradeAmountMethodMixedChart(ret);
    });
}
function getYesterdayTradeSuccessStats(){
    var query = {};
    requestURL(dataService+"/dashboard/GetJDTradeYData",query).done(function (ret) {
        var trade_num = 0;
        var trade_price = 0;
        ret.forEach(function (e) {
            trade_num = trade_num + e.trade_num;
            trade_price = trade_price+e.trade_price_num;
        });
        $('#yesterdaySuccessNum').html("\n昨日同时间："+trade_num.toLocaleString());
        $('#yesterdaySuccessPrice').html("\n昨日同时间：￥"+trade_price.toLocaleString());
        draworderTradedAmountMixedChart(ret);
        draworderTradedNumMixedChart(ret);
    });
}



function draworderTradeNumMixedChart(yData) {
    //提交 type=0
    var dataSets = jdOrderTradeStats.find({type: "0" }, { sort: { tradeNum: -1 } }).fetch();
    var labels = [];
    var xLabels = [];
    var barData = [];
    var pieData = [];
    var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();

    var json = agentSourceToPlatform(dataSets);
    json.forEach(function (e) {
        labels.push(e.jdPlatform);
        xLabels.push(e.jdPlatform + ":" + e.tradeNum);
        barData.push({
            value: e.tradeNum,
            itemStyle: {
                normal: {
                    color: colors.pop()
                }
            }
        });
        pieData.push({ name: e.jdPlatform, value: e.tradeNum })

    });

    if(yData[0].trade_create_date != "0000-00-00"){
        var SortedData = _.sortBy(yData,'trade_num');
        var indexApp = labels.indexOf("京东APP版");
        var indexPC = labels.indexOf("京东PC版");
        var AppYData = _.select(SortedData,function (e) {
            return e.trade_source_type_jingdong_name == "京东APP"
        });
        var PCYData = _.select(SortedData,function (e) {
            return e.trade_source_type_jingdong_name == "京东PC"
        });
        xLabels[indexApp] = xLabels[indexApp]+"昨天:"+ AppYData[0].trade_num;
        xLabels[indexPC] = xLabels[indexPC]+"昨天:"+PCYData[0].trade_num;
    }
    var option = {
        title: {
            text: '提交订单量',
            top: '80%',
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
                data: barData.sort(getSortOrder('value'))
            }, {
                name: '订单量渠道占比',
                type: 'pie',
                center: ['75%', '30%'],
                radius: '28%',
                data: pieData.sort(getSortOrder('value'))
            }]
    };

    orderTradeNumMixedChart.setOption(option);
    window.addEventListener('resize', function () {
        orderTradedNumMixedChart.resize();
    })

}
function drawTradeNumMethodMixedChart(yData) {
    //提交 type=0
    var dataSets = jdOrderTradeStats.find({ type: "0" }, { sort: { tradeNum: -1 } }).fetch();
    var labels = [];
    var xLabels = [];
    var barData = [];
    var pieData = [];
    var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
    var json = addressTypeToTradeMethod(dataSets);
    json.forEach(function (e) {
        labels.push(e.jdPlatform);
        xLabels.push(e.jdPlatform + ":" + e.tradeNum);
        barData.push({
            value: e.tradeNum,
            itemStyle: {
                normal: {
                    color: colors.pop()
                }
            }
        });
        pieData.push({ name: e.jdPlatform, value: e.tradeNum })

    });

    if(yData[0].trade_create_date != "0000-00-00"){
        var SortedData = _.sortBy(yData,'trade_num');
        var indexExpress = labels.indexOf("快递取货");
        var ExpressYData = _.select(SortedData,function (e) {
            return e.trade_source_type_jingdong_name == "快递取货"
        });
        xLabels[indexExpress] = xLabels[indexExpress]+"昨天:"+ ExpressYData[0].trade_num;
    }

    var option = {
        title: {
            text: '提交订单量',
            top: '80%',
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
                data: barData.sort(getSortOrder('value'))
            }, {
                name: '订单量渠道占比',
                type: 'pie',
                center: ['75%', '30%'],
                radius: '28%',
                data: pieData.sort(getSortOrder('value'))
            }]
    };

    TradeNumMethodMixedChart.setOption(option);
    window.addEventListener('resize', function () {
        TradeNumMethodMixedChart.resize();
    })
}

function parseAgentSource(agentSource){
    var platform = "";
    if(agentSource == "京东APP1" || agentSource == "京东APP2" ){
        platform = "京东APP版"
    }else if(agentSource == "京东PC" || agentSource == "京东相机" || agentSource == "京东合作报价" || agentSource == "京东3C合作报价" ){
        platform = "京东PC版"
    }else if (agentSource == "京东M1" || agentSource =="京东M2"){
        platform = "京东M版"
    }else if(agentSource == "京东微信1" || agentSource == "京东微信2"){
        platform = "京东微信版"
    }
    return platform;
}

function parseaddressTypeToTradeMethod(addressType) {
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
    }
    return TradeMethod;
}

function addressTypeToTradeMethod(dataSet){
    var data = {
        "jdPlatform":"",
        "tradeNum":0,
        "payAmount":0
    };
    var AggregatedData = _.groupBy(dataSet,function (e) {
        return e.addressType;
    });
    var i;
    var cnt = 0;
    var json1 = [];
    for(i in AggregatedData){
        data.tradeNum = 0;
        data.payAmount = 0;
        AggregatedData[i].forEach(function (e) {
            data.tradeNum = data.tradeNum+e.tradeNum;
            data.payAmount = data.payAmount+e.payAmount;
        });
        data.jdPlatform = parseaddressTypeToTradeMethod(i);

        cnt ++;
        var jsondata0 = _.clone(data);
        json1.push(jsondata0);
    }
    var AggregatedJson = _.groupBy(json1,function (e) {
        return e.jdPlatform;
    });
    var json2 = [];
    for(i in AggregatedJson){
        data.tradeNum = 0;
        data.payAmount = 0;
        data.jdPlatform = "";
        AggregatedJson[i].forEach(function (e) {
            data.tradeNum = data.tradeNum +e.tradeNum;
            data.payAmount = data.payAmount+e.payAmount;
        });
        data.jdPlatform = AggregatedJson[i][0].jdPlatform;
        var jsondata1 = _.clone(data);
        json2.push(jsondata1);
    }
    var FinalJson = _.sortBy(json2,'tradeNum').reverse();
    return FinalJson;

}

function agentSourceToPlatform(dataSet){
    var data = {
        "jdPlatform":"",
        "tradeNum":0,
        "payAmount":0
    };
    var AggregatedData = _.groupBy(dataSet,function (e) {
        return e.jdPlatform
    });
    var i;
    var cnt = 0;
    var json1 = [];
    for(i in AggregatedData){
        data.tradeNum = 0;
        data.payAmount = 0;
        AggregatedData[i].forEach(function (e) {
            data.tradeNum = data.tradeNum+e.tradeNum;
            data.payAmount = data.payAmount+e.payAmount;
        });
        data.jdPlatform = parseAgentSource(i);

        cnt ++;
        var jsondata0 = _.clone(data);
        json1.push(jsondata0);
    }
    var AggregatedJson = _.groupBy(json1,function (e) {
        return e.jdPlatform;
    });
    var json2 = [];
    for(i in AggregatedJson){
        data.tradeNum = 0;
        data.payAmount = 0;
        data.jdPlatform = "";
        AggregatedJson[i].forEach(function (e) {
            data.tradeNum = data.tradeNum +e.tradeNum;
            data.payAmount = data.payAmount+e.payAmount;
        });
        data.jdPlatform = AggregatedJson[i][0].jdPlatform;
        var jsondata1 = _.clone(data);
        json2.push(jsondata1);
    }
    var FinalJson = _.sortBy(json2,'tradeNum').reverse();
    return FinalJson;


}

function draworderTradedNumMixedChart(yData) {
    //成交 type=1
    var dataSets = jdOrderTradeStats.find({ type: "1" }, { sort: { tradeNum: -1 } }).fetch();
    var labels = [];
    var xLabels = [];
    var barData = [];
    var pieData = [];
    var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
    var json = agentSourceToPlatform(dataSets);
    json.forEach(function (e) {
        labels.push(e.jdPlatform);
        xLabels.push(e.jdPlatform + ":" + e.tradeNum);
        barData.push({
            value: e.tradeNum,
            itemStyle: {
                normal: {
                    color: colors.pop()
                }
            }
        });
        pieData.push({ name: e.jdPlatform, value: e.tradeNum })

    });

    if(yData[0].trade_create_date != "0000-00-00"){
        var SortedData = _.sortBy(yData,'trade_num');
        var indexApp = labels.indexOf("京东APP版");
        var indexPC = labels.indexOf("京东PC版");
        var AppYData = _.select(SortedData,function (e) {
            return e.trade_source_type_jingdong_name == "京东APP"
        });
        var PCYData = _.select(SortedData,function (e) {
            return e.trade_source_type_jingdong_name == "京东PC"
        });
        xLabels[indexApp] = xLabels[indexApp]+"昨天:"+ AppYData[0].trade_num;
        xLabels[indexPC] = xLabels[indexPC]+"昨天:"+PCYData[0].trade_num;
    }

    var option = {
        title: {
            text: '成交订单量',
            top: '80%',
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
                data: barData.sort(getSortOrder('value'))
            }, {
                name: '订单量渠道占比',
                type: 'pie',
                center: ['75%', '30%'],
                radius: '28%',
                data: pieData.sort(getSortOrder('value'))
            }]
    };

    orderTradedNumMixedChart.setOption(option);
    window.addEventListener('resize', function () {
        orderTradedAmountMixedChart.resize();
    })
}
function drawTradedNumMethodMixedChart(yData) {
    //成交 type=1
    var dataSets = jdOrderTradeStats.find({ type: "1" }, { sort: { tradeNum: -1 } }).fetch();
    var labels = [];
    var xLabels = [];
    var barData = [];
    var pieData = [];
    var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
    var json = addressTypeToTradeMethod(dataSets);
    json.forEach(function (e) {
        labels.push(e.jdPlatform);
        xLabels.push(e.jdPlatform + ":" + e.tradeNum);
        barData.push({
            value: e.tradeNum,
            itemStyle: {
                normal: {
                    color: colors.pop()
                }
            }
        });
        pieData.push({ name: e.jdPlatform, value: e.tradeNum })

    });

    if(yData[0].trade_create_date != "0000-00-00"){
        var SortedData = _.sortBy(yData,'trade_num');
        var indexExpress = labels.indexOf("快递取货");
        var ExpressYData = _.select(SortedData,function (e) {
            return e.trade_source_type_jingdong_name == "快递取货"
        });
        xLabels[indexExpress] = xLabels[indexExpress]+"昨天:"+ ExpressYData[0].trade_num;
    }

    var option = {
        title: {
            text: '成交订单量',
            top: '80%',
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
                data: barData.sort(getSortOrder('value'))
            }, {
                name: '订单量渠道占比',
                type: 'pie',
                center: ['75%', '30%'],
                radius: '28%',
                data: pieData.sort(getSortOrder('value'))
            }]
    };

    TradedNumMethodMixedChart.setOption(option);
    window.addEventListener('resize', function () {
        TradedNumMethodMixedChart.resize();
    })
}


//提交 type=0
function draworderTradeAmountMixedChart(yData) {
    var dataSets = jdOrderTradeStats.find({ type: "0" }, { sort: { payAmount: -1 } }).fetch();
    var labels = [];
    var xLabels = [];
    var barData = [];
    var pieData = [];
    var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
    var json = agentSourceToPlatform(dataSets);

    json.forEach(function (e) {
        labels.push(e.jdPlatform);
        xLabels.push(e.jdPlatform + ":" + e.payAmount);
        barData.push({
            value: e.payAmount,
            itemStyle: {
                normal: {
                    color: colors.pop()
                }
            }
        });
        pieData.push({ name: e.jdPlatform, value: e.payAmount })

    });
    if(yData[0].trade_create_date != "0000-00-00"){
        var SortedData = _.sortBy(yData,'trade_num');
        var indexApp = labels.indexOf("京东APP版");
        var indexPC = labels.indexOf("京东PC版");
        var AppYData = _.select(SortedData,function (e) {
            return e.trade_source_type_jingdong_name == "京东APP版"
        });
        var PCYData = _.select(SortedData,function (e) {
            return e.trade_source_type_jingdong_name == "京东PC版"
        });

        xLabels[indexApp] = xLabels[indexApp]+"昨天:"+ AppYData[0].trade_price_num;
        xLabels[indexPC] = xLabels[indexPC]+"昨天:"+PCYData[0].trade_price_num;
    }


    var option = {
        title: {
            text: '提交订单额',
            top: '80%',
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
                data: barData.sort(getSortOrder('value'))
            }, {
                name: '订单额渠道占比',
                type: 'pie',
                center: ['75%', '30%'],
                radius: '28%',
                data: pieData.sort(getSortOrder('value'))
            }]
    };

    orderTradeAmountMixedChart.setOption(option);
    window.addEventListener('resize', function () {
        orderTradeAmountMixedChart.resize();
    })


}
function drawTradeAmountMethodMixedChart(yData) {
    //提交 type=0
    var dataSets = jdOrderTradeStats.find({ type: "0" }, { sort: { tradeNum: -1 } }).fetch();
    var labels = [];
    var xLabels = [];
    var barData = [];
    var pieData = [];
    var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
    var json = addressTypeToTradeMethod(dataSets);
    json.forEach(function (e) {
        labels.push(e.jdPlatform);
        xLabels.push(e.jdPlatform + ":" + e.payAmount);
        barData.push({
            value: e.payAmount,
            itemStyle: {
                normal: {
                    color: colors.pop()
                }
            }
        });
        pieData.push({ name: e.jdPlatform, value: e.payAmount })

    });


    if(yData[0].trade_create_date != "0000-00-00"){
        var SortedData = _.sortBy(yData,'trade_num');
        var indexExpress = labels.indexOf("快递取货");
        var ExpressYData = _.select(SortedData,function (e) {
            return e.trade_source_type_jingdong_name == "快递取货"
        });
        xLabels[indexExpress] = xLabels[indexExpress]+"昨天:"+ ExpressYData[0].trade_price_num;
    }


    var option = {
        title: {
            text: '提交订单额',
            top: '80%',
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
                data: barData.sort(getSortOrder('value'))
            }, {
                name: '订单额渠道占比',
                type: 'pie',
                center: ['75%', '30%'],
                radius: '28%',
                data: pieData.sort(getSortOrder('value'))
            }]
    };

    TradeAmountMethodMixedChart.setOption(option);
    window.addEventListener('resize', function () {
        TradeAmountMethodMixedChart.resize();
    })
}

//成交 type=1
function draworderTradedAmountMixedChart(yData) {
    var dataSets = jdOrderTradeStats.find({ type: "1" }, { sort: { payAmount: -1 } }).fetch();
    var labels = [];
    var xLabels = [];
    var barData = [];
    var pieData = [];
    var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();

    var json = agentSourceToPlatform(dataSets);

    json.forEach(function (e) {
        labels.push(e.jdPlatform);
        xLabels.push(e.jdPlatform + ":" + e.payAmount);
        barData.push({
            value: e.payAmount,
            itemStyle: {
                normal: {
                    color: colors.pop()
                }
            }
        });
        pieData.push({ name: e.jdPlatform, value: e.payAmount })

    });
    if(yData[0].trade_create_date != "0000-00-00"){
        var SortedData = _.sortBy(yData,'trade_num');
        var indexApp = labels.indexOf("京东APP版");
        var indexPC = labels.indexOf("京东PC版");
        var AppYData = _.select(SortedData,function (e) {
            return e.trade_source_type_jingdong_name == "京东APP版"
        });
        var PCYData = _.select(SortedData,function (e) {
            return e.trade_source_type_jingdong_name == "京东PC版"
        });
        xLabels[indexApp] = xLabels[indexApp]+"昨天:"+ AppYData[0].trade_price_num;
        xLabels[indexPC] = xLabels[indexPC]+"昨天:"+PCYData[0].trade_price_num;
    }


    var option = {
        title: {
            text: '成交订单额',
            top: '80%',
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
                data: pieData.sort(getSortOrder('value'))
            }]
    };

    orderTradedAmountMixedChart.setOption(option);
    window.addEventListener('resize', function () {
        orderTradedAmountMixedChart.resize();
    })

}
function drawTradedAmountMethodMixedChart(yData) {
    //成交 type=1
    var dataSets = jdOrderTradeStats.find({ type: "1" }, { sort: { tradeNum: -1 } }).fetch();
    var labels = [];
    var xLabels = [];
    var barData = [];
    var pieData = [];
    var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
    var json = addressTypeToTradeMethod(dataSets);
    json.forEach(function (e) {
        labels.push(e.jdPlatform);
        xLabels.push(e.jdPlatform + ":" + e.payAmount);
        barData.push({
            value: e.payAmount,
            itemStyle: {
                normal: {
                    color: colors.pop()
                }
            }
        });
        pieData.push({ name: e.jdPlatform, value: e.payAmount })

    });


    if(yData[0].trade_create_date != "0000-00-00"){
        var SortedData = _.sortBy(yData,'trade_num');
        var indexExpress = labels.indexOf("快递取货");
        var ExpressYData = _.select(SortedData,function (e) {
            return e.trade_source_type_jingdong_name == "快递取货"
        });
        xLabels[indexExpress] = xLabels[indexExpress]+"昨天:"+ ExpressYData[0].trade_price_num;
    }


    var option = {
        title: {
            text: '成交订单额',
            top: '80%',
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
                data: barData.sort(getSortOrder('value'))
            }, {
                name: '订单额渠道占比',
                type: 'pie',
                center: ['75%', '30%'],
                radius: '28%',
                data: pieData.sort(getSortOrder('value'))
            }]
    };

    TradedAmountMethodMixedChart.setOption(option);
    window.addEventListener('resize', function () {
        TradedAmountMethodMixedChart.resize();
    })
}




function getSortOrder(prop) {
    return function (a, b) {
        if (a[prop] > b[prop]) {
            return -1;
        } else if (a[prop] < b[prop]) {
            return 1;
        }
        return 0;
    }
}