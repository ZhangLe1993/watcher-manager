Template.digitalSignage.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operation').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;

    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var clock = new Clock();
    clock.display([document.getElementById("clock-time"),document.getElementById("clock-date")]);

    var operationCenterName = "";
    var operationCenter = Template.currentData().OperationCenter;
    switch (parseInt(operationCenter)) {
        case 1:
            $('#shanghaiDigitalSignage').addClass('active');
            $('#shanghaiOperationCenter').addClass('active');
            operationCenterName = "上海";
            break;
        case 12:
            $('#shanghaiTestDigitalSignage').addClass('active');
            $('#shanghaiTestOperationCenter').addClass('active');
            operationCenterName = "上海(流程测试专用)";
            break;
        case 2:
            $('#beijingDigitalSignage').addClass('active');
            $('#beijingOperationCenter').addClass('active');
            operationCenterName = "北京";
            break;
        case 3:
            $('#chengduDigitalSignage').addClass('active');
            $('#chengduOperationCenter').addClass('active');
            operationCenterName = "成都";
            break;
        case 4:
            $('#shenzhenDigitalSignage').addClass('active');
            $('#shenzhenOperationCenter').addClass('active');
            operationCenterName = "深圳(物流)";
            break;
        case 16:
            $('#shenzhenNewDigitalSignage').addClass('active');
            $('#shenzhenNewOperationCenter').addClass('active');
            operationCenterName = "深圳";
            break;
        case 5:
            $('#tianjinDigitalSignage').addClass('active');
            $('#tianjinOperationCenter').addClass('active');
            operationCenterName = "天津";
            break;
        case 6:
            $('#wuhanDigitalSignage').addClass('active');
            $('#wuhanOperationCenter').addClass('active');
            operationCenterName = "武汉";
            break;
        case 10:
            $('#changzhouDigitalSignage').addClass('active');
            $('#changzhouOperationCenter').addClass('active');
            operationCenterName = "常州";
            break;
        case 0:
            $('#ChinaDigitalSignage').addClass('active');
            $('#chinaOperationCenter').addClass('active');
            operationCenterName = "全国";
            break;
        case 18:
            $('#changzhouTestDigitalSignage').addClass('active');
            $('#changzhouTestOperationCenter').addClass('active');
            operationCenterName = "常州(流程测试专用)";
            break;
        default:
            break;
    }

    var ours = Template.currentData().ours;
    switch(ours){
        case 1:
            $("#controller").attr("class","content-wrapper");
            break;
        case 2:
            $("#controller").attr("class","content");
            break;
    }

    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        //获取已激活的标签页的名称
        var activeTab = e.target.hash;
        switch(activeTab){
            case "#home":
                drawPage(operationCenter);
                drawUnRealTimePart(operationCenter);
                clearInterval(interval);
                interval = setInterval(function(){
                    drawPage(operationCenter);
                },1000*60*2);
                break;
            case "#other":
                getCumuliData(operationCenter);
                clearInterval(interval);
                interval = setInterval(function(){
                    getCumuliData(operationCenter);
                },1000*60*2);
                break;
        }
    });

    this.autorun(function () {
        operationCenter = Template.currentData().OperationCenter;
        switch (parseInt(operationCenter)) {
            case 1:
                $('#shanghaiDigitalSignage').addClass('active');
                $('#shanghaiOperationCenter').addClass('active');
                operationCenterName = "上海";
                break;
            case 12:
                $('#shanghaiTestDigitalSignage').addClass('active');
                $('#shanghaiTestOperationCenter').addClass('active');
                operationCenterName = "上海(流程测试专用)";
                break;
            case 2:
                $('#beijingDigitalSignage').addClass('active');
                $('#beijingOperationCenter').addClass('active');
                operationCenterName = "北京";
                break;
            case 3:
                $('#chengduDigitalSignage').addClass('active');
                $('#chengduOperationCenter').addClass('active');
                operationCenterName = "成都";
                break;
            case 4:
                $('#shenzhenDigitalSignage').addClass('active');
                $('#shenzhenOperationCenter').addClass('active');
                operationCenterName = "深圳(物流)";
                break;
            case 16:
                $('#shenzhenNewDigitalSignage').addClass('active');
                $('#shenzhenNewOperationCenter').addClass('active');
                operationCenterName = "深圳";
                break;
            case 5:
                $('#tianjinDigitalSignage').addClass('active');
                $('#tianjinOperationCenter').addClass('active');
                operationCenterName = "天津";
                break;
            case 6:
                $('#wuhanDigitalSignage').addClass('active');
                $('#wuhanOperationCenter').addClass('active');
                operationCenterName = "武汉";
                break;
            case 0:
                $('#ChinaDigitalSignage').addClass('active');
                $('#chinaOperationCenter').addClass('active');
                operationCenterName = "全国";
                break;
            case 10:
                $('#changzhouDigitalSignage').addClass('active');
                $('#changzhouOperationCenter').addClass('active');
                operationCenterName = "常州";
                break;
            case 18:
                $('#changzhouTestDigitalSignage').addClass('active');
                $('#changzhouTestOperationCenter').addClass('active');
                operationCenterName = "常州(流程测试专用)";
                break;
            default:
                break;
        }
        ours = Template.currentData().ours;
        switch(ours){
            case 1:
                $("#controller").attr("class","content-wrapper");
                break;
            case 2:
                $("#controller").attr("class","content");
                break;
        }
        switch ($("ul#pageTab li.active").text()) {
            case '首页':
                //console.log('首页');
                drawPage(operationCenter);
                drawUnRealTimePart(operationCenter);
                clearInterval(interval);
                interval = setInterval(function(){
                    drawPage(operationCenter);
                },1000*60*2);
                break;
            case '次页':
                //console.log('次页');
                getCumuliData(operationCenter);
                clearInterval(interval);
                interval = setInterval(function(){
                    getCumuliData(operationCenter);
                },1000*60*2);
                break;
            default:
                break;
        }
    });

};

var interval;

var currentQualityNum = 0;

var currentQualityCompletionRate = 0;

var currentPersonQualityNum = {prev:{first:0,second:0,third:0},suffix:{first:0,second:0,third:0}};

var currentPersonQualityCompletionRate = {prev:{first:0,second:0,third:0},suffix:{first:0,second:0,third:0}};

var drawPage = function(operationCenter){
    //获取运营中心质检量
    requestURL(dataService+"/operationCenter/getQualityNum", {operationCenter:operationCenter}).done(function (data) {
        if(data.statusText != undefined && data.statusText=='error'){

        }else{
            //console.log(data);
            var xData = [];
            var yData = [];
            _.each(data,function(ele){
                var strArr = ele.date.split("-");
                //将2018-12-07格式转化成  12/07
                xData.push(strArr[1] + "/" + strArr[2]);
                yData.push(accMul(ele.count,1));
            });

            $("span[data-set='currentQualityNum']").lemCounter({
                value_to: yData[yData.length-1],
                value_from: currentQualityNum,
                animate_duration: 3,
                locale: 'en-US'
            });
            currentQualityNum = yData[yData.length-1];
            drawFlashChart("qualityNumChart",xData,yData);

            //获取完成率的分母
            requestURL(dataService+"/operationCenter/getQualityCompletionRate", {operationCenter:1}).done(function (denominator) {
                if(denominator.statusText != undefined && denominator.statusText=='error'){

                }else{
                    console.log(denominator);
                    var zData = [];
                    _.each(yData,function(ele){
                        zData.push(accDiv(Math.round(accMul(accDiv(ele,denominator),10000)),100));
                    });
                    $("span[data-set='currentQualityCompletionRate']").lemCounter({
                        value_to: zData[zData.length-1],
                        value_from: currentQualityCompletionRate,
                        animate_duration: 3,
                        locale: 'en-US'
                    });
                    currentQualityCompletionRate = zData[zData.length-1];
                    drawRateFlashChart("质检完成率","qualityCompletionRateChart",xData,zData);
                }
            });
        }
    });

    //个人质检量
    requestURL(dataService+"/operationCenter/getPersonQualityNum", {operationCenter:operationCenter}).done(function (data) {
        if(data.statusText != undefined && data.statusText=='error'){

        }else{
            console.log(data);
            var pervData = data['prev'];
            var suffixData = data['suffix'];
            var denominator = 1;
            //设置前三名
            if(pervData.length > 0){
                denominator = accDiv(Math.ceil(accDiv(pervData[0].count,10)),10);
                $("span[name-set='person-quality-num-first']").html(pervData[0].name);
                $("span[data-set='person-quality-num-first']").lemCounter({
                    value_to: accMul(pervData[0].count,1),
                    value_from: currentPersonQualityNum.prev.first,
                    animate_duration: 3,
                    locale: 'en-US'
                });
                currentPersonQualityNum.prev.first = accMul(pervData[0].count,1);
                $("div[progress-set='person-quality-num-first']").attr("style","width: "+ accDiv(accMul(pervData[0].count,1),denominator) +"%");

                if(pervData.length > 1){
                    $("span[name-set='person-quality-num-second']").html(pervData[1].name);
                    $("span[data-set='person-quality-num-second']").lemCounter({
                        value_to: accMul(pervData[1].count,1),
                        value_from: currentPersonQualityNum.prev.second,
                        animate_duration: 3,
                        locale: 'en-US'
                    });
                    currentPersonQualityNum.prev.second = accMul(pervData[1].count,1);
                    $("div[progress-set='person-quality-num-second']").attr("style","width: "+ accDiv(accMul(pervData[1].count,1),denominator) +"%");

                    if(pervData.length > 2){
                        $("span[name-set='person-quality-num-third']").html(pervData[2].name);
                        $("span[data-set='person-quality-num-third']").lemCounter({
                            value_to: accMul(pervData[2].count,1),
                            value_from: currentPersonQualityNum.prev.third,
                            animate_duration: 3,
                            locale: 'en-US'
                        });
                        currentPersonQualityNum.prev.third = accMul(pervData[2].count,1);
                        $("div[progress-set='person-quality-num-third']").attr("style","width: "+ accDiv(accMul(pervData[2].count,1),denominator) +"%");
                    }
                }
            }

            if(suffixData.length > 0){
                //设置倒数三名
                $("span[name-set='person-quality-num-lastfirst']").html(suffixData[0].name);
                $("span[data-set='person-quality-num-lastfirst']").lemCounter({
                    value_to: accMul(suffixData[0].count,1),
                    value_from: currentPersonQualityNum.suffix.first,
                    animate_duration: 3,
                    locale: 'en-US'
                });
                currentPersonQualityNum.suffix.first = accMul(suffixData[0].count,1);
                $("div[progress-set='person-quality-num-lastfirst']").attr("style","width: "+ accDiv(accMul(suffixData[0].count,1),denominator) +"%");

                if(suffixData.length > 1){
                    $("span[name-set='person-quality-num-lastsecond']").html(suffixData[1].name);
                    $("span[data-set='person-quality-num-lastsecond']").lemCounter({
                        value_to: accMul(suffixData[1].count,1),
                        value_from: currentPersonQualityNum.suffix.second,
                        animate_duration: 3,
                        locale: 'en-US'
                    });
                    currentPersonQualityNum.suffix.second = accMul(suffixData[1].count,1);
                    $("div[progress-set='person-quality-num-lastsecond']").attr("style","width: "+ accDiv(accMul(suffixData[1].count,1),denominator) +"%");

                    if(suffixData.length > 2){
                        $("span[name-set='person-quality-num-lastthird']").html(suffixData[2].name);
                        $("span[data-set='person-quality-num-lastthird']").lemCounter({
                            value_to: accMul(suffixData[2].count,1),
                            value_from: currentPersonQualityNum.suffix.third,
                            animate_duration: 3,
                            locale: 'en-US'
                        });
                        currentPersonQualityNum.suffix.third = accMul(suffixData[2].count,1);
                        $("div[progress-set='person-quality-num-lastthird']").attr("style","width: "+ accDiv(accMul(suffixData[2].count,1),denominator) +"%");
                    }
                }
            }
        }
    });

    //个人质检完成率
    requestURL(dataService+"/operationCenter/getPersonQualityCompleteRate", {operationCenter:operationCenter}).done(function (data) {
        if(data.statusText != undefined && data.statusText=='error'){

        }else{
            console.log(data);
            var pervData = data['prev'];
            var suffixData = _.sortBy(data['suffix'],function(ele){return accMul(ele.rate,1)});
            var denominator = 1;

            if(pervData.length > 0){
                var first = accDiv(Math.round(accMul(pervData[0].rate,10000)),100);
                denominator = Math.ceil(first);
                $("span[name-set='person-quality-completion-rate-first']").html(pervData[0].name);
                $("span[data-set='person-quality-completion-rate-first']").lemCounter({
                    value_to: first,
                    value_from: currentPersonQualityCompletionRate.prev.first,
                    animate_duration: 3,
                    locale: 'en-US'
                });
                currentPersonQualityCompletionRate.prev.first = first;
                $("div[progress-set='person-quality-completion-rate-first']").attr("style","width: "+accDiv(accMul(first,100),denominator)+"%");

                if(pervData.length > 1){
                    var second = accDiv(Math.round(accMul(pervData[1].rate,10000)),100);
                    $("span[name-set='person-quality-completion-rate-second']").html(pervData[1].name);
                    $("span[data-set='person-quality-completion-rate-second']").lemCounter({
                        value_to: second,
                        value_from: currentPersonQualityCompletionRate.prev.second,
                        animate_duration: 3,
                        locale: 'en-US'
                    });
                    currentPersonQualityCompletionRate.prev.second = second;
                    $("div[progress-set='person-quality-completion-rate-second']").attr("style","width: "+accDiv(accMul(second,100),denominator)+"%");

                    if(pervData.length > 2){
                        var third = accDiv(Math.round(accMul(pervData[2].rate,10000)),100);
                        $("span[name-set='person-quality-completion-rate-third']").html(pervData[2].name);
                        $("span[data-set='person-quality-completion-rate-third']").lemCounter({
                            value_to: third,
                            value_from: currentPersonQualityCompletionRate.prev.third,
                            animate_duration: 3,
                            locale: 'en-US'
                        });
                        currentPersonQualityCompletionRate.prev.third = third;
                        $("div[progress-set='person-quality-completion-rate-third']").attr("style","width: "+accDiv(accMul(third,100),denominator)+"%");
                    }
                }
            }

            if(suffixData.length > 0){
                var lastfirst = accDiv(Math.round(accMul(suffixData[0].rate,10000)),100);
                $("span[name-set='person-quality-completion-rate-lastfirst']").html(suffixData[0].name);
                $("span[data-set='person-quality-completion-rate-lastfirst']").lemCounter({
                    value_to: lastfirst,
                    value_from: currentPersonQualityCompletionRate.suffix.first,
                    animate_duration: 3,
                    locale: 'en-US'
                });
                currentPersonQualityCompletionRate.suffix.first = lastfirst;
                $("div[progress-set='person-quality-completion-rate-lastfirst']").attr("style","width: "+accDiv(accMul(lastfirst,100),denominator)+"%");

                if(suffixData.length > 1){
                    var lastsecond = accDiv(Math.round(accMul(suffixData[1].rate,10000)),100);
                    $("span[name-set='person-quality-completion-rate-lastsecond']").html(suffixData[1].name);
                    $("span[data-set='person-quality-completion-rate-lastsecond']").lemCounter({
                        value_to: lastsecond,
                        value_from: currentPersonQualityCompletionRate.suffix.second,
                        animate_duration: 3,
                        locale: 'en-US'
                    });
                    currentPersonQualityCompletionRate.suffix.second = lastsecond;
                    $("div[progress-set='person-quality-completion-rate-lastsecond']").attr("style","width: "+accDiv(accMul(lastsecond,100),denominator)+"%");

                    if(suffixData.length > 2){
                        var lastthird = accDiv(Math.round(accMul(suffixData[2].rate,10000)),100);
                        $("span[name-set='person-quality-completion-rate-lastthird']").html(suffixData[2].name);
                        $("span[data-set='person-quality-completion-rate-lastthird']").lemCounter({
                            value_to: lastthird,
                            value_from: currentPersonQualityCompletionRate.suffix.third,
                            animate_duration: 3,
                            locale: 'en-US'
                        });
                        currentPersonQualityCompletionRate.suffix.third = lastthird;
                        $("div[progress-set='person-quality-completion-rate-lastthird']").attr("style","width: "+accDiv(accMul(lastthird,100),denominator)+"%");
                    }
                }
            }
        }
    });
};

var drawUnRealTimePart = function(operationCenter){
    //运营中心质检失误率和退货失误率
    requestURL(dataService+"/operationCenter/getErrorRate", {operationCenter:operationCenter}).done(function (data) {
        if(data.statusText != undefined && data.statusText=='error'){

        }else{
            console.log(data);
            var xData = [];
            var yData = [];
            var zData = [];
            _.each(data.reverse(),function(ele){
                var strArr = ele['date'].split("-");
                //将2018-12-07格式转化成  12/07
                xData.push(strArr[1] + "/" + strArr[2]);
                //xData.push(ele['date']);
                yData.push(accMul(ele['quality'].substring(0,ele['quality'].lastIndexOf("%")),1));
                zData.push(accMul(ele['return'].substring(0,ele['return'].lastIndexOf("%")),1));
            });
            drawRateFlashChart("质检失误率","qualityErrorRateChart",xData,yData);
            drawRateFlashChart("退货失误率","returnErrorRateChart",xData,zData);
        }
    });

    //个人质检失误率
    requestURL(dataService+"/operationCenter/getPersonQualityErrorRate", {operationCenter:operationCenter}).done(function (data) {
        if(data.statusText != undefined && data.statusText=='error'){

        }else{
            console.log(data);
            var denominator = 1;
            if(data.length > 0){
                denominator = Math.ceil(accMul(data[0].rate.substring(0,data[0].rate.lastIndexOf("%")),1));
                $("span[name-set='person-quality-error-rate-first']").html(data[0].name);
                $("span[data-set='person-quality-error-rate-first']").lemCounter({
                    value_to: accMul(data[0].rate.substring(0,data[0].rate.lastIndexOf("%")),1),
                    value_from: 0,
                    animate_duration: 3,
                    locale: 'en-US'
                });

                $("div[progress-set='person-quality-error-rate-first']").attr("style","width: "+accDiv(accMul(data[0].rate.substring(0,data[0].rate.lastIndexOf("%")),100),denominator)+"%");

                if(data.length > 1){
                    $("span[name-set='person-quality-error-rate-second']").html(data[1].name);
                    $("span[data-set='person-quality-error-rate-second']").lemCounter({
                        value_to: accMul(data[1].rate.substring(0,data[1].rate.lastIndexOf("%")),1),
                        value_from: 0,
                        animate_duration: 3,
                        locale: 'en-US'
                    });

                    $("div[progress-set='person-quality-error-rate-second']").attr("style","width:  "+accDiv(accMul(data[1].rate.substring(0,data[1].rate.lastIndexOf("%")),100),denominator)+"%");

                    if(data.length > 2){
                        $("span[name-set='person-quality-error-rate-third']").html(data[2].name);
                        $("span[data-set='person-quality-error-rate-third']").lemCounter({
                            value_to: accMul(data[2].rate.substring(0,data[2].rate.lastIndexOf("%")),1),
                            value_from: 0,
                            animate_duration: 3,
                            locale: 'en-US'
                        });

                        $("div[progress-set='person-quality-error-rate-third']").attr("style","width:  "+accDiv(accMul(data[2].rate.substring(0,data[2].rate.lastIndexOf("%")),100),denominator)+"%");
                    }
                }
            }
        }
    });

    //不规范操作扣分
    requestURL(dataService+"/operationCenter/getNoStandardOperationReduce", {operationCenter:operationCenter}).done(function (data) {
        if(data.statusText != undefined && data.statusText=='error'){

        }else{
            console.log(data);
            var denominator = 1;
            if(data.length > 0){
                denominator = accMul(Math.ceil(Math.abs(accDiv(data[0].points,10))),10);
                $("span[name-set='person-quality-return-error-rate-first']").html(data[0].dept);
                $("span[data-set='person-quality-return-error-rate-first']").lemCounter({
                    value_to: accMul(data[0].points,1),
                    value_from: 0,
                    animate_duration: 3,
                    locale: 'en-US'
                });

                $("div[progress-set='person-quality-return-error-rate-first']").attr("style","width: "+ accDiv(Math.abs(accMul(data[0].points,100)),denominator) +"%");

                if(data.length > 1){
                    $("span[name-set='person-quality-return-error-rate-second']").html(data[1].dept);
                    $("span[data-set='person-quality-return-error-rate-second']").lemCounter({
                        value_to: accMul(data[1].points,1),
                        value_from: 0,
                        animate_duration: 3,
                        locale: 'en-US'
                    });

                    $("div[progress-set='person-quality-return-error-rate-second']").attr("style","width: "+ accDiv(Math.abs(accMul(data[1].points,100)),denominator) +"%");

                    if(data.length > 2){
                        $("span[name-set='person-quality-return-error-rate-third']").html(data[2].dept);
                        $("span[data-set='person-quality-return-error-rate-third']").lemCounter({
                            value_to: accMul(data[2].points,1),
                            value_from: 0,
                            animate_duration: 3,
                            locale: 'en-US'
                        });

                        $("div[progress-set='person-quality-return-error-rate-third']").attr("style","width: "+ accDiv(Math.abs(accMul(data[2].points,100)),denominator) +"%");
                    }
                }
            }
        }
    });
};

var drawChart = function(chartId){
    var option = {
        tooltip : {
            trigger: 'axis'
        },
        color: [ '#17b08f'],
        calculable : true,
        xAxis : [
            {
                type : 'category',
                boundaryGap : false,
                data : ['08/31','09/01','09/02','09/03','09/04','09/05','09/06']
            }
        ],
        yAxis : [
            {
                type : 'value',
                axisLabel: {
                    show: true,
                    interval: 'auto',
                    formatter: '{value}k'
                },
                show: true,
                splitLine:{
                    show:true,
                    lineStyle:{
                        type:'dashed'
                    }
                }
            }
        ],
        series : [
            {
                name:'质检量',
                type:'line',
                /*stack: '总量',*/
                /*itemStyle: {normal: {areaStyle: {type: 'default'}}},*/
                data:[2, 4, 6, 2.5, 3.5, 1.8, 0.6]
            }
        ]
    };

    var chart = echarts.init(document.getElementById(chartId));
    chart.setOption(option);
    window.addEventListener('resize',chart.resize);

};

var drawFlashChart = function(chartId,xData,yData){
    var x = xData;
    var series = [
        {
            name: '质检量',
            type: 'line',
            label: {
                normal: {
                    show: true,
                    position: 'top'
                }
            },
            data: yData
        }
    ];
    var option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            },
            formatter:function(item){
                //console.log(item);
                return item[0].name + "<br>" + item[0].seriesName + ": " + item[0].value;
            }
        },
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: x
        }],
        color:['#17b08f'],
        yAxis: [{
            type: 'value',
            splitNumber:2,
            splitLine:{
                show:true,
                lineStyle:{
                    type:'dashed'
                }
            }
        }],
        series: series
    };
    var effectScatterData = [];

    //直接取最后一个元素
    effectScatterData.push([xData[xData.length-1],yData[yData.length-1]]);

    //var currentDay = new Date().getNewDate(0);
    //var curArr = currentDay.split("-");
    //var cur = curArr[1] + "/" + curArr[2];
    /*_.each(xData,function(ele){
        if(cur == ele){

        }
    });*/
    /*_.each(series,function(ele){
        var data = ele.data;
        for(var i = 0; i < data.length; i++) {
            if(data[i] > 100){
                effectScatterData.push([x[i], data[i]]);
            }
        }
    });*/
    console.log("effectScatterData:", effectScatterData);
    var effectScatter = {
        name: '当前',
        type: 'effectScatter',
        coordinateSystem: 'cartesian2d',
        data: effectScatterData, //2d坐标系
        symbolSize: 15,
        showEffectOn: 'render',
        rippleEffect: {
            brushType: 'stroke'
        },
        hoverAnimation: true,
        label: {
            normal: {
                formatter: '{b}',
                position: 'right',
                show: true
            }
        },
        itemStyle: {
            normal: {
                color: 'orange',
                shadowBlur: 10,
                shadowColor: '#333'
            }
        },
        zlevel: 1
    };
    option.series.push(effectScatter);
    var chart = echarts.init(document.getElementById(chartId));
    chart.setOption(option);
    window.addEventListener('resize',chart.resize);
};

var drawRateFlashChart = function(name,chartId,xData,yData){
    var x = xData;
    var series = [
        {
            name: name,
            type: 'line',
            label: {
                normal: {
                    show: true,
                    position: 'top',
                    formatter:'{c}%'
                }
            },
            data: yData
        }
    ];
    var option = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'cross',
                label: {
                    backgroundColor: '#6a7985'
                }
            },
            formatter:function(item){
                //console.log(item);
                return item[0].name + "<br>" + item[0].seriesName + ": " + item[0].value;
            }
        },
        xAxis: [{
            type: 'category',
            boundaryGap: false,
            data: x
        }],
        color:['#17b08f'],
        yAxis: [{
            type: 'value',
            axisLabel: {
                show: true,
                interval: 'auto',
                formatter: '{value}%'
            },
            splitNumber:2,
            show: true,
            splitLine:{
                show:true,
                lineStyle:{
                    type:'dashed'
                }
            }
        }],
        series: series
    };
    var effectScatterData = [];

    //直接取最后一个元素
    effectScatterData.push([xData[xData.length-1],yData[yData.length-1]]);

    //var currentDay = new Date().getNewDate(0);
    //var curArr = currentDay.split("-");
    //var cur = curArr[1] + "/" + curArr[2];
    /*_.each(xData,function(ele){
        if(cur == ele){

        }
    });*/
    /*_.each(series,function(ele){
        var data = ele.data;
        for(var i = 0; i < data.length; i++) {
            if(data[i] > 100){
                effectScatterData.push([x[i], data[i]]);
            }
        }
    });*/
    console.log("effectScatterData:", effectScatterData);
    var effectScatter = {
        name: '当前',
        type: 'effectScatter',
        coordinateSystem: 'cartesian2d',
        data: effectScatterData, //2d坐标系
        symbolSize: 15,
        showEffectOn: 'render',
        rippleEffect: {
            brushType: 'stroke'
        },
        hoverAnimation: true,
        label: {
            normal: {
                formatter: '{b}',
                position: 'right',
                show: true
            }
        },
        itemStyle: {
            normal: {
                color: 'orange',
                shadowBlur: 10,
                shadowColor: '#333'
            }
        },
        zlevel: 1
    };
    option.series.push(effectScatter);
    var chart = echarts.init(document.getElementById(chartId));
    chart.setOption(option);
    window.addEventListener('resize',chart.resize);
};

var initPageToLoading = function(modelName){
    $("#" + modelName + "LoadingPanel").show();
    $("#" + modelName + "Panel").hide();
};

var cancelLoading = function(modelName){
    $("#" + modelName + "LoadingPanel").hide();
    $("#" + modelName + "Panel").show();
};


var getCumuliData = function(operationCenter){
    //获取运营中心质检量
    requestURL(dataService+"/operationCenter/getNextPageData", {operationCenter:operationCenter}).done(function (data) {
        if(data.statusText != undefined && data.statusText=='error'){

        }else{
            console.log(data);
            drawCumuliChart(data);
        }
    });
};
/**
 * 渲染堆积图
 * @param data
 */
var drawCumuliChart = function(data){
    var hourAllLists = ["09:30","10:30","11:30","12:30","13:30","14:30","15:30","16:30","17:30","18:30","19:30","20:30","21:30"];
    ///var constructMap = new Map();
    var countArr = [];
    _.each(hourAllLists,function(ele){
        if(!data.hasOwnProperty(ele)){
            //constructMap.set(ele,0);
            countArr.push(0);
        }else{
            //constructMap.set(ele,data[ele]);
            countArr.push(accMul(data[ele],1));
        }
    });
    console.log(countArr);
    var option = {
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top:'20%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                data :hourAllLists
            }
        ],
        yAxis: [
            {
                type: 'value',
                splitLine:{
                    show:true,
                    lineStyle:{
                        type:'dashed'
                    }
                }
            }
        ],
        series: [
            {
                name: '运营中心质检堆积图',
                type: 'bar',
                barWidth : 35,//柱图宽度
                color:['#3ba1ff'],
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        formatter: function(para) {
                            return para.value.toLocaleString();
                        }
                    }
                },
                data: countArr
            }
        ]
    };

    var chart = echarts.init(document.getElementById('qualityNumCumuliChart'));
    chart.clear();
    chart.setOption(option, false, false);
    chart.resize();
    window.addEventListener('resize',chart.resize)
};


