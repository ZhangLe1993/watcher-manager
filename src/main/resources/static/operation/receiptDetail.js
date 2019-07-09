Template.receiptDetail.rendered = function () {

    realTimeSourceTypeReceiptChart = echarts.init(document.getElementById('realTimeSourceTypeReceiptChart'));
    drawRealTimeSourceTypeReceiptChart();
    Deps.autorun(function () {
        if (location.pathname.indexOf('receiptDetail') > 0) {
            drawRealTimeSourceTypeReceiptChart();
        }
    })
};

function drawRealTimeSourceTypeReceiptChart() {
    var dataSets = operationStats.find({type: 'sourceTypeReceipt'}, {sort: {count: -1}}).fetch();
    var labels = [];
    var barData = [];
    var barAmountData = [];
    var totalCount = 0;
    var totalAmount = 0;
    dataSets.forEach(function (e) {
        labels.push(e.sourceTypeName);
        barData.push({
            value: e.count
        });
        totalCount += e.count;
        barAmountData.push({
            value: e.amount
        });
        totalAmount += e.amount;
    });
    var option = {
        title: {
            text: '渠道来源',
            subtext: "总收货量：" + totalCount.toLocaleString() + " ,总收货金额：￥" + totalAmount.toLocaleString(),
            subtextStyle: {
                color: '#333',
                fontStyle: 'normal',
                fontWeight: 'bold'
            }
        },
        tooltip: {},
        legend: {
            data: ['确认收货数', '确认收货金额']
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
            }, {
                type: 'value',
                axisLabel: {
                    formatter: '￥{value}'
                }
            }
        ],
        series: [
            {
                name: '确认收货数',
                type: 'bar',
                label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                data: barData
            },
            {
                name: '确认收货金额',
                type: 'bar',
                yAxisIndex: 1,
                label: {normal: {show: true, position: 'top', formatter: '￥{c}'}},
                data: barAmountData
            }]
    };

    realTimeSourceTypeReceiptChart.setOption(option);
    window.addEventListener('resize',realTimeSourceTypeReceiptChart.resize)
}