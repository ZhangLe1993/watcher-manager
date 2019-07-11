Template.pageViewProduct.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#productTab').addClass('active');
    $('#pageViewProduct').addClass('active');

    if(isMobile()){
        $('.sidebar-toggle').click();
    }

    var pVPisshow = localStorage.getItem('pVPisshow');
    if (pVPisshow == null) {
        localStorage.setItem('pVPisshow', 1);
        $('#introductions').joyride({
            autoStart: true,
            modal: true,
            expose: false
        });
    }

    /*日期设初值*/
    var nowdate = new Date().format("yyyy-MM-ddd");
    var todaynow = new Date(nowdate).getNewDate(-1);
    $('.webTrafficUVCityRangestart').html(todaynow);
    $('.webTrafficUVCityRangeend').html(todaynow);

    /*开始日期*/
    var transformDatestart = function () {
        var lastday = "2016-07-01";
        var dateStrArray = lastday.split('-');
        return dateStrArray[1] + '/' + dateStrArray[2] + '/' + dateStrArray[0]
    };
    /*截止时间*/
    var transformDateend = function () {
        var dateStrArray = new Date(nowdate).getNewDate(-1).split('-');
        return dateStrArray[1] + '/' + dateStrArray[2] + '/' + dateStrArray[0]
    };

    $('.webTrafficUVCityRangestart').daterangepicker({
        "showDropdowns": true,
        "alwaysShowCalendars": true,
        "singleDatePicker": true,
        "autoApply": true,
        "minDate": transformDatestart(),
        "maxDate": transformDateend(),
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
        }
    }, pickstartDateRangeCallback);
    $(".webTrafficUVCityRangestart").on('apply.daterangepicker', function (ev, picker) {
        gettotaldata();
    });

    $(".web").on('change', function () {
        gettotaldata();
    });

    //选项初始化加载
    requestURL(dataService+"/product/getProductPageViewFilterOptions",{}).done(function(data){

        /*区域*/
        $(".area").attr("multiple","multiple");
        renderOptions(".area",["物流","华北大区","华东大区","华南大区","华西大区"]);

        $(".area").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false,
            filter: true,
        });
        renderCss(".area")

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

        renderCss(".city")
    });

    $(".search").click(function(){
        gettotaldata();
    });

    gettotaldata();

};

function renderOptions(sel,data){
    $(sel).empty();
    data.forEach(function(ele){
        $(sel).append("<option value='"+ele+"'>"+ele+"</option>")
    });
}

function renderCss(sel){
    $(sel).css("margin-top","15px");
    $(sel+" .ms-choice").css("height","34px");
    $(sel+" .ms-choice").css("background-color","#3c8dbc");
    $(sel+" .ms-choice").css("border-color","transparent");
    $(sel+" .ms-choice .placeholder").css("color","white");
    $(sel+" .ms-choice span").css("padding-top","5px");
    $(sel+" .ms-choice div").css("margin-top","5px");
    $(sel+" .ms-choice div").css("color","white");
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

//取值
function getValue() {
    var startDate = $('.webTrafficUVCityRangestart').html();
    if (startDate == undefined) {
        startDate = new Date(new Date().getTime() - 31 * 24 * 3600 * 1000).format("yyyy-MM-dd");
    }
    var area=$(".area").val();
    var cityName=$(".city").val();
    var filter = {
        "date": startDate,
        "area":area,
        "city":cityName
    }
    var query = cleanParams(_.clone(filter));
    var dataSource = dataService + "/product/getDailyAggregateMarketingWebTrafficData";
    requestURL(dataSource, query).done(function (data) {
        drawpageViewChart(data);
    })
}
/*开始时间*/
function pickstartDateRangeCallback(start, end, label) {
    //    console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    $('.webTrafficUVCityRangestart').html(start.format('YYYY-MM-DD'));
}

function normalized(data, max, min) {
    for (var i = data.length - 1; i >= 0; i--) {
        data.push(((data[i] - min) / (max - min)));
    }
    return data.reverse();
}
function normalizeData(value) {
    var loggedata = 0;
    loggedata = Math.log(value);
}
function sumarray(array) {
    var sum = 0;
    var length = array.length;
    for (var i = 0; i < length; i++) {
        sum += array[i]
    }
    return sum;
}
var totalc = {};
function gettotaldata() {
    var usingdate = $('.webTrafficUVCityRangestart').html();
    var area=$(".area").val();
    var cityName=$(".city").val();

    var filter = {
        "date": usingdate,
        "area":area,
        "city":cityName
    }
    var query = cleanParams(_.clone(filter));
    var dataSource = dataService + "/product/getTotalPageviewWebTrafficData";
    requestURL(dataSource, query).done(function (data) {
        totals.totaldata.length=0;
        totals.statictotalPC.length=0;
        totals.statictotalM.length=0;
        data.forEach(function (e) {
            if (e.url == "http://www.aihuishou.com") {
                totalc['aihuishou.com/trade/apply.html?fastorderkey='] = numeral(e.applyPc).format();
                totalc['aihuishou.com'] = numeral(e.home).format();
                totalc['aihuishou.com/userinquiry'] = numeral(e.userinquiryPc).format();
                totalc['aihuishou.com/product/*'] = numeral(e.product).format();
                totalc['PC版其它页面'] = numeral(e.others).format();
                totalc['aihuishou.com/trade/success.html?tradeno='] = numeral(e.tradeSuccessPc).format();
                totals.statictotalPC.push(e.applyPc);
                totals.statictotalPC.push(e.home);
                totals.statictotalPC.push(e.userinquiryPc);
                totals.statictotalPC.push(e.product);
                totals.statictotalPC.push(e.others);
                totals.statictotalPC.push(e.tradeSuccessPc);
                totalc['PC版'] = numeral(sumarray(totals.statictotalPC)).format();
            }
            else{
                totalc['m.aihuishou.com'] = numeral(e.home).format();
                totalc['m.aihuishou.com/product/*'] = numeral(e.product).format();
                totalc['M版其它页面'] = numeral(e.others).format();
                totalc['m.aihuishou.com/trade?fastorderkey='] = numeral(e.tradeM).format();
                totalc['m.aihuishou.com/trade/success?tradeno='] = numeral(e.tradeSuccessM).format();
                totalc['m.aihuishou.com/inquiry?key='] = numeral(e.inquiryM).format();
                totals.statictotalM.push(e.home);
                totals.statictotalM.push(e.product);
                totals.statictotalM.push(e.others);
                totals.statictotalM.push(e.tradeM);
                totals.statictotalM.push(e.tradeSuccessM);
                totalc['M版'] = numeral(sumarray(totals.statictotalM)).format();
            }
        })
        getValue();
    });
    //();
    var obj = {
        "date":usingdate
    };
    var plat = $(".web").val()
    if(plat=="官网"){
        obj.idsite=1
    }else if(plat=="M版"){
        obj.idsite=6
    }

    if(cityName==null){
        cityName="null"
    }
    if(area==null){
        area="null"
    }

    obj.city=cityName.toString();
    obj.area=area.toString();

    renderTable(obj);
}
function popModal(href) {
    var area=$(".area").val();
    var city = $(".city").val();
    setTimeout(function () {
        $.fancybox.open([
            {
                type: 'iframe',
                href: href+"/"+area+"/"+city
            }
        ], {
            padding: 0,
            height: 600,
            minHeight: 600,
            autoScale: false,
            //fitToView: false,
            //autoSize: false,
            beforeShow: function () {
                this.height = 600;
            }
        });
    }, 400);
}
var totals = {
    totaldata: [],
    statictotalPC: [],
    statictotalM: []
};

function drawpageViewChart(data) {
    var usingdate = $('.webTrafficUVCityRangestart').html();
    var platform = $('.web').val();
    var result = {
        url: [],
        homePc: [],
        homeM: [],
        productPc: [],
        productM: [],
        tradeM: [],
        applyPc: [],
        tradeSuccessPc: [],
        userinquiryPc: [],
        tradeSuccessM: [],
        inquiryM: [],
        others: []
    };
    var option;
    if (platform == "官网") {
        data.forEach(function (e) {
            //        if(platform=="官网"){
            switch (e.url) {
                case "http://www.aihuishou.com":
                    result.applyPc.push(e.applyPc);
                    result.homePc.push(e.home);
                    result.userinquiryPc.push(e.userinquiryPc);
                    result.productPc.push(e.product);
                    result.others.push(e.others);
                    result.tradeSuccessPc.push(e.tradeSuccessPc);
                    totals.totaldata.push(
                        e.home
                        + e.product
                        + e.others
                        + e.applyPc
                        + e.tradeSuccessPc
                        + e.userinquiryPc);
                    break;
                default:
                    break;
            }
        });
        var maxVal = [], indicatormax, indicatormin;
        maxVal.push(Math.max.apply(Math, totals.totaldata));
        indicatormax = Math.max.apply(Math, maxVal);
        indicatormax = Math.ceil((indicatormax + 1) / 1000) * 1000;
        indicatormin = 0.2 * indicatormax * (-1);
        indicatormin = Math.ceil((indicatormin - 1000) / 1000) * 1000;

        option = {
            backgroundColor: '#222d32',
            title: {
                text: '',
                top: 0,
                textStyle: {
                    color: '#eee'
                }
            },
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove',
                formatter: function (params, ticket, callback) {
                    var str;
                    var total = 0;
                    var val = [];
                    str = params.name + '\t';
                    val = params.value.toString().split(",");
                    for (var i = 0; i < val.length; i++) {
                        val[i] = Number(val[i]);
                        total += val[i];
                        val[i] = numeral(val[i]).format();
                    }
                    total = numeral(total).format();
                    str += '<br/>' + "UV数:" + total + '<br/>';
                    str += '24:00 ' + val[0] + ',' + '\t23:00 ' + val[1] + ',' + '\t22:00 ' + val[2] + '<br/>' +
                        '21:00 ' + val[3] + ',' + '\t20:00 ' + val[4] + ',' + '\t19:00 ' + val[5] + '<br/>' +
                        '18:00 ' + val[6] + ',' + '\t17:00 ' + val[7] + ',' + '\t16:00 ' + val[8] + '<br/>' +
                        '15:00 ' + val[9] + ',' + '\t14:00 ' + val[10] + ',' + '\t13:00 ' + val[11] + '<br/>' +
                        '12:00 ' + val[12] + ',' + '\t11:00 ' + val[13] + ',' + '\t10:00 ' + val[14] + '<br/>' +
                        '09:00 ' + val[15] + ',' + '\t08:00 ' + val[16] + ',' + '\t07:00 ' + val[17] + '<br/>' +
                        '06:00 ' + val[18] + ',' + '\t05:00 ' + val[19] + ',' + '\t04:00 ' + val[20] + '<br/>' +
                        '03:00 ' + val[21] + ',' + '\t02:00 ' + val[22] + ',' + '\t01:00 ' + val[23];
                    return (str)
                },
                extraCssText: 'white-space:pre'
            },
            legend: {
                orient: 'vertical',
                x: 'left',
                data: ['aihuishou.com',
                    'aihuishou.com/product/*',
                    'aihuishou.com/userinquiry',
                    'aihuishou.com/trade/apply.html?fastorderkey=',
                    'aihuishou.com/trade/success.html?tradeno=',
                    'PC版其它页面',
                    'PC版'],
                top: 5,
                textStyle: {
                    color: '#eee'
                },
                formatter: function (name) {
                    return name + '\t' + 'UV数:' + totalc[name];
                },
                selected: {
                    'PC版其它页面': false,
                    'aihuishou.com': true,
                    'aihuishou.com/product/*': true,
                    'aihuishou.com/userinquiry': true,
                    'aihuishou.com/trade/apply.html?fastorderkey=': true,
                    'aihuishou.com/trade/success.html?tradeno=': true,
                    'PC版': true
                }
            },
            radar: {
                shape: 'circle',
                splitLine: {
                    lineStyle: {
                        color: [
                            'rgba(238, 197, 102, 0.1)', 'rgba(238, 197, 102, 0.2)',
                            'rgba(238, 197, 102, 0.4)', 'rgba(238, 197, 102, 0.6)',
                            'rgba(238, 197, 102, 0.8)', 'rgba(238, 197, 102, 1)'
                        ].reverse()
                    }
                },
                splitArea: {
                    areaStyle: {
                        color: ['#163027'],
                        shadowColor: 'rgba(0, 0, 0, 0.3)',
                        shadowBlur: 10
                    },
                    show: false
                },
                name: {
                    textStyle: {
                        color: 'rgb(238, 197, 102)'
                    }
                },
                axisTick: {
                    show: true
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(238, 197, 102, 0.5)'
                    }
                },
                indicator: [
                    {
                        name: '24:00', max: indicatormax, min: indicatormin, axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#FFFFFF'
                        }
                    }
                    },
                    { name: '23:00', max: indicatormax, min: indicatormin },
                    { name: '22:00', max: indicatormax, min: indicatormin },
                    { name: '21:00', max: indicatormax, min: indicatormin },
                    { name: '20:00', max: indicatormax, min: indicatormin },
                    { name: '19:00', max: indicatormax, min: indicatormin },
                    { name: '18:00', max: indicatormax, min: indicatormin },
                    { name: '17:00', max: indicatormax, min: indicatormin },
                    { name: '16:00', max: indicatormax, min: indicatormin },
                    { name: '15:00', max: indicatormax, min: indicatormin },
                    { name: '14:00', max: indicatormax, min: indicatormin },
                    { name: '13:00', max: indicatormax, min: indicatormin },
                    { name: '12:00', max: indicatormax, min: indicatormin },
                    { name: '11:00', max: indicatormax, min: indicatormin },
                    { name: '10:00', max: indicatormax, min: indicatormin },
                    { name: '09:00', max: indicatormax, min: indicatormin },
                    { name: '08:00', max: indicatormax, min: indicatormin },
                    { name: '07:00', max: indicatormax, min: indicatormin },
                    { name: '06:00', max: indicatormax, min: indicatormin },
                    { name: '05:00', max: indicatormax, min: indicatormin },
                    { name: '04:00', max: indicatormax, min: indicatormin },
                    { name: '03:00', max: indicatormax, min: indicatormin },
                    { name: '02:00', max: indicatormax, min: indicatormin },
                    { name: '01:00', max: indicatormax, min: indicatormin }
                ]
            },
            series: [{
                name: '页面浏览时间图',
                type: 'radar',
                areaStyle: { emphasis: {} },
                //                            itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data: [

                    {
                        value: result.homePc,
                        name: 'aihuishou.com'
                    },
                    {
                        value: result.productPc,
                        name: 'aihuishou.com/product/*'
                    },
                    {
                        value: result.others,
                        name: 'PC版其它页面',
                    },
                    {
                        value: result.applyPc,
                        name: 'aihuishou.com/trade/apply.html?fastorderkey='
                    },
                    {
                        value: result.tradeSuccessPc,
                        name: 'aihuishou.com/trade/success.html?tradeno='
                    },
                    {
                        value: result.userinquiryPc,
                        name: 'aihuishou.com/userinquiry'
                    },
                    {
                        value: totals.totaldata,
                        name: 'PC版'
                    }
                ]
            }]
        };
    } else {
        data.forEach(function (e) {
            switch (e.url) {
                case "http://m.aihuishou.com":
                    result.tradeM.push(e.tradeM);
                    result.tradeSuccessM.push(e.tradeSuccessM);
                    result.homeM.push(e.home);
                    result.inquiryM.push(e.inquiryM);
                    result.productM.push(e.product);
                    result.others.push(e.others);
                    totals.totaldata.push(
                        e.home
                        + e.tradeSuccessM
                        + e.product
                        + e.others
                        + e.tradeM
                        + e.inquiryM)
                    break;
                default:
                    break;
            }
        });


        //所有值的最大最小值
        var maxVal = [], minVal = [], indicatormax, indicatormin;
        maxVal.push(Math.max.apply(Math, totals.totaldata));
        minVal.push(Math.min.apply(Math, totals.totaldata));
        indicatormax = Math.max.apply(Math, maxVal);
        indicatormax = Math.ceil((indicatormax + 1) / 1000) * 1000;
        indicatormin = 0.2 * indicatormax * (-1);
        indicatormin = Math.ceil(indicatormin / 1000) * 1000;



        option = {
            backgroundColor: '#222d32',
            title: {
                text: '',
                top: 0,
                textStyle: {
                    color: '#eee'
                }
            },
            tooltip: {
                trigger: 'item',
                triggerOn: 'mousemove',
                formatter: function (params, ticket, callback) {
                    var str = params.name + '\t';
                    var total = 0, max, min;
                    var val = [];
                    val = params.value.toString().split(",");
                    val = val.reverse();
                    for (var i = 0; i < 24; i++) {
                        val[i] = Number(val[i]);
                        total += val[i];
                        val[i] = numeral(val[i]).format();
                    }
                    total = numeral(total).format();
                    str += '<br/>' + "UV数:" + total + '<br/>';
                    str += '24:00 ' + val[0] + ',' + '\t23:00 ' + val[1] + ',' + '\t22:00 ' + val[2] + '<br/>' +
                        '21:00 ' + val[3] + ',' + '\t20:00 ' + val[4] + ',' + '\t19:00 ' + val[5] + '<br/>' +
                        '18:00 ' + val[6] + ',' + '\t17:00 ' + val[7] + ',' + '\t16:00 ' + val[8] + '<br/>' +
                        '15:00 ' + val[9] + ',' + '\t14:00 ' + val[10] + ',' + '\t13:00 ' + val[11] + '<br/>' +
                        '12:00 ' + val[12] + ',' + '\t11:00 ' + val[13] + ',' + '\t10:00 ' + val[14] + '<br/>' +
                        '09:00 ' + val[15] + ',' + '\t08:00 ' + val[16] + ',' + '\t07:00 ' + val[17] + '<br/>' +
                        '06:00 ' + val[18] + ',' + '\t05:00 ' + val[19] + ',' + '\t04:00 ' + val[20] + '<br/>' +
                        '03:00 ' + val[21] + ',' + '\t02:00 ' + val[22] + ',' + '\t01:00 ' + val[23];
                    return (str)
                },
                extraCssText: 'white-space:pre'
            },

            legend: {
                orient: 'vertical',
                x: 'left',
                data: ['m.aihuishou.com/product/*',
                    'm.aihuishou.com',
                    'm.aihuishou.com/inquiry?key=',
                    'm.aihuishou.com/trade?fastorderkey=',
                    'm.aihuishou.com/trade/success?tradeno=',
                    'M版其它页面',
                    'M版'],
                top: 5,
                textStyle: {
                    color: '#eee'
                },
                formatter: function (name) {
                    return name + '\t' + 'UV数:' + totalc[name];
                },
                selected: {
                    'M版其它页面': false,
                    'm.aihuishou.com': true,
                    'm.aihuishou.com/product/*': true,
                    'm.aihuishou.com/inquiry?key=': true,
                    'm.aihuishou.com/trade?fastorderkey=': true,
                    'm.aihuishou.com/trade/success.html?tradeno=': true,
                    'm.aihuishou.com/trade/paymenttype/': true,
                    'M版': true
                }

            },
            radar: {
                shape: 'circle',
                splitLine: {
                    lineStyle: {
                        color: [
                            'rgba(238, 197, 102, 0.1)', 'rgba(238, 197, 102, 0.2)',
                            'rgba(238, 197, 102, 0.4)', 'rgba(238, 197, 102, 0.6)',
                            'rgba(238, 197, 102, 0.8)', 'rgba(238, 197, 102, 1)'
                        ].reverse()
                    }
                },
                splitArea: {
                    areaStyle: {
                        color: ['#161627'],
                        shadowColor: 'rgba(0, 0, 0, 0.3)',
                        shadowBlur: 10
                    },
                    show: false
                },
                name: {
                    textStyle: {
                        color: 'rgb(238, 197, 102)'
                    }
                },
                axisTick: {
                    show: true
                },
                axisLine: {
                    lineStyle: {
                        color: 'rgba(238, 197, 102, 0.5)'
                    }
                },
                indicator: [
                    {
                        name: '23:00', max: indicatormax, min: indicatormin, axisLabel: {
                        show: true,
                        textStyle: {
                            color: '#FFFFFF'
                        }
                    }
                    },
                    { name: '22:00', max: indicatormax, min: indicatormin },
                    { name: '21:00', max: indicatormax, min: indicatormin },
                    { name: '20:00', max: indicatormax, min: indicatormin },
                    { name: '19:00', max: indicatormax, min: indicatormin },
                    { name: '18:00', max: indicatormax, min: indicatormin },
                    { name: '17:00', max: indicatormax, min: indicatormin },
                    { name: '16:00', max: indicatormax, min: indicatormin },
                    { name: '15:00', max: indicatormax, min: indicatormin },
                    { name: '14:00', max: indicatormax, min: indicatormin },
                    { name: '13:00', max: indicatormax, min: indicatormin },
                    { name: '12:00', max: indicatormax, min: indicatormin },
                    { name: '11:00', max: indicatormax, min: indicatormin },
                    { name: '10:00', max: indicatormax, min: indicatormin },
                    { name: '09:00', max: indicatormax, min: indicatormin },
                    { name: '08:00', max: indicatormax, min: indicatormin },
                    { name: '07:00', max: indicatormax, min: indicatormin },
                    { name: '06:00', max: indicatormax, min: indicatormin },
                    { name: '05:00', max: indicatormax, min: indicatormin },
                    { name: '04:00', max: indicatormax, min: indicatormin },
                    { name: '03:00', max: indicatormax, min: indicatormin },
                    { name: '02:00', max: indicatormax, min: indicatormin },
                    { name: '01:00', max: indicatormax, min: indicatormin },
                    { name: '00:00', max: indicatormax, min: indicatormin },
                ]
            },
            series: [{
                name: '页面浏览时间图',
                type: 'radar',
                areaStyle: { emphasis: {} },
                //                                itemStyle: {normal: {areaStyle: {type: 'default'}}},
                data: [
                    {
                        value: result.homeM,
                        name: 'm.aihuishou.com'
                    },
                    {
                        value: result.productM,
                        name: 'm.aihuishou.com/product'
                    },
                    {
                        value: result.others,
                        name: 'M版其它页面',
                    },
                    {
                        value: result.tradeM,
                        name: 'm.aihuishou.com/trade?fastorderkey='
                    },
                    {
                        value: result.tradeSuccessM,
                        name: 'm.aihuishou.com/trade/success?tradeno='
                    },
                    {
                        value: result.inquiryM,
                        name: 'm.aihuishou.com/inquiry?key='
                    },
                    {
                        value: totals.totaldata,
                        name: 'M版'
                    }
                ]
            }]
        };
        totals = {
            totaldata: [],
            statictotalPC: [],
            statictotalM: []
        }
    }

    var pageViewChart = echarts.init(document.getElementById('pageViewChart'));
    var chartconfig = echarts.config;
    pageViewChart.setOption(option);

    window.addEventListener('resize',pageViewChart.resize)
    pageViewChart.on('click', function (params) {
            var regexp = new RegExp('[product/\*]$');
            var regexp2 = new RegExp('[其他页面]$');
            var test = regexp.test(params.name);
            var test2 = regexp2.test(params.name);
            if (test) {
                if (platform == "官网") {
                    sessionStorage.setItem('platform', "官网");
                } else {
                    sessionStorage.setItem('platform', "M版");
                }
                var url = params.name.substring(0, params.name.length - 1)
                sessionStorage.setItem('date', usingdate);
                popModal('/product/ProductPageViewed');
            }
            if (test2) {
                if (platform == "官网") {
                    sessionStorage.setItem('platform', "官网");
                } else {
                    sessionStorage.setItem('platform', "M版");
                }
                sessionStorage.setItem('date', usingdate);
                popModal('/product/Modal/Tables');
            }
        }
    );
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

function getProductPageViewVisit(filter){
    //var query = cleanParams(_.clone(filter));
    var dfd = $.Deferred();
    requestURL(dataService+"/product/getProductPageViewVisit",filter).done(function(ret){
        dfd.resolve(ret)
    });

    return dfd.promise()
}

function renderTable(obj){
    var area=$(".area").val();
    var city=$(".city").val();
    $('#dataTable').bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        pagination: true,
        sidePagination: 'server',
        ajax:function(params){
            var ajaxParams = $.extend(obj,params.data);

            getProductPageViewVisit(ajaxParams).done(function(data){
                params.success(data)
            });
        },
        //fixRow:fixRow,
        cdataExport:"cdataExport",
        columns: [{
            field: 'idsite',
            title: '平台',
            sortable:true,
            formatter:function(value,row,index){
                var showval;
                if(value==1){
                    showval="官网"
                }else if(value==6){
                    showval="M版"
                }
                return showval
            }
        },{
            field: 'pagename',
            title: '页面',
            sortable:true,
            formatter:function(value,row,index){
                var val=value.replace(/\//g,"%2F")
                val=val.replace(/\?/g,"%3F")
                return "<a class='cus_modal' data-fancybox-type='iframe' href='/product/pageViewModal/"+val+"/"+row.idsite+"/"+area+"/"+city+"'>"+value+"</a>"
            }
        }, {
            field: 'uv',
            title: '总访客数',
            sortable:true
        }, {
            field: 'bounce_uv',
            title: '跳出访客数',
            sortable:true
        },{
            field: 'bounceuv',
            title: '跳出率',
            sortable:true,
            formatter:function(value,row,index){
                var showval=((row.bounce_uv/row.uv)*100).toFixed(2)+"%";
                return showval
            }
        }, {
            field: 'entry_uv',
            title: '进入访客数',
            sortable:true
        }, {
            field: 'entryuv',
            title: '进入访客率',
            sortable:true,
            formatter:function(value,row,index){
                var showval=((row.entry_uv/row.uv)*100).toFixed(2)+"%";
                return showval
            }
        },{
            field: 'exit_uv',
            title: '退出访客数',
            sortable:true
        },{
            field: 'exituv',
            title: '退出率',
            sortable:true,
            formatter:function(value,row,index){
                var showval=((row.exit_uv/row.uv)*100).toFixed(2)+"%";
                return showval
            }
        }],
    });
    $("#cdataExport").click(function(){
        var date = $('.webTrafficUVCityRangestart').html();

        query={
            "date":date
        }
        $("#wholePage").mask({'label':"请等待，文件正在导出..."});
        requestURL(dataService+"/product/exportProductUrlTrafficData",query).done(function(obj){
            $("#wholePage").unmask();
            var url = Meteor.settings.public.downloadService.baseUrl+obj.fileName;
            var link = document.createElement("a");
            link.href = url;
            link.style = "visibility:hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });

    });
}


$(".cus_modal").fancybox({
    maxWidth: 1300,
    maxHeight: 700,
    fitToView: false,
    width: '100%',
    height: '100%',
    autoSize: false,
    closeClick: false,
    closeBtn: true,
//    openEffect: 'elastic',
    closeEffect: 'elastic'
});