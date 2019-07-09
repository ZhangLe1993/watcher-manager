Template.IPhonePriceRate.rendered = function () {

    $('.navi-tab').removeClass('active');
    $('#BDTab').addClass('active');
    $('#IPhonePriceRate').addClass('active');

    if(isMobile()){
        $('.sidebar-toggle').click();
    }

    var productSelect = $('#productSelect');
    var totalRateData = {};

    //------------------------------------------------------------------------

    var drawIPhonePriceRateChart = function (data) {

        var stats = {week: [], max: [], median: [], min: []};

        data.week.forEach(function (e) {
            stats.week.push(e)
        });
        data.max.forEach(function (e) {
            stats.max.push((e * 100).toFixed(2))
        });
        data.median.forEach(function (e) {
            stats.median.push((e * 100).toFixed(2))
        });
        data.min.forEach(function (e) {
            stats.min.push((e * 100).toFixed(2))
        });

        totalRateData = stats;

        var option = {
            title: {
                text: 'iPhone手机整体折价率(%)',
                left: 'left',
                top: 'top',
                fontWeight: "bolder"
            },
            tooltip: {
                trigger: 'axis',
                formatter: '第{b0}周<br />{a0}: {c0}%<br />{a1}: {c1}%<br />{a2}: {c2}%'
            },
            legend: {
                left: 'center',
                data: ['max', 'median', 'min']
            },
            dataZoom: [
                {
                    type: 'slider',
                    start: 0,
                    end: 100
                }
            ],
            xAxis: [
                {
                    type: 'category',
                    name: '发售后周数',
                    data: totalRateData.week
                }
            ],
            yAxis: [

                {
                    type: 'value',
                    axisLabel: {
                        formatter: function (value, index) {
                            return value + '%'
                        }
                    }
                }
            ],
            animationDuration: 2000,
            series: [
                {
                    name: 'max',
                    type: 'line',
                    showSymbol: false,
                    data: totalRateData.max
                },
                {
                    name: 'median',
                    type: 'line',
                    showSymbol: false,
                    data: totalRateData.median
                },
                {
                    name: 'min',
                    type: 'line',
                    showSymbol: false,
                    data: totalRateData.min
                }
            ]
        };
        var IPhonePriceRateChart = echarts.init(document.getElementById('IPhonePriceRateChart'));
        IPhonePriceRateChart.setOption(option);

        renderIPhonePriceRateTable(totalRateData);
    };

    var drawSingleProductChart = function (data) {

        var product = productSelect.val();
        var stats = [];
        data.rate.forEach(function (e) {
            if (e == 0.0) {
                stats.push("")
            } else {
                stats.push((e * 100).toFixed(2));
            }
        });
        var option = {
            title: {
                text: 'iPhone手机整体折价率(%)',
                left: 'left',
                top: 'top',
                fontWeight: "bolder"
            },
            tooltip: {
                trigger: 'axis',
                formatter: '第{b0}周<br />{a0}: {c0}%<br />{a1}: {c1}%<br />{a2}: {c2}%<br />{a3}: {c3}%'
            },
            legend: {
                left: 'center',
                data: ['max', 'median', 'min', product]
            },
            xAxis: [
                {
                    type: 'category',
                    name: '发售后周数',
                    data: totalRateData.week
                }
            ],
            dataZoom: [
                {
                    type: 'slider',
                    start: 0,
                    end: 100
                }
            ],
            yAxis: [

                {
                    type: 'value',
                    axisLabel: {
                        formatter: function (value, index) {
                            return value + '%'
                        }
                    }
                }
            ],
            animationDuration: 2000,
            series: [
                {
                    name: 'max',
                    type: 'line',
                    showSymbol: false,
                    data: totalRateData.max
                },
                {
                    name: 'median',
                    type: 'line',
                    showSymbol: false,
                    data: totalRateData.median
                },
                {
                    name: 'min',
                    type: 'line',
                    showSymbol: false,
                    data: totalRateData.min
                }, {
                    name: product,
                    type: 'line',
                    showSymbol: false,
                    data: stats
                }
            ]
        };
        var IPhonePriceRateChart = echarts.init(document.getElementById('IPhonePriceRateChart'));
        IPhonePriceRateChart.setOption(option);
        renderSinglePriceRateTable(totalRateData, stats);
    };

    var updateSingleProduct = function () {
        var query = {
            productName: productSelect.val()
        };

        requestURL(dataService + "/xhj/getSinglePriceRate", query).done(function (data) {
            drawSingleProductChart(data);
        });

    };

    var renderIPhonePriceRateTable = function (data) {

        var table = $('#IPhonePriceRateTable');

        var index = 0;
        var stats = [];
        while (index < data.week.length) {
            stats.push({
                week: data.week[index],
                max: data.max[index] + "%",
                median: data.median[index] + "%",
                min: data.min[index] + "%"
            });
            index++;
        }

        table.bootstrapTable('destroy').bootstrapTable({
            data: stats,
            pagination: true,
            paginationVAlign: 'top',
            pageSize: 500,
            showPaginationSwitch: true,
            search: true,
            singleSelect: true
        });
    };

    var renderSinglePriceRateTable = function (data, productData) {

        var table = $('#IPhonePriceRateTable');

        var index = 0;
        var stats = [];
        while (index < data.week.length) {
            stats.push({
                week: data.week[index],
                max: data.max[index] + "%",
                median: data.median[index] + "%",
                min: data.min[index] + "%",
                product: productData[index] + "%"
            });
            index++;
        }

        table.bootstrapTable('destroy').bootstrapTable({
            data: stats,
            pagination: true,
            paginationVAlign: 'top',
            pageSize: 500,
            showPaginationSwitch: true,
            search: true,
            singleSelect: true
        });
    };

    requestURL(dataService + "/xhj/getIPhoneTotalPriceRate", {}).done(function (data) {
        drawIPhonePriceRateChart(data);
    });

    productSelect.on("change", updateSingleProduct);

};