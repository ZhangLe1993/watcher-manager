Template.DoorOfBrainpower.rendered = function () {

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;

    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
        $("#tips").hide()
    }
    $("#content_all").hide()
    $("#loading").show()


    /*var from = Template.currentData().from;
    switch(from){
        case "1":
            $("#controller").attr("class","content");
            break;
        case "2":
            $("#controller").attr("class","content-wrapper");
            $('.navi-tab').removeClass('active');
            $('#district').addClass('active');
            $('#intelligenceShopArea').addClass('active');
            break;
    }*/


    var dateGap = -14;
    var minWeekDate = "2016-07-03";
    var minMonthDate = "2016-07-01";
    var endDate = new Date().getNewDate(-1);
    var startDate = new Date(endDate).getNewDate(dateGap);
    var startWeekDate = moment().weekday(-14).format("YYYY-MM-DD");
    var endWeekDate = moment().weekday(-7).format("YYYY-MM-DD");
    if (startWeekDate < minWeekDate) {
        startWeekDate = minWeekDate;
    }
    var startMonthDate = moment().subtract(1, 'month').startOf('month').format("YYYY-MM-DD");
    var endMonthDate = moment().subtract(1, 'month').startOf('month').format("YYYY-MM-DD");
    if (startMonthDate < minMonthDate) {
        startMonthDate = minMonthDate;
    }

    $(".dateSelectLabel").html(startDate + "~" + endDate);
    $('.dateRange').daterangepicker(datePickerOptionsFunc(startDate,endDate,'2017-02-26',false), pickWebTrafficFunnelDateRangeCallback);

    $(".startWeekDateSelectLabel").html(startWeekDate + "~" + endWeekDate);
    $('.marketingWeeklyStartDatePicker').daterangepicker(weekDatePickerOptionsFunc(startWeekDate, endWeekDate, minWeekDate, false), pickStartWeekDateRangeCallback);

    $(".startMonthDateSelectLabel").html(startMonthDate + "~" + endMonthDate);
    $('.marketingMonthlyStartDatePicker').daterangepicker(monthDatePickerOptionsFunc(startMonthDate, endMonthDate, minMonthDate, false), pickStartMonthlyDateRangeCallback);

    $(".startFinanceMonthDateSelectLabel").html(startMonthDate + "~" + endMonthDate);
    $('.marketingFinanceMonthlyStartDatePicker').daterangepicker(monthDatePickerOptionsFunc(startMonthDate, endMonthDate, minMonthDate, false), pickStartFinanceMonthlyDateRangeCallback);

    $(".daily").show();
    $(".weekly").hide();
    $(".monthly").hide();
    $(".financeMonthly").hide();
    $(".dateType").change(function (){
        var type = $(this).val()
        if (type == 'day') {
            $(".daily").show();
            $(".weekly").hide();
            $(".monthly").hide();
            $(".financeMonthly").hide();
        } else if (type == 'weekly'){
            $(".daily").hide()
            $(".weekly").show()
            $(".monthly").hide();
            $(".financeMonthly").hide();
        }else if(type=='monthly'){
            $(".daily").hide()
            $(".weekly").hide()
            $(".monthly").show();
            $(".financeMonthly").hide();
        }else if(type=='financeMonthly'){
            $(".daily").hide()
            $(".weekly").hide()
            $(".monthly").hide();
            $(".financeMonthly").show();
        }

    })
    renderFilterOptions();

    $(".search").click(function () {
        $("#content_all").hide()
        $("#loading").show()
        renderPage()
    })

    $("#MoneyxAxis").change(function () {
        renderEcharts(dataAll, $(this).val())
    })

    $("#piexAxis").change(function () {
        renderPieEcharts(dataPie, $(this).val())
    })

    renderPage();
};
var dataAll,dataPie;
var arr=['trade_order_area_name','city_name','director_name','shop_name','observer_account_user_name'];


function renderPage() {
    var type=$('.dateType').val();
    if (type == 'day') {
        var query = {
            "date": $(".dateSelectLabel").text(),
            "orderType": $(".orderType").val(),
            "tradeType": $(".tradeType").val(),
            "regionName": $(".regionName").val(),
            "cityName": $(".cityName").val(),
            "directorName": $(".directorName").val(),
            "shopName": $(".shopName").val(),
            "school": $(".school").val(),
        };
        requestURL(dataService + "/region/doorOfBrainpowerData_day", query).done(function (data) {
            $("#content_all").show()
            $("#loading").hide()

            dataAll = data
            dataPie=data
            renderLineEcharts(dataAll, 'date')
            renderEcharts(dataAll,  $("#MoneyxAxis").val())
            renderPieEcharts(dataAll, $("#piexAxis").val())
            renderTable(dataAll)
        })
    }else if(type== 'weekly'){

        var query = {
            "date": $(".startWeekDateSelectLabel").text(),
            "orderType": $(".orderType").val(),
            "tradeType": $(".tradeType").val(),
            "regionName": $(".regionName").val(),
            "cityName": $(".cityName").val(),
            "directorName": $(".directorName").val(),
            "shopName": $(".shopName").val(),
            "school": $(".school").val(),
        };
        requestURL(dataService + "/region/doorOfBrainpowerData_week", query).done(function (data) {
            $("#content_all").show()
            $("#loading").hide()
            dataAll = data
            dataPie=data
            renderLineEcharts(dataAll, 'date')
            renderEcharts(dataAll, $("#MoneyxAxis").val())
            renderPieEcharts(dataAll, $("#piexAxis").val())
            renderTable(dataAll)
        })
    }else if(type=='monthly'){
        var query = {
            "date": $(".startMonthDateSelectLabel").text(),
            "orderType": $(".orderType").val(),
            "tradeType": $(".tradeType").val(),
            "regionName": $(".regionName").val(),
            "cityName": $(".cityName").val(),
            "directorName": $(".directorName").val(),
            "shopName": $(".shopName").val(),
            "school": $(".school").val(),
        };
        requestURL(dataService + "/region/doorOfBrainpowerData_monthly", query).done(function (data) {
            $("#content_all").show()
            $("#loading").hide()
            dataAll = data
            dataPie=data
            renderLineEcharts(dataAll, 'date')
            renderEcharts(dataAll, $("#MoneyxAxis").val())
            renderPieEcharts(dataAll, $("#piexAxis").val())
            renderTable(dataAll)
        })
    }

}

//---------------------------------------------------

function formatData(data, inp,sortBy) {
    var xData = [];
    var countData = [];
    var amountData = [];
    var unitPriceData = [];
    var monusAmountData = [];
    var actual_amountData = [];
    var pieData = [];
    var sortByList=[];
    var sd = _.groupBy(data, function (obj) {
        return obj[inp]
    })
    for (var key in sd) {
        var count = 0;
        var amount = 0;
        var unitPrice = 0;
        var monusAmount = 0;
        var actual_amount = 0;
        sd[key].forEach(function (e) {

            count += parseInt(e.count)
            amount += parseInt(e.amount)
            unitPrice += parseFloat(e.unit_price) * parseInt(e.count)
            monusAmount += parseInt(e.amount) - parseFloat(e.minus_promotion_amount)
            actual_amount += parseFloat(e.actual_amount)// * parseInt(e.count)

        })
        if (count != 0) {
            unitPrice = parseInt(unitPrice / count);
            //actual_amount = parseInt(actual_amount / count);
        }
        /*xData.push(key);
        countData.push(count)
        amountData.push(amount)
        unitPriceData.push(unitPrice)
        monusAmountData.push(monusAmount)
        actual_amountData.push(actual_amount)*/
        var sortObj={
            'xData':key,
            'countData':count,
            'amountData':amount,
            'unitPriceData':unitPrice,
            'monusAmountData':monusAmount,
            'actual_amountData':actual_amount
        }
        sortByList.push(sortObj)
        var pieObj = {
            "name": key,
            "value": amount
        }
        pieData.push(pieObj);

    }

    var sortLs=sortByList;

    if(sortBy!=null){
        sortLs= _.sortBy(sortByList,sortBy);
    }
    sortLs.forEach(function(e){
        xData.push(e.xData)
        countData.push(e.countData)
        amountData.push(e.amountData)
        unitPriceData.push(e.unitPriceData)
        monusAmountData.push(e.monusAmountData)
        actual_amountData.push(e.actual_amountData)

    })


    var op = {
        "xData": xData,
        "countData": countData,
        "amountData": amountData,
        "unitPriceData": unitPriceData,
        "monusAmountData": monusAmountData,
        "actual_amountData": actual_amountData,
        "pieData": pieData
    }

    return op;

}

function pickWebTrafficFunnelDateRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.dateSelectLabel').html(sdt + "~" + edt);
}
function pickStartWeekDateRangeCallback(start, end, label) {
    console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.startWeekDateSelectLabel').html(sdt + "~" + edt);
}
function pickStartMonthlyDateRangeCallback(start, end, label) {
    console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.startMonthDateSelectLabel').html(sdt + "~" + edt);
}
function pickStartFinanceMonthlyDateRangeCallback(start, end, label) {
    console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.startFinanceMonthDateSelectLabel').html(sdt + "~" + edt);
}



function getFilterOptions() {
    var dfd = $.Deferred();
    requestURL(dataService + "/region/doorOfBrainpowerOption", {}).done(function (ret) {
        dfd.resolve(ret)
    });
    return dfd.promise()
}

function renderFilterOptions() {
    var promise = getFilterOptions();
    promise.done(function (data) {

        $("#content_all").show()
        $("#loading").hide()
        $(".orderType,.tradeType,.cityName,.directorName,.regionName,.shopName,.school").attr("multiple", "multiple");

        renderOptions(".orderType", data.tradeType);
        renderOptions(".tradeType", data.tradeMethodName);
        renderOptions(".cityName", data.cityName);
        renderOptions(".regionName", ["华北大区", "华东大区", "华南大区", "华西大区"]);
        renderOptions(".school", ["是", "否"]);
        renderOptions(".directorName", data.directorName);
        renderOptions(".shopName", data.shopName);


        $(".orderType,.tradeType,.cityName,.directorName,.regionName,.shopName,.school").multipleSelect({
            placeholder: "全部",
            selectAllText: "全选",
            width: 150,
            selectAll: true,
            filter: true
        });
    })
}

function renderOptions(sel, data) {
    $(sel).empty();
    data.forEach(function (ele) {
        $(sel).append("<option value='" + ele + "'>" + ele + "</option>")
    });

}

function renderPieEcharts(data, columnName) {

    var op = formatData(data, columnName,null)

    var option = {
        title: {
            text: '成交金额占比图',
            x: 'right'
        },
        tooltip: {
            trigger: 'item',
            formatter: "{a} <br/>{b} : {c} ({d}%)"
        },
        legend: {
            orient: 'vertical',
            left: 'left',
            data: op.xData
        },
        series: [
            {
                name: '',
                type: 'pie',
                radius: '80%',
                center: ['50%', '60%'],
                data: op.pieData,
                itemStyle: {
                    emphasis: {
                        shadowBlur: 10,
                        shadowOffsetX: 0,
                        shadowColor: 'rgba(0, 0, 0, 0.5)'
                    }
                }
            }
        ]
    };
    var uvchart = echarts.init(document.getElementById('pieEcharts'));
    uvchart.setOption(option);
    window.addEventListener('resize', uvchart.resize)
}

function renderLineEcharts(data, columnName) {

    var op = formatData(data, columnName,'xData')
    var option = {
        title: "",
        tooltip: {
            trigger: 'axis',
            /*axisPointer: {
             type: 'shadow'
             },*/
            formatter: function (params, ticket, callback) {
                var str = params[0].name + '<br/>';
                params.forEach(function (obj) {
                    str += obj.seriesName + ' : ' + obj.value.toLocaleString() + '<br/>'
                });
                return str;
            }
        },
        legend: {
            data: ['成交量', '成交金额', '客单价', '优惠金额', '业绩金额'],
            selected:{
                '成交量':false,
                '客单价':false,
                '优惠金额':false,
                '业绩金额':false
            }
        },
        xAxis: {
            type: 'category',
            data: op.xData,
            axisTick: {
                alignWithLabel: true
            },
            /*axisLabel:{
             interval:0,
             rotate:45,
             margin:4
             }*/

        },
        /*grid:{
         bottom:'10%'
         },*/
        dataZoom: {
            /*start:1,
             end:30*/
        },
        yAxis: {
            type: 'value'
        },
        series: [
            {
                name: '成交量',
                type: 'line',
                data: op.countData,

            },
            {
                name: '成交金额',
                type: 'line',
                data: op.amountData
            },
            {
                name: '客单价',
                type: 'line',
                data: op.unitPriceData
            },
            {
                name: '优惠金额',
                type: 'line',
                data: op.monusAmountData
            },
            {
                name: '业绩金额',
                type: 'line',
                data: op.actual_amountData
            }
        ]
    };
    var uvchart = echarts.init(document.getElementById('lineEcharts'));
    uvchart.setOption(option);
    window.addEventListener('resize', uvchart.resize)
}

function renderEcharts(data, columnName) {

    var op = formatData(data, columnName,'amountData')
    var option = {
        title: "",
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            },
            formatter: function (params, ticket, callback) {
                var str = params[0].name + '<br/>';
                params.forEach(function (obj) {
                    str += obj.seriesName + ' : ' + obj.value.toLocaleString() + '<br/>'
                });
                return str;
            }
        },
        legend: {
            data: ['成交量', '成交金额', '客单价', '优惠金额', '业绩金额'],
            selected:{
                '成交量':false,
                '客单价':false,
                '优惠金额':false,
                '业绩金额':false
            }
        },
        grid:{
            left:'16%'
        },
        xAxis: {
            type: 'value'
        },
        dataZoom: {
            type: 'slider',
            startValue: op.xData.length-20,
            endValue: op.xData.length,
            yAxisIndex: [0]
        },
        yAxis: {
            type: 'category',
            data: op.xData,
            axisTick: {
                alignWithLabel: true
            },
            axisLabel: {
                interval: 0,
                //rotate: 45,
                margin: 4
            }
        },
        series: [
            {
                name: '成交量',
                type: 'bar',
                data: op.countData,
                label: {
                    normal: {
                        show: true,
                        position: 'right',
                        formatter: function (params) {

                            return params.value.toLocaleString()
                        }
                    }
                }

            },
            {
                name: '成交金额',
                type: 'bar',
                data: op.amountData,
                label: {
                    normal: {
                        show: true,
                        position: 'right',
                        formatter: function (params) {

                            return params.value.toLocaleString()
                        }
                    }
                }
            },
            {
                name: '客单价',
                type: 'bar',
                data: op.unitPriceData,
                label: {
                    normal: {
                        show: true,
                        position: 'right',
                        formatter: function (params) {

                            return params.value.toLocaleString()
                        }
                    }
                }
            },
            {
                name: '优惠金额',
                type: 'bar',
                data: op.monusAmountData,
                label: {
                    normal: {
                        show: true,
                        position: 'right',
                        formatter: function (params) {

                            return params.value.toLocaleString()
                        }
                    }
                }
            },
            {
                name: '业绩金额',
                type: 'bar',
                data: op.actual_amountData,
                label: {
                    normal: {
                        show: true,
                        position: 'right',
                        formatter: function (params) {

                            return params.value.toLocaleString()
                        }
                    }
                }
            }
        ]
    };
    var uvchart = echarts.init(document.getElementById('amountEcharts'));
    uvchart.setOption(option);
    window.addEventListener('resize', uvchart.resize)
    uvchart.on('click',function(params){
        //console.log(params.name)
        var legName=$("#MoneyxAxis").val();
        var index=arr.indexOf(legName);
        if(index<4){
            index+=1;
        }
        /*console.log(arr.indexOf(legName)+"------>"+legName)
        console.log(arr[index])*/
        var data= _.filter(dataAll,function(e){
            //console.log(e[legName])
            return e[legName]==params.name
        })
        //
        dataPie=data
        renderLineEcharts(dataPie,'date')
        $('#pieOpt').val(arr[index])
        $("#piexAxis").change();

    })
}

function renderTable(data) {
    //var fixRow = '"<tr style="background-color: #acc087;"", " ", "", "", " data-index="0"", "", "", ">", "<td  style=""    >日期</td>", "<td  style=""    >交易类型</td>", "<td  style=""    ></td>", "<td  style=""    >大区</td>", "<td  style=""    >城市</td>", "<td  style=""    >负责人</td>", "<td  style=""    >门店</td>", "<td  style=""    ></td>","<td  style=""    ></td>","<td  style=""    ></td></tr>"'
    //var ajaxQuery = _.clone(filter);
    var columns = [{
        field: 'date',
        title: '日期',
        sortable: true
    },
        {
            field: 'trade_type',
            title: '订单类型',
            sortable: true
        },
        {
            field: 'trade_method_name',
            title: '交易方式',
            sortable: true
        },
        {
            field: 'trade_source_type_name',
            title: '订单来源',
            sortable: true
        },
        {
            field: 'trade_order_area_name',
            title: '大区',
            sortable: true
        },
        {
            field: 'city_name',
            title: '城市',
            sortable: true
        },
        {
            field: 'director_name',
            title: '负责人',
            sortable: true
        },
        {
            field: 'shop_name',
            title: '门店',
            sortable: true
        },
        {
            field: 'observer_account_user_name',
            title: '验货员',
            sortable: true
        },
        {
            field: 'count',
            title: '成交量',
            sortable: true
        },
        {
            field: 'amount',
            title: '成交金额',
            sortable: true
        },
        {
            field: 'unit_price',
            title: '客单价',
            sortable: true
        },
        {
            field: 'minus_promotion_amount',
            title: '去优惠成交金额',
            sortable: true
        },
        {
            field: 'actual_amount',
            title: '业绩金额',
            sortable: true
        }
    ]
    $('#regionTable').bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        pagination: true,
        sidePagination: 'client',
        sortName: 'uv',
        sortOrder: 'desc',
        search: true,
        showColumns: true,
        pageSize: 20,
        data: data,
        //fixRow: fixRow,
        cdataExport: "cdataExport",
        columns: columns
    })

    $("#cdataExport").click(function(){
        var exportData=[]
        data.forEach(function(ele){
            var obj = {}
            columns.forEach(function(subEle){
                obj[subEle.title]=ele[subEle.field]
            })
            exportData.push(obj)
        })
        JSONToCSVConvertor(exportData,"data",true)
    })
}




