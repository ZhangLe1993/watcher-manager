Template.saleAnalysis.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#datareport').addClass('active');
    $('#saleAnalysis').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var dateGap = -6;
    var minWeekDate = "2017-07-30";
    var minMonthDate = "2017-08-01";
    var endDate = new Date().getNewDate(-1);
    var startDate = new Date(endDate).getNewDate(dateGap);
    var startWeekDate = moment().weekday(-7).format("YYYY-MM-DD")
    var endWeekDate = moment().weekday(-1).format("YYYY-MM-DD")
    if (startWeekDate < minWeekDate) {
        startWeekDate = minWeekDate;
    }
    var startMonthDate = moment().subtract(1, 'month').startOf('month').format("YYYY-MM-DD");
    var endMonthDate = moment().subtract(0, 'month').startOf('month').format("YYYY-MM-DD");
    if (startMonthDate < minMonthDate) {
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
        "minDate": transformDate("2017-08-01"),
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

    $(".webTrafficFunnelDate").on('apply.daterangepicker', function (ev, picker) {
        getValue(flag);
        getValueProduct(flag);
    });
    sonFlag="tr";
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        // 获取已激活的标签页的名称
        var activeTab = $(e.target).text();
        if(activeTab=="整体数据"){
            flag="all";
            sonFlag="tr";
            getValue("all");
            getValueProduct(flag);
        }else if(activeTab=="PC端数据"){
            flag="pc";
            sonFlag="tr";
            getValue("pc");
            getValueProduct(flag);
        }else if(activeTab=="M端数据"){
            flag="m";
            sonFlag="tr";
            getValue("m");
            getValueProduct(flag);
        }else if(activeTab=="Android原生APP数据"){
            flag="android";
            sonFlag="tr";
            getValue("android");
            getValueProduct(flag);
        }else if(activeTab=="IOS原生APP数据"){
            flag="ios";
            sonFlag="tr";
            getValue("ios");
            getValueProduct(flag);
        }
        else if(activeTab=="流量"){
            sonFlag="tr";
            getValue(flag);
        }else if(activeTab=="流量带来的销量"){
            sonFlag="sa";
            getValue(flag);
        }
    });
    flag="all";
    getValue(flag);
    getValueProduct(flag);
};

var flag,sonFlag,pvSet,uvSet;

function pickWebTrafficFunnelDateRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.dateSelectLabel').html(sdt + "~" + edt);
    getValue(flag);
    getValueProduct(flag);
}

function cleanParams(filter){
    //clean parameters
    var query = _.clone(filter);
    for(var key in query){
        if(!query[key]&&key!="offset"){
            delete query[key]
        }
    }
    return query
}

function getValue(flag) {
        var platform=[];
        if(flag=="all"){
            platform=undefined;
        }else if(flag=="pc"){
            platform.push("官网");
        }else if(flag=="m") {
            platform.push("m版本");
            platform.push("微信");
            platform.push("Android");
            platform.push("IOS");
        }else if(flag=="android"){
            platform.push("Android原生APP");
        }else if(flag=="ios"){
            platform.push("Ios原生APP");
        }
        var dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g, "").split("~");
        var startDate = dt[0];
        var endDate = dt[1];

        var query = {
            "startDate": startDate,
            "endDate": endDate,
            "platform":platform
        };
        query = cleanParams(query);
        requestURL(dataService + "/webTraffic/urlUvPvWebTrafficDatabyDate", {"startDate":startDate,"endDate":endDate}).done(function (ret) {
            var pv=0;
            ret.forEach(function (e) {
                    if (flag == "all" && (e.url == "http://www.aihuishou.com" || e.url == "http://m.aihuishou.com" || e.url == "http://official.android.aihuishou.com" || e.url == "http://official.ios.aihuishou.com" || e.url == "http://cp.aihuishou.com")) {
                        pv += e.pv;
                    } else if (flag == "pc" && e.url == "http://www.aihuishou.com") {
                        pv += e.pv;
                    } else if (flag == "m" && e.url == "http://m.aihuishou.com") {
                        pv += e.pv;
                    } else if (flag == "android" && e.url == "http://official.android.aihuishou.com") {
                        pv += e.pv;
                    } else if (flag == "ios" && e.url == "http://official.ios.aihuishou.com") {
                        pv += e.pv;
                    }
            });
            $("#allPv").html("浏览量:" + pv);
            $("#pcPv").html("浏览量:" + pv);
            $("#mPv").html("浏览量:" + pv);
            $("#androidPv").html("浏览量:" + pv);
            $("#iosPv").html("浏览量:" + pv);
            pvSet=ret;


            var trade_success_amount_num= 0,trade_success_cnt_num= 0,trade_success_uv= 0,uv= 0;
            var platformNew=[];
            if(flag=="all"){
                platformNew=undefined;
            }else if(flag=="pc"){
                platformNew.push("PC站");
            }else if(flag=="m") {
                platformNew.push("M站");
                platformNew.push("微信公众号");
            }else if(flag=="android"){
                platformNew.push("Android");
            }else if(flag=="ios"){
                platformNew.push("iOS");
            }
            query.platform=platformNew;
            console.log(platformNew)
            console.log(query.platform)
            query = cleanParams(query);
            requestURLPost(dataService + "/webTraffic/getDailyAggregateMarketingWebTrafficData_newchannel_userflag_recycletype", query).done(function (retNew) {
                retNew.forEach(function (e) {
                    trade_success_amount_num+=e.trade_success_amount_num;
                    trade_success_cnt_num+=e.trade_success_cnt_num;
                    trade_success_uv+=e.trade_success_uv;
                    uv+= e.uv;
                });
                $("#allTradeNum").html("成交金额:" + trade_success_amount_num);
                $("#allTradeCnt").html("成交单数:" + trade_success_cnt_num);
                $("#allTradeUv").html("成交访客数:" + trade_success_uv);
                $("#pcTradeNum").html("成交金额:" + trade_success_amount_num);
                $("#pcTradeCnt").html("成交单数:" + trade_success_cnt_num);
                $("#pcTradeUv").html("成交访客数:" + trade_success_uv);
                $("#mTradeNum").html("成交金额:" + trade_success_amount_num);
                $("#mTradeCnt").html("成交单数:" + trade_success_cnt_num);
                $("#mTradeUv").html("成交访客数:" + trade_success_uv);
                $("#androidTradeNum").html("成交金额:" + trade_success_amount_num);
                $("#androidTradeCnt").html("成交单数:" + trade_success_cnt_num);
                $("#androidTradeUv").html("成交访客数:" + trade_success_uv);
                $("#iosTradeNum").html("成交金额:" + trade_success_amount_num);
                $("#iosTradeCnt").html("成交单数:" + trade_success_cnt_num);
                $("#iosTradeUv").html("成交访客数:" + trade_success_uv);
                $("#allUv").html("访客数:" + uv);
                $("#pcUv").html("访客数:" + uv);
                $("#mUv").html("访客数:" + uv);
                $("#androidUv").html("访客数:" + uv);
                $("#iosUv").html("访客数:" + uv);
                uvSet=retNew;
                if(sonFlag=="sa") {
                    drawSaleChart(retNew);
                }else if(sonFlag=="tr") {
                    drawTrafficChart(pvSet,uvSet);
                }
            });
        });
}

function getValueProduct(flag) {
    var platform=[];
    if(flag=="all"){
        platform.push("官网");
        platform.push("m版本");
        platform.push("Android原生APP");
        platform.push("Ios原生APP");
    }else if(flag=="pc"){
        platform.push("官网");
    }else if(flag=="m") {
        platform.push("m版本");
    }else if(flag=="android"){
        platform.push("Android原生APP");
    }else if(flag=="ios"){
        platform.push("Ios原生APP");
    }
    var dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g, "").split("~");
    var startDate = dt[0];
    var endDate = dt[1];

    requestURL(dataService + "/webTraffic/saleAnlysisProductWebTrafficData", {"startDate":startDate,"endDate":endDate,"channel":flag}).done(function (data) {
        var dataProduct=[];
        data.forEach(function(e){
            switch(e.url){
                case flag:
                    var dataJson={
                        "date": e.date,
                        "category": e.category,
                        "name":e.name,
                        "uv": e.uv,
                    };
                    dataProduct.push(dataJson);
                    break;
            }
        })
        renderTable(dataProduct);
        webTrafficFunnelSaleProductChart(dataProduct);
    });
}


function renderTable(data) {
    var date = [];
    var series = {
        id: [],
        category:[],
        name: [],
        uv: []
    };
    var i = 0;
    data.forEach(function (e) {
        i++;
        date.push(e.date);
        series.id.push(i);
        series.category.push(e.category);
        series.name.push(e.name);
        series.uv.push(e.uv);
    });

    var tableJson = [];

    for (var i = 0, len = date.length; i < len; i++) {
        var tmp = {
            "id": series.id[i],
            "category":series.category[i],
            "name": series.name[i],
            "uv": series.uv[i],
        };
        tableJson.push(tmp);
    }

    var table="#alltable";
    if(flag=="all"){
        table="#alltable";
    }else if(flag=="pc"){
        table="#pctable";
    }else if(flag=="m"){
        table="#mtable";
    }else if(flag=="android"){
        table="#androidtable";
    }else if(flag=="ios"){
        table="#iostable";
    }
    $(table).bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        data: tableJson
    });
}

//商品柱状图

function webTrafficFunnelSaleProductChart(data) {

    var name = [];
    var uv = [];
    var i = 0, j = 0;
    var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];
    data.forEach(function (e) {
        i++;
        if(i<=20) {
            name.push(e.name);
            uv.push({
                value: e.uv,
                itemStyle: {
                    normal: {
                        color: colors[(j++) % 10]
                    }
                }
            })
        }
    });

    var option = {
        title: {
            text: '商品浏览量Top20',
            x: "center",
            y: "top"
        },
        color: ['#3398DB'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        grid: {
            x: 40,
            y: 60,
            x2: 20,
            y2: 120,
        },
        xAxis: [
            {
                type: 'category',
                data: name,
                axisTick: {
                    alignWithLabel: true
                },
                axisLabel: {
                    show: true,
                    rotate: 60,
                    interval: 0
                }
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '浏览量',
                type: 'bar',
                barWidth: '60%',
                data: uv
            }
        ]
    };

    var chart="allwebTrafficFunnelSaleProductChart";
    if(flag=="all"){
        chart="allwebTrafficFunnelSaleProductChart";
    }else if(flag=="pc"){
        chart="pcwebTrafficFunnelSaleProductChart";
    }else if(flag=="m"){
        chart="mwebTrafficFunnelSaleProductChart"
    }else if(flag=="android"){
        chart="androidwebTrafficFunnelSaleProductChart"
    }else if(flag=="ios"){
        chart="ioswebTrafficFunnelSaleProductChart"
    }
    var webTrafficFunnelSaleProductChart = echarts.init(document.getElementById(chart));
    webTrafficFunnelSaleProductChart.setOption(option)
    window.addEventListener('resize', webTrafficFunnelSaleProductChart.resize)
}

/*流量*/
function drawTrafficChart(pvSet,uvSet) {
    var xAxis_data = [];
    var series = {
        pv: [],
        uv: []
    };
    var i= 0,pv=0;
    pvSet.forEach(function (e) {
        if (flag == "all" && (e.url == "http://www.aihuishou.com" || e.url == "http://m.aihuishou.com" || e.url == "http://official.android.aihuishou.com" || e.url == "http://official.ios.aihuishou.com")) {
            i++;
            pv += e.pv;
            if (i == 4) {
                xAxis_data.push(new Date(e.date).format("yyyy-MM-dd"));
                series.pv.push(pv);
                i=0,pv=0;
            }
        } else if (flag == "pc" && e.url == "http://www.aihuishou.com") {
            xAxis_data.push(new Date(e.date).format("yyyy-MM-dd"));
            series.pv.push(e.pv);
        } else if (flag == "m" && e.url == "http://m.aihuishou.com") {
            xAxis_data.push(new Date(e.date).format("yyyy-MM-dd"));
            series.pv.push(e.pv);
        } else if (flag == "android" && e.url == "http://official.android.aihuishou.com") {
            xAxis_data.push(new Date(e.date).format("yyyy-MM-dd"));
            series.pv.push(e.pv);
        } else if (flag == "ios" && e.url == "http://official.ios.aihuishou.com") {
            xAxis_data.push(new Date(e.date).format("yyyy-MM-dd"));
            series.pv.push(e.pv);
        }
    });

    uvSet.forEach(function (e) {
            xAxis_data.push(new Date(e.date).format("yyyy-MM-dd"));
            series.uv.push(e.uv);
    });
    xAxis_data=_.uniq(xAxis_data);

    var option = {
        title: {
            //text: '访客统计',
            x: "center",
            y: "bottom"
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['UV数','PV数']
        },
        grid: {
            left: '3%',
            right: '4%',
            containLabel: true
        },
        toolbox: {
            feature: {
                /*saveAsImage: {}*/
            }
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
                name: 'PV数',
                type: 'line',
                itemStyle: {
                    normal: {
                        color: '#568FC8',
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#568FC8'
                            }
                        }
                    }
                },
                data: series.pv
            },
            {
                name: 'UV数',
                type: 'line',
                itemStyle: {
                    normal: {
                        color: '#d48265',
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#d48265'
                            }
                        }
                    }
                },
                data: series.uv
            }
        ]
    };
    var chart="trafficAllwebTrafficFunnelSaleProductChart";
    if (flag == "all" ) {
        chart="trafficAllwebTrafficFunnelSaleProductChart";
    } else if (flag == "pc") {
        chart="trafficPcwebTrafficFunnelSaleProductChart";
    } else if (flag == "m") {
        chart="trafficMwebTrafficFunnelSaleProductChart";
    } else if (flag == "android") {
        chart="trafficAndroidwebTrafficFunnelSaleProductChart";
    } else if (flag == "ios") {
        chart="trafficIoswebTrafficFunnelSaleProductChart";
    }
    var cusStaChart = echarts.init(document.getElementById(chart));
    cusStaChart.setOption(option);
    window.addEventListener('resize',cusStaChart.resize)
}

/*销量*/
function drawSaleChart(data) {
    var xAxis_data = [];
    var series = {
        tradeNum: []
    };
    data.forEach(function (e) {
        xAxis_data.push(new Date(e.date).format("yyyy-MM-dd"));
        series.tradeNum.push(e.trade_success_cnt_num);
    });
    xAxis_data=_.uniq(xAxis_data);

    var option = {
        title: {
            //text: '访客统计',
            x: "center",
            y: "bottom"
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['流量带来的销量']
        },
        grid: {
            left: '3%',
            right: '4%',
            containLabel: true
        },
        toolbox: {
            feature: {
                /*saveAsImage: {}*/
            }
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
                name: '流量带来的销量',
                type: 'line',
                itemStyle: {
                    normal: {
                        color: '#568FC8',
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#568FC8'
                            }
                        }
                    }
                },
                data: series.tradeNum
            }
        ]
    };
    var chart="saleAllwebTrafficFunnelSaleProductChart";
    if (flag == "all" ) {
        chart="saleAllwebTrafficFunnelSaleProductChart";
    } else if (flag == "pc") {
        chart="salePcwebTrafficFunnelSaleProductChart";
    } else if (flag == "m") {
        chart="saleMwebTrafficFunnelSaleProductChart";
    } else if (flag == "android") {
        chart="saleAndroidwebTrafficFunnelSaleProductChart";
    } else if (flag == "ios") {
        chart="saleIoswebTrafficFunnelSaleProductChart";
    }
    var cusStaChart = echarts.init(document.getElementById(chart));
    cusStaChart.setOption(option);
    window.addEventListener('resize',cusStaChart.resize)
}