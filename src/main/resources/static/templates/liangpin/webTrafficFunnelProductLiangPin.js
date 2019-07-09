Template.webTrafficFunnelProductLiangPin.rendered = function () {
    $('.navi-tab').removeClass('active');
     $('#liangpin').addClass('active');
     $('#webTrafficFunnelProductLiangPin').addClass('active');
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
        getValue();
    });

    getValue();
};

function pickWebTrafficFunnelDateRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    //console.log("111111"+sdt+edt)
    $('.dateSelectLabel').html(sdt+"~"+edt);

    getValue();

//    $(".webTrafficFunnelDate").show();
//    $(".webTrafficFunnelWeek").hide();
//    $(".webTrafficFunnelMonth").hide();
//    dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g,"").split("~");
//    var startDate = dt[0];
//    var endDate = dt[1];
//    var query = {
//        "startDate": startDate,
//        "endDate": endDate
//    };
//    requestURL(dataService + "/webTraffic/productTrafficFunnel", query).done(function (data) {
//        getValue(data);
//    });
}

function pickWebTrafficFunnelWeekRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.weekSelectLabel').html(sdt+"~"+edt);

    getValue();
}

function pickWebTrafficFunnelMonthRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.monthSelectLabel').html(sdt+"~"+edt);

    getValue();
}

var pcCount,mCount,pcmCount;

function getValue(){
        var dateType =$(".dateType").val();
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
            requestURL(dataService + "/lianpin/getProductTradeWebTraffic", query).done(function (data) {
                drawWebTrafficFunnelChartPortal(data);
                drawWebTrafficFunnelChartWap(data);

                drawWebTrafficFunnelSummaryChartPortal(data,endDate);
                drawWebTrafficFunnelSummaryChartWap(data,endDate);

                renderTable(data);
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
            requestURL(dataService + "/lianpin/getProductTradeWebTrafficWeek", query).done(function (data) {
                drawWebTrafficFunnelChartPortal(data);
                drawWebTrafficFunnelChartWap(data);

                drawWebTrafficFunnelSummaryChartPortal(data,endDate);
                drawWebTrafficFunnelSummaryChartWap(data,endDate);

                renderTable(data);
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
            requestURL(dataService + "/lianpin/getProductTradeWebTrafficMonth", query).done(function (data) {
                drawWebTrafficFunnelChartPortal(data);
                drawWebTrafficFunnelChartWap(data);

                drawWebTrafficFunnelSummaryChartPortal(data,endDate);
                drawWebTrafficFunnelSummaryChartWap(data,endDate);

                renderTable(data);
            });
        }
}


function renderTable(data){
        var xAxis_data = [];
        var series = {
            url:[],
            uv: [],
            productDetailPageCnt: [],
            selectServicePageCnt: [],
            tradeAddressPageCnt: [],
            selectPaymentPageCnt: [],
            paidSuccessPageCnt: [],
        };
        data.forEach(function (e) {
                    xAxis_data.push(e.date);
                    series.url.push(e.url);
                    series.uv.push(e.uv);
                    series.productDetailPageCnt.push(e.productDetailPageCnt);
                    series.selectServicePageCnt.push(e.selectServicePageCnt);
                    series.tradeAddressPageCnt.push(e.tradeAddressPageCnt);
                    series.selectPaymentPageCnt.push(e.selectPaymentPageCnt);
                    series.paidSuccessPageCnt.push(e.paidSuccessPageCnt);
        });

        var obj = getCalcData(data);
        var tableJson = [];

        for(var i= 0,len=xAxis_data.length;i<len;i++){
            var tmp = {
                "date":xAxis_data[i],
                "url":series.url[i],
                "uv":series.uv[i],
                "productDetailPageCnt":series.productDetailPageCnt[i],
                "selectServicePageCnt":series.selectServicePageCnt[i],
                "tradeAddressPageCnt":series.tradeAddressPageCnt[i],
                "selectPaymentPageCnt":series.selectPaymentPageCnt[i],
                "paidSuccessPageCnt":series.paidSuccessPageCnt[i],
            };
            tableJson.push(tmp);
        }

        var fixRow2 = '"<tr style="background-color: #acc087;"", " ", "", "", " data-index="0"", "", "", ">", "<td  style=""    >总数</td>", "<td  style=""    >-</td>","<td  style=""    >'+obj.uv+'</td>", "<td  style=""    >'+obj.productDetailPageCnt+'</td>", "<td  style=""    >'+obj.selectServicePageCnt+'</td>", "<td  style=""    >'+obj.tradeAddressPageCnt+'</td>", "<td  style=""    >'+obj.selectPaymentPageCnt+'</td>", "<td  style=""    >'+obj.paidSuccessPageCnt+'</td>","</tr>"'
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
                field: 'url',
                title: '网址',
                sortable:true
            }, {
                field: 'uv',
                title: '总访客数',
                sortable:true
            }, {
                field: 'productDetailPageCnt',
                title: '产品详情页面访客数',
                sortable:true
            }, {
                field: 'selectServicePageCnt',
                title: '选择服务方式访客数',
                sortable:true
            }, {
                field: 'tradeAddressPageCnt',
                title: '核对订单信息页面访客数',
                sortable:true
            }, {
                field: 'selectPaymentPageCnt',
                title: '选择支付方式访客数',
                sortable:true
            }, {
                field: 'paidSuccessPageCnt',
                title: '交易成功用户数',
                sortable:true
            }
            ],
        });
}

//获取总的计算数据
function getCalcData(data){
    var uv= 0;
    var productDetailPageCnt =0;
    var selectServicePageCnt =0;
    var tradeAddressPageCnt = 0;
    var selectPaymentPageCnt = 0;
    var paidSuccessPageCnt = 0;
    data.forEach(function (e) {
        uv += e.uv;
        productDetailPageCnt += e.productDetailPageCnt;
        selectServicePageCnt += e.selectServicePageCnt;
        tradeAddressPageCnt += e.tradeAddressPageCnt;
        selectPaymentPageCnt += e.selectPaymentPageCnt;
        paidSuccessPageCnt += e.paidSuccessPageCnt;
    });
    return {"uv":uv,"productDetailPageCnt":productDetailPageCnt,"selectServicePageCnt":selectServicePageCnt,"tradeAddressPageCnt":tradeAddressPageCnt,"selectPaymentPageCnt":selectPaymentPageCnt,"paidSuccessPageCnt":paidSuccessPageCnt}
}


//PC官网柱状图

function drawWebTrafficFunnelSummaryChartPortal(data,nowdate) {

    var portalData = [];
    var selectDate = nowdate;
    var dataType=$(".dateType").val(),selectDate2;
    if(dataType=="daily"){
        selectDate2=selectDate;
    }else if(dataType=="weekly"){
        selectDate2=selectDate+"~"+(new Date(selectDate).getNewDate(7));
    }else
        selectDate2=selectDate+"~"+(new moment(selectDate).endOf('month').format('YYYY-MM-DD'));
    data.forEach(function (e) {
        switch (e.url) {
            case "http://www.aiershou.com":
                switch (e.date){
                    case nowdate:
                        pcCount=e.uv;
                        portalData.push(e.uv);
                        portalData.push(e.productDetailPageCnt);
                        portalData.push(e.selectServicePageCnt);
                        portalData.push(e.tradeAddressPageCnt);
                        portalData.push(e.selectPaymentPageCnt);
                        portalData.push(e.paidSuccessPageCnt);
                        break;
                }
                break;
        }
    });

    var yData = ['总访客数',
            "商品详情页面转化率"+(portalData[1] / portalData[0] * 100).toFixed(2) + '%\n 商品详情页面访客数',
            "选择服务页面转化率"+(portalData[2] / portalData[0] * 100).toFixed(2) + '%\n 选择服务页面访客数',
            "核对订单信息页面转化率"+(portalData[3] / portalData[0] * 100).toFixed(2) + '%\n 核对订单信息页面访客数',
            "选择支付方式转化率"+(portalData[4] / portalData[0] * 100).toFixed(2) + '%\n 选择支付方式访客数',
            "交易成功转化率"+(portalData[5] / portalData[0] * 100).toFixed(2) + '%\n 交易成功用户数'].reverse();

    var option = {
        title: {
            text: '官网流量漏斗'+"("+selectDate2+")",
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
            right: '6%',
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
    window.addEventListener('resize',webTrafficFunnelSummaryChart.resize)
}

//M版柱状图

function drawWebTrafficFunnelSummaryChartWap(data,nowdate) {

    var wapData = [];
    var selectDate=nowdate;
    var dataType=$(".dateType").val(),selectDate2;
    if(dataType=="daily"){
        selectDate2=selectDate;
    }else if(dataType=="weekly"){
        selectDate2=selectDate+"~"+(new Date(selectDate).getNewDate(7));
    }else
        selectDate2=selectDate+"~"+(new moment(selectDate).endOf('month').format('YYYY-MM-DD'));
    data.forEach(function (e) {
        switch (e.url) {
            case "http://m.aiershou.com":
                switch (e.date){
                    case nowdate:
                        mCount=e.uv;
                        wapData.push(e.uv);
                        wapData.push(e.productDetailPageCnt);
                        wapData.push(e.tradeAddressPageCnt);
                        wapData.push(e.selectPaymentPageCnt);
//                        wapData.push(e.selectServicePageCnt);
                        wapData.push(e.paidSuccessPageCnt);
                        pcmCount=pcCount+mCount;
                        $("#UVCount").html("PC版和M版的总访客数："+pcmCount);
                        break;
                }
                break;
        }
    });

    var yData = ['访问UV',
        "商品详情页面转化率"+(wapData[1] / wapData[0] * 100).toFixed(2) + '%\n 商品详情页面访客数',
        "核对订单信息页面转化率"+(wapData[2] / wapData[0] * 100).toFixed(2) + '%\n 核对订单信息页面访客数',
        "选择支付方式转化率"+(wapData[3] / wapData[0] * 100).toFixed(2) + '%\n 选择支付方式访客数',
        "交易成功转化率"+(wapData[4] / wapData[0] * 100).toFixed(2) + '%\n 交易成功用户数'].reverse();

    var option = {
        title: {
            text: 'M版流量漏斗'+"("+selectDate2+")",
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
            right: '6%',
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
    window.addEventListener('resize',webTrafficFunnelSummaryChart.resize)
}

//PC版折线图

function drawWebTrafficFunnelChartPortal(data) {

    var xAxis_data = [];
    var series = {
        uv: [],
        productDetailPageCnt: [],
        productDetailPageCntUVRate: [],
        tradeAddressPageCnt: [],
        tradeAddressPageCntUVRate: [],
        selectPaymentPageCnt: [],
        selectPaymentPageCntUVRate: [],
        selectServicePageCnt: [],
        selectServicePageCntUVRate: [],
        paidSuccessPageCnt: [],
        paidSuccessPageCntUVRate: []
    };
    data.forEach(function (e) {
        switch (e.url) {
            case "http://www.aiershou.com":
                xAxis_data.push(e.date);
                series.uv.push(e.uv);
                series.productDetailPageCnt.push(e.productDetailPageCnt);
                series.productDetailPageCntUVRate.push(((e.productDetailPageCnt/ e.uv)*100).toFixed(2));
                series.tradeAddressPageCnt.push(e.tradeAddressPageCnt);
                series.tradeAddressPageCntUVRate.push(((e.tradeAddressPageCnt/ e.uv)*100).toFixed(2));
                series.selectPaymentPageCnt.push(e.selectPaymentPageCnt);
                series.selectPaymentPageCntUVRate.push(((e.selectPaymentPageCnt/ e.uv)*100).toFixed(2));
                series.selectServicePageCnt.push(e.selectServicePageCnt);
                series.selectServicePageCntUVRate.push(((e.selectServicePageCnt/ e.uv)*100).toFixed(2));
                series.paidSuccessPageCnt.push(e.paidSuccessPageCnt);
                series.paidSuccessPageCntUVRate.push(((e.paidSuccessPageCnt/ e.uv)*100).toFixed(2));
                break;
            default:
                break;
        }
    });

    var option = {
        title: {
            text: '官网历史流量(近30天)',
            x: "center",
            y: "bottom"
        },
        tooltip: {
            trigger: 'axis',
            formatter:function(params,ticket,callback){
                var str = (params[1]?params[1]:params[0]).name + '<br/>';
                params.forEach(function(obj){
                    if(obj.seriesName.indexOf("率")>-1){
                        str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                    }else if(obj.seriesName.indexOf("全选")>-1){
                        str+='数据如下：'+'<br/>'
                    }else{
                        str += obj.seriesName + ' : ' + obj.value + '<br/>'
                    }
                });
                return str;
            }
        },
        legend: {
            data: [{name:'全选',icon: 'circle'},'总访客数', '商品详情页面访客数','选择服务页面访客数', '核对订单信息页面访客数', '选择支付方式访客数', '交易成功用户数','商品详情页面转化率', '选择服务页面转化率', '核对订单信息页面转化率', '选择支付方式转化率', '交易成功转化率']
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
        yAxis: [{
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
            }],
        series: [
            {
                name:'全选',
                type:'line',
                data:[]
            },
            {
                name: '总访客数',
                type: 'line',
                data: series.uv
            },
            {
                name: '商品详情页面访客数',
                type: 'line',
                data: series.productDetailPageCnt
            },
            {
                name: '选择服务页面访客数',
                type: 'line',
                data: series.selectServicePageCnt
            },
            {
                name: '核对订单信息页面访客数',
                type: 'line',
                data: series.tradeAddressPageCnt
            },
            {
                name: '选择支付方式访客数',
                type: 'line',
                data: series.selectPaymentPageCnt
            },
             {
                 name: '交易成功用户数',
                 type: 'line',
                 data: series.paidSuccessPageCnt
             },
            {
                name: '商品详情页面转化率',
                type: 'line',
                yAxisIndex: 1,
                data: series.productDetailPageCntUVRate
            },
            {
                name: '选择服务页面转化率',
                type: 'line',
                yAxisIndex: 1,
                data: series.selectServicePageCntUVRate
            },
            {
                name: '核对订单信息页面转化率',
                type: 'line',
                yAxisIndex: 1,
                data: series.tradeAddressPageCntUVRate
            },
            {
                name: '选择支付方式转化率',
                type: 'line',
                yAxisIndex: 1,
                data: series.selectPaymentPageCntUVRate
            },
            {
                name: '交易成功转化率',
                type: 'line',
                yAxisIndex: 1,
                data: series.paidSuccessPageCntUVRate
            }
        ]
    };
    var trafficStackChart = echarts.init(document.getElementById('webTrafficStackChartPortal'));
    trafficStackChart.setOption(option);
    window.addEventListener('resize',trafficStackChart.resize)

    trafficStackChart.on('legendselectchanged',function(params){
        //var legendDict = params.selected;
        //var tmpObj = {}
        //for(var key in legendDict){
        //    if(legendDict[key]){
        //        tmpObj[key]
        //    }
        //}
        var all=params.selected;
        var key = params.name;
        option.legend.selected={};
        if(key=='全选'&&params.selected[key]==true){
            for(var a in all){
                all[a]=true;
            }
            //option.legend.selected={'全选':true,'总访客数':true,'门店回收访客数':true,'询价访客数':true,'询价完成访客数':true,'选择回收方式访客数':true,'选择支付方式访客数':true,'提交成功访客数':true,'询价转化率':true,'询价完成转化率':true,'询价完成率':true,'选择回收方式转化率':true,'选择回收方式率':true,'选择支付方式转化率':true,'选择支付方式率':true,'提交成功转化率':true,'提交成功率':true};
        }else if(key=='全选'&&params.selected[key]==false)
        {
            for(var a in all){
                all[a]=false;
            }
            //option.legend.selected={'全选':false,'总访客数':false,'门店回收访客数':false,'询价访客数':false,'询价完成访客数':false,'选择回收方式访客数':false,'选择支付方式访客数':false,'提交成功访客数':false,'询价转化率':false,'询价完成转化率':false,'询价完成率':false,'选择回收方式转化率':false,'选择回收方式率':false,'选择支付方式转化率':false,'选择支付方式率':false,'提交成功转化率':false,'提交成功率':false};
        }
        option.legend.selected=all;
        trafficStackChart.setOption(option);
    });
}

//M版折线图

function drawWebTrafficFunnelChartWap(data) {

    var xAxis_data = [];
    var series = {
        uv: [],
        productDetailPageCnt: [],
        productDetailPageCntUVRate: [],
        tradeAddressPageCnt: [],
        tradeAddressPageCntUVRate: [],
        selectPaymentPageCnt: [],
        selectPaymentPageCntUVRate: [],
        paidSuccessPageCnt: [],
        paidSuccessPageCntUVRate: []
    };
    data.forEach(function (e) {
        switch (e.url) {
            case "http://m.aiershou.com":
                xAxis_data.push(e.date);
                series.uv.push(e.uv);
                series.productDetailPageCnt.push(e.productDetailPageCnt);
                series.productDetailPageCntUVRate.push(((e.productDetailPageCnt/ e.uv)*100).toFixed(2));
                series.tradeAddressPageCnt.push(e.tradeAddressPageCnt);
                series.tradeAddressPageCntUVRate.push(((e.tradeAddressPageCnt/ e.uv)*100).toFixed(2));
                series.selectPaymentPageCnt.push(e.selectPaymentPageCnt);
                series.selectPaymentPageCntUVRate.push(((e.selectPaymentPageCnt/ e.uv)*100).toFixed(2));
                series.paidSuccessPageCnt.push(e.paidSuccessPageCnt);
                series.paidSuccessPageCntUVRate.push(((e.paidSuccessPageCnt/ e.uv)*100).toFixed(2));
                break;
            default:
                break;
        }
    });

    var option = {
        title: {
            text: 'M版历史流量(近30天)',
            x: "center",
            y: "bottom"
        },
        tooltip: {
            trigger: 'axis',
            formatter:function(params,ticket,callback){
                var str = (params[1]?params[1]:params[0]).name + '<br/>';
                params.forEach(function(obj){
                    if(obj.seriesName.indexOf("率")>-1){
                        str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                    }else if(obj.seriesName.indexOf("全选")>-1){
                        str+='数据如下：'+'<br/>'
                    }else{
                        str += obj.seriesName + ' : ' + obj.value + '<br/>'
                    }
                });
                return str;
            }
        },
        legend: {
            data: [{name:'全选',icon: 'circle'},'总访客数', '商品详情页面访客数', '核对订单信息页面访客数', '选择支付方式访客数', '交易成功用户数','商品详情页面转化率', '核对订单信息页面转化率', '选择支付方式转化率', '交易成功转化率']
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
        yAxis: [{
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
            }],
        series: [
            {
            name:'全选',
            type:'line',
            data:[]
            },
            {
                name: '总访客数',
                type: 'line',
                data: series.uv
            },
            {
                name: '商品详情页面访客数',
                type: 'line',
                data: series.productDetailPageCnt
            },
            {
                name: '核对订单信息页面访客数',
                type: 'line',
                data: series.tradeAddressPageCnt
            },
            {
                name: '选择支付方式访客数',
                type: 'line',
                data: series.selectPaymentPageCnt
            },
//            {
//                name: '选择支付方式用户数',
//                type: 'line',
//                data: series.selectServicePageCnt
//            },
            {
                name: '交易成功用户数',
                type: 'line',
                data: series.paidSuccessPageCnt
            },
            {
                name: '商品详情页面转化率',
                type: 'line',
                yAxisIndex: 1,
                data: series.productDetailPageCntUVRate
            },
            {
                name: '核对订单信息页面转化率',
                type: 'line',
                yAxisIndex: 1,
                data: series.tradeAddressPageCntUVRate
            },
            {
                name: '选择支付方式转化率',
                type: 'line',
                yAxisIndex: 1,
                data: series.selectPaymentPageCntUVRate
            },
            {
                name: '交易成功转化率',
                type: 'line',
                yAxisIndex: 1,
                data: series.paidSuccessPageCntUVRate
            }
        ]
    };
    var trafficStackChart = echarts.init(document.getElementById('webTrafficStackChartWap'));
    trafficStackChart.setOption(option);
    window.addEventListener('resize',trafficStackChart.resize)

    trafficStackChart.on('legendselectchanged',function(params){
        //var legendDict = params.selected;
        //var tmpObj = {}
        //for(var key in legendDict){
        //    if(legendDict[key]){
        //        tmpObj[key]
        //    }
        //}
        var all=params.selected;
        var key = params.name;
        option.legend.selected={};
        if(key=='全选'&&params.selected[key]==true){
            for(var a in all){
                all[a]=true;
            }
            //option.legend.selected={'全选':true,'总访客数':true,'门店回收访客数':true,'询价访客数':true,'询价完成访客数':true,'选择回收方式访客数':true,'选择支付方式访客数':true,'提交成功访客数':true,'询价转化率':true,'询价完成转化率':true,'询价完成率':true,'选择回收方式转化率':true,'选择回收方式率':true,'选择支付方式转化率':true,'选择支付方式率':true,'提交成功转化率':true,'提交成功率':true};
        }else if(key=='全选'&&params.selected[key]==false)
        {
            for(var a in all){
                all[a]=false;
            }
            //option.legend.selected={'全选':false,'总访客数':false,'门店回收访客数':false,'询价访客数':false,'询价完成访客数':false,'选择回收方式访客数':false,'选择支付方式访客数':false,'提交成功访客数':false,'询价转化率':false,'询价完成转化率':false,'询价完成率':false,'选择回收方式转化率':false,'选择回收方式率':false,'选择支付方式转化率':false,'选择支付方式率':false,'提交成功转化率':false,'提交成功率':false};
        }
        option.legend.selected=all;
        trafficStackChart.setOption(option);
    });
}