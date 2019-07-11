Template.afterAllDealDashboard.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#dashboard').addClass('active');
    $('#allDealDashboard').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }
    setTopLoading();
    requestURL(dataService + "/live/merge", {}).done(function (data) {

        var currentSuccessNum = _.reduce(data, function(temp, obj) { return temp + accMul(obj['current_success_num'],1)}, 0);

        var lastSuccessNum = _.reduce(data, function(temp, obj) { return temp + accMul(obj['last_success_num'],1)}, 0);

        cancelLoading('currentSuccessNum');
        $("#currentSuccessNum").html(currentSuccessNum.toLocaleString());

        cancelLoading('lastSuccessNum');
        $("#lastSuccessNum").html(lastSuccessNum.toLocaleString());

        var currentSuccessAmount = _.reduce(data, function(temp, obj) { return temp + accMul(obj['current_success_amount'],1)}, 0);

        var lastSuccessAmount = _.reduce(data, function(temp, obj) { return temp + accMul(obj['last_success_amount'],1)}, 0);

        cancelLoading('currentSuccessAmount');
        $("#currentSuccessAmount").html(currentSuccessAmount.toLocaleString());

        cancelLoading('lastSuccessAmount');
        $("#lastSuccessAmount").html(lastSuccessAmount.toLocaleString());

        //订单提交量
        var sourceData = publicHandler(data, 'source', 'current_success_num', 'last_success_num', null, null);
        drawPublicChart(sourceData, 'sourceNumChart', '提交订单量');

        var methodData = publicHandler(data, 'method', 'current_success_num', 'last_success_num', null, null);
        drawPublicChartNoScroll(methodData, 'methodNumChart', '提交订单量');

        var categoryData = publicHandler(data, 'category', 'current_success_num', 'last_success_num', null, null);
        drawPublicChart(categoryData, 'categoryNumChart', '提交订单量');

        //订单提交额  7 个

        var sourceAData = publicHandler(data, 'source', 'current_success_amount', 'last_success_amount', null, null);
        drawPublicChart(sourceAData, 'sourceAmountChart', '提交订单额');

        var methodAData = publicHandler(data, 'method', 'current_success_amount', 'last_success_amount', null, null);
        drawPublicChartNoScroll(methodAData, 'methodAmountChart', '提交订单额');

        var categoryAData = publicHandler(data, 'category', 'current_success_amount', 'last_success_amount', null, null);
        drawPublicChart(categoryAData, 'categoryAmountChart', '提交订单额');
    });
};

/**
 * 公共方法，传入初始数组，分组字段名， 统计当前字段名， 统计昨天字段名, 过滤字段名
 * @param list
 * @param groupName
 * @param currName
 * @param lastName
 * @param filterName
 * @param filterTarget
 * @returns {{xLabels: Array, barData: Array}}
 */
var publicHandler = function(list, groupName, currName, lastName, filterName, filterTarget) {
    var copyList = [];
    if(filterName != null) {
        copyList = _.filter(list, function(obj) { return obj[filterName] == filterTarget });
    } else {
        copyList = list;
    }
    var groupData = _.groupBy(copyList, groupName);
    var tempList = [];
    _.map(groupData, function(value, key) {
        var current = _.reduce(value, function(temp, obj) { return temp + accMul(obj[currName], 1)}, 0);
        var last = _.reduce(value, function(temp, obj) { return temp + accMul(obj[lastName], 1)}, 0);
        var str = key + ":" + current.toLocaleString() + "(昨天:" + last.toLocaleString() + ")";
        tempList.push({k : str, v : current});
    });
    var res = {xLabels:[], barData:[]};
    var sortData = _.sortBy(tempList, function(obj) {
        return obj.v;
    });
    _.each(sortData, function(obj) {
        res.xLabels.push(obj.k);
        res.barData.push(obj.v);
    });
    return res;
};

function drawPublicChart(obj, chartId, seriesName) {
    var option = {
        calculable: true,
        grid: {
            left:'0',
            right:'5%',
            bottom:'1%',
            top:'7%',
            containLabel:true
        },
        tooltip: {
            trigger: 'item',
            formatter:function(param) {
                return '' + param.name.split(":")[0] + ': ' + param.value.toLocaleString();
            }
        },
        dataZoom: [
            {
                show: true,
                yAxisIndex: 0,
                start: 85,
                end: 100
            }
        ],
        yAxis: [
            {
                'type': 'category',
                'data': obj.xLabels
            }
        ],
        xAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: seriesName,
                type: 'bar',
                /*label: { normal: { show: true, position: 'right', formatter: '{b}' } },*/
                data: obj.barData,
                barWidth: '30',
                itemStyle: {
                    normal: {
                        color: function(params) {
                            var index = params.dataIndex;
                            var newColor = "";
                            var colorList = ['#3c8dbc','#ff9945','#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];
                            var alternateNumber = colorList.length;
                            if(index < alternateNumber) {
                                newColor = colorList[index];
                            } else {
                                var rowNumber = Math.floor(index / alternateNumber);
                                newColor = colorList[index - rowNumber * alternateNumber];
                            }
                            return newColor;
                        }
                    }
                }
            }
        ]
    };
    var chart = echarts.init(document.getElementById(chartId));
    chart.setOption(option, false, false);
    chart.resize();
    window.addEventListener('resize',chart.resize);

}


function drawPublicChartNoScroll(obj, chartId, seriesName) {
    var option = {
        calculable: true,
        grid: {
            left:'0',
            right:'5%',
            bottom:'1%',
            top:'7%',
            containLabel:true
        },
        tooltip: {
            trigger: 'item',
            formatter:function(param) {
                return '' + param.name.split(":")[0] + ': ' + param.value.toLocaleString();
            }
        },
        yAxis: [
            {
                'type': 'category',
                'data': obj.xLabels
            }
        ],
        xAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: seriesName,
                type: 'bar',
                /*label: { normal: { show: true, position: 'right', formatter: '{b}' } },*/
                data: obj.barData,
                barWidth: '30',
                itemStyle: {
                    normal: {
                        color: function(params) {
                            var index = params.dataIndex;
                            var newColor = "";
                            var colorList = ['#3c8dbc','#ff9945','#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];
                            var alternateNumber = colorList.length;
                            if(index < alternateNumber) {
                                newColor = colorList[index];
                            } else {
                                var rowNumber = Math.floor(index / alternateNumber);
                                newColor = colorList[index - rowNumber * alternateNumber];
                            }
                            return newColor;
                        }
                    }
                }
            }
        ]
    };
    var chart = echarts.init(document.getElementById(chartId));
    chart.setOption(option, false, false);
    chart.resize();
    window.addEventListener('resize',chart.resize);
}

//top部分
var topModelList = ['currentSuccessNum','lastSuccessNum','currentSuccessAmount','lastSuccessAmount'];

//top部分加载动画
var setTopLoading = function() {
    _.each(topModelList,function(ele) {
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