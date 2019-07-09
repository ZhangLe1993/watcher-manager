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

Template.bdJdYihaodianTrafficChart.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#BDTab').addClass('active');
    $('#bdJdYihaodianTrafficChart').addClass('active');
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
    //$(".endDateSelectLabel").html(endDate);
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
    //$('.marketingEndDatePicker').daterangepicker(datePickerOptions, pickEndDateRangeCallback);
    $('.marketingWeeklyStartDatePicker').daterangepicker(weekPickerOptions, pickStartWeekDateRangeCallback);
    //$('.marketingWeeklyEndDatePicker').daterangepicker(weekPickerOptions, pickEndWeekDateRangeCallback);
    $('.marketingMonthlyStartDatePicker').daterangepicker(monthPickerOptions, pickStartMonthDateRangeCallback);
    //$('.marketingMonthlyEndDatePicker').daterangepicker(monthPickerOptions, pickEndMonthDateRangeCallback);

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
        //var dateGap = -15;
        //endDate = new Date().getNewDate(-1);
        //startDate = new Date(endDate).getNewDate(dateGap);
        //$(".endDateSelectLabel").html(endDate);
        //$(".startDateSelectLabel").html(startDate);
    } else if (dateType == "weekly") {
        $(".daily").hide();
        $(".monthly").hide();
        $(".weekly").show();
        dt = $('.desktop-only .startWeekDateSelectLabel').text().replace(/ /g, "").split("~");
        startDate = dt[0];
        endDate = dt[1];
        /*startDate = moment().weekday(-70).format("YYYY-MM-DD");
         endDate = moment().weekday(-7).format("YYYY-MM-DD");
         $(".endWeekDateSelectLabel").html(endDate);
         $(".startWeekDateSelectLabel").html(startDate);*/
    } else if (dateType == "monthly") {
        $(".daily").hide();
        $(".monthly").show();
        $(".weekly").hide();
        dt = $('.desktop-only .startMonthDateSelectLabel').text().replace(/ /g, "").split("~");
        startDate = dt[0];
        endDate = dt[1];
        /*endDate = moment().subtract(1,"month").startOf('month').format("YYYY-MM-DD");
         startDate = moment().subtract(10,"month").startOf('month').format("YYYY-MM-DD");
         $(".endMonthDateSelectLabel").html(endDate);
         $(".startMonthDateSelectLabel").html(startDate);*/
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
            pv: [],
            pv_uv_rate:[],
            uv: [],
            inquiry_uv_rate:[],
            inquiry_uv: [],
            inquiry_success_uv:[],
            inquiry_success_uv_rate: []
        };
        var dateType = 'daily';
        if (obj.series.pv.length > 0) {
            retObj.pv = obj.series.pv[obj.series.pv.length - 1]
        }
        if (obj.series.pv_uv_rate.length>0){
            retObj.pv_uv_rate=obj.series.pv_uv_rate[obj.series.pv_uv_rate.length - 1]
        }
        if (obj.series.uv.length > 0) {
            retObj.uv = obj.series.uv[obj.series.uv.length - 1]
        }
        if (obj.series.inquiry_uv.length > 0) {
            retObj.inquiry_uv = obj.series.inquiry_uv[obj.series.inquiry_uv.length - 1]
        }
        if (obj.series.inquiry_uv_rate.length > 0) {
            retObj.inquiry_uv_rate = obj.series.inquiry_uv_rate[obj.series.inquiry_uv_rate.length - 1]
        }
        if (obj.series.inquiry_success_uv.length > 0) {
            retObj.inquiry_success_uv = obj.series.inquiry_success_uv[obj.series.inquiry_success_uv.length - 1]
        }
        if (obj.series.inquiry_success_uv_rate.length > 0) {
            retObj.inquiry_success_uv_rate = obj.series.inquiry_success_uv_rate[obj.series.inquiry_success_uv_rate.length - 1]
        }
        var lastDate = "";
        if (obj.dateList.length > 0) {
            lastDate = obj.dateList[obj.dateList.length - 1]
        }
        if (filter.dateType != undefined) {
            dateType = filter.dateType;
        }
        drawDailyTrafficFunnelChart(lastDate, retObj);
        drawDailyPvTrafficFunnelChart(lastDate, retObj);
        //renderTable
        renderTable(filter, obj);

    });

}


function renderTable(filter, objAll) {

    var obj = objAll.total;
    var uv= "";
    var pv= "";
    var inquiry_uv = "";
    var inquiry_success_uv = "";

    var fixRow = '"<tr style="background-color: #acc087;"", " ", "", "", " data-index="0"", "", "", ">", "<td  style=""    >总数</td>", "<td  style=""    >-</td>", "<td  style=""    >-</td>", "<td  style=""    >-</td>", "<td  style=""    >' + obj.uv + '</td>", "<td  style=""    >' + obj.pv + '</td>", "<td  style=""    >' + obj.inquiry_uv + '</td>", "<td  style=""    >' + obj.inquiry_success_uv + '</td>", "</tr>"'
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
        }, {
            field: 'uv',
            title: '总访客数',
            sortable: true
        }, {
            field: 'pv',
            title: '页面总访客数',
            sortable: true
        }, {
            field: 'inquiry_uv',
            title: '询价访客数',
            sortable: true
        }, {
            field: 'inquiry_success_uv',
            title: '询价成功访客数',
            sortable: true
        }],
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
            requestURL(dataService + "/bd/exportJdYihaodianDailyMarketingWebTrafficData", query).done(function (obj) {
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
            requestURL(dataService + "/bd/exportJdYihaodianWeeklyMarketingWebTrafficData", query).done(function (obj) {
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
            requestURL(dataService + "/bd/exportJdYihaodianMonthlyMarketingWebTrafficData", query).done(function (obj) {
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


    //var dateList= objAll.dateList;
    //var series = objAll.series;
    //var tableJson = [];
    //
    //for(var i= 0,len=dateList.length;i<len;i++){
    //    var tmp = {
    //        "date":dateList[i],
    //        "uv":series.uv[i],
    //        "inquiry_uv":series.inquiry_uv[i],
    //        "trade_uv":series.trade_uv[i],
    //        "trade_cnt_num":series.trade_cnt_num[i],
    //        "trade_success_uv":series.trade_success_uv[i],
    //        "trade_success_cnt_num":series.trade_success_cnt_num[i],
    //        "trade_success_amount_num":series.trade_success_amount_num[i],
    //
    //    };
    //    tableJson.push(tmp);
    //}
    //
    //var fixRow2 = '"<tr style="background-color: #acc087;"", " ", "", "", " data-index="0"", "", "", ">", "<td  style=""    >总数</td>", "<td  style=""    >'+obj.uv+'</td>", "<td  style=""    >'+obj.inquiry_uv+'</td>", "<td  style=""    >'+obj.trade_uv+'</td>","<td  style=""    >'+trade_rate+'</td>","<td  style=""    >'+inquiry_rate+'</td>","<td  style=""    >'+inquiry_trade_rate+'</td>","<td  style=""    >'+obj.trade_cnt_num+'</td>","<td  style=""    >'+per_trade_cnt_num+'</td>","<td  style=""    >'+obj.trade_success_uv+'</td>", "<td  style=""    >'+obj.trade_success_cnt_num+'</td>", "<td  style=""    >'+trade_success_rate+'</td>","<td  style=""    >'+trade_trade_success_rate+'</td>", "<td  style=""    >'+obj.trade_success_amount_num+'</td>", "<td  style=""    >'+per_trade_num+'</td>", "</tr>"'
    //
    //$('#marketingSummaryWebTrafficDataTable').bootstrapTable('destroy').bootstrapTable({
    //    exportDataType: 'all',
    //    //pagination: true,
    //    fixRow:fixRow2,
    //    data:tableJson,
    //    columns: [{
    //        field: 'date',
    //        title: '日期',
    //        sortable:true
    //    }, {
    //        field: 'uv',
    //        title: '总访客数',
    //        sortable:true
    //    }, {
    //        field: 'inquiry_uv',
    //        title: '询价访客数',
    //        sortable:true
    //    }, {
    //        field: 'trade_uv',
    //        title: '提交访客数',
    //        sortable:true
    //    }, {
    //        field: 'trade_rate',
    //        title: '提交转化率',
    //        formatter:function(value,row,index){
    //            if(row.uv==0){
    //                return "0.00%"
    //            }
    //            return ((row.trade_uv/row.uv)*100).toFixed(2)+"%"
    //        }
    //    }, {
    //        field: 'inquiry_rate',
    //        title: '询价转化率',
    //        formatter:function(value,row,index){
    //            if(row.uv==0){
    //                return "0.00%"
    //            }
    //            return ((row.inquiry_uv/row.uv)*100).toFixed(2)+"%"
    //        }
    //    }, {
    //        field: 'inquiry_trade_rate',
    //        title: '提交询价率',
    //        formatter:function(value,row,index){
    //            if(row.inquiry_uv==0){
    //                return "0.00%"
    //            }
    //            return ((row.trade_uv/row.inquiry_uv)*100).toFixed(2)+"%"
    //        }
    //    }, {
    //        field: 'trade_cnt_num',
    //        title: '订单提交量',
    //        sortable:true
    //    }, {
    //        field: 'per_trade_cnt_num',
    //        title: '人均提交量',
    //        formatter:function(value,row,index){
    //            if(row.trade_uv==0){
    //                return "0.00%"
    //            }else{
    //                return ((row.trade_cnt_num/row.trade_uv)*100).toFixed(2)+"%"
    //            }
    //        }
    //    }, {
    //        field: 'trade_success_uv',
    //        title: '成交用户数',
    //        sortable:true
    //    }, {
    //        field: 'trade_success_cnt_num',
    //        title: '订单成交量',
    //        sortable:true
    //    },{
    //        field: 'trade_success_rate',
    //        title: '成交转化率',
    //        formatter:function(value,row,index){
    //            if(row.uv==0){
    //                return "0.00%"
    //            }
    //            return ((row.trade_success_uv/row.uv)*100).toFixed(2)+"%"
    //        }
    //    },{
    //        field: 'trade_trade_success_rate',
    //        title: '成交提交率',
    //        formatter:function(value,row,index){
    //            if(row.trade_uv==0){
    //                return "0.00%"
    //            }
    //            return ((row.trade_success_uv/row.trade_uv)*100).toFixed(2)+"%"
    //        }
    //    },{
    //        field: 'trade_success_amount_num',
    //        title: '成交金额',
    //        sortable:true
    //    },{
    //        field: 'per_trade_num',
    //        title: '客单价',
    //        formatter:function(value,row,index){
    //            if(row.trade_success_cnt_num==0){
    //                return "0.00"
    //            }
    //            return ((row.trade_success_amount_num/row.trade_success_cnt_num)).toFixed(2)
    //        }
    //    }],
    //});

}


function getFilterOptions() {
    var dfd = $.Deferred();
    requestURL(dataService + "/bd/getJdYihaodianFilterOptions", {}).done(function (ret) {
        dfd.resolve(ret)
    });
    return dfd.promise()
}

function renderFilterOptions() {
    var promise = getFilterOptions();
    promise.done(function (data) {
        //renderOptions(".weekly",data.weekStats);
        //renderOptions(".areaName",data.areaNameStats);
        $(".city").attr("multiple", "multiple");
        $(".platform").attr("multiple", "multiple");
        $(".areaName").attr("multiple", "multiple");
        renderOptions(".city", data.cityName);
        renderOptions(".platform", data.platform);
        renderOptions(".areaName", ["物流", "华北大区", "华东大区", "华南大区", "华西大区"]);

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
            selectAll: false
        });
    })
}

function renderOptions(sel, data) {
    $(sel).empty();
    data.forEach(function (ele) {
        $(sel).append("<option value='" + ele + "'>" + ele + "</option>")
    });
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
        requestURL(dataService + "/bd/getJdYihaodianDailyMarketingWebTrafficData", query).done(function (ret) {
            dfd.resolve(ret)
        });
    } else if (flag == "weekly") {
        requestURL(dataService + "/bd/getJdYihaodianWeeklyMarketingWebTrafficData", query).done(function (ret) {
            dfd.resolve(ret)
        });
    } else if (flag == "monthly") {
        requestURL(dataService + "/bd/getJdYihaodianMonthlyMarketingWebTrafficData", query).done(function (ret) {
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
        requestURL(dataService + "/bd/getJdYihaodianDailyAggregateWebTrafficData", query).done(function (ret) {
            dfd.resolve(ret)
        });
    } else if (flag == "weekly") {
        requestURL(dataService + "/bd/getJdYihaodianWeeklyAggregateWebTrafficData", query).done(function (ret) {
            dfd.resolve(ret)
        });
    } else if (flag == "monthly") {
        requestURL(dataService + "/bd/getJdYihaodianMonthlyAggregateWebTrafficData", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}

//获取总的计算数据
function getCalcData(data) {
    var pv = 0;
    var uv = 0;
    var inquiry_uv = 0;
    var inquiry_success_uv = 0;
    data.forEach(function (e) {
        pv += e.pv;
        uv += e.uv;
        inquiry_uv += e.inquiry_uv;
        inquiry_success_uv += e.inquiry_success_uv;
    });
    var pv_uv_rate = ((pv / uv) * 100).toFixed(2)
    var inquiry_uv_date = ((inquiry_uv / uv) * 100).toFixed(2);//询价转换率
    var inquiry_success_uv_rate = ((inquiry_success_uv / uv) * 100).toFixed(2);//提交转换率率
    return {
        "inquiry_uv_rate": inquiry_uv_date,
        "pv_uv_rate": pv_uv_rate,
        "uv": uv,
        "pv": pv,
        "inquiry_uv": inquiry_uv,
        "inquiry_success_uv_rate": inquiry_success_uv_rate,
        "inquiry_success_uv": inquiry_success_uv,
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
        pv: [],
        pv_uv_rate:[],
        uv: [],
        inquiry_uv_rate:[],
        inquiry_uv: [],
        inquiry_success_uv:[],
        inquiry_success_uv_rate: []
    };
    for (var key in dataDict) {
        dateList.push(key);
        var obj = getCalcData(dataDict[key]);
        series.pv.push(obj.pv);
        series.uv.push(obj.uv);
        series.pv_uv_rate.push(obj.pv_uv_rate);
        series.inquiry_uv.push(obj.inquiry_uv);
        series.inquiry_uv_rate.push(obj.inquiry_uv_rate);
        series.inquiry_success_uv.push(obj.inquiry_success_uv);
        series.inquiry_success_uv_rate.push(obj.inquiry_success_uv_rate);
    }

    total.pv=series.pv.sum();
    total.uv = series.uv.sum();
    total.inquiry_uv = series.inquiry_uv.sum();
    total.inquiry_success_uv = series.inquiry_success_uv.sum();
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
        obj.inquiry_success_uv_rate + '%\n询价成功访客数'].reverse();
    var option = {
        title: {
            text: '京东一号店流量(' + date2 + ")",
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
                name: 'BD',
                type: 'bar',
                itemStyle: {normal: {color: '#568FC8', label: {show: true, position: 'right', color: '#568FC8'}}},
                data: [obj.uv, obj.inquiry_uv, obj.inquiry_success_uv].reverse()
            }
        ]
    };
    var dailyTrafficFunnelChart = echarts.init(document.getElementById('dailyTrafficFunnelChart'));
    dailyTrafficFunnelChart.setOption(option);
    window.addEventListener('resize', dailyTrafficFunnelChart.resize)
}

function drawDailyPvTrafficFunnelChart(date, obj) {

    var dateType = $(".dateType").val(), date2;
    if (dateType == "daily") {
        date2 = date;
    } else if (dateType == "weekly") {
        date2 = date + "~" + (new Date(date).getNewDate(7));
    } else if (dateType == "monthly") {
        date2 = date + "~" + (new moment(date).endOf('month').format('YYYY-MM-DD'));
    }
    var yAxis = ['页面总访问数(PV)'+obj.pv].reverse();
    var option = {
        title: {
            text: '京东一号店流量(' + date2 + ")",
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
                name: 'BD',
                type: 'bar',
                itemStyle: {normal: {color: '#568FC8', label: {show: true, position: 'right', color: '#568FC8'}}},
                data: [obj.pv].reverse()
            }
        ]
    };
    var dailyTrafficFunnelChart = echarts.init(document.getElementById('dailyPvTrafficFunnelChart'));
    dailyTrafficFunnelChart.setOption(option);
    window.addEventListener('resize', dailyTrafficFunnelChart.resize)
}
