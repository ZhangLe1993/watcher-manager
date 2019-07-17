/**
 * @author yule.zhang
 */
Template.operationRealTimeData.rendered = function () {
    $('.navi-tab').removeClass('active');
    if(isMobile()){
        $('.sidebar-toggle').click();
    }

    var operationCenter = Template.OperationCenter;
    var operationCenterName = "";
    drawPage(operationCenter);
};
var drawPage = function(operationCenter){
    setTopLoading();
    requestURL(dataService + "/operationCenter/getRealTimeDataCacheUpdateTime", {"operationCenter":operationCenter}).done(function (data) {
        console.log("更新时间：" + data);
        $("#cacheUpdateTime").html(data);
    });
    //收货
    requestURL(dataService + "/operationCenter/receiveGoods", {"operationCenter":operationCenter}).done(function (data) {
        if(data.statusText != undefined && data.statusText == 'error'){
            $("#receiveGoodsChart").html("<span class='none-span'>今日暂无!</span>");
        }else{
            var res = {mode:['物流收货','代拍收货','采购收货','调拨收货','退货收货'],num:[0,0,0,0,0]};
            if(data.length > 0) {
                _.each(data,function(ele) {
                    if(ele['receive_id'].indexOf('物流') > -1) {
                        res.num[0] = accMul(ele['receipt_cnt'],1);
                    } else if(ele['receive_id'].indexOf('代拍') > -1) {
                        res.num[1] = accMul(ele['receipt_cnt'],1);
                    } else if(ele['receive_id'].indexOf('采购') > -1) {
                        res.num[2] = accMul(ele['receipt_cnt'],1);
                    } else if(ele['receive_id'].indexOf('调拨') > -1) {
                        res.num[3] = accMul(ele['receipt_cnt'],1);
                    } else if(ele['receive_id'].indexOf('退货') > -1) {
                        res.num[4] = accMul(ele['receipt_cnt'],1);
                    }
                });
            }
            document.getElementById('receiveGoodsChart').setAttribute('_echarts_instance_', '');
            drawPublicChart('receiveGoodsChart','收货量',res);
            //求和
            var total = _.reduce(res.num,function(num,temp){return num + temp},0);
            cancelLoading('receiveGoods');
            $("#receiveGoodsNum").html(total.toLocaleString());
        }
    });

    //质检和抽检
    requestURL(dataService + "/operationCenter/qualityAndRandomCheck", {"operationCenter":operationCenter}).done(function (data) {
        if(data.statusText != undefined && data.statusText == 'error'){
            $("#qualityCheckChart").html("<span class='none-span'>今日暂无!</span>");
            $("#randomCheckChart").html("<span class='none-span'>今日暂无!</span>");
        }else{
            //物流收货
            var logistics = _.filter(data,function(ele){ return ele['ins_type'].indexOf("物流收货") > -1});
            //代拍收货
            var act = _.filter(data,function(ele){ return ele['ins_type'].indexOf("代拍收货") > -1});
            //调拨收货
            var allocation = _.filter(data,function(ele){ return ele['ins_type'].indexOf("调拨收货") > -1});

            var qualityCheckRes = getQualityCheckData(logistics,act,allocation);
            document.getElementById('qualityCheckChart').setAttribute('_echarts_instance_', '');
            drawQualityCheckChart(qualityCheckRes);

            var randomCheckRes = getRandomCheckData(logistics,act,allocation);
            document.getElementById('randomCheckChart').setAttribute('_echarts_instance_', '');
            drawRandomCheckChart(randomCheckRes);

            //质检总数
            var qualityCheckTotalData = _.filter(data,function(ele){ return (ele['ins_type'].indexOf("定级质检等级") > -1 || ele['ins_type'].indexOf("退货质检等级") > -1 || ele['ins_type'].indexOf("仓库抽检等级") > -1 || ele['ins_type'].indexOf("备件质检等级") > -1); });
            var qualityCheckTotal = _.reduce(qualityCheckTotalData,function(num,temp){ return num + accMul(temp['inspection_cnt'],1)},0);
            cancelLoading('qualityCheck');
            $("#qualityCheckNum").html(qualityCheckTotal.toLocaleString());

            //抽检总数
            var randomCheckTotalData = _.filter(data,function(ele){ return (ele['ins_type'].indexOf("IPQC") > -1 || ele['ins_type'].indexOf("RQC") > -1 || ele['ins_type'].indexOf("UQC") > -1 || ele['ins_type'].indexOf("优品复检") > -1); });
            var randomCheckTotal =  _.reduce(randomCheckTotalData,function(num,temp){ return num + accMul(temp['inspection_cnt'],1)},0);
            cancelLoading('randomCheck');
            $("#randomCheckNum").html(randomCheckTotal.toLocaleString());
        }
    });

    //入库
    requestURL(dataService + "/operationCenter/inHouse", {"operationCenter":operationCenter}).done(function (data) {
        if(data.statusText != undefined && data.statusText == 'error'){
            $("#inHouseChart").html("<span class='none-span'>今日暂无!</span>");
        }else{
            var res = {mode:['理货入库','调拨入库','其他入库'],num:[0,0,0]};
            if(data.length > 0) {
                _.each(data,function(ele){
                    if(ele['category'].indexOf('理货入库') > -1){
                        res.num[0] += accMul(ele['in_cnt'],1);
                    } else if(ele['category'].indexOf('暂存入库') > -1){
                        res.num[0] += accMul(ele['in_cnt'],1);
                    } else if(ele['category'].indexOf('调拨入库') > -1){
                        res.num[1] = accMul(ele['in_cnt'],1);
                    } else {
                        res.num[2] += accMul(ele['in_cnt'],1);
                    }
                });
            }
            document.getElementById('inHouseChart').setAttribute('_echarts_instance_', '');
            drawPublicChart('inHouseChart','入库量',res);
            //入库总量
            var total = _.reduce(res.num,function(num,temp){ return num + temp},0);
            cancelLoading('inHouse');
            $("#inHouseNum").html(total.toLocaleString());
        }
    });

    //出库
    requestURL(dataService + "/operationCenter/outHouse", {"operationCenter":operationCenter}).done(function (data) {
        if(data.statusText != undefined && data.statusText == 'error'){
            $("#outHouseChart").html("<span class='none-span'>今日暂无!</span>");
        }else {
            var res = {mode:['商家竞价出库','小爱优品出库','抽检出库','调拨出库','退货出库','其他出库'],num:[0,0,0,0,0,0]};
            if(data.length > 0){
                _.each(data,function(ele){
                    if(ele['category'].indexOf('商家竞价出库') > -1){
                        res.num[0] = accMul(ele['out_cnt'],1);
                    }else if(ele['category'].indexOf('小爱优品出库') > -1){
                        res.num[1] = accMul(ele['out_cnt'],1);
                    }else if(ele['category'].indexOf('抽检出库') > -1){
                        res.num[2] = accMul(ele['out_cnt'],1);
                    }else if(ele['category'].indexOf('调拨出库') > -1){
                        res.num[3] = accMul(ele['out_cnt'],1);
                    }else if(ele['category'].indexOf('退货出库') > -1){
                        res.num[4] = accMul(ele['out_cnt'],1);
                    }else{
                        res.num[5] += accMul(ele['out_cnt'],1);
                    }
                });
            }
            document.getElementById('outHouseChart').setAttribute('_echarts_instance_', '');
            drawPublicChart('outHouseChart','出库量',res);
            //出库总量
            var total = _.reduce(res.num,function(num,temp){ return num + temp},0);
            cancelLoading('outHouse');
            $("#outHouseNum").html(total.toLocaleString());
        }
    });

    //发货
    requestURL(dataService + "/operationCenter/sendGoods", {"operationCenter":operationCenter}).done(function (data) {
        if(data.statusText != undefined && data.statusText == 'error'){
            $("#sendGoodsChart").html("<span class='none-span'>今日暂无!</span>");
        }else{
            if(data.length == 0){
                $("#sendGoodsChart").html("<span class='none-span'>今日暂无!</span>");
                cancelLoading('sendGoods');
                $("#sendGoodsNum").html(0);
                return;
            }
            var map = _.groupBy(data,'serial_no');
            var legendArr = [];
            var mapArray = [];
            _.each(map,function(value,key){
                legendArr.push(key);
                mapArray.push({'name':key,'value':_.reduce(value,function(num,temp){ return num + accMul(temp.in_out_cnt,1)},0)});
            });
            document.getElementById('sendGoodsChart').setAttribute('_echarts_instance_', '');
            drawSendGoodsChart('sendGoodsChart',legendArr,mapArray);

            //发货总量
            var total = _.reduce(data,function(num,temp){ return num + accMul(temp['in_out_cnt'],1)},0);
            cancelLoading('sendGoods');
            $("#sendGoodsNum").html(total.toLocaleString());
        }
    });

    //异常
    requestURL(dataService + "/operationCenter/exception", {"operationCenter":operationCenter}).done(function (data) {
        if(data.statusText != undefined && data.statusText == 'error'){
            $("#exceptionChart").html("<span class='none-span'>今日暂无!</span>");
        }else {
            var res = {mode:["新增","处理","库存"],num:[0,0,0]};
            if(data.length > 0){
                res.num[0] = (data[0]['num_add']*1) == undefined ? 0 : (data[0]['num_add']*1);
                res.num[1] = (data[0]['num_deal']*1) == undefined ? 0 : (data[0]['num_deal']*1);
                res.num[2] = (data[0]['num_stock']*1) == undefined ? 0 : (data[0]['num_stock']*1);
            }
            document.getElementById('exceptionChart').setAttribute('_echarts_instance_', '');
            drawPublicChart('exceptionChart','异常量',res);
        }
    });

    //退货
    requestURL(dataService + "/operationCenter/rejectGoods", {"operationCenter":operationCenter}).done(function (data) {
        if(data.statusText != undefined && data.statusText == 'error'){
            $("#rejectGoodsChart").html("<span class='none-span'>今日暂无!</span>");
        }else{
            var res = {mode:["供应商退货","用户退货","回收商退货拒退"],num:[0,0,0]};
            if(data.length > 0){
                _.each(data,function(ele){
                    if(res.mode[0] == ele['sample']){
                        res.num[0] = accMul(ele['num'],1);
                    }
                    if(res.mode[1] == ele['sample']){
                        res.num[1] = accMul(ele['num'],1);
                    }
                    if(res.mode[2] == ele['sample']){
                        res.num[2] = accMul(ele['num'],1);
                    }
                });
            }
            document.getElementById('rejectGoodsChart').setAttribute('_echarts_instance_', '');
            drawPublicChart('rejectGoodsChart','退货量',res);
            //退货总量
            var total = _.reduce(res.num,function(num,temp){ return num + temp},0);
            cancelLoading('rejectGoods');
            $("#rejectGoodsNum").html(total.toLocaleString());
        }
    });

    //库存
    requestURL(dataService + "/operationCenter/stock", {"operationCenter":operationCenter}).done(function (data) {
        if(data.statusText != undefined && data.statusText == 'error'){
            console.log('库存查询接口异常');
        }else{
            cancelLoading('stock');
            $("#stockNum").html(accMul(data,1).toLocaleString());
        }
    });
};
//top部分
var topModelList = ['receiveGoods','qualityCheck','randomCheck','inHouse','outHouse','stock','sendGoods','rejectGoods'];

//top部分加载动画
var setTopLoading = function(){
    _.each(topModelList,function(ele){
        initPageToLoading(ele);
    });
};

/**
 * 渲染收货  -- 异常   -- 退货
 * @param data
 */
var drawPublicChart = function(chartId,name,data){
    var option = {
        tooltip: {
            trigger: 'axis'
        },
        grid:{
            left:'0',
            right:'0',
            bottom:'1%',
            top:'8%',
            containLabel:true
        },
        /*dataZoom: [
            {
                type: 'inside',
                start: 0,
                end: 100,
                xAxisIndex: 0
            },
            {
                type: 'slider',
                start: 0,
                end: 100,
                xAxisIndex: 0
            }
        ],*/
        xAxis: [
            {
                type: 'category',
                data: data.mode
            }
        ],
        yAxis: [
            {
                type: 'value'
            },
            {
                type: 'value',
                axisLabel: {
                    formatter: '{value}'
                },
                min: -10
            }
        ],
        color:['#3c8dbc'],
        animationDuration: 2000,
        series: [
            {
                name: name,
                type: 'bar',
                barWidth : 30,//柱图宽度
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        formatter: function(para) {
                            return (accMul(para.value,1)).toLocaleString();
                        }
                    }
                },
                data: data.num
            }
        ]
    };
    var chart = echarts.init(document.getElementById(chartId));
    chart.setOption(option, false, false);
    chart.resize();
    window.addEventListener('resize',chart.resize);
};


var drawObliquePublicChart = function(chartId,name,data){
    var option = {
        tooltip: {
            trigger: 'axis'
        },
        grid:{
            left:'0',
            right:'0',
            bottom:'10%',
            top:'8%',
            containLabel:true
        },
        /*dataZoom: [
            {
                type: 'inside',
                start: 0,
                end: 100,
                xAxisIndex: 0
            },
            {
                type: 'slider',
                start: 0,
                end: 100,
                xAxisIndex: 0
            }
        ],*/
        xAxis: [
            {
                type: 'category',
                data: data.mode,
                axisLabel:{
                    interval: 0,
                    rotate:25
                }
            }
        ],
        yAxis: [
            {
                type: 'value'
            }
        ],
        color:['#3c8dbc'],
        animationDuration: 2000,
        series: [
            {
                name: name,
                type: 'bar',
                barWidth : 30,//柱图宽度
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        formatter: function(para) {
                            return (accMul(para.value,1)).toLocaleString();
                        }
                    }
                },
                data: data.num
            }
        ]
    };
    var chart = echarts.init(document.getElementById(chartId));
    chart.setOption(option, false, false);
    chart.resize();
    window.addEventListener('resize',chart.resize);
};

/**
 * 拆分质检数据
 * @param logistics
 * @param act
 * @param allocation
 * @returns {{x: string[], y: number[], z: number[], k: number[]}}
 */
var getQualityCheckData = function(logistics,act,allocation){
    //x代表x轴，y代表物流收货，z代表代拍收货,k代表调拨收货
    var res = {x:['定级质检','仓库抽检','退货质检','备件质检'],y:[0,0,0,0],z:[0,0,0,0],k:[0,0,0,0]};

    //填充物流收货数据
    if(logistics.length > 0){
        _.each(logistics,function(ele){
            if(ele.ins_type.indexOf('定级质检等级') > -1){
                res.y[0] = accMul(ele.inspection_cnt,1);
            }
            if(ele.ins_type.indexOf('仓库抽检等级') > -1){
                res.y[1] = accMul(ele.inspection_cnt,1);
            }
            if(ele.ins_type.indexOf('退货质检等级') > -1){
                res.y[2] = accMul(ele.inspection_cnt,1);
            }
            if(ele.ins_type.indexOf('备件质检等级') > -1){
                res.y[3] = accMul(ele.inspection_cnt,1);
            }
        });
    }

    //填充代拍收货数据
    if(act.length > 0){
        _.each(act,function(ele){
            if(ele.ins_type.indexOf('定级质检等级') > -1){
                res.z[0] = accMul(ele.inspection_cnt,1);
            }
            if(ele.ins_type.indexOf('仓库抽检等级') > -1){
                res.z[1] = accMul(ele.inspection_cnt,1);
            }
            if(ele.ins_type.indexOf('退货质检等级') > -1){
                res.z[2] = accMul(ele.inspection_cnt,1);
            }
            if(ele.ins_type.indexOf('备件质检等级') > -1){
                res.z[3] = accMul(ele.inspection_cnt,1);
            }
        });
    }

    //填充调拨收货数据
    if(allocation.length > 0){
        _.each(allocation,function(ele){
            if(ele.ins_type.indexOf('定级质检等级') > -1){
                res.k[0] = accMul(ele.inspection_cnt,1);
            }
            if(ele.ins_type.indexOf('仓库抽检等级') > -1){
                res.k[1] = accMul(ele.inspection_cnt,1);
            }
            if(ele.ins_type.indexOf('退货质检等级') > -1){
                res.k[2] = accMul(ele.inspection_cnt,1);
            }
            if(ele.ins_type.indexOf('备件质检等级') > -1){
                res.k[3] = accMul(ele.inspection_cnt,1);
            }
        });
    }

    return res;
};

/**
 * 渲染质检
 * @param data
 */
var drawQualityCheckChart = function(data){
    var option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            left: 'center',
            data: ['物流收货','代拍收货','调拨收货']
        },
        grid:{
            left:'0',
            right:'0',
            bottom:'1%',
            top:'12%',
            containLabel:true
        },
        /*dataZoom: [
            {
                type: 'inside',
                start: 0,
                end: 100,
                xAxisIndex: 0
            },
            {
                type: 'slider',
                start: 0,
                end: 100,
                xAxisIndex: 0
            }
        ],*/
        xAxis: [
            {
                type: 'category',
                data: data.x
            }
        ],
        yAxis: [
            {
                type: 'value'
            },
            {
                type: 'value',
                axisLabel: {
                    formatter: '{value}'
                },
                min: -10
            }
        ],
        color:['#3c8dbc','#ff9945','#c23531'],
        animationDuration: 2000,
        series: [
            {
                name: '物流收货',
                type: 'bar',
                barWidth : 30,//柱图宽度
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        formatter: function(para) {
                            return (accMul(para.value,1)).toLocaleString();
                        }
                    }
                },
                data: data.y
            },
            {
                name: '代拍收货',
                type: 'bar',
                barWidth : 30,//柱图宽度
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        formatter: function(para) {
                            return (accMul(para.value,1)).toLocaleString();
                        }
                    }
                },
                data: data.z
            },
            {
                name: '调拨收货',
                type: 'bar',
                barWidth : 30,//柱图宽度
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        formatter: function(para) {
                            return (accMul(para.value,1)).toLocaleString();
                        }
                    }
                },
                data: data.k
            }
        ]
    };
    var chart = echarts.init(document.getElementById('qualityCheckChart'));
    chart.setOption(option, false, false);
    chart.resize();
    window.addEventListener('resize',chart.resize);
};

/**
 * 拆分抽检数据
 * @param logistics
 * @param act
 * @param allocation
 * @returns {{x: string[], y: number[], z: number[], k: number[]}}
 */
var getRandomCheckData = function(logistics,act,allocation){
    //x代表x轴，y代表物流收货，z代表代拍收货,k代表调拨收货
    var res = {x:['IPQC','RQC','UQC','优品复检'],y:[0,0,0,0],z:[0,0,0,0],k:[0,0,0,0]};

    //填充物流收货数据
    if(logistics.length > 0){
        _.each(logistics,function(ele){
            if(ele.ins_type.indexOf('IPQC') > -1){
                res.y[0] = accMul(ele.inspection_cnt,1);
            }
            if(ele.ins_type.indexOf('RQC') > -1){
                res.y[1] = accMul(ele.inspection_cnt,1);
            }
            if(ele.ins_type.indexOf('UQC') > -1){
                res.y[2] = accMul(ele.inspection_cnt,1);
            }
            if(ele.ins_type.indexOf('优品复检') > -1){
                res.y[3] = accMul(ele.inspection_cnt,1);
            }
        });
    }

    //填充代拍收货数据
    if(act.length > 0){
        _.each(act,function(ele){
            if(ele.ins_type.indexOf('IPQC') > -1){
                res.z[0] = accMul(ele.inspection_cnt,1);
            }
            if(ele.ins_type.indexOf('RQC') > -1){
                res.z[1] = accMul(ele.inspection_cnt,1);
            }
            if(ele.ins_type.indexOf('UQC') > -1){
                res.z[2] = accMul(ele.inspection_cnt,1);
            }
            if(ele.ins_type.indexOf('优品复检') > -1){
                res.z[3] = accMul(ele.inspection_cnt,1);
            }
        });
    }

    //填充调拨收货数据
    if(allocation.length > 0){
        _.each(allocation,function(ele){
            if(ele.ins_type.indexOf('IPQC') > -1){
                res.k[0] = accMul(ele.inspection_cnt,1);
            }
            if(ele.ins_type.indexOf('RQC') > -1){
                res.k[1] = accMul(ele.inspection_cnt,1);
            }
            if(ele.ins_type.indexOf('UQC') > -1){
                res.k[2] = accMul(ele.inspection_cnt,1);
            }
            if(ele.ins_type.indexOf('优品复检') > -1){
                res.k[3] = accMul(ele.inspection_cnt,1);
            }
        });
    }

    return res;
};

/**
 * 渲染抽检
 * @param data
 */
var drawRandomCheckChart = function(data){
    var option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            left: 'center',
            data: ['物流收货','代拍收货','调拨收货']
        },
        grid:{
            left:'0',
            right:'0',
            bottom:'1%',
            top:'12%',
            containLabel:true
        },
        /*dataZoom: [
            {
                type: 'inside',
                start: 0,
                end: 100,
                xAxisIndex: 0
            },
            {
                type: 'slider',
                start: 0,
                end: 100,
                xAxisIndex: 0
            }
        ],*/
        xAxis: [
            {
                type: 'category',
                data: data.x
            }
        ],
        yAxis: [
            {
                type: 'value'
            },
            {
                type: 'value',
                axisLabel: {
                    formatter: '{value}'
                },
                min: -10
            }
        ],
        color:['#3c8dbc','#ff9945','#c23531'],
        animationDuration: 2000,
        series: [
            {
                name: '物流收货',
                type: 'bar',
                barWidth : 30,//柱图宽度
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        formatter: function(para) {
                            return (accMul(para.value,1)).toLocaleString();
                        }
                    }
                },
                data: data.y
            },
            {
                name: '代拍收货',
                type: 'bar',
                barWidth : 30,//柱图宽度
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        formatter: function(para) {
                            return (accMul(para.value,1)).toLocaleString();
                        }
                    }
                },
                data: data.z
            },
            {
                name: '调拨收货',
                type: 'bar',
                barWidth : 30,//柱图宽度
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        formatter: function(para) {
                            return (accMul(para.value,1)).toLocaleString();
                        }
                    }
                },
                data: data.k
            }
        ]
    };
    var chart = echarts.init(document.getElementById('randomCheckChart'));
    chart.setOption(option, false, false);
    chart.resize();
    window.addEventListener('resize',chart.resize);
};


var drawSendGoodsChart = function(chartId,legendArr,valueMapArr){
    var option = {
        legend: {
            show: true,
            itemGap: 12,
            data: legendArr
        },
        tooltip: {
            trigger: 'item',
            /*formatter: "{a} <br/>{b} : {c} ({d}%)"*/
            formatter:function(item){
                var lineOne = item.seriesName;
                var lineTwo = item.name + " : " + item.value.toLocaleString();
                var lineThree = "占比 : " + item.percent;
                var str = lineOne + '<br>'
                    + lineTwo +' 台<br>'
                    + lineThree +'%<br>';
                return str;
            }
        },
        series: [{
            name: '发货量',
            type: 'pie',
            radius: '50%',
            center: ['50%', '50%'],
            clockwise: false,
            data: valueMapArr,
            label: {
                normal: {
                    textStyle: {
                        color: '#999',
                        fontSize: 14
                    },
                    formatter: function(item) {
                        var lineTwo = item.name + " : " + item.value.toLocaleString();
                        var lineThree = item.percent;
                        var str = lineTwo +' 台' + "\n"
                            + lineThree +'%';
                        return str;
                    }
                }
            },
            labelLine: {
                normal: {
                    show: true
                }
            },
            itemStyle: {
                normal: {
                    borderWidth: 4,
                    borderColor: '#ffffff'
                },
                emphasis: {
                    borderWidth: 0,
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                }
            }
        }],
        color:['#3c8dbc','#ff9945','#c23531'],
        backgroundColor: '#fff'
    };
    var myChart = echarts.init(document.getElementById(chartId));
    myChart.setOption(option);
    window.addEventListener('resize',myChart.resize)
};


var initPageToLoading = function(modelName){
    $("#" + modelName + "LoadingPanel").show();
    $("#" + modelName + "Panel").hide();
};

var cancelLoading = function(modelName){
    $("#" + modelName + "LoadingPanel").hide();
    $("#" + modelName + "Panel").show();
};