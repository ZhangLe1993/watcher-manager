/**
 * Created by admin on 2017/8/1.
 * edit by hank on 2018-03-23 去除爱回收
 */
Template.VenderProfitDetailProfitAnalyseDataInfo.rendered = function () {

    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#VenderProfitDataInfoTab').addClass('active');
    $('#VenderProfitDetailProfitAnalyseDataInfo').addClass('active');

    if(isMobile()){
        $('.sidebar-toggle').click();
    }

    var dateGap = -15;
    var minDate = "2016-09-01";
    var endDate = new Date().getNewDate(-1);
    var startDate = new Date(endDate).getNewDate(dateGap);
    $(".dateSelectLabel").html(startDate + "~" + endDate);
    $('.reportRangeOutlets').daterangepicker(datePickerOptionsFunc(startDate,endDate,minDate,false), pickDateRangeCallback);


    ahsajhprofitFunc({"startDate":startDate,"endDate":endDate})
    $('a[data-toggle="tab"]').on('shown.bs.tab', function (e) {
        // 获取已激活的标签页的名称
        var activeTab = e.target.hash;
        var query = getSelectedOptions();
        switch(activeTab) {
            case "#ahsajhprofit":
                ahsajhprofitFunc(query);
                break;
            case "#sourceprofit":
                orderSourceProfitFunc(query);
                break;
            case "#saleAmount":
                saleAmountFunc(query);
                break;
            case "#profitRate":
                profitRateFunc(query);
                break
        }
    });

};

function getSelectedOptions(){
    var arr = $(".dateSelectLabel").text().split("~")
    return {"startDate":arr[0],"endDate":arr[1]}
}

function pickDateRangeCallback(start, end, label) {
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    $('.dateSelectLabel').html(sdt + "~" + edt);
    var query = {"startDate":sdt,"endDate":edt}
    var activeTab = "#"+$(".tab-content>.active").attr("id");
    switch(activeTab) {
        case "#ahsajhprofit":
            ahsajhprofitFunc(query);
            break;
        case "#sourceprofit":
            orderSourceProfitFunc(query);
            break;
        case "#saleAmount":
            saleAmountFunc(query);
            break;
        case "#profitRate":
            profitRateFunc(query);
            break;
    }
}

//爱回收爱机汇毛利对比
function ahsajhprofitFunc(query){
    requestURL(dataService+"/datareport/getAhsAndAjhProfit",query).done(function(data){
       var dateObj = _.groupBy(data,function(ele){return ele.date})
        var totalList=[]
        var shoujiList=[]
        var padList=[]
        var bijibenList=[]
        var tableList = []
        for(var key in dateObj){
            var ahs= 0,ajh=0;
            var ahs_shouji= 0,ajh_shouji=0;
            var ahs_pad= 0,ajh_pad=0;
            var ahs_bijiben= 0,ajh_bijiben=0;
            var tableObj = {}
            dateObj[key].forEach(function(ele){
                var category = ele.category
                var amount =parseInt(ele.amount)
                var tag = ele.tag

                if(tag=="爱机汇"){
                    ajh+=amount
                    if(category=="手机"){
                        ajh_shouji+=amount
                    }else if(category=="平板电脑"){
                        ajh_pad+=amount
                    }else if(category=="笔记本"){
                        ajh_bijiben+=amount
                    }
                    tableObj["ajh_"+category]=amount
                }else if(tag=="爱回收"){
                    ahs+=amount
                    if(category=="手机"){
                        ahs_shouji+=amount
                    }else if(category=="平板电脑"){
                        ahs_pad+=amount
                    }else if(category=="笔记本"){
                        ahs_bijiben+=amount
                    }
                    tableObj["ahs_"+category]=amount
                }
            })
            totalList.push({"date":key,"ahs":ahs,"ajh":ajh})
            shoujiList.push({"date":key,"ahs":ahs_shouji,"ajh":ajh_shouji})
            padList.push({"date":key,"ahs":ahs_pad,"ajh":ajh_pad})
            bijibenList.push({"date":key,"ahs":ahs_bijiben,"ajh":ajh_bijiben})
            tableObj.date=key
            tableObj["ahs_合计"]=ahs
            tableObj["ajh_合计"]=ajh
            tableList.push(tableObj)

        }
        drawChart( _.sortBy(totalList,function(ele){return ele.date}),"合计毛利额对比图","totalComparisonProfit")
        drawChart( _.sortBy(shoujiList,function(ele){return ele.date}),"手机毛利额对比图","mobileComparisonProfit")
        drawChart( _.sortBy(padList,function(ele){return ele.date}),"平板电脑毛利额对比图","padComparisonProfit")
        drawChart( _.sortBy(bijibenList,function(ele){return ele.date}),"笔记本毛利额对比图","notebookComparisonProfit")
        drawTable( _.sortBy(tableList,function(ele){return  -new Date(ele.date).getTime()}))
    })

    requestURL(dataService+"/datareport/getAjhOldNewProfit",query).done(function(data){
        var dateObj = _.groupBy(data,function(ele){return ele.date})
        var totalList=[]
        for(var key in dateObj){
            var oldnew= 0,recycle=0;
            dateObj[key].forEach(function(ele){
                var amount =parseInt(ele.amount)
                var name = ele.name
                if(name=="以旧换新"){
                    oldnew+=amount
                }else if(name=="手机回收"){
                    recycle+=amount
                }
            })
            totalList.push({"date":key,"oldnew":oldnew,"recycle":recycle})
        }
        var data = _.sortBy(totalList,function(ele){return ele.date})
        var option = {
            title: {
                text:"爱机汇以旧换新和手机回收毛利额对比",
                x: "center",
                //y: "bottom"
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
            },
            legend: {
                data: ['以旧换新', '手机回收' ],
                padding:[30,0,0,0]
            },
            grid: {
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: _.map(data,function(ele){return ele.date})
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                {
                    name: '以旧换新',
                    type: 'line',

                    data: _.map(data,function(ele){return ele.oldnew})
                }, {
                    name: '手机回收',
                    type: 'line',

                    data: _.map(data,function(ele){return ele.recycle})
                }
            ]
        };
        var chart = echarts.init(document.getElementById("ajholdnewProfit"));
        chart.setOption(option);
        window.addEventListener('resize', chart.resize)
    })

    var drawChart=function(data,title,id){
        var option = {
            title: {
                text:title,
                x: "center",
                //y: "bottom"
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
            },
            legend: {
                data: [/*'爱回收',*/ '爱机汇' ],
                padding:[30,0,0,0]
            },
            grid: {
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: _.map(data,function(ele){return ele.date})
                }
            ],
            yAxis: [
                {
                    type: 'value'
                }
            ],
            series: [
                /*{
                    name: '爱回收',
                    type: 'line',

                    data: _.map(data,function(ele){return ele.ahs})
                },*/ {
                    name: '爱机汇',
                    type: 'line',

                    data: _.map(data,function(ele){return ele.ajh})
                }
            ]
        };
        var chart = echarts.init(document.getElementById(id));
        chart.setOption(option);
        window.addEventListener('resize', chart.resize)
    }

    var drawTable=function(data){
        //var fixRow = '"<tr style=""", " ", "", "", " data-index="0"", "", "", ">", "<td  style=""    ></td>", "<td  style="text-align: center;"    colspan="6">爱回收毛利额</td>", "<td  style="text-align: center;"    colspan="4">爱机汇毛利额</td>", "</tr>"'
        var fixRow = '"<tr style=""", " ", "", "", " data-index="0"", "", "", ">", "<td  style=""    ></td>",  "<td  style="text-align: center;"    colspan="4">爱机汇毛利额</td>", "</tr>"'

        $('#ahsajhComparisonProfitTable').bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            pagination: true,
            /*sidePagination: 'server',*/
            data:data,
            fixRow:fixRow,
            columns: [{
                field: 'date',
                title: '日期',
                sortable:true
            }, {
                field: 'ajh_手机',
                title: '手机'
            }, {
                field: 'ajh_平板电脑',
                title: '平板电脑'
            }, {
                field: 'ajh_笔记本',
                title: '笔记本'
            }, {
                field: 'ajh_合计',
                title: '合计'
            }],
        });
    }
}

//订单来源毛利对比
function orderSourceProfitFunc(query){
    requestURL(dataService+"/datareport/getOrderSourceComparison",query).done(function(data){
        var dateObj = _.groupBy(data,function(ele){return ele.date})
        var dataList=[]
        for(var key in dateObj){
            var channelObj = _.groupBy(dateObj[key],function(ele){return ele.source})
            var dateSum = _.reduce(dateObj[key], function(num, tmp){ return num + parseInt(tmp.amount); }, 0)
            for(var subKey in channelObj){
                var obj = {"订单来源":subKey,"日期":key};
                var total = 0
                channelObj[subKey].forEach(function(ele){
                    var amount = parseInt(ele.amount)
                    obj[ele.category]=amount
                    total +=amount
                });
                obj["合计"]=total
                obj["渠道占比"]=(100*total/dateSum).toFixed(2)+"%";
                dataList.push(obj)
            }
        }
        drawTable(_.sortBy(dataList,function(a){return (-new Date(a["日期"]).getTime())}),"#sourceProfitTable",[{
            field: '日期',
            title: '日期',
            sortable:true
        }, {
            field: '订单来源',
            title: '订单来源',
            sortable:true
        },{
            field: '渠道占比',
            title: '渠道占比',
            sortable:true
        }, {
            field: '合计',
            title: '合计',
            sortable:true
        }, {
            field: '手机',
            title: '手机',
            sortable:true
        }, {
            field: '平板电脑',
            title: '平板电脑',
            sortable:true
        }, {
            field: '笔记本',
            title: '笔记本',
            sortable:true
        }, {
            field: '摄影摄像',
            title: '摄影摄像',
            sortable:true
        }, {
            field: '智能数码',
            title: '智能数码',
            sortable:true
        }])
    })
    requestURL(dataService+"/datareport/getBDSource",query).done(function(data){
        var dateObj = _.groupBy(data,function(ele){return ele.date})
        var dataList=[]
        for(var key in dateObj){
            var channelObj = _.groupBy(dateObj[key],function(ele){return ele.source})

            for(var subKey in channelObj){
                var obj = {"订单来源":subKey,"日期":key};
                var total = 0
                channelObj[subKey].forEach(function(ele){
                    var amount = parseInt(ele.amount)
                    obj[ele.category]=amount
                    total +=amount
                });
                obj["合计"]=total
                dataList.push(obj)
            }
        }
        drawTable(_.sortBy(dataList,function(a){return (-new Date(a["日期"]).getTime())}),"#bdSourceProfitTable",[{
            field: '日期',
            title: '日期',
            sortable:true
        }, {
            field: '订单来源',
            title: '订单来源',
            sortable:true
        }, {
            field: '手机',
            title: '手机',
            sortable:true
        }, {
            field: '平板电脑',
            title: '平板电脑',
            sortable:true
        }, {
            field: '笔记本',
            title: '笔记本',
            sortable:true
        }, {
            field: '摄影摄像',
            title: '摄影摄像',
            sortable:true
        }, {
            field: '智能数码',
            title: '智能数码',
            sortable:true
        }, {
            field: '合计',
            title: '合计',
            sortable:true
        }])
    })

    var drawTable=function(data,id,columns){
        $(id).bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            pagination: true,
            /*sidePagination: 'server',*/
            data:data,
            columns: columns
        });
    }
}

//销售金额
function saleAmountFunc(query){
    $("#saleAmountLoading").show()
    $("#saleAmountContent").hide()
    requestURL(dataService+"/datareport/getSaleAmountByProduct",query).done(function(data){
        $("#saleAmountLoading").hide()
        $("#saleAmountContent").show()
        var tagObj = _.groupBy(data,function(ele){return ele.tag});
        var obj = {};
        for(var key in tagObj){
            obj[key] = _.reduce(tagObj[key], function(num, tmp){ return num + parseInt(tmp.amount) }, 0)
        }
        var dataList = []
        var productObj = _.groupBy(data,function(ele){return ele.product})
        for(var key in productObj){
            var tmpObj = {
                "product":key,
                "爱回收毛利率":0,
                "爱回收占比":0,
                "爱机汇毛利率":0,
                "爱机汇占比":0
            };
            productObj[key].forEach(function(ele){
                var tag = ele.tag;
                var rate = parseFloat(ele.rate)//.toFixed(4)
                var amount = parseFloat(ele.amount);
                if(tag=="爱回收"){
                    tmpObj["爱回收毛利率"]=rate
                    tmpObj["爱回收占比"]=(1.0*amount/parseFloat(obj[tag]))//.toFixed(4)
                }else if(tag=="爱机汇"){
                    tmpObj["爱机汇毛利率"]=rate
                    tmpObj["爱机汇占比"]=(1.0*amount/parseFloat(obj[tag]))//.toFixed(4)
                }
                tmpObj["category"]=ele.category
            })
            dataList.push(tmpObj)
        }

        drawTable(_.sortBy(dataList,function(a){return -a["爱机汇占比"]}),"#saleAmountTableByProduct",[{
            field: 'category',
            title: '品类',
            sortable:true
        }, {
            field: 'product',
            title: '型号',
            sortable:true
        }, {
            field: '爱机汇占比',
            title: '爱机汇销售额占比',
            sortable:true,
            formatter:function(value,row,index){
                return (value*100).toFixed(2)+"%"
            }
        }, {
            field: '爱机汇毛利率',
            title: '爱机汇毛利率',
            sortable:true,
            formatter:function(value,row,index){
                return (value*100).toFixed(2)+"%"
            }
        }])
    })
    requestURL(dataService+"/datareport/getSaleAmountByBrand",query).done(function(data){

        var tagObj = _.groupBy(data,function(ele){return ele.tag});
        var obj = {};
        for(var key in tagObj){
            obj[key] = _.reduce(tagObj[key], function(num, tmp){ return num + parseInt(tmp.amount) }, 0)
        }
        var dataList = []
        var categoryBrandObj = _.groupBy(data,function(ele){return ele.category+"_"+ele.brand})
        for(var key in categoryBrandObj){
            var tmpObj = {
                "category":key.split("_")[0],
                "brand":key.split("_")[1],
                "爱回收毛利率":0,
                "爱回收占比":0,
                "爱机汇毛利率":0,
                "爱机汇占比":0
            };
            categoryBrandObj[key].forEach(function(ele){
                var tag = ele.tag;
                var rate = parseFloat(ele.rate)//.toFixed(4)
                var amount = parseFloat(ele.amount);
                if(tag=="爱回收"){
                    tmpObj["爱回收毛利率"]=rate
                    tmpObj["爱回收占比"]=(1.0*amount/parseFloat(obj[tag]))//.toFixed(4)
                }else if(tag=="爱机汇"){
                    tmpObj["爱机汇毛利率"]=rate
                    tmpObj["爱机汇占比"]=(1.0*amount/parseFloat(obj[tag]))//.toFixed(4)
                }
            })
            dataList.push(tmpObj)
        }

        drawTable(_.sortBy(dataList,function(a){return -a["爱机汇占比"]}),"#saleAmountTableByBrand",[{
            field: 'category',
            title: '品类',
            sortable:true
        }, {
            field: 'brand',
            title: '品牌',
            sortable:true
        }, {
            field: '爱机汇占比',
            title: '爱机汇销售额占比',
            sortable:true,
            formatter:function(value,row,index){
                return (value*100).toFixed(2)+"%"
            }
        },{
            field: '爱机汇毛利率',
            title: '爱机汇毛利率',
            sortable:true,
            formatter:function(value,row,index){
                return (value*100).toFixed(2)+"%"
            }
        }])
    })

    var drawTable=function(data,sel,columns){
        $(sel).bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            pagination: true,
            data:data,
            columns: columns
        });
    }
}

//毛利率分析
function profitRateFunc(query){
    $(".price").val("")
    $("#profitRateLoading").show();
    $("#profitRateContent").hide();
    //获取options
    requestURL(dataService+"/datareport/getAhsAjhProfitOptions",query).done(function(data){
        $(".category").attr("multiple","multiple");
        $(".brand").attr("multiple","multiple");
        $(".product").attr("multiple","multiple");
        renderOptions("select.category",_.map(data,function(ele){return ele.category}))
        renderOptions("select.brand",[]);
        renderOptions("select.product",[]);
        $("select.category").change(function(){
            var categoryList = $(".category").val();
            if(categoryList){
                renderOptions("select.product",[]);
                renderOptions("select.brand", _.map(_.filter(data,function(ele){return categoryList.contains(ele.category)}),function(ele){return ele.brand}));
            }else{
                renderOptions("select.brand",[]);
                renderOptions("select.product",[])
            }
        })
        $("select.brand").change(function(){
            var brandList = $(".brand").val()
            var categoryList = $(".category").val()
            if(brandList){
                renderOptions("select.product", _.map(_.filter(data,function(ele){return categoryList.contains(ele.category)&&brandList.contains(ele.brand)}),function(ele){return ele.product}));
            }else{
                renderOptions("select.product",[])
            }
        })
        renderContent(query)
        function cleanParams(filter){
            //clean parameters
            var query = _.clone(filter);
            for(var key in query){
                if(!query[key]&&key!="offset"&&query[key]!=0){
                    delete query[key]
                }
            }
            return query
        }
        $(".search").unbind("click").click(function(){
            var queryParams = cleanParams({
                "category":$(".category").val(),
                "brand":$(".brand").val(),
                "product":$(".product").val(),
                "minPrice":parseInt($(".minPrice").val()),
                "maxPrice":parseInt($(".maxPrice").val()),

            })
            queryParams.startDate = query.startDate
            queryParams.endDate = query.endDate
            renderContent(queryParams);
        })
    })


    var renderContent = function (query){
        $(".search").attr("disabled",true);
        $("#loading").html("loading...")
        requestURL(dataService+"/datareport/getAhsAjhProfit",query).done(function(data){
            $(".search").attr("disabled",false);
            $("#loading").html("")
            $("#profitRateLoading").hide();
            $("#profitRateContent").show();
            var ahsCountTotal=0,ahsAmountTotal=0,ajhCountTotal=0,ajhAmountTotal=0;
            var dataList=[]
            var dateObj = _.groupBy(data,function(ele){return ele.date});
            for(var key in dateObj){
                var ahsCount=0,ahsAmount=0,ajhCount=0,ajhAmount= 0,ahsProfit= 0,ajhProfit= 0,ahsQuotation= 0,ajhQuotation=0;
                dateObj[key].forEach(function(ele){
                    var count = parseInt(ele.count)
                    var quotation = parseFloat(ele.quotation)
                    var amount = parseFloat(ele.amount)
                    var profit = parseFloat(ele.profit)
                    var tag = ele.tag
                    //console.log(amount)
                    if(tag=="爱机汇"){
                        //ajhCount+=amount
                        ajhAmount+=amount
                        ajhProfit+=profit
                        ajhQuotation+=quotation
                        ajhCountTotal+=count
                        ajhAmountTotal+=amount

                    }else if(tag=="爱回收"){
                        //ahsCount+=count
                        ahsAmount+=amount
                        ahsProfit+=profit
                        ahsQuotation+=quotation
                        ahsCountTotal+=count
                        ahsAmountTotal+=amount
                    }
                })



                dataList.push({
                    "date":key,
                    "ahs":parseFloat((100.0*ahsProfit/ahsQuotation).toFixed(2)),
                    "ajh":parseFloat((100.0*ajhProfit/ajhQuotation).toFixed(2))
                })
            }

            $("#ajhAmount").html(ajhAmountTotal)
            $("#ajhCount").html(ajhCountTotal)
            var dataList = _.sortBy(dataList,function(ele){return ele.date})
            drawChart(dataList,"毛利率趋势图","profitRateChart");
            drawTable(_.sortBy(dataList,function(obj){return  -new Date(obj.date).getTime()}))
        })
    }


    var drawTable = function(data){
        $("#profitRateTable").bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            pagination: true,
            /*sidePagination: 'server',*/
            data:data,
            columns: [{
                field: 'date',
                title: '时间',
                sortable:true
            }, {
                field: 'ajh',
                title: '爱机汇毛利率',
                sortable:true,
                formatter:function(value,row,index){
                    return value+"%"
                }
            }],
        });
    }
    var drawChart=function(data,title,id){
        var option = {
            title: {
                text:title,
                x: "center",
                //y: "bottom"
            },
            tooltip: {
                trigger: 'axis',
                axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                    type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                },
                formatter:function(params){
                    var str = params[0].name + '<br/>';
                    params.forEach(function(obj){
                        str += obj.seriesName + ' : ' + obj.value + '%<br/>'
                    });
                    return str;
                }
            },
            legend: {
                data: [/*'爱回收',*/ '爱机汇' ],
                padding:[30,0,0,0]
            },
            grid: {
                containLabel: true
            },
            xAxis: [
                {
                    type: 'category',
                    data: _.map(data,function(ele){return ele.date})
                }
            ],
            yAxis: [
                {
                    type: 'value',
                    axisLabel:{
                        formatter: '{value}%'
                    }
                }
            ],
            series: [
                {
                    name: '爱机汇',
                    type: 'line',

                    data: _.map(data,function(ele){return ele.ajh})
                }
            ]
        };
        var chart = echarts.init(document.getElementById(id));
        chart.setOption(option);
        window.addEventListener('resize', chart.resize)
    }

    var  loadOptions= function(sel,data){
        $(sel).empty();
        _.unique(data).forEach(function(ele){
            $(sel).append("<option value='"+ele+"'>"+ele+"</option>")
        });
    };
    var renderOptions = function(sel,data){

        loadOptions(sel, data);
        var placeholder = sel=="select.category"?"全部":sel=="select.brand"?"先选择品类":"先选择品牌"

        $(sel).multipleSelect({
            placeholder: placeholder,
            width: 150,
            selectAll: false,
            filter:true
        });

    }
}