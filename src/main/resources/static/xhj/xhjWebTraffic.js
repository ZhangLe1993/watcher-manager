
Template.xhjWebTrafficMonitor.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#AzpTab').addClass('active');
    $('#xhjWebTrafficTab').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var dateGap = -14;

    var endDate = new Date().getNewDate(-1);
    var startDate = new Date(endDate).getNewDate(dateGap);
    $(".selectLabel").html(startDate+"~"+endDate);
    $('.datePicker').daterangepicker(datePickerOptionsFunc(startDate,endDate,"2017-01-01"), pickDateRangeCallback);


    renderFilterOptions();
    renderPage({"startDate":startDate,"endDate":endDate})

    $(".search").click(function(){
        var query = getSelectedFilter()
        renderPage(query)
    })


};


function getSelectedFilter(){
    var dt = $('.selectLabel').text().replace(/ /g,"").split("~");
    var filter = {
        "startDate":dt[0],
        "endDate":dt[1],
        "areaName":$(".areaName").val(),
        "cityName":$(".cityName").val(),
        "platform":$(".platform").val(),
        "channel":$(".channel").val(),
        "source":$(".source").val(),
        "medium":$(".medium").val(),
        "campaign":$(".campaign").val()
    }
    return cleanParams(filter)
}


function pickDateRangeCallback(start, end, label) {
    console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.selectLabel').html(sdt+"~"+edt);
}

function renderPage(query){
    $("#chartContent").hide();
    $("#loading").show();
    requestURLPost(dataService+"/xhj/getDailyAggregateWebTraffic",query).done(function(data){
        $("#chartContent").show();
        $("#loading").hide();
        drawTrafficChart(data)
    });
    drawTable(query)
}


function  getXHJWebTraffic(filter){
    var query = cleanParams(_.clone(filter));
    var dfd = $.Deferred();
    requestURLPost(dataService+"/xhj/getWebTrafficData",query).done(function(ret){
        dfd.resolve(ret)
    });
    return dfd.promise()
}

function drawTable(filter){
    $('#xhjWebTrafficDataTable').bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        pagination: true,
        sidePagination: 'server',
        ajax:function(params){
            var ajaxParams = $.extend(filter,params.data);
            getXHJWebTraffic(ajaxParams).done(function(data){
                //
                params.success(data)
            });
        },
        cdataExport:"cdataExport",
        columns: [{
            field: 'date',
            title: '日期',
            sortable:true
        }, {
            field: 'cityName',
            title: '城市',
            sortable:true
        }, {
            field: 'platform',
            title: '平台',
            sortable:true
        }, {
            field: 'channel',
            title: '渠道',
            sortable:true
        }, {
            field: 'source',
            title: 'source',
            sortable:true
        }, {
            field: 'medium',
            title: 'medium',
            sortable:true
        }, {
            field: 'campaign',
            title: 'campaign',
            sortable:true
        }, {
            field: 'uv',
            title: '总访客数',
            sortable:true
        }, {
            field: 'product_list_uv',
            title: '列表页访客数',
            sortable:true
        }, {
            field: 'product_detail_uv',
            title: '商品详情页访客数',
            sortable:true
        }, {
            field: 'credit_evaluate_uv',
            title: '芝麻授权页访客数',
            sortable:true
        }, {
            field: 'confirm_order_uv',
            title: '确认订单页访客数',
            sortable:true
        }, {
            field: 'pay_page_uv',
            title: '支付页访客数',
            sortable:true
        }, {
            field: 'pay_success_uv',
            title: '支付完成页访客数',
            sortable:true
        },{
            field: 'trade_create_no',
            title: '提交订单数',
            sortable:true
        }, {
            field: 'trade_success_cnt',
            title: '支付成功订单数',
            sortable:true
        }],
    });

    $("#cdataExport").click(function(){
        var query = _.clone(filter);
        var sdt = moment(query.startDate);
        var edt = moment(query.endDate);
        var dflag = sdt.add(1,'month')<=edt;
        if(dflag){
            alert("导出文件最长间隔时间为1个月!");
            return;
        }
        $("#wholePage").mask({'label':"请等待，文件正在导出..."});
        requestURLPost(dataService+"/xhj/exportWebTrafficData",query).done(function(obj){
            $("#wholePage").unmask();
            var url = Meteor.settings.public.downloadService.baseUrl+obj.fileName;
            var link = document.createElement("a");
            link.href = url;
            link.style = "visibility:hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });

    });
}

//趋势图
function drawTrafficChart(data){
    var obj = {
        dateList:[],
        uv:[],
        product_list_uv:[],
        product_detail_uv:[],
        credit_evaluate_uv:[],
        confirm_order_uv:[],
        pay_page_uv:[],
        pay_success_uv:[],
        trade_create_no:[],
        trade_success_cnt:[],

        product_detail_uv_rate:[],
        credit_evaluate_uv_rate:[],
        confirm_order_uv_rate:[],
        pay_page_uv_rate:[],
        pay_success_uv_rate:[]

    };
    data.forEach(function(tmp){
        obj.dateList.push(tmp.date);
        obj.uv.push(tmp.uv);

        obj.product_list_uv.push(tmp.product_list_uv)
        obj.product_detail_uv.push(tmp.product_detail_uv);
        var var_visit_product_uv_rate=(100*tmp.product_detail_uv/tmp.uv).toFixed(2)
        obj.product_detail_uv_rate.push(isFinite(var_visit_product_uv_rate)?var_visit_product_uv_rate:undefined)


        obj.credit_evaluate_uv.push(tmp.credit_evaluate_uv);
        var var_credit_evaluate_uv_rate = (100*tmp.credit_evaluate_uv/tmp.product_detail_uv).toFixed(2)
        obj.credit_evaluate_uv_rate.push(isFinite(var_credit_evaluate_uv_rate)?var_credit_evaluate_uv_rate:undefined)

        obj.confirm_order_uv.push(tmp.confirm_order_uv);
        var var_fill_info_uv_rate=(100*tmp.confirm_order_uv/tmp.credit_evaluate_uv).toFixed(2)
        obj.confirm_order_uv_rate.push(isFinite(var_fill_info_uv_rate)?var_fill_info_uv_rate:undefined)

        obj.pay_page_uv.push(tmp.pay_page_uv);
        var var_rent_auth_uv_rate=(100*tmp.pay_page_uv/tmp.confirm_order_uv).toFixed(2)
        obj.pay_page_uv_rate.push(isFinite(var_rent_auth_uv_rate)?var_rent_auth_uv_rate:undefined)

        obj.pay_success_uv.push(tmp.pay_success_uv);
        var var_pay_rent_uv_rate=(100*tmp.pay_success_uv/tmp.pay_page_uv).toFixed(2)
        obj.pay_success_uv_rate.push(isFinite(var_pay_rent_uv_rate)?var_pay_rent_uv_rate:undefined)
        obj.trade_create_no.push(tmp.trade_create_no);
        obj.trade_success_cnt.push(tmp.trade_success_cnt);
    });

    var len = data.length;
    var tmp = data[len-1];
    var lastObj = {};
    lastObj.dateList=(tmp.date);
    lastObj.uv=(tmp.uv);
    lastObj.product_list_uv=(tmp.product_list_uv);
    lastObj.product_detail_uv=(tmp.product_detail_uv);
    lastObj.product_detail_uv_rate=((100*tmp.product_detail_uv/tmp.uv).toFixed(2))
    lastObj.credit_evaluate_uv=(tmp.credit_evaluate_uv);
    lastObj.credit_evaluate_uv_rate=((100*tmp.credit_evaluate_uv/tmp.product_detail_uv).toFixed(2))
    lastObj.confirm_order_uv=(tmp.confirm_order_uv);
    lastObj.confirm_order_uv_rate=((100*tmp.confirm_order_uv/tmp.credit_evaluate_uv).toFixed(2))
    lastObj.pay_page_uv=(tmp.pay_page_uv);
    lastObj.pay_page_uv_rate=((100*tmp.pay_page_uv/tmp.confirm_order_uv).toFixed(2))
    lastObj.trade_create_no=(tmp.trade_create_no);
    lastObj.trade_success_cnt=(tmp.trade_success_cnt)
    lastObj.pay_success_uv=(tmp.pay_success_uv);
    lastObj.pay_success_uv_rate=((100*tmp.pay_success_uv/tmp.pay_page_uv).toFixed(2))


    var yAxis = [
        '总访客数',
        '列表页访客数',
        "商品详情页访问率:"+lastObj.product_detail_uv_rate + '%\n商品详情页访客数',
        "芝麻授权页访问率:"+lastObj.credit_evaluate_uv_rate + '%\n芝麻授权页访客数',
        "确认订单页访问率:"+lastObj.confirm_order_uv_rate + '%\n确认订单页访客数',
        "支付页访问率:"+lastObj.pay_page_uv_rate + '%\n支付页访客数',
        "支付完成页访问率:"+lastObj.pay_success_uv_rate + '%\n支付完成页访客数',
        "提交订单数",
        "完成订单数"
        ].reverse();

    var option = {
        title: {
            text: '流量漏斗('+lastObj.dateList+")",
            x: "center",
            //y: "bottom"
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        grid: {
            show: false,
            left: '3%',
            right: '4%',
            containLabel: true
        },
        xAxis: [
            {
                type: 'value', show: false
            }
        ],
        yAxis: [
            {
                type: 'category',
                data: yAxis,
                splitLine: {
                    show: true
                }
            }
        ],
        series: [
            {
                name: '',
                type: 'bar',
                itemStyle: {normal: {color: '#568FC8', label: {show: true, position: 'right', color: '#568FC8'}}},
                data: [lastObj.uv,lastObj.product_list_uv,lastObj.product_detail_uv,lastObj.credit_evaluate_uv,lastObj.confirm_order_uv,lastObj.pay_page_uv,lastObj.pay_success_uv,lastObj.trade_create_no,lastObj.trade_success_cnt].reverse()
            }
        ]
    };
    var trafficFunnelChart = echarts.init(document.getElementById('trafficFunnelChart'));
    trafficFunnelChart.setOption(option);
    window.addEventListener('resize',trafficFunnelChart.resize)

    var option1 = {
        title: {
            text: '流量趋势图',
            x: "center",
            padding:[0,0,0,50]
        },
        tooltip: {
            trigger: 'axis',

        },
        legend: {
            data:['总访客数', '列表页访客数','商品详情页访客数',"芝麻授权页访客数","确认订单页访客数","支付页访客数","支付完成页访客数","支付成功订单数","提交订单数","完成订单数"],
            padding: [25,0,0,0],
        },
        xAxis: [
            {
                type: 'category',
                data: obj.dateList
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel:{
                    formatter: '{value}'
                }
            },
            {
                type: 'value',
            }
        ],
        series: [
            {
                name: '总访客数',
                type: 'line',
                yAxisIndex: 0,
                data: obj.uv
            },
            {
                name: '列表页访客数',
                type: 'line',
                yAxisIndex: 0,
                data: obj.product_list_uv
            },
            {
                name: '商品详情页访客数',
                type: 'line',
                yAxisIndex: 0,
                data: obj.product_detail_uv
            },
            {
                name: '芝麻授权页访客数',
                type: 'line',
                yAxisIndex: 0,
                data: obj.credit_evaluate_uv
            },
            {
                name: '确认订单页访客数',
                type: 'line',
                yAxisIndex: 1,
                data: obj.confirm_order_uv
            },
            {
                name: '支付页访客数',
                type: 'line',
                yAxisIndex: 1,
                data: obj.pay_page_uv
            },
            {
                name: '支付完成页访客数',
                type: 'line',
                yAxisIndex: 1,
                data: obj.pay_success_uv
            },
            {
                name: '提交订单数',
                type: 'line',
                yAxisIndex: 1,
                data: obj.trade_create_no
            },
            {
                name:'支付成功订单数',
                type:'line',
                yAxisIndex:1,
                data:obj.trade_success_cnt
            }
        ]
    };
    var trafficTrendChart = echarts.init(document.getElementById('trafficTrendChart'));
    trafficTrendChart.setOption(option1);
    window.addEventListener('resize',trafficTrendChart.resize)


    var option2 = {
        title: {
            text: '流量各转化率趋势图',
            x: "center",
            padding:[0,0,0,50]
        },
        tooltip: {
            trigger: 'axis',
            formatter:function(params){
                var str = params[0].name + '<br/>';
                params.forEach(function(obj){
                    str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                });
                return str;
            }
        },
        legend: {
            data:['商品详情页访问率',"芝麻授权页访问率","确认订单页访问率","支付页访问率","支付完成页访问率"],
            padding: [25,0,0,0],
        },
        xAxis: [
            {
                type: 'category',
                data: obj.dateList
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel:{
                    formatter: '{value}%'
                }
            }

        ],
        series: [

            {
                name: '商品详情页访问率',
                type: 'line',
                yAxisIndex: 0,
                data: obj.product_detail_uv_rate
            },
            {
                name: '芝麻授权页访问率',
                type: 'line',
                yAxisIndex: 0,
                data: obj.credit_evaluate_uv_rate
            },
            {
                name: '确认订单页访问率',
                type: 'line',
                yAxisIndex: 0,
                data: obj.confirm_order_uv_rate
            },
            {
                name: '支付页访问率',
                type: 'line',
                yAxisIndex: 0,
                data: obj.pay_page_uv_rate
            },
            {
                name: '支付完成页访问率',
                type: 'line',
                yAxisIndex: 0,
                data: obj.pay_success_uv_rate
            }
        ]
    };
    var trafficRatioChart = echarts.init(document.getElementById('trafficRatioChart'));
    trafficRatioChart.setOption(option2);
    window.addEventListener('resize',trafficRatioChart.resize)
}

function getFilterOptions(){
    var dfd = $.Deferred();
    requestURL(dataService+"/xhj/getXHJOptions",{}).done(function(ret){
        dfd.resolve(ret)
    });
    return dfd.promise()
}

function renderFilterOptions(){
    var promise = getFilterOptions();
    promise.done(function(data){

        $(".cityName").attr("multiple","multiple");
        $(".platform").attr("multiple","multiple");
        $(".channel").attr("multiple","multiple");
        $(".source").attr("multiple","multiple");
        $(".medium").attr("multiple","multiple");
        $(".campaign").attr("multiple","multiple");
        $(".areaName").attr("multiple","multiple");
        renderOptions(".cityName",data.cityName);
        renderOptions(".platform",data.platform);
        renderOptions(".channel",data.channel);
        renderOptions(".source",data.source);
        renderOptions(".medium",data.medium);
        renderOptions(".campaign",data.campaign);
        renderOptions(".areaName",["物流","华北大区","华东大区","华南大区","华西大区"]);

        $(".areaName").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false
        });

        $(".cityName").multipleSelect({
            placeholder: "全部",
            selectAllText:"全选",
            width: 150,
            selectAll: true,
            filter: true
        });
        $(".platform").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false
        });
        $(".channel").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false
        });
        $(".source").multipleSelect({
            placeholder: "全部",
            selectAllText:"全选",
            width: 150,
            selectAll: true,
            filter: true
        });
        $(".medium").multipleSelect({
            placeholder: "全部",
            selectAllText:"全选",
            width: 150,
            selectAll: true,
            filter: true
        });
        $(".campaign").multipleSelect({
            placeholder: "全部",
            selectAllText:"全选",
            width: 150,
            selectAll: true,
            filter: true
        })

    })
}

function renderOptions(sel,data){
    $(sel).empty();
    data.forEach(function(ele){
        $(sel).append("<option value='"+ele+"'>"+ele+"</option>")
    });
}
