Template.orderTradeAfterMonitor.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#BDTab').addClass('active');
    $('#orderTradeAfterMonitor').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    requestURL(dataService + "/bd/getBdTradeCollectionData", {}).done(function (data) {
        //提交
        $("span[data-set='submitNumCurr']").html(accMul(data['today_create_count_num'],1).toLocaleString());
        $("span[data-set='submitNumYes']").html(accMul(data['yesterday_create_count_num'],1).toLocaleString());
        $("span[data-set='submitAmountCurr']").html(accMul(data['today_create_amount_num'],1).toLocaleString());
        $("span[data-set='submitAmountYes']").html(accMul(data['yesterday_create_amount_num'],1).toLocaleString());
        $("span[data-set='submitAvgCurr']").html(accMul(data['create_avg_amount'],1).toLocaleString());
        $("span[data-set='submitAvgYes']").html(accMul(data['yesterday_create_avg_amount'],1).toLocaleString());

        //成交
        $("span[data-set='successNumCurr']").html(accMul(data['today_success_count_num'],1).toLocaleString());
        $("span[data-set='successNumYes']").html(accMul(data['yesterday_success_count_num'],1).toLocaleString());
        $("span[data-set='successAmountCurr']").html(accMul(data['today_success_amount_num'],1).toLocaleString());
        $("span[data-set='successAmountYes']").html(accMul(data['yesterday_success_amount_num'],1).toLocaleString());
        $("span[data-set='successAvgCurr']").html(accMul(data['success_avg_amount'],1).toLocaleString());
        $("span[data-set='successAvgYes']").html(accMul(data['yesterday_success_avg_amount'],1).toLocaleString());

        //取消
        $("span[data-set='cancelNumCurr']").html(accMul(data['today_cancel_count_num'],1).toLocaleString());
        $("span[data-set='cancelNumYes']").html(accMul(data['yesterday_cancel_count_num'],1).toLocaleString());
        $("span[data-set='cancelAmountCurr']").html(accMul(data['today_cancel_amount_num'],1).toLocaleString());
        $("span[data-set='cancelAmountYes']").html(accMul(data['yesterday_cancel_amount_num'],1).toLocaleString());
        $("span[data-set='cancelAvgCurr']").html(accMul(data['cancel_avg_amount'],1).toLocaleString());
        $("span[data-set='cancelAvgYes']").html(accMul(data['yesterday_cancel_avg_amount'],1).toLocaleString());
    });

    requestURL(dataService + "/bd/getBdTradeDetailData", {}).done(function (data) {
        //console.log(data);
        //渲染提交订单量
        var submitNum = {xLabels:[], barData:[]};
        _.sortBy(data, function(obj) { return accMul(obj['today_create_count_num'],1) } ).forEach( function (e) {
            submitNum.xLabels.push(e['source_name'] + ":" + accMul(e['today_create_count_num'],1).toLocaleString());
            submitNum.barData.push(accMul(e['today_create_count_num'],1));
        });
        drawTradeChart(submitNum, 'submitTradeNumChart', '提交订单量');

        //渲染提交订单额
        var submitAmount = {xLabels:[], barData:[]};
        _.sortBy(data, function(obj) { return accMul(obj['today_create_amount_num'],1) } ).forEach( function (e) {
            submitAmount.xLabels.push(e['source_name'] + ":" + accMul(e['today_create_amount_num'],1).toLocaleString());
            submitAmount.barData.push(accMul(e['today_create_amount_num'],1));
        });
        drawTradeChart(submitAmount, 'submitTradeAmountChart', '提交订单额');


        //渲染成交订单量
        var successNum = {xLabels:[], barData:[]};
        _.sortBy(data, function(obj) { return accMul(obj['today_success_count_num'],1) } ).forEach( function (e) {
            successNum.xLabels.push(e['source_name'] + ":" + accMul(e['today_success_count_num'],1).toLocaleString());
            successNum.barData.push(accMul(e['today_success_count_num'],1));
        });
        drawTradeChart(successNum, 'successTradeNumChart', '成交订单量');

        //渲染成交订单额
        var successAmount = {xLabels:[], barData:[]};
        _.sortBy(data, function(obj) { return accMul(obj['today_success_amount_num'],1) } ).forEach( function (e) {
            successAmount.xLabels.push(e['source_name'] + ":" + accMul(e['today_success_amount_num'],1).toLocaleString());
            successAmount.barData.push(accMul(e['today_success_amount_num'],1));
        });
        drawTradeChart(successAmount, 'successTradeAmountChart', '成交订单额');


        //渲染成交订单量
        var cancelNum = {xLabels:[], barData:[]};
        _.sortBy(data, function(obj) { return accMul(obj['today_cancel_count_num'],1) } ).forEach( function (e) {
            cancelNum.xLabels.push(e['source_name'] + ":" + accMul(e['today_cancel_count_num'],1).toLocaleString());
            cancelNum.barData.push(accMul(e['today_cancel_count_num'],1));
        });
        drawTradeChart(cancelNum, 'cancelTradeNumChart', '取消订单量');

        //渲染成交订单额
        var cancelAmount = {xLabels:[], barData:[]};
        _.sortBy(data, function(obj) { return accMul(obj['today_cancel_amount_num'],1) } ).forEach( function (e) {
            cancelAmount.xLabels.push(e['source_name'] + ":" + accMul(e['today_cancel_amount_num'],1).toLocaleString());
            cancelAmount.barData.push(accMul(e['today_cancel_amount_num'],1));
        });
        drawTradeChart(cancelAmount, 'cancelTradeAmountChart', '取消订单额');
    });

};

function popModal(channel) {
    setTimeout(function () {
        $.fancybox.open([
            {
                type: 'iframe',
                href: "/bd/orderDetailMonitor/" + channel
            }
        ], {
            padding: 0,
            height: 800,
            'width': 1000,
            minHeight: 800,
            autoScale: false,
            beforeShow: function () {
                this.height = 800;
            }
        });
    }, 400);
}

//提交num
function drawTradeChart(obj, chartId, seriesName) {
    var option = {
        calculable: true,
        grid: {
            left:'0',
            right:'5%',
            bottom:'1%',
            top:'7%',
            containLabel:true
        },
        tooltip: {
            trigger: 'item',
            formatter:function(param) {
                return '' + param.name.split(":")[0] + ': ' + param.value.toLocaleString();
            }
        },
        dataZoom: [
            {
                show: true,
                yAxisIndex: 0,
                start: 75,
                end: 100
            }
        ],
        yAxis: [
            {
                'type': 'category',
                'data': obj.xLabels
            }
        ],
        xAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: seriesName,
                type: 'bar',
                label: { normal: { show: true, position: 'right', formatter: '{b}' } },
                data: obj.barData,
                itemStyle: {
                    normal: {
                        color: function(params) {
                            var index = params.dataIndex;
                            var newColor = "";
                            var colorList = ['#3c8dbc','#ff9945','#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];
                            var alternateNumber = colorList.length;
                            if(index < alternateNumber) {
                                newColor = colorList[index];
                            } else {
                                var rowNumber = Math.floor(index / alternateNumber);
                                newColor = colorList[index - rowNumber * alternateNumber];
                            }
                            return newColor;
                        }
                    }
                }
            }
        ]
    };
    var chart = echarts.init(document.getElementById(chartId));
    chart.setOption(option, false, false);
    chart.on('click',function (params) {
        var regex = new RegExp("^京东|^小米|^芝麻信用|^华为|^闲鱼|^魅族|^支付宝小程序|^开放平台");
        if(regex.test(params.name) == true) {
            var channel = params.name.split(":")[0];
            //console.log(params.value);
            //popModal(channel);
            customWarnModal('myWarnModal','myWarnModalLabel',channel);
        }
    });
    chart.resize();
    window.addEventListener('resize',chart.resize);

}

function customWarnModal(modelSelector,titleSelector,channel) {
    $("#"+modelSelector).off('shown.bs.modal').on('shown.bs.modal', function () {
        $("#"+titleSelector).text(channel);
        requestURL(dataService + "/bd/getBdTradeNextPageDetailData", {}).done(function (data) {

            var filterList = _.filter(data, function(ele) { return ele['source_name'].trim() == channel.trim()});

            //提交汇总数据展示
            var channelSubmitNumCurr = _.reduce(filterList,function(num,temp) { return accAdd(num,temp['today_create_count_num'] * 1)},0);
            var channelSubmitAmountCurr = _.reduce(filterList,function(num,temp) { return accAdd(num,temp['today_create_amount_num'] * 1)},0);

            var channelSubmitNumYes = _.reduce(filterList,function(num,temp) { return accAdd(num,temp['yesterday_create_count_num'] * 1)},0);
            var channelSubmitAmountYes = _.reduce(filterList,function(num,temp) { return accAdd(num,temp['yesterday_create_amount_num'] * 1)},0);

            $("span[data-set='channelSubmitNumCurr']").html(channelSubmitNumCurr.toLocaleString());
            $("span[data-set='channelSubmitNumYes']").html(channelSubmitNumYes.toLocaleString());
            $("span[data-set='channelSubmitAmountCurr']").html(channelSubmitAmountCurr.toLocaleString());
            $("span[data-set='channelSubmitAmountYes']").html(channelSubmitAmountYes.toLocaleString());

            //成交数据汇总展示
            var channelSuccessNumCurr = _.reduce(filterList,function(num,temp) { return accAdd(num,temp['today_success_count_num'] * 1)},0);
            var channelSuccessAmountCurr = _.reduce(filterList,function(num,temp) { return accAdd(num,temp['today_success_amount_num'] * 1)},0);

            var channelSuccessNumYes = _.reduce(filterList,function(num,temp) { return accAdd(num,temp['yesterday_success_count_num'] * 1)},0);
            var channelSuccessAmountYes = _.reduce(filterList,function(num,temp) { return accAdd(num,temp['yesterday_success_amount_num'] * 1)},0);

            $("span[data-set='channelSuccessNumCurr']").html(channelSuccessNumCurr.toLocaleString());
            $("span[data-set='channelSuccessNumYes']").html(channelSuccessNumYes.toLocaleString());
            $("span[data-set='channelSuccessAmountCurr']").html(channelSuccessAmountCurr.toLocaleString());
            $("span[data-set='channelSuccessAmountYes']").html(channelSuccessAmountYes.toLocaleString());

            //根据平台分组
            var plat = _.groupBy(filterList,function(ele){return ele['source_agent_name']});
            var platList = [];
            _.map(plat,function(v, k) {
                platList.push({
                    'name' : k,
                    //统计提交
                    'cur_sub_num' : _.reduce(v,function(num,temp){ return accAdd(num,temp['today_create_count_num'] * 1)},0),
                    'cur_sub_amount' : _.reduce(v,function(num,temp){ return accAdd(num,temp['today_create_amount_num'] * 1)},0),
                    'yes_sub_num' : _.reduce(v,function(num,temp){ return accAdd(num,temp['yesterday_create_count_num'] * 1)},0),
                    'yes_sub_amount' : _.reduce(v,function(num,temp){ return accAdd(num,temp['yesterday_create_amount_num'] * 1)},0),
                    //统计成交
                    'cur_suc_num' : _.reduce(v,function(num,temp){ return accAdd(num,temp['today_success_count_num'] * 1)},0),
                    'cur_suc_amount' : _.reduce(v,function(num,temp){ return accAdd(num,temp['today_success_amount_num'] * 1)},0),
                    'yes_suc_num' : _.reduce(v,function(num,temp){ return accAdd(num,temp['yesterday_success_count_num'] * 1)},0),
                    'yes_suc_amount' : _.reduce(v,function(num,temp){ return accAdd(num,temp['yesterday_success_amount_num'] * 1)},0)
                    //取消的需求弹出层没有加，后期要加同样如此处理
                });
            });

            //console.log(platList);
            //根据回收方式分组
            var recycler = _.groupBy(filterList,function(ele) { return ele['recycle_method_name'] });
            var recyclerList = [];
            _.map(recycler,function(v, k) {
                recyclerList.push({
                    'name' : k,
                    //统计提交
                    'cur_sub_num' : _.reduce(v,function(num,temp){ return accAdd(num,temp['today_create_count_num'] * 1)},0),
                    'cur_sub_amount' : _.reduce(v,function(num,temp){ return accAdd(num,temp['today_create_amount_num'] * 1)},0),
                    'yes_sub_num' : _.reduce(v,function(num,temp){ return accAdd(num,temp['yesterday_create_count_num'] * 1)},0),
                    'yes_sub_amount' : _.reduce(v,function(num,temp){ return accAdd(num,temp['yesterday_create_amount_num'] * 1)},0),
                    //统计成交
                    'cur_suc_num' : _.reduce(v,function(num,temp){ return accAdd(num,temp['today_success_count_num'] * 1)},0),
                    'cur_suc_amount' : _.reduce(v,function(num,temp){ return accAdd(num,temp['today_success_amount_num'] * 1)},0),
                    'yes_suc_num' : _.reduce(v,function(num,temp){ return accAdd(num,temp['yesterday_success_count_num'] * 1)},0),
                    'yes_suc_amount' : _.reduce(v,function(num,temp){ return accAdd(num,temp['yesterday_success_amount_num'] * 1)},0)
                    //取消的需求弹出层没有加，后期要加同样如此处理
                });
            });

            //根据品类分组
            var category = _.groupBy(filterList,function(ele) { return ele['product_category_name'] });
            var categoryList = [];
            _.map(category,function(v, k) {
                categoryList.push({
                    'name' : k,
                    //统计提交
                    'cur_sub_num' : _.reduce(v,function(num,temp){ return accAdd(num,temp['today_create_count_num'] * 1)},0),
                    'cur_sub_amount' : _.reduce(v,function(num,temp){ return accAdd(num,temp['today_create_amount_num'] * 1)},0),
                    'yes_sub_num' : _.reduce(v,function(num,temp){ return accAdd(num,temp['yesterday_create_count_num'] * 1)},0),
                    'yes_sub_amount' : _.reduce(v,function(num,temp){ return accAdd(num,temp['yesterday_create_amount_num'] * 1)},0),
                    //统计成交
                    'cur_suc_num' : _.reduce(v,function(num,temp){ return accAdd(num,temp['today_success_count_num'] * 1)},0),
                    'cur_suc_amount' : _.reduce(v,function(num,temp){ return accAdd(num,temp['today_success_amount_num'] * 1)},0),
                    'yes_suc_num' : _.reduce(v,function(num,temp){ return accAdd(num,temp['yesterday_success_count_num'] * 1)},0),
                    'yes_suc_amount' : _.reduce(v,function(num,temp){ return accAdd(num,temp['yesterday_success_amount_num'] * 1)},0)
                    //取消的需求弹出层没有加，后期要加同样如此处理
                });
            });

            //渲染平台订单提交量
            var platSubmitNum = {labels: [], xLabels:[], barData:[], pieData:[]};
            _.sortBy(platList, function(obj) { return -obj['cur_sub_num'] } ).forEach( function (e) {
                platSubmitNum.labels.push(e['name']);
                platSubmitNum.xLabels.push(e['name'] + ":" + e['cur_sub_num'].toLocaleString() + "\n" + "昨日" + e['yes_sub_num'].toLocaleString());
                platSubmitNum.barData.push(e['cur_sub_num']);
                platSubmitNum.pieData.push({ name: e['name'], value: e['cur_sub_num'] });
            });
            drawNextTradeChart(platSubmitNum, 'platSubmitTradeNumChart', '提交订单量', '订单量渠道占比');

            //渲染平台订单成交量
            var platSuccessNum = {labels: [], xLabels:[], barData:[], pieData:[]};
            _.sortBy(platList, function(obj) { return -obj['cur_suc_num'] } ).forEach( function (e) {
                platSuccessNum.labels.push(e['name']);
                platSuccessNum.xLabels.push(e['name'] + ":" + accMul(e['cur_suc_num'],1).toLocaleString() + "\n" + "昨日" + e['yes_suc_num'].toLocaleString());
                platSuccessNum.barData.push(e['cur_suc_num']);
                platSuccessNum.pieData.push({ name: e['name'], value: e['cur_suc_num'] });

            });
            drawNextTradeChart(platSuccessNum, 'platSuccessTradeNumChart', '成交订单量', '成交量渠道占比');


            //渲染平台订单提交额
            var platSubmitAmount = {labels: [], xLabels:[], barData:[], pieData:[]};
            _.sortBy(platList, function(obj) { return -obj['cur_sub_amount'] } ).forEach( function (e) {
                platSubmitAmount.labels.push(e['name']);
                platSubmitAmount.xLabels.push(e['name'] + ":" + e['cur_sub_amount'].toLocaleString() + "\n" + "昨日" + e['yes_sub_amount'].toLocaleString());
                platSubmitAmount.barData.push(e['cur_sub_amount']);
                platSubmitAmount.pieData.push({ name: e['name'], value: e['cur_sub_amount'] });
            });
            drawNextTradeChart(platSubmitAmount, 'platSubmitTradeAmountChart', '提交订单额', '订单额渠道占比');

            //渲染平台订单成交额
            var platSuccessAmount = {labels: [], xLabels:[], barData:[], pieData:[]};
            _.sortBy(platList, function(obj) { return -obj['cur_suc_amount'] } ).forEach( function (e) {
                platSuccessAmount.labels.push(e['name']);
                platSuccessAmount.xLabels.push(e['name'] + ":" + e['cur_suc_amount'].toLocaleString() + "\n" + "昨日" + e['yes_suc_amount'].toLocaleString());
                platSuccessAmount.barData.push(e['cur_suc_amount']);
                platSuccessAmount.pieData.push({ name: e['name'], value: e['cur_suc_amount'] });
            });
            drawNextTradeChart(platSuccessAmount, 'platSuccessTradeAmountChart', '成交订单额', '订单额渠道占比');

            /********************************************************************************************************/
            /****************************************回收方式*************************************************/
            /********************************************************************************************************/
            //渲染回收方式订单提交量
            var recycleSubmitNum = {labels: [], xLabels:[], barData:[], pieData:[]};
            _.sortBy(recyclerList, function(obj) { return -obj['cur_sub_num'] } ).forEach( function (e) {
                recycleSubmitNum.labels.push(e['name']);
                recycleSubmitNum.xLabels.push(e['name'] + ":" + e['cur_sub_num'].toLocaleString() + "\n" + "昨日" + e['yes_sub_num'].toLocaleString());
                recycleSubmitNum.barData.push(e['cur_sub_num']);
                recycleSubmitNum.pieData.push({ name: e['name'], value: e['cur_sub_num'] });
            });
            drawNextTradeChart(recycleSubmitNum, 'recycleSubmitTradeNumChart', '提交订单量', '订单量渠道占比');

            //渲染回收方式订单成交量
            var recycleSuccessNum = {labels: [], xLabels:[], barData:[], pieData:[]};
            _.sortBy(recyclerList, function(obj) { return -obj['cur_suc_num'] } ).forEach( function (e) {
                recycleSuccessNum.labels.push(e['name']);
                recycleSuccessNum.xLabels.push(e['name'] + ":" + accMul(e['cur_suc_num'],1).toLocaleString() + "\n" + "昨日" + e['yes_suc_num'].toLocaleString());
                recycleSuccessNum.barData.push(e['cur_suc_num']);
                recycleSuccessNum.pieData.push({ name: e['name'], value: e['cur_suc_num'] });
            });
            drawNextTradeChart(recycleSuccessNum, 'recycleSuccessTradeNumChart', '成交订单量', '成交量渠道占比');

            //渲染回收方式订单提交额
            var recycleSubmitAmount = {labels: [], xLabels:[], barData:[], pieData:[]};
            _.sortBy(recyclerList, function(obj) { return -obj['cur_sub_amount'] } ).forEach( function (e) {
                recycleSubmitAmount.labels.push(e['name']);
                recycleSubmitAmount.xLabels.push(e['name'] + ":" + e['cur_sub_amount'].toLocaleString() + "\n" + "昨日" + e['yes_sub_amount'].toLocaleString());
                recycleSubmitAmount.barData.push(e['cur_sub_amount']);
                recycleSubmitAmount.pieData.push({ name: e['name'], value: e['cur_sub_amount'] });
            });
            drawNextTradeChart(recycleSubmitAmount, 'recycleSubmitTradeAmountChart', '提交订单额', '订单额渠道占比');

            //渲染回收方式订单成交额
            var recycleSuccessAmount = {labels: [], xLabels:[], barData:[], pieData:[]};
            _.sortBy(recyclerList, function(obj) { return -obj['cur_suc_amount'] } ).forEach( function (e) {
                recycleSuccessAmount.labels.push(e['name']);
                recycleSuccessAmount.xLabels.push(e['name'] + ":" + e['cur_suc_amount'].toLocaleString() + "\n" + "昨日" + e['yes_suc_amount'].toLocaleString());
                recycleSuccessAmount.barData.push(e['cur_suc_amount']);
                recycleSuccessAmount.pieData.push({ name: e['name'], value: e['cur_suc_amount'] });
            });
            drawNextTradeChart(recycleSuccessAmount, 'recycleSuccessTradeAmountChart', '成交订单额', '订单额渠道占比');


            /********************************************    品类    ************************************************/
            /********************************************************************************************************/
            //渲染品类订单提交量
            var categorySubmitNum = {labels: [], xLabels:[], barData:[], pieData:[]};
            _.sortBy(categoryList, function(obj) { return -obj['cur_sub_num'] } ).forEach( function (e) {
                categorySubmitNum.labels.push(e['name']);
                categorySubmitNum.xLabels.push(e['name'] + ":" + e['cur_sub_num'].toLocaleString() + "\n" + "昨日" + e['yes_sub_num'].toLocaleString());
                categorySubmitNum.barData.push(e['cur_sub_num']);
                categorySubmitNum.pieData.push({ name: e['name'], value: e['cur_sub_num'] });
            });
            drawNextTradeChart(categorySubmitNum, 'categorySubmitTradeNumChart', '提交订单量', '订单量渠道占比');

            //渲染品类订单成交量
            var categorySuccessNum = {labels: [], xLabels:[], barData:[], pieData:[]};
            _.sortBy(categoryList, function(obj) { return -obj['cur_suc_num'] } ).forEach( function (e) {
                categorySuccessNum.labels.push(e['name']);
                categorySuccessNum.xLabels.push(e['name'] + ":" + accMul(e['cur_suc_num'],1).toLocaleString() + "\n" + "昨日" + e['yes_suc_num'].toLocaleString());
                categorySuccessNum.barData.push(e['cur_suc_num']);
                categorySuccessNum.pieData.push({ name: e['name'], value: e['cur_suc_num'] });
            });
            drawNextTradeChart(categorySuccessNum, 'categorySuccessTradeNumChart', '成交订单量', '成交量渠道占比');

            //渲染品类订单提交额
            var categorySubmitAmount = {labels: [], xLabels:[], barData:[], pieData:[]};
            _.sortBy(categoryList, function(obj) { return -obj['cur_sub_amount'] } ).forEach( function (e) {
                categorySubmitAmount.labels.push(e['name']);
                categorySubmitAmount.xLabels.push(e['name'] + ":" + e['cur_sub_amount'].toLocaleString() + "\n" + "昨日" + e['yes_sub_amount'].toLocaleString());
                categorySubmitAmount.barData.push(e['cur_sub_amount']);
                categorySubmitAmount.pieData.push({ name: e['name'], value: e['cur_sub_amount'] });
            });
            drawNextTradeChart(categorySubmitAmount, 'categorySubmitTradeAmountChart', '提交订单额', '订单额渠道占比');

            //渲染品类订单成交额
            var categorySuccessAmount = {labels: [], xLabels:[], barData:[], pieData:[]};
            _.sortBy(categoryList, function(obj) { return -obj['cur_suc_amount'] } ).forEach( function (e) {
                categorySuccessAmount.labels.push(e['name']);
                categorySuccessAmount.xLabels.push(e['name'] + ":" + e['cur_suc_amount'].toLocaleString() + "\n" + "昨日" + e['yes_suc_amount'].toLocaleString());
                categorySuccessAmount.barData.push(e['cur_suc_amount']);
                categorySuccessAmount.pieData.push({ name: e['name'], value: e['cur_suc_amount'] });
            });
            drawNextTradeChart(categorySuccessAmount, 'categorySuccessTradeAmountChart', '成交订单额', '订单额渠道占比');
        });
    });
    $("#" + modelSelector).modal();
}


function drawNextTradeChart(obj, chartId, seriesName, pieSeriesName) {
    var option = {
        grid: {
            left:'0',
            right:'5%',
            bottom:'1%',
            top:'7%',
            containLabel:true
        },
        tooltip: {
            formatter: '{a}：{c}'
        },
        legend: {
            data: obj.labels
        },
        calculable: true,
        xAxis: [
            {
                'type': 'category',
                'data': obj.xLabels
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: seriesName,
                type: 'bar',
                label: { normal: { show: true, position: 'top', formatter: '{b}' } },
                data: obj.barData,
                barWidth : 30,//柱图宽度
                itemStyle: {
                    normal: {
                        color: function(params) {
                            var index = params.dataIndex;
                            var newColor = "";
                            var colorList = ['#3c8dbc','#ff9945','#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];
                            var alternateNumber = colorList.length;
                            if(index < alternateNumber) {
                                newColor = colorList[index];
                            } else {
                                var rowNumber = Math.floor(index / alternateNumber);
                                newColor = colorList[index - rowNumber * alternateNumber];
                            }
                            return newColor;
                        }
                    }
                }
            }, {
                name: pieSeriesName,
                type: 'pie',
                center: ['75%', '30%'],
                radius: '28%',
                data: obj.pieData,
                itemStyle: {
                    normal: {
                        color: function(params) {
                            var index = params.dataIndex;
                            var newColor = "";
                            var colorList = ['#3c8dbc','#ff9945','#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];
                            var alternateNumber = colorList.length;
                            if(index < alternateNumber) {
                                newColor = colorList[index];
                            } else {
                                var rowNumber = Math.floor(index / alternateNumber);
                                newColor = colorList[index - rowNumber * alternateNumber];
                            }
                            return newColor;
                        }
                    }
                }
            }]
    };
    var chart = echarts.init(document.getElementById(chartId));
    chart.setOption(option, false, false);
    chart.resize();
    window.addEventListener('resize',chart.resize);
}