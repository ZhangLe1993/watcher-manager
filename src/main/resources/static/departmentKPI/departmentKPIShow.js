/**
 * Created by liufangliang on 2017/4/19.
 */
Template.departmentKPIShow.rendered = function () {

    $('.navi-tab').removeClass('active');
    $('#managereport').addClass('active');
    $('#KPIFinishDetail').addClass('active');

    if(isMobile()){
        $('.sidebar-toggle').click();
    }

    //renderFirstDate();
    renderDate();
    renderOp(".department", ["主营","华强南","外采","大区","BD","MKT","爱机汇","口袋优品","海外事业部","运营中心","用户体验中心","IT", "前端产品", "后端产品","数据","人事","行政","财务","政府关系部","享换机","企业事业部","创新事业部"])

   // renderRealTime()
    renderDepartmentData();
    renderDepartmentRangeMonthData();

    $(".searchRangeMonth").click(function(){
        renderDepartmentRangeMonthData();
    })

}

function getSelectedFilter(Type) {
    var filter={};
    if (Type == "Up") {
        var dt = $('.selectLabelUp').text().replace(/ /g, "").split("~");
        var startDate = dt[0];
        var endDate = dt[1];
    } else if (Type == "Down") {
        var dt = $('.selectLabelDown').text().replace(/ /g, "").split("~");
        var startDate = dt[0];
        var endDate = dt[1];

        var department=[];
        department.push($(".department").val());
        filter.department=department;
    }

    filter.startDate=startDate;
    filter.endDate=endDate;

    return cleanParams(filter);
}

function formatData(data,part) {
    var obj = {
        date: [],
        department: [],

        revenue_target: [],  //营收
        gross_target: [],   //毛利
        charge_target: [],  //费用
        profit_target: [],  //净利

        revenue: [],
        gross: [],
        charge: [],
        profit: [],

        revenue_weight: [],
        gross_weight: [],
        charge_weight: [],
        profit_weight: [],

        revenue_finish_rate: [],
        gross_finish_rate: [],
        charge_finish_rate: [],
        profit_finish_rate: []
    }
    data.forEach(function (e) {
        if(part=="part1") {
            if(e.department=="主营"||e.department=="大区"||e.department=="BD"||e.department=="MKT"||e.department=="爱机汇"||e.department=="口袋优品"||e.department=="享换机"||e.department=="企业事业部") {
                var d = e.date.toString().split("-");
                obj.date.push(d[0] + "年" + d[1] + "月")
                obj.department.push(e.department)

                obj.revenue_target.push(parseFloat(e.revenue_target))
                obj.gross_target.push(parseFloat(e.gross_target))
                obj.charge_target.push(parseFloat(e.charge_target))
                obj.profit_target.push(parseFloat(e.profit_target))

                obj.revenue.push(parseFloat(e.revenue))
                obj.gross.push(parseFloat(e.gross))
                obj.charge.push(parseFloat(e.charge))
                obj.profit.push(parseFloat(e.profit))


                obj.revenue_weight.push(parseFloat(e.revenue_weight).toFixed(2))
                obj.gross_weight.push(parseFloat(e.gross_weight).toFixed(2))
                obj.charge_weight.push(parseFloat(e.charge_weight).toFixed(2))
                obj.profit_weight.push(parseFloat(e.profit_weight).toFixed(2))

                obj.revenue_finish_rate.push(parseFloat(e.revenue_finish_rate).toFixed(2))
                obj.gross_finish_rate.push(parseFloat(e.gross_finish_rate).toFixed(2))
                obj.charge_finish_rate.push(parseFloat(e.charge_finish_rate).toFixed(2))
                obj.profit_finish_rate.push(parseFloat(e.profit_finish_rate).toFixed(2))
            }
        }else if(part=="part2") {
            if(e.department!="主营"&&e.department!="华强南"&&e.department!="外采"&&e.department!="大区"&&e.department!="BD"&&e.department!="MKT"&&e.department!="爱机汇"&&e.department!="口袋优品"&&e.department!="创新事业部"&&e.department!="海外事业部"&&e.department!="享换机"&&e.department!="企业事业部") {
                var d = e.date.toString().split("-");
                obj.date.push(d[0] + "年" + d[1] + "月")
                obj.department.push(e.department)

                obj.charge_target.push(parseFloat(e.charge_target))

                obj.charge.push(parseFloat(e.charge))

                obj.revenue_weight.push(parseFloat(e.revenue_weight).toFixed(2))
                obj.gross_weight.push(parseFloat(e.gross_weight).toFixed(2))
                obj.charge_weight.push(parseFloat(e.charge_weight).toFixed(2))
                obj.profit_weight.push(parseFloat(e.profit_weight).toFixed(2))

                //charge_finish_rate
                if(eval(e.charge_finish_rate.split('%')[0])<=0||e.charge_finish_rate=="undefined"){
                    //obj.charge_finish_rate.push("0")
                    obj.charge_finish_rate.push(parseFloat(e.charge_finish_rate).toFixed(2))
                }else if(eval(e.charge_finish_rate.split('%')[0])>120){
                    //obj.charge_finish_rate.push("120")
                    obj.charge_finish_rate.push(parseFloat(e.charge_finish_rate).toFixed(2))
                }else{
                    obj.charge_finish_rate.push(parseFloat(e.charge_finish_rate).toFixed(2))
                }
                //profit_finish_rate
                if(eval(e.profit_finish_rate.split('%')[0])<=0||e.profit_finish_rate=="undefined"){
                    //obj.profit_finish_rate.push("0")
                    obj.profit_finish_rate.push(parseFloat(e.profit_finish_rate).toFixed(2))
                }else if(eval(e.profit_finish_rate.split('%')[0])>120){
                    //obj.profit_finish_rate.push("120")
                    obj.profit_finish_rate.push(parseFloat(e.profit_finish_rate).toFixed(2))
                }else{
                    obj.profit_finish_rate.push(parseFloat(e.profit_finish_rate).toFixed(2))
                }
            }
        }
    })


    return obj;
}

function renderDepartmentData() {
    var query = getSelectedFilter("Up");
    requestURL(dataService + "/departmentKPI/getDepartmentData", query).done(function (data) {
       //
        renderDepartmentPart1Chart(data)
        renderDepartmentPart2Chart(data)
    })
    //requestURL(dataService + "/departmentKPI/getDepartmentElseData", query).done(function (data) {
    //    //
    //    renderDepartmentPart2Chart(data)
    //})
}
function renderDepartmentRangeMonthData() {
    var query = getSelectedFilter("Down");
    requestURL(dataService + "/departmentKPI/getDepartmentElseData", query).done(function (data) {
        renderDepartmentRangeMonthChart(data)
    })
}

//排序工具
function sortArray(newBasicArray,sortingArray){
    var basicArray= _.clone(newBasicArray);
    var tempArray= _.sortBy(basicArray,function(num){return eval(num);});
    var sortAbleArray=[];
    var newSortArray=[];
    for(var i=0;i<tempArray.length;i++){
        for(var j=0;j<basicArray.length;j++){
            if(tempArray[i]==basicArray[j]){
                sortAbleArray.push(j);
                basicArray[j]=-200;
            }
        }
    }
    for(var k=0;k<sortAbleArray.length;k++){
        newSortArray.push(sortingArray[sortAbleArray[k]]);
    }
    return newSortArray;
}


//业务部门KPI达成情况/业务部门得分情况
function renderDepartmentPart1Chart(data) {

    var obj = formatData(data,"part1");

    var optionPart1={
        title:{
            text:"业务部门KPI达成情况"
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        legend:{
            data:["营收额","营收额目标值","毛利额","毛利额目标值","费用额","费用控制目标","净利额","净利额目标值"],
            selected: {
                "营收额目标值": false,
                "毛利额目标值": false,
                "费用控制目标": false,
                "净利额目标值": false,
            },
        },
        xAxis:[
            {
                type:"category",
                data:obj.department
            }
        ],
        yAxis : [
            {
                type : 'value'
            }
        ],
        tooltip:{
            trigger:"axis",
            axisPointer:{
                type:"shadow"
            },
            formatter:function(params,ticket,callback){
                var statsMap={};
                var str = params[0].name + '<br/>';

                var i=0;
                obj.department.forEach(function(e){
                    if(e==params[0].name&&statsMap[e]==undefined){

                        //if(eval(obj.revenue_finish_rate[i])>120){
                        //    obj.revenue_finish_rate[i]="120"
                        //}else if(eval(obj.revenue_finish_rate[i])<0){
                        //    obj.revenue_finish_rate[i]="0"
                        //}else if(obj.revenue_finish_rate[i]=="NaN"){
                        //    obj.revenue_finish_rate[i]="0"
                        //}
                        //if(eval(obj.profit_finish_rate[i])>120){
                        //    obj.profit_finish_rate[i]="120"
                        //}else if(eval(obj.profit_finish_rate[i])<0){
                        //    obj.profit_finish_rate[i]="0"
                        //}else if(obj.profit_finish_rate[i]=="NaN"){
                        //    obj.profit_finish_rate[i]="0"
                        //}
                        //if(eval(obj.charge_finish_rate[i])>120){
                        //    obj.charge_finish_rate[i]="120"
                        //}else if(eval(obj.charge_finish_rate[i])<0){
                        //    obj.charge_finish_rate[i]="0"
                        //}else if(obj.charge_finish_rate[i]=="NaN"){
                        //    obj.charge_finish_rate[i]="0"
                        //}
                        //if(eval(obj.gross_finish_rate[i])>120){
                        //    obj.gross_finish_rate[i]="120"
                        //}else if(eval(obj.gross_finish_rate[i])<0){
                        //    obj.gross_finish_rate[i]="0"
                        //}else if(obj.gross_finish_rate[i]=="NaN"){
                        //    obj.gross_finish_rate[i]="0"
                        //}

                        str += "营收额达成率" + ' : ' + obj.revenue_finish_rate[i] + '%<br/>'
                        str += "毛利额达成率" + ' : ' + obj.gross_finish_rate[i] + '%<br/>'
                        str += "费用控制达成率" + ' : ' + obj.charge_finish_rate[i] + '%<br/>'
                        str += "净利额达成率" + ' : ' + obj.profit_finish_rate[i] + '%<br/>'
                        statsMap[e]=1;
                    }
                    i++;
                })

                var revenue= 0,revenue_targe= 0,gross=0,gross_targe=0
                params.forEach(function(info){
                    if(info.seriesName.indexOf("率")>-1){
                        str += info.seriesName + ' : ' + info.value + '%<br/>'
                    }else{
                        str += info.seriesName + ' : ' + info.value + '元<br/>'
                    }
                });
                return str;
            }
        },
        series:[
            {
                name:"营收额",
                type:"bar",
                //stack: '营收额',
                label: {
                    normal: {
                        show: true,
                        position: 'bottom',
                        formatter:function(params,ticket,callback){
                            var str = (params.value/10000).toFixed(1);
                            return str;
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#56a36c'
                    }
                },
                data:obj.revenue
            },
            {
                name:"营收额目标值",
                type:"bar",
                //stack: '营收额',
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        formatter:function(params,ticket,callback){
                            var str = (params.value/10000).toFixed(1);
                            return str;
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#77c34f'
                    }
                },
                data:obj.revenue_target
            },
            {
                name:"毛利额",
                type:"bar",
                //stack: '毛利额',
                label: {
                    normal: {
                        show: true,
                        position: 'bottom',
                        formatter:function(params,ticket,callback){
                            var str = (params.value/10000).toFixed(1);
                            return str;
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#e08031'
                    }
                },
                data:obj.gross
            },
            {
                name:"毛利额目标值",
                type:"bar",
                //stack: '毛利额',
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        formatter:function(params,ticket,callback){
                            var str = (params.value/10000).toFixed(1);
                            return str;
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#c7ceb2'
                    }
                },
                data:obj.gross_target
            },
            //{
            //    name:"营收额达成率",
            //    type:"bar",
            //    data:obj.revenue_finish_rate
            //},
            //{
            //    name:"毛利额达成率",
            //    type:"bar",
            //    data:obj.gross_finish_rate
            //},
            {
                name:"费用额",
                type:"bar",
                //stack: '费用控制额',
                label: {
                    normal: {
                        show: true,
                        position: 'bottom',
                        formatter:function(params,ticket,callback){
                            var str = (params.value/10000).toFixed(1);
                            return str;
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#efcee8'
                    }
                },
                data:obj.charge
            },
            {
                name:"费用控制目标",
                type:"bar",
                //stack: '费用控制额',
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        formatter:function(params,ticket,callback){
                            var str = (params.value/10000).toFixed(1);
                            return str;
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#f3d7b5'
                    }
                },
                data:obj.charge_target
            },
            //{
            //    name:"费用控制率",
            //    type:"bar",
            //    yAxisIndex: 1,
            //    data:obj.charge_finish_rate
            //},
            {
                name:"净利额",
                type:"bar",
                //stack: '净利额',
                label: {
                    normal: {
                        show: true,
                        position: 'bottom',
                        formatter:function(params,ticket,callback){
                            var str = (params.value/10000).toFixed(1);
                            return str;
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#8192d6'
                    }
                },
                data:obj.profit
            },
            {
                name:"净利额目标值",
                type:"bar",
                //stack: '净利额',
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        formatter:function(params,ticket,callback){
                            var str = (params.value/10000).toFixed(1);
                            return str;
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#81c2d6'
                    }
                },
                data:obj.profit_target
            }
            //{
            //    name:"净利额达成率",
            //    type:"bar",
            //    yAxisIndex: 1,
            //    data:obj.profit_finish_rate
            //}

        ]
    }
    var departmentDataChart=echarts.init($("#departmentPart1DataChart").get(0));
    departmentDataChart.setOption(optionPart1)
    window.addEventListener("resize",departmentDataChart.resize)


    //业务部门得分情况
    var option2Data={
        "department":[],
        "revenueScore":[],
        "grossScore":[],
        "chargeScore":[],
        "profitScore":[],
        "score":[],
        "revenueRate":[],
        "profitRate":[],
        "chargeRate":[],
        "grossRate":[]
    }
    //var sl= data;
    var i=0;
    data.forEach(function(obj){

        if(obj.department=="主营"||obj.department=="大区"||obj.department=="BD"||obj.department=="MKT"||obj.department=="爱机汇"||obj.department=="口袋优品"||obj.department=="享换机"||obj.department=="企业事业部") {
            var revenue=obj.revenue_finish_rate
            if(eval(obj.revenue_finish_rate.split('%')[0])>120){
                obj.revenue_finish_rate="120%"
                //1==1;
            }else if(eval(obj.revenue_finish_rate.split('%')[0])<0||obj.revenue_finish_rate=="undefined"){
                obj.revenue_finish_rate="0%"
            }

            var revenueScore = (parseFloat(obj.revenue_weight) * parseFloat(obj.revenue_finish_rate)/100).toFixed(2);
            var gross=obj.gross_finish_rate
            if(eval(obj.gross_finish_rate.split('%')[0])>120){
                obj.gross_finish_rate="120%"
                //1==1;
            }else if(eval(obj.gross_finish_rate.split('%')[0])<0||obj.gross_finish_rate=="undefined"){
                obj.gross_finish_rate="0%"
            }

            var grossScore = (parseFloat(obj.gross_weight) * parseFloat(obj.gross_finish_rate)/100).toFixed(2);
            var charge=obj.charge_finish_rate
            if(eval(obj.charge_finish_rate.split('%')[0])>120){
                obj.charge_finish_rate="120%"
                //1==1;
            }else if(eval(obj.charge_finish_rate.split('%')[0])<0||obj.charge_finish_rate=="undefined"){
                obj.charge_finish_rate="0%"
            }

            var chargeScore = (parseFloat(obj.charge_weight) * parseFloat(obj.charge_finish_rate)/100).toFixed(2);
            var profit=obj.profit_finish_rate
            if(eval(obj.profit_finish_rate.split('%')[0])>120){
                obj.profit_finish_rate="120%"
                //1==1;
            }else if(eval(obj.profit_finish_rate.split('%')[0])<0||obj.profit_finish_rate=="undefined"){
                obj.profit_finish_rate="0%"
            }

            var profitScore = (parseFloat(obj.profit_weight) * parseFloat(obj.profit_finish_rate)/100).toFixed(2);
            option2Data.revenueScore.push(revenueScore)
            option2Data.grossScore.push(grossScore)
            option2Data.chargeScore.push(chargeScore)
            option2Data.profitScore.push(profitScore)
            option2Data.revenueRate.push(revenue)
            option2Data.grossRate.push(gross)
            option2Data.chargeRate.push(charge)
            option2Data.profitRate.push(profit)
            option2Data.score.push((eval(revenueScore) + eval(grossScore) + eval(chargeScore) + eval(profitScore)).toFixed(2));
            option2Data.department.push(obj.department+"("+option2Data.score[i]+")");
            i++;
        }
    })

    option2Data.revenueScore=sortArray(option2Data.score,option2Data.revenueScore);
    option2Data.grossScore=sortArray(option2Data.score,option2Data.grossScore);
    option2Data.chargeScore=sortArray(option2Data.score,option2Data.chargeScore);
    option2Data.profitScore=sortArray(option2Data.score,option2Data.profitScore);
    option2Data.revenueRate=sortArray(option2Data.score,option2Data.revenueRate);
    option2Data.grossRate=sortArray(option2Data.score,option2Data.grossRate);
    option2Data.chargeRate=sortArray(option2Data.score,option2Data.chargeRate);
    option2Data.profitRate=sortArray(option2Data.score,option2Data.profitRate);
    option2Data.department=sortArray(option2Data.score,option2Data.department);

    var option2={
        title:{
            text:"业务部门综合得分情况"
        },
        legend:{
            data:["营收额","毛利额","费用额","净利额"]
        },
        xAxis:{
            type:"value"
        },
        yAxis:{
            type:"category",
            data:option2Data.department
        },
        tooltip:{
            show:true,
            trigger:"axis",
            axisPointer:{
              type:"shadow"
            },
            formatter:function(params){
                var str="";
                var score=0

                var statsMap={};
                var i=0;
                option2Data.department.forEach(function(e){
                    if(e==params[0].name&&statsMap[e]==undefined){
                        str += "营收额达成率" + ' : ' + option2Data.revenueRate[i] + '<br/>'
                        str += "毛利额达成率" + ' : ' + option2Data.grossRate[i] + '<br/>'
                        str += "费用控制达成率" + ' : ' + option2Data.chargeRate[i] + '<br/>'
                        str += "净利额达成率" + ' : ' + option2Data.profitRate[i] + '<br/>'
                        statsMap[e]=1;
                    }
                    i++;
                })

                params.forEach(function(e){
                    //str+= e.seriesName+"得分:"+ e.value+"<br/>"
                    score+= parseFloat(e.value)

                })

                return params[0].name.split("(")[0]+"<br/>总得分:"+score.toFixed(2)+"<br/>"+str
            }
        },
        series:[
            {
                name:"营收额",
                type:"bar",
                stack:"score",
                label:{
                  normal:{
                      show:true,
                      position:"insideRight"
                  }
                },
                itemStyle: {
                    normal: {
                        color: '#56a36c'
                    }
                },
                data:option2Data.revenueScore
            },
            {
                name:"毛利额",
                type:"bar",
                stack:"score",
                label:{
                    normal:{
                        show:true,
                        position:"insideRight"
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#e08031'
                    }
                },
                data:option2Data.grossScore
            },
            {
                name:"费用额",
                type:"bar",
                stack:"score",
                label:{
                    normal:{
                        show:true,
                        position:"insideRight"
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#efcee8'
                    }
                },
                data:option2Data.chargeScore
            },
            {
                name:"净利额",
                type:"bar",
                stack:"score",
                label:{
                    normal:{
                        show:true,
                        position:"insideRight"
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#8192d6'
                    }
                },
                data:option2Data.profitScore
            }
        ]

    }
    var departmentScoreChart=echarts.init($("#departmentScorePart1Chart").get(0))
    departmentScoreChart.setOption(option2)
    window.addEventListener("resize",departmentScoreChart.resize)

}

//支持部门KPI达成情况/支持部门综合得分情况
function renderDepartmentPart2Chart(data) {

    var obj = formatData(data,"part2");

    var optionPart2={
        title:{
            text:"支持部门KPI达成情况"
        },
        legend:{
            data:["费用额","费用控制目标"],
            selected: {
                "营收额": false,
                "毛利额": false
            },
        },
        xAxis:[
            {
                type:"category",
                data:obj.department

            }
        ],
        yAxis:[
            {
                type: 'value'
            }
        ],
        tooltip:{
            trigger:"axis",
            axisPointer:{
                type:"shadow"
            },
            formatter:function(params,ticket,callback){
                var statsMap={};
                var str = params[0].name + '<br/>';

                var i=0;
                obj.department.forEach(function(e){
                    if(e==params[0].name&&statsMap[e]==undefined){
                        str += "费用控制达成率" + ' : ' + obj.charge_finish_rate[i] + '%<br/>'
                        statsMap[e]=1;
                    }
                    i++;
                })

                params.forEach(function(obj){
                    if(obj.seriesName.indexOf("率")>-1){
                        str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                    }else{
                        str += obj.seriesName + ' : ' + obj.value + '<br/>'
                    }
                });
                return str;
            }
        },
        series:[
            {
                name:"费用额",
                type:"bar",
                //stack: '费用控制额',
                label: {
                    normal: {
                        show: true,
                        position: 'bottom',
                        formatter:function(params,ticket,callback){
                            var str = (params.value/10000).toFixed(1);
                            return str;
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#efcee8'
                    }
                },
                data:obj.charge
            },
            {
                name:"费用控制目标",
                type:"bar",
                //stack: '费用控制额',
                label: {
                    normal: {
                        show: true,
                        position: 'top',
                        formatter:function(params,ticket,callback){
                            var str = (params.value/10000).toFixed(1);
                            return str;
                        }
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#f3d7b5'
                    }
                },
                data:obj.charge_target
            }
            //{
            //    name:"净利额达成率",
            //    type:"bar",
            //    itemStyle: {
            //        normal: {
            //            color: '#8192d6'
            //        }
            //    },
            //    data:obj.profit_finish_rate
            //}

        ]
    }
    var departmentDataChart=echarts.init($("#departmentPart2DataChart").get(0));
    departmentDataChart.setOption(optionPart2);
    window.addEventListener("resize",departmentDataChart.resize);


    //支持部门综合得分情况
    var option2Data={
        "department":[],
        "revenueScore":[],
        "grossScore":[],
        "chargeScore":[],
        "profitScore":[],
        "score":[],
        "chargeRate":[],
        "profitRate":[]
    }

    var i=0;
    data.forEach(function(obj){
        // console.log(e)
        if(obj.department!="主营"&&obj.department!="华强南"&&obj.department!="外采"&&obj.department!="大区"&&obj.department!="BD"&&obj.department!="MKT"&&obj.department!="爱机汇"&&obj.department!="口袋优品"&&obj.department!="创新事业部"&&obj.department!="海外事业部"&&obj.department!="享换机"&&obj.department!="企业事业部") {
            //option2Data.department.push(obj.department)
            var charge=obj.charge_finish_rate;
            if(eval(obj.charge_finish_rate.split('%')[0])>120){
                obj.charge_finish_rate="120"
                //1==1;
            }else if(eval(obj.charge_finish_rate.split('%')[0])<0||obj.charge_finish_rate=="undefined"||obj.charge_weight=="undefined"){
                obj.charge_finish_rate="0";
                obj.charge_weight="0";
            }
            var chargeScore = (parseFloat(obj.charge_weight) * parseFloat(obj.charge_finish_rate) / 100).toFixed(2);
            var profit=obj.profit_finish_rate
            if(eval(obj.profit_finish_rate.split('%')[0])>120){
                obj.profit_finish_rate="120"
                //1==1;
            }else if(eval(obj.profit_finish_rate.split('%')[0])<0||obj.profit_finish_rate=="undefined"||obj.profit_weight=="undefined"){
                obj.profit_finish_rate="0";
                obj.profit_weight="0";
            }
            var profitScore = (parseFloat(obj.profit_weight) * parseFloat(obj.profit_finish_rate) / 100).toFixed(2);
            option2Data.chargeScore.push(chargeScore)
            option2Data.profitScore.push(profitScore)
            option2Data.chargeRate.push(charge)
            option2Data.profitRate.push(profit)
            option2Data.score.push((eval(chargeScore)).toFixed(2));
            option2Data.department.push(obj.department+"("+option2Data.score[i]+")");
            i++;
        }

    })

    option2Data.chargeScore=sortArray(option2Data.score,option2Data.chargeScore);
    option2Data.profitScore=sortArray(option2Data.score,option2Data.profitScore);
    option2Data.chargeRate=sortArray(option2Data.score,option2Data.chargeRate);
    option2Data.profitRate=sortArray(option2Data.score,option2Data.profitRate);
    option2Data.department=sortArray(option2Data.score,option2Data.department);

    var option2={
        title:{
            text:"支持部门综合得分情况"
        },
        legend:{
            data:["费用控制得分","净利额达成率得分"]
        },
        xAxis:{
            type:"value"
        },
        yAxis:{
            type:"category",
            data:option2Data.department
        },
        tooltip:{
            show:true,
            trigger:"axis",
            axisPointer:{
                type:"shadow"
            },
            formatter:function(params){
                var str="";
                var score=0
                params.forEach(function(e){
                    //str+= e.seriesName+":"+ e.value+"<br/>"
                    score+= parseFloat(e.value)

                })

                var statsMap={};
                var i=0;
                option2Data.department.forEach(function(e){
                    if(e==params[0].name&&statsMap[e]==undefined){
                        str += "费用控制达成率" + ' : ' + option2Data.chargeRate[i] + '<br/>'
                        //str += "净利额达成率" + ' : ' + option2Data.profitRate[i] + '<br/>'
                        statsMap[e]=1;
                    }
                    i++;
                })

                return params[0].name.split("(")[0]+"<br/>总得分:"+score.toFixed(2)+"<br/>"+str
            }
        },
        series:[
            {
                name:"费用控制得分",
                type:"bar",
                stack:"score",
                label:{
                    normal:{
                        show:true,
                        position:"insideRight"
                    }
                },
                itemStyle: {
                    normal: {
                        color: '#efcee8'
                    }
                },
                data:option2Data.chargeScore
            },
            //{
            //    name:"净利额达成率得分",
            //    type:"bar",
            //    stack:"score",
            //    label:{
            //        normal:{
            //            show:true,
            //            position:"insideRight"
            //        }
            //    },
            //    itemStyle: {
            //        normal: {
            //            color: '#8192d6'
            //        }
            //    },
            //    data:option2Data.profitScore
            //}
        ]

    }
    var departmentScoreChart=echarts.init($("#departmentScorePart2Chart").get(0));
    departmentScoreChart.setOption(option2);
    window.addEventListener("resize",departmentScoreChart.resize);

}

//KPI达成情况历史记录
function renderDepartmentRangeMonthChart(data) {

    var obj = formatData(data,"part1");

    var option={
        title:{
            text:"KPI达成情况"
        },
        legend:{
            data:["营收完成率","毛利完成率","费用控制率","净利完成率"]
        },
        xAxis:[
            {
                tpye:"category",
                data:obj.date

            }
        ],
        yAxis:[
            {
                type:"value",
                axisLabel:{
                    formatter:function(value){
                        if(value==0){
                            return value;
                        }else{
                            return value+"%"
                        }
                    }
                }

            }
        ],
        tooltip:{
            trigger:"axis",
            axisPointer:{
                type:"line"
            },
            formatter:function(params){
                //console.log(params)
                var str=params[0].name+"<br/>"
                params.forEach(function(e){
                    str+= e.seriesName+":"+ e.value+"%<br/>";
                })
                return str
            }
        },
        series:[
            {
                name:"营收完成率",
                type:"line",
                itemStyle: {
                    normal: {
                        color: '#56a36c'
                    }
                },
                data:obj.revenue_finish_rate
            },
            {
                name:"毛利完成率",
                type:"line",
                itemStyle: {
                    normal: {
                        color: '#e08031'
                    }
                },
                data:obj.gross_finish_rate
            },
            {
                name:"费用控制率",
                type:"line",
                itemStyle: {
                    normal: {
                        color: '#efcee8'
                    }
                },
                data:obj.charge_finish_rate
            },
            {
                name:"净利完成率",
                type:"line",
                itemStyle: {
                    normal: {
                        color: '#8192d6'
                    }
                },
                data:obj.profit_finish_rate
            }

        ]
    }
    var departmentDataChart=echarts.init($("#departmentDataRangeChart").get(0));
    departmentDataChart.setOption(option)
    window.addEventListener("resize",departmentDataChart.resize)

}

function renderDate(){

    var minMonthDate = "2017-01-01";
    var maxMonthDate = moment().subtract(0, 'month').endOf('month').format("YYYY-MM-DD");
    var startMonthDate = moment().subtract(1, 'month').startOf('month').format("YYYY-MM-DD");
    var endMonthDate = moment().subtract(1, 'month').endOf('month').format("YYYY-MM-DD");
    if(startMonthDate<minMonthDate){
        startMonthDate = minMonthDate;
    }

    $(".selectLabelUp").html(startMonthDate+"~"+endMonthDate);
    $('.datePickerUp').daterangepicker(monthDatePickerOptionsFuncDetail(startMonthDate,endMonthDate,minMonthDate,maxMonthDate,false), pickDateRangeCallbackUp);

    $(".selectLabelDown").html(startMonthDate+"~"+endMonthDate);
    $('.datePickerDown').daterangepicker(monthDatePickerOptionsFunc(startMonthDate,endMonthDate,minMonthDate,false), pickDateRangeCallbackDown);

    $(".search").click(function(){
        var query = getSelectedFilter();
        renderPage(query);
    })

}

function pickDateRangeCallbackUp(start, end,label) {
    console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    var sdt = start.format('YYYY-MM-DD');
    var edt = moment(start).endOf('month').format("YYYY-MM-DD");
    $('.selectLabelUp').html(sdt+"~"+edt);
    renderDepartmentData();
}

function pickDateRangeCallbackDown(start, end,label) {
    console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    var sdt = start.format('YYYY-MM-DD');
    var edt = moment(end).endOf('month').format("YYYY-MM-DD");
    $('.selectLabelDown').html(sdt+"~"+edt);
    renderDepartmentRangeMonthData();
}

function renderOptions(sel,data){
    $(sel).empty();
    data.forEach(function(ele){
        $(sel).append("<option value='"+ele+"'>"+ele+"</option>")
    });
}


function renderOp(className, obj) {
    if (obj.length > 0) {
        obj.forEach(function (e) {
            $(className).append("<option value=" + e + ">" + e + "</option>")
        })
    }
}
