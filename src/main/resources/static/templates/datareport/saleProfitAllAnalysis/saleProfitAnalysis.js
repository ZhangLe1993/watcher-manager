Template.saleProfitAnalysis.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#pricemonitor').addClass('active');
    $('#saleProfitAnalysis').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var dateGap = -6;
    var minWeekDate = "2016-07-03";
    var minMonthDate = "2016-07-01";
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

    var datePickerOptionsProfit = {
        "showDropdowns": true,
        //"alwaysShowCalendars": true,
        //"singleDatePicker": true,
        "autoApply": true,
        "alwaysShowCalendars": false,
        "startDate": transformDate(startDate),
        "endDate": transformDate(endDate),
        "minDate": transformDate("2016-09-01"),
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
            '上个月': [moment().subtract(1, 'month').startOf('month').toDate(), moment().subtract(1, 'month').endOf('month').toDate()]
        }
    };

    $(".dateSelectLabelProfit").html(startDate + "~" + endDate);
    $('.webTrafficFunnelDateProfit').daterangepicker(datePickerOptionsProfit, pickWebTrafficFunnelDateRangeCallbackProfit);

    //$(".webTrafficFunnelDate").on('apply.daterangepicker', function (ev, picker) {
    //    getValueProduct(flag);
    //});

    sonFlag = "tr";
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        // 获取已激活的标签页的名称
        var activeTab = $(e.target).text();
        if (activeTab == "整体数据") {
            flag = "all";
            sonFlag = "tr";
            getValueProduct(flag);
        } else if (activeTab == "爱回收") {
            flag = "ahs";
            sonFlag = "tr";
            getValueProduct(flag);
        } else if (activeTab == "口袋优品") {
            flag = "kdyp";
            sonFlag = "tr";
            getValueProduct(flag);
        } else if (activeTab == "爱机汇") {
            flag = "ajh";
            sonFlag = "tr";
            getValueProduct(flag);
        } else if (activeTab == "享换机") {
            flag = "xhj";
            sonFlag = "tr";
            getValueProduct(flag);
        }
    });
    flag = "all";
    getValueProduct(flag);

    //////////////////////销售利润分析////////////////////////////

    var datePickerOptionsPriceMonitor = {
        "showDropdowns": true,
        //"alwaysShowCalendars": true,
        //"singleDatePicker": true,
        "autoApply": true,
        "alwaysShowCalendars": false,
        "startDate": transformDate(startDate),
        "endDate": transformDate(endDate),
        "minDate": transformDate("2016-09-01"),
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

    $(".dateSelectLabelPriceMonitor").html(startDate + "~" + endDate);
    $('.webTrafficFunnelDatePriceMonitor').daterangepicker(datePickerOptionsPriceMonitor, pickWebTrafficFunnelDateRangeCallbackPriceMonitor);


};

//////////////////////销售利润分析////////////////////////////

var flag, sonFlag;

function pickWebTrafficFunnelDateRangeCallbackProfit(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    if(moment(sdt).add(2,'month')<=moment(edt)){
        alert("不支持超过2个月的查询！");
        return;
    }else{
        $('.dateSelectLabelProfit').html(sdt + "~" + edt);
        getValueProduct(flag);
    }
}

function pickWebTrafficFunnelDateRangeCallbackPriceMonitor(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.dateSelectLabelPriceMonitor').html(sdt + "~" + edt);
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

function renderOptions(sel, data) {
    $(sel).empty();
    data.forEach(function (ele) {
        $(sel).append("<option value='" + ele + "'>" + ele + "</option>")
    });
}

function getValueProduct(flag) {
    var dt = $('.desktop-only .dateSelectLabelProfit').text().replace(/ /g, "").split("~");
    var startDate = dt[0];
    var endDate = dt[1];

    /*if(moment(startDate).add(2,'month')<=moment(endDate)){
        alert("不支持超过2个月的查询！");
        return
    }else{*/
        var source = $(".source").val();
        var platform = [];
        var table = ""
        var chart = ""
        if (flag == "all") {
            table = "#alltable"
            chart = "#trafficAllwebTrafficFunnelSaleProductChart"
        } else if (flag == "ahs") {
            platform.push("爱回收");
            table = "#ahstable"
            chart = "#trafficAhswebTrafficFunnelSaleProductChart"
        } else if (flag == "kdyp") {
            //endDate=endDate.getNewDate(1);
            //console.log(endDate+"1111111111111");
            platform.push("口袋优品");
            table = "#kdyptable"
            chart = "#trafficKdypwebTrafficFunnelSaleProductChart"
        } else if (flag == "ajh") {
            platform.push("爱机汇");
            table = "#ajhtable"
            chart = "#trafficAjhwebTrafficFunnelSaleProductChart"
        } else if (flag == "xhj") {
            platform.push("享换机");
            table = "#xhjtable"
            chart = "#trafficXhjwebTrafficFunnelSaleProductChart"
        }

        var query = {};
        query.startDate = startDate;
        query.endDate = endDate;
        if (platform.length > 0) {
            query.platform = platform;
        }
        query.source = source;
        var filter = cleanParams(_.clone(query));

        requestURL(dataService + "/datareport/getSaleProfitAnalysisInfoDay", filter).done(function (ret) {
            drawTrafficChart(ret);
        });

        requestURL(dataService + "/datareport/getSaleProfitAnalysisInfo", filter).done(function (data) {
            renderTable(table, data);
            if (flag == "all") {
                drawTrafficAllPartChart(data)
            } else if (flag == "ahs") {
                drawTrafficAhsPartChart(data)
            } else if (flag == "kdyp") {
                drawTrafficKdypPartChart(data)
            } else if (flag == "ajh") {
                drawTrafficAjhPartChart(data)
            } /*else if (flag == "xhj") {
                drawTrafficXhjPartChart(data)
            }*/
        });
   // }


}

//每页汇总表格
function renderTable(table, data) {
    if (table == "#alltable") {
        var tableJson = [];
        /*var tableTemp = {};
        tableTemp.ahs_final_sale_count = 0;
        tableTemp.ahs_final_sale_amount = 0;
        tableTemp.ahs_profit_amount = 0;
        tableTemp.kdyp_final_sale_count = 0;
        tableTemp.kdyp_final_sale_amount = 0;
        tableTemp.kdyp_profit_amount = 0;
        tableTemp.ajh_final_sale_count = 0;
        tableTemp.ajh_final_sale_amount = 0;
        tableTemp.ajh_profit_amount = 0;
        var i = 0,tempDate="";
        data.forEach(function (e) {
            if(i==0) {
                tempDate = e.date;
            }
            i++;
            if (tempDate != e.date) {
                tableTemp.ahs_profit_rate = ((tableTemp.ahs_profit_amount / tableTemp.ahs_final_sale_amount) * 100).toFixed(2) + "%";
                tableTemp.kdyp_profit_rate = ((tableTemp.kdyp_profit_amount / tableTemp.kdyp_final_sale_amount) * 100).toFixed(2) + "%";
                tableTemp.ajh_profit_rate = ((tableTemp.ajh_profit_amount / tableTemp.ajh_final_sale_amount) * 100).toFixed(2) + "%";
                var temp = _.clone(tableTemp);
                tableJson.push(temp);
                tempDate= e.date;
            }
            if (e.source_name == "自有渠道" | e.source_name == "BD") {
                tableTemp.date = e.date;
                tableTemp.ahs_final_sale_count += e.final_sale_count;
                tableTemp.ahs_final_sale_amount += e.final_sale_amount;
                tableTemp.ahs_profit_amount += e.profit_amount;
            } else if (e.source_name == "趣分期" | e.source_name == "京东商城" | e.source_name == "口袋优品官网" | e.source_name == "口袋优品其它") {
                tableTemp.kdyp_final_sale_count += e.final_sale_count;
                tableTemp.kdyp_final_sale_amount += e.final_sale_amount;
                tableTemp.kdyp_profit_amount += e.profit_amount;
            } else if (e.source_name == "东区" | e.source_name == "西区" | e.source_name == "北区" | e.source_name == "南区") {
                tableTemp.ajh_final_sale_count += e.final_sale_count;
                tableTemp.ajh_final_sale_amount += e.final_sale_amount;
                tableTemp.ajh_profit_amount += e.profit_amount;
            }
        });

        tableTemp.ahs_profit_rate = ((tableTemp.ahs_profit_amount / tableTemp.ahs_final_sale_amount) * 100).toFixed(2) + "%";
        tableTemp.kdyp_profit_rate = ((tableTemp.kdyp_profit_amount / tableTemp.kdyp_final_sale_amount) * 100).toFixed(2) + "%";
        tableTemp.ajh_profit_rate = ((tableTemp.ajh_profit_amount / tableTemp.ajh_final_sale_amount) * 100).toFixed(2) + "%";
        var temp = _.clone(tableTemp);
        tableJson.push(temp);*/

        var dataByCategory =_.groupBy(data,function(obj){return obj.date})
        for(var key in dataByCategory){
            var tableTemp = {};
            tableTemp.ahs_final_sale_count = 0;
            tableTemp.ahs_final_sale_amount = 0;
            tableTemp.ahs_profit_amount = 0;
            tableTemp.kdyp_final_sale_count = 0;
            tableTemp.kdyp_final_sale_amount = 0;
            tableTemp.kdyp_profit_amount = 0;
            tableTemp.ajh_final_sale_count = 0;
            tableTemp.ajh_final_sale_amount = 0;
            tableTemp.ajh_profit_amount = 0;
            dataByCategory[key].forEach(function (e) {
                /*if(i==0) {
                    tempDate = e.date;
                }
                i++;
                if (tempDate != e.date) {
                    tableTemp.ahs_profit_rate = ((tableTemp.ahs_profit_amount / tableTemp.ahs_final_sale_amount) * 100).toFixed(2) + "%";
                    tableTemp.kdyp_profit_rate = ((tableTemp.kdyp_profit_amount / tableTemp.kdyp_final_sale_amount) * 100).toFixed(2) + "%";
                    tableTemp.ajh_profit_rate = ((tableTemp.ajh_profit_amount / tableTemp.ajh_final_sale_amount) * 100).toFixed(2) + "%";
                    var temp = _.clone(tableTemp);
                    tableJson.push(temp);
                    tempDate= e.date;
                }*/
                if (e.source_name == "自有渠道" | e.source_name == "BD") {
                    tableTemp.date = e.date;
                    tableTemp.ahs_final_sale_count += e.final_sale_count;
                    tableTemp.ahs_final_sale_amount += e.final_sale_amount;
                    tableTemp.ahs_profit_amount += e.profit_amount;
                } else if (e.source_name == "趣分期" | e.source_name == "京东商城" | e.source_name == "口袋优品官网" | e.source_name == "口袋优品其它") {
                    tableTemp.kdyp_final_sale_count += e.final_sale_count;
                    tableTemp.kdyp_final_sale_amount += e.final_sale_amount;
                    tableTemp.kdyp_profit_amount += e.profit_amount;
                } else if (e.source_name == "东区" | e.source_name == "西区" | e.source_name == "北区" | e.source_name == "南区") {
                    tableTemp.ajh_final_sale_count += e.final_sale_count;
                    tableTemp.ajh_final_sale_amount += e.final_sale_amount;
                    tableTemp.ajh_profit_amount += e.profit_amount;
                }
            });

            tableTemp.ahs_profit_rate = ((tableTemp.ahs_profit_amount / tableTemp.ahs_final_sale_amount) * 100).toFixed(2) + "%";
            tableTemp.kdyp_profit_rate = ((tableTemp.kdyp_profit_amount / tableTemp.kdyp_final_sale_amount) * 100).toFixed(2) + "%";
            tableTemp.ajh_profit_rate = ((tableTemp.ajh_profit_amount / tableTemp.ajh_final_sale_amount) * 100).toFixed(2) + "%";
            tableJson.push(tableTemp);
        }

        $(table).bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data: tableJson
        });
    } else if (table == "#ahstable") {
        var tableJson = [];
        var tableTemp = {};
        tableTemp.ahsBD_final_sale_count = 0;
        tableTemp.ahsBD_final_sale_amount = 0;
        tableTemp.ahsBD_profit_rate = 0;
        tableTemp.ahsSelf_final_sale_count = 0;
        tableTemp.ahsSelf_final_sale_amount = 0;
        tableTemp.ahsSelf_profit_rate = 0;
        var i = 0,tempDate="";
        data.forEach(function (e) {
            if(i==0) {
                tempDate = e.date;
            }
            i++;
            if (tempDate != e.date) {
                var temp = _.clone(tableTemp);
                tableJson.push(temp);
                tempDate= e.date;
            }
            if (e.source_name == "自有渠道") {
                tableTemp.date = e.date;
                tableTemp.ahsSelf_final_sale_count = e.final_sale_count;
                tableTemp.ahsSelf_final_sale_amount = e.final_sale_amount;
                tableTemp.ahsSelf_profit_rate = e.profit_rate;
            } else if (e.source_name == "BD") {
                tableTemp.ahsBD_final_sale_count = e.final_sale_count;
                tableTemp.ahsBD_final_sale_amount = e.final_sale_amount;
                tableTemp.ahsBD_profit_rate = e.profit_rate;
            }
        });
        var temp = _.clone(tableTemp);
        tableJson.push(temp);


        $(table).bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data: tableJson
        });
    } else if (table == "#kdyptable") {
        var tableJson = [];
        var tableTemp = {};
        tableTemp.kdypJd_final_sale_count = 0;
        tableTemp.kdypJd_final_sale_amount = 0;
        tableTemp.kdypJd_profit_rate = 0;
        tableTemp.kdypQu_final_sale_count = 0;
        tableTemp.kdypQu_final_sale_amount = 0;
        tableTemp.kdypQu_profit_rate = 0;
        tableTemp.kdypSelf_final_sale_count = 0;
        tableTemp.kdypSelf_final_sale_amount = 0;
        tableTemp.kdypSelf_profit_rate = 0;
        tableTemp.kdypElse_final_sale_count = 0;
        tableTemp.kdypElse_final_sale_amount = 0;
        tableTemp.kdypElse_profit_rate = 0;
        var i = 0,tempDate="";
        data.forEach(function (e) {
            if(i==0) {
                tempDate = e.date;
            }
            i++;
            if (tempDate != e.date) {
                var temp = _.clone(tableTemp);
                tableJson.push(temp);
                tempDate= e.date;
            }
            if (e.source_name == "趣分期") {
                tableTemp.date = e.date;
                tableTemp.kdypQu_final_sale_count = e.final_sale_count;
                tableTemp.kdypQu_final_sale_amount = e.final_sale_amount;
                tableTemp.kdypQu_profit_rate = e.profit_rate;
            } else if (e.source_name == "京东商城") {
                tableTemp.kdypJd_final_sale_count = e.final_sale_count;
                tableTemp.kdypJd_final_sale_amount = e.final_sale_amount;
                tableTemp.kdypJd_profit_rate = e.profit_rate;
            } else if (e.source_name == "口袋优品官网") {
                tableTemp.kdypSelf_final_sale_count = e.final_sale_count;
                tableTemp.kdypSelf_final_sale_amount = e.final_sale_amount;
                tableTemp.kdypSelf_profit_rate = e.profit_rate;
            } else if (e.source_name == "口袋优品其它") {
                tableTemp.kdypElse_final_sale_count = e.final_sale_count;
                tableTemp.kdypElse_final_sale_amount = e.final_sale_amount;
                tableTemp.kdypElse_profit_rate = e.profit_rate;
            }
        });

        var temp = _.clone(tableTemp);
        tableJson.push(temp);

        $(table).bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data: tableJson
        });
    } else if (table == "#ajhtable") {
        var tableJson = [];
        var tableTemp = {};
        tableTemp.ajhEast_final_sale_count = 0;
        tableTemp.ajhEast_final_sale_amount = 0;
        tableTemp.ajhEast_profit_rate = 0;
        tableTemp.ajhWest_final_sale_count = 0;
        tableTemp.ajhWest_final_sale_amount = 0;
        tableTemp.ajhWest_profit_rate = 0;
        tableTemp.ajhNorth_final_sale_count = 0;
        tableTemp.ajhNorth_final_sale_amount = 0;
        tableTemp.ajhNorth_profit_rate = 0;
        tableTemp.ajhSouth_final_sale_count = 0;
        tableTemp.ajhSouth_final_sale_amount = 0;
        tableTemp.ajhSouth_profit_rate = 0;
        var i = 0,tempDate="";
        data.forEach(function (e) {
            if(i==0) {
                tempDate = e.date;
            }
            i++;
            if (tempDate != e.date) {
                var temp = _.clone(tableTemp);
                tableJson.push(temp);
                tempDate= e.date;
            }
            if (e.source_name == "东区") {
                tableTemp.date = e.date;
                tableTemp.ajhEast_final_sale_count = e.final_sale_count;
                tableTemp.ajhEast_final_sale_amount = e.final_sale_amount;
                tableTemp.ajhEast_profit_rate = e.profit_rate;
            } else if (e.source_name == "西区") {
                tableTemp.ajhWest_final_sale_count = e.final_sale_count;
                tableTemp.ajhWest_final_sale_amount = e.final_sale_amount;
                tableTemp.ajhWest_profit_rate = e.profit_rate;
            } else if (e.source_name == "北区" ) {
                tableTemp.ajhNorth_final_sale_count = e.final_sale_count;
                tableTemp.ajhNorth_final_sale_amount = e.final_sale_amount;
                tableTemp.ajhNorth_profit_rate = e.profit_rate;
            } else if (e.source_name == "南区") {
                tableTemp.ajhSouth_final_sale_count += e.final_sale_count;
                tableTemp.ajhSouth_final_sale_amount += e.final_sale_amount;
                tableTemp.ajhSouth_profit_rate = e.profit_rate;
            }
        });

        var temp = _.clone(tableTemp);
        tableJson.push(temp);

        $(table).bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data: tableJson
        });
    }
}


//图表下的累计表格
function renderAccuTable(table, data) {
    $(table).bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        data: data
    });
}

/*所有渠道流量*/
function drawTrafficChart(data) {
    //表格
    var tableJson = [];
    var tableTemp = {};
    tableTemp.table_final_sale_count = 0;
    tableTemp.table_final_sale_amount = 0;
    tableTemp.table_profit_amount = 0;
    //图表
    var xAxis_data = [];
    var series = {
        final_sale_amount: [],
        final_sale_count: [],
        profit_amount: [],
        profit_rate: []
    };
    data.forEach(function (e) {
        xAxis_data.push(e.date);
        series.final_sale_amount.push(e.final_sale_amount);
        series.final_sale_count.push(e.final_sale_count);
        series.profit_amount.push(e.profit_amount);
        series.profit_rate.push(((e.profit_amount / e.final_sale_amount) * 100).toFixed(2));

        tableTemp.table_final_sale_count += e.final_sale_count;
        tableTemp.table_final_sale_amount += e.final_sale_amount;
        tableTemp.table_profit_amount += e.profit_amount;
    });

    tableTemp.table_final_sale_amount = tableTemp.table_final_sale_amount.toFixed(2);
    tableTemp.table_profit_amount = tableTemp.table_profit_amount.toFixed(2);
    tableTemp.table_profit_rate=((tableTemp.table_profit_amount / tableTemp.table_final_sale_amount) * 100).toFixed(2)+"%";
    tableJson.push(tableTemp);

    var option = {
        title: {
            //text: '访客统计',
            x: "center",
            y: "bottom"
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params, ticket, callback) {
                var str = (params[1] ? params[1] : params[0]).name + '<br/>';
                params.forEach(function (obj) {
                    if (obj.seriesName.indexOf("率") > -1) {
                        str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                    } else if (obj.seriesName.indexOf("量") > -1) {
                        str += obj.seriesName + ' : ' + obj.value + '(台)<br/>'
                    } else {
                        str += obj.seriesName + ' : ' + obj.value + '(元)<br/>'
                    }
                });
                return str;
            }
        },
        legend: {
            data: ['销售量', '销售金额', '毛利额', '毛利率'],
            selected: {
                "销售量": false
            },
        },
        dataZoom: [
            {
                show: true,
                realtime: true,
                //start: 80,
                //end: 0
            }
        ],
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
            boundaryGap: true,
            data: xAxis_data
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
                name: '销售量',
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
                data: series.final_sale_count
            },
            {
                name: '销售金额',
                type: 'bar',
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
                data: series.final_sale_amount
            },
            {
                name: '毛利额',
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: '#91c7ae',
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#91c7ae'
                            }
                        }
                    }
                },
                data: series.profit_amount
            },
            {
                name: '毛利率',
                type: 'line',
                yAxisIndex: 1,
                itemStyle: {
                    normal: {
                        color: '#426ff4',
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#426ff4'
                            },
                            formatter: '{c}' + "%"
                        }
                    }
                },
                data: series.profit_rate
            }
        ]
    };
    var chart = "trafficAllwebTrafficFunnelSaleProductChart";
    if (flag == "all") {
        chart = "trafficAllwebTrafficFunnelSaleProductChart";
        renderAccuTable("#tableAllAccu",tableJson);
    } else if (flag == "ahs") {
        chart = "trafficAhswebTrafficFunnelSaleProductChart";
        renderAccuTable("#tableAhsAccu",tableJson);
    } else if (flag == "kdyp") {
        chart = "trafficKdypwebTrafficFunnelSaleProductChart";
        renderAccuTable("#tableKdypAccu",tableJson);
    } else if (flag == "ajh") {
        chart = "trafficAjhwebTrafficFunnelSaleProductChart";
        renderAccuTable("#tableAjhAccu",tableJson);
    } else if (flag == "xhj") {
        chart = "trafficXhjwebTrafficFunnelSaleProductChart";
        renderAccuTable("#tableXhjAccu",tableJson);
    }
    var cusStaChart = echarts.init(document.getElementById(chart));
    cusStaChart.setOption(option);
    window.addEventListener('resize', cusStaChart.resize)
}

//all
function drawTrafficAllPartChart(data) {

    //表格数据
    var tableJson = [];
    var tableTemp = {};
    tableTemp.ahs_final_sale_count = 0;
    tableTemp.ahs_final_sale_amount = 0;
    tableTemp.ahs_profit_amount = 0;
    tableTemp.kdyp_final_sale_count = 0;
    tableTemp.kdyp_final_sale_amount = 0;
    tableTemp.kdyp_profit_amount = 0;
    tableTemp.ajh_final_sale_count = 0;
    tableTemp.ajh_final_sale_amount = 0;
    tableTemp.ajh_profit_amount = 0;

    //图标数据
    var xAxis_data = [];
    var seriesCnt = {
        ahsCnt: [],
        ahsSelfCnt: [],
        ahsBdCnt: [],
        kdypCnt: [],
        kdypSelfCnt: [],
        kdypJdCnt: [],
        kdypQuCnt: [],
        kdypElseCnt: [],
        ajhCnt: [],
        ajhEastCnt: [],
        ajhSouthCnt: [],
        ajhWestCnt: [],
        ajhNorthCnt: [],
    };

    var seriesAmt = {
        ahsAmt: [],
        ahsSelfAmt: [],
        ahsBdAmt: [],
        kdypAmt: [],
        kdypSelfAmt: [],
        kdypJdAmt: [],
        kdypQuAmt: [],
        kdypElseAmt: [],
        ajhAmt: [],
        ajhEastAmt: [],
        ajhSouthAmt: [],
        ajhWestAmt: [],
        ajhNorthAmt: [],
    };

    var seriesProfitRate = {
        ahsProfitRate: [],
        ahsSelfProfitRate: [],
        ahsBdProfitRate: [],
        kdypProfitRate: [],
        kdypSelfProfitRate: [],
        kdypJdProfitRate: [],
        kdypQuProfitRate: [],
        kdypElseProfitRate: [],
        ajhProfitRate: [],
        ajhEastProfitRate: [],
        ajhSouthProfitRate: [],
        ajhWestProfitRate: [],
        ajhNorthProfitRate: [],
    };

    data.forEach(function (e) {
        if (e.source_name == "自有渠道") {
            xAxis_data.push(e.date);
            seriesCnt.ahsSelfCnt.push(e.final_sale_count);
            seriesAmt.ahsSelfAmt.push(e.final_sale_amount);
            seriesProfitRate.ahsSelfProfitRate.push(e.profit_amount);
        } else if (e.source_name == "BD") {
            seriesCnt.ahsBdCnt.push(e.final_sale_count);
            seriesAmt.ahsBdAmt.push(e.final_sale_amount);
            seriesProfitRate.ahsBdProfitRate.push(e.profit_amount);
        } else if (e.source_name == "京东商城") {
            seriesCnt.kdypJdCnt.push(e.final_sale_count);
            seriesAmt.kdypJdAmt.push(e.final_sale_amount);
            seriesProfitRate.kdypJdProfitRate.push(e.profit_amount);
        } else if (e.source_name == "口袋优品官网") {
            seriesCnt.kdypSelfCnt.push(e.final_sale_count);
            seriesAmt.kdypSelfAmt.push(e.final_sale_amount);
            seriesProfitRate.kdypSelfProfitRate.push(e.profit_amount);
        } else if (e.source_name == "趣分期") {
            seriesCnt.kdypQuCnt.push(e.final_sale_count);
            seriesAmt.kdypQuAmt.push(e.final_sale_amount);
            seriesProfitRate.kdypQuProfitRate.push(e.profit_amount);
        } else if (e.source_name == "口袋优品其它") {
            seriesCnt.kdypElseCnt.push(e.final_sale_count);
            seriesAmt.kdypElseAmt.push(e.final_sale_amount);
            seriesProfitRate.kdypElseProfitRate.push(e.profit_amount);
        } else if (e.source_name == "东区") {
            seriesCnt.ajhEastCnt.push(e.final_sale_count);
            seriesAmt.ajhEastAmt.push(e.final_sale_amount);
            seriesProfitRate.ajhEastProfitRate.push(e.profit_amount);
        } else if (e.source_name == "南区") {
            seriesCnt.ajhSouthCnt.push(e.final_sale_count);
            seriesAmt.ajhSouthAmt.push(e.final_sale_amount);
            seriesProfitRate.ajhSouthProfitRate.push(e.profit_amount);
        } else if (e.source_name == "西区") {
            seriesCnt.ajhWestCnt.push(e.final_sale_count);
            seriesAmt.ajhWestAmt.push(e.final_sale_amount);
            seriesProfitRate.ajhWestProfitRate.push(e.profit_amount);
        } else if (e.source_name == "北区") {
            seriesCnt.ajhNorthCnt.push(e.final_sale_count);
            seriesAmt.ajhNorthAmt.push(e.final_sale_amount);
            seriesProfitRate.ajhNorthProfitRate.push(e.profit_amount);
        }
    });
    for (var i = 0; i < xAxis_data.length; i++) {
        seriesCnt.ahsCnt[i] = seriesCnt.ahsBdCnt[i] + seriesCnt.ahsSelfCnt[i];
        seriesAmt.ahsAmt[i] = seriesAmt.ahsBdAmt[i] + seriesAmt.ahsSelfAmt[i];
        seriesProfitRate.ahsProfitRate[i] = (((seriesProfitRate.ahsBdProfitRate[i] + seriesProfitRate.ahsSelfProfitRate[i]) / seriesAmt.ahsAmt[i]) * 100).toFixed(2);
        tableTemp.ahs_final_sale_count+=seriesCnt.ahsCnt[i];
        tableTemp.ahs_final_sale_amount+=seriesAmt.ahsAmt[i];
        tableTemp.ahs_profit_amount+=seriesProfitRate.ahsBdProfitRate[i] + seriesProfitRate.ahsSelfProfitRate[i];
        if(seriesCnt.kdypElseCnt[i]==undefined){
            seriesCnt.kdypCnt[i] = seriesCnt.kdypJdCnt[i] + seriesCnt.kdypQuCnt[i] + seriesCnt.kdypSelfCnt[i] + 0;
            seriesAmt.kdypAmt[i] = seriesAmt.kdypJdAmt[i] + seriesAmt.kdypQuAmt[i] + seriesAmt.kdypSelfAmt[i] + 0;
            seriesProfitRate.kdypProfitRate[i] = (((seriesProfitRate.kdypJdProfitRate[i] + seriesProfitRate.kdypQuProfitRate[i] + seriesProfitRate.kdypSelfProfitRate[i] + 0) / seriesAmt.kdypAmt[i]) * 100).toFixed(2);
            tableTemp.kdyp_final_sale_count += seriesCnt.kdypCnt[i];
            tableTemp.kdyp_final_sale_amount += seriesAmt.kdypAmt[i];
            tableTemp.kdyp_profit_amount+=seriesProfitRate.kdypJdProfitRate[i] + seriesProfitRate.kdypQuProfitRate[i] + seriesProfitRate.kdypSelfProfitRate[i] + 0;
        }else {
            seriesCnt.kdypCnt[i] = seriesCnt.kdypJdCnt[i] + seriesCnt.kdypQuCnt[i] + seriesCnt.kdypSelfCnt[i] + seriesCnt.kdypElseCnt[i];
            seriesAmt.kdypAmt[i] = seriesAmt.kdypJdAmt[i] + seriesAmt.kdypQuAmt[i] + seriesAmt.kdypSelfAmt[i] + seriesAmt.kdypElseAmt[i];
            seriesProfitRate.kdypProfitRate[i] = (((seriesProfitRate.kdypJdProfitRate[i] + seriesProfitRate.kdypQuProfitRate[i] + seriesProfitRate.kdypSelfProfitRate[i] + seriesProfitRate.kdypElseProfitRate[i]) / seriesAmt.kdypAmt[i]) * 100).toFixed(2);
            tableTemp.kdyp_final_sale_count += seriesCnt.kdypCnt[i];
            tableTemp.kdyp_final_sale_amount += seriesAmt.kdypAmt[i];
            tableTemp.kdyp_profit_amount += seriesProfitRate.kdypJdProfitRate[i] + seriesProfitRate.kdypQuProfitRate[i] + seriesProfitRate.kdypSelfProfitRate[i] + seriesProfitRate.kdypElseProfitRate[i];
        }
        seriesCnt.ajhCnt[i] = seriesCnt.ajhEastCnt[i] + seriesCnt.ajhNorthCnt[i] + seriesCnt.ajhWestCnt[i] + seriesCnt.ajhSouthCnt[i];
        seriesAmt.ajhAmt[i] = seriesAmt.ajhEastAmt[i] + seriesAmt.ajhWestAmt[i] + seriesAmt.ajhNorthAmt[i] + seriesAmt.ajhSouthAmt[i];
        seriesProfitRate.ajhProfitRate[i] = (((seriesProfitRate.ajhEastProfitRate[i] + seriesProfitRate.ajhSouthProfitRate[i] + seriesProfitRate.ajhNorthProfitRate[i] + seriesProfitRate.ajhWestProfitRate[i]) / seriesAmt.ajhAmt[i]) * 100).toFixed(2);
        tableTemp.ajh_final_sale_count+=seriesCnt.ajhCnt[i];
        tableTemp.ajh_final_sale_amount+=seriesAmt.ajhAmt[i];
        tableTemp.ajh_profit_amount+=seriesProfitRate.ajhEastProfitRate[i] + seriesProfitRate.ajhSouthProfitRate[i] + seriesProfitRate.ajhNorthProfitRate[i] + seriesProfitRate.ajhWestProfitRate[i];
    }

    tableTemp.ahs_final_sale_amount=tableTemp.ahs_final_sale_amount.toFixed(2);
    tableTemp.kdyp_final_sale_amount=tableTemp.kdyp_final_sale_amount.toFixed(2);
    tableTemp.ajh_final_sale_amount=tableTemp.ajh_final_sale_amount.toFixed(2);
    tableTemp.ahs_profit_rate=((tableTemp.ahs_profit_amount/tableTemp.ahs_final_sale_amount)*100).toFixed(2)+"%";
    tableTemp.kdyp_profit_rate=((tableTemp.kdyp_profit_amount/tableTemp.kdyp_final_sale_amount)*100).toFixed(2)+"%";
    tableTemp.ajh_profit_rate=((tableTemp.ajh_profit_amount/tableTemp.ajh_final_sale_amount)*100).toFixed(2)+"%";
    tableJson.push(tableTemp);
    renderAccuTable("#tableAllCntAccu",tableJson);
    renderAccuTable("#tableAllAmtAccu",tableJson);
    renderAccuTable("#tableAllRateAccu",tableJson);

    var optionAmt = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function (params, ticket, callback) {
                var str = (params[1] ? params[1] : params[0]).name + '<br/>' + "销售金额:" + '<br/>';
                params.forEach(function (obj) {
                    str += obj.seriesName + ' : ' + obj.value + '(元)<br/>'
                });
                return str;
            }
        },
        legend: {
            data: ['主营', '口袋优品', '爱机汇']
        },
        dataZoom: [
            {
                show: true,
                realtime: true,
                //start: 80,
                //end: 0
            }
        ],
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: xAxis_data
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '主营',
                type: 'bar',
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
                data: seriesAmt.ahsAmt
            }, {
                name: '口袋优品',
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: '#91c7ae',
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#91c7ae'
                            }
                        }
                    }
                },
                data: seriesAmt.kdypAmt
            }, {
                name: '爱机汇',
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: '#bda29a',
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#bda29a'
                            }
                        }
                    }
                },
                data: seriesAmt.ajhAmt
            }
        ]
    };

    var cusStaChart = echarts.init(document.getElementById("trafficAllPartwebTrafficFunnelSaleProductAmtChart"));
    cusStaChart.setOption(optionAmt);
    window.addEventListener('resize', cusStaChart.resize)

    var optionCnt = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function (params, ticket, callback) {
                var str = (params[1] ? params[1] : params[0]).name + '<br/>' + "销量:" + '<br/>';
                params.forEach(function (obj) {
                    str += obj.seriesName + ' : ' + obj.value + '(台)<br/>'
                });
                return str;
            }
        },
        legend: {
            data: ['主营', '口袋优品', '爱机汇']
        },
        dataZoom: [
            {
                show: true,
                realtime: true,
                //start: 80,
                //end: 0
            }
        ],
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: xAxis_data
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '主营',
                type: 'bar',
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
                data: seriesCnt.ahsCnt
            }, {
                name: '口袋优品',
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: '#91c7ae',
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#91c7ae'
                            }
                        }
                    }
                },
                data: seriesCnt.kdypCnt
            }, {
                name: '爱机汇',
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: '#bda29a',
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#bda29a'
                            }
                        }
                    }
                },
                data: seriesCnt.ajhCnt
            }
        ]
    };

    var cusStaChart = echarts.init(document.getElementById("trafficAllPartwebTrafficFunnelSaleProductCntChart"));
    cusStaChart.setOption(optionCnt);
    window.addEventListener('resize', cusStaChart.resize)

    var optionRate = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function (params, ticket, callback) {
                var str = (params[1] ? params[1] : params[0]).name + '<br/>' + "销售毛利率:" + '<br/>';
                params.forEach(function (obj) {
                    str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                });
                return str;
            }
        },
        legend: {
            data: ['主营', '口袋优品', '爱机汇']
        },
        dataZoom: [
            {
                show: true,
                realtime: true,
                //start: 80,
                //end: 0
            }
        ],
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: xAxis_data
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '主营',
                type: 'line',
                itemStyle: {
                    normal: {
                        color: '#d48265',
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#d48265'
                            },
                            formatter: '{c}' + "%"
                        }
                    }
                },
                data: seriesProfitRate.ahsProfitRate
            }, {
                name: '口袋优品',
                type: 'line',
                itemStyle: {
                    normal: {
                        color: '#91c7ae',
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#91c7ae'
                            },
                            formatter: '{c}' + "%"
                        }
                    }
                },
                data: seriesProfitRate.kdypProfitRate
            }, {
                name: '爱机汇',
                type: 'line',
                itemStyle: {
                    normal: {
                        color: '#bda29a',
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#bda29a'
                            },
                            formatter: '{c}' + "%"
                        }
                    }
                },
                data: seriesProfitRate.ajhProfitRate
            }
        ]
    };

    var cusStaChart = echarts.init(document.getElementById("trafficAllPartwebTrafficFunnelSaleProductRateChart"));
    cusStaChart.setOption(optionRate);
    window.addEventListener('resize', cusStaChart.resize)

}

//ahs
function drawTrafficAhsPartChart(data) {
    //表格数据
    var tableJson = [];
    var tableTemp = {};
    tableTemp.ahsBd_final_sale_count = 0;
    tableTemp.ahsBd_final_sale_amount = 0;
    tableTemp.ahsBd_profit_amount = 0;
    tableTemp.ahsSelf_final_sale_count = 0;
    tableTemp.ahsSelf_final_sale_amount = 0;
    tableTemp.ahsSelf_profit_amount = 0;

    //图标数据
    var xAxis_data = [];
    var seriesCnt = {
        ahsSelfCnt: [],
        ahsBdCnt: [],
    };

    var seriesAmt = {
        ahsSelfAmt: [],
        ahsBdAmt: []
    };

    var seriesProfitRate = {
        ahsSelfProfitRate: [],
        ahsBdProfitRate: []
    };

    data.forEach(function (e) {
        if (e.source_name == "自有渠道") {
            xAxis_data.push(e.date);
            seriesCnt.ahsSelfCnt.push(e.final_sale_count);
            seriesAmt.ahsSelfAmt.push(e.final_sale_amount);
            seriesProfitRate.ahsSelfProfitRate.push(((e.profit_amount / e.final_sale_amount) * 100).toFixed(2));

            tableTemp.ahsSelf_final_sale_count+=e.final_sale_count;
            tableTemp.ahsSelf_final_sale_amount+=e.final_sale_amount;
            tableTemp.ahsSelf_profit_amount+=e.profit_amount;
        } else if (e.source_name == "BD") {
            seriesCnt.ahsBdCnt.push(e.final_sale_count);
            seriesAmt.ahsBdAmt.push(e.final_sale_amount);
            seriesProfitRate.ahsBdProfitRate.push(((e.profit_amount / e.final_sale_amount) * 100).toFixed(2));

            tableTemp.ahsBd_final_sale_count+=e.final_sale_count;
            tableTemp.ahsBd_final_sale_amount+=e.final_sale_amount;
            tableTemp.ahsBd_profit_amount+=e.profit_amount;
        }
    });

    tableTemp.ahsBd_final_sale_amount=tableTemp.ahsBd_final_sale_amount.toFixed(2);
    tableTemp.ahsSelf_final_sale_amount=tableTemp.ahsSelf_final_sale_amount.toFixed(2);
    tableTemp.ahsBd_profit_rate=((tableTemp.ahsBd_profit_amount/tableTemp.ahsBd_final_sale_amount)*100).toFixed(2)+"%";
    tableTemp.ahsSelf_profit_rate=((tableTemp.ahsSelf_profit_amount/tableTemp.ahsSelf_final_sale_amount)*100).toFixed(2)+"%";
    tableJson.push(tableTemp);
    renderAccuTable("#tableAhsCntAccu",tableJson);
    renderAccuTable("#tableAhsAmtAccu",tableJson);
    renderAccuTable("#tableAhsRateAccu",tableJson);

    var optionAmt = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function (params, ticket, callback) {
                var str = (params[1] ? params[1] : params[0]).name + '<br/>' + "销售金额:" + '<br/>';
                params.forEach(function (obj) {
                    str += obj.seriesName + ' : ' + obj.value + '(元)<br/>'
                });
                return str;
            }
        },
        legend: {
            data: ['BD', '自有渠道']
        },
        dataZoom: [
            {
                show: true,
                realtime: true,
                //start: 80,
                //end: 0
            }
        ],
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: xAxis_data
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: 'BD',
                type: 'bar',
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
                data: seriesAmt.ahsBdAmt
            }, {
                name: '自有渠道',
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: '#91c7ae',
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#91c7ae'
                            }
                        }
                    }
                },
                data: seriesAmt.ahsSelfAmt
            }
        ]
    };

    var cusStaChart = echarts.init(document.getElementById("trafficAhsPartwebTrafficFunnelSaleProductAmtChart"));
    cusStaChart.setOption(optionAmt);
    window.addEventListener('resize', cusStaChart.resize)

    var optionCnt = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function (params, ticket, callback) {
                var str = (params[1] ? params[1] : params[0]).name + '<br/>' + "销量:" + '<br/>';
                params.forEach(function (obj) {
                    str += obj.seriesName + ' : ' + obj.value + '(台)<br/>'
                });
                return str;
            }
        },
        legend: {
            data: ['BD', '自有渠道']
        },
        dataZoom: [
            {
                show: true,
                realtime: true,
                //start: 80,
                //end: 0
            }
        ],
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: xAxis_data
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: 'BD',
                type: 'bar',
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
                data: seriesCnt.ahsBdCnt
            }, {
                name: '自有渠道',
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: '#91c7ae',
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#91c7ae'
                            }
                        }
                    }
                },
                data: seriesCnt.ahsSelfCnt
            }
        ]
    };

    var cusStaChart = echarts.init(document.getElementById("trafficAhsPartwebTrafficFunnelSaleProductCntChart"));
    cusStaChart.setOption(optionCnt);
    window.addEventListener('resize', cusStaChart.resize)

    var optionRate = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function (params, ticket, callback) {
                var str = (params[1] ? params[1] : params[0]).name + '<br/>' + "销售毛利率:" + '<br/>';
                params.forEach(function (obj) {
                    str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                });
                return str;
            }
        },
        legend: {
            data: ['BD', '自有渠道']
        },
        dataZoom: [
            {
                show: true,
                realtime: true,
                //start: 80,
                //end: 0
            }
        ],
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: xAxis_data
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: 'BD',
                type: 'line',
                itemStyle: {
                    normal: {
                        color: '#d48265',
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#d48265'
                            },
                            formatter: '{c}' + "%"
                        }
                    }
                },
                data: seriesProfitRate.ahsBdProfitRate
            }, {
                name: '自有渠道',
                type: 'line',
                itemStyle: {
                    normal: {
                        color: '#91c7ae',
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#91c7ae'
                            },
                            formatter: '{c}' + "%"
                        }
                    }
                },
                data: seriesProfitRate.ahsSelfProfitRate
            }
        ]
    };

    var cusStaChart = echarts.init(document.getElementById("trafficAhsPartwebTrafficFunnelSaleProductRateChart"));
    cusStaChart.setOption(optionRate);
    window.addEventListener('resize', cusStaChart.resize)
}

//kdyp
function drawTrafficKdypPartChart(data) {
    //表格数据
    var tableJson = [];
    var tableTemp = {};
    tableTemp.kdypJd_final_sale_count = 0;
    tableTemp.kdypJd_final_sale_amount = 0;
    tableTemp.kdypJd_profit_amount = 0;
    tableTemp.kdypQu_final_sale_count = 0;
    tableTemp.kdypQu_final_sale_amount = 0;
    tableTemp.kdypQu_profit_amount = 0;
    tableTemp.kdypSelf_final_sale_count = 0;
    tableTemp.kdypSelf_final_sale_amount = 0;
    tableTemp.kdypSelf_profit_amount = 0;
    tableTemp.kdypElse_final_sale_count = 0;
    tableTemp.kdypElse_final_sale_amount = 0;
    tableTemp.kdypElse_profit_amount = 0;

    //图标数据
    var xAxis_data = [];

    //----------------start-------------
    var cntObj={
    }
    var cntList=[];
    var amtList=[];
    var rateList=[];
    data.forEach(function(e){
        if(e.date!=cntObj.date){
            if(cntObj.date){
                tableTemp.kdypJd_final_sale_count+= cntObj.cnt[0];
                tableTemp.kdypJd_final_sale_amount+= cntObj.amt[0];
                tableTemp.kdypJd_profit_amount+= cntObj.profit[0];

                tableTemp.kdypSelf_final_sale_count+= cntObj.cnt[1];
                tableTemp.kdypSelf_final_sale_amount+= cntObj.amt[1];
                tableTemp.kdypSelf_profit_amount+= cntObj.profit[1];

                tableTemp.kdypQu_final_sale_count+= cntObj.cnt[2];
                tableTemp.kdypQu_final_sale_amount+= cntObj.amt[2];
                tableTemp.kdypQu_profit_amount+= cntObj.profit[2];

                tableTemp.kdypElse_final_sale_count+= cntObj.cnt[3];
                tableTemp.kdypElse_final_sale_amount+= cntObj.amt[3];
                tableTemp.kdypElse_profit_amount+= cntObj.profit[3];

                cntList.push(cntObj.cnt);
                amtList.push(cntObj.amt);
                rateList.push(cntObj.rate);
            }
            xAxis_data.push(e.date);
            cntObj.date= e.date;
            cntObj.cnt=[0,0,0,0];
            cntObj.amt=[0,0,0,0];
            cntObj.profit=[0,0,0,0];
            cntObj.rate=[0,0,0,0];
        }
        if (e.source_name == "京东商城") {
            cntObj.cnt[0]=e.final_sale_count;
            cntObj.amt[0]=e.final_sale_amount;
            cntObj.profit[0]=e.profit_amount;
            cntObj.rate[0]=e.profit_rate.split("%")[0];
        }else if (e.source_name == "口袋优品官网"){
            cntObj.cnt[1]=e.final_sale_count;
            cntObj.amt[1]=e.final_sale_amount;
            cntObj.profit[1]=e.profit_amount;
            cntObj.rate[1]=e.profit_rate.split("%")[0];
        }else if (e.source_name == "趣分期") {
            cntObj.cnt[2]=e.final_sale_count;
            cntObj.amt[2]=e.final_sale_amount;
            cntObj.profit[2]=e.profit_amount;
            cntObj.rate[2]=e.profit_rate.split("%")[0];
        }else if (e.source_name == "口袋优品其它") {
            cntObj.cnt[3]=e.final_sale_count;
            cntObj.amt[3]=e.final_sale_amount;
            cntObj.profit[3]=e.profit_amount;
            cntObj.rate[3]=e.profit_rate.split("%")[0];
        }
    })

    tableTemp.kdypJd_final_sale_count+= cntObj.cnt[0];
    tableTemp.kdypJd_final_sale_amount+= cntObj.amt[0];
    tableTemp.kdypJd_profit_amount+= cntObj.profit[0];

    tableTemp.kdypSelf_final_sale_count+= cntObj.cnt[1];
    tableTemp.kdypSelf_final_sale_amount+= cntObj.amt[1];
    tableTemp.kdypSelf_profit_amount+= cntObj.profit[1];

    tableTemp.kdypQu_final_sale_count+= cntObj.cnt[2];
    tableTemp.kdypQu_final_sale_amount+= cntObj.amt[2];
    tableTemp.kdypQu_profit_amount+= cntObj.profit[2];

    tableTemp.kdypElse_final_sale_count+= cntObj.cnt[3];
    tableTemp.kdypElse_final_sale_amount+= cntObj.amt[3];
    tableTemp.kdypElse_profit_amount+= cntObj.profit[3];

    cntList.push(cntObj.cnt);
    amtList.push(cntObj.amt);
    rateList.push(cntObj.rate);
    //-----------------end--------------

    tableTemp.kdypJd_final_sale_amount=tableTemp.kdypJd_final_sale_amount.toFixed(2);
    tableTemp.kdypQu_final_sale_amount=tableTemp.kdypQu_final_sale_amount.toFixed(2);
    tableTemp.kdypSelf_final_sale_amount=tableTemp.kdypSelf_final_sale_amount.toFixed(2);
    tableTemp.kdypElse_final_sale_amount=tableTemp.kdypElse_final_sale_amount.toFixed(2);
    tableTemp.kdypJd_profit_rate=((tableTemp.kdypJd_profit_amount/tableTemp.kdypJd_final_sale_amount)*100).toFixed(2)+"%";
    tableTemp.kdypQu_profit_rate=((tableTemp.kdypQu_profit_amount/tableTemp.kdypQu_final_sale_amount)*100).toFixed(2)+"%";
    tableTemp.kdypSelf_profit_rate=((tableTemp.kdypSelf_profit_amount/tableTemp.kdypSelf_final_sale_amount)*100).toFixed(2)+"%";
    if(tableTemp.kdypElse_final_sale_amount==0){
        tableTemp.kdypElse_profit_rate=0.00+"%"
    }else {
        tableTemp.kdypElse_profit_rate = ((tableTemp.kdypElse_profit_amount / tableTemp.kdypElse_final_sale_amount) * 100).toFixed(2) + "%";
    }
    tableJson.push(tableTemp);
    renderAccuTable("#tableKdypCntAccu",tableJson);
    renderAccuTable("#tableKdypAmtAccu",tableJson);
    renderAccuTable("#tableKdypRateAccu",tableJson);

    var optionAmt = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function (params, ticket, callback) {
                var str = (params[1] ? params[1] : params[0]).name + '<br/>' + "销售金额:" + '<br/>';
                params.forEach(function (obj) {
                    str += obj.seriesName + ' : ' + obj.value + '(元)<br/>'
                });
                return str;
            }
        },
        legend: {
            data: ['京东商城', '趣分期', '口袋优品官网', '口袋优品其它']
        },
        dataZoom: [
            {
                show: true,
                realtime: true,
                //start: 80,
                //end: 0
            }
        ],
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: xAxis_data
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '京东商城',
                type: 'bar',
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
                data: amtList.unzip()[0]
            }, {
                name: '趣分期',
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: '#91c7ae',
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#91c7ae'
                            }
                        }
                    }
                },
                data: amtList.unzip()[2]
            }, {
                name: '口袋优品官网',
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: '#bda29a',
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#bda29a'
                            }
                        }
                    }
                },
                data: amtList.unzip()[1]
            }, {
                name: '口袋优品其它',
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: '#6e7074',
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#6e7074'
                            }
                        }
                    }
                },
                data: amtList.unzip()[3]
            }
        ]
    };

    var cusStaChart = echarts.init(document.getElementById("trafficKdypPartwebTrafficFunnelSaleProductAmtChart"));
    cusStaChart.setOption(optionAmt);
    window.addEventListener('resize', cusStaChart.resize)

    var optionCnt = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function (params, ticket, callback) {
                var str = (params[1] ? params[1] : params[0]).name + '<br/>' + "销量:" + '<br/>';
                params.forEach(function (obj) {
                    str += obj.seriesName + ' : ' + obj.value + '(台)<br/>'
                });
                return str;
            }
        },
        legend: {
            data: ['京东商城', '趣分期', '口袋优品官网', '口袋优品其它']
        },
        dataZoom: [
            {
                show: true,
                realtime: true,
                //start: 80,
                //end: 0
            }
        ],
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: xAxis_data
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '京东商城',
                type: 'bar',
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
                data:cntList.unzip()[0]
            }, {
                name: '趣分期',
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: '#91c7ae',
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#91c7ae'
                            }
                        }
                    }
                },
                data: cntList.unzip()[2]
            }, {
                name: '口袋优品官网',
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: '#bda29a',
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#bda29a'
                            }
                        }
                    }
                },
                data: cntList.unzip()[1]
            }, {
                name: '口袋优品其它',
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: '#6e7074',
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#6e7074'
                            }
                        }
                    }
                },
                data: cntList.unzip()[3]
            }
        ]
    };

    var cusStaChart = echarts.init(document.getElementById("trafficKdypPartwebTrafficFunnelSaleProductCntChart"));
    cusStaChart.setOption(optionCnt);
    window.addEventListener('resize', cusStaChart.resize)

    var optionRate = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function (params, ticket, callback) {
                var str = (params[1] ? params[1] : params[0]).name + '<br/>' + "销售毛利率:" + '<br/>';
                params.forEach(function (obj) {
                    str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                });
                return str;
            }
        },
        legend: {
            data: ['京东商城', '趣分期', '口袋优品官网', '口袋优品其它']
        },
        dataZoom: [
            {
                show: true,
                realtime: true,
                //start: 80,
                //end: 0
            }
        ],
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: xAxis_data
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '京东商城',
                type: 'line',
                itemStyle: {
                    normal: {
                        color: '#d48265',
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#d48265'
                            },
                            formatter: '{c}' + "%"
                        }
                    }
                },
                data: rateList.unzip()[0]
            }, {
                name: '趣分期',
                type: 'line',
                itemStyle: {
                    normal: {
                        color: '#91c7ae',
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#91c7ae'
                            },
                            formatter: '{c}' + "%"
                        }
                    }
                },
                data: rateList.unzip()[2]
            }, {
                name: '口袋优品官网',
                type: 'line',
                itemStyle: {
                    normal: {
                        color: '#bda29a',
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#bda29a'
                            },
                            formatter: '{c}' + "%"
                        }
                    }
                },
                data: rateList.unzip()[1]
            }, {
                name: '口袋优品其它',
                type: 'line',
                itemStyle: {
                    normal: {
                        color: '#6e7074',
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#6e7074'
                            },
                            formatter: '{c}' + "%"
                        }
                    }
                },
                data: rateList.unzip()[3]
            }
        ]
    };

    var cusStaChart = echarts.init(document.getElementById("trafficKdypPartwebTrafficFunnelSaleProductRateChart"));
    cusStaChart.setOption(optionRate);
    window.addEventListener('resize', cusStaChart.resize)
}

//ajh
function drawTrafficAjhPartChart(data) {
    //表格数据
    var tableJson = [];
    var tableTemp = {};
    tableTemp.ajhEast_final_sale_count = 0;
    tableTemp.ajhEast_final_sale_amount = 0;
    tableTemp.ajhEast_profit_amount = 0;
    tableTemp.ajhWest_final_sale_count = 0;
    tableTemp.ajhWest_final_sale_amount = 0;
    tableTemp.ajhWest_profit_amount = 0;
    tableTemp.ajhNorth_final_sale_count = 0;
    tableTemp.ajhNorth_final_sale_amount = 0;
    tableTemp.ajhNorth_profit_amount = 0;
    tableTemp.ajhSouth_final_sale_count = 0;
    tableTemp.ajhSouth_final_sale_amount = 0;
    tableTemp.ajhSouth_profit_amount = 0;

    //图标数据
    var xAxis_data = [];
    var seriesCnt = {
        ajhEastCnt: [],
        ajhSouthCnt: [],
        ajhWestCnt: [],
        ajhNorthCnt: [],
    };

    var seriesAmt = {
        ajhEastAmt: [],
        ajhSouthAmt: [],
        ajhWestAmt: [],
        ajhNorthAmt: [],
    };

    var seriesProfitRate = {
        ajhEastProfitRate: [],
        ajhSouthProfitRate: [],
        ajhWestProfitRate: [],
        ajhNorthProfitRate: [],
    };

    data.forEach(function (e) {
        if (e.source_name == "东区") {
            xAxis_data.push(e.date);
            seriesCnt.ajhEastCnt.push(e.final_sale_count);
            seriesAmt.ajhEastAmt.push(e.final_sale_amount);
            seriesProfitRate.ajhEastProfitRate.push(((e.profit_amount / e.final_sale_amount) * 100).toFixed(2));

            tableTemp.ajhEast_final_sale_amount+= e.final_sale_amount;
            tableTemp.ajhEast_final_sale_count+= e.final_sale_count;
            tableTemp.ajhEast_profit_amount+= e.profit_amount;
        } else if (e.source_name == "南区") {
            seriesCnt.ajhSouthCnt.push(e.final_sale_count);
            seriesAmt.ajhSouthAmt.push(e.final_sale_amount);
            seriesProfitRate.ajhSouthProfitRate.push(((e.profit_amount / e.final_sale_amount) * 100).toFixed(2));

            tableTemp.ajhSouth_final_sale_amount+= e.final_sale_amount;
            tableTemp.ajhSouth_final_sale_count+= e.final_sale_count;
            tableTemp.ajhSouth_profit_amount+= e.profit_amount;
        } else if (e.source_name == "西区") {
            seriesCnt.ajhWestCnt.push(e.final_sale_count);
            seriesAmt.ajhWestAmt.push(e.final_sale_amount);
            seriesProfitRate.ajhWestProfitRate.push(((e.profit_amount / e.final_sale_amount) * 100).toFixed(2));

            tableTemp.ajhWest_final_sale_amount+= e.final_sale_amount;
            tableTemp.ajhWest_final_sale_count+= e.final_sale_count;
            tableTemp.ajhWest_profit_amount+= e.profit_amount;
        } else if (e.source_name == "北区") {
            seriesCnt.ajhNorthCnt.push(e.final_sale_count);
            seriesAmt.ajhNorthAmt.push(e.final_sale_amount);
            seriesProfitRate.ajhNorthProfitRate.push(((e.profit_amount / e.final_sale_amount) * 100).toFixed(2));

            tableTemp.ajhNorth_final_sale_amount+= e.final_sale_amount;
            tableTemp.ajhNorth_final_sale_count+= e.final_sale_count;
            tableTemp.ajhNorth_profit_amount+= e.profit_amount;
        }
    });

    tableTemp.ajhEast_final_sale_amount=tableTemp.ajhEast_final_sale_amount.toFixed(2);
    tableTemp.ajhWest_final_sale_amount=tableTemp.ajhWest_final_sale_amount.toFixed(2);
    tableTemp.ajhNorth_final_sale_amount=tableTemp.ajhNorth_final_sale_amount.toFixed(2);
    tableTemp.ajhSouth_final_sale_amount=tableTemp.ajhSouth_final_sale_amount.toFixed(2);
    tableTemp.ajhEast_profit_rate=((tableTemp.ajhEast_profit_amount/tableTemp.ajhEast_final_sale_amount)*100).toFixed(2)+"%";
    tableTemp.ajhWest_profit_rate=((tableTemp.ajhWest_profit_amount/tableTemp.ajhWest_final_sale_amount)*100).toFixed(2)+"%";
    tableTemp.ajhNorth_profit_rate=((tableTemp.ajhNorth_profit_amount/tableTemp.ajhNorth_final_sale_amount)*100).toFixed(2)+"%";
    tableTemp.ajhSouth_profit_rate=((tableTemp.ajhSouth_profit_amount/tableTemp.ajhSouth_final_sale_amount)*100).toFixed(2)+"%";
    tableJson.push(tableTemp);
    renderAccuTable("#tableAjhCntAccu",tableJson);
    renderAccuTable("#tableAjhAmtAccu",tableJson);
    renderAccuTable("#tableAjhRateAccu",tableJson);

    var optionAmt = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function (params, ticket, callback) {
                var str = (params[1] ? params[1] : params[0]).name + '<br/>' + "销售金额:" + '<br/>';
                params.forEach(function (obj) {
                    str += obj.seriesName + ' : ' + obj.value + '(元)<br/>'
                });
                return str;
            }
        },
        legend: {
            data: ['东区', '北区', '南区', '西区']
        },
        dataZoom: [
            {
                show: true,
                realtime: true,
                //start: 80,
                //end: 0
            }
        ],
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: xAxis_data
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '东区',
                type: 'bar',
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
                data: seriesAmt.ajhEastAmt
            }, {
                name: '北区',
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: '#91c7ae',
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#91c7ae'
                            }
                        }
                    }
                },
                data: seriesAmt.ajhNorthAmt
            }, {
                name: '南区',
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: '#bda29a',
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#bda29a'
                            }
                        }
                    }
                },
                data: seriesAmt.ajhSouthAmt
            }, {
                name: '西区',
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: '#6e7074',
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#6e7074'
                            }
                        }
                    }
                },
                data: seriesAmt.ajhWestAmt
            }
        ]
    };

    var cusStaChart = echarts.init(document.getElementById("trafficAjhPartwebTrafficFunnelSaleProductAmtChart"));
    cusStaChart.setOption(optionAmt);
    window.addEventListener('resize', cusStaChart.resize)

    var optionCnt = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function (params, ticket, callback) {
                var str = (params[1] ? params[1] : params[0]).name + '<br/>' + "销量:" + '<br/>';
                params.forEach(function (obj) {
                    str += obj.seriesName + ' : ' + obj.value + '(台)<br/>'
                });
                return str;
            }
        },
        legend: {
            data: ['东区', '北区', '南区', '西区']
        },
        dataZoom: [
            {
                show: true,
                realtime: true,
                //start: 80,
                //end: 0
            }
        ],
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: xAxis_data
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '东区',
                type: 'bar',
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
                data: seriesCnt.ajhEastCnt
            }, {
                name: '北区',
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: '#91c7ae',
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#91c7ae'
                            }
                        }
                    }
                },
                data: seriesCnt.ajhNorthCnt
            }, {
                name: '南区',
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: '#bda29a',
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#bda29a'
                            }
                        }
                    }
                },
                data: seriesCnt.ajhSouthCnt
            }, {
                name: '西区',
                type: 'bar',
                itemStyle: {
                    normal: {
                        color: '#6e7074',
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#6e7074'
                            }
                        }
                    }
                },
                data: seriesCnt.ajhWestCnt
            }
        ]
    };

    var cusStaChart = echarts.init(document.getElementById("trafficAjhPartwebTrafficFunnelSaleProductCntChart"));
    cusStaChart.setOption(optionCnt);
    window.addEventListener('resize', cusStaChart.resize)

    var optionRate = {
        tooltip: {
            trigger: 'axis',
            axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            },
            formatter: function (params, ticket, callback) {
                var str = (params[1] ? params[1] : params[0]).name + '<br/>' + "销售毛利率:" + '<br/>';
                params.forEach(function (obj) {
                    str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                });
                return str;
            }
        },
        legend: {
            data: ['东区', '北区', '南区', '西区']
        },
        dataZoom: [
            {
                show: true,
                realtime: true,
                //start: 80,
                //end: 0
            }
        ],
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'category',
                data: xAxis_data
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '东区',
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
                data: seriesProfitRate.ajhEastProfitRate
            }, {
                name: '北区',
                type: 'line',
                itemStyle: {
                    normal: {
                        color: '#91c7ae',
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#91c7ae'
                            }
                        }
                    }
                },
                data: seriesProfitRate.ajhNorthProfitRate
            }, {
                name: '南区',
                type: 'line',
                itemStyle: {
                    normal: {
                        color: '#bda29a',
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#bda29a'
                            }
                        }
                    }
                },
                data: seriesProfitRate.ajhSouthProfitRate
            }, {
                name: '西区',
                type: 'line',
                itemStyle: {
                    normal: {
                        color: '#6e7074',
                        label: {
                            show: true,
                            position: 'top',
                            textStyle: {
                                color: '#6e7074'
                            }
                        }
                    }
                },
                data: seriesProfitRate.ajhWestProfitRate
            }
        ]
    };

    var cusStaChart = echarts.init(document.getElementById("trafficAjhPartwebTrafficFunnelSaleProductRateChart"));
    cusStaChart.setOption(optionRate);
    window.addEventListener('resize', cusStaChart.resize)
}

//////////////////////销售利润分析////////////////////////////

