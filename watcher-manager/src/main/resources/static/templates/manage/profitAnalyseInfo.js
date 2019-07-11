Template.profitAnalyseInfo.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#managereport').addClass('active');
    $('#profitAnalyse').addClass('active');

    if (isMobile()) {
        $('.sidebar-toggle').click();
    }
    var dateGap = -6;
    var endDate = new Date().getNewDate(-1);
    var startDate = new Date(endDate).getNewDate(dateGap);
    $('.dateSelectLabel').html(startDate+"~"+endDate);
    var minDate="2016-01-01";
    $('.dateBtn').daterangepicker(datePickerOptionsFunc(startDate,endDate,minDate,false), pickDateRangeCallback);
    wholeTabPage({"startDate":startDate,"endDate":endDate});
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        // 获取已激活的标签页的名称
        var activeTab = e.target.hash;
        renderPage(activeTab)
    });
    //选择框变更时重新渲染表格
    $(".category").change(function(e){
        var activeTab =  $("#chartContent li.active>a").attr("href");
        renderPage(activeTab);
    })

    $(".level-category").change(function(e){
        //var activeTab =  $("#chartContent li.active>a").attr("href");
        //renderPage(activeTab);
        var levelCategory = $("#levelCategory").val(); //手机品类
        var levelBrand = $("#levelBrand").val();       //手机品牌
        linkSelectInit(levelCategory,levelBrand);
    })

    /*$(".brand").change(function(e){
        var activeTab =  $("#chartContent li.active>a").attr("href");
        renderPage(activeTab)
    })*/
    $("#search-btn").click(function(){
        //console.log('执行查询');
        var activeTab =  $("#chartContent li.active>a").attr("href");
        renderPage(activeTab);
    });

    $(".search").click(function(){
        var dateArray = $('.dateSelectLabel').html().split("~");
        getPriceFunc({"sdt":dateArray[0],"edt":dateArray[1]})
    })

    $("#type").change(function(){
        var type=$(this).val()
        switch (type){
            case "手机":
                $("#priceRange").val("0~300;300~1000;1000~2000;2000~3000;3000~")
                break
            case "平板":
                $("#priceRange").val("0~300;300~1000;1000~2000;2000~3000;3000~")
                break
            case "笔记本":
                $("#priceRange").val("0~500;500~1000;1000~2000;2000~")
                break
            case "摄影摄像":
                $("#priceRange").val("0~200;200~1000;1000~5000;5000~")
                break
            case "智能数码":
                $("#priceRange").val("0~50;50~300;300~800;800~")
                break
        }
    })
};


function linkSelectInit(categoryKey){
    requestURL(dataService+"/foundation/getProductBrandByCategoryKey",{"categoryId":categoryKey}).done(function(result){
        $("#levelBrand").html('');
        $("#levelBrand").append('<option value="null" selected>不限</option>');
        for(var i=0;i<result.length;i++){
            if(levelBrand == result[i].brandKey){
                $("#levelBrand").append('<option value="'+result[i].brandKey+'" selected>'+result[i].brandName+'</option>');
            }else{
                $("#levelBrand").append('<option value="'+result[i].brandKey+'">'+result[i].brandName+'</option>');
            }
        }
    });
}

function pickDateRangeCallback(start, end, label) {
    console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.dateSelectLabel').html(sdt+"~"+edt);
    var activeTab =  $("#chartContent li.active>a").attr("href");
    renderPage(activeTab)
}

function renderPage(activeTab){
    var dateArray = $('.dateSelectLabel').html().split("~");
    var filter = {"startDate":dateArray[0],"endDate":dateArray[1]}
    switch(activeTab) {
        case "#whole":
            wholeTabPage(filter);
            break;
        case "#brand":
            var type = $("#brandCategory").val();
            filter.type=type;
            brandTabPage(filter);
            break;
        case "#product":
            var type = $("#productCategory").val();
            filter.type=type;
            productTabPage(filter)
            break;
        case "#price":
            getPriceFunc({"sdt":dateArray[0],"edt":dateArray[1]})
            break;
        case "#level":
            var levelCategory = $("#levelCategory").val(); //手机品类
            var levelBrand = $("#levelBrand").val();       //手机品牌
            var once = $("#levelCategory").attr("my-init");
            if(once=='true'){
                linkSelectInit(levelCategory,levelBrand);
                $("#levelCategory").attr("my-init","false");
            }
            filter.levelCategory = levelCategory;
            filter.levelBrand = levelBrand;
            levelTabPage(filter);
            break

    }
}
//整体tab页面
function wholeTabPage(filter){
    $("#loading").show();
    $("#wholeContent").hide();
    requestURL(dataService+"/manage/getProfitAnalyseStatistic",filter).done(function(result){
        $("#loading").hide();
        $("#wholeContent").show();
        sourceFunc(result);
        var series = {
            saleDataList:[],
            recyclerDataList:[],
            profitDataList:[],
            rateDataList:[]
        };
        var resultByDate = _.groupBy(result,function(obj){return obj.date});
        for(var key in resultByDate){
            var recyclerDateTotal= 0,profitDateTotal= 0,saleDateTotal=0;
            var sourceList=["自营","BD","爱机汇",'店员宝'];
            resultByDate[key].forEach(function(ele){
                var source = ele.source;
                sourceList.remove(source);
                recyclerDateTotal+=parseFloat(ele.recyclerAmount);
                profitDateTotal+=parseFloat(ele.profitAmount);
                saleDateTotal+=parseFloat(ele.saleAmount);
                series.saleDataList.push({
                    "date":key,
                    "source":source,
                    "value":ele.saleAmount
                })
                series.recyclerDataList.push({
                    "date":key,
                    "source":source,
                    "value":ele.recyclerAmount
                })
                series.profitDataList.push({
                    "date":key,
                    "source":source,
                    "value":ele.profitAmount
                })
                series.rateDataList.push({
                    "date":key,
                    "source":source,
                    "value":(100.0*parseFloat(ele.profitAmount)/parseFloat(ele.saleAmount)).toFixed(2)
                })
            })
            //防止某天某个来源数据没有 start
            sourceList.forEach(function(source){
                series.saleDataList.push({
                    "date":key,
                    "source":source,
                    "value":undefined
                })
                series.recyclerDataList.push({
                    "date":key,
                    "source":source,
                    "value":undefined
                })
                series.profitDataList.push({
                    "date":key,
                    "source":source,
                    "value":undefined
                })
                series.rateDataList.push({
                    "date":key,
                    "source":source,
                    "value":undefined
                })
            })
            //防止某天某个来源数据没有 end
            //总计
            series.saleDataList.push({
                "date":key,
                "source":"总计",
                "value":saleDateTotal.toFixed(0)
            })
            series.recyclerDataList.push({
                "date":key,
                "source":"总计",
                "value":recyclerDateTotal.toFixed(0)
            })
            series.profitDataList.push({
                "date":key,
                "source":"总计",
                "value":profitDateTotal.toFixed(0)
            })
            series.rateDataList.push({
                "date":key,
                "source":"总计",
                "value":(100.0*parseFloat(profitDateTotal)/parseFloat(saleDateTotal)).toFixed(2)
            })
        }
        drawChart(series.recyclerDataList,"recyclerAmountChart");
        drawTable(_.sortBy(series.recyclerDataList,function(ele){return -new Date(ele.date)}),"#recycler_table");
        drawChart(series.saleDataList,"saleAmountChart");
        drawTable(_.sortBy(series.saleDataList,function(ele){return -new Date(ele.date)}),"#sale_table");
        drawChart(series.profitDataList,"profitAmountChart");
        drawTable(_.sortBy(series.profitDataList,function(ele){return -new Date(ele.date)}),"#profit_table");
        drawChart(series.rateDataList,"rateAmountChart",true);
        drawTable(_.sortBy(series.rateDataList,function(ele){return -new Date(ele.date)}),"#rate_table",true);
    });

    function drawChart(dataList,id,flag){
        var axisLabel={
            formatter: '￥{value}'
        };
        if(flag){
            axisLabel={
                formatter: '{value}%'
            }
        }
        var keyList= [],series={};
        var dataListByDate = _.groupBy(dataList,function(ele){return ele.date})
        for(var key in dataListByDate){
            keyList.push(key)
            dataListByDate[key].forEach(function(ele){
                var source = ele.source
                if(!series.hasOwnProperty(source)){
                    series[source]=[]
                }
                series[source].push(ele.value == undefined ? 0 : ele.value)
            })
        }
        var option = {
            title: {
                //text: title,
                x: "center",
                padding: [0, 0, 0, 50]
            },
            tooltip: {
                trigger: 'axis',
                formatter: function (params) {
                    var str = params[0].name + '<br/>';
                    params.forEach(function(obj){
                        if(id.indexOf("rate")>-1){
                            str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                        }else{
                            str += obj.seriesName + ' : ￥' + obj.value + '<br/>'
                        }
                    });
                    return str;
                }
            },
            legend: {
                data: ['自营', 'BD', '爱机汇','店员宝', '总计'],
                padding: [25, 0, 0, 0]
            },
            grid: {
                left: '3%',
                right: '4%',
                containLabel: true
            },
            toolbox: {
                feature: {
                }
            },
            xAxis: {
                type: 'category',
                    boundaryGap: false,
                    data: keyList
            },
            yAxis: [
                {
                    type: 'value',
                    axisLabel:axisLabel
                }
            ],
            series: [
                {
                    name: '自营',
                    type: 'line',
                    data: series["自营"]
                }, {
                    name: 'BD',
                    type: 'line',
                    data: series["BD"]
                },{
                    name: '爱机汇',
                    type: 'line',
                    data: series["爱机汇"]
                },{
                    name: '店员宝',
                    type: 'line',
                    data: series["店员宝"]
                },{
                    name: '总计',
                    type: 'line',
                    data: series["总计"]
                }
            ]
        };
        var chart = echarts.init(document.getElementById(id));
        chart.clear();
        chart.setOption(option);
        window.addEventListener('resize', chart.resize)
    }

    function drawTable(dataList,sel,flag){
        var data= []
        var dataByDate = _.groupBy(dataList,function(ele){return ele.date})
        for(var key in dataByDate){
            var obj = {"date":key};
            dataByDate[key].forEach(function(ele){
                var tar = ele.value == undefined ? 0 : ele.value;
                obj[ele.source]=flag?tar+"%":tar
            })
            data.push(obj)
        }
        $(sel).bootstrapTable('destroy').bootstrapTable({
            data: data,
            pagination: true,
            pageSize: 10,
            search: true,
            exportDataType:'all',
            columns:[
                {
                    field:'date',
                    title:'时间',
                    sortable:true,
                    sorter:function(value1,value2){
                        var value1=parseFloat(value1.replace("%",""));
                        var value2=parseFloat(value2.replace("%",""));
                        return value1>value2?1:value1<value2?-1:0
                    }
                },
                {
                    field:'自营',
                    title:'自营',
                    sortable:true,
                    sorter:function(value1,value2){
                        var value1=parseFloat(value1.replace("%",""));
                        var value2=parseFloat(value2.replace("%",""));
                        return value1>value2?1:value1<value2?-1:0
                    }
                },
                {
                    field:'BD',
                    title:'BD',
                    sortable:true,
                    sorter:function(value1,value2){
                        var value1=parseFloat(value1.replace("%",""));
                        var value2=parseFloat(value2.replace("%",""));
                        return value1>value2?1:value1<value2?-1:0
                    }
                },
                {
                    field:'爱机汇',
                    title:'爱机汇',
                    sortable:true,
                    sorter:function(value1,value2){
                        var value1=parseFloat(value1.replace("%",""));
                        var value2=parseFloat(value2.replace("%",""));
                        return value1>value2?1:value1<value2?-1:0
                    }
                },
                {
                    field:'店员宝',
                    title:'店员宝',
                    sortable:true,
                    sorter:function(value1,value2){
                        var value1=parseFloat(value1.replace("%",""));
                        var value2=parseFloat(value2.replace("%",""));
                        return value1>value2?1:value1<value2?-1:0
                    }
                },
                {
                    field:'总计',
                    title:'总计',
                    sortable:true,
                    sorter:function(value1,value2){
                        var value1=parseFloat(value1.replace("%",""));
                        var value2=parseFloat(value2.replace("%",""));
                        return value1>value2?1:value1<value2?-1:0
                    }
                }
            ]

        });
    }


    //基于来源
    function sourceFunc(result){
        var data=[];
        var resultBySource = _.groupBy(result,function(obj){return obj.source});
        var recyclerAmountTotal= 0,saleAmountTotal= 0,profitAmountTotal=0;
        for(var key in resultBySource){
            var recyclerAmountSource= 0,saleAmountSource= 0,profitAmountSource=0;
            resultBySource[key].forEach(function(ele){
                recyclerAmountTotal+=parseFloat(ele.recyclerAmount);
                saleAmountTotal+=parseFloat(ele.saleAmount);
                profitAmountTotal+=parseFloat(ele.profitAmount);
                recyclerAmountSource+=parseFloat(ele.recyclerAmount);
                saleAmountSource+=parseFloat(ele.saleAmount);
                profitAmountSource+=parseFloat(ele.profitAmount);
            });
            data.push({
                "source":key,
                "recyclerAmount":recyclerAmountSource.toFixed(0),
                "saleAmount":saleAmountSource.toFixed(0),
                "profitAmount":profitAmountSource.toFixed(0),
                "profitRate":(100.0*(parseFloat(profitAmountSource)/parseFloat(saleAmountSource))).toFixed(2)+"%"
            })
        }
        data.push({
            "source":"合计",
            "recyclerAmount":recyclerAmountTotal.toFixed(0),
            "saleAmount":saleAmountTotal.toFixed(0),
            "profitAmount":profitAmountTotal.toFixed(0),
            "profitRate":(100.0*(parseFloat(profitAmountTotal)/parseFloat(saleAmountTotal))).toFixed(2)+"%"
        });
        $("#whole_table").bootstrapTable('destroy').bootstrapTable({
            data: data,
            pagination: true,
            pageSize: 10,
            search: true,
            exportDataType:'all',
            columns:[
                {
                    field:'source',
                    title:'来源',
                    sortable:true
                },
                {
                    field:'recyclerAmount',
                    title:'回收额',
                    sortable:true
                },
                {
                    field:'saleAmount',
                    title:'销售额',
                    sortable:true
                },
                {
                    field:'profitAmount',
                    title:'利润额',
                    sortable:true
                },
                {
                    field:'profitRate',
                    title:'利润率',
                    sortable:true,
                    sorter:function(value1,value2){
                        var value1=parseFloat(value1.replace("%",""));
                        var value2=parseFloat(value2.replace("%",""));
                        return value1>value2?1:value1<value2?-1:0
                    }
                }
            ]

        });
    }



}

//品牌tab页面
function brandTabPage(filter){
    $("#loading").show();
    $("#brandContent").hide();
    requestURL(dataService+"/manage/getProfitAnalyseStatisticByBrand",filter).done(function(result){
        $("#loading").hide();
        $("#brandContent").show();

        drawTable(_.filter(result,function(ele){return ele.tag=="自营"}),"#brand_self_table");
        drawTable(_.filter(result,function(ele){return ele.tag=="BD"}),"#brand_bd_table");
        drawTable(_.filter(result,function(ele){return ele.tag=="爱机汇"}),"#brand_aijihui_table");
        drawTable(_.filter(result,function(ele){return ele.tag=="店员宝"}),"#brand_dyb_table")
    })

    function drawTable(data,sel){
        var dataList = _.map(data,function(ele){
            ele.rate=(100.0*parseFloat(ele.profitAmount)/parseFloat(ele.saleAmount)).toFixed(2)+"%"
            return ele
        })
        $(sel).bootstrapTable('destroy').bootstrapTable({
            data: dataList,
            pagination: true,
            pageSize: 10,
            search: true,
            exportDataType:'all',
            columns:[
                {
                    field:'name',
                    title:'品牌',
                    sortable:true
                },
                {
                    field:'recyclerAmount',
                    title:'回收额',
                    sortable:true
                },
                {
                    field:'saleAmount',
                    title:'销售额',
                    sortable:true
                },
                {
                    field:'profitAmount',
                    title:'利润额',
                    sortable:true
                },
                {
                    field:'rate',
                    title:'利润率',
                    sortable:true,
                    sorter:function(value1,value2){
                        var value1=parseFloat(value1.replace("%",""));
                        var value2=parseFloat(value2.replace("%",""));
                        return value1>value2?1:value1<value2?-1:0
                    }
                }
            ]

        });
    }
}


//等级tab页面
function levelTabPage(filter){
    $("#loading").show();
    $("#levelContent").hide();
    requestURL(dataService+"/manage/getProfitAnalyseStatisticByBrandAndCategory",filter).done(function(result){
        $("#loading").hide();
        $("#levelContent").show();

        drawTable(_.filter(result,function(ele){return ele.tag=="自营"}),"#level_self_table")
        drawTable(_.filter(result,function(ele){return ele.tag=="BD"}),"#level_bd_table")
        drawTable(_.filter(result,function(ele){return ele.tag=="爱机汇"}),"#level_aijihui_table")
        drawTable(_.filter(result,function(ele){return ele.tag=="店员宝"}),"#level_dyb_table")
    })

    function drawTable(data,sel){

        var dataList = _.map(data,function(ele){
            ele.rate=(100.0*parseFloat(ele.profitAmount)/parseFloat(ele.saleAmount)).toFixed(2)+"%"
            return ele
        });

        //var index = getSIndex(dataList);
        //将数组重新排序，S放到第一位
        dataList = pushStoFirst(dataList,getSIndex(dataList));

        $(sel).bootstrapTable('destroy').bootstrapTable({
            data: (data == undefined || data == null || data == []) ? [] : dataList,
            pagination: true,
            pageSize: 10,
            search: true,
            exportDataType:'all',
            columns:[
                {
                    field:'name',
                    title:'等级',
                    sortable:true
                },
                {
                    field:'recyclerAmount',
                    title:'回收额',
                    sortable:true,
                    formatter: function (value, row, index) {
                        return Math.round(value);
                    }
                },
                {
                    field:'saleAmount',
                    title:'销售额',
                    sortable:true,
                    formatter: function (value, row, index) {
                        return Math.round(value);
                    }
                },
                {
                    field:'profitAmount',
                    title:'利润额',
                    sortable:true,
                    formatter: function (value, row, index) {
                        return Math.round(value);
                    }
                },
                {
                    field:'rate',
                    title:'利润率',
                    sortable:true,
                    sorter:function(value1,value2){
                        var value1=parseFloat(value1.replace("%",""));
                        var value2=parseFloat(value2.replace("%",""));
                        return value1>value2?1:value1<value2?-1:0
                    }
                }
            ]

        });
    }
}


//型号tab页面
function productTabPage(filter){
    $("#loading").show();
    $("#productContent").hide();
    requestURL(dataService+"/manage/getProfitAnalyseStatisticByProduct",filter).done(function(result){
        $("#loading").hide();
        $("#productContent").show();
        drawTable(_.filter(result,function(ele){return ele.tag=="自营"}),"#product_self_table")
        drawTable(_.filter(result,function(ele){return ele.tag=="BD"}),"#product_bd_table")
        drawTable(_.filter(result,function(ele){return ele.tag=="爱机汇"}),"#product_aijihui_table")
        drawTable(_.filter(result,function(ele){return ele.tag=="店员宝"}),"#product_dyb_table")
    })

    function drawTable(data,sel){
        var dataList = _.map(data,function(ele){
            ele.rate=(100.0*parseFloat(ele.profitAmount)/parseFloat(ele.saleAmount)).toFixed(2)+"%"
            return ele
        })
        $(sel).bootstrapTable('destroy').bootstrapTable({
            data: dataList,
            pagination: true,
            pageSize: 10,
            search: true,
            exportDataType:'all',
            columns:[
                {
                    field:'name',
                    title:'型号',
                    sortable:true
                },
                {
                    field:'recyclerAmount',
                    title:'回收额',
                    sortable:true
                },
                {
                    field:'saleAmount',
                    title:'销售额',
                    sortable:true
                },
                {
                    field:'profitAmount',
                    title:'利润额',
                    sortable:true
                },
                {
                    field:'rate',
                    title:'利润率',
                    sortable:true,
                    sorter:function(value1,value2){
                        var value1=parseFloat(value1.replace("%",""));
                        var value2=parseFloat(value2.replace("%",""));
                        return value1>value2?1:value1<value2?-1:0
                    }
                }
            ]

        });
    }
}
//价格区间
function getPriceFunc(query){
    $(".search").attr("disabled",true);
    $("#priceLoading").show()
    $("#priceContent").hide()
    requestURL(dataService+"/profit/getPriceBetweenByCategory",$.extend({},query,{"type":$("#type").val(),"price":$("#priceRange").val(),"isTotal":"true"})).done(function(result) {
        $("#priceLoading").hide()
        $("#priceContent").show()
        $(".search").attr("disabled",false);
        drawTable(result,"#priceTable")
    })
    function drawTable(result,sel){
        var dataList = _.sortBy(result,function(obj){
            var tag = obj.tag
            var price  =obj.price.split("~")[0]
            return parseInt(tag=="自营"?100000:tag=="BD"?200000:tag=="爱机汇"?300000:400000)+parseInt(price)
        })
        var bdTotal=_.reduce(_.filter(dataList,function(obj){return obj.tag=="BD"}),function(num, tmp){ return num + parseInt(tmp["profitAmount"]) }, 0);
        var selfTotal=_.reduce(_.filter(dataList,function(obj){return obj.tag=="自营"}),function(num, tmp){ return num + parseInt(tmp["profitAmount"]) }, 0);
        var venderTotal=_.reduce(_.filter(dataList,function(obj){return obj.tag=="爱机汇"}),function(num, tmp){ return num + parseInt(tmp["profitAmount"]) }, 0);
        var dybTotal=_.reduce(_.filter(dataList,function(obj){return obj.tag=="店员宝"}),function(num, tmp){ return num + parseInt(tmp["profitAmount"]) }, 0);
        $(sel).bootstrapTable('destroy').bootstrapTable({
            data: dataList,
            pagination: true,
            pageSize: 25,
            search: true,
            exportDataType:'all',
            columns:[
                {
                    field:'tag',
                    title:'类型',
                    sortable:true,
                    order: 'desc'
                },
                {
                    field:'price',
                    title:'价格区间',
                    sortable:true
                },
                {
                    field:'recyclerAmount',
                    title:'回收额',
                    sortable:true
                },
                {
                    field:'saleAmount',
                    title:'销售额',
                    sortable:true
                },
                {
                    field:'profitAmount',
                    title:'利润额',
                    sortable:true
                },{
                    field:'rate',
                    title:'利润率',
                    sortable:true,
                    formatter:function(value){
                        return value+"%"
                    }
                },{
                    field:'',
                    title:'C2B利润占比',
                    sortable:true,
                    formatter:function(value,row,index){
                        var tag = row.tag
                        var retVal = '';
                        switch(tag) {
                            case "BD":
                                retVal = (100.0 * row.profitAmount / (bdTotal+selfTotal)).toFixed(2) + "%";
                                break;
                            case "自营":
                                retVal = (100.0 * row.profitAmount / (bdTotal+selfTotal)).toFixed(2) + "%";
                                break;
                            case "爱机汇":
                                retVal = "-";//(100.0 * row.profitAmount / venderTotal).toFixed(2) + "%";
                                break;
                            case "店员宝":
                                retVal = "-";//(100.0 * row.profitAmount / venderTotal).toFixed(2) + "%";
                                break;
                        }
                        return retVal
                    }
                },{
                    field:'事业部利润占比',
                    title:'事业部利润占比',
                    sortable:true,
                    formatter:function(value,row,index){
                        var tag = row.tag
                        var retVal = ''
                        switch(tag) {
                            case "BD":
                                retVal = (100.0 * row.profitAmount / bdTotal).toFixed(2) + "%";
                                break;
                            case "自营":
                                retVal = (100.0 * row.profitAmount / selfTotal).toFixed(2) + "%";
                                break;
                            case "爱机汇":
                                retVal = (100.0 * row.profitAmount / venderTotal).toFixed(2) + "%";
                                break;
                            case "店员宝":
                                retVal = (100.0 * row.profitAmount / dybTotal).toFixed(2) + "%";
                                break;
                        }
                        return retVal
                    }
                }
            ]

        });
    }


}


///传入参数list和obj.name = 'S'元素等级所在行的下标位置
function pushStoFirst(dataList,index){
    var str = dataList.splice(index,1);
    dataList.unshift(str[0]);
    return dataList;
}

//获取数据list中，obj.name='S'元素所在的下标位置
function getSIndex(dataList){
    for(var i=0;i<dataList.length;i++){
        if(dataList[i].name=='S'){
            return i;
        }
    }
}












