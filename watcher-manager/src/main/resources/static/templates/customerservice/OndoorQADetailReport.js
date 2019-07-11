Template.OndoorQADetailReport.rendered = function () {

    $('.navi-tab').removeClass('active');
    $('#district').addClass('active');
    $('#OndoorQADetailReport').addClass('active');
    $(".cityName .ms-choice").css("height","32px");
    $(".cityName .ms-choice").css("line-height","32px");
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;

    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
        $("#tips").hide()
    }

    renderFilterOptions();


    $('a[data-toggle=tab]').on('shown.bs.tab', function (e) {
        var activeTab =  $(".tab-content>.active").attr("id");
        renderPage(activeTab)
    });

    $(".search").click(function(){
        var activeTab =  $(".tab-content>.active").attr("id");
        renderPage(activeTab)
    })

};


function renderPage(activeTab){
    var filter = getSelectedFilters($("#"+activeTab))
    switch (activeTab) {
        case "trendIndex":
            trendTabRender(filter);
            break;
        case "detailIndex":
            QATabRender(filter);
            break;
        case "warningIndex":
            warningTabRender(filter);
            break;
        case "rankIndex":
            rankTabRender(filter);
            break;
        default:
            break;
    }
}

function getSelectedFilters($sel){
    var filters = {
        "startDate":$sel.find(".sdt").val(),
        "endDate":$sel.find(".edt").val(),
        "area":$sel.find(".areaName").val(),
        "city":$sel.find(".cityName").val(),
        "employeeName":$sel.find(".employeeName").val(),
        "employeeType":$sel.find(".employeeType").val(),
        "compareDimension":$sel.find(".compareDimension").val(),
        "date":$sel.find(".dt").val(),
    };
    return cleanParams(filters)
}

function getFilterOptions(){
    var dfd = $.Deferred();
    $("#content").hide()
    $("#loading").show()
    requestURL(dataService+"/ondoorQAReport/getOndoorQAFilters",{}).done(function(ret){
        $("#content").show()
        $("#loading").hide()
        dfd.resolve(ret)
    });
    return dfd.promise()
}

function renderFilterOptions(){
    var promise = getFilterOptions();
    promise.done(function(data){
        $(".cityName").attr("multiple","multiple");
        $(".areaName").attr("multiple","multiple");
        $(".employeeName").attr("multiple","multiple")
        $(".employeeType").attr("multiple","multiple")
        renderOptions(".sdt",data.weekList);
        renderOptions(".edt",data.weekList);
        renderOptions(".dt",data.weekList);
        renderOptions(".areaName",["华北","华东","华南","华西"]);
        renderOptions(".cityName",data.cityList);
        renderOptions(".employeeName",data.employeeNameList);
        renderOptions(".employeeType",["正式员工","试用期员工"]);
        $(".cityName").multipleSelect({
            placeholder: "全部",
            selectAllText:"全选",
            width: 150,
            selectAll: true,
            filter: true
        });
        $(".areaName").multipleSelect({
            placeholder: "全部",
            selectAllText:"全选",
            width: 150,
            //selectAll: true,
            //filter: true
        });

        $(".employeeName").multipleSelect({
            placeholder: "全部",
            selectAllText:"全选",
            width: 150,
            selectAll: true,
            filter: true
        });
        $(".employeeType").multipleSelect({
            placeholder: "全部",
            selectAllText:"全选",
            width: 150,
            selectAll: false,
            filter: true
        });

        modifyCSS(".cityName")
        modifyCSS(".areaName")
        modifyCSS(".employeeName")
        modifyCSS(".employeeType")

        $(".dateType").change(function(){
            var dateType = this.value;
            if(dateType=="weekly"){
                renderOptions("#trendIndex .sdt",data.weekList);
                renderOptions("#trendIndex .edt",data.weekList);
            }else if(dateType=="monthly"){
                renderOptions("#trendIndex .sdt",data.monthList);
                renderOptions("#trendIndex .edt",data.monthList);
            }
        })
        renderPage($(".tab-content>.active").attr("id"))
    })
}

function modifyCSS(sel){
    $(sel).find(".ms-choice").css("height","32px");
    $(sel).find(".ms-choice").css("line-height","32px");
    $(sel).find(".ms-choice>div").css("height","32px");
    $(sel).find(".ms-choice>div").css("top","3px");
}

function renderOptions(sel,data){
    $(sel).empty();
    data.forEach(function(ele){
        $(sel).append("<option value='"+ele+"'>"+ele+"</option>")
    });
    if(sel.indexOf(".sdt")>-1){
        var len = data.length;
        var index = len>10?10:len;
        $(sel).val(data[index-1])
    }
}


function trendTabRender(filter){
    requestURL(dataService+"/ondoorQAReport/getScoreCompareTrend",filter).done(function(data){
        var obj = {}
        var dimensionObj = _.groupBy(data,function(obj){return obj.dimension})
        var sortedData = _.sortBy(dimensionObj,function(arr){return -1*arr.length});
        var dateList = _.map(sortedData[0],function(obj){return obj.name})
        var len = dateList.length;
        data.forEach(function(tmp){
            var sv=dateList.indexOf(tmp.name)
            var ev=obj[tmp.dimension]?obj[tmp.dimension].length:0
            var dif = sv-ev;
            for(var i=0;i<dif;i++){
                if(obj[tmp.dimension]){
                    obj[tmp.dimension].push(undefined)
                }else{
                    obj[tmp.dimension]=[undefined]
                }
            }
            if(obj.hasOwnProperty(tmp.dimension)){
                obj[tmp.dimension].push(tmp.value)
            }else{
                obj[tmp.dimension]=[tmp.value]
            }
        });
        var series = []
        for(var key in obj){
            series.push({
                name: key,
                type: 'line',
                yAxisIndex: 0,
                data: obj[key]
            })
        }

        var option = {
            title: {
                text: '平均分数趋势图',
                x: "center",
                padding:[0,0,0,50]
            },
            tooltip: {
                trigger: 'axis',

            },
            legend: {
                data: _.keys(obj),
                padding: [25,0,0,0],
            },
            xAxis: [
                {
                    type: 'category',
                    data: dateList
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel:{
                        formatter: '{value}'
                    },
                    min:80,
                    max:100
                }
            ],
            series: series
        };
        var scoreTrendChart = echarts.init(document.getElementById('scoreTrendChart'));
        scoreTrendChart.setOption(option);
        window.addEventListener('resize',scoreTrendChart.resize)
    })
}


function QATabRender(filter){
    requestURL(dataService+"/ondoorQAReport/getOptionedMonitorNonKeyErrorDetailList",filter).done(function(data){
        drawNonKeyErrorDetailChart(data);
        drawNonKeyErrorDetailPieChart(data);
    })
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
                        rotate: -20,
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
        var nonKeyErrorDetailChart = echarts.init(document.getElementById('nonKeyErrorDetailChart'));
        nonKeyErrorDetailChart.setOption(option)
        window.addEventListener('resize',nonKeyErrorDetailChart.resize)
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
        var nonKeyErrorDetailPieChart = echarts.init(document.getElementById('nonKeyErrorDetailPieChart'));
        nonKeyErrorDetailPieChart.setOption(option)
        window.addEventListener('resize',nonKeyErrorDetailPieChart.resize)
    };
}


function warningTabRender(filter){


    $('#lowScoreEmployeeNameDataTable').bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        pagination: true,
        sidePagination: 'server',
        ajax:function(params){
            var ajaxParams = $.extend(filter,params.data,{score:90});

            requestURL(dataService+"/ondoorQAReport/getLowScoreEmployeeNamePaginate",cleanParams(ajaxParams)).done(function(data){
                params.success(data)
            })

        },
        columns: [{
            field: 'area',
            title: '区域',
            sortable:false
        }, {
            field: 'city',
            title: '城市',
            sortable:false
        }, {
            field: 'shop',
            title: '员工',
            sortable:false
        }, {
            field: 'cnt',
            title: '低于90分的次数',
            sortable:false
        }]
    })
}
function rankTabRender(filter){
    $('#scoreRankDataTable').bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        pagination: true,
        sidePagination: 'server',
        ajax:function(params){
            var ajaxParams = $.extend(filter,params.data);

            requestURL(dataService+"/ondoorQAReport/getScoreRank",cleanParams(ajaxParams)).done(function(data){
                params.success(data)
            })

        },
        columns: [{
            field: 'name',
            title: '维度',
            sortable:false
        }, {
            field: 'value',
            title: '平均分',
            sortable:true
        }]
    })
}


