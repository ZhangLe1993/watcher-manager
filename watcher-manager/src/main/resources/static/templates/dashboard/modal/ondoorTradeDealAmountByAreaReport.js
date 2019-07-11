Template.ondoorTradeDealAmountByAreaReport.rendered = function () {
    ondoorTradeDealAmountByAreaReportChart = echarts.init(document.getElementById('ondoorTradeDealAmountByAreaReportChart'));
    drawOndoorTradeDealAmountByAreaReportChart();
    Deps.autorun(function () {
        if (location.pathname.indexOf('getOndoorTradeDealAmountByArea') > 0) {
            drawOndoorTradeDealAmountByAreaReportChart()
        }
    })
};

function drawOndoorTradeDealAmountByAreaReportChart(){
    var dataSets = areaOndoorTradeDealStats.find({}, {sort: {payAmount: -1}}).fetch();
    var labels = [];
    var xLabels = [];
    var barData = [];
    var pieData = [];
    var areaName = "";
    var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
    dataSets.forEach(function (e) {
        if ((e.cityName != undefined) && (typeof e.cityName == 'string')) {
            labels.push(e.cityName);
            areaName = e.areaName;
            xLabels.push(e.cityName+":"+ e.payAmount);
            barData.push({
                value: e.payAmount,
                itemStyle: {
                    normal: {
                        color: colors.pop()
                    }
                }
            });
            pieData.push({name: e.cityName, value: e.payAmount})
        }
    });
    var option = {
        title: {
            text: areaName+'上门订单',
            top: 'bottom',
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
                'data': xLabels,
                'axisLabel': {'interval': 0},
                splitLine: {show: false}
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel: {
                    formatter: '￥{value}'
                }
            }
        ],
        series: [
            {
                name: '订单成交额',
                type: 'bar',
                label: {normal: {show: true, position: 'top', formatter: '￥{c}'}},
                data: barData
            }, {
                name: '成交额渠道占比',
                type: 'pie',
                center: ['75%', '30%'],
                radius: '28%',
                data: pieData.sort(getSortOrder('value'))
            }]
    };
    ondoorTradeDealAmountByAreaReportChart.setOption(option)
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
