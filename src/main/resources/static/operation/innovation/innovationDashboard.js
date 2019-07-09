

Template.innovationDashboard.rendered = function() {
    $('.navi-tab').removeClass('active');
    $('#operation').addClass('active');
    $('#businessdashboard').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }

    getData();
    $(".c-circle").on('click',function(){

        var $this = $(this).next(".flag")
        var _class = $this.attr("class");
        var num = $this.attr("data-value");
        hideCollapsedFunc()
        if(_class.indexOf("glyphicon-chevron-down")>-1){
            $this.removeClass("glyphicon-chevron-down");
            $this.addClass("glyphicon-chevron-up");
        }else if(_class.indexOf("glyphicon-chevron-up")>-1){
            $this.removeClass("glyphicon-chevron-up");
            $this.addClass("glyphicon-chevron-down");
        }
        $("#chart [data-value='"+num+"']").collapse("toggle");
        if(_class.indexOf("glyphicon-chevron-down")>-1){
            switch(num){
                case "1"://订单
                    orderFunc();
                    break;
                case "2"://收货
                    deliveryFunc()
                    break;
                case "3"://验货
                    validateFunc()
                    break;
                case "4"://入库
                    inWarehouseFunc();
                    break;
                case "5"://库存
                    inventoryFunc()
                    break;
            }
        }
    });

    setInterval(function(){
        getData()
    },1000*60*5)
    $(".c-circle").get(0).click()
};

function hideCollapsedFunc(){
    $("i.glyphicon").removeClass("glyphicon-chevron-up");
    $("i.glyphicon").addClass("glyphicon-chevron-down");
    $("div.collapse.in").collapse("hide")
}

function getData(){
    requestURL(dataService+"/innovation/getOrderItemNum",{}).done(function(data){
        $("#orderItemNum").text(data[0])
        $("#yorderItemNum").text(data[1])
    })

    requestURL(dataService+"/innovation/getDeliveryNum",{}).done(function(data){
        $("#deliveryNum").text(data[0])
        $("#ydeliveryNum").text(data[1])
    })

    requestURL(dataService+"/innovation/getValidateNum",{}).done(function(data){
        $("#validateNum").text(data[0])
        $("#yvalidateNum").text(data[1])
    })

    requestURL(dataService+"/innovation/getInWarehouseNum",{}).done(function(data){
        $("#inWarehouseNum").text(data[0])
        $("#yinWarehouseNum").text(data[1])
    })

    requestURL(dataService+"/innovation/getInventoryNum",{}).done(function(data){
        $("#inventoryNum").text(data[0])
        $("#yinventoryNum").text(data[1])
    })
}
function inventoryFunc(){
    requestURL(dataService+"/innovation/getInventoryDetail",{}).done(function(data){
        var obj={
            num: _.reduce(data,function(num,tmp){return num+tmp.num},0),
            inventoryAmount: _.reduce(data,function(num,tmp){return num+tmp.inventoryAmount},0),
            outAmount: _.reduce(data,function(num,tmp){return num+tmp.outAmount},0),
            last14AvgInventoryAmount: _.reduce(data,function(num,tmp){return num+(tmp.last14AvgInventoryAmount)},0),
            last14AvgOutAmount: _.reduce(data,function(num,tmp){return num+(tmp.last14AvgOutAmount)},0)
        }
        var fixRow = '"<tr style="background-color: #acc087;"", " ", "", "", " data-index="0"", "", "", ">", "<td  style=""    >总计</td>", "<td  style=""    >-</td>", "<td  style=""    >'+obj.num+'</td>", "<td  style=""    >'+obj.inventoryAmount+'</td>", "<td  style=""    >'+obj.outAmount+'</td>", "<td  style=""    >'+((obj.last14AvgInventoryAmount/obj.last14AvgOutAmount)).toFixed(2)+'</td>", "</tr>"'

        $("#inventoryTable").bootstrapTable('destroy').bootstrapTable({
            data: data,
            fixRow:fixRow,
            columns: [{
                field: 'dept',
                title: '归属',
                sortable:false
            }, {
                field: 'name',
                title: '负责人',
                sortable:false
            }
            , {
                field: 'num',
                title: '数量',
                sortable:false
            }
            , {
                field: 'inventoryAmount',
                title: '库存金额',
                sortable:false
            }, {
                field: 'outAmount',
                title: '出库金额',
                sortable:false
            }, {
                field: '',
                title: '最近14天平均库存金额/最近14天平均出库金额',
                sortable:false,
                formatter:function(value,row,index){
                    if(row.last14AvgOutAmount==0){
                        return "0.00"
                    }
                    return ((row.last14AvgInventoryAmount/row.last14AvgOutAmount)).toFixed(2)+""
                }
            }]
        })
    })
}
function orderFunc(){

    function drawSourceChart(sourceList){
        var labels = [];
        var xLabels = [];
        var barData = [];
        var pieData = [];
        var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
        _.sortBy(sourceList,function(obj){return -obj.value}).forEach(function(e){
            labels.push(e.name);
            xLabels.push(e.name + ":" + e.value+"(昨天:"+ e.yestValue+")");
            barData.push({
                value: e.value,
                itemStyle: {
                    normal: {
                        color: colors.pop()
                    }
                }
            });
            pieData.push({name: e.name, value: e.value})
        })
        var option = {
            title: {
                text: '渠道来源',
                top: '90%',
                left: 'center'
            },
            tooltip: {},
            legend: {
                data:["订单数"] //labels
            },
            calculable: true,
            grid: {
                //top: 80,
                //bottom: 120,
                containLabel:true
            },
            yAxis: [
                {
                    'type': 'category',
                    'data': xLabels.reverse(),
                    axisLabel:{
                        interval:0
                    }
                }
            ],
            xAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '订单数',
                    type: 'bar',
                    label: {normal: {show: true, position: 'right', formatter: '{b}'}},
                    data: _.sortBy(barData,function(obj){return obj.value})
                }/*, {
                    name: '订单数渠道占比',
                    type: 'pie',
                    itemStyle: {
                        normal: {
                            borderWidth: 1
                        }
                    },
                    center: ['75%', '35%'],
                    radius: '28%',
                    data: pieData
                }*/]
        };

        var orderChannel = echarts.init(document.getElementById("orderChannel"));
        orderChannel.setOption(option);
        window.addEventListener('resize',orderChannel.resize)
    }

    function drawMethodChart(methodList){
        var labels = [];
        var xLabels = [];
        var barData = [];
        var pieData = [];
        var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
        _.sortBy(methodList,function(obj){return -obj.value}).forEach(function(e){
            labels.push(e.name);
            xLabels.push(e.name + ":" + e.value+"\n昨天:"+ e.yestValue);
            barData.push({
                value: e.value,
                itemStyle: {
                    normal: {
                        color: colors.pop()
                    }
                }
            });
            pieData.push({name: e.name, value: e.value})
        })
        var option = {
            title: {
                text: '交易方式',
                top: '90%',
                left: 'center'
            },
            tooltip: {},
            legend: {
                data: labels
            },
            calculable: true,
            grid: {
                //top: 80,
                //bottom: 120,
                containLabel:true
            },
            xAxis: [
                {
                    'type': 'category',
                    'data': xLabels
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '订单数',
                    type: 'bar',
                    label: {normal: {show: true, position: 'top', formatter: '{b}'}},
                    data: barData
                }, {
                    name: '订单数渠道占比',
                    type: 'pie',
                    itemStyle: {
                        normal: {
                            borderWidth: 1
                        }
                    },
                    center: ['75%', '30%'],
                    radius: '28%',
                    labelLine:{
                        normal:{
                            length:10,
                            length2:10
                        }
                    },
                    data: pieData
                }]
        };

        var orderMethod = echarts.init(document.getElementById("orderMethod"));
        orderMethod.setOption(option);
        window.addEventListener('resize',orderMethod.resize)
    }

    requestURL(dataService+"/innovation/getClassifyOrderItem",{}).done(function(data){
        var sourceObj = _.groupBy(data,function(obj){return obj.source_key});
        var sourceList=[];
        for(var key in sourceObj){
            var name = dimTradeSourceAgent.findOne({source_key:parseInt(key)}).source_name;
            var value = _.reduce(_.filter(sourceObj[key],function(obj){return obj.flag=="today"}),function(num,obj){return num+obj.num},0)
            var yesterdayValue = _.reduce(_.filter(sourceObj[key],function(obj){return obj.flag=="yesterday"}),function(num,obj){return num+obj.num},0)
            sourceList.push({name:name,value:value,yestValue:yesterdayValue})

        }
        drawSourceChart(sourceList)

        var methodObj = _.groupBy(data,function(obj){return obj.method})
        var methodList=[];
        for(var key in methodObj){
            var value = _.reduce(_.filter(methodObj[key],function(obj){return obj.flag=="today"}),function(num,obj){return num+obj.num},0)
            var yesterdayValue = _.reduce(_.filter(methodObj[key],function(obj){return obj.flag=="yesterday"}),function(num,obj){return num+obj.num},0)
            methodList.push({name:key,value:value,yestValue:yesterdayValue})

        }
        drawMethodChart(methodList)

    })

}
function inWarehouseFunc(){

    function category(data){
        var categoryObj = _.groupBy(data,function(obj){return obj.category});
        var list=[];
        //为了品类降排序
        for(var key in categoryObj){
            list.push({
                category:key,
                sum:_.reduce(categoryObj[key],function(num,tmp){return num+tmp.num},0)
            })
        }
        var channelList = _.map(data,function(obj){return obj.channel}).unique();
        var seriesList=[]
        //初始化series模板
        channelList.forEach(function(ele){
            seriesList.push({
                "name":ele,
                "type":"bar",
                "stack":"总量",
                label: {
                    normal: {
                        show: false,
                        position: 'insideRight'
                    }
                },
                data: _.map(Array.apply(null, Array(list.length)),function(){return 0})

            })
        });
        var categoryList=[]
        //品类排序后填充series值
        _.sortBy(list,function(obj){return obj.sum}).forEach(function(obj,index){
            /**
             * 获取品类 例如 手机
             * 获取手机下 每个品类的值
             */
            var category = obj.category //手机
            categoryList.push(category)
            var channelObj = _.groupBy(categoryObj[category],function(obj){return obj.channel})
            for(var key in channelObj){
                //获取手机品类下 这个渠道的值
                seriesList.forEach(function(obj){
                    if(obj.name==key){
                        obj.data[index]= _.reduce(channelObj[key],function(num,tmp){return num+tmp.num},0)
                    }
                })
            }
        })

        //list 排序 从上之下
        var option = {
            title:{
                text:"各渠道的设备类型分布",
                left:"center"
            },
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: channelList,
                padding:[30,0,0,0]
            },
            grid: {
                /*left: '3%',
                 right: '4%',
                 bottom: '3%',
                 containLabel: true*/
            },
            xAxis:  {
                type: 'value'
            },
            yAxis: {
                type: 'category',
                data: categoryList
            },
            series: seriesList
        };
        var inwarehouseCategory = echarts.init(document.getElementById("inwarehouseCategory"))
        inwarehouseCategory.setOption(option)
        window.addEventListener("resize",inwarehouseCategory.resize)
    }

    //等级划分
    function channelLevel(data,total){
        var channelObj = _.groupBy(data,function(obj){return obj.channel});
        var list=[];
        var levelTotal=0;
        //为了品类降排序
        for(var key in channelObj){
            var sum = _.reduce(channelObj[key],function(num,tmp){return num+tmp.num},0)
            levelTotal+=sum
            list.push({
                channel:key,
                sum:sum
            })
        }
        var levelList = _.map(data,function(obj){return obj.level}).unique();
        var seriesList=[]
        //初始化series模板
        levelList.forEach(function(ele){
            seriesList.push({
                "name":ele,
                "type":"bar",
                "stack":"总量",
                label: {
                    normal: {
                        show: false,
                        position: 'insideRight'
                    }
                },
                data: _.map(Array.apply(null, Array(list.length)),function(){return 0})

            })
        });
        var channelList=[]
        _.sortBy(list,function(obj){return obj.sum}).forEach(function(obj,index){
            var channel = obj.channel;
            channelList.push(channel);
            var levelObj = _.groupBy(channelObj[channel],function(obj){return obj.level});
            for(var key in levelObj){
                //获取手机品类下 这个渠道的值
                seriesList.forEach(function(obj){
                    if(obj.name==key){
                        obj.data[index]= _.reduce(levelObj[key],function(num,tmp){return num+tmp.num},0)
                    }
                })
            }
        })

        //list 排序 从上之下
        var option = {
            title:{
                text:"各渠道入等级库设备等级分布("+(100*levelTotal/total).toFixed(2)+"%)",
                left:"center"
            },
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: levelList,
                padding:[30,0,0,0]
            },
            grid: {
                /*left: '3%',
                 right: '4%',
                 bottom: '3%',
                 containLabel: true*/
            },
            xAxis:  {
                type: 'value'
            },
            yAxis: {
                type: 'category',
                data: channelList
            },
            series: seriesList
        };
        var inwarehouseChannel = echarts.init(document.getElementById("inwarehouseChannel"))
        inwarehouseChannel.setOption(option)
        window.addEventListener("resize",inwarehouseChannel.resize)
    }
    //成色划分
    function channelLevel2(data,total){
        var channelObj = _.groupBy(data,function(obj){return obj.channel});
        var list=[];
        var levelTotal=0;
        //为了品类降排序
        for(var key in channelObj){
            var sum = _.reduce(channelObj[key],function(num,tmp){return num+tmp.num},0)
            levelTotal+=sum
            list.push({
                channel:key,
                sum:sum
            })
        }
        var levelList = _.map(data,function(obj){return obj.level}).unique();
        var seriesList=[]
        //初始化series模板
        levelList.forEach(function(ele){
            seriesList.push({
                "name":ele,
                "type":"bar",
                "stack":"总量",
                label: {
                    normal: {
                        show: false,
                        position: 'insideRight'
                    }
                },
                data: _.map(Array.apply(null, Array(list.length)),function(){return 0})

            })
        });
        var channelList=[]
        _.sortBy(list,function(obj){return obj.sum}).forEach(function(obj,index){
            var channel = obj.channel;
            channelList.push(channel);
            var levelObj = _.groupBy(channelObj[channel],function(obj){return obj.level});
            for(var key in levelObj){
                //获取手机品类下 这个渠道的值
                seriesList.forEach(function(obj){
                    if(obj.name==key){
                        obj.data[index]= _.reduce(levelObj[key],function(num,tmp){return num+tmp.num},0)
                    }
                })
            }
        })

        //list 排序 从上之下
        var option = {
            title:{
                text:"各渠道入成色库设备成色分布("+(100*levelTotal/total).toFixed(2)+"%)",
                left:"center"
            },
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: levelList,
                padding:[30,0,0,0]
            },
            grid: {
                /*left: '3%',
                 right: '4%',
                 bottom: '3%',
                 containLabel: true*/
            },
            xAxis:  {
                type: 'value'
            },
            yAxis: {
                type: 'category',
                data: channelList
            },
            series: seriesList
        };
        var inwarehouseChannel2 = echarts.init(document.getElementById("inwarehouseChannel2"))
        inwarehouseChannel2.setOption(option)
        window.addEventListener("resize",inwarehouseChannel2.resize)
    }

    requestURL(dataService+"/innovation/getInWarehouseByProduct",{}).done(function(data){
        category(data)
        var total = _.reduce(data,function(num,tmp){return num+tmp.num},0)
        channelLevel(_.filter(data,function(obj){return !/^[0-9]+/.test(obj.level)}),total)
        channelLevel2(_.filter(data,function(obj){return /^[0-9]+/.test(obj.level)}),total)
    })

}
function deliveryFunc(){
    requestURL(dataService+"/innovation/getDeliveryDetail",{}).done(function(data){
        var channelList=[]
        var seriesList=[]
        var obj = _.groupBy(data,function(obj){return obj.name})
        for(var key in obj){
            channelList.push(key)
            seriesList.push({
                name: key,
                type: 'bar',
                stack:"1",
                data: _.map(_.sortBy(obj[key],function(tmp){return tmp.date}),function(tmp){return tmp.value})
            })
        }
        var option = {
            title:{
                text:"收货设备渠道分布",
                left:"center"
            },
            tooltip : {
                trigger: 'axis',
                axisPointer : {            // 坐标轴指示器，坐标轴触发有效
                    type : 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                }
            },
            legend: {
                data: channelList,
                padding:[30,0,0,0]
            },
            grid: {
               /* left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true*/
            },
            xAxis:  {
                type: 'value'
            },
            yAxis: {
                type: 'category',
                data: ['今日','昨日']
            },
            series: seriesList
        };
        var comparison = echarts.init(document.getElementById("comparison"))
        comparison.setOption(option)
        window.addEventListener("resize",comparison.resize)

    })
}
function validateFunc(){
    requestURL(dataService+"/innovation/getOncePassRate",{}).done(function(data){
        var dateList=[]
        var seriesList=[]
        var channelObj={
            "BD":[],
            "主营":[],
            "爱机汇":[],
            "物流":[]
        }
        data.forEach(function(obj){
            var date = obj.date
            var name = obj.name
            var value = (100*obj.value).toFixed(2)
            if(!dateList.contains(date)){
                dateList.push(date)
                _.keys(channelObj).forEach(function(ele){
                    channelObj[ele].push(undefined) //默认值
                })
            }
            channelObj[name].pop() //存在 则删除默认值
            channelObj[name].push(value)
        })

        for(var key in channelObj){
            seriesList.push({
                name:key,
                type:'line',
                data:channelObj[key]
            })
        }

        var option = {
            title: {
                text: '一次性通过质检率',
                left: 'center',
            },
            tooltip: {
                trigger: 'axis',
                formatter:function(params,ticket,callback){
                    var str = params[0].name + '<br/>';
                    params.forEach(function(obj){
                        str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                    });
                    return str;
                }
            },
            legend: {
                data:_.keys(channelObj),
                padding:[30,0,0,0]
            },
            grid: {
                /* left: '3%',
                 right: '4%',
                 bottom: '3%',
                 containLabel: true*/
            },
            /*toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },*/
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data:dateList
            },
            yAxis: {
                type: 'value',
                axisLabel:{
                    formatter: '{value} %'
                }
            },
            series: seriesList
        };
        var oncePassRate = echarts.init(document.getElementById("oncePassRate"))
        oncePassRate.setOption(option)
        window.addEventListener("resize",oncePassRate.resize)
    })

    requestURL(dataService+"/innovation/getValidateCheckErrRate",{}).done(function(data){
        var dateList=[]
        var seriesList=[]
        var channelObj={
            "BD":[],
            "主营":[],
            "爱机汇":[],
            "物流":[]
        }
        data.forEach(function(obj){
            var date = obj.date
            var name = obj.name
            var value = (100*obj.value).toFixed(2)
            if(!dateList.contains(date)){
                dateList.push(date)
                _.keys(channelObj).forEach(function(ele){
                    channelObj[ele].push(undefined) //默认值
                })
            }
            channelObj[name].pop() //存在 则删除默认值
            channelObj[name].push(value)
        })

        for(var key in channelObj){
            seriesList.push({
                name:key,
                type:'line',
                data:channelObj[key]
            })
        }

        var option = {
            title: {
                text: '质检失误率',
                left: 'center',
            },
            tooltip: {
                trigger: 'axis',
                formatter:function(params,ticket,callback){
                    var str = params[0].name + '<br/>';
                    params.forEach(function(obj){
                        str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                    });
                    return str;
                }
            },
            legend: {
                data:_.keys(channelObj),
                padding:[30,0,0,0]
            },
            grid: {
               /* left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true*/
            },
            /*toolbox: {
                feature: {
                    saveAsImage: {}
                }
            },*/
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data:dateList
            },
            yAxis: {
                type: 'value',
                axisLabel:{
                    formatter: '{value} %'
                }
            },
            series: seriesList
        };
        var checkErrRate = echarts.init(document.getElementById("checkErrRate"))
        checkErrRate.setOption(option)
        window.addEventListener("resize",checkErrRate.resize)
    })
}

