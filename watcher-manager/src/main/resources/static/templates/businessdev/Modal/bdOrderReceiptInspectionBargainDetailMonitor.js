var globalObj = {
    cur:[],
    pre:[]
}
Template.bdOrderReceiptInspectionBargainDetailMonitor.rendered = function () {

    var listJ = Template.list;
    console.log(listJ);
    var channel = listJ[1];
    var orderType = listJ[0];

    //今天
    $(".tdDate").html(new Date().getNewDate(0));
    if(orderType=="receipt"){
        $("#orderType").html("到货")
    }else if(orderType=="inspection"){
        $("#orderType").html("验货")
    }

    renderTodayPage(orderType,channel);
    renderYtdPage(orderType,channel);

};

function renderTodayPage(orderType,channel) {

    var filter = {}
    filter.type = "centre"
    filter.sourceType=[];
    filter.sourceType.push(channel);
    filter.dateType = "td"
    filter.orderType = orderType
    var promise = getBdSourceReceiptInfo(filter);
    promise.done(function (ret) {
        globalObj.cur=ret
        drawOrderReceiptCntMixedChart();
    });
}

function renderYtdPage(orderType,channel) {

    var filter = {}
    filter.type = "centre"
    filter.sourceType=[];
    filter.sourceType.push(channel);
    filter.dateType = "ytd"
    filter.orderType = orderType
    var promise = getBdSourceReceiptInfo(filter);
    promise.done(function (ret) {
        globalObj.pre=ret
        var cnt=0;
        ret.forEach(function(e){
            cnt+= e.cnt;
        })
        $("#ytdOrderCnt").html(cnt)
        drawOrderReceiptCntMixedChart();
    });

}

function getBdSourceReceiptInfo(filter) {
    //clean parameters
    var query = _.clone(filter);
    delete query["userId"];
    delete query["sign"];
    var dfd = $.Deferred();
    requestURL(dataService + "/bd/getBdSourceReceiptInfo", query).done(function (ret) {
        dfd.resolve(ret)
    });
    return dfd.promise()
}

//到货部分
function drawOrderReceiptCntMixedChart() {
    var curData  =globalObj.cur;
    var preObj = {}
    globalObj.pre.forEach(function(ele){
        preObj[ele.name]=ele.cnt
    })

    var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
    var cnt=0;
    var operationCenterName=[];
    var pieData = [];
    var barData = [];
    var xLabels = [];
    curData.forEach(function(e){
        cnt+= e.cnt;
        var name = e.name
        operationCenterName.push(name);
        xLabels.push(name + ":" + e.cnt+" 昨日:"+(preObj[name]|0));
        barData.push({
            value: e.cnt,
            itemStyle: {
                normal: {
                    color: colors.pop()
                }
            }
        });
        pieData.push({name: name, value: e.cnt});
    })
    $("#todayOrderCnt").html(cnt);

    var option = {
        title: {
            text: '订单量',
            top: '80%',
            left: 'center'
        },
        tooltip: {},
        legend: {
            data: operationCenterName
        },
        calculable: true,
        grid: {
            top: 80,
            bottom: 100
        },
        xAxis: [
            {
                'type': 'category',
                'data': xLabels
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '订单量',
                type: 'bar',
                label: {normal: {show: true, position: 'top', formatter: '{b}'}},
                data: barData
            }, {
                name: '订单量渠道占比',
                type: 'pie',
                center: ['75%', '30%'],
                radius: '28%',
                data: pieData
            }]
    };

    var orderCentreCntMixedChart = echarts.init(document.getElementById('orderCentreCntMixedChart'));
    orderCentreCntMixedChart.setOption(option);
    window.addEventListener('resize',orderCentreCntMixedChart.resize)



}

