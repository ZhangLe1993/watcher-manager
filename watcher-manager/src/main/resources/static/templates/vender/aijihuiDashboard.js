Template.aijihuiDashboard.rendered = function () {
    /*$('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#aijihuiDashboardTab').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }*/
    toolTipCustom()

    //昨日同时间
    var submitDataMap = new Map();
    var tradeDataMap = new Map();

    function getYesterdayCurrentTimeData() {
        requestURL(dataService + "/Vender/getVenderYesterdayCurrentTimeStats", {}).done(function (ret) {
            var submitFilterData = _.filter(ret, function (obj) {
                return obj.method == "提交"
            })
            var tradeFilterData = _.filter(ret, function (obj) {
                return obj.method == "成交"
            })
            //submitDataMap.set("全国", {
            //    "masterAccount": _.map(submitFilterData, function (obj) {
            //        return obj.masterAccountCnt
            //    }).sum(), "subAccount": _.map(submitFilterData, function (obj) {
            //        return obj.subAccountCnt
            //    }).sum()
            //})
            //tradeDataMap.set("全国", {
            //    "masterAccount": _.map(tradeFilterData, function (obj) {
            //        return obj.masterAccountCnt
            //    }).sum(), "subAccount": _.map(tradeFilterData, function (obj) {
            //        return obj.subAccountCnt
            //    }).sum()
            //})
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
            //console.log(submitDataMap)
            updateDashboard()
        })
    }

    getYesterdayCurrentTimeData();
    setInterval(getYesterdayCurrentTimeData, 1000 * 60 * 5);

    var venderTradeUserMixedChart = echarts.init(document.getElementById('venderTradeUserMixedChart'));
    var venderTradeProvinceMixedChart = echarts.init(document.getElementById('venderTradeProvinceMixedChart'));
    var venderTradeCategoryMixedChart = echarts.init(document.getElementById('venderTradeCategoryMixedChart'));
    var venderTradeAmountUserMixedChart = echarts.init(document.getElementById('venderTradeAmountUserMixedChart'));
    var venderTradeAmountProvinceMixedChart = echarts.init(document.getElementById('venderTradeAmountProvinceMixedChart'));
    var venderTradeAmountCategoryMixedChart = echarts.init(document.getElementById('venderTradeAmountCategoryMixedChart'));
    var venderTradeDealUserMixedChart = echarts.init(document.getElementById('venderTradeDealUserMixedChart'));
    var venderTradeDealProvinceMixedChart = echarts.init(document.getElementById('venderTradeDealProvinceMixedChart'));
    var venderTradeDealCategoryMixedChart = echarts.init(document.getElementById('venderTradeDealCategoryMixedChart'));
    var venderTradeDealAmountUserMixedChart = echarts.init(document.getElementById('venderTradeDealAmountUserMixedChart'));
    var venderTradeDealAmountProvinceMixedChart = echarts.init(document.getElementById('venderTradeDealAmountProvinceMixedChart'));
    var venderTradeDealAmountCategoryMixedChart = echarts.init(document.getElementById('venderTradeDealAmountCategoryMixedChart'));
    var venderTradeTrendMixedChart = echarts.init(document.getElementById("venderTradeTrendMixedChart"));

    // 处理点击事件并且条状到相应的页面
    venderTradeProvinceMixedChart.on('click', function (params) {
        if (params.name == "") {
            params.name = "上海";
        }

        var province = params.name.substring(0, params.name.indexOf("["))
        setTimeout(function () {
            $.fancybox.open([{
                "type": "iframe",
                "href": "/aijihuiCityDashboard/" + province
            }], {
                maxWidth: 1300,
                maxHeight: 700,
                fitToView: false,
                width: '100%',
                height: '100%',
                autoSize: false,
                closeClick: false,
                closeBtn: true,
                openEffect: 'elastic',
                closeEffect: 'elastic'
            })
        }, 500)

    });
    // 处理点击事件并且条状到相应的页面
    venderTradeAmountProvinceMixedChart.on('click', function (params) {
        if (params.name == "") {
            params.name = "上海";
        }
        setTimeout(function () {
                $.fancybox.open([{
                    "type": "iframe",
                    "href": "/aijihuiCityDashboard/" + params.name.substring(0, params.name.indexOf("["))
                }], {
                    maxWidth: 1300,
                    maxHeight: 700,
                    fitToView: false,
                    width: '100%',
                    height: '100%',
                    autoSize: false,
                    closeClick: false,
                    closeBtn: true,
                    openEffect: 'elastic',
                    closeEffect: 'elastic'
                })
            }
            , 500)

    });
    // 处理点击事件并且条状到相应的页面
    venderTradeDealProvinceMixedChart.on('click', function (params) {
        if (params.name == "") {
            params.name = "上海";
        }
        setTimeout(function () {
            $.fancybox.open([{
                "type": "iframe",
                "href": "/aijihuiCityDashboard/" + params.name.substring(0, params.name.indexOf("["))
            }], {
                maxWidth: 1300,
                maxHeight: 700,
                fitToView: false,
                width: '100%',
                height: '100%',
                autoSize: false,
                closeClick: false,
                closeBtn: true,
                openEffect: 'elastic',
                closeEffect: 'elastic'
            })
        }, 500)

    });
    // 处理点击事件并且条状到相应的页面
    venderTradeDealAmountProvinceMixedChart.on('click', function (params) {
        if (params.name == "") {
            params.name = "上海";
        }
        setTimeout(function () {
            $.fancybox.open([{
                "type": "iframe",
                "href": "/aijihuiCityDashboard/" + params.name.substring(0, params.name.indexOf("["))
            }], {
                maxWidth: 1300,
                maxHeight: 700,
                fitToView: false,
                width: '100%',
                height: '100%',
                autoSize: false,
                closeClick: false,
                closeBtn: true,
                openEffect: 'elastic',
                closeEffect: 'elastic'
            })
        }, 500);
    });

    //趋势图
    function getVenderAccumulateTrendOrder() {
        requestURL(dataService + "/Vender/getVenderAccumulateTrendOrder", {}).done(function (data) {
            var dateList = [], orderList = [], shopList = [], customerList = []
            data.forEach(function (obj) {
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
                    data: ["订单日活", "门店日活", "客户日活"],
                    padding: [50, 0, 0, 0]
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

    getVenderAccumulateTrendOrder()
    setInterval(getVenderAccumulateTrendOrder, 1000 * 60 * 5)


    function getVenderShopCount(vender_parent_name) {

        var dfd = $.Deferred();
        if (vender_parent_name.length == 0) {
            dfd.resolve(undefined)
        } else {
            var query = {
                "vender_parent_name": vender_parent_name,userId:userId
            };
            requestURLPost(dataService + "/Vender2/getVenderShopCount", query).done(function (ret) {
                dfd.resolve(ret)
            });
        }
        return dfd.promise();
    }

    //提交订单用户
    var drawVenderTradeUserMixedChart = function (data) {
        var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
        var tmpData = []
        var gdata = _.groupBy(_.filter(data.fetch(), function (obj) {
            return obj.junkFlag == 0
        }), function (obj) {
            return obj.sourceAgentName
        });
        for (var key in gdata) {
            var tmpObj = {
                name: key,
                value: _.map(gdata[key], function (obj) {
                    return obj.tradeNum
                }).sum()
            }
            tmpData.push(tmpObj)
        }
        var count = 0;
        var labels = [];
        var barData = [];
        var pieData = [];
        _.sortBy(tmpData, "value").slice(-20).forEach(function (obj) {
            labels.push(obj.name);
            barData.push({
                value: obj.value,
                itemStyle: {
                    normal: {
                        color: colors[(count + 1) % 11]
                    }
                }
            });
            pieData.push({name: obj.name, value: obj.value});
            count++;
        })
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
                tooltip: {
                    formatter: '{a}：{c}'
                },
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
                    start: 70,
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
                        'data': xlabels,
                        axisLabel: {
                            interval: 0
                        }
                    }
                ],
                series: [
                    {
                        name: '提交订单数',
                        type: 'bar',
                        label: {normal: {show: true, position: 'right', formatter: '{c}'}},
                        barMaxWidth: 100,
                        data: barData//.reverse()
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

    //提交订单省份
    var drawVenderTradeProvinceMixedChart = function (data, yesterdayDataMap) {
        var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
        var provinceMap = new Map();
        provinceMap.set("全国", 0);
        var totalTradeNum = 0;
        var provinceAccountMap = new Map();
        provinceAccountMap.set("全国", new Map());
        var provinceSubAccountMap = new Map();
        provinceSubAccountMap.set("全国", new Map());
        data.forEach(function (e) {
            if (e.junkFlag == 0) {
                if (provinceMap.get(e.provinceName) == undefined) {
                    provinceMap.set(e.provinceName, e.tradeNum);
                    provinceAccountMap.set(e.provinceName, new Map());
                    provinceAccountMap.get(e.provinceName).set(e.sourceAgentName, e.tradeNum);
                    provinceSubAccountMap.set(e.provinceName, new Map());
                    provinceSubAccountMap.get(e.provinceName).set(e.venderGroupId, e.tradeNum);

                    if (provinceAccountMap.get("全国").get(e.sourceAgentName) == undefined){
                        provinceAccountMap.get("全国").set(e.sourceAgentName, e.tradeNum);
                        provinceSubAccountMap.get("全国").set(e.venderGroupId, e.tradeNum);
                    }else{
                        provinceAccountMap.get("全国").set(e.sourceAgentName, provinceAccountMap.get(e.provinceName).get(e.sourceAgentName) + e.tradeNum);
                        provinceSubAccountMap.get("全国").set(e.venderGroupId, provinceSubAccountMap.get(e.provinceName).get(e.venderGroupId) + e.tradeNum);
                    }
                } else {
                    provinceMap.set(e.provinceName, provinceMap.get(e.provinceName) + e.tradeNum);

                    provinceAccountMap.get(e.provinceName).set(e.sourceAgentName, provinceAccountMap.get(e.provinceName).get(e.sourceAgentName) + e.tradeNum);
                    provinceSubAccountMap.get(e.provinceName).set(e.venderGroupId, provinceSubAccountMap.get(e.provinceName).get(e.venderGroupId) + e.tradeNum);

                    if (provinceAccountMap.get("全国").get(e.sourceAgentName) == undefined){
                        provinceAccountMap.get("全国").set(e.sourceAgentName, e.tradeNum);
                        provinceSubAccountMap.get("全国").set(e.venderGroupId, e.tradeNum);
                    }else{
                        provinceAccountMap.get("全国").set(e.sourceAgentName, provinceAccountMap.get(e.provinceName).get(e.sourceAgentName) + e.tradeNum);
                        provinceSubAccountMap.get("全国").set(e.venderGroupId, provinceSubAccountMap.get(e.provinceName).get(e.venderGroupId) + e.tradeNum);
                    }
                }

                totalTradeNum += e.tradeNum;
                provinceMap.set("全国", totalTradeNum);
            }
        });

        var labels = [];
        var barData = [];
        var pieData = [];

        var FMap = provinceMap;
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
                labels.push(key + "[" + (provinceAccountMap.get(key).size-cancelNum(provinceAccountMap.get(key))) + "," + (provinceSubAccountMap.get(key).size-cancelNum(provinceSubAccountMap.get(key))) + "](" + yesterdayObj.masterAccount + "," + yesterdayObj.subAccount + ")");
            } else {

                labels.push(key + "[" + (provinceAccountMap.get(key).size-cancelNum(provinceAccountMap.get(key))) + "," + (provinceSubAccountMap.get(key).size-cancelNum(provinceSubAccountMap.get(key))) + "](0,0)");
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
                text: '提交订单省份分布',
                left: 'center'
            },
            tooltip: {},
            calculable: true,
            dataZoom: [{
                type: 'slider',
                show: true,
                zoomLock: true,
                handleSize: 8,
                showDetail: false,
                start: 70,
                end: 100,
                xAxisIndex: null,
                yAxisIndex: [0]
            }, {
                type: 'inside',
                start: 70,
                end: 100,
                zoomLock: true,
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
                    'data': labels.reverse(),
                    axisLabel: {
                        interval: 0
                    }

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

        venderTradeProvinceMixedChart.setOption(option);
        window.addEventListener('resize', venderTradeProvinceMixedChart.resize)


    };

    //提交订单品类
    var drawVenderTradeCategoryMixedChart = function (data) {
        var cityMap = new Map();
        data.forEach(function (e) {
            if (e.junkFlag == 0) {
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

    //提交订单金额用户分布
    var drawVenderTradeAmountUserMixedChart = function (data) {
        var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
        var tmpData = []
        var gdata = _.groupBy(_.filter(data.fetch(), function (obj) {
            return obj.junkFlag == 0
        }), function (obj) {
            return obj.sourceAgentName
        });
        for (var key in gdata) {
            var tmpObj = {
                name: key,
                value: _.map(gdata[key], function (obj) {
                    return obj.payAmount
                }).sum()
            }
            tmpData.push(tmpObj)
        }
        var count = 0;
        var labels = [];
        var barData = [];
        var pieData = [];
        _.sortBy(tmpData, "value").slice(-20).forEach(function (obj) {
            labels.push(obj.name);
            barData.push({
                value: obj.value,
                itemStyle: {
                    normal: {
                        color: colors[(count + 1) % 11]
                    }
                }
            });
            pieData.push({name: obj.name, value: obj.value});
            count++;
        })
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
                tooltip: {
                    formatter: '{a}：{c}'
                },
                calculable: true,
                grid: {
                    left: '3%',
                    right: '50',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        'type': 'value',
                        axisLabel: {
                            show: false
                        }
                    }
                ],
                dataZoom: [{
                    type: 'slider',
                    show: true,
                    zoomLock: true,
                    handleSize: 8,
                    showDetail: false,
                    start: 70,
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
                yAxis: [
                    {
                        type: 'category',
                        'data': labels,//.reverse(),
                        axisLabel: {
                            interval: 0
                        }
                    }
                ],
                series: [
                    {
                        name: '提交金额',
                        type: 'bar',
                        label: {normal: {show: true, position: 'right', formatter: '{c}'}},
                        barMaxWidth: 100,
                        data: barData//.reverse()
                    }]
            };

            venderTradeAmountUserMixedChart.setOption(option);
        });
        window.addEventListener('resize', venderTradeAmountUserMixedChart.resize)
    };

    //提交金额省份分布
    var drawVenderTradeAmountProvinceMixedChart = function (data, yesterdayDataMap) {
        var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
        var provinceMap = new Map();
        provinceMap.set("全国", 0);
        var totalTradeAmount = 0;
        var provinceAccountMap = new Map();
        provinceAccountMap.set("全国", new Map());
        var provinceSubAccountMap = new Map();
        provinceSubAccountMap.set("全国", new Map());
        data.forEach(function (e) {
            if (e.junkFlag == 0) {
                if (provinceMap.get(e.provinceName) == undefined) {
                    provinceMap.set(e.provinceName, e.payAmount);
                    provinceAccountMap.set(e.provinceName, new Map());
                    provinceAccountMap.get(e.provinceName).set(e.sourceAgentName, e.payAmount);
                    provinceSubAccountMap.set(e.provinceName, new Map());
                    provinceSubAccountMap.get(e.provinceName).set(e.venderGroupId, e.payAmount);

                    if (provinceAccountMap.get("全国").get(e.sourceAgentName) == undefined){
                        provinceAccountMap.get("全国").set(e.sourceAgentName, e.payAmount);
                        provinceSubAccountMap.get("全国").set(e.venderGroupId, e.payAmount);
                    }else{
                        provinceAccountMap.get("全国").set(e.sourceAgentName, provinceAccountMap.get(e.provinceName).get(e.sourceAgentName) + e.payAmount);
                        provinceSubAccountMap.get("全国").set(e.venderGroupId, provinceSubAccountMap.get(e.provinceName).get(e.venderGroupId) + e.payAmount);
                    }
                } else {
                    provinceMap.set(e.provinceName, provinceMap.get(e.provinceName) + e.payAmount);

                    provinceAccountMap.get(e.provinceName).set(e.sourceAgentName, provinceAccountMap.get(e.provinceName).get(e.sourceAgentName) + e.payAmount);
                    provinceSubAccountMap.get(e.provinceName).set(e.venderGroupId, provinceSubAccountMap.get(e.provinceName).get(e.venderGroupId) + e.payAmount);

                    if (provinceAccountMap.get("全国").get(e.sourceAgentName) == undefined){
                        provinceAccountMap.get("全国").set(e.sourceAgentName, e.payAmount);
                        provinceSubAccountMap.get("全国").set(e.venderGroupId, e.payAmount);
                    }else{
                        provinceAccountMap.get("全国").set(e.sourceAgentName, provinceAccountMap.get(e.provinceName).get(e.sourceAgentName) + e.payAmount);
                        provinceSubAccountMap.get("全国").set(e.venderGroupId, provinceSubAccountMap.get(e.provinceName).get(e.venderGroupId) + e.payAmount);
                    }
                }
                //provinceAccountMap.get(e.provinceName).add(e.sourceAgentName);
                //provinceSubAccountMap.get(e.provinceName).add(e.venderGroupId);
                totalTradeAmount += e.payAmount;
                provinceMap.set("全国", totalTradeAmount);
                //provinceAccountMap.get("全国").add(e.sourceAgentName);
                //provinceSubAccountMap.get("全国").add(e.venderGroupId);
            }
        });

        var labels = [];
        var barData = [];
        var pieData = [];

        var FMap = provinceMap;
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
                labels.push(key + "[" + (provinceAccountMap.get(key).size-cancelNum(provinceAccountMap.get(key))) + "," + (provinceSubAccountMap.get(key).size-cancelNum(provinceSubAccountMap.get(key))) + "](" + yesterdayObj.masterAccount + "," + yesterdayObj.subAccount + ")");
            } else {

                labels.push(key + "[" + (provinceAccountMap.get(key).size-cancelNum(provinceAccountMap.get(key))) + "," + (provinceSubAccountMap.get(key).size-cancelNum(provinceSubAccountMap.get(key))) + "](0,0)");
            }
            //labels.push(key + "(" + provinceAccountMap.get(key).size + "," + provinceSubAccountMap.get(key).size + ")");
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
                text: '提交金额省份分布',
                left: 'center'
            },
            tooltip: {},
            calculable: true,
            dataZoom: [{
                type: 'slider',
                show: true,
                zoomLock: true,
                handleSize: 8,
                showDetail: false,
                start: 70,
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
            grid: {
                left: '3%',
                right: '50',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    'type': 'value',
                    axisLabel: {
                        show: false
                    }
                }
            ],
            yAxis: [
                {
                    type: 'category',
                    'data': labels.reverse(),
                    axisLabel: {
                        interval: 0
                    }
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

        venderTradeAmountProvinceMixedChart.setOption(option);
        window.addEventListener('resize', venderTradeAmountProvinceMixedChart.resize);


    };

    //提交金额品类
    var drawVenderTradeAmountCategoryMixedChart = function (data) {
        var cityMap = new Map();
        data.forEach(function (e) {
            if (e.junkFlag == 0) {
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
            calculable: true,
            grid: {
                top: 80,
                bottom: 100,
                containLabel: true
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

        var tmpData = []
        var gdata = _.groupBy(_.filter(data.fetch(), function (obj) {
            return obj.junkFlag == 0
        }), function (obj) {
            return obj.sourceAgentName
        });
        for (var key in gdata) {
            var tmpObj = {
                name: key,
                value: _.map(gdata[key], function (obj) {
                    return obj.tradeNum
                }).sum()
            }
            tmpData.push(tmpObj)
        }
        var count = 0;
        var labels = [];
        var barData = [];
        var pieData = [];
        _.sortBy(tmpData, "value").slice(-20).forEach(function (obj) {
            labels.push(obj.name);
            barData.push({
                value: obj.value,
                itemStyle: {
                    normal: {
                        color: colors[(count + 1) % 11]
                    }
                }
            });
            pieData.push({name: obj.name, value: obj.value});
            count++;
        })
        var xlabels = labels//.reverse();
        var promise = getVenderShopCount(xlabels);
        promise.done(function (ret) {
            if (ret != undefined) {
                var cnt = 0;
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
                    text: '成交订单用户分布(top20)',
                    left: 'center'
                },
                tooltip: {
                    formatter: '{a}：{c}'
                },

                calculable: true,
                grid: {
                    left: '3%',
                    right: '50',
                    bottom: '3%',
                    containLabel: true
                },
                dataZoom: [{
                    type: 'slider',
                    show: true,
                    zoomLock: true,
                    handleSize: 8,
                    showDetail: false,
                    start: 70,
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
                }], xAxis: [
                    {
                        'type': 'value'
                    }
                ],
                yAxis: [
                    {
                        type: 'category',
                        'data': labels,//.reverse(),
                        axisLabel: {
                            interval: 0
                        }
                    }
                ],
                series: [
                    {
                        name: '成交订单数',
                        type: 'bar',
                        label: {normal: {show: true, position: 'right', formatter: '{c}'}},
                        barMaxWidth: 100,
                        data: barData//.reverse()
                    }]
            };

            venderTradeDealUserMixedChart.setOption(option);
        });
        window.addEventListener('resize', venderTradeDealUserMixedChart.resize)
    };

    //成交订单省份分布
    var drawVenderTradeDealProvinceMixedChart = function (data, yesterdayDataMap) {
        var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
        var provinceMap = new Map();
        provinceMap.set("全国", 0);
        var totalTradeNum = 0;
        var provinceAccountMap = new Map();
        provinceAccountMap.set("全国", new Map());
        var provinceSubAccountMap = new Map();
        provinceSubAccountMap.set("全国", new Map());
        data.forEach(function (e) {
            if (e.junkFlag == 0) {
                if (provinceMap.get(e.provinceName) == undefined) {
                    provinceMap.set(e.provinceName, e.tradeNum);
                    provinceAccountMap.set(e.provinceName, new Map());
                    provinceAccountMap.get(e.provinceName).set(e.sourceAgentName, e.tradeNum);
                    provinceSubAccountMap.set(e.provinceName, new Map());
                    provinceSubAccountMap.get(e.provinceName).set(e.venderGroupId, e.tradeNum);

                    if (provinceAccountMap.get("全国").get(e.sourceAgentName) == undefined){
                        provinceAccountMap.get("全国").set(e.sourceAgentName, e.tradeNum);
                        provinceSubAccountMap.get("全国").set(e.venderGroupId, e.tradeNum);
                    }else{
                        provinceAccountMap.get("全国").set(e.sourceAgentName, provinceAccountMap.get(e.provinceName).get(e.sourceAgentName) + e.tradeNum);
                        provinceSubAccountMap.get("全国").set(e.venderGroupId, provinceSubAccountMap.get(e.provinceName).get(e.venderGroupId) + e.tradeNum);
                    }
                } else {
                    provinceMap.set(e.provinceName, provinceMap.get(e.provinceName) + e.tradeNum);

                    provinceAccountMap.get(e.provinceName).set(e.sourceAgentName, provinceAccountMap.get(e.provinceName).get(e.sourceAgentName) + e.tradeNum);
                    provinceSubAccountMap.get(e.provinceName).set(e.venderGroupId, provinceSubAccountMap.get(e.provinceName).get(e.venderGroupId) + e.tradeNum);

                    if (provinceAccountMap.get("全国").get(e.sourceAgentName) == undefined){
                        provinceAccountMap.get("全国").set(e.sourceAgentName, e.tradeNum);
                        provinceSubAccountMap.get("全国").set(e.venderGroupId, e.tradeNum);
                    }else{
                        provinceAccountMap.get("全国").set(e.sourceAgentName, provinceAccountMap.get(e.provinceName).get(e.sourceAgentName) + e.tradeNum);
                        provinceSubAccountMap.get("全国").set(e.venderGroupId, provinceSubAccountMap.get(e.provinceName).get(e.venderGroupId) + e.tradeNum);
                    }
                }

                totalTradeNum += e.tradeNum;
                provinceMap.set("全国", totalTradeNum);

            }
        });

        var labels = [];
        var barData = [];
        var pieData = [];

        var FMap = provinceMap;
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
                labels.push(key + "[" + (provinceAccountMap.get(key).size-cancelNum(provinceAccountMap.get(key))) + "," + (provinceSubAccountMap.get(key).size-cancelNum(provinceSubAccountMap.get(key))) + "](" + yesterdayObj.masterAccount + "," + yesterdayObj.subAccount + ")");
            } else {

                labels.push(key + "[" + (provinceAccountMap.get(key).size-cancelNum(provinceAccountMap.get(key))) + "," + (provinceSubAccountMap.get(key).size-cancelNum(provinceSubAccountMap.get(key))) + "](0,0)");
            }
            //labels.push(key + "(" + provinceAccountMap.get(key).size + "," + provinceSubAccountMap.get(key).size + ")");
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
                text: '成交订单省份分布',
                left: 'center'
            },
            tooltip: {},
            calculable: true,
            dataZoom: [{
                type: 'slider',
                show: true,
                zoomLock: true,
                start: 70,
                end: 100,
                showDetail: false,
                handleSize: 8,
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
                    'data': labels.reverse(),
                    axisLabel: {
                        interval: 0
                    }
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

        venderTradeDealProvinceMixedChart.setOption(option);
        window.addEventListener('resize', venderTradeDealProvinceMixedChart.resize)


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
        var tmpData = []
        var gdata = _.groupBy(_.filter(data.fetch(), function (obj) {
            return obj.junkFlag == 0
        }), function (obj) {
            return obj.sourceAgentName
        });
        for (var key in gdata) {
            var tmpObj = {
                name: key,
                value: _.map(gdata[key], function (obj) {
                    return obj.payAmount
                }).sum()
            }
            tmpData.push(tmpObj)
        }
        var count = 0;
        var labels = [];
        var barData = [];
        var pieData = [];
        _.sortBy(tmpData, "value").slice(-20).forEach(function (obj) {
            labels.push(obj.name);
            barData.push({
                value: obj.value,
                itemStyle: {
                    normal: {
                        color: colors[(count + 1) % 11]
                    }
                }
            });
            pieData.push({name: obj.name, value: obj.value});
            count++;
        })
        var xlabels = labels;
        var promise = getVenderShopCount(xlabels);
        promise.done(function (ret) {
            if (ret != undefined) {

                ret.forEach(function (e) {
                    var count = 0;
                    while (e.vender_parent_name != xlabels[count] && count < 20) {
                        count++;
                    }
                    if (e.vender_parent_name == xlabels[count]) {
                        var label = xlabels[count];
                        xlabels[count] = label + "(" + e.shop_num + ")"
                    }
                });
            }

            var option = {
                title: {
                    text: '成交金额用户分布(top20)',
                    left: 'center'
                },
                tooltip: {
                    formatter: '{a}：{c}'
                },

                calculable: true,
                grid: {
                    left: '3%',
                    right: '50',
                    bottom: '3%',
                    containLabel: true
                },
                dataZoom: [{
                    type: 'slider',
                    zoomLock: true,
                    show: true,
                    handleSize: 8,
                    showDetail: false,
                    start: 70,
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
                        'type': 'value',
                        axisLabel: {
                            show: false
                        }
                    }
                ],
                yAxis: [
                    {
                        type: 'category',
                        'data': labels,//.reverse(),
                        axisLabel: {
                            interval: 0
                        }
                    }
                ],
                series: [
                    {
                        name: '成交金额',
                        type: 'bar',
                        label: {normal: {show: true, position: 'right', formatter: '{c}'}},
                        barMaxWidth: 100,
                        data: barData//.reverse()
                    }]
            };

            venderTradeDealAmountUserMixedChart.setOption(option);
        });
        window.addEventListener('resize', venderTradeDealAmountUserMixedChart.resize)
    };

    //成交金额省份分布
    var drawVenderTradeDealAmountProvinceMixedChart = function (data, yesterdayDataMap) {
        var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
        var provinceMap = new Map();
        provinceMap.set("全国", 0);
        var totalTradeAmount = 0;
        var provinceAccountMap = new Map();
        provinceAccountMap.set("全国", new Map());
        var provinceSubAccountMap = new Map();
        provinceSubAccountMap.set("全国", new Map());
        data.forEach(function (e) {
            if (e.junkFlag == 0) {
                if (provinceMap.get(e.provinceName) == undefined) {
                    provinceMap.set(e.provinceName, e.payAmount);
                    provinceAccountMap.set(e.provinceName, new Map());
                    provinceAccountMap.get(e.provinceName).set(e.sourceAgentName, e.payAmount);
                    provinceSubAccountMap.set(e.provinceName, new Map());
                    provinceSubAccountMap.get(e.provinceName).set(e.venderGroupId, e.payAmount);

                    if (provinceAccountMap.get("全国").get(e.sourceAgentName) == undefined){
                        provinceAccountMap.get("全国").set(e.sourceAgentName, e.payAmount);
                        provinceSubAccountMap.get("全国").set(e.venderGroupId, e.payAmount);
                    }else{
                        provinceAccountMap.get("全国").set(e.sourceAgentName, provinceAccountMap.get(e.provinceName).get(e.sourceAgentName) + e.payAmount);
                        provinceSubAccountMap.get("全国").set(e.venderGroupId, provinceSubAccountMap.get(e.provinceName).get(e.venderGroupId) + e.payAmount);
                    }
                } else {
                    provinceMap.set(e.provinceName, provinceMap.get(e.provinceName) + e.payAmount);

                    provinceAccountMap.get(e.provinceName).set(e.sourceAgentName, provinceAccountMap.get(e.provinceName).get(e.sourceAgentName) + e.payAmount);
                    provinceSubAccountMap.get(e.provinceName).set(e.venderGroupId, provinceSubAccountMap.get(e.provinceName).get(e.venderGroupId) + e.payAmount);

                    if (provinceAccountMap.get("全国").get(e.sourceAgentName) == undefined){
                        provinceAccountMap.get("全国").set(e.sourceAgentName, e.payAmount);
                        provinceSubAccountMap.get("全国").set(e.venderGroupId, e.payAmount);
                    }else{
                        provinceAccountMap.get("全国").set(e.sourceAgentName, provinceAccountMap.get(e.provinceName).get(e.sourceAgentName) + e.payAmount);
                        provinceSubAccountMap.get("全国").set(e.venderGroupId, provinceSubAccountMap.get(e.provinceName).get(e.venderGroupId) + e.payAmount);
                    }
                }

                totalTradeAmount += e.payAmount;
                provinceMap.set("全国", totalTradeAmount);

            }
        });
        var labels = [];
        var barData = [];
        var pieData = [];

        var FMap = provinceMap;
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
                labels.push(key + "[" + (provinceAccountMap.get(key).size-cancelNum(provinceAccountMap.get(key))) + "," + (provinceSubAccountMap.get(key).size-cancelNum(provinceSubAccountMap.get(key))) + "](" + yesterdayObj.masterAccount + "," + yesterdayObj.subAccount + ")");
            } else {

                labels.push(key + "[" + (provinceAccountMap.get(key).size-cancelNum(provinceAccountMap.get(key))) + "," + (provinceSubAccountMap.get(key).size-cancelNum(provinceSubAccountMap.get(key))) + "](0,0)");
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
                text: '成交金额省份分布',
                left: 'center'
            },
            tooltip: {},

            calculable: true,
            dataZoom: [{
                type: 'slider',
                zoomLock: true,
                show: true,
                handleSize: 8,
                showDetail: false,
                start: 70,
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
            grid: {
                left: '3%',
                right: '50',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    'type': 'value',
                    axisLabel: {
                        show: false
                    }
                }
            ],
            yAxis: [
                {
                    type: 'category',
                    'data': labels.reverse(),
                    axisLabel: {
                        interval: 0
                    }
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

        venderTradeDealAmountProvinceMixedChart.setOption(option);
        window.addEventListener('resize', venderTradeDealAmountProvinceMixedChart.resize)


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

            calculable: true,
            grid: {
                top: 80,
                bottom: 100,
                containLabel: true
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

    function getYesterdayData() {
        var query = {};
        requestURL(dataService + "/Vender/getVenderYesterdayStats", query).done(function (ret) {
            var submit_order = ret[0].submit_order;
            var submit_price = ret[0].submit_price;
            var deal_order = ret[0].deal_order;
            var deal_price = ret[0].deal_price;
            $('#yesterdaySubmit').html("(昨日:" + submit_order.toString() + ")");
            $('#yesterdaySubmitPrice').html("(昨日:￥" + submit_price.toString() + ")");
            $('#yesterdayDealOrder').html("(昨日:" + deal_order.toString() + ")");
            $('#yesterdayDealPrice').html("(昨日:￥" + deal_price.toString() + ")");
        })
    }

    getYesterdayData()
    setInterval(getYesterdayData, 1000 * 60 * 5)


    var updateDashboard = function () {
        var submitData = aijihuiTradeStats.find({sourceTypeName: "爱机汇", orderType: "submit"});
        drawVenderTradeUserMixedChart(submitData);

        drawVenderTradeProvinceMixedChart(submitData, submitDataMap);

        drawVenderTradeCategoryMixedChart(submitData);
        drawVenderTradeAmountUserMixedChart(submitData);
        drawVenderTradeAmountProvinceMixedChart(submitData, submitDataMap);
        drawVenderTradeAmountCategoryMixedChart(submitData);

        var dealData = aijihuiTradeStats.find({sourceTypeName: "爱机汇", orderType: "deal"});
        drawVenderTradeDealUserMixedChart(dealData);
        drawVenderTradeDealProvinceMixedChart(dealData, tradeDataMap);
        drawVenderTradeDealCategoryMixedChart(dealData);
        drawVenderTradeDealAmountUserMixedChart(dealData);
        drawVenderTradeDealAmountProvinceMixedChart(dealData, tradeDataMap);
        drawVenderTradeDealAmountCategoryMixedChart(dealData);
    };

    //updateDashboard();

    // Deps.autorun(function () {
    //     if (location.pathname.indexOf('VenderDashboard') > 0) {
    //         updateDashboard();
    //     }
    //     if (location.pathname.indexOf('aijihuiDashboard') > 0) {
    //         updateDashboard();
    //     }
    // });
    window.onresize = function () {
        venderTradeUserMixedChart.resize();
        venderTradeCategoryMixedChart.resize();
        venderTradeProvinceMixedChart.resize();
        venderTradeAmountUserMixedChart.resize();
        venderTradeAmountCategoryMixedChart.resize();
        venderTradeAmountProvinceMixedChart.resize();
        venderTradeDealAmountUserMixedChart.resize();
        venderTradeDealAmountCategoryMixedChart.resize();
        venderTradeDealAmountProvinceMixedChart.resize();
        venderTradeDealUserMixedChart.resize();
        venderTradeDealCategoryMixedChart.resize();
        venderTradeDealProvinceMixedChart.resize();
        venderTradeTrendMixedChart.resize();
    }
};

var userId = getUserId();
