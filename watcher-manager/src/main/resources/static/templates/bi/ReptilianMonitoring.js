Template.ReptilianMonitoring.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#BITab').addClass('active');
    $('#ReptilianMonitoring').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }
    //drawPage();
};


var drawPage = function(){
    requestURL(dataService + "/bi/getReptilianMonitoring", {endDate:new Date().getNewDate(-15)}).done(function (data) {
        console.log(data);

        var resMap = _.groupBy(data,'source');
        console.log(resMap);

        var legendData = _.keys(resMap);
        console.log(legendData);

        var series = [];

        var dateArr = _.sortBy(_.uniq(_.pluck(data,'day')),function(item){return item});
        console.log(dateArr);
        _.each(resMap,function(value,key){
            //var tempDateArr = [];
            var tempCounterArr = [];
            var tempMap = new Map();
            var tempDateArr = [];

            _.each(value,function(ele){
                //tempDateArr.push(ele.day);
                tempMap.set(ele.day,ele.counter);
                tempDateArr.push(ele.day);
                //tempCounterArr.push(ele.counter);
            });
            _.each(dateArr,function(ele){
                if(tempDateArr.contains(ele)){
                    tempCounterArr.push(tempMap.get(ele));
                }else{
                    tempCounterArr.push(0);
                }
            });
            series.push({
                name: key,
                type: 'line',
                label: {
                    normal: {
                        show: true
                    }
                },
                lineStyle: {
                    normal: {
                        type: 'solid'
                    }
                },
                data: tempCounterArr
            })
        });

        drawReptilianMonitoringChart(legendData,series,dateArr);

    });
};

var drawReptilianMonitoringChart = function(legendData,series,dateArr){
    var option = {
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            bottom: '30%'
        },
        legend: {
            data: legendData
        },
        dataZoom: [
            {
                type: 'slider',
                start: 30,
                end: 100,
                bottom: '10%'
            }
        ],
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: dateArr
            }
        ],
        yAxis: [
            {
                type: 'value'
            },
            {
                type: 'value',
                axisLabel: {
                    formatter: function (value, index) {
                        if (value == 0) {
                            return value
                        }
                        return value + "%"
                    }
                }
            }
        ],
        animationDuration: 2000,
        series: series
    };
    var reptilianMonitoringChart = echarts.init(document.getElementById('reptilianMonitoringChart'));
    reptilianMonitoringChart.setOption(option);
    window.addEventListener('resize',reptilianMonitoringChart.resize);
};
