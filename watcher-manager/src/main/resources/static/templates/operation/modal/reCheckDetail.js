Template.reCheckDetailTemplate.rendered = function(){
    var operationId = this.data.OperationCenter;
    requestURL(dataService + "/operationCenter/getReCheckCountPerHour", {"operationCenter":operationId}).done(function (data) {
        renderPage(data)
    });

};

function  renderPage(data){
    var option = {
        title: {
            text:'复检详细',
            //textAlign:"right"

        },
        animation: false,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        dataZoom:[
            {
                id: 'dataZoomY',
                type: 'slider',
                yAxisIndex: [0],
                filterMode: 'empty',
                startValue: 0,
                endValue: 25
            }
        ],
        grid: {
            /*left: '3%',
            right: '4%',
            bottom: '3%',*/
            containLabel: true
        },
        xAxis: [
            {
                type: 'value'
            }
        ],
        yAxis: [
            {
                type: 'category',
                axisTick: {show: true},
                "axisLabel":{
                    interval: 0
                },
                data: _.map(data,function(obj){return obj.name})
            }
        ],
        series: [
            {
                name: '复检详细',
                type: 'bar',
                stack: '总量',
                itemStyle: {
                    normal: {
                        label: {show: true, position: 'right'}
                    }
                },
                data: _.map(data,function(obj){return obj.value})
            },

        ]
    };
    var chart = document.getElementById('chart');
    var chartContainer = echarts.init(chart);
    chartContainer.setOption(option);
    //chart.style.width = window.innerWidth + 'px';
    //chart.style.height = window.innerHeight + 'px';
    window.onresize = function () {
       // chart.style.width = window.innerWidth + 'px';
        //chart.style.height = window.innerHeight + 'px';
        chartContainer.resize();
    };


}