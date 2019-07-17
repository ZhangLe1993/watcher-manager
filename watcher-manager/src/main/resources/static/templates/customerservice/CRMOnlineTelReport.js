Template.CRMOnlineTelReport.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#CustomerServiceTab').addClass('active');
    $('#CustomerOnlineTelReportTab').addClass('active');

    if(isMobile()){
        $('.sidebar-toggle').click();
    }

    getOptions().done(function(data){
        renderOptions("#dt",data.dtList);
        renderOptions("#select",data.itemList)
        renderPage()
    })


    $("button.updateBtn").click(function(param){
        var commentType = param.currentTarget.id.substring(9);
        var data = {
            "reportName": "在线客服质量分析报告",
            "reportDate": $("#dt").val(),
            "commentType": commentType,
            "commentText":  $("#textInput" + commentType).val()
        };
        if(commentType==17){
            var item=$("#select").val()
            data.commentType=item+"_"+commentType
        }

        updateComments(data);
    })



    $("#dt").change(function(){
        renderPage()
    })

    $("#select").change(function(){
        drawErrorRateByItem()
        $(".innergroup .comment").val("")
        renderComments({
            reportDate: $("#dt").val(),
            reportName: "在线客服质量分析报告"
        })
    })
};


function updateComments(data){
    requestURLPost(dataService + "/crm/setCRMReportComments", data).done(function (res) {
        if (res.result == "OK") {
            alert("更新成功!!!");
        } else {
            alert("更新失败!!!");
        }
    })
}

function renderComments(query){

    requestURL(dataService + "/crm/getCRMReportComments", query).done(function (data) {
        data.forEach(function (e) {
            if(isNaN(e.commentType)&&e.commentType.split("_")[0]==$("#select").val()){
                $("#textInput" + e.commentType.split("_")[1]).val(e.commentText);
            }else{
                $("#textInput" + e.commentType).val(e.commentText);
            }
        });
    });
}

function getOptions(){
    var dfd = $.Deferred();
    requestURL(dataService+"/crmOnLineTelReport/getCRMTelReportOptions",{}).done(function(data){
        dfd.resolve(data)
    });
    return dfd.promise()
}

function renderOptions(sel,data){
    $(sel).empty();
    data.forEach(function(ele){
        $(sel).append("<option value='"+ele+"'>"+ele+"</option>")
    });
}



function renderPage(){

    drawMonitorInfo()
    drawKeyErrRateChart()
    drawOtherKeyErrRateChart()
    drawPersonScoreChart()
    drawEvaluateItemChart()
    drawCompareEvaluateItemChart()
    drawResponseItemChart()
    drawCompareResponseItemChart()
    drawErrorRateByItem()

    $(".comment").val("");
    renderComments({
        reportDate: $("#dt").val(),
        reportName: "在线客服质量分析报告"
    })

}

function drawErrorRateByItem(){
    var item=$("#select").val();
    var query = {
        "date":$("#dt").val(),
        "item":item
    };
    requestURL(dataService+"/crmOnLineTelReport/getErrorRateByItem",query).done(function(data){
        var option = {
            title:{
                text: item,
                x: "center",
                padding:[0,0,0,50]
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
                data:['错误量','错误率']
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
                    axisLabel:{
                        interval:0
                    },
                    data : _.map(data,function(obj,index){return obj.name})
                }
            ],
            yAxis : [
                 {
                 type : 'value',
                 minInterval: 1
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
                    name:'错误量',
                    type:'bar',
                    data:_.map(data,function(obj){return obj.keyCnt}),
                    label:{
                        normal:{
                            show:true,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'错误率',
                    type:'line',
                    yAxisIndex: 1,
                    data:_.map(data,function(obj){return obj.rate}),
                    label:{
                        normal:{
                            show:true,
                            position:"top",
                            formatter: "{c}%"
                        }
                    },
                },

            ]
        };

        var keyErrChart = echarts.init(document.getElementById("itemErrorRateChart"));
        keyErrChart.setOption(option);
        window.addEventListener('resize',keyErrChart.resize)


        var theadList= _.union(["业务类型"],_.map(data,function(obj){return obj.name}))
        var keyCntObj={"业务类型":"错误量"}
        var keyErrCntObj={"业务类型":"错误率"}

        data.forEach(function(obj){
            keyCntObj[obj.name]=obj.keyCnt.toFixed(2)
            keyErrCntObj[obj.name]=obj.rate.toFixed(2)+"%"


        })
        var dataList=[]
        dataList.push(keyErrCntObj)
        dataList.push(keyCntObj)
        var columns=[]
        theadList.forEach(function(ele){
            columns.push({
                field: ele,
                title: ele
            })
        })
        $("#itemErrorRateTable").bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data: dataList,
            columns:columns
        })
    })
}

function drawCompareResponseItemChart(){
    var query = {
        "date":$("#dt").val()
    };
    requestURL(dataService+"/crmOnLineTelReport/getCompareResponseItem",query).done(function(data){
        var option = {
            title:{
                text: "本期响应速率区间占比与上期对比分析",
                x: "center",
                padding:[0,0,0,50]
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
                data:['本期出错率','上期出错率']
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
                    axisLabel:{
                        interval:0
                    },
                    data : _.map(data,function(obj,index){return obj.name})
                }
            ],
            yAxis : [
                /* {
                 type : 'value',
                 minInterval: 1
                 },*/
                {
                    type: 'value',
                    axisLabel:{
                        formatter: '{value} %'
                    }
                },
            ],
            series : [
                {
                    name:'本期出错率',
                    type:'bar',
                    data:_.map(data,function(obj){return obj.keyCnt}),
                    label:{
                        normal:{
                            show:true,
                            position:"top",
                            formatter: "{c}%"
                        }
                    },
                },
                {
                    name:'上期出错率',
                    type:'bar',
                    data:_.map(data,function(obj){return obj.otherCnt}),
                    label:{
                        normal:{
                            show:true,
                            position:"top",
                            formatter: "{c}%"
                        }
                    },
                },

            ]
        };

        var keyErrChart = echarts.init(document.getElementById("compareResponseItemChart"));
        keyErrChart.setOption(option);
        window.addEventListener('resize',keyErrChart.resize)


        var theadList= _.union(["业务类型"],_.map(data,function(obj){return obj.name}))
        var keyCntObj={"业务类型":"本期出错率"}
        var keyErrCntObj={"业务类型":"上期出错率"}
        var difErrObj={"业务类型":"升降幅"}

        data.forEach(function(obj){
            keyCntObj[obj.name]=obj.keyCnt.toFixed(2)+"%"
            keyErrCntObj[obj.name]=obj.otherCnt.toFixed(2)+"%"
            var dif=obj.rate
            var difHtml=""
            if(dif<0){
                difHtml="<span style='color: blue'>"+(dif*-1).toFixed(2)+"%</span>"
            }else if(dif>0){
                difHtml="<span style='color: red'>"+(dif).toFixed(2)+"%</span>"
            }else{
                difHtml=dif.toFixed(2)+"%"
            }
            difErrObj[obj.name]=difHtml

        })
        var dataList=[]
        dataList.push(keyErrCntObj)
        dataList.push(keyCntObj)
        dataList.push(difErrObj)
        var columns=[]
        theadList.forEach(function(ele){
            columns.push({
                field: ele,
                title: ele
            })
        })
        $("#compareResponseItemTable").bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data: dataList,
            columns:columns
        })
    })
}

function drawResponseItemChart(){
    var query = {
        "date":$("#dt").val()
    };
    requestURL(dataService+"/crmOnLineTelReport/getResponseItem",query).done(function(ret){
        var sum = _.map(ret,function(obj){return obj.value}).sum()
        var option = {
            title:{
                text: '监控量与人员占比情况',
                x: "center",
                padding:[0,0,0,50]
            },
            tooltip : {
                trigger: 'axis',
                formatter:function(params,ticket,callback){
                    var str = params[0].name + '<br/>';
                    params.forEach(function(obj){
                        if(obj.seriesName.indexOf("占比")>-1){
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
                data:['响应区间量','响应区间占比']
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
                    data : _.map(ret,function(obj){return obj.name})
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
                    name:'响应区间量',
                    type:'bar',
                    data:_.map(ret,function(obj){return obj.value}),
                    label:{
                        normal:{
                            show:true,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'响应区间占比',
                    type:'line',
                    yAxisIndex: 1,
                    data:_.map(ret,function(obj){return (100*obj.value/sum).toFixed(2)}),
                    label:{
                        normal:{
                            show:true,
                            position:"top",
                            formatter: "{c}%",
                            /*textStyle:{
                             color:"black"
                             }*/
                        }
                    },
                },

            ]
        };
        var monitorInfoChart = echarts.init(document.getElementById('responseItemChart'));
        monitorInfoChart.setOption(option);
        window.addEventListener('resize',monitorInfoChart.resize)

        var theadList= _.union(["业务类型"],_.map(ret,function(obj){return obj.name}))
        var columns=[]
        var tabledata=[]

        var monitorNumObj={"业务类型":"响应区间量"}
        var monitorNumRateObj={"业务类型":"响应区间占比"}
        ret.forEach(function(obj){
            monitorNumObj[obj.name]=obj.value
            monitorNumRateObj[obj.name]=(100*obj.value/sum).toFixed(2)+"%"
        })
        tabledata.push(monitorNumObj)
        tabledata.push(monitorNumRateObj)

        theadList.forEach(function(ele){
            columns.push({
                field: ele,
                title: ele
            })
        })
        $('#responseItemTable').bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data: tabledata,
            columns:columns
        })
    })
}

function drawCompareEvaluateItemChart(){

    var query = {
        "date":$("#dt").val()
    };

    requestURL(dataService+"/crmOnLineTelReport/getCompareEvaluateItem",query).done(function(data){

        var option = {
            title:{
                text: "各评估项出错率与上期对比分析",
                x: "center",
                padding:[0,0,0,50]
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
                data:['本期出错率','上期出错率']
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
                    axisLabel:{
                        interval:0
                    },
                    data : _.map(data,function(obj,index){return index%2==0?obj.name:"\n\n"+obj.name})
                }
            ],
            yAxis : [
               /* {
                    type : 'value',
                    minInterval: 1
                },*/
                {
                    type: 'value',
                    axisLabel:{
                        formatter: '{value} %'
                    }
                },
            ],
            series : [
                {
                    name:'本期出错率',
                    type:'bar',
                    data:_.map(data,function(obj){return obj.keyCnt}),
                    label:{
                        normal:{
                            show:true,
                            position:"top",
                            formatter: "{c}%"
                        }
                    },
                },
                {
                    name:'上期出错率',
                    type:'bar',
                    data:_.map(data,function(obj){return obj.otherCnt}),
                    label:{
                        normal:{
                            show:true,
                            position:"top",
                            formatter: "{c}%"
                        }
                    },
                },

            ]
        };

        var keyErrChart = echarts.init(document.getElementById("compareEvaluateItemChart"));
        keyErrChart.setOption(option);
        window.addEventListener('resize',keyErrChart.resize)


        var theadList= _.union(["业务类型"],_.map(data,function(obj){return obj.name}))
        var keyCntObj={"业务类型":"本期出错率"}
        var keyErrCntObj={"业务类型":"上期出错率"}
        var difErrObj={"业务类型":"升降幅"}

        data.forEach(function(obj){
            keyCntObj[obj.name]=obj.keyCnt.toFixed(2)+"%"
            keyErrCntObj[obj.name]=obj.otherCnt.toFixed(2)+"%"
            var dif=obj.rate
            var difHtml=""
            if(dif<0){
                difHtml="<span style='color: blue'>"+(dif*-1).toFixed(2)+"%</span>"
            }else if(dif>0){
                difHtml="<span style='color: red'>"+(dif).toFixed(2)+"%</span>"
            }else{
                difHtml=dif.toFixed(2)+"%"
            }
            difErrObj[obj.name]=difHtml

        })
        var dataList=[]
        dataList.push(keyErrCntObj)
        dataList.push(keyCntObj)
        dataList.push(difErrObj)
        var columns=[]
        theadList.forEach(function(ele){
            columns.push({
                field: ele,
                title: ele
            })
        })
        $("#compareEvaluateItemTable").bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data: dataList,
            columns:columns
        })
    })
}


function drawEvaluateItemChart(){
    var query = {
        "date":$("#dt").val()
    };

    requestURL(dataService+"/crmOnLineTelReport/getEvaluateItem",query).done(function(data){
        var option = {
            title:{
                text: "各评估项出错量&占比",
                x: "center",
                padding:[0,0,0,50]
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
                data:['出错量','出错率']
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
                    data : _.map(data,function(obj){return obj.name})
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
                    name:'出错量',
                    type:'bar',
                    data:_.map(data,function(obj){return obj.keyCnt}),
                    label:{
                        normal:{
                            show:true,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'出错率',
                    type:'line',
                    yAxisIndex: 1,
                    data:_.map(data,function(obj){return obj.rate}),
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

        var keyErrChart = echarts.init(document.getElementById("evaluateItemChart"));
        keyErrChart.setOption(option);
        window.addEventListener('resize',keyErrChart.resize)


        var theadList= _.union(["业务类型"],_.map(data,function(obj){return obj.name}))
        var keyCntObj={"业务类型":"出错量"}
        var keyErrCntObj={"业务类型":"出错率"}
        var rank= 1,preValue=""
        data.forEach(function(obj){
            keyCntObj[obj.name]=obj.keyCnt
            if((rank<=3||preValue==obj.keyCnt)&&obj.keyCnt>0){
                keyErrCntObj[obj.name]="<span style='color:red'>"+obj.rate+"%</span>"
                preValue=obj.keyCnt
            }else{
                keyErrCntObj[obj.name]=obj.rate+"%"
            }
            rank++


        })
        var dataList=[]
        dataList.push(keyCntObj)
        dataList.push(keyErrCntObj)
        var columns=[]
        theadList.forEach(function(ele){
            columns.push({
                field: ele,
                title: ele
            })
        })
        $("#evaluateItemTable").bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data: dataList,
            columns:columns
        })
    })
}

function drawPersonScoreChart(){

    var query = {
        "date":$("#dt").val()
    };
    requestURL(dataService+"/crmOnLineTelReport/getPersonScore",query).done(function(data){

        var option = {
            title:{
                text: "在线组人员得分",
                x: "center",
                padding:[0,0,0,50]
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
                data:['平均分','标准线']
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
                    data : _.map(data,function(obj){return obj.name})
                }
            ],
            yAxis : [
                {
                    type : 'value'
                },
               /* {
                    type: 'value',
                    axisLabel:{
                        formatter: '{value} %'
                    }
                },*/
            ],
            series : [
                {
                    name:'平均分',
                    type:'line',
                    data:_.map(data,function(obj){return obj.keyCnt}),
                    label:{
                        normal:{
                            show:true,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'标准线',
                    type:'line',
                    data:_.map(data,function(obj){return 97}),
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

        var keyErrChart = echarts.init(document.getElementById("avgScoreChart"));
        keyErrChart.setOption(option);
        window.addEventListener('resize',keyErrChart.resize)


        var theadList= _.union(["业务类型"],_.map(data,function(obj){return obj.name}))
        var keyCntObj={"业务类型":"平均分"}
        var keyErrCntObj={"业务类型":"排名"}

        data.forEach(function(obj){
            keyCntObj[obj.name]=obj.keyCnt
            keyErrCntObj[obj.name]=obj.otherCnt

        })
        var dataList=[]
        dataList.push(keyCntObj)
        dataList.push(keyErrCntObj)
        var columns=[]
        theadList.forEach(function(ele){
            columns.push({
                field: ele,
                title: ele
            })
        })
        $("#avgScoreTable").bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data: dataList,
            columns:columns
        })
    })

}


//非关键错误准确率
function drawOtherKeyErrRateChart(){
    var query = {
        "date":$("#dt").val()
    };

    requestURL(dataService+"/crmOnLineTelReport/getOtherKeyErrRate",query).done(function(data){
        var len=data.length
        var keyList=_.map(data,function(obj){return obj.keyCnt})
        var otherList=_.map(data,function(obj){return obj.otherCnt})
        var keySum= keyList.sum()
        var otherSum= otherList.sum()

        var option = {
            title:{
                subtext: '非关键错误准确率:'+(100-100*otherSum/(len*keySum)).toFixed(2)+"%",
                x: "left",
                subtextStyle:{
                    color: "black",
                    fontStyle: 'bold',
                    fontWeight: 'normal'
                },
                //padding:[0,0,0,50]
            },
            tooltip : {
                trigger: 'axis',
                formatter:function(params,ticket,callback){
                    var str = params[0].name + '<br/>';
                    params.forEach(function(obj){
                        if(obj.seriesName.indexOf("率")>-1||obj.seriesName.indexOf("标准线")>-1){
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
                data:['监控量','非关键错误量','准确率','标准线']
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
                    data : _.map(data,function(obj){return obj.name})
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
                    name:'监控量',
                    type:'bar',
                    data:keyList,
                    label:{
                        normal:{
                            show:true,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'非关键错误量',
                    type:'bar',
                    data:otherList,
                    label:{
                        normal:{
                            show:true,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'准确率',
                    type:'line',
                    yAxisIndex: 1,
                    data:_.map(data,function(obj){return obj.rate}),
                    label:{
                        normal:{
                            show:true,
                            position:"top",
                            formatter: "{c}%"
                        }
                    },
                },
                {
                    name:'标准线',
                    type:'line',
                    yAxisIndex: 1,
                    data:_.map(data,function(obj){return 90}),
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}%"
                        }
                    },
                },

            ]
        };

        var otherKeyErrChart = echarts.init(document.getElementById("otherKeyErrChart"));
        otherKeyErrChart.setOption(option);
        window.addEventListener('resize',otherKeyErrChart.resize)


        var theadList= _.union(["业务类型"],_.map(data,function(obj){return obj.name}))
        var keyCntObj={"业务类型":"监控量"}
        var keyErrCntObj={"业务类型":"非关键错误量"}
        var keyErrRateObj={"业务类型":"准确率"}
        data.forEach(function(obj){
            keyCntObj[obj.name]=obj.keyCnt
            keyErrCntObj[obj.name]=obj.otherCnt
            keyErrRateObj[obj.name]=(obj.rate).toFixed(2)+"%"
        })
        var dataList=[]
        dataList.push(keyCntObj)
        dataList.push(keyErrCntObj)
        dataList.push(keyErrRateObj)
        var columns=[]
        theadList.forEach(function(ele){
            columns.push({
                field: ele,
                title: ele
            })
        })
        $("#otherKeyErrTable").bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data: dataList,
            columns:columns
        })
    })
}

//关键错误准确率
function drawKeyErrRateChart(){
    var query = {
        "date":$("#dt").val()
    };

    requestURL(dataService+"/crmOnLineTelReport/getKeyErrRate",query).done(function(data){

        var len=data.length
        var keyList=_.map(data,function(obj){return obj.keyCnt})
        var otherList=_.map(data,function(obj){return obj.otherCnt})
        var keySum= keyList.sum()
        var otherSum= otherList.sum()

        var option = {
            title:{
                subtext: '关键错误准确率:'+(100-100*otherSum/(len*keySum)).toFixed(2)+"%",
                x: "left",
                subtextStyle:{
                    color: "black",
                    fontStyle: 'bold',
                    fontWeight: 'normal'
                },
            },
            tooltip : {
                trigger: 'axis',
                formatter:function(params,ticket,callback){
                    var str = params[0].name + '<br/>';
                    params.forEach(function(obj){
                        if(obj.seriesName.indexOf("率")>-1||obj.seriesName.indexOf("标准线")>-1){
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
                data:['监控量','关键错误量','准确率','标准线']
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
                    data : _.map(data,function(obj){return obj.name})
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
                    name:'监控量',
                    type:'bar',
                    data:keyList,
                    label:{
                        normal:{
                            show:true,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'关键错误量',
                    type:'bar',
                    data:otherList,
                    label:{
                        normal:{
                            show:true,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'准确率',
                    type:'line',
                    yAxisIndex: 1,
                    data:_.map(data,function(obj){return obj.rate}),
                    label:{
                        normal:{
                            show:true,
                            position:"top",
                            formatter: "{c}%"
                        }
                    },
                },
                {
                    name:'标准线',
                    type:'line',
                    yAxisIndex: 1,
                    data:_.map(data,function(obj){return 100}),
                    label:{
                        normal:{
                            show:false,
                            position:"top",
                            formatter: "{c}%"
                        }
                    },
                },

            ]
        };

        var keyErrChart = echarts.init(document.getElementById("keyErrChart"));
        keyErrChart.setOption(option);
        window.addEventListener('resize',keyErrChart.resize)


        var theadList= _.union(["业务类型"],_.map(data,function(obj){return obj.name}))
        var keyCntObj={"业务类型":"监控量"}
        var keyErrCntObj={"业务类型":"关键错误量"}
        var keyErrRateObj={"业务类型":"准确率"}
        data.forEach(function(obj){
            keyCntObj[obj.name]=obj.keyCnt
            keyErrCntObj[obj.name]=obj.otherCnt
            keyErrRateObj[obj.name]=(obj.rate).toFixed(2)+"%"
        })
        var dataList=[]
        dataList.push(keyCntObj)
        dataList.push(keyErrCntObj)
        dataList.push(keyErrRateObj)
        var columns=[]
        theadList.forEach(function(ele){
            columns.push({
                field: ele,
                title: ele
            })
        })
        $("#keyErrTable").bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data: dataList,
            columns:columns
        })
    })
}
//监控量与人员占比情况
function drawMonitorInfo(){
    var query = {
        "date":$("#dt").val()
    };
    requestURL(dataService+"/crmOnLineTelReport/getMonitorInfo",query).done(function(ret){


        var sum = _.map(ret,function(obj){return obj.value}).sum()
        var option = {
            title:{
                subtext: '总监控量:'+sum,
                x: "left",
                subtextStyle:{
                    color: "black",
                    fontStyle: 'bold',
                    fontWeight: 'normal'
                },
                //padding:[0,0,0,50]
            },
            tooltip : {
                trigger: 'axis',
                formatter:function(params,ticket,callback){
                    var str = params[0].name + '<br/>';
                    params.forEach(function(obj){
                        if(obj.seriesName.indexOf("占比")>-1){
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
                data:['监控量','监控占比']
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
                    data : _.map(ret,function(obj){return obj.name})
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
                    name:'监控量',
                    type:'bar',
                    data:_.map(ret,function(obj){return obj.value}),
                    label:{
                        normal:{
                            show:true,
                            position:"top",
                            formatter: "{c}"
                        }
                    },
                },
                {
                    name:'监控占比',
                    type:'line',
                    yAxisIndex: 1,
                    data:_.map(ret,function(obj){return (100*obj.value/sum).toFixed(2)}),
                    label:{
                        normal:{
                            show:true,
                            position:"top",
                            formatter: "{c}%",
                            /*textStyle:{
                             color:"black"
                             }*/
                        }
                    },
                },

            ]
        };
        var monitorInfoChart = echarts.init(document.getElementById('monitorInfoChart'));
        monitorInfoChart.setOption(option);
        window.addEventListener('resize',monitorInfoChart.resize)

        var theadList= _.union(["业务类型"],_.map(ret,function(obj){return obj.name}))
        var columns=[]
        var tabledata=[]

        var monitorNumObj={"业务类型":"监控量"}
        var monitorNumRateObj={"业务类型":"监控占比"}
        ret.forEach(function(obj){
            monitorNumObj[obj.name]=obj.value
            monitorNumRateObj[obj.name]=(100*obj.value/sum).toFixed(2)+"%"
        })
        tabledata.push(monitorNumObj)
        tabledata.push(monitorNumRateObj)

        theadList.forEach(function(ele){
            columns.push({
                field: ele,
                title: ele
            })
        })
        $('#monitorInfoTable').bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data: tabledata,
            columns:columns
        })


    })
}