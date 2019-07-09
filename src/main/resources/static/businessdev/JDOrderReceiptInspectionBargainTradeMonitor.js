/**
 * Created by hsh on 2016/5/13.
 */
var globalObj = {
    curReceipt:[],
    curInspection:[],
    preReceipt:[],
    preInspection:[]
}
Template.JDOrderReceiptInspectionBargainTradeMonitor.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#JDDataserviceTab').addClass('active');
    $('#JDOrderReceiptInspectionBargainTradeMonitor').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }


    var channel = this.data.channel;
    //今天
    $(".tdDate").html(new Date().getNewDate(0));
    renderTodayPage(channel);
    renderYtdPage(channel);
};

function renderTodayPage(channel) {

    var filter = {}
    filter.type = "centre"
    filter.sourceType=[];
    filter.sourceType.push(channel);
    filter.dateType = "td"
    filter.orderType = "receipt"
    //到货
    var promiseReceipt = getBdSourceReceiptInfo(filter);
    promiseReceipt.done(function (ret) {
        globalObj.curReceipt=ret
        drawOrderReceiptCntMixedChart();
    });

    //验货
    filter.orderType="inspection"
    var promiseInspection = getBdSourceReceiptInfo(filter);
    promiseInspection.done(function (ret) {
        globalObj.curInspection=ret
        drawOrderInspectionCntMixedChart();
    });

    //议价部分成交量
    var promise = getBdSourceTypeBargainInfo(filter);
    promise.done(function (ret) {
        var cnt=0;
        ret.forEach(function(e){
            if(e.name==channel){
                cnt+= e.cnt;
            }
        })
        drawOrderBargainCntMixedChart(cnt);
    });

    //议价部分成交金额
    var promise = getBdSourceTypeBargainNumInfo(filter);
    promise.done(function (ret) {
        var cnt=0;
        ret.forEach(function(e){
            if(e.name==channel){
                cnt+= e.cnt;
            }
        })
        drawOrderBargainNumMixedChart(cnt);
    });
}

function renderYtdPage(channel) {

    var filter = {}
    filter.type = "centre"
    filter.sourceType=[];
    filter.sourceType.push(channel);
    filter.dateType = "ytd"
    filter.orderType = "receipt"
    //到货
    var promiseReceipt = getBdSourceReceiptInfo(filter);
    promiseReceipt.done(function (ret) {
        var cnt=0;
        ret.forEach(function(e){
                cnt+= e.cnt;
        })
        $("#receiptYtdCnt").html(cnt)
        globalObj.preReceipt=ret
        drawOrderReceiptCntMixedChart();
    });

    //验货
    filter.orderType="inspection"
    var promiseInspection = getBdSourceReceiptInfo(filter);
    promiseInspection.done(function (ret) {
        var cnt=0;
        ret.forEach(function(e){
                cnt+= e.cnt;
        })
        $("#inspectionYtdCnt").html(cnt)
        globalObj.preInspection=ret
        drawOrderInspectionCntMixedChart();

    });

    //议价成交量
    var promiseBargeinCnt = getBdSourceTypeBargainInfo(filter);
    promiseBargeinCnt.done(function (ret) {
        var cnt=0;
        ret.forEach(function(e){
            if(e.name==channel){
                cnt+= e.cnt;
            }
        })
        $("#bargainYtdCnt").html(cnt)
    });

    //议价金额
    var promiseBarginNum = getBdSourceTypeBargainNumInfo(filter);
    promiseBarginNum.done(function (ret) {
        var cnt=0;
        ret.forEach(function(e){
            if(e.name==channel){
                cnt+= e.cnt;
            }
        })
        $("#bargainYtdNum").html(cnt)
    });

}

//到货*验货
function getBdSourceReceiptInfo(filter) {
    //clean parameters
    var query = _.clone(filter);
    delete query["userId"];
    delete query["sign"];
    var dfd = $.Deferred();
    requestURL(dataService + "/bd/getBdSourceReceiptInfo", query).done(function (ret) {
        dfd.resolve(ret)
    });
    return dfd.promise()
}

//议价部分成交量
function getBdSourceTypeBargainInfo(filter) {
    //clean parameters
    var query = _.clone(filter);
    delete query["userId"];
    delete query["sign"];
    delete query["type"];
    delete query["orderType"];
    var dfd = $.Deferred();
    requestURL(dataService + "/bd/getBdSourceTypeBargainInfo", query).done(function (ret) {
        dfd.resolve(ret)
    });
    return dfd.promise()
}

//议价部分成交金额
function getBdSourceTypeBargainNumInfo(filter) {
    //clean parameters
    var query = _.clone(filter);
    delete query["userId"];
    delete query["sign"];
    delete query["type"];
    delete query["orderType"];
    var dfd = $.Deferred();
    requestURL(dataService + "/bd/getBdSourceTypeBargainNumInfo", query).done(function (ret) {
        dfd.resolve(ret)
    });
    return dfd.promise()
}

//到货部分
function drawOrderReceiptCntMixedChart(data) {
    var curData  =globalObj.curReceipt;
    var preObj = {}
    globalObj.preReceipt.forEach(function(ele){
        preObj[ele.name]=ele.cnt
    })
    var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
    var cnt=0;
    var sourceName=[];
    var pieData = [];
    var barData = [];
    var xLabels = [];
    curData.forEach(function(e){
        cnt+= e.cnt;
        var name = e.name
        sourceName.push(name);
        xLabels.push(name + ":" + e.cnt+" 昨日:"+(preObj[name]|0));
        barData.push({
            value: e.cnt,
            itemStyle: {
                normal: {
                    color: colors.pop()
                }
            }
        });
        pieData.push({name: name, value: e.cnt});
    })
    $("#receiptTodayCnt").html(cnt);

    var option = {
        title: {
            text: '订单量',
            top: '80%',
            left: 'center'
        },
        tooltip: {},
        legend: {
            data: sourceName
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
                name: '订单量',
                type: 'bar',
                label: {normal: {show: true, position: 'top', formatter: '{b}'}},
                data: barData
            }, {
                name: '订单量渠道占比',
                type: 'pie',
                center: ['75%', '30%'],
                radius: '28%',
                data: pieData
            }]
    };

    var orderCentreCntMixedChart = echarts.init(document.getElementById('orderReceiptCntMixedChart'));
    orderCentreCntMixedChart.setOption(option);
    window.addEventListener('resize',orderCentreCntMixedChart.resize)

}

//验货部分
function drawOrderInspectionCntMixedChart(data) {
    var curData  =globalObj.curInspection;
    var preObj = {}
    globalObj.preInspection.forEach(function(ele){
        preObj[ele.name]=ele.cnt
    })
    var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
    var cnt=0;
    var sourceName=[];
    var pieData = [];
    var barData = [];
    var xLabels = [];
    curData.forEach(function(e){
        cnt+= e.cnt;
        var name = e.name
        sourceName.push(name);
        xLabels.push(name + ":" + e.cnt+" 昨日:"+(preObj[name]|0));
        barData.push({
            value: e.cnt,
            itemStyle: {
                normal: {
                    color: colors.pop()
                }
            }
        });
        pieData.push({name: name, value: e.cnt});
    })
    $("#inspectionTodayCnt").html(cnt);

    var option = {
        title: {
            text: '订单量',
            top: '80%',
            left: 'center'
        },
        tooltip: {},
        legend: {
            data: sourceName
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
                name: '订单量',
                type: 'bar',
                label: {normal: {show: true, position: 'top', formatter: '{b}'}},
                data: barData
            }, {
                name: '订单量渠道占比',
                type: 'pie',
                center: ['75%', '30%'],
                radius: '28%',
                data: pieData
            }]
    };

    var orderCentreCntMixedChart = echarts.init(document.getElementById('orderInspectionCntMixedChart'));
    orderCentreCntMixedChart.setOption(option);

}


//议价部分订单量
function drawOrderBargainCntMixedChart(data) {
    $("#bargainTodayCnt").html(data);
}

//议价部分订单金额
function drawOrderBargainNumMixedChart(data) {
    $("#bargainTodayNum").html(data);
}