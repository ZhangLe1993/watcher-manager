/**
 * Created by hsh on 2016/5/13.
 */
Template.VenderHistoryDataStatistics.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#VenderHistoryDataStatistics').addClass('active');

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

    var dt = $('.dateSelectLabel').text().replace(/ /g,"").split("~");
    var startDate = dt[0];
    var endDate = dt[1];

    var queryall = {
        "startDate": startDate,
        "endDate": endDate,
    };
    var query ={
        "vender_company_key":vender_company_key
    }

    //数据初始化加载
    renderPage(queryall);

    //选项初始化加载
    requestURL(dataService+"/Vender/getVenderFilterOptions",query).done(function(data){

        $(".company").attr("multiple","multiple");

        data.vender_company_name.forEach(function (e) {
            $(".company").append("<option value='" + e + "'>" + e + "</option>");
        });

        $(".store").attr("multiple","multiple");
        data.vender_store_name.forEach(function (e) {
            $(".store").append("<option value='" + e + "'>" + e + "</option>");
        });

        $(".account").attr("multiple","multiple");
        data.vender_account_name.forEach(function (e) {
            $(".account").append("<option value='" + e + "'>" + e + "</option>");
        });

        $(".company").multipleSelect({
            placeholder: "全部",
            width: 150,
            selectAll: false,
            filter: true
        });
        $(".store").multipleSelect({
            placeholder: "全部",
            width: 150,
            selectAll: false,
            filter: true
        });
        $(".account").multipleSelect({
            placeholder: "全部",
            width: 150,
            selectAll: false,
            filter: true
        });

        $(document).on('change','select.company',function(e){
                   getFilterOptionsCompany();
             });
    });

    $(".search").click(function() {
        dt = $('.dateSelectLabel').text().replace(/ /g, "").split("~");
        var startDate = dt[0];
        var endDate = dt[1];

        var company = $(this).parent().find(".company").val();
        var store = $(this).parent().find(".store").val();
        var account = $(this).parent().find(".account").val();

        var query = {
            "startDate": startDate,
            "endDate": endDate,
            "vender": company,
            "group": store,
            "subVender": account,
        };

        query = cleanParams(query);
        renderPage(query);
    });

    $(".order").on('change',function(){
        var flag=$(".order").val();
        drawtrafficFunnelChart(orderData,flag);
        drawtrafficStackChart(orderData,flag);
        drawtrafficFunnelChartPr(orderData,flag);
        drawtrafficStackChartPr(orderData,flag);
    });
};

var orderData,vender_company_key="aihuishouBiClairAll",vender_company_name=[];

function pickWebTrafficFunnelDateRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.dateSelectLabel').html(sdt+"~"+edt);
}

function getFilterOptionsCompany(){
    var company= $(".company").val();

    var filter = {
        "vender_company_key":vender_company_key,
        "company":company
    };

    filter=cleanParams(filter);
    $(".store").remove();
    $(".account").remove();
    $("<select class='store' style='margin-left: 28px;width:150px;border-radius: 4px;padding: 6px 12px;'></select>").insertAfter(".storeOption");
    $("<select class='account' style='margin-left: 28px;width:150px;border-radius: 4px;padding: 6px 12px;'></select>").insertAfter(".accountOption");
    requestURL(dataService+"/Vender/getVenderFilterOptions",cleanParams(filter)).done(function(ret){
        //store
        $(".store").attr("multiple","multiple");
        ret.vender_store_name.forEach(function (e) {
            $(".store").append("<option value='" + e + "'>" + e + "</option>");
        });
        $(".store").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false,
            filter: true
        });

        //account
        $(".account").attr("multiple","multiple");
        ret.vender_account_name.forEach(function (e) {
            $(".account").append("<option value='" + e + "'>" + e + "</option>");
        });
        $(".account").multipleSelect({
            placeholder: "全部",
            width: 150,
            selectAll: false,
            filter: true
        });
    });
}

function cleanParams(filter){
    var query = _.clone(filter);
    for(var key in query){
        if(!query[key]&&key!="offset"){
            delete query[key]
        }
    }
    return query
}

function pickDateRangeCallback(start, end, label) {
    $('.webTrafficUV').html(start.format('YYYY-MM-DD'));
}

function renderPage(filter) {

    $("#table").hide();
    $("#loading").show();
    var promise = getVenderHistoryDataInfo(filter);
    promise.done(function (ret) {
        $("#table").show();
        $("#loading").hide();

        //renderTable
        renderTable(ret,'#table');
    });

}

function renderTable(data,tableName) {

    $(tableName).bootstrapTable('destroy').bootstrapTable({
        //exportDataType: 'all',
        data:data
    });
}

function cleanParams(filter) {
    //clean parameters
    var query = _.clone(filter);
    for (var key in query) {
        if (!query[key] && key != "offset") {
            delete query[key]
        }
    }
    return query
}

function getVenderHistoryDataInfo(filter) {
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    requestURL(dataService + "/Vender/getVenderHistoryDataInfo", query).done(function (ret) {
        dfd.resolve(ret)
    });
    return dfd.promise()
}



