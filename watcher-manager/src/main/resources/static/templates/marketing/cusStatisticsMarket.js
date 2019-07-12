/**
 * Created by hsh on 2016/5/13.
 */
Template.cusStatisticsMarket.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#MarketingTab').addClass('active');
    $('#cusStatisticsMarket').addClass('active');
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

    getValue();
    /*       导出数据*/
    $(".export").click(function(){
        var appHeader=["日期,","网址,","活跃访客数,","新增访客数,"];
        exportFile(exportData, appHeader,"","dataCommon");
    });
};

function pickWebTrafficFunnelDateRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.dateSelectLabel').html(sdt+"~"+edt);

    getValue();
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

// dataService = Meteor.settings.public.dataService.baseUrl;

function getValue(){
    var flag=$(".dateType").val();
    var site=$(".web").val();
    if(flag=="daily"){
            var dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g,"").split("~");
            var startDate = dt[0];
            var endDate = dt[1];
            var query = {
                "startDate": startDate,
                "endDate": endDate
            };
            requestURL(dataService + "/webTraffic/getMarketingCusStatistics", query).done(function (data) {
                exportData=data;
                drawcusStaChart(data,flag,site);
//                drawnewCusStaChart(data,flag,site);
//                drawoldCusStaChart(data,flag,site);
                drawnewCusStaChart(data,flag,site);
            });
    }else if(flag=="weekly"){
            var dt = $('.desktop-only .weekSelectLabel').text().replace(/ /g,"").split("~");
            var startDate = dt[0];
            var endDate = dt[1];
            var query = {
                "startDate": startDate,
                "endDate": endDate
            };
            requestURL(dataService + "/webTraffic/getMarketingCusStatisticsWeek", query).done(function (data) {
                exportData=data;
                drawcusStaChart(data,flag,site);
//                drawnewCusStaChart(data,flag,site);
//                drawoldCusStaChart(data,flag,site);
                drawnewCusStaChart(data,flag,site);
            });
    }else if(flag=="monthly"){
             var dt = $('.desktop-only .monthSelectLabel').text().replace(/ /g,"").split("~");
             var startDate = dt[0];
             var endDate = dt[1];
             var query = {
                 "startDate": startDate,
                 "endDate": endDate
             };
             requestURL(dataService + "/webTraffic/getMarketingCusStatisticsMonth", query).done(function (data) {
                 exportData=data;
                 drawcusStaChart(data,flag,site);
    //                drawnewCusStaChart(data,flag,site);
    //                drawoldCusStaChart(data,flag,site);
                 drawnewCusStaChart(data,flag,site);
             });
     }
}

/*活跃访客统计*/
function drawcusStaChart(data, flagValue) {
        var seriesPc = {
            date: [],
            pcuv:[]
        };
        var seriesM = {
            date: [],
            muv:[]
        };
        data.forEach(function (e) {
            if (flagValue == "week") {
                if(e.siteName=="http://m.mk.aihuishou.com"){
                    seriesM.date.push(e.week);
                    seriesM.muv.push(e.allUser);
                }else{
                    seriesPc.date.push(e.week);
                    seriesPc.pcuv.push(e.allUser);
                }
            } else if (flagValue == "month") {
                if(e.siteName=="http://m.mk.aihuishou.com"){
                    seriesM.date.push(e.month_year_cd);
                    seriesM.muv.push(e.allUser);
                }else{
                    seriesPc.date.push(e.month_year_cd);
                    seriesPc.pcuv.push(e.allUser);
                }
            } else{
                if(e.siteName=="http://m.mk.aihuishou.com"){
                    seriesM.date.push(e.date);
                    seriesM.muv.push(e.allUser);
                }else{
                    seriesPc.date.push(e.date);
                    seriesPc.pcuv.push(e.allUser);
                }
            }
        });
          for(var i=0;i<seriesPc.date.length;i++){
                if(seriesPc.date[i]<seriesM.date[i]){
                    seriesM.date.splice(i,0,seriesPc.date[i]);
                    seriesM.muv.splice(i,0,"undefined");
                }else if(seriesPc.date[i]>seriesM.date[i]){
                    seriesPc.date.splice(i,0,seriesM.date[i]);
                    seriesPc.pcuv.splice(i,0,"undefined");
                }
          }
        if(seriesPc.date[0]==undefined){
            seriesPc.date=seriesM.date;
            seriesPc.pcuv[0]="undefined";
        }

        var option = {
                tooltip: {
                    trigger: 'axis',
                    formatter:function(params,ticket,callback){
                        var  str = params[0].name;
                        if(!str){
                            str = params[1].name;
                        }
                        str+='<br/>';
                        params.forEach(function(obj){
                            if(obj.value){
                                str +=obj.seriesName + ' : ' + obj.value + '<br/>';
                            }
                        });
                       return (str)
                    }
                },
                toolbox: {
                    feature: {
//                        dataView: {show: true, readOnly: false},
//                        magicType: {show: true, type: ['line', 'bar']},
//                        restore: {show: true},
//                        saveAsImage: {show: true}
                    }
                },
                legend: {
                    data:['PC版活跃访客数','M版活跃访客数']
                },
                xAxis: [
                    {
                        type: 'category',
                        data: seriesM.date
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: 'PC版活跃访客数',
                        splitLine: {
                            show: false
                        }
                    },
                    {
                        type: 'value',
                        name: 'M版活跃访客数',
                        min: 0,
                        splitLine: {
                            show: false
                        }
                    }
                ],
                series: [
                    {
                        name:'PC版活跃访客数',
                        type:'line',
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    position: 'top',
                                    formatter: '{c}'
                                }
                            }
                        },
                        data:seriesPc.pcuv
                    },
                    {
                        name:'M版活跃访客数',
                        type:'line',
                        yAxisIndex: 1,
                        itemStyle: {
                            normal: {
                                color: '#568FC8',
                                label: {
                                    show: true,
                                    position: 'bottom',
                                    formatter: '{c}',
                                    textStyle: {
                                        color: '#568FC8'
                                    }
                                }
                            }
                        },
                        data:seriesM.muv
                    }
                ]
        };
        var cusStaChart = echarts.init(document.getElementById('cusStaChart'));
        cusStaChart.setOption(option);
        window.addEventListener('resize',cusStaChart.resize)
}

/*新增访客统计*/
function drawnewCusStaChart(data, flagValue) {
        var seriespc = {
            date:[],
            pcuv: []
        };
        var seriesm = {
            date:[],
            muv:[]
        };
        data.forEach(function (e) {
            if (flagValue == "week") {
                if(e.siteName=="http://m.mk.aihuishou.com"){
                    seriesm.date.push(e.week);
                    seriesm.muv.push(e.newUser);
                }else{
                    seriespc.date.push(e.week);
                    seriespc.pcuv.push(e.newUser);
                }
            } else if (flagValue == "month") {
                if(e.siteName=="http://m.mk.aihuishou.com"){
                    seriesm.date.push(e.month_year_cd);
                    seriesm.muv.push(e.newUser);
                }else{
                    seriespc.date.push(e.month_year_cd);
                    seriespc.pcuv.push(e.newUser);
                }
            } else{
                if(e.siteName=="http://m.mk.aihuishou.com"){
                    seriesm.date.push(e.date);
                    seriesm.muv.push(e.newUser);
                }else{
                    seriespc.date.push(e.date);
                    seriespc.pcuv.push(e.newUser);
                }
            }
        });
          for(var i=0;i<seriespc.date.length;i++){
                if(seriespc.date[i]<seriesm.date[i]){
                    seriesm.date.splice(i,0,seriespc.date[i]);
                    seriesm.muv.splice(i,0,"undefined");
                }else if(seriespc.date[i]>seriesm.date[i]){
                    seriespc.date.splice(i,0,seriesm.date[i]);
                    seriespc.pcuv.splice(i,0,"undefined");
                }
          }
    if(seriespc.date[0]==undefined){
        seriespc.date=seriesm.date;
        seriespc.pcuv[0]="undefined";
    }

        var option = {
                tooltip: {
                    trigger: 'axis',
                    formatter:function(params,ticket,callback){
                        var  str = params[0].name;
                        if(!str){
                            str = params[1].name;
                        }
                        str+='<br/>';
                        params.forEach(function(obj){
                            if(obj.value){
                                str +=obj.seriesName + ' : ' + obj.value + '<br/>';
                            }
                        });
                       return (str)
                    }
                },
                toolbox: {
                    feature: {
//                        dataView: {show: true, readOnly: false},
//                        magicType: {show: true, type: ['line', 'bar']},
//                        restore: {show: true},
//                        saveAsImage: {show: true}
                    }
                },
                legend: {
                    data:['PC版新增访客数','M版新增访客数']
                },
                xAxis: [
                    {
                        type: 'category',
                        data: seriesm.date
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name: 'PC版新增访客数',
                        min: 0,
                        splitLine: {
                            show: false
                        }
                    },
                    {
                        type: 'value',
                        name: 'M版新增访客数',
                        min: 0,
                        splitLine: {
                            show: false
                        }
                    }
                ],
                series: [
                    {
                        name:'PC版新增访客数',
                        type:'line',
                        itemStyle: {
                            normal: {
                                label: {
                                    show: true,
                                    position: 'top',
                                    formatter: '{c}'
                                }
                            }
                        },
                        data:seriespc.pcuv
                    },
                    {
                        name:'M版新增访客数',
                        type:'line',
                        yAxisIndex: 1,
                        itemStyle: {
                            normal: {
                                color: '#568FC8',
                                label: {
                                    show: true,
                                    position: 'bottom',
                                    formatter: '{c}',
                                    textStyle: {
                                        color: '#568FC8'
                                    }
                                }
                            }
                        },
                        data:seriesm.muv
                    }
                ]
        };
        var newCusStaChart = echarts.init(document.getElementById('newCusStaChart'));
        newCusStaChart.setOption(option);
        window.addEventListener('resize',newCusStaChart.resize)
}

