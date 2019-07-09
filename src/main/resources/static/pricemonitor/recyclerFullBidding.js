Template.recyclerFullBidding.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#pricemonitor').addClass('active');
    $('#recyclerFullBidding').addClass('active');

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var gap=10;
    var minWeekDate = "2016-07-10";
    var startWeekDate = moment().weekday(-7*gap).format("YYYY-MM-DD");
    var endWeekDate = moment().weekday(-7).format("YYYY-MM-DD");
    if (startWeekDate < minWeekDate) {
        startWeekDate = minWeekDate;
    }



    $(".selectLabel").html(startWeekDate+"~"+endWeekDate);
    $('.datePicker').daterangepicker(weekDatePickerOptionsFunc(startWeekDate,endWeekDate,minWeekDate), pickDateRangeCallback);


    renderFilterOptions();
    renderPage({"startDate":startWeekDate,"endDate":endWeekDate})

    $(".search").click(function(){
        var query = getSelectedFilter()

        //check

        if(query.hasOwnProperty("brand")&&!query.hasOwnProperty("category")){
            alert("请选择品类！！")
            return;
        }
        if(query.hasOwnProperty("brand")&&query.brand.length>1){
            alert("目前只支持单选！！")
            return
        }
        if(query.hasOwnProperty("category")&&query.category.length>1){
            alert("目前只支持单选！！")
            return
        }


        renderPage(query)
    })

};


function getSelectedFilter(){
    var dt = $('.selectLabel').text().replace(/ /g,"").split("~");

    var category=$(".category").val()

    var brand=$(".brand").val()


    var filter = {
        "startDate":dt[0],
        "endDate":dt[1],
        "category":category,
        "brand":brand,
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
    requestURL(dataService+"/pricemonitor/getAggregateRecyclerFullBidding",query).done(function(data){
        $("#chartContent").show();
        $("#loading").hide();
        drawTrafficChart(data)
    });
    drawTable(query)
}


function  getPaginationData(filter){
    var query = cleanParams(_.clone(filter));
    var dfd = $.Deferred();
    requestURL(dataService+"/pricemonitor/getPaginationData",query).done(function(ret){
        dfd.resolve(ret)
    });
    return dfd.promise()
}

function drawTable(filter){
    $('#table').bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        pagination: true,
        sidePagination: 'server',
        ajax:function(params){
            var ajaxParams = $.extend(filter,params.data);
                getPaginationData(ajaxParams).done(function(data){
                params.success(data)
            });
        },
        columns: [{
            field: 'date',
            title: '日期',
            sortable:false
        }, {
            field: 'category',
            title: '品类',
            sortable:false
        }, {
            field: 'brand',
            title: '品牌',
            sortable:false
        }, {
            field: 'score',
            title: '竞价充分百分比',
            sortable:false,
            formatter:function(value,row,index){

                return value.toFixed(2)+"%"
            }
        }, {
            field: 'recycler_count_score',
            title: '竞价回收商数量得分',
            sortable:false,
            formatter:function(value,row,index){

                return value.toFixed(2)+"%"
            }
        }, {
            field: 'dif_price_score',
            title: '竞价差价百分比得分',
            sortable:false,
            formatter:function(value,row,index){

                return value.toFixed(2)+"%"
            }
        }, {
            field: 'amount_rate_score',
            title: '回收金额占比得分',
            sortable:false,
            formatter:function(value,row,index){

                return value.toFixed(2)+"%"
            }
        }],
    });


}

//趋势图
function drawTrafficChart(data){
    var obj={
        "date":[],
        "score":[],
        "recycler_count_score":[],
        "amount_rate_score":[],
        "dif_price_score":[]
    };
    data.forEach(function(tmp){
        obj.date.push(tmp.date)
        obj.score.push(tmp.score.toFixed(2))
        obj.recycler_count_score.push(tmp.recycler_count_score.toFixed(2))
        obj.amount_rate_score.push(tmp.amount_rate_score.toFixed(2))
        obj.dif_price_score.push(tmp.dif_price_score.toFixed(2))
    })

    var option = {
        title: {
            text: '竞价充分性趋势图',
            x: "center",
            padding:[0,0,0,50]
        },
        tooltip: {
            trigger: 'axis',
            formatter:function(params,ticket,callback){
                var str = params[0].name + '<br/>';
                params.forEach(function(obj){
                    str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                });
                return str;
            }
        },
        color:["red","black","blue","green"],
        legend: {
            data:['竞价充分百分比','竞价回收商数量得分',"竞价价差百分比得分","回收金额占比得分"],
            padding: [25,0,0,0],
        },
        xAxis: [
            {
                type: 'category',
                data: obj.date
            }
        ],
        yAxis: [
            {
                type: 'value',
                axisLabel:{
                    formatter: '{value}%'
                }
            },
            {
                type: 'value',
                axisLabel:{
                    formatter: '{value}%'
                }
            }
        ],
        series: [
            {
                name: '竞价充分百分比',
                type: 'line',
                yAxisIndex: 0,
                data: obj.score
            },
            {
                name: '竞价回收商数量得分',
                type: 'line',
                yAxisIndex: 0,
                data: obj.recycler_count_score
            },
            {
                name: '竞价价差百分比得分',
                type: 'line',
                yAxisIndex: 1,
                data: obj.dif_price_score
            },
            {
                name: '回收金额占比得分',
                type: 'line',
                yAxisIndex: 0,
                data: obj.amount_rate_score
            },

        ]
    };
    var chart = echarts.init(document.getElementById('chart'));
    chart.setOption(option);
    window.addEventListener('resize',chart.resize)
}

function getFilterOptions(){
    var dfd = $.Deferred();
    requestURL(dataService+"/pricemonitor/getRecyclerFullBiddingFilter",{}).done(function(ret){
        dfd.resolve(ret)
    });
    return dfd.promise()
}

function renderFilterOptions(){
    var promise = getFilterOptions();
    promise.done(function(data){
        renderOptions(".brand",data);

        $(".category").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            //single: true,
            selectAll: false
        });

        $(".brand").multipleSelect({
            placeholder: "全部",
            selectAllText:"全选",
            width: 150,
            selectAll: false,
            //single: true,
            filter: true
        });

        $("button.ms-choice").css("height","34px")
        $("button.ms-choice").css("line-height","34px")

    })
}

function renderOptions(sel,data){
    $(sel).empty();
    data.forEach(function(ele){
        $(sel).append("<option value='"+ele+"'>"+ele+"</option>")
    });
}
