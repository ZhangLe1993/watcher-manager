Template.ldxTrafficChart.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#MarketingTab').addClass('active');
    $('#ldxTrafficChart').addClass('active');
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
    requestURL(dataService+"/webTraffic/getLdxFilterOptions",{}).done(function(data){

        /*城市*/
        $(".cityName").attr("multiple","multiple");
        data.cityName.forEach(function (e) {
            $(".cityName").append("<option value='" + e + "'>" + e + "</option>");
        });
        $(".areaName").attr("multiple","multiple");
        renderOptionsFilter(".areaName",["物流","华北大区","华东大区","华南大区","华西大区"]);
        $(".areaName").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false
        });
        $(".cityName").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false,
            filter: true
        });
    });

    getValue();

    //MSTR
    var query = {
        "accountType": 0
    };
    getMSTRSession(dataService + "/MSTR/getSessionState", query).done(function (data) {
        //var url = mstrHost + '/microstrategy/servlet/mstrWeb?Server=IZ23DQH4PI3Z&Project=Aihuishou&port=0&evt=4001&src=mstrWeb.4001&visMode=0&reportID=C3B17CB740F4124C0CADEB816C26E81E&reportViewMode=1&hiddensections=header,path,footer&mstrSmgr=' + data;
        var url = mstrHost + 'MicroStrategy/servlet/mstrWeb?Server='+mstrServer+'&Project=Aihuishou&port=0&evt=2001&src=mstrWeb.shared.fbb.fb.2001&folderID=7C4F860A4B370363023DEC95181492BC&hiddensections=header,path,footer&mstrSmgr=' + data;

        $('#mainiframe').attr('src',url );
    });

};

function renderOptionsFilter(sel,data){
    //$(sel).empty();
    data.forEach(function(ele){
        $(sel).append("<option value='"+ele+"'>"+ele+"</option>")
    });
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

// var dataService = Meteor.settings.public.dataService.baseUrl;


function getSelectedFilter(){
    var dateType=$(".dateType").val();
    if(dateType=="daily"){
        var dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g,"").split("~");
        var startDate = dt[0];
        var endDate = dt[1];
    }else if(dateType=="weekly"){
        var dt = $('.desktop-only .weekSelectLabel').text().replace(/ /g,"").split("~");
        var startDate = dt[0];
        var endDate = dt[1];
    }else if(dateType=="monthly"){
        var dt = $('.desktop-only .monthSelectLabel').text().replace(/ /g,"").split("~");
        var startDate = dt[0];
        var endDate = dt[1];
    }
    var areaName = $(".areaName").val();
    var cityName = $(".cityName").val();
    var filter = {
        "dateType":dateType,
        "startDate":startDate,
        "endDate":endDate,
        "areaName":areaName,
        "cityName":cityName,
    };

    return cleanParams(filter);
}


function getValue(){
    //var dateGap = -15;
    $("#chartContent").hide();
    $("#loading").show();
    var flag = $(".dateType").val();
    if(flag=="daily" || !flag){
        $("#chartContent").show();
        $("#loading").hide();
        var dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g,"").split("~");
        var startDate = dt[0];
        var endDate = dt[1];
        var query = {
            "startDate": startDate,
            "endDate": endDate
        };
        requestURL(dataService+"/webTraffic/getLdxAggregateTrafficChartData",query).done(function(ret){
            drawDailyTrafficStackChart(ret);

            var obj = getCalcDataByDate(ret);
            renderTable(getSelectedFilter(),obj)
        });
    }else if(flag=="weekly"){
        $("#chartContent").show();
        $("#loading").hide();
        var dt = $('.desktop-only .weekSelectLabel').text().replace(/ /g,"").split("~");
        var startDate = dt[0];
        var endDate = dt[1];
        var query = {
            "startDate": startDate,
            "endDate": endDate
        };
        requestURL(dataService+"/webTraffic/getLdxAggregateTrafficChartDataWeek",query).done(function(ret){
            drawDailyTrafficStackChart(ret);

            var obj = getCalcDataByDate(ret);
            renderTable(getSelectedFilter(),obj)
        });
    }else if(flag=="monthly"){
        $("#chartContent").show();
        $("#loading").hide();
        var dt = $('.desktop-only .monthSelectLabel').text().replace(/ /g,"").split("~");
        var startDate = dt[0];
        var endDate = dt[1];
        var query = {
            "startDate": startDate,
            "endDate": endDate
        };
         requestURL(dataService+"/webTraffic/getLdxAggregateTrafficChartDataMonth",query).done(function(ret){
            drawDailyTrafficStackChart(ret);

            var obj = getCalcDataByDate(ret);
            renderTable(getSelectedFilter(),obj)
         });
     }
}

//获取总的数据
function  getCalcDataByDate(data){
    var total = {
            Uv:[],
            reflowUv: [],
            reflowMUv:[],
            clickUv:[],
            shareClickUv:[]
    }
    total.Uv[0]=0;
    total.reflowUv[0]=0;
    total.reflowMUv[0]=0;
    total.clickUv[0]=0;
    total.shareClickUv[0]=0;
    data.forEach(function (e) {
        total.Uv[0]+=e.uv;
        total.reflowUv[0]+=e.reflowUv;
        total.reflowMUv[0]+=e.reflowMUv;
        total.clickUv[0]+=e.clickUv;
        total.shareClickUv[0]+=e.shareClickUv;
    });
    return total;
}

function renderTable(filter,obj){

        var fixRow = '"<tr style="background-color: #acc087;"", " ", "", "", " data-index="0"", "", "", ">", "<td  style=""    >总数</td>", "<td  style=""    >-</td>", "<td  style=""    >-</td>", "<td  style=""    >'+obj.Uv[0]+'</td>", "<td  style=""    >'+obj.reflowUv[0]+'</td>", "<td  style=""    >'+obj.reflowMUv[0]+'</td>", "<td  style=""    >'+obj.clickUv[0]+'</td>", "<td  style=""    >'+obj.shareClickUv[0]+'</td>","</tr>"'
        var ajaxQuery = _.clone(filter);
        $('#table').bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            pagination: true,
            sidePagination: 'server',
            ajax:function(params){
                var ajaxParams = $.extend(ajaxQuery,params.data);
                $("#ctable").hide();
                getMarketingWebTraffic(ajaxParams).done(function(data){
                    $("#ctable").show();
                    params.success(data)
                });
            },
            fixRow:fixRow,
            cdataExport:"cdataExport"
        });
        $("#cdataExport").click(function(){
            $("#wholePage").mask({'label':"请等待，文件正在导出..."});
            var query = _.clone(filter);
            var flag = query["dateType"];
            delete query["dateType"];
            if(flag=="daily" || !flag){
                requestURL(dataService+"/webTraffic/exportDailyLdxTrafficData",query).done(function(obj){
                    $("#wholePage").unmask();
                    var url = Meteor.settings.public.downloadService.baseUrl+obj.fileName;
                    var link = document.createElement("a");
                    link.href = url;
                    link.style = "visibility:hidden";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                });
            }else if(flag=="weekly"){
                requestURL(dataService+"/webTraffic/exportDailyLdxTrafficDataWeek",query).done(function(obj){
                    $("#wholePage").unmask();
                    var url = Meteor.settings.public.downloadService.baseUrl+obj.fileName;
                    var link = document.createElement("a");
                    link.href = url;
                    link.style = "visibility:hidden";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                });
            }else if(flag=="monthly"){
                 requestURL(dataService+"/webTraffic/exportDailyLdxTrafficDataMonth",query).done(function(obj){
                     $("#wholePage").unmask();
                     var url = Meteor.settings.public.downloadService.baseUrl+obj.fileName;
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


function getFilterOptions(){
    var dfd = $.Deferred();
    requestURL(dataService+"/webTraffic/getClickFilterOptions",{}).done(function(ret){
        dfd.resolve(ret)
    });
    return dfd.promise()
}

function renderOptions(sel,data){
    var num = [];
    var str = [];
    var cha = [];
    $(sel).empty();
    if(sel!=".weekly"){
        $(sel).append("<option value=''>All</option>");
    }

    data.forEach(function(ele){
        if(sel==".siteName"){
            $(sel).append("<option value='"+ele+"'>"+ele+"</option>")
        }else{
            var regn= /^[0-9].*/;
            var regs= /^[A-Za-z].*/;
            if(regn.test(ele)){
                num.push(ele);
            }else if(regs.test(ele)){
                str.push(ele);
            }else
                cha.push(ele);
        }
    });
    if(sel==".clickName"){
        for(var i=0;i<num.length;i++){
            $(sel).append("<option value='"+num[i]+"'>"+num[i]+"</option>")
        }
        for(var j=0;j<str.length;j++){
            $(sel).append("<option value='"+str[j]+"'>"+str[j]+"</option>")
        }
        for(var k=0;k<cha.length;k++){
            $(sel).append("<option value='"+cha[k]+"'>"+cha[k]+"</option>")
        }
    }

    if(sel==".weekly"){
        if(data.length>=15){
            $(".startWeek").val(data[14])
        }else{
            $(".startWeek").val(data[data.length-1])
        }
    }
}

function pickEndDateRangeCallback(start, end, label) {
//    console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    var dt = start.format('YYYY-MM-DD');
    if(dt<$('.startDateSelectLabel').html()){
        alert("结束时间不能早于起始时间！")
    }else{
        $('.endDateSelectLabel').html(dt);
        renderPage({"startDate":$('.startDateSelectLabel').html(),"endDate":dt});
    }
}

function pickStartDateRangeCallback(start, end, label) {
//    console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    var dt = start.format('YYYY-MM-DD');
    if(dt<=$('.endDateSelectLabel').html()){
        $('.startDateSelectLabel').html(dt);
    }else{
        alert("起始时间不能晚于结束时间！")
    }
}



function  getMarketingWebTraffic(filter){
    //clean parameters
    //var query = cleanParams(filter);
    //only get one day important!!!
    var query = cleanParams(_.clone(filter));
    //query.startDate = query.endDate;
    var flag = query["dateType"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if(flag=="daily" || !flag){
        requestURL(dataService+"/webTraffic/getLdxTraffic",query).done(function(ret){
            dfd.resolve(ret)
        });
    }else if(flag=="weekly"){
        requestURL(dataService+"/webTraffic/getLdxTrafficWeek",query).done(function(ret){
            dfd.resolve(ret)
        });
    }else if(flag=="monthly"){
         requestURL(dataService+"/webTraffic/getLdxTrafficMonth",query).done(function(ret){
             dfd.resolve(ret)
         });
     }
    return dfd.promise()
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

function getAggregateWebTrafficData(filter){
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if(flag=="daily" || !flag){
        requestURL(dataService+"/webTraffic/getLdxAggregateTrafficChartData",query).done(function(ret){
            dfd.resolve(ret)
        });
    }else if(flag=="weekly"){
        requestURL(dataService+"/webTraffic/getLdxAggregateTrafficChartDataWeek",query).done(function(ret){
            dfd.resolve(ret)
        });
    }else if(flag=="monthly"){
         requestURL(dataService+"/webTraffic/getLdxAggregateTrafficChartDataMonth",query).done(function(ret){
             dfd.resolve(ret)
         });
     }
    return dfd.promise()
}


function drawDailyTrafficStackChart(obj){

        var xAxis_data = [];
        var series = {
            Uv:[],
            reflowUv: [],
            reflowMUv:[],
            clickUv:[],
            shareClickUv:[]
        };
        obj.forEach(function (e) {
            xAxis_data.push(e.date);
            series.reflowUv.push(e.reflowUv);
            series.reflowMUv.push(e.reflowMUv);
            series.clickUv.push(e.clickUv);
            series.shareClickUv.push(e.shareClickUv);
            series.Uv.push(e.uv);
        });

        var option = {
            title: {
                text: '折线图堆叠',
                x:"center",
                padding:[0,0,0,50]
                //y:"bottom"
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:['活动页面UV','回流页面UV','回流页M版UV','活动页面按钮点击次数','微信分享次数'],
                padding: [25,0,0,0]
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
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name:'活动页面UV',
                    type:'line',
                    //stack: '总量',
                    data:series.Uv
                },{
                      name:'回流页面UV',
                      type:'line',
                      //stack: '总量',
                      data:series.reflowUv
                  },{
                     name:'回流页M版UV',
                     type:'line',
                     //stack: '总量',
                     data:series.reflowMUv
                 },{
                    name:'活动页面按钮点击次数',
                    type:'line',
                    //stack: '总量',
                    data:series.clickUv
                },{
                   name:'微信分享次数',
                   type:'line',
                   //stack: '总量',
                   data:series.shareClickUv
               }
            ]
        };
        var dailyTrafficStackChart = echarts.init(document.getElementById('dailyTrafficStackChart'));
        dailyTrafficStackChart.setOption(option);
        window.addEventListener('resize',dailyTrafficStackChart.resize)
    //});
}

