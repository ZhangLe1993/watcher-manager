/**
 * Created by liufangliang on 2017/4/19.
 */
Template.departmentRevenueShow.rendered = function () {

    $('.navi-tab').removeClass('active');
    $('#KPIDetail').addClass('active');
    $('#KPIRevenueAndGross').addClass('active');


    renderDate();

    renderRealTime()

}

function renderRealTime() {
    var dt = $('.duringDateLabel').text().replace(/ /g, "").split("~");
    var startDate = dt[0];
    var endDate = dt[1];
    var query = {
        "startDate": startDate,
        "endDate":endDate
    }
    //console.log(query)
    requestURL(dataService + "/departmentKPI/getRealTime", query).done(function (data) {
        //
        renderRealChart(data)
    })
}


function formatDataForRealTime(data){
    var dataGroupByDate= _.groupBy(data,function(obj){return obj.date});
    var datas={
        "date":[],
        "outRevenue":[],
        "outGross":[],
        "southRevenue":[],
        "southGross":[],
        "regionRevenue":[],
        "regionGross":[],
        "mainRevenue":[],
        "mainGross":[],
        "kdypRevenue":[],
        "kdypGross":[],
        "BDrevenue":[],
        "BDgross":[],
        "MKTrevenue":[],
        "MKTgross":[],
        "ajhRevenue":[],
        "ajhGross":[],

    }
    for(var key in dataGroupByDate){
        datas.date.push(key)
        var dataByDay=dataGroupByDate[key];

        var outRevenue=0;
        var outGross=0;
        var southRevenue=0;
        var southGross=0;
        var regionRevenue=0;
        var regionGross=0;
        var mainRevenue=0;
        var mainGross=0;
        var kdypRevenue=0;
        var kdypGross=0;
        var BDrevenue=0;
        var BDgross=0;
        var MKTrevenue=0;
        var MKTgross=0;
        var ajhRevenue=0;
        var ajhGross=0;

        dataByDay.forEach(function(e){

            switch (e.department){
                case "外采":
                    outRevenue= parseFloat(e.revenue);
                    outGross=parseFloat(e.gross);
                    break;
                case "华强南":
                    southRevenue= parseFloat(e.revenue);
                    southGross=parseFloat(e.gross);
                    break;
                case "大区":
                    regionRevenue=parseFloat(e.revenue)
                    regionGross=parseFloat(e.gross)
                    break;
                case "主营":
                    mainRevenue=parseFloat(e.revenue);
                    mainGross=parseFloat(e.gross);
                    break;
                case "口袋优品":
                    kdypRevenue=parseFloat(e.revenue)
                    kdypGross=parseFloat(e.gross);
                    break;
                case "BD":
                    BDrevenue=parseFloat(e.revenue)
                    BDgross=parseFloat(e.gross)
                    break
                case "MKT":
                    MKTrevenue=parseFloat(e.revenue)
                    MKTgross=parseFloat(e.gross)
                    break;
                case "爱机汇":
                    ajhRevenue=parseFloat(e.revenue)
                    ajhGross=parseFloat(e.gross)
            }
        })

        datas.outRevenue.push(outRevenue)
        datas.outGross.push(outGross)
        datas.southRevenue.push(southRevenue)
        datas.southGross.push(southGross)
        datas.regionRevenue.push(regionRevenue)
        datas.regionGross.push(regionGross)
        datas.mainRevenue.push(mainRevenue)
        datas.mainGross.push(mainGross)
        datas.kdypRevenue.push(kdypRevenue)
        datas.kdypGross.push(kdypGross)
        datas.BDrevenue.push(BDrevenue)
        datas.BDgross.push(BDgross)
        datas.MKTrevenue.push(MKTrevenue)
        datas.MKTgross.push(MKTgross)
        datas.ajhRevenue.push(ajhRevenue)
        datas.ajhGross.push(ajhGross)
    }
    return datas;
}

function renderRealChart(data) {
    var datas=formatDataForRealTime(data)

    var option1 = {
        title: {
            text: "营收额走势图",
            //x: 'center',
        },
        legend: {
            // top: 40,
            // padding:[40,0 ,0, 0],
            data: ['外采','华强南', '大区','主营','口袋优品','BD','MKT','爱机汇']
        },
        /* grid: {
         left: '10%',
         top: '20%',
         containLabel: true
         },*/
        xAxis: {
            type: "category",
            //name: "日期",
            data: datas.date
        },
        yAxis: {
            type: "value",
        },
        tooltip: {
            trigger: "axis",
        },
        series: [
            {
                name: '外采',
                type: 'line',
                data: datas.outRevenue

            },
            {
                name: "华强南",
                type: "line",
                data: datas.southRevenue

            },
            {
                name: "大区",
                type: "line",
                data: datas.regionRevenue

            },
            {
                name: "主营",
                type: "line",
                data: datas.mainRevenue

            },
            {
                name: "口袋优品",
                type: "line",
                data: datas.kdypRevenue

            },
            {
                name: "BD",
                type: "line",
                data: datas.BDrevenue

            },
            {
                name: "MKT",
                type: "line",
                data: datas.MKTrevenue

            },
            {
                name: "爱机汇",
                type: "line",
                data: datas.ajhRevenue
            }

        ]


    }
    var realtimeRevenueChart = echarts.init($("#realtimeRevenueChart").get(0));
    realtimeRevenueChart.setOption(option1);
    window.addEventListener("resize", realtimeRevenueChart.resize);

    var option2 = {
        title: {
            text: "毛利额走势图",
            //x: 'center',

        },
        legend: {
            // top: 40,
            // padding:[40,0 ,0, 0],
            data: ['外采','华强南', '大区','主营','口袋优品','BD','MKT','爱机汇']
        },
        /* grid: {
         left: '10%',
         top: '20%',
         containLabel: true
         },*/
        xAxis: [{
            type: "category",
            //name: "日期",
            data: datas.date
        }],
        yAxis: [{
            type: "value",
        }],
        tooltip: {
            trigger: "axis",
        },
        series: [
            {
                name: '外采',
                type: 'line',
                data: datas.outGross

            },
            {
                name: "华强南",
                type: "line",
                data: datas.southGross

            },
            {
                name: "大区",
                type: "line",
                data: datas.regionGross

            },
            {
                name: "主营",
                type: "line",
                data: datas.mainGross

            },
            {
                name: "口袋优品",
                type: "line",
                data: datas.kdypGross

            },
            {
                name: "BD",
                type: "line",
                data: datas.BDgross

            },
            {
                name: "MKT",
                type: "line",
                data: datas.MKTgross

            },
            {
                name: "爱机汇",
                type: "line",
                data: datas.ajhGross
            }
        ]


    }
    var realtimeGrossChart = echarts.init($("#realtimeGrossChart").get(0));
    realtimeGrossChart.setOption(option2);
    window.addEventListener("resize", realtimeGrossChart.resize);


}


function renderDate(){
    var dateGap = -14;
    var minDate = "2017-01-01";
    var endDate = new Date().getNewDate(-1);
    var startDate = new Date(endDate).getNewDate(dateGap);

    $(".duringDateLabel").html(startDate+"~"+endDate);
    $('.datePicker').daterangepicker(datePickerOptionsFunc(startDate,endDate,minDate,false), pickDateRangeCallback);

}

function pickDateRangeCallback(start, end, label) {
    console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.duringDateLabel').html(sdt+"~"+edt);
    renderRealTime()
}



