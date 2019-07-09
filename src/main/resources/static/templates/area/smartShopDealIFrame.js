Template.dealSmartShopReport.rendered = function () {
    var userId = this.data.userId;
    var from = Template.currentData().from;
    switch(from){
        case "1":
            $("#controller").attr("class","content");
            break;
        case "2":
            $("#controller").attr("class","content-wrapper");
            $('.navi-tab').removeClass('active');
            $('#district').addClass('active');
            $('#createSmartShopReport').addClass('active');
            break;
    }

    var promise = getSmartStoreData(userId);
    promise.done(function (data) {
        finalList = data;
        renderSelectOption(data);
        renderPage(userId, finalList);
        $("#search").click(function() {
            renderPage(userId, finalList)
        })
    });
};

var finalList = [];

function getSmartStoreData(userId) {
    var dfd = $.Deferred();
    requestURL(dataService + "/join/getFinalSmartStoreData", {uid : userId}).done(function (ret) {
        dfd.resolve(ret)
    });
    return dfd.promise()
}
/**
 * 渲染成交量
 * @param obj
 * @param col
 * @param dataList
 * @param id
 * @param title
 */
function drawSuccessNumFunc(obj, col, dataList, id, title, subtitle){
    var dataObj = {};

    dataList.forEach(function (e) {
        var shopName = e['shop_name'];
        var method = e.method;
        var area = e.area;
        var city  = e.city;
        var school  = e['school'];
        if((obj.areaFilter == null || obj.areaFilter.contains(area)) && (obj.cityFilter == null || obj.cityFilter.contains(city)) && (obj.schoolFilter == null || obj.schoolFilter.contains(school))) {
            //根据条件进行过滤
            if(obj.type == "门店") {
                if(!dataObj.hasOwnProperty(shopName)) {
                    dataObj[shopName] = {
                        name: e['shop_name'],
                        O2O:0,
                        outlet:0,
                        indoor:0
                    }
                }
                if(method == "O2O订单"){
                    dataObj[shopName].O2O = accMul(e[col],1)
                }else if(method == "门店订单"){
                    dataObj[shopName].outlet = accMul(e[col],1)
                }else if(method == "上门订单"){
                    dataObj[shopName].indoor = accMul(e[col],1)
                }
            }else if(obj.type == "城市"){
                if(!dataObj.hasOwnProperty(city)){
                    dataObj[city]={
                        name: city,
                        O2O:0,
                        outlet:0,
                        indoor:0
                    }
                }
                if(method == "O2O订单"){
                    dataObj[city].O2O += accMul(e[col],1)
                }else if(method == "门店订单"){
                    dataObj[city].outlet += accMul(e[col],1)
                }else if(method == "上门订单"){
                    dataObj[city].indoor += accMul(e[col],1)
                }
            }else if(obj.type == "大区"){
                if(!dataObj.hasOwnProperty(area)){
                    dataObj[area] = {
                        name: area,
                        O2O:0,
                        outlet:0,
                        indoor:0
                    }
                }
                if(method == "O2O订单"){
                    dataObj[area].O2O += accMul(e[col],1)
                }else if(method == "门店订单"){
                    dataObj[area].outlet += accMul(e[col],1)
                }else if(method == "上门订单"){
                    dataObj[area].indoor += accMul(e[col],1)
                }
            }
        }
    });
    var data = [];
    var total = 0;
    for(var key in dataObj) {
        var O2OTmp = 0;
        var outletTmp = 0;
        var indoorTmp = 0;
        if(obj.methodFilter == null || obj.methodFilter.contains("门店自有")){
            outletTmp = dataObj[key].outlet;
            total += outletTmp;
        }
        if(obj.methodFilter == null || obj.methodFilter.contains("O2O")){
            O2OTmp = dataObj[key].O2O;
            total += O2OTmp;
        }
        if(obj.methodFilter == null || obj.methodFilter.contains("上门")){
            indoorTmp = dataObj[key].indoor;
            total += indoorTmp;
        }

        data.push({
            "name": dataObj[key].name + "(" + (O2OTmp + outletTmp + indoorTmp) + ")",
            "O2O": O2OTmp,
            "outlet": outletTmp,
            "indoor": indoorTmp
        })
    }

    //排序
    data.sort(function(a, b) {
        return (a.O2O + a.outlet + a.indoor) - (b.O2O + b.outlet + b.indoor)
    });

    if(data.length < 15) {
        $("#" + id).height("400px")
    } else {
        $("#" + id).height("800px")
    }
    var option = {
        title: {
            text:title + '(总量：'+total+')',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: obj.methodFilter == null ? ['门店自有', 'O2O','上门'] : obj.methodFilter,
            padding: [30,0,0,0]
        },
        dataZoom: [
            {
                type: 'slider',
                startValue: data.length-30 < 0? 0 : data.length-30,
                endValue: data.length,
                yAxisIndex: [0]
            }
        ],
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [ {
            type: 'value',
            axisLabel: {
                formatter: function (value, index) {
                    if (value == 0) {
                        return value
                    }
                    return '' + value + ''
                }
            }
        }],
        yAxis: {
            type: 'category',
            data: _.map(data,function(obj){return obj.name}),
            axisLabel: {
                interval: 0
            }
        },
        series: buildSeries(obj.methodFilter, data, subtitle)
    };

    var outletsDealNumTable = echarts.init(document.getElementById(id));
    outletsDealNumTable.clear();
    outletsDealNumTable.setOption(option);
    outletsDealNumTable.resize();
    window.addEventListener('resize', outletsDealNumTable.resize)
}

function buildSeries(arr, data, title) {
    if(arr == null) {
        return [
            {
                name: '门店自有',
                type: 'bar',
                stack: title,
                data: _.map(data, function(obj){return obj.outlet})
            },
            {
                name: 'O2O',
                type: 'bar',
                stack: title,
                data:_.map(data,function(obj){return obj.O2O})
            },
            {
                name: '上门',
                type: 'bar',
                stack: title,
                data:_.map(data,function(obj){return obj.indoor})
            }
        ];
    } else {
        var res = [];
        _.each(arr, function(ele) {
            if(ele == "门店自有") {
                res.push({
                    name: ele,
                    type: 'bar',
                    stack: title,
                    data: _.map(data,function(obj){return obj.outlet})
                });
            }else if(ele == "O2O") {
                res.push({
                    name: ele,
                    type: 'bar',
                    stack: title,
                    data:_.map(data,function(obj){return obj.O2O})
                });
            }else if(ele == "上门") {
                res.push({
                    name: ele,
                    type: 'bar',
                    stack: title,
                    data:_.map(data,function(obj){return obj.indoor})
                });
            }
        });
        return res;
    }
}

function drawSuccessAmountFunc(obj, col, dataList, id, title, subtitle) {
    var dataObj = {};
    dataList.forEach(function (e) {
        var shopName = e['shop_name'];
        var method = e.method;
        var area = e.area;
        var city  = e.city;
        var school  = e['school'];
        if((obj.areaFilter==null || obj.areaFilter.contains(area)) && (obj.cityFilter==null || obj.cityFilter.contains(city)) && (obj.schoolFilter == null || obj.schoolFilter.contains(school))){//根据条件进行过滤
            if(obj.type == "门店") {
                if(!dataObj.hasOwnProperty(shopName)) {
                    dataObj[shopName] = {
                        name: e['shop_name'],
                        O2O:0,
                        outlet:0,
                        indoor:0
                    }
                }
                if(method == "O2O订单"){
                    dataObj[shopName].O2O = accMul(e[col],1)
                }else if(method == "门店订单"){
                    dataObj[shopName].outlet = accMul(e[col],1)
                }else if(method == "上门订单"){
                    dataObj[shopName].indoor = accMul(e[col],1)
                }
            }else if(obj.type == "城市"){
                if(!dataObj.hasOwnProperty(city)){
                    dataObj[city] = {
                        name: city,
                        O2O:0,
                        outlet:0,
                        indoor:0
                    }
                }
                if(method == "O2O订单"){
                    dataObj[city].O2O += accMul(e[col],1)
                }else if(method=="门店订单"){
                    dataObj[city].outlet += accMul(e[col],1)
                }else if(method == "上门订单"){
                    dataObj[city].indoor += accMul(e[col],1)
                }
            }else if(obj.type=="大区"){
                if(!dataObj.hasOwnProperty(area)){
                    dataObj[area]={
                        name: area,
                        O2O:0,
                        outlet:0,
                        indoor:0
                    }
                }
                if(method=="O2O订单"){
                    dataObj[area].O2O += accMul(e[col],1)
                }else if(method=="门店订单"){
                    dataObj[area].outlet += accMul(e[col],1)
                }else if(method == "上门订单"){
                    dataObj[area].indoor += accMul(e[col],1)
                }
            }
        }
    });
    var data = [];
    var total = 0;
    for(var key in dataObj){
        var O2OTmp = 0;
        var outletTmp = 0;
        var indoorTmp = 0;
        if(obj.methodFilter == null || obj.methodFilter.contains("门店自有")){
            outletTmp = dataObj[key].outlet;
            total += outletTmp;
        }
        if(obj.methodFilter == null || obj.methodFilter.contains("O2O")){
            O2OTmp = dataObj[key].O2O;
            total += O2OTmp;
        }
        if(obj.methodFilter == null || obj.methodFilter.contains("上门")){
            indoorTmp = dataObj[key].indoor;
            total += indoorTmp;
        }
        data.push({
            "name":dataObj[key].name + "(￥" + (outletTmp + O2OTmp + indoorTmp) + ")",
            "O2O":O2OTmp,
            "outlet":outletTmp,
            "indoor" : indoorTmp
        })
    }

    //排序
    data.sort(function(a, b) {
        return (a.O2O + a.outlet + a.indoor) - (b.O2O + b.outlet + b.indoor)
    });

    if(data.length < 15){
        $("#"+id).height("400px")
    }else{
        $("#"+id).height("800px")
    }
    var option = {
        title: {
            text:title+'(总金额：￥' + total + ')',
            //top: '90%',
            left: 'center'
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: obj.methodFilter == null ? ['门店自有', 'O2O','上门'] : obj.methodFilter,
            selected: {'门店余额': false},
            padding: [30,0,0,0]
        },
        dataZoom: [
            {
                type: 'slider',
                startValue: data.length-30<0?0:data.length-30,
                endValue: data.length,
                yAxisIndex: [0]
            }
        ],
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [ {
            type: 'value',
            axisLabel: {
                formatter: function (value, index) {
                    if (value == 0) {
                        return value
                    }
                    return '￥' + value / 1000 + 'k'
                }
            }
        }],
        yAxis: {
            type: 'category',
            data: _.map(data,function(obj){return obj.name}),
            axisLabel: {
                interval: 0
            }
        },
        series: buildSeries(obj.methodFilter, data, subtitle)
    };
    var outletsDealAmountTable = echarts.init(document.getElementById(id));
    outletsDealAmountTable.clear();
    outletsDealAmountTable.setOption(option);
    outletsDealAmountTable.resize();
    window.addEventListener('resize', outletsDealAmountTable.resize)
}

function renderPage(userId, data) {
    //获取门店成交订单量
    var areaFilter = $("#area").val();
    var cityFilter = $("#city").val();
    var methodFilter = $("#method").val();
    var schoolFilter = $("#school").val();
    var type = $("#type").val();
    var obj = {
        "areaFilter":areaFilter,
        "cityFilter":cityFilter,
        "methodFilter":methodFilter,
        "schoolFilter": schoolFilter,
        "type":type
    };

    //获取门店成交订单量
    var successNumList = _.filter(data, function(ele) { return accMul(ele['success_num'],1) > 0});
    drawSuccessNumFunc(obj, 'success_num', successNumList, "outletsDealNumTable", "成交订单量", "成交量");

    //获取门店成交订单金额
    var successAmountList = _.filter(data, function(ele) { return accMul(ele['success_amount'],1) > 0});
    drawSuccessAmountFunc(obj, 'success_amount', successAmountList, "outletsDealAmountTable", "成交订单额", "成交额");

    //获取门店提交订单量
    var submitNumList = _.filter(data, function(ele) { return accMul(ele['submit_num'],1) > 0});
    drawSuccessNumFunc(obj,'submit_num', submitNumList, "outletsTradeNumTable", "提交订单量", "提交量");

    //获取门店成交订单金额
    var submitAmountList = _.filter(data, function(ele) { return accMul(ele['submit_amount'],1) > 0});
    drawSuccessAmountFunc(obj, 'submit_amount', submitAmountList, "outletsTradeAmountTable","提交订单额", "提交额");

}

function renderSelectOption(data) {
    $("#area").attr("multiple","multiple");
    $("#city").attr("multiple","multiple");
    $("#method").attr("multiple","multiple");
    $("#school").attr("multiple","multiple");
    renderOptions("#area", _.unique(_.map(data, function(obj){return obj.area})));
    renderOptions("#city",_.unique(_.map(data, function(obj){return obj.city})));
    renderOptions("#type",[,"门店","城市","大区"]);
    renderOptions("#method",[,"门店自有","O2O","上门"]);
    renderOptions("#school",[,"是","否"]);

    $("#area").multipleSelect({
        placeholder: "全部",
        width: 250,
        selectAll: false
    });
    $("#city").multipleSelect({
        placeholder: "全部",
        width: 250,
        selectAll: false
    });
    $("#method").multipleSelect({
        placeholder: "全部",
        width: 250,
        selectAll: false
    });
    $("#school").multipleSelect({
        placeholder: "全部",
        width: 250,
        selectAll: false
    });
    modifyCSS(".area");
    modifyCSS(".city");
    modifyCSS(".method");
    modifyCSS(".school");
}

function renderOptions(sel,data){
    $(sel).empty();
    data.forEach(function(ele){
        $(sel).append("<option value='"+ele+"'>"+ele+"</option>")
    });
}

function modifyCSS(sel){
    $(sel).find(".ms-choice").css("height","32px");
    $(sel).find(".ms-choice").css("line-height","32px");
    $(sel).find(".ms-choice>div").css("height","32px");
    $(sel).find(".ms-choice>div").css("top","3px");
}