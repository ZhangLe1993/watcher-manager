Template.tailCollection.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#CompetitonPriceTab').addClass('active');
    $('#tailCollection').addClass('active');

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }
    _.each(allList,function(ele){
        initPageToLoading(ele);
    });

    drawPage();
};

var initPageToLoading = function(modelName){
    if(noneAmountArr.contains(modelName)){
        $("#" + modelName + "LoadingPanel").show();
        $("#" + modelName + "Panel").hide();
    }else{
        $("#" + modelName + "LeftLoadingPanel").show();
        $("#" + modelName + "LeftPanel").hide();
        $("#" + modelName + "RightLoadingPanel").show();
        $("#" + modelName + "RightPanel").hide();
    }
};

var cancelLoading = function(modelName){
    if(noneAmountArr.contains(modelName)){
        $("#" + modelName + "LoadingPanel").hide();
        $("#" + modelName + "Panel").show();
    }else{
        $("#" + modelName + "LeftLoadingPanel").hide();
        $("#" + modelName + "LeftPanel").show();
        $("#" + modelName + "RightLoadingPanel").hide();
        $("#" + modelName + "RightPanel").show();
    }
};

var noneAmountArr = ["add","sub"];

var allList = ['submit','paid','cancel','send','confirm','applyReturn','dealReturn','add','sub'];
var drawPage = function(){
    _.each(allList,function(ele){
        getDataPublic(ele);
    });
};


var getDataPublic = function(modelName){
    requestURL(dataService+"/biddingOperation/getPublicNumAndAmount",{model:modelName,isToday:true}).done(function(todayRet){
        console.log(todayRet);
        requestURL(dataService+"/biddingOperation/getPublicNumAndAmount",{model:modelName,isToday:false}).done(function(yesterdayRet){
            console.log(yesterdayRet);
            //获取数量环比
            //var num_percent = getCircleCompare(yesterdayRet['num'],todayRet['num']);
            //获取数量环比趋势
            //var num_trend = getCircleCompareTrend(yesterdayRet['num'],todayRet['num']);

            cancelLoading(modelName);
            //设置数量
            setNumPublic(modelName,{num:todayRet['num'],trend:0,percent:yesterdayRet['num']});

            if(!noneAmountArr.contains(modelName)){
                //获取金额环比
                //var amount_percent = getCircleCompare(yesterdayRet['amount'],todayRet['amount']);
                //获取金额环比趋势
                //var amount_trend = getCircleCompareTrend(yesterdayRet['amount'],todayRet['amount']);
                //设置金额
                setAmountPublic(modelName,{amount:todayRet['amount'],trend:0,percent:yesterdayRet['amount']});
            }
        });
    });
};

var setNumPublic = function(modelName,obj){
    $("#" + modelName + "Num").html(accMul(obj.num,1).toLocaleString());
    $("#" + modelName + "NumTrendPercent").html(accMul(obj.percent,1).toLocaleString());
    /*if(obj.trend == -1){
        $("#" + modelName + "NumTrend").attr("class","fa fa-caret-down text-red");
        $("#" + modelName + "NumTrendPercent").attr("class","trend-down");
    }else if(obj.trend == 1){
        $("#" + modelName + "NumTrend").attr("class","fa fa-caret-up text-green");
        $("#" + modelName + "NumTrendPercent").attr("class","trend-up");
    }else{
        $("#" + modelName + "NumTrend").attr("class","fa text-orange");
        $("#" + modelName + "NumTrendPercent").attr("class","trend-keep");
    }*/
};

var setAmountPublic = function(modelName,obj){
    $("#" + modelName + "Amount").html(accMul(obj.amount,1).toLocaleString());
    $("#" + modelName + "AmountTrendPercent").html(accMul(obj.percent,1).toLocaleString());
    /*if(obj.trend == -1){
        $("#" + modelName + "AmountTrend").attr("class","fa fa-caret-down text-red");
        $("#" + modelName + "AmountTrendPercent").attr("class","trend-down");
    }else if(obj.trend == 1){
        $("#" + modelName + "AmountTrend").attr("class","fa fa-caret-up text-green");
        $("#" + modelName + "AmountTrendPercent").attr("class","trend-up");
    }else{
        $("#" + modelName + "AmountTrend").attr("class","fa text-orange");
        $("#" + modelName + "AmountTrendPercent").attr("class","trend-keep");
    }*/
};

//获得环比
var getCircleCompare = function(preview,current){
    var prev = accMul(preview,1);
    var curr = accMul(current,1);

    if(prev > curr){
        return  accDiv(Math.round(accMul(accDiv(accSub(prev,curr),Math.abs(prev)),10000)),100);
    }else if(prev < curr){
        if(prev == 0){
            return  Number.POSITIVE_INFINITY;
        }
        return  accDiv(Math.round(accMul(accDiv(accSub(curr,prev),Math.abs(prev)),10000)),100);
    }else{
        return  0;
    }
};

//获得环比趋势
var getCircleCompareTrend = function(preview,current){
    var prev = accMul(preview,1);
    var curr = accMul(current,1);
    if(prev > curr){
        return  -1;      //下降
    }else if(prev < curr){
        return  1;       //上升
    }else{
        return  0;       //持平
    }
};