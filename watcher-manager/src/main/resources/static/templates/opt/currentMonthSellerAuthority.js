Template.currentMonthSellerAuthority.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#empowermentTab').addClass('active');
    $('#sellerAnalysis').addClass('active');
    $('#agentAuction').addClass('active');
    $('#currentMonthSellerAuthority').addClass('active');
    drawPluralSelect("#service-order", ['OPT', 'POP店'], "service-order");
    drawPluralSelect("#service-send", ['OPT'], "service-send");
    drawPluralSelect("#service-compete", ['OPT', 'POP店'], "service-compete");
    drawPluralSelect("#method", ['定价销售', '竞价销售'], "method");
    $(".filter-option").attr("style","background-color:#fff !important;");
    //绑定卖家下单
    $('#service-order').on('changed.bs.select',function(e) {
        var value = $('#service-order').val();
        uid = getUserName();
        if(uid == undefined || uid == null) {
            _alert("提示", "你的浏览器可能禁用了某部分功能，请刷新或者更换浏览器");
            return;
        }
        drawOrderModel({uid:uid, service:value});
    });

    //绑定卖家下单
    $('#service-send').on('changed.bs.select',function(e) {
        uid = getUserName();
        if(uid == undefined || uid == null) {
            _alert("提示", "你的浏览器可能禁用了某部分功能，请刷新或者更换浏览器");
            return;
        }
        var value = $('#service-send').val();
        drawSendModel({uid:uid, service:value});
    });

    //绑定竞得选项
    $('#service-compete').on('changed.bs.select',function(e) {
        uid = getUserName();
        if(uid == undefined || uid == null) {
            _alert("提示", "你的浏览器可能禁用了某部分功能，请刷新或者更换浏览器");
            return;
        }
        var service = $('#service-compete').val();
        var method = $('#method').val();
            drawCompeteModel({uid:uid, service:service, method:method});
    });

    $('#method').on('changed.bs.select',function(e) {
        uid = getUserName();
        if(uid == undefined || uid == null) {
            _alert("提示", "你的浏览器可能禁用了某部分功能，请刷新或者更换浏览器");
            return;
        }
        var service = $('#service-compete').val();
        var method = $('#method').val();
        drawCompeteModel({uid:uid, service:service, method:method});
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
    drawOrderModel({uid: uid});
    drawSendModel({uid: uid});
    drawCompeteModel({uid: uid});

};


var drawOrderModel = function (param) {

    setOrderTopLoading();
    //卖家下单
    requestURL(dataService + "/biddingOperation/getOrderAuthorUpdateTime", {}).done(function (data) {
        //console.log(data);
        $("#cacheUpdateTime").html(data);
    });
    requestURL(dataService + "/biddingOperation/getNationalRealTimeAuthority", param).done(function (data) {
        var goods = _.filter(data,function(ele){ return ele['genre'] == "下单物品数量"})[0];
        //console.log(goods);
        if(accMul(goods['current'],1) > accMul(goods['last'],1)){
            cancelLoading('currentGoods');
            $("#currentGoodsNum").html(accMul(goods['current'],1).toLocaleString() + "  <i class='fa fa-long-arrow-up text-green'></i>");
        } else if(accMul(goods['current'],1) < accMul(goods['last'],1)) {
            cancelLoading('currentGoods');
            $("#currentGoodsNum").html(accMul(goods['current'],1).toLocaleString() + "  <i class='fa fa-long-arrow-down text-red'></i>");
        }else{
            cancelLoading('currentGoods');
            $("#currentGoodsNum").html(accMul(goods['current'],1).toLocaleString() + "  <i class='fa fa-minus text-orange'></i>");
        }
        cancelLoading('lastGoods');
        $("#lastGoodsNum").html(accMul(goods['last'],1).toLocaleString());

        var seller = _.filter(data,function(ele){ return ele['genre'] == "下单卖家数量"})[0];

        if(accMul(seller['current'],1) > accMul(seller['last'],1)) {
            cancelLoading('currentSeller');
            $("#currentSellerNum").html(accMul(seller['current'],1).toLocaleString() + "  <i class='fa fa-long-arrow-up text-green'></i>");
        } else if(accMul(seller['current'],1) < accMul(seller['last'],1)) {
            cancelLoading('currentSeller');
            $("#currentSellerNum").html(accMul(seller['current'],1).toLocaleString() + "  <i class='fa fa-long-arrow-down text-red'></i>");
        } else {
            cancelLoading('currentSeller');
            $("#currentSellerNum").html(accMul(seller['current'],1).toLocaleString() + "  <i class='fa fa-minus text-orange'></i>");
        }

        cancelLoading('lastSeller');
        $("#lastSellerNum").html(accMul(seller['last'],1).toLocaleString());
    });
    requestURL(dataService + "/biddingOperation/getNationalRealTimeCityAuthority", param).done(function (data) {
        //排序
        var sortList = _.sortBy(data,function(ele) {
            if(ele['genre'] == '下单物品数量') {
                return (accMul(ele['current'],1)); // + accMul(ele['weekly'],1) + accMul(ele['monthly'],1)
            }
        });
        //获取所有省份
        var provinceList = _.uniq(_.pluck(sortList, 'province'));
        drawSelections(provinceList,'province');
        //首次初始化
        initPage(provinceList, sortList);
        $(".province").change(function() {
            var province = $("#province").val();
            var currentList = _.filter(sortList, function(ele) { return ele['province'] == province});
            var label = [];
            var res = {current:[], last:[]};
            var provMap = _.groupBy(currentList, function(ele){ return ele['city'] });
            _.each(provMap, function(value, key) {
                var goods = _.filter(value,function(ele){ return ele['genre'] == "下单物品数量" })[0];
                var seller = _.filter(value,function(ele){ return ele['genre'] == "下单卖家数量" })[0];
                label.push(key + " (" + seller['current'] + "," + seller['last']+ ") ");
                res.current.push(goods['current']);
                res.last.push(goods['last']);
            });
            drawProvinceChart(label,res,'提交物品数量','provinceChart');
        });
    });
};

var drawSendModel = function (param) {
    setSendTopLoading();
    requestURL(dataService + "/biddingOperation/getSendUpdateTime", {}).done(function (data) {
        //console.log(data);
        $("#sendCacheUpdateTime").html(data);
    });
    requestURL(dataService + "/biddingOperation/getCurDayPersonSend", param).done(function (data) {
        var goods = _.filter(data,function(ele){ return ele['genre'] == "发货物品数量"})[0];
        if(accMul(goods['current'],1) > accMul(goods['last'],1)){
            cancelLoading('sendCurrentGoods');
            $("#sendCurrentGoodsNum").html(accMul(goods['current'],1).toLocaleString() + "  <i class='fa fa-long-arrow-up text-green'></i>");
        } else if(accMul(goods['current'],1) < accMul(goods['last'],1)) {
            cancelLoading('sendCurrentGoods');
            $("#sendCurrentGoodsNum").html(accMul(goods['current'],1).toLocaleString() + "  <i class='fa fa-long-arrow-down text-red'></i>");
        }else{
            cancelLoading('sendCurrentGoods');
            $("#sendCurrentGoodsNum").html(accMul(goods['current'],1).toLocaleString() + "  <i class='fa fa-minus text-orange'></i>");
        }
        cancelLoading('sendLastGoods');
        $("#sendLastGoodsNum").html(accMul(goods['last'],1).toLocaleString());

        var seller = _.filter(data,function(ele){ return ele['genre'] == "发货卖家数量"})[0];

        if(accMul(seller['current'],1) > accMul(seller['last'],1)) {
            cancelLoading('sendCurrentSeller');
            $("#sendCurrentSellerNum").html(accMul(seller['current'],1).toLocaleString() + "  <i class='fa fa-long-arrow-up text-green'></i>");
        } else if(accMul(seller['current'],1) < accMul(seller['last'],1)) {
            cancelLoading('sendCurrentSeller');
            $("#sendCurrentSellerNum").html(accMul(seller['current'],1).toLocaleString() + "  <i class='fa fa-long-arrow-down text-red'></i>");
        } else {
            cancelLoading('sendCurrentSeller');
            $("#sendCurrentSellerNum").html(accMul(seller['current'],1).toLocaleString() + "  <i class='fa fa-minus text-orange'></i>");
        }

        cancelLoading('sendLastSeller');
        $("#sendLastSellerNum").html(accMul(seller['last'],1).toLocaleString());
    });
    requestURL(dataService + "/biddingOperation/getCurDayPersonCitySend", param).done(function (data) {
        var sortList = _.sortBy(data,function(ele) {
            if(ele['genre'] == '发货物品数量') {
                return (accMul(ele['current'],1)); //+ accMul(ele['weekly'],1) + accMul(ele['monthly'],1)
            }
        });
        //获取所有省份
        var provinceList = _.uniq(_.pluck(sortList, 'province'));
        drawSelections(provinceList,'province3');
        //首次初始化
        initSendPage(provinceList, sortList);
        $(".province3").change(function() {
            var province = $("#province3").val();
            var currentList = _.filter(sortList, function(ele) { return ele['province'] == province});
            var label = [];
            var res = {current:[], last:[]};
            var provMap = _.groupBy(currentList, function(ele){ return ele['city'] });
            _.each(provMap, function(value, key) {
                var goods = _.filter(value,function(ele){ return ele['genre'] == "发货物品数量" })[0];
                var seller = _.filter(value,function(ele){ return ele['genre'] == "发货卖家数量" })[0];
                label.push(key + " (" + seller['current'] + "," + seller['last'] + ") ");
                res.current.push(goods['today']);
                res.last.push(goods['last']);
            });
            drawProvinceChart(label,res,'发货物品数量','sendProvinceChart');
        });
    });
};

var drawCompeteModel = function (param) {
    setCompeteTopLoading();
    requestURL(dataService + "/biddingOperation/getCompeteUpdateTime", {}).done(function (data) {
        //console.log(data);
        $("#competeCacheUpdateTime").html(data);
    });
    requestURL(dataService + "/biddingOperation/getPersonalRealTimeCompete", param).done(function (data) {
        if(data.length == 0) {
            drawTopNone("compete");
            return;
        }
        var goods = _.filter(data,function(ele){ return ele['genre'] == "竞得物品数量"})[0];
        if(accMul(goods['current'],1) > accMul(goods['last'],1)){
            cancelLoading('competeCurrentGoods');
            $("#competeCurrentGoodsNum").html(accMul(goods['current'],1).toLocaleString() + "  <i class='fa fa-long-arrow-up text-green'></i>");
        } else if(accMul(goods['current'],1) < accMul(goods['last'],1)) {
            cancelLoading('competeCurrentGoods');
            $("#competeCurrentGoodsNum").html(accMul(goods['current'],1).toLocaleString() + "  <i class='fa fa-long-arrow-down text-red'></i>");
        }else{
            cancelLoading('competeCurrentGoods');
            $("#competeCurrentGoodsNum").html(accMul(goods['current'],1).toLocaleString() + "  <i class='fa fa-minus text-orange'></i>");
        }
        cancelLoading('competeLastGoods');
        $("#competeLastGoodsNum").html(accMul(goods['last'],1).toLocaleString());

        var seller = _.filter(data,function(ele){ return ele['genre'] == "竞得物品金额"})[0];

        if(accMul(seller['current'],1) > accMul(seller['last'],1)) {
            cancelLoading('competeCurrentSeller');
            $("#competeCurrentSellerNum").html(accMul(seller['current'],1).toLocaleString() + "  <i class='fa fa-long-arrow-up text-green'></i>");
        } else if(accMul(seller['current'],1) < accMul(seller['last'],1)) {
            cancelLoading('competeCurrentSeller');
            $("#competeCurrentSellerNum").html(accMul(seller['current'],1).toLocaleString() + "  <i class='fa fa-long-arrow-down text-red'></i>");
        } else {
            cancelLoading('competeCurrentSeller');
            $("#competeCurrentSellerNum").html(accMul(seller['current'],1).toLocaleString() + "  <i class='fa fa-minus text-orange'></i>");
        }

        cancelLoading('competeLastSeller');
        $("#competeLastSellerNum").html(accMul(seller['last'],1).toLocaleString());
    });
    requestURL(dataService + "/biddingOperation/getPersonalCityRealTimeCompete", param).done(function (data) {
        if(data.length == 0) {
            drawChartNone('竞得物品金额','competeProvinceChart');
            $(".province2").change(function() {
                drawChartNone('竞得物品金额','competeProvinceChart');
            });
            return;
        }
        var sortList = _.sortBy(data,function(ele) {
            if(ele['genre'] == '竞得物品金额') {
                return (accMul(ele['current'],1)); //+ accMul(ele['weekly'],1) + accMul(ele['monthly'],1)
            }
        });
        //获取所有省份
        var provinceList = _.uniq(_.pluck(sortList, 'province'));
        drawSelections(provinceList,'province2');
        //首次初始化
        initCompetePage(provinceList, sortList);
        $(".province2").change(function() {
            var province = $("#province2").val();
            var currentList = _.filter(sortList, function(ele) { return ele['province'] == province});
            var label = [];
            var res = {current:[], last:[]};
            var provMap = _.groupBy(currentList, function(ele){ return ele['city'] });
            _.each(provMap, function(value, key) {
                var goods = _.filter(value,function(ele){ return ele['genre'] == "竞得物品金额" })[0];
                var seller = _.filter(value,function(ele){ return ele['genre'] == "竞得物品数量" })[0];
                label.push(key + " (" + seller['current'] + "," + seller['last'] + ") ");
                res.current.push(goods['today']);
                res.last.push(goods['last']);
            });
            drawProvinceChart(label,res,'竞得物品数量','competeProvinceChart');
        });
    });
};
var cleanParam = function(param) {
    var p = param;
    delete param['userId'];
    delete param['sign'];
    return p;
};

//卖家下单顶部
var topOrderModelList = ['currentGoods','lastGoods','currentSeller','lastSeller'];
//卖家发货
var topSendModelList = ['sendCurrentGoods','sendLastGoods','sendCurrentSeller','sendLastSeller'];
//竞得
var topCompeteModelList = ['competeCurrentGoods','competeLastGoods','competeCurrentSeller','competeLastSeller'];


var setOrderTopLoading = function() {
    _.each(topOrderModelList,function(ele) {
        initPageToLoading(ele);
    });
};

var setSendTopLoading = function() {
    _.each(topSendModelList,function(ele) {
        initPageToLoading(ele);
    });
};

var setCompeteTopLoading = function() {
    _.each(topCompeteModelList,function(ele) {
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
                barWidth : 30,//柱图宽度
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
                barWidth : 30,//柱图宽度
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

function customWarnModal(modelSelector,titleSelector,provinceName) {
    var province = provinceName.split("(")[0].trim();
    $("#"+modelSelector).off('shown.bs.modal').on('shown.bs.modal', function () {
        $("#"+titleSelector).text(province);
        requestURL(dataService + "/biddingOperation/getNationalRealTimeCityAuthority", {uid: uid}).done(function (data) {
            var tempList = _.filter(data, function(ele) {
                return ele.province == province
            });
            var sortList = _.sortBy(tempList,function(ele) {
                if(ele['genre'] == '下单物品数量') {
                    return (accMul(ele['today'],1)); // + accMul(ele['weekly'],1) + accMul(ele['monthly'],1)
                }
            });
            var label = [];
            var res = {today:[], weekly:[], monthly:[]};

            var provMap = _.groupBy(sortList, function(ele){ return ele['city'] });

            _.each(provMap, function(value, key) {
                var goods = _.filter(value,function(ele){ return ele['genre'] == "下单物品数量" })[0];
                var seller = _.filter(value,function(ele){ return ele['genre'] == "下单卖家数量" })[0];
                label.push(key + " (" + seller['today'] + "," + seller['weekly'] + "," + seller['monthly'] + ") ");
                res.today.push(goods['today']);
                res.weekly.push(goods['weekly']);
                res.monthly.push(goods['monthly']);
            });

            drawCityChart(label,res,'提交物品数量','cityChart');
        });
    });

    $("#"+modelSelector).modal();
}


var drawCityChart = function(label, list, title,chartId) {
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
            data: [ '今日','7日前同时段','4周前同时段']
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
        color:['#3c8dbc','#ff9945','#c23531'],
        series: [
            {
                name: '今日',
                type: 'bar',
                stack: '总量',
                barWidth : 30,//柱图宽度
                itemStyle: {
                    normal: {
                        label: {show: true, position: 'inside'}
                    }
                },
                data: list.today
            },
            {
                name: '7日前同时段',
                type: 'bar',
                stack: '总量',
                barWidth : 30,//柱图宽度
                itemStyle: {
                    normal: {
                        label: {show: true, position: 'inside'}
                    }
                },
                data: list.weekly
            },
            {
                name: '4周前同时段',
                type: 'bar',
                stack: '总量',
                barWidth : 30,//柱图宽度
                itemStyle: {
                    normal: {
                        label: {show: true, position: 'right'}
                    }
                },
                data: list.monthly
            }
        ]
    };
    var cityChart = echarts.init(document.getElementById(chartId));
    cityChart.setOption(option);
    window.addEventListener('resize', cityChart.resize)
};

/**
 * 渲染单选框
 * @param data
 * @param selector
 */
var drawSelections = function(data, selector) {
    $("." + selector).html('');
    _.each(data, function(ele) {
        $("." + selector).append('<option value="'+ ele +'"> ' + ele + ' </option>');
    });
};

var initPage = function(provinceList, sortList){
    var province = provinceList[0];
    var currentList = _.filter(sortList, function(ele) { return ele['province'] == province});
    var label = [];
    var res = {current:[], last:[]};
    var provMap = _.groupBy(currentList, function(ele){ return ele['city'] });
    _.each(provMap, function(value, key) {
        var goods = _.filter(value,function(ele){ return ele['genre'] == "下单物品数量" })[0];
        var seller = _.filter(value,function(ele){ return ele['genre'] == "下单卖家数量" })[0];
        label.push(key + " (" + seller['current'] + "," + seller['last'] + ") ");
        res.current.push(goods['current']);
        res.last.push(goods['last']);
    });
    drawProvinceChart(label,res,'提交物品数量','provinceChart');
};

var initCompetePage = function(provinceList, sortList) {
    var province = provinceList[0];
    var currentList = _.filter(sortList, function(ele) { return ele['province'] == province});
    var label = [];
    var res = {current:[], last:[]};
    var provMap = _.groupBy(currentList, function(ele){ return ele['city'] });
    _.each(provMap, function(value, key) {
        var goods = _.filter(value,function(ele){ return ele['genre'] == "竞得物品金额" })[0];
        var seller = _.filter(value,function(ele){ return ele['genre'] == "竞得物品数量" })[0];
        label.push(key + " (" + seller['current'] + "," + seller['last'] + ") ");
        res.current.push(goods['current']);
        res.last.push(goods['last']);
    });
    drawProvinceChart(label,res,'竞得物品金额','competeProvinceChart');
};

var initSendPage = function(provinceList, sortList) {
    var province = provinceList[0];
    var currentList = _.filter(sortList, function(ele) { return ele['province'] == province});
    var label = [];
    var res = {current:[], last:[]};
    var provMap = _.groupBy(currentList, function(ele){ return ele['city'] });
    _.each(provMap, function(value, key) {
        var goods = _.filter(value,function(ele){ return ele['genre'] == "发货物品数量" })[0];
        var seller = _.filter(value,function(ele){ return ele['genre'] == "发货卖家数量" })[0];
        label.push(key + " (" + seller['current'] + "," + seller['last'] + ") ");
        res.current.push(goods['current']);
        res.last.push(goods['last']);
    });
    drawProvinceChart(label,res,'发货物品数量','sendProvinceChart');
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