Template.AllExpressTradeDashboard.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operation').addClass('active');
    $("#operationDataAnalysis").addClass('active');
    $('#AllExpressTradeDashboardTab').addClass('active');

    if(isMobile()){
        $('.sidebar-toggle').click();
    }

    var realTimeAllExpressSourceTypeMixedChart = echarts.init(document.getElementById('realTimeAllExpressSourceTypeMixedChart'));

    var getSortOrder = function (prop) {
        return function (a, b) {
            if (a[prop] > b[prop]) {
                return -1;
            } else if (a[prop] < b[prop]) {
                return 1;
            }
            return 0;
        }
    };

    var drawRealTimeAllExpressSourceTypeMixedChart = function (ret) {

        var dataSets = expressSourceTypeTradeStats.find({}, {sort: {tradeNum: -1}}).fetch();
        var labels = [];
        var xLabels = [];
        var barData = [];
        var pieData = [];
        var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();

        var total = 0;

        dataSets.forEach(function (e) {
            labels.push(e.name);
            xLabels.push(e.name + ":" + e.tradeNum);
            barData.push({
                value: e.tradeNum,
                itemStyle: {
                    normal: {
                        color: colors.pop()
                    }
                }
            });
            pieData.push({name: e.name, value: e.tradeNum});
            total += e.tradeNum;
        });
        var option = {
            title: {
                text: '全渠道快递订单提交量:' + total
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
                    name: '提交订单数',
                    type: 'bar',
                    label: {normal: {show: true, position: 'top', formatter: '{b}'}},
                    data: barData
                }, {
                    name: '订单数渠道占比',
                    type: 'pie',
                    itemStyle: {
                        normal: {
                            borderWidth: 1
                        }
                    },
                    center: ['75%', '30%'],
                    radius: '28%',
                    data: pieData.sort(getSortOrder('value'))
                }]
        };

        realTimeAllExpressSourceTypeMixedChart.setOption(option);

    };

    // Deps.autorun(function () {
    //     if (location.pathname.indexOf('AllExpressTradeDashboard') > 0) {
    //         drawRealTimeAllExpressSourceTypeMixedChart();
    //         //yesterdayOrderCnt();
    //     }
    // });

    yesterdayOrderCnt();

    setInterval(function(){yesterdayOrderCnt()},1000*60*5);

    function yesterdayOrderCnt() {
        var promise = getYesterdayOrderCntInfo();
        promise.done(function (ret) {
            $("#yesterdayTradeReceiptCount").html("昨日同时间提交量:"+ret[0])
        });

    }

    function getYesterdayOrderCntInfo() {
        //clean parameters
        var dfd = $.Deferred();
        requestURL(dataService + "/operationCenter/getYesterdayExpressOrderCntInfo", {}).done(function (ret) {
            dfd.resolve(ret)
        })
        return dfd.promise()
    }

};

