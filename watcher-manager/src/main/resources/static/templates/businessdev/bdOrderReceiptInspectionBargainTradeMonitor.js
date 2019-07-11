/**
 * Created by hsh on 2016/5/13.
 */
Template.bdOrderReceiptInspectionBargainTradeMonitor.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#BDTab').addClass('active');
    $('#bdOrderReceiptInspectionBargainTradeMonitor').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    //今天
    $(".tdDate").html(new Date().getNewDate(0));
    renderTodayPage();
    renderYtdPage();
};

function renderTodayPage() {

    var filter = {}
    filter.type = "sourceType"
    filter.dateType = "td"
    filter.orderType = "receipt"
    var promise = getBdSourceReceiptInfo(filter);
    promise.done(function (ret) {
        drawOrderReceiptCntMixedChart(ret);
    });

    filter.orderType = "inspection"
    var promise = getBdSourceReceiptInfo(filter);
    promise.done(function (ret) {
        drawOrderInspectionCntMixedChart(ret);
    });

    //议价部分成交量
    var promise = getBdSourceTypeBargainInfo(filter);
    promise.done(function (ret) {
        drawOrderBargainCntMixedChart(ret);
    });

    //议价部分成交金额
    var promise = getBdSourceTypeBargainNumInfo(filter);
    promise.done(function (ret) {
        drawOrderBargainNumMixedChart(ret);
    });

    //质检人员统计
    var promise = getBdSourceTypeInspectionStaffCntInfo(filter);
    promise.done(function (ret) {
        drawInspectionStaffCntMixedChart(ret);
    });

}

function renderYtdPage() {

    var filter = {}
    filter.type = "sourceType"
    filter.dateType = "ytd"
    filter.orderType = "receipt"
    //到货
    var promise = getBdSourceReceiptInfo(filter);
    promise.done(function (ret) {
        var cnt=0;
        ret.forEach(function(e){
            cnt+= e.cnt;
        })
        $("#receiptYtdCnt").html(cnt)
    });

    //验货
    filter.orderType = "inspection"
    var promise = getBdSourceReceiptInfo(filter);
    promise.done(function (ret) {
        var cnt=0;
        ret.forEach(function(e){
            cnt+= e.cnt;
        })
        $("#inspectionYtdCnt").html(cnt)
    });

    //议价部分成交订单量
    var promise = getBdSourceTypeBargainInfo(filter);
    promise.done(function (ret) {
        var cnt=0;
        ret.forEach(function(e){
            cnt+= e.cnt;
        })
        $("#bargainYtdCnt").html(cnt)
    });

    //议价部分成交金额
    var promise = getBdSourceTypeBargainNumInfo(filter);
    promise.done(function (ret) {
        var cnt=0;
        ret.forEach(function(e){
            cnt+= e.cnt;
        })
        $("#bargainYtdNum").html(cnt)
    });

    //质检人员统计
    /*var promise = getBdSourceTypeInspectionStaffCntInfo(filter);
    promise.done(function (ret) {
        $("#inspectionStaffYtdCnt").html(ret.sh[0]+ret.cd[0]+ret.sz[0]+ret.tj[0]+ ret.wh[0])
    });*/

}

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

//质检人员统计
function getBdSourceTypeInspectionStaffCntInfo(filter) {
    //clean parameters
    var query = _.clone(filter);
    delete query["userId"];
    delete query["sign"];
    delete query["type"];
    delete query["orderType"];
    var dfd = $.Deferred();
    requestURL(dataService + "/bd/getBdSourceTypeInspectionCntInfo", query).done(function (ret) {
        dfd.resolve(ret)
    });
    return dfd.promise()
}

function popModal(orderType,channel) {
    setTimeout(function () {
        $.fancybox.open([
            {
                type: 'iframe',
                href: "/bd/bdOrderReceiptInspectionBargainDetailMonitor/" + orderType +"/"+ channel
            }
        ], {
            padding: 0,
            height: 600,
            'width': 1000,
            minHeight: 600,
            autoScale: false,
            //fitToView: false,
            //autoSize: false,
            beforeShow: function () {
                this.height = 800;
            }
        });
    }, 400);
}

//到货部分
function drawOrderReceiptCntMixedChart(data) {

    var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
    var cnt=0;
    var sourceName=[];
    var pieData = [];
    var barData = [];
    var xLabels = [];
    data.forEach(function(e){
        cnt+= e.cnt;
        sourceName.push(e.name);
        xLabels.push(e.name + ":" + e.cnt);
        barData.push({
            value: e.cnt,
            itemStyle: {
                normal: {
                    color: colors.pop()
                }
            }
        });
        pieData.push({name: e.name, value: e.cnt});
    })
    $("#receiptTodayCnt").html(cnt);

    var option = {
        title: {
            text: '到货订单量',
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
                name: '到货订单量',
                type: 'bar',
                label: {normal: {show: true, position: 'top', formatter: '{b}'}},
                data: barData
            }, {
                name: '到货订单量渠道占比',
                type: 'pie',
                center: ['75%', '30%'],
                radius: '28%',
                data: pieData
            }]
    };

    var orderReceiptCntMixedChart = echarts.init(document.getElementById('orderReceiptCntMixedChart'));
    orderReceiptCntMixedChart.setOption(option);
    orderReceiptCntMixedChart.on('click', function (params) {
            var channel = params.name.split(":")[0];
            popModal("receipt",channel);
    });
    window.addEventListener('resize', function () {
        orderReceiptCntMixedChart.resize();
    })

}

//验货部分
function drawOrderInspectionCntMixedChart(data) {
    var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
    var cnt=0;
    var sourceName=[];
    var pieData = [];
    var barData = [];
    var xLabels = [];
    data.forEach(function(e){
        cnt+= e.cnt;
        sourceName.push(e.name);
        xLabels.push(e.name + ":" + e.cnt);
        barData.push({
            value: e.cnt,
            itemStyle: {
                normal: {
                    color: colors.pop()
                }
            }
        });
        pieData.push({name: e.name, value: e.cnt});
    })
    $("#inspectionTodayCnt").html(cnt);

    var option = {
        title: {
            text: '验货订单量',
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
                name: '验货订单量',
                type: 'bar',
                label: {normal: {show: true, position: 'top', formatter: '{b}'}},
                data: barData
            }, {
                name: '验货订单量渠道占比',
                type: 'pie',
                center: ['75%', '30%'],
                radius: '28%',
                data: pieData
            }]
    };

    var orderInspectionCntMixedChart = echarts.init(document.getElementById('orderInspectionCntMixedChart'));
    orderInspectionCntMixedChart.setOption(option);
    orderInspectionCntMixedChart.on('click', function (params) {
        var channel = params.name.split(":")[0];
        popModal("inspection",channel);
    });
    window.addEventListener('resize', function () {
        orderInspectionCntMixedChart.resize();
    })
}

//议价部分订单量
function drawOrderBargainCntMixedChart(data) {
    var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
    var cnt=0;
    var sourceName=[];
    var pieData = [];
    var barData = [];
    var xLabels = [];
    data.forEach(function(e){
        cnt+= e.cnt;
        sourceName.push(e.name);
        xLabels.push(e.name + ":" + e.cnt);
        barData.push({
            value: e.cnt,
            itemStyle: {
                normal: {
                    color: colors.pop()
                }
            }
        });
        pieData.push({name: e.name, value: e.cnt});
    })
    $("#bargainTodayCnt").html(cnt);

    var option = {
        title: {
            text: '议价订单成交量',
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
                name: '议价订单成交量',
                type: 'bar',
                label: {normal: {show: true, position: 'top', formatter: '{b}'}},
                data: barData
            }, {
                name: '议价订单成交量渠道占比',
                type: 'pie',
                center: ['75%', '30%'],
                radius: '28%',
                data: pieData
            }]
    };

    var orderBargainCntMixedChart = echarts.init(document.getElementById('orderBargainCntMixedChart'));
    orderBargainCntMixedChart.setOption(option);

}

//议价部分订单金额
function drawOrderBargainNumMixedChart(data) {
    var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
    var cnt=0;
    var sourceName=[];
    var pieData = [];
    var barData = [];
    var xLabels = [];
    data.forEach(function(e){
        cnt+= e.cnt;
        sourceName.push(e.name);
        xLabels.push(e.name + ":" + e.cnt);
        barData.push({
            value: e.cnt,
            itemStyle: {
                normal: {
                    color: colors.pop()
                }
            }
        });
        pieData.push({name: e.name, value: e.cnt});
    })
    $("#bargainTodayNum").html(cnt);

    var option = {
        title: {
            text: '议价订单成交金额',
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
                name: '议价订单成交金额',
                type: 'bar',
                label: {normal: {show: true, position: 'top', formatter: '{b}'}},
                data: barData
            }, {
                name: '议价订单成交量渠道占比',
                type: 'pie',
                center: ['75%', '30%'],
                radius: '28%',
                data: pieData
            }]
    };

    var orderBargainNumMixedChart = echarts.init(document.getElementById('orderBargainNumMixedChart'));
    orderBargainNumMixedChart.setOption(option);

}

//质检人员
function drawInspectionStaffCntMixedChart(data) {

    var curTotal = _.reduce(data, function(num, tmp){ return num + parseInt(tmp.curCnt); }, 0)
    var preTotal = _.reduce(data, function(num, tmp){ return num + parseInt(tmp.preCnt); }, 0)
    $("#inspectionStaffYtdCnt").html(preTotal)
    $("#inspectionStaffTodayCnt").html(curTotal);
    var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
    var centreObj = {"1":"上海","12":"上海(流程测试)","2":"北京","3":"成都","4":"深圳(物流)","16":"深圳","5":"天津","6":"武汉","7":"测试","8":"ces","9":"采销","10":"常州","18":"常州(流程测试)","11":"成都龙湖","13":"AA宝运营中心","21":"深圳运营中心(流程测试)"}
    var barData = [],xLabels=[],pieData=[]
    _.sortBy(data,function(ele){return -parseInt(ele.curCnt)}).forEach(function(obj){
        var name = centreObj[obj.centre]
        xLabels.push(name + ":" + obj.curCnt+" 昨日:"+obj.preCnt);
        pieData.push({name: name, value: obj.curCnt})
        barData.push({
            value: obj.curCnt,
            itemStyle: {
                normal: {
                    color: colors.pop()
                }
            }
        });
    })

    var option = {
        title: {
            text: '订单量',
            top: '80%',
            left: 'center'
        },
        tooltip: {},
        legend: {
            data: _.values(centreObj)
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
    var orderCentreCntMixedChart = echarts.init(document.getElementById('orderInspectionStaffCntMixedChart'));
    orderCentreCntMixedChart.setOption(option);
}
