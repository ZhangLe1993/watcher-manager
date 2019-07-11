Template.BiddingEmpty.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#channelSideTab').addClass('active');
    $('#biddingEmptybak').addClass('active');

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var dateGap = -14;
    var minWeekDate = "2017-01-01";
    var minMonthDate = "2017-01-01";
    var minDate = "2017-01-01";
    var endDate = new Date().getNewDate(-1);
    var startDate = new Date(endDate).getNewDate(dateGap);
    var startWeekDate = moment().weekday(-14).format("YYYY-MM-DD");
    var endWeekDate = moment().weekday(-7).format("YYYY-MM-DD");
    if(startWeekDate<minWeekDate){
        startWeekDate = minWeekDate;
    }
    var startMonthDate = moment().subtract(1, 'month').startOf('month').format("YYYY-MM-DD");
    var endMonthDate = moment().startOf('month').format("YYYY-MM-DD");
    if(startMonthDate<minMonthDate){
        startMonthDate = minMonthDate;
    }

    $(".selectLabel").html(startDate+"~"+endDate);
    $('.datePicker').daterangepicker(datePickerOptionsFunc(startDate,endDate,minDate), pickDateRangeCallback);


    $(".type").change(function(){
        var type = this.value
        var  pane = $(".tab-pane.active").attr("id");
        switch(type){
            case "daily":
                $("#"+pane+" .selectLabel").html(startDate+"~"+endDate);
                $('#'+pane+' .datePicker').daterangepicker(datePickerOptionsFunc(startDate,endDate,minDate), pickDateRangeCallback);
                break;
            case "weekly":
                $("#"+pane+" .selectLabel").html(startWeekDate+"~"+endWeekDate);
                $('#'+pane+' .datePicker').daterangepicker(weekDatePickerOptionsFunc(startWeekDate,endWeekDate,minWeekDate), pickDateRangeCallback);
                break;
            case "monthly":
                $("#"+pane+" .selectLabel").html(startMonthDate+"~"+endMonthDate);
                $('#'+pane+' .datePicker').daterangepicker(monthDatePickerOptionsFunc(startMonthDate,endMonthDate,minMonthDate), pickDateRangeCallback);
                break;

        }
    })
    $('a[data-toggle=tab]').on('shown.bs.tab', function (e) {
        var paneTab = e.target.hash
        if(paneTab=="#recycler"){

        }else if(paneTab=="#category"){

        }
        renderPage()
    });

    renderFilterOptions()

    renderPage()

    $("#recycler .search").click(function(e){
        getRecyclerHistoryData()
    })

    $("#category .search").click(function(e){
        getCategoryHistoryData()
    })

};

function getSelectedFilter($parent){
    var type=$parent.find(".type").val();
    var category=$parent.find('.category').val();
    var brand=$parent.find('.brand').val();
    var recycler=$parent.find('.recycler').val()
    var dtArr=$parent.find(".selectLabel").text().split("~")
    var sdt=dtArr[0]
    var edt=dtArr[1]
    return cleanParams({
        sdt:sdt,
        edt:edt,
        type:type,
        category:category,
        brand:brand,
        recycler:recycler
    })
}


function getRecyclerHistoryData(){
    var query = getSelectedFilter($("#recycler"));
    requestURL(dataService+"/pricemonitor/getRecyclerHistoryBiddingEmpty",query).done(function(data){
        //
        var obj={
            "date":[],
            "rate":[],
        };
        data.forEach(function(tmp){
            obj.date.push(tmp.name)
            obj.rate.push((tmp.value))
        })
        var option = {
            title: {
                text: '竞价清零占比历史趋势图',
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
                data:['竞价清零占比'],
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
                /* {
                 type: 'value',
                 axisLabel:{
                 formatter: '{value}%'
                 }
                 }*/
            ],
            series: [
                {
                    name: '竞价清零占比',
                    type: 'line',
                    yAxisIndex: 0,
                    data: obj.rate
                },

            ]
        };
        var chart = echarts.init(document.getElementById('recyclerHistoryChart'));
        chart.setOption(option);
        window.addEventListener('resize',chart.resize)
    })
}


function getCategoryHistoryData(){
    var query = getSelectedFilter($("#category"));
    requestURL(dataService+"/pricemonitor/getCategoryHistoryBiddingEmpty",query).done(function(data){
        //
        var obj={
            "date":[],
            "rate":[],
        };
        data.forEach(function(tmp){
            obj.date.push(tmp.name)
            obj.rate.push((tmp.value))
        })
        var option = {
            title: {
                text: '竞价清零占比历史趋势图',
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
                data:['竞价清零占比'],
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
                /* {
                 type: 'value',
                 axisLabel:{
                 formatter: '{value}%'
                 }
                 }*/
            ],
            series: [
                {
                    name: '最高竞价清零占比',
                    type: 'line',
                    yAxisIndex: 0,
                    data: obj.rate
                },

            ]
        };
        var chart = echarts.init(document.getElementById('categoryHistoryChart'));
        chart.setOption(option);
        window.addEventListener('resize',chart.resize)
    })
}

function pickDateRangeCallback(start, end, label) {
    console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.selectLabel').html(sdt+"~"+edt);
}

function renderFilterOptions(){



    requestURL(dataService+"/pricemonitor/getHistoryBiddingEmptyOptions",{}).done(function(data){
        renderOptions(" .brand",data.brand);
        renderOptions(" .category",data.category);
        renderOptions(" .recycler",data.recycler);
        $(" .category").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            //single: true,
            selectAll: false
        });

        $(" .brand").multipleSelect({
            placeholder: "全部",
            selectAllText:"全选",
            width: 150,
            selectAll: false,
            //single: true,
            filter: true
        });
        $(" .recycler").multipleSelect({
            placeholder: "全部",
            selectAllText:"全选",
            width: 150,
            selectAll: false,
            //single: true,
            filter: true
        });
        $("button.ms-choice").css("height","34px");
        $("button.ms-choice").css("line-height","34px")
    })
}

function renderOptions(sel,data){
    $(sel).empty();
    data.forEach(function(ele){
        $(sel).append("<option value='"+ele+"'>"+ele+"</option>")
    });
}


function renderPage(){

    var  paneTab = $(".tab-pane.active").attr("id");
    if(paneTab=="recycler"){
        getRecyclerHistoryData()
        requestURL(dataService+"/pricemonitor/getRealTimeBiddingEmpty",{}).done(function(data){
            $("#recyclerTable").bootstrapTable('destroy').bootstrapTable({
                exportDataType: 'all',
                search: true,
                data: data,
                columns: [{
                    field: 'recycler',
                    title: '回收商',
                    sortable:true
                },{
                    field: 'category',
                    title: '品类',
                    sortable:true
                }, {
                    field: 'brand',
                    title: '品牌',
                    sortable:true
                }, {
                    field: 'confirmCnt',
                    title: '竞价总数',
                    sortable:true
                }, {
                    field: 'emptyCnt',
                    title: '竞价清零数',
                    sortable:true
                }, {
                    field: '',
                    title: '占比',
                    sortable:false,
                    formatter:function(value,row){
                        return (row.emptyCnt/row.confirmCnt).toFixed(2)
                    }
                }]
            })
        })
    }else if(paneTab=="category"){
        getCategoryHistoryData()
        requestURL(dataService+"/pricemonitor/getCategoryRecyclerRealTimeBiddingEmpty",{}).done(function(data){
            $("#categoryRecyclerTable").bootstrapTable('destroy').bootstrapTable({
                exportDataType: 'all',
                search: true,
                data: data
            });
        })

        requestURL(dataService+"/pricemonitor/getCategoryRealTimeBiddingEmpty",{}).done(function(data){
            $("#categoryTable").bootstrapTable('destroy').bootstrapTable({
                exportDataType: 'all',
                search: true,
                data: data,
                columns: [{
                    field: 'category',
                    title: '品类',
                    sortable:true
                }, {
                    field: 'brand',
                    title: '品牌',
                    sortable:true
                }, {
                    field: 'confirmCnt',
                    title: '竞价确认数',
                    sortable:true
                }, {
                    field: 'emptyCnt',
                    title: '竞价清零数',
                    sortable:true
                }, {
                    field: '',
                    title: '占比',
                    sortable:false,
                    formatter:function(value,row){
                        return (row.emptyCnt/row.confirmCnt).toFixed(2)
                    }
                }]
            })
        })
    }
}