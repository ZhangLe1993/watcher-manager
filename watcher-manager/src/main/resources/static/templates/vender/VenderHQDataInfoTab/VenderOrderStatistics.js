Template.VenderOrderStatistics.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#HQDataInfoTab').addClass('active');
    $('#VenderOrderStatistics').addClass('active');

    try{
        var source = Template.source;
        var obj = JSON.parse(source);
        var companyName = obj.companyName;
        var companyKey = obj.companyKey;
        vender_company_name.push(companyName);
        vender_company_key=companyKey;
    }catch(e) {
        var listJ = Template.list;
        console.log(listJ);
        vender_company_name.push(listJ[1]);
        vender_company_key=listJ[0];
    }



    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var dateGap = -9;
    var minWeekDate = "2016-07-03";
    var minMonthDate = "2016-07-01";
    var endDate = new Date().getNewDate(-1);
    var startDate = new Date(endDate).getNewDate(dateGap);
    var startWeekDate = moment().weekday(-14).format("YYYY-MM-DD");
    var endWeekDate = moment().weekday(-7).format("YYYY-MM-DD");
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
        "alwaysShowCalendars": false,
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
        "alwaysShowCalendars": false,
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
    $(".dateType").on('change', function () {
        var dateType = $(this).val();
        if (dateType == "daily") {
            $(".webTrafficFunnelDate").show();
            $(".webTrafficFunnelWeek").hide();
            $(".webTrafficFunnelMonth").hide();
            dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g, "").split("~");
            var startDate = dt[0];
            var endDate = dt[1];
            var store = $(this).parent().find(".store").val();
            var account = $(this).parent().find(".account").val();
            var company = $(this).parent().find(".company").val();
            var query = {
                "startDate": startDate,
                "endDate": endDate,
                "company": company,
                "store": store,
                "account": account,
                "vender_company_key": vender_company_key
            };

            renderPage(query);
        } else if (dateType == "weekly") {
            $(".webTrafficFunnelDate").hide();
            $(".webTrafficFunnelWeek").show();
            $(".webTrafficFunnelMonth").hide();
            dt = $('.desktop-only .weekSelectLabel').text().replace(/ /g, "").split("~");
            var startDate = dt[0];
            var endDate = dt[1];
            var store = $(this).parent().find(".store").val();
            var account = $(this).parent().find(".account").val();
            var company = $(this).parent().find(".company").val();

            var query = {
                "startDate": startDate,
                "endDate": endDate,
                "company": company,
                "store": store,
                "account": account,
                "vender_company_key": vender_company_key
            };

            renderPage(query)
        } else if (dateType == "monthly") {
            $(".webTrafficFunnelDate").hide();
            $(".webTrafficFunnelWeek").hide();
            $(".webTrafficFunnelMonth").show();
            dt = $('.desktop-only .monthSelectLabel').text().replace(/ /g, "").split("~");
            var startDate = dt[0];
            var endDate = dt[1];
            var store = $(this).parent().find(".store").val();
            var account = $(this).parent().find(".account").val();
            var company = $(this).parent().find(".company").val();

            var query = {
                "startDate": startDate,
                "endDate": endDate,
                "company": company,
                "store": store,
                "account": account,
                "vender_company_key": vender_company_key
            };
            renderPage(query)
        }
    });

    var dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g, "").split("~");
    var startDate = dt[0];
    var endDate = dt[1];

    if (vender_company_key == "aihuishouBiClairAll") {
        var queryall = {
            "startDate": startDate,
            "endDate": endDate,
            "vender_company_key": vender_company_key
        };
        var query = {
            "vender_company_key": vender_company_key
        }
    } else {
        var queryall = {
            "startDate": startDate,
            "endDate": endDate,
            "vender_company_key": vender_company_key,
            "company": vender_company_name
        };
        var query = {
            "vender_company_key": vender_company_key,
            "company": vender_company_name
        }
    }

    //数据初始化加载
    renderPage(queryall);

    //选项初始化加载
    requestURL(thirdService + "/Vender/getVenderFilterOptions", query).done(function (data) {
        /*门店*/
        $(".company").attr("multiple", "multiple");

        if (vender_company_name[0] == "all") {
            data.vender_company_name.forEach(function (e) {
                $(".company").append("<option value='" + e + "'>" + e + "</option>");
            });
        } else {
            $(".company").append("<option value='" + vender_company_name[0] + "' disabled='disabled' selected='selected' >" + vender_company_name[0] + "</option>");
        }

        /*门店*/
        $(".store").attr("multiple", "multiple");
        data.vender_store_name.forEach(function (e) {
            $(".store").append("<option value='" + e + "'>" + e + "</option>");
        });

        /*子账户*/
        $(".account").attr("multiple", "multiple");
        data.vender_account_name.forEach(function (e) {
            $(".account").append("<option value='" + e + "'>" + e + "</option>");
        });

        $(".company").multipleSelect({
            placeholder: "全部",
            width: 150,
            selectAll: false,
            filter: true
        });
        $(".store").multipleSelect({
            placeholder: "全部",
            width: 150,
            selectAll: false,
            filter: true
        });
        $(".account").multipleSelect({
            placeholder: "全部",
            width: 150,
            selectAll: false,
            filter: true
        });

        $(document).on('change', 'select.company', function (e) {
            getFilterOptionsCompany();
        });
    });

    $(".search").click(function () {
        /*日期*/
        dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g, "").split("~");
        var startDate = dt[0];
        var endDate = dt[1];
        /*周数*/
        dt = $('.desktop-only .weekSelectLabel').text().replace(/ /g, "").split("~");
        var startDateWeek = dt[0];
        var endDateWeek = dt[1];
        /*月数*/
        dt = $('.desktop-only .monthSelectLabel').text().replace(/ /g, "").split("~");
        var startMonth = dt[0];
        var endMonth = dt[1];

        var company;
        if (vender_company_key == "aihuishouBiClairAll") {
            company = $(this).parent().find(".company").val();
        } else {
            company = vender_company_name;
        }
        var store = $(this).parent().find(".store").val();
        var account = $(this).parent().find(".account").val();

        var query = {
            "startDate": startDate,
            "endDate": endDate,
            "company": company,
            "store": store,
            "account": account,
            "vender_company_key": vender_company_key
        };
        var queryWeek = {
            "startDate": startDateWeek,
            "endDate": endDateWeek,
            "company": company,
            "store": store,
            "account": account,
            "vender_company_key": vender_company_key
        };
        var queryMonth = {
            "startDate": startMonth,
            "endDate": endMonth,
            "company": company,
            "store": store,
            "account": account,
            "vender_company_key": vender_company_key
        };

        $("#chartContent").hide();
        $("#loading").show();
        $(".webTrafficFunnelDate").show();
        $(".webTrafficFunnelWeek").hide();
        $(".webTrafficFunnelMonth").hide();
        var flag = $(".dateType").val();
        if (flag == "daily") {
            query = cleanParams(query);
            $("#chartContent").show();
            renderPage(query);
            $(".webTrafficFunnelDate").show();
            $(".webTrafficFunnelWeek").hide();
            $(".webTrafficFunnelMonth").hide();
        } else if (flag == "weekly") {
            queryWeek = cleanParams(queryWeek);
            $("#chartContent").show();
            $("#loading").hide();
            renderPage(queryWeek);
            $(".webTrafficFunnelDate").hide();
            $(".webTrafficFunnelWeek").show();
            $(".webTrafficFunnelMonth").hide();
        } else if (flag == "monthly") {
            queryMonth = cleanParams(queryMonth);
            $("#chartContent").show();
            $("#loading").hide();
            renderPage(queryMonth);
            $(".webTrafficFunnelDate").hide();
            $(".webTrafficFunnelWeek").hide();
            $(".webTrafficFunnelMonth").show();
        }

    });

    $(".order").on('change', function () {
        var flag = $(".order").val();
        drawtrafficFunnelChart(orderData, flag);
        drawtrafficStackChart(orderData, flag);
        drawtrafficFunnelChartPr(orderData, flag);
        drawtrafficStackChartPr(orderData, flag);
    });
};

var orderData, vender_company_key, vender_company_name = [];

function pickWebTrafficFunnelDateRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
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

function getFilterOptionsCompany() {
    var company;
    if (vender_company_key == "aihuishouBiClairAll") {
        company = $(".company").val();
    } else {
        company = vender_company_name;
    }

    var filter = {
        "vender_company_key": vender_company_key,
        "company": company
    };

    filter = cleanParams(filter);
    $(".store").remove();
    $(".account").remove();
    $("<select class='store' style='margin-left: 28px;width:150px;border-radius: 4px;padding: 6px 12px;'></select>").insertAfter(".storeOption");
    $("<select class='account' style='margin-left: 28px;width:150px;border-radius: 4px;padding: 6px 12px;'></select>").insertAfter(".accountOption");
    requestURL(thirdService + "/Vender/getVenderFilterOptions", cleanParams(filter)).done(function (ret) {
        //store
        $(".store").attr("multiple", "multiple");
        ret.vender_store_name.forEach(function (e) {
            $(".store").append("<option value='" + e + "'>" + e + "</option>");
        });
        $(".store").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false,
            filter: true
        });

        //account
        $(".account").attr("multiple", "multiple");
        ret.vender_account_name.forEach(function (e) {
            $(".account").append("<option value='" + e + "'>" + e + "</option>");
        });
        $(".account").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false,
            filter: true
        });
    });
}

function cleanParams(filter) {
    //clean parameters
    var query = _.clone(filter);
    for (var key in query) {
        if (!query[key] && key != "offset") {
            delete query[key]
        }
    }
    return query
}

function renderPage(filter) {
    $("#chartContent").hide();
    $("#loading").show();
    var promise = getAggregateWebTrafficData(filter);
    promise.done(function (ret) {
        $("#chartContent").show();
        $("#loading").hide();
        var dateArray = getDateRangeArray(filter.startDate,new Date(filter.endDate).getNewDate(1),'day');
        var map = _.groupBy(ret, 'date');
        var swapArr = [];
        var recycleArr = [];
        _.each(dateArray, function(ele) {
            if(map.hasOwnProperty(ele)) {
                var arr = map[ele];
                var typeMap = _.groupBy(arr, 'ordertype');
                if(typeMap.hasOwnProperty('以旧换新')) {
                    swapArr.push(typeMap['以旧换新'][0]);
                } else {
                    swapArr.push({date: ele, ordertype: '以旧换新', submit_price: 0, trade_cnt: 0, trade_price_cnt: 0, trade_success_cnt: 0});
                }
                if(typeMap.hasOwnProperty('手机回收')) {
                    recycleArr.push(typeMap['手机回收'][0]);
                } else {
                    recycleArr.push({date: ele, ordertype: '手机回收', submit_price: 0, trade_cnt: 0, trade_price_cnt: 0, trade_success_cnt: 0});
                }
            } else {
                swapArr.push({date: ele, ordertype: '以旧换新', submit_price: 0, trade_cnt: 0, trade_price_cnt: 0, trade_success_cnt: 0});
                recycleArr.push({date: ele, ordertype: '手机回收', submit_price: 0, trade_cnt: 0, trade_price_cnt: 0, trade_success_cnt: 0});
            }
        });
        var joinArr = swapArr.concat(recycleArr);

        var flag = $(".order").val();
        drawtrafficFunnelChart(joinArr, flag);
        drawtrafficStackChart(joinArr, flag);
        drawtrafficFunnelChartPr(joinArr, flag);
        drawtrafficStackChartPr(joinArr, flag);
    });
}

var getAggregateWebTrafficData = function(filter) {
    var query = _.clone(filter);
    var flag = $(".dateType").val();
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(thirdService + "/Vender/getProductTrafficDataPro", query).done(function (ret) {
            dfd.resolve(ret)
        });
    } else if (flag == "weekly") {
        requestURL(thirdService + "/Vender/getProductTrafficWeekPro", query).done(function (ret) {
            dfd.resolve(ret)
        });
    } else if (flag == "monthly") {
        requestURL(thirdService + "/Vender/getProductTrafficMonthPro", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
};

//获取总的数据
var getCalcDataByDate = function(data) {
    var series = {
        uv: [],
        inquiryUv: [],
        submitSuccessUv: [],
        tradeUv: []
    };
    series.uv[0] = 0;
    series.inquiryUv[0] = 0;
    series.submitSuccessUv[0] = 0;
    series.tradeUv[0] = 0;
    data.forEach(function (e) {
        series.uv[0] += e.uv;
        series.inquiryUv[0] += e.inquiryUv;
        series.submitSuccessUv[0] += e.submitSuccessUv;
        series.tradeUv[0] += e.tradeUv;
    });
    return series;
};

var pickDateRangeCallback = function(start, end, label) {
    $('.webTrafficUV').html(start.format('YYYY-MM-DD'));
};

/*订单量饼图*/
var drawtrafficFunnelChart = function(data, flag) {
    var selectDate, selectDate2;
    var dateType = $(".dateType").val();
    if (dateType == "daily") {
        dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g, "").split("~");
        selectDate = dt[1];
        selectDate2 = dt[0] + "~" + dt[1];
    } else if (dateType == "weekly") {
        dt = $('.desktop-only .weekSelectLabel').text().replace(/ /g, "").split("~");
        selectDate = dt[1];
        selectDate2 = dt[0] + "~" + dt[1];
    } else if (dateType == "monthly") {
        dt = $('.desktop-only .monthSelectLabel').text().replace(/ /g, "").split("~");
        selectDate = dt[1];
        selectDate2 = dt[0] + "~" + dt[1];
    }

    var flag = $(".order").val();
    var newData = 0, oldData = 0;
    if (flag == "submit") {
        data.forEach(function (e) {
            switch (e.ordertype) {
                case "以旧换新":
                    newData += e.trade_cnt;
                    break;
                case "手机回收":
                    oldData += e.trade_cnt;
                    break;
            }
        });
    } else if (flag == "trade") {
        data.forEach(function (e) {
            switch (e.ordertype) {
                case "以旧换新":
                    newData += e.trade_success_cnt;
                    break;
                case "手机回收":
                    oldData += e.trade_success_cnt;
                    break;
            }
        });
    }

    var option = {
        title: {
            text: '以旧换新与旧机回收订单总数占比' + "(" + selectDate2 + ")",
            x: "center",
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            x: 'center',
            y: 'bottom',
            data: ['以旧换新', '旧机回收']
        },
        series: [
            {
                name: '订单总数',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [
                    {value: newData, name: '以旧换新'},
                    {value: oldData, name: '旧机回收'}
                ],
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            formatter: '{b} : {c} ({d}%)'
                        },
                        labelLine: {show: true}
                    }
                }
            }
        ]
    };
    var trafficFunnelChart = echarts.init(document.getElementById('trafficFunnelChart'));
    trafficFunnelChart.setOption(option);
    window.addEventListener('resize', trafficFunnelChart.resize)
};

/*订单量折线图堆叠*/
var drawtrafficStackChart = function(data, flag) {
    var totalOrder = 0;   //总值和两种方式的和
    var seriesNew = {
        date: [],
        newData: [],
        allData: []
    };
    var seriesOld = {
        date: [],
        oldData: []
    };
    if (flag == "submit") {
        data.forEach(function (e) {
            switch (e.ordertype) {
                case "以旧换新":
                    seriesNew.date.push(e.date);
                    seriesNew.newData.push(e.trade_cnt);
                    totalOrder += e.trade_cnt;
                    break;
                case "手机回收":
                    seriesOld.date.push(e.date);
                    seriesOld.oldData.push(e.trade_cnt);
                    totalOrder += e.trade_cnt;
                    break;
            }
        });
    } else if (flag == "trade") {
        data.forEach(function (e) {
            switch (e.ordertype) {
                case "以旧换新":
                    seriesNew.date.push(e.date);
                    seriesNew.newData.push(e.trade_success_cnt);
                    totalOrder += e.trade_success_cnt;
                    break;
                case "手机回收":
                    seriesOld.date.push(e.date);
                    seriesOld.oldData.push(e.trade_success_cnt);
                    totalOrder += e.trade_success_cnt;
                    break;
            }
        });
    }
    for (var i = 0; i < seriesNew.date.length; i++) {
        if (seriesNew.date[i] < seriesOld.date[i]) {
            seriesOld.date.splice(i, 0, seriesNew.date[i]);
            seriesNew.allData.push(seriesNew.newData[i]);
            seriesOld.oldData.splice(i, 0, "undefined");
        } else if (seriesNew.date[i] > seriesOld.date[i]) {
            seriesNew.date.splice(i, 0, seriesOld.date[i]);
            seriesNew.allData.push(seriesOld.oldData[i]);
            seriesNew.newData.splice(i, 0, "undefined");
        } else {
            seriesNew.allData.push(seriesNew.newData[i] + seriesOld.oldData[i]);
        }
    }
    if (seriesNew.date[0] == undefined) {
        seriesNew.date = seriesOld.date;
        seriesNew.newData[0] = "undefined";
        seriesNew.allData = seriesOld.oldData;
    }

    var option = {
        title: {
            text: '订单数合计:' + totalOrder,
            x: "center",
            y: "top"
        },
        tooltip: {
            trigger: 'axis',
        },
        legend: {
            x: 'center',
            y: 'bottom',
            data: ['以旧换新', '旧机回收', '合计']
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
            data: seriesOld.date
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '合计',
                type: 'line',
                data: seriesNew.allData,
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                }
            },
            {
                name: '以旧换新',
                type: 'line',
                data: seriesNew.newData,
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                }
            },
            {
                name: '旧机回收',
                type: 'line',
                data: seriesOld.oldData,
                label: {
                    normal: {
                        show: true,
                        position: 'bottom'
                    }
                }
            }
        ]
    };
    var trafficStackChart = echarts.init(document.getElementById('trafficStackChart'));
    trafficStackChart.setOption(option);
    window.addEventListener('resize', trafficStackChart.resize)
};

/*订单金额饼图*/
var drawtrafficFunnelChartPr = function(data, flag) {
    var selectDate, selectDate2;
    var dateType = $(".dateType").val();
    if (dateType == "daily") {
        dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g, "").split("~");
        selectDate = dt[1];
        selectDate2 = dt[0] + "~" + dt[1];
    } else if (dateType == "weekly") {
        dt = $('.desktop-only .weekSelectLabel').text().replace(/ /g, "").split("~");
        selectDate = dt[1];
        selectDate2 = dt[0] + "~" + dt[1];
    } else if (dateType == "monthly") {
        dt = $('.desktop-only .monthSelectLabel').text().replace(/ /g, "").split("~");
        selectDate = dt[1];
        selectDate2 = dt[0] + "~" + dt[1];
    }
    var newData = 0, oldData = 0;
    if (flag == "submit") {
        data.forEach(function (e) {
            switch (e.ordertype) {
                case "以旧换新":
                    newData += e.submit_price;
                    break;
                case "手机回收":
                    oldData += e.submit_price;
                    break;
            }
        });
    } else if (flag == "trade") {
        data.forEach(function (e) {
            switch (e.ordertype) {
                case "以旧换新":
                    newData += e.trade_price_cnt;
                    break;
                case "手机回收":
                    oldData += e.trade_price_cnt;
                    break;
            }
        });
    }

    var option = {
        title: {
            text: '以旧换新与旧机回收订单金额占比' + "(" + selectDate2 + ")",
            x: "center",
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            x: 'center',
            y: 'bottom',
            data: ['以旧换新', '旧机回收']
        },
        series: [
            {
                name: '订单金额',
                type: 'pie',
                radius: '55%',
                center: ['50%', '60%'],
                data: [
                    {value: newData, name: '以旧换新'},
                    {value: oldData, name: '旧机回收'}
                ],
                itemStyle: {
                    normal: {
                        label: {
                            show: true,
                            formatter: '{b} : {c} ({d}%)'
                        },
                        labelLine: {show: true}
                    }
                }
            }
        ]
    };
    var trafficFunnelChart = echarts.init(document.getElementById('trafficFunnelChartPr'));
    trafficFunnelChart.setOption(option);
    window.addEventListener('resize', trafficFunnelChart.resize)
};

/*订单金额折线图堆叠*/
var drawtrafficStackChartPr = function(data, flag) {
    var totalAmount = 0;
    var seriesNew = {
        date: [],
        newData: [],
        allData: []
    }
    var seriesOld = {
        date: [],
        oldData: []
    };
    if (flag == "submit") {
        data.forEach(function (e) {
            switch (e.ordertype) {
                case "以旧换新":
                    seriesNew.date.push(e.date);
                    seriesNew.newData.push(e.submit_price);
                    totalAmount += e.submit_price;
                    break;
                case "手机回收":
                    seriesOld.date.push(e.date);
                    seriesOld.oldData.push(e.submit_price);
                    totalAmount += e.submit_price;
                    break;
            }
        });
    } else if (flag == "trade") {
        data.forEach(function (e) {
            switch (e.ordertype) {
                case "以旧换新":
                    seriesNew.date.push(e.date);
                    seriesNew.newData.push(e.trade_price_cnt);
                    totalAmount += e.trade_price_cnt;
                    break;
                case "手机回收":
                    seriesOld.date.push(e.date);
                    seriesOld.oldData.push(e.trade_price_cnt);
                    totalAmount += e.trade_price_cnt;
                    break;
            }
        });
    }
    for (var i = 0; i < seriesNew.date.length; i++) {
        if (seriesNew.date[i] < seriesOld.date[i]) {
            seriesOld.date.splice(i, 0, seriesNew.date[i]);
            seriesNew.allData.push(seriesNew.newData[i]);
            seriesOld.oldData.splice(i, 0, "undefined");
        } else if (seriesNew.date[i] > seriesOld.date[i]) {
            seriesNew.date.splice(i, 0, seriesOld.date[i]);
            seriesNew.allData.push(seriesOld.oldData[i]);
            seriesNew.newData.splice(i, 0, "undefined");
        } else {
            seriesNew.allData.push(seriesNew.newData[i] + seriesOld.oldData[i]);
        }
    }
    if (seriesNew.date[0] == undefined) {
        seriesNew.date = seriesOld.date;
        seriesNew.newData[0] = "undefined";
        seriesNew.allData = seriesOld.oldData;
    }
    var option = {
        title: {
            text: '订单金额:' + totalAmount,
            x: "center",
            y: "top"
        },
        tooltip: {
            trigger: 'axis',
        },
        legend: {
            x: 'center',
            y: 'bottom',
            data: ['以旧换新', '旧机回收', '合计']
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
            data: seriesOld.date
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '合计',
                type: 'line',
                data: seriesNew.allData,
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                }
            },
            {
                name: '以旧换新',
                type: 'line',
                data: seriesNew.newData,
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                }
            },
            {
                name: '旧机回收',
                type: 'line',
                data: seriesOld.oldData,
                label: {
                    normal: {
                        show: true,
                        position: 'bottom'
                    }
                }
            }
        ]
    };
    var trafficStackChart = echarts.init(document.getElementById('trafficStackChartPr'));
    trafficStackChart.setOption(option);
    window.addEventListener('resize', trafficStackChart.resize)
};
