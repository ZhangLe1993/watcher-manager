// Template.aijihuiCityDashboard.helpers({
//     todayTradeStats: function () {
//         var province=Template.currentData().provinceName;
//         var dataSet = aijihuiTradeStats.find({sourceTypeName:"爱机汇"});
//         var tradeNum = 0;
//         var tradeAmount = 0;
//         var dealNum = 0;
//         var dealAmount = 0;
//         var junkTradeNum = 0;
//         var junkTradeAmount = 0;
//         var junkDealNum = 0;
//         var junkDealAmount = 0;
//         var date = "";
//         var cancelTradeNum = 0;
//         var cancelTradeAmount = 0;
//         dataSet.forEach(function (e) {
//             date = e.date;
//             if (e.junkFlag == 0) {
//                 if(e.provinceName==province) {
//                     switch (e.orderType) {
//                         case "submit":
//                             tradeNum += e.tradeNum;
//                             tradeAmount += e.payAmount;
//                             break;
//                         case "deal":
//                             dealNum += e.tradeNum;
//                             dealAmount += e.payAmount;
//                             break;
//                         default:
//                             break;
//                     }
//                 }
//             } else if (e.junkFlag == 1) {
//                 if(e.provinceName==province) {
//                     switch (e.orderType) {
//                         case "submit":
//                             junkTradeNum += e.tradeNum;
//                             junkTradeAmount += e.payAmount;
//                             break;
//                         case "deal":
//                             junkDealNum += e.tradeNum;
//                             junkDealAmount += e.payAmount;
//                             break;
//                         default:
//                             break;
//                     }
//                 }
//             }

//             if (e.orderCancel == 1) {
//                 switch (e.orderType) {
//                     case "submit":
//                         cancelTradeNum += e.tradeNum;
//                         cancelTradeAmount += e.payAmount;
//                         break;
//                     default:
//                         break;
//                 }
//             }
//         });
//         return {
//             date: date,
//             tradeNum: tradeNum.toLocaleString(),
//             tradeAmount: tradeAmount.toLocaleString(),
//             dealNum: dealNum.toLocaleString(),
//             dealAmount: "￥" + dealAmount.toLocaleString(),
//             junkTradeNum: junkTradeNum.toLocaleString(),
//             junkTradeAmount: "￥" + junkTradeAmount.toLocaleString(),
//             junkDealNum: junkDealNum.toLocaleString(),
//             junkDealAmount: "￥" + junkDealAmount.toLocaleString(),
//             cancelTradeNum: (-cancelTradeNum).toLocaleString(),
//             cancelTradeAmount: "￥" + (-cancelTradeAmount).toLocaleString()
//         }
//     }
// });

var provinceName;
Template.aijihuiCityDashboard.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#aijihuiDashboardTab').addClass('active');

    provinceName=Template.currentData().provinceName;
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }
    var venderTradeCityMixedChart = echarts.init(document.getElementById('venderTradeCityMixedChart'));
    var venderTradeAmountCityMixedChart = echarts.init(document.getElementById('venderTradeAmountCityMixedChart'));
    var venderTradeDealCityMixedChart = echarts.init(document.getElementById('venderTradeDealCityMixedChart'));
    var venderTradeDealAmountCityMixedChart = echarts.init(document.getElementById('venderTradeDealAmountCityMixedChart'));

    //提交订单
    var drawVenderTradeCityMixedChart = function (data) {
        var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
        var cityMap = new Map();
        data.forEach(function (e) {
            if(e.junkFlag==0) {
                if (e.provinceName == provinceName) {
                    if (cityMap.get(e.cityName) == undefined) {
                        cityMap.set(e.cityName, e.tradeNum)
                    } else {
                        cityMap.set(e.cityName, cityMap.get(e.cityName) + e.tradeNum)
                    }
                }
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
            labels.push(key);
            barData.push({
                value: value,
                itemStyle: {
                    normal: {
                        color: colors[(count+1)%11]
                    }
                }
            });
            pieData.push({name: key, value: value});
            count++;
        });

        var option = {
            title: {
                text: '提交订单城市分布',
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

        venderTradeCityMixedChart.setOption(option);
        window.addEventListener('resize',venderTradeCityMixedChart.resize)
    };

    //提交金额
    var drawVenderTradeAmountCityMixedChart = function (data) {
        var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
        var cityMap = new Map();
        data.forEach(function (e) {
            if(e.junkFlag==0) {
                if (e.provinceName == provinceName) {
                    if (cityMap.get(e.cityName) == undefined) {
                        cityMap.set(e.cityName, e.payAmount)
                    } else {
                        cityMap.set(e.cityName, cityMap.get(e.cityName) + e.payAmount)
                    }
                }
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
            labels.push(key);
            barData.push({
                value: value,
                itemStyle: {
                    normal: {
                        color: colors[(count+1)%11]
                    }
                }
            });
            pieData.push({name: key, value: value});
            count++;
        });

        var option = {
            title: {
                text: '提交金额城市分布',
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
                    name: '提交金额',
                    type: 'bar',
                    label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                    barMaxWidth: 100,
                    data: barData
                }]
        };

        venderTradeAmountCityMixedChart.setOption(option);
        window.addEventListener('resize',venderTradeAmountCityMixedChart.resize)
    };

    //成交订单
    var drawVenderTradeDealCityMixedChart = function (data) {
        var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
        var cityMap = new Map();
        data.forEach(function (e) {
            if(e.junkFlag==0) {
                if (e.provinceName == provinceName) {
                    if (cityMap.get(e.cityName) == undefined) {
                        cityMap.set(e.cityName, e.tradeNum)
                    } else {
                        cityMap.set(e.cityName, cityMap.get(e.cityName) + e.tradeNum)
                    }
                }
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
            labels.push(key);
            barData.push({
                value: value,
                itemStyle: {
                    normal: {
                        color: colors[(count+1)%11]
                    }
                }
            });
            pieData.push({name: key, value: value});
            count++;
        });

        var option = {
            title: {
                text: '成交订单城市分布',
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

        venderTradeDealCityMixedChart.setOption(option);
        window.addEventListener('resize',venderTradeDealCityMixedChart.resize)
    };

    //成交金额
    var drawVenderTradeDealAmountCityMixedChart = function (data) {
        var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
        var cityMap = new Map();
        data.forEach(function (e) {
            if(e.junkFlag==0) {
                if (e.provinceName == provinceName) {
                    if (cityMap.get(e.cityName) == undefined) {
                        cityMap.set(e.cityName, e.payAmount)
                    } else {
                        cityMap.set(e.cityName, cityMap.get(e.cityName) + e.payAmount)
                    }
                }
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
            labels.push(key);
            barData.push({
                value: value,
                itemStyle: {
                    normal: {
                        color: colors[(count+1)%11]
                    }
                }
            });
            pieData.push({name: key, value: value});
            count++;
        });

        var option = {
            title: {
                text: '成交金额城市分布',
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
                    name: '成交金额',
                    type: 'bar',
                    label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                    barMaxWidth: 100,
                    data: barData
                }]
        };

        venderTradeDealAmountCityMixedChart.setOption(option);
        window.addEventListener('resize',venderTradeDealAmountCityMixedChart.resize)
    };

    var updateDashboard = function () {
        var submitData = aijihuiTradeStats.find({sourceTypeName: "爱机汇",orderType: "submit"});
        drawVenderTradeCityMixedChart(submitData);
        drawVenderTradeAmountCityMixedChart(submitData);

        var dealData = aijihuiTradeStats.find({sourceTypeName: "爱机汇",orderType: "deal"});
        drawVenderTradeDealCityMixedChart(dealData);
        drawVenderTradeDealAmountCityMixedChart(dealData);
    };

    updateDashboard();

    // Deps.autorun(function () {
    //     if (location.pathname.indexOf('aijihuiCityDashboard') > 0) {
    //         updateDashboard();
    //     }
    // });
    window.onresize=function(){
        venderTradeCityMixedChart.resize();
        venderTradeAmountCityMixedChart.resize();
        venderTradeDealAmountCityMixedChart.resize();
        venderTradeDealCityMixedChart.resize();
    }
};

