/**
 * Created by Howard on 2016/11/16.
 */
Template.tradePredictRM.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#datareport').addClass('active');
    $('#Trade_Predict').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var dateGap = -14;
    var endDate = new Date().getNewDate(-1);
    var startDate = new Date(endDate).getNewDate(dateGap);


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
    var data = [];

    $(".startDateSelectLabel").html(startDate + "~" + endDate);
    $('.marketingStartDatePicker').daterangepicker(datePickerOptions, pickStartDateRangeCallback);
    // renderFilterOptions();
    var filter = getSelectedFilter();
    initalize(filter);
    function pickStartDateRangeCallback(start, end, label) {
        console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
        var sdt = start.format('YYYY-MM-DD');
        var edt = end.format('YYYY-MM-DD');
        $('.startDateSelectLabel').html(sdt + "~" + edt);
    }
    function initalize(filter) {
        var query = _.clone(filter);
        var promise0 = getDailyData(query);
        promise0.done(function (ret) {
            processData(ret)
        });
    }

    function processData(asyncdata) {
        var prepared = {
            "trade_create_date":[],
            "trade_submit":[],
            "trade_receive":[],
            "trade_ratio":[],
            "jd_ratio":[],
            "ajh_ratio":[],
            "xiaomi_ratio":[],
            "self_ratio":[]
        };
        var parsed = [];
        var endDate = moment().format('YYYY-MM-DD');
        var startDate = moment().subtract(7,'d').format('YYYY-MM-DD');

        var query = {
            "startDate":startDate,
            "endDate":endDate
        };
        requestURL(dataService+"/operationCenter/tradeStats",query).done(function (ret) {
            var jdArray = JSLINQ(ret).Where(function (item) { return item.trade_source_type_key == 48 || item.trade_source_type_key == 52 })
            var xmArray = JSLINQ(ret).Where(function (item) { return item.trade_source_type_key == 61 })
            var ajhArray = JSLINQ(ret).Where(function (item) {
                return item.trade_source_type_key == 70
            });
            var trade_predict = [];
            var parsedPredictData = [];
            asyncdata.forEach(function (e) {
                e[1].forEach(function (item) {
                    var json = {
                        'trade_create_date':e[0],
                        'trade_receipt_create_date':item.tradeReceiptCreateDate,
                        'delta_D':item.delta_D,
                        'trade_num':item.tradeNum,
                        'daily_transit_ratio':item.daily_transit_ratio
                    };
                    parsedPredictData.push(json);
                })
            });
            var usingDate = moment().subtract(7,'d').format('YYYY-MM-DD');
            var calcData = [];
            for(var i = 0;i<8;i++){
                var array = JSLINQ(parsedPredictData).Where(function (item) {
                    return item.trade_create_date == moment().subtract(7+i,'d').format('YYYY-MM-DD') && item.delta_D == i
                });
                calcData.push(array);
            }
            calcData.forEach(function (e) {
                trade_predict.push(e.items[0].daily_transit_ratio)
            });

            var selfArray = JSLINQ(ret).Where(function (item) {
                return item.trade_source_type_key == 0 || item.trade_source_type_key == -2
            });
            var SubmitT = 0;
            var Submit = 0;
            var ReceiveT = 0;
            var Receive = 0;
            var cnt = 0;
            var day = 0;
            var predicted_Trade= 0;
            var day1 = 1;
            var predicted_Trade1 = 0;
            ret.forEach(function (e) {
                if(cnt == 0){
                    SubmitT = SubmitT + e.trade_submit;
                    ReceiveT = ReceiveT + e.trade_receive;
                }else if(ret[cnt-1].trade_create_date != e.trade_create_date){
                    prepared.trade_create_date.push(ret[cnt-1].trade_create_date);
                    prepared.trade_submit.push(SubmitT);
                    prepared.trade_receive.push(ReceiveT);
                    predicted_Trade = predicted_Trade+ parseInt((SubmitT*(trade_predict.reverse()[day]/100)).toFixed(0));
                    predicted_Trade1 = predicted_Trade1+ parseInt((SubmitT*(trade_predict.reverse()[day1]/100)).toFixed(0));
                    var trade_ratio = ((ReceiveT/SubmitT)*100).toFixed(2).toString()+"%";
                    prepared.trade_ratio.push(trade_ratio);
                    SubmitT = e.trade_submit;
                    ReceiveT = e.trade_receive;
                    trade_ratio = "";
                    day ++;
                    day1 ++;
                }else if(cnt == ret.length-1){
                    prepared.trade_create_date.push(ret[cnt-1].trade_create_date);
                    prepared.trade_submit.push(SubmitT);
                    prepared.trade_receive.push(ReceiveT);
                    predicted_Trade = predicted_Trade+ parseInt((SubmitT*(trade_predict.reverse()[day]/100)).toFixed(0));
                    predicted_Trade1 = predicted_Trade1+ parseInt((SubmitT*(trade_predict.reverse()[day1]/100)).toFixed(0));
                    trade_ratio = ((ReceiveT/SubmitT)*100).toFixed(2).toString()+"%";
                    prepared.trade_ratio.push(trade_ratio);
                    SubmitT = 0;
                    ReceiveT = 0;
                    trade_ratio = "";
                }else if(ret[cnt-1].trade_create_date == e.trade_create_date){
                    SubmitT = SubmitT+e.trade_submit;
                    ReceiveT = ReceiveT + e.trade_receive;
                }
                cnt++;
            });
            cnt=0;
            jdArray.items.forEach(function (e) {
                if(cnt == 0) {
                    Submit = Submit + e.trade_submit;
                    Receive = Receive + e.trade_receive;
                }else if(jdArray.items[cnt-1].trade_create_date != e.trade_create_date){
                    var jd_ratio = ((Receive/Submit)*100).toFixed(2).toString()+"%";
                    prepared.jd_ratio.push(jd_ratio);
                    Submit = e.trade_submit;
                    Receive = e.trade_receive;
                }else if(cnt == jdArray.items.length-1){
                    jd_ratio = ((Receive/Submit)*100).toFixed(2).toString()+"%";
                    prepared.jd_ratio.push(jd_ratio);
                    Submit = 0;
                    Receive = 0;
                }else if(jdArray.items[cnt-1].trade_create_date == e.trade_create_date){
                    Submit = Submit + e.trade_submit;
                    Receive = Receive + e.trade_receive;

                }
                cnt++;
            });
            cnt=0;
            xmArray.items.forEach(function (e) {
                if(cnt == 0) {
                    Submit = Submit + e.trade_submit;
                    Receive = Receive + e.trade_receive;
                }else if(xmArray.items[cnt-1].trade_create_date != e.trade_create_date){
                    var xiaomi_ratio = ((Receive/Submit)*100).toFixed(2).toString()+"%";
                    prepared.xiaomi_ratio.push(xiaomi_ratio);
                    Submit = e.trade_submit;
                    Receive = e.trade_receive;
                }else if(cnt == xmArray.items.length-1){
                    xiaomi_ratio = ((Receive/Submit)*100).toFixed(2).toString()+"%";
                    prepared.xiaomi_ratio.push(xiaomi_ratio);
                    Submit = 0;
                    Receive = 0;
                }else if(xmArray.items[cnt-1].trade_create_date == e.trade_create_date){
                    Submit = Submit + e.trade_submit;
                    Receive = Receive + e.trade_receive;

                }
                cnt++;
            });
            cnt=0;
            ajhArray.items.forEach(function (e) {
                if(cnt == 0) {
                    Submit = Submit + e.trade_submit;
                    Receive = Receive + e.trade_receive;
                }else if(ajhArray.items[cnt-1].trade_create_date != e.trade_create_date){
                    var ajh_ratio = ((Receive/Submit)*100).toFixed(2).toString()+"%";
                    prepared.ajh_ratio.push(ajh_ratio);
                    Submit = e.trade_submit;
                    Receive = e.trade_receive;
                }else if(cnt == ajhArray.items.length-1){
                    ajh_ratio = ((Receive/Submit)*100).toFixed(2).toString()+"%";
                    prepared.ajh_ratio.push(ajh_ratio);
                    Submit = 0;
                    Receive = 0;
                }else if(ajhArray.items[cnt-1].trade_create_date == e.trade_create_date){
                    Submit = Submit + e.trade_submit;
                    Receive = Receive + e.trade_receive;

                }
                cnt++;
            });
            cnt=0;
            selfArray.items.forEach(function (e) {
                if(cnt == 0) {
                    Submit = Submit + e.trade_submit;
                    Receive = Receive + e.trade_receive;
                }else if(selfArray.items[cnt-1].trade_create_date != e.trade_create_date){
                    var self_ratio = ((Receive/Submit)*100).toFixed(2).toString()+"%";
                    prepared.self_ratio.push(self_ratio);
                    Submit = e.trade_submit;
                    Receive = e.trade_receive;
                }else if(cnt == ret.length-1){
                    self_ratio = ((Receive/Submit)*100).toFixed(2).toString()+"%";
                    prepared.self_ratio.push(self_ratio);
                    Submit = 0;
                    Receive = 0;
                }else if(selfArray.items[cnt-1].trade_create_date == e.trade_create_date){
                    Submit = Submit + e.trade_submit;
                    Receive = Receive + e.trade_receive;

                }
                cnt++;
            });
            cnt=0;

            if(prepared.ajh_ratio.length != prepared.trade_create_date.length){
                prepared.ajh_ratio.push("0%")
            }
            if(prepared.jd_ratio.length != prepared.trade_create_date.length){
                prepared.jd_ratio.push("0%")
            }
            if(prepared.self_ratio.length != prepared.trade_create_date.length){
                prepared.self_ratio.push("0%")
            }
            if(prepared.xiaomi_ratio.length != prepared.trade_create_date.length){
                prepared.xiaomi_ratio.push("0%")
            }
            cnt = 0;
            prepared.trade_create_date.forEach(function (e) {
                var json =  {
                    "trade_create_date":prepared.trade_create_date[cnt],
                    "trade_submit":prepared.trade_submit[cnt],
                    "trade_receive":prepared.trade_receive[cnt],
                    "trade_ratio":prepared.trade_ratio[cnt],
                    "jd_ratio":prepared.jd_ratio[cnt],
                    "ajh_ratio":prepared.ajh_ratio[cnt],
                    "xiaomi_ratio":prepared.xiaomi_ratio[cnt],
                    "self_ratio":prepared.self_ratio[cnt]
                };
                parsed.push(json);
                cnt++;
            });
            $('#yExpressSubmit').html(prepared.trade_submit.reverse()[0].toString());
            var query = {
                'startDate':moment().subtract(8,'d').format('YYYY-MM-DD'),
                'endDate':moment().subtract(1,'d').format('YYYY-MM-DD')
            };
            requestURL(dataService+"/operationCenter/tradeReceive",query).done(function (ret) {
                $('#yExpressReceive').html(ret.reverse()[0].trade_receive.toString());
            });
            var savequery1={
                'predict_made_date':moment().format('YYYY-MM-DD'),
                'predict_num':predicted_Trade
            };
            var savequery2 = {
                'predict_made_date':moment().add(1,'d').format('YYYY-MM-DD'),
                'predict_num':predicted_Trade1
            };
            requestURL(dataService+"/operationCenter/predictSave",savequery1);
            requestURL(dataService+"/operationCenter/predictSave",savequery2);
            $('#ExpressPredict1').html(predicted_Trade);
            $('#ExpressPredict2').html(predicted_Trade1);
            renderSubmitChart(parsed);
            renderChannelChart(parsed);
            renderTable(parsed);
        });
    }
    function renderTable(parsedData){
        $('#trade_predict_table').bootstrapTable('destroy').bootstrapTable({
            pagination:true,
            data:parsedData,
            columns:[{
                field:"trade_create_date",
                title:'日期'
            },{
                field:'trade_submit',
                title:'总提交量'
            },{
                field:'trade_receive',
                title:'总到货量'
            },{
                field:'trade_ratio',
                title:'转化率'
            },{
                field:'jd_ratio',
                title:'京东渠道转化率'
            },{
                field:'ajh_ratio',
                title:'爱机汇渠道转化率'
            },{
                field:'xiaomi_ratio',
                title:'小米渠道转化率'
            },{
                field:'self_ratio',
                title:'官网渠道转化率'
            }]
        })
    }
    function getFilterOptions() {
        var dfd = $.Deferred();
        requestURL(dataService+"/tradePredict/tradePredictOptions",{}).done(function (ret) {
            dfd.resolve(ret)
        });
        return dfd.promise()
    }
    function renderOptions(sel, data) {
        $(sel).empty();
        data.forEach(function (ele) {
            $(sel).append("<option value='" + ele + "'>" + ele + "</option>")
        });
    }
    function renderFilterOptions() {
        var promise = getFilterOptions();
        promise.done(function (data) {
            // $('#cityName').attr("multiple","multiple");
            // $('#trade_source_name').attr("multiple","multiple");
            renderOptions('#cityName',data.city_name);
            renderOptions('#trade_source_name',data.trade_source_type_name)
            $('#cityName').select2({
                placeholder:"全部",
                theme:"bootstrap",
                selectAll:false
            });
            $('#trade_source_name').select2({
                placeholder:"全部",
                theme:"bootstrap",
                selectAll:false
            });
        })
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
    function getSelectedFilter(){

        var startDate = moment().subtract(7,'d').format('YYYY-MM-DD');
        var filter = {
            'date':startDate
        };
        return cleanParams(filter);

    }

    function getDailyData(query) {
        var dfd = $.Deferred();
        requestURL(dataService+"/operationCenter/tradePredict",query).done(function (ret) {
            dfd.resolve(ret)
        });
        return dfd.promise()
    }
    function renderSubmitChart(data){
        var xAxisData = [];
        var SubmitData = [];
        var ReceiveData = [];
        var TransitRatio = [];
        data.forEach(function (e) {
            xAxisData.push(e.trade_create_date);
            SubmitData.push(e.trade_submit);
            ReceiveData.push(e.trade_receive);
            TransitRatio.push(parseFloat(e.trade_ratio.split('%')[0]))
        });
        var option = {
            title:{
                text:'提交量转化情况',
                x:"center",
                padding:[0,0,0,50]
            },
            tooltip:{
                trigger:'axis'
            },
            grid: {
                left: '3%',
                right: '4%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xAxisData
            },
            yAxis: [
                {
                    type: 'value',
                    name:'单量'
                },{
                    type:'value',
                    name:'转化率',
                    axisLabel:{
                        formatter:'{value}%'
                    }
                }
            ],
            series:[
                {
                    name:'总提交量',
                    type:'bar',
                    data:SubmitData
                },{
                    name:'已到货量',
                    type:'bar',
                    data:ReceiveData
                },{
                    name:'总转化率',
                    type:'line',
                    yAxisIndex:1,
                    data:TransitRatio
                }
            ]

        };
        var submitChart = echarts.init(document.getElementById('tradeStatsChart'));
        submitChart.setOption(option);
        window.addEventListener('resize',submitChart.resize);

    }
    function renderChannelChart(data){
        var xAxisData = [];
        var jdData = [];
        var ajhData = [];
        var xmData = [];
        var selfData= [];
        data.forEach(function (e) {
            xAxisData.push(e.trade_create_date);
            jdData.push(parseFloat(e.jd_ratio.split('%')[0]));
            ajhData.push(parseFloat(e.ajh_ratio.split('%')[0]));
            xmData.push(parseFloat(e.xiaomi_ratio.split('%')[0]));
            selfData.push(parseFloat(e.self_ratio.split('%')[0]))
        })
        var option = {
            title:{
                text:'提交量转化情况',
                x:"center",
                padding:[0,0,0,50]
            },
            tooltip:{
                trigger:'axis'
            },
            grid: {
                left: '3%',
                right: '4%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xAxisData
            },
            yAxis: [
               {
                    type:'value',
                    name:'转化率',
                    axisLabel:{
                        formatter:'{value}%'
                    }
                }
            ],
            series:[
                {
                    name:'京东转化率',
                    type:'line',
                    data:jdData
                },{
                    name:'爱机汇转化率',
                    type:'line',
                    data:ajhData
                },{
                    name:'小米转化率',
                    type:'line',
                    data:xmData
                },{
                    name:'官网转化率',
                    type:'line',
                    data:selfData
                }

            ]

        };
        var ratioChart = echarts.init(document.getElementById('tradeRatioChart'));
        ratioChart.setOption(option);
        window.addEventListener('resize',ratioChart.resize);

    }



    $('#query').click(function () {
        var filter = getSelectedFilter();
        initalize(filter);
        // console.log('1234')
    })
};