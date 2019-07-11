Template.AihuishouLogMonitor.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#ITTab').addClass('active');
    $('#AihuishouMonitorTab').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }
    var hostSelect = $('#hostSelect');
    hostSelect.select2();

    var statusChart = echarts.init(document.getElementById('StatusChart'));
    var timeChart = echarts.init(document.getElementById('TimeChart'));

    var drawStatusChart = function (data) {

        var legend = Object.keys(data.data);
        var dateTime = data.dateTime.dateTime;
        var series = [];
        legend.forEach(function (e) {
            series.push({
                name: e,
                type: 'bar',
                stack: 'all',
                data: data.data[e]
            })
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
                data: legend
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
                    data: dateTime
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '响应日志条数'
                }
            ],
            series: series
        };
        statusChart.setOption(option);
    };

    var drawTimeChart = function (data) {

        var legend = Object.keys(data.data);
        var dateTime = data.dateTime.dateTime;
        var series = [];
        legend.forEach(function (e) {
            series.push({
                name: e,
                type: 'line',
                data: data.data[e]
            })
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
                data: legend
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
                    data: dateTime
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    name: '响应时间(ms)'
                }
            ],
            series: series
        };
        timeChart.setOption(option);
    };

    var updateChart = function () {
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
                services: hosts
            }
        }

        requestURL(dataService + "/logMonitor/aihuishou/StatusStats", query).done(function (data) {
            drawStatusChart(data);
        });
        requestURL(dataService + "/logMonitor/aihuishou/TimeStats", query).done(function (data) {
            drawTimeChart(data);
        });

    };

    updateChart();

    var queryButton = $('#queryBtn');

    queryButton.click(function () {
        statusChart = echarts.init(document.getElementById('StatusChart'));
        timeChart = echarts.init(document.getElementById('TimeChart'));
        updateChart();
    });


    setInterval(function () {
        if ($('#autoRefresh').is(':checked')) {
            updateChart();
        }
    }, 30 * 1000);

};