Template.TradePredictByCenterKey.rendered=function(){
    $('.navi-tab').removeClass('active');
    $('#operation').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var autoRun=function(){
    centerKey = Template.currentData().centerKey;
    switch(parseInt(centerKey)){
        case 1:
            $('#shanghaiOperationCenter').addClass('active');
            $('#shanghaiTradePredictByCenterKey').addClass('active');
            $('#operationName').html("上海运营中心")
            break;
        case 12:
            $('#shanghaiTestOperationCenter').addClass('active');
            $('#shanghaiTestTradePredictByCenterKey').addClass('active');
            $('#operationName').html("上海运营中心(流程测试专用)")
            break;
        case 2:
            $('#beijingOperationCenter').addClass('active');
            $('#beijingTradePredictByCenterKey').addClass('active');
            $('#operationName').html("北京运营中心")
            break;
        case 3:
            $('#chengduOperationCenter').addClass('active');
            $('#chengduTradePredictByCenterKey').addClass('active');
            $('#operationName').html("成都运营中心")
            break
        case 4:
            $('#shenzhenOperationCenter').addClass('active');
            $('#shenzhenTradePredictByCenterKey').addClass('active');
            $('#operationName').html("深圳(物流)运营中心")
            break
        case 16:
            $('#shenzhenNewOperationCenter').addClass('active');
            $('#shenzhenNewTradePredictByCenterKey').addClass('active');
            $('#operationName').html("深圳运营中心")
            break
        case 21:
            $('#shenzhenTestOperationCenter').addClass('active');
            $('#shenzhenTestTradePredictByCenterKey').addClass('active');
            $('#operationName').html("深圳运营中心(流程测试专用)")
            break
        case 5:
            $('#tianjinOperationCenter').addClass('active');
            $('#tianjinTradePredictByCenterKey').addClass('active');
            $('#operationName').html("天津运营中心")
            break
        case 6:
            $('#wuhanOperationCenter').addClass('active');
            $('#wuhanTradePredictByCenterKey').addClass('active');
            $('#operationName').html("武汉运营中心")
            break
        case 10:
            $('#changzhouOperationCenter').addClass('active');
            $('#changzhouTradePredictByCenterKey').addClass('active');
            $('#operationName').html("常州运营中心")
    }
    var transformDate = function (date) {
        var dateStrArray = date.split('-');
        return dateStrArray[1] + '/' + dateStrArray[2] + '/' + dateStrArray[0]
    };
    $('.reportRangeTradePredict').daterangepicker({
        "showDropdowns": true,
        "alwaysShowCalendars": true,
        "linkedCalendars": false,
        "minDate": transformDate("2016-07-15"),
        "maxDate": transformDate(new Date().format("yyyy-MM-dd")),
        "autoApply": true,
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
            "firstDay": 1
        },
        "ranges": {
            '昨天': [moment().subtract(1, 'days').toDate(), moment().subtract(1, 'days').toDate()],
            '最近7天': [moment().subtract(6, 'days').toDate(), moment().toDate()],
            '最近30天': [moment().subtract(29, 'days').toDate(), moment().toDate()],
            '本周': [moment().startOf('week').toDate(), moment().endOf('week').toDate()],
            '上周': [moment().subtract(1, 'week').startOf('week').toDate(), moment().subtract(1, 'week').endOf('week').toDate()],
            '本月': [moment().startOf('month').toDate(), moment().endOf('month').toDate()],
            '上个月': [moment().subtract(1, 'month').startOf('month').toDate(), moment().subtract(1, 'month').endOf('month').toDate()],
            '今年': [moment().startOf('year').toDate(), moment().endOf('year').toDate()],
            '去年': [moment().subtract(1, 'year').startOf('year').toDate(), moment().subtract(1, 'year').endOf('year').toDate()]
        }
    }, pickDateRangeCallback);
    var today=new Date().format("yyyy-MM-dd");
    var yesterday=new Date(new Date().getTime()-24*60*60*1000).format("yyyy-MM-dd");
    var topQuery = {
        "today": today,
        "yesterday": yesterday,
        "centerKey":parseInt(centerKey)
    }

    requestURL(dataService+"/operation/getPageTopData",topQuery).done(function(data){
        $(".todayPredictCnt").html(".....");
        $(".yestodayCnt").html(".....");
        $(".yestodayPredictCnt").html(".....");
        $(".yestodayAccuracyRate").html(".....");
        $(".yestodaySubmitCnt").html(".....");
        if(data!=null&&data.length>0){
            data.forEach(function(e){
                if(e.predict_date==today){
                    $(".todayPredictCnt").html(e.predict_num)
                }
                if(e.predict_date==yesterday){
                    $(".yestodayCnt").html(e.arrive_count_num);
                    $(".yestodayPredictCnt").html(e.predict_num);
                    $(".yestodaySubmitCnt").html(e.logistics_trade_count_num);
                    $(".yestodayAccuracyRate").html(parseFloat(e.rate*100).toFixed(2)+"%");
                }

            })
        }

    })
        getValue();
    }
    this.autorun(function(){
        autoRun()
    })




}

function getValue(startDate, endDate) {
    if (startDate == undefined) {
        startDate = new Date(new Date().getTime() - 30 * 24 * 3600 * 1000).format("yyyy-MM-dd");
    }
    if (endDate == undefined) {
        endDate = new Date(new Date().getTime() - 1 * 24 * 3600 * 1000).format("yyyy-MM-dd");
        //endDate = new Date().format("yyyy-MM-dd");
    }
    var query = {
        "startDate": startDate,
        "endDate": endDate,
        "centerKey":parseInt(centerKey)
    }

    requestURL(dataService+"/operation/getOperationData",query).done(function(data){


        predictEchart(data)
        predictTable(data)
    })
}

function pickDateRangeCallback(start, end, label) {
    //console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    $('.dateSelectLabel').html(start.format('YYYY-MM-DD') + ' ~ ' + end.format('YYYY-MM-DD'));
    getValue(start.format('YYYY-MM-DD'), end.format('YYYY-MM-DD'));
}

function predictEchart(data){
    var date=[];
    var arrive_num=[];
    var predict_num=[];
    var logistics_trade_count_num=[];
    var rate=[];
    if(data!=null&&data.length>0){
        data.forEach(function(e){
            date.push(e.predict_date);
            arrive_num.push(e.arrive_count_num);
            predict_num.push(e.predict_num);
            logistics_trade_count_num.push(e.logistics_trade_count_num)
            rate.push((parseFloat(e.rate)*100).toFixed(2)+"")
        })
    }

    var option={
        title: {
            text: '快递到货量历史数据',
            //x: "center",
            //y: "bottom"
        },
        tooltip: {
            trigger: 'axis'
        },
        grid: {
            bottom: '30%'
        },
        legend: {
            data: ['快递订单提交量','实际快递订单到货量', '预测快递订单到货量','预测准确率']
        },
        dataZoom: [
            {
                type: 'slider',
                start: 30,
                end: 100,
                bottom: '10%'
            }
        ],
        xAxis: [
            {
                type: 'category',
                boundaryGap: false,
                data: date.reverse()
            }
        ],
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
        animationDuration: 2000,
        series: [
            {
                name: '快递订单提交量',
                type: 'line',
                label: {
                    normal: {
                        show: true
                    }
                },
                lineStyle: {
                    normal: {
                        type: 'solid'
                    }
                },
                data: logistics_trade_count_num.reverse()
            },
            {
                name: '实际快递订单到货量',
                type: 'line',
                label: {
                    normal: {
                        show: true
                    }
                },
                lineStyle: {
                    normal: {
                        type: 'solid'
                    }
                },
                data: arrive_num.reverse()
            },
            {
                name: '预测准确率',
                type: 'line',
                lineStyle: {
                    normal: {
                        type: 'solid'
                    }
                },
                label: {
                    normal: {
                        show: true,
                        formatter: '{c}%'
                    }
                },
                yAxisIndex: 1,
                itemStyle: {
                    normal: {
                        show: true
                    }
                },
                data: rate.reverse()
            },
            {
                name: '预测快递订单到货量',
                type: 'line',
                lineStyle: {
                    normal: {
                        type: 'solid'
                    }
                },
                label: {
                    normal: {
                        show: true
                    }
                },
                itemStyle: {
                    normal: {show: true}
                },
                data: predict_num.reverse()
            }

        ]

    }

    var echartsDom=echarts.init($("#PredictEchart").get(0))
    echartsDom.setOption(option)
    window.addEventListener("resize",echartsDom.resize)
}

function predictTable(data){
    $(".table").bootstrapTable("destroy").bootstrapTable({
        sortName:'date',
        sortOrder:'desc',
        exportDataType: 'all',
        data:data,
        columns: [{
            field: 'predict_date',
            title: '日期',
            sortable:true
        },{
            field: 'logistics_trade_count_num',
            title: '快递订单提交量',
            sortable:true
        }, {
            field: 'arrive_count_num',
            title: '实际收货量',
            sortable:true
        }, {
            field: 'predict_num',
            title: '预测收货量',
            sortable:true
        },/* {
         field: 'rate',
         title: '准确率',
         sortable:true
         },*/ {
            field: 'rate',
            title: '准确率',
            formatter:function(value,row,index){
                if(row.accuracyRate=="0"){
                    return "0.00%"
                }
                return (parseFloat(row.rate)*100).toFixed(2)+"%";
            }
        }],

    })
}