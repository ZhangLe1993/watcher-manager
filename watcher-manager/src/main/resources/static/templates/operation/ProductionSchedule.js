Template.ProductionScheduleTemplate.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operationPlatformTab').addClass('active');
    $("#overviewOperatingCentersTab").addClass('active');
    $('#ProductionScheduleTab').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }
    $("#loading").hide();
    $(".search").click(function(){
           $(this).attr("disabled","disabled");
           //$(this).attr("style","cursor: not-allowed;");
           $("#loading").show();
           renderPage();
    });

    var dateGap = -6;
    var showEndDate = new Date().getNewDate(0);
    var endDate = new Date().getNewDate(1);
    var startDate = new Date(showEndDate).getNewDate(dateGap);
    $('.dateSelectLabel').html(startDate+"~"+showEndDate);
    $('.start-hidden').html(startDate);
    $('.end-hidden').html(endDate);
    var minDate="2016-01-01";
    $('.dateBtn').daterangepicker(filterPickerOptionsFunc(startDate,showEndDate,minDate,false), pickDateRangeCallback);
};

function callback(){
    $("#loading").hide();
    //console.log('去除');
    $("#search-btn").removeAttr("disabled");
    //console.log('成功');
}

function renderPage(){
    getRTData()
    //getRT2Data()
}

function getRTData(){
    var orderNo = $('#orderNo').val();
    if(orderNo==''){
        orderNo = 'none';
    }
    var query = {
                    order: orderNo,
                    operationCenter: $('#operationCenter').val(),
                    startTime:$('.start-hidden').text(),
                    endTime:$('.end-hidden').text()
                 };
    requestURL(dataService+"/operationCenter/getOptProductionSchedule",query).done(function(data){
        $('#rtTable').bootstrapTable('destroy').bootstrapTable({
            data: data,
            pagination: true,
            pageSize: 10,
            search: true,
            exportDataType:'all',
            columns:[
                {
                    field:'serial_no',
                    title:'代拍单号',
                    sortable:true
                },{
                     field:'type',
                     title:'OPT类型',
                     sortable:true
                },{
                     field:'centre_id',
                     title:'运营中心',
                     sortable:true
                },{
                     field:'total_quantity',
                     title:'提交量',
                     sortable:true
                },{
                     field:'real_quantity',
                     title:'收货量',
                     sortable:true
                },{
                     field:'receive_dt',
                     title:'收货时间',
                     sortable:true
                },{
                    field:'abnormal_amount',
                    title:'异常量',
                    sortable:true
                },{
                    field:'dingji',
                    title:'待定级质检',
                    sortable:true
                },{
                    field:'inspection_tuihuo',
                    title:'待退货质检',
                    sortable:true
                },{
                    field:'cangku',
                    title:'待仓库抽检',
                    sortable:true
                },{
                    field:'zhiliang',
                    title:'待质量抽检',
                    sortable:true
                },{
                    field:'shangjia',
                    title:'待上架',
                    sortable:true
                },{
                    field:'zancun',
                    title:'暂存量',
                    sortable:true
                },{
                    field:'ruku',
                    title:'待入库',
                    sortable:true
                },{
                    field:'kucun',
                    title:'库存量',
                    sortable:true
                },{
                    field:'daituihuo',
                    title:'待退货',
                    sortable:true
                },{
                    field:'tuihuo',
                    title:'退货量',
                    sortable:true
                },{
                    field:'chuku',
                    title:'出库量',
                    sortable:true
                }
            ]
        });
        callback();
    })
}



function pickDateRangeCallback(start, end, label) {
    console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    var dif = GetDateDiff(sdt, edt, "day");
    if(dif>7){
        customModal("温馨提示",'时间不要大于7天');
        return;
    }
    $('.dateSelectLabel').html(sdt+"~"+edt);
    $('.start-hidden').html(sdt);
    $('.end-hidden').html(new Date(end.format('YYYY-MM-DD')).getNewDate(1));
    //var activeTab =  $("#chartContent li.active>a").attr("href");
    //renderPage(activeTab)
}

//自定义弹出层
function customModal(title,data){
    $("#myModal").on('show.bs.modal', function () {
        $("#myModalLabel").text(title);
        $("div[name='showContent']").text(data);
        /*$("#modalContent").bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data:data,
            columns: colums
        });*/
    });
    $("#myModal").modal();
}

function GetDateDiff(startTime, endTime, diffType) {
    //将xxxx-xx-xx的时间格式，转换为 xxxx/xx/xx的格式
    startTime = startTime.replace(/\-/g, "/");
    endTime = endTime.replace(/\-/g, "/");
    //将计算间隔类性字符转换为小写
    diffType = diffType.toLowerCase();
    var sTime =new Date(startTime); //开始时间
    var eTime =new Date(endTime); //结束时间
    //作为除数的数字
    var timeType =1;
    switch (diffType) {
        case"second":
            timeType =1000;
            break;
        case"minute":
            timeType =1000*60;
            break;
        case"hour":
            timeType =1000*3600;
            break;
        case"day":
            timeType =1000*3600*24;
            break;
        default:
            break;
    }
    return parseInt((eTime.getTime() - sTime.getTime()) / parseInt(timeType));
}