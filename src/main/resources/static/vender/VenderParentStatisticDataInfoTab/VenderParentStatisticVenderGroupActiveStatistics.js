/**
 * Created by hsh on 2016/5/13.
 */
Template.VenderParentStatisticVenderGroupActiveStatistics.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#VenderParentStatisticDataInfoTab').addClass('active');
    $('#VenderParentStatisticVenderGroupActiveStatistics').addClass('active');

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
        "orderCnt": 0,
        "vender_level": 'all'
    };

    //数据初始化加载
    renderPage(queryall);

    //选项初始化加载
    requestURL(dataService+"/Vender/getVenderGroupFilterOptions",{}).done(function(data){
//            console.log(data.sourceStats);
        /*门店*/
        $(".province").attr("multiple","multiple");

        data.province.forEach(function (e) {
            $(".province").append("<option value='" + e + "'>" + e + "</option>");
        });

        /*门店*/
        $(".city").attr("multiple","multiple");
        data.city.forEach(function (e) {
            $(".city").append("<option value='" + e + "'>" + e + "</option>");
        });

        $(".Area").attr("multiple","multiple");
        renderOptions(".Area",["东区","西区","南区","北区"]);

        $(".province").multipleSelect({
            placeholder: "全部",
//            selectAllText:"全部",
//            allSelected:true,
            width: 150,
            selectAll: false,
            filter: true
        });
        $(".city").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false,
            filter: true
        });
        $(".Area").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false,
            filter: true
        });
    });

    $(".search").click(function() {
        renderPage(getSelectedFilter());
    });

    $(".exportVenderGroup").click(function(){
        var filter=getSelectedFilter();
        var query = _.clone(filter);

        $("#wholePage").mask({'label': "请等待，文件正在导出..."});
        requestURL(dataService + "/Vender/exportRiskControlGroupActiveInfo", query).done(function (obj) {
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


function pickWebTrafficFunnelDateRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.dateSelectLabel').html(sdt+"~"+edt);
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

function getSelectedFilter(){
    /*日期*/
    dt = $('.dateSelectLabel').text().replace(/ /g, "").split("~");
    var startDate = dt[0];
    var endDate = dt[1];

    var Area = $(".Area").val();
    var vender_group_province_name = $(".province").val();
    var vender_group_city_name = $(".city").val();
    var vender_level = $(".level").val();

    var orderCnt=$(".cnt").val();
    if (orderCnt == "") {
        orderCnt = "0";
    }else if(new RegExp(/^\d+$/).test(orderCnt)==false){
        alert("请填写数字")
        orderCnt = "0";
    }

    var query = {
        "startDate": startDate,
        "endDate": endDate,
        "Area": Area,
        "vender_group_province_name": vender_group_province_name,
        "vender_group_city_name": vender_group_city_name,
        "orderCnt": orderCnt,
        "vender_level": vender_level
    };

    return cleanParams(query);
}

function pickDateRangeCallback(start, end, label) {
//    console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    $('.webTrafficUV').html(start.format('YYYY-MM-DD'));
}

function renderPage(filter) {

    $("#table").hide();
    $("#loading").show();
    var promise = getRiskControlGroupActiveInfo(filter);
    promise.done(function (ret) {
        $("#table").show();
        $("#loading").hide();

        //renderTable
        renderTable(ret,'#table');
    });

}

function renderTable(data,tableName) {

    data.forEach(function (e) {
        e.aliveRate=((e.aliveCnt/ e.between_count)*100).toFixed(2)+"%"
    })
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

function getRiskControlGroupActiveInfo(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    requestURL(dataService + "/Vender/getRiskControlGroupActiveInfo", query).done(function (ret) {
        dfd.resolve(ret)
    });
    return dfd.promise()
}



