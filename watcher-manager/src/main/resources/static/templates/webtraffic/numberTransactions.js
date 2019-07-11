Template.numberTransactions.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#webtraffic').addClass('active');
    $('#numberTransactionsTab').addClass('active');

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }

    var dateGap = -14;
    var minWeekDate = "2016-07-03";
    var minMonthDate = "2016-07-01";
    var endDate = new Date().getNewDate(-1);
    var startDate = new Date(endDate).getNewDate(dateGap);
    var startWeekDate = moment().weekday(-28).format("YYYY-MM-DD")
    var endWeekDate = moment().weekday(-7).format("YYYY-MM-DD")
    if(startWeekDate<minWeekDate){
        startWeekDate = minWeekDate;
    }
    var startMonthDate = moment().subtract(3, 'month').startOf('month').format("YYYY-MM-DD");
    var endMonthDate = moment().subtract(1, 'month').startOf('month').format("YYYY-MM-DD");
    if(startMonthDate<minMonthDate){
        startMonthDate = minMonthDate;
    }
    var transformDate = function (date) {
        var dateStrArray = date.split('-');
        return dateStrArray[1] + '/' + dateStrArray[2] + '/' + dateStrArray[0]
    };

    var datePickerOptions = {
        "showDropdowns": true,
        //"alwaysShowCalendars": true,
        //"singleDatePicker": true,
        "autoApply": true,
        "alwaysShowCalendars": false,
        "startDate": transformDate(startDate),
        "endDate": transformDate(endDate),
        "minDate": transformDate("2016-07-01"),
        "maxDate": transformDate(endDate),
        "locale": {
            "format": "MM/DD/YYYY",
            "separator": " - ",
            "applyLabel": "确认",
            "cancelLabel": "取消",
            "fromLabel": "从",
            "toLabel": "至",
            "customRangeLabel": "自定义",
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
            "firstDay": 0
        },
        "ranges": {
            '昨天': [moment().subtract(1, 'days').toDate(), moment().subtract(1, 'days').toDate()],
            '最近7天': [moment().subtract(7, 'days').toDate(), moment().toDate()],
            '最近15天': [moment().subtract(15, 'days').toDate(), moment().toDate()],
            '最近30天': [moment().subtract(30, 'days').toDate(), moment().toDate()],
            '本周': [moment().startOf('week').toDate(), moment().endOf('week').toDate()],
            '上周': [moment().subtract(1, 'week').startOf('week').toDate(), moment().subtract(1, 'week').endOf('week').toDate()],
            '本月': [moment().startOf('month').toDate(), moment().endOf('month').toDate()],
            '上个月': [moment().subtract(1, 'month').startOf('month').toDate(), moment().subtract(1, 'month').endOf('month').toDate()],
            '今年': [moment().startOf('year').toDate(), moment().endOf('year').toDate()],
            '去年': [moment().subtract(1, 'year').startOf('year').toDate(), moment().subtract(1, 'year').endOf('year').toDate()]
        }
    };

    $(".dateSelectLabel").html(startDate+"~"+endDate);
    $('.webTrafficFunnelDate').daterangepicker(datePickerOptions, pickWebTrafficFunnelDateRangeCallback);

    var weekPickerOptions = {
        onlyShowfirstDayOfWeek:true,
        "showDropdowns": true,
        //"alwaysShowCalendars": true,
        "alwaysShowCalendars": false,
        //"singleDatePicker": true,
        "autoApply": true,
        "startDate": transformDate(startWeekDate),
        "endDate": transformDate(endWeekDate),
        "minDate": transformDate(minWeekDate),
        "maxDate": transformDate(endWeekDate),
        "locale": {
            "format": "MM/DD/YYYY",
            "separator": " - ",
            "applyLabel": "确认",
            "cancelLabel": "取消",
            "fromLabel": "从",
            "toLabel": "至",
            "customRangeLabel": "自定义",
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
            "firstDay": 0
        },
        "ranges": {
            '上周': [moment().subtract(1, 'week').startOf('week').toDate(), moment().subtract(1, 'week').startOf('week').toDate()],
            '上5周': [moment().subtract(5, 'week').startOf('week').toDate(), moment().subtract(1, 'week').startOf('week').toDate()],
            '上10周': [moment().subtract(10, 'week').startOf('week').toDate(), moment().subtract(1, 'week').startOf('week').toDate()],
            '上15周': [moment().subtract(15, 'week').startOf('week').toDate(), moment().subtract(1, 'week').startOf('week').toDate()],
            '今年': [moment().startOf('year').startOf('week').toDate(), moment().subtract(1, 'week').startOf('week').toDate()],
            '去年': [moment().subtract(1, 'year').startOf('year').startOf('week').toDate(), moment().subtract(1, 'year').endOf('year').startOf('week').toDate()]
        }
    };

    $(".weekSelectLabel").html(startWeekDate+"~"+endWeekDate);
    $('.webTrafficFunnelWeek').daterangepicker(weekPickerOptions, pickWebTrafficFunnelWeekRangeCallback);

    var monthPickerOptions = {
        onlyShowfirstDayOfMonth:true,
        "showDropdowns": true,
        //"alwaysShowCalendars": true,
        "alwaysShowCalendars": false,
        //"singleDatePicker": true,
        "autoApply": true,
        "startDate": transformDate(startMonthDate),
        "endDate": transformDate(endMonthDate),
        "minDate": transformDate(minMonthDate),
        "maxDate": transformDate(endMonthDate),
        "locale": {
            "format": "MM/DD/YYYY",
            "separator": " - ",
            "applyLabel": "确认",
            "cancelLabel": "取消",
            "fromLabel": "从",
            "toLabel": "至",
            "customRangeLabel": "自定义",
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
            "firstDay": 0
        },
        "ranges": {
            '上月': [moment().subtract(1, 'month').startOf('month').toDate(), moment().subtract(1, 'month').startOf('month').toDate()],
            '上5月': [moment().subtract(5, 'month').startOf('month').toDate(), moment().subtract(1, 'month').startOf('month').toDate()],
            '上10月': [moment().subtract(10, 'month').startOf('month').toDate(), moment().subtract(1, 'month').startOf('month').toDate()],
            '上15月': [moment().subtract(15, 'month').startOf('month').toDate(), moment().subtract(1, 'month').startOf('month').toDate()],
            '今年': [moment().startOf('year').startOf('month').toDate(), moment().subtract(1, 'month').startOf('month').toDate()],
            '去年': [moment().subtract(1, 'year').startOf('year').startOf('month').toDate(), moment().subtract(1, 'year').endOf('year').startOf('month').toDate()]
        }
    };

    $(".monthSelectLabel").html(startMonthDate+"~"+endMonthDate);
    $('.webTrafficFunnelMonth').daterangepicker(monthPickerOptions, pickWebTrafficFunnelMonthRangeCallback);

    $(".webTrafficFunnelDate").show();
    $(".webTrafficFunnelWeek").hide();
    $(".webTrafficFunnelMonth").hide();
    $(".dateType").on('change',function(){
        var dateType =$(this).val();
        if(dateType=="daily"){
            $(".webTrafficFunnelDate").show();
            $(".webTrafficFunnelWeek").hide();
            $(".webTrafficFunnelMonth").hide();
        }else if(dateType=="weekly"){
            $(".webTrafficFunnelDate").hide();
            $(".webTrafficFunnelWeek").show();
            $(".webTrafficFunnelMonth").hide();
        }else if(dateType=="monthly"){
             $(".webTrafficFunnelDate").hide();
             $(".webTrafficFunnelWeek").hide();
             $(".webTrafficFunnelMonth").show();
         }
        var dateType =$(this).val();
        var filter = getSelectedFilter(dateType,$(this));
        renderPage(filter);
    });

    requestURL(dataService+"/webTraffic/getClickFilterOptions",{}).done(function(ret){
        //siteName
        $(".siteName").attr("multiple","multiple");
        ret.siteStats.forEach(function (e) {
            $(".siteName").append("<option value='" + e + "'>" + e + "</option>");
        });

        $(".siteName").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false
        });

        //categoryName
        $(".categoryName").attr("multiple","multiple");
        ret.categoryStats.forEach(function (e) {
            $(".categoryName").append("<option value='" + e + "'>" + e + "</option>");
        });
        $(".categoryName").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false,
            filter: true
        });

        //clickName
        $(".actionName").attr("multiple","multiple");
        ret.actionStats.forEach(function (e) {
            $(".actionName").append("<option value='" + e + "'>" + e + "</option>");
        });
        $(".actionName").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false,
            filter: true
        });

        //clickName
        $(".clickName").attr("multiple","multiple");
        ret.clickStats.forEach(function (e) {
            $(".clickName").append("<option value='" + e + "'>" + e + "</option>");
        });
        $(".clickName").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false,
            filter: true
        });
//         $("select.siteName").on('change',function(e){
//         console.log(e)
//                    console.log("sdfsdfdsfdsfdsdfd1111111111111")
//               getFilterOptionsCategoryname();
//               getFilterOptionsActionname();
//               getFilterOptionsClickname();
//         });
//
//         $("select.categoryName").on('change',function(e){
//         console.log(e)
//                    console.log("sdfsdfdsfdsfdsdfd2222222222")
//               getFilterOptionsActionname();
//               getFilterOptionsClickname();
//         });
//
//         $("select.actionName").on('change',function(e){
//         console.log(e)
//                    console.log("sdfsdfdsfdsfdsdfd33333333333332")
//               getFilterOptionsClickname();
//         });

        $(document).on('change','select.siteName',function(e){

                   getFilterOptionsCategoryname();
                   //getFilterOptionsActionname();
                   //getFilterOptionsClickname();
             });

             $(document).on('change','select.categoryName',function(e){

                   getFilterOptionsActionname();
                   //getFilterOptionsClickname();
             });

             $(document).on('change','select.actionName',function(e){

                   getFilterOptionsClickname();
             });

    });







//    getFilterOptions();

//     $("select.siteName").on('change',function(e){
//     console.log(e)
//                console.log("sdfsdfdsfdsfdsdfd1111111111111")
//           //getFilterOptions();
//     });

//
//    $(".categoryName").on('change',function(){
//       getFilterOptions();
//    });
//
//    $(".actionName").on('change',function(){
//       getFilterOptions();
//    });
//
//    $(".clickName").on('change',function(){
//       getFilterOptions();
//    });

    var dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g,"").split("~");
    var startDate = dt[0];
    var endDate = dt[1];
    renderPage({"startDate":startDate,"endDate":endDate});

    $(".search").click(function(){
        var dateType =$(this).parent().parent().find(".dateType").val();
        var filter = getSelectedFilter(dateType,$(this));
        renderPage(filter);
    });

};

function pickWebTrafficFunnelDateRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.dateSelectLabel').html(sdt+"~"+edt);
}

function pickWebTrafficFunnelWeekRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.weekSelectLabel').html(sdt+"~"+edt);
}

function pickWebTrafficFunnelMonthRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.monthSelectLabel').html(sdt+"~"+edt);
}

var dataService = Meteor.settings.public.dataService.baseUrl;


function getSelectedFilter(dateType,$this){
    if(dateType=="daily"){
        var dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g,"").split("~");
        var startDate = dt[0];
        var endDate = dt[1];
    }else if(dateType=="weekly"){
        var dt = $('.desktop-only .weekSelectLabel').text().replace(/ /g,"").split("~");
        var startDate = dt[0];
        var endDate = dt[1];
    }else{
        var dt = $('.desktop-only .monthSelectLabel').text().replace(/ /g,"").split("~");
        var startDate = dt[0];
        var endDate = dt[1];
    }
    var siteName = $(".siteName").val();
    var categoryName = $(".categoryName").val();
    var actionName=$(".actionName").val();
    var clickName = $(".clickName").val();
    var filter = {
        "dateType":dateType,
        "startDate":startDate,
        "endDate":endDate,
        "siteName":siteName,
        "categoryName":categoryName,
        "actionName":actionName,
        "clickName":clickName,
    };

    return cleanParams(filter);
}


function renderPage(filter){
    //var dateGap = -15;
    $("#chartContent").hide();
    $("#loading").show();
    var promise = getAggregateWebTrafficData(filter);
    promise.done(function(ret){
        $("#chartContent").show();
        $("#loading").hide();
        drawDailyTrafficStackChart(ret);

        //renderTable
        var obj = getCalcDataByDate(ret);
        renderTable(filter,obj);
    });

}

//获取总的数据
function  getCalcDataByDate(data){
    var total = 0;
    data.forEach(function (e) {
        total+=e.count;
    });
    return total;
}

function renderTable(filter,obj){

        var fixRow = '"<tr style="background-color: #acc087;"", " ", "", "", " data-index="0"", "", "", ">", "<td  style=""    >总数</td>", "<td  style=""    >-</td>","<td  style=""    >-</td>","<td  style=""    >-</td>", "<td  style=""    >-</td>", "<td  style=""    >'+obj+'</td>","</tr>"'
        var ajaxQuery = _.clone(filter);
        $('#table').bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            pagination: true,
            sidePagination: 'server',
            ajax:function(params){
                var ajaxParams = $.extend(ajaxQuery,params.data);
                $("#ctable").hide();
                getMarketingWebTraffic(ajaxParams).done(function(data){
                    $("#ctable").show();
                    params.success(data)
                });
            },
            fixRow:fixRow,
            cdataExport:"cdataExport"
        });
        $("#cdataExport").click(function(){
            $("#wholePage").mask({'label':"请等待，文件正在导出..."});
            var query = _.clone(filter);
            var flag = query["dateType"];
            delete query["dateType"];
            if(flag=="daily" || !flag){
                requestURL(dataService+"/webTraffic/exportClickWebTrafficData",query).done(function(obj){
                    $("#wholePage").unmask();
                    var url = Meteor.settings.public.downloadService.baseUrl+obj.fileName;
                    var link = document.createElement("a");
                    link.href = url;
                    link.style = "visibility:hidden";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                });
            }else if(flag=="weekly"){
                requestURL(dataService+"/webTraffic/exportClickWebTrafficDataWeek",query).done(function(obj){
                    $("#wholePage").unmask();
                    var url = Meteor.settings.public.downloadService.baseUrl+obj.fileName;
                    var link = document.createElement("a");
                    link.href = url;
                    link.style = "visibility:hidden";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                });
            }else if(flag=="monthly"){
                requestURL(dataService+"/webTraffic/exportClickWebTrafficDataMonth",query).done(function(obj){
                    $("#wholePage").unmask();
                    var url = Meteor.settings.public.downloadService.baseUrl+obj.fileName;
                    var link = document.createElement("a");
                    link.href = url;
                    link.style = "visibility:hidden";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                });
            }
        });
}

function getFilterOptionsCategoryname(){
    var dateType =$(".dateType").val();
    if(dateType=="daily"){
        var dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g,"").split("~");
        var startDate = dt[0];
        var endDate = dt[1];
    }else if(dateType=="weekly"){
        var dt = $('.desktop-only .weekSelectLabel').text().replace(/ /g,"").split("~");
        var startDate = dt[0];
        var endDate = dt[1];
    }else{
        var dt = $('.desktop-only .monthSelectLabel').text().replace(/ /g,"").split("~");
        var startDate = dt[0];
        var endDate = dt[1];
    }
    var siteName = $(".siteName").val();
    var categoryName = $(".categoryName").val();
    var actionName = $(".actionName").val();
    var clickName = $(".clickName").val();

    var filter = {
        "startDate":startDate,
        "endDate":endDate,
        "siteName":siteName,
        "categoryName":categoryName,
        "actionName":actionName,
        "clickName":clickName,
    };
    $(".categoryName").remove();
    $("<select class='categoryName' style='margin-left: 28px;width:150px;border-radius: 4px;padding: 6px 12px;'></select>").insertAfter(".cate");
//    $(".categoryName").attr("multiple","multiple");
//    $(".categoryName").multipleSelect({
//        placeholder: "全部",
//        //selectAllText:"全部",
//        width: 150,
//        selectAll: false,
//        filter: true
//    });
//
//     $(".categoryName").on('change',function(e){
//     console.log(e)
//                console.log("sdfsdfdsfdsfdsdfd2222222222")
//           getFilterOptionsActionname();
////               getFilterOptionsClickname();
//     });
    requestURL(dataService+"/webTraffic/getClickFilterOptionsCategoryname",cleanParams(filter)).done(function(ret){
        //categoryName
        $(".categoryName").attr("multiple","multiple");
        ret.categoryStats.forEach(function (e) {
            $(".categoryName").append("<option value='" + e + "'>" + e + "</option>");
        });
        $(".categoryName").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false,
            filter: true
        });

//         $(".categoryName").on('change',function(e){
//         console.log(e)
//                    console.log("sdfsdfdsfdsfdsdfd2222222222")
//               getFilterOptionsActionname();
////               getFilterOptionsClickname();
//         });
    });
//         $(".categoryName").on('change',function(e){
//         console.log(e)
//                    console.log("sdfsdfdsfdsfdsdfd2222222222")
//               getFilterOptionsActionname();
//    //               getFilterOptionsClickname();
//         });

}

function getFilterOptionsActionname(){
    var dateType =$(".dateType").val();
    if(dateType=="daily"){
        var dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g,"").split("~");
        var startDate = dt[0];
        var endDate = dt[1];
    }else if(dateType=="weekly"){
        var dt = $('.desktop-only .weekSelectLabel').text().replace(/ /g,"").split("~");
        var startDate = dt[0];
        var endDate = dt[1];
    }else{
        var dt = $('.desktop-only .monthSelectLabel').text().replace(/ /g,"").split("~");
        var startDate = dt[0];
        var endDate = dt[1];
    }
    var siteName = $(".siteName").val();
    var categoryName = $(".categoryName").val();
    var actionName = $(".actionName").val();
    var clickName = $(".clickName").val();

    var filter = {
        "startDate":startDate,
        "endDate":endDate,
        "siteName":siteName,
        "categoryName":categoryName,
        "actionName":actionName,
        "clickName":clickName,
    };

    $(".actionName").remove();
    $("<select class='actionName' style='margin-left: 28px;width:150px;border-radius: 4px;padding: 6px 12px;'></select>").insertAfter(".action");

    requestURL(dataService+"/webTraffic/getClickFilterOptionsActionname",cleanParams(filter)).done(function(ret){
        //clickName
        $(".actionName").attr("multiple","multiple");
        ret.actionStats.forEach(function (e) {
            $(".actionName").append("<option value='" + e + "'>" + e + "</option>");
        });
        $(".actionName").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false,
            filter: true
        });


//         $(".actionName").on('change',function(e){
//         console.log(e)
//                    console.log("sdfsdfdsfdsfdsdfd33333333333332")
//               getFilterOptionsClickname();
//         });
    });

}

function getFilterOptionsClickname(){
    var dateType =$(".dateType").val();
    if(dateType=="daily"){
        var dt = $('.desktop-only .dateSelectLabel').text().replace(/ /g,"").split("~");
        var startDate = dt[0];
        var endDate = dt[1];
    }else if(dateType=="weekly"){
        var dt = $('.desktop-only .weekSelectLabel').text().replace(/ /g,"").split("~");
        var startDate = dt[0];
        var endDate = dt[1];
    }else{
        var dt = $('.desktop-only .monthSelectLabel').text().replace(/ /g,"").split("~");
        var startDate = dt[0];
        var endDate = dt[1];
    }
    var siteName = $(".siteName").val();
    var categoryName = $(".categoryName").val();
    var actionName = $(".actionName").val();
    var clickName = $(".clickName").val();

    var filter = {
        "startDate":startDate,
        "endDate":endDate,
        "siteName":siteName,
        "categoryName":categoryName,
        "actionName":actionName,
        "clickName":clickName,
    };

    $(".clickName").remove();
    $("<select class='clickName' style='margin-left: 28px;width:150px;border-radius: 4px;padding: 6px 12px;'></select>").insertAfter(".click");

    requestURL(dataService+"/webTraffic/getClickFilterOptionsClickname",cleanParams(filter)).done(function(ret){
        //clickName
        $(".clickName").attr("multiple","multiple");
        ret.clickStats.forEach(function (e) {
            $(".clickName").append("<option value='" + e + "'>" + e + "</option>");
        });
        $(".clickName").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false,
            filter: true
        });

    });

}

//function getFilterOptions(){
//    var dfd = $.Deferred();
//    requestURL(dataService+"/webTraffic/getClickFilterOptions",{}).done(function(ret){
//        dfd.resolve(ret)
//    });
//    return dfd.promise()
//}
//
//function renderFilterOptions(){
//    var promise = getFilterOptions();
//    promise.done(function(data){
////        renderOptions(".weekly",data.weekStats);
//        renderOptions(".siteName",data.siteStats);
//        renderOptions(".clickName",data.clickStats);
//    })
//}
//
//function renderOptions(sel,data){
//    var num = [];
//    var str = [];
//    var cha = [];
//    $(sel).empty();
//    if(sel!=".weekly"){
//        $(sel).append("<option value=''>All</option>");
//    }
//
//    data.forEach(function(ele){
//        if(sel==".siteName"){
//            $(sel).append("<option value='"+ele+"'>"+ele+"</option>")
//        }else{
//            var regn= /^[0-9].*/;
//            var regs= /^[A-Za-z].*/;
//            if(regn.test(ele)){
//                num.push(ele);
//            }else if(regs.test(ele)){
//                str.push(ele);
//            }else
//                cha.push(ele);
//        }
//    });
//    //console.log(num+"\n"+str+"\n"+cha);
//    if(sel==".clickName"){
//        for(var i=0;i<num.length;i++){
//            $(sel).append("<option value='"+num[i]+"'>"+num[i]+"</option>")
//        }
//        for(var j=0;j<str.length;j++){
//            $(sel).append("<option value='"+str[j]+"'>"+str[j]+"</option>")
//        }
//        for(var k=0;k<cha.length;k++){
//            $(sel).append("<option value='"+cha[k]+"'>"+cha[k]+"</option>")
//        }
//    }
//
//    if(sel==".weekly"){
//        if(data.length>=15){
//            $(".startWeek").val(data[14])
//        }else{
//            $(".startWeek").val(data[data.length-1])
//        }
//    }
//}

function pickEndDateRangeCallback(start, end, label) {
    console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    var dt = start.format('YYYY-MM-DD');
    if(dt<$('.startDateSelectLabel').html()){
        alert("结束时间不能早于起始时间！")
    }else{
        $('.endDateSelectLabel').html(dt);
        renderPage({"startDate":$('.startDateSelectLabel').html(),"endDate":dt});
    }
}

function pickStartDateRangeCallback(start, end, label) {
    console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    var dt = start.format('YYYY-MM-DD');
    if(dt<=$('.endDateSelectLabel').html()){
        $('.startDateSelectLabel').html(dt);
    }else{
        alert("起始时间不能晚于结束时间！")
    }
}



function  getMarketingWebTraffic(filter){
    //clean parameters
    //var query = cleanParams(filter);
    //only get one day important!!!
    var query = cleanParams(_.clone(filter));
    //query.startDate = query.endDate;
    var flag = query["dateType"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if(flag=="daily" || !flag){
        requestURL(dataService+"/webTraffic/getClickWebTrafficData",query).done(function(ret){
            dfd.resolve(ret)
        });
    }else if(flag=="weekly"){
        requestURL(dataService+"/webTraffic/getClickWebTrafficDataWeek",query).done(function(ret){
            dfd.resolve(ret)
        });
    }else if(flag=="monthly"){
         requestURL(dataService+"/webTraffic/getClickWebTrafficDataMonth",query).done(function(ret){
             dfd.resolve(ret)
         });
     }
    return dfd.promise()
}


function cleanParams(filter){
    //clean parameters
    var query = _.clone(filter);
    for(var key in query){
        if(!query[key]&&key!="offset"){
            delete query[key]
        }
    }
    return query
}

function getAggregateWebTrafficData(filter){
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if(flag=="daily" || !flag){
        requestURL(dataService+"/webTraffic/getClickAggregateWebTrafficData",query).done(function(ret){
            dfd.resolve(ret)
        });
    }else if(flag=="weekly"){
        requestURL(dataService+"/webTraffic/getClickAggregateWebTrafficDataWeek",query).done(function(ret){
            dfd.resolve(ret)
        });
    }else if(flag=="monthly"){
        requestURL(dataService+"/webTraffic/getClickAggregateWebTrafficDataMonth",query).done(function(ret){
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}


function drawDailyTrafficStackChart(obj){

        var xAxis_data = [];
        var series = {
            count: []
        };
        obj.forEach(function (e) {
            xAxis_data.push(e.date);
            series.count.push(e.count);
        });

        var option = {
            title: {
                text: '折线图堆叠',
                x:"center",
                padding:[0,0,0,50]
                //y:"bottom"
            },
            tooltip: {
                trigger: 'axis'
            },
            legend: {
                data:['访问总量'],
                padding: [25,0,0,0]
            },
            grid: {
                left: '3%',
                right: '4%',
                containLabel: true
            },
            toolbox: {
                feature: {
                    /*saveAsImage: {}*/
                }
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: xAxis_data
            },
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name:'访问总量',
                    type:'line',
                    //stack: '总量',
                    data:series.count
                }
            ]
        };
        var dailyTrafficStackChart = echarts.init(document.getElementById('dailyTrafficStackChart'));
        dailyTrafficStackChart.setOption(option);
        window.addEventListener('resize',dailyTrafficStackChart.resize)
    //});
}

