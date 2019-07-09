Template.liangpinOperation.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#liangpin').addClass('active');
    $('#liangpinOperation').addClass('active');

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }
    var updateStats = function () {
        requestURL(dataService + "/lianpin/getLiangpinReceiveInspectionTarget", {}).done(function (data) {
            $('#tradeExpressCount').html(data.puchase_plan_num == "" ? 0 : data.puchase_plan_num);
            $('#tradeReceiptCount').html(data.receive_quantity == "" ? 0 : data.receive_quantity);

            $('#orderInspection').html(data.inspectionCount == "" ? 0 : data.inspectionCount);
            $('#orderPreInspection').html(data.inspectionAwait == "" ? 0 : data.inspectionAwait);
            $('#samplingInspection').html(data.inspectionIn == "" ? 0 : data.inspectionIn);
            $('#samplingPreInspection').html(data.inspectionOut == "" ? 0 : data.inspectionOut);
        });
    };

    updateStats();

    requestURL(dataService + "/lianpin/getLiangpinInspectionInfo", {}).done(function (data) {
        drawinspectorStatsChart(data);

    });


    requestURL(dataService+"/lianpin/getLiangpinDispatchInfo",{}).done(function(data){
        drawDispatchSuccessChart(data.dispatchYes);
        drawWaitingForDispatchChart(data.dispatchNo);
    })
};
function getOptionData(data){
    var optionData = {
        channel:[],
        h12:[],
        h24:[],
        h36:[],
        h48:[],
        others:[],
        counts:0

    };
    data.forEach(function (e) {
        console.log(typeof e.channel )
        switch(e.channel){
            case "1":optionData.channel.push("批发对公订单"); break;
            case "2":optionData.channel.push(" 批发对私订单"); break;
            case "3":optionData.channel.push("趣分期"); break;
            case "4":optionData.channel.push("门店-文汇线下订单"); break;
            case "5":optionData.channel.push("门店-文汇线上订单"); break;
            case "6":optionData.channel.push("百姓网订单"); break;
            case "7":optionData.channel.push("零售-M"); break;
            case "8":optionData.channel.push("零售-PC"); break;
            case "9":optionData.channel.push("企业内购"); break;
            case "10":optionData.channel.push("淘宝闲鱼"); break;
            case "11":optionData.channel.push(" 51订货网"); break;
            case "12":optionData.channel.push("前隆金融"); break;
            case "13":optionData.channel.push("京东"); break;
            case "15":optionData.channel.push(" 双十二"); break;
            case "16":optionData.channel.push(" 京东拍卖"); break;
            case "17":optionData.channel.push("门店订单"); break;
            case "18":optionData.channel.push("售后换货"); break;




        }
        optionData.h12.push(e.h12 == 0 ? undefined : e.h12)
        optionData.h24.push(e.h24 == 0 ? undefined : e.h24)
        optionData.h36.push(e.h36 == 0 ? undefined : e.h36)
        optionData.h48.push(e.h48 == 0 ? undefined : e.h48)
        optionData.others.push(e.others== 0 ? undefined : e.others)
        optionData.counts=optionData.counts+ e.h12+ e.h24+ e.h36+ e.h48+ e.others;
    });
    return optionData;
}

function drawinspectorStatsChart(data) {
    var inspectorStatsArrays = {
        inspectorNames: [],
        preInspection: [],
        inspectionSuccess: [],
        inspectionFail: []
    };

    data.forEach(function (e) {
        inspectorStatsArrays.inspectorNames.push(e.inspectionName);
        inspectorStatsArrays.preInspection.push(e.inspectionAwait == 0 ? undefined : e.inspectionAwait);
        inspectorStatsArrays.inspectionSuccess.push(e.inspectionIn == 0 ? undefined : e.inspectionIn);
        inspectorStatsArrays.inspectionFail.push(e.inspectionOut == 0 ? undefined : e.inspectionOut);
    });

    var option = {
        title: {
            text: '质检人员实时数据',
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
            data: ['验货成功', '验货失败', '待验货']
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
                data: inspectorStatsArrays.inspectorNames
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
                data: inspectorStatsArrays.inspectionSuccess
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
                data: inspectorStatsArrays.inspectionFail
            },
            {
                name: '待验货',
                type: 'bar',
                stack: '总量',
                itemStyle: {
                    normal: {
                        label: {show: true, position: 'right'}
                    }
                },
                data: inspectorStatsArrays.preInspection
            }
        ]
    };

    var trafficStackChart = echarts.init(document.getElementById('inspectorStatsChart'));
    trafficStackChart.setOption(option);
    window.addEventListener('resize', trafficStackChart.resize)







}

function drawDispatchSuccessChart(data){
    var optionData=getOptionData(data)
    $("#dispatchSuccess").html(optionData.counts);
    var option = {
        title: {
            text: '已发货数量:'+optionData.counts,
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
            data: ['0-12小时之间', '12-24小时之间', '24-36小时之间', '36-48小时之间', '48小时后']

        },
        grid: {
            left: 'auto',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'value',
                name:'数量'
            }
        ],
        yAxis: [
            {
                type: 'category',
                axisTick: {show: true},
                data: optionData.channel,
                name:'渠道'
            }
        ],
        series: [
            {
                name: '0-12小时之间',
                type: 'bar',
                stack: '总量',
                itemStyle: {
                    normal: {
                        label: {show: true, position: 'inside'}
                    }
                },
                data: optionData.h12
            },
            {
                name: '12-24小时之间',
                type: 'bar',
                stack: '总量',
                itemStyle: {
                    normal: {
                        label: {show: true}
                    }
                },
                data: optionData.h24
            },
            {
                name: '24-36小时之间',
                type: 'bar',
                stack: '总量',
                itemStyle: {
                    normal: {
                        label: {show: true, position: 'right'}
                    }
                },
                data: optionData.h36
            },
            {
                name: '36-48小时之间',
                type: 'bar',
                stack: '总量',
                itemStyle: {
                    normal: {
                        label: {show: true, position: 'right'}
                    }
                },
                data: optionData.h48
            },
            {
                name: '48小时后',
                type: 'bar',
                stack: '总量',
                itemStyle: {
                    normal: {
                        label: {show: true, position: 'right'}
                    }
                },
                data: optionData.others
            }
        ]
    };
    var dispatchDataChart=echarts.init($("#dispatchSuccessChart").get(0));
    dispatchDataChart.setOption(option);
    window.addEventListener('resize',dispatchDataChart.resize)
}

function drawWaitingForDispatchChart(data){
   var optionData=getOptionData(data);
    $("#waitingForDispatch").html(optionData.counts)
    var option = {
        title: {
            text: '未发货数量:'+optionData.counts,
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
            data: ['0-12小时之间', '12-24小时之间', '24-36小时之间', '36-48小时之间', '48小时后']

        },
        grid: {
            left: 'auto',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'value',
                name:'数量'
            }
        ],
        yAxis: [
            {
                type: 'category',
                axisTick: {show: true},
                data: optionData.channel,
                name:'渠道'
            }
        ],
        series: [
            {
                name: '0-12小时之间',
                type: 'bar',
                stack: '总量',
                itemStyle: {
                    normal: {
                        label: {show: true, position: 'inside'}
                    }
                },
                data: optionData.h12
            },
            {
                name: '12-24小时之间',
                type: 'bar',
                stack: '总量',
                itemStyle: {
                    normal: {
                        label: {show: true}
                    }
                },
                data: optionData.h24
            },
            {
                name: '24-36小时之间',
                type: 'bar',
                stack: '总量',
                itemStyle: {
                    normal: {
                        label: {show: true, position: 'right'}
                    }
                },
                data: optionData.h36
            },
            {
                name: '36-48小时之间',
                type: 'bar',
                stack: '总量',
                itemStyle: {
                    normal: {
                        label: {show: true, position: 'right'}
                    }
                },
                data: optionData.h48
            },
            {
                name: '48小时后',
                type: 'bar',
                stack: '总量',
                itemStyle: {
                    normal: {
                        label: {show: true, position: 'right'}
                    }
                },
                data: optionData.others
            }
        ]
    };
    var dispatchDataChart=echarts.init($("#waitingForDispatchChart").get(0));
    dispatchDataChart.setOption(option);
    window.addEventListener('resize',dispatchDataChart.resize)
}