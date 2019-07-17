Template.VenderHQVenderAntCreditPayOrderStatisticsInfo.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }

    //自动刷新函数
    var autoRun=function() {
        var flag = "ALL";
        /*var flag = Template.currentData().flag;
        if (flag == "ALL") {
            $('#VenderHQDataInfoTab').addClass('active');
            $('#VenderHQVenderAntCreditPayOrderStatisticsTab').addClass('active');
        } else if (flag == "Province") {
            $('#VenderPermissionControl').addClass('active');
            $('#VenderHQVenderAntCreditPayOrderStatisticsProvinceTab').addClass('active');
        }*/

        var dateGap = -9;
        var endDate = new Date().getNewDate(-1);
        var startDate = new Date(endDate).getNewDate(dateGap);
        var minDate = "2017-1-1";

        $(".dateSelectLabel").html(startDate + "~" + endDate);
        $('.webTrafficFunnelDate').daterangepicker(datePickerOptionsFunc(startDate, endDate, minDate, false), pickWebTrafficFunnelDateRangeCallback);



        var filter = getSelectedFilter();
        renderGraphicPage(filter);
        renderDataPage(filter);

        var inquiry = getOrderTrendencySelectedFilter();
        renderOrderTrendencyChart(inquiry);
        var query = getAllSelectedFilter();
        renderAreaRankChart(query);

        $(".search").click(function () {
            filter = getSelectedFilter();
            renderGraphicPage(filter);
            var inquiry = getOrderTrendencySelectedFilter();
            renderOrderTrendencyChart(inquiry);
            var query = getAllSelectedFilter();
            renderAreaRankChart(query);
        });


        $("#area").on('change', function () {
            var query = getAllSelectedFilter();
            renderAreaRankChart(query);
        });


        //获得订单趋势图选项栏选项
        function getOrderTrendencySelectedFilter() {

            var dt = $('.dateSelectLabel').text().replace(/ /g, "").split("~");
            var startDate = dt[0];
            var endDate = dt[1];

            //拿到选项框内容进行判断
            var order = $(".order").val();
            var filter = {
                "startDate": startDate,
                "endDate": endDate,
                "order": order,
                "flag":flag,
                "userId": getUserId()
            };
            return filter;
        }



        //获得部分选项栏选项
        function getSelectedFilter() {

            var dt = $('.dateSelectLabel').text().replace(/ /g, "").split("~");
            var startDate = dt[0];
            var endDate = dt[1];

            //拿到选项框内容进行判断
            var order = $(".order").val();
            var createTime = $(".createTime").val();
            var filter = {
                "startDate": startDate,
                "endDate": endDate,
                "order": order,
                "createTime":createTime,
                "flag":flag,
                "userId":getUserId()
            };

            return filter;

        }

        //获得所有选项栏选项
        function getAllSelectedFilter() {

            var dt = $('.dateSelectLabel').text().replace(/ /g, "").split("~");
            var startDate = dt[0];
            var endDate = dt[1];

            //拿到选项框内容进行判断
            var order = $(".order").val();
            var createTime = $(".createTime").val();
            var area = $("#area").val();
            var filter = {
                "startDate": startDate,
                "endDate": endDate,
                "order": order,
                "createTime":createTime,
                "area":area,
                "flag":flag,
                "userId":getUserId()
            };

            return filter;
        }

    };

    autoRun();
};




function pickWebTrafficFunnelDateRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.dateSelectLabel').html(sdt + "~" + edt);
}

function pickStartDateRangeCallback(start, end, label) {
    console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    var dt = start.format('YYYY-MM-DD');
    if (dt <= $('.endDateSelectLabel').html()) {
        $('.startDateSelectLabel').html(dt);
    } else {
        alert("起始时间不能晚于结束时间！")
    }
}




function renderDataPage(filter){
    //昨日提交相关数据
    requestURL(dataService+"/Vender/getVenderSubmitData",filter).done(function(ret){
        $("#submitAmountYtd").html(parseInt(ret[0].submitAmount));
        $("#submitOrderYtd").html(ret[0].submitCount);
    });
    //昨日支付相关数据
    requestURL(dataService+"/Vender/getVenderPayData",filter).done(function(ret){
        $("#payAmountYtd").html(parseInt(ret[0].payAmount));
        $("#payOrderYtd").html(ret[0].payCount);
    });
    //本月支付相关数据
    requestURL(dataService+"/Vender/getVenderMonthPayData",filter).done(function(ret){
        $("#monthAmount").html(parseInt(ret[0].monthPayAmount));
        $("#monthOrder").html(ret[0].monthPayCount);
    });
    //活跃成交门店数
    requestURL(dataService+"/Vender/getVenderactiveStoreData",filter).done(function(ret){
        $("#activeStoreNumber").html(ret[0].activeStoreNumber);
    });
}

function renderAreaRankChart(query){
    //订单量区域排名
    requestURL(dataService+"/Vender/getVenderOrderAreaRank",query).done(function(data){
        drawOrderAreaRankChart(data,query);
    });
}

function renderOrderTrendencyChart(inquiry){
    //订单趋势
    requestURL(dataService+"/Vender/getVenderOrderTrendency",inquiry).done(function(data){
        drawOrderTrendencyChart(data,inquiry);
    });
}

function renderGraphicPage(filter) {

    //订单金额分布占比
    requestURL(dataService+"/Vender/getVenderOrderMoney",filter).done(function(data){
        drawOrderMoneyPie(data,filter);
    });
    //订单品牌分布占比
    requestURL(dataService+"/Vender/getVenderOrderBrand",filter).done(function(data){
        drawOrderBrandPie(data);
    });
    //订单期数占比
    requestURL(dataService+"/Vender/getVenderOrderPeriods",filter).done(function(data){
        drawOrderPeriodsPie(data,filter);
    });
    //订单量公司排名
    requestURL(dataService+"/Vender/getVenderOrderCompanyRank",filter).done(function(data){
        drawOrderCompanyRankChart(data,filter);
    });
}

//绘制订单趋势折线图
function drawOrderTrendencyChart(data,filter){
    var xAxis_data = [];
    var series = {
        submitnumber: [],
        paidnumber:[]
    };
    var size = data.length;
    var legendTitle1 = "";
    var legendTitle2 = "";
    if(filter.order == "ordercount"){
        legendTitle1 ="提交订单数量";
        legendTitle2 ="成交订单数量";
    }else if(filter.order == "orderamount"){
        legendTitle1 ="提交订单金额";
        legendTitle2 ="成交订单金额";
    }

    for(var i = 0; i<size; i++){
       if(i<size/2){
           xAxis_data.push(data[i].date);
           series.submitnumber.push(parseInt(data[i].number));
       }else {
           series.paidnumber.push(parseInt(data[i].number));
       }
    }

    var option = {
        title: {
            text: '订单趋势图',
            x: "center",
            padding: [0, 0, 0, 50]
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: [legendTitle1,legendTitle2],
            padding: [25, 0, 0, 0]
        },
        grid: {
            left: '3%',
            right: '4%',
            containLabel: true
        },
        toolbox: {
            feature: {
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
                name: legendTitle1,
                type: 'line',
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                },
                data: series.submitnumber
            },
            {
                name: legendTitle2,
                type: 'line',
                label: {
                    normal: {
                        show: true,
                        position: 'top'
                    }
                },
                data: series.paidnumber
            }
        ]
    };
    var orderTrendencyChart = echarts.init(document.getElementById('orderTrendencyChart'));
    orderTrendencyChart.setOption(option);
    window.addEventListener('resize', orderTrendencyChart.resize)
}
//绘制订单金额分布占比饼图
function drawOrderMoneyPie(data,filter){
    var priceRange1=0,priceRange2=0,priceRange3=0,priceRange4=0,priceRange5=0,priceRange6=0,priceRange7=0,priceRange8=0;
    data.forEach(function (e) {
        switch (e.priceLevel) {
            case "<100":
                priceRange1 += parseInt(e.number);
                break;
            case "100-499":
                priceRange2 += parseInt(e.number);
                break;
            case "500-999":
                priceRange3 += parseInt(e.number);
                break;
            case "1000-1999":
                priceRange4 += parseInt(e.number);
                break;
            case "2000-2999":
                priceRange5 += parseInt(e.number);
                break;
            case "3000-3999":
                priceRange6 += parseInt(e.number);
                break;
            case "4000-4999":
                priceRange7 += parseInt(e.number);
                break;
            case ">=5000":
                priceRange8 += parseInt(e.number);
                break;
        }
    });
    var title = "";
    var name = "";
    //根据selectionA的变化显示不同的title和name
    if(filter.order == "ordercount"){
        title = "订单数量分布占比";
        name = "订单数量";
    }else if (filter.order == "orderamount"){
        title = "订单金额分布占比";
        name = "订单金额";
    }

    var option = {
        title : {
            text: title,
            x:'left'
        },
        tooltip : {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'right',
            data: ['100元以下','100-499元','500-999元','1000-1999元','2000-2999元','3000-3999元','4000-4999元','5000元及以上']
        },
        series : [
            {
                name: name,
                type: 'pie',
                radius : '55%',
                center: ['45%', '60%'],
                data:[
                    {value:priceRange1, name:'100元以下'},
                    {value:priceRange2, name:'100-499元'},
                    {value:priceRange3, name:'500-999元'},
                    {value:priceRange4, name:'1000-1999元'},
                    {value:priceRange5, name:'2000-2999元'},
                    {value:priceRange6, name:'3000-3999元'},
                    {value:priceRange7, name:'4000-4999元'},
                    {value:priceRange8, name:'5000元及以上'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    var orderMoneyPie = echarts.init(document.getElementById('orderMoneyPie'));
    orderMoneyPie.setOption(option);
    window.addEventListener('resize', orderMoneyPie.resize)
}
//绘制订单品牌分布占比饼图
function drawOrderBrandPie(data){
    var apple=0,samsung=0,huawei=0,xiaomi=0,oppo=0,vivo=0,others=0;
    data.forEach(function (e) {
        switch (e.productBrandName) {
            case "苹果":
                apple += parseInt(e.number);
                break;
            case "三星":
                samsung += parseInt(e.number);
                break;
            case "华为":
                huawei += parseInt(e.number);
                break;
            case "小米":
                xiaomi += parseInt(e.number);
                break;
            case "OPPO":
                oppo += parseInt(e.number);
                break;
            case "vivo":
                vivo += parseInt(e.number);
                break;
            default:
                others += parseInt(e.number);
                break;
        }
    });

    var option = {
        title: {
            text: "订单品牌分布占比",
            x: 'left'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'right',
            data: ['苹果', '三星', '华为', '小米', 'OPPO', 'vivo', '其他']
        },
        series: [
            {
                name: '品牌',
                type: 'pie',
                radius: '55%',
                center: ['45%', '60%'],
                data: [
                    {value: apple, name: '苹果'},
                    {value: samsung, name: '三星'},
                    {value: huawei, name: '华为'},
                    {value: xiaomi, name: '小米'},
                    {value: oppo, name: 'OPPO'},
                    {value: vivo, name: 'vivo'},
                    {value: others, name: '其他'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    var orderBrandPie = echarts.init(document.getElementById('orderBrandPie'));
    orderBrandPie.setOption(option);
    window.addEventListener('resize', orderBrandPie.resize)
}
//绘制订单期数占比饼图
function drawOrderPeriodsPie(data){
    var three=0,six=0,twelve=0,twentyfour=0;
    data.forEach(function (e) {
        switch (e.periods) {
            case "3":
                three += parseInt(e.number);
                break;
            case "6":
                six += parseInt(e.number);
                break;
            case "12":
                twelve += parseInt(e.number);
                break;
            case "24":
                twentyfour += parseInt(e.number);
                break;
        }
    });

    var option = {
        title: {
            text: "订单期数占比",
            x: 'left'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'right',
            data: ['3期', '6期', '12期', '24期']
        },
        series: [
            {
                name: '期数',
                type: 'pie',
                radius: '55%',
                center: ['45%', '60%'],
                data: [
                    {value: three, name: '3期'},
                    {value: six, name: '6期'},
                    {value: twelve, name: '12期'},
                    {value: twentyfour, name: '24期'}
                ],
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    var orderPeriodsPie = echarts.init(document.getElementById('orderPeriodsPie'));
    orderPeriodsPie.setOption(option);
    window.addEventListener('resize', orderPeriodsPie.resize)
}
//绘制订单量区域排名柱状图
function drawOrderAreaRankChart(data,query){
    var legendTitle = "";
    var title = "";
    if(query.order == "ordercount"){
        legendTitle = "订单数量";
        title = "订单量区域排名";
    }else if (query.order == "orderamount"){
        legendTitle = "订单金额";
        title = "订单金额区域排名";
    }

    var yAxis_dataList = [],series_dataList = [];
    var count = 0;
    var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];
    data.forEach(function (e) {
        yAxis_dataList.push(e.name);
        series_dataList.push({
            value: parseInt(e.number),
            itemStyle: {
                normal: {
                    color: colors[(count+1)%11]
                }
            }
        });
        count++
    });


    var option = {
        title : {
            text: title,
            x:'left',
            padding:[0,0,0,0]
        },
        //color: ['#3398DB'],
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: [legendTitle],
            padding:[30,0,0,0]
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        dataZoom: [
            {
                show: true,
                yAxisIndex: 0,
                start: 80,
                end: 100
            }
        ],
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
        },
        yAxis: {
            type: 'category',
            data: yAxis_dataList.reverse()
        },
        series: [
            {
                name: legendTitle,
                type: 'bar',
                data: series_dataList.reverse()
            }
        ]
    };
    var orderAreaRankChart = echarts.init(document.getElementById('orderAreaRankChart'));
    orderAreaRankChart.setOption(option);
    window.addEventListener('resize', orderAreaRankChart.resize)
}
//绘制订单量公司排名柱状图
function drawOrderCompanyRankChart(data,filter){
    var legendTitle = "";
    var title = "";
    if(filter.order == "ordercount"){
        legendTitle = "订单数量";
        title = "订单量公司排名";
    }else if (filter.order == "orderamount"){
        legendTitle = "订单金额";
        title = "订单金额公司排名";
    }

    var yAxis_dataList = [],series_dataList = [];
    var count = 0;
    var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];
    data.forEach(function (e) {
        yAxis_dataList.push(e.name);
        series_dataList.push({
            value: parseInt(e.number),
            itemStyle: {
                normal: {
                    color: colors[(count+1)%11]
                }
            }
        });
        count++
    });


    var option = {
        title : {
            text: title,
            x:'left',
            padding:[0,0,0,0]
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: [legendTitle],
            padding:[30,0,0,0]
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        dataZoom: [
            {
                show: true,
                yAxisIndex: 0,
                start: 96,
                end: 100
            }
        ],
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
        },
        yAxis: {
            type: 'category',
            data: yAxis_dataList.reverse()
        },
        series: [
            {
                name: legendTitle,
                type: 'bar',
                data: series_dataList.reverse()
            }
        ]
    };

    var orderCompanyRankChart = echarts.init(document.getElementById('orderCompanyRankChart'));
    orderCompanyRankChart.setOption(option);
    window.addEventListener('resize', orderCompanyRankChart.resize)
}