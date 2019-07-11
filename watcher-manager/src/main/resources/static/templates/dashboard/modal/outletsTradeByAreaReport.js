Template.outletsTradeByAreaReport.rendered = function () {
    outletsTradeByAreaReportChart = echarts.init(document.getElementById('outletsTradeByAreaReportChart'));
    drawOutletsTradeByAreaReportChart();
    Deps.autorun(function () {
        if (location.pathname.indexOf('getOutletsOrderByArea') > 0) {
            drawOutletsTradeByAreaReportChart()
        }
    })
};

function drawOutletsTradeByAreaReportChart(){
    var dataSets = outletsCityTradeStats.find({}, {sort: {tradeNum: -1}}).fetch();
    var labels = [];
    var xLabels = [];
    var barData = [];
    var pieData = [];
    var areaName = "";
    var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
    dataSets.forEach(function (e) {
     if ((e.city != undefined) && (typeof e.city == 'string')) {
         labels.push(e.city);
         areaName = e.area;
         xLabels.push(e.city+":"+ e.tradeNum);
         barData.push({
             value: e.tradeNum,
             itemStyle: {
                normal: {
                    color: colors.pop()
                 }
            }
         });
        pieData.push({name: e.city, value: e.tradeNum})
     }
    });
    var option = {
        title: {
            text: areaName+'门店订单',
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
                name: '订单数占比',
                type: 'pie',
                center: ['75%', '30%'],
                radius: '28%',
                data: pieData.sort(getSortOrder('value'))
            }]
    };
    outletsTradeByAreaReportChart.setOption(option)
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
