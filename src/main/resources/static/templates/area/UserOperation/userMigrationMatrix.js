Template.userMigrationMatrix.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#distinct').addClass('active');
    $('#userOperationDataInfoTab').addClass('active');
    $('#userMigrationMatrix').addClass('active');

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }

    var minWeekDate = "2016-07-03";
    var minMonthDate = "2016-07-01";
    var endWeekDate = moment().subtract(2, 'week').startOf('week').format("YYYY-MM-DD");
    var endMonthDate = moment().subtract(1, 'month').startOf('month').format("YYYY-MM-DD");

    $(".weekSelectLabel").html(endWeekDate);
    $('.webTrafficFunnelWeek').daterangepicker(weekDatePickerOptionsFunc(endWeekDate,endWeekDate,minWeekDate,true), pickWebTrafficFunnelWeekRangeCallback);

    $(".monthSelectLabel").html(endMonthDate);
    $('.webTrafficFunnelMonth').daterangepicker(monthDatePickerOptionsFunc(endMonthDate,endMonthDate,minMonthDate,true), pickWebTrafficFunnelMonthRangeCallback);


    $(".webTrafficFunnelWeek").show();
    $(".webTrafficFunnelMonth").hide();
    $(".dateType").on('change',function(){
        var dateType =$(this).val();
        if(dateType=="weekly"){
            $(".webTrafficFunnelWeek").show();
            $(".webTrafficFunnelMonth").hide();
            dt = $('.desktop-only .weekSelectLabel').text();
            var endDate = dt;
            var source = $(this).parent().find(".source").val();
            var type = $(this).parent().find(".type").val();

            var query = {
                "dateType":dateType,
                "endDate": endDate,
                "source":source,
                "type":type
            };

            renderPage(query)
        }else if(dateType=="monthly"){
            $(".webTrafficFunnelWeek").hide();
            $(".webTrafficFunnelMonth").show();
            dt = $('.desktop-only .monthSelectLabel').text();
            var endDate = dt;
            var source = $(this).parent().find(".source").val();
            var type = $(this).parent().find(".type").val();

            var query = {
                "dateType":dateType,
                "endDate": endDate,
                "source":source,
                "type":type
            };

            renderPage(query)
        }
    });

    var dateType=$(".dateType").val();
    var dt = $('.desktop-only .monthSelectLabel').text();
    var endDate = dt;
    var source = $(".source").val();
    var type = $(".type").val();

    var query = {
        "dateType":dateType,
        "endDate": endDate,
        "source":source,
        "type":type
    };

    console.log(query);

    //数据初始化加载
    renderPage(query);

    $(".search").click(function(){
        var dateType=$(".dateType").val();
        /*周数*/
        dt = $('.desktop-only .weekSelectLabel').text();
        var endDateWeek = dt;
        /*月数*/
        dt = $('.desktop-only .monthSelectLabel').text();
        var endDateMonth = dt;

        var source = $(this).parent().find(".source").val();
        var type = $(this).parent().find(".type").val();

        var query = {
            "dateType":dateType,
            "endDate": (dateType=="weekly")?endDateWeek:endDateMonth,
            "source":source,
            "type":type
        };

        renderPage(query);
    });
};

function pickWebTrafficFunnelWeekRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.weekSelectLabel').html(edt);
}

function pickWebTrafficFunnelMonthRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.monthSelectLabel').html(edt);
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
    //var dateGap = -15;
    //debugger;
    $("#chartContent").hide();
    $("#loading").show();
    var promise = getUserMigrationMatrixDataInfo(filter);
    promise.done(function(ret){
        $("#chartContent").show();
        $("#loading").hide();

        drawtrafficFunnelChart(ret);
    });

}

function getUserMigrationMatrixDataInfo(filter){
    //clean parameters
    var query = _.clone(filter);
    delete query["userId"];
    delete query["sign"];
    var dfd = $.Deferred();
    requestURL(dataService+"/area/getUserMigrationMatrixDataInfo",query).done(function(ret){
        dfd.resolve(ret)
    });
    return dfd.promise()
}

/*订单量饼图*/
function drawtrafficFunnelChart(ret) {

    var levelX = ['active high value', 'active mid value', 'silent', 'churn', 'zero or negtive profit','others'];
    var levelY = ['active high value', 'active mid value', 'silent', 'churn', 'zero or negtive profit','others'];

    var data=[];
    var tempValue=[];
    ret.forEach(function(e){
        var tempData=[];
        tempData.push(e.this_cluster_tag);
        tempData.push(e.next_cluster_tag);
        if($(".type").val()=="recency"){
            if((e.cluster_tag_num/ e.cluster_tag_total_num)!=undefined) {
                tempData.push(((e.cluster_tag_num / e.cluster_tag_total_num) * 100).toFixed(2));
                tempValue.push(Math.ceil((e.cluster_tag_num / e.cluster_tag_total_num) * 100));
            }
        }else if($(".type").val()=="profit"){
            tempData.push(e.cluster_tag_num);
            tempValue.push(parseFloat(e.cluster_tag_num));
        }
        data.push(tempData);
    });
    var tempMaxValue= (_.max(tempValue)==-Infinity)?1:_.max(tempValue);
    var tempMinValue= (_.min(tempValue)==Infinity)?0:_.min(tempValue);

    //var data = [[0,0,5],[0,1,1],[0,2,0],[0,3,0],[0,4,0],[0,5,0],[0,6,0],[0,7,0],[0,8,0],[0,9,0],[0,10,0],[0,11,2],[0,12,4],[0,13,1],[0,14,1],[0,15,3],[0,16,4],[0,17,6],[0,18,4],[0,19,4],[0,20,3],[0,21,3],[0,22,2],[0,23,5],[1,0,7],[1,1,0],[1,2,0],[1,3,0],[1,4,0],[1,5,0],[1,6,0],[1,7,0],[1,8,0],[1,9,0],[1,10,5],[1,11,2],[1,12,2],[1,13,6],[1,14,9],[1,15,11],[1,16,6],[1,17,7],[1,18,8],[1,19,12],[1,20,5],[1,21,5],[1,22,7],[1,23,2],[2,0,1],[2,1,1],[2,2,0],[2,3,0],[2,4,0],[2,5,0],[2,6,0],[2,7,0],[2,8,0],[2,9,0],[2,10,3],[2,11,2],[2,12,1],[2,13,9],[2,14,8],[2,15,10],[2,16,6],[2,17,5],[2,18,5],[2,19,5],[2,20,7],[2,21,4],[2,22,2],[2,23,4],[3,0,7],[3,1,3],[3,2,0],[3,3,0],[3,4,0],[3,5,0],[3,6,0],[3,7,0],[3,8,1],[3,9,0],[3,10,5],[3,11,4],[3,12,7],[3,13,14],[3,14,13],[3,15,12],[3,16,9],[3,17,5],[3,18,5],[3,19,10],[3,20,6],[3,21,4],[3,22,4],[3,23,1],[4,0,1],[4,1,3],[4,2,0],[4,3,0],[4,4,0],[4,5,1],[4,6,0],[4,7,0],[4,8,0],[4,9,2],[4,10,4],[4,11,4],[4,12,2],[4,13,4],[4,14,4],[4,15,14],[4,16,12],[4,17,1],[4,18,8],[4,19,5],[4,20,3],[4,21,7],[4,22,3],[4,23,0],[5,0,2],[5,1,1],[5,2,0],[5,3,3],[5,4,0],[5,5,0],[5,6,0],[5,7,0],[5,8,2],[5,9,0],[5,10,4],[5,11,1],[5,12,5],[5,13,10],[5,14,5],[5,15,7],[5,16,11],[5,17,6],[5,18,0],[5,19,5],[5,20,3],[5,21,4],[5,22,2],[5,23,0],[6,0,1],[6,1,0],[6,2,0],[6,3,0],[6,4,0],[6,5,0],[6,6,0],[6,7,0],[6,8,0],[6,9,0],[6,10,1],[6,11,0],[6,12,2],[6,13,1],[6,14,3],[6,15,4],[6,16,0],[6,17,0],[6,18,0],[6,19,0],[6,20,1],[6,21,2],[6,22,2],[6,23,6]];

    data = data.map(function (item) {
        return [item[1], item[0], item[2] || '-'];
    });

    var option = {
        tooltip: {
            position: 'top',
            formatter:function(params,ticket,callback){
                if($(".type").val()=="recency") {
                    var str = params.seriesName + '<br/>' + "用户数：" + params.data[0] + "," + params.data[1] + "," + params.data[2] + "%"
                    return str;
                }else if($(".type").val()=="profit"){
                    var str = params.seriesName + '<br/>' + "金额：" + params.data[0] + "," + params.data[1] + "," + params.data[2] + "元"
                    return str;
                }
            }
        },
        animation: false,
        grid: {
            height: '70%',
            y: '5%'
        },
        xAxis: {
            type: 'category',
            name:'本周期',
            data: levelX,
            splitArea: {
                show: true
            }
        },
        yAxis: {
            type: 'category',
            name:'上周期',
            data: levelY,
            splitArea: {
                show: true
            }
        },
        visualMap: {
            min: tempMinValue,
            max: tempMaxValue,
            calculable: true,
            orient: 'horizontal',
            left: 'center',
            bottom: '1%'
        },
        series: [{
            name: '用户迁移数据',
            type: 'heatmap',
            data: data,
            label: {
                normal: {
                    show: true,
                    color:'#000000'
                }
            },
            itemStyle: {
                emphasis: {
                    shadowBlur: 10,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }]
    };
    var trafficFunnelChart = echarts.init(document.getElementById('trafficFunnelChart'));
    trafficFunnelChart.setOption(option);
    window.addEventListener('resize',trafficFunnelChart.resize)
}

