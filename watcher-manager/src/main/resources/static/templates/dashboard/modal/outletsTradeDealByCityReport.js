Template.outletsTradeDealByCityReport.rendered = function () {
    outletsTradeDealByCityReportChart = echarts.init(document.getElementById('outletsTradeDealByCityReportChart'));
    drawOutletsTradeDealByCityReportChart();
    // Deps.autorun(function () {
    //     if (location.pathname.indexOf('getOutletsTradeDealByCity') > 0) {
    //         drawOutletsTradeDealByCityReportChart()
    //     }
    // })
};

function drawOutletsTradeDealByCityReportChart(){
    var dataSets = areaOutletsTradeDealStats.find({}, {sort: {tradeNum: -1}}).fetch();
    var labels = [];
    var xLabels = [];
    var barData = [];
    var pieData = [];
    var cityName = "";
    var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
    dataSets.forEach(function (e) {
        if ((e.shopName != undefined) && (typeof e.shopName == 'string')) {
            labels.push(e.shopName);
            cityName = e.cityName;
            xLabels.push(e.shopName+":"+ e.tradeNum);
            barData.push({
                value: e.tradeNum,
                itemStyle: {
                    normal: {
                        color: colors.pop()
                    }
                }
            });
            pieData.push({name: e.shopName, value: e.tradeNum})
        }
    });
    var option = {
        title: {
            text: cityName+'门店订单',
            left: 'center'
        },
        tooltip: {},
        calculable: true,
        dataZoom: [{
            type: 'slider',
            show: true,
            startValue:0,
            endValue:19,
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
        legend: {
            data: labels
        },
        calculable: true,
        xAxis: [
            {
                'type': 'value'
            }
        ],
        yAxis: [
            {
                type: 'category',
                'data': labels
            }
        ],
        series: [
            {
                name: '提交订单数',
                type: 'bar',
                label: {normal: {show: true, position: 'right', formatter: '{c}'}},
                barMaxWidth: 100,
                data: barData
            }]
    };
    outletsTradeDealByCityReportChart.setOption(option)
}

function getSortOrder(prop) {
    return function (a, b) {
        if (a[prop] > b[prop]) {
            return -1;
        } else if (a[prop] < b[prop]) {
            return 1;
        }
        return 0;
    }
}
