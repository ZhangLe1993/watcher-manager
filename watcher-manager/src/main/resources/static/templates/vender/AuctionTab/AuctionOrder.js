Template.AuctionOrder.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#AuctionTab').addClass('active');                    //tab 高亮效果
    $('#AuctionOrderTab').addClass('active');

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isIOS = ua.indexOf("iphone") > -1;
    var mobile = false;
    if(isAndroid || isIOS){
        $(".sidebar-toggle").click();
        mobile = true;
    }

    $(".search").attr("disabled",true);

    //dataPicker初始化配置
    var dateGap = -9;
    var minDate = "2016-07-01";
    var minWeekDate = "2016-07-03";
    var minMonthDate = "2016-07-01";
    var endDate = new Date().getNewDate(-1);
    var startDate = new Date(endDate).getNewDate(dateGap);
    var startWeekDate = moment().weekday(-14).format("YYYY-MM-DD");
    var endWeekDate = moment().startOf('week').format("YYYY-MM-DD");
    if(startWeekDate<minWeekDate){
        startWeekDate = minWeekDate;
    }
    var startMonthDate = moment().subtract(1, 'month').startOf('month').format("YYYY-MM-DD");
    var endMonthDate = moment().startOf('month').format("YYYY-MM-DD");
    if(startMonthDate<minMonthDate){
        startMonthDate = minMonthDate;
    }

    $(".weekly").hide();
    $(".monthly").hide();

    //$(".endDateSelectLabel").html(endDate);
    $(".startDateSelectLabel").html(startDate+"~"+endDate);
    $('.auctionStartDatePicker').daterangepicker(datePickerOptionsFunc(startDate,endDate,minDate,false), pickStartDateRangeCallback);
    $(".startWeekDateSelectLabel").html(startWeekDate+"~"+endWeekDate);
    $('.auctionWeeklyStartDatePicker').daterangepicker(weekDatePickerOptionsFunc(startWeekDate,endWeekDate,minWeekDate,false), pickStartWeekDateRangeCallback);
    $(".startMonthDateSelectLabel").html(startMonthDate+"~"+endMonthDate);
    $('.auctionMonthlyStartDatePicker').daterangepicker(monthDatePickerOptionsFunc(startMonthDate,endMonthDate,minMonthDate,false), pickStartMonthDateRangeCallback);


   /* $(".dateSelectLabel").html(startDate+"~"+endDate);
    $('.auctionDate').daterangepicker(datePickerOptionsFunc(startDate,endDate,minDate), pickAuctionDateRangeCallback);
    $(".auctionDate").show();
*/
   /* var dt = $('.dateSelectLabel').text().replace(/ /g,"").split("~");
    var startDate = dt[0];
    var endDate = dt[1];*/

    var queryall = {
        "startDate": startDate,
        "endDate": endDate,
        "auctionType":$(".auctionType").val(),
        "dateType":'daily'          //daily, week or month
    };

    var query ={}

    //加载昨日的代拍数据
    updateYesterdayData();

    //代拍图表数据初始化加载
    renderPage(queryall);

    //监控查询按钮
    $(".search").click(function(){
       var dateType =$(document).find(".dateType").val();
       var filter = getSelectedFilter(dateType,mobile );
       $(this).attr("disabled",true);
       renderPage(filter);
       /*if(dateType=="daily") {
           renderPage(filter)
       }*/
    });

    $("#datatype").on('change',function () {
       var dateType =$(document).find(".dateType").val();
       var filter = getSelectedFilter(dateType,mobile);
       renderPage(filter);
    });
    $(".dateType").on('change',function(){
        var dateType =$(this).val();
        var filter = getSelectedFilter(dateType,mobile);
        renderPage(filter);
        /*if(dateType=="daily") {
           getUVChartsData(filter)
        }*/
    });

}
function getSelectedFilter(dateType,Mobile){
    var endDate = "";
    var startDate = "";
    var dt = "";
    if(dateType=="daily"){
        $(".daily").show();
        $(".weekly").hide();
        $(".monthly").hide();
        dt = $(".startDateSelectLabel").text().replace(/ /g,"").split("~");
        startDate = dt[0];
        endDate = dt[1];
        //var dateGap = -15;
        //endDate = new Date().getNewDate(-1);
        //startDate = new Date(endDate).getNewDate(dateGap);
        //$(".endDateSelectLabel").html(endDate);
        //$(".startDateSelectLabel").html(startDate);
    }else if(dateType=="weekly"){
        $(".daily").hide();
        $(".monthly").hide();
        $(".weekly").show();
        dt = $('.startWeekDateSelectLabel').text().replace(/ /g,"").split("~");
        startDate = dt[0];
        endDate = dt[1];
        //startDate = moment().weekday(-70).format("YYYY-MM-DD");
        // endDate = moment().weekday(-7).format("YYYY-MM-DD");
        // $(".endWeekDateSelectLabel").html(endDate);
        // $(".startWeekDateSelectLabel").html(startDate);
    }else if(dateType=="monthly"){
        $(".daily").hide();
        $(".monthly").show();
        $(".weekly").hide();
        dt = $('.startMonthDateSelectLabel').text().replace(/ /g,"").split("~");
        startDate = dt[0];
        endDate = dt[1];
        //endDate = moment().subtract(1,"month").startOf('month').format("YYYY-MM-DD");
        // startDate = moment().subtract(10,"month").startOf('month').format("YYYY-MM-DD");
        // $(".endMonthDateSelectLabel").html(endDate);
        // $(".startMonthDateSelectLabel").html(startDate);
    }
    var filter = {};

        filter = {
            "dateType": dateType,
            "startDate": startDate,
            "endDate": endDate,
            "auctionType":$(".auctionType").val()
        };

    return cleanParams(filter);// todo modify
}

var orderData=[];

/**
 *  日期options的回调函数。
 * @param start
 * @param end
 * @param label
 */
function pickStartDateRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.startDateSelectLabel').html(sdt+"~"+edt);
}

function pickStartWeekDateRangeCallback(start, end, label) {
    //console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.startWeekDateSelectLabel').html(sdt+"~"+edt);
}

function pickStartMonthDateRangeCallback(start, end, label) {
   // console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.startMonthDateSelectLabel').html(sdt+"~"+edt);
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

function renderPage(filter){
    $("#chartContent").hide();
    $("#loading").show();
    //console.log(filter);
    var promise = getAggregateAuctionData(filter);
    promise.done(function(ret){
        $("#chartContent").show();
        $("#loading").hide();
        $(".search").attr("disabled",false);
        orderData=ret;

        var flag=$(".order").val();

        var titleArr=['单量','数量','金额']
        var seriesData = {
            date_arr:[],
            vol_data:[],
            cnt_data:[],
            price_data:[],
            vol_sum:0,
            cnt_sum:0,
            price_sum:0
        };

        _.sortBy(ret,'date').forEach(function(e){
            /*根据后台的返回值，将单量，数量，金额的数据放入本地变量*/
            seriesData.date_arr.push(e.date)
            seriesData.vol_data.push(e.vol);
            seriesData.cnt_data.push(e.cnt);
            seriesData.price_data.push(parseInt(e.price));
            /*计算单量，数量，金额的总数*/
            seriesData.vol_sum+=parseInt(e.vol)
            seriesData.cnt_sum+=parseInt(e.cnt)
            seriesData.price_sum+=parseInt(parseInt(e.price))
         });

        //绘制折线图
        drawStackChart(seriesData.date_arr,seriesData.vol_data,titleArr[0],seriesData.vol_sum,'volumnStackChart');
        drawStackChart(seriesData.date_arr,seriesData.cnt_data,titleArr[1],seriesData.cnt_sum,'countStackChart');
        drawStackChart(seriesData.date_arr,seriesData.price_data,titleArr[2],seriesData.price_sum,'priceStackChart');

    });
}
//请求后台的所有代拍数据
function getAggregateAuctionData(filter){
    //clean parameters
    var query = _.clone(filter);
    var dfd = $.Deferred();
    $("#loading").show();
    requestURL(dataService+"/Vender/getAuctionData",query).done(function(ret){
        dfd.resolve(ret)
    });
    $("#loading").hide();
    return dfd.promise()
}
//定义折线图配置
function drawStackChart(dateArr, dataArr, titleText, titleSum, chartId){

        var option = {
            title: {
                text: titleText + '数据统计 (' + titleSum + ")",
                x:"center",
                y:"top"
            },
            tooltip: {
                trigger: 'axis',
            },
            legend: {
                x : 'center',
                y: 'bottom',
                data:[titleText]
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
                data: dateArr
            },
            yAxis: {
                type: 'value'
            },
            series: [
                {
                    name:titleText,
                    type:'line',
                    data:dataArr,
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                        }
                    },
                    itemStyle:{
                        normal:{
                            /*color:'#3c8dbc',*/
                            lineStyle:{color: '#3c8dbc'}
                        }
                    }
                },

            ]
        };
        var StackChart = echarts.init(document.getElementById(chartId));
        StackChart.setOption(option);
        window.addEventListener('resize',StackChart.resize)
}

/* 获取昨日提交，收货，验货，上拍的数量和金额*/
var updateYesterdayData=function(){
    requestURL(dataService + "/Vender/getYesterdaySubmissionData", {}).done(function (data) {
                $("#submissionCnt").html(data["cnt"])
                $("#submissionPrice").html("￥" + data["price"].toLocaleString())
    })
    requestURL(dataService + "/Vender/getYesterdayReceivedData", {}).done(function (data) {
                $("#receivedCnt").html(data["cnt"])
                $("#receivedPrice").html("￥" + data["price"].toLocaleString())
    })
    requestURL(dataService + "/Vender/getYesterdayInspectionData", {}).done(function (data) {
                $("#inspectionCnt").html(data["cnt"])
                $("#inspectionPrice").html("￥" + data["price"].toLocaleString())
    })
    requestURL(dataService + "/Vender/getYesterdayAuctionData", {}).done(function (data) {
                $("#auctionCnt").html(data["cnt"])
                $("#auctionPrice").html("￥" + data["price"].toLocaleString())
    })
    requestURL(dataService + "/Vender/getYesterdayBiddingData", {}).done(function (data) {
                    $("#biddingCnt").html(data["cnt"])
                    $("#biddingPrice").html("￥" + data["price"].toLocaleString())
        })
}