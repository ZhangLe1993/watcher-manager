Template.outletsTradeDealByAreaReport.rendered = function () {
    outletsTradeDealByAreaReportChart = echarts.init(document.getElementById('outletsTradeDealByAreaReportChart'));
    drawOutletsTradeDealByAreaReportChart();
    // Deps.autorun(function () {
    //     if (location.pathname.indexOf('getOutletsTradeDealByArea') > 0) {
    //         drawOutletsTradeDealByAreaReportChart()
    //     }
    // })

    //大区门店城市订单数量
    outletsTradeDealByAreaReportChart.on("click",function(params){
        //console.log(params.name.split(":")[0])
        popModal("/getOutletsTradeDealByCity/"+params.name.split(":")[0])
    });
};

function drawOutletsTradeDealByAreaReportChart(){
    var dataSets = areaOutletsTradeDealStats.find({}, {sort: {tradeNum: -1}}).fetch();
    var tmp = _.groupBy(dataSets,function(obj){return obj.cityName})
    var labels = [];
    var xLabels = [];
    var barData = [];
    var pieData = [];
    var areaName = "";
    var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
    for(var key in tmp){
        if ((key != undefined) && (typeof key == 'string')) {
            var areaTmpName = ""
            var value = _.map(tmp[key], function (obj) {
                if(!areaTmpName){
                    areaTmpName = obj.areaName
                }
                return obj.tradeNum
            }).sum()

            labels.push(key);
            areaName =areaTmpName;
            xLabels.push(key+":"+ value);
            barData.push({
                value: value,
                itemStyle: {
                    normal: {
                        color: colors.pop()
                    }
                }
            });
            pieData.push({name: key, value: value})
        }
    }
    /*dataSets.forEach(function (e) {
     if ((e.cityName != undefined) && (typeof e.cityName == 'string')) {
     labels.push(e.cityName);
     areaName = e.areaName;
     xLabels.push(e.cityName+":"+ e.tradeNum);
     barData.push({
     value: e.tradeNum,
     itemStyle: {
     normal: {
     color: colors.pop()
     }
     }
     });
     pieData.push({name: e.cityName, value: e.tradeNum})
     }
     });*/
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
    outletsTradeDealByAreaReportChart.setOption(option)
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

function popModal(href){
    setTimeout(function(){
        $.fancybox.open([
            {
                type: 'iframe',
                href : href
            }
        ], {
            padding : 0,
            height: 600,
            minHeight   : 600,
            autoScale   : false,
            //fitToView: false,
            //autoSize: false,
            beforeShow:function(){
                this.height = 600;
            }
        });
    },500);
}