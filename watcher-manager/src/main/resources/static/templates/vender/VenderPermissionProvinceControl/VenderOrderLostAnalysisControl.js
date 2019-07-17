/**
 * Created by hsh on 2016/5/13.
 */
Template.VenderOrderLostAnalysisControl.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#VenderPermissionControl').addClass('active');
    $('#VenderOrderLostAnalysisControl').addClass('active');

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }

    var dateGap = -6;
    var minDate = "2016-09-01";
    var endDate = new Date().getNewDate(-1);
    var startDate = new Date(endDate).getNewDate(dateGap);

    $(".dateSelectLabel").html(startDate + "~" + endDate);
    $('.webTrafficFunnelDate').daterangepicker(datePickerOptionsFunc(startDate,endDate,minDate,false), pickWebTrafficFunnelDateRangeCallback);

    renderFilterOptions();
    //获取权限省份城市
    //var permissionArea=getPermissionArea();
    //permissionArea.done(function(ele){
    //    filter=getVenderCityPermission(ele.controlName);

        var dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g, "").split("~");
        var startDate = dt[0];
        var endDate = dt[1];
        var vender =[];
        var group=[];
        vender.push($(this).parent().find(".venderParentName").val());
        group.push($(this).parent().find(".venderGroupName").val());
        filter.startDate=startDate;
        filter.endDate=endDate;
        filter.vender_company_name=vender;
        filter.group=group;
        filter.userId = userId;
        filter=cleanParams(filter);
        renderPage(filter);

        $(".search").click(function () {
            var filter = getSelectedFilter();
            if(filter!="") {
                renderPage(filter);
            }
        });
    //})

    $(".exportVender").click(function() {
        var filter=getSelectedFilter();
        var query = _.clone(filter);

        $("#wholePage").mask({'label': "请等待，文件正在导出..."});
        requestURL(dataService + "/Vender/exportVenderPermissionControlOrderLostAnalysis", query).done(function (obj) {
            $("#wholePage").unmask();
            var url = Meteor.settings.public.downloadService.baseUrl + obj.fileName;
            var link = document.createElement("a");
            link.href = url;
            link.style = "visibility:hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    });

    //导出
    $(".exportVenderParent").click(function(e){
        var filter=getSelectedFilter();
        var query = _.clone(filter);

        $("#wholePage").mask({'label': "请等待，文件正在导出..."});
        requestURL(dataService + "/Vender/exportVenderParentPermissionControlOrderLostAnalysis", query).done(function (obj) {
            $("#wholePage").unmask();
            var url = Meteor.settings.public.downloadService.baseUrl + obj.fileName;
            var link = document.createElement("a");
            link.href = url;
            link.style = "visibility:hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    })

    $(".exportgroup").click(function(e){
        var filter=getSelectedFilter();
        var query = _.clone(filter);

        $("#wholePage").mask({'label': "请等待，文件正在导出..."});
        requestURL(dataService + "/Vender/exportVenderGroupPermissionControlOrderLostAnalysis", query).done(function (obj) {
            $("#wholePage").unmask();
            var url = Meteor.settings.public.downloadService.baseUrl + obj.fileName;
            var link = document.createElement("a");
            link.href = url;
            link.style = "visibility:hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    })

};

var filter={};
var userId = getUserId();
function renderOptions(sel,data){
    $(sel).empty();
    data.forEach(function(ele){
        $(sel).append("<option value='"+ele+"'>"+ele+"</option>")
    });
}

function pickWebTrafficFunnelDateRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.dateSelectLabel').html(sdt+"~"+edt);
    filter.userId = userId;
}

function pickWebTrafficFunnelWeekRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.weekSelectLabel').html(sdt+"~"+edt);
    filter.userId = userId;
}

function pickWebTrafficFunnelMonthRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.monthSelectLabel').html(sdt+"~"+edt);
    filter.userId = userId;
}

function renderFilterOptions(){
        /*级别*/
        $(".level").attr("multiple","multiple");

        renderOptions(".level",['T300','T1000','T4000']);

        $(".level").multipleSelect({
            placeholder: "全部",
//            selectAllText:"全部",
//            allSelected:true,
            width: 150,
            selectAll: false,
            filter: true
        });
}

function getPermissionArea(){
    //clean parameters
    var dfd = $.Deferred();
    var accountId = userId;
    requestURL(dataService+"/Vender/getProvinceNameJsonByAccountId", {"accountId":accountId}).done(function (ret) {
        dfd.resolve(ret)
    });
    return dfd.promise()
}

function cleanParams(filter){
    //clean parameters
    var query = _.clone(filter);
    query.userId = userId;
    for(var key in query){
        if(!query[key]&&key!="offset"){
            delete query[key]
        }
        if(query[key]==""){
            delete query[key]
        }
    }
    return query
}

function getSelectedFilter() {
    var dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g, "").split("~");
    var startDate = dt[0];
    var endDate = dt[1];
    if(getSomeDays(startDate,endDate)>31){
        alert("请选择不大于31天的数据！！！");
       return "";
    }

    var vender =[];
    var group=[];

    vender.push($(".venderParentName").val());
    group.push($(".venderGroupName").val());
    var level=$(".level").val();
    for(var k in level){
        if(level.hasOwnProperty(k)) {
            level[k]=level[k].substr(1);
        }
    }
    filter.startDate=startDate;
    filter.endDate=endDate;
    filter.vender_company_name=vender;
    filter.group=group;
    filter.level=level;
    filter.userId = userId;
    return cleanParams(filter);
}

function renderPage(filter){
    //var dateGap = -15;
    $("#orderLostCntChart").hide();
    $("#orderLostNumChart").hide();
    $("#chartContent").hide();
    $("#loading").show();
    $("#loadingChart").show();
    //var promise = getAggregateWebTrafficData(filter);
    //promise.done(function(ret){
    //    $("#chartContent").show();
    //    $("#loading").hide();
    //
    //    renderTable(filter,ret);
    //
    //});
    //$("#wholePage").mask({'label':"请等待，正在查询..."});
    var promise = getAllWebTrafficData(filter);
    promise.done(function(ret){
        $("#wholePage").unmask();
        $("#chartContent").show();
        $("#loadingChart").hide();

        $("#orderLostCntChart").show();
        $("#orderLostNumChart").show();

        getOrderLostCntChart(ret);
        getOrderLostNumChart(ret);

        $("#chartContent").show();
        $("#loading").hide();
        renderTable(filter,ret);
    });

}

function getAllWebTrafficData(filter){
    //clean parameters
    var query = _.clone(filter);
//    var flag = query["dateType"];
    var flag = $(".dateType").val();
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    query.userId = userId;
    var dfd = $.Deferred();
    requestURL(dataService+"/Vender/getVenderPermissionControlOrderLostDayAnalysis",query).done(function(ret){
        dfd.resolve(ret)
    });
    return dfd.promise()
}


function getVenderPermissionControlOrderLostAnalysis(filter){
    //clean parameters
    var query = _.clone(filter);
//    var flag = query["dateType"];
    var flag = $(".dateType").val();
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    query.userId = userId;
    var dfd = $.Deferred();
    requestURL(dataService+"/Vender/getVenderPermissionControlOrderLostAnalysis",query).done(function(ret){
        dfd.resolve(ret)
    });
    return dfd.promise()
}

function renderTable(filter,data) {
    var submitCnt= 0,submitNum= 0,inqueryCnt= 0,inqueryNum= 0,diffCnt= 0,diffNum=0;
    data.forEach(function(e){
        submitCnt+= parseInt(e.submitCnt);
        submitNum+= parseInt(e.submitNum);
        inqueryCnt+= parseInt(e.inqueryCnt);
        inqueryNum+= parseInt(e.inqueryNum);
        diffCnt+= parseInt(e.differCnt);
        diffNum+= parseInt(e.differNum);
    })
    var fixRow = '"<tr style="background-color: #acc087;"", " ", "", "", " data-index="0"", "", "", ">", "<td  style=""    >总计</td>", "<td  style=""    >-</td>","<td  style=""    >-</td>","<td  style=""    >-</td>","<td  style=""    >-</td>","<td  style=""    >-</td>","<td  style=""    >-</td>","<td  style=""    >-</td>","<td  style=""    >-</td>","<td  style=""    >-</td>","<td  style=""    >-</td>", "<td  style=""    >-</td>", "<td  style=""    >'+inqueryCnt+'</td>","<td style="">'+inqueryNum+'</td>", "<td  style=""    >'+submitCnt+'</td>", "<td  style=""    >'+submitNum+'</td>", "<td  style=""    >'+diffCnt+'</td>", "<td  style=""    >'+diffNum+'</td>"'
    var ajaxQuery = _.clone(filter);
    $("#BussinessDataTable").bootstrapTable('destroy').bootstrapTable({
        //exportDataType: 'all',
        pagination:true,
        sidePagination:'server',
        ajax:function(params){
            var ajaxParams = $.extend(ajaxQuery,params.data);
            //$("#ctable").hide();
            //console.log(ajaxParams)
            getVenderPermissionControlOrderLostAnalysis(ajaxParams).done(function(data){
                //$("#ctable").show();
                params.success(data)
            });
        },
        fixRow:fixRow,
        //cdataExport:"cdataExport",
        columns:[
            {
                field: 'vender_group_province_name',
                title: '总账户名称',
                sortable:true
            },
            {
                field: 'vender_group_province_key',
                title: '总账户id',
                sortable:true
            },
            {
                field: 'vender_province_name',
                title: '总账户省份',
                sortable:true
            },
            {
                field: 'vender_city_name',
                title: '总账户城市',
                sortable:true
            },
            {
                field: 'level',
                title: '总账户级别',
                sortable:true
            },
            {
                field: 'vender_group_name',
                title: '门店',
                sortable:true
            },
            {
                field: 'vender_group_key',
                title: '门店id',
                sortable:true
            },
            {
                field: 'vender_group_status_name',
                title: '门店状态',
                sortable:true
            },
            {
                field: 'vender_group_province_name1',
                title: '门店省份',
                sortable:true
            },
            {
                field: 'vender_group_city_name1',
                title: '门店城市',
                sortable:true
            },
            {
                field: 'vender_parent_name',
                title: '子账户',
                sortable:true
            },
            {
                field: 'vender_parent_key',
                title: '子账户id',
                sortable:true
            },
            {
                field: 'inqueryCnt',
                title: '累计询价次数（次）',
                sortable:true
            },
            {
                field: 'inqueryNum',
                title: '累计询价金额（元）',
                sortable:true
            },
            {
                field: 'submitCnt',
                title: '实际下单数量（台）',
                sortable:true
            },
            {
                field: 'submitNum',
                title: '实际下单金额（元）',
                sortable:true
            },
            {
                field: 'differCnt',
                title: '询价下单差异量（台）',
                sortable:true,
                formatter:function(value,row,index){
                    return (row.inqueryCnt-row.submitCnt)
                }
            },
            {
                field: 'differNum',
                title: '询价下单差异金额（元）',
                sortable:true,
                formatter:function(value,row,index){
                    return (row.inqueryNum-row.submitNum)
                }
            }
        ]
    });

}

//飞单个数折线图
function getOrderLostCntChart(data){

    var dateList=[];
    var series={
        inqueryCnt:[],
        submitCnt:[]
    }
    data.forEach(function (e) {
        dateList.push(e.vender_group_name);
        series.inqueryCnt.push(e.inqueryCnt);
        series.submitCnt.push(e.submitCnt);
    });
    dateList= _.uniq(dateList);

    var option = {
        title: {
            text: '单量对比',
            //top: '80%',
            left: 'center',

        },
        tooltip: {
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
            }
        },
        legend: {
            data: ["询价次数","下单数量"],
            padding:[50,0,0,0]
        },
        calculable: true,
        grid: {
            top: 80,
            bottom: 100
        },
        xAxis: [
            {
                'type': 'category',
                'data': dateList
            }
        ],
        yAxis: [
            {
                type: 'value',
                name:'订单数(台)'
            }
        ],
        series: [
            {
                name: '询价次数',
                type: 'line',
                label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                data: series.inqueryCnt
            },
            {
                name: '下单数量',
                type: 'line',
                label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                data: series.submitCnt
            }
        ]
    };

    var venderTradeTrendMixedChart = echarts.init(document.getElementById('orderLostCntChart'));
    venderTradeTrendMixedChart.setOption(option);
    window.addEventListener('resize', venderTradeTrendMixedChart.resize)

}

//飞单金额折线图
function getOrderLostNumChart(data){

    var dateList=[];
    var series={
        inqueryNum:[],
        submitNum:[]
    }
    data.forEach(function (e) {
        dateList.push(e.vender_group_name);
        series.inqueryNum.push(e.inqueryNum);
        series.submitNum.push(e.submitNum);
    });
    dateList= _.uniq(dateList);

    var option = {
        title: {
            text: '金额对比',
            //top: '80%',
            left: 'center',

        },
        tooltip: {
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
            }
        },
        legend: {
            data: ["询价金额","下单金额"],
            padding:[50,0,0,0]
        },
        calculable: true,
        grid: {
            top: 80,
            bottom: 100
        },
        xAxis: [
            {
                'type': 'category',
                'data': dateList
            }
        ],
        yAxis: [
            {
                type: 'value',
                name:'订单金额(万元)'
            }
        ],
        series: [
            {
                name: '询价金额',
                type: 'line',
                label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                data: series.inqueryNum
            },
            {
                name: '下单金额',
                type: 'line',
                label: {normal: {show: true, position: 'top', formatter: '{c}'}},
                data: series.submitNum
            }
        ]
    };

    var venderTradeTrendMixedChart = echarts.init(document.getElementById('orderLostNumChart'));
    venderTradeTrendMixedChart.setOption(option);
    window.addEventListener('resize', venderTradeTrendMixedChart.resize)

}