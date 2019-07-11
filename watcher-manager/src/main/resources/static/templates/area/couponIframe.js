Template.couponIframe.rendered = function () {
    var dateGap = -14;
    var endDate = new Date().getNewDate(-1);
    var startDate = new Date(endDate).getNewDate(dateGap);
    $(".selectLabel").html(startDate+"~"+endDate);
    $('.datePicker').daterangepicker(datePickerOptionsFunc(startDate,endDate,"2017-01-01"), pickDateRangeCallback);
    getData({"sdt":startDate,"edt":endDate});
    $("#search").click(function(){
        var query = getSelectedOptions();
        getData(query)
    })
};
function pickDateRangeCallback(start, end, label) {
    console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.selectLabel').html(sdt+"~"+edt);
}

function getSelectedOptions(){
    var query={}
    var arr =  $('.selectLabel').html().split("~");
    query.sdt=arr[0]
    query.edt=arr[1]
    query.packageCode=$("#packageCode").val()
    query.couponCode=$("#couponCode").val()
    return cleanParams(query)
}

function getData(query){
    $("#loading").show()
    $("#search").attr("disabled",true);
    $("#chartContent").hide()
    requestURL(dataService+"/area/getCouponInfo",query).done(function(ret){
        $("#loading").hide()
        $("#search").attr("disabled",false);
        $("#chartContent").show()
        //时间趋势
        var dateObj = _.groupBy(ret,function(obj){return obj.date})
        var dateList=[]
        for(var key in dateObj){
            var pkgCnt = _.reduce(dateObj[key], function(num, tmp){ return num + parseInt(tmp.package_deliver_cnt); }, 0)
            var couponCnt = _.reduce(dateObj[key], function(num, tmp){ return num + parseInt(tmp.coupon_deliver_cnt); }, 0)
            var trade_create_cnt = _.reduce(dateObj[key], function(num, tmp){ return num + parseInt(tmp.trade_create_cnt); }, 0)
            var trade_create_amount = _.reduce(dateObj[key], function(num, tmp){ return num + parseInt(tmp.trade_create_amount); }, 0)
            var trade_success_cnt = _.reduce(dateObj[key], function(num, tmp){ return num + parseInt(tmp.trade_success_cnt); }, 0)
            var trade_success_amount = _.reduce(dateObj[key], function(num, tmp){ return num + parseInt(tmp.trade_success_amount); }, 0)
            dateList.push({
                "date":key,
                "pkgCnt":pkgCnt,
                "couponCnt":couponCnt,
                "trade_create_cnt":trade_create_cnt,
                "trade_create_amount":trade_create_amount,
                "trade_success_cnt":trade_success_cnt,
                "trade_success_amount":trade_success_amount,
            })
        }
        var tmpData = _.sortBy(dateList,function(obj){return obj.date})
        drawLineChart(tmpData)
        drawTable(tmpData)
        //渠道分布
        var channelList = []
        var channelObj = _.groupBy(ret,function(obj){return obj.name})
        var trade_create_cnt_total= 0,trade_create_amount_total= 0,trade_success_cnt_total= 0,trade_success_amount_total= 0,promotion_price_total=0
        for(var key in channelObj){
            if(key!=''){
                var trade_create_cnt = _.reduce(channelObj[key], function(num, tmp){ return num + parseInt(tmp.trade_create_cnt); }, 0)
                var trade_create_amount = _.reduce(channelObj[key], function(num, tmp){ return num + parseInt(tmp.trade_create_amount); }, 0)
                var trade_success_cnt = _.reduce(channelObj[key], function(num, tmp){ return num + parseInt(tmp.trade_success_cnt); }, 0)
                var trade_success_amount = _.reduce(channelObj[key], function(num, tmp){ return num + parseInt(tmp.trade_success_amount); }, 0)
                var promotion_price = _.reduce(channelObj[key], function(num, tmp){ return num + parseInt(tmp.promotion_price); }, 0)
                trade_create_cnt_total+=trade_create_cnt
                trade_create_amount_total+=trade_create_amount
                trade_success_cnt_total+=trade_success_cnt
                trade_success_amount_total+=trade_success_amount
                promotion_price_total+=promotion_price
                channelList.push({
                    "name":key,
                    "trade_success_roi":parseInt(trade_success_amount/promotion_price),
                    "trade_create_cnt":trade_create_cnt,
                    "trade_create_amount":trade_create_amount,
                    "trade_success_cnt":trade_success_cnt,
                    "trade_success_amount":trade_success_amount,
                })
            }

        }
        channelList.unshift({
            "name":"整体",
            "trade_success_roi":(trade_success_amount_total/promotion_price_total).toFixed(2),
            "trade_create_cnt":trade_create_cnt_total,
            "trade_create_amount":trade_create_amount_total,
            "trade_success_cnt":trade_success_cnt_total,
            "trade_success_amount":trade_success_amount_total,
        })
        drawChannelChart(channelList)
        //交易方式
        var tradeMethodList = []
        var tradeMethodObj = _.groupBy(ret,function(obj){return obj.trade_method_name})
        //trade_create_cnt_total= 0,trade_create_amount_total= 0,trade_success_cnt_total= 0,trade_success_amount_total= 0,promotion_price_total=0
        for(var key in tradeMethodObj){
            if(key!=''){
                var trade_create_cnt = _.reduce(tradeMethodObj[key], function(num, tmp){ return num + parseInt(tmp.trade_create_cnt); }, 0)
                var trade_create_amount = _.reduce(tradeMethodObj[key], function(num, tmp){ return num + parseInt(tmp.trade_create_amount); }, 0)
                var trade_success_cnt = _.reduce(tradeMethodObj[key], function(num, tmp){ return num + parseInt(tmp.trade_success_cnt); }, 0)
                var trade_success_amount = _.reduce(tradeMethodObj[key], function(num, tmp){ return num + parseInt(tmp.trade_success_amount); }, 0)
                var promotion_price = _.reduce(tradeMethodObj[key], function(num, tmp){ return num + parseInt(tmp.promotion_price); }, 0)
                tradeMethodList.push({
                    "name":key,
                    "trade_success_roi":(trade_success_amount/promotion_price).toFixed(2),
                    "trade_create_cnt":trade_create_cnt,
                    "trade_create_amount":trade_create_amount,
                    "trade_success_cnt":trade_success_cnt,
                    "trade_success_amount":trade_success_amount,
                })
            }

        }
        drawTradeMethodChart(tradeMethodList)
    })
}
function drawTradeMethodChart(data){
    var series=[]
    var legend=[]
    var selected={}
    data.forEach(function(ele){
        var name =ele.name
        legend.push(name)

        series.push({
            name: name,
            type: 'bar',
            label: {normal: {show: true, position: 'right', formatter: '{c}'}},
            data: [ ele.trade_success_roi,ele.trade_success_cnt,ele.trade_create_cnt,  ele.trade_success_amount,ele.trade_create_amount]
        })
    })

    var option = {
        title: {
            text: '交易方式',
            x: "center",
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            padding: [30,0,0,0],
            data: legend,
            //selected:selected
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
        },
        yAxis: {
            type: 'category',
            data: ['成交订单ROI','成交订单量','提交订单量','成交订单额','提交订单额']
        },
        series: series
    };
    var chart = echarts.init(document.getElementById("tradeMethod"));
    chart.clear()
    chart.setOption(option);
    window.addEventListener('resize', chart.resize)

}


function drawChannelChart(data){
    var series=[]
    var legend=[]
    var selected={}
    data.forEach(function(ele){
        var name =ele.name
        legend.push(name)
        if(name!='整体'){
            selected[name]=false
        }
        series.push({
            name: name,
            type: 'bar',
            label: {normal: {show: true, position: 'right', formatter: '{c}'}},
            data: [ ele.trade_success_roi, ele.trade_success_cnt,ele.trade_create_cnt, ele.trade_success_amount,ele.trade_create_amount]
        })
    })

    var option = {
        title: {
            text: '渠道来源',
            x: "center",
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            padding: [30,0,0,0],
            data: legend,
            selected:selected
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
        },
        yAxis: {
            type: 'category',
            data: ['成交订单ROI','成交订单量','提交订单量','成交订单额','提交订单额']
        },
        series: series
    };
    var chart = echarts.init(document.getElementById("channel"));
    chart.setOption(option);
    window.addEventListener('resize', chart.resize)

}

function drawTable(data){
    $('#table').bootstrapTable('destroy').bootstrapTable({
        data: data,
        pagination: true,
        pageSize: 10,
        search: true,
        exportDataType:'all',
        columns:[
            {
                field:'date',
                title:'时间',
                sortable:true
            },
            {
                field:'pkgCnt',
                title:'领取包发放量',
                sortable:true
            },
            {
                field:'couponCnt',
                title:'优惠券发放量',
                sortable:true
            },
            {
                field:'trade_create_cnt',
                title:'提交订单量',
                sortable:true
            },
            {
                field:'trade_create_amount',
                title:'提交订单额',
                sortable:true
            },
            {
                field:'trade_success_cnt',
                title:'成交订单量',
                sortable:true
            },
            {
                field:'trade_success_amount',
                title:'成交订单额',
                sortable:true
            }
        ]

    });

}

function  drawLineChart(data){
    var option = {
        title: {
            text:"趋势图",
            x: "center",
            //y: "bottom"
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
        },
        legend: {
            data: ['领取包发放量', '优惠券发放量','提交订单量','提交订单额' ,'成交订单量','成交订单额'],
            padding:[30,0,0,0]
        },
        grid: {
            top:isMobile()?100:50,
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: _.map(data,function(ele){return ele.date})
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel:{
                    formatter: '{value}'
                }
            },
            {
                type: 'value',
                axisLabel:{
                    formatter: '￥{value}'
                }
            }
        ],
        series: [
            {
                name: '领取包发放量',
                type: 'line',
                data: _.map(data,function(ele){return ele.pkgCnt})
            }, {
                name: '优惠券发放量',
                type: 'line',
                data: _.map(data,function(ele){return ele.couponCnt})
            },
            {
                name: '提交订单量',
                type: 'line',
                data: _.map(data,function(ele){return ele.trade_create_cnt})
            }, {
                name: '提交订单额',
                type: 'line',
                yAxisIndex: 1,
                data: _.map(data,function(ele){return ele.trade_create_amount})
            },
            {
                name: '成交订单量',
                type: 'line',
                data: _.map(data,function(ele){return ele.trade_success_cnt})
            }, {
                name: '成交订单额',
                type: 'line',
                yAxisIndex: 1,
                data: _.map(data,function(ele){return ele.trade_success_amount})
            },
        ]
    };
    var chart = echarts.init(document.getElementById("line"));
    chart.setOption(option);
    window.addEventListener('resize', chart.resize)
}