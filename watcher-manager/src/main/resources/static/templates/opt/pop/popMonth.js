Template.popMonth.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#empowermentTab').addClass('active');
    $('#sellerAnalysis').addClass('active');
    $('#reachStore').addClass('active');
    $('#popMonth').addClass('active');

    drawPluralSelect("#service-submit", ['店员宝'], "service-submit");
    drawPluralSelect("#service-success", ['店员宝'], "service-success");

    $(".filter-option").attr("style","background-color:#fff !important;");

    //绑定提交
    $('#service-submit').on('changed.bs.select',function(e) {
        uid = getUserName();
        if(uid == undefined || uid == null) {
            _alert("提示", "你的浏览器可能禁用了某部分功能，请刷新或者更换浏览器");
            return;
        }
        var value = $('#service-submit').val();
        drawJoinModel({uid: uid, service:value});
    });

    //绑定成交
    $('#service-success').on('changed.bs.select',function(e) {
        uid = getUserName();
        if(uid == undefined || uid == null) {
            _alert("提示", "你的浏览器可能禁用了某部分功能，请刷新或者更换浏览器");
            return;
        }
        var value = $('#service-success').val();
        drawJoinModel({uid: uid, service:value});
    });

    renderPage();
    toolTipCustom();
};
var uid = "-1";
/**
 * 渲染复选框方法
 */
var drawPluralSelect = function(selector, data, containerId) {
    $(selector).selectpicker({
        selectAllText: '全选',
        deselectAllText:'取消全选',
        noneSelectedText: '全部',
        noneResultsText: '没有找到匹配的项'
    });
    var container = document.getElementById(containerId);
    container.options.length = 0;
    _.each(data, function(item) {
        container.options.add(new Option(item, item));
    });
    $(selector).selectpicker('refresh');
};
//
var renderPage = function() {
    uid = getUserName();
    if(uid == undefined || uid == null) {
        _alert("提示", "你的浏览器可能禁用了某部分功能，请刷新或者更换浏览器");
        return;
    }
    //卖家下单
    drawJoinModel({uid: uid});
};


function getTopData(data, field, prefix, suffix) {
    var target = _.filter(data, function (ele) {
        return ele['genre'] == field
    })[0];
    if (accMul(target['current'], 1) > accMul(target['last'], 1)) {
        cancelLoading(prefix + (prefix == ''? 'current' : 'Current') + suffix);
        $("#" + prefix + (prefix == ''? 'current' : 'Current') + suffix + 'Num').html(accMul(target['current'], 1).toLocaleString() + "  <i class='fa fa-long-arrow-up text-green'></i>");
    } else if (accMul(target['current'], 1) < accMul(target['last'], 1)) {
        cancelLoading(prefix + (prefix == ''? 'current' : 'Current') + suffix);
        $("#" + prefix + (prefix == ''? 'current' : 'Current') + suffix + 'Num').html(accMul(target['current'], 1).toLocaleString() + "  <i class='fa fa-long-arrow-down text-red'></i>");
    } else {
        cancelLoading(prefix + (prefix == ''? 'current' : 'Current') + suffix);
        $("#" + prefix + (prefix == ''? 'current' : 'Current') + suffix + 'Num').html(accMul(target['current'], 1).toLocaleString() + "  <i class='fa fa-minus text-orange'></i>");
    }
    cancelLoading(prefix + (prefix == ''? 'last' : 'Last') + suffix);
    $("#" + prefix + (prefix == ''? 'last' : 'Last') + suffix + 'Num').html(accMul(target['last'], 1).toLocaleString());
}

function getLineChartData(data, left, right, chartId) {
    var sortList = _.sortBy(data, function (ele) {
        if (ele['genre'] == right) {
            return (accMul(ele['current'], 1));
        }
    });
    var label = [];
    var res = {current: [], last: []};

    var provMap = _.groupBy(sortList, function (ele) {
        return ele['province']
    });

    _.each(provMap, function (value, key) {
        var goods = _.filter(value, function (ele) {
            return ele['genre'] == right
        })[0];
        var seller = _.filter(value, function (ele) {
            return ele['genre'] == left
        })[0];
        label.push(key + " (" + seller['current'] + "," + seller['last'] + ") ");
        res.current.push(goods['current']);
        res.last.push(goods['last']);
    });

    drawProvinceChart(label, res, right, chartId);
}

var drawJoinModel = function (param) {
    setSubmitTopLoading();
    setSuccessTopLoading();
    requestURL(dataService + "/biddingOperation/getPopUpdateTime", {}).done(function (data) {
        $("#cacheUpdateTime").html(data);
        $("#successCacheUpdateTime").html(data);
    });

    requestURL(dataService + "/biddingOperation/getPopHeader", param).done(function (data) {
        getTopData(data, '提交用户数', '', 'Customer');

        getTopData(data, '提交订单数', '', 'Order');

        getTopData(data, '提交订单金额', '', 'Amount');

        getTopData(data, '成交用户数', 'success', 'Customer');

        getTopData(data, '成交订单数', 'success', 'Order');

        getTopData(data, '成交订单金额', 'success', 'Amount');

    });

    requestURL(dataService + "/biddingOperation/getPopBody", param).done(function (data) {
        getLineChartData(data, '提交用户数', '提交订单数', 'provinceChart');

        getLineChartData(data, '提交用户数', '提交订单金额', 'provinceChart2');

        getLineChartData(data, '成交用户数', '成交订单数', 'successProvinceChart');

        getLineChartData(data, '成交用户数', '成交订单金额', 'successProvinceChart2');
    });
};



//提交
var topSubmitModelList = ['currentCustomer','lastCustomer','currentOrder','lastOrder','currentAmount','lastAmount'];
//成交
var topSuccessModelList = ['successCurrentCustomer','successLastCustomer','successCurrentOrder','successLastOrder','successCurrentAmount','successLastAmount'];



var setSubmitTopLoading = function() {
    _.each(topSubmitModelList,function(ele) {
        initPageToLoading(ele);
    });
};

var setSuccessTopLoading = function() {
    _.each(topSuccessModelList,function(ele) {
        initPageToLoading(ele);
    });
};

var initPageToLoading = function(modelName) {
    $("#" + modelName + "LoadingPanel").show();
    $("#" + modelName + "Panel").hide();
};

var cancelLoading = function(modelName) {
    $("#" + modelName + "LoadingPanel").hide();
    $("#" + modelName + "Panel").show();
};

var drawProvinceChart = function(label, list, title,chartId) {
    var option = {
        title: {
            text: title,
            x:'center',
            y:'top',
            textAlign:'left',
            textStyle: {
                color: '#3c8dbc',
                fontStyle: 'normal',
                fontWeight: 'bold',
                fontSize:15
            }
        },
        dataZoom: [
            {
                type: 'slider',
                start: 20,
                end: 100,
                yAxisIndex: [0]
            }
        ],
        animation: false,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            top:'5%',
            data: [ '本月','上月同期']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'value',
                splitLine:{
                    show:true,
                    lineStyle:{
                        type:'dashed'
                    }
                }
            }
        ],
        yAxis: [
            {
                type: 'category',
                axisTick: {show: true},
                data: label,
                axisLabel: {
                    interval: 0
                }
            }
        ],
        color:['#3c8dbc','#ff9945'],
        series: [
            {
                name: '本月',
                type: 'bar',
                stack: '总量',
                itemStyle: {
                    normal: {
                        label: {show: true, position: 'inside'}
                    }
                },
                data: list.current
            },
            {
                name: '上月同期',
                type: 'bar',
                stack: '总量',
                itemStyle: {
                    normal: {
                        label: {show: true, position: 'right'}
                    }
                },
                data: list.last
            }
        ]
    };
    var provinceChart = echarts.init(document.getElementById(chartId));
    provinceChart.setOption(option);
    window.addEventListener('resize', provinceChart.resize)
};


var drawTopNone = function(type) {
    var lineIds = [];
    switch(type) {
        case "order":
            lineIds = topOrderModelList;
            break;
        case "send":
            lineIds = topSendModelList;
            break;
        case "settle":
            lineIds = topSettleModelList;
            break;
        case "compete":
            lineIds = topCompeteModelList;
            break;
    }
    _.each(lineIds, function(ele) {
        cancelLoading(ele);
        $("#" + ele + "Num").html("0");
    });
};

var drawChartNone = function(title, chartId) {
    var label = [];
    var res = {current:[], last:[]};
    drawProvinceChart(label, res, title, chartId);
};