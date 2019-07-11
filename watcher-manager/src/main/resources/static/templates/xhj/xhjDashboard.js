

Template.xhjDashboardMonitor.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#AzpTab').addClass('active');
    $('#xhjDashboardTab').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    renderPage()
    //setInterval(renderPage,1000*60*10)


};

function renderPage(){
    drawRealTimeDataChart()
}

function drawRealTimeDataChart(){
    requestURL(dataService+"/xhj/getXHJRealTimeData",{}).done(function(data){
        var labelList=[],avaliableList=[],saleList=[]
        _.sortBy(data,function(obj){return obj.saleCnt}).forEach(function(obj){
            labelList.push(obj.name)
            avaliableList.push(obj.availableCnt)
            saleList.push(obj.saleCnt)
        })
        var option = {
            title: {
                text: '实时订单',
                left: 'center'
            },
            tooltip: {
                formatter: '{a}：{c}'
            },
             legend: {
                 data: ["可用数量","销售数量"],
                 padding:[50,0,0,0]
             },
            calculable: true,
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            dataZoom: [{
                type: 'slider',
                show: true,
                zoomLock: true,
                handleSize: 8,
                showDetail: false,
                start: 30,
                end: 100,
                xAxisIndex: null,
                yAxisIndex: [0]
            }, {
                type: 'inside',
                zoomLock: true,
                start: 70,
                end: 100,
                xAxisIndex: null,
                yAxisIndex: [0]
            }],
            xAxis: [
                {
                    'type': 'value'

                }
            ],
            yAxis: [
                {
                    type: 'category',
                    'data': labelList,
                    axisLabel: {
                        interval: 0
                    }
                }
            ],
            series: [
                {
                    name: '可用数量',
                    type: 'bar',
                    label: {normal: {show: true, position: 'right', formatter: '{c}'}},
                    barMaxWidth: 100,
                    data: avaliableList
                },
                {
                    name: '销售数量',
                    type: 'bar',
                    label: {normal: {show: true, position: 'right', formatter: '{c}'}},
                    barMaxWidth: 100,
                    data: saleList
                }]
        };
        var realTimeDataChart=echarts.init(document.getElementById("xhjRealTimeMixedChart"))
        realTimeDataChart.setOption(option);
    })
}
