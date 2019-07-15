Template.outletsTradeDealAmountByCityReport.rendered = function () {
    outletsTradeDealAmountByCityReportChart = echarts.init(document.getElementById('outletsTradeDealAmountByCityReportChart'));
    drawOutletsTradeDealAmountByCityReportChart();
    // Deps.autorun(function () {
    //     if (location.pathname.indexOf('getOndoorTradeDealAmountByCity') > 0) {
    //         drawOutletsTradeDealAmountByCityReportChart()
    //     }
    // })
};

function drawOutletsTradeDealAmountByCityReportChart(){
    var dataSets = areaOutletsTradeDealStats.find({}, {sort: {payAmount: -1}}).fetch();
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
            xLabels.push(e.shopName+":"+ e.payAmount);
            barData.push({
                value: e.payAmount,
                itemStyle: {
                    normal: {
                        color: colors.pop()
                    }
                }
            });
            pieData.push({name: e.shopName, value: e.payAmount})
        }
    });
    var option = {
        title: {
            text: cityName+'门店订单',
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
        xAxis: [
            {
                type: 'value',
                axisLabel: {
                    formatter: '￥{value}'
                }
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
                name: '提交订单金额',
                type: 'bar',
                label: {normal: {show: true, position: 'right', formatter: '￥{c}'}},
                barMaxWidth: 100,
                data: barData
            }]
    };
    outletsTradeDealAmountByCityReportChart.setOption(option)
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
