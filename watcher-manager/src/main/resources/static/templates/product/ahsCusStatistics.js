/**
 * Created by hsh on 2016/5/13.
 */
Template.ahsCusStatistics.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#productTab').addClass('active');
    $('#ahsCusStatistics').addClass('active');
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
            getValue();
        }else if(dateType=="weekly"){
            $(".webTrafficFunnelDate").hide();
            $(".webTrafficFunnelWeek").show();
            $(".webTrafficFunnelMonth").hide();
            getValue();
        }else if(dateType=="monthly"){
            $(".webTrafficFunnelDate").hide();
            $(".webTrafficFunnelWeek").hide();
            $(".webTrafficFunnelMonth").show();
            getValue();
        }
    });

    //选项初始化加载
    requestURL(dataService+"/product/getProductCusStatisticsTrafficFilterOptions",{}).done(function(data){
        /*网址*/
        $(".web").attr("multiple","multiple");
        renderOptions(".web",["m版本","官网","微信","IOS","Android","Android原生APP","iOS原生APP"]);

        $(".web").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false,
            filter: true
        });

        /*区域*/
        $(".area").attr("multiple","multiple");
        renderOptions(".area",["物流","华北大区","华东大区","华南大区","华西大区"]);

        $(".area").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false,
            filter: true
        });

        /*城市*/
        $(".city").attr("multiple","multiple");
        data.cityName.forEach(function (e) {
            $(".city").append("<option value='" + e + "'>" + e + "</option>");
        });

        $(".city").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false,
            filter: true
        });
    });

    $(".search").click(function(){
        var dateType =$(".dateType").val();
        if(dateType=="daily"){
            $(".webTrafficFunnelDate").show();
            $(".webTrafficFunnelWeek").hide();
            $(".webTrafficFunnelMonth").hide();
            getValue();
        }else if(dateType=="weekly"){
            $(".webTrafficFunnelDate").hide();
            $(".webTrafficFunnelWeek").show();
            $(".webTrafficFunnelMonth").hide();
            getValue();
        }else if(dateType=="monthly"){
            $(".webTrafficFunnelDate").hide();
            $(".webTrafficFunnelWeek").hide();
            $(".webTrafficFunnelMonth").show();
            getValue();
        }
    });

    getValue();
    /*       导出数据*/
    $(".export").click(function(){
        var appHeader=["日期,","活跃访客数,","新增访客数,"];
        exportFile(exportData, appHeader,"","dataCommon");
    });
};

//dataService = Meteor.settings.public.dataService.baseUrl;
var exportData;

function pickWebTrafficFunnelDateRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.dateSelectLabel').html(sdt+"~"+edt);
}

function pickWebTrafficFunnelWeekRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.weekSelectLabel').html(sdt+"~"+edt);
}

function pickWebTrafficFunnelMonthRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.monthSelectLabel').html(sdt+"~"+edt);
}

function renderOptions(sel,data){
    $(sel).empty();
    data.forEach(function(ele){
        $(sel).append("<option value='"+ele+"'>"+ele+"</option>")
    });
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

function getValue(){
    var flag=$(".dateType").val();
    var site=$(".web").val();
    var area=$(".area").val();
    var cityName=$(".city").val();
    if(flag=="daily"){
            var dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g,"").split("~");
            var startDate = dt[0];
            var endDate = dt[1];
            var filter = {
                "startDate": startDate,
                "endDate": endDate,
                "mainUrl": site,
                "area": area,
                "cityName": cityName
            };
            var query = cleanParams(_.clone(filter));
            requestURL(dataService + "/product/getCusStatisticsDay", query).done(function (data) {
                exportData=data;
                drawcusStaChart(data,flag,site);
//                drawnewCusStaChart(data,flag,site);
                drawallCusStayTimeStaChart(data,flag,site);
                drawallCusStaChart(data,flag,site);
            });
    }else if(flag=="weekly"){
            var dt = $('.desktop-only .weekSelectLabel').text().replace(/ /g,"").split("~");
            var startDate = dt[0];
            var endDate = dt[1];
            var filter = {
                "startDate": startDate,
                "endDate": endDate,
                "mainUrl": site,
                "area": area,
                "cityName": cityName
            };
            var query = cleanParams(_.clone(filter));
            requestURL(dataService + "/product/getCusStatisticsWeek", query).done(function (data) {
                exportData=data;
                drawcusStaChart(data,flag,site);
                drawallCusStayTimeStaChart(data,flag,site);
                drawallCusStaChart(data,flag,site);
            });
    }else if(flag=="monthly"){
            var dt = $('.desktop-only .monthSelectLabel').text().replace(/ /g,"").split("~");
            var startDate = dt[0];
            var endDate = dt[1];
            var filter = {
                "startDate": startDate,
                "endDate": endDate,
                "mainUrl": site,
                "area": area,
                "cityName": cityName
            };
            var query = cleanParams(_.clone(filter));
            requestURL(dataService + "/product/getCusStatisticsMonth", query).done(function (data) {
                exportData=data;
                drawcusStaChart(data,flag,site);
                drawallCusStayTimeStaChart(data,flag,site);
                drawallCusStaChart(data,flag,site);
            });
    }
}

/*活跃访客统计*/
function drawcusStaChart(data, flagValue,site) {
        var xAxis_data = [];
        var series = {
            alluv: [],
            newuv: [],
            olduv: []
        };
        data.forEach(function (e) {
            xAxis_data.push(new Date(e.date).format("yyyy-MM-dd"));
            series.alluv.push(e.allUser);
            series.newuv.push(e.newUser);
            series.olduv.push(e.allUser-e.newUser);
        });
        xAxis_data=_.uniq(xAxis_data);

        var option = {
            title: {
                text: '访客统计',
                x: "center",
                y: "bottom"
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['活跃访客数','新访客数','老访客数']
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
                    name: '活跃访客数',
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
                    data: series.alluv
                },
                {
                    name: '新访客数',
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
                    data: series.newuv
                },
                {
                    name: '老访客数',
                    type: 'line',

                    data: series.olduv
                }
            ]
        };
        var cusStaChart = echarts.init(document.getElementById('cusStaChart'));
        cusStaChart.setOption(option);
        window.addEventListener('resize',cusStaChart.resize)
}

/*新老访客访问时间统计*/
function drawallCusStayTimeStaChart(data, flagValue,site) {
        var xAxis_data = [];
        var series = {
            avgTimeNewUser:[],
            maxTimeNewUser:[],
            minTimeNewUser:[],
            avgTimeOldUser:[],
            maxTimeOldUser:[],
            minTimeOldUser:[]
        };
    data.forEach(function (e) {
        xAxis_data.push(new Date(e.date).format("yyyy-MM-dd"));
        series.avgTimeNewUser.push(e.avgTimeNewUser);
        series.maxTimeNewUser.push(e.maxTimeNewUser);
        series.minTimeNewUser.push(e.minTimeNewUser);
        series.avgTimeOldUser.push(e.avgTimeOldUser);
        series.maxTimeOldUser.push(e.maxTimeOldUser);
        series.minTimeOldUser.push(e.minTimeOldUser);
    });
        xAxis_data=_.uniq(xAxis_data);

        var option = {
            title: {
                text: '新老访客访问时间统计(分钟)',
                x: "center",
                y: "bottom"
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['老访客平均访问时间','老访客最大访问时间','老访客最小访问时间','新访客平均访问时间','新访客最大访问时间','新访客最小访问时间']
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
                    name: '老访客平均访问时间',
                    type: 'line',

                    data: series.avgTimeOldUser
                },
                {
                    name: '老访客最大访问时间',
                    type: 'line',

                    data: series.maxTimeOldUser
                },
                {
                    name: '老访客最小访问时间',
                    type: 'line',

                    data: series.minTimeOldUser
                },
                {
                    name: '新访客平均访问时间',
                    type: 'line',

                    data: series.avgTimeNewUser
                },
                {
                    name: '新访客最大访问时间',
                    type: 'line',

                    data: series.maxTimeNewUser
                },
                {
                    name: '新访客最小访问时间',
                    type: 'line',

                    data: series.minTimeNewUser
                }
            ]
        };
        var allCusStayTimeStaChart = echarts.init(document.getElementById('allCusStayTimeStaChart'));
        allCusStayTimeStaChart.setOption(option);
        window.addEventListener('resize',allCusStayTimeStaChart.resize);
}

/*新老访客占比统计*/
function drawallCusStaChart(data, flagValue,site) {
        var xAxis_data = [];
        var series = {
            newCus: [],
            oldCus: []
        };
        data.forEach(function (e) {
                xAxis_data.push(new Date(e.date).format("yyyy-MM-dd"));
                series.newCus.push(((e.newUser) / (e.allUser) * 100).toFixed(2));
                series.oldCus.push(((e.allUser-e.newUser) / (e.allUser) * 100).toFixed(2));
        });

        xAxis_data=_.uniq(xAxis_data);

        var option = {
            title: {
                text: '新老访客占比统计',
                x: "center",
                y: "bottom"
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    return params[0].name + '<br/>' +
                        params[0].seriesName + ':' + params[0].value + '%' + '<br/>' +
                        params[1].seriesName + ':' + params[1].value + '%';
                }
            },
            legend: {
                data: ['新访客占比', '老访客占比']
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
                type: 'value',
                axisLabel: {
                    show: true,
                    interval: 'auto',
                    formatter: '{value} %'
                }
            },
            series: [
                {
                    name: '新访客占比',
                    type: 'line',
                    itemStyle: {
                        normal: {
                            color: '#568FC8',
                            label: {
                                show: true,
                                position: 'top',
                                formatter: '{c} %',
                                textStyle: {
                                    color: '#568FC8'
                                }
                            }
                        }
                    },
                    data: series.newCus
                },
                {
                    name: '老访客占比',
                    type: 'line',
                    itemStyle: {
                        normal: {
                            color: '#d48265',
                            label: {
                                show: true,
                                position: 'top',
                                formatter: '{c} %',
                                textStyle: {
                                    color: '#d48265'
                                }
                            }
                        }
                    },
                    data: series.oldCus
                }
            ]
        };
        var allCusStaChart = echarts.init(document.getElementById('allCusStaChart'));
        allCusStaChart.setOption(option);
        window.addEventListener('resize',allCusStaChart.resize)
}

