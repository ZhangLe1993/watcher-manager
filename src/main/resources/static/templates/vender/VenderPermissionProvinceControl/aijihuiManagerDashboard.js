

var groupIdInfo=[];

Template.aijihuiManagerDashboard.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#VenderPermissionControl').addClass('active');
    $('#aijihuiManagerDashboardTab').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    toolTipCustom();

    requestURL(dataService + "/Vender/getVenderPermissionControlToGroupIdJsonInfo", {"type":"venderGroup"}).done(function(data){
        groupIdInfo=data.venderGroupId;
        updateDashboard();

        getVenderAccumulateTrendOrder();
        getYesterdayCurrentTimeData(true);
    })

    $(".type").on('change',function(){
        requestURL(dataService + "/Vender/getVenderPermissionControlToGroupIdJsonInfo", {"type":($(".type").val()=="")?"venderGroup":$(".type").val()}).done(function(data){
            groupIdInfo=data.venderGroupId;
            updateDashboard();

            getVenderAccumulateTrendOrder();
            getYesterdayCurrentTimeData(true);
        })
    });

    var venderTradeUserMixedChart = echarts.init(document.getElementById('venderTradeUserMixedChart'));
    var venderTradeCityMixedChart = echarts.init(document.getElementById('venderTradeCityMixedChart'));
    var venderTradeCategoryMixedChart = echarts.init(document.getElementById('venderTradeCategoryMixedChart'));
    var venderTradeAmountUserMixedChart = echarts.init(document.getElementById('venderTradeAmountUserMixedChart'));
    var venderTradeAmountCityMixedChart = echarts.init(document.getElementById('venderTradeAmountCityMixedChart'));
    var venderTradeAmountCategoryMixedChart = echarts.init(document.getElementById('venderTradeAmountCategoryMixedChart'));
    var venderTradeDealUserMixedChart = echarts.init(document.getElementById('venderTradeDealUserMixedChart'));
    var venderTradeDealCityMixedChart = echarts.init(document.getElementById('venderTradeDealCityMixedChart'));
    var venderTradeDealCategoryMixedChart = echarts.init(document.getElementById('venderTradeDealCategoryMixedChart'));
    var venderTradeDealAmountUserMixedChart = echarts.init(document.getElementById('venderTradeDealAmountUserMixedChart'))
    var venderTradeDealAmountCityMixedChart = echarts.init(document.getElementById('venderTradeDealAmountCityMixedChart'));
    var venderTradeDealAmountCategoryMixedChart = echarts.init(document.getElementById('venderTradeDealAmountCategoryMixedChart'));
    var venderTradeTrendMixedChart = echarts.init(document.getElementById("venderTradeTrendMixedChart"));

    //趋势图
    function getVenderAccumulateTrendOrder(){
        requestURL(dataService + "/Vender/getVenderAccumulateTrendOrderByUserId", {"type":($(".type").val()=="")?"venderGroup":$(".type").val()}).done(function(data){
            var dateList=[],orderList=[],shopList=[],customerList=[]
            data.forEach(function(obj){
                dateList.push(obj.date)
                orderList.push(obj.orderCount)
                shopList.push(obj.groupCount)
                customerList.push(obj.venderCount)
            })

            var option = {
                title: {
                    text: '每日实时累积趋势图',
                    //top: '80%',
                    left: 'center',

                },
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ["订单日活","门店日活","客户日活"],
                    padding:[50,0,0,0]
                },
                calculable: true,
                grid: {
                    top: 80,
                    bottom: 100
                },
                xAxis: [
                    {
                        'type': 'category',
                        'data': dateList
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '订单日活',
                        type: 'line',
                        label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                        data: orderList
                    },
                    {
                        name: '门店日活',
                        type: 'line',
                        label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                        data: shopList
                    },
                    {
                        name: '客户日活',
                        type: 'line',
                        label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                        data: customerList
                    }
                ]
            };

            venderTradeTrendMixedChart.setOption(option);
            window.addEventListener('resize', venderTradeTrendMixedChart.resize)

        })
    }
    //getVenderAccumulateTrendOrder()
    setInterval(getVenderAccumulateTrendOrder,1000*60*5)

    var submitDataMap = new Map();
    var tradeDataMap = new Map();
    function getYesterdayCurrentTimeData(isFirst){

        requestURL(dataService + "/Vender/getVenderYesterdayCurrentTimeStatsByUserId", {"type":($(".type").val()=="")?"venderGroup":$(".type").val()}).done(function (ret) {
            var submitFilterData = _.filter(ret, function (obj) {
                return obj.method == "提交"
            })
            var tradeFilterData = _.filter(ret, function (obj) {
                return obj.method == "成交"
            })

            ret.forEach(function (obj) {
                var method = obj.method
                if (method == "提交") {
                    submitDataMap.set(obj.name, {
                        "masterAccount": obj.masterAccountCnt,
                        "subAccount": obj.subAccountCnt
                    })
                } else if (method == "成交") {
                    tradeDataMap.set(obj.name, {"masterAccount": obj.masterAccountCnt, "subAccount": obj.subAccountCnt})
                }
            })
            if(isFirst){
                updateDashboard()
            }
        })
    }
    //getYesterdayCurrentTimeData(true)
    setInterval(getYesterdayCurrentTimeData, 1000 * 60 * 5);

    //该客户名下的门店数
    function getVenderShopCount(vender_parent_name) {
        var dfd = $.Deferred();
        if(vender_parent_name.length==0){
            dfd.resolve(undefined)
        }else {
            var query = {
                "vender_parent_name": vender_parent_name
            };
            requestURLPost(dataService + "/Vender2/getVenderShopCount", query).done(function (ret) {
                dfd.resolve(ret)
            });
        }
        return dfd.promise();
    }

    //汇总大字体数据
    var todayTradeStats= function () {
        var dataSet;
        if($(".type").val()=="all"||_.contains(groupIdInfo, -200)){
            dataSet = aijihuiTradeStats.find({sourceTypeName: "爱机汇"});
        }else{
            dataSet = aijihuiTradeStats.find({sourceTypeName: "爱机汇","venderGroupId":{$in:groupIdInfo}});
        }
        var tradeNum = 0;
        var tradeAmount = 0;
        var dealNum = 0;
        var dealAmount = 0;
        var junkTradeNum = 0;
        var junkTradeAmount = 0;
        var junkDealNum = 0;
        var junkDealAmount = 0;
        var date = "";
        var cancelTradeNum = 0;
        var cancelTradeAmount = 0;
        dataSet.forEach(function (e) {
            date = e.date;
            if (e.junkFlag == 0 ) {
                switch (e.orderType) {
                    case "submit":
                        tradeNum += e.tradeNum;
                        tradeAmount += e.payAmount;
                        break;
                    case "deal":
                        dealNum += e.tradeNum;
                        dealAmount += e.payAmount;
                        break;
                    default:
                        break;
                }
            } else if (e.junkFlag == 1) {
                switch (e.orderType) {
                    case "submit":
                        junkTradeNum += e.tradeNum;
                        junkTradeAmount += e.payAmount;
                        break;
                    case "deal":
                        junkDealNum += e.tradeNum;
                        junkDealAmount += e.payAmount;
                        break;
                    default:
                        break;
                }
            }

            if (e.orderCancel == 1) {
                switch (e.orderType) {
                    case "submit":
                        cancelTradeNum += e.tradeNum;
                        cancelTradeAmount += e.payAmount;
                        break;
                    default:
                        break;
                }
            }
        });
        $(".date").html(date);
        $(".tradeNum").html(tradeNum.toLocaleString());
        $(".tradeAmount").html("￥" + tradeAmount.toLocaleString());
        $(".dealNum").html(dealNum.toLocaleString());
        $(".dealAmount").html("￥" + dealAmount.toLocaleString());
        $(".junkTradeNum").html(junkTradeNum.toLocaleString());
        $(".totalTradeNum").html((tradeNum + junkTradeNum-cancelTradeNum).toLocaleString());
        $(".junkTradeAmount").html("￥" + junkTradeAmount.toLocaleString());
        $(".junkDealNum").html(junkDealNum.toLocaleString());
        $(".junkDealAmount").html("￥" + junkDealAmount.toLocaleString());
        $(".cancelTradeNum").html((-cancelTradeNum).toLocaleString());
        $(".cancelTradeAmount").html("￥" + (-cancelTradeAmount).toLocaleString());
    }

    //todayTradeStats();

    //提交订单用户分布
    var drawVenderTradeUserMixedChart = function (data) {
        var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
        var userMap = new Map();
        data.forEach(function (e) {
            if (e.junkFlag == 0 ) {
                if (userMap.get(e.sourceAgentName) == undefined) {
                    userMap.set(e.sourceAgentName, e.tradeNum)
                } else {
                    userMap.set(e.sourceAgentName, userMap.get(e.sourceAgentName) + e.tradeNum)
                }
            }
        });

        var labels = [];
        var barData = [];
        var pieData = [];

        var FMap = userMap;
        var tempMap = new Map();
        var tempValue = -1;
        var tempKey = -1;
        var i = 0;
        var count = 0;
        while (i < 20) {
            FMap.forEach(function (value1, key1) {
                if (value1 > tempValue) {
                    tempValue = value1;
                    tempKey = key1;
                }
            });
            if (tempValue == -1) {
                break;
            }
            i++;
            FMap.set(tempKey, -1);
            tempMap.set(tempKey, tempValue);
            tempValue = -1;
            tempKey = -1;
        }
        tempMap.forEach(function (value, key) {
            labels.push(key);
            barData.push({
                value: value,
                itemStyle: {
                    normal: {
                        color: colors[(count + 1) % 11]
                    }
                }
            });
            pieData.push({name: key, value: value});
            count++;
        });

        var xlabels = labels//.reverse();
        var promise = getVenderShopCount(xlabels);
        promise.done(function (ret) {
            if (ret != undefined) {
                ret.forEach(function (e) {
                    var count = 0;
                    while (e.vender_parent_name != xlabels[count] && count < 20) {
                        count++;
                    }
                    if (e.vender_parent_name == xlabels[count]) {
                        xlabels[count] = xlabels[count] + "(" + e.shop_num + ")"
                    }

                });
            }
        var option = {
            title: {
                text: '提交订单用户分布(top20)',
                left: 'center'
            },
            tooltip: {},

            calculable: true,
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            dataZoom: [{
                type: 'slider',
                show: true,
                zoomLock: true,
                handleSize: 8,
                showDetail: false,
                start: 60,
                end: 100,
                xAxisIndex: null,
                yAxisIndex: [0]
            }, {
                type: 'inside',
                zoomLock: true,
                start: 70,
                end: 100,
                xAxisIndex: null,
                yAxisIndex: [0]
            }],
            xAxis: [
                {
                    'type': 'value'
                }
            ],
            yAxis: [
                {
                    type: 'category',
                    'data': xlabels.reverse()
                }
            ],
            series: [
                {
                    name: '提交订单数',
                    type: 'bar',
                    label: {normal: {show: true, position: 'right', formatter: '{c}'}},
                    barMaxWidth: 100,
                    data: barData.reverse()
                }]
        };

        venderTradeUserMixedChart.setOption(option);
        });
        window.addEventListener('resize', venderTradeUserMixedChart.resize)
    };

    function cancelNum(dataMap){
        var num=0;
        dataMap.forEach(function(val,key){
            if(val==0){
                num++;
            }
        })
        return num
    }

    //提交订单城市分布
    var drawVenderTradeCityMixedChart = function (data,yesterdayDataMap) {
        var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
        var cityMap = new Map();

        cityMap.set("总体", 0);
        var totalTradeNum = 0;
        var cityAccountMap = new Map();
        cityAccountMap.set("总体", new Map());
        var citySubAccountMap = new Map();
        citySubAccountMap.set("总体", new Map());
        data.forEach(function (e) {
            if (e.junkFlag == 0 ) {
                if (cityMap.get(e.cityName) == undefined) {
                    cityMap.set(e.cityName, e.tradeNum);
                    cityAccountMap.set(e.cityName, new Map());
                    cityAccountMap.get(e.cityName).set(e.sourceAgentName, e.tradeNum);
                    citySubAccountMap.set(e.cityName, new Map());
                    citySubAccountMap.get(e.cityName).set(e.venderGroupId, e.tradeNum);

                    if (cityAccountMap.get("总体").get(e.sourceAgentName) == undefined){
                        cityAccountMap.get("总体").set(e.sourceAgentName, e.tradeNum);
                        citySubAccountMap.get("总体").set(e.venderGroupId, e.tradeNum);
                    }else{
                        cityAccountMap.get("总体").set(e.sourceAgentName, cityAccountMap.get(e.cityName).get(e.sourceAgentName) + e.tradeNum);
                        citySubAccountMap.get("总体").set(e.venderGroupId, citySubAccountMap.get(e.cityName).get(e.venderGroupId) + e.tradeNum);
                    }
                } else {
                    cityMap.set(e.cityName, cityMap.get(e.cityName) + e.tradeNum);

                    cityAccountMap.get(e.cityName).set(e.sourceAgentName, cityAccountMap.get(e.cityName).get(e.sourceAgentName) + e.tradeNum);
                    citySubAccountMap.get(e.cityName).set(e.venderGroupId, citySubAccountMap.get(e.cityName).get(e.venderGroupId) + e.tradeNum);

                    if (cityAccountMap.get("总体").get(e.sourceAgentName) == undefined){
                        cityAccountMap.get("总体").set(e.sourceAgentName, e.tradeNum);
                        citySubAccountMap.get("总体").set(e.venderGroupId, e.tradeNum);
                    }else{
                        cityAccountMap.get("总体").set(e.sourceAgentName, cityAccountMap.get(e.cityName).get(e.sourceAgentName) + e.tradeNum);
                        citySubAccountMap.get("总体").set(e.venderGroupId, citySubAccountMap.get(e.cityName).get(e.venderGroupId) + e.tradeNum);
                    }
                }
                totalTradeNum += e.tradeNum;
                cityMap.set("总体", totalTradeNum);
            }
        });

        var labels = [];
        var barData = [];
        var pieData = [];

        var FMap = cityMap;
        var tempMap = new Map();
        var tempValue = -1;
        var tempKey = -1;
        var i = 0;
        var count = 0;
        while (i >= 0) {
            FMap.forEach(function (value1, key1) {
                if (value1 > tempValue) {
                    tempValue = value1;
                    tempKey = key1;
                }
            });
            if (tempValue == -1) {
                break;
            }
            i++;
            FMap.set(tempKey, -1);
            tempMap.set(tempKey, tempValue);
            tempValue = -1;
            tempKey = -1;
        }
        tempMap.forEach(function (value, key) {
            var yesterdayObj = {}

            if (key == null) {
                yesterdayObj = yesterdayDataMap.get("其它")
            } else {
                yesterdayObj = yesterdayDataMap.get(key)
            }
            if (yesterdayObj) {
                labels.push(key + "[" + (cityAccountMap.get(key).size-cancelNum(cityAccountMap.get(key))) + "," + (citySubAccountMap.get(key).size-cancelNum(citySubAccountMap.get(key))) + "](" + yesterdayObj.masterAccount + "," + yesterdayObj.subAccount + ")");
            } else {

                labels.push(key + "[" + (cityAccountMap.get(key).size-cancelNum(cityAccountMap.get(key))) + "," + (citySubAccountMap.get(key).size-cancelNum(citySubAccountMap.get(key))) + "](0,0)");
            }
            //labels.push(key + "(" + cityAccountMap.get(key).size + "," + citySubAccountMap.get(key).size + ")");

            barData.push({
                value: value,
                itemStyle: {
                    normal: {
                        color: colors[(count + 1) % 11]
                    }
                }
            });
            pieData.push({name: key, value: value});
            count++;
        });

        var option = {
            title: {
                text: '提交订单城市分布',
                left: 'center'
            },
            tooltip: {},
            // legend: {
            //     data: labels
            // },
            calculable: true,
            dataZoom: [{
                type: 'slider',
                show: true,
                handleSize: 8,
                xAxisIndex: null,
                yAxisIndex: [0]
            }, {
                type: 'inside',
                xAxisIndex: null,
                yAxisIndex: [0]
            }],
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    'type': 'value'
                }
            ],
            yAxis: [
                {
                    type: 'category',
                    'data': labels.reverse()
                }
            ],
            series: [
                {
                    name: '提交订单数',
                    type: 'bar',
                    label: {normal: {show: true, position: 'right', formatter: '{c}'}},
                    barMaxWidth: 100,
                    data: barData.reverse()
                }]
        };

        venderTradeCityMixedChart.setOption(option);
        window.addEventListener('resize', venderTradeCityMixedChart.resize)
    };

    //提交订单品类分布
    var drawVenderTradeCategoryMixedChart = function (data) {
        var cityMap = new Map();
        data.forEach(function (e) {
            if (e.junkFlag == 0 ) {
                if (cityMap.get(e.categoryName) == undefined) {
                    cityMap.set(e.categoryName, e.tradeNum)
                } else {
                    cityMap.set(e.categoryName, cityMap.get(e.categoryName) + e.tradeNum)
                }
            }
        });

        var labels = [];
        var barData = [];
        var pieData = [];
        var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();

        var FMap = cityMap;
        var tempMap = new Map();
        var tempValue = -1;
        var tempKey = -1;
        var i = 0;
        var count = 0;
        while (i >= 0) {
            FMap.forEach(function (value1, key1) {
                if (value1 > tempValue) {
                    tempValue = value1;
                    tempKey = key1;
                }
            });
            if (tempValue == -1) {
                break;
            }
            i++;
            FMap.set(tempKey, -1);
            tempMap.set(tempKey, tempValue);
            tempValue = -1;
            tempKey = -1;
        }

        tempMap.forEach(function (value, key) {
            labels.push(key);
            barData.push({
                value: value,
                itemStyle: {
                    normal: {
                        color: colors[(count + 1) % 11]
                    }
                }
            });
            pieData.push({name: key, value: value});
            count++;
        });

        var option = {
            title: {
                text: '提交订单品类分布',
                top: '80%',
                left: 'center'
            },
            tooltip: {},
            // legend: {
            //     data: labels
            // },
            calculable: true,
            grid: {
                top: 80,
                bottom: 100
            },
            xAxis: [
                {
                    'type': 'category',
                    'data': labels
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '提交订单数',
                    type: 'bar',
                    label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                    barMaxWidth: 100,
                    data: barData
                }]
        };

        venderTradeCategoryMixedChart.setOption(option);
        window.addEventListener('resize', venderTradeCategoryMixedChart.resize)
    };

    //提交金额用户分布
    var drawVenderTradeAmountUserMixedChart = function (data) {
        var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
        var userMap = new Map();
        data.forEach(function (e) {
            if (e.junkFlag == 0 ) {
                if (userMap.get(e.sourceAgentName) == undefined) {
                    userMap.set(e.sourceAgentName, e.payAmount)
                } else {
                    userMap.set(e.sourceAgentName, userMap.get(e.sourceAgentName) + e.payAmount)
                }
            }
        });

        var labels = [];
        var barData = [];
        var pieData = [];

        var FMap = userMap;
        var tempMap = new Map();
        var tempValue = -1;
        var tempKey = -1;
        var i = 0;
        var count = 0;
        while (i < 20) {
            FMap.forEach(function (value1, key1) {
                if (value1 > tempValue) {
                    tempValue = value1;
                    tempKey = key1;
                }
            });
            if (tempValue == -1) {
                break;
            }
            i++;
            FMap.set(tempKey, -1);
            tempMap.set(tempKey, tempValue);
            tempValue = -1;
            tempKey = -1;
        }
        tempMap.forEach(function (value, key) {
            labels.push(key);
            barData.push({
                value: value,
                itemStyle: {
                    normal: {
                        color: colors[(count + 1) % 11]
                    }
                }
            });
            pieData.push({name: key, value: value});
            count++;
        });

        var xlabels = labels//.reverse();
        var promise = getVenderShopCount(xlabels);
        promise.done(function (ret) {
            if (ret != undefined) {
                ret.forEach(function (e) {
                    var count = 0;
                    while (e.vender_parent_name != xlabels[count] && count < 20) {
                        count++;
                    }
                    if (e.vender_parent_name == xlabels[count]) {
                        xlabels[count] = xlabels[count] + "(" + e.shop_num + ")"
                    }

                });
            }
            var option = {
                title: {
                    text: '提交金额用户分布(top20)',
                    left: 'center'
                },
                tooltip: {},
                // legend: {
                //     data: labels
                // },
                calculable: true,
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                dataZoom: [{
                    type: 'slider',
                    show: true,
                    zoomLock: true,
                    handleSize: 8,
                    showDetail: false,
                    start: 60,
                    end: 100,
                    xAxisIndex: null,
                    yAxisIndex: [0]
                }, {
                    type: 'inside',
                    zoomLock: true,
                    start: 70,
                    end: 100,
                    xAxisIndex: null,
                    yAxisIndex: [0]
                }],
                xAxis: [
                    {
                        'type': 'value'
                    }
                ],
                yAxis: [
                    {
                        type: 'category',
                        'data': xlabels.reverse()
                    }
                ],
                series: [
                    {
                        name: '提交金额',
                        type: 'bar',
                        label: {normal: {show: true, position: 'right', formatter: '{c}'}},
                        barMaxWidth: 100,
                        data: barData.reverse()
                    }]
            };

            venderTradeAmountUserMixedChart.setOption(option);
        });
        window.addEventListener('resize', venderTradeAmountUserMixedChart.resize)
    };

    //提交金额城市分布
    var drawVenderTradeAmountCityMixedChart = function (data,yesterdayDataMap) {
        var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
        var cityMap = new Map();


        cityMap.set("总体", 0);
        var totalTradeNum = 0;
        var cityAccountMap = new Map();
        cityAccountMap.set("总体", new Map());

        var citySubAccountMap = new Map();
        citySubAccountMap.set("总体", new Map());
        data.forEach(function (e) {
            if (e.junkFlag == 0 ) {
                if (cityMap.get(e.cityName) == undefined) {
                    cityMap.set(e.cityName, e.payAmount);
                    cityAccountMap.set(e.cityName, new Map());
                    cityAccountMap.get(e.cityName).set(e.sourceAgentName, e.payAmount);
                    citySubAccountMap.set(e.cityName, new Map());
                    citySubAccountMap.get(e.cityName).set(e.venderGroupId, e.payAmount);

                    if (cityAccountMap.get("总体").get(e.sourceAgentName) == undefined){
                        cityAccountMap.get("总体").set(e.sourceAgentName, e.payAmount);
                        citySubAccountMap.get("总体").set(e.venderGroupId, e.payAmount);
                    }else{
                        cityAccountMap.get("总体").set(e.sourceAgentName, cityAccountMap.get(e.cityName).get(e.sourceAgentName) + e.payAmount);
                        citySubAccountMap.get("总体").set(e.venderGroupId, citySubAccountMap.get(e.cityName).get(e.venderGroupId) + e.payAmount);
                    }
                } else {
                    cityMap.set(e.cityName, cityMap.get(e.cityName) + e.payAmount);

                    cityAccountMap.get(e.cityName).set(e.sourceAgentName, cityAccountMap.get(e.cityName).get(e.sourceAgentName) + e.payAmount);
                    citySubAccountMap.get(e.cityName).set(e.venderGroupId, citySubAccountMap.get(e.cityName).get(e.venderGroupId) + e.payAmount);

                    if (cityAccountMap.get("总体").get(e.sourceAgentName) == undefined){
                        cityAccountMap.get("总体").set(e.sourceAgentName, e.payAmount);
                        citySubAccountMap.get("总体").set(e.venderGroupId, e.payAmount);
                    }else{
                        cityAccountMap.get("总体").set(e.sourceAgentName, cityAccountMap.get(e.cityName).get(e.sourceAgentName) + e.payAmount);
                        citySubAccountMap.get("总体").set(e.venderGroupId, citySubAccountMap.get(e.cityName).get(e.venderGroupId) + e.payAmount);
                    }
                }

                totalTradeNum += e.payAmount;
                cityMap.set("总体", totalTradeNum);

            }
        });

        var labels = [];
        var barData = [];
        var pieData = [];

        var FMap = cityMap;
        var tempMap = new Map();
        var tempValue = -1;
        var tempKey = -1;
        var i = 0;
        var count = 0;
        while (i >= 0) {
            FMap.forEach(function (value1, key1) {
                if (value1 > tempValue) {
                    tempValue = value1;
                    tempKey = key1;
                }
            });
            if (tempValue == -1) {
                break;
            }
            i++;
            FMap.set(tempKey, -1);
            tempMap.set(tempKey, tempValue);
            tempValue = -1;
            tempKey = -1;
        }

        tempMap.forEach(function (value, key) {
            var yesterdayObj = {}

            if (key == null) {
                yesterdayObj = yesterdayDataMap.get("其它")
            } else {
                yesterdayObj = yesterdayDataMap.get(key)
            }
            if (yesterdayObj) {
                labels.push(key + "[" + (cityAccountMap.get(key).size-cancelNum(cityAccountMap.get(key))) + "," + (citySubAccountMap.get(key).size-cancelNum(citySubAccountMap.get(key))) + "](" + yesterdayObj.masterAccount + "," + yesterdayObj.subAccount + ")");
            } else {

                labels.push(key + "[" + (cityAccountMap.get(key).size-cancelNum(cityAccountMap.get(key))) + "," + (citySubAccountMap.get(key).size-cancelNum(citySubAccountMap.get(key))) + "](0,0)");
            }
            barData.push({
                value: value,
                itemStyle: {
                    normal: {
                        color: colors[(count + 1) % 11]
                    }
                }
            });
            pieData.push({name: key, value: value});
            count++;
        });

        var option = {
            title: {
                text: '提交金额城市分布',
                left: 'center'
            },
            tooltip: {},

            calculable: true,
            dataZoom: [{
                type: 'slider',
                show: true,
                handleSize: 8,
                xAxisIndex: null,
                yAxisIndex: [0]
            }, {
                type: 'inside',
                xAxisIndex: null,
                yAxisIndex: [0]
            }],
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    'type': 'value'
                }
            ],
            yAxis: [
                {
                    type: 'category',
                    'data': labels.reverse()
                }
            ],
            series: [
                {
                    name: '提交金额',
                    type: 'bar',
                    label: {normal: {show: true, position: 'right', formatter: '{c}'}},
                    barMaxWidth: 100,
                    data: barData.reverse()
                }]
        };

        venderTradeAmountCityMixedChart.setOption(option);
        window.addEventListener('resize', venderTradeAmountCityMixedChart.resize)
    };

    //提交金额品类分布
    var drawVenderTradeAmountCategoryMixedChart = function (data) {
        var cityMap = new Map();
        data.forEach(function (e) {
            if (e.junkFlag == 0 ) {
                if (cityMap.get(e.categoryName) == undefined) {
                    cityMap.set(e.categoryName, e.payAmount)
                } else {
                    cityMap.set(e.categoryName, cityMap.get(e.categoryName) + e.payAmount)
                }
            }
        });

        var labels = [];
        var barData = [];
        var pieData = [];
        var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();

        var FMap = cityMap;
        var tempMap = new Map();
        var tempValue = -1;
        var tempKey = -1;
        var i = 0;
        var count = 0;
        while (i >= 0) {
            FMap.forEach(function (value1, key1) {
                if (value1 > tempValue) {
                    tempValue = value1;
                    tempKey = key1;
                }
            });
            if (tempValue == -1) {
                break;
            }
            i++;
            FMap.set(tempKey, -1);
            tempMap.set(tempKey, tempValue);
            tempValue = -1;
            tempKey = -1;
        }

        tempMap.forEach(function (value, key) {
            labels.push(key);
            barData.push({
                value: value,
                itemStyle: {
                    normal: {
                        color: colors[(count + 1) % 11]
                    }
                }
            });
            pieData.push({name: key, value: value});
            count++;
        });

        var option = {
            title: {
                text: '提交金额品类分布',
                top: '80%',
                left: 'center'
            },
            tooltip: {},
            // legend: {
            //     data: labels
            // },
            calculable: true,
            grid: {
                top: 80,
                bottom: 100,
                containLabel:true
            },
            xAxis: [
                {
                    'type': 'category',
                    'data': labels
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '提交金额',
                    type: 'bar',
                    label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                    barMaxWidth: 100,
                    data: barData
                }]
        };

        venderTradeAmountCategoryMixedChart.setOption(option);
        window.addEventListener('resize', venderTradeAmountCategoryMixedChart.resize)
    };

    //成交订单用户分布
    var drawVenderTradeDealUserMixedChart = function (data) {
        var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
        var userMap = new Map();
        data.forEach(function (e) {
            if (e.junkFlag == 0) {
                if (userMap.get(e.sourceAgentName) == undefined) {
                    userMap.set(e.sourceAgentName, e.tradeNum)
                } else {
                    userMap.set(e.sourceAgentName, userMap.get(e.sourceAgentName) + e.tradeNum)
                }
            }
        });

        var labels = [];
        var barData = [];
        var pieData = [];

        var FMap = userMap;
        var tempMap = new Map();
        var tempValue = -1;
        var tempKey = -1;
        var i = 0;
        var count = 0;
        while (i < 10) {
            FMap.forEach(function (value1, key1) {
                if (value1 > tempValue) {
                    tempValue = value1;
                    tempKey = key1;
                }
            });
            if (tempValue == -1) {
                break;
            }
            i++;
            FMap.set(tempKey, -1);
            tempMap.set(tempKey, tempValue);
            tempValue = -1;
            tempKey = -1;
        }
        tempMap.forEach(function (value, key) {
            labels.push(key);
            barData.push({
                value: value,
                itemStyle: {
                    normal: {
                        color: colors[(count + 1) % 11]
                    }
                }
            });
            pieData.push({name: key, value: value});
            count++;
        });

        var xlabels = labels//.reverse();
        var promise = getVenderShopCount(xlabels);
        promise.done(function (ret) {
            if (ret != undefined) {
                ret.forEach(function (e) {
                    var count = 0;
                    while (e.vender_parent_name != xlabels[count] && count < 20) {
                        count++;
                    }
                    if (e.vender_parent_name == xlabels[count]) {
                        xlabels[count] = xlabels[count] + "(" + e.shop_num + ")"
                    }

                });
            }
            var option = {
                title: {
                    text: '成交订单用户分布(top10)',
                    left: 'center'
                },
                tooltip: {},

                calculable: true,
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        'type': 'value'
                    }
                ],
                yAxis: [
                    {
                        type: 'category',
                        'data': xlabels.reverse()
                    }
                ],
                series: [
                    {
                        name: '成交订单数',
                        type: 'bar',
                        label: {normal: {show: true, position: 'right', formatter: '{c}'}},
                        barMaxWidth: 100,
                        data: barData.reverse()
                    }]
            };

            venderTradeDealUserMixedChart.setOption(option);
        });
        window.addEventListener('resize', venderTradeDealUserMixedChart.resize)
    };

    //成交订单城市分布
    var drawVenderTradeDealCityMixedChart = function (data,yesterdayDataMap) {
        var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
        var cityMap = new Map();

        cityMap.set("总体", 0);
        var totalTradeNum = 0;
        var cityAccountMap = new Map();
        cityAccountMap.set("总体", new Map());
        var citySubAccountMap = new Map();
        citySubAccountMap.set("总体", new Map());
        data.forEach(function (e) {
            if (e.junkFlag == 0) {
                if (cityMap.get(e.cityName) == undefined) {
                    cityMap.set(e.cityName, e.tradeNum);
                    cityAccountMap.set(e.cityName, new Map());
                    cityAccountMap.get(e.cityName).set(e.sourceAgentName, e.tradeNum);
                    citySubAccountMap.set(e.cityName, new Map());
                    citySubAccountMap.get(e.cityName).set(e.venderGroupId, e.tradeNum);

                    if (cityAccountMap.get("总体").get(e.sourceAgentName) == undefined){
                        cityAccountMap.get("总体").set(e.sourceAgentName, e.tradeNum);
                        citySubAccountMap.get("总体").set(e.venderGroupId, e.tradeNum);
                    }else{
                        cityAccountMap.get("总体").set(e.sourceAgentName, cityAccountMap.get(e.cityName).get(e.sourceAgentName) + e.tradeNum);
                        citySubAccountMap.get("总体").set(e.venderGroupId, citySubAccountMap.get(e.cityName).get(e.venderGroupId) + e.tradeNum);
                    }
                } else {
                    cityMap.set(e.cityName, cityMap.get(e.cityName) + e.tradeNum);

                    cityAccountMap.get(e.cityName).set(e.sourceAgentName, cityAccountMap.get(e.cityName).get(e.sourceAgentName) + e.tradeNum);
                    citySubAccountMap.get(e.cityName).set(e.venderGroupId, citySubAccountMap.get(e.cityName).get(e.venderGroupId) + e.tradeNum);

                    if (cityAccountMap.get("总体").get(e.sourceAgentName) == undefined){
                        cityAccountMap.get("总体").set(e.sourceAgentName, e.tradeNum);
                        citySubAccountMap.get("总体").set(e.venderGroupId, e.tradeNum);
                    }else{
                        cityAccountMap.get("总体").set(e.sourceAgentName, cityAccountMap.get(e.cityName).get(e.sourceAgentName) + e.tradeNum);
                        citySubAccountMap.get("总体").set(e.venderGroupId, citySubAccountMap.get(e.cityName).get(e.venderGroupId) + e.tradeNum);
                    }
                }

                totalTradeNum += e.tradeNum;
                cityMap.set("总体", totalTradeNum);

            }
        });

        var labels = [];
        var barData = [];
        var pieData = [];

        var FMap = cityMap;
        var tempMap = new Map();
        var tempValue = -1;
        var tempKey = -1;
        var i = 0;
        var count = 0;
        while (i >= 0) {
            FMap.forEach(function (value1, key1) {
                if (value1 > tempValue) {
                    tempValue = value1;
                    tempKey = key1;
                }
            });
            if (tempValue == -1) {
                break;
            }
            i++;
            FMap.set(tempKey, -1);
            tempMap.set(tempKey, tempValue);
            tempValue = -1;
            tempKey = -1;
        }

        tempMap.forEach(function (value, key) {
            var yesterdayObj = {}

            if (key == null) {
                yesterdayObj = yesterdayDataMap.get("其它")
            } else {
                yesterdayObj = yesterdayDataMap.get(key)
            }
            if (yesterdayObj) {
                labels.push(key + "[" + (cityAccountMap.get(key).size-cancelNum(cityAccountMap.get(key))) + "," + (citySubAccountMap.get(key).size-cancelNum(citySubAccountMap.get(key))) + "](" + yesterdayObj.masterAccount + "," + yesterdayObj.subAccount + ")");
            } else {

                labels.push(key + "[" + (cityAccountMap.get(key).size-cancelNum(cityAccountMap.get(key))) + "," + (citySubAccountMap.get(key).size-cancelNum(citySubAccountMap.get(key))) + "](0,0)");
            }
            //labels.push(key + "(" + cityAccountMap.get(key).size + "," + citySubAccountMap.get(key).size + ")");
            barData.push({
                value: value,
                itemStyle: {
                    normal: {
                        color: colors[(count + 1) % 11]
                    }
                }
            });
            pieData.push({name: key, value: value});
            count++;
        });

        var option = {
            title: {
                text: '成交订单城市分布',
                left: 'center'
            },
            tooltip: {},
            // legend: {
            //     data: labels
            // },
            calculable: true,
            dataZoom: [{
                type: 'slider',
                show: true,
                handleSize: 8,
                xAxisIndex: null,
                yAxisIndex: [0]
            }, {
                type: 'inside',
                xAxisIndex: null,
                yAxisIndex: [0]
            }],
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    'type': 'value'
                }
            ],
            yAxis: [
                {
                    type: 'category',
                    'data': labels.reverse()
                }
            ],
            series: [
                {
                    name: '成交订单数',
                    type: 'bar',
                    label: {normal: {show: true, position: 'right', formatter: '{c}'}},
                    barMaxWidth: 100,
                    data: barData.reverse()
                }]
        };

        venderTradeDealCityMixedChart.setOption(option);
        window.addEventListener('resize', venderTradeDealCityMixedChart.resize)
    };

    //成交订单品类分布
    var drawVenderTradeDealCategoryMixedChart = function (data) {
        var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
        var categoryMap = new Map();
        data.forEach(function (e) {
            if (e.junkFlag == 0) {
                if (categoryMap.get(e.categoryName) == undefined) {
                    categoryMap.set(e.categoryName, e.tradeNum)
                } else {
                    categoryMap.set(e.categoryName, categoryMap.get(e.categoryName) + e.tradeNum)
                }
            }
        });
        var labels = [];
        var barData = [];
        var pieData = [];

        var FMap = categoryMap;
        var tempMap = new Map();
        var tempValue = -1;
        var tempKey = -1;
        var i = 0;
        var count = 0;
        while (i >= 0) {
            FMap.forEach(function (value1, key1) {
                if (value1 > tempValue) {
                    tempValue = value1;
                    tempKey = key1;
                }
            });
            if (tempValue == -1) {
                break;
            }
            i++;
            FMap.set(tempKey, -1);
            tempMap.set(tempKey, tempValue);
            tempValue = -1;
            tempKey = -1;
        }

        tempMap.forEach(function (value, key) {
            labels.push(key);
            barData.push({
                value: value,
                itemStyle: {
                    normal: {
                        color: colors[(count + 1) % 11]
                    }
                }
            });
            pieData.push({name: key, value: value});
            count++;
        });

        var option = {
            title: {
                text: '成交订单品类分布',
                top: '80%',
                left: 'center'
            },
            tooltip: {},

            calculable: true,
            grid: {
                top: 80,
                bottom: 100
            },
            xAxis: [
                {
                    'type': 'category',
                    'data': labels
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '成交订单数',
                    type: 'bar',
                    label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                    barMaxWidth: 100,
                    data: barData
                }]
        };

        venderTradeDealCategoryMixedChart.setOption(option);
        window.addEventListener('resize', venderTradeDealCategoryMixedChart.resize)
    };

    //成交金额用户分布
    var drawVenderTradeDealAmountUserMixedChart = function (data) {
        var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
        var userMap = new Map();
        data.forEach(function (e) {
            if (e.junkFlag == 0) {
                if (userMap.get(e.sourceAgentName) == undefined) {
                    userMap.set(e.sourceAgentName, e.payAmount)
                } else {
                    userMap.set(e.sourceAgentName, userMap.get(e.sourceAgentName) + e.payAmount)
                }
            }
        });
        var labels = [];
        var barData = [];
        var pieData = [];

        var FMap = userMap;
        var tempMap = new Map();
        var tempValue = -1;
        var tempKey = -1;
        var i = 0;
        var count = 0;
        while (i < 10) {
            FMap.forEach(function (value1, key1) {
                if (value1 > tempValue) {
                    tempValue = value1;
                    tempKey = key1;
                }
            });
            if (tempValue == -1) {
                break;
            }
            i++;
            FMap.set(tempKey, -1);
            tempMap.set(tempKey, tempValue);
            tempValue = -1;
            tempKey = -1;
        }
        tempMap.forEach(function (value, key) {
            labels.push(key);
            barData.push({
                value: value,
                itemStyle: {
                    normal: {
                        color: colors[(count + 1) % 11]
                    }
                }
            });
            pieData.push({name: key, value: value});
            count++;
        });

        var xlabels = labels//.reverse();
        var promise = getVenderShopCount(xlabels);
        promise.done(function (ret) {
            if (ret != undefined) {
                ret.forEach(function (e) {
                    var count = 0;
                    while (e.vender_parent_name != xlabels[count] && count < 20) {
                        count++;
                    }
                    if (e.vender_parent_name == xlabels[count]) {
                        xlabels[count] = xlabels[count] + "(" + e.shop_num + ")"
                    }

                });
            }
            var option = {
                title: {
                    text: '成交金额用户分布(top10)',
                    left: 'center'
                },
                tooltip: {},
                legend: {
                    data: labels
                },
                calculable: true,
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        'type': 'value'
                    }
                ],
                yAxis: [
                    {
                        type: 'category',
                        'data': xlabels.reverse()
                    }
                ],
                series: [
                    {
                        name: '成交金额',
                        type: 'bar',
                        label: {normal: {show: true, position: 'right', formatter: '{c}'}},
                        barMaxWidth: 100,
                        data: barData.reverse()
                    }]
            };

            venderTradeDealAmountUserMixedChart.setOption(option);
        });
        window.addEventListener('resize', venderTradeDealAmountUserMixedChart.resize)
    };

    //成交金额城市分布
    var drawVenderTradeDealAmountCityMixedChart = function (data,yesterdayDataMap) {
        var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
        var cityMap = new Map();

        cityMap.set("总体", 0);
        var totalTradeNum = 0;
        var cityAccountMap = new Map();
        cityAccountMap.set("总体", new Map());
        var citySubAccountMap = new Map();
        citySubAccountMap.set("总体", new Map());
        data.forEach(function (e) {
            if (e.junkFlag == 0) {
                if (cityMap.get(e.cityName) == undefined) {
                    cityMap.set(e.cityName, e.payAmount);
                    cityAccountMap.set(e.cityName, new Map());
                    cityAccountMap.get(e.cityName).set(e.sourceAgentName, e.payAmount);
                    citySubAccountMap.set(e.cityName, new Map());
                    citySubAccountMap.get(e.cityName).set(e.venderGroupId, e.payAmount);

                    if (cityAccountMap.get("总体").get(e.sourceAgentName) == undefined){
                        cityAccountMap.get("总体").set(e.sourceAgentName, e.payAmount);
                        citySubAccountMap.get("总体").set(e.venderGroupId, e.payAmount);
                    }else{
                        cityAccountMap.get("总体").set(e.sourceAgentName, cityAccountMap.get(e.cityName).get(e.sourceAgentName) + e.payAmount);
                        citySubAccountMap.get("总体").set(e.venderGroupId, citySubAccountMap.get(e.cityName).get(e.venderGroupId) + e.payAmount);
                    }
                } else {
                    cityMap.set(e.cityName, cityMap.get(e.cityName) + e.payAmount);

                    cityAccountMap.get(e.cityName).set(e.sourceAgentName, cityAccountMap.get(e.cityName).get(e.sourceAgentName) + e.payAmount);
                    citySubAccountMap.get(e.cityName).set(e.venderGroupId, citySubAccountMap.get(e.cityName).get(e.venderGroupId) + e.payAmount);

                    if (cityAccountMap.get("总体").get(e.sourceAgentName) == undefined){
                        cityAccountMap.get("总体").set(e.sourceAgentName, e.payAmount);
                        citySubAccountMap.get("总体").set(e.venderGroupId, e.payAmount);
                    }else{
                        cityAccountMap.get("总体").set(e.sourceAgentName, cityAccountMap.get(e.cityName).get(e.sourceAgentName) + e.payAmount);
                        citySubAccountMap.get("总体").set(e.venderGroupId, citySubAccountMap.get(e.cityName).get(e.venderGroupId) + e.payAmount);
                    }
                }

                totalTradeNum += e.payAmount;
                cityMap.set("总体", totalTradeNum);

            }
        });

        var labels = [];
        var barData = [];
        var pieData = [];

        var FMap = cityMap;
        var tempMap = new Map();
        var tempValue = -1;
        var tempKey = -1;
        var i = 0;
        var count = 0;
        while (i >= 0) {
            FMap.forEach(function (value1, key1) {
                if (value1 > tempValue) {
                    tempValue = value1;
                    tempKey = key1;
                }
            });
            if (tempValue == -1) {
                break;
            }
            i++;
            FMap.set(tempKey, -1);
            tempMap.set(tempKey, tempValue);
            tempValue = -1;
            tempKey = -1;
        }

        tempMap.forEach(function (value, key) {
            var yesterdayObj = {}

            if (key == null) {
                yesterdayObj = yesterdayDataMap.get("其它")
            } else {
                yesterdayObj = yesterdayDataMap.get(key)
            }
            if (yesterdayObj) {
                labels.push(key + "[" + (cityAccountMap.get(key).size-cancelNum(cityAccountMap.get(key))) + "," + (citySubAccountMap.get(key).size-cancelNum(citySubAccountMap.get(key))) + "](" + yesterdayObj.masterAccount + "," + yesterdayObj.subAccount + ")");
            } else {

                labels.push(key + "[" + (cityAccountMap.get(key).size-cancelNum(cityAccountMap.get(key))) + "," + (citySubAccountMap.get(key).size-cancelNum(citySubAccountMap.get(key))) + "](0,0)");
            }
            //labels.push(key + "(" + cityAccountMap.get(key).size + "," + citySubAccountMap.get(key).size + ")");
            barData.push({
                value: value,
                itemStyle: {
                    normal: {
                        color: colors[(count + 1) % 11]
                    }
                }
            });
            pieData.push({name: key, value: value});
            count++;
        });

        var option = {
            title: {
                text: '成交金额城市分布',
                left: 'center'
            },
            tooltip: {},
            legend: {
                data: labels
            },
            calculable: true,
            dataZoom: [{
                type: 'slider',
                show: true,
                handleSize: 8,
                xAxisIndex: null,
                yAxisIndex: [0]
            }, {
                type: 'inside',
                xAxisIndex: null,
                yAxisIndex: [0]
            }],
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    'type': 'value'
                }
            ],
            yAxis: [
                {
                    type: 'category',
                    'data': labels.reverse()
                }
            ],
            series: [
                {
                    name: '成交金额',
                    type: 'bar',
                    label: {normal: {show: true, position: 'right', formatter: '{c}'}},
                    barMaxWidth: 100,
                    data: barData.reverse()
                }]
        };

        venderTradeDealAmountCityMixedChart.setOption(option);
        window.addEventListener('resize', venderTradeDealAmountCityMixedChart.resize)
    };

    //成交金额品类分布
    var drawVenderTradeDealAmountCategoryMixedChart = function (data) {
        var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
        var categoryMap = new Map();
        data.forEach(function (e) {
            if (e.junkFlag == 0) {
                if (categoryMap.get(e.categoryName) == undefined) {
                    categoryMap.set(e.categoryName, e.payAmount)
                } else {
                    categoryMap.set(e.categoryName, categoryMap.get(e.categoryName) + e.payAmount)
                }
            }
        });
        var labels = [];
        var barData = [];
        var pieData = [];

        var FMap = categoryMap;
        var tempMap = new Map();
        var tempValue = -1;
        var tempKey = -1;
        var i = 0;
        var count = 0;
        while (i >= 0) {
            FMap.forEach(function (value1, key1) {
                if (value1 > tempValue) {
                    tempValue = value1;
                    tempKey = key1;
                }
            });
            if (tempValue == -1) {
                break;
            }
            i++;
            FMap.set(tempKey, -1);
            tempMap.set(tempKey, tempValue);
            tempValue = -1;
            tempKey = -1;
        }

        tempMap.forEach(function (value, key) {
            labels.push(key);
            barData.push({
                value: value,
                itemStyle: {
                    normal: {
                        color: colors[(count + 1) % 11]
                    }
                }
            });
            pieData.push({name: key, value: value});
            count++;
        });

        var option = {
            title: {
                text: '成交金额品类分布',
                top: '80%',
                left: 'center'
            },
            tooltip: {},
            legend: {
                data: labels
            },
            calculable: true,
            grid: {
                top: 80,
                bottom: 100,
                containLabel:true
            },
            xAxis: [
                {
                    'type': 'category',
                    'data': labels
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '成交金额',
                    type: 'bar',
                    label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                    barMaxWidth: 100,
                    data: barData
                }]
        };

        venderTradeDealAmountCategoryMixedChart.setOption(option);
        window.addEventListener('resize', venderTradeDealAmountCategoryMixedChart.resize)
    };

    var updateDashboard = function () {
        var submitData;
        if($(".type").val()=="all"||_.contains(groupIdInfo, -200)){
            submitData = aijihuiTradeStats.find({sourceTypeName: "爱机汇", orderType: "submit"});
        }else{
            submitData = aijihuiTradeStats.find({sourceTypeName: "爱机汇", orderType: "submit","venderGroupId":{$in:groupIdInfo}});
        }
        drawVenderTradeUserMixedChart(submitData);
        drawVenderTradeCityMixedChart(submitData,submitDataMap);
        drawVenderTradeCategoryMixedChart(submitData);
        drawVenderTradeAmountUserMixedChart(submitData);
        drawVenderTradeAmountCityMixedChart(submitData,submitDataMap);
        drawVenderTradeAmountCategoryMixedChart(submitData);

        var dealData;
        if($(".type").val()=="all"||_.contains(groupIdInfo, -200)){
            dealData = aijihuiTradeStats.find({sourceTypeName: "爱机汇", orderType: "deal"});
        }else{
            dealData = aijihuiTradeStats.find({sourceTypeName: "爱机汇", orderType: "deal","venderGroupId":{$in:groupIdInfo}});
        }

        drawVenderTradeDealUserMixedChart(dealData);
        drawVenderTradeDealCityMixedChart(dealData,tradeDataMap);
        drawVenderTradeDealCategoryMixedChart(dealData);
        drawVenderTradeDealAmountUserMixedChart(dealData);
        drawVenderTradeDealAmountCityMixedChart(dealData,tradeDataMap);
        drawVenderTradeDealAmountCategoryMixedChart(dealData);

        todayTradeStats();
    };

    //updateDashboard();

    Deps.autorun(function () {
        if (location.pathname.indexOf('VenderDashboard') > 0) {
            updateDashboard();
        }
        if (location.pathname.indexOf('aijihuiManagerDashboard') > 0) {
            updateDashboard();
        }
    });
    window.onresize = function () {
        venderTradeUserMixedChart.resize();
        venderTradeCategoryMixedChart.resize();
        venderTradeCityMixedChart.resize();
        venderTradeAmountUserMixedChart.resize();
        venderTradeAmountCategoryMixedChart.resize();
        venderTradeAmountCityMixedChart.resize();
        venderTradeDealAmountUserMixedChart.resize();
        venderTradeDealAmountCategoryMixedChart.resize();
        venderTradeDealAmountCityMixedChart.resize();
        venderTradeDealUserMixedChart.resize();
        venderTradeDealCategoryMixedChart.resize();
        venderTradeDealCityMixedChart.resize();
        venderTradeTrendMixedChart.resize()
    }

};

