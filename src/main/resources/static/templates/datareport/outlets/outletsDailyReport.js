Template.outletsDailyReport.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#datareport').addClass('active');
    $('#outletsDaily').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }
    $('.reportRangeOutlets').daterangepicker({
        "showDropdowns": true,
        "alwaysShowCalendars": true,
        "linkedCalendars": false,
        "autoApply": true,
        "locale": {
            "format": "MM/DD/YYYY",
            "separator": " - ",
            "applyLabel": "确认",
            "cancelLabel": "取消",
            "fromLabel": "从",
            "toLabel": "至",
            "customRangeLabel": "自定义",
            "daysOfWeek": [
                "日",
                "一",
                "二",
                "三",
                "四",
                "五",
                "六"
            ],
            "monthNames": [
                "一月",
                "二月",
                "三月",
                "四月",
                "五月",
                "六月",
                "七月",
                "八月",
                "九月",
                "十月",
                "十一月",
                "十二月"
            ],
            "firstDay": 1
        },
        "ranges": {
            '昨天': [moment().subtract(1, 'days').toDate(), moment().subtract(1, 'days').toDate()],
            '最近7天': [moment().subtract(6, 'days').toDate(), moment().toDate()],
            '最近30天': [moment().subtract(29, 'days').toDate(), moment().toDate()],
            '本周': [moment().startOf('week').toDate(), moment().endOf('week').toDate()],
            '上周': [moment().subtract(1, 'week').startOf('week').toDate(), moment().subtract(1, 'week').endOf('week').toDate()],
            '本月': [moment().startOf('month').toDate(), moment().endOf('month').toDate()],
            '上个月': [moment().subtract(1, 'month').startOf('month').toDate(), moment().subtract(1, 'month').endOf('month').toDate()],
            '今年': [moment().startOf('year').toDate(), moment().endOf('year').toDate()],
            '去年': [moment().subtract(1, 'year').startOf('year').toDate(), moment().subtract(1, 'year').endOf('year').toDate()]
        }
    }, pickDateRangeCallback);

    $('a[data-toggle=tab]').on('shown.bs.tab', function (e) {
        activeArea = (e.target).text;

        switch (activeArea) {
            case "华东大区":
                areaPrefix = "east";
                drawShopHistoryCharts('east', '上海亚新店');
                break;
            case "华南大区":
                areaPrefix = "south";
                drawShopHistoryCharts('south', '广州天河又一城店');
                break;
            case "华北大区":
                areaPrefix = "north";
                drawShopHistoryCharts('north', '北京龙湖广场店');
                break;
            case "华西大区":
                areaPrefix = "west";
                drawShopHistoryCharts('west', '成都来福士广场店');
                break;
            default:
                break;
        }

        switchToArea(areaPrefix);
    });

    switchToArea('east');

    drawShopHistoryCharts('east', '上海亚新店');
};

activeArea = "华东大区";
areaPrefix = "east";
activeShop = "上海亚新店";
startDate = new Date(new Date().getTime() - 31 * 24 * 3600 * 1000).format("yyyy-MM-dd");
endDate = new Date().format("yyyy-MM-dd");

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

function pickDateRangeCallback(start, end, label) {
    $('.dateSelectLabel').html(start.format('YYYY-MM-DD') + ' ~ ' + end.format('YYYY-MM-DD'));
    startDate = start.format('YYYY-MM-DD');
    endDate = end.format('YYYY-MM-DD');
    drawShopHistoryCharts(areaPrefix, activeShop)
}

function switchToArea(areaPrefix) {

    var query = {
        "areaName": activeArea
    };

    requestURL(dataService + "/outletsDaily/total", query).done(function (data) {
        var item = data[0];
        $('.shopDealAmount').html('￥' + item.shopDealAmount.toLocaleString());
        $('.O2ODealAmount').html('￥' + item.O2ODealAmount.toLocaleString());
        $('.ondoorDealAmount').html('￥' + item.ondoorDealAmount.toLocaleString());
        $('.balance').html('￥' + item.balance.toLocaleString());
    });

    requestURL(dataService + "/outletsDaily/allShop", query).done(function (data) {
        drawAllShopChart(areaPrefix, data);
    });
}

function drawAllShopChart(areaPrefix, dataSet) {

    var shopNames = [];
    var shopDealAmounts = [];
    var O2ODealAmounts = [];
    var ondoorDealAmounts = [];
    var balances = [];
    var date = "";

    dataSet.forEach(function (e) {
        date = e.date;
        shopNames.push(e.shopName);
        shopDealAmounts.push(e.shopDealAmount);
        O2ODealAmounts.push(e.O2ODealAmount);
        ondoorDealAmounts.push(e.ondoorDealAmount);
        balances.push(e.balance);
    });

    $('.updateDate').html(date + "门店概览");

    var option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['门店自有成交额', 'O2O成交额(含补贴)', '门店上门成交额', '门店余额'],
            selected: {'门店余额': false}
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [{
            type: 'value'
        }, {
            type: 'value',
            axisLabel: {
                formatter: function (value, index) {
                    if (value == 0) {
                        return value
                    }
                    return '￥' + value / 1000 + 'k'
                }
            }
        }],
        yAxis: {
            type: 'category',
            data: shopNames
        },
        series: [
            {
                name: '门店自有成交额',
                type: 'bar',
                xAxisIndex: 1,
                stack: '成交额',
                data: shopDealAmounts
            },
            {
                name: 'O2O成交额(含补贴)',
                type: 'bar',
                xAxisIndex: 1,
                stack: '成交额',
                data: O2ODealAmounts
            },
            {
                name: '门店上门成交额',
                type: 'bar',
                xAxisIndex: 1,
                stack: '成交额',
                data: ondoorDealAmounts
            },
            {
                name: '门店余额',
                type: 'bar',
                xAxisIndex: 1,
                data: balances
            }
        ]
    };
    var allShopChart = echarts.init(document.getElementById(areaPrefix + "ChinaAllShopChart"));
    allShopChart.setOption(option);
    allShopChart.resize();
    allShopChart.on('click', function (params) {
        drawShopHistoryCharts(areaPrefix, params.name)
    });
    window.addEventListener('resize', allShopChart.resize)

}

function drawShopHistoryCharts(areaPrefix, shop) {
    activeShop = shop;

    var query = {
        "startDate": startDate,
        "endDate": endDate,
        "shopName": shop
    };

    requestURL(dataService + "/outletsDaily/shopHistory", query).done(function (data) {
        //drawShopDealNumCharts(areaPrefix, shop);
        drawShopDealAmountCharts(areaPrefix, shop, data);
        //drawO2ODealNumCharts(areaPrefix, shop);
        drawO2ODealAmountCharts(areaPrefix, shop, data);
        drawShopOndoorDealAmountCharts(areaPrefix, shop, data);
        drawShopBalanceCharts(areaPrefix, shop, data);
    });


}

function drawShopDealNumCharts(areaPrefix, shop) {
    var option = {
        title: {
            text: shop + '自有成交量'
        },
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '成交量',
                type: 'line',
                stack: '总量',
                smooth: true,
                itemStyle: {
                    normal: {
                        opacity: 0
                    }
                },
                lineStyle: {normal: {color: '#c23531'}},
                areaStyle: {normal: {color: '#c23531'}},
                data: [120, 132, 101, 134, 90, 230, 210]
            }
        ]
    };
    var chart1 = echarts.init(document.getElementById(areaPrefix + 'ChinaShopDealNumChart'));
    chart1.setOption(option)
    window.addEventListener('resize', chart1.resize)
}

function drawShopDealAmountCharts(areaPrefix, shop, dataSet) {

    var dates = [];
    var shopDealAmounts = [];

    dataSet.forEach(function (e) {
        dates.push(e.date);
        shopDealAmounts.push(e.shopDealAmount);
    });

    var option = {
        title: {
            text: shop + '自有成交额'
        },
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: dates
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: function (value, index) {
                    if (value == 0) {
                        return value
                    }
                    return '￥' + value / 1000 + 'k'
                }
            }
        },
        series: [
            {
                name: '成交额',
                type: 'line',
                stack: '总量',
                smooth: true,
                itemStyle: {
                    normal: {
                        color: '#c23531'
                    }
                },
                label: {
                    normal: {
                        show: true
                    }
                },
                lineStyle: {normal: {color: '#c23531'}},
                areaStyle: {normal: {color: '#c23531'}},
                data: shopDealAmounts
            }
        ]
    };
    var chart2 = echarts.init(document.getElementById(areaPrefix + 'ChinaShopDealAmountChart'));
    chart2.setOption(option)
    window.addEventListener('resize', chart2.resize)
}

function drawO2ODealNumCharts(areaPrefix, shop) {
    var option = {
        title: {
            text: shop + 'O2O成交量'
        },
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '成交量',
                type: 'line',
                stack: '总量',
                smooth: true,
                itemStyle: {
                    normal: {
                        opacity: 0
                    }
                },
                lineStyle: {normal: {color: '#61a0a8'}},
                areaStyle: {normal: {color: '#61a0a8'}},
                data: [120, 132, 101, 134, 90, 230, 210]
            }
        ]
    };
    var chart = echarts.init(document.getElementById(areaPrefix + 'ChinaO2ODealNumChart'));
    chart.setOption(option)
    window.addEventListener('resize', chart.resize)

}

function drawO2ODealAmountCharts(areaPrefix, shop, dataSet) {

    var dates = [];
    var O2ODealAmounts = [];

    dataSet.forEach(function (e) {
        dates.push(e.date);
        O2ODealAmounts.push(e.O2ODealAmount);
    });

    var option = {
        title: {
            text: shop + 'O2O成交额(含补贴)'
        },
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: dates
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: function (value, index) {
                    if (value == 0) {
                        return value
                    }
                    return '￥' + value / 1000 + 'k'
                }
            }
        },
        series: [
            {
                name: '成交额',
                type: 'line',
                stack: '总量',
                smooth: true,
                itemStyle: {
                    normal: {
                        color: '#2f4554'
                    }
                },
                label: {
                    normal: {
                        show: true
                    }
                },
                lineStyle: {normal: {color: '#2f4554'}},
                areaStyle: {normal: {color: '#2f4554'}},
                data: O2ODealAmounts
            }
        ]
    };
    var chart3 = echarts.init(document.getElementById(areaPrefix + 'ChinaO2ODealAmountChart'));
    chart3.setOption(option)
    window.addEventListener('resize', chart3.resize)
}

function drawShopOndoorDealAmountCharts(areaPrefix, shop, dataSet) {

    var dates = [];
    var ondoorDealAmounts = [];

    dataSet.forEach(function (e) {
        dates.push(e.date);
        ondoorDealAmounts.push(e.ondoorDealAmount);
    });

    var option = {
        title: {
            text: shop + '上门成交额'
        },
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: dates
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: function (value, index) {
                    if (value == 0) {
                        return value
                    }
                    return '￥' + value / 1000 + 'k'
                }
            }
        },
        series: [
            {
                name: '上门成交额金额',
                type: 'line',
                stack: '总量',
                smooth: true,
                itemStyle: {
                    normal: {
                        color: '#61a0a8'
                    }
                },
                label: {
                    normal: {
                        show: true
                    }
                },
                lineStyle: {normal: {color: '#61a0a8'}},
                areaStyle: {normal: {color: '#61a0a8'}},
                data: ondoorDealAmounts
            }
        ]
    };
    var shopOndoorDealAmountChart = echarts.init(document.getElementById(areaPrefix + 'ChinaShopOndoorDealAmountChart'));
    shopOndoorDealAmountChart.setOption(option);
    window.addEventListener('resize', shopOndoorDealAmountChart.resize)

}

function drawShopBalanceCharts(areaPrefix, shop, dataSet) {

    var dates = [];
    var balances = [];

    dataSet.forEach(function (e) {
        dates.push(e.date);
        balances.push(e.balance);
    });

    var option = {
        title: {
            text: shop + '余额历史数据'
        },
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: dates
        },
        yAxis: {
            type: 'value',
            axisLabel: {
                formatter: function (value, index) {
                    if (value == 0) {
                        return value
                    }
                    return '￥' + value / 1000 + 'k'
                }
            }
        },
        series: [
            {
                name: '余额',
                type: 'line',
                stack: '总量',
                smooth: true,
                itemStyle: {
                    normal: {
                        color: '#d48265'
                    }
                },
                label: {
                    normal: {
                        show: true
                    }
                },
                lineStyle: {normal: {color: '#d48265'}},
                areaStyle: {normal: {color: '#d48265'}},
                data: balances
            }
        ]
    };
    var chart4 = echarts.init(document.getElementById(areaPrefix + 'ChinaShopBalanceChart'));
    chart4.setOption(option)
    window.addEventListener('resize', chart4.resize)
}