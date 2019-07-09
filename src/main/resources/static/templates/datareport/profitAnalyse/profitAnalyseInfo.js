/*
Template.profitAnalyseInfo.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#managereport').addClass('active');
    $('#profitAnalyse').addClass('active');

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

    var datePickerOptions = {
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

    $('.webTrafficFunnelDate3').html(endDate);


    $(".webTrafficFunnelDate").show();
    $(".webTrafficFunnelDate2").show();
    $(".webTrafficFunnelDate3").show();

    var dt = $('.desktop-only  .dateSelectLabel').text().replace(/ /g, "").split("~");
    var startDate = dt[0];
    var endDate = dt[1];
    filter.startDate=startDate;
    filter.endDate=endDate;
    wholeFunc(filter);
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        // 获取已激活的标签页的名称
        var activeTab = e.target.hash;
        switch(activeTab) {
            case "#whole":
                wholeFunc(filter);
                break;
            case "#brand":
                brandFunc(filter);
                break;
            case "#version":
                versionFunc(filter);
                break;
            //case "#priceRange":
            //    priceRangeFunc(filter);
            //    break;
        }

    });


    $(".search").click(function(){
        priceRangeFunc(filter)
    })

    $("#brandType").change(function(){
        brandFunc(filter)
    })
    $("#versionType").change(function(){
        versionFunc(filter)
    })
    //$("#priceRangeType").change(function(){
    //    priceRangeFunc(filter)
    //})
};

var filter={};

function pickWebTrafficFunnelDateRangeCallback(start, end, label) {
    var startDate = start.format('YYYY-MM-DD');
    var endDate = end.format('YYYY-MM-DD');
    $('.dateSelectLabel').html(startDate + "~" + endDate);
    filter.startDate=startDate;
    filter.endDate=endDate;
    var activeTab = "#"+$(".tab-content>.active").attr("id");
    switch(activeTab) {
        case "#whole":
            wholeFunc(filter);
            break;
        case "#brand":
            brandFunc(filter);
            break;
        case "#version":
            versionFunc(filter);
            break;
        //case "#priceRange":
        //    priceRangeFunc(filter);
        //    break;
    }
    wholeFunc(filter);
}
//上面的代码都是控制日期选择栏的


//整体
function wholeFunc(filter) {

    //自营业务
    $("#tableCollectZY").hide();
    $("#loadingCollectZY").show();
    var promise = getSelfProfitAnalysisStatistic(filter);
    promise.done(function (ret) {
        $("#tableCollectZY").show();
        $("#loadingCollectZY").hide();

        ret.forEach(function(e){
            e.self_profit_rate= (parseFloat(e.self_profit_rate)*100).toFixed(2)+"%";
        })
        //renderTable
        renderTable(ret,'#tableCollectZY');
    });

    //BD
    $("#tableCollectBD").hide();
    $("#loadingCollectBD").show();
    var promise = getBDProfitAnalysisStatistic(filter);
    promise.done(function (ret) {
        $("#tableCollectBD").show();
        $("#loadingCollectBD").hide();

        ret.forEach(function(e){
            e.BD_profit_rate= (parseFloat(e.BD_profit_rate)*100).toFixed(2)+"%";
        })

        //renderTable
        renderTable(ret,'#tableCollectBD');
    });

    //爱机汇
    $("#tableCollectAJH").hide();
    $("#loadingCollectAJH").show();
    var promise = getAjhProfitAnalysisStatistic(filter);
    promise.done(function (ret) {
        $("#tableCollectAJH").show();
        $("#loadingCollectAJH").hide();

        ret.forEach(function(e){
            e.AJH_profit_rate= (parseFloat(e.AJH_profit_rate)*100).toFixed(2)+"%";
        })

        //renderTable
        renderTable(ret,'#tableCollectAJH');
    });

    //每日回收额对比分析
    $("#dailyReclaimAnalyseMixedChart").hide();
    $("#tablereclaimAnalyseDaily").hide();
    $("#loadingDailyReclaim").show();
    var promise = getDailyReclaimAnalyseStatistic(filter);
    promise.done(function (ret) {
        $("#dailyReclaimAnalyseMixedChart").show();
        $("#tablereclaimAnalyseDaily").show();
        $("#loadingDailyReclaim").hide();
        drawDailyReclaimAnalyseMixedChart(ret);
        ret.forEach(function(e){
            e.reclaimSum=(e.reclaimZY+e.reclaimBD+e.reclaimAJH);
        })
        renderTable(ret,'#tablereclaimAnalyseDaily');
    });

    //每日销售额对比分析
    $("#dailySaleAnalyseMixedChart").hide();
    $("#tablesaleAnalyseDaily").hide();
    $("#loadingDailySale").show();
    var promise = getDailySaleAnalyseStatistic(filter);
    promise.done(function (ret) {
        $("#dailySaleAnalyseMixedChart").show();
        $("#tablesaleAnalyseDaily").show();
        $("#loadingDailySale").hide();
        drawDailySaleAnalyseMixedChart(ret);
        ret.forEach(function(e){
            e.saleSum=(e.saleZY+e.saleBD+e.saleAJH);
        })
        renderTable(ret,'#tablesaleAnalyseDaily');
    });

    //每日毛利额对比分析
    $("#dailyProfitAnalyseMixedChart").hide();
    $("#tableprofitAnalyseDaily").hide();
    $("#loadingDailyProfit").show();
    var promise = getDailyProfitAnalyseStatistic(filter);
    promise.done(function (ret) {
        $("#dailyProfitAnalyseMixedChart").show();
        $("#tableprofitAnalyseDaily").show();
        $("#loadingDailyProfit").hide();
        drawDailyProfitAnalyseMixedChart(ret);
        ret.forEach(function(e){
            e.profitSum=(e.profitZY+e.profitBD+e.profitAJH);
        })
        renderTable(ret,'#tableprofitAnalyseDaily');
    });

    //每日毛利率对比分析
    $("#dailyProfitRateAnalyseMixedChart").hide();
    $("#tableprofitRateAnalyseDaily").hide();
    $("#loadingDailyProfitRate").show();
    var promise = getDailyProfitRateAnalyseStatistic(filter);
    promise.done(function (ret) {
        $("#dailyProfitRateAnalyseMixedChart").show();
        $("#tableprofitRateAnalyseDaily").show();
        $("#loadingDailyProfitRate").hide();
        drawDailyProfitRateAnalyseMixedChart(ret);

        ret.forEach(function(e){
            e.profitRateSum=(parseFloat(e.totalRate)*100).toFixed(2)+"%";//((parseFloat(e.profitRateZY)+parseFloat(e.profitRateBD)+parseFloat(e.profitRateAJH))*100).toFixed(2)+"%";
            e.profitRateZY= (parseFloat(e.profitRateZY)*100).toFixed(2)+"%";
            e.profitRateBD= (parseFloat(e.profitRateBD)*100).toFixed(2)+"%";
            e.profitRateAJH= (parseFloat(e.profitRateAJH)*100).toFixed(2)+"%";
        })

        //renderTable
        renderTable(ret,'#tableprofitRateAnalyseDaily');
    });




    //获取自营业务累计数据统计信息
    function getSelfProfitAnalysisStatistic(filter) {
        //clean parameters
        var query = _.clone(filter);
        var flag = query["dateType"];
        delete query["userId"];
        delete query["sign"];
        delete query["dateType"];
        var dfd = $.Deferred();
        requestURL(dataService + "/datareport/getSelfProfitAnalysisStatistic", query).done(function (ret) {dfd.resolve(ret)});
        return dfd.promise()
    }

    //获取BD累计利润率统计信息
    function getBDProfitAnalysisStatistic(filter) {
        //clean parameters
        var query = _.clone(filter);
        var flag = query["dateType"];
        delete query["userId"];
        delete query["sign"];
        delete query["dateType"];
        var dfd = $.Deferred();
        requestURL(dataService + "/datareport/getBDProfitAnalysisStatistic", query).done(function (ret) {dfd.resolve(ret)});
        return dfd.promise()
    }

    //获取爱机汇累计利润率统计信息
    function getAjhProfitAnalysisStatistic(filter) {
        //clean parameters
        var query = _.clone(filter);
        var flag = query["dateType"];
        delete query["userId"];
        delete query["sign"];
        delete query["dateType"];
        var dfd = $.Deferred();
        requestURL(dataService + "/datareport/getAjhProfitAnalysisStatistic", query).done(function (ret) {dfd.resolve(ret)});
        return dfd.promise()
    }

    //获取每日回收额对比分析数据
    function getDailyReclaimAnalyseStatistic(filter) {
        //clean parameters
        var query = _.clone(filter);
        var flag = query["dateType"];
        delete query["userId"];
        delete query["sign"];
        delete query["dateType"];
        var dfd = $.Deferred();
        requestURL(dataService + "/datareport/getDailyReclaimAnalyseStatistic", query).done(function (ret) {dfd.resolve(ret)});
        return dfd.promise()
    }

    //获取每日销售额对比分析数据
    function getDailySaleAnalyseStatistic(filter) {
        //clean parameters
        var query = _.clone(filter);
        var flag = query["dateType"];
        delete query["userId"];
        delete query["sign"];
        delete query["dateType"];
        var dfd = $.Deferred();
        requestURL(dataService + "/datareport/getDailySaleAnalyseStatistic", query).done(function (ret) {dfd.resolve(ret)});
        return dfd.promise()
    }

    //获取每日毛利额对比分析数据
    function getDailyProfitAnalyseStatistic(filter) {
        //clean parameters
        var query = _.clone(filter);
        var flag = query["dateType"];
        delete query["userId"];
        delete query["sign"];
        delete query["dateType"];
        var dfd = $.Deferred();
        requestURL(dataService + "/datareport/getDailyProfitAnalyseStatistic", query).done(function (ret) {dfd.resolve(ret)});
        return dfd.promise()
    }

    //获取每日毛利率对比分析数据
    function getDailyProfitRateAnalyseStatistic(filter) {
        //clean parameters
        var query = _.clone(filter);
        var flag = query["dateType"];
        delete query["userId"];
        delete query["sign"];
        delete query["dateType"];
        var dfd = $.Deferred();
        requestURL(dataService + "/datareport/getDailyProfitRateAnalyseStatistic", query).done(function (ret) {dfd.resolve(ret)});
        return dfd.promise()
    }

    //整体每日回收额对比分析折线图
    function drawDailyReclaimAnalyseMixedChart(obj) {

        var xAxis_data = [];
        var series = {
            reclaimZY: [],
            reclaimBD: [],
            reclaimAJH:[],
            reclaimSum:[]
        };


        obj.forEach(function (e) {
            xAxis_data.push(e.reclaimDate);
            series.reclaimZY.push(e.reclaimZY);
            series.reclaimBD.push(e.reclaimBD);
            series.reclaimAJH.push(e.reclaimAJH);
            series.reclaimSum.push(e.reclaimZY+e.reclaimBD+e.reclaimAJH);
        });

        var option = {
            title: {
                text: '整体每日回收额对比分析',
                x: "left",
                padding: [0, 0, 0, 50]
                //y:"bottom"
            },
            tooltip: {
                trigger: 'axis',
            },
            legend: {
                data: ['自营业务', 'BD', '爱机汇', '汇总'],
                padding: [25, 0, 0, 0]
            },
            grid: {
                left: '3%',
                right: '4%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    /!*saveAsImage: {}*!/
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
                    name: '自营业务',
                    type: 'line',
                    //stack: '总量',
                    data: series.reclaimZY
                }, {
                    name: 'BD',
                    type: 'line',
                    //stack: '总量',
                    data: series.reclaimBD
                },{
                    name: '爱机汇',
                    type: 'line',
                    //stack: '总量',
                    data: series.reclaimAJH
                },{
                    name: '汇总',
                    type: 'line',
                    //stack: '总量',
                    data: series.reclaimSum
                }
            ]
        };

        var dailyReclaimAnalyseMixedChart = echarts.init(document.getElementById('dailyReclaimAnalyseMixedChart'));
        dailyReclaimAnalyseMixedChart.setOption(option);
        window.addEventListener('resize', dailyReclaimAnalyseMixedChart.resize)
    }

    //整体每日销售额对比分析折线图
    function drawDailySaleAnalyseMixedChart(obj) {

        var xAxis_data = [];
        var series = {
            saleZY: [],
            saleBD: [],
            saleAJH:[],
            saleSum:[]
        };


        obj.forEach(function (e) {
            xAxis_data.push(e.saleDate);
            series.saleZY.push(e.saleZY);
            series.saleBD.push(e.saleBD);
            series.saleAJH.push(e.saleAJH);
            series.saleSum.push(e.saleZY+e.saleBD+e.saleAJH);
        });

        var option = {
            title: {
                text: '整体每日销售额对比分析',
                x: "left",
                padding: [0, 0, 0, 50]
                //y:"bottom"
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['自营业务', 'BD', '爱机汇', '汇总'],
                padding: [25, 0, 0, 0]
            },
            grid: {
                left: '3%',
                right: '4%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    /!*saveAsImage: {}*!/
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
                    name: '自营业务',
                    type: 'line',
                    //stack: '总量',
                    data: series.saleZY
                }, {
                    name: 'BD',
                    type: 'line',
                    //stack: '总量',
                    data: series.saleBD
                },{
                    name: '爱机汇',
                    type: 'line',
                    //stack: '总量',
                    data: series.saleAJH
                },{
                    name: '汇总',
                    type: 'line',
                    //stack: '总量',
                    data: series.saleSum
                }
            ]
        };
        var dailySaleAnalyseMixedChart = echarts.init(document.getElementById('dailySaleAnalyseMixedChart'));
        dailySaleAnalyseMixedChart.setOption(option);
        window.addEventListener('resize', dailySaleAnalyseMixedChart.resize)
    }

    //整体每日毛利额对比分析折线图
    function drawDailyProfitAnalyseMixedChart(obj) {

        var xAxis_data = [];
        var series = {
            profitZY: [],
            profitBD: [],
            profitAJH:[],
            profitSum:[]
        };


        obj.forEach(function (e) {
            xAxis_data.push(e.profitDate);
            series.profitZY.push(e.profitZY);
            series.profitBD.push(e.profitBD);
            series.profitAJH.push(e.profitAJH);
            series.profitSum.push(e.profitZY+e.profitBD+e.profitAJH);
        });

        var option = {
            title: {
                text: '整体每日毛利额对比分析',
                x: "left",
                padding: [0, 0, 0, 50]
                //y:"bottom"
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data: ['自营业务', 'BD', '爱机汇', '汇总'],
                padding: [25, 0, 0, 0]
            },
            grid: {
                left: '3%',
                right: '4%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    /!*saveAsImage: {}*!/
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
                    name: '自营业务',
                    type: 'line',
                    //stack: '总量',
                    data: series.profitZY
                }, {
                    name: 'BD',
                    type: 'line',
                    //stack: '总量',
                    data: series.profitBD
                },{
                    name: '爱机汇',
                    type: 'line',
                    //stack: '总量',
                    data: series.profitAJH
                },{
                    name: '汇总',
                    type: 'line',
                    //stack: '总量',
                    data: series.profitSum
                }
            ]
        };
        var dailyProfitAnalyseMixedChart = echarts.init(document.getElementById('dailyProfitAnalyseMixedChart'));
        dailyProfitAnalyseMixedChart.setOption(option);
        window.addEventListener('resize', dailyProfitAnalyseMixedChart.resize)
    }

    //整体每日毛利率对比分析折线图
    function drawDailyProfitRateAnalyseMixedChart(obj) {

        var xAxis_data = [];
        var series = {
            profitRateZY: [],
            profitRateBD: [],
            profitRateAJH:[],
            profitRateSum:[]
        };

        obj.forEach(function (e) {
            xAxis_data.push(e.profitRateDate);
            series.profitRateZY.push((parseFloat(e.profitRateZY)*100).toFixed(2));
            series.profitRateBD.push((parseFloat(e.profitRateBD)*100).toFixed(2));
            series.profitRateAJH.push((parseFloat(e.profitRateAJH)*100).toFixed(2));
            series.profitRateSum.push((parseFloat(e.totalRate)*100).toFixed(2));
            //series.profitRateSum.push((parseFloat(e.profitRateZY)*100+parseFloat(e.profitRateBD)*100+parseFloat(e.profitRateAJH)*100).toFixed(2));
        });

        var option = {
            title: {
                text: '整体每日毛利率对比分析',
                x: "left",
                padding: [0, 0, 0, 50]
                //y:"bottom"
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params, ticket, callback) {
                    var str = (params[1] ? params[1] : params[0]).name + '<br/>';
                    params.forEach(function (obj) {
                        str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                    });
                    return str;
                }
            },
            legend: {
                data: ['自营业务', 'BD', '爱机汇', '汇总'],
                padding: [25, 0, 0, 0]
            },
            grid: {
                left: '3%',
                right: '4%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    /!*saveAsImage: {}*!/
                }
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
                        formatter: function (value) {
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
                    name: '自营业务',
                    type: 'line',
                    //stack: '总量',
                    data: series.profitRateZY
                }, {
                    name: 'BD',
                    type: 'line',
                    //stack: '总量',
                    data: series.profitRateBD
                },{
                    name: '爱机汇',
                    type: 'line',
                    //stack: '总量',
                    data: series.profitRateAJH
                },{
                    name: '汇总',
                    type: 'line',
                    //stack: '总量',
                    data: series.profitRateSum
                }
            ]
        };
        var dailyProfitRateAnalyseMixedChart = echarts.init(document.getElementById('dailyProfitRateAnalyseMixedChart'));
        dailyProfitRateAnalyseMixedChart.setOption(option);
        window.addEventListener('resize', dailyProfitRateAnalyseMixedChart.resize)
    }


    //渲染BootStrap Table
    function renderTable(data,tableName) {
        data=data.reverse();
        $(tableName).bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data:data,
            //是否分页
            pagination:true,
            //是否显示查询框
            search: true,
            //是否显示导出按钮
            showExport: true,
            //按钮位置
            buttonsAlign:"right"
        });
    }
}


//品牌
function brandFunc(filter){
    var columnsBrand = [
        {
            field: 'brand',
            title: '品牌',
            valign:"middle",
            align:"center",
            sortable:true
        },
        {
            field: 'brand_reclaim',
            title: '累计回收额',
            valign:"middle",
            align:"center",
            sortable:true
        },
        {
            field: 'brand_item_quotation_price_num',
            title: '累计销售额',
            valign:"middle",
            align:"center",
            sortable:true
        },
        {
            field: 'brand_profit',
            title: '累计毛利额',
            valign:"middle",
            align:"center",
            sortable:true
        },
        {
            field: 'brand_rate',
            title: '累计毛利率',
            valign:"middle",
            align:"center",
            sortable:true,
            formatter:function(value){
                return (value/100.0).toFixed(2)+"%"
            }
        }
    ]
    $("#brandLoading").show();
    $("#brandContent").hide();
    filter.type=$("#brandType").val();

    requestURL(dataService+"/datareport/getBrandTableStatisticByTag", filter).done(function(ret){
        $("#brandLoading").hide();
        $("#brandContent").show();

        var tempData=dataProcess(ret);
        //_.sortBy(tempData[2], 'brand_item_quotation_price_num'):按照list的某个属性进行排序
        drawTable(_.sortBy(tempData[2], 'brand_item_quotation_price_num'),columnsBrand,"#brandSelfTable");
        drawTable(_.sortBy(tempData[1], 'brand_item_quotation_price_num'),columnsBrand,"#brandBDTable");
        drawTable(_.sortBy(tempData[0], 'brand_item_quotation_price_num'),columnsBrand,"#brandAjhTable");
    });

    var dataProcess = function(ret){
        var dataList=[];
        var amountObj = _.groupBy(ret,function(obj){return obj.amount});
            var AJHObjData=[];
            var BDObjData=[];
            var SelfObjData=[];
        for(var key in amountObj) {
            var AJHObj = {
                brand: "-",
                brand_reclaim: "-",
                brand_item_quotation_price_num: "-",
                brand_profit: "-",
                brand_rate: "-"
            };

            var BDObj = {
                brand: "-",
                brand_reclaim: "-",
                brand_item_quotation_price_num: "-",
                brand_profit: "-",
                brand_rate: "-"
            };

            var SelfObj = {
                brand: "-",
                brand_reclaim: "-",
                brand_item_quotation_price_num: "-",
                brand_profit: "-",
                brand_rate: "-"
            };
            amountObj[key].forEach(function (obj) {
                if (obj.tag == "爱机汇") {
                    AJHObj.brand = obj.name;
                    AJHObj.brand_reclaim = parseInt(obj.amount);
                    AJHObj.brand_item_quotation_price_num = parseInt(obj.item_quotation_price_num);
                    AJHObj.brand_profit = parseInt(obj.profit);
                    AJHObj.brand_rate = parseInt(obj.rate*10000);
                    AJHObjData.push(AJHObj);
                }else if (obj.tag == "主营") {
                    SelfObj.brand = obj.name;
                    SelfObj.brand_reclaim = parseInt(obj.amount);
                    SelfObj.brand_item_quotation_price_num = parseInt(obj.item_quotation_price_num);
                    SelfObj.brand_profit = parseInt(obj.profit);
                    SelfObj.brand_rate = parseInt(obj.rate*10000);
                    SelfObjData.push(SelfObj);
                }else if (obj.tag == "BD") {
                    BDObj.brand = obj.name;
                    BDObj.brand_reclaim = parseInt(obj.amount);
                    BDObj.brand_item_quotation_price_num = parseInt(obj.item_quotation_price_num);
                    BDObj.brand_profit = parseInt(obj.profit);
                    BDObj.brand_rate = parseInt(obj.rate*10000);
                    BDObjData.push(BDObj);
                }
            });

            dataList.push(AJHObjData);
            dataList.push(BDObjData);
            dataList.push(SelfObjData);
        }
            return dataList
    };

    var columnsBrandDaily = [
        {
            field: 'date',
            title: '日期',
            valign:"middle",
            align:"center",
            sortable:true
        },
        {
            field: 'brand',
            title: '品牌',
            valign:"middle",
            align:"center",
            sortable:true
        },
        {
            field: 'Self',
            title: '自营业务',
            valign:"middle",
            align:"center",
            sortable:true
        },
        {
            field: 'BD',
            title: 'BD',
            valign:"middle",
            align:"center",
            sortable:true
        },
        {
            field: 'AJH',
            title: '爱机汇',
            valign:"middle",
            align:"center",
            sortable:true
        },
        {
            field: 'Sum',
            title: '汇总',
            valign:"middle",
            align:"center",
            sortable:true
        }
    ]

    //每日各品牌数据
    /!*requestURL(dataService+"/datareport/getBrandDailyStatistic",filter).done(function(ret){
        $("#brandLoading").hide();
        $("#brandContent").show();
        var dataDailyList = dataProcessBrandDaily(ret);
        drawChart(dataDailyList[0],"每日品牌回收额Top10对比","brandReclaimChart");
        drawTable(dataDailyList[0],columnsBrandDaily,"#brandReclaimTable");


        drawChart(dataDailyList[1],"每日品牌销售额Top10对比","brandSaleChart");
        drawTable(dataDailyList[1],columnsBrandDaily,"#brandSaleTable");


        drawChart(dataDailyList[2],"每日品牌毛利额Top10对比","brandProfitChart");
        drawTable(dataDailyList[2],columnsBrandDaily,"#brandProfitTable");


        /!*drawChart(ret,"每日品牌毛利率Top10对比","brandProfitRateChart");*!/
        drawTable(dataDailyList[3],columnsBrandDaily,"#brandProfitRateTable");
    });*!/


    //统一在后端拿到所有的数据，然后在这里进行分别处理，增加后端代码的复用性；
    var dataProcessBrandDaily = function(ret){
        var dataList=[];
        //按天数分组
        var dateObj = _.groupBy(ret,function(obj){return obj.date});
        var ReclaimObjData=[];
        var SaleObjData=[];
        var ProfitObjData=[];
        var ProfitRateObjData=[];
        for(var key in dateObj) {
            //按品牌分组
            var nameData=_.groupBy(dateObj[key],function(et){return et.name});
            for(var nameKey in nameData){
                var ReclaimObj = {
                    date: "-",
                    brand: "-",
                    Self: 0,
                    BD: 0,
                    AJH: 0,
                    Sum: 0
                };

                var SaleObj = {
                    date: "-",
                    brand: "-",
                    Self: 0,
                    BD: 0,
                    AJH: 0,
                    Sum: 0
                };

                var ProfitObj = {
                    date: "-",
                    brand: "-",
                    Self: 0,
                    BD: 0,
                    AJH: 0,
                    Sum: 0
                };

                var ProfitRateObj = {
                    date: "-",
                    brand: "-",
                    Self: 0,
                    BD: 0,
                    AJH: 0,
                    Sum: 0
                };
                var profitTmp= 0,qutationTmp=0;
                nameData[nameKey].forEach(function(tempObj){
                    profitTmp+= parseFloat(tempObj.profit);
                    qutationTmp+= parseFloat(tempObj.item_quotation_price_num);
                    ReclaimObj.date=tempObj.date;
                    SaleObj.date=tempObj.date;
                    ProfitObj.date=tempObj.date;
                    ProfitRateObj.date=tempObj.date;
                    ReclaimObj.brand=tempObj.name;
                    SaleObj.brand=tempObj.name;
                    ProfitObj.brand=tempObj.name;
                    ProfitRateObj.brand=tempObj.name;
                    if (tempObj.tag == "爱机汇") {
                        ReclaimObj.AJH = parseInt(tempObj.amount);
                        SaleObj.AJH = parseInt(tempObj.item_quotation_price_num);
                        ProfitObj.AJH = parseInt(tempObj.profit);
                        ProfitRateObj.AJH =parseInt((tempObj.rate*10000));
                    }else if (tempObj.tag == "主营") {
                        ReclaimObj.Self =parseInt(tempObj.amount);
                        SaleObj.Self = parseInt(tempObj.item_quotation_price_num);
                        ProfitObj.Self = parseInt(tempObj.profit);
                        ProfitRateObj.Self =parseInt((tempObj.rate*10000));
                    }else if (tempObj.tag == "BD") {
                        ReclaimObj.BD = parseInt(tempObj.amount);
                        SaleObj.BD = parseInt(tempObj.item_quotation_price_num);
                        ProfitObj.BD = parseInt(tempObj.profit);
                        ProfitRateObj.BD =parseInt((tempObj.rate*10000));
                    }


                });
                ReclaimObjData.push(ReclaimObj);
                SaleObjData.push(SaleObj);
                ProfitObjData.push(ProfitObj);
                ProfitRateObjData.push(ProfitRateObj);

                ReclaimObj.Sum=ReclaimObj.AJH + ReclaimObj.Self + ReclaimObj.BD;
                SaleObj.Sum=SaleObj.AJH + SaleObj.Self + SaleObj.BD;
                ProfitObj.Sum=ProfitObj.AJH + ProfitObj.Self + ProfitObj.BD;
                //ProfitRateObj.Sum=((ProfitRateObj.AJH + ProfitRateObj.Self + ProfitRateObj.BD)/100.0);
                //console.log(profitTmp+"===="+qutationTmp);
                ProfitRateObj.Sum=(100.0*profitTmp/qutationTmp);//.toFixed(2);
                ProfitRateObj.AJH = (ProfitRateObj.AJH/100.0);
                ProfitRateObj.Self = (ProfitRateObj.Self/100.0);
                ProfitRateObj.BD = (ProfitRateObj.BD/100.0);
            }
        }
        dataList.push(ReclaimObjData);
        dataList.push(SaleObjData);
        dataList.push(ProfitObjData);
        dataList.push(ProfitRateObjData);
        return dataList
    };


    //根据日期把累计数据进行统计出
    function total(data,dt){
        //console.log(data)
        var Self=0,BD= 0,AJH= 0,Sum=0;
        data.forEach(function(e){
            switch(e.date){
                case dt:
                    Self+= e.Self;
                    BD+= e.BD;
                    AJH+= e.AJH;
                    Sum+= e.Sum;
                    break;
            }
        });
        return [Self,BD,AJH,Sum];
    }


    var drawChart = function(data,title,id){
        var xAxis_data = [];
        var series = {
            Self: [],
            BD: [],
            AJH: [],
            Sum: []
        };
        var dt="";
        if(id=="brandProfitRateChart"){
            /!*data.forEach(function (e) {
                if(dt != e.date){
                    xAxis_data.push(e.date);
                    series.Self.push((total(data,e.date)[0]).toFixed(2));
                    series.BD.push((total(data,e.date)[1]).toFixed(2));
                    series.AJH.push((total(data,e.date)[2]).toFixed(2));
                    series.Sum.push((total(data,e.date)[3]).toFixed(2));
                    dt= e.date;
                }
            });*!/
            //console.log(data)
            var dateObj = _.groupBy(data,function(obj){return obj.date});
            for(var key in dateObj){
                var zyProfit= 0,zyAmount= 0,ajhProfit= 0,ajhAmount= 0,bdProfit= 0,bdAmount= 0,totalProfit= 0,totalAmount=0;
                xAxis_data.push(key);
                dateObj[key].forEach(function(ele){
                    if(ele.tag=="主营"){
                        zyProfit+=parseFloat(ele.profit)
                        zyAmount+=parseFloat(ele.item_quotation_price_num)
                    }else if(ele.tag=="BD"){
                        bdProfit+=parseFloat(ele.profit)
                        bdAmount+=parseFloat(ele.item_quotation_price_num)
                    }else if(ele.tag=="爱机汇"){
                        ajhProfit+=parseFloat(ele.profit)
                        ajhAmount+=parseFloat(ele.item_quotation_price_num)
                    }
                    totalProfit+=parseFloat(ele.profit)
                    totalAmount+=parseFloat(ele.item_quotation_price_num)
                })

                series.Self.push(zyAmount==0?NaN:(100.0*zyProfit/zyAmount).toFixed(2));
                series.BD.push(bdAmount==0?NaN:(100.0*bdProfit/bdAmount).toFixed(2));
                series.AJH.push(ajhAmount==0?NaN:(100.0*ajhProfit/ajhAmount).toFixed(2));
                series.Sum.push(totalAmount==0?NaN:(100.0*totalProfit/totalAmount).toFixed(2));
            }
        }else {
            data.forEach(function (e) {
                if(dt != e.date){
                    xAxis_data.push(e.date);
                    series.Self.push(total(data,e.date)[0]);
                    series.BD.push(total(data,e.date)[1]);
                    series.AJH.push(total(data,e.date)[2]);
                    series.Sum.push(total(data,e.date)[3]);
                    dt= e.date;
                }
            });
        }

        console.log(series)
        var option = {
            title: {
                text:title,
                x: "left",
                padding: [0, 0, 0, 50]
                //y: "bottom"
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter:function(params){
                    var str = params[0].name + '<br/>';
                    params.forEach(function(obj){
                        //通过id判断折线图提示数据是否加%
                        if( id == "brandProfitRateChart"){
                            str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                        }else{
                            str += obj.seriesName + ' : ' + obj.value + '<br/>'
                        }
                    });
                    return str;
                }
            },
            legend: {
                data: ['自营业务', 'BD','爱机汇','汇总' ],
                padding:[30,0,0,0],
            },
            grid: {
                top:isMobile()?100:50,
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
                    type: 'value',
                    axisLabel:{
                        formatter: '{value}'
                    }
                },
                {
                    type: 'value',
                    axisLabel:{
                        formatter: '{value}%'
                    }
                }
            ],
            series: [
                {
                    name: '自营业务',
                    type: 'bar',
                    data: series.Self
                }, {
                    name: 'BD',
                    type: 'bar',
                    data: series.BD
                },
                {
                    name: '爱机汇',
                    type: 'bar',
                    data: series.AJH
                }, {
                    name: '汇总',
                    type: 'bar',
                    data: series.Sum
                }
            ]
        };
        var chart = echarts.init(document.getElementById(id));
        chart.setOption(option);
        window.addEventListener('resize', chart.resize)
    };

    var drawTable = function(data,columns,id){

        //根据传入的id是#brandProfitRateTable来将毛利率的表格数据加上%
        if(id == "#brandProfitRateTable"){
            data.forEach(function(obj){
                obj.AJH = obj.AJH + '%';
                obj.BD = obj.BD + '%';
                obj.Self = obj.Self + '%';
                obj.Sum = obj.Sum.toFixed(2) + '%';
            });
        }

        var tempData = data.reverse();

        $(id).bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            pagination: true,
            data: tempData,
            columns: columns
        });
    };
}


//型号
function versionFunc(filter){
    var columnsVersion = [
        {
            field: 'version',
            title: '型号',
            valign:"middle",
            align:"center",
            sortable:true
        },
        {
            field: 'version_reclaim',
            title: '累计回收额',
            valign:"middle",
            align:"center",
            sortable:true
        },
        {
            field: 'version_item_quotation_price_num',
            title: '累计销售额',
            valign:"middle",
            align:"center",
            sortable:true
        },
        {
            field: 'version_profit',
            title: '累计毛利额',
            valign:"middle",
            align:"center",
            sortable:true,
            formatter:function(value,row,index){
                return (value/100.0).toFixed(2)
            }
        },
        {
            field: 'version_rate',
            title: '累计毛利率',
            valign:"middle",
            align:"center",
            sortable:true,
            formatter:function(value,row,index){
                return (value/100.0).toFixed(2)+"%"
            }
        }
    ]
    $("#versionLoading").show();
    $("#versionContent").hide();
    filter.type=$("#versionType").val();


    requestURL(dataService+"/datareport/getVersionTableStatisticByTag", filter).done(function(ret){
        $("#versionLoading").hide();
        $("#versionContent").show();

        var tempData = dataProcessVersion(ret);
        drawTable(_.sortBy(tempData[2], 'version_item_quotation_price_num'),columnsVersion,"#versionSelfTable");
        drawTable(_.sortBy(tempData[1], 'version_item_quotation_price_num'),columnsVersion,"#versionBDTable");
        drawTable(_.sortBy(tempData[0], 'version_item_quotation_price_num'),columnsVersion,"#versionAjhTable");
    });

    var dataProcessVersion = function(ret){
        var dataList=[];
        var reclaimObj = _.groupBy(ret,function(obj){return obj.amount});
        var AJHObjData=[];
        var BDObjData=[];
        var SelfObjData=[];
        for(var key in reclaimObj) {
            var AJHObj = {
                version: "-",
                version_reclaim: "-",
                version_item_quotation_price_num: "-",
                version_profit: "-",
                version_rate: "-"
            }

            var BDObj = {
                version: "-",
                version_reclaim: "-",
                version_item_quotation_price_num: "-",
                version_profit: "-",
                version_rate: "-"
            }

            var SelfObj = {
                version: "-",
                version_reclaim: "-",
                version_item_quotation_price_num: "-",
                version_profit: "-",
                version_rate: "-"
            }
            reclaimObj[key].forEach(function (obj) {
                if (obj.tag == "爱机汇") {
                    AJHObj.version = obj.name;
                    AJHObj.version_reclaim = parseInt(obj.amount);
                    AJHObj.version_item_quotation_price_num = parseInt(obj.item_quotation_price_num);
                    AJHObj.version_profit = parseInt(obj.profit*100);
                    AJHObj.version_rate = parseInt(obj.rate*10000);
                    AJHObjData.push(AJHObj);
                }else if (obj.tag == "主营") {
                    SelfObj.version = obj.name;
                    SelfObj.version_reclaim = parseInt(obj.amount);
                    SelfObj.version_item_quotation_price_num = parseInt(obj.item_quotation_price_num);
                    SelfObj.version_profit = parseInt(obj.profit*100);
                    SelfObj.version_rate = parseInt(obj.rate*10000);
                    SelfObjData.push(SelfObj);
                }else if (obj.tag == "BD") {
                    BDObj.version = obj.name;
                    BDObj.version_reclaim = parseInt(obj.amount);
                    BDObj.version_item_quotation_price_num = parseInt(obj.item_quotation_price_num);
                    BDObj.version_profit = parseInt(obj.profit*100);
                    BDObj.version_rate = parseInt(obj.rate*10000);
                    BDObjData.push(BDObj);
                }
            });

            dataList.push(AJHObjData);
            dataList.push(BDObjData);
            dataList.push(SelfObjData);
        }
        return dataList
    };



    var columnsDaily = [
        {
            field: 'date',
            title: '日期',
            valign:"middle",
            align:"center",
            sortable:true
        },
        {
            field: 'version',
            title: '型号',
            valign:"middle",
            align:"center",
            sortable:true
        },
        {
            field: 'Self',
            title: '自营业务',
            valign:"middle",
            align:"center",
            sortable:true
        },
        {
            field: 'BD',
            title: 'BD',
            valign:"middle",
            align:"center",
            sortable:true
        },
        {
            field: 'AJH',
            title: '爱机汇',
            valign:"middle",
            align:"center",
            sortable:true
        },
        {
            field: 'Sum',
            title: '汇总',
            valign:"middle",
            align:"center",
            sortable:true
        }
    ]

    //每日各型号数据
    /!*requestURL(dataService+"/datareport/getVersionDailyStatistic",filter).done(function(ret){
        $("#versionLoading").hide();
        $("#versionContent").show();
        var dataDailyList = dataProcessDaily(ret);
        drawChart(dataDailyList[0],"每日各型号回收额对比","versionReclaimChart");
        drawTable(dataDailyList[0],columnsDaily,"#versionReclaimTable");

        drawChart(dataDailyList[1],"每日各型号销售额对比","versionSaleChart");
        drawTable(dataDailyList[1],columnsDaily,"#versionSaleTable");

        drawChart(dataDailyList[2],"每日各型号毛利额对比","versionProfitChart");
        drawTable(dataDailyList[2],columnsDaily,"#versionProfitTable");

       /!* drawChart(ret,"每日各型号毛利率对比","versionProfitRateChart");*!/
        drawTable(dataDailyList[3],columnsDaily,"#versionProfitRateTable");
    });*!/

    var dataProcessDaily = function(ret){
        var dataList=[];
        //按天数分组
        var dateObj = _.groupBy(ret,function(obj){return obj.date})
        var ReclaimObjData=[];
        var SaleObjData=[];
        var ProfitObjData=[];
        var ProfitRateObjData=[];
        for(var key in dateObj) {
            //按型号分组
            var nameData=_.groupBy(dateObj[key],function(et){return et.name});
            for(var nameKey in nameData){
                var ReclaimObj = {
                    date: "-",
                    version: "-",
                    Self: 0,
                    BD: 0,
                    AJH: 0,
                    Sum: 0
                }

                var SaleObj = {
                    date: "-",
                    version: "-",
                    Self: 0,
                    BD: 0,
                    AJH: 0,
                    Sum: 0
                }

                var ProfitObj = {
                    date: "-",
                    version: "-",
                    Self: 0,
                    BD: 0,
                    AJH: 0,
                    Sum: 0
                }

                var ProfitRateObj = {
                    date: "-",
                    brand: "-",
                    Self: 0,
                    BD: 0,
                    AJH: 0,
                    Sum: 0
                }
                var profitTmp= 0,qutationTmp=0;
                nameData[nameKey].forEach(function(tempObj){
                    profitTmp+= parseFloat(tempObj.profit);
                    qutationTmp+= parseFloat(tempObj.item_quotation_price_num);
                    ReclaimObj.date=tempObj.date;
                    SaleObj.date=tempObj.date;
                    ProfitObj.date=tempObj.date;
                    ProfitRateObj.date=tempObj.date;
                    ReclaimObj.version=tempObj.name;
                    SaleObj.version=tempObj.name;
                    ProfitObj.version=tempObj.name;
                    ProfitRateObj.version=tempObj.name;
                    if (tempObj.tag == "爱机汇") {
                        ReclaimObj.AJH = parseInt(tempObj.amount);
                        SaleObj.AJH = parseInt(tempObj.item_quotation_price_num);
                        ProfitObj.AJH = parseInt(tempObj.profit);
                        ProfitRateObj.AJH =parseInt((tempObj.rate*10000));
                    }else if (tempObj.tag == "主营") {
                        ReclaimObj.Self =parseInt(tempObj.amount);
                        SaleObj.Self = parseInt(tempObj.item_quotation_price_num);
                        ProfitObj.Self = parseInt(tempObj.profit);
                        ProfitRateObj.Self =parseInt((tempObj.rate*10000));
                    }else if (tempObj.tag == "BD") {
                        ReclaimObj.BD = parseInt(tempObj.amount);
                        SaleObj.BD = parseInt(tempObj.item_quotation_price_num);
                        ProfitObj.BD = parseInt(tempObj.profit);
                        ProfitRateObj.BD =parseInt((tempObj.rate*10000));
                    }
                })
                ReclaimObjData.push(ReclaimObj);
                SaleObjData.push(SaleObj);
                ProfitObjData.push(ProfitObj);
                ProfitRateObjData.push(ProfitRateObj);

                ReclaimObj.Sum=ReclaimObj.AJH + ReclaimObj.Self + ReclaimObj.BD;
                SaleObj.Sum=SaleObj.AJH + SaleObj.Self + SaleObj.BD;
                ProfitObj.Sum=ProfitObj.AJH + ProfitObj.Self + ProfitObj.BD;
                //ProfitRateObj.Sum=((ProfitRateObj.AJH + ProfitRateObj.Self + ProfitRateObj.BD)/100.0);
                ProfitRateObj.Sum=((100.0*profitTmp/qutationTmp));
                ProfitRateObj.AJH = (ProfitRateObj.AJH/100.0);
                ProfitRateObj.Self = (ProfitRateObj.Self/100.0);
                ProfitRateObj.BD = (ProfitRateObj.BD/100.0);

            }
        }
        dataList.push(ReclaimObjData);
        dataList.push(SaleObjData);
        dataList.push(ProfitObjData);
        dataList.push(ProfitRateObjData);
        return dataList
    };


    //根据日期把累计数据进行统计出
    function total(data,dt){

        var Self=0,BD= 0,AJH= 0,Sum=0;
        data.forEach(function(e){
            switch(e.date){
                case dt:
                    Self+= e.Self;
                    BD+= e.BD;
                    AJH+= e.AJH;
                    Sum+= e.Sum;
                    break;
            }
        });
        return [Self,BD,AJH,Sum];
    }

    var drawChart = function(data,title,id){


        var xAxis_data = [];
        var series = {
            Self: [],
            BD: [],
            AJH: [],
            Sum: []
        };
        var dt="";
        if(id=="versionProfitRateChart"){
            /!*data.forEach(function (e) {
                if(dt != e.date){
                    xAxis_data.push(e.date);
                    series.Self.push((total(data,e.date)[0]).toFixed(2));
                    series.BD.push((total(data,e.date)[1]).toFixed(2));
                    series.AJH.push((total(data,e.date)[2]).toFixed(2));
                    series.Sum.push((total(data,e.date)[3]).toFixed(2));
                    dt= e.date;
                }
            });*!/
            var dateObj = _.groupBy(data,function(obj){return obj.date});
            for(var key in dateObj) {
                var zyProfit = 0, zyAmount = 0, ajhProfit = 0, ajhAmount = 0, bdProfit = 0, bdAmount = 0, totalProfit = 0, totalAmount = 0;
                xAxis_data.push(key);
                dateObj[key].forEach(function (ele) {
                    if (ele.tag == "主营") {
                        zyProfit += parseFloat(ele.profit)
                        zyAmount += parseFloat(ele.item_quotation_price_num)
                    } else if (ele.tag == "BD") {
                        bdProfit += parseFloat(ele.profit)
                        bdAmount += parseFloat(ele.item_quotation_price_num)
                    } else if (ele.tag == "爱机汇") {
                        ajhProfit += parseFloat(ele.profit)
                        ajhAmount += parseFloat(ele.item_quotation_price_num)
                    }
                    totalProfit += parseFloat(ele.profit)
                    totalAmount += parseFloat(ele.item_quotation_price_num)
                })
                series.Self.push(zyAmount==0?NaN:(100.0 * zyProfit / zyAmount).toFixed(2));
                series.BD.push(bdAmount==0?NaN:(100.0 * bdProfit / bdAmount).toFixed(2));
                series.AJH.push(ajhAmount==0?NaN:(100.0 * ajhProfit / ajhAmount).toFixed(2));
                series.Sum.push(totalAmount==0?NaN:(100.0 * totalProfit / totalAmount).toFixed(2));
            }
        }else {
            data.forEach(function (e) {
                if(dt != e.date){
                    xAxis_data.push(e.date);
                    series.Self.push(total(data,e.date)[0]);
                    series.BD.push(total(data,e.date)[1]);
                    series.AJH.push(total(data,e.date)[2]);
                    series.Sum.push(total(data,e.date)[3]);
                    dt= e.date;
                }
            });
        }

        var option = {
            title: {
                text:title,
                x: "left",
                padding: [0, 0, 0, 50]
                //y: "bottom"
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter:function(params){
                    var str = params[0].name + '<br/>';
                    params.forEach(function(obj){
                        if(id == "versionProfitRateChart"){
                            str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                        }else{
                            str += obj.seriesName + ' : ' + obj.value + '<br/>'
                        }
                    });
                    return str;
                }
            },
            legend: {
                data: ['自营业务', 'BD','爱机汇','汇总' ],
                padding:[30,0,0,0],
            },
            grid: {
                top:isMobile()?100:50,
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
                    type: 'value',
                    axisLabel:{
                        formatter: '{value}'
                    }
                },
                {
                    type: 'value',
                    axisLabel:{
                        formatter: '{value}%'
                    }
                }
            ],
            series: [
                {
                    name: '自营业务',
                    type: 'bar',
                    data: series.Self
                }, {
                    name: 'BD',
                    type: 'bar',
                    data: series.BD
                },
                {
                    name: '爱机汇',
                    type: 'bar',
                    data: series.AJH
                }, {
                    name: '汇总',
                    type: 'bar',
                    data: series.Sum
                }
            ]
        };
        var chart = echarts.init(document.getElementById(id));
        chart.setOption(option);
        window.addEventListener('resize', chart.resize);
    }

    var drawTable = function(data,columns,id){
        if(id == "#versionProfitRateTable"){
            data.forEach(function(obj){
                obj.AJH = obj.AJH + '%';
                obj.BD = obj.BD + '%';
                obj.Self = obj.Self + '%';
                obj.Sum = obj.Sum.toFixed(2) + '%';
            });
        }

        var tempData = data.reverse();
        $(id).bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            pagination: true,
            data: tempData,
            columns: columns
        });
    }

}









*/
