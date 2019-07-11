Template.VenderDashboard.helpers({
    todayTradeStats: function () {

        var dataSet = aijihuiTradeStats.find({ "sourceTypeName": "人人机" });

        var tradeNum = 0;
        var dealNum = 0;
        var dealAmount = 0;
        var date = "";
        dataSet.forEach(function (e) {
            date = e.date;
            switch (e.orderType) {
                case "submit":
                    tradeNum += e.tradeNum;
                    break;
                case "deal":
                    dealNum += e.tradeNum;
                    dealAmount += e.payAmount;
                    break;
                default:
                    break;
            }
        });
        return {
            date: date,
            tradeNum: tradeNum.toLocaleString(),
            dealNum: dealNum.toLocaleString(),
            dealAmount: "￥" + dealAmount.toLocaleString()
        }
    }
});

Template.VenderDashboard.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#VenderDashboardTab').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }
    var venderTradeCityMixedChart = echarts.init(document.getElementById('venderTradeCityMixedChart'));
    var venderTradeCategoryMixedChart = echarts.init(document.getElementById('venderTradeCategoryMixedChart'));
    var venderTradeDealCityMixedChart = echarts.init(document.getElementById('venderTradeDealCityMixedChart'));
    var venderTradeDealCategoryMixedChart = echarts.init(document.getElementById('venderTradeDealCategoryMixedChart'));
    var venderTradeDealAmountCityMixedChart = echarts.init(document.getElementById('venderTradeDealAmountCityMixedChart'));
    var venderTradeDealAmountCategoryMixedChart = echarts.init(document.getElementById('venderTradeDealAmountCategoryMixedChart'));


    var drawVenderTradeCityMixedChart = function (data) {
        var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
        var cityMap = new Map();
        data.forEach(function (e) {
            if (cityMap.get(e.cityName) == undefined) {
                cityMap.set(e.cityName, e.tradeNum)
            } else {
                cityMap.set(e.cityName, cityMap.get(e.cityName) + e.tradeNum)
            }
        });

        var labels = [];
        var barData = [];
        var pieData = [];
        var count = 0;
        cityMap.forEach(function (value, key) {
            labels.push(key);
            barData.push({
                value: value,
                itemStyle: {
                    normal: {
                        color: colors.pop()
                    }
                }
            });
            pieData.push({ name: key, value: value })
            count++;
        });

        var option = {
            title: {
                text: '提交订单城市分布',
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
                    label: { normal: { show: true, position: 'top', formatter: '{b}' } },
                    barMaxWidth: 100,
                    data: barData
                }]
        };

        venderTradeCityMixedChart.setOption(option);
        window.addEventListener('resize',venderTradeCityMixedChart.resize)
    };

    var drawVenderTradeCategoryMixedChart = function (data) {
        var cityMap = new Map();
        data.forEach(function (e) {
            if (cityMap.get(e.categoryName) == undefined) {
                cityMap.set(e.categoryName, e.tradeNum)
            } else {
                cityMap.set(e.categoryName, cityMap.get(e.categoryName) + e.tradeNum)
            }
        });

        var labels = [];
        var barData = [];
        var pieData = [];
        var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();

        cityMap.forEach(function (value, key) {
            labels.push(key);
            barData.push({
                value: value,
                itemStyle: {
                    normal: {
                        color: colors.pop()
                    }
                }
            });
            pieData.push({ name: key, value: value })
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
                    label: { normal: { show: true, position: 'top', formatter: '{b}' } },
                    barMaxWidth: 100,
                    data: barData
                }]
        };

        venderTradeCategoryMixedChart.setOption(option);
        window.addEventListener('resize',venderTradeCategoryMixedChart.resize)
    };

    var drawVenderTradeDealCityMixedChart = function (data) {
        var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
        var cityMap = new Map();
        data.forEach(function (e) {
            if (cityMap.get(e.cityName) == undefined) {
                cityMap.set(e.cityName, e.tradeNum)
            } else {
                cityMap.set(e.cityName, cityMap.get(e.cityName) + e.tradeNum)
            }
        });

        var labels = [];
        var barData = [];
        var pieData = [];

        cityMap.forEach(function (value, key) {
            labels.push(key);
            barData.push({
                value: value,
                itemStyle: {
                    normal: {
                        color: colors.pop()
                    }
                }
            });
            pieData.push({ name: key, value: value })
        });

        var option = {
            title: {
                text: '成交订单城市分布',
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
                    label: { normal: { show: true, position: 'top', formatter: '{b}' } },
                    barMaxWidth: 100,
                    data: barData
                }]
        };

        venderTradeDealCityMixedChart.setOption(option);
        window.addEventListener('resize',venderTradeDealCityMixedChart.resize)
    };

    var drawVenderTradeDealCategoryMixedChart = function (data) {
        var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
        var categoryMap = new Map();
        data.forEach(function (e) {
            if (categoryMap.get(e.categoryName) == undefined) {
                categoryMap.set(e.categoryName, e.tradeNum)
            } else {
                categoryMap.set(e.categoryName, categoryMap.get(e.categoryName) + e.tradeNum)
            }
        });
        var labels = [];
        var barData = [];
        var pieData = [];

        categoryMap.forEach(function (value, key) {
            labels.push(key);
            barData.push({
                value: value,
                itemStyle: {
                    normal: {
                        color: colors.pop()
                    }
                }
            });
            pieData.push({ name: key, value: value })
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
                    label: { normal: { show: true, position: 'top', formatter: '{b}' } },
                    barMaxWidth: 100,
                    data: barData
                }]
        };

        venderTradeDealCategoryMixedChart.setOption(option);
        window.addEventListener('resize',venderTradeDealCategoryMixedChart.resize)
    };

    var drawVenderTradeDealAmountCityMixedChart = function (data) {
        var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
        var cityMap = new Map();
        data.forEach(function (e) {
            if (cityMap.get(e.cityName) == undefined) {
                cityMap.set(e.cityName, e.payAmount)
            } else {
                cityMap.set(e.cityName, cityMap.get(e.cityName) + e.payAmount)
            }
        });
        var labels = [];
        var barData = [];
        var pieData = [];

        cityMap.forEach(function (value, key) {
            labels.push(key);
            barData.push({
                value: value,
                itemStyle: {
                    normal: {
                        color: colors.pop()
                    }
                }
            });
            pieData.push({ name: key, value: value })
        });

        var option = {
            title: {
                text: '成交金额城市分布',
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
                    name: '成交金额',
                    type: 'bar',
                    label: { normal: { show: true, position: 'top', formatter: '{b}' } },
                    barMaxWidth: 100,
                    data: barData
                }]
        };

        venderTradeDealAmountCityMixedChart.setOption(option);
        window.addEventListener('resize',venderTradeDealAmountCityMixedChart.resize)
    };

    var drawVenderTradeDealAmountCategoryMixedChart = function (data) {
        var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
        var categoryMap = new Map();
        data.forEach(function (e) {
            if (categoryMap.get(e.categoryName) == undefined) {
                categoryMap.set(e.categoryName, e.payAmount)
            } else {
                categoryMap.set(e.categoryName, categoryMap.get(e.categoryName) + e.payAmount)
            }
        });
        var labels = [];
        var barData = [];
        var pieData = [];

        categoryMap.forEach(function (value, key) {
            labels.push(key);
            barData.push({
                value: value,
                itemStyle: {
                    normal: {
                        color: colors.pop()
                    }
                }
            });
            pieData.push({ name: key, value: value })
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
                    label: { normal: { show: true, position: 'top', formatter: '{b}' } },
                    barMaxWidth: 100,
                    data: barData
                }/*, {
                 name: '成交订单金额城市占比',
                 type: 'pie',
                 center: ['75%', '30%'],
                 radius: '28%',
                 data: pieData
                 }*/]
        };

        venderTradeDealAmountCategoryMixedChart.setOption(option);
        window.addEventListener('resize',venderTradeDealAmountCategoryMixedChart.resize)
    };

    var updateDashboard = function () {
        var submitData = aijihuiTradeStats.find({sourceTypeName: "人人机",orderType: "submit"});
        drawVenderTradeCityMixedChart(submitData);
        drawVenderTradeCategoryMixedChart(submitData);

        var dealData = aijihuiTradeStats.find({sourceTypeName: "人人机",orderType: "deal"});

        drawVenderTradeDealCityMixedChart(dealData);
        drawVenderTradeDealCategoryMixedChart(dealData);
        drawVenderTradeDealAmountCityMixedChart(dealData);
        drawVenderTradeDealAmountCategoryMixedChart(dealData);
    };

    updateDashboard();

    Deps.autorun(function () {
        if (location.pathname.indexOf('VenderDashboard') > 0) {
            updateDashboard();
        }
    });
    window.onresize = function () {
        venderTradeCategoryMixedChart.resize();
        venderTradeCityMixedChart.resize();
        venderTradeDealAmountCategoryMixedChart.resize();
        venderTradeDealAmountCityMixedChart.resize();
        venderTradeDealCategoryMixedChart.resize();
        venderTradeDealCityMixedChart.resize();
    }

};

