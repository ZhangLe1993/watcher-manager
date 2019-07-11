Template.productHealthy.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#productTab').addClass('active');
    $('#productHealthy').addClass('active');

    if(isMobile()){
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
            requestURL(dataService + "/product/productHealthyDay", query).done(function (data) {
                drawWebTrafficFunnelChartPortal(data);
                renderPage(data);
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
            requestURL(dataService + "/product/productHealthyWeek", query).done(function (data) {
                drawWebTrafficFunnelChartPortal(data);
                renderPage(data);
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
            requestURL(dataService + "/product/productHealthyMonth", query).done(function (data) {
                drawWebTrafficFunnelChartPortal(data);
                renderPage(data);
            });
        }
}

function renderPage(data){
        var xAxis_data = [];
        var series = {
            mainURL:[],
            leftHomeRatio:[]
        };
        data.forEach(function (e) {
                    xAxis_data.push(e.date);
                    series.mainURL.push(e.mainURL);
                    series.leftHomeRatio.push((e.leftHomeRatio*100).toFixed(2));
        });

        var obj = getCalcData(data);
        var tableJson = [];

        for(var i= 0,len=xAxis_data.length;i<len;i++){
            var tmp = {
                "date":xAxis_data[i],
                "mainURL":series.mainURL[i],
                "leftHomeRatio":(series.leftHomeRatio[i])+"%",
            };
            tableJson.push(tmp);
        }

        var fixRow2 = '"<tr style="background-color: #acc087;"", " ", "", "", " data-index="0"", "", "", ">", "<td  style=""    >总数</td>", "<td  style=""    >-</td>", "<td  style=""    >'+obj.leftHomeRatio+'</td>","</tr>"'
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
            },{
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
    var alluv = 0;
    var exituv = 0;
    var leftHomeRatio =0;
    data.forEach(function (e) {
        UV += e.UV;
        alluv += e.alluv;
        exituv += e.exituv;
        leftHomeRatio += e.leftHomeRatio;
    });
    leftHomeRatio=(exituv/alluv*100).toFixed(2)+"%"
    return {"UV":UV,"leftHomeRatio":leftHomeRatio}
}


function drawWebTrafficFunnelChartPortal(data) {
    var xAxis_data = [];
    var series = {
        bounceRatePc:[],
        bounceRateM:[],
        bounceRateAndroid:[],
        bounceRateIos:[]
    };
    data.forEach(function (e) {
        xAxis_data.push(e.date);
        switch (e.mainURL) {
            case "http://www.aihuishou.com":
                series.bounceRatePc.push((e.leftHomeRatio*100).toFixed(2));
                break;
            case "http://m.aihuishou.com":
                series.bounceRateM.push((e.leftHomeRatio*100).toFixed(2));
                break;
            case "http://official.android.aihuishou.com":
                series.bounceRateAndroid.push((e.leftHomeRatio*100).toFixed(2));
                break;
            case "http://official.ios.aihuishou.com":
                series.bounceRateIos.push((e.leftHomeRatio*100).toFixed(2));
                break;
            default:
                break;
        }
    });

    xAxis_data=_.uniq(xAxis_data);

    var option = {
        title: {
            text: '首页跳出率',
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
             'PC版首页跳出率':true,
             'M版首页跳出率':true,
             'Android原生APP首页跳出率':true,
             'IOS原生APP首页跳出率':true
            },
            data: ['PC版首页跳出率','M版首页跳出率','Android原生APP首页跳出率','IOS原生APP首页跳出率']
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
                   name: 'PC版首页跳出率',
                   type: 'line',
                   yAxisIndex: 0,
                   data: series.bounceRatePc
               },
               {
                   name: 'M版首页跳出率',
                   type: 'line',
                   yAxisIndex: 0,
                   data: series.bounceRateM
               },
                {
                    name: 'Android原生APP首页跳出率',
                    type: 'line',
                    yAxisIndex: 0,
                    data: series.bounceRateAndroid
                },
                {
                    name: 'IOS原生APP首页跳出率',
                    type: 'line',
                    yAxisIndex: 0,
                    data: series.bounceRateIos
                }
        ]
    };
    var trafficStackChart = echarts.init(document.getElementById('webTrafficStackChartPortal'));
    trafficStackChart.setOption(option);


    setTimeout(function (){

        window.addEventListener('resize',function () {
            trafficStackChart.resize();
        })
    },200)

}

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