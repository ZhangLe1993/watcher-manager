Template.pageViewModal.rendered = function () {
    pagename = Template.currentData().page;
    idsite = Template.currentData().plat;
    area = Template.currentData().area;
    city = Template.currentData().city;

    var dateGap = -14;
    var minWeekDate = "2016-07-03";
    var minMonthDate = "2016-07-01";
    var endDate = new Date().getNewDate(-1);
    var startDate = new Date(endDate).getNewDate(dateGap);
    var startWeekDate = moment().weekday(-14).format("YYYY-MM-DD")
    var endWeekDate = moment().weekday(-7).format("YYYY-MM-DD")
    if (startWeekDate < minWeekDate) {
        startWeekDate = minWeekDate;
    }
    var startMonthDate = moment().subtract(1, 'month').startOf('month').format("YYYY-MM-DD");
    var endMonthDate = moment().subtract(1, 'month').startOf('month').format("YYYY-MM-DD");
    if (startMonthDate < minMonthDate) {
        startMonthDate = minMonthDate;
    }
    var transformDate = function (date) {
        var dateStrArray = date.split('-');
        return dateStrArray[1] + '/' + dateStrArray[2] + '/' + dateStrArray[0]
    };

    var datePickerOptions = {
        "showDropdowns": true,
        //"alwaysShowCalendars": true,
        //"singleDatePicker": true,
        "autoApply": true,
        "alwaysShowCalendars": false,
        "startDate": transformDate(startDate),
        "endDate": transformDate(endDate),
        "minDate": transformDate("2016-07-01"),
        "maxDate": transformDate(endDate),
        "locale": {
            "format": "MM/DD/YYYY",
            "separator": " - ",
            "applyLabel": "确认",
            "cancelLabel": "取消",
            "fromLabel": "从",
            "toLabel": "至",
            "customRangeLabel": "自定义",
            "daysOfWeek": [
                "日",
                "一",
                "二",
                "三",
                "四",
                "五",
                "六"
            ],
            "monthNames": [
                "一月",
                "二月",
                "三月",
                "四月",
                "五月",
                "六月",
                "七月",
                "八月",
                "九月",
                "十月",
                "十一月",
                "十二月"
            ],
            "firstDay": 0
        },
        "ranges": {
            '昨天': [moment().subtract(1, 'days').toDate(), moment().subtract(1, 'days').toDate()],
            '最近7天': [moment().subtract(7, 'days').toDate(), moment().toDate()],
            '最近15天': [moment().subtract(15, 'days').toDate(), moment().toDate()],
            '最近30天': [moment().subtract(30, 'days').toDate(), moment().toDate()],
            '本周': [moment().startOf('week').toDate(), moment().endOf('week').toDate()],
            '上周': [moment().subtract(1, 'week').startOf('week').toDate(), moment().subtract(1, 'week').endOf('week').toDate()],
            '本月': [moment().startOf('month').toDate(), moment().endOf('month').toDate()],
            '上个月': [moment().subtract(1, 'month').startOf('month').toDate(), moment().subtract(1, 'month').endOf('month').toDate()],
            '今年': [moment().startOf('year').toDate(), moment().endOf('year').toDate()],
            '去年': [moment().subtract(1, 'year').startOf('year').toDate(), moment().subtract(1, 'year').endOf('year').toDate()]
        }
    };

    $(".dateSelectLabel").html(startDate + "~" + endDate);
    $('.webTrafficFunnelDate').daterangepicker(datePickerOptions, pickWebTrafficFunnelDateRangeCallback);

    getValue(pagename, idsite);
}

var pagename, idsite,area,city;

function pickWebTrafficFunnelDateRangeCallback(start, end) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.dateSelectLabel').html(sdt + "~" + edt);

    getValue(pagename, idsite);
}

function getValue(pagename, idsite) {
    var dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g, "").split("~");
    var startDate = dt[0];
    var endDate = dt[1];
    var query = {
        "startDate": startDate,
        "endDate": endDate,
        "idsite": idsite,
        "pagename": pagename,
        "area":area,
        "city":city
    }
    requestURL(dataService + "/product/getProductVisitUrl", query).done(function (data) {
        drawPagenameChart(data);
    });
}

/*活跃访客统计*/
function drawPagenameChart(data) {
    var xAxis_data = [];
    var series = {
        uv: [],
        bounceuv: [],
        bouncerate: [],
        entryuv: [],
        entryrate: [],
        exituv: [],
        exitrate: []
    };
    data.forEach(function (e) {
        xAxis_data.push(e.date);
        series.uv.push(e.uv);
        series.bounceuv.push(e.bounce_uv);
        series.bouncerate.push(((e.bounce_uv / e.uv) * 100).toFixed(2));
        series.entryuv.push(e.entry_uv);
        series.entryrate.push(((e.entry_uv / e.uv) * 100).toFixed(2));
        series.exituv.push(e.exit_uv);
        series.exitrate.push(((e.exit_uv / e.uv) * 100).toFixed(2));
    });
    xAxis_data = _.uniq(xAxis_data);

    var option = {
        title: {
            text: 'URL统计图',
            x: "center",
            y: "bottom"
        },
        tooltip: {
            trigger: 'axis',
            formatter: function (params, ticket, callback) {
                var str = params[0].name + '<br/>';
                params.forEach(function (obj) {
                    if (obj.seriesName.indexOf("率") > -1) {
                        str += obj.seriesName + ' : ' + obj.value + '%<br/>';
                    } else
                        str += obj.seriesName + ' : ' + obj.value + '<br/>';
                });
                return (str)
            }
        },
        legend: {
            data: ['总访客数', '跳出访客数', '跳出访客率', '进入访客数', '进入访客率', '退出访客数', '退出访客率']
        },
        grid: {
            left: '3%',
            right: '4%',
            containLabel: true
        },
        toolbox: {
            feature: {
                /*saveAsImage: {}*/
            }
        },
        xAxis: {
            type: 'category',
//                boundaryGap: false,
            data: xAxis_data
        },
        yAxis: [
            {
                type: 'value',
                name: '访客数',
                splitLine: {
                    show: false
                }
            },
            {
                type: 'value',
                name: '访客率',
                min: 0,
                splitLine: {
                    show: false
                }
            }
        ],
        series: [
            {
                name: '总访客数',
                type: 'line',
                yAxisIndex: 0,
//                    itemStyle: {
//                        normal: {
//                            color: '#568FC8',
//                            label: {
//                                show: true,
//                                position: 'top',
//                                textStyle: {
//                                    color: '#568FC8'
//                                }
//                            }
//                        }
//                    },
                data: series.uv
            },
            {
                name: '跳出访客数',
                type: 'line',
                yAxisIndex: 0,
//                    itemStyle: {
//                        normal: {
//                            color: '#d48265',
//                            label: {
//                                show: true,
//                                position: 'top',
//                                textStyle: {
//                                    color: '#d48265'
//                                }
//                            }
//                        }
//                    },
                data: series.bounceuv
            },
            {
                name: '跳出访客率',
                type: 'line',
                yAxisIndex: 1,
//                    itemStyle: {
//                        normal: {
//                            color: '#d48265',
//                            label: {
//                                show: true,
//                                position: 'top',
//                                textStyle: {
//                                    color: '#d48265'
//                                }
//                            }
//                        }
//                    },
                data: series.bouncerate
            },
            {
                name: '进入访客数',
                type: 'line',
                yAxisIndex: 0,
//                    itemStyle: {
//                        normal: {
//                            color: '#568FC8',
//                            label: {
//                                show: true,
//                                position: 'top',
//                                textStyle: {
//                                    color: '#568FC8'
//                                }
//                            }
//                        }
//                    },
                data: series.entryuv
            },
            {
                name: '进入访客率',
                type: 'line',
                yAxisIndex: 1,
//                    itemStyle: {
//                        normal: {
//                            color: '#568FC8',
//                            label: {
//                                show: true,
//                                position: 'top',
//                                textStyle: {
//                                    color: '#568FC8'
//                                }
//                            }
//                        }
//                    },
                data: series.entryrate
            },
            {
                name: '退出访客数',
                type: 'line',
                yAxisIndex: 0,
                //                    itemStyle: {
                //                        normal: {
                //                            color: '#568FC8',
                //                            label: {
                //                                show: true,
                //                                position: 'top',
                //                                textStyle: {
                //                                    color: '#568FC8'
                //                                }
                //                            }
                //                        }
                //                    },
                data: series.exituv
            },
            {
                name: '退出访客率',
                type: 'line',
                yAxisIndex: 1,
                //                    itemStyle: {
                //                        normal: {
                //                            color: '#568FC8',
                //                            label: {
                //                                show: true,
                //                                position: 'top',
                //                                textStyle: {
                //                                    color: '#568FC8'
                //                                }
                //                            }
                //                        }
                //                    },
                data: series.exitrate
            }
        ]
    };
    var pagenameChart = echarts.init(document.getElementById('pagenameChart'));
    pagenameChart.setOption(option);
}
