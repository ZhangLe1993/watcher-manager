Template.liangpinTrade.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#liangpin').addClass('active');
    $('#liangpinTrade').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var updateStats = function () {
        requestURL(dataService + "/lianpin/getLiangpinTradeStatsYesterday", {}).done(function (data) {
            $('#tradeNumYesterday').html("昨日同时间:" + data.tradeNum.toLocaleString());
            $('#dealNumYesterday').html("昨日同时间:" + data.dealNum.toLocaleString());
            $('#dealAmountYesterday').html("昨日同时间:￥" + data.dealAmount.toLocaleString());
        });
        requestURL(dataService + "/lianpin/getLiangpinTradeStats", {}).done(function (data) {

            var total = {tradeNum: 0, dealNum: 0, dealAmount: 0};
            data.forEach(function (e) {
                total.tradeNum += e.tradeNum;
                total.dealNum += e.dealNum;
                total.dealAmount += e.dealAmount;
            });

            $('#tradeNum').text(total.tradeNum.toLocaleString());
            $('#dealNum').html(total.dealNum.toLocaleString());
            $('#dealAmount').html("￥" + total.dealAmount.toLocaleString());

            drawRealTimeLiangpinTradeTypeMixedChart(data);

        });

        requestURL(dataService + "/lianpin/getLiangpinTradeItemStats", {}).done(function (data) {

            drawRealTimeLiangpinTradeItemTypeMixedChart(data);

        });

        //实时订单数据的订单型号分布
        requestURL(dataService + "/lianpin/getLiangpinTradeTypeDistribute", {}).done(function (data) {
            drawRealTimeLiangpinTradeTypeDistributeChart(data)
        })

    };

    var realTimeLiangpinTradeTypeMixedChart = echarts.init(document.getElementById('realTimeLiangpinTradeTypeMixedChart'));
    var realTimeLiangpinTradeItemTypeMixedChart = echarts.init(document.getElementById('realTimeLiangpinTradeItemTypeMixedChart'));

    var realTimeLiangpinTradeTypeDistributeChart = echarts.init(document.getElementById('realTimeLiangpinTradeTypeDistributeChart'));

    var drawRealTimeLiangpinTradeTypeMixedChart = function (data) {

        var typeNames = [];
        var typeMNames = [];
        var tradeNum = [];
        var dealNum = [];
        var dealAmount = [];

        data.forEach(function (e) {
            typeNames.push(e.tradeType);

            typeMNames.push(e.tradeType.substring(0, Math.floor(e.tradeType.length/2))+"\n"+e.tradeType.substring(Math.floor(e.tradeType.length/2),e.tradeType.length));

            tradeNum.push(e.tradeNum);

            dealNum.push(e.dealNum);

            dealAmount.push(e.dealAmount);

        });

        var option = {
            title: {
                text: '订单类型分布',
                top: '90%',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: ['提交订单量', '成交订单量', '成交金额']
            },
            grid: {
                left: 0,
                right: 0,
                top: 80,
                bottom: 80,
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: isMobile()?typeMNames:typeNames,
                    axisLabel:{
                        interval:0
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value'
                },
                {
                    type: 'value',
                    axisLabel: {
                        formatter: function (value, index) {
                            if (value == 0) {
                                return value
                            }
                            return '￥' + value / 1000 + 'k'
                        }
                    }
                }
            ],
            series: [
                {
                    name: '提交订单量',
                    type: 'bar',
                    yAxisIndex: 0,
                    itemStyle: {
                        normal: {
                            label: {
                                show: true, position: 'top'
                            }
                        }
                    },
                    data: tradeNum
                },
                {
                    name: '成交订单量',
                    type: 'bar',
                    yAxisIndex: 0,
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                position: 'top'
                            }
                        }
                    },
                    data: dealNum
                },
                {
                    name: "成交金额",
                    type: 'bar',
                    yAxisIndex: 1,
                    itemStyle: {
                        normal: {
                            label: {
                                show: true, position: 'top',
                                formatter: '￥{c}'
                            }
                        }
                    },
                    data: dealAmount
                }
            ]
        };

        realTimeLiangpinTradeTypeMixedChart.setOption(option);
        window.addEventListener('resize', realTimeLiangpinTradeTypeMixedChart.resize)
    };

    var drawRealTimeLiangpinTradeItemTypeMixedChart = function (data) {

        var typeNames = [];

        var tradeNum = [];
        var dealNum = [];
        var dealAmount = [];


        data.forEach(function (e) {
            typeNames.push(e.tradeType);

            tradeNum.push(e.tradeNum);

            dealNum.push(e.dealNum);

            dealAmount.push(e.dealAmount);
        });


        var option = {
            title: {
                text: '物品类型分布',
                top: '90%',
                left: 'center'
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: ['提交物品数量', '成交物品量', '物品总金额']
            },
            grid: {
                left: 0,
                right: 0,
                top: 80,
                bottom: 80,
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: typeNames
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
                ,
                {
                    type: 'value',
                    axisLabel: {
                        formatter: function (value, index) {
                            if (value == 0) {
                                return value
                            }
                            return '￥' + value / 1000 + 'k'
                        }
                    }
                }
            ],
            series: [
                {
                    name: '提交物品数量',
                    type: 'bar',
                    yAxisIndex: 0,
                    itemStyle: {
                        normal: {
                            label: {
                                show: true, position: 'top'
                            }
                        }
                    },
                    data: tradeNum
                },
                {
                    name: '成交物品量',
                    type: 'bar',
                    yAxisIndex: 0,
                    itemStyle: {
                        normal: {
                            label: {
                                show: true,
                                position: 'top'
                            }
                        }
                    },
                    data: dealNum
                },
                {
                    name: "物品总金额",
                    type: 'bar',
                    yAxisIndex: 1,
                    itemStyle: {
                        normal: {
                            label: {
                                show: true, position: 'top',
                                formatter: '￥{c}'
                            }
                        }
                    },
                    data: dealAmount
                }
            ]
        };

        realTimeLiangpinTradeItemTypeMixedChart.setOption(option);
        window.addEventListener('resize', realTimeLiangpinTradeItemTypeMixedChart.resize)
    };

    var drawRealTimeLiangpinTradeTypeDistributeChart = function(data){
        var legendList = _.map(data,function(obj,key){return obj.name})
        //legendList.splice(legendList.length/2,0,"")
        var option = {
            title : {
                text: '订单型号分布(top 20)',
                top: 'bottom',
                left: 'center'
            },
            tooltip : {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                /*orient: 'vertical',
                left: 'left',*/

                data:legendList
            },
            series : [
                {
                    name: '型号',
                    type: 'pie',
                    radius : '60%',
                    //startAngle:92,
                    center: ['50%', '60%'],
                    data:data,
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        realTimeLiangpinTradeTypeDistributeChart.setOption(option);
        window.addEventListener('resize', realTimeLiangpinTradeTypeDistributeChart.resize)

    }

    updateStats();

};


