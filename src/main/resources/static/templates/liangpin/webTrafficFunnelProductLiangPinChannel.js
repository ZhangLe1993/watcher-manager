Template.webTrafficFunnelProductLiangPinChannel.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#liangpin').addClass('active');
    $('#webTrafficFunnelProductLiangPinChannel').addClass('active');

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    $("#loading").show();
    $(".template-dashboard").hide();

    var dateGap = -14;
    var minWeekDate = "2016-07-03";
    var minMonthDate = "2016-07-01";
    var endDate = new Date().getNewDate(-1);
    var startDate = new Date(endDate).getNewDate(dateGap);
    var startWeekDate = moment().weekday(-14).format("YYYY-MM-DD")
    var endWeekDate = moment().weekday(-7).format("YYYY-MM-DD")
    if (startWeekDate < minWeekDate) {
        startWeekDate = minWeekDate;
    }
    var startMonthDate = moment().subtract(1, 'month').startOf('month').format("YYYY-MM-DD");
    var endMonthDate = moment().subtract(1, 'month').startOf('month').format("YYYY-MM-DD");
    if (startMonthDate < minMonthDate) {
        startMonthDate = minMonthDate;
    }
    var transformDate = function (date) {
        var dateStrArray = date.split('-');
        return dateStrArray[1] + '/' + dateStrArray[2] + '/' + dateStrArray[0]
    };


    //选项卡
    renderFilterOption()


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


    $(".dateSelectLabel").html(startDate + "~" + endDate);
    $('.webTrafficFunnelDate').daterangepicker(datePickerOptions, pickWebTrafficFunnelDateRangeCallback);

    var weekPickerOptions = {
        onlyShowfirstDayOfWeek: true,
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

    $(".weekSelectLabel").html(startWeekDate + "~" + endWeekDate);
    $('.webTrafficFunnelWeek').daterangepicker(weekPickerOptions, pickWebTrafficFunnelWeekRangeCallback);

    var monthPickerOptions = {
        onlyShowfirstDayOfMonth: true,
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

    $(".monthSelectLabel").html(startMonthDate + "~" + endMonthDate);
    $('.webTrafficFunnelMonth').daterangepicker(monthPickerOptions, pickWebTrafficFunnelMonthRangeCallback);

    $(".webTrafficFunnelDate").show();
    $(".webTrafficFunnelWeek").hide();
    $(".webTrafficFunnelMonth").hide();
    //$(".dateType").on('change',function(){
    //    getValue();
    //});
    showPage()
    $(".search").click(function () {
        $("#loading").show();
        $(".template-dashboard").hide();
        showPage()
    })


};

function showPage() {

    var dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g, "").split("~");
    var startDate = dt[0];
    var endDate = dt[1];
    var area = $(".area").val()
    var cityName = $(".cityName").val()
    var platform = $(".platform").val()
    var channel = $(".channel").val()
    var utm_source = $(".utm_source").val()
    var utm_medium = $(".utm_medium").val()
    var utm_campaign = $(".utm_campaign").val()
    var utm_position = $(".utm_position").val()

    var query = {
        "startDate": startDate,
        "endDate": endDate,
        "area": area,
        "cityName": cityName,
        "platform": platform,
        "channel": channel,
        "utm_source": utm_source,
        "utm_medium": utm_medium,
        "utm_campaign": utm_campaign,
        "utm_position": utm_position
    };
        console.log(query)
    requestURL(dataService + "/lianpin/getProductTradeWebTrafficChannel", query).done(function (data) {
        $("#loading").hide();
        $(".template-dashboard").show();
        //
        drawWebTrafficFunnelChartPortal(data.sums);
        //drawWebTrafficFunnelChartWap(data.sums);
        drawWebTrafficFunnelSummaryChartPortal(data.sums, endDate);
        //drawWebTrafficFunnelSummaryChartWap(data.sums,endDate);
        renderTable(data["detail"]);


    });
}


function renderFilterOption() {

    requestURL(dataService + "/lianpin/getProductTradeWebTrafficChannel_FilterOption", {}).done(function (data) {

        $(".area,.cityName,.platform,.channel,.utm_source,.utm_medium,.utm_campaign,.utm_position").attr("multiple", "multiple")

        renderOp(".area", ["暂无"])
        renderOp(".cityName", data.cityName)
        renderOp(".platform", data.platform)
        renderOp(".channel", data.channel)
        renderOp(".utm_source", data.utm_source)
        renderOp(".utm_medium", data.utm_medium)
        renderOp(".utm_campaign", data.utm_campaign)
        renderOp(".utm_position", data.utm_position)

        $(".area,.cityName,.platform,.channel,.utm_source,.utm_medium,.utm_campaign,.utm_position").multipleSelect({
            placeholder: "全部",
            selectAllText: "全部",
            width: 150,
            selectAll: true
        });
    })


}
function renderOp(className, data) {
    data.forEach(function (e) {
        $(className).append('<option value="' + e + '" >' + e + '</option>');

    })
}

function pickWebTrafficFunnelDateRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    console.log("111111" + sdt + edt)
    $('.dateSelectLabel').html(sdt + "~" + edt);

}

function pickWebTrafficFunnelWeekRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.weekSelectLabel').html(sdt + "~" + edt);
}

function pickWebTrafficFunnelMonthRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.monthSelectLabel').html(sdt + "~" + edt);
}

var pcCount, mCount, pcmCount;


function renderTable(data) {
    var obj = getCalcData(data);
    var fixRow2 = '"<tr style="background-color: #acc087;"", " ", "", "", " data-index="0"", "", "", ">", "<td  style=""    >总数</td>", "<td  style=""    >-</td>", "<td  style=""    >-</td>", "<td  style=""    >-</td>", "<td  style=""    >-</td>", "<td  style=""    >-</td>", "<td  style=""    >-</td>", "<td  style=""    >-</td>", "<td  style=""    >' + obj.uv + '</td>", "<td  style=""    >' + obj.productDetailPagePv + '</td>",  "<td  style=""    >' + obj.productDetailPageCnt + '</td>", "<td  style=""    >' + obj.selectServicePageCnt + '</td>", "<td  style=""    >' + obj.tradeAddressPageCnt + '</td>", "<td  style=""    >' + obj.selectPaymentPageCnt + '</td>", "<td  style=""    >' + obj.paidSuccessPageCnt + '</td>","</tr>"'
    $('#table').bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        //pagination: true,
        fixRow: fixRow2,
        data: data,
        columns: [{
            field: 'date',
            title: '日期',
            sortable: true
        }, {
            field: 'cityName',
            title: '城市',
            sortable: true,

        }, {
            field: 'platform',
            title: '平台',
            sortable: true,

        },{
            field: 'channel',
            title: '渠道',
            sortable: true,

        },{
            field: 'utm_source',
            title: 'utm_source',
            sortable: true
        }, {
            field: 'utm_medium',
            title: 'utm_medium',
            sortable: true
        }, {
            field: 'utm_campaign',
            title: 'utm_campaign',
            sortable: true
        },{
            field: 'utm_position',
            title: 'utm_position',
            sortable: true
        }, {
            field: 'uv',
            title: '总访客数',
            sortable: true
        }, {
            field: 'productDetailPagePv',
            title: '产品详情页面pv',
            sortable: true
        }, {
            field: 'productDetailPageCnt',
            title: '产品详情页面访客数',
            sortable: true
        },{
            field: 'selectServicePageCnt',
            title: '选择服务方式访客数',
            sortable: true
        }, {
            field: 'tradeAddressPageCnt',
            title: '核对订单信息页面访客数',
            sortable: true
        }, {
            field: 'selectPaymentPageCnt',
            title: '选择支付方式访客数',
            sortable: true
        }, {
            field: 'paidSuccessPageCnt',
            title: '交易成功用户数',
            sortable: true
        }
        ],
    });
}

//获取总的计算数据
function getCalcData(data) {
    var uv = 0;
    var productDetailPagePv = 0;
    var productDetailPageCnt = 0;
    var selectServicePageCnt = 0;
    var tradeAddressPageCnt = 0;
    var selectPaymentPageCnt = 0;
    var paidSuccessPageCnt = 0;
    data.forEach(function (e) {
        uv += parseInt(e.uv);
        productDetailPagePv += parseInt(e.productDetailPagePv);
        productDetailPageCnt += parseInt(e.productDetailPageCnt);
        selectServicePageCnt += parseInt(e.selectServicePageCnt);
        tradeAddressPageCnt += parseInt(e.tradeAddressPageCnt);
        selectPaymentPageCnt += parseInt(e.selectPaymentPageCnt);
        paidSuccessPageCnt += parseInt(e.paidSuccessPageCnt);
    });
    return {
        "uv": uv,
        "productDetailPagePv": productDetailPagePv,
        "productDetailPageCnt": productDetailPageCnt,
        "selectServicePageCnt": selectServicePageCnt,
        "tradeAddressPageCnt": tradeAddressPageCnt,
        "selectPaymentPageCnt": selectPaymentPageCnt,
        "paidSuccessPageCnt": paidSuccessPageCnt
    }
}


//PC官网柱状图

function drawWebTrafficFunnelSummaryChartPortal(data, nowdate) {

   /* var portalData = [];
    var selectDate = nowdate;
    var dataType = $(".dateType").val(), selectDate2;
    if (dataType == "daily") {
        selectDate2 = selectDate;
    } else if (dataType == "weekly") {
        selectDate2 = selectDate + "~" + (new Date(selectDate).getNewDate(7));
    } else
        selectDate2 = selectDate + "~" + (new moment(selectDate).endOf('month').format('YYYY-MM-DD'));*/

    var uv = 0
    var productDetailPagePv = 0
    var productDetailPageCnt = 0
    var selectServicePageCnt = 0
    var tradeAddressPageCnt = 0
    var selectPaymentPageCnt = 0
    var paidSuccessPageCnt = 0


    data.forEach(function (e) {
        uv += parseInt(e.uv);
        productDetailPagePv += parseInt(e.productDetailPagePv);
        productDetailPageCnt += parseInt(e.productDetailPageCnt);
        selectServicePageCnt += parseInt(e.selectServicePageCnt);
        tradeAddressPageCnt += parseInt(e.tradeAddressPageCnt);
        selectPaymentPageCnt += parseInt(e.selectPaymentPageCnt);
        paidSuccessPageCnt += parseInt(e.paidSuccessPageCnt);
    });
    var xData=[uv,productDetailPagePv,productDetailPageCnt,selectServicePageCnt,tradeAddressPageCnt,selectPaymentPageCnt,paidSuccessPageCnt]
    var yData = ['总访客数',
        "商品详情页面pv",
        "商品详情页面转化率" + (productDetailPageCnt / uv * 100).toFixed(2) + '%\n 商品详情页面uv',
        "选择服务页面率" + (selectServicePageCnt / uv * 100).toFixed(2) + '%\n 选择服务页面访客数',
        "核对订单信息页面率" + (tradeAddressPageCnt / uv * 100).toFixed(2) + '%\n 核对订单信息页面访客数',
        "选择支付方式率" + (selectPaymentPageCnt / uv * 100).toFixed(2) + '%\n 选择支付方式访客数',
        "交易成功率" + (paidSuccessPageCnt / uv * 100).toFixed(2) + '%\n 交易成功用户数'].reverse();

    var option = {
        title: {
            text: '流量漏斗',
            x: "center",
            //y: "bottom"
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function (params, ticket, callback) {
                var str;
                params.forEach(function (obj) {
                    //console.log(obj)
                    var objf = obj.name.split(" ")
                    if (objf.length>1) {
                       /* objf.forEach(function(d){
                            str+=" </br>"+d;
                        })*/

                        str =objf[0]+"<br/>"+objf[1]+' : ' + obj.value + '<br/>';
                    } else {
                        str = obj.name + ' : ' + obj.value + '<br/>';
                    }
                });
                return (str)
            }
        },
        grid: {
            show: false,
            left: '0',
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
                data: xData.reverse()
            }

        ]
    };

    var webTrafficFunnelSummaryChart = echarts.init(document.getElementById('webTrafficFunnelSummaryChartPortal'));
    webTrafficFunnelSummaryChart.setOption(option)
    window.addEventListener('resize', webTrafficFunnelSummaryChart.resize)
}

//M版柱状图

function drawWebTrafficFunnelSummaryChartWap(data, nowdate) {

    var wapData = [];
    var selectDate = nowdate;
    var dataType = $(".dateType").val(), selectDate2;
    if (dataType == "daily") {
        selectDate2 = selectDate;
    } else if (dataType == "weekly") {
        selectDate2 = selectDate + "~" + (new Date(selectDate).getNewDate(7));
    } else
        selectDate2 = selectDate + "~" + (new moment(selectDate).endOf('month').format('YYYY-MM-DD'));
    data.forEach(function (e) {
        switch (e.idsite) {
            case "10":
                switch (e.date) {
                    case nowdate:
                        mCount = parseInt(e.uv);
                        wapData.push(parseInt(e.uv));
                        wapData.push(parseInt(e.productDetailPageCnt));
                        wapData.push(parseInt(e.tradeAddressPageCnt));
                        wapData.push(parseInt(e.selectPaymentPageCnt));
//                        wapData.push(e.selectServicePageCnt);
                        wapData.push(parseInt(e.paidSuccessPageCnt));
                        pcmCount = pcCount + mCount;
                        $("#UVCount").html("PC版和M版的总访客数：" + pcmCount);
                        break;
                }
                break;
        }
    });

    var yData = ['访问UV',
        "商品详情页面转化率" + (wapData[1] / wapData[0] * 100).toFixed(2) + '%\n 商品详情页面访客数',
        "核对订单信息页面率" + (wapData[2] / wapData[0] * 100).toFixed(2) + '%\n 核对订单信息页面访客数',
        "选择支付方式率" + (wapData[3] / wapData[0] * 100).toFixed(2) + '%\n 选择支付方式访客数',
        "交易成功率" + (wapData[4] / wapData[0] * 100).toFixed(2) + '%\n 交易成功用户数'].reverse();

    var option = {
        title: {
            text: 'M版流量漏斗' + "(" + selectDate2 + ")",
            x: "center",
            y: "bottom"
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function (params, ticket, callback) {
                var str;
                params.forEach(function (obj) {
                    var objf = obj.name.split(" ")
                    if (objf[1]) {
                        str = obj.name.split(" ")[0] + '<br/>' + obj.name.split(" ")[1] + ' : ' + obj.value + '<br/>';
                    } else {
                        str = obj.name + ' : ' + obj.value + '<br/>';
                    }
                });
                return (str)
            }
        },
        grid: {
            show: false,
            left: '0',
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
    window.addEventListener('resize', webTrafficFunnelSummaryChart.resize)
}

//PC版折线图

function drawWebTrafficFunnelChartPortal(data) {

    var xAxis_data = [];
    var series = {
        uv: [],
        productDetailPagePv: [],
        productDetailPageCntPVRate: [],
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
        xAxis_data.push(e.date);
        series.uv.push(e.uv);
        series.productDetailPagePv.push(e.productDetailPagePv);
        series.productDetailPageCntPVRate.push(((e.productDetailPageCnt / e.productDetailPagePv) * 100).toFixed(2));
        series.productDetailPageCnt.push(e.productDetailPageCnt);
        series.productDetailPageCntUVRate.push(((e.productDetailPageCnt / e.uv) * 100).toFixed(2));
        series.tradeAddressPageCnt.push(e.tradeAddressPageCnt);
        series.tradeAddressPageCntUVRate.push(((e.tradeAddressPageCnt / e.uv) * 100).toFixed(2));
        series.selectPaymentPageCnt.push(e.selectPaymentPageCnt);
        series.selectPaymentPageCntUVRate.push(((e.selectPaymentPageCnt / e.uv) * 100).toFixed(2));
        series.selectServicePageCnt.push(e.selectServicePageCnt);
        series.selectServicePageCntUVRate.push(((e.selectServicePageCnt / e.uv) * 100).toFixed(2));
        series.paidSuccessPageCnt.push(e.paidSuccessPageCnt);
        series.paidSuccessPageCntUVRate.push(((e.paidSuccessPageCnt / e.uv) * 100).toFixed(2));
    });

    var option = {
        title: {
            text: '官网流量情况',
            x: "center",
            y: "bottom"
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params, ticket, callback) {
                var str = (params[1] ? params[1] : params[0]).name + '<br/>';
                params.forEach(function (obj) {
                    if (obj.seriesName.indexOf("率") > -1) {
                        str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                    } else if (obj.seriesName.indexOf("全选") > -1) {
                        str += '数据如下：' + '<br/>'
                    } else {
                        str += obj.seriesName + ' : ' + obj.value + '<br/>'
                    }
                });
                return str;
            }
        },
        legend: {
            data: ['总访客数', '商品详情页面pv', '商品详情页面访客数', '选择服务页面访客数', '核对订单信息页面访客数', '选择支付方式访客数', '交易成功用户数', '商品详情页面uv/pv转化率', '商品详情页面转化率', '选择服务页面转化率', '核对订单信息页面转化率', '选择支付方式转化率', '交易成功转化率']
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
                        return value + "%"
                    }
                }
            }],
        series: [
            {
                name: '总访客数',
                type: 'line',
                data: series.uv
            },
            {
                name: '商品详情页面pv',
                type: 'line',
                data: series.productDetailPagePv
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
                name: '商品详情页面uv/pv转化率',
                type: 'line',
                yAxisIndex: 1,
                data: series.productDetailPageCntPVRate
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
    window.addEventListener('resize', trafficStackChart.resize)
}

//M版折线图

function drawWebTrafficFunnelChartWap(data) {

    var xAxis_data = [];
    var series = {
        uv: [],
        productDetailPageCnt: [],
        tradeAddressPageCnt: [],
        selectPaymentPageCnt: [],
//        selectServicePageCnt: [],
        paidSuccessPageCnt: []
    };
    data.forEach(function (e) {
        switch (e.idsite) {
            case "10":
                xAxis_data.push(e.date);
                series.uv.push(e.uv);
                series.productDetailPageCnt.push(e.productDetailPageCnt);
                series.tradeAddressPageCnt.push(e.tradeAddressPageCnt);
                series.selectPaymentPageCnt.push(e.selectPaymentPageCnt);
//                series.selectServicePageCnt.push(e.selectServicePageCnt);
                series.paidSuccessPageCnt.push(e.paidSuccessPageCnt);
                break;
            default:
                break;
        }
    });

    var option = {
        title: {
            text: 'M版流量情况',
            x: "center",
            y: "bottom"
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ["总访客数", "商品详情页面访客数", "核对订单信息页面访客数", "选择支付方式访客数", "交易成功用户数"]
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
        yAxis: {
            type: 'value'
        },
        series: [
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
            {
                name: '交易成功用户数',
                type: 'line',
                data: series.paidSuccessPageCnt
            }
        ]
    };
    var trafficStackChart = echarts.init(document.getElementById('webTrafficStackChartWap'));
    trafficStackChart.setOption(option);
    window.addEventListener('resize', trafficStackChart.resize)
}