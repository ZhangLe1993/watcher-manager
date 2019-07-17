Template.InspectionEffectHour.rendered = function () {
    /*$('.navi-tab').removeClass('active');
    $('#operation').addClass('active');
    $('#shanghaiInspectionEffectHour').addClass('active');*/

    updateStats();
};

function renderOptions(sel, data) {
    $(sel).empty();
    data.forEach(function (ele) {
        $(sel).append("<option value='" + ele + "'>" + ele + "</option>")
    });
}

var drawChart =function(data){
    var operationName = $("#operationName").val()
    var inspectName = $("#inspectName").val()
    var data = _.filter(data,function(obj){
        return (obj.name==operationName||operationName=="全部")&&(obj.inspector_name==inspectName||inspectName=="全部")
    });

    // var hourList = _.unique(_.map(data,function(obj){return obj.hour})).sort()//所有时间
    var hourList = _.unique(_.map(data,function(obj){return obj.hour}))//所有时间
    var type = $("#type").val();
    var series = [];
    var dataByGroup = {};
    var hourAllLists=["06:30","07:30","08:30","09:30","10:30","11:30","12:30","13:30","14:30","15:30","16:30","17:30","18:30","19:30","20:30","21:30","22:30","24:00"]
    var obj = {}
    if(type=="质检类型/目的"){
        dataByGroup = (_.groupBy(data,function(obj){return obj.type}))
    }else if(type=="品类"){
        dataByGroup = (_.groupBy(data,function(obj){return obj.product_category_name}))//所有品类
    }else if(type=="品牌"){
        dataByGroup = (_.groupBy(data,function(obj){return obj.isApple}))//所有品牌
    }else{
        //全部
        dataByGroup = (_.groupBy(data,function(obj){return "全部"}))
    }
    for(var key in dataByGroup){
        if(!obj.hasOwnProperty(key)){
            obj[key]=[]
        }
        var dataBrandHour = _.groupBy(dataByGroup[key],function(obj){return obj.hour})
        hourAllLists.forEach(function(hour){
            if(hourList.contains(hour)){
                var tmpData = dataBrandHour[hour];
                //存在
                if(tmpData){
                    obj[key].push(_.reduce(tmpData,function(num, tmp){ return num + 1 }, 0))
                }else{
                    obj[key].push(0)
                }
            }else{
                obj[key].push(0)
            }
        })
    }

    for(var key in obj){
        series.push({
            name:key,
            type:'bar',
            stack: 'bar',
            data: _.map(obj[key],function(ele){
                if(inspectName=="全部"){
                    return ele
                }else{
                    return Math.min(ele,70)
                }
            }),
            /*itemStyle: {
                normal: {
                    label: {
                        show: true,
                    }
                }
            }*/
        })
    }

    var option = {
        title:{
            text: '初检堆积图',
            x: "center",
            //padding:[0,0,0,30]
        },
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data: _.keys(obj),
            padding: [25,0,0,0]
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top:'20%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                data :hourAllLists
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        series : series
    };

    var chart = echarts.init(document.getElementById('chart'));
    chart.clear();
    chart.setOption(option);
    window.addEventListener('resize',chart.resize)
};

var drawChartRecheck =function(data){
    var operationName = $("#operationNameRecheck").val()
    var inspectName = $("#inspectNameRecheck").val()
    var data = _.filter(data,function(obj){
        return (obj.name==operationName||operationName=="全部")&&(obj.inspector_name==inspectName||inspectName=="全部")
    });
    // var hourList = (_.map(data,function(obj){return obj.hour})).unique().sort()//所有时间
    var hourList = _unique(_.map(data,function(obj){return obj.hour}))//所有时间
    var type = $("#typeRecheck").val();
    var series = [];
    var dataByGroup = {};
    var hourAllLists=["06:30","07:30","08:30","09:30","10:30","11:30","12:30","13:30","14:30","15:30","16:30","17:30","18:30","19:30","20:30","21:30","22:30","24:00"]
    var obj = {}
    if(type=="质检类型/目的"){
        dataByGroup = (_.groupBy(data,function(obj){return obj.type}))
    }else if(type=="品类"){
        dataByGroup = (_.groupBy(data,function(obj){return obj.product_category_name}))//所有品类
    }else if(type=="品牌"){
        //苹果非苹果
        dataByGroup = (_.groupBy(data,function(obj){return obj.isApple}))//所有品牌
    }else{
        //全部
        dataByGroup = (_.groupBy(data,function(obj){return "全部"}))
    }
    for(var key in dataByGroup){
        if(!obj.hasOwnProperty(key)){
            obj[key]=[]
        }
        var dataBrandHour = _.groupBy(dataByGroup[key],function(obj){return obj.hour})
        hourAllLists.forEach(function(hour){
            if(hourList.contains(hour)){
                var tmpData = dataBrandHour[hour];
                //存在
                if(tmpData){
                    obj[key].push(_.reduce(tmpData,function(num, tmp){ return num + 1 }, 0))
                }else{
                    obj[key].push(0)
                }
            }else{
                obj[key].push(0)
            }
        })
    }
    for(var key in obj){
        series.push({
            name:key,
            type:'bar',
            stack: 'bar',
            data:_.map(obj[key],function(ele){
                if(inspectName=="全部"){
                    return ele
                }else{
                    return Math.min(ele,70)
                }
            }),
        })
    }

    var option = {
        title:{
            text: '复检堆积图',
            x: "center",
            //padding:[0,0,0,30]
        },
        tooltip : {
            trigger: 'axis',
            axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
            }
        },
        legend: {
            data: _.keys(obj),
            padding: [25,0,0,0]
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            top:'20%',
            containLabel: true
        },
        xAxis : [
            {
                type : 'category',
                data :hourAllLists
            }
        ],
        yAxis : [
            {
                type : 'value',
            }
        ],
        series : series
    };

    var chart = echarts.init(document.getElementById('chartRecheck'));
    chart.clear();
    chart.setOption(option);
    window.addEventListener('resize',chart.resize)
};

var updateStats = function () {

    var operationCenter = Template.OperationCenter;
    var operationCenterName = "";
    switch (parseInt(operationCenter)) {
        case 1:
            $('#shanghaiInspectionEffectHour').addClass('active');
            $('#shanghaiOperationCenter').addClass('active');
            operationCenterName = "上海";
            break;
        case 12:
            $('#shanghaiTestInspectionEffectHour').addClass('active');
            $('#shanghaiTestOperationCenter').addClass('active');
            operationCenterName = "上海(流程测试专用)";
            break;
        case 2:
            $('#beijingInspectionEffectHour').addClass('active');
            $('#beijingOperationCenter').addClass('active');
            operationCenterName = "北京";
            break;
        case 3:
            $('#chengduInspectionEffectHour').addClass('active');
            $('#chengduOperationCenter').addClass('active');
            operationCenterName = "成都";
            break;
        case 4:
            $('#shenzhenInspectionEffectHour').addClass('active');
            $('#shenzhenOperationCenter').addClass('active');
            operationCenterName = "深圳(物流)";
            break;
        case 16:
            $('#shenzhenNewInspectionEffectHour').addClass('active');
            $('#shenzhenNewOperationCenter').addClass('active');
            operationCenterName = "深圳";
            break;
        case 21:
            $('#shenzhenTestInspectionEffectHour').addClass('active');
            $('#shenzhenTestOperationCenter').addClass('active');
            operationCenterName = "深圳(流程测试专用)";
            break;
        case 5:
            $('#tianjinInspectionEffectHour').addClass('active');
            $('#tianjinOperationCenter').addClass('active');
            operationCenterName = "天津";
            break;
        case 6:
            $('#wuhanInspectionEffectHour').addClass('active');
            $('#wuhanOperationCenter').addClass('active');
            operationCenterName = "武汉";
            break;
        case 10:
            $('#changzhouInspectionEffectHour').addClass('active');
            $('#changzhouOperationCenter').addClass('active');
            operationCenterName = "常州";
            break;
        case 18:
            $('#changzhouTestInspectionEffectHour').addClass('active');
            $('#changzhouTestOperationCenter').addClass('active');
            operationCenterName = "常州(流程测试专用)";
            break;
        case 0:
            $('#chinaInspectionEffectHour').addClass('active');
            $('#chinaOperationCenter').addClass('active');
            operationCenterName = "全国";
            break;
        default:
            break;
    }


    //初检
    requestURL(dataService + "/operationCenter/getCheckByHour", {
        "operationCenter": operationCenter,
        "type":"first"
    }).done(function (data) {
        // var operationNameList=  _.unique(_.map(data,function(obj){return obj.name})).sort();
        var operationNameList=  _.unique(_.map(data,function(obj){return obj.name}));
        // var inspectNameList = _.map(data,function(obj){return obj.inspector_name}).unique().sort();
        var inspectNameList = _.unique(_.map(data,function(obj){return obj.inspector_name}));
        renderOptions("#operationName",["全部"].concat(operationNameList));
        renderOptions("#inspectName",["全部"].concat(inspectNameList));

        drawChart(data)
        $("#search").click(function(obj){
            //根据是否是苹果进行堆积
            drawChart(data)
        })
    });
    //复检
    /*requestURL(dataService + "/operationCenter/getCheckByHour", {
        "operationCenter": operationCenter,
        "type":"recheck"
    }).done(function (data) {
        var operationNameList=  _.map(data,function(obj){return obj.name}).unique().sort();
        var inspectNameList = _.map(data,function(obj){return obj.inspector_name}).unique().sort();
        renderOptions("#operationNameRecheck",["全部"].concat(operationNameList));
        renderOptions("#inspectNameRecheck",["全部"].concat(inspectNameList));


        drawChartRecheck(data)
        $("#searchRecheck").click(function(obj){
            //根据是否是苹果进行堆积
            drawChartRecheck(data)
        })
    });*/
};