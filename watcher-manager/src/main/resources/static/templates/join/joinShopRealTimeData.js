Template.joinShopRealTimeData.rendered = function () {

    $('.navi-tab').removeClass('active');
    $('#joinProjectTab').addClass('active');
    $('#joinShopRealTimeDataTab').addClass('active');
    if(isMobile()){
        $('.sidebar-toggle').click();
    }
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }

    initFinalResult();
    $("#search").click(function(){
        renderPage();
    });

};

var finalResultList = [];

var initFinalResult = function(){
    requestURL(dataService+"/join/getFinalResultList", {}).done(function (data) {
        if(data.statusText != undefined && data.statusText=='error'){

        }else{
            //console.log(data);
            finalResultList = data;
            renderSelectOption();
            renderPage();
        }
    });
};

function renderPage(){
    var areaFilter = $("#area").val();
    var provinceFilter = $("#province").val();
    var cityFilter = $("#city").val();
    var type = $("#type").val();
    var obj = {
        "areaFilter":areaFilter,
        "provinceFilter":provinceFilter,
        "cityFilter":cityFilter,
        "type":type
    };
    var outletsDealArr =  _.filter(finalResultList,function(ele){return ele.type == '1'});
    var outletsTradeArr =  _.filter(finalResultList,function(ele){return ele.type == '0'});
    //console.log(outletsDealArr);
    //console.log(outletsTradeArr);
    dealOutletsNumFunc(obj,outletsDealArr,"outletsDealNumTable","成交订单量","success");
    dealOutletsNumFunc(obj,outletsTradeArr,"outletsTradeNumTable","提交订单量","submit");
    dealOutletsAmountFunc(obj,outletsDealArr,"outletsDealAmountTable","成交订单额","success");
    dealOutletsAmountFunc(obj,outletsTradeArr,"outletsTradeAmountTable","提交订单额","submit");
}

function dealOutletsAmountFunc(obj,dataList,id,title,type){
    var selected = {'': false};
    if(type == 'submit'){
        selected = {'上门成交额': false};
    }
    var dataObj={};
    dataList.forEach(function (e) {
        var shopName = e.shop_name;
        var method = e.method;
        var area = e.area;
        var province  = e.province;
        var city  = e.city;
        if((obj.areaFilter==null||obj.areaFilter.contains(area))&&(obj.provinceFilter==null||obj.provinceFilter.contains(province))&&(obj.cityFilter==null||obj.cityFilter.contains(city))){//根据条件进行过滤
            if(obj.type=="门店"){
                if(!dataObj.hasOwnProperty(shopName)){
                    dataObj[shopName]={
                        name: e.shop_name,
                        O2O:0,
                        outlet:0,
                        indoor:0
                    }
                }
                if(method=="O2O订单"){
                    dataObj[shopName].O2O = accMul(e.amount,1);
                }else if(method=="门店订单"){
                    dataObj[shopName].outlet = accMul(e.amount,1);
                }else if(method=="上门订单"){
                    dataObj[shopName].indoor = accMul(e.amount,1);
                }
            }else if(obj.type=="城市"){
                if(!dataObj.hasOwnProperty(city)){
                    dataObj[city]={
                        name: city,
                        O2O:0,
                        outlet:0,
                        indoor:0
                    }
                }
                if(method=="O2O订单"){
                    dataObj[city].O2O += accMul(e.amount,1);
                }else if(method=="门店订单"){
                    dataObj[city].outlet += accMul(e.amount,1);
                }else if(method=="上门订单"){
                    dataObj[city].indoor += accMul(e.amount,1);
                }
            }else if(obj.type=="省份"){
                if(!dataObj.hasOwnProperty(province)){
                    dataObj[province]={
                        name: province,
                        O2O:0,
                        outlet:0,
                        indoor:0
                    }
                }
                if(method=="O2O订单"){
                    dataObj[province].O2O += accMul(e.amount,1);
                }else if(method=="门店订单"){
                    dataObj[province].outlet += accMul(e.amount,1);
                }else if(method=="上门订单"){
                    dataObj[province].indoor += accMul(e.amount,1);
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
                    dataObj[area].O2O += accMul(e.amount,1);
                }else if(method=="门店订单"){
                    dataObj[area].outlet += accMul(e.amount,1);
                }else if(method=="上门订单"){
                    dataObj[area].indoor += accMul(e.amount,1);
                }
            }
        }
        else{
            //console.log(e)
        }
    });
    var data = [];
    var total = 0;
    for(var key in dataObj){
        var O2OTmp = dataObj[key].O2O;
        var outletTmp = dataObj[key].outlet;
        var indoorTmp = dataObj[key].indoor;
        total+=(outletTmp+O2OTmp+indoorTmp);
        data.push({
            "name":dataObj[key].name+"(￥"+(outletTmp+O2OTmp+indoorTmp)+")",
            "O2O":O2OTmp,
            "outlet":outletTmp,
            "indoor":indoorTmp

        })
    }

    //排序
    data.sort(function(a,b){
        return (a.O2O + a.outlet + a.indoor)-(b.O2O+ b.outlet + b.indoor)
    });

    if(data.length<15){
        $("#"+id).height("400px")
    }else{
        $("#"+id).height("800px")
    }
    var option = {
        title: {
            text:title+'(总金额：￥'+total.toLocaleString()+')',
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
            data: ['门店成交额', 'O2O成交额','上门成交额'],
            selected: selected,
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
        series: [
            {
                name: '门店成交额',
                type: 'bar',
                stack: '成交额',
                data: _.map(data,function(obj){return obj.outlet})
            },
            {
                name: 'O2O成交额',
                type: 'bar',
                stack: '成交额',
                data:_.map(data,function(obj){return obj.O2O})
            },
            {
                name: '上门成交额',
                type: 'bar',
                stack: '成交额',
                data:_.map(data,function(obj){return obj.indoor})
            }

        ]
    };
    var outletsDealAmountTable = echarts.init(document.getElementById(id));
    outletsDealAmountTable.clear();
    outletsDealAmountTable.setOption(option);
    outletsDealAmountTable.resize();
    window.addEventListener('resize', outletsDealAmountTable.resize)
}

function dealOutletsNumFunc(obj,dataList,id,title,type){
    var selected = {'': false};
    if(type == 'submit'){
        selected = {'上门成交量': false};
    }
    var dataObj={};

    dataList.forEach(function (e) {
        var shopName = e.shop_name;
        var method = e.method;
        var area = e.area;
        var province  = e.province;
        var city  = e.city;
        if((obj.areaFilter==null||obj.areaFilter.contains(area))&&(obj.provinceFilter==null||obj.provinceFilter.contains(province))&&(obj.cityFilter==null||obj.cityFilter.contains(city))){//根据条件进行过滤
            if(obj.type=="门店"){
                if(!dataObj.hasOwnProperty(shopName)){
                    dataObj[shopName]={
                        name: e.shop_name,
                        O2O:0,
                        outlet:0,
                        indoor:0
                    }
                }
                if(method=="O2O订单"){
                    dataObj[shopName].O2O = accMul(e.cnt,1);
                }else if(method=="门店订单"){
                    dataObj[shopName].outlet = accMul(e.cnt,1);
                }else if(method=="上门订单"){
                    dataObj[shopName].indoor = accMul(e.cnt,1);
                }
            }else if(obj.type=="城市"){
                if(!dataObj.hasOwnProperty(city)){
                    dataObj[city]={
                        name: city,
                        O2O:0,
                        outlet:0,
                        indoor:0
                    }
                }
                if(method=="O2O订单"){
                    dataObj[city].O2O += accMul(e.cnt,1);
                }else if(method=="门店订单"){
                    dataObj[city].outlet += accMul(e.cnt,1);
                }else if(method=="上门订单"){
                    dataObj[city].indoor += accMul(e.cnt,1);
                }
            }else if(obj.type=="省份"){
                if(!dataObj.hasOwnProperty(province)){
                    dataObj[province]={
                        name: province,
                        O2O:0,
                        outlet:0,
                        indoor:0
                    }
                }
                if(method=="O2O订单"){
                    dataObj[province].O2O += accMul(e.cnt,1);
                }else if(method=="门店订单"){
                    dataObj[province].outlet += accMul(e.cnt,1);
                }else if(method=="上门订单"){
                    dataObj[province].indoor += accMul(e.cnt,1);
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
                    dataObj[area].O2O += accMul(e.cnt,1);
                }else if(method=="门店订单"){
                    dataObj[area].outlet += accMul(e.cnt,1);
                }else if(method=="上门订单"){
                    dataObj[area].indoor += accMul(e.cnt,1);
                }
            }
        }
        else{
            //console.log(e)
        }
    });
    var data = [];
    var total = 0;
    for(var key in dataObj){
        var O2OTmp = dataObj[key].O2O;
        var outletTmp = dataObj[key].outlet;
        var indoorTmp = dataObj[key].indoor;
        total+=(outletTmp+O2OTmp+indoorTmp);
        data.push({
            "name":dataObj[key].name+"("+(outletTmp+O2OTmp+indoorTmp)+")",
            "O2O":O2OTmp,
            "outlet":outletTmp,
            "indoor":indoorTmp
        })
    }

    //排序
    data.sort(function(a,b){
        return (a.O2O + a.outlet + a.indoor)-(b.O2O+ b.outlet + b.indoor)
    });

    if(data.length<15){
        $("#"+id).height("400px")
    }else{
        $("#"+id).height("800px")
    }
    var option = {
        title: {
            text:title+'(总量：'+total+')',
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
            data: ['门店成交量', 'O2O成交量' ,'上门成交量'],
            selected:selected,
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
        series: [
            {
                name: '门店成交量',
                type: 'bar',
                stack: '成交量',
                data: _.map(data,function(obj){return obj.outlet})
            },
            {
                name: 'O2O成交量',
                type: 'bar',
                stack: '成交量',
                data:_.map(data,function(obj){return obj.O2O})
            },
            {
                name: '上门成交量',
                type: 'bar',
                stack: '成交量',
                data:_.map(data,function(obj){return obj.indoor})
            }

        ]
    };
    var outletsDealNumTable = echarts.init(document.getElementById(id));
    outletsDealNumTable.clear();
    outletsDealNumTable.setOption(option);
    outletsDealNumTable.resize();
    window.addEventListener('resize', outletsDealNumTable.resize)
}

var renderSelectOption = function(){

    $("#area").attr("multiple","multiple");
    $("#province").attr("multiple","multiple");
    $("#city").attr("multiple","multiple");
    renderOptions("#area", _.unique(_.map(finalResultList,function(obj){return obj.area})));
    renderOptions("#province",_.unique(_.map(finalResultList,function(obj){return obj.province})));
    renderOptions("#city",_.unique(_.map(finalResultList,function(obj){return obj.city})));
    renderOptions("#type",["门店","城市","省份","大区"]);

    $("#area").multipleSelect({
        placeholder: "全部",
        width: 150,
        selectAll: false
    });
    $("#province").multipleSelect({
        placeholder: "全部",
        width: 150,
        selectAll: false
    });
    $("#city").multipleSelect({
        placeholder: "全部",
        width: 150,
        selectAll: false
    });
    modifyCSS(".area");
    modifyCSS(".province");
    modifyCSS(".city");
};

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