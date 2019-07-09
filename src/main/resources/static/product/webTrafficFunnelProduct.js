Template.webTrafficFunnelProduct.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#productTab').addClass('active');
    $('#webTrafficFunnelProduct').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }
    var dateGap = -14;
    var minWeekDate = "2016-07-03";
    var minMonthDate = "2016-07-01";
    var endDate = new Date().getNewDate(-1);
    var startDate = new Date(endDate).getNewDate(dateGap);
    var startWeekDate = moment().weekday(-14).format("YYYY-MM-DD")
    var endWeekDate = moment().weekday(-7).format("YYYY-MM-DD")
    if(startWeekDate<minWeekDate){
        startWeekDate = minWeekDate;
    }
    var startMonthDate = moment().subtract(1, 'month').startOf('month').format("YYYY-MM-DD");
    var endMonthDate = moment().subtract(1, 'month').startOf('month').format("YYYY-MM-DD");
    if(startMonthDate<minMonthDate){
        startMonthDate = minMonthDate;
    }
    var transformDate = function (date) {
        var dateStrArray = date.split('-');
        return dateStrArray[1] + '/' + dateStrArray[2] + '/' + dateStrArray[0]
    };

    var datePickerOptions = {
        "showDropdowns": true,
        //"alwaysShowCalendars": true,
        //"singleDatePicker": true,
        "autoApply": true,
        "alwaysShowCalendars": false,
        "startDate": transformDate(startDate),
        "endDate": transformDate(endDate),
        "minDate": transformDate("2016-07-01"),
        "maxDate": transformDate(endDate),
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
            "firstDay": 0
        },
        "ranges": {
            '昨天': [moment().subtract(1, 'days').toDate(), moment().subtract(1, 'days').toDate()],
            '最近7天': [moment().subtract(7, 'days').toDate(), moment().toDate()],
            '最近15天': [moment().subtract(15, 'days').toDate(), moment().toDate()],
            '最近30天': [moment().subtract(30, 'days').toDate(), moment().toDate()],
            '本周': [moment().startOf('week').toDate(), moment().endOf('week').toDate()],
            '上周': [moment().subtract(1, 'week').startOf('week').toDate(), moment().subtract(1, 'week').endOf('week').toDate()],
            '本月': [moment().startOf('month').toDate(), moment().endOf('month').toDate()],
            '上个月': [moment().subtract(1, 'month').startOf('month').toDate(), moment().subtract(1, 'month').endOf('month').toDate()],
            '今年': [moment().startOf('year').toDate(), moment().endOf('year').toDate()],
            '去年': [moment().subtract(1, 'year').startOf('year').toDate(), moment().subtract(1, 'year').endOf('year').toDate()]
        }
    };


    $(".dateSelectLabel").html(startDate+"~"+endDate);
    $('.webTrafficFunnelDate').daterangepicker(datePickerOptions, pickWebTrafficFunnelDateRangeCallback);

    var weekPickerOptions = {
        onlyShowfirstDayOfWeek:true,
        "showDropdowns": true,
        //"alwaysShowCalendars": true,
        "alwaysShowCalendars": false,
        //"singleDatePicker": true,
        "autoApply": true,
        "startDate": transformDate(startWeekDate),
        "endDate": transformDate(endWeekDate),
        "minDate": transformDate(minWeekDate),
        "maxDate": transformDate(endWeekDate),
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
            "firstDay": 0
        },
        "ranges": {
            '上周': [moment().subtract(1, 'week').startOf('week').toDate(), moment().subtract(1, 'week').startOf('week').toDate()],
            '上5周': [moment().subtract(5, 'week').startOf('week').toDate(), moment().subtract(1, 'week').startOf('week').toDate()],
            '上10周': [moment().subtract(10, 'week').startOf('week').toDate(), moment().subtract(1, 'week').startOf('week').toDate()],
            '上15周': [moment().subtract(15, 'week').startOf('week').toDate(), moment().subtract(1, 'week').startOf('week').toDate()],
            '今年': [moment().startOf('year').startOf('week').toDate(), moment().subtract(1, 'week').startOf('week').toDate()],
            '去年': [moment().subtract(1, 'year').startOf('year').startOf('week').toDate(), moment().subtract(1, 'year').endOf('year').startOf('week').toDate()]
        }
    };

    $(".weekSelectLabel").html(startWeekDate+"~"+endWeekDate);
    $('.webTrafficFunnelWeek').daterangepicker(weekPickerOptions, pickWebTrafficFunnelWeekRangeCallback);

    var monthPickerOptions = {
        onlyShowfirstDayOfMonth:true,
        "showDropdowns": true,
        //"alwaysShowCalendars": true,
        "alwaysShowCalendars": false,
        //"singleDatePicker": true,
        "autoApply": true,
        "startDate": transformDate(startMonthDate),
        "endDate": transformDate(endMonthDate),
        "minDate": transformDate(minMonthDate),
        "maxDate": transformDate(endMonthDate),
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
            "firstDay": 0
        },
        "ranges": {
            '上月': [moment().subtract(1, 'month').startOf('month').toDate(), moment().subtract(1, 'month').startOf('month').toDate()],
            '上5月': [moment().subtract(5, 'month').startOf('month').toDate(), moment().subtract(1, 'month').startOf('month').toDate()],
            '上10月': [moment().subtract(10, 'month').startOf('month').toDate(), moment().subtract(1, 'month').startOf('month').toDate()],
            '上15月': [moment().subtract(15, 'month').startOf('month').toDate(), moment().subtract(1, 'month').startOf('month').toDate()],
            '今年': [moment().startOf('year').startOf('month').toDate(), moment().subtract(1, 'month').startOf('month').toDate()],
            '去年': [moment().subtract(1, 'year').startOf('year').startOf('month').toDate(), moment().subtract(1, 'year').endOf('year').startOf('month').toDate()]
        }
    };

    $(".monthSelectLabel").html(startMonthDate+"~"+endMonthDate);
    $('.webTrafficFunnelMonth').daterangepicker(monthPickerOptions, pickWebTrafficFunnelMonthRangeCallback);

    $(".webTrafficFunnelDate").show();
    $(".webTrafficFunnelWeek").hide();
    $(".webTrafficFunnelMonth").hide();
    $(".dateType").on('change',function(){
        var dateType =$(this).val();
        if(dateType=="daily"){
            $(".webTrafficFunnelDate").show();
            $(".webTrafficFunnelWeek").hide();
            $(".webTrafficFunnelMonth").hide();
            dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g,"").split("~");
            var startDate = dt[0];
            var endDate = dt[1];
            var query = {
                "startDate": startDate,
                "endDate": endDate
            };
            requestURL(dataService + "/webTraffic/productTrafficFunnel", query).done(function (data) {
                getValue(data);
            });
        }else if(dateType=="weekly"){
            $(".webTrafficFunnelDate").hide();
            $(".webTrafficFunnelWeek").show();
            $(".webTrafficFunnelMonth").hide();
            dt = $('.desktop-only .weekSelectLabel').text().replace(/ /g,"").split("~");
            var startDate = dt[0];
            var endDate = dt[1];
            var query = {
                "startDate": startDate,
                "endDate": endDate
            };
            requestURL(dataService + "/webTraffic/productTrafficFunnelWeek", query).done(function (data) {
                getValue(data);
            });
        }else if(dateType=="monthly"){
            $(".webTrafficFunnelDate").hide();
            $(".webTrafficFunnelWeek").hide();
            $(".webTrafficFunnelMonth").show();
            dt = $('.desktop-only .monthSelectLabel').text().replace(/ /g,"").split("~");
            var startDate = dt[0];
            var endDate = dt[1];
            var query = {
                "startDate": startDate,
                "endDate": endDate
            };
            requestURL(dataService + "/webTraffic/productTrafficFunnelMonth", query).done(function (data) {
                getValue(data);
            });
        }
    });

//    $(".search").click(function(){
//        var dateType =$(".dateType").val();
//        if(dateType=="daily"){
//            $(".webTrafficFunnelDate").show();
//            $(".webTrafficFunnelWeek").hide();
//            dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g,"").split("~");
//            var startDate = dt[0];
//            var endDate = dt[1];
//            var query = {
//                "startDate": startDate,
//                "endDate": endDate
//            };
//            requestURL(dataService + "/webTraffic/productTrafficFunnel", query).done(function (data) {
//                getValue(data);
//            });
//        }else if(dateType=="weekly"){
//            $(".webTrafficFunnelDate").hide();
//            $(".webTrafficFunnelWeek").show();
//            dt = $('.desktop-only .weekSelectLabel').text().replace(/ /g,"").split("~");
//            var startDate = dt[0];
//            var endDate = dt[1];
//            var query = {
//                "startDate": startDate,
//                "endDate": endDate
//            };
//            requestURL(dataService + "/webTraffic/productTrafficFunnelWeek", query).done(function (data) {
//                getValue(data);
//            });
//        }
//    });

    dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g,"").split("~");
    var startDate = dt[0];
    var endDate = dt[1];
    var query = {
        "startDate": startDate,
        "endDate": endDate
    };
    requestURL(dataService + "/webTraffic/productTrafficFunnel", query).done(function (data) {
        getValue(data);
    });

};

var portalTotal,wapTotal;

function getValue(data){
        drawWebTrafficFunnelChartPortal(data);
        drawWebTrafficFunnelChartWap(data);
        drawWebTrafficFunnelSummaryChartPortal(data);
        drawWebTrafficFunnelSummaryChartWap(data);

        var xAxis_data = [];
        var series = {
            mainURL:[],
            UV: [],
            inquiryUV: [],
            inquirySuccessUV: [],
            tradeMethodUV: [],
            paymentMethodUV: [],
            tradeUV: [],
            inquUv: [],
            inquSuUv: [],
            traMeUv:[],
            payMeUv:[],
            traUv:[],
            leftHomeRatio:[]
        };
        data.forEach(function (e) {
                    xAxis_data.push(e.date);
                    series.mainURL.push(e.mainURL);
                    series.UV.push(e.UV);
                    series.inquiryUV.push(e.inquiryUV);
                    series.inquirySuccessUV.push(e.inquirySuccessUV);
                    series.tradeMethodUV.push(e.tradeMethodUV);
                    series.paymentMethodUV.push(e.paymentMethodUV);
                    series.tradeUV.push(e.tradeUV);
                    series.inquUv.push(((e.inquiryUV/e.UV)*100).toFixed(2));
                    series.inquSuUv.push((e.inquirySuccessUV/e.UV*100).toFixed(2));
                    series.traMeUv.push((e.tradeMethodUV/e.UV*100).toFixed(2));
                    series.payMeUv.push((e.paymentMethodUV/e.UV*100).toFixed(2));
                    series.traUv.push((e.tradeUV/e.UV*100).toFixed(2));
                    series.leftHomeRatio.push((e.leftHomeRatio*100).toFixed(2));
        });

        var obj = getCalcData(data);
        var tableJson = [];

        for(var i= 0,len=xAxis_data.length;i<len;i++){
            var tmp = {
                "date":xAxis_data[i],
                "mainURL":series.mainURL[i],
                "UV":series.UV[i],
                "inquiryUV":series.inquiryUV[i],
                "inquUV":((series.inquiryUV[i]/series.UV[i])*100).toFixed(2)+"%",
                "inquirySuccessUV":series.inquirySuccessUV[i],
                "inquSuUV":(series.inquirySuccessUV[i]/series.UV[i]*100).toFixed(2)+"%",
                "tradeMethodUV":series.tradeMethodUV[i],
                "traMeUV":(series.tradeMethodUV[i]/series.UV[i]*100).toFixed(2)+"%",
                "paymentMethodUV":series.paymentMethodUV[i],
                "payMeUV":(series.paymentMethodUV[i]/series.UV[i]*100).toFixed(2)+"%",
                "tradeUV":series.tradeUV[i],
                "traUV":(series.tradeUV[i]/series.UV[i]*100).toFixed(2)+"%",
                "leftHomeRatio":(series.leftHomeRatio[i])+"%",
            };
            tableJson.push(tmp);
        }

        var fixRow2 = '"<tr style="background-color: #acc087;"", " ", "", "", " data-index="0"", "", "", ">", "<td  style=""    >总数</td>", "<td  style=""    >-</td>","<td  style=""    >'+obj.UV+'</td>", "<td  style=""    >'+obj.inquiryUV+'</td>", "<td  style=""    >'+obj.inquUv+'</td>", "<td  style=""    >'+obj.inquirySuccessUV+'</td>", "<td  style=""    >'+obj.inquSuUv+'</td>", "<td  style=""    >'+obj.tradeMethodUV+'</td>", "<td  style=""    >'+obj.traMeUv+'</td>", "<td  style=""    >'+obj.paymentMethodUV+'</td>", "<td  style=""    >'+obj.payMeUv+'</td>", "<td  style=""    >'+obj.tradeUV+'</td>", "<td  style=""    >'+obj.traUv+'</td>", "<td  style=""    >'+obj.leftHomeRatio+'</td>","</tr>"'
        $('#table').bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            //pagination: true,
            fixRow:fixRow2,
            data:tableJson,
            columns: [{
                field: 'date',
                title: '日期',
                sortable:true
            },{
                field: 'mainURL',
                title: '网址',
                sortable:true
            }, {
                field: 'UV',
                title: '总访客数',
                sortable:true
            }, {
                field: 'inquiryUV',
                title: '询价访客数',
                sortable:true
            }, {
                field: 'inquUV',
                title: '询价转化率',
                sortable:true
            }, {
                field: 'inquirySuccessUV',
                title: '询价完成访客数',
                sortable:true
            }, {
                field: 'inquSuUV',
                title: '询价完成转化率',
                sortable:true
            }, {
                field: 'tradeMethodUV',
                title: '选择交易方式访客数',
                sortable:true
            }, {
                field: 'traMeUV',
                title: '选择交易方式转化率',
                sortable:true
            }, {
                field: 'paymentMethodUV',
                title: '选择支付方式访客数',
                sortable:true
            },{
                field: 'payMeUV',
                title: '选择支付方式转化率',
                sortable:true
            },{
                field: 'tradeUV',
                title: '提交成功访客数',//此处的交易成功即是提交成功！！！
                sortable:true
            },{
                field: 'traUV',
                title: '提交成功转化率',
                sortable:true
            }
            ,{
                field: 'leftHomeRatio',
                title: '首页跳出率',
                sortable:true
            }
            ],
        });
}

//获取总的计算数据
function getCalcData(data){
    var UV= 0;
    var inquiryUV =0;
    var inquirySuccessUV =0;
    var tradeMethodUV = 0;
    var paymentMethodUV = 0;
    var tradeUV = 0;
    var inquUv = 0;
    var inquSuUv = 0;
    var traMeUv = 0;
    var payMeUv =0;
    var traUv = 0;
    var alluv = 0;
    var exituv = 0;
    var leftHomeRatio =0;
    data.forEach(function (e) {
        UV += e.UV;
        inquiryUV += e.inquiryUV;
        inquirySuccessUV += e.inquirySuccessUV;
        tradeMethodUV += e.tradeMethodUV;
        paymentMethodUV += e.paymentMethodUV;
        tradeUV += e.tradeUV;
        inquUv += e.inquUv;
        inquSuUv += e.inquSuUv;
        traMeUv += e.traMeUv;
        payMeUv += e.payMeUv;
        traUv += e.traUv;
        alluv += e.alluv;
        exituv += e.exituv;
        leftHomeRatio += e.leftHomeRatio;
    });
    inquUv=(inquiryUV/UV*100).toFixed(2)+"%";
    inquSuUv=(inquirySuccessUV/UV*100).toFixed(2)+"%";
    traMeUv=(tradeMethodUV/UV*100).toFixed(2)+"%";
    payMeUv=(paymentMethodUV/UV*100).toFixed(2)+"%";
    traUv=(tradeUV/UV*100).toFixed(2)+"%";
    leftHomeRatio=(exituv/alluv*100).toFixed(2)+"%"
    return {"UV":UV,"inquiryUV":inquiryUV,"inquUv":inquUv,"inquirySuccessUV":inquirySuccessUV,"inquSuUv":inquSuUv,"tradeMethodUV":tradeMethodUV,"traMeUv":traMeUv,"paymentMethodUV":paymentMethodUV,"payMeUv":payMeUv,"tradeUV":tradeUV,"traUv":traUv,"leftHomeRatio":leftHomeRatio}
}

function drawWebTrafficFunnelSummaryChartPortal(data) {
    var dateType = $(".dateType").val(),dt;
    if(dateType=="daily"){
        dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g,"").split("~");
    }else if(dateType=="weekly"){
        dt = $('.desktop-only .weekSelectLabel').text().replace(/ /g,"").split("~");
    }else if(dateType=="monthly"){
        dt = $('.desktop-only .monthSelectLabel').text().replace(/ /g,"").split("~");
    }
    var selectDate = dt[1];
    var portalData = [];
    data.forEach(function (e) {
        switch (e.mainURL) {
            case "http://www.aihuishou.com":
                switch (e.date){
                    case selectDate:
                        portalData.push(e.UV);
                        portalData.push(e.inquiryUV);
                        portalData.push(e.inquirySuccessUV);
                        portalData.push(e.tradeMethodUV);
                        portalData.push(e.tradeUV);
                        portalData.push(e.tradeUV);
                        break;
                }
            break;
        }
    });

    portalTotal=portalData[0];
    var yData = ['总访客数',
        "询价转化率:"+(portalData[1] / portalData[0] * 100).toFixed(2) + '% \n询价页面访客数',
        "询价完成率:"+(portalData[2] / portalData[1] * 100).toFixed(2) + '% \n询价完成访客数',
        "选择交易方式率:"+(portalData[3] / portalData[2] * 100).toFixed(2) + '% \n选择交易方式访客数',
        "提交成功率:"+(portalData[4] / portalData[3] * 100).toFixed(2) + '% \n提交成功访客数',
        (portalData[4] / portalData[0] * 100).toFixed(2) + '% \n提交成功转化率'].reverse();

    var option = {
        title: {
            text: '官网流量漏斗'+"(日期"+selectDate+")",
            x: "center",
            y: "bottom"
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter:function(params,ticket,callback){
                 var str;
                 params.forEach(function(obj){
                    var objf=obj.name.split(" ")
                     if(objf[1]){
                         str =obj.name.split(" ")[0]+'<br/>'+obj.name.split(" ")[1] + ' : ' + obj.value + '<br/>';
                     }else{
                        str = obj.name+ ' : ' + obj.value + '<br/>';
                     }
                 });
                return (str)
            }
        },
        grid: {
            show: false,
            left: '3%',
            right: '4%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'value', show: false
            }
        ],
        yAxis: [
            {
                type: 'category',
                data: yData,
                splitLine: {
                    show: true
                }
            }
        ],
        series: [
            {
                name: '官网',
                type: 'bar',
                itemStyle: {normal: {color: '#568FC8', label: {show: true, position: 'right', color: '#568FC8'}}},
                data: portalData.reverse()
            }

        ]
    };

    var webTrafficFunnelSummaryChart = echarts.init(document.getElementById('webTrafficFunnelSummaryChartPortal'));
    webTrafficFunnelSummaryChart.setOption(option)
    window.onresize = function(){
        webTrafficFunnelSummaryChart.resize();
    }
}

function drawWebTrafficFunnelSummaryChartWap(data) {
    var dateType = $(".dateType").val(),dt;
    if(dateType=="daily"){
        dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g,"").split("~");
    }else if(dateType=="weekly"){
        dt = $('.desktop-only .weekSelectLabel').text().replace(/ /g,"").split("~");
    }else if(dateType=="monthly"){
        dt = $('.desktop-only .monthSelectLabel').text().replace(/ /g,"").split("~");
    }
    var selectDate = dt[1];
    var wapData = [];

    data.forEach(function (e) {
        switch (e.mainURL) {
            case "http://m.aihuishou.com":
                switch (e.date){
                    case selectDate:
                        wapData.push(e.UV);
                        wapData.push(e.inquiryUV);
                        wapData.push(e.inquirySuccessUV);
                        wapData.push(e.tradeMethodUV);
                        wapData.push(e.paymentMethodUV);
                        wapData.push(e.tradeUV);
                        wapData.push(e.tradeUV);
                        break;
                }
                break;
        }
    });

    wapTotal=wapData[0];
    var Total=portalTotal+wapTotal;
    $("#UVCount").html("爱回收官网和爱回收M版本的总访客数："+Total);

    var yData = ['总访客数',
        "询价转化率:"+(wapData[1] / wapData[0] * 100).toFixed(2) + '% \n询价页面访客数',
        "询价完成率:"+(wapData[2] / wapData[1] * 100).toFixed(2) + '% \n询价完成访客数',
        "选择交易方式率:"+(wapData[3] / wapData[2] * 100).toFixed(2) + '% \n选择交易方式访客数',
        "选择支付方式率:"+(wapData[4] / wapData[3] * 100).toFixed(2) + '% \n选择支付方式访客数',
        "提交成功率:"+(wapData[5] / wapData[4] * 100).toFixed(2) + '% \n提交成功访客数',
        (wapData[5] / wapData[0] * 100).toFixed(2) + '%\n提交成功转化率',].reverse();

    var option = {
        title: {
            text: 'M版流量漏斗'+"(日期"+selectDate+")",
            x: "center",
            y: "bottom"
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
             formatter:function(params,ticket,callback){
                 var str;
                 params.forEach(function(obj){
                    var objf=obj.name.split(" ")
                     if(objf[1]){
                         str =obj.name.split(" ")[0]+'<br/>'+obj.name.split(" ")[1] + ' : ' + obj.value + '<br/>';
                     }else{
                        str = obj.name+ ' : ' + obj.value + '<br/>';
                     }
                 });
                return (str)
             }
        },
        grid: {
            show: false,
            left: '3%',
            right: '4%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'value', show: false
            }
        ],
        yAxis: [
            {
                type: 'category',
                data: yData,
                splitLine: {
                    show: true
                }
            }
        ],
        series: [
            {
                name: 'M版',
                type: 'bar',
                itemStyle: {normal: {color: '#568FC8', label: {show: true, position: 'right', color: '#568FC8'}}},
                data: wapData.reverse()
            }
        ]
    };

    var webTrafficFunnelSummaryChart = echarts.init(document.getElementById('webTrafficFunnelSummaryChartWap'));
    webTrafficFunnelSummaryChart.setOption(option)
    window.onresize=function(){
        webTrafficFunnelSummaryChart.resize();
    }
}

function drawWebTrafficFunnelChartPortal(data) {
    var xAxis_data = [];
    var series = {
        UV: [],
        inquiryUV: [],
        inquirySuccessUV: [],
        tradeMethodUV: [],
        tradeUV: [],
        homeUV: [],
        leftUV:[],
        inquUv: [],
        inquSuUv: [],
        traMeUv:[],
        traUv:[],
        leftHomeRatio:[]
    };
    data.forEach(function (e) {
        switch (e.mainURL) {
            case "http://www.aihuishou.com":
                xAxis_data.push(e.date);
                series.UV.push(e.UV);
                series.inquiryUV.push(e.inquiryUV);
                series.inquirySuccessUV.push(e.inquirySuccessUV);
                series.tradeMethodUV.push(e.tradeMethodUV);
                series.tradeUV.push(e.tradeUV);
                series.inquUv.push((e.inquiryUV/e.UV*100).toFixed(2));
                series.inquSuUv.push((e.inquirySuccessUV/e.UV*100).toFixed(2));
                series.traMeUv.push((e.tradeMethodUV/e.UV*100).toFixed(2));
                series.traUv.push((e.tradeUV/e.UV*100).toFixed(2));
                series.leftHomeRatio.push((e.leftHomeRatio*100).toFixed(2));
                break;
            default:
                break;
        }
    });

    var option = {
        title: {
            text: '官网历史流量',
            x: "center",
            y: "bottom"
        },
        tooltip: {
            trigger: 'axis',
            formatter:function(params,ticket,callback){
                var str = params[0].name + '<br/>';
                params.forEach(function(obj){
                    if(obj.seriesName.indexOf("率")>-1){
                        str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                    }else{
                        str += obj.seriesName + ' : ' + obj.value + '<br/>'
                    }
                });
                return str;
            }
        },
        legend: {
            fromatter:function(name){
                return name;

            },
            selected:{
             '总访客数':true,
             '询价访客数':true,
             '询价完成访客数':true,
             '选择交易方式访客数':true,
             '提交成功访客数':true,
             '询价转化率':true,
             '询价完成转化率':true,
             '选择交易方式转化率':true,
             '提交成功转化率':true,
             '首页跳出率':true
            },
            data: ['总访客数', '询价访客数', '询价完成访客数', '选择交易方式访客数', '提交成功访客数','询价转化率', '询价完成转化率', '选择交易方式转化率', '提交成功转化率','首页跳出率']
        },
        grid: {
            show: false,
            left: '3%',
            right: '4%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxis_data
        },
        yAxis: [
                {
                    type: 'value'
                },
//                splitLine: {
//                    show: false
//                },
                {
                    type: 'value',
                    axisLabel: {
                        formatter: function (value, index) {
                            if (value == 0) {
                                return value
                            }
                            return value+"%"
                        }
                    }
                }
        ],
        series: [
            {
                name: '总访客数',
                type: 'line',
                data: series.UV
            },
            {
                name: '询价访客数',
                type: 'line',
                data: series.inquiryUV
            },
           {
               name: '询价转化率',
               type: 'line',
               yAxisIndex: 1,
               data: series.inquUv
           },
            {
                name: '询价完成访客数',
                type: 'line',
                data: series.inquirySuccessUV
            },
          {
              name: '询价完成转化率',
              type: 'line',
              yAxisIndex: 1,
              data: series.inquSuUv
          },
            {
                name: '选择交易方式访客数',
                type: 'line',
                data: series.tradeMethodUV
            },
              {
                  name: '选择交易方式转化率',
                  type: 'line',
                  yAxisIndex: 1,
                  data: series.traMeUv
              },
            {
                name: '提交成功访客数',
                type: 'line',
                data: series.tradeUV
            }
               ,{
                   name: '提交成功转化率',
                   type: 'line',
                   yAxisIndex: 1,
                   data: series.traUv
               },
               {
                   name: '首页跳出率',
                   type: 'line',
                   yAxisIndex: 1,
                   data: series.leftHomeRatio
               }
        ]
    };
    var trafficStackChart = echarts.init(document.getElementById('webTrafficStackChartPortal'));
    trafficStackChart.setOption(option);
    window.onresize=function(){
        trafficStackChart.resize();
    }
}

function drawWebTrafficFunnelChartWap(data) {
    var xAxis_data = [];
    var series = {
        UV: [],
        inquiryUV: [],
        inquirySuccessUV: [],
        tradeMethodUV: [],
        paymentMethodUV: [],
        tradeUV: [],
        inquUv: [],
        inquSuUv: [],
        traMeUv:[],
        payMeUv:[],
        traUv:[],
        leftHomeRatio:[]
    };
    data.forEach(function (e) {
        switch (e.mainURL) {
            case "http://m.aihuishou.com":
                xAxis_data.push(e.date);
                series.UV.push(e.UV);
                series.inquiryUV.push(e.inquiryUV);
                series.inquirySuccessUV.push(e.inquirySuccessUV);
                series.tradeMethodUV.push(e.tradeMethodUV);
                series.paymentMethodUV.push(e.paymentMethodUV);
                series.tradeUV.push(e.tradeUV);
                series.inquUv.push(((e.inquiryUV/e.UV)*100).toFixed(2));
                series.inquSuUv.push((e.inquirySuccessUV/e.UV*100).toFixed(2));
                series.traMeUv.push((e.tradeMethodUV/e.UV*100).toFixed(2));
                series.payMeUv.push((e.paymentMethodUV/e.UV*100).toFixed(2));
                series.traUv.push((e.tradeUV/e.UV*100).toFixed(2));
                series.leftHomeRatio.push((e.leftHomeRatio*100).toFixed(2));
                break;
            default:
                break;
        }
    });

    var option = {
        title: {
            text: 'M版历史流量',
            x: "center",
            y: "bottom"
        },
        tooltip: {
            trigger: 'axis',
            formatter:function(params,ticket,callback){
                var str = params[0].name + '<br/>';
                params.forEach(function(obj){
                    if(obj.seriesName.indexOf("率")>-1){
                        str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                    }else{
                        str += obj.seriesName + ' : ' + obj.value + '<br/>'
                    }
                });
                return str;
            }
        },
        legend: {
            fromatter:function(name){
                return name;
            },
            selected:{
             '总访客数':true,
             '询价访客数':true,
             '询价完成访客数':true,
             '选择交易方式访客数':true,
             '选择支付方式访客数':true,
             '提交成功访客数':true,
             '询价转化率':true,
             '询价完成转化率':true,
             '选择交易方式转化率':true,
             '选择支付方式转化率':true,
             '提交成功转化率':true,
             '首页跳出率':true
            },
            data: ['总访客数',
             '询价访客数',
             '询价完成访客数',
             '选择交易方式访客数',
             '选择支付方式访客数',
             '提交成功访客数',
             '询价转化率',
             '询价完成转化率',
             '选择交易方式转化率',
             '选择支付方式转化率',
             '提交成功转化率',
             '首页跳出率']
        },
        grid: {
            show: false,
            left: '3%',
            right: '4%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            boundaryGap: false,
            data: xAxis_data
        },
        yAxis: [
            {
                type: 'value'
            },
            {
                  type: 'value',
                  axisLabel: {
                      formatter: function (value, index) {
                          if (value == 0) {
                              return value
                          }
                          return value+"%"
                      }
                  }
              }
        ],
        series: [
            {
                name: '总访客数',
                type: 'line',
                data: series.UV
            },
            {
                name: '询价访客数',
                type: 'line',
                data: series.inquiryUV
            },
            {
                name: '询价转化率',
                type: 'line',
                yAxisIndex: 1,
                data: series.inquUv
            },
            {
                name: '询价完成访客数',
                type: 'line',
                data: series.inquirySuccessUV
            },
            {
                name: '询价完成转化率',
                type: 'line',
                yAxisIndex: 1,
                data: series.inquSuUv
            },
            {
                name: '选择交易方式访客数',
                type: 'line',
                data: series.tradeMethodUV
            },
            {
                name: '选择交易方式转化率',
                type: 'line',
                yAxisIndex: 1,
                data: series.traMeUv
            },
            {
                name: '选择支付方式访客数',
                type: 'line',
                data: series.paymentMethodUV
            },
             {
                 name: '选择支付方式转化率',
                 type: 'line',
                 yAxisIndex: 1,
                 data: series.payMeUv
             },
            {
                name: '提交成功访客数',
                type: 'line',
                data: series.tradeUV
            },
             {
                 name: '提交成功转化率',
                 type: 'line',
                 yAxisIndex: 1,
                 data: series.traUv
             },
             {
                 name: '首页跳出率',
                 type: 'line',
                 yAxisIndex: 1,
                 data: series.leftHomeRatio
             }
        ]
    };
    var trafficStackChart = echarts.init(document.getElementById('webTrafficStackChartWap'));
    trafficStackChart.setOption(option);
    window.onresize=function(){
        trafficStackChart.resize();
    }
}

function pickWebTrafficFunnelDateRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.dateSelectLabel').html(sdt+"~"+edt);

    $(".webTrafficFunnelDate").show();
    $(".webTrafficFunnelWeek").hide();
    $(".webTrafficFunnelMonth").hide();
    dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g,"").split("~");
    var startDate = dt[0];
    var endDate = dt[1];
    var query = {
        "startDate": startDate,
        "endDate": endDate
    };
    requestURL(dataService + "/webTraffic/productTrafficFunnel", query).done(function (data) {
        getValue(data);
    });
}

function pickWebTrafficFunnelWeekRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.weekSelectLabel').html(sdt+"~"+edt);

    $(".webTrafficFunnelDate").hide();
    $(".webTrafficFunnelWeek").show();
    $(".webTrafficFunnelMonth").hide();
    dt = $('.desktop-only .weekSelectLabel').text().replace(/ /g,"").split("~");
    var startDate = dt[0];
    var endDate = dt[1];
    var query = {
        "startDate": startDate,
        "endDate": endDate
    };
    requestURL(dataService + "/webTraffic/productTrafficFunnelWeek", query).done(function (data) {
        getValue(data);
    });
}

function pickWebTrafficFunnelMonthRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.monthSelectLabel').html(sdt+"~"+edt);

    $(".webTrafficFunnelDate").hide();
    $(".webTrafficFunnelWeek").hide();
    $(".webTrafficFunnelMonth").show();
    dt = $('.desktop-only .monthSelectLabel').text().replace(/ /g,"").split("~");
    var startDate = dt[0];
    var endDate = dt[1];
    var query = {
        "startDate": startDate,
        "endDate": endDate
    };
    requestURL(dataService + "/webTraffic/productTrafficFunnelMonth", query).done(function (data) {
        getValue(data);
    });
}