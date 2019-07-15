Template.inspector.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#inspector').addClass('active');
    $('#operation').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }
    inspectorStatsChart = echarts.init(document.getElementById('inspectorStatsChart'));
    inspectionGroupChart = echarts.init(document.getElementById('inspectionGroupChart'));
    drawInspectorChart();
    drawInspectionGroupChart();
    // Deps.autorun(function () {
    //     if (location.pathname.indexOf('inspector') > 0) {
    //         drawInspectorChart();
    //         drawInspectionGroupChart();
    //     }
    // })
};

function drawInspectionGroupChart() {

    var inspectorStatsSet = inspectorStats.find({inspectorId: {$gt: 0}}).fetch();

    var inspectionGroupStatsSet = {
        groupNames: ["质检一组", "质检二组", "质检三组", "质检四组"],
        preInspection: [0, 0, 0, 0],
        inspectionSuccess: [0, 0, 0, 0],
        inspectionFail: [0, 0, 0, 0],
        passRate: [0, 0, 0, 0]
    };

    inspectorStatsSet.forEach(function (e) {
        switch (e.group) {
            case "质检一组":
                inspectionGroupStatsSet.preInspection[0] += e.preInspection == undefined ? 0 : e.preInspection;
                inspectionGroupStatsSet.inspectionSuccess[0] += e.inspectionSuccess == undefined ? 0 : e.inspectionSuccess;
                inspectionGroupStatsSet.inspectionFail[0] += e.inspectionFail == undefined ? 0 : e.inspectionFail;
                break;
            case "质检二组":
                inspectionGroupStatsSet.preInspection[1] += e.preInspection == undefined ? 0 : e.preInspection;
                inspectionGroupStatsSet.inspectionSuccess[1] += e.inspectionSuccess == undefined ? 0 : e.inspectionSuccess;
                inspectionGroupStatsSet.inspectionFail[1] += e.inspectionFail == undefined ? 0 : e.inspectionFail;
                break;
            case "质检三组":
                inspectionGroupStatsSet.preInspection[2] += e.preInspection == undefined ? 0 : e.preInspection;
                inspectionGroupStatsSet.inspectionSuccess[2] += e.inspectionSuccess == undefined ? 0 : e.inspectionSuccess;
                inspectionGroupStatsSet.inspectionFail[2] += e.inspectionFail == undefined ? 0 : e.inspectionFail;
                break;
            case "质检四组":
                inspectionGroupStatsSet.preInspection[3] += e.preInspection == undefined ? 0 : e.preInspection;
                inspectionGroupStatsSet.inspectionSuccess[3] += e.inspectionSuccess == undefined ? 0 : e.inspectionSuccess;
                inspectionGroupStatsSet.inspectionFail[3] += e.inspectionFail == undefined ? 0 : e.inspectionFail;
                break;
            default:
                break;
        }
    });
    inspectionGroupStatsSet.passRate[0] = (inspectionGroupStatsSet.inspectionSuccess[0] / (inspectionGroupStatsSet.inspectionFail[0] + inspectionGroupStatsSet.inspectionSuccess[0]) * 100).toFixed(2);
    inspectionGroupStatsSet.passRate[1] = (inspectionGroupStatsSet.inspectionSuccess[1] / (inspectionGroupStatsSet.inspectionFail[1] + inspectionGroupStatsSet.inspectionSuccess[1]) * 100).toFixed(2);
    inspectionGroupStatsSet.passRate[2] = (inspectionGroupStatsSet.inspectionSuccess[2] / (inspectionGroupStatsSet.inspectionFail[2] + inspectionGroupStatsSet.inspectionSuccess[2]) * 100).toFixed(2);
    inspectionGroupStatsSet.passRate[3] = (inspectionGroupStatsSet.inspectionSuccess[3] / (inspectionGroupStatsSet.inspectionFail[3] + inspectionGroupStatsSet.inspectionSuccess[3]) * 100).toFixed(2);

    var option = {
        title: {
            text: '质检分组实时数据',
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
            data: ['验货成功', '验货失败', '待验货', '验货通过率']
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        yAxis: [
            {
                type: 'value'
            }, {
                type: 'value',
                min: 0,
                max: 100,
                axisLabel: {
                    formatter: '{value}%'
                }
            }
        ],
        xAxis: [
            {
                type: 'category',
                axisTick: {show: true},
                data: inspectionGroupStatsSet.groupNames
            }
        ],
        series: [
            {
                name: '验货成功',
                type: 'bar',
                yAxisIndex: 0,
                itemStyle: {
                    normal: {
                        label: {show: true, position: 'top'}
                    }
                },
                data: inspectionGroupStatsSet.inspectionSuccess
            },
            {
                name: '验货失败',
                type: 'bar',
                yAxisIndex: 0,
                itemStyle: {
                    normal: {
                        label: {show: true, position: 'top'}
                    }
                },
                data: inspectionGroupStatsSet.inspectionFail
            },
            {
                name: '待验货',
                type: 'bar',
                yAxisIndex: 0,
                itemStyle: {
                    normal: {
                        label: {show: true, position: 'top'}
                    }
                },
                data: inspectionGroupStatsSet.preInspection
            },
            {
                name: '验货通过率',
                type: 'bar',
                yAxisIndex: 1,
                itemStyle: {
                    normal: {
                        label: {
                            show: true, position: 'top',
                            formatter: "{c}%"
                        }
                    }
                },
                data: inspectionGroupStatsSet.passRate
            }
        ]
    };

    inspectionGroupChart.setOption(option)
    window.addEventListener('resize', inspectionGroupChart.resize)

}

function drawInspectorChart() {

    var inspectorStatsSet = inspectorStats.find({}, {sort: {inspectionSuccess: 1}}).fetch();
    var preReceiveStats = operationStats.findOne({type: 'inspectionPreReceive'});
    var preReceiveCount = 0;
    if (preReceiveStats != undefined) {
        preReceiveCount = preReceiveStats.count;
    }

    var inspectorStatsArrays = {
        inspectorNames: [],
        preInspection: [],
        inspectionSuccess: [],
        inspectionFail: []
    };

    inspectorStatsSet.forEach(function (e) {
        var passRate = (e.inspectionSuccess / (e.inspectionFail + e.inspectionSuccess) * 100).toFixed(2);
        if (e.inspectionSuccess == undefined) {
            passRate = 0
        } else if (e.inspectionFail == undefined) {
            passRate = 100
        }
        inspectorStatsArrays.inspectorNames.push(e.inspectorName + "(" + passRate + "%)");
        inspectorStatsArrays.preInspection.push(0 - e.preInspection);
        inspectorStatsArrays.inspectionSuccess.push(e.inspectionSuccess);
        inspectorStatsArrays.inspectionFail.push(e.inspectionFail);
    });

    var option = {
        title: {
            text: '质检人员实时数据',
            subtext: "外部门移交验货部未接收：" + preReceiveCount,
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
                data: inspectorStatsArrays.inspectorNames,
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
                        label: {show: true, position: 'left'}
                    }
                },
                data: inspectorStatsArrays.preInspection
            }
        ]
    };

    inspectorStatsChart.setOption(option)
    window.addEventListener('resize', inspectorStatsChart.resize)

}