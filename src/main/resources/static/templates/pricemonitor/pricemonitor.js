Template.pricemonitor.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#tradeCreate').addClass('active');
    $('#pricemonitor').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }
    productTradeChart = echarts.init(document.getElementById('productTradeChart'));
    //realTimeTradeAmountChart = echarts.init(document.getElementById('realTimeTradeAmountChart'));
    drawProductChart();
    //drawRealTimeTradeAmountChart();
    Deps.autorun(function () {
        if (location.pathname.indexOf('pricemonitor') > 0) {
            updateProductChart(null);
            //drawRealTimeTradeAmountChart();
        }
    });

};

Template.pricemonitor.helpers({
    productSelector: function () {
        var date = dateTradeStats.findOne({}, {sort: {createdDt: -1}}).createdDt;
        return {createdDt: date};
    }/*,
    categoryStats: function () {
        return categoryStats.find({})
    },
    brandStats: function (categoryName) {
        return brandStats.find({})
    }*/
});

Template.pricemonitor.events({
    'click #btnBrand': function () {
        filterResult()
    },
    'click #btnCategory': function () {
        filterResult()
    },
    'keypress input': function (event) {
        if (event.keyCode == 13) {
            filterResult();
            event.stopPropagation();
            return false;
        }
    }
});

var date = "";
var originSelector = {};

function filterResult() {
    var brandName = $('#txtBrand').val();
    var categoryName = $('#txtCategory').val();
    var table = $('#productTable').DataTable();
    if (brandName.length == 0 && categoryName.length == 0) {
        updateProductChart({createdDt: date});
        table.search('').draw();
    } else if (brandName.length == 0) {
        updateProductChart({categoryName: {'$regex': categoryName}});
        table.search(categoryName).draw();
    } else if (categoryName.length == 0) {
        updateProductChart({brandName: {'$regex': brandName}});
        table.search(brandName).draw();
    } else {
        updateProductChart({brandName: {'$regex': brandName}, categoryName: {'$regex': categoryName}});
        table.search(categoryName).draw();
        table.search(brandName).draw()
    }
}


if (Meteor.isClient) {

    function drawProductChart() {

        originSelector = {};

        var dataSets = productTradeStats.find(originSelector, {sort: {totalNum: -1}, limit: 30}).fetch();
        var productNames = [];

        var expressData = [];
        var ondoorData = [];
        var shopData = [];

        var rank = 1;

        dataSets.forEach(function (e) {
            productNames.push(rank + "." + e.productName + " (" + e.totalNum + ")");

            expressData.push(e.expressNum);

            ondoorData.push(e.ondoorNum);

            shopData.push(e.shopNum);

            rank = rank + 1
        });


        var option = {
            title: {
                text: '提交订单商品对比实时数据'
            },
            toolbox: {
                show: true,
                feature: {
                    mark: {show: true},
                    magicType: {show: true, type: ['line', 'bar']},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: ['快递订单', '上门订单', '门店订单']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
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
                    data: productNames.reverse()
                }
            ],
            series: [
                {
                    name: '快递订单',
                    type: 'bar',
                    stack: '总量',
                    itemStyle: {normal: {label: {show: true, position: 'inside'}}},
                    data: expressData.reverse()
                },
                {
                    name: '上门订单',
                    type: 'bar',
                    stack: '总量',
                    itemStyle: {normal: {label: {show: true, position: 'inside'}}},
                    data: ondoorData.reverse()
                },
                {
                    name: "门店订单",
                    type: 'bar',
                    stack: '总量',
                    itemStyle: {normal: {label: {show: true, position: 'insideRight'}}},
                    data: shopData.reverse()
                }
            ]
        };
        productTradeChart.setOption(option)
        window.addEventListener('resize',productTradeChart.resize)
    }

    function updateProductChart(newSelector) {
        var selector = {};
        if (newSelector == undefined) {
            selector = originSelector
        } else {
            selector = newSelector;
            originSelector = newSelector
        }
        var dataSets = productTradeStats.find(selector, {sort: {totalNum: -1}, limit: 30}).fetch();
        var productNames = [];

        var expressData = [];
        var ondoorData = [];
        var shopData = [];

        var rank = 1;

        dataSets.forEach(function (e) {
            productNames.push(rank + "." + e.productName + " (" + e.totalNum + ")");

            expressData.push(e.expressNum);

            ondoorData.push(e.ondoorNum);

            shopData.push(e.shopNum);

            rank = rank + 1
        });


        var option = {
            title: {
                text: '提交订单商品对比实时数据'
            },
            toolbox: {
                show: true,
                feature: {
                    mark: {show: true},
                    magicType: {show: true, type: ['line', 'bar']},
                    restore: {show: true},
                    saveAsImage: {show: true}
                }
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: ['快递订单', '上门订单', '门店订单']
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
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
                    data: productNames.reverse()
                }
            ],
            series: [
                {
                    name: '快递订单',
                    type: 'bar',
                    stack: '总量',
                    itemStyle: {normal: {label: {show: true, position: 'inside'}}},
                    data: expressData.reverse()
                },
                {
                    name: '上门订单',
                    type: 'bar',
                    stack: '总量',
                    itemStyle: {normal: {label: {show: true, position: 'inside'}}},
                    data: ondoorData.reverse()
                },
                {
                    name: "门店订单",
                    type: 'bar',
                    stack: '总量',
                    itemStyle: {normal: {label: {show: true, position: 'insideRight'}}},
                    data: shopData.reverse()
                }
            ]
        };

        productTradeChart.setOption(option)
        window.addEventListener('resize',productTradeChart.resize)

    }

}
