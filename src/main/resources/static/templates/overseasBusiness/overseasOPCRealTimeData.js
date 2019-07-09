Template.overseasOPCRealTimeData.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#OverseasBusinessUnitTab').addClass('active');
    $('#overseasOPC').addClass('active');
    $('#overseasOPCRealTimeData').addClass('active');
    if(isMobile()){
        $('.sidebar-toggle').click();
    }
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }
    drawPageTop();
    drawPage();
};

var drawPageTop = function(){
    var query = {
        "date": moment().format("YYYY-MM-DD"),
        "operationCenter": '14'
    };

    //收货量
    requestURL(dataService + "/overseas/getOptReceiveCnt", query).done(function (data) {
        if(data.statusText != undefined && data.statusText=='error'){

        }else{
            $("div[name='total-receipt-num']").lemCounter({
                value_to: data.length,
                value_from: 0,
                animate_duration: 3,
                locale: 'en-US'
            });
            if(data.length > 0){
                $('#total-receipt-num').attr("style","border:1px solid #eee;cursor:pointer;");
                $('#total-receipt-num').click(function(){
                    customModal("收货量",'modal','modalLabel',data,[{
                        field:'product_no',
                        title:'物品编号',
                        sortable:true
                    },{
                        field:'serial_no',
                        title:'采购单号',
                        sortable:true
                    },{
                        field:'receive_channel_no',
                        title:'收货方式',
                        sortable:true
                    }
                    ])
                });
            }
        }
    });

    //入库量
    requestURL(dataService + "/overseas/getOptInWarehouse", query).done(function (data) {
        if(data.statusText != undefined && data.statusText=='error'){

        }else{
            $("div[name='total-in-num']").lemCounter({
                value_to: accMul(data,1),
                value_from: 0,
                animate_duration: 3,
                locale: 'en-US'
            });
        }
    });

    //待入库量
    requestURL(dataService + "/overseas/getOptTodoInWarehouse", query).done(function (data) {
        if(data.statusText != undefined && data.statusText=='error'){

        }else{
            $("div[name='total-to-be-in-num']").lemCounter({
                value_to: data.length,
                value_from: 0,
                animate_duration: 3,
                locale: 'en-US'
            });
            if(data.length > 0){
                $('#total-to-be-in-num').attr("style","border:1px solid #eee;cursor:pointer;");
                $('#total-to-be-in-num').click(function(){
                    customModal("待入库量",'modal','modalLabel',data,[{
                        field: 'transfer_product_no',
                        title: '物品编号',
                        sortable:true
                    },{
                        field: 'transfer_dept',
                        title: '移交部门',
                        sortable:true
                    },{
                        field: 'serial_no',
                        title: '收货单号',
                        sortable:true
                    },{
                        field: 'receipt_dt',
                        title: '收货时间',
                        sortable:true
                    },{
                        field: 'operator_name',
                        title: '最后操作人',
                        sortable:true
                    },{
                        field: 'transfer_dt',
                        title: '最后操作时间',
                        sortable:true
                    }])
                });
            }
        }
    });

    //库存量
    requestURL(dataService + "/overseas/getOptInventoryCnt", query).done(function (data) {
        if(data.statusText != undefined && data.statusText=='error'){

        }else{
            $("div[name='total-house-num']").lemCounter({
                value_to: accMul(data.length,1),
                value_from: 0,
                animate_duration: 3,
                locale: 'en-US'
            });
            if(data.length > 0){
                $('#total-house-num').attr("style","border:1px solid #eee;cursor:pointer;");
                $('#total-house-num').click(function(){
                    customModal("库存量",'modal','modalLabel',data,[
                        {
                            field:'inventory_serial_number',
                            title:'物品编号',
                            sortable:true
                        },
                        {
                            field:'serial_no',
                            title:'采购单',
                            sortable:true
                        },
                        {
                            field:'document_item_modified_datetime',
                            title:'入库时间',
                            sortable:true
                        },
                        {
                            field:'inventory_sku_id',
                            title:'sku_id',
                            sortable:true
                        },
                        {
                            field:'inventory_sku_name',
                            title:'SKU名称',
                            sortable:true
                        },
                        {
                            field:'inventory_level_name',
                            title:'等级',
                            sortable:true
                        }
                    ])
                });
            }
        }
    });


    //待质检量
    requestURL(dataService + "/overseas/getWaitQualityCnt", query).done(function (data) {
        if(data.statusText != undefined && data.statusText=='error'){

        }else{
            $("div[name='total-waitQuality-num']").lemCounter({
                value_to: data.length,
                value_from: 0,
                animate_duration: 3,
                locale: 'en-US'
            });
            if(data.length > 0){
                $('#total-waitQuality-num').attr("style","border:1px solid #eee;cursor:pointer;");
                $('#total-waitQuality-num').click(function(){
                    customModal("待质检量",'modal','modalLabel',data,[
                        {
                            field:'product_no',
                            title:'物品编号',
                            sortable:true
                        },
                        {
                            field:'serial_no',
                            title:'外采单号',
                            sortable:true
                        },
                        {
                            field:'product_status',
                            title:'物品状态',
                            sortable:true
                        },
                        {
                            field:'transfer_dept',
                            title:'移交部门',
                            sortable:true
                        },
                        {
                            field:'operator_name',
                            title:'最后操作人',
                            sortable:true
                        },
                        {
                            field:'transfer_dt',
                            title:'最后操作时间',
                            sortable:true
                        }
                        ])
                });
            }
        }
    });

    //质检完成量
    requestURL(dataService + "/overseas/getQualityCompleteCnt", query).done(function (data) {
        if(data.statusText != undefined && data.statusText=='error'){

        }else{
            $("div[name='total-qualityComplete-num']").lemCounter({
                value_to: data.length,
                value_from: 0,
                animate_duration: 3,
                locale: 'en-US'
            });
            if(data.length > 0){
                $('#total-qualityComplete-num').attr("style","border:1px solid #eee;cursor:pointer;");
                $('#total-qualityComplete-num').click(function(){
                    customModal("质检完成量",'modal','modalLabel',data,[
                        {
                            field:'inspection_report_series_no',
                            title:'物品编号',
                            sortable:true
                        },
                        {
                            field:'inspection_type',
                            title:'质检类型',
                            sortable:true
                        },
                        {
                            field:'inspector_name',
                            title:'质检人员',
                            sortable:true
                        },
                        {
                            field:'inspection_dt',
                            title:'质检时间',
                            sortable:true
                        }
                    ])
                });
            }
        }
    });

};

var drawPage = function(){
    var query = {
        "date": moment().format("YYYY-MM-DD"),
        "operationCenter": '14'
    };
    //渲染质检数据-- 初检图
    requestURL(dataService + "/overseas/getFirstQualityInspectionData", query).done(function (data) {
        var inspectorStatsArrays = {
            inspectorNames: [],
            preInspection: [],
            inspectionSuccess: []
        };
        data.sort(function(a,b){
            return (parseInt(a.inspect_success)+ parseInt(a.wait_inspect))-(parseInt(b.inspect_success)+ parseInt(b.wait_inspect))
        }).forEach(function (e) {
            var name = e.name + "   ";
            inspectorStatsArrays.inspectorNames.push(name);
            inspectorStatsArrays.preInspection.push(-e.wait_inspect);
            inspectorStatsArrays.inspectionSuccess.push(e.inspect_success);
        });
        drawQualityInspectionChart(inspectorStatsArrays);
    });

    //渲染质检数据-抽检图
    requestURL(dataService + "/overseas/getSamplingInspectionData", query).done(function (data) {
        var waitMap = new Map();
        var inspectorStatsArrays = {
            inspectorNames: [],
            preInspection: [],
            inspectionSuccess: []
        };
        data.sort(function(a,b){
            return (parseInt(a.inspect_success)+ parseInt(a.wait_inspect))-(parseInt(b.inspect_success)+ parseInt(b.wait_inspect))
        }).forEach(function (e) {
            var name = e.name + "   ";
            waitMap.set(name,-e.wait_inspect);
            inspectorStatsArrays.inspectorNames.push(name);
            inspectorStatsArrays.preInspection.push(-e.wait_inspect);
            inspectorStatsArrays.inspectionSuccess.push(e.inspect_success);
        });
        drawSamplingChart(inspectorStatsArrays,waitMap);
    });


    //质检效率分时段
    requestURL(dataService + "/overseas/getQualityInspectionByHour", {"operationCenter": '14',"type":"first"}).done(function (data) {
        var operationNameList=  _.map(data,function(obj){return obj.name}).unique().sort();
        var inspectNameList = _.map(data,function(obj){return obj.inspector_name}).unique().sort();

        renderOptions("#inspectName",["全部"].concat(inspectNameList));

        drawQualityInspectionByHourChart(data);
        $("#search").click(function(obj){
            //根据是否是苹果进行堆积
            drawQualityInspectionByHourChart(data);
        })
    });
};

/**
 * 渲染质检图 -- 初检图
 */
var drawQualityInspectionChart = function(data){
    var option = {
        dataZoom: [
            {
                type: 'slider',
                startValue: data.inspectorNames.length-30,
                endValue: data.inspectorNames.length,
                yAxisIndex: [0]
            }
        ],
        animation: false,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['待验货','验货成功']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'value'
            }
        ],
        yAxis: [
            {
                type: 'category',
                axisTick: {show: true},
                data: data.inspectorNames,
                axisLabel: {
                    interval: 0
                }
            }
        ],
        color:['#c23531','#61a0a8'],
        series: [
            {
                name: '待验货',
                type: 'bar',
                stack: '总量',
                itemStyle: {
                    normal: {
                        label: {show: true, position: 'inside'}
                    }
                },
                data: data.preInspection
            },
            {
                name: '验货成功',
                type: 'bar',
                stack: '总量',
                itemStyle: {
                    normal: {
                        label: {show: true, position: 'right'}
                    }
                },
                data: data.inspectionSuccess
            }
        ]
    };
    var qualityInspectionChart = echarts.init(document.getElementById('qualityInspectionChart'));
    qualityInspectionChart.setOption(option);
    window.addEventListener('resize', qualityInspectionChart.resize);
};

/**
 * 渲染抽检图
 * @param data
 */
var drawSamplingChart = function(data,waitMap){
    var option = {
        /*title: {
            text: operationCenterName + '抽检人员实时数据',
            subtextStyle: {
                color: '#333',
                fontStyle: 'normal',
                fontWeight: 'bold'
            }
        },*/
        animation: false,
        tooltip: {
            trigger: 'item',
            axisPointer: {
                type: 'shadow'
            },
            formatter:function(item){

                var lineOne = item.name;
                var lineTwo = waitMap.get(item.name);
                var lineThree = item.value;
                var str = lineOne + '<br>'
                    + '待验货：' + lineTwo.toLocaleString() +'<br>'
                    + '验货成功：' + lineThree.toLocaleString() +'<br>';
                return str;
            }
        },
        legend: {
            data: ['待验货','验货成功']
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
                start: 0,
                end: 100
            }
        ],
        xAxis: [
            {
                type: 'value'
            }
        ],
        yAxis: [
            {
                type: 'category',
                axisTick: {show: true},
                data: data.inspectorNames,
                axisLabel: {
                    show: true,
                    interval: 0,
                    rotate: 0,
                    inside: false,
                    textStyle: {
                        fontWeight: '50',
                        color: '#000'
                    }
                }
            }
        ],
        color:['#c23531','#61a0a8'],
        series: [
            {
                name: '待验货',
                type: 'bar',
                stack: '总量',
                barWidth : 30,//柱图宽度
                itemStyle: {
                    normal: {
                        label: {show: true, position: 'inside'}
                    }
                },
                data: data.preInspection
            },
            {
                name: '验货成功',
                type: 'bar',
                stack: '总量',
                barWidth : 30,//柱图宽度
                itemStyle: {
                    normal: {
                        label: {show: true, position: 'right'}
                    }
                },
                data: data.inspectionSuccess
            }
        ]
    };
    var samplingChart = echarts.init(document.getElementById('samplingChart'));
    samplingChart.setOption(option);
    window.addEventListener('resize', samplingChart.resize);
};

/**
 * 渲染质检效率分时段图
 */
var drawQualityInspectionByHourChart = function(data){
    var operationName = $("#operationName").val();
    var inspectName = $("#inspectName").val();
    var data = _.filter(data,function(obj){
        return (obj.inspector_name==inspectName||inspectName=="全部");
    });

    var hourList = (_.map(data,function(obj){return obj.hour})).unique().sort();//所有时间
    var type = $("#type").val();
    var series = [];
    var dataByGroup = {};
    var hourAllLists=["06:30","07:30","08:30","09:30","10:30","11:30","12:30","13:30","14:30","15:30","16:30","17:30","18:30","19:30","20:30","21:30","22:30","24:00"];
    var obj = {};
    if(type=="质检类型/目的"){
        dataByGroup = (_.groupBy(data,function(obj){return obj.type}));
    }else if(type=="品类"){
        dataByGroup = (_.groupBy(data,function(obj){return obj.product_category_name}));//所有品类
    }else if(type=="品牌"){
        dataByGroup = (_.groupBy(data,function(obj){return obj.isApple}));//所有品牌
    }else{
        //全部
        dataByGroup = (_.groupBy(data,function(obj){return "全部"}));
    }
    for(var key in dataByGroup){
        if(!obj.hasOwnProperty(key)){
            obj[key]=[];
        }
        var dataBrandHour = _.groupBy(dataByGroup[key],function(obj){return obj.hour});
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
        });
    }

    for(var key in obj){
        series.push({
            name:key,
            type:'bar',
            barWidth : 35,//柱图宽度
            stack: 'bar',
            data: _.map(obj[key],function(ele){
                if(inspectName=="全部"){
                    return ele
                }else{
                    return Math.min(ele,70)
                }
            })
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

    var chart = echarts.init(document.getElementById('qualityInspectionByHourChart'));
    chart.clear();
    chart.setOption(option);
    window.addEventListener('resize',chart.resize)
};

var renderOptions = function(sel, data) {
    $(sel).empty();
    data.forEach(function (ele) {
        $(sel).append("<option value='" + ele + "'>" + ele + "</option>")
    });
};

function customModal(title,modelSelector,titleSelector,data,columns){
    $("#"+modelSelector).off('shown.bs.modal').on('shown.bs.modal', function () {
        $("#"+titleSelector).text(title);
        $("#tableView").bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            search: true,
            pageList: [5, 10, 20, 50, 100, 200],
            data:data,
            columns: columns
        });
    });
    $("#"+modelSelector).modal();
}