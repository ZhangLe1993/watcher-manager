Template.UETelReport.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#CustomerServiceTab').addClass('active');
    $('#CustomerTelReportTab').addClass('active');

    if(isMobile()){
        $('.sidebar-toggle').click();
    }

    getOptions().done(function(data){
        renderOptions("#dt",data.uedtList);
        renderOptions("#ueSelect", _.filter(data.groupList,function(ele){return ele.indexOf("运营")==-1}))
        renderOptions("#opSelect",_.filter(data.groupList,function(ele){return ele.indexOf("运营")>-1}))
        renderPage("用户体验中心")
    })

    $('a[data-toggle=tab]').on('shown.bs.tab', function (e) {
        var activeTab = (e.target).text;
        renderPage(activeTab)
    });

    $("button.updateBtn").click(function(param){
        var commentType = param.currentTarget.id.substring(9);
        var data = {
            "reportName": "客服质量分析报告",
            "reportDate": $("#dt").val(),
            "commentText":  $("#textInput" + commentType).val()
        };
        if(parseInt(commentType)>10){
            var tab=$("ul.nav-tabs").find("li.active").text()
            var group=""
            if(tab=="用户体验中心"){
                group=$("#ueSelect").val()
            }else if(tab=="运营中心"){
                group=$("#opSelect").val()
            }
            commentType=group+"_"+commentType
        }
        data.commentType=commentType
        updateComments(data);
    })

    $(".ueopSelect").change(function(){
        var tab=$("ul.nav-tabs").find("li.active").text()
        $(".innergroup .comment").val("")
        groupTabSwitch(tab)
    })

    $("#dt").change(function(){
        var activeTab=$("ul.nav-tabs").find("li.active").text()
        renderPage(activeTab)
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

function renderComments(sel,query){

    requestURL(dataService + "/crm/getCRMReportComments", query).done(function (data) {
        data.forEach(function (e) {
            if(isNaN(e.commentType)&&e.commentType.split("_")[0]==$(sel).find(".ueopSelect").val()){
                $(sel).find($("#textInput" + e.commentType.split("_")[1])).val(e.commentText);
            }else{
                $(sel).find($("#textInput" + e.commentType)).val(e.commentText);
            }
        });
    });
}

function getOptions(){
    var dfd = $.Deferred();
    requestURL(dataService+"/crmTelReport/getCRMTelReportOptions",{}).done(function(data){
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

function groupTabSwitch(tab){
    var sel=""
    var group=""
    if(tab=="用户体验中心"){
        sel="#userExperienceContent"
        group=$("#ueSelect").val()
    }else if(tab=="运营中心"){
        sel="#operationContent"
        group=$("#opSelect").val()
    }

    drawPersonScoreChart(tab,group)
    drawItemErrorRateChart(tab,group)
    drawCompareErrorRate(tab,group)

    renderComments(sel,{
        reportDate: $("#dt").val(),
        reportName: "客服质量分析报告"
    })
}

function renderPage(tab){

    drawMonitorAndBusinessChart(tab)
    drawKeyErrRateChart(tab)
    drawOtherKeyErrRateChart(tab)
    drawAvgScoreChart(tab)
    //切换
    $(".comment").val("");
    groupTabSwitch(tab)

}

function drawCompareErrorRate(tab,group){

    var query = {
        "date":$("#dt").val(),
        "group":group
    };

    requestURL(dataService+"/crmTelReport/getCompareErrorRate",query).done(function(data){
        var selchart,selTable
        if(tab=="用户体验中心"){
            selchart=$("#userExperienceContent  .compareErrorRateChart")
            selTable=$("#userExperienceContent  .compareErrorRateTable")
        }else if(tab=="运营中心"){
            selchart=$("#operationContent  .compareErrorRateChart")
            selTable=$("#operationContent  .compareErrorRateTable")
        }
        var option = {
            title:{
                text: group+"评估项出错率与上期对比",
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

        var keyErrChart = echarts.init(selchart[0]);
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
                difHtml="<span style='color: red'>"+(dif*-1).toFixed(2)+"%</span>"
            }else if(dif>0){
                difHtml="<span style='color: blue'>"+(dif).toFixed(2)+"%</span>"
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
        selTable.bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data: dataList,
            columns:columns
        })
    })
}

function drawPersonScoreChart(tab,group){

    var query = {
        "date":$("#dt").val(),
        "group":group
    };
    requestURL(dataService+"/crmTelReport/getPersonScoreByGroup",query).done(function(data){
        var selchart,selTable
        if(tab=="用户体验中心"){
            selchart=$("#userExperienceContent  .personScoreChart")
            selTable=$("#userExperienceContent  .personScoreTable")
        }else if(tab=="运营中心"){
            selchart=$("#operationContent  .personScoreChart")
            selTable=$("#operationContent  .personScoreTable")
        }
        var option = {
            title:{
                text: group+"人员得分",
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

        var keyErrChart = echarts.init(selchart[0]);
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
        selTable.bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data: dataList,
            columns:columns
        })
    })

}

function drawItemErrorRateChart(tab,group){

    var query = {
        "date":$("#dt").val(),
        "group":group
    };
    requestURL(dataService+"/crmTelReport/getItemErrorRate",query).done(function(data){
        var selchart,selTable
        if(tab=="用户体验中心"){
            selchart=$("#userExperienceContent  .itemErrorRateChart")
            selTable=$("#userExperienceContent  .itemErrorRateTable")
        }else if(tab=="运营中心"){
            selchart=$("#operationContent  .itemErrorRateChart")
            selTable=$("#operationContent  .itemErrorRateTable")
        }
        var option = {
            title:{
                text: group+"评估项出错率",
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
                    name:'出错量',
                    type:'bar',
                    data:_.map(data,function(obj){return obj.otherCnt}),
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

        var keyErrChart = echarts.init(selchart[0]);
        keyErrChart.setOption(option);
        window.addEventListener('resize',keyErrChart.resize)


        var theadList= _.union(["业务类型"],_.map(data,function(obj){return obj.name}))
        var keyCntObj={"业务类型":"出错量"}
        var keyErrCntObj={"业务类型":"出错率"}
        var n=0;
        var pre="";
        data.forEach(function(obj){
            keyCntObj[obj.name]=obj.otherCnt
            var str=""
            if((n<3||obj.rate==pre)&&obj.rate>0){
                str="<span style='font-weight: bold;'>"+(obj.rate).toFixed(2)+"%</span>"
                pre=obj.rate
            }else{
                str=(obj.rate).toFixed(2)+"%"
            }
            n++;
            keyErrCntObj[obj.name]=str

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
        selTable.bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data: dataList,
            columns:columns
        })
    })

}

//小组平均分
function drawAvgScoreChart(tab){
    var query = {
        "date":$("#dt").val()
    };

    requestURL(dataService+"/crmTelReport/getAvgScore",query).done(function(ret){
        var data=[]
        var selchart,selTable
        if(tab=="用户体验中心"){
            data=_.filter(ret,function(obj){return obj.name.indexOf("运营")==-1})
            selchart=$("#userExperienceContent  .avgScoreChart")
            selTable=$("#userExperienceContent  .avgScoreTable")
        }else if(tab=="运营中心"){
            data=_.filter(ret,function(obj){return obj.name.indexOf("运营")>-1})
            selchart=$("#operationContent  .avgScoreChart")
            selTable=$("#operationContent  .avgScoreTable")
        }
        var option = {
            title:{
                text: '小组平均分&排名情况',
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

        var keyErrChart = echarts.init(selchart[0]);
        keyErrChart.setOption(option);
        window.addEventListener('resize',keyErrChart.resize)


        var theadList= _.union(["业务类型"],_.map(data,function(obj){return obj.name}))
        var keyCntObj={"业务类型":"平均分"}
        var keyErrCntObj={"业务类型":"排名"}
        var rank=1;
        data.forEach(function(obj){
            keyCntObj[obj.name]=obj.keyCnt
            keyErrCntObj[obj.name]=rank
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
        selTable.bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data: dataList,
            columns:columns
        })
    })
}

//非关键错误准确率
function drawOtherKeyErrRateChart(tab){
    var query = {
        "date":$("#dt").val()
    };

    requestURL(dataService+"/crmTelReport/getOtherKeyErrRate",query).done(function(ret){
        var data=[]
        var selchart,selTable
        if(tab=="用户体验中心"){
            data=_.filter(ret,function(obj){return obj.name.indexOf("运营")==-1})
            selchart=$("#userExperienceContent  .otherKeyErrChart")
            selTable=$("#userExperienceContent  .otherKeyErrTable")
        }else if(tab=="运营中心"){
            data=_.filter(ret,function(obj){return obj.name.indexOf("运营")>-1})
            selchart=$("#operationContent  .otherKeyErrChart")
            selTable=$("#operationContent  .otherKeyErrTable")
        }

        //var len=data.length
        var keyList=_.map(data,function(obj){return obj.keyCnt})
        var otherList=_.map(data,function(obj){return obj.otherCnt})
        var keySum= _.map(data,function(obj){return obj.keyCnt*obj.itemCnt}).sum()
        var otherSum= otherList.sum()

        var option = {
            title:{
                subtext: '非关键错误准确率:'+(100-100*otherSum/keySum).toFixed(2)+"%",
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

        var otherKeyErrChart = echarts.init(selchart[0]);
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
        selTable.bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data: dataList,
            columns:columns
        })
    })
}

//关键错误准确率
function drawKeyErrRateChart(tab){
    var query = {
        "date":$("#dt").val()
    };

    requestURL(dataService+"/crmTelReport/getKeyErrRate",query).done(function(ret){
        var data=[]
        var selchart,selTable
        if(tab=="用户体验中心"){
            data=_.filter(ret,function(obj){return obj.name.indexOf("运营")==-1})
            selchart=$("#userExperienceContent  .keyErrChart")
            selTable=$("#userExperienceContent  .keyErrTable")
        }else if(tab=="运营中心"){
            data=_.filter(ret,function(obj){return obj.name.indexOf("运营")>-1})
            selchart=$("#operationContent  .keyErrChart")
            selTable=$("#operationContent  .keyErrTable")
        }

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

        var keyErrChart = echarts.init(selchart[0]);
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
        selTable.bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data: dataList,
            columns:columns
        })
    })
}
//监控量与业务类型占比情况
function drawMonitorAndBusinessChart(tab){
    var query = {
        "date":$("#dt").val()
    };
    requestURL(dataService+"/crmTelReport/getMonitorAndBusinessRatio",query).done(function(ret){

        //用户体验中心
        if(tab=="用户体验中心"){
            var uedata=_.filter(ret,function(obj){return obj.name.indexOf("运营")==-1})
            var uemonitorMembers = _.filter(uedata,function(obj){return obj.item=="监控成员数"})
            var uemonitorNum = _.filter(uedata,function(obj){return obj.item=="监控量"})
            var uesum = _.map(uemonitorNum,function(obj){return obj.cnt}).sum()
            var option = {
                title:{
                    subtext: '总监控量:'+uesum,
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
                    data:['监控成员数','监控量','监控占比']
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
                        data : _.map(uemonitorMembers,function(obj){return obj.name})
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
                        data:_.map(uemonitorNum,function(obj){return obj.cnt}),
                        label:{
                            normal:{
                                show:true,
                                position:"top",
                                formatter: "{c}"
                            }
                        },
                    },
                    {
                        name:'监控成员数',
                        type:'bar',
                        data:_.map(uemonitorMembers,function(obj){return obj.cnt}),
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
                        data:_.map(uemonitorNum,function(obj){return (100*obj.cnt/uesum).toFixed(2)}),
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
            var uemonitorAndBusinessChart = echarts.init(document.getElementById('uemonitorAndBusinessChart'));
            uemonitorAndBusinessChart.setOption(option);
            window.addEventListener('resize',uemonitorAndBusinessChart.resize)

            var uetheadList= _.union(["业务类型"],_.map(uemonitorNum,function(obj){return obj.name}))
            var uecolumns=[]
            var uetabledata=[]
            var uemonitorMembersObj={"业务类型":"监控成员数"}
            uemonitorMembers.forEach(function(obj){
                uemonitorMembersObj[obj.name]=obj.cnt
            })
            uetabledata.push(uemonitorMembersObj)

            var uemonitorNumObj={"业务类型":"监控量"}
            var uemonitorNumRateObj={"业务类型":"监控占比"}
            uemonitorNum.forEach(function(obj){
                uemonitorNumObj[obj.name]=obj.cnt
                uemonitorNumRateObj[obj.name]=(100*obj.cnt/uesum).toFixed(2)+"%"
            })
            uetabledata.push(uemonitorNumObj)
            uetabledata.push(uemonitorNumRateObj)

            uetheadList.forEach(function(ele){
                uecolumns.push({
                    field: ele,
                    title: ele
                })
            })
            $('#uemonitorAndBusinessTable').bootstrapTable('destroy').bootstrapTable({
                exportDataType: 'all',
                data: uetabledata,
                columns:uecolumns
            })

        }else if(tab=="运营中心"){
            //运营中心
            var opdata=_.filter(ret,function(obj){return obj.name.indexOf("运营")>-1})
            var opmonitorMembers = _.filter(opdata,function(obj){return obj.item=="监控成员数"})
            var opmonitorNum = _.filter(opdata,function(obj){return obj.item=="监控量"})
            var opsum = _.map(opmonitorNum,function(obj){return obj.cnt}).sum()
            var option = {
                title:{
                    subtext: '总监控量:'+opsum,
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
                    data:['监控成员数','监控量','监控占比']
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
                        data : _.map(opmonitorMembers,function(obj){return obj.name})
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
                        data:_.map(opmonitorNum,function(obj){return obj.cnt}),
                        label:{
                            normal:{
                                show:true,
                                position:"top",
                                formatter: "{c}"
                            }
                        },
                    },
                    {
                        name:'监控成员数',
                        type:'bar',
                        data:_.map(opmonitorMembers,function(obj){return obj.cnt}),
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
                        data:_.map(opmonitorNum,function(obj){return (100*obj.cnt/opsum).toFixed(2)}),
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
            var operationmonitorAndBusinessChart = echarts.init(document.getElementById('operationmonitorAndBusinessChart'));
            operationmonitorAndBusinessChart.setOption(option);
            window.addEventListener('resize',operationmonitorAndBusinessChart.resize)

            var optheadList= _.union(["业务类型"],_.map(opmonitorNum,function(obj){return obj.name}))
            var opcolumns=[]
            var optabledata=[]
            var opmonitorMembersObj={"业务类型":"监控成员数"}
            opmonitorMembers.forEach(function(obj){
                opmonitorMembersObj[obj.name]=obj.cnt
            })
            optabledata.push(opmonitorMembersObj)

            var opmonitorNumObj={"业务类型":"监控量"}
            var opmonitorNumRateObj={"业务类型":"监控占比"}
            opmonitorNum.forEach(function(obj){
                opmonitorNumObj[obj.name]=obj.cnt
                opmonitorNumRateObj[obj.name]=(100*obj.cnt/opsum).toFixed(2)+"%"
            })
            optabledata.push(opmonitorNumObj)
            optabledata.push(opmonitorNumRateObj)

            optheadList.forEach(function(ele){
                opcolumns.push({
                    field: ele,
                    title: ele
                })
            })
            $('#operationmonitorAndBusinessTable').bootstrapTable('destroy').bootstrapTable({
                exportDataType: 'all',
                data: optabledata,
                columns:opcolumns
            })

        }
    })
}