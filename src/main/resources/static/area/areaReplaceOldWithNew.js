Template.areaReplaceOldWithNew.rendered = function () {
    $('.navi-tab').removeClass('active');
    refreshActive();
    this.autorun(function () {
        refreshActive();
    });
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    setTopLoading();
    requestURL(dataService + "/live/replace", {}).done(function (data) {

        var city = _.uniq(_.pluck(data, 'city_name'));
        var store = _.uniq(_.pluck(data, 'shop_name'));
        var source = _.uniq(_.pluck(data, 'source'));
        //排序
        city = city.sort(
            function compareFunction(param1, param2) {
                return param1.localeCompare(param2,"zh");
            }
        );

        //排序
        store = store.sort(
            function compareFunction(param1, param2) {
                return param1.localeCompare(param2,"zh");
            }
        );

        //排序
        source = source.sort(
            function compareFunction(param1, param2) {
                return param1.localeCompare(param2,"zh");
            }
        );
        drawFilter({area : ['华北大区','华东大区','华南大区','华西大区'], city : city, store : store, source : source});
        drawCompare(data);
        chartTemp = data;
    });

    requestURL(dataService + "/live/replaces", {}).done(function (data) {
        drawTableBody(data);
        tableTemp = data;
    });

};

var chartTemp = [];


var tableTemp = [];


var getFilter = function() {
    var area = $('#area-select').val();
    var city = $('#city-select').val();
    var store = $('#store-select').val();
    var source = $('#source-select').val();
    return {area:area, city:city, store:store, source:source};
};

var refreshActive = function() {
    var flag = Template.currentData().flag;
    if(flag == "realTime"){
        $('#dashboard').addClass('active');
        $('#realAreaReplaceOldWithNew').addClass('active');
    }else if(flag == "live"){
        $('#aihuishouTab').addClass('active');
        $('#livesTab').addClass('active');
        $('#areaReplaceOldWithNew').addClass('active');
    }
};


var drawFilter = function(obj) {
    drawPluralSelect("#area-select", obj.area, "area-select");
    drawPluralSelect("#city-select", obj.city, "city-select");
    drawPluralSelect("#store-select", obj.store, "store-select");
    drawPluralSelect("#source-select", obj.source, "source-select");
    $(".filter-option").attr("style","background-color:#fff !important;");

    $('#area-select').on('changed.bs.select',function(e) {
        refreshAll();
    });

    $('#city-select').on('changed.bs.select',function(e) {
        refreshAll();
    });

    $('#store-select').on('changed.bs.select',function(e) {
        refreshAll();
    });

    $('#source-select').on('changed.bs.select',function(e) {
        refreshAll();
    });
};


var refreshAll = function () {
    setTopLoading();
    var computeChartList = chartTemp;
    var computeTableList = tableTemp;
    var filter = getFilter();

    if(filter.area != null) {
        computeChartList = _.filter(computeChartList, function(ele) {
            return filter.area.contains(ele['area_name']);
        });

        computeTableList = _.filter(computeTableList, function(ele) {
            return filter.area.contains(ele['area_name']);
        });
    }

    if(filter.city != null) {
        computeChartList = _.filter(computeChartList, function(ele) {
            return filter.city.contains(ele['city_name']);
        });

        computeTableList = _.filter(computeTableList, function(ele) {
            return filter.city.contains(ele['city_name']);
        });
    }

    if(filter.store != null) {
        computeChartList = _.filter(computeChartList, function(ele) {
            return filter.store.contains(ele['shop_name']);
        });

        computeTableList = _.filter(computeTableList, function(ele) {
            return filter.store.contains(ele['shop_name']);
        });
    }

    if(filter.source != null) {
        computeChartList = _.filter(computeChartList, function(ele) {
            return filter.source.contains(ele['source']);
        });

        computeTableList = _.filter(computeTableList, function(ele) {
            return filter.source.contains(ele['source']);
        });
    }

    drawCompare(computeChartList);
    drawTableBody(computeTableList);
};


var drawCompare = function (data) {

    var map = _.groupBy(data, 'create_date');
    //console.log(map);

    if(Object.keys(map).length == 0) {
        cancelLoading('currentSuccessNum');
        $("#currentSuccessNum").html(0);

        cancelLoading('currentSuccessAmount');
        $("#currentSuccessAmount").html(0);

        cancelLoading('lastSuccessNum');
        $("#lastSuccessNum").html(0);

        cancelLoading('lastSuccessAmount');
        $("#lastSuccessAmount").html(0);
    }
    var cur = new Date().getNewDate(0);
    var last = new Date().getNewDate(-1);
    if(!map.hasOwnProperty(cur)) {

        cancelLoading('currentSuccessNum');
        $("#currentSuccessNum").html(0);

        cancelLoading('currentSuccessAmount');
        $("#currentSuccessAmount").html(0);
    }

    if(!map.hasOwnProperty(last)) {

        cancelLoading('lastSuccessNum');
        $("#lastSuccessNum").html(0);

        cancelLoading('lastSuccessAmount');
        $("#lastSuccessAmount").html(0);
    }

    var yes = [];
    var to = [];
    _.map(map, function(value, key) {

        if(cur == key) {
            //今日量
            var currentSuccessNum = _.reduce(value, function(temp, obj) { return temp + accMul(obj['sale_num'],1)}, 0);
            cancelLoading('currentSuccessNum');
            $("#currentSuccessNum").html(currentSuccessNum.toLocaleString());

            //今日金额
            var currentSuccessAmount = _.reduce(value, function(temp, obj) { return temp + accMul(obj['sale_amount'],1)}, 0);
            cancelLoading('currentSuccessAmount');
            $("#currentSuccessAmount").html(currentSuccessAmount.toLocaleString());

            to = value;
        } else {
            var lastSuccessNum = _.reduce(value, function(temp, obj) { return temp + accMul(obj['sale_num'],1)}, 0);
            cancelLoading('lastSuccessNum');
            $("#lastSuccessNum").html(lastSuccessNum.toLocaleString());
            var lastSuccessAmount = _.reduce(value, function(temp, obj) { return temp + accMul(obj['sale_amount'],1)}, 0);
            cancelLoading('lastSuccessAmount');
            $("#lastSuccessAmount").html(lastSuccessAmount.toLocaleString());

            yes = value;
        }

    });

    //按照大区
    var curPillarsNumData = getAreaData(yes, to, 'area_name', 'sale_num');
    //console.log(curPillarsNumData);
    drawAreaChart(curPillarsNumData, 'areaNumChart');
    var curPillarsAmountData = getAreaData(yes, to, 'area_name', 'sale_amount');
    drawAreaChart(curPillarsAmountData, 'areaAmountChart');

    //按照新机型号
    var bandNumData = publicHandler(yes, to, 'product_name', 'sale_num', null, null);
    drawPublicChart(bandNumData, 'brandNumChart', '成交订单量');

    var bandAmountData = publicHandler(yes, to, 'product_name', 'sale_amount', null, null);
    drawPublicChart(bandAmountData, 'brandAmountChart', '成交金额');

    //按照城市
    var cityNumData = publicHandler(yes, to, 'city_name', 'sale_num', null, null);
    drawPublicChart(cityNumData, 'cityNumChart', '成交订单量');

    var cityAmountData = publicHandler(yes, to, 'city_name', 'sale_amount', null, null);
    drawPublicChart(cityAmountData, 'cityAmountChart', '成交金额');

    //按照门店
    var storeNumData = publicHandler(yes, to, 'shop_name', 'sale_num', null, null);
    drawPublicChart(storeNumData, 'storeNumChart', '成交订单量');

    var storeAmountData = publicHandler(yes, to, 'shop_name', 'sale_amount', null, null);
    drawPublicChart(storeAmountData, 'storeAmountChart', '成交金额');

};

var drawTableBody = function (data) {
    var groupData = _.groupBy(data, 'city_name');
    var res = [];
    _.map(groupData, function(value, key) {
        res.push({
            "area_name" : value[0]['area_name'],
            "city_name" : key,
            "shop_cnt" : _.reduce(value, function(temp, obj) { return temp + accMul(obj['shop_cnt'], 1)}, 0),
            "saled_shop_cnt" : _.reduce(value, function(temp, obj) { return temp + accMul(obj['saled_shop_cnt'], 1)}, 0),
            "no_saled_shop_cnt" : _.reduce(value, function(temp, obj) { return temp + accMul(obj['no_saled_shop_cnt'], 1)}, 0),
            "saled_shop_rate" : accDiv(Math.round(accMul(accDiv(_.reduce(value, function(temp, obj) { return temp + accMul(obj['saled_shop_cnt'], 1)}, 0), _.reduce(value, function(temp, obj) { return temp + accMul(obj['shop_cnt'], 1)}, 0)),10000)),100) + "%",
            "shop_ab_cnt" : _.reduce(value, function(temp, obj) { return temp + accMul(obj['shop_ab_cnt'], 1)}, 0),
            "saled_shop_ab_cnt" : _.reduce(value, function(temp, obj) { return temp + accMul(obj['saled_shop_ab_cnt'], 1)}, 0)
        })
    });
    drawAreaTable(res);
};

var drawAreaTable = function(data) {
    $("#download").click(function() {
        requestURL(dataService+"/live/exportStoreList",{}).done(function(result) {
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
    $("#area_table").bootstrapTable('destroy').bootstrapTable({
        data: data,
        pagination: true,
        striped: true,
        pageSize: 10,
        search: true,
        pageList: [10],
        exportDataType:'all',
        columns:[
            {
                field:'area_name',
                title:'大区',
                sortable:true
            },
            {
                field:'city_name',
                title:'城市',
                sortable:true

            },
            {
                field:'shop_cnt',
                title:'总门店数',
                sortable:true
            },
            {
                field:'saled_shop_cnt',
                title:'成交门店数',
                sortable:true
            },
            {
                field:'no_saled_shop_cnt',
                title:'未成交门店数',
                sortable:true
            },
            {
                field:'saled_shop_rate',
                title:'成交门店占比',
                sortable:true
            },
            {
                field:'shop_ab_cnt',
                title:'AB级门店数',
                sortable:true

            },
            {
                field:'saled_shop_ab_cnt',
                title:'成交AB门店数',
                sortable:true
            }
        ]
    });
};
/**
 * 公共方法，传入初始数组，分组字段名， 统计当前字段名， 统计昨天字段名, 过滤字段名
 *
 */
var publicHandler = function(yes, to, groupName, countName, filterName, filterTarget) {
    var toCopy = [];
    var yesCopy = [];
    if(filterName != null) {
        toCopy = _.filter(to, function(obj) { return obj[filterName] == filterTarget });
        yesCopy = _.filter(yes, function(obj) { return obj[filterName] == filterTarget });
    } else {
        toCopy = to;
        yesCopy = yes;
    }
    var groupData = _.groupBy(toCopy, groupName);
    var tempList = [];
    _.map(groupData, function(value, key) {
        var current = _.reduce(value, function(temp, obj) { return temp + accMul(obj[countName], 1)}, 0);
        var last = _.reduce(_.filter(yesCopy, function(ele) { return ele[groupName] == key}), function(temp, obj) { return temp + accMul(obj[countName], 1)}, 0);
        var str = key + ":" + current.toLocaleString() + "(昨天:" + last.toLocaleString() + ")";
        tempList.push({k : str, v : current});
    });
    var res = {xLabels:[], barData:[]};
    var sortData = _.sortBy(tempList, function(obj) {
        return obj.v;
    });
    _.each(sortData, function(obj) {
        res.xLabels.push(obj.k);
        res.barData.push(obj.v);
    });
    return res;
};

function drawPublicChart(obj, chartId, seriesName) {
    //30 * 9  = 270
    //200
    //obj.xLabels.size = 62
    //
    //console.log(obj);
    var start = 70;
    if(obj.xLabels.length > 0 && obj.xLabels.length <= 5) {
        // 100 - 5 * 20   ( 5 * 4  (=2^2) )
        start = 0;
    } else if(obj.xLabels.length > 5 && obj.xLabels.length <= 10) {
        // 100 - 5 * 10   ((10 = size) * 1  (=2^0))
        start = 100 - (5 * (obj.xLabels.length * 1));
    } else if(obj.xLabels.length > 10 && obj.xLabels.length <= 20) {
        //100 - 5 * 5     ((20 = size) * 1/4 (=2^-2))
        start = 100 - (5 * (obj.xLabels.length * accDiv(0.5, 2)));
    } else if(obj.xLabels.length > 20 && obj.xLabels.length <= 40) {
        start = 100 - (5 * (obj.xLabels.length * accDiv(0.5, 4)));
    } else if(obj.xLabels.length > 40) {
        start = 100 - (5 * (obj.xLabels.length * accDiv(0.75, obj.xLabels.length)));
    }

    var option = {
        calculable: true,
        grid: {
            left:'0',
            right:'5%',
            bottom:'1%',
            top:'7%',
            containLabel:true
        },
        tooltip: {
            trigger: 'item',
            formatter:function(param) {
                return '' + param.name.split(":")[0] + ': ' + param.value.toLocaleString();
            }
        },
        dataZoom: [
            {
                show: true,
                yAxisIndex: 0,
                start: start,
                end: 100
            }
        ],
        yAxis: [
            {
                'type': 'category',
                'data': obj.xLabels
            }
        ],
        xAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: seriesName,
                type: 'bar',
                /*label: { normal: { show: true, position: 'right', formatter: '{b}' } },*/
                data: obj.barData,
                barWidth: '30',
                itemStyle: {
                    normal: {
                        color: function(params) {
                            var index = params.dataIndex;
                            var newColor = "";
                            var colorList = ['#3c8dbc','#ff9945','#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];
                            var alternateNumber = colorList.length;
                            if(index < alternateNumber) {
                                newColor = colorList[index];
                            } else {
                                var rowNumber = Math.floor(index / alternateNumber);
                                newColor = colorList[index - rowNumber * alternateNumber];
                            }
                            return newColor;
                        }
                    }
                }
            }
        ]
    };
    var chart = echarts.init(document.getElementById(chartId));
    chart.setOption(option, false, false);
    chart.resize();
    /*chart.on('click', function (handler,context){
        var objName = handler.name;
        var shopList = resMap[objName];
        customWarnModal('门店销售情况分析','myWarnModal','myWarnModalLabel',objName,shopList,'sale');
    });*/
    window.addEventListener('resize',chart.resize);

}


function drawPublicChartNoScroll(obj, chartId, seriesName) {
    var option = {
        calculable: true,
        grid: {
            left:'0',
            right:'5%',
            bottom:'1%',
            top:'7%',
            containLabel:true
        },
        tooltip: {
            trigger: 'item',
            formatter:function(param) {
                return '' + param.name.split(":")[0] + ': ' + param.value.toLocaleString();
            }
        },
        yAxis: [
            {
                'type': 'category',
                'data': obj.xLabels
            }
        ],
        xAxis: [
            {
                type: 'value'
            }
        ],
        series: [
            {
                name: seriesName,
                type: 'bar',
                /*label: { normal: { show: true, position: 'right', formatter: '{b}' } },*/
                data: obj.barData,
                barWidth: '30',
                itemStyle: {
                    normal: {
                        color: function(params) {
                            var index = params.dataIndex;
                            var newColor = "";
                            var colorList = ['#3c8dbc','#ff9945','#c23531', '#2f4554', '#61a0a8', '#d48265', '#91c7ae', '#749f83', '#ca8622', '#bda29a', '#6e7074', '#546570', '#c4ccd3'];
                            var alternateNumber = colorList.length;
                            if(index < alternateNumber) {
                                newColor = colorList[index];
                            } else {
                                var rowNumber = Math.floor(index / alternateNumber);
                                newColor = colorList[index - rowNumber * alternateNumber];
                            }
                            return newColor;
                        }
                    }
                }
            }
        ]
    };
    var chart = echarts.init(document.getElementById(chartId));
    chart.setOption(option, false, false);
    chart.resize();
    window.addEventListener('resize',chart.resize);
}

//top部分
var topModelList = ['currentSuccessNum','lastSuccessNum','currentSuccessAmount','lastSuccessAmount'];

//top部分加载动画
var setTopLoading = function() {
    _.each(topModelList,function(ele) {
        initPageToLoading(ele);
    });
};

var initPageToLoading = function(modelName) {
    $("#" + modelName + "LoadingPanel").show();
    $("#" + modelName + "Panel").hide();
};

var cancelLoading = function(modelName) {
    $("#" + modelName + "LoadingPanel").hide();
    $("#" + modelName + "Panel").show();
};


/**
 * 渲染复选框方法
 */
var drawPluralSelect = function(selector, data, containerId) {
    $(selector).selectpicker({
        selectAllText: '全选',
        deselectAllText:'取消全选',
        noneSelectedText: '全部',
        noneResultsText: '没有找到匹配的项'
    });
    var container = document.getElementById(containerId);
    container.options.length = 0;
    _.each(data, function(item) {
        container.options.add(new Option(item, item));
    });
    $(selector).selectpicker('refresh');
};

/**
 *
 * @param yes
 * @param to
 * @param filterName
 * @param countName
 * @returns {{x: string[], y: number[], z: number[]}}
 */
var getAreaData = function(yes, to, filterName, countName) {
    //x代表x轴，y代表 昨日，z代表 今日
    var res = {x:['华北大区','华东大区','华南大区','华西大区'], y:[0,0,0,0], z:[0,0,0,0]};

    //填充 昨天的数据
    if(yes.length > 0) {
        _.each(yes, function(ele) {
            if(ele[filterName].indexOf('华北大区') > -1) {
                res.y[0] += accMul(ele[countName],1);
            }
            if(ele[filterName].indexOf('华东大区') > -1) {
                res.y[1] += accMul(ele[countName],1);
            }
            if(ele[filterName].indexOf('华南大区') > -1) {
                res.y[2] += accMul(ele[countName],1);
            }
            if(ele[filterName].indexOf('华西大区') > -1) {
                res.y[3] += accMul(ele[countName],1);
            }
        });
    }

    //填充 今天的数据
    if(to.length > 0) {
        _.each(to, function(ele) {
            if(ele[filterName].indexOf('华北大区') > -1) {
                res.z[0] += accMul(ele[countName],1);
            }
            if(ele[filterName].indexOf('华东大区') > -1) {
                res.z[1] += accMul(ele[countName],1);
            }
            if(ele[filterName].indexOf('华南大区') > -1) {
                res.z[2] += accMul(ele[countName],1);
            }
            if(ele[filterName].indexOf('华西大区') > -1) {
                res.z[3] += accMul(ele[countName],1);
            }
        });
    }

    return res;
};


var drawAreaChart = function(data, chartId) {
    var option = {
        tooltip: {
            trigger: 'axis'
        },
        legend: {
            left: 'center',
            data: ['昨日','今日']
        },
        grid:{
            left:'0',
            right:'0',
            bottom:'1%',
            top:'12%',
            containLabel:true
        },
        xAxis: [
            {
                type: 'category',
                data: data.x
            }
        ],
        yAxis: [
            {
                type: 'value'
            },
            {
                type: 'value',
                axisLabel: {
                    formatter: '{value}'
                },
                min: -10
            }
        ],
        color:['#3c8dbc','#ff9945'],
        animationDuration: 2000,
        series: [
            {
                name: '昨日',
                type: 'bar',
                barWidth : 30,//柱图宽度
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        formatter: function(para) {
                            return (accMul(para.value,1)).toLocaleString();
                        }
                    }
                },
                data: data.y
            },
            {
                name: '今日',
                type: 'bar',
                barWidth : 30,//柱图宽度
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        formatter: function(para) {
                            return (accMul(para.value,1)).toLocaleString();
                        }
                    }
                },
                data: data.z
            }
        ]
    };
    var chart = echarts.init(document.getElementById(chartId));
    chart.setOption(option, false, false);
    chart.resize();
    window.addEventListener('resize',chart.resize);
};


