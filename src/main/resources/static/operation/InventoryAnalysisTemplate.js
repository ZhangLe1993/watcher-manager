Template.InventoryAnalysisTemplate.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operationPlatformTab').addClass('active');
    $("#houseTab").addClass('active');
    $("#stockTab").addClass('active');
    $('#InventoryAnalysisTemplate').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }
    var minDate = "2017-07-07";
    var date = new Date().getNewDate(-1);
    //var startDate = new Date(endDate).getNewDate(dateGap);var date = new Date().getNewDate(-1);
    $(".selectLabel").html(date);
    $('.datePicker').daterangepicker(datePickerOptionsFunc(date,date,minDate,true), pickDateRangeCallback);
    renderPage(date)
};


function pickDateRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    //var edt = end.format('YYYY-MM-DD');
    $('.selectLabel').html(sdt);
    getHistoryData(sdt)
}

function renderPage(date){
    getRTData();
    getHistoryData(date)
}
function getHistoryData(date){
    requestURL(dataService+"/operationCenter/getInventoryData",{date:date}).done(function(data){
        if(data.length > 3000){
            $('#historyTable').bootstrapTable('destroy').bootstrapTable({
                data: data,
                cdataExport: "maintainDataExport",
                exportDataType: 'all'
            });
            $("#maintainDataExport").click(function(){
                requestURL(dataService+"/operationCenter/exportInventoryData",{date:date}).done(function(result){
                    var url = Meteor.settings.public.downloadService.baseUrl+result.path;
                    var link = document.createElement("a");
                    link.href = url;
                    link.style = "visibility:hidden";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                });
            });
        }else{
            $('#historyTable').bootstrapTable('destroy').bootstrapTable({
                data: data,
                exportDataType: 'all'
            });
        }
    })
}
function getRTData(){
    requestURL(dataService+"/operationCenter/getInventoryData",{}).done(function(data){
        if(data.length > 3000){
            $('#rtTable').bootstrapTable('destroy').bootstrapTable({
                data: data,
                cdataExport: "rtDataExport",
                exportDataType: 'all'
            });
            $("#rtDataExport").click(function(){
                requestURL(dataService+"/operationCenter/exportInventoryData",{}).done(function(result){
                    var url = Meteor.settings.public.downloadService.baseUrl+result.path;
                    var link = document.createElement("a");
                    link.href = url;
                    link.style = "visibility:hidden";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                });
            });
        }else{
            $('#rtTable').bootstrapTable('destroy').bootstrapTable({
                data: data,
                exportDataType: 'all',
            })
        }
    })
}