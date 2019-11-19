Template.InspectionStats.rendered = function () {
    /*$('.navi-tab').removeClass('active');
    $('#operation').addClass('active');*/

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        /*$('.sidebar-toggle').click();*/
    }
    updateStats();
};

//初检
var drawInspectorChart = function (data, operationCenterName) {
    var option = {
        title: {
            text: operationCenterName + '初检人员实时数据',
            subtextStyle: {
                color: '#333',
                fontStyle: 'normal',
                fontWeight: 'bold'
            }
        },
        dataZoom: [
            {
                type: 'slider',
                startValue: data.inspectorNames.length-15,
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
            data: [ '验货失败', '验货成功','待验货']
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
        series: [
            {
                name: '验货成功',
                type: 'bar',
                stack: '总量',
                itemStyle: {
                    normal: {
                        label: {show: true, position: 'inside'}
                    }
                },
                data: data.inspectionSuccess
            },
            {
                name: '验货失败',
                type: 'bar',
                stack: '总量',
                itemStyle: {
                    normal: {
                        label: {show: true}
                    }
                },
                data: data.inspectionFail
            },
            {
                name: '待验货',
                type: 'bar',
                stack: '总量',
                itemStyle: {
                    normal: {
                        label: {show: true, position: 'left'}
                    }
                },
                data: data.preInspection
            }
        ]
    };
    var inspectorStatsChart = echarts.init(document.getElementById('inspectorStatsChart'));
    inspectorStatsChart.setOption(option);
    window.addEventListener('resize', inspectorStatsChart.resize)

};
//个人分布质检实时数据
var drawInspectorByCategoryChart = function (data, operationCenterName, operationCenter) {
    var option = {
        title: {
            text: operationCenterName + '分步质检实时数据',
            subtextStyle: {
                color: '#333',
                fontStyle: 'normal',
                fontWeight: 'bold'
            }
        },
        dataZoom: [
            {
                type: 'slider',
                startValue: data.inspectorNames.length-15,
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
        /*legend: {
            data: ['']
        },*/
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
        series: [
            {
                name: '数量',
                type: 'bar',
                stack: '总量',
                itemStyle: {
                    normal: {
                        color:'#0AAF9F',
                        label: {show: true, position: 'inside'}
                    }
                },
                data: data.dayNum
            }
        ]
    };
    var inspectorStatsChart = echarts.init(document.getElementById('inspectorByCategoryStatsChart'));
    inspectorStatsChart.setOption(option);
    inspectorStatsChart.on('click', function (handler,context) {
        requestURL(dataService+"/operationCenter/exportCategoryInspectionStats",{"date": moment().format("YYYY-MM-DD"),"operationCenter": operationCenter}).done(function(result) {
            var url = Meteor.settings.public.downloadService.baseUrl + result.path;
            //console.log("url:" + url);
            var link = document.createElement("a");
            link.href = url;
            link.style = "visibility:hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    });
    window.addEventListener('resize', inspectorStatsChart.resize)

};
//抽检
var randomInspectorChart = function (data, operationCenterName) {

    var option = {
        title: {
            text: operationCenterName + '抽检人员实时数据',
            subtextStyle: {
                color: '#333',
                fontStyle: 'normal',
                fontWeight: 'bold'
            }
        },
        dataZoom: [
            {
                show: true,
                yAxisIndex: 0,
                start: 75,
                end: 100
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
            data: [ '验货失败', '验货成功','待验货']
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
        series: [
            {
                name: '验货成功',
                type: 'bar',
                stack: '总量',
                itemStyle: {
                    normal: {
                        label: {show: true, position: 'inside'}
                    }
                },
                data: data.inspectionSuccess
            },
            {
                name: '验货失败',
                type: 'bar',
                stack: '总量',
                itemStyle: {
                    normal: {
                        label: {show: true}
                    }
                },
                data: data.inspectionFail
            },
            {
                name: '待验货',
                type: 'bar',
                stack: '总量',
                itemStyle: {
                    normal: {
                        label: {show: true, position: 'left'}
                    }
                },
                data: data.preInspection
            }
        ]
    };

    var randomInspectorStatsChart = echarts.init(document.getElementById('randomInspectorStatsChart'));
    randomInspectorStatsChart.setOption(option);
    window.addEventListener('resize', randomInspectorStatsChart.resize)

};

//复检
var reInspectorChart = function (data, operationCenterName) {

    var option = {
        title: {
            text: operationCenterName + '复检人员实时数据',
            subtextStyle: {
                color: '#333',
                fontStyle: 'normal',
                fontWeight: 'bold'
            }
        },
        animation: false,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: [ '验货失败', '验货成功','待验货']
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
        series: [
            {
                name: '验货成功',
                type: 'bar',
                stack: '总量',
                itemStyle: {
                    normal: {
                        label: {show: true, position: 'inside'}
                    }
                },
                data: data.inspectionSuccess
            },
            {
                name: '验货失败',
                type: 'bar',
                stack: '总量',
                itemStyle: {
                    normal: {
                        label: {show: true}
                    }
                },
                data: data.inspectionFail
            },
            {
                name: '待验货',
                type: 'bar',
                stack: '总量',
                itemStyle: {
                    normal: {
                        label: {show: true, position: 'left'}
                    }
                },
                data: data.preInspection
            }
        ]
    };
    var reInspectorStatsChart = echarts.init(document.getElementById('reInspectorStatsChart'));
    reInspectorStatsChart.setOption(option);
    window.addEventListener('resize', reInspectorStatsChart.resize)

};
//退货
var returnStatsChart = function (data, operationCenterName) {

    var option = {
        title: {
            text: operationCenterName + '退货人员实时数据',
            subtextStyle: {
                color: '#333',
                fontStyle: 'normal',
                fontWeight: 'bold'
            }
        },
        animation: false,
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: [ '验货失败', '验货成功','待验货']
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
        series: [
            {
                name: '验货成功',
                type: 'bar',
                stack: '总量',
                itemStyle: {
                    normal: {
                        label: {show: true, position: 'inside'}
                    }
                },
                data: data.inspectionSuccess
            },
            {
                name: '验货失败',
                type: 'bar',
                stack: '总量',
                itemStyle: {
                    normal: {
                        label: {show: true}
                    }
                },
                data: data.inspectionFail
            },
            {
                name: '待验货',
                type: 'bar',
                stack: '总量',
                itemStyle: {
                    normal: {
                        label: {show: true, position: 'left'}
                    }
                },
                data: data.preInspection
            }
        ]
    };
    var returnStatsChart = echarts.init(document.getElementById('returnStatsChart'));
    returnStatsChart.setOption(option);
    window.addEventListener('resize', returnStatsChart.resize)

};

//捡货
var pickingChart = function (data, operationCenterName) {
    var option = {
        title: {
            text: operationCenterName + '捡货人员实时数据',
            subtext: '效率按除以小时计算',
            subtextStyle: {
                color: '#333',
                fontStyle: 'normal',
                fontWeight: 'bold'
            }
        },
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
            data: [ '待拣货', '拣货中','已拣货']
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
        series: [
            {
                name: '待拣货',
                type: 'bar',
                stack: '总量',
                itemStyle: {
                    normal: {
                        label: {show: true, position: 'left'}
                    }
                },
                data: data.inspectionSuccess
            },
            {
                name: '拣货中',
                type: 'bar',
                stack: '总量',
                itemStyle: {
                    normal: {
                        label: {show: true, position: 'inside'}
                    }
                },
                data: data.inspectionFail
            },
            {
                name: '已拣货',
                type: 'bar',
                stack: '总量',
                itemStyle: {
                    normal: {
                        label: {show: true, position: 'right'}
                    }
                },
                data: data.preInspection
            }
        ]
    };
    var pickingStatsChart = echarts.init(document.getElementById('pickingStatsChart'));
    pickingStatsChart.setOption(option);
    window.addEventListener('resize', pickingStatsChart.resize)

};

var updateStats = function () {

    var operationCenter = Template.OperationCenter;
    var operationCenterName = "";


    if(operationCenter == 1 || operationCenter == "1"){
        $("#inspectionGroupChart").show()
    }else(
        $("#inspectionGroupChart").hide()
    );

    var query = {
        "date": moment().format("YYYY-MM-DD"),
        "operationCenter": operationCenter
    };
    if(operationCenter === undefined) {
        warning('非常抱歉，您的浏览器可能与当前版本不兼容，请升级浏览器或者更换谷歌浏览器再进行尝试，衷心感谢您的谅解与理解。');
        return;
    }
    //初检
    requestURL(dataService + "/operationCenter/getFirstInspectionStats", query).done(function (data) {

        var inspectorStatsArrays = {
            inspectorNames: [],
            preInspection: [],
            inspectionSuccess: [],
            inspectionFail: []
        };
        data.sort(function(a,b){
            return (parseInt(a.inspect_success)+ parseInt(a.inspect_fail)+ parseInt(a.wait_inspect))-(parseInt(b.inspect_success)+ parseInt(b.inspect_fail)+ parseInt(b.wait_inspect))
        }).forEach(function (e) {

            inspectorStatsArrays.inspectorNames.push(e.name + "(" + parseInt(100*e.one_pass_rate) + "%)");
            inspectorStatsArrays.preInspection.push(-e.wait_inspect);
            inspectorStatsArrays.inspectionSuccess.push(e.inspect_success);
            inspectorStatsArrays.inspectionFail.push(e.inspect_fail);

        });
        drawInspectorChart(inspectorStatsArrays, operationCenterName);
    });
    //个人分布
    requestURL(dataService + "/operationCenter/getCategoryInspectionStats", query).done(function (data) {

        var inspectorStatsArrays = {
            inspectorNames: [],
            dayNum: []
        };
        //console.log(data);
        data.sort(function(a,b){
            return (parseInt(a.day_num))-(parseInt(b.day_num));
        }).forEach(function (e) {
            inspectorStatsArrays.inspectorNames.push(e.name);
            inspectorStatsArrays.dayNum.push(e.day_num);
        });
        drawInspectorByCategoryChart(inspectorStatsArrays, operationCenterName, operationCenter);
    });
    //抽检
    requestURL(dataService + "/operationCenter/getRandomInspectionStats", query).done(function (data) {

        var inspectorStatsArrays = {
            inspectorNames: [],
            preInspection: [],
            inspectionSuccess: [],
            inspectionFail: []
        };
        data.sort(function(a,b){
            return (parseInt(a.inspect_success)+ parseInt(a.inspect_fail)+ parseInt(a.wait_inspect))-(parseInt(b.inspect_success)+ parseInt(b.inspect_fail)+ parseInt(b.wait_inspect))
        }).forEach(function (e) {

            inspectorStatsArrays.inspectorNames.push(e.name );
            inspectorStatsArrays.preInspection.push(-e.wait_inspect);
            inspectorStatsArrays.inspectionSuccess.push(e.inspect_success);
            inspectorStatsArrays.inspectionFail.push(e.inspect_fail);

        });
        randomInspectorChart(inspectorStatsArrays, operationCenterName);
    });
    //复检
    requestURL(dataService + "/operationCenter/getReInspectionStats", query).done(function (data) {

        var inspectorStatsArrays = {
            inspectorNames: [],
            preInspection: [],
            inspectionSuccess: [],
            inspectionFail: []
        };
        data.sort(function(a,b){
            return (parseInt(a.inspect_success)+ parseInt(a.inspect_fail)+ parseInt(a.wait_inspect))-(parseInt(b.inspect_success)+ parseInt(b.inspect_fail)+ parseInt(b.wait_inspect))
        }).forEach(function (e) {

            inspectorStatsArrays.inspectorNames.push(e.name );
            inspectorStatsArrays.preInspection.push(-e.wait_inspect);
            inspectorStatsArrays.inspectionSuccess.push(e.inspect_success);
            inspectorStatsArrays.inspectionFail.push(e.inspect_fail);

        });
        reInspectorChart(inspectorStatsArrays, operationCenterName);
    });
    //退货
    requestURL(dataService + "/operationCenter/getReturnStats", query).done(function (data) {

        var inspectorStatsArrays = {
            inspectorNames: [],
            preInspection: [],
            inspectionSuccess: [],
            inspectionFail: []
        };
        data.sort(function(a,b){
            return (parseInt(a.inspect_success)+ parseInt(a.inspect_fail)+ parseInt(a.wait_inspect))-(parseInt(b.inspect_success)+ parseInt(b.inspect_fail)+ parseInt(b.wait_inspect))
        }).forEach(function (e) {

            inspectorStatsArrays.inspectorNames.push(e.name );
            inspectorStatsArrays.preInspection.push(-e.wait_inspect);
            inspectorStatsArrays.inspectionSuccess.push(e.inspect_success);
            inspectorStatsArrays.inspectionFail.push(e.inspect_fail);

        });
        returnStatsChart(inspectorStatsArrays, operationCenterName);
    });
    //捡货
    requestURL(dataService + "/operationCenter/getPickingStaff", query).done(function (data) {

        var inspectorStatsArrays = {
            inspectorNames: [],
            preInspection: [],
            inspectionSuccess: [],
            inspectionFail: []
        };
        //console.log(data);
        data.sort(function(a,b){
            return (parseInt(a.picking_quantity)+ parseInt(a.pickup_quantity)+ parseInt(a.unassign_quantity))-(parseInt(b.picking_quantity)+ parseInt(b.pickup_quantity)+ parseInt(b.unassign_quantity))
        }).forEach(function (e) {

            inspectorStatsArrays.inspectorNames.push(e.name + "(" + e.efficient + ")    　");
            inspectorStatsArrays.preInspection.push(e.pickup_quantity);
            inspectorStatsArrays.inspectionSuccess.push(e.picking_quantity);
            inspectorStatsArrays.inspectionFail.push(-e.unassign_quantity);

        });
        pickingChart(inspectorStatsArrays, operationCenterName);
    });
};