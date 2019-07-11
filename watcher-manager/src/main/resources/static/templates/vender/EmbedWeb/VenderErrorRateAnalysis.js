/**
 * Created by hsh on 2016/5/13.
 */
Template.VenderErrorRateAnalysis.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#VenderErrorRateAnalysis').addClass('active');

    area_agent_name=Template.currentData().area_agent_name;
    area_agent_key=Template.currentData().area_agent_key;

    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }

    var startDate=moment().subtract(3, 'month').startOf('month').format("YYYY-MM-DD");
    var endDate=moment().subtract(1, 'month').startOf('month').format("YYYY-MM-DD");

    var query = {
        "area_agent_key":area_agent_key,
        "area_agent_name":area_agent_name
    };

    var queryAll = {
        "startDate": startDate,
        "endDate": endDate,
        "area_agent_key":area_agent_key,
        "area_agent_name":area_agent_name
    };

    //数据初始化加载
    renderPage(queryAll);

    //选项初始化加载
    requestURL(dataService+"/Vender/getAgentAreaFilterOptions",query).done(function(data){

        $(".province").attr("multiple","multiple");
        renderOptions(".province",data.province)

        $(".city").attr("multiple","multiple");
        renderOptions(".city",data.city)

        $(".district").attr("multiple","multiple");
        renderOptions(".district",data.district)

        $(".province").multipleSelect({
            placeholder: "全部",
            width: 150,
            selectAll: false,
            filter: true
        });
        $(".city").multipleSelect({
            placeholder: "全部",
            width: 150,
            selectAll: false,
            filter: true
        });
        $(".district").multipleSelect({
            placeholder: "全部",
            //selectAllText:"全部",
            width: 150,
            selectAll: false,
            filter: true
        });

    });

    $(".search").click(function(){
        /*日期*/
        var tempDate=new Date();
        var dateType=$(this).parent().find(".dateType").val();
        if(dateType=="threeMonth"){
            var startDate=moment().subtract(3, 'month').startOf('month').format("YYYY-MM-DD");
            var endDate=moment().subtract(1, 'month').startOf('month').format("YYYY-MM-DD");
        }else if(dateType=="thisYear"){
            var startDate=tempDate.getFullYear()+"-01-01";
            var endDate=moment().subtract(1, 'month').startOf('month').format("YYYY-MM-DD");
        }else if(dateType="lastYear"){
            if(tempDate.getFullYear()-1==2016) {
                var startDate = tempDate.getFullYear() - 1 + "-09-01";
                var endDate = tempDate.getFullYear() - 1 + "-12-01";
            }else{
                var startDate = tempDate.getFullYear() - 1 + "-01-01";
                var endDate = tempDate.getFullYear() - 1 + "-12-01";
            }
        }
        var province=$(this).parent().find(".province").val();
        var city = $(this).parent().find(".city").val();
        var district = $(this).parent().find(".district").val();

        var query={
            "startDate":startDate,
            "endDate":endDate,
            "area_agent_key":area_agent_key,
            "province":province,
            "city":city,
            "district":district
        };

        $("#chartContent").hide();
        $("#loading").show();
        query=cleanParams(query);
        $("#chartContent").show();
        renderPage(query);

    });

};

var orderData,vender_company_key,vender_company_name,tempColumn=['a','b','c','d','e','f','g','h','i','j','k','l','m'];

function renderOptions(sel,data){
    $(sel).empty();
    data.forEach(function(ele){
        $(sel).append("<option value='"+ele+"'>"+ele+"</option>")
    });
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

function renderPage(filter){
    //var dateGap = -15;
    $("#chartContent").hide();
    $("#loading").show();
    var promise = getAggregateWebTrafficData(filter);
    promise.done(function(ret){
        $("#chartContent").show();
        $("#loading").hide();

        renderTable("#ErrorRateAnalysisTable",dataProcess(ret));

    });

}

function getAggregateWebTrafficData(filter){
    //clean parameters
    var query = _.clone(filter);
//    var flag = query["dateType"];
    var flag = $(".dateType").val();
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    delete query["dateType"];
    var dfd = $.Deferred();
    requestURL(dataService+"/Vender/getAgentErrorRateAnalysis",query).done(function(ret){
        dfd.resolve(ret)
    });

    return dfd.promise()
}

function renderTable(tableName,data) {
    var dataValue=$(".dateType").val();
    var tempArray=[];
    var num=0;
    if(dataValue=="threeMonth"){
        num=3;
    }else if(dataValue=="thisYear"){
        num=moment().subtract(1, 'month').startOf('month').format("YYYY-MM-DD").split("-")[1];
    }else if(dataValue=="lastYear"){
        var tempDate=new Date();
        if(tempDate.getFullYear()-1==2016){
            num=4;
        }else{
            num=12;
        }
    }
    var columns=[{field:'vender_province_name',title:'省份',sortable:true},{field:'vender_city_name',title:'地市',sortable:true},{field:'vender_district_name',title:'县区',sortable:true},{field:'vender_parent_name',title:'客户名称',sortable:true}]
    var j=num;
    for(var i=0;i<num;i++) {
        var dateArrayTemp1 = moment().subtract(j, 'month').startOf('month').format("YYYY-MM-DD").split("-")[1];
        columns.push({field: tempColumn[i], title: dateArrayTemp1 + "月", sortable: true});
        j--;
    }
    var dateArrayTemp3 = "累计失误率";
    columns.push({field: 'm', title: dateArrayTemp3, sortable: true});


    $(tableName).bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        data:data,
        columns: columns
    });
}

function dataCenterProcess(data,num){
    var tempArray=[];
    data.forEach(function(e){
        var tempMap=new Map();
        for(var i=0;i<num;i++)
        {
            tempMap[tempColumn[i]] = "0.0%";
        }
        tempMap.dd=0;
        tempMap.ee=0;
        if(e.recycleNum!="-") {
            if(findSortNum(tempArray, e.registerCnt)!="false"){
                var i=parseInt(findSortNum(tempArray, e.registerCnt));
                tempArray[i].dd+= parseInt(e.oldNewOrderCnt);
                tempArray[i].ee+= parseInt(e.rate);
                var dateTemp=dateSortArray(num, e.recycleNum);
                if(e.rate==0){
                    tempArray[i][tempColumn[dateTemp]]="1";
                }else
                    tempArray[i][tempColumn[dateTemp]]=((e.oldNewOrderCnt/ e.rate)*100).toFixed(1)+"%";
            }else{
                tempMap.vender_province_name = e.vender_province_name;
                tempMap.vender_city_name = e.vender_city_name;
                tempMap.vender_district_name = e.vender_district_name;
                tempMap.vender_parent_name = e.vender_parent_name;
                tempMap.vender_parent_key= e.registerCnt;
                tempMap.dd+= parseInt(e.oldNewOrderCnt);
                tempMap.ee+= parseInt(e.rate);
                var dateTemp=dateSortArray(num, e.recycleNum);
                if(e.rate==0){
                    tempMap[tempColumn[dateTemp]]="1";
                }else
                    tempMap[tempColumn[dateTemp]]=((e.oldNewOrderCnt/ e.rate)*100).toFixed(1)+"%";
                tempArray.push(tempMap);
            }
        }else {
            tempMap.vender_province_name = e.vender_province_name;
            tempMap.vender_city_name = e.vender_city_name;
            tempMap.vender_district_name = e.vender_district_name;
            tempMap.vender_parent_name = e.vender_parent_name;
            tempMap.vender_parent_key= e.registerCnt;
            for(var i=0;i<num;i++)
            {
                tempMap[tempColumn[i]] = "0.0%";
            }
            tempMap.dd = 0;
            tempMap.ee = 0;
            tempArray.push(tempMap);
        }
    })

    return tempArray;
}

//获取总的数据
function  dataProcess(data){
    var dataValue=$(".dateType").val();
    var tempArray=[];
    if(dataValue=="threeMonth"){
        tempArray=dataCenterProcess(data,3);
    }else if(dataValue=="thisYear"){
        var num=moment().subtract(1, 'month').startOf('month').format("YYYY-MM-DD").split("-")[1];
        tempArray=dataCenterProcess(data,num);
    }else if(dataValue=="lastYear"){
        var tempDate=new Date();
        if(tempDate.getFullYear()-1==2016){
            tempArray=dataCenterProcess(data,4);
        }else{
            tempArray=dataCenterProcess(data,12);
        }
    }
    for(var k in tempArray){
        if(tempArray[k].ee!=0){
            tempArray[k].m=((tempArray[k].dd / tempArray[k].ee) * 100).toFixed(1)+"%";
        }else{
            tempArray[k].m="1";
        }
    }
    return tempArray;
}

function dateSortArray(num,value){
    var j=0;
    for(var i=num;i>0;i--){
        var dateArrayTemp=moment().subtract(i, 'month').startOf('month').format("YYYY-MM-DD").split("-")[1];
        if(value.split("-")[1]==dateArrayTemp){
            return j;
        }
        j++;
    }
}

function findSortNum(tempArray, key){
    for(var i in tempArray){
        if(tempArray[i].vender_parent_key==key){
            return i;
        }
    }
    return "false";
}
