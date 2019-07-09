var method = "";
var nowdate = "";
var usingdate = "";
var categories = [];
var brands = [];
var area = "";
var city = "";
Template.ProductPageViewed.rendered = function () {
    area = Template.currentData().area;
    city = Template.currentData().city;
    var isshow = localStorage.getItem('isshow');
    if (isshow == null) {
        localStorage.setItem('isshow', 1);
        $('#introduction').joyride({
            autoStart: true,
            modal: false,
            expose: false
        });
    }
    usingdate = sessionStorage.getItem('date');
    if (usingdate == null) {
        nowdate = new Date().format("yyyy-MM-ddd");
        usingdate = new Date(nowdate).getNewDate(-1);
    } else {
        nowdate = new Date().format("yyyy-MM-ddd");
    }
    $('.webTrafficUVCityRangestart').html(usingdate);
    var transformDatestart = function () {
        var lastday = "2016-07-01";
        var dateStrArray = lastday.split('-');
        return dateStrArray[1] + '/' + dateStrArray[2] + '/' + dateStrArray[0]
    };
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
    var date = usingdate;
    // date ="2016-08-08";//测试用强制赋值数据
    var platform = sessionStorage.getItem('platform');
    $("#selectmethod").val(platform);
    getmethod(platform);
    getcategorydata(date, method);
    $(".SelectLabel").on('change', function () {
        var startDate = $('.webTrafficUVCityRangestart').html();
        if (startDate == undefined) {
            startDate = new Date(new Date().getTime() - 31 * 24 * 3600 * 1000).format("yyyy-MM-dd");
        }
        date = startDate;
        platform = $(".SelectLabel").val();
        getmethod(platform);
        getcategorydata(date, method);
    });
    $(".webTrafficUVCityRangestart").on('apply.daterangepicker', function (ev, picker) {
        var startDate = $('.webTrafficUVCityRangestart').html();
        if (startDate == undefined) {
            startDate = new Date(new Date().getTime() - 31 * 24 * 3600 * 1000).format("yyyy-MM-dd");
        }
        date = startDate;
        usingdate = date;
        platform = $(".SelectLabel").val();
        getmethod(platform);
        getcategorydata(date, method);

    });
}
var colors = ['#00FFFF', '#FF00FF', '#FFFF00'];
var url = "";
var categoryshow = "";
var brand = "";
var branddata = [];
var categorydata = [];
var productdata = [];

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

function pickstartDateRangeCallback(start, end, label) {
    $('.webTrafficUVCityRangestart').html(start.format('YYYY-MM-DD'));
}
function getmethod(platform) {
    if (platform == "官网") {
        method = "PC";
    } else {
        method = "Mobile";
    }
}
function drawcategorychart(catdata) {
    var categorycharts = echarts.init(document.getElementById('pageviewchart'));
    var result = {
        name: [],
        value: []
    };
    var catseries = [];
    var xlabels = [];
    catdata.forEach(function (e) {
        result['name'].push(e.name);
        result['value'].push(e.value);
        xlabels.push(e.name);
        var obj = {type: 'bar', name: e.name, data: [e.value]};
        catseries.push(obj)
    });

    var categoryopt = {
        title: {
            show: true,
            text: '品类UV数据'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function (params) {
                var val = params[0].value;
                val = numeral(val).format();
                return params[0].name + " " + val;
            }
        },
        dataZoom: [{
            type: 'slider',
            show: true,
            handleSize: 8
        }, {
            type: 'inside'
        }],
//				legend:{
//					data:xlabels
//				},
        xAxis: {
            type: 'category',
            data: xlabels,
            axisLabel: {
                rotate: 45,
                show: true,
                interval: 0
            }
        },
        yAxis: {
            type: 'value',
            name: '访问量',
            axisLabel: {
                formatter: '{value} 次'
            }

        },
        series: [{type: 'bar', name: '访问量', data: result.value}],


    };
    categorycharts.setOption(categoryopt);
    categoryshow = categories[0];
    categorycharts.on('click', function (params) {
        categoryshow = params.name;
        getbranddata(usingdate, params.name, method);
    });
}
function drawbrandchart(branddata) {
    var brandcharts = echarts.init(document.getElementById('brandviewchart'));
    var xlabels = [];
    branddata.forEach(function (e) {
        xlabels.push(e.name);
    });
    var brandopt = {
        title: {
            show: true,
            text: categoryshow + '下品牌UV数据'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function (params) {
                var val = params[0].value;
                val = numeral(val).format();
                return params[0].name + " " + val;
            }
        },
        dataZoom: [{
            type: 'slider',
            show: true,
            handleSize: 8
        }, {
            type: 'inside'
        }],
        xAxis: {
            type: 'category',
            data: xlabels,
            axisLabel: {
                rotate: 45,
                show: true,
                interval: 0
            }
        },
        yAxis: {
            type: 'value',
            name: '访问量',
            axisLabel: {
                formatter: '{value} 次'
            }
        },
        series: [{
            name: branddata.name,
            type: 'bar',
            data: branddata
        }],

    };
    brandcharts.setOption(brandopt);
    brandcharts.on('click', function (params) {
        brand = params.name;
        getproductdata(usingdate, categoryshow, brand, method)

    })
}
function drawspecifychart(productsdata) {
    var pdata = productsdata;
    var specifychart = echarts.init(document.getElementById("specifychart"));
    var xlabels = [];
    var count = 0;
    pdata.forEach(function (e) {
        count++;
        if (count & 1) {
            xlabels.push(e.name);
        }
        else {
            xlabels.push("\n" + e.name);
        }
    });
    var specopt = {
        title: {
            text: brand + "品牌型号UV数据"
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function (params) {
                var val = params[0].value;
                val = numeral(val).format();
                return params[0].name + " " + val;
            }
        },
        dataZoom: [{
            type: 'slider',
            show: true,
            handleSize: 8
        }, {
            type: 'inside'
        }],
        xAxis: {
            type: 'category',
            data: xlabels,
            axisLabel: {
                show: true,
            }
        },
        yAxis: {
            type: 'value',
            name: '访问量',
            axisLabel: {
                formatter: '{value} 次'
            }
        },
        series: [{
            name: pdata.name,
            type: 'bar',
            data: pdata
        }],

    }
    specifychart.setOption(specopt);
}
function getproductdata(date, category, brand, method) {
    var queryurl = "";
    var main_url = "";
    switch (method) {
        case "PC":
            main_url = "www.aihuishou.com";
            break;
        case "Mobile":
            main_url = "m.aihuishou.com";
            break;
        default:
            break;
    }
    ;
    if (brand == "default" && category == "default") {
        category = categories[0];
        brand = brands[0]
    }
    if (brand == "default") {
        brand = brands[0]
    }
    var brandNew = [];
    brandNew.push(brand);
    var filter = {
        "date": date,
        "brand": brandNew,
        "category": category.trim(),
        "url": main_url.trim(),
        "area":area,
        "city": city
    };
    var query = cleanParams(_.clone(filter));
    var datasource = dataService + "/product/getAggregateProductPage"
    requestURL(datasource, query).done(function (data) {
        drawspecifychart(data);
        brands = [];
    });
    //这里查询具体产品数据
    // var pdata = [{name:'iPhone5s',value:1245},
    //        			{name:'iPhone6',value:1034},
    //       			{name:'iPhone5c',value:1874},
    //       			{name:'iPhone6',value:1716},
    //       		  	{name:'iPhone6s',value:1654},
    // 				{name:'iPhone7',value:1343}];

    // drawspecifychart(pdata);
}
function getbranddata(date, category, method) {
    var queryurl = "";
    var main_url = "";
    switch (method) {
        case "PC":
            main_url = "www.aihuishou.com";
            url = date + " " + category + " " + main_url;
            queryurl = url;
            break;
        case "Mobile":
            main_url = "m.aihuishou.com";
            url = date + " " + category + " " + main_url;
            queryurl = url;
            break;
        default:
            break;
    }
    ;
    if (category == "default") {
        category = categories[0];
    }
    var filter = {
        "date": date,
        "category": category.trim(),
        "url": main_url.trim(),
        "area":area,
        "city": city
    };
    var query = cleanParams(_.clone(filter));
    var datasource = dataService + "/product/getAggregateProductPage"
    requestURL(datasource, query).done(function (data) {
        data.forEach(function (e) {
            brands.push(e.name);
        })
        brand = brands[0];
        drawbrandchart(data);
        getproductdata(date, category, "default", method)
    });
    //这里是查询品牌数据的地方
    // var shoujibranddata = [{name:'Apple',value:12450},
    // 				{name:'HTC',value:12345},
    // 				{name:'XiaoMi',value:18743},
    // 				{name:'Huawei',value:17161}];
    // branddata = shoujibranddata;
    // drawbrandchart(branddata);
}
function getcategorydata(date, method) {
    var queryurl = "";
    var main_url = "";
    switch (method) {
        case "PC":
            main_url = "www.aihuishou.com";
            url = date + " " + main_url;
            queryurl = url;
            break;
        case "Mobile":
            main_url = "m.aihuishou.com";
            url = date + " " + main_url;
            queryurl = url;
            break;
        default:
            break;
    }
    ;
    var query = {
        "date": date,
        "url": main_url.trim(),
        "area":area,
        "city": city
    };
    var datasource = dataService + "/product/getProductPageByCategory"
    requestURL(datasource, query).done(function (data) {
        data.forEach(function (e) {
            categories.push(e.name);
        })
        drawcategorychart(data);
        getbranddata(date, "default", method);
        //getproductdata(date, "default", "default", method);
    })
    //这里是查询大分类数据的地方
    // var catdata = [{name:'shouji',value:12450},
    //         {name:'pingban',value:12345},
    //         {name:'laptop',value:18743},
    //         {name:'camera',value:17161},
    //         {name:'accessories',value:16543},
    //         {name:'appliances',value:13432}];
    // categorydata = catdata;
    // drawproductchart(categorydata);
}
function openNav() {
    document.getElementById("Navigation").style.width = "100%";
}
function closeNav() {

}

