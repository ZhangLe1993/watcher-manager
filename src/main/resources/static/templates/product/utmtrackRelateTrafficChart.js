Array.prototype.unique = function () {
    var o = {};
    var i = 0;
    var l = this.length;
    var r = [];
    for (i = 0; i < l; i++) {
        o[this[i]] = this[i];
    }
    for (i in o) {
        r.push(o[i]);
    }
    return r;
};

Template.utmtrackRelateTrafficChart.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#productTab').addClass('active');
    $('#utmtrackRelateTrafficChart').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

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
    var endMonthDate = moment().startOf('month').format("YYYY-MM-DD");
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
    var monthPickerOptions = {
        "onlyShowfirstDayOfMonth": true,
        "showDropdowns": true,
        //"alwaysShowCalendars": true,
        //"singleDatePicker": true,
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
            '本月': [moment().startOf('month').toDate(), moment().startOf('month').toDate()],
            '上月': [moment().subtract(1, 'month').startOf('month').toDate(), moment().subtract(1, 'month').startOf('month').toDate()],
            '上3月': [moment().subtract(3, 'month').startOf('month').toDate(), moment().subtract(1, 'month').startOf('month').toDate()],
            '上6月': [moment().subtract(6, 'month').startOf('month').toDate(), moment().subtract(1, 'month').startOf('month').toDate()],
            '上12月': [moment().subtract(12, 'month').startOf('month').toDate(), moment().subtract(1, 'month').startOf('month').toDate()],
            '今年': [moment().startOf('year').startOf('month').toDate(), moment().subtract(1, 'month').startOf('month').toDate()],
            '去年': [moment().subtract(1, 'year').startOf('year').startOf('month').toDate(), moment().subtract(1, 'year').endOf('year').startOf('month').toDate()],
        }
    };

    $(".weekly").hide();
    $(".monthly").hide();

    renderFilterOptions();
    $(".startDateSelectLabel").html(startDate + "~" + endDate);
    $(".startWeekDateSelectLabel").html(startWeekDate + "~" + endWeekDate);
    $(".startMonthDateSelectLabel").html(startMonthDate + "~" + endMonthDate);
    renderPage({"startDate": startDate, "endDate": endDate});

    $(".search").click(function () {
        var dateType = $(this).parent().parent().find(".dateType").val();
        var filter = getSelectedFilter(dateType, $(this));
        renderPage(filter);
    });
    $("#datatype").on('change', function () {
        var dateType = $(document).find(".dateType").val();
        var filter = getSelectedFilter(dateType, $(this));
    })

    $(".dateType").on('change', function () {
        var dateType = $(this).val();
        var filter = getSelectedFilter(dateType, $(this));
        renderPage(filter);
    });


    $('.marketingStartDatePicker').daterangepicker(datePickerOptions, pickStartDateRangeCallback);
    $('.marketingWeeklyStartDatePicker').daterangepicker(weekPickerOptions, pickStartWeekDateRangeCallback);
    $('.marketingMonthlyStartDatePicker').daterangepicker(monthPickerOptions, pickStartMonthDateRangeCallback);

};

function getSelectedFilter(dateType, $this) {
    var endDate = "";
    var startDate = "";
    var dt = "";
    if (dateType == "daily") {
        $(".daily").show();
        $(".weekly").hide();
        $(".monthly").hide();
        dt = $('.desktop-only .startDateSelectLabel').text().replace(/ /g, "").split("~");
        startDate = dt[0];
        endDate = dt[1];

    } else if (dateType == "weekly") {
        $(".daily").hide();
        $(".monthly").hide();
        $(".weekly").show();
        dt = $('.desktop-only .startWeekDateSelectLabel').text().replace(/ /g, "").split("~");
        startDate = dt[0];
        endDate = dt[1];

    } else if (dateType == "monthly") {
        $(".daily").hide();
        $(".monthly").show();
        $(".weekly").hide();
        dt = $('.desktop-only .startMonthDateSelectLabel').text().replace(/ /g, "").split("~");
        startDate = dt[0];
        endDate = dt[1];

    }


    var cityName = $(".city").val();
    var platform = $(".platform").val();
    var areaName = $(".areaName").val();
    var keyword = $(".keyword").val();
    var filter = {
        "dateType": dateType,
        "startDate": startDate,
        "endDate": endDate,
        "cityName": cityName,
        "platform": platform,
        "areaName": areaName,
        "keyword": keyword
    };
    return cleanParams(filter);
}


function renderPage(filter) {
    //var dateGap = -15;
    $("#chartContent").hide();
    $("#loading").show();
    var promise = getAggregateWebTrafficData(filter);
    promise.done(function (ret) {
        $("#chartContent").show();
        $("#loading").hide();
        var obj = getCalcDataByDate(ret);
        var retObj = {
            "uv": [],
            "inquiry_uv": [],
            "trade_uv": [],
            "inquiry_uv_rate": [],
            "trade_uv_rate": []
        };
        var dateType = 'daily';
        if (obj.series.uv.length > 0) {
            retObj.uv = obj.series.uv[obj.series.uv.length - 1]
        }
        if (obj.series.inquiry_uv.length > 0) {
            retObj.inquiry_uv = obj.series.inquiry_uv[obj.series.inquiry_uv.length - 1]
        }
        if (obj.series.trade_uv.length > 0) {
            retObj.trade_uv = obj.series.trade_uv[obj.series.trade_uv.length - 1]
        }
        if (obj.series.inquiry_uv_rate.length > 0) {
            retObj.inquiry_uv_rate = obj.series.inquiry_uv_rate[obj.series.inquiry_uv_rate.length - 1]
        }
        if (obj.series.trade_uv_rate.length > 0) {
            retObj.trade_uv_rate = obj.series.trade_uv_rate[obj.series.trade_uv_rate.length - 1]
        }
        var lastDate = "";
        if (obj.dateList.length > 0) {
            lastDate = obj.dateList[obj.dateList.length - 1]
        }
        if (filter.dateType != undefined) {
            dateType = filter.dateType;
        }
        drawDailyTrafficFunnelChart(lastDate, retObj);
        drawDailyTrafficStackChart(obj);
        //drawDailyMarketingUVTrend(obj);
        //renderTable
        renderTable(filter, obj);

    });

}


function renderTable(filter, objAll) {

    var obj = objAll.total;
    var trade_rate = "";
    var trade_success_rate = "";
    var per_trade_cnt_num = "";
    var per_trade_num = "";
    var inquiry_rate = "";
    var inquiry_trade_rate = "";
    var trade_trade_success_rate = "";//提交成交率
    if (obj.uv == 0) {
        trade_rate = "0.00%";
        trade_success_rate = "0.00%";
        inquiry_rate = "0.00%";
    } else {
        trade_rate = ((obj.trade_uv / obj.uv) * 100).toFixed(2) + "%";
        trade_success_rate = ((obj.trade_success_uv / obj.uv) * 100).toFixed(2) + "%";
        inquiry_rate = ((obj.inquiry_uv / obj.uv) * 100).toFixed(2) + "%";
    }

    if (obj.inquiry_uv == 0) {
        inquiry_trade_rate = "0.00%"
    } else {
        inquiry_trade_rate = ((obj.trade_uv / obj.inquiry_uv) * 100).toFixed(2) + "%";
    }

    if (obj.trade_uv == 0) {
        per_trade_cnt_num = "0.00%";
        trade_trade_success_rate = "0.00%"
    } else {
        per_trade_cnt_num = ((obj.trade_cnt_num / obj.trade_uv) * 100).toFixed(2) + "%";
        trade_trade_success_rate = ((obj.trade_success_uv / obj.trade_uv) * 100).toFixed(2) + "%"
    }

    if (obj.trade_success_cnt_num == 0) {
        per_trade_num = "0.00"
    } else {
        per_trade_num = ((obj.trade_success_amount_num / obj.trade_success_cnt_num)).toFixed(2)
    }


    var fixRow = '"<tr style="background-color: #acc087;"", " ", "", "", " data-index="0"", "", "", ">", "<td  style=""    >总数</td>", "<td  style=""    >-</td>", "<td  style=""    >-</td>", "<td  style=""    >-</td>", "<td  style=""    >-</td>", "<td  style=""    >' + obj.uv + '</td>", "<td  style=""    >' + obj.inquiry_uv + '</td>", "<td  style=""    >' + obj.trade_uv + '</td>","<td  style=""    >' + obj.trade_cnt_num + '</td>","</tr>"'
    var ajaxQuery = _.clone(filter);
    $('#marketingWebTrafficDataTable').bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        pagination: true,
        sidePagination: 'server',
        ajax: function (params) {
            var ajaxParams = $.extend(ajaxQuery, params.data);
            //$("#ctable").hide();
            getMarketingWebTraffic(ajaxParams).done(function (data) {
                //$("#ctable").show();
                params.success(data)
            });
        },
        fixRow: fixRow,
        cdataExport: "cdataExport",
        columns: [{
            field: 'date',
            title: '日期',
            sortable: true
        }, {
            field: 'areaName',
            title: '区域',
            sortable: true
        }, {
            field: 'cityName',
            title: '城市',
            sortable: true
        }, {
            field: 'platform',
            title: '平台',
            sortable: true
        },{
            field: 'utmTrack',
            title: 'utm_track',
            sortable: true
        },{
            field: 'uv',
            title: '总访客数',
            sortable: true
        }, {
            field: 'inquiry_uv',
            title: '询价访客数',
            sortable: true
        }, {
            field: 'trade_uv',
            title: '提交访客数',
            sortable: true
        }, {
            field: 'trade_cnt_num',
            title: '订单提交量',
            sortable: true
        }
        ],
    });
    $("#cdataExport").click(function () {
        var query = _.clone(filter);
        var sdt = moment(query.startDate);
        var edt = moment(query.endDate);
        var dflag = sdt.add(1, 'month') < edt;
        if (query["dateType"] == "daily" && dflag) {
            alert("导出文件最长间隔时间为1个月!");
            return;
        }

        $("#wholePage").mask({'label': "请等待，文件正在导出..."});
        var flag = query["dateType"];
        delete query["dateType"];
        if (flag == "daily" || !flag) {
            requestURL(dataService + "/product/exportProductUtmtrackDailyMarketingWebTrafficData", query).done(function (obj) {
                $("#wholePage").unmask();
                var url = Meteor.settings.public.downloadService.baseUrl + obj.fileName;
                var link = document.createElement("a");
                link.href = url;
                link.style = "visibility:hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        } else if (flag == "weekly") {
            requestURL(dataService + "/webTraffic/exportProductUtmtrackWeeklyMarketingWebTrafficData", query).done(function (obj) {
                $("#wholePage").unmask();
                var url = Meteor.settings.public.downloadService.baseUrl + obj.fileName;
                var link = document.createElement("a");
                link.href = url;
                link.style = "visibility:hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        } else if (flag == "monthly") {
            requestURL(dataService + "/webTraffic/exportProductUtmtrackMonthlyMarketingWebTrafficData", query).done(function (obj) {
                $("#wholePage").unmask();
                var url = Meteor.settings.public.downloadService.baseUrl + obj.fileName;
                var link = document.createElement("a");
                link.href = url;
                link.style = "visibility:hidden";
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            });
        }
    });

}

function renderFilterOptions() {
    //console.log(new Date())
    requestURL(dataService + "/product/getProductUtmtrackTrafficFilterOptions", {}).done(function (data) {
        //console.log(new Date())
        $(".city").attr("multiple", "multiple");
        $(".platform").attr("multiple", "multiple");
        $(".areaName").attr("multiple", "multiple");
        $(".utmTrack").attr("multiple", "multiple");
        renderOptions(".city", data.cityName);
        renderOptions(".platform", data.platform);
        renderOptions(".areaName", ["物流", "华北大区", "华东大区", "华南大区", "华西大区"]);
        console.log(new Date())
        renderOptions(".utmTrack", data.utmTrack);
        console.log(new Date())

        $(".areaName").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false
        });

        $(".city").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false,
            filter: true
        });
        $(".platform").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false,
            filter: true
        });
        $(".utmTrack").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false,
            filter: true
        });
    })
}

function renderOptions(sel, data) {
    $(sel).empty();
    var str = ""

    data.forEach(function (ele) {
        str+="<option value='" + ele + "'>" + ele + "</option>"
    });

    $(sel).append(str)
}

function pickStartDateRangeCallback(start, end, label) {
    console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.startDateSelectLabel').html(sdt + "~" + edt);
}
function pickStartWeekDateRangeCallback(start, end, label) {
    console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.startWeekDateSelectLabel').html(sdt + "~" + edt);
}
function pickStartMonthDateRangeCallback(start, end, label) {
    console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.startMonthDateSelectLabel').html(sdt + "~" + edt);
}

function getMarketingWebTraffic(filter) {
    //clean parameters
    //var query = cleanParams(filter);
    //only get one day important!!!
    var query = cleanParams(_.clone(filter));
    //query.startDate = query.endDate;
    var flag = query["dateType"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/product/getProductUtmtrackDailyMarketingWebTrafficData", query).done(function (ret) {
            dfd.resolve(ret)
        });
    } else if (flag == "weekly") {
        requestURL(dataService + "/product/getProductUtmtrackWeeklyMarketingWebTrafficData", query).done(function (ret) {
            dfd.resolve(ret)
        });
    } else if (flag == "monthly") {
        requestURL(dataService + "/product/getProductUtmtrackMonthlyMarketingWebTrafficData", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
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

function getAggregateWebTrafficData(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/product/getProductUtmtrackDailyAggregateMarketingWebTrafficData", query).done(function (ret) {
            dfd.resolve(ret)
        });
    } else if (flag == "weekly") {
        requestURL(dataService + "/product/getProductUtmtrackWeeklyAggregateMarketingWebTrafficData", query).done(function (ret) {
            dfd.resolve(ret)
        });
    } else if (flag == "monthly") {
        requestURL(dataService + "/product/getProductUtmtrackMonthlyAggregateMarketingWebTrafficData", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}

//获取总的计算数据
function getCalcData(data) {
    var uv = 0;
    var inquiry_uv = 0;
    var trade_uv = 0;
    var trade_cnt_num=0;
    data.forEach(function (e) {
        uv += e.uv;
        inquiry_uv += e.inquiry_uv;
        trade_uv += e.trade_uv;
        trade_cnt_num+= e.trade_cnt_num;
    });
    var inquiry_uv_rate = ((inquiry_uv / uv) * 100).toFixed(2);//询价转换率
    var trade_tranfers_rate = ((trade_uv / uv) * 100).toFixed(2);//提交转换率率
    var trade_uv_rate = ((trade_uv / inquiry_uv) * 100).toFixed(2);//询价提交率
    return {
        "trade_tranfers_rate": trade_tranfers_rate,
        "trade_uv_rate": trade_uv_rate,
        "inquiry_uv_rate": inquiry_uv_rate,
        "uv": uv,
        "inquiry_uv": inquiry_uv,
        "trade_uv": trade_uv,
        "trade_cnt_num":trade_cnt_num,
    }
}
//根据日期获取总的数据
function getCalcDataByDate(data) {
    var dataDict = _.groupBy(data, function (obj) {
        return obj.date
    });
    var total = {};
    var dateList = [];
    var series = {
        uv: [],
        inquiry_uv: [],
        trade_uv: [],
        trade_cnt_num: [],
        inquiry_uv_rate: [],
        trade_uv_rate: []
    };
    for (var key in dataDict) {
        dateList.push(key);
        var obj = getCalcData(dataDict[key]);
        series.uv.push(obj.uv);
        series.inquiry_uv.push(obj.inquiry_uv);
        series.trade_uv.push(obj.trade_uv);
        series.trade_cnt_num.push(obj.trade_cnt_num);
        series.inquiry_uv_rate.push(obj.inquiry_uv_rate);
        series.trade_uv_rate.push(obj.trade_uv_rate);
    }

    total.uv = series.uv.sum();
    total.inquiry_uv = series.inquiry_uv.sum();
    total.trade_uv = series.trade_uv.sum();
    total.trade_cnt_num = series.trade_cnt_num.sum();
    return {"dateList": dateList, "series": series, "total": total}
}

function drawDailyTrafficFunnelChart(date, obj) {

    var dateType = $(".dateType").val(), date2;
    if (dateType == "daily") {
        date2 = date;
    } else if (dateType == "weekly") {
        date2 = date + "~" + (new Date(date).getNewDate(7));
    } else if (dateType == "monthly") {
        date2 = date + "~" + (new moment(date).endOf('month').format('YYYY-MM-DD'));
    }
    var yAxis = ['总访客数',
        obj.inquiry_uv_rate + '%\n询价访客数',
        obj.trade_uv_rate + '%\n提交访客数'].reverse();
    var option = {
        title: {
            text: 'utm_track分析(' + date2 + ")",
            x: "center",
            //y: "bottom"
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
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
                data: yAxis,
                splitLine: {
                    show: true
                }
            }
        ],
        series: [
            {
                name: '市场',
                type: 'bar',
                itemStyle: {normal: {color: '#568FC8', label: {show: true, position: 'right', color: '#568FC8'}}},
                data: [obj.uv, obj.inquiry_uv, obj.trade_uv].reverse()
            }
        ]
    };
    var dailyTrafficFunnelChart = echarts.init(document.getElementById('dailyTrafficFunnelChart'));
    dailyTrafficFunnelChart.setOption(option);
    window.addEventListener('resize', dailyTrafficFunnelChart.resize)
}

function drawDailyTrafficStackChart(obj) {

    var option = {
        title: {
            text: '折线图堆叠',
            x: "center",
            padding: [0, 0, 0, 50]
            //y:"bottom"
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params, ticket, callback) {
                var str = params[0].name + '<br/>';
                params.forEach(function (obj) {
                    if (obj.seriesName.indexOf("率") > -1) {
                        str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                    } else {
                        str += obj.seriesName + ' : ' + obj.value + '<br/>'
                    }
                });
                return str;
            }
        },
        legend: {
            data: ['总访客数', '询价访客数', '提交访客数', '询价转化率', "提交询价率", "提交转化率"],
            padding: [25, 0, 0, 0]
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
            data: obj.dateList
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
                        return value + "%"
                    }
                }
            }
        ],
        series: [
            {
                name: '总访客数',
                type: 'line',
                //stack: '总量',
                data: obj.series.uv
            },
            {
                name: '询价访客数',
                type: 'line',
                // stack: '总量',
                data: obj.series.inquiry_uv
            },
            {
                name: '提交访客数',
                type: 'line',
                //stack: '总量',
                data: obj.series.trade_uv
            }
        ]
    };
    var dailyTrafficStackChart = echarts.init(document.getElementById('dailyTrafficStackChart'));
    dailyTrafficStackChart.setOption(option);
    window.addEventListener('resize', dailyTrafficStackChart.resize);

}

