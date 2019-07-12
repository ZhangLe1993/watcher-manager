Template.eventTrackingPvUvStatistics.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#webtraffic').addClass('active');
    $('#eventTrackingPvUvStatistics').addClass('active');

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var dateGap = -9;
    var endDate = new Date().getNewDate(-1);
    var startDate = new Date(endDate).getNewDate(dateGap);
    var minDate=new Date(endDate).getNewDate(-90);

    $(".dateSelectLabel").html(startDate + "~" + endDate);
    $('.webTrafficFunnelDate').daterangepicker(datePickerOptionsFunc(startDate,endDate,minDate,false), pickWebTrafficFunnelDateRangeCallback);

    $("#dailyTrafficStackChart").hide();
    $("#ctable").hide();
    $("#loading").hide();

    $(".search").click(function () {
        console.log("test    ")
        var filter = getSelectedFilter();
        if(filter!=undefined){
            renderPage(filter);
            renderTable(filter);
        }
    });

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


// var dataService = Meteor.settings.public.dataService.baseUrl;


function getSelectedFilter() {

    var dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g, "").split("~");
    var startDate = dt[0];
    var endDate = dt[1];

    //拿到输入框内容进行判断
    var actionName = $(".actionName").val();
    var actionEvent = $(".actionEvent").val();
    var actionCategory = $(".actionCategory").val();
    if( actionName == "" && actionEvent == "" && actionCategory == ""){

        alert("请输入查询条件!");
        return;
    }

    var filter = {
        "startDate": startDate,
        "endDate": endDate,
        "actionName": actionName.toLowerCase(),
        "actionEvent":actionEvent.toLowerCase(),
        "actionCategory":actionCategory.toLowerCase()
    };

    return filter;
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


function renderPage(filter) {
    //var dateGap = -15;
    $("#dailyTrafficStackChart").hide();
    $("#ctable").hide();
    $("#loading").show();
    var promise = getEvenTrackingPagePvUvTrafficDataDay(filter);
    promise.done(function (ret) {
        $("#dailyTrafficStackChart").show();
        $("#ctable").show();
        $("#loading").hide();
        drawDailyTrafficStackChart(ret);
        //renderTable
    });
}

function renderTable(filter) {

    var ajaxQuery = _.clone(filter);
    $('#table').bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        pagination: true,
        sidePagination: 'server',
        ajax:function(params){
            var ajaxParams = $.extend(ajaxQuery,params.data);
            //$("#ctable").hide();
            getEvenTrackingPagePvUvTrafficDataPagination(ajaxParams).done(function(data){
                //$("#ctable").show();
                params.success(data)
            });
        },
        //fixRow:fixRow,
        cdataExport:"cdataExport",
        columns: [{
            field: 'date',
            title: '日期',
            sortable:true
        },{
            field: 'idsite',
            title: '平台',
            sortable:true
        },{
            field: 'actionName',
            title: 'e_n',
            sortable:true
        },{
            field: 'actionEvent',
            title: 'e_a',
            sortable:true
        },{
            field: 'actionCategory',
            title: 'e_c',
            sortable:true
        },{
            field: 'pv',
            title: '页面访客数(PV)',
            sortable:true
        },{
            field: 'uv',
            title: '访客数(UV)',
            sortable:true
        }],
    });
    $("#cdataExport").click(function(){
        var query = _.clone(filter);
        var sdt = moment(query.startDate);
        var edt = moment(query.endDate);
        var dflag = sdt.add(1,'month')<=edt;
        if(dflag){
            alert("导出文件最长间隔时间为1个月");
            return;
        }


        $("#wholePage").mask({'label':"请等待，文件正在导出..."});
        delete query["dateType"];
        requestURL(dataService+"/product/exportEvenTrackingPagePvUvTrafficDataPagination",query).done(function(obj){
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

function getEvenTrackingPagePvUvTrafficDataDay(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    //发送请求从后端拿数据
    requestURL(dataService + "/product/getEvenTrackingPagePvUvTrafficDataDay", query).done(function (ret) {dfd.resolve(ret)});
    return dfd.promise()
}

function  getEvenTrackingPagePvUvTrafficDataPagination(filter){
    //clean parameters
    //var query = cleanParams(filter);
    //only get one day important!!!
    var query = _.clone(filter);
    //query.startDate = query.endDate;
    var flag = query["dateType"];
    delete query["dateType"];
    var dfd = $.Deferred();
    requestURL(dataService+"/product/getEvenTrackingPagePvUvTrafficDataPagination",query).done(function(ret){
        dfd.resolve(ret)
    });
    return dfd.promise()
}



//根据日期把PV、UV进行统计出
function totalPvUv(data,dt){
    var uv=0,pv=0;
    data.forEach(function(e){
        switch(e.date){
            case dt:
                uv+= e.uv;
                pv+= e.pv;
                break;
        }
    });
    return [uv,pv];
}


function drawDailyTrafficStackChart(obj) {

    var xAxis_data = [];
    var series = {
        pv: [],
        uv: []
    };


    obj.forEach(function (e) {
            xAxis_data.push(e.date);
            series.uv.push(totalPvUv(obj,e.date)[0]);
            series.pv.push(totalPvUv(obj,e.date)[1]);
    });

    var option = {
        title: {
            text: '折线图堆叠',
            x: "center",
            padding: [0, 0, 0, 50]
            //y:"bottom"
        },
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            data: ['页面访客数', '访客数'],
            padding: [25, 0, 0, 0]
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
            data: xAxis_data
        },
        yAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: '页面访客数',
                type: 'line',
                //stack: '总量',
                data: series.pv
            }, {
                name: '访客数',
                type: 'line',
                //stack: '总量',
                data: series.uv
            }
        ]
    };
    var dailyTrafficStackChart = echarts.init(document.getElementById('dailyTrafficStackChart'));
    dailyTrafficStackChart.setOption(option);
    window.addEventListener('resize', dailyTrafficStackChart.resize)
}

