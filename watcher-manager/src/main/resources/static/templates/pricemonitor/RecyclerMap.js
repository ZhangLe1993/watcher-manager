Template.RecyclerMap.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#pricemonitor').addClass('active');
    $('#RecyclerMap').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    echarts.registerMap('china', chinaMap);

    var drawRecyclerCityDistributionGeoChart = function (dataSet) {

        var result = [];
        var max = 0;
        var totalSession = 0;

        dataSet.forEach(function (e) {
            var item = {name: e.cityName, value: [e.lot, e.lat, e.recyclerCount]};
            result.push(item);
            totalSession += e.recyclerCount;
            if (e.recyclerCount > max) {
                max = e.recyclerCount
            }
        });


        var getSymbolSize = function (value) {
            var size = Math.sqrt(Math.sqrt(parseFloat(value[2]) / parseFloat(max))) * 50;
            if (size < 3) {
                return 3
            } else {
                return parseInt(size)
            }
        };

        var option = {
            backgroundColor: '#404a59',
            title: {
                text: '全国回收商城市分布',
                left: 'center',
                textStyle: {
                    color: '#fff'
                }
            },
            tooltip: {
                trigger: 'item',
                formatter: function (params) {
                    return params.name + ' : ' + params.value[2].toLocaleString();
                }
            },
            legend: {
                orient: 'vertical',
                y: 'bottom',
                x: 'right',
                data: ['回收商数量'],
                textStyle: {
                    color: '#fff'
                }
            },
            geo: {
                map: 'china',
                label: {
                    emphasis: {
                        show: false
                    }
                },
                itemStyle: {
                    normal: {
                        areaColor: '#323c48',
                        borderColor: '#111'
                    },
                    emphasis: {
                        areaColor: '#2a333d'
                    }
                }
            },
            dataRange: {
                min: 0,
                max: max,
                calculable: true,
                color: ['#d94e5d', '#eac736', '#50a3ba'],
                textStyle: {
                    color: '#fff'
                }
            },
            series: [
                {
                    name: '回收商数量',
                    type: 'scatter',
                    coordinateSystem: 'geo',
                    data: result,
                    symbolSize: function (val) {
                        return getSymbolSize(val);
                    },
                    //symbolSize: 10,
                    hoverAnimation: false,
                    legendHoverLink: false,
                    label: {
                        normal: {
                            formatter: '{b}',
                            position: 'top',
                            show: true
                        },
                        emphasis: {
                            show: true
                        }
                    },
                    itemStyle: {
                        normal: {
                            color: '#ddb926',
                            opacity: 0.5
                        },
                        emphasis: {
                            shadowBlur: 10,
                            shadowColor: '#333',
                            opacity: 1
                        }
                    }
                }
            ]
        };

        var RecyclerCityDistributionGeoChart = echarts.init(document.getElementById('RecyclerCityDistributionGeoChart'));
        RecyclerCityDistributionGeoChart.setOption(option);
        window.addEventListener('resize', RecyclerCityDistributionGeoChart.resize);
    };

    var renderRecyclerMaintainerTable = function (data) {

        var table = $('#RecyclerMaintainerTable');
        var fixRow='"<tr style="background-color:#acc087 "", "data-index="0",">","<td>总数</td>","<td>-</td>", "<td>'+data["total"]+'</td>","</tr>"'
        table.bootstrapTable('destroy').bootstrapTable({
            fixRow:fixRow,
            data: data["data"],
            pagination: true,
            pageSize: 20,
            search: true,
            singleSelect: true
        });
    };

    var drawRecyclerCityDistributionPieChart = function (dataSet) {

        var result = [];

        dataSet.forEach(function (e) {
            if (result.length <= 15) {
                var pieItem = {name: e.cityName, value: e.recyclerCount};
                result.push(pieItem);
            } else {
                if (result[15] == undefined) {
                    result.push({name: '其他', value: e.recyclerCount})
                } else {
                    result[15] = {name: '其他', value: result[10].value + e.recyclerCount}
                }
            }
        });

        var option = {
            title: {
                text: '回收商城市分布',
                left: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            calculable: true,
            series: [
                {
                    name: '回收商数量',
                    type: 'pie',
                    radius: ['0%', '65%'],
                    center: ['50%', '60%'],
                    clockwise: true,
                    labelLine: {
                        normal: {
                            length: 5,
                            length2: 2
                        }
                    },
                    data: result
                }
            ]
        };
        var RecyclerCityDistributionPieChart = echarts.init(document.getElementById('RecyclerCityDistributionPieChart'));
        RecyclerCityDistributionPieChart.setOption(option);
        window.addEventListener('resize', RecyclerCityDistributionPieChart.resize);
    };


    var query = {};

    requestURL(dataService + "/recycler/getRecyclerCityStats", query).done(function (data) {
        drawRecyclerCityDistributionGeoChart(data);
        drawRecyclerCityDistributionPieChart(data);
    });

    requestURL(dataService + "/recycler/getRecyclerMaintainerStats", query).done(function (data) {
        var allData=getSum(data)
        renderRecyclerMaintainerTable(allData);
    });

};

function getSum(data){
    var sum=0
    data.forEach(function(e){
        sum+= e.recyclerCount;
    })

    return {"total":sum,"data":data}
}