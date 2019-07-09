Template.OndoorQAReport.rendered = function () {

    $('.navi-tab').removeClass('active');
    $('#district').addClass('active');
    $('#OndoorQAReport').addClass('active');

    if(isMobile()){
        $('.sidebar-toggle').click();
    }

    var periodSelect = $('#periodSelect');
    var tarMonitorPeriodSelect = $('#tarMonitorPeriodSelect');
    var citySelect = $('#citySelect');
    var errorNameSelect = $('#errorNameSelect');
    var commentUpdate = $('.search1');
    var standardScore = 97;

    var cityMonitorBarChart = echarts.init(document.getElementById('cityMonitorBarChart'));
    var cityMonitorPieChart = echarts.init(document.getElementById('cityMonitorPieChart'));

    var keyErrorChart = echarts.init(document.getElementById('keyErrorChart'));
    var nonKeyErrorChart = echarts.init(document.getElementById('nonKeyErrorChart'));

    var areaQAScoreChart = echarts.init(document.getElementById('areaQAScoreChart'));
    var cityQAScoreChart = echarts.init(document.getElementById('cityQAScoreChart'));
    var employeeQAScoreChart = echarts.init(document.getElementById('employeeQAScoreChart'));

    var nonKeyErrorDetailChart = echarts.init(document.getElementById('nonKeyErrorDetailChart'));
    var nonKeyErrorDetailPieChart = echarts.init(document.getElementById('nonKeyErrorDetailPieChart'));
    var nonKeyErrorCompareChart = echarts.init(document.getElementById('nonKeyErrorCompareChart'));

    var singleNonKeyErrorChart = echarts.init(document.getElementById('singleNonKeyErrorChart'));

    var renderPeriodOptions = function (data) {
        periodSelect.empty();
        tarMonitorPeriodSelect.empty();
        var isFirst = true;
        data.forEach(function (e) {
            periodSelect.append("<option value='" + e + "'>" + e + "</option>");
            if (isFirst) {
                isFirst = false;
            } else {
                tarMonitorPeriodSelect.append("<option value='" + e + "'>" + e + "</option>")
            }
        });

        updateAllCharts();
        updateEmployeeQAScoreChart();
    };

    var renderCityOptions = function (data) {
        citySelect.empty();
        data.forEach(function (e) {
            citySelect.append("<option value='" + e + "'>" + e + "</option>")
        });
        updateEmployeeQAScoreChart();
    };

    var renderErrorNameOptions = function (data) {
        errorNameSelect.empty();
        data.forEach(function (e) {
            errorNameSelect.append("<option value='" + e + "'>" + e + "</option>")
        });
        updateSingleNonKeyErrorChart();
    };
    //------------------------------------------------------------------------
    var drawCityMonitorBarChart = function (data) {

        var stats = {
            city: [],
            monitorCount: [],
            employeeCount: [],
            rate: []
        };

        var totalCount = 0;

        data.forEach(function (e) {
            stats.city.push(e.city);
            stats.monitorCount.push(e.monitorCount);
            stats.employeeCount.push(e.employeeCount);
            totalCount += e.monitorCount
        });

        stats.monitorCount.forEach(function (e) {
            stats.rate.push(((e / totalCount) * 100).toFixed(2));
        });

        renderCityMonitorTable(data, totalCount);
        renderCityOptions(stats.city);

        var option = {
            title: {
                left: 'left',
                top: 'top',
                fontWeight: "bolder",
                subtext: '总监控量:' + totalCount,
                subtextStyle: {
                    color: "black",
                    fontStyle: 'bold',
                    fontWeight: 'normal'
                }
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                left: 'center',
                data: ['监控数量', '人员数量', '占比']
            },
            xAxis: [
                {
                    type: 'category',
                    data: stats.city
                }
            ],
            yAxis: [
                {
                    type: 'value'
                },
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}%'
                    },
                    min: -10
                }
            ],
            animationDuration: 2000,
            series: [
                {
                    name: '监控数量',
                    type: 'bar',
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    data: stats.monitorCount
                },
                {
                    name: '人员数量',
                    type: 'bar',
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    data: stats.employeeCount
                },
                {
                    name: '占比',
                    type: 'line',
                    yAxisIndex: 1,
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                            formatter: '{c}%'
                        }
                    },
                    data: stats.rate
                }
            ]
        };

        cityMonitorBarChart.setOption(option)
    };

    var renderCityMonitorTable = function (data, totalMonitorCount) {
        data.forEach(function (e) {
            e.rate = (e.monitorCount * 100 / totalMonitorCount).toFixed(2) + "%"
        });
        var table = $('#cityMonitorTable');

        table.bootstrapTable('destroy').bootstrapTable({
            data: data,
            pagination: true,
            pageSize: 10,
            search: true,
            singleSelect: true
        });
    };

    var drawKeyErrorChart = function (data) {

        var stats = {
            city: [],
            monitorCount: [],
            keyErrorCount: [],
            precision: []
        };

        var totalCount = 0;
        var totalKeyError = 0;

        data.forEach(function (e) {
            stats.city.push(e.city);
            stats.monitorCount.push(e.monitorCount);
            stats.keyErrorCount.push(e.keyErrorCount);
            stats.precision.push(((e.monitorCount - e.keyErrorCount) * 100 / e.monitorCount).toFixed(2));
            totalCount += e.monitorCount;
            totalKeyError += e.keyErrorCount;
        });

        var option = {
            title: {
                left: 'left',
                top: 'top',
                fontWeight: "bolder",
                subtext: '整体关键错误准确率: ' + ((totalCount - totalKeyError) * 100 / totalCount).toFixed(2) + "%",
                subtextStyle: {
                    color: "black",
                    fontStyle: 'bold',
                    fontWeight: 'normal'
                }
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                left: 'center',
                data: ['监控数量', '关键错误量', '准确率']
            },
            xAxis: [
                {
                    type: 'category',
                    data: stats.city
                }
            ],
            yAxis: [
                {
                    type: 'value'
                },
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}%'
                    }
                }
            ],
            animationDuration: 2000,
            series: [
                {
                    name: '监控数量',
                    type: 'bar',
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    data: stats.monitorCount
                },
                {
                    name: '关键错误量',
                    type: 'bar',
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    data: stats.keyErrorCount
                },
                {
                    name: '准确率',
                    type: 'line',
                    yAxisIndex: 1,
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                            formatter: '{c}%'
                        }
                    },
                    data: stats.precision
                }
            ]
        };

        keyErrorChart.setOption(option)
    };

    var renderKeyErrorTable = function (data) {
        data.forEach(function (e) {
            e.rate = ((e.monitorCount - e.keyErrorCount) * 100 / e.monitorCount).toFixed(2) + "%"
        });
        var table = $('#keyErrorTable');

        table.bootstrapTable('destroy').bootstrapTable({
            data: data,
            pagination: true,
            pageSize: 10,
            search: true,
            singleSelect: true
        });
    };

    var drawNonKeyErrorChart = function (data) {

        var stats = {
            city: [],
            monitorCount: [],
            nonKeyErrorCount: [],
            precision: []
        };

        var totalCount = 0;
        var totalKeyError = 0;

        data.forEach(function (e) {
            stats.city.push(e.city);
            stats.monitorCount.push(e.monitorCount);
            stats.nonKeyErrorCount.push(e.nonKeyErrorCount);
            stats.precision.push((e.nonKeyErrorRate * 100).toFixed(2));
            totalCount += e.monitorCount;
            totalKeyError += e.nonKeyErrorCount;
        });

        var option = {
            title: {
                left: 'left',
                top: 'top',
                fontWeight: "bolder",
                subtext: '整体非关键错误准确率: ' + ((totalCount * 20 - totalKeyError) * 100 / (totalCount * 20)).toFixed(2) + "%",
                subtextStyle: {
                    color: "black",
                    fontStyle: 'bold',
                    fontWeight: 'normal'
                }
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                left: 'center',
                data: ['监控数量', '非关键错误量', '准确率']
            },
            xAxis: [
                {
                    type: 'category',
                    data: stats.city
                }
            ],
            yAxis: [
                {
                    type: 'value'
                },
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}%'
                    }
                }
            ],
            animationDuration: 2000,
            series: [
                {
                    name: '监控数量',
                    type: 'bar',
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    data: stats.monitorCount
                },
                {
                    name: '非关键错误量',
                    type: 'bar',
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    data: stats.nonKeyErrorCount
                },
                {
                    name: '准确率',
                    type: 'line',
                    yAxisIndex: 1,
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                            formatter: '{c}%'
                        }
                    },
                    data: stats.precision
                }
            ]
        };

        nonKeyErrorChart.setOption(option)
    };

    var drawCityMonitorPieChart = function (data) {

        var pieData = [];

        data.forEach(function (e) {
            pieData.push({name: e.city, value: e.monitorCount});
        });

        var option = {
            title: {
                text: '监控量城市占比',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            calculable: true,
            series: [
                {
                    name: '占比',
                    type: 'pie',
                    radius: ['0%', '55%'],
                    //center: ['50%', '60%'],
                    clockwise: true,
                    labelLine: {
                        normal: {
                            length: 5,
                            length2: 3
                        }
                    },
                    data: pieData
                }
            ]
        };
        cityMonitorPieChart.setOption(option)
    };

    var renderNonKeyErrorTable = function (data) {
        data.forEach(function (e) {
            e.nonKeyErrorRate = (e.nonKeyErrorRate * 100).toFixed(2) + "%"
        });
        var table = $('#nonKeyErrorTable');

        table.bootstrapTable('destroy').bootstrapTable({
            data: data,
            pagination: true,
            pageSize: 10,
            search: true,
            singleSelect: true
        });
    };

    var drawAreaQAScoreChart = function (data) {

        var stats = {
            region: [],
            avgQAScore: [],
            standardScore: []
        };

        var totalAvgScore = 0.0;
        var minScore = 100.0;

        data.forEach(function (e) {
            if (e.region != "全国") {
                var score = e.avgQAScore.toFixed(2);
                stats.region.push(e.region);
                stats.avgQAScore.push(score);
                stats.standardScore.push(standardScore);
                if (minScore > score) {
                    minScore = score
                }
            } else {
                totalAvgScore = e.avgQAScore.toFixed(2);
            }
        });


        var option = {
            title: {
                left: 'left',
                top: 'top',
                fontWeight: "bolder",
                subtext: '整体平均分:' + totalAvgScore,
                subtextStyle: {
                    color: "black",
                    fontStyle: 'bold',
                    fontWeight: 'normal'
                }
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                left: 'center',
                data: ['平均分', '标准线']
            },
            xAxis: [
                {
                    type: 'category',
                    data: stats.region
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    min: minScore - 10
                }
            ],
            animationDuration: 2000,
            series: [
                {
                    name: '平均分',
                    type: 'line',
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    data: stats.avgQAScore
                },
                {
                    name: '标准线',
                    type: 'line',
                    data: stats.standardScore,
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    showSymbol: false
                }
            ]
        };

        areaQAScoreChart.setOption(option)
    };

    var renderAreaQAScoreTable = function (data) {
        var rank = 0;
        var tempScore = 0;
        var tempRank = 0;
        data.forEach(function (e) {
            if (e.region != '全国') {
                rank += 1;
                if (tempScore == e.avgQAScore) {
                    e.rank = tempRank
                } else {
                    e.rank = rank;
                    tempScore = e.avgQAScore;
                    tempRank = rank;
                }
            }
            e.avgQAScore = e.avgQAScore.toFixed(2)
        });
        var table = $('#areaQAScoreTable');

        table.bootstrapTable('destroy').bootstrapTable({
            data: data,
            pagination: true,
            pageSize: 10,
            search: true,
            singleSelect: true
        });
    };

    var drawCityQAScoreChart = function (data) {

        var stats = {
            region: [],
            avgQAScore: [],
            standardScore: []
        };

        var totalAvgScore = 0.0;
        var minScore = 100.0;

        data.forEach(function (e) {
            if (e.region != "全国") {
                var score = e.avgQAScore.toFixed(2);
                stats.region.push(e.region);
                stats.avgQAScore.push(score);
                stats.standardScore.push(standardScore);
                if (minScore > score) {
                    minScore = score
                }
            } else {
                totalAvgScore = e.avgQAScore.toFixed(2);
            }
        });


        var option = {
            title: {
                left: 'left',
                top: 'top',
                fontWeight: "bolder",
                subtext: '整体平均分:' + totalAvgScore,
                subtextStyle: {
                    color: "black",
                    fontStyle: 'bold',
                    fontWeight: 'normal'
                }
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                left: 'center',
                data: ['平均分', '标准线']
            },
            xAxis: [
                {
                    type: 'category',
                    data: stats.region
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    min: minScore - 10
                }
            ],
            animationDuration: 2000,
            series: [
                {
                    name: '平均分',
                    type: 'line',
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    data: stats.avgQAScore
                },
                {
                    name: '标准线',
                    type: 'line',
                    data: stats.standardScore,
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    showSymbol: false
                }
            ]
        };

        cityQAScoreChart.setOption(option)
    };

    var renderCityQAScoreTable = function (data) {
        var rank = 0;
        var tempScore = 0;
        var tempRank = 0;
        data.forEach(function (e) {
            if (e.region != '全国') {
                rank += 1;
                if (tempScore == e.avgQAScore) {
                    e.rank = tempRank
                } else {
                    e.rank = rank;
                    tempScore = e.avgQAScore;
                    tempRank = rank;
                }
            }
            e.avgQAScore = e.avgQAScore.toFixed(2)
        });
        var table = $('#cityQAScoreTable');

        table.bootstrapTable('destroy').bootstrapTable({
            data: data,
            pagination: true,
            pageSize: 10,
            search: true,
            singleSelect: true
        });
    };

    var drawEmployeeQAScoreChart = function (data) {

        var stats = {
            employeeName: [],
            avgQAScore: [],
            standardScore: []
        };

        var totalAvgScore = 0.0;
        var minScore = 100.0;

        data.forEach(function (e) {
            if (e.employeeName != "整体") {
                var score = e.avgQAScore.toFixed(2);
                stats.employeeName.push(e.employeeName);
                stats.avgQAScore.push(score);
                stats.standardScore.push(standardScore);
                if (minScore > score) {
                    minScore = score
                }
            } else {
                totalAvgScore = e.avgQAScore.toFixed(2);
            }
        });


        var option = {
            title: {
                left: 'left',
                top: 'top',
                fontWeight: "bolder",
                subtext: '整体平均分:' + totalAvgScore,
                subtextStyle: {
                    color: "black",
                    fontStyle: 'bold',
                    fontWeight: 'normal'
                }
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                left: 'center',
                data: ['平均分', '标准线']
            },
            dataZoom: [
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
            ],
            xAxis: [
                {
                    type: 'category',
                    data: stats.employeeName,
                    axisLabel: {
                        rotate: 45
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    min: minScore - 10
                }
            ],
            animationDuration: 2000,
            series: [
                {
                    name: '平均分',
                    type: 'line',
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    data: stats.avgQAScore
                },
                {
                    name: '标准线',
                    type: 'line',
                    data: stats.standardScore,
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    showSymbol: false
                }
            ]
        };

        employeeQAScoreChart.setOption(option)
    };

    var renderEmployeeQAScoreTable = function (data) {
        var rank = 0;
        var tempScore = 0;
        var tempRank = 0;
        data.forEach(function (e) {
            if (e.employeeName != '整体') {
                rank += 1;
                if (tempScore == e.avgQAScore) {
                    e.rank = tempRank
                } else {
                    e.rank = rank;
                    tempScore = e.avgQAScore;
                    tempRank = rank;
                }
            }
            e.avgQAScore = e.avgQAScore.toFixed(2)
        });

        var table = $('#employeeQAScoreTable');

        table.bootstrapTable('destroy').bootstrapTable({
            data: data,
            pagination: true,
            pageSize: 10,
            search: true,
            singleSelect: true
        });
    };

    var drawNonKeyErrorDetailChart = function (data) {

        var stats = {
            errorName: [],
            monitorCount: [],
            nonKeyErrorCount: [],
            precision: []
        };

        data.forEach(function (e) {
            stats.errorName.push(e.errorName);
            stats.monitorCount.push(e.monitorCount);
            stats.nonKeyErrorCount.push(e.nonKeyErrorCount);
            stats.precision.push((e.nonKeyErrorRate * 100).toFixed(2));
        });

        renderErrorNameOptions(stats.errorName);
        var option = {
            title: {
                left: 'left',
                top: 'top',
                fontWeight: "bolder",
                subtextStyle: {
                    color: "black",
                    fontStyle: 'bold',
                    fontWeight: 'normal'
                }
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                left: 'center',
                data: ['出错量', '准确率']
            },
            xAxis: [
                {
                    type: 'category',
                    data: stats.errorName,
                    axisLabel: {
                        rotate: 45,
                        interval: 0
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value'
                },
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}%'
                    },
                    min: -10
                }
            ],
            animationDuration: 2000,
            series: [
                {
                    name: '出错量',
                    type: 'bar',
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    data: stats.nonKeyErrorCount
                },
                {
                    name: '准确率',
                    type: 'line',
                    yAxisIndex: 1,
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                            formatter: '{c}%'
                        }
                    },
                    data: stats.precision
                }
            ]
        };

        nonKeyErrorDetailChart.setOption(option)
    };

    var drawNonKeyErrorDetailPieChart = function (data) {

        var pieData = [];

        data.forEach(function (e) {
            pieData.push({name: e.errorName, value: e.nonKeyErrorCount});
        });

        var option = {
            title: {
                text: '各评估项出错占比',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            calculable: true,
            series: [
                {
                    name: '占比',
                    type: 'pie',
                    radius: ['0%', '55%'],
                    //center: ['50%', '60%'],
                    clockwise: true,
                    labelLine: {
                        normal: {
                            length: 5,
                            length2: 3
                        }
                    },
                    data: pieData
                }
            ]
        };
        nonKeyErrorDetailPieChart.setOption(option)
    };

    var renderNonKeyErrorDetailTable = function (data) {

        var rank = 0;
        var tempScore = 0;
        var tempRank = 0;
        data.forEach(function (e) {
            rank += 1;
            if (tempScore == e.nonKeyErrorRate) {
                e.rank = tempRank
            } else {
                e.rank = rank;
                tempScore = e.nonKeyErrorRate;
                tempRank = rank;
            }
            e.nonKeyErrorRate = (e.nonKeyErrorRate * 100).toFixed(2) + '%';
            if (tempRank <= 3) {
                e.rank = '<span style="color: red;font-weight: bolder">' + e.rank + '</span>';
                e.errorName = '<span style="color: red;font-weight: bolder">' + e.errorName + '</span>';
                /*e.nonKeyErrorCount = '<span style="color: red;font-weight: bolder">' + e.nonKeyErrorCount + '</span>';
                 e.monitorCount = '<span style="color: red;font-weight: bolder">' + e.monitorCount + '</span>';*/
                e.nonKeyErrorRate = '<span style="color: red;font-weight: bolder">' + e.nonKeyErrorRate + '</span>';
            }

        });

        var table = $('#nonKeyErrorDetailTable');

        table.bootstrapTable('destroy').bootstrapTable({
            data: data,
            pagination: true,
            pageSize: '10',
            search: true,
            singleSelect: true
        });

    };

    var drawNonKeyErrorCompareChart = function (data) {

        var stats = {
            errorName: [],
            srcRate: [],
            tarRate: [],
            rateDiff: []
        };

        data.forEach(function (e) {
            stats.errorName.push(e.errorName);
            stats.srcRate.push((e.srcRate * 100).toFixed(2));
            stats.tarRate.push((e.tarRate * 100).toFixed(2));
            stats.rateDiff.push((e.rateDiff * 100).toFixed(2));
        });

        var option = {
            title: {
                left: 'left',
                top: 'top',
                fontWeight: "bolder",
                subtextStyle: {
                    color: "black",
                    fontStyle: 'bold',
                    fontWeight: 'normal'
                }
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                left: 'center',
                data: ['本期出错率', '上期出错率', '升降幅']
            },
            xAxis: [
                {
                    type: 'category',
                    data: stats.errorName,
                    axisLabel: {
                        rotate: 45,
                        interval: 0
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}%'
                    }
                },
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}%'
                    }
                }
            ],
            animationDuration: 2000,
            series: [
                {
                    name: '本期出错率',
                    type: 'bar',
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                            formatter: '{c}%'
                        }
                    },
                    data: stats.srcRate
                },
                {
                    name: '上期出错率',
                    type: 'bar',
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                            formatter: '{c}%'
                        }
                    },
                    data: stats.tarRate
                },
                {
                    name: '升降幅',
                    type: 'line',
                    yAxisIndex: 1,
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                            formatter: '{c}%'
                        }
                    },
                    data: stats.rateDiff
                }
            ]
        };

        nonKeyErrorCompareChart.setOption(option)
    };

    var renderNonKeyErrorCompareTable = function (data) {
        data.forEach(function (e) {
            var rateDiff = e.rateDiff;
            e.srcRate = (e.srcRate * 100).toFixed(2) + '%';
            e.tarRate = (e.tarRate * 100).toFixed(2) + '%';
            e.rateDiff = (e.rateDiff * 100).toFixed(2) + '%';
            if (rateDiff > 0) {
                //e.errorName = '<span style="color: red;font-weight: bolder">' + e.errorName + '</span>';
                e.rateDiff = '<span style="color: red;font-weight: bolder">' + e.rateDiff + '</span>';
            } else if (rateDiff < 0) {
                //e.errorName = '<span style="color: blue;font-weight: bolder">' + e.errorName + '</span>';
                e.rateDiff = '<span style="color: blue;font-weight: bolder">' + e.rateDiff + '</span>';
            }
        });
        var table = $('#nonKeyErrorCompareTable');

        table.bootstrapTable('destroy').bootstrapTable({
            data: data,
            pagination: true,
            pageSize: '10',
            search: true,
            singleSelect: true
        });
    };

    var drawSingleNonKeyErrorChart = function (data) {

        var stats = {
            city: [],
            nonKeyErrorCount: [],
            nonKeyErrorRate: []
        };


        data.forEach(function (e) {
            stats.city.push(e.city);
            stats.nonKeyErrorCount.push(e.nonKeyErrorCount);
            stats.nonKeyErrorRate.push((e.nonKeyErrorRate * 100).toFixed(2));
        });

        var option = {
            title: {
                left: 'left',
                top: 'top',
                fontWeight: "bolder",
                subtextStyle: {
                    color: "black",
                    fontStyle: 'bold',
                    fontWeight: 'normal'
                }
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                left: 'center',
                data: ['出错量', '出错率']
            },
            xAxis: [
                {
                    type: 'category',
                    data: stats.city
                }
            ],
            yAxis: [
                {
                    type: 'value'
                },
                {
                    type: 'value',
                    axisLabel: {
                        formatter: '{value}%'
                    }
                }
            ],
            animationDuration: 2000,
            series: [
                {
                    name: '出错量',
                    type: 'bar',
                    label: {
                        normal: {
                            show: true,
                            position: 'top'
                        }
                    },
                    data: stats.nonKeyErrorCount
                },
                {
                    name: '出错率',
                    type: 'line',
                    yAxisIndex: 1,
                    label: {
                        normal: {
                            show: true,
                            position: 'top',
                            formatter: '{c}%'
                        }
                    },
                    data: stats.nonKeyErrorRate
                }
            ]
        };

        singleNonKeyErrorChart.setOption(option)
    };

    var renderSingleNonKeyErrorTable = function (data) {
        data.forEach(function (e) {
            e.nonKeyErrorRate = (e.nonKeyErrorRate * 100).toFixed(2) + "%"
        });
        var table = $('#singleNonKeyErrorTable');

        table.bootstrapTable('destroy').bootstrapTable({
            data: data,
            pagination: true,
            pageSize: 10,
            search: true,
            singleSelect: true
        });
    };

    var updateAllCharts = function () {
        var query = {
            monitorPeriod: periodSelect.val(),
            city: citySelect.val()
        };

        requestURL(dataService + "/ondoorQAReport/getMonitorCityCountStats", query).done(function (data) {
            drawCityMonitorBarChart(data);
            drawCityMonitorPieChart(data);
        });

        requestURL(dataService + "/ondoorQAReport/getMonitorCityKeyErrorStats", query).done(function (data) {
            drawKeyErrorChart(data);
            renderKeyErrorTable(data);
        });

        requestURL(dataService + "/ondoorQAReport/getMonitorCityNonKeyErrorStats", query).done(function (data) {
            drawNonKeyErrorChart(data);
            renderNonKeyErrorTable(data);
        });

        requestURL(dataService + "/ondoorQAReport/getMonitorAreaScoreStats", query).done(function (data) {
            drawAreaQAScoreChart(data);
            renderAreaQAScoreTable(data);
        });

        requestURL(dataService + "/ondoorQAReport/getMonitorCityScoreStats", query).done(function (data) {
            drawCityQAScoreChart(data);
            renderCityQAScoreTable(data);
        });

        requestURL(dataService + "/ondoorQAReport/getMonitorNonKeyErrorDetailStats", query).done(function (data) {
            drawNonKeyErrorDetailChart(data);
            drawNonKeyErrorDetailPieChart(data);
            renderNonKeyErrorDetailTable(data);
        });

        updateEmployeeQAScoreChart();
        updateNonKeyErrorCompareChart();
        updateSingleNonKeyErrorChart();
        renderComments();
    };

    var updateEmployeeQAScoreChart = function () {
        var query = {
            monitorPeriod: periodSelect.val(),
            city: citySelect.val()
        };
        requestURL(dataService + "/ondoorQAReport/getMonitorEmployeeScoreStats", query).done(function (data) {
            drawEmployeeQAScoreChart(data);
            renderEmployeeQAScoreTable(data);
        });
    };

    var updateNonKeyErrorCompareChart = function () {

        var query = {
            srcMonitorPeriod: periodSelect.val(),
            tarMonitorPeriod: tarMonitorPeriodSelect.val()
        };

        requestURL(dataService + "/ondoorQAReport/getMonitorNonKeyErrorCompareStats", query).done(function (data) {
            drawNonKeyErrorCompareChart(data);
            renderNonKeyErrorCompareTable(data);
        });
    };

    var updateSingleNonKeyErrorChart = function () {

        var query = {
            monitorPeriod: periodSelect.val(),
            errorName: errorNameSelect.val()
        };

        requestURL(dataService + "/ondoorQAReport/getMonitorSingleNonKeyErrorStats", query).done(function (data) {
            drawSingleNonKeyErrorChart(data);
            renderSingleNonKeyErrorTable(data);
        });
    };

    var renderComments = function () {

        $(".comment").val("");

        var query = {
            reportDate: periodSelect.val(),
            reportName: "质检上门QA分析"
        };

        requestURL(dataService + "/crm/getCRMReportComments", query).done(function (data) {
            data.forEach(function (e) {
                $("#textInput" + e.commentType).val(e.commentText);
            });
        });

    };

    var updateComments = function (data) {
        requestURLPost(dataService + "/crm/setCRMReportComments", data).done(function (res) {
            if (res.result == "OK") {
                alert("更新成功!!!");
            } else {
                alert("更新失败!!!");
            }
        })
    };

    requestURL(dataService + "/ondoorQAReport/getMonitorPeriodList", {}).done(function (data) {
        renderPeriodOptions(data);
    });

    periodSelect.on("change", updateAllCharts);
    citySelect.on("change", updateEmployeeQAScoreChart);
    tarMonitorPeriodSelect.on("change", updateNonKeyErrorCompareChart);
    errorNameSelect.on("change", updateSingleNonKeyErrorChart);

    renderComments();

    commentUpdate.on('click', function (param) {

        var commentType = param.currentTarget.id.substring(11);
        var data = {
            "reportName": "质检上门QA分析",
            "reportDate": periodSelect.val(),
            "commentType": commentType,
            "commentText": $("#textInput" + commentType).val()
        };

        updateComments(data);
    })

};