Template.afterDashboard.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#dashboard').addClass('active');
    $('#tradeSubmit').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }
    setTopLoading();
    requestURL(dataService + "/live/order", {}).done(function (data) {

        expireArr = _.uniq(_.pluck(data, 'area'));

        var currentSubmitNum = _.reduce(data, function(temp, obj) { return temp + accMul(obj['current_submit_num'],1)}, 0);

        var lastSubmitNum = _.reduce(data, function(temp, obj) { return temp + accMul(obj['last_submit_num'],1)}, 0);

        cancelLoading('currentSubmitNum');
        $("#currentSubmitNum").html(currentSubmitNum.toLocaleString());

        cancelLoading('lastSubmitNum');
        $("#lastSubmitNum").html(lastSubmitNum.toLocaleString());

        var currentSubmitAmount = _.reduce(data, function(temp, obj) { return temp + accMul(obj['current_submit_amount'],1)}, 0);

        var lastSubmitAmount = _.reduce(data, function(temp, obj) { return temp + accMul(obj['last_submit_amount'],1)}, 0);

        cancelLoading('currentSubmitAmount');
        $("#currentSubmitAmount").html(currentSubmitAmount.toLocaleString());

        cancelLoading('lastSubmitAmount');
        $("#lastSubmitAmount").html(lastSubmitAmount.toLocaleString());

        //订单提交量
        var sourceData = publicHandler(data, 'source', 'current_submit_num', 'last_submit_num', null, null);
        drawPublicChart(sourceData, 'sourceNumChart', '提交订单量');

        var methodData = publicHandler(data, 'method', 'current_submit_num', 'last_submit_num', null, null);
        drawPublicChartNoScroll(methodData, 'methodNumChart', '提交订单量', false, null, null, null);

        var indoorData = publicHandler(data, 'area', 'current_submit_num', 'last_submit_num', "method", "上门订单");
        drawPublicChartNoScroll(indoorData, 'indoorNumChart', '提交订单量', true, "num", "method", "上门订单");

        var storeData = publicHandler(data, 'area', 'current_submit_num', 'last_submit_num', "method", "门店订单");
        drawPublicChartNoScroll(storeData, 'storeNumChart', '提交订单量', true, "num", "method", "门店订单");

        var categoryData = publicHandler(data, 'category', 'current_submit_num', 'last_submit_num', null, null);
        drawPublicChart(categoryData, 'categoryNumChart', '提交订单量');

        var expressData = publicHandler(data, 'source', 'current_submit_num', 'last_submit_num', "method", "快递订单");
        drawPublicChart(expressData, 'expressNumChart', '提交订单量');

        //订单提交额  7 个

        var sourceAData = publicHandler(data, 'source', 'current_submit_amount', 'last_submit_amount', null, null);
        drawPublicChart(sourceAData, 'sourceAmountChart', '提交订单额');

        var methodAData = publicHandler(data, 'method', 'current_submit_amount', 'last_submit_amount', null, null);
        drawPublicChartNoScroll(methodAData, 'methodAmountChart', '提交订单额', false, null, null, null);

        var indoorAData = publicHandler(data, 'area', 'current_submit_amount', 'last_submit_amount', "method", "上门订单");
        drawPublicChartNoScroll(indoorAData, 'indoorAmountChart', '提交订单额', true, "amount", "method", "上门订单");

        var storeAData = publicHandler(data, 'area', 'current_submit_amount', 'last_submit_amount', "method", "门店订单");
        drawPublicChartNoScroll(storeAData, 'storeAmountChart', '提交订单额', true, "amount", "method", "门店订单");

        var categoryAData = publicHandler(data, 'category', 'current_submit_amount', 'last_submit_amount', null, null);
        drawPublicChart(categoryAData, 'categoryAmountChart', '提交订单额');

        cacheList = data;
    });
};


var expireArr = ['华北大区', '华南大区', '华东大区', '华西大区', '未知'];

var cacheList = [];

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


var publicNextHandler = function(list, groupName, currName, lastName, filterName, filterTarget, nextFilterField, nextFilterTarget) {
    var copyList = _.filter(list, function(obj) { return (obj[filterName] == filterTarget && obj[nextFilterField] == nextFilterTarget)});
    var groupData = _.groupBy(copyList, groupName);
    var tempList = [];
    _.map(groupData, function(value, key) {
        var current = _.reduce(value, function(temp, obj) { return temp + accMul(obj[currName], 1)}, 0);
        var last = _.reduce(value, function(temp, obj) { return temp + accMul(obj[lastName], 1)}, 0);
        var str = key + ":" + current.toLocaleString() + "\n" + "昨天:" + last.toLocaleString();
        tempList.push({k : str, v : current, uk : key});
    });
    var res = {labels: [], xLabels:[], barData:[], pieData:[]};
    var sortData = _.sortBy(tempList, function(obj) {
        return -obj.v;
    });
    _.each(sortData, function(obj) {
        res.labels.push(obj.uk);
        res.xLabels.push(obj.k);
        res.barData.push(obj.v);
        res.pieData.push({ name: obj.uk, value: obj.v });
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
    /*chart.on('click',function (params) {
        var regex = new RegExp("^京东|^小米|^芝麻信用|^华为|^闲鱼|^魅族|^支付宝小程序");
        if(regex.test(params.name) == true) {
            var channel = params.name.split(":")[0];
            console.log(params.value);
            //popModal(channel);
            customWarnModal('myWarnModal','myWarnModalLabel',channel);
        }
    });*/
    chart.resize();
    window.addEventListener('resize',chart.resize);

}


function drawPublicChartNoScroll(obj, chartId, seriesName, next, defaults, nextFilterField, nextFilterTarget) {
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
    chart.on('click',function (params) {
        var area = params.name.split(":")[0];
        if(expireArr.contains(area) && next) {
            customWarnModal('myWarnModal', 'myWarnModalLabel', area, defaults, nextFilterField, nextFilterTarget);
        }
    });
    chart.resize();
    window.addEventListener('resize',chart.resize);

}

function customWarnModal(modelSelector, titleSelector, area, defaults, nextFilterField, nextFilterTarget) {
    $("#"+modelSelector).off('shown.bs.modal').on('shown.bs.modal', function () {
        $("#" + titleSelector).text(area);
        var showField = (defaults == 'num') ? 'current_submit_num' : 'current_submit_amount';
        var subShowField = (defaults == 'num') ? 'last_submit_num' : 'last_submit_amount';
        var base = publicNextHandler(cacheList, 'city', showField, subShowField, 'area', area, nextFilterField, nextFilterTarget);
        //console.log(base);
        drawNextTradeChart(base, 'cityNumChart', '提交订单量', '提交订单量城市占比');
    });
    $("#" + modelSelector).modal();
}


function drawNextTradeChart(obj, chartId, seriesName, pieSeriesName) {
    var option = {
        grid: {
            left:'0',
            right:'5%',
            bottom:'1%',
            top:'7%',
            containLabel:true
        },
        tooltip: {
            formatter: '{a}：{c}'
        },
        legend: {
            data: obj.labels
        },
        calculable: true,
        xAxis: [
            {
                'type': 'category',
                'data': obj.xLabels
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: seriesName,
                type: 'bar',
                label: { normal: { show: true, position: 'top', formatter: '{b}' } },
                data: obj.barData,
                barWidth : 30,//柱图宽度
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
            }, {
                name: pieSeriesName,
                type: 'pie',
                center: ['75%', '30%'],
                radius: '28%',
                data: obj.pieData,
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
            }]
    };
    var chart = echarts.init(document.getElementById(chartId));
    chart.setOption(option, false, false);
    chart.resize();
    window.addEventListener('resize',chart.resize);
}

//top部分
var topModelList = ['currentSubmitNum','lastSubmitNum','currentSubmitAmount','lastSubmitAmount'];

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