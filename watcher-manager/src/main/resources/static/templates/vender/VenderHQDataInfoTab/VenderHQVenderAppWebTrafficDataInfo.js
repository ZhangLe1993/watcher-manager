Template.VenderHQVenderAppWebTrafficDataInfo.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#VenderHQDataInfoTab').addClass('active');
    $('#VenderHQVenderAppWebTrafficDataInfo').addClass('active');

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var dateGap = -6;
    var minDate = "2017-09-01";
    var endDate = new Date().getNewDate(-1);
    var startDate = new Date(endDate).getNewDate(dateGap);

    $(".dateSelectLabel").html(startDate + "~" + endDate);
    $('.webTrafficFunnelDate').daterangepicker(datePickerOptionsFunc(startDate,endDate,minDate,false), pickWebTrafficFunnelDateRangeCallback);


    var dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g, "").split("~");
    var startDate = dt[0];
    var endDate = dt[1];
    filter.startDate=startDate;
    filter.endDate=endDate;
    renderPageDay(filter);

    };

var filter={};

function pickWebTrafficFunnelDateRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.dateSelectLabel').html(sdt + "~" + edt);
    filter.startDate=sdt;
    filter.endDate=edt;
    renderPageDay(filter);
}

function getSelectedFilter(dateType, $this) {
    var dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g, "").split("~");
    var startDate = dt[0];
    var endDate = dt[1];

    filter.startDate=startDate;
    filter.endDate=endDate;

    return cleanParams(filter);
}

function renderPageDay(filter) {

    $("#webTrafficLoading").show();

    $("#appBarChart").hide();
    $("#appLineChart").hide();
    $("#tableCollect").hide();
    //app流量数据
    var promise = getVenderAppWebTrafficDataInfo(filter);
    promise.done(function (ret) {
        $("#webTrafficLoading").hide();

        $("#appBarChart").show();
        $("#appLineChart").show();
        $("#tableCollect").show();
        drawAppBarChart(ret);
        drawAppLineChart(ret);
    });

    //标准定价数据
    //var promise = getVenderPriceWebTrafficDataInfo(filter);
    //promise.done(function (ret) {
    //    drawPriceBarChart(ret);
    //    drawPriceLineChart(ret);
    //});

}

//app流量数据横向柱状图
function drawAppBarChart(ret) {

    var groupCnt=0;
    var venderCnt=0;
    var openUv=0;
    var inquiryCnt=0;
    var validateCnt=0;
    var phoneCnt=0;
    var startSubmitCnt=0;
    var idCnt=0;
    var endSubmitCnt=0;
    var uploadImageCnt=0;
    ret.forEach(function(e){
        groupCnt+= e.groupCnt;
        venderCnt+= e.venderCnt;
        openUv+= e.openUv;
        inquiryCnt+= e.inquiryCnt;
        validateCnt+= e.validateCnt;
        phoneCnt+= e.phoneCnt;
        startSubmitCnt+= e.startSubmitCnt;
        idCnt+= e.idCnt;
        endSubmitCnt+= e.endSubmitCnt;
        uploadImageCnt+= e.uploadImageCnt;
    })
    var filter=[];
    var tmp=filter[0]={};
    tmp.groupCnt= groupCnt;
    tmp.venderCnt= venderCnt;
    tmp.openUv= openUv;
    tmp.inquiryCnt= inquiryCnt;
    tmp.validateCnt= validateCnt;
    tmp.phoneCnt= phoneCnt;
    tmp.startSubmitCnt= startSubmitCnt;
    tmp.idCnt= idCnt;
    tmp.endSubmitCnt= endSubmitCnt;
    tmp.uploadImageCnt= uploadImageCnt;


    renderTable(filter,'#tableCollect');

    var yAxis = ['app开启量',
        "询价转化率:"+((inquiryCnt/openUv)*100).toFixed(2) + '%\n询价总量',
        "验证码发送率:"+((validateCnt/inquiryCnt)*100).toFixed(2) + '%\n点击发送验证码',
        "成功验证手机率:"+((phoneCnt/validateCnt)*100).toFixed(2) + '%\n验证手机号成功',
        "身份证认证率:"+((idCnt/startSubmitCnt)*100).toFixed(2) + '%\n输入身份证',
        "成功提交订单率:"+((endSubmitCnt/inquiryCnt)*100).toFixed(2) + '%\n订单提交成功',
        "照片上传率:"+((uploadImageCnt/endSubmitCnt)*100).toFixed(2) + '%\n照片上传成功'].reverse();

    var option = {
        title: {
            text: '爱机汇App',
            x: "center"
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            show: false,
            left: '3%',
            right: '4%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'value', show: false
            }
        ],
        yAxis: [
            {
                type: 'category',
                data: yAxis,
                splitLine: {
                    show: true
                }
            }
        ],
        series: [
            {
                name: '访问量',
                type: 'bar',
                itemStyle: {normal: {color: '#568FC8', label: {show: true, position: 'right', color: '#568FC8'}}},
                data: [openUv,inquiryCnt,validateCnt,phoneCnt,idCnt,endSubmitCnt,uploadImageCnt].reverse()
            }
        ]
    };
    var dailyTrafficFunnelChart = echarts.init(document.getElementById('appBarChart'));
    dailyTrafficFunnelChart.setOption(option,true);

    setTimeout(function (){
        window.addEventListener('resize',function () {
            dailyTrafficFunnelChart.resize();
        })
    },50)
}

//app流量数据折线图
function drawAppLineChart(ret){
    var dateList=[];
    var seriesList={
         inquiryRate:[],
         validateRate:[],
         phoneRate:[],
         startSubmitRate:[],
         idRate:[],
         endSubmitRate:[],
         submitRate:[],
         uploadImageRate:[]
    }

    ret.forEach(function(e){
        dateList.push(e.date);
        seriesList.inquiryRate.push(((e.inquiryCnt/ e.openUv)*100).toFixed(2))
        seriesList.validateRate.push(((e.validateCnt/e.inquiryCnt)*100).toFixed(2))
        seriesList.phoneRate.push(((e.phoneCnt/e.validateCnt)*100).toFixed(2))
        seriesList.startSubmitRate.push(((e.startSubmitCnt/e.inquiryCnt)*100).toFixed(2))
        seriesList.idRate.push(((e.idCnt/e.startSubmitCnt)*100).toFixed(2))
        seriesList.endSubmitRate.push(((e.endSubmitCnt/e.idCnt)*100).toFixed(2))
        seriesList.uploadImageRate.push(((e.uploadImageCnt/e.endSubmitCnt)*100).toFixed(2))
        seriesList.submitRate.push(((e.endSubmitCnt/e.inquiryCnt)*100).toFixed(2))
    })
    var option = {
        title: {
            text: '爱机汇App各环节转化漏斗',
            x:"center",
            padding:[0,0,0,50]
            //y:"bottom"
        },
        tooltip: {
            trigger: 'axis',
            formatter:function(params,ticket,callback){
                var str = (params[1]?params[1]:params[0]).name + '<br/>';
                params.forEach(function(obj){
                    if(obj.seriesName.indexOf("率")>-1){
                        str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                    }else if(obj.seriesName.indexOf("全选")>-1){
                        str+='数据如下：'+'<br/>'
                    }else{
                        str += obj.seriesName + ' : ' + obj.value + '<br/>'
                    }
                });
                return str;
            }
        },
        legend: {
            data:[{name:'全选',icon: 'circle'},'询价率','验证码发送率','验证手机成功率','下单率','身份证认证率','订单提交率','照片上传率','成功提交订单率'],
            padding: [30,0,0,0],
            selected:{
                "全选":true
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            top:'20%',
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
            data: dateList
        },
        yAxis: [
            {
                type: 'value'
            },
            {
                type: 'value',
                axisLabel: {
                    formatter: function (value, index) {
                        if (value == 0) {
                            return value
                        }
                        return value+"%"
                    }
                }
            }
        ],
        series: [
            {
                name:'全选',
                type:'line',
                data:[]
            },
            {
                name:'询价率',
                type:'line',
                data:seriesList.inquiryRate
            },
            {
                name:'验证码发送率',
                type:'line',
                data:seriesList.validateRate
            },
            {
                name:'验证手机成功率',
                type:'line',
                data:seriesList.phoneRate
            },
            {
                name:'下单率',
                type:'line',
                data:seriesList.startSubmitRate
            },
            {
                name:'身份证认证率',
                type:'line',
                data:seriesList.idRate
            },
            {
                name:'订单提交率',
                type:'line',
                data:seriesList.endSubmitRate
            },
            {
                name:'照片上传率',
                type:'line',
                data:seriesList.uploadImageRate
            },
            {
                name:'成功提交订单率',
                type:'line',
                data:seriesList.submitRate
            }
        ]
    };
    var dailyTrafficStackChart = echarts.init(document.getElementById('appLineChart'));
    dailyTrafficStackChart.setOption(option,true);
    setTimeout(function (){
        window.addEventListener('resize',function () {
            dailyTrafficStackChart.resize();
        })
    },200)

    dailyTrafficStackChart.on('legendselectchanged',function(params){
        //var legendDict = params.selected;
        //var tmpObj = {}
        //for(var key in legendDict){
        //    if(legendDict[key]){
        //        tmpObj[key]
        //    }
        //}
        var all=params.selected;
        var key = params.name;
        option.legend.selected={};
        if(key=='全选'&&params.selected[key]==true){
            for(var a in all){
                all[a]=true;
            }
            //option.legend.selected={'全选':true,'总访客数':true,'门店回收访客数':true,'询价访客数':true,'询价完成访客数':true,'选择回收方式访客数':true,'选择支付方式访客数':true,'提交成功访客数':true,'询价转化率':true,'询价完成转化率':true,'询价完成率':true,'选择回收方式转化率':true,'选择回收方式率':true,'选择支付方式转化率':true,'选择支付方式率':true,'提交成功转化率':true,'提交成功率':true};
        }else if(key=='全选'&&params.selected[key]==false)
        {
            for(var a in all){
                all[a]=false;
            }
            //option.legend.selected={'全选':false,'总访客数':false,'门店回收访客数':false,'询价访客数':false,'询价完成访客数':false,'选择回收方式访客数':false,'选择支付方式访客数':false,'提交成功访客数':false,'询价转化率':false,'询价完成转化率':false,'询价完成率':false,'选择回收方式转化率':false,'选择回收方式率':false,'选择支付方式转化率':false,'选择支付方式率':false,'提交成功转化率':false,'提交成功率':false};
        }
        option.legend.selected=all;
        dailyTrafficStackChart.setOption(option);
    });

}

//每日累计重大失误率
function renderTable(data,tableName) {
    $(tableName).bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        data:data
    });
}

//标准定价横向柱状图
function drawPriceBarChart(date,obj) {

    var dateType =$(".dateType").val(),date2;
    if(dateType=="daily"){
        date2=date;
    }else if(dateType=="weekly"){
        date2=date+"~"+(new Date(date).getNewDate(6));
    }else if(dateType=="monthly"){
        date2=date+"~"+(new moment(date).endOf('month').format('YYYY-MM-DD'));
    }
    var subtext="";
    var yAxis = ['总访客数',
        "询价转化率:"+obj.inquiry_uv_rate + '%\n询价访客数',
        "询价完成率:"+((obj.inquiry_success_uv/obj.inquiry_uv)*100).toFixed(2) + '%\n询价完成访客数',
        "选择回收方式率:"+((obj.trade_method_uv/obj.inquiry_success_uv)*100).toFixed(2) + '%\n选择回收方式访客数',
        "提交成功率:"+((obj.submit_success_uv/obj.trade_method_uv)*100).toFixed(2) + '%\n提交成功访客数',
        "提交成功转化率:"+obj.submit_success_uv_rate + '%\n提交成功访客数','门店回收访客数'].reverse();

    var $plat = $(".platform").val();
    if(flag==0){
        if(($plat && !($plat.indexOf("官网")>-1))){
            subtext="选择支付方式访客数:"+obj.payment_method_uv
        }
    }else{
        $plat=$("#platformM").val();
        if(($plat && !($plat.indexOf("官网")>-1))){
            subtext="选择支付方式访客数:"+obj.payment_method_uv
        }
    }
    console.log($plat);
    var option = {
        title: {
            text: '产品流量('+date2+")",
            x: "center",
            subtext:subtext
            // subtext:"test"
            //y: "bottom"
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            show: false,
            left: '3%',
            right: '4%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'value', show: false
            }
        ],
        yAxis: [
            {
                type: 'category',
                data: yAxis,
                splitLine: {
                    show: true
                }
            }
        ],
        series: [
            {
                name: '访问量',
                type: 'bar',
                itemStyle: {normal: {color: '#568FC8', label: {show: true, position: 'right', color: '#568FC8'}}},
                data: [obj.uv,obj.inquiry_uv,obj.inquiry_success_uv,obj.trade_method_uv,obj.submit_success_uv,obj.submit_success_uv,obj.shop_recycle_uv].reverse()
            }
        ]
    };
    var dailyTrafficFunnelChart = echarts.init(document.getElementById('dailyTrafficFunnelChart'));
    dailyTrafficFunnelChart.setOption(option,true);

    setTimeout(function (){
        window.addEventListener('resize',function () {
            dailyTrafficFunnelChart.resize();
        })
    },50)
}

//标准定价折线图
function drawPriceLineChart(obj){

    var option = {
        title: {
            text: '折线图堆叠',
            x:"center",
            padding:[0,0,0,50]
            //y:"bottom"
        },
        tooltip: {
            trigger: 'axis',
            formatter:function(params,ticket,callback){
                var str = (params[1]?params[1]:params[0]).name + '<br/>';
                params.forEach(function(obj){
                    if(obj.seriesName.indexOf("率")>-1){
                        str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                    }else if(obj.seriesName.indexOf("全选")>-1){
                        str+='数据如下：'+'<br/>'
                    }else{
                        str += obj.seriesName + ' : ' + obj.value + '<br/>'
                    }
                });
                return str;
            }
        },
        legend: {
            data:[{name:'全选',icon: 'circle'},'总访客数','门店回收访客数','询价访客数','询价完成访客数','选择回收方式访客数','选择支付方式访客数','提交成功访客数','提交成功订单数','询价转化率','询价完成转化率','询价完成率','选择回收方式转化率','选择回收方式率','选择支付方式转化率','选择支付方式率','提交成功转化率','提交成功率','订单转化率'],
            padding: [30,0,0,0],
            selected:{
                "全选":true
            }
        },
        grid: {
            left: '3%',
            right: '4%',
            top:'20%',
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
            data: obj.dateList
        },
        yAxis: [
            {
                type: 'value'
            },
            {
                type: 'value',
                axisLabel: {
                    formatter: function (value, index) {
                        if (value == 0) {
                            return value
                        }
                        return value+"%"
                    }
                }
            }
        ],
        series: [
            {
                name:'全选',
                type:'line',
                data:[]
            },
            {
                name:'总访客数',
                type:'line',
                data:obj.series.uv
            },
            {
                name:'门店回收访客数',
                type:'line',
                data:obj.series.shop_recycle_uv
            },
            {
                name:'询价访客数',
                type:'line',
                data:obj.series.inquiry_uv
            },
            {
                name:'询价完成访客数',
                type:'line',
                data:obj.series.inquiry_success_uv
            },
            {
                name:'选择回收方式访客数',
                type:'line',
                data:obj.series.trade_method_uv
            },
            {
                name:'选择支付方式访客数',
                type:'line',
                data:obj.series.payment_method_uv
            },
            {
                name:'提交成功访客数',
                type:'line',
                data:obj.series.submit_success_uv
            },
            {
                name:'提交成功订单数',
                type:'line',
                data:obj.series.submit_success_cnt
            },
            {
                name:'询价转化率',
                type:'line',
                yAxisIndex: 1,
                data:obj.series.inquiry_uv_rate
            },
            //{
            //    name:'询价完成转化率',
            //    type:'line',
            //    yAxisIndex: 1,
            //    data:obj.series.inquiry_success_uv_rate
            //},
            {
                name:'询价完成率',
                type:'line',
                yAxisIndex: 1,
                data:obj.series.inquiry_success_inquiry_rate
            },
            //{
            //    name:'选择回收方式转化率',
            //    type:'line',
            //    yAxisIndex: 1,
            //    data:obj.series.trade_method_uv_rate
            //},
            {
                name:'选择回收方式率',
                type:'line',
                yAxisIndex: 1,
                data:obj.series.trade_method_inquiry_success_rate
            },
            //{
            //    name:'选择支付方式转化率',
            //    type:'line',
            //    yAxisIndex: 1,
            //    data:obj.series.payment_method_uv_rate
            //},
            {
                name:'选择支付方式率',
                type:'line',
                yAxisIndex: 1,
                data:obj.series.payment_method_trade_method_rate
            },
            {
                name:'提交成功转化率',
                type:'line',
                yAxisIndex: 1,
                data:obj.series.submit_success_uv_rate
            },
            {
                name:'提交成功率',
                type:'line',
                yAxisIndex: 1,
                data:obj.series.submit_success_trade_method_rate
            },
            {
                name:'订单转化率',
                type:'line',
                yAxisIndex: 1,
                data:obj.series.submit_success_cnt_rate
            }
        ]
    };
    var dailyTrafficStackChart = echarts.init(document.getElementById('dailyTrafficStackChart'));
    dailyTrafficStackChart.setOption(option,true);
    setTimeout(function (){
        window.addEventListener('resize',function () {
            dailyTrafficStackChart.resize();
        })
    },200)

    dailyTrafficStackChart.on('legendselectchanged',function(params){
        //var legendDict = params.selected;
        //var tmpObj = {}
        //for(var key in legendDict){
        //    if(legendDict[key]){
        //        tmpObj[key]
        //    }
        //}
        var all=params.selected;
        var key = params.name;
        option.legend.selected={};
        if(key=='全选'&&params.selected[key]==true){
            for(var a in all){
                all[a]=true;
            }
            //option.legend.selected={'全选':true,'总访客数':true,'门店回收访客数':true,'询价访客数':true,'询价完成访客数':true,'选择回收方式访客数':true,'选择支付方式访客数':true,'提交成功访客数':true,'询价转化率':true,'询价完成转化率':true,'询价完成率':true,'选择回收方式转化率':true,'选择回收方式率':true,'选择支付方式转化率':true,'选择支付方式率':true,'提交成功转化率':true,'提交成功率':true};
        }else if(key=='全选'&&params.selected[key]==false)
        {
            for(var a in all){
                all[a]=false;
            }
            //option.legend.selected={'全选':false,'总访客数':false,'门店回收访客数':false,'询价访客数':false,'询价完成访客数':false,'选择回收方式访客数':false,'选择支付方式访客数':false,'提交成功访客数':false,'询价转化率':false,'询价完成转化率':false,'询价完成率':false,'选择回收方式转化率':false,'选择回收方式率':false,'选择支付方式转化率':false,'选择支付方式率':false,'提交成功转化率':false,'提交成功率':false};
        }
        option.legend.selected=all;
        dailyTrafficStackChart.setOption(option);
    });

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

//APP流量数据
function getVenderAppWebTrafficDataInfo(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getVenderAppWebTrafficDataInfo", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}

//标准定价流量数据
function getVenderPriceWebTrafficDataInfo(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getVenderPriceWebTrafficDataInfo", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}



