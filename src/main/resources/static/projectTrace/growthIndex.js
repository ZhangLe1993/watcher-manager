Template.growthIndexMonitor.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#projectTraceTab').addClass('active');
    $('#growthIndexTab').addClass('active');

    if(isMobile()){
        $('.sidebar-toggle').click();
    }

    $(".option").hide()
    dynamicLogisticsLineChart = echarts.init(document.getElementById('dynamicLogisticsLineChart'));
    dynamicProductChart = echarts.init(document.getElementById('dynamicProductChart'));
    dynamicProductLineChart = echarts.init(document.getElementById('dynamicProductLineChart'));
    dynamicO2OChart = echarts.init(document.getElementById('dynamicO2OChart'));
    dynamicO2OLineChart = echarts.init(document.getElementById('dynamicO2OLineChart'));
    dynamicOndoorChart = echarts.init(document.getElementById('dynamicOndoorChart'));
    dynamicOndoorLineChart = echarts.init(document.getElementById('dynamicOndoorLineChart'));
    dynamicLogisticsChart = echarts.init(document.getElementById('dynamicLogisticsChart'));
    var minWeekDate = "2016-07-03";
    var startWeekDate = moment().weekday(-14).format("YYYY-MM-DD")
    if(isMobile()){
        startWeekDate = moment().weekday(-28).format("YYYY-MM-DD")
    }
    var endWeekDate = moment().weekday(-7).format("YYYY-MM-DD")
    if(startWeekDate<minWeekDate){
        startWeekDate = minWeekDate;
    }
    var query = {
        "startDate":startWeekDate,
        "endDate":endWeekDate
    };

    $('a[data-toggle=tab]').on('shown.bs.tab', function (e) {

        var activeTab=(e.target).text;
        switch (activeTab) {
            case "O2O动态订单":
                dynamicO2OChart.resize()
                dynamicO2OLineChart.resize()
                break;
            case "上门动态订单":
                dynamicOndoorChart.resize()
                dynamicOndoorLineChart.resize()
                break;
            case "快递动态订单":
                dynamicLogisticsLineChart.resize()
                dynamicLogisticsChart.resize()
                break;
            case "流量漏斗":
                dynamicProductChart.resize()
                dynamicProductLineChart.resize()
                break;
            default:
                break;
        }
    });

    $("#channel").change(function(){
        drawLogisticsChart(query)
    })

    $(".search").click(function(){
        var activeTab=$("ul.nav-tabs").find("li.active").text()
        switch (activeTab) {
            case "O2O动态订单":
                drawO2OChart(query)
                break;
            case "上门动态订单":
                drawOndoorChart(query)
                break;
            case "快递动态订单":
                drawLogisticsChart(query)
                break;
            case "流量漏斗":
                drawProductChart(query)
                break;
            default:
                break;
        }
    })


    requestURL(dataService+"/projectTrace/getRenderOptions",{}).done(function(data){
        $(".option").show()
        renderOptions(".productCity",data.productCityList);
        renderOptions(".o2oCity",data.cityList)
        renderOptions(".ondoorCity",data.cityList)
        $(".productArea").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false
        });
        $(".productCity").multipleSelect({
            placeholder: "全部",
            width: 150,
            selectAll: false,
            filter: true
        });
        $(".o2oArea").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false
        });
        $(".o2oCity").multipleSelect({
            placeholder: "全部",
            width: 150,
            selectAll: false,
            filter: true
        });
        $(".ondoorArea").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false
        });
        $(".ondoorCity").multipleSelect({
            placeholder: "全部",
            width: 150,
            selectAll: false,
            filter: true
        });
        renderPage(query)
    })

};


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

function renderOptions(sel,data){
    $(sel).empty();
    data.forEach(function(ele){
        $(sel).append("<option value='"+ele+"'>"+ele+"</option>")
    });
}

function renderPage(query){
    drawO2OChart(query)
    drawOndoorChart(query)
    drawLogisticsChart(query)
    drawProductChart(query)
}

function drawProductChart(query){
    $("#productloading").show()
    $("#productContent").hide()
    var filter = _.clone(query)
    filter.area=$(".productArea").val()
    filter.city=$(".productCity").val()
    requestURL(dataService+"/projectTrace/getProductTrafficUv",cleanParams(filter)).done(function(data){
        $("#productloading").hide()
        $("#productContent").show()

        var uv=[],inquiry_uv=[],inquiry_success_uv=[],recycle_uv=[],submit_success_uv=[],shop_recycle_uv=[]
        var inquiry_uv_rate=[],inquiry_success_uv_rate=[],recycle_uv_rate=[],submit_success_uv_rate=[],submit_success_uv_conversion_rate=[]
        data.forEach(function(obj){
            uv.push(obj.uv)
            inquiry_uv.push(obj.inquiry_uv)
            inquiry_success_uv.push(obj.inquiry_success_uv)
            recycle_uv.push(obj.recycle_uv)
            submit_success_uv.push(obj.submit_success_uv)
            shop_recycle_uv.push(obj.shop_recycle_uv)
            inquiry_uv_rate.push((100*obj.inquiry_uv/obj.uv).toFixed(2))
            inquiry_success_uv_rate.push((100*obj.inquiry_success_uv/obj.inquiry_uv).toFixed(2))
            recycle_uv_rate.push((100*obj.recycle_uv/obj.inquiry_success_uv).toFixed(2))
            submit_success_uv_rate.push((100*obj.submit_success_uv/obj.recycle_uv).toFixed(2))
            submit_success_uv_conversion_rate.push((100*obj.submit_success_uv/obj.uv).toFixed(2))
        })

        var option = {
            title:{
                text: '各环节动态量',
                x: "center",
                //padding:[0,0,0,50]
            },
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                padding: [25,0,0,0],
                data:['总访客数','询价访客数','询价完成访客数','选择回收方式访客数','提交成功访客数','门店回收访客数']
            },
            grid: {
                /* left: '3%',
                 right: '4%',
                 bottom: '3%',*/
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : _.map(data,function(obj){return obj.date})
                }
            ],
            yAxis : [
                {
                    type : 'value'
                },
                {
                    type: 'value',
                    axisLabel:{
                        formatter: '{value} %'
                    }
                },
            ],
            series : [
                {
                    name:'总访客数',
                    type:'bar',
                    data:uv,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'询价访客数',
                    type:'bar',
                    data:inquiry_uv,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'询价完成访客数',
                    type:'bar',
                    data:inquiry_success_uv,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'选择回收方式访客数',
                    type:'bar',
                    data:recycle_uv,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'提交成功访客数',
                    type:'bar',
                    data:submit_success_uv,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'门店回收访客数',
                    type:'bar',
                    data:shop_recycle_uv,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
            ]
        };

        dynamicProductChart.setOption(option);
        dynamicProductChart.resize()
        window.addEventListener('resize',dynamicProductChart.resize)




        var lineOption = {
            title:{
                text: '各环节动态率',
                x: "center",
                //padding:[0,0,0,50]
            },
            tooltip : {
                trigger: 'axis',
                formatter:function(params,ticket,callback){
                    var str = params[0].name + '<br/>';
                    params.forEach(function(obj){
                        if(obj.seriesName.indexOf("率")>-1){
                            str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                        }else{
                            str += obj.seriesName + ' : ' + obj.value + '<br/>'
                        }
                    });
                    return str;
                },
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                padding: [25,0,0,0],
                data:['询价转化率','询价完成率','选择回收方式率','提交成功率','提交成功转化率']
            },
            grid: {
                /* left: '3%',
                 right: '4%',
                 bottom: '3%',*/
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : _.map(data,function(obj){return obj.date})
                }
            ],
            yAxis : [
                {
                    type: 'value',
                    axisLabel:{
                        formatter: '{value} %'
                    }
                },
                /*{
                 type : 'value'
                 },
                 */
            ],
            series : [
                {
                    name:'询价转化率',
                    type:'line',
                    data:inquiry_uv_rate,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'询价完成率',
                    type:'line',
                    data:inquiry_success_uv_rate,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'选择回收方式率',
                    type:'line',
                    data:recycle_uv_rate,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'提交成功率',
                    type:'line',
                    data:submit_success_uv_rate,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'提交成功转化率',
                    type:'line',
                    data:submit_success_uv_conversion_rate,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                }

            ]
        };

        dynamicProductLineChart.setOption(lineOption);
        dynamicProductLineChart.resize();
        window.addEventListener('resize',dynamicProductLineChart.resize)


        $('#productTable').bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data:data
        })


    })
}

function drawO2OChart(query){
    $("#o2oloading").show()
    $("#o2oContent").hide()
    var filter = _.clone(query)
    filter.area=$(".o2oArea").val()
    filter.city=$(".o2oCity").val()
    requestURL(dataService+"/projectTrace/getDynamicO2O",cleanParams(filter)).done(function(data){
        $("#o2oloading").hide()
        $("#o2oContent").show()
        var trade_create_cnt_list = _.map(data,function(obj){return obj.trade_create_cnt}) //O2O 订单量
        var onshop_cnt_list = _.map(data,function(obj){return obj.onshop_cnt}) //到店量
        var success_cnt_list = _.map(data,function(obj){return obj.success_cnt})//成交量
        var inwarehouse_cnt_list = _.map(data,function(obj){return obj.inwarehouse_cnt})//入库量
        var outwarehouse_cnt_list = _.map(data,function(obj){return obj.outwarehouse_cnt})//调拨出库量

        var option = {
            title:{
                text: '各环节动态量',
                x: "center",
                //padding:[0,0,0,50]
            },
            tooltip : {
                trigger: 'axis',
                /*formatter:function(params,ticket,callback){
                    var str = params[0].name + '<br/>';
                    params.forEach(function(obj){
                        if(obj.seriesName.indexOf("占比")>-1){
                            str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                        }else{
                            str += obj.seriesName + ' : ' + obj.value + '<br/>'
                        }
                    });
                    return str;
                },*/
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                padding: [25,0,0,0],
                data:['O2O订单量','到店量','成交量','入库量','调拨出库量']
            },
            grid: {
               /* left: '3%',
                right: '4%',
                bottom: '3%',*/
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : _.map(data,function(obj){return obj.date})
                }
            ],
            yAxis : [
                {
                    type : 'value'
                },
                {
                    type: 'value',
                    axisLabel:{
                        formatter: '{value} %'
                    }
                },
            ],
            series : [
                {
                    name:'O2O订单量',
                    type:'bar',
                    data:trade_create_cnt_list,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'到店量',
                    type:'bar',
                    data:onshop_cnt_list,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'成交量',
                    type:'bar',
                    data:success_cnt_list,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'入库量',
                    type:'bar',
                    data:inwarehouse_cnt_list,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'调拨出库量',
                    type:'bar',
                    data:outwarehouse_cnt_list,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },

            ]
        };

        dynamicO2OChart.setOption(option);
        dynamicO2OChart.resize()
        window.addEventListener('resize',dynamicO2OChart.resize)



        var onshop_rate_list = _.map(_.zip(onshop_cnt_list,trade_create_cnt_list),function(obj){return (100*obj[0]/obj[1]).toFixed(2)})
        var success_rate_list = _.map(_.zip(success_cnt_list,onshop_cnt_list),function(obj){return (100*obj[0]/obj[1]).toFixed(2)})
        var inwarehouse_rate_list = _.map(_.zip(inwarehouse_cnt_list,success_cnt_list),function(obj){return (100*obj[0]/obj[1]).toFixed(2)})
        var outwarehouse_rate_list = _.map(_.zip(outwarehouse_cnt_list,inwarehouse_cnt_list),function(obj){return (100*obj[0]/obj[1]).toFixed(2)})
        var lineOption = {
            title:{
                text: '各环节动态率',
                x: "center",
                //padding:[0,0,0,50]
            },
            tooltip : {
                trigger: 'axis',
                formatter:function(params,ticket,callback){
                 var str = params[0].name + '<br/>';
                 params.forEach(function(obj){
                 if(obj.seriesName.indexOf("率")>-1){
                 str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                 }else{
                 str += obj.seriesName + ' : ' + obj.value + '<br/>'
                 }
                 });
                 return str;
                 },
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                padding: [25,0,0,0],
                data:['到店转化率','成交到店率','入库成交率','调拨出库入库率']
            },
            grid: {
                /* left: '3%',
                 right: '4%',
                 bottom: '3%',*/
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : _.map(data,function(obj){return obj.date})
                }
            ],
            yAxis : [
                {
                    type: 'value',
                    axisLabel:{
                        formatter: '{value} %'
                    }
                },
                /*{
                    type : 'value'
                },
                */
            ],
            series : [
                {
                    name:'到店转化率',
                    type:'line',
                    data:onshop_rate_list,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'成交到店率',
                    type:'line',
                    data:success_rate_list,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'入库成交率',
                    type:'line',
                    data:inwarehouse_rate_list,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'调拨出库入库率',
                    type:'line',
                    data:outwarehouse_rate_list,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                }

            ]
        };

        dynamicO2OLineChart.setOption(lineOption);
        dynamicO2OLineChart.resize()
        window.addEventListener('resize',dynamicO2OLineChart.resize)


        $('#o2oTable').bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data:data
        })


    })
}


function drawOndoorChart(query){
    $("#ondoorloading").show()
    $("#ondoorContent").hide()
    var filter = _.clone(query)
    filter.area=$(".ondoorArea").val()
    filter.city=$(".ondoorCity").val()
    requestURL(dataService+"/projectTrace/getDynamicOndoor",cleanParams(filter)).done(function(data){
        $("#ondoorloading").hide()
        $("#ondoorContent").show()
        var trade_create_cnt_list = _.map(data,function(obj){return obj.trade_create_cnt}) //上门提交量
        var customer_cnt_list=_.map(data,function(obj){return obj.customer_cnt})//客服派单量
        var supervisor_cnt_list=_.map(data,function(obj){return obj.supervisor_cnt})//督导派单量
        var ondoor_cnt_list = _.map(data,function(obj){return obj.ondoor_cnt}) //上门量
        var success_cnt_list = _.map(data,function(obj){return obj.success_cnt})//成交量
        var inwarehouse_cnt_list = _.map(data,function(obj){return obj.inwarehouse_cnt})//入库量
        var outwarehouse_cnt_list = _.map(data,function(obj){return obj.outwarehouse_cnt})//调拨出库量

        var option = {
            title:{
                text: '各环节动态量',
                x: "center",
                //padding:[0,0,0,50]
            },
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                padding: [25,0,0,0],
                data:['上门提交量','客服派单量','督导派单量','上门量','成交量','入库量','调拨出库量']
            },
            grid: {
                /* left: '3%',
                 right: '4%',
                 bottom: '3%',*/
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : _.map(data,function(obj){return obj.date})
                }
            ],
            yAxis : [
                {
                    type : 'value'
                },
                {
                    type: 'value',
                    axisLabel:{
                        formatter: '{value} %'
                    }
                },
            ],
            series : [
                {
                    name:'上门提交量',
                    type:'bar',
                    data:trade_create_cnt_list,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'客服派单量',
                    type:'bar',
                    data:customer_cnt_list,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'督导派单量',
                    type:'bar',
                    data:supervisor_cnt_list,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'上门量',
                    type:'bar',
                    data:ondoor_cnt_list,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'成交量',
                    type:'bar',
                    data:success_cnt_list,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'入库量',
                    type:'bar',
                    data:inwarehouse_cnt_list,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'调拨出库量',
                    type:'bar',
                    data:outwarehouse_cnt_list,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },

            ]
        };

        dynamicOndoorChart.setOption(option);
        dynamicOndoorChart.resize()
        window.addEventListener('resize',dynamicOndoorChart.resize)



        var customer_rate_list = _.map(_.zip(customer_cnt_list,trade_create_cnt_list),function(obj){return (100*obj[0]/obj[1]).toFixed(2)})//客服派单转化率
        var supervisor_rate_list = _.map(_.zip(supervisor_cnt_list,customer_cnt_list),function(obj){return (100*obj[0]/obj[1]).toFixed(2)})//督导客服派单率
        var ondoor_rate_list = _.map(_.zip(ondoor_cnt_list,supervisor_cnt_list),function(obj){return (100*obj[0]/obj[1]).toFixed(2)})//上门督导派单率
        var success_rate_list=_.map(_.zip(success_cnt_list,ondoor_cnt_list),function(obj){return (100*obj[0]/obj[1]).toFixed(2)})//成交上门率
        var inwarehouse_rate_list=_.map(_.zip(inwarehouse_cnt_list,success_cnt_list),function(obj){return (100*obj[0]/obj[1]).toFixed(2)})//入库成交率
        var inwarehouse_conversion_rate_list=_.map(_.zip(inwarehouse_cnt_list,trade_create_cnt_list),function(obj){return (100*obj[0]/obj[1]).toFixed(2)})//入库转化率
        var outwarehouse_rate_list = _.map(_.zip(outwarehouse_cnt_list,inwarehouse_cnt_list),function(obj){return (100*obj[0]/obj[1]).toFixed(2)})//调拨出库入库率

        var lineOption = {
            title:{
                text: '各环节动态率',
                x: "center",
                //padding:[0,0,0,50]
            },
            tooltip : {
                trigger: 'axis',
                formatter:function(params,ticket,callback){
                    var str = params[0].name + '<br/>';
                    params.forEach(function(obj){
                        if(obj.seriesName.indexOf("率")>-1){
                            str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                        }else{
                            str += obj.seriesName + ' : ' + obj.value + '<br/>'
                        }
                    });
                    return str;
                },
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                padding: [25,0,0,0],
                data:['客服派单转化率','督导客服派单率','上门督导派单率','成交上门率','入库成交率','入库转化率','调拨出库入库率']
            },
            grid: {
                /* left: '3%',
                 right: '4%',
                 bottom: '3%',*/
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : _.map(data,function(obj){return obj.date})
                }
            ],
            yAxis : [
                {
                    type: 'value',
                    axisLabel:{
                        formatter: '{value} %'
                    }
                },
                /*{
                 type : 'value'
                 },
                 */
            ],
            series : [
                {
                    name:'客服派单转化率',
                    type:'line',
                    data:customer_rate_list,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'督导客服派单率',
                    type:'line',
                    data:supervisor_rate_list,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'上门督导派单率',
                    type:'line',
                    data:ondoor_rate_list,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'成交上门率',
                    type:'line',
                    data:success_rate_list,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'入库成交率',
                    type:'line',
                    data:inwarehouse_rate_list,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'入库转化率',
                    type:'line',
                    data:inwarehouse_conversion_rate_list,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'调拨出库入库率',
                    type:'line',
                    data:outwarehouse_rate_list,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                }

            ]
        };

        dynamicOndoorLineChart.setOption(lineOption);
        dynamicOndoorLineChart.resize()
        window.addEventListener('resize',dynamicOndoorLineChart.resize)


        $('#ondoorTable').bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data:data
        })

    })
}

function drawLogisticsChart(obj){
    $("#logisticsloading").show()
    var query = {
        "startDate":obj.startDate,
        "endDate":obj.endDate,
        "channel":$("#channel").val()
    };
    $("#logisticsContent").hide()
    requestURL(dataService+"/projectTrace/getDynamicLogistics",query).done(function(data){
        $("#logisticsloading").hide()
        $("#logisticsContent").show()
        var trade_create_cnt_list = _.map(data,function(obj){return obj.trade_create_cnt}) //上门提交量
        var receipt_cnt_list = _.map(data,function(obj){return obj.receipt_cnt})//快递 到货量
        var inspection_receive_cnt_list = _.map(data,function(obj){return obj.inspection_receive_cnt})//质检接收量
        var inspection_cnt_list = _.map(data,function(obj){return obj.inspection_cnt}) //质检量
        var success_cnt_list = _.map(data,function(obj){return obj.success_cnt})//成交量
        var inwarehouse_cnt_list = _.map(data,function(obj){return obj.inwarehouse_cnt})//入库量
        var outwarehouse_cnt_list = _.map(data,function(obj){return obj.outwarehouse_cnt})//调拨出库量
        var stay_in_inspection_cnt_list = _.map(data,function(obj){return obj.stay_in_inspection_cnt})//质检未入库未退货量
        var retrieve_cnt_list = _.map(data,function(obj){return obj.retrieve_cnt})//退货量


        var option = {
            title:{
                text: '各环节动态量',
                x: "center",
                //padding:[0,0,0,50]
            },
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                padding: [25,0,0,0],
                data:['快递提交量','快递到货量','质检接收量','质检量','成交量','入库量','出库量','退货量','质检未入库未退货量']
            },
            grid: {
                /* left: '3%',
                 right: '4%',
                 bottom: '3%',*/
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : _.map(data,function(obj){return obj.date})
                }
            ],
            yAxis : [
                {
                    type : 'value'
                },
                {
                    type: 'value',
                    axisLabel:{
                        formatter: '{value} %'
                    }
                },
            ],
            series : [
                {
                    name:'快递提交量',
                    type:'bar',
                    data:trade_create_cnt_list,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'快递到货量',
                    type:'bar',
                    data:receipt_cnt_list,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'质检接收量',
                    type:'bar',
                    data:inspection_receive_cnt_list,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'质检量',
                    type:'bar',
                    data:inspection_cnt_list,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'成交量',
                    type:'bar',
                    data:success_cnt_list,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'入库量',
                    type:'bar',
                    data:inwarehouse_cnt_list,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'出库量',
                    type:'bar',
                    data:outwarehouse_cnt_list,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'退货量',
                    type:'bar',
                    data:retrieve_cnt_list,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'质检未入库未退货量',
                    type:'bar',
                    data:stay_in_inspection_cnt_list,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },


            ]
        };

        dynamicLogisticsChart.setOption(option);
        dynamicLogisticsChart.resize()
        window.addEventListener('resize',dynamicLogisticsChart.resize)


        var receipt_cnt_rate_list = _.map(_.zip(receipt_cnt_list,trade_create_cnt_list),function(obj){return (100*obj[0]/obj[1]).toFixed(2)})//到货转化率
        var inspection_receive_cnt_rate_list = _.map(_.zip(inspection_receive_cnt_list, receipt_cnt_list),function(obj){return (100*obj[0]/obj[1]).toFixed(2)})//质检到货率
        var inspection_cnt_rate_list = _.map(_.zip(inspection_cnt_list,inspection_receive_cnt_list),function(obj){return (100*obj[0]/obj[1]).toFixed(2)})//质检接受率
        var inwarehouse_cnt_rate_list = _.map(_.zip(inwarehouse_cnt_list,inspection_cnt_list),function(obj){return (100*obj[0]/obj[1]).toFixed(2)})//入库质检率
        var outwarehouse_cnt_rate_list = _.map(_.zip(outwarehouse_cnt_list,inwarehouse_cnt_list),function(obj){return (100*obj[0]/obj[1]).toFixed(2)})//出库入库率
        var stay_in_inspection_rate_list = _.map(_.zip(stay_in_inspection_cnt_list,inspection_cnt_list),function(obj){return (100*obj[0]/obj[1]).toFixed(2)})//未入库质检率


        var lineOption = {
            title:{
                text: '各环节动态率',
                x: "center",
                //padding:[0,0,0,50]
            },
            tooltip : {
                trigger: 'axis',
                formatter:function(params,ticket,callback){
                    var str = params[0].name + '<br/>';
                    params.forEach(function(obj){
                        if(obj.seriesName.indexOf("率")>-1){
                            str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                        }else{
                            str += obj.seriesName + ' : ' + obj.value + '<br/>'
                        }
                    });
                    return str;
                },
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                padding: [25,0,0,0],
                data:['到货转化率','质检到货率','质检接收率','入库质检率','出库入库率','未入库质检率']
            },
            grid: {
                /* left: '3%',
                 right: '4%',
                 bottom: '3%',*/
                containLabel: true
            },
            xAxis : [
                {
                    type : 'category',
                    data : _.map(data,function(obj){return obj.date})
                }
            ],
            yAxis : [
                {
                    type: 'value',
                    axisLabel:{
                        formatter: '{value} %'
                    }
                },
                /*{
                 type : 'value'
                 },
                 */
            ],
            series : [
                {
                    name:'到货转化率',
                    type:'line',
                    data:receipt_cnt_rate_list,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'质检到货率',
                    type:'line',
                    data:inspection_receive_cnt_rate_list,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'质检接收率',
                    type:'line',
                    data:inspection_cnt_rate_list,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'入库质检率',
                    type:'line',
                    data:inwarehouse_cnt_rate_list,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'出库入库率',
                    type:'line',
                    data:outwarehouse_cnt_rate_list,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'未入库质检率',
                    type:'line',
                    data:stay_in_inspection_rate_list,
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                }

            ]
        };
        dynamicLogisticsLineChart.setOption(lineOption);
        dynamicLogisticsLineChart.resize()
        window.addEventListener('resize',dynamicLogisticsLineChart.resize)


        $('#logisticsTable').bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data:data
        })

    })
}