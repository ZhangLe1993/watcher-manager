Template.CRMTaskDashboardIFrame.rendered = function () {

    var dateRangeSelect = $('.reportRange');
    dateRangeSelect.daterangepicker({
        "autoUpdateInput": false,
        "showCustomRangeLabel": false,
        "showDropdowns": false,
        "alwaysShowCalendars": false,
        "linkedCalendars": false,
        "autoApply": true,
        "locale": {
            "format": "MM/DD/YYYY",
            "separator": " - ",
            "applyLabel": "确认",
            "cancelLabel": "取消",
            "fromLabel": "从",
            "toLabel": "至",
            "customRangeLabel": "其他时间",
            "weekLabel": "周数",
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
            "firstDay": 7
        },
        "ranges": {
            '今天': [moment().toDate(), moment().toDate()],
            '最近7天': [moment().subtract(6, 'days').toDate(), moment().toDate()],
            '最近30天': [moment().subtract(29, 'days').toDate(), moment().toDate()],
            '本月': [moment().startOf('month').toDate(), moment().endOf('month').toDate()],
            '上个月': [moment().subtract(1, 'month').startOf('month').toDate(), moment().subtract(1, 'month').endOf('month').toDate()],
            '今年': [moment().startOf('year').toDate(), moment().endOf('year').toDate()],
            '去年': [moment().subtract(1, 'year').startOf('year').toDate(), moment().subtract(1, 'year').endOf('year').toDate()]
        }
    }, pickRangeCallback);

    var departmentSelect = document.getElementById('departmentSelect');
    departmentSelect.addEventListener('change', function () {
        updateEmployeeTables();
    });


    var configDynamicTable = function (tableId) {
        var dynamicTable = (function () {

            var _tableId, _table,
                _fields, _headers,
                _defaultText;

            /** Builds the row with columns from the specified names.
             *  If the item parameter is specified, the memebers of the names array will be used as property names of the item; otherwise they will be directly parsed as text.
             */
            function _buildRowColumns(names, item) {
                var row = '<tr>';
                if (names && names.length > 0) {
                    $.each(names, function (index, name) {
                        var c = item ? item[name + ''] : name;
                        row += '<td>' + c + '</td>';
                    });
                }
                row += '<tr>';
                return row;
            }

            /** Builds and sets the headers of the table. */
            function _setHeaders() {
                // if no headers specified, we will use the fields as headers.
                _headers = (_headers == null || _headers.length < 1) ? _fields : _headers;
                var h = _buildRowColumns(_headers);
                if (_table.children('thead').length < 1) _table.prepend('<thead></thead>');
                _table.children('thead').html(h);
            }

            function _setNoItemsInfo() {
                if (_table.length < 1) return; //not configured.
                var colspan = _headers != null && _headers.length > 0 ?
                'colspan="' + _headers.length + '"' : '';
                var content = '<tr class="no-items"><td ' + colspan + ' style="text-align:center">' +
                    _defaultText + '</td></tr>';
                if (_table.children('tbody').length > 0)
                    _table.children('tbody').html(content);
                else _table.append('<tbody>' + content + '</tbody>');
            }

            function _removeNoItemsInfo() {
                var c = _table.children('tbody').children('tr');
                if (c.length == 1 && c.hasClass('no-items')) _table.children('tbody').empty();
            }

            return {
                /** Configres the dynamic table. */
                config: function (tableId, fields, headers, defaultText) {
                    _tableId = tableId;
                    _table = $('#' + tableId);
                    _fields = fields || null;
                    _headers = headers || null;
                    _defaultText = defaultText || 'No items to list...';
                    _setHeaders();
                    _setNoItemsInfo();
                    return this;
                },
                /** Loads the specified data to the table body. */
                load: function (data, append) {
                    if (_table.length < 1) return; //not configured.
                    _setHeaders();
                    _removeNoItemsInfo();
                    if (data && data.length > 0) {
                        var rows = '';
                        $.each(data, function (index, item) {
                            rows += _buildRowColumns(_fields, item);
                        });
                        var mthd = append ? 'append' : 'html';
                        _table.children('tbody')[mthd](rows);
                    }
                    else {
                        _setNoItemsInfo();
                    }
                    return this;
                },
                /** Clears the table body. */
                clear: function () {
                    _setNoItemsInfo();
                    return this;
                }
            };
        }());
        return dynamicTable.config(tableId,
            ['employeeName', 'processCount', 'suspendedCount', 'finishedCount'],
            ['员工姓名', '受理中', '暂停中', '已完成']);
    };
    var employeeTable1 = configDynamicTable('employeeTable1');
    var employeeTable2 = configDynamicTable('employeeTable2');
    var employeeTable3 = configDynamicTable('employeeTable3');

    function pickRangeCallback(start, end, label) {

        if (label != '其他时间') {
            $('.dateSelectLabel').html(label);
        } else {
            $('.dateSelectLabel').html(start.format('YYYY-MM-DD') + ' ~ ' + end.format('YYYY-MM-DD'));
        }
        var query = {
            "startDate": start.format('YYYY-MM-DD'),
            "endDate": end.format('YYYY-MM-DD')
        };

        requestURL(dataService + "/crm/getAssignedTaskStats", query).done(function (data) {
            updateAssignedChart(data);
        });
    }

    var updateStats = function (query) {
        requestURL(dataService + "/crm/getSummaryStats", query).done(function (data) {
            $('#toBeAssignedCount').html(data.toBeAssignedCount);
            $('#toBeProcessCount').html(data.toBeProcessCount);
            $('#suspendedCount').html(data.suspendedCount);
            $('#finishedCount').html(data.finishedCount);
        });

        requestURL(dataService + "/crm/getValidateFailStatistics", query).done(function (data) {
            $('#validateFailCount').html(data);
        });

        requestURL(dataService + "/crm/getTodayOrdertatistics", {}).done(function (data) {
            updateToTodayAssignedChart(data);
        });

        requestURL(dataService + "/crm/getMonthSummaryStats", query).done(function (data) {
            $('#monthCreatedCount').html(data.monthCreatedCount);
            $('#monthFinishedCount').html(data.monthFinishedCount);
        });

        requestURL(dataService + "/crm/getToBeAssignedTaskStats", query).done(function (data) {
            updateToBeAssignedChart(data);
        });

        requestURL(dataService + "/crm/getOrderRealTimestatistics", {}).done(function (data) {
            updateOrderRealTimestatisticsChart(data);
        });
        requestURL(dataService + "/crm/getCheckErrorStatistics", {}).done(function (data) {
            updateCheckErrorStatisticsChart(data)
        });
    };

    var updateToTodayAssignedChart = function (data) {
        var labels = [];
        var barData = [];
        var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
        data.forEach(function (e) {
            labels.push(e.tradeStatus);
            barData.push({
                value: e.count,
                itemStyle: {
                    normal: {
                        color: colors.pop()
                    }
                }
            });
        });
        var option = {
            calculable: true,
            grid: {
                top: 80,
                bottom: 100
            },
            xAxis: [
                {
                    'type': 'category',
                    'data': labels
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '当日生成任务数据统计',
                    type: 'bar',
                    label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                    barMaxWidth: 100,
                    data: barData
                }]
        };

        var chart = echarts.init(document.getElementById('toTodayAssignedChart'));
        chart.setOption(option)

    };

    var updateToBeAssignedChart = function (data) {
        var labels = [];
        var barData = [];
        var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
        data.forEach(function (e) {
            labels.push(e.categoryName);
            barData.push({
                value: e.count,
                itemStyle: {
                    normal: {
                        color: colors.pop()
                    }
                }
            });
        });
        var option = {
            calculable: true,
            grid: {
                top: 80,
                bottom: 100
            },
            xAxis: [
                {
                    'type': 'category',
                    'data': labels
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '待分配任务数',
                    type: 'bar',
                    label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                    barMaxWidth: 100,
                    data: barData
                }]
        };

        var chart = echarts.init(document.getElementById('toBeAssignedChart'));
        chart.setOption(option)

    };

    var updateAssignedChart = function (data) {

        var labels = [];
        var processCount = [];
        var suspendedCount = [];
        var frozenCount = [];
        var finishedCount = [];

        data.forEach(function (e) {
            var total = e.processCount + e.suspendedCount + e.finishedCount + e.frozenCount;
            labels.push(e.categoryName + "\n(" + total + ")");

            processCount.push({value: e.processCount});
            suspendedCount.push({value: e.suspendedCount});
            finishedCount.push({value: e.finishedCount});
            frozenCount.push({value: e.frozenCount});
        });
        var option = {
            legend: {
                data: ['受理中', '暂停中', '冻结中', '已完成']
            },
            calculable: true,
            grid: {
                top: 80,
                bottom: 100
            },
            xAxis: [
                {
                    'type': 'category',
                    'data': labels,
                    'splitLine': {
                        show: true
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '受理中',
                    type: 'bar',
                    label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                    barMaxWidth: 100,
                    data: processCount
                }, {
                    name: '暂停中',
                    type: 'bar',
                    label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                    barMaxWidth: 100,
                    data: suspendedCount
                }, {
                    name: '冻结中',
                    type: 'bar',
                    label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                    barMaxWidth: 100,
                    data: frozenCount
                }, {
                    name: '已完成',
                    type: 'bar',
                    label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                    barMaxWidth: 100,
                    data: finishedCount
                }]
        };

        var chart = echarts.init(document.getElementById('assignedChart'));
        chart.setOption(option)

    };

    var updateEmployeeTables = function () {
        requestURL(dataService + "/crm/getEmployeeTaskStats", {
            date: date,
            department: departmentSelect.value
        }).done(function (data) {
            var dataList = [[], [], []];
            var index = 0;

            data.forEach(function (e) {
                dataList[index].push(e);
                index = (index + 1) % 3;
            });
            var dataTest = [{
                employeeName: "Test",
                finishedCount: '<a href="http://192.168.3.51:4444/task?isassigned=true&status=3&HasTaskAccepter=true&ownerNoList=30">20</a>',
                processCount: 17,
                suspendedCount: 12
            }];
            //console.log(dataList[0]);
            employeeTable1.load(dataList[0]);
            employeeTable2.load(dataList[1]);
            employeeTable3.load(dataList[2]);
        });
    };

    var updateOrderRealTimestatisticsChart = function (data) {
        var labels = [];
        var barData = [];
        var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
        data.forEach(function (e) {
            switch(e.tradeStatus) {
                case "1":
                    labels.push("待审核确认");
                    break;
                case "4":
                    labels.push("待派单");
                    break;
                case "8":
                    labels.push("待上门");
                    break;
                case "16":
                    labels.push("待付款");
                    break;
                case "32":
                    labels.push("待用户发货");
                    break;
                case "64":
                    labels.push("待商家收货");
                    break;
                case "128":
                    labels.push("待验货");
                    break;
                case "256":
                    labels.push("验货失败");
                    break;
                case "4096":
                    labels.push("待商家退货");
                    break;
                case "32768":
                    labels.push("待放款");
                    break;
            }
            barData.push({
                value: e.count,
                itemStyle: {
                    normal: {
                        color: colors.pop()
                    }
                }
            });
        });
        var option = {
            calculable: true,
            grid: {
                top: 80,
                bottom: 100
            },
            xAxis: [
                {
                    'type': 'category',
                    'data': labels,
                    axisLabel:{
                        interval:0
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '订单实时数据统计',
                    type: 'bar',
                    label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                    barMaxWidth: 100,
                    data: barData
                }]
        };

        var chart = echarts.init(document.getElementById('OrderRealTimestatisticsChart'));
        chart.setOption(option)

    };
    var updateCheckErrorStatisticsChart = function (data) {
        var labels = [];
        var barData = [];
        var colors = ['#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'].reverse();
        var total=0;
        data.forEach(function (e) {
            if(["暂停单","冻结单"].contains(e.name)){
                total += -parseInt(e.count)
            }else{
                total+= parseInt(e.count)
            }
            labels.push(e.name);
            barData.push({
                value: e.count,
                itemStyle: {
                    normal: {
                        color: colors.pop()
                    }
                }
            });
        });
        $("#checkErrorCount").html(total)
        var option = {
            calculable: true,
            grid: {
                top: 80,
                bottom: 100
            },
            xAxis: [
                {
                    'type': 'category',
                    'data': labels,
                    axisLabel:{
                        interval:0
                    }
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '验货差异数据统计',
                    type: 'bar',
                    label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                    barMaxWidth: 100,
                    data: barData
                }]
        };

        var chart = echarts.init(document.getElementById('checkErrorStatisticsChart'));
        chart.setOption(option)

    };

    var date = new Date().format("yyyy-MM-dd");
    var monthStartDate = moment().startOf('month').toDate().format("yyyy-MM-dd");

    var query = {
        date: date,
        monthStartDate: monthStartDate,
        startDate: date,
        endDate: date
    };

    updateStats(query);

    requestURL(dataService + "/crm/getAssignedTaskStats", query).done(function (data) {
        updateAssignedChart(data);
    });

    updateEmployeeTables();

};