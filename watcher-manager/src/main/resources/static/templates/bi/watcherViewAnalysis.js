Template.watcherViewAnalysis.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#BITab').addClass('active');
    $('#watcherViewAnalysis').addClass('active');

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var dateGap = -0;
    var minWeekDate = "2016-07-03";
    var minMonthDate = "2016-07-01";
    var endDate = new Date().getNewDate(-0);
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
        "minDate": transformDate("2017-01-01"),
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
            '最近14天': [moment().subtract(14, 'days').toDate(), moment().toDate()],
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


    $(".webTrafficFunnelDate").show();

    renderPageDay();
    renderPagename();


    //选项初始化加载
    refreshOption(startDate, new Date().getNewDate(1));
    /*requestURL(dataService+"/bi/getBIFilterOptions",{sdt:startDate, edt:new Date().getNewDate(1)}).done(function(data){
        finalPageName = data.pageName;
        var first = [];
        var second = [];

        var third = [];

        _.each(data.pageName, function(ele) {
            if(ele != "") {
                var temp = ele.split("-");
                if(temp != undefined && temp.length == 2) {
                    first.push(temp[0]);
                }

                if(temp != undefined && temp.length == 3) {
                    second.push(temp[0] + "-" + temp[1]);
                }

                if(temp != undefined && temp.length == 4) {
                    third.push(temp[0] + "-" + temp[1] + "-" + temp[2]);
                }

            }

        });

        finalFirst = _.uniq(first);
        finalSecond = _.uniq(second);
        third = _.uniq(third);
        //console.log(finalFirst);
        //console.log(finalSecond);
        //console.log(third);

        /!*页面名称*!/
        $("#pageName").attr("multiple","multiple");

        renderOptions("#pageName",data.pageName);

        var ua = navigator.userAgent.toLowerCase();
        var isAndroid = ua.indexOf("android") > -1;
        var isiOS = ua.indexOf("iphone") > -1;
        if (isAndroid || isiOS) {
            $("#pageName").multipleSelect({
                placeholder: "全部",
                selectAllText:"全部",
                height: 34,
                width: 250,
                selectAll: true,
                filter: true
            });
        }else{
            $("#pageName").multipleSelect({
                placeholder: "全部",
                selectAllText:"全部",
                height: 34,
                width: 250,
                selectAll: true,
                filter: true
            });

            $(".ms-choice").attr("style","height:34px;");
            $(".ms-choice").children().css("margin-top", "5px");
        }
        $(".ms-parent").attr("style","width: 75%;height:34px;");

    });*/


    $(".search").click(function() {
        renderPageDay();
        renderPagename();
    });

    $(".type").change(function() {
        $("#pageName").html('');
        $("#pageName").attr("multiple","multiple");
        var type = $(".type").val();
        switch(type) {
            case "0":
                renderOptions("#pageName", finalPageName);
                $("#pageName").multipleSelect({
                    placeholder: "全部",
                    selectAllText:"全部",
                    height: 34,
                    width: 250,
                    selectAll: true,
                    filter: true
                });
                break;
            case "1":
                renderOptions("#pageName", finalFirst);
                $("#pageName").multipleSelect({
                    placeholder: "全部一级菜单",
                    selectAllText:"全部一级菜单",
                    height: 34,
                    width: 250,
                    selectAll: true,
                    filter: true
                });
                break;
            case "2":
                renderOptions("#pageName", finalSecond);
                $("#pageName").multipleSelect({
                    placeholder: "全部二级菜单",
                    selectAllText:"全部二级菜单",
                    height: 34,
                    width: 250,
                    selectAll: true,
                    filter: true
                });
                break;
        }

        $(".ms-choice").attr("style","height:34px;");
        $(".ms-choice").children().css("margin-top", "5px");
        $(".ms-parent").attr("style","width: 75%;height:34px;");
    });

};

var finalPageName = [];

var finalFirst = [];

var finalSecond = [];

var filter={};

var refreshOption = function(sdt, edt) {
    //选项初始化加载
    requestURL(dataService+"/bi/getBIFilterOptions",{sdt:sdt, edt:edt}).done(function(data){
        finalPageName = data.pageName;
        var first = [];
        var second = [];

        var third = [];

        _.each(data.pageName, function(ele) {
            if(ele != "") {
                var temp = ele.split("-");
                if(temp != undefined && temp.length == 2) {
                    first.push(temp[0]);
                }

                if(temp != undefined && temp.length == 3) {
                    second.push(temp[0] + "-" + temp[1]);
                }

                if(temp != undefined && temp.length == 4) {
                    third.push(temp[0] + "-" + temp[1] + "-" + temp[2]);
                }

            }

        });

        finalFirst = _.uniq(first);
        finalSecond = _.uniq(second);
        third = _.uniq(third);
        //console.log(finalFirst);
        //console.log(finalSecond);
        //console.log(third);

        /*页面名称*/
        $("#pageName").attr("multiple","multiple");

        renderOptions("#pageName",data.pageName);

        var ua = navigator.userAgent.toLowerCase();
        var isAndroid = ua.indexOf("android") > -1;
        var isiOS = ua.indexOf("iphone") > -1;
        if (isAndroid || isiOS) {
            $("#pageName").multipleSelect({
                placeholder: "全部",
                selectAllText:"全部",
                height: 34,
                width: 250,
                selectAll: true,
                filter: true
            });
        }else{
            $("#pageName").multipleSelect({
                placeholder: "全部",
                selectAllText:"全部",
                height: 34,
                width: 250,
                selectAll: true,
                filter: true
            });

            $(".ms-choice").attr("style","height:34px;");
            $(".ms-choice").children().css("margin-top", "5px");
        }
        $(".ms-parent").attr("style","width: 75%;height:34px;");

    });
};

function pickWebTrafficFunnelDateRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.dateSelectLabel').html(sdt + "~" + edt);
    refreshOption(sdt, new Date(end).getNewDate(1));
}

function renderPageDay() {
    //var dateGap = -15;
    $("#tablee").hide();
    $("#loading2").show();
    var filter=getSelectedFilter();

    //console.log(filter);
    var promise = getBIWatcherViewCollectInfo(filter);
    promise.done(function (ret) {
        $("#tablee").show();
        $("#loading2").hide();

        //renderTable
        renderTable(ret,'#tablee');
    });

}

function renderPagename() {
    //var dateGap = -15;
    $("#tablef").hide();
    $("#loading3").show();
    var filter=getSelectedFilter();
    var promise = getBIWatcherViewCollectUsernameInfo(filter);
    promise.done(function (ret) {
        $("#tablef").show();
        $("#loading3").hide();

        //renderTable
        renderTable(ret,'#tablef');
    });

}

function getSelectedFilter() {
    var dt = $('.desktop-only-c .dateSelectLabel').text().replace(/ /g, "").split("~");
    var startDate = dt[0];
    var endDate = dt[1];

    var pageName = $(".pageName").val();
    //console.log(pageName);
    var type = $(".type").val();
    if(pageName == null) {
        if(type == "1") {
            pageName = finalFirst;
        } else if(type == "2") {
            pageName = finalSecond;
        }
    }
    filter.type = type;
    filter.startDate=startDate;
    filter.endDate=endDate;
    filter.pageName=pageName;

    return cleanParams(filter);
}

function renderTable(data,tableName) {

    $(tableName).bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        data:data
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

function getBIWatcherViewCollectInfo(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURLPost(dataService + "/divine/getBIWatcherViewCollectInfo", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}

function getBIWatcherViewCollectUsernameInfo(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURLPost(dataService + "/divine/getBIWatcherViewCollectUsernameInfo", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}




