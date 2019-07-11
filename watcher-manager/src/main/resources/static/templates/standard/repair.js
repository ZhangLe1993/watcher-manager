Template.repair.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operationPlatformTab').addClass('active');
    $('#supplyChainTab').addClass('active');
    $('#repair').addClass('active');
    //console.log('欢迎进入维修流程页面');
    browserRedirect();
    bsStep(5);

    //pcAndPhoneCartAnimate.setPcAndPhoneCartLoadingAnimate();
    //$(".tableStyle").css("background-color":"");
    //暂时不需要步骤条点击函数
    /*$(".go_to_step").on('click',function(){
        console.log($(this).attr("data-num"));
        var data_num = $(this).attr("data-num");
        bsStep(parseInt(data_num));
    });*/

    $("a[data-num='5']").parent().addClass("active-this");

    //小箭头闪烁
    setInterval(function(){
        var isOff = $("a[data-num='5']").attr("flash-on");
        if(isOff=='off'){
            $("a[data-num='5']").parent().addClass("active-this");
            $("a[data-num='5']").attr("flash-on","on");
        }else if(isOff=='on'){
            $("a[data-num='5']").parent().removeClass("active-this");
            $("a[data-num='5']").attr("flash-on","off");
        }
    },1000);

    var stay_clecy_width = $("#stay-clecy").width();
    if(stay_clecy_width<=221){
        $("span[myId='lh-c']").each(function(){
            $(this).attr("style","height:55px;font-size:12px;display:block;font-family:Microsoft YaHei;position:relative;padding-top:28px;font-weight:BOLD;margin-left:50px;");
        });

        $(".img-rounded").each(function(){
            $(this).attr("width","30px");
            $(this).attr("height","30px");
        });

        $("span[myId='lh-pic']").each(function(){
            $(this).attr("style","position:relative;float:left;display:block;margin-left: 14px;margin-top:16px;");
        });
    }

    $("div[to-show-click='true']").each(function(){
        $(this).click(function(){
            //console.log(unLock);
            if(unLock){
                //console.log('执行查询明细');
                unLock = false;
                var param = $(this).attr("to-show-params");
                var fix = $(this).attr("fix-show-params");
                //console.log("参数为："+fix+"-----"+param);
                $("#tablePanel").removeAttr("style");
                $("#showTablePanel").hide();
                $("#loadingPanel").show();
                $("div[to-show-click='true']").each(function(){
                    $(this).attr("style","cursor:not-allowed;");
                    $(this).children("div .box-footer").find("ul").find("li").each(function(){
                        $(this).find("a").attr("style","cursor:not-allowed;");
                    })
                });
                try{
                    myTable.getTable(fix,param);
                }catch(e){
                    unLock = true;
                }
            }
        });

        //初始化为小手样式
        $(this).attr('style','cursor:pointer;');
    });

    //drawNumCart();
    drawNumCartV2();

    toolTipCustom();
};

var unLock = true;

var preWhole = {whole_num:0,whole_money:0,whole_hours_int:0,whole_hours_smart:0};

//留货情况初始值定义
var preStayClecy = {stay_zero_num:0,stay_zero_money:0};
var preStayClecy1 = {stay_one_num:0,stay_one_money:0};
var preStayClecy2 = {stay_two_num:0,stay_two_money:0};


var preToRepairClecy = {to_repair_zero_num:0,to_repair_zero_money:0};
var preToRepairClecy1 = {to_repair_one_num:0,to_repair_one_money:0};
var preToRepairClecy2 = {to_repair_two_num:0,to_repair_two_money:0};


var preRepairClecy = {repair_zero_num:0,repair_zero_money:0};
var preRepairClecy1 = {repair_one_num:0,repair_one_money:0};
var preRepairClecy2 = {repair_two_num:0,repair_two_money:0};

var preToInsClecy = {to_ins_zero_num:0,to_ins_zero_money:0};
var preToInsClecy1 = {to_ins_one_num:0,to_ins_one_money:0};
var preToInsClecy2 = {to_ins_two_num:0,to_ins_two_money:0};

var preNeedToInsClecy = {need_to_ins_zero_num:0,need_to_ins_zero_money:0};
var preNeedToInsClecy1 = {need_to_ins_one_num:0,need_to_ins_one_money:0};
var preNeedToInsClecy2 = {need_ins_to_two_num:0,need_to_ins_two_money:0};


var myTable = {
    getTable:function(fix,param){
        //console.log('获取table');
        getDetailData(fix,param);
    }
};

/**
 * selector为选择器  1  为 id选择器，默认为ID选择器， 2 为 class选择器（可自行扩展）
 *
 * from  prevNum  to num
 * 从  prevNum  滚动到  num
 * @param selector
 * @param selectorType
 * @param prevNum
 * @param num
 */
function scrollNum(selector,prevNum,num){
    var fromNum = prevNum;
    if(prevNum==undefined || prevNum == null || prevNum==''){
        fromNum = 0;
    }
    //console.log(fromNum+"-->"+num);
    $("div[name='"+selector+"']").lemCounter({
        value_to: num,
        value_from: fromNum,
        animate_duration: 3,
        locale: 'en-US'
    });
}

function scrollNumForSpan(selector,prevNum,num){
    var fromNum = prevNum;
    if(prevNum==undefined || prevNum == null || prevNum==''){
        fromNum = 0;
    }
    //console.log(fromNum+"-->"+num);
    $("span[name='"+selector+"']").lemCounter({
        value_to: num,
        value_from: fromNum,
        animate_duration: 3,
        locale: 'en-US'
    });
}

//求每一位的数值
function getIndexNum(num){
    var temp;
    var tNum = num;
    for(var i=0;i<length;i++){
        temp = tNum % 10;
        //sum=sum+a;//求和
        tNum=(tNum-temp)/10;
        //console.log("数字为："+temp);
    }
}

//求整数的位数
function getIntLength(num){
    if (num==0) {
        return 1;
    }
    var lenght = 0;
    for (var temp = num ; temp != 0; temp=Math.floor(temp/10)){
        lenght++;
    }
    return lenght;
}

//top部分主流程图渲染并定位当前位置
function bsStep(i) {
    $('.step').each(function() {
        var a, $this = $(this);
        if(i > $this.find('li').length) {
            //console.log('您输入数值已超过步骤最大数量' + $this.find('li').length + '！！！');
            a=$this.find('li').length;
        } else if(i == undefined && $this.data('step') == undefined) {
            a = 1
        } else if(i == undefined && $this.data('step') != undefined) {
            a = $(this).data('step');
        } else {
            a = i
        }
        $(this).find('li').removeClass('active');
        $(this).find('li:lt(' + a + ')').addClass('active');
    })
}

//明细表格操作列自定义按钮
function operateFormatter(value, row, index) {
    var temp = '<a id="show-detail" class="btn active" style="cursor:pointer;" href="javascript:void(0);">查看详细</a>';
    return [
        temp
    ].join('');
}

/***********************************************************************************************************************/

//渲染小卡片-api拆开 Version2
function drawNumCartV2(){
    //获取缓存
    requestURL(dataService+"/standard/getShelfKey", {}).done(function () {

        //渲染留货情况/风险预警/高危预警
        requestURL(dataService+"/standard/executeStayCycleSummary", {"dayNum": "0;7;10"}).done(function (data) {
            setDone(data,0);
            //console.log(data);
            //渲染留货情况
            drawStayCycle(preStayClecy,data.stay_cycle0);
            drawStayCycle1(preStayClecy1,data.stay_cycle7);
            drawStayCycle2(preStayClecy2,data.stay_cycle10);
            if(isDone()){
                setTimeout(function(){
                    drawWholeThing(preWhole,wholeThing);
                },2000);
            }
        });

        //渲染送修情况/风险预警/高危预警
        requestURL(dataService+"/standard/executeToRepairCycleSummary", {"dayNum": "0;4;6"}).done(function (data) {
            setDone(data,1);
            //console.log(data);
            //渲染送修在途情况
            drawToRepairCycle(preToRepairClecy,data.to_repair_cycle0);
            drawToRepairCycle1(preToRepairClecy1,data.to_repair_cycle4);
            drawToRepairCycle2(preToRepairClecy2,data.to_repair_cycle6);
            if(isDone()){
                setTimeout(function(){
                    drawWholeThing(preWhole,wholeThing);
                },2000);
            }
        });

        //渲染维修情况/风险预警/高危预警
        requestURL(dataService+"/standard/executeRepairBusinessCycleSummary", {"dayNum": "0;7;10"}).done(function (data) {
            setDone(data,2);
            //console.log(data);
            //渲维修接收情况
            drawRepairCycle(preRepairClecy,data.repair_business_cycle0);
            drawRepairCycle1(preRepairClecy1,data.repair_business_cycle7);
            drawRepairCycle2(preRepairClecy2,data.repair_business_cycle10);
            if(isDone()){
                setTimeout(function(){
                    drawWholeThing(preWhole,wholeThing);
                },2000);
            }
        });

        //渲染送检情况/风险预警/高危预警
        requestURL(dataService+"/standard/executeToInsCycleSummary", {"dayNum": "0;3;5"}).done(function (data) {
            setDone(data,3);
            //console.log(data);
            //渲送检在途情况
            drawToInsCycle(preToInsClecy,data.to_ins_cycle0);
            drawToInsCycle1(preToInsClecy1,data.to_ins_cycle3);
            drawToInsCycle2(preToInsClecy2,data.to_ins_cycle5);
            if(isDone()){
                setTimeout(function(){
                    drawWholeThing(preWhole,wholeThing);
                },2000);
            }
        });

        //渲染待检情况/风险预警/高危预警
        requestURL(dataService+"/standard/executeNeedToInsCycleSummary", {"dayNum": "0;3;7"}).done(function (data) {
            setDone(data,4);
            //console.log(data);
            //待质检情况
            drawNeedToInsCycle(preNeedToInsClecy,data.need_to_ins_cycle0);
            drawNeedToInsCycle1(preNeedToInsClecy1,data.need_to_ins_cycle3);
            drawNeedToInsCycle2(preNeedToInsClecy2,data.need_to_ins_cycle7);
            if(isDone()){
                setTimeout(function(){
                    drawWholeThing(preWhole,wholeThing);
                },2000);
            }
        });
    });

}

var wholeThing = [];

var apiDone = {stay:false,toRepair:false,repair:false,toIns:false,needIns:false};

var setDone = function(source,who){
    switch (who){
        case 0:
            apiDone.stay = true;
            wholeThing.stay_cycle0 = source.stay_cycle0;
            break;
        case 1:
            apiDone.toRepair = true;
            wholeThing.to_repair_cycle0 = source.to_repair_cycle0;
            break;
        case 2:
            apiDone.repair = true;
            wholeThing.repair_business_cycle0 = source.repair_business_cycle0;
            break;
        case 3:
            apiDone.toIns = true;
            wholeThing.to_ins_cycle0 = source.to_ins_cycle0;
            break;
        case 4:
            apiDone.needIns = true;
            wholeThing.need_to_ins_cycle0 = source.need_to_ins_cycle0;
            break;
    }
}

var isDone = function(){
    if(apiDone.stay && apiDone.toRepair && apiDone.repair && apiDone.toIns){// && apiDone.needIns  去掉
        return true;
    }
    return false;
}

//渲染小卡片
function drawNumCart(){
    var query = {};
    requestURL(dataService+"/standard/executeMaintainSummary", query).done(function (data) {
        //console.log(data);
        //总体情况
        setTimeout(function(){
            drawWholeThing(preWhole,data);
        },2000);


        //渲染留货情况
        drawStayCycle(preStayClecy,data.stay_cycle0);
        drawStayCycle1(preStayClecy1,data.stay_cycle7);
        drawStayCycle2(preStayClecy2,data.stay_cycle10);

        //渲染送修在途情况
        drawToRepairCycle(preToRepairClecy,data.to_repair_cycle0);
        drawToRepairCycle1(preToRepairClecy1,data.to_repair_cycle4);
        drawToRepairCycle2(preToRepairClecy2,data.to_repair_cycle6);

        //渲维修接收情况
        drawRepairCycle(preRepairClecy,data.repair_business_cycle0);
        drawRepairCycle1(preRepairClecy1,data.repair_business_cycle7);
        drawRepairCycle2(preRepairClecy2,data.repair_business_cycle10);

        //渲送检在途情况
        drawToInsCycle(preToInsClecy,data.to_ins_cycle0);
        drawToInsCycle1(preToInsClecy1,data.to_ins_cycle3);
        drawToInsCycle2(preToInsClecy2,data.to_ins_cycle5);

        //渲送检在途情况
        drawNeedToInsCycle(preNeedToInsClecy,data.need_to_ins_cycle0);
        drawNeedToInsCycle1(preNeedToInsClecy1,data.need_to_ins_cycle3);
        drawNeedToInsCycle2(preNeedToInsClecy2,data.need_to_ins_cycle7);
    });
}

//渲染总体情况
function drawWholeThing(from,to){
    if (!phoneOrPc()){
        phoneAnimate.clearPhoneLoadingAnimate();
    }
    var dir_whole_num = to.stay_cycle0.count*1 + to.to_repair_cycle0.count*1 + to.repair_business_cycle0.count*1 + to.to_ins_cycle0.count*1; // 暂时去掉  + to.need_to_ins_cycle0.count*1
    var dir_whole_money = to.stay_cycle0.amount*1 + to.to_repair_cycle0.amount*1 + to.repair_business_cycle0.amount*1 + to.to_ins_cycle0.amount*1;// 暂时去掉 + to.need_to_ins_cycle0.amount*1

    //var dir_whole_hours = to.repair_cycle.repairCycleAvgTime*1.0 + to.to_ins_cycle.toInsCycleAvgTime*1.0 + to.need_to_ins_cycle.needToInsCycleAvgTime*1.0;
    //var dir_whole_hours = accAdd(to.need_to_ins_cycle0.avgTime*1.0,accAdd(accAdd(to.stay_cycle0.avgTime*1.0,to.to_repair_cycle0.avgTime*1.0),accAdd(to.repair_business_cycle0.avgTime*1.0,to.to_ins_cycle0.avgTime*1.0)));

    var real_whole_hours = accAdd(accAdd(to.stay_cycle0.totalTime*1.0,to.to_repair_cycle0.totalTime*1.0),accAdd(to.repair_business_cycle0.totalTime*1.0,to.to_ins_cycle0.totalTime*1.0));

    var dir_whole_hours = accDiv(real_whole_hours,dir_whole_num).toFixed(1);

    //dir_whole_hours = accAdd(to.repair_cycle.repairCycleAvgTime*1.0,to.to_ins_cycle.toInsCycleAvgTime*1.0);


    scrollNum('counter-goods-num',from.whole_num,dir_whole_num);
    scrollNum('counter-goods-money',from.whole_money,dir_whole_money);

    var dir_whole_hours_int = parseInt(dir_whole_hours);
    var flt = accSub(dir_whole_hours,dir_whole_hours_int);

    var flt_ln=(dir_whole_hours.toString()).length-(dir_whole_hours_int.toString()).length-1;
    var dir_whole_hours_smart=(flt.toString()).substring(2,(flt_ln+2));
    //console.log(dir_whole_hours_int);
    //console.log(dir_whole_hours_smart);
    if(dir_whole_hours_int == '' || dir_whole_hours_int == null){
        dir_whole_hours_int = 0;
    }
    if(dir_whole_hours_smart == '' || dir_whole_hours_smart == null){
        dir_whole_hours_smart = 0;
    }
    var isFirst = $("div[name='counter-all-hours']").attr("load-is");
    if(isFirst=='first'){
        $("div[name='counter-all-hours']").html('');
        $("div[name='counter-all-hours']").append('<span name="counter-all-hours-int">0</span>');
        $("div[name='counter-all-hours']").append('<span name="counter-all-hours-split">.</span>');
        $("div[name='counter-all-hours']").append('<span name="counter-all-hours-smart">0</span>');
        $("div[name='counter-all-hours']").attr("load-is","other");
    }

    scrollNumForSpan('counter-all-hours-int',from.whole_hours_int,dir_whole_hours_int);
    scrollNumForSpan('counter-all-hours-smart',from.whole_hours_smart,dir_whole_hours_smart);

    preWhole.whole_num = dir_whole_num*1;
    preWhole.whole_money = dir_whole_money*1;
    preWhole.whole_hours_int = dir_whole_hours_int*1;
    preWhole.whole_hours_smart = dir_whole_hours_smart*1;
}

/***********************************************************************************************************************/
//渲染留货情况
function drawStayCycle(from,to){
    //pcAndPhoneCartAnimate.clearPcAndPhoneCartLoadingAnimate();
    $("span[num-appends='0-num-stay']").lemCounter({
        value_to: to.count,
        value_from: from.stay_zero_num,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='0-num-stay']").removeAttr("style");
    $("span[num-appends='0-money-stay']").lemCounter({
        value_to: to.amount,
        value_from: from.stay_zero_money,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='0-money-stay']").removeAttr("style");
    $("span[num-appends='0-hours-stay']").text(to.avgTime);
    $("span[num-appends='0-hours-stay']").removeAttr("style");
    preStayClecy.stay_zero_num = to.count*1;
    preStayClecy.stay_zero_money = to.amount*1;
}

//渲染留货风险预警情况
function drawStayCycle1(from,to){
    $("span[num-appends='1-num-stay']").removeAttr("style");
    $("span[num-appends='1-num-stay']").lemCounter({
        value_to: to.count,
        value_from: from.stay_one_num,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='1-money-stay']").removeAttr("style");
    $("span[num-appends='1-money-stay']").lemCounter({
        value_to: to.amount,
        value_from: from.stay_one_money,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='1-hours-stay']").removeAttr("style");
    $("span[num-appends='1-hours-stay']").text(to.avgTime);

    preStayClecy1.stay_one_num = to.count*1;
    preStayClecy1.stay_one_money = to.amount*1;
}

//渲染留货高危预警情况
function drawStayCycle2(from,to){
    $("span[num-appends='2-num-stay']").removeAttr("style");
    $("span[num-appends='2-num-stay']").lemCounter({
        value_to: to.count,
        value_from: from.stay_two_num,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='2-money-stay']").removeAttr("style");
    $("span[num-appends='2-money-stay']").lemCounter({
        value_to: to.amount,
        value_from: from.stay_two_money,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='2-hours-stay']").removeAttr("style");
    $("span[num-appends='2-hours-stay']").text(to.avgTime);

    preStayClecy2.stay_two_num = to.count*1;
    preStayClecy2.stay_two_money = to.amount*1;
}
/***********************************************************************************************************************/

/***********************************************************************************************************************/
//渲染送修在途情况
function drawToRepairCycle(from,to){
    $("span[num-appends='0-num-to-repair']").removeAttr("style");
    $("span[num-appends='0-num-to-repair']").lemCounter({
        value_to: to.count,
        value_from: from.to_repair_zero_num,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='0-money-to-repair']").removeAttr("style");
    $("span[num-appends='0-money-to-repair']").lemCounter({
        value_to: to.amount,
        value_from: from.to_repair_zero_money,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='0-hours-to-repair']").removeAttr("style");
    $("span[num-appends='0-hours-to-repair']").text(to.avgTime);

    preToRepairClecy.to_repair_zero_num = to.count*1;
    preToRepairClecy.to_repair_zero_money = to.amount*1;
}

//渲染送修在途风险预警情况
function drawToRepairCycle1(from,to){
    $("span[num-appends='1-num-to-repair']").removeAttr("style");
    $("span[num-appends='1-num-to-repair']").lemCounter({
        value_to: to.count,
        value_from: from.to_repair_one_num,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='1-money-to-repair']").removeAttr("style");
    $("span[num-appends='1-money-to-repair']").lemCounter({
        value_to: to.amount,
        value_from: from.to_repair_one_money,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='1-hours-to-repair']").removeAttr("style");
    $("span[num-appends='1-hours-to-repair']").text(to.avgTime);

    preToRepairClecy1.to_repair_one_num = to.count*1;
    preToRepairClecy1.to_repair_one_money = to.amount*1;
}

//渲染送修在途高危预警情况
function drawToRepairCycle2(from,to){
    $("span[num-appends='2-num-to-repair']").removeAttr("style");
    $("span[num-appends='2-num-to-repair']").lemCounter({
        value_to: to.count,
        value_from: from.to_repair_two_num,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='2-money-to-repair']").removeAttr("style");
    $("span[num-appends='2-money-to-repair']").lemCounter({
        value_to: to.amount,
        value_from: from.to_repair_two_money,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='2-hours-to-repair']").removeAttr("style");
    $("span[num-appends='2-hours-to-repair']").text(to.avgTime);

    preToRepairClecy2.to_repair_two_num = to.count*1;
    preToRepairClecy2.to_repair_two_money = to.amount*1;
}
/***********************************************************************************************************************/

/***********************************************************************************************************************/
//渲染维修接收情况
function drawRepairCycle(from,to){
    $("span[num-appends='0-num-repair']").removeAttr("style");
    $("span[num-appends='0-num-repair']").lemCounter({
        value_to: to.count,
        value_from: from.repair_zero_num,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='0-money-repair']").removeAttr("style");
    $("span[num-appends='0-money-repair']").lemCounter({
        value_to: to.amount,
        value_from: from.repair_zero_money,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='0-hours-repair']").removeAttr("style");
    $("span[num-appends='0-hours-repair']").text(to.avgTime);

    preRepairClecy.repair_zero_num = to.count*1;
    preRepairClecy.repair_zero_money = to.amount*1;
}

//渲染维修接收风险预警情况
function drawRepairCycle1(from,to){
    $("span[num-appends='1-num-repair']").removeAttr("style");
    $("span[num-appends='1-num-repair']").lemCounter({
        value_to: to.count,
        value_from: from.repair_one_num,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='1-money-repair']").removeAttr("style");
    $("span[num-appends='1-money-repair']").lemCounter({
        value_to: to.amount,
        value_from: from.repair_one_money,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='1-hours-repair']").removeAttr("style");
    $("span[num-appends='1-hours-repair']").text(to.avgTime);

    preRepairClecy1.repair_one_num = to.count*1;
    preRepairClecy1.repair_one_money = to.amount*1;
}

//渲染维修接收高危预警情况
function drawRepairCycle2(from,to){
    $("span[num-appends='2-num-repair']").removeAttr("style");
    $("span[num-appends='2-num-repair']").lemCounter({
        value_to: to.count,
        value_from: from.repair_two_num,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='2-money-repair']").removeAttr("style");
    $("span[num-appends='2-money-repair']").lemCounter({
        value_to: to.amount,
        value_from: from.repair_two_money,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='2-hours-repair']").removeAttr("style");
    $("span[num-appends='2-hours-repair']").text(to.avgTime);

    preRepairClecy2.repair_two_num = to.count*1;
    preRepairClecy2.repair_two_money = to.amount*1;
}
/***********************************************************************************************************************/

/***********************************************************************************************************************/
//渲染送检在途情况
function drawToInsCycle(from,to){
    $("span[num-appends='0-num-to-ins']").removeAttr("style");
    $("span[num-appends='0-num-to-ins']").lemCounter({
        value_to: to.count,
        value_from: from.to_ins_zero_num,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='0-money-to-ins']").removeAttr("style");
    $("span[num-appends='0-money-to-ins']").lemCounter({
        value_to: to.amount,
        value_from: from.to_ins_zero_money,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='0-hours-to-ins']").removeAttr("style");
    $("span[num-appends='0-hours-to-ins']").text(to.avgTime);

    preToInsClecy.to_ins_zero_num = to.count*1;
    preToInsClecy.to_ins_zero_money = to.amount*1;
}

//渲染送检在途风险预警情况
function drawToInsCycle1(from,to){
    $("span[num-appends='1-num-to-ins']").removeAttr("style");
    $("span[num-appends='1-num-to-ins']").lemCounter({
        value_to: to.count,
        value_from: from.to_ins_one_num,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='1-money-to-ins']").removeAttr("style");
    $("span[num-appends='1-money-to-ins']").lemCounter({
        value_to: to.amount,
        value_from: from.to_ins_one_money,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='1-hours-to-ins']").removeAttr("style");
    $("span[num-appends='1-hours-to-ins']").text(to.avgTime);

    preToInsClecy1.to_ins_one_num = to.count*1;
    preToInsClecy1.to_ins_one_money = to.amount*1;
}

//渲染送检在途高危预警情况
function drawToInsCycle2(from,to){
    $("span[num-appends='2-num-to-ins']").removeAttr("style");
    $("span[num-appends='2-num-to-ins']").lemCounter({
        value_to: to.count,
        value_from: from.to_ins_two_num,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='2-money-to-ins']").removeAttr("style");
    $("span[num-appends='2-money-to-ins']").lemCounter({
        value_to: to.amount,
        value_from: from.to_ins_two_money,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='2-hours-to-ins']").removeAttr("style");
    $("span[num-appends='2-hours-to-ins']").text(to.avgTime);

    preToInsClecy2.to_ins_two_num = to.count*1;
    preToInsClecy2.to_ins_two_money = to.amount*1;
}
/***********************************************************************************************************************/

/***********************************************************************************************************************/
//渲染待质检情况
function drawNeedToInsCycle(from,to){
    $("span[num-appends='0-num-need-to-ins']").removeAttr("style");
    $("span[num-appends='0-num-need-to-ins']").lemCounter({
        value_to: to.count,
        value_from: from.need_to_ins_zero_num,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='0-money-need-to-ins']").removeAttr("style");
    $("span[num-appends='0-money-need-to-ins']").lemCounter({
        value_to: to.amount,
        value_from: from.need_to_ins_zero_money,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='0-hours-need-to-ins']").removeAttr("style");
    $("span[num-appends='0-hours-need-to-ins']").text(to.avgTime);

    preNeedToInsClecy.need_to_ins_zero_num = to.count*1;
    preNeedToInsClecy.need_to_ins_zero_money = to.amount*1;
}

//渲染待质检风险预警情况
function drawNeedToInsCycle1(from,to){
    $("span[num-appends='1-num-need-to-ins']").removeAttr("style");
    $("span[num-appends='1-num-need-to-ins']").lemCounter({
        value_to: to.count,
        value_from: from.need_to_ins_one_num,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='1-money-need-to-ins']").removeAttr("style");
    $("span[num-appends='1-money-need-to-ins']").lemCounter({
        value_to: to.amount,
        value_from: from.need_to_ins_one_money,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='1-hours-need-to-ins']").removeAttr("style");
    $("span[num-appends='1-hours-need-to-ins']").text(to.avgTime);

    preNeedToInsClecy1.need_to_ins_one_num = to.count*1;
    preNeedToInsClecy1.need_to_ins_one_money = to.amount*1;
}

//渲染待质检高危预警情况
function drawNeedToInsCycle2(from,to){
    $("span[num-appends='2-num-need-to-ins']").removeAttr("style");
    $("span[num-appends='2-num-need-to-ins']").lemCounter({
        value_to: to.count,
        value_from: from.need_to_ins_two_num,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='2-money-need-to-ins']").removeAttr("style");
    $("span[num-appends='2-money-need-to-ins']").lemCounter({
        value_to: to.amount,
        value_from: from.need_to_ins_two_money,
        animate_duration: 3,
        locale: 'en-US'
    });
    $("span[num-appends='2-hours-need-to-ins']").removeAttr("style");
    $("span[num-appends='2-hours-need-to-ins']").text(to.avgTime);

    preNeedToInsClecy2.need_to_ins_two_num = to.count*1;
    preNeedToInsClecy2.need_to_ins_two_money = to.amount*1;
}
/***********************************************************************************************************************/

//获取明细数据
function getDetailData(fix,param){
    var query = {stage:fix,dayNum:param};
    requestURL(dataService+"/standard/executeMaintainDetail", query).done(function (data) {
        //console.log(data);
        if(data.statusText != undefined && data.statusText=='error'){
            //console.log('服务异常');
            failureReleaseLock(false);
            customWarnModal('温馨提示','myWarnModal','myWarnModalLabel');
        }else{
            drawDetailTable(data,query);
        }
    });
}


//渲染明细表数据
function drawDetailTable(dataList,query){
    $("#detail_table").bootstrapTable('destroy').bootstrapTable({
        data: dataList,
        pagination: true,
        striped: true,
        pageSize: 5,
        search: true,
        pageList: [5, 10, 20, 50, 100, 200],
        exportDataType:'all',
        cdataExport: "maintainDataExport",
        /*rowStyle: function (row, index) {
            var classesArr = ['success', 'info'];
            var strclass = "";
            if (index % 2 === 0) {//偶数行
                strclass = classesArr[0];
            } else {//奇数行
                strclass = classesArr[1];
            }
            return { classes: strclass };
        },//隔行变色*/
        columns:[
            {
                field:'inventory_serial_number',
                title:'订单号',
                sortable:true
            },
            {
                field:'trade_source_type_name',
                title:'订单来源',
                sortable:true

            },
            {
                field:'product_category_name',
                title:'品类',
                sortable:true
            },
            {
                field:'product_brand_name',
                title:'品牌',
                sortable:true
            },
            {
                field:'inventory_product_name',
                title:'型号',
                sortable:true
            },
            {
                field:'inventory_sku_name',
                title:'sku',
                sortable:true
            },
            {
                field:'lock_date',
                title:'留货日期',
                sortable:true

            },
            {
                field:'to_repair_date',
                title:'送修日期',
                sortable:true
            },
            {
                field:'repair_receive_date',
                title:'维修接收日期',
                sortable:true
            },
            {
                field:'repair_send_back_date',
                title:'维修送回日期',
                sortable:true
            },
            {
                field:'send_back_date',
                title:'送回运营中心日期',
                sortable:true
            },
            {
                field:'ins_finish_date',
                title:'质检完成日期',
                sortable:true
            },
            {
                field:'warehouse_name',
                title:'当前仓库',
                sortable:true
            },
            {
                field:'shelf_code',
                title:'库位编码',
                sortable:true
            },
            {
                field:'shelf_name',
                title:'库位名称',
                sortable:true
            },
            {
                field:'document_item_level_name',
                title:'原等级',
                sortable:true
            },
            {
                field:'amount',
                title:'原等级金额',
                sortable:true
            },
            {
                field:'shelf_type_name',
                title:'维修后状态',
                sortable:true
            },
            {
                field:'out_warehouse_name',
                title:'出库仓库',
                sortable:true
            },
            {
                field:'repair_business',
                title:'维修商',
                sortable:true
            },
            {
                field:'f_type_name',
                title:'项目名称',
                sortable:true
            },
            {
                field:'total_cycle',
                title:'整体库存时长',
                sortable:true
            },
            {
                field:'stay_cycle',
                title:'留货时长',
                sortable:true
            },
            {
                field:'to_repair_cycle',
                title:'送修在途时长',
                sortable:true
            },
            {
                field:'repair_business_cycle',
                title:'维修商库存时长',
                sortable:true
            },
            {
                field:'to_ins_cycle',
                title:'送检在途时长',
                sortable:true
            },
            {
                field:'need_to_ins_cycle',
                title:'待质检时长',
                sortable:true
            }/*,
            {
                field:'operate',
                title:'操作',
                formatter: operateFormatter, //自定义方法，添加操作按钮
                events:operateEvents
            }*/
        ]
    });
    $("#maintainDataExport").click(function(){
        delete query.userId;
        delete query.sign;
        requestURL(dataService+"/standard/exportMaintainData",query).done(function(result){
            var url = Meteor.settings.public.downloadService.baseUrl+result.path
            console.log("url:" + url)
            var link = document.createElement("a");
            link.href = url;
            link.style = "visibility:hidden";
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        });
    });
    $("#loadingPanel").hide();
    $("#showTablePanel").show();
    unLock = true;
    $("div[to-show-click='true']").each(function(){
        $(this).attr("style","cursor:pointer;");
        $(this).children("div .box-footer").find("ul").find("li").each(function(){
            $(this).find("a").removeAttr("style");
        })
    });
}

var failureReleaseLock = function(success){
    if(!success){
        $("#loadingPanel").hide();
        $("#showTablePanel").hide();
    }
    releaseLock();
}

var releaseLock = function(){
    unLock = true;
    $("div[to-show-click='true']").each(function(){
        $(this).attr("style","cursor:pointer;");
        $(this).children("div .box-footer").find("ul").find("li").each(function(){
            $(this).find("a").removeAttr("style");
        })
    });
}

//数字格式化为 13,098类型的数字
function format_number(n){
    var b=parseInt(n).toString();
    var len=b.length;
    if(len<=3){return b;}
    var r=len%3;
    return r>0?b.slice(0,r)+","+b.slice(r,len).match(/\d{3}/g).join(","):b.slice(r,len).match(/\d{3}/g).join(",");
}

window.operateEvents = {
    "click #show-detail":function(e,value,row,index){
        //console.log(row);
        customModal("详细",row);
    }
}

//自定义弹出层
function customModal(title,data){
    $("#myModal").on('show.bs.modal', function () {
        $("#myModalLabel").text(title);
        /*$("#modalContent").bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data:data,
            columns: colums
        });*/
    });
    $("#myModal").modal();
}

function customWarnModal(title,modelSelector,titleSelector){
    $("#"+modelSelector).on('show.bs.modal', function () {
        $("#"+titleSelector).text(title);

    });
    $("#"+modelSelector).modal();
}

var browserRedirect = function() {
    if (!phoneOrPc()) {
        //跳转移动端页面
        //window.location.href="http://f.jcngame.com/fanfan20171208/mobile/index.html";
        //console.log('移动端');
        //移动端加载动画
        phoneAnimate.setPhoneLoadingAnimate();
        $("span[phone-d='true']").each(function(){
            $(this).attr("style","background-color: #47A3D1 !important;");
        });
    } else {
        //跳转pc端页面
        //window.location.href="http://f.jcngame.com/fanfan20171208//fanmai/index.html";
        //console.log('PC端');
    }
}

var counter = 0;
var phoneLoading;
var phoneAnimate = {
    setPhoneLoadingAnimate:function(){
        phoneLoading = setInterval(function(){
            //console.log(counter);
            if(counter<3){
                if(counter==0){
                    $("div[name='counter-goods-num']").html('');
                }
                $("div[name='counter-goods-num']").append('<span style="color:#00c0ef">.</span>');
                $("div[name='counter-goods-money']").append('<span style="color:#f39c12">.</span>');
                $("div[name='counter-all-hours']").append('<span style="color:#dd4b39">.</span>');
                counter++;
            }else if(counter==3){
                $("div[name='counter-goods-num']").html('');
                $("div[name='counter-goods-money']").html('');
                $("div[name='counter-all-hours']").html('');
                counter=0;
            }
        },2000);
    },
    clearPhoneLoadingAnimate:function(){
        clearInterval(phoneLoading);
    }
}


var pcAndPhoneCounter = 0;
var pcAndPhoneCartLoading;
var pcAndPhoneCartAnimate = {
    setPcAndPhoneCartLoadingAnimate:function(){
        pcAndPhoneCartLoading = setInterval(function(){
            //console.log(counter);
            if(pcAndPhoneCounter<3){
                if(pcAndPhoneCounter==0){
                    $("span[init-animate='true']").html('');
                }
                $("span[init-animate='true']").append('<span style="color:#00c0ef">.</span>');
                $("span[init-animate='true']").append('<span style="color:#f39c12">.</span>');
                $("span[init-animate='true']").append('<span style="color:#dd4b39">.</span>');
                pcAndPhoneCounter++;
            }else if(pcAndPhoneCounter==3){
                $("span[init-animate='true']").html('');
                pcAndPhoneCounter=0;
            }
        },2000);
    },
    clearPcAndPhoneCartLoadingAnimate:function(){
        clearInterval(pcAndPhoneCartLoading);
    }
}


/*判断终端是手机还是电脑--用于判断文件是否导出(电脑需要导出)*/
function phoneOrPc(){
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (bIsIpad || bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) {
        return false;
    } else {
        return true;
    }
}