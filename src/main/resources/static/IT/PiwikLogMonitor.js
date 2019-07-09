Template.PiwikLogMonitor.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#ITTab').addClass('active');
    $('#PiwikMonitorTab').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }
    var hostSelect = $('#hostSelect');
    hostSelect.select2();
    var pageSelect = $('#pageSelect');
    pageSelect.select2();
    var minuteSelect = $('#minuteSelect');
    minuteSelect.select2();

    var hostStatusChart = echarts.init(document.getElementById('hostStatusChart'));
    var hostPageTimeChart = echarts.init(document.getElementById('hostPageTimeChart'));
    var hostPageTimeAvgChart = echarts.init(document.getElementById('hostPageTimeAvgChart'));

    var drawHostStatusChart = function (data) {

        var count20X = [];
        var count30X = [];
        var count40X = [];
        var count50X = [];

        var times = [];

        data.forEach(function (e) {
            times.push(e.dateTime.substring(10, 19));
            count20X.push(e.count20X);
            count30X.push(e.count30X);
            count40X.push(e.count40X);
            count50X.push(e.count50X);
        });

        var option = {
            title: {
                text: "实时响应状态码分布统计(每分钟)"
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: ['200段', '300段', '400段', '500段']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: times
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '日志条数'
                }
            ],
            series: [
                {
                    name: '200段',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: '#46A3FF',
                            opacity: 0.5
                        }
                    },
                    stack: 'all',
                    data: count20X
                },
                {
                    name: '300段',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: 'green',
                            opacity: 0.5
                        }
                    },
                    stack: 'all',
                    data: count30X
                },
                {
                    name: '400段',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: 'black',
                            opacity: 0.5
                        }
                    },
                    stack: 'all',
                    data: count40X
                },
                {
                    name: '500段',
                    type: 'bar',
                    itemStyle: {
                        normal: {
                            color: 'red',
                            opacity: 0.5
                        }
                    },
                    stack: 'all',
                    data: count50X
                }
            ]
        };
        hostStatusChart.setOption(option);
    };

    var updateHostStatusChart = function () {
        var hosts = hostSelect.val();
        var query = {};
        if (hosts == undefined) {
            query = {
                startDateTime: moment().subtract(120, 'minutes').toDate().format("yyyy-MM-dd hh:mm:ss"),
                endDateTime: moment().toDate().format("yyyy-MM-dd hh:mm:ss")
            }
        } else {
            query = {
                startDateTime: moment().subtract(120, 'minutes').toDate().format("yyyy-MM-dd hh:mm:ss"),
                endDateTime: moment().toDate().format("yyyy-MM-dd hh:mm:ss"),
                hosts: hosts
            }
        }
        requestURL(dataService + "/logMonitor/piwik/hostStatusStats", query).done(function (data) {
            drawHostStatusChart(data);
        });
    };

    var drawHostPageTimeChart = function (data) {

        var resTime = [];

        var times = [];

        data.forEach(function (e) {
            times.push(e.dateTime.substring(10, 19));
            resTime.push(e.resTime);
        });

        var option = {
            title: {
                text: "实时响应时间统计(每分钟平均)"
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: ['tk.aihuishou.com']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: times
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '响应时间(s)'
                }
            ],
            series: [
                {
                    name: 'tk.aihuishou.com',
                    type: 'line',
                    itemStyle: {
                        normal: {
                            color: '#46A3FF',
                            opacity: 0.5
                        }
                    },
                    data: resTime
                }
            ]
        };
        hostPageTimeChart.setOption(option);
    };

    var updateHostPageTimeChart = function () {
        var pages = pageSelect.val();
        var query = {};
        if (pages == undefined) {
            query = {
                startDateTime: moment().subtract(120, 'minutes').toDate().format("yyyy-MM-dd hh:mm:ss"),
                endDateTime: moment().toDate().format("yyyy-MM-dd hh:mm:ss")
            }
        } else {
            query = {
                startDateTime: moment().subtract(120, 'minutes').toDate().format("yyyy-MM-dd hh:mm:ss"),
                endDateTime: moment().toDate().format("yyyy-MM-dd hh:mm:ss"),
                pages: pages
            }
        }
        requestURL(dataService + "/logMonitor/piwik/hostPageTimeStats", query).done(function (data) {
            drawHostPageTimeChart(data);
        });
    };

    var drawHostPageTimeAvgChart = function (data) {

        var resTime = [];

        data["tk.aihuishou.com"].forEach(function (e) {
            resTime.push([e.count, e.resTimeAvg.toFixed(0), 10, e.page, e.host]);
        });

        var option = {
            title: {
                text: '各Uri平均响应时间'
            },
            legend: {
                data: ['tk.aihuishou.com']
            },
            dataZoom: [
                {
                    type: 'slider',
                    start: 0,
                    end: 100
                }
            ],
            xAxis: {
                name: '响应次数',
                splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                }
            },
            yAxis: {
                name: '平均响应时间(ms)',
                splitLine: {
                    lineStyle: {
                        type: 'dashed'
                    }
                },
                scale: true
            },
            series: [{
                name: 'tk.aihuishou.com',
                data: resTime,
                type: 'scatter',
                label: {
                    emphasis: {
                        show: true,
                        formatter: function (param) {
                            return param.data[4] + "\n" + param.data[3] + "\n响应次数:" + param.data[0] + "\n平均响应时间:" + param.data[1] + "ms";
                        },
                        position: 'top'
                    }
                }
            }]
        };
        hostPageTimeAvgChart.setOption(option);
    };

    var updateHostPageTimeAvgChart = function () {
        var minutes = minuteSelect.val();
        var query = {withInMinute: minutes};

        requestURL(dataService + "/logMonitor/piwik/getHostPageResTimeAvg", query).done(function (data) {
            drawHostPageTimeAvgChart(data);
        });
    };

    updateHostStatusChart();
    updateHostPageTimeChart();
    updateHostPageTimeAvgChart();

    var queryButton = $('#queryBtn');

    queryButton.click(function () {
        updateHostStatusChart();
    });

    var queryPageButton = $('#queryPageBtn');

    queryPageButton.click(function () {
        updateHostPageTimeChart();
    });

    var queryPageTimeBtn = $('#queryPageTimeBtn');

    queryPageTimeBtn.click(function () {
        updateHostPageTimeAvgChart();
    });

    setInterval(function () {
        if ($('#autoRefresh').is(':checked')) {
            updateHostStatusChart();
        }
        if ($('#pageAutoRefresh').is(':checked')) {
            updateHostPageTimeChart();
        }
    }, 30 * 1000);

};