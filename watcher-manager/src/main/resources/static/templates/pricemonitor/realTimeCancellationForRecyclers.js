Template.realTimeCancellationForRecyclers.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#realTimeCancellationForRecyclers').addClass('active');
    $('#channelSideTab').addClass('active');
    if(isMobile()){
        $('.sidebar-toggle').click();
    }

    //当日待支付统计
    showPanelOrLoading(['toBePaidChart','toBePaidPieChart'],true);
    showPanelOrLoadingOrError([{id:'statementOfDetailsLoading','on':true},{id:'statementOfDetailsPanel','on':false},{id:'statementOfDetailsError','on':false}]);
    requestURL(dataService+'/recycler/getQuotationAmountAll',{}).done(function(num){
        var waitPaid = accMul(num,1);
        htmlNumSet(waitPaid,'wait-for-paid');
        //$("span[data-set='wait-for-paid']").attr("style","color:#0580f2;font-weight:bold;");

        //即将取消横向柱状图
        requestURL(dataService+'/recycler/getSoonQuotationAmountByHour',{}).done(function(result){
            var hourAndLabelArr = [];
            var valueArr = [];
            //var sum = _.reduce(result, function(memo, ele){ return memo + accMul(ele.amount,1); }, 0);
            _.each(result,function(ele){
                hourAndLabelArr.push(ele.hour+'时 ('+accDiv(Math.round(accMul(accDiv(ele.amount,waitPaid),10000)),100)+'%) ');
                valueArr.push(accMul(ele.amount,1));
            });
            showPanelOrLoading(['toBePaidChart'],false);
            drawSoonQuotationAmountByHourChart('toBePaidChart',hourAndLabelArr,valueArr);
        });
    });

    //当日取消总计
    requestURL(dataService+'/recycler/getCurrentDayQuotationAmountAll',{}).done(function(num){
        var waitPaid = accMul(num,1);
        htmlNumSet(waitPaid,'has-cancel-all');
    });

    //今日预测
    /*requestURL(dataService+'/recycler/getCurrentDayQuotationAmountAll',{}).done(function(num){
        var waitPaid = accMul(num,1);
        htmlNumSet(waitPaid,'today-forecast');
    });*/

    //饼图
    requestURL(dataService+'/recycler/getCurrentDayQuotationAmount',{}).done(function(result){
        var legendArr = [];
        var mapArray = [];
        _.each(result,function(ele) {
            legendArr.push(ele.product_source);
            mapArray.push({'name':ele.product_source,'value':accMul(ele.amount,1)});
        });
        //console.log(legendArr);
        showPanelOrLoading(['toBePaidPieChart'],false);
        drawSoonQuotationAmountPieChart('toBePaidPieChart',legendArr,mapArray)
    });

    //特殊商家重点监控
    var userId = Meteor.user().profile.name;
    requestURL(dataService+'/recycler/getCurrentDayStatementOfDetails',{uid:userId}).done(function(data){
        if(data.statusText != undefined && data.statusText=='error'){
            showPanelOrLoadingOrError([{id:'statementOfDetailsLoading','on':false},{id:'statementOfDetailsPanel','on':false},{id:'statementOfDetailsError','on':true}]);
            releaseLock();
        }else{
            showPanelOrLoadingOrError([{id:'statementOfDetailsLoading','on':false},{id:'statementOfDetailsPanel','on':true},{id:'statementOfDetailsError','on':false}]);
            releaseLock();
            drawDetailTable(data);
        }
    });

    $('#refresh').click(function(){
        if(unLock){
            addLock();
            partRefresh(userId);
        }
    });
};

var unLock = false;

var addLock = function(){
    unLock = false;
    $("#refresh").attr("style","cursor:not-allowed;");
};

var releaseLock = function(){
    unLock = true;
    $('#refresh').attr("style","cursor:pointer;");
};

var drawExceptionHtml = function(){
    console.log('渲染404页面   ');
    showPanelOrLoadingOrError([{id:'statementOfDetailsLoading','on':false},{id:'statementOfDetailsPanel','on':false},{id:'statementOfDetailsError','on':true}]);
};

var drawSoonQuotationAmountByHourChart = function(chartId,hourArr,valueArr){
    var option = {
        color: ['#3ec5db'],
        title: {
            text: '当日分时即将取消金额',
            textStyle: {
                fontWeight: 'normal',
                color: '#3ec5db',
                fontSize: '20'
            }
        },
        tooltip: {
            trigger: 'item',
            axisPointer: {
                type: 'shadow'
            },
            formatter:function(item){
                var lineOne = item.name.substring(0,item.name.indexOf('('));
                var lineTwo = item.name.substring(item.name.indexOf('(')+1,item.name.indexOf(')'));
                var lineThree = item.value;
                var str = lineOne + '<br>'
                        + '即将取消金额：' + lineThree.toLocaleString() +' 元<br>'
                        + '占总待支付的百分比：' + lineTwo +'<br>';
                return str;
            }
        },
        grid: {
            left: '1%',
            right: '10%',
            bottom: '15%',
            containLabel: true
        },
        dataZoom: [
            {
                show: true,
                yAxisIndex: 0,
                start: 0,
                end: 100
            },
            {
                show: true,
                xAxisIndex: 0,
                start: 0,
                end: 100
            }
        ],
        xAxis: [
            {
                type: 'value',
                axisLabel: {
                    show: true,
                    textStyle: {
                        fontWeight: '50',
                        color: '#000'
                    }
                },
                axisLine:{
                    lineStyle:{
                        color:'#3ec5db',
                        width:1             //这里是为了突出显示加上的
                    }
                }
            }
        ],
        yAxis: {
            type: 'category',
            data: hourArr.reverse(),
            axisLabel: {
                show: true,
                interval: 0,
                rotate: 0,
                margin: 10,
                inside: false,
                textStyle: {
                    fontWeight: '50',
                    color: '#000'
                }
            },
            axisLine:{
                lineStyle:{
                    color:'#3ec5db',
                    width:1                 //这里是为了突出显示加上的
                }
            }

        },
        series: [{
            type: 'bar',
            label: {
                normal: {
                    show: true,
                    position:'right',
                    formatter: function(v) {
                        var val = v.data;
                        if (val == 0) {
                            return '';
                        }
                        return val.toLocaleString() +'元';
                    },
                    color: '#000'
                }
            },
            barWidth : 30,//柱图宽度
            data: valueArr.reverse(),
        }]
    };
    var myChart = echarts.init(document.getElementById(chartId));
    myChart.setOption(option);
    window.addEventListener('resize',myChart.resize);
};

var drawSoonQuotationAmountPieChart = function(chartId,legendArr,valueMapArr){
    var option = {
        title: {
            text: '已取消金额',
            x:'center',
            y:'10%',
            textStyle: {
                fontWeight: 'normal',
                color: '#3ec5db',
                fontSize: '20'
            }
        },
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
                var lineThree = item.percent;
                var str = lineOne + '<br>'
                        + lineTwo +' 元<br>'
                        + lineThree +'%<br>';
                return str;
            }
        },
        series: [{
            name: '已取消金额',
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
                        var str = lineTwo +' 元' + "\n"
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
        color: ['#3ec5db','#52cdd5','#79d9f1','#a7e7ff','#c8efff'],
        backgroundColor: '#fff'
    };
    var myChart = echarts.init(document.getElementById(chartId));
    myChart.setOption(option);
    window.addEventListener('resize',myChart.resize)
};

//局部刷新 特殊商家重点监控
var partRefresh = function(userId){
    showPanelOrLoadingOrError([{id:'statementOfDetailsLoading','on':true},{id:'statementOfDetailsPanel','on':false},{id:'statementOfDetailsError','on':false}]);
    //特殊商家重点监控
    requestURL(dataService+'/recycler/getCurrentDayStatementOfDetails',{uid:userId}).done(function(data){
        if(data.statusText != undefined && data.statusText=='error'){
            // 局部404 div页面 暂时不画了，有时间再画吧，只释放锁使按钮可用即可
            //showPanelOrLoadingOrError([{id:'statementOfDetailsLoading','on':false},{id:'statementOfDetailsPanel','on':false},{id:'statementOfDetailsError','on':true}]);
            releaseLock();
        }else{
            showPanelOrLoadingOrError([{id:'statementOfDetailsLoading','on':false},{id:'statementOfDetailsPanel','on':true},{id:'statementOfDetailsError','on':false}]);
            releaseLock();
            drawDetailTable(data);
        }
    });
};

//渲染明细表数据
var drawDetailTable = function(dataList){
    $("#statementOfDetails").bootstrapTable('destroy').bootstrapTable({
        data: dataList,
        pagination: true,
        sortName : 'timediff',
        sortOrder : 'asc',
        striped: true,
        pageSize: 5,
        search: true,
        pageList: [5, 10, 20, 50, 100, 200],
        exportDataType:'all',
        columns:[
            {
                field:'serial_no',
                title:'结算单号',
                sortable:true
            },
            {
                field:'merchant_id',
                title:'商家ID',
                sortable:true

            },
            {
                field:'merchant_name',
                title:'商家名称',
                sortable:true
            },
            {
                field:'level_type',
                title:'商家等级',
                sortable:true
            },
            {
                field:'recycler_maintainer',
                title:'维护人',
                sortable:true
            },
            {
                field:'recycler_contacts_phone',
                title:'手机号',
                sortable:true
            },
            {
                field:'amount',
                title:'待支付金额',
                sortable:true

            },
            {
                field:'dead_time',
                title:'截至支付时间',
                sortable:true
            },
            {
                field:'timediff',
                title:'倒计时',
                sortable:true
            }
        ]
    });
};

//整体分析加载动画选择加载
var showPanelOrLoading = function(selector_perv,on){
    _.each(selector_perv,function(ele){
        var loadingId = ele + 'Loading';
        var panelId = ele + 'Panel';
        if(on){
            //显示动画   隐藏面板
            $('#' + loadingId).show();
            $('#' + panelId).hide();
        }else{
            //显示面板   隐藏动画
            $('#' + loadingId).hide();
            $('#' + panelId).show();
        }
    });
};


//整体分析加载动画选择加载
//[{id:'statementOfDetailsLoading','on':true},{id:'statementOfDetailsPanel','on':false},{id:'statementOfDetailsError','on':false}]
var showPanelOrLoadingOrError = function(mapList){
    _.each(mapList,function(ele){
        if(ele.on){
            //显示
            $('#' + ele.id).show();
        }else{
            //隐藏
            $('#' + ele.id).hide();
        }
    });
};

var htmlNumSet = function(to,selector){
    $("span[data-set='"+selector+"']").lemCounter({
        value_to: to,
        value_from: 0,
        animate_duration: 3,
        locale: 'en-US'
    });
};
