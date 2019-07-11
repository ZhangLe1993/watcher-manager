Template.UVCityDistribution.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#webtraffic').addClass('active');
    $('#UVByCityTab').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }
    $('#siteSelect').select2();
    var dateTypeSelect = $('#dateTypeSelect');
    dateTypeSelect.select2({ minimumResultsForSearch: Infinity });
    var dateSelectDiv = $('#dateSelectDiv');
    var weekSelectDiv = $('#weekSelectDiv');
    var monthSelectDiv = $('#monthSelectDiv');
    dateTypeSelect.on('change', function () {
        switch (dateTypeSelect.val()) {
            case "daily":
                dateSelectDiv.removeClass('hide');
                weekSelectDiv.addClass('hide');
                monthSelectDiv.addClass('hide');
                break;
            case "weekly":
                dateSelectDiv.addClass('hide');
                weekSelectDiv.removeClass('hide');
                monthSelectDiv.addClass('hide');
                break;
            case "monthly":
                dateSelectDiv.addClass('hide');
                weekSelectDiv.addClass('hide');
                monthSelectDiv.removeClass('hide');
                break;
        }
    });

    var dateGap = -14;
    var minWeekDate = "2016-07-03";
    var minMonthDate = "2016-07-01";
    var endDate = new Date().getNewDate(-1);
    var startDate = new Date(endDate).getNewDate(dateGap);
    var startWeekDate = moment().weekday(-28).format("YYYY-MM-DD")
    var endWeekDate = moment().weekday(-7).format("YYYY-MM-DD")
    if(startWeekDate<minWeekDate){
        startWeekDate = minWeekDate;
    }
    var startMonthDate = moment().subtract(3, 'month').startOf('month').format("YYYY-MM-DD");
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
    $('.webTrafficUVCityRange').daterangepicker(datePickerOptions, pickWebTrafficFunnelDateRangeCallback);

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
    $('.webTrafficUVCityWeek').daterangepicker(weekPickerOptions, pickWebTrafficFunnelWeekRangeCallback);

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
    $('.webTrafficUVCityMonth').daterangepicker(monthPickerOptions, pickWebTrafficFunnelMonthRangeCallback);

    echarts.registerMap('china', chinaMap);

    var queryButton = $('#queryCityUV');

    queryButton.click(function () {

        var dateType = dateTypeSelect.val();
        var startDate = "";
        var endDate = "";
        var url="";
        var urlDetail="";
        switch (dateType) {
            case "daily":
                var dt = $('.dateSelectLabel').text().replace(/ /g,"").split("~");
                startDate = dt[0];
                endDate = dt[1];
                url="/webTraffic/cityUVSum"
                urlDetail="/webTraffic/cityUVDetail"
                break;
            case "weekly":
                var dt = $('.weekSelectLabel').text().replace(/ /g,"").split("~");
                startDate = dt[0];
                endDate = dt[1];
                url="/webTraffic/cityUVSumWeek"
                urlDetail="/webTraffic/cityUVDetailWeek"
                break;
            case "monthly":
                var dt = $('.monthSelectLabel').text().replace(/ /g,"").split("~");
                startDate = dt[0];
                endDate = dt[1];
                url="/webTraffic/cityUVSumMonth"
                urlDetail="/webTraffic/cityUVDetailMonth"
                break;
        }
        var site = $('#siteSelect').val();
        var query = {};
        if (site == undefined) {
            query = {
                startDate: startDate,
                endDate: endDate
            }
        } else {
            query = {
                startDate: startDate,
                endDate: endDate,
                site: site
            }
        }

        requestURL(dataService + url, query).done(function (data) {
            drawUVCityDistributionGeoChart(data);
            drawUVCityDistributionPieChart(data);
        });

        renderTable(query,0);
//        requestURL(dataService + urlDetail, query).done(function (data) {
//            var tableData = [];
//            data.forEach(function (e) {
//                tableData.push({ date: e.date, site: e.site, cityName: e.cityName, sessionNum: e.sessionNum });
//            });
//            $('#UVCityDistributionDataTable').bootstrapTable('destroy').bootstrapTable({
//                exportDataType: 'all',
//                data: tableData,
//                pagination: true,
//                pageSize: '10',
//                search: true,
//            });
//        });
    });

    queryButton.trigger("click");

    $('#exportCityUV').click(function () {
        var dateType = dateTypeSelect.val();
        var startDate = "";
        var endDate = "";
        var urlDetail="";
        switch (dateType) {
            case "daily":
                var dt = $('.dateSelectLabel').text().replace(/ /g,"").split("~");
                startDate = dt[0];
                endDate = dt[1];
                urlDetail="/webTraffic/cityUVDetail"
                break;
            case "weekly":
                var dt = $('.weekSelectLabel').text().replace(/ /g,"").split("~");
                startDate = dt[0];
                endDate = dt[1];
                urlDetail="/webTraffic/cityUVDetailWeek"
                break;
            case "monthly":
                var dt = $('.monthSelectLabel').text().replace(/ /g,"").split("~");
                startDate = dt[0];
                endDate = dt[1];
                urlDetail="/webTraffic/cityUVDetailMonth"
                break;
        }
        var site = $('#siteSelect').val();
        var query = {};
        if (site == undefined) {
            query = {
                startDate: startDate,
                endDate: endDate
            }
        } else {
            query = {
                startDate: startDate,
                endDate: endDate,
                site: site
            }
        }

        requestURL(dataService + urlDetail, query).done(function (data) {
            JSONToCSVConvertor(data, "城市UV分布_" + date + "_" + dateType, true);
        });
    });

};

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

function renderTable(filter,obj){
//        var fixRow = '"<tr style="background-color: #acc087;"", " ", "", "", " data-index="0"", "", "", ">", "<td  style=""    >总数</td>", "<td  style=""    >-</td>", "<td  style=""    >-</td>","<td  style=""    >-</td>", "<td  style=""    >-</td>", "<td  style=""    >-</td>", "<td  style=""    >'+obj.uv[0]+'</td>", "<td  style=""    >'+obj.inquiryUv[0]+'</td>", "<td  style=""    >'+obj.submitSuccessUv[0]+'</td>", , "<td  style=""    >'+obj.tradeUv[0]+'</td>","</tr>"'
        var ajaxQuery = _.clone(filter);
        $('#table').bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            pagination: true,
            sidePagination: 'server',
//            search:true,
            ajax:function(params){
                var ajaxParams = $.extend(ajaxQuery,params.data);
                $("#ctable").hide();
                getMarketingWebTraffic(ajaxParams).done(function(data){
                    $("#ctable").show();
                    params.success(data)
                });
            },
//            fixRow:fixRow,
            cdataExport:"cdataExport"
        });
        $("#cdataExport").click(function(){
            $("#wholePage").mask({'label':"请等待，文件正在导出..."});
            var query = _.clone(filter);
            var flag = $(".dateType").val();
            delete query["dateType"];
            if(flag=="daily" || !flag){
                requestURL(dataService+"/lianpin/exportRelateDailyCampaignWebTrafficData",query).done(function(obj){
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
                requestURL(dataService+"/lianpin/exportRelateDailyCampaignWebTrafficDataWeek",query).done(function(obj){
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
                 requestURL(dataService+"/lianpin/exportRelateDailyCampaignWebTrafficDataMonth",query).done(function(obj){
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

function  getMarketingWebTraffic(filter){
    //clean parameters
    //var query = cleanParams(filter);
    //only get one day important!!!
    var query = cleanParams(_.clone(filter));
    //query.startDate = query.endDate;
//    var flag = query["dateType"];
    var flag = $(".dateType").val();
    delete query["dateType"];
    var dfd = $.Deferred();
    if(flag=="daily" || !flag){
        requestURL(dataService+"/webTraffic/cityUVDetail",query).done(function(ret){
            dfd.resolve(ret)
        });
    }else if(flag=="weekly"){
        requestURL(dataService+"/webTraffic/cityUVDetailWeek",query).done(function(ret){
            dfd.resolve(ret)
        });
    }else if(flag=="monthly"){
         requestURL(dataService+"/webTraffic/cityUVDetailMonth",query).done(function(ret){
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

function drawUVCityDistributionGeoChart(dataSet) {

    var result = [];
    var max = 0;
    var totalSession = 0;

    var dateTypeSelect = $('#dateTypeSelect');
    var dateType = dateTypeSelect.val();

    var dt1 = $('.dateSelectLabel').text().replace(/ /g,"").split("~");
    endDate1 = dt1[1];
    var dt2 = $('.weekSelectLabel').text().replace(/ /g,"").split("~");
    endDate2 = dt2[1];
    var dt3 = $('.monthSelectLabel').text().replace(/ /g,"").split("~");
    endDate3 = dt3[1];
    dataSet.forEach(function (e) {
        switch (dateType) {
            case "daily":
                switch (e.date){
                    case endDate1:
                        var item = { name: e.cityName, value: [e.lot, e.lat, e.sessionNum] };
                        result.push(item);
                        totalSession += e.sessionNum;
                        if (e.sessionNum > max) {
                            max = e.sessionNum
                        }
                    break;
                }
                break;
            case "weekly":
                switch (e.date){
                    case endDate2:
                        var item = { name: e.cityName, value: [e.lot, e.lat, e.sessionNum] };
                        result.push(item);
                        totalSession += e.sessionNum;
                        if (e.sessionNum > max) {
                            max = e.sessionNum
                        }
                    break;
                }
                break;
            case "monthly":
                switch (e.date){
                    case endDate3:
                        var item = { name: e.cityName, value: [e.lot, e.lat, e.sessionNum] };
                        result.push(item);
                        totalSession += e.sessionNum;
                        if (e.sessionNum > max) {
                            max = e.sessionNum
                        }
                    break;
                }
                break;
        }
    });

    var date = "";
    switch (dateType) {
        case "daily":
            date = $('.dateSelectLabel').text().replace(/ /g,"").split("~")[1] + "当日";
            break;
        case "weekly":
            date = $('.weekSelectLabel').text().replace(/ /g,"").split("~")[1];
            date+="~"+(new Date(date).getNewDate(7)) + "当周";
            break;
        case "monthly":
            date = $('.monthSelectLabel').text().replace(/ /g,"").split("~")[1];
            date+="~"+(new moment(date).endOf('month').format('YYYY-MM-DD')) + "当月";
            break;
    }

    var resultTop10 = result.slice(0, 15);

    var getSymbolSize = function (value) {
        var size = Math.sqrt(parseFloat(value[2]) / parseFloat(max)) * 75;
        if (size < 3) {
            return 3
        } else {
            return parseInt(size)
        }
    };

    var option = {
        backgroundColor: '#404a59',
        title: {
            text: '全国流量地图',
            //subtext: '1.不包含只访问一个页面就离开的用户\n2.不包含口袋优品,爱维修的用户行为数据\n3.可能含有部分爬虫数据\n4.通过ip判断用户地址，可能会掉部分分析不出的ip地址的用户\n5.如果用户用代理，可能会错误判断ip地址',
            subtext: date + '总访问用户数: ' + totalSession,
            left: 'center',
            textStyle: {
                color: '#fff'
            }
        },
        tooltip: {
            trigger: 'item',
            formatter: function (params) {
                return params.name + ' : ' + params.value[2].toLocaleString();
            }
        },
        legend: {
            orient: 'vertical',
            y: 'bottom',
            x: 'right',
            data: ['访问用户数'],
            textStyle: {
                color: '#fff'
            }
        },
        geo: {
            map: 'china',
            label: {
                emphasis: {
                    show: false
                }
            },
            itemStyle: {
                normal: {
                    areaColor: '#323c48',
                    borderColor: '#111'
                },
                emphasis: {
                    areaColor: '#2a333d'
                }
            }
        },
        dataRange: {
            min: 0,
            max: max,
            calculable: true,
            color: ['#d94e5d', '#eac736', '#50a3ba'],
            textStyle: {
                color: '#fff'
            }
        },
        series: [
            {
                name: '访问用户数',
                type: 'scatter',
                coordinateSystem: 'geo',
                data: result.slice(15, result.length),
                symbolSize: function (val) {
                    return getSymbolSize(val);
                },
                //symbolSize: 10,
                hoverAnimation: false,
                legendHoverLink: false,
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'right',
                        show: false
                    },
                    emphasis: {
                        show: true
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#ddb926',
                        opacity: 0.5
                    },
                    emphasis: {
                        shadowBlur: 10,
                        shadowColor: '#333',
                        opacity: 1
                    }
                }
            },
            {
                name: 'Top 10',
                type: 'effectScatter',
                coordinateSystem: 'geo',
                data: resultTop10,
                symbolSize: function (val) {
                    return getSymbolSize(val);
                },
                showEffectOn: 'hover',
                rippleEffect: {
                    brushType: 'stroke'
                },
                hoverAnimation: false,
                legendHoverLink: false,
                label: {
                    normal: {
                        formatter: '{b}',
                        position: 'right',
                        show: true,
                        opacity: 1
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#f4e925',
                        shadowBlur: 10,
                        shadowColor: '#333',
                        opacity: 0.5
                    },
                    emphasis: {
                        shadowBlur: 10,
                        shadowColor: '#333',
                        opacity: 0.5
                    }
                },
                z: 2
            }
        ]
    };

    var UVCityDistributionGeoChart = echarts.init(document.getElementById('UVCityDistributionGeoChart'));
    UVCityDistributionGeoChart.setOption(option)
    window.addEventListener('resize', UVCityDistributionGeoChart.resize);
}

function drawUVCityDistributionPieChart(dataSet) {

    var result = [];

    var dateTypeSelect = $('#dateTypeSelect');
    var dateType = dateTypeSelect.val();

    var dt1 = $('.dateSelectLabel').text().replace(/ /g,"").split("~");
    endDate1 = dt1[1];
    var dt2 = $('.weekSelectLabel').text().replace(/ /g,"").split("~");
    endDate2 = dt2[1];
    var dt3 = $('.monthSelectLabel').text().replace(/ /g,"").split("~");
    endDate3 = dt3[1];
    dataSet.forEach(function (e) {
        switch (dateType) {
            case "daily":
                switch (e.date){
                    case endDate1:
                        if (result.length <= 15) {
                            var pieItem = { name: e.cityName, value: e.sessionNum };
                            result.push(pieItem);
                        } else {
                            if (result[15] == undefined) {
                                result.push({ name: '其他', value: e.sessionNum })
                            } else {
                                result[15] = { name: '其他', value: result[10].value + e.sessionNum }
                            }
                        }
                    break;
                }
                break;
            case "weekly":
                switch (e.date){
                    case endDate2:
                        if (result.length <= 15) {
                            var pieItem = { name: e.cityName, value: e.sessionNum };
                            result.push(pieItem);
                        } else {
                            if (result[15] == undefined) {
                                result.push({ name: '其他', value: e.sessionNum })
                            } else {
                                result[15] = { name: '其他', value: result[10].value + e.sessionNum }
                            }
                        }
                    break;
                }
                break;
            case "monthly":
                switch (e.date){
                    case endDate3:
                        if (result.length <= 15) {
                            var pieItem = { name: e.cityName, value: e.sessionNum };
                            result.push(pieItem);
                        } else {
                            if (result[15] == undefined) {
                                result.push({ name: '其他', value: e.sessionNum })
                            } else {
                                result[15] = { name: '其他', value: result[10].value + e.sessionNum }
                            }
                        }
                    break;
                }
                break;
        }
    });

    var date = "";
    switch (dateType) {
        case "daily":
            date = $('.dateSelectLabel').text().replace(/ /g,"").split("~")[1] ;
            break;
        case "weekly":
            date = $('.weekSelectLabel').text().replace(/ /g,"").split("~")[1];
            date+="~"+(new Date(date).getNewDate(7)) ;
            break;
        case "monthly":
            date = $('.monthSelectLabel').text().replace(/ /g,"").split("~")[1];
            date+="~"+(new moment(date).endOf('month').format('YYYY-MM-DD')) ;
            break;
    }

    var option = {
        title: {
            text: '流量来源分布('+date+")",
            left: 'center'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        calculable: true,
        series: [
            {
                name: '访问用户数',
                type: 'pie',
                radius: ['0%', '65%'],
                center: ['50%', '60%'],
                clockwise: true,
                labelLine: {
                    normal: {
                        length: 5,
                        length2: 2
                    }
                },
                data: result
            }
        ]
    };
    var UVCityDistributionPieChart = echarts.init(document.getElementById('UVCityDistributionPieChart'));
    UVCityDistributionPieChart.setOption(option)
    window.addEventListener('resize', UVCityDistributionPieChart.resize);
}