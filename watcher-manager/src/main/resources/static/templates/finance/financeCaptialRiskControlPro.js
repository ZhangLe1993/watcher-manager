Array.prototype.unique = function () {
    var o = {};
    var i = 0;
    var l = this.length;
    var r = [];
    for(i=0;i<l;i++){
        o[this[i]] = this[i];
    }
    for (i in o){
        r.push(o[i]);
    }
    return r;
};

Template.financeCapitalRiskControlPro.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#FinanceTab').addClass('active');
    $("#FinanceCapitalRiskControlPro").addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    drawUnDonePart();

    $("#data-search").hide();

    $("#is-done").click(function(){
        $("#data-search").show();
        drawIsDonePart();
    });

    $("#un-done").click(function(){
        $("#data-search").hide();
        drawUnDonePart();
    });
};

function renderPage(){
    getRTData();
}

function getRTData(){
     requestURL(dataService+"/financeOptAnalyse/getCapitalRiskControlPro",{}).done(function(data){
         if(data.statusText != undefined && data.statusText=='error'){

         }else{
             showPanelOrLoading(['unDone'],false);
             $('#crcTable').bootstrapTable('destroy').bootstrapTable({
                 data: data,
                 pageSize:10,
                 pageList: [10, 20, 50, 100, 200],
                 exportDataType: 'all'
                 //cdataExport: "CdataExport",
             });

             /*$("#CdataExport").click(function(){
                  requestURL(dataService+"/financeOptAnalyse/exportOptData",{}).done(function(result){
                     var url = Meteor.settings.public.downloadService.baseUrl+result.path;
                     console.log("url:" + url);
                     var link = document.createElement("a");
                     link.href = url;
                     link.style = "visibility:hidden";
                     document.body.appendChild(link);
                     link.click();
                     document.body.removeChild(link);
                  })
             });*/
             var seriesData={
                 loanSum:0,          //贷款总额
                 badDebtSum:0,    //坏账总额
                 unarrivalSum:0,     //未到货的贷款总额
                 unpaidSum:0,        //未还款的贷款总额
                 unaccountSum:0,     //买家未付款总额
                 dianfuSum:0,        //垫付总额
                 //paidSum:0,          //已支付卖家尾款总额
                 repaySum:0          //贷款还款总额
             };

             /*遍历结果，计算各个数值总额*/
             _.each(data,function(item){     //item为一个{}
                 //贷款总额=贷款金额之和
                 seriesData.loanSum += parseInt(item.loan);
                 seriesData.badDebtSum += parseInt(item.badDebt);
                 //未到货的贷款总额=（是否已到货=否）& 贷款金额之和
                 (item.is_arrival=='未到货') ? seriesData.unarrivalSum += parseInt(item.loan) : seriesData.unarrivalSum;
                 //贷款还款总额
                 seriesData.repaySum += parseInt(item.repayment);
                 //买家未付款总额=未到账金额之和
                 seriesData.unaccountSum += parseInt(item.no_payamount);
                 //垫付总额=垫付金额之和
                 seriesData.dianfuSum += parseInt(item.dianfu_amount);
                 //已支付卖家尾款总额=给卖家付款之和
                 //seriesData.paidSum += parseInt(item.to_seller_amount)
             });

             //未还款的贷款总额=贷款金额-贷款还款金额
             seriesData.unpaidSum = seriesData.loanSum - seriesData.repaySum;

             //将结果和页面id绑定
             //$('#loanAmount').html('￥' + (seriesData.loanSum).toLocaleString());
             $('#badDebtAmount').html('￥' + (seriesData.badDebtSum).toLocaleString());
             $('#unarrivalAmount').html('￥' + (seriesData.unarrivalSum).toLocaleString());     //未到货的贷款总额
             $('#unpaidAmount').html('￥' + (seriesData.unpaidSum).toLocaleString());        //未还款的贷款总额
             $('#unaccountAmount').html('￥' + (seriesData.unaccountSum).toLocaleString());    //买家未付款总额
             $('#dianfuAmount').html('￥' + (seriesData.dianfuSum).toLocaleString());         //垫付总额
             //$('#paidAmount').html('￥' + (seriesData.paidSum).toLocaleString())               //已支付卖家尾款总额
         }
     })
}


var titleData = [
    {fields:'下单时间',logic:'代拍单下单时间',is_asc:'是',is_select:'是',case_one:'',case_two:'',case_three:'',case_four:'',case_five:''},
    {fields:'代拍单',logic:'代拍单号',is_asc:'',is_select:'',case_one:'',case_two:'',case_three:'',case_four:'',case_five:''},
    {fields:'供应商',logic:'代拍单对应的供应商',is_asc:'',is_select:'是',case_one:'',case_two:'',case_three:'',case_four:'',case_five:''},
    {fields:'是否已到货',logic:'若代拍单的状态=【待发货、待收货】，则未到货；反之，已到货',is_asc:'',is_select:'是',case_one:'是',case_two:'是',case_three:'是',case_four:'是',case_five:'是'},
    {fields:'到货后确认的质检金额',logic:'商家全部确认后，不退货的物品的参考价之和',is_asc:'是',is_select:'',case_one:'100',case_two:'100',case_three:'100',case_four:'100',case_five:''},
    {fields:'贷款金额',logic:'贷款结算单的金额',is_asc:'是',is_select:'',case_one:'70',case_two:'70',case_three:'70',case_four:'70',case_five:'70'},
    {fields:'竞拍成功的金额',logic:'代拍单中已竞拍（被加入竞拍结算单）物品成交价之和',is_asc:'是',is_select:'',case_one:'80',case_two:'80',case_three:'80',case_four:'65',case_five:''},
    {fields:'收款金额',logic:'代拍单中已竞拍（被加入竞拍结算单）物品，买家支付之和',is_asc:'是',is_select:'',case_one:'60',case_two:'30',case_three:'70',case_four:'65',case_five:''},
    {fields:'未到账金额',logic:'代拍单中已竞拍（被加入竞拍结算单）物品，买家未支付之和',is_asc:'是',is_select:'',case_one:'20',case_two:'20',case_three:'10',case_four:'0',case_five:''},
    {fields:'垫付金额',logic:'代拍单中已竞拍（被加入竞拍结算单）物品，平台已与卖家结算-买家已支付',is_asc:'是',is_select:'',case_one:'20',case_two:'0',case_three:'10',case_four:'0',case_five:''},
    {fields:'贷款还款金额',logic:'还款结算单中，已还款金额',is_asc:'是',is_select:'',case_one:'70',case_two:'30',case_three:'70',case_four:'70',case_five:''},
    {fields:'给卖家付款',logic:'代拍结算单 已结算-还款结算单 已还款',is_asc:'是',is_select:'',case_one:'10',case_two:'0',case_three:'10',case_four:'0',case_five:''},
    {fields:'卖家给平台付款',logic:'当代拍单物品全部代拍，平台已与卖家全部结算后，还款结算单中 待结算金额',is_asc:'是',is_select:'',case_one:'0',case_two:'0',case_three:'0',case_four:'5',case_five:''},
    {fields:'未代拍的金额',logic:'未代拍的物品 质检时的参考价之和',is_asc:'是',is_select:'',case_one:'20',case_two:'50',case_three:'20',case_four:'0',case_five:''},
    {fields:'退货金额',logic:'退货的物品 质检时的参考价之和',is_asc:'是',is_select:'',case_one:'0',case_two:'0',case_three:'20',case_four:'25(系统控制未全部还款前不可以退货，不会出现这种case)',case_five:''}
    ];

function customWarnModal(title,modelSelector,titleSelector){

    $("#"+modelSelector).on('show.bs.modal', function () {
        $("#"+titleSelector).text(title);
        $("#modalContent").bootstrapTable('destroy').bootstrapTable({
            //exportDataType: 'all',
            data:titleData,
            pageSize: 5,
            pageList: [5, 10, 20],
            //cdataExport: "CSalesdataExport",
            columns: [{
                field:'fields',
                title:'字段',
                sortable:true
            },
            {
                field:'logic',
                title:'字段逻辑',
                sortable:true
            },
            {
                field:'is_asc',
                title:'是否支持顺序倒序排序',
                sortable:true
            },
            {
                field:'is_select',
                title:'是否可筛选',
                sortable:true
            },
            {
                field:'case_one',
                title:'case1：存在物品未竞拍，已竞拍金额大于贷款金额',
                sortable:true
            },
            {
                field:'case_two',
                title:'case2：存在物品未竞拍，已竞拍金额小于贷款金额',
                sortable:true
            },
            {
                field:'case_three',
                title:'case3：存在退货&物品未竞拍，已竞拍金额大于贷款金额',
                sortable:true
            },
            {
                field:'case_four',
                title:'case4：存在退货，物品总竞拍金额小于贷款金额',
                sortable:true
            },{
                field:'case_five',
                title:'case5：未到货就给出贷款',
                sortable:true
            }
            ]
        });
    });
    $("#"+modelSelector).modal();
}

function drawUnDonePart(){
    showPanelOrLoading(['unDone'],true);
    setUnDoneLoading();
    renderPage();

    $("#show-title").click(function(){
        customWarnModal('温馨提示','myWarnModal','myWarnModalLabel');
    });
}

function drawIsDonePart(){
    var minDate="2018-05-03";
    var startDate = new Date().getNewDate(-6);
    var endDate = new Date().getNewDate(0);
    var searchEndDate = new Date().getNewDate(1);
    $('#date-range-btn span').html(startDate + ' - ' + endDate);
    $('#date-range-btn').daterangepicker(filterPickerOptionsFunc(startDate,endDate,minDate,false), dateRangeCallback);
    showPanelOrLoading(['isDone'],true);
    setIsDoneLoading();
    getIsDoneRTData(startDate,searchEndDate);
}

function dateRangeCallback(start, end, label) {
    //console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    var sdt = start.format('YYYY-MM-DD');
    var edt = end.format('YYYY-MM-DD');
    var search_edt = new Date(end.format('YYYY-MM-DD')).getNewDate(1);
    $('#date-range-btn span').html(sdt + ' - ' + edt);
    showPanelOrLoading(['isDone'],true);
    setIsDoneLoading();
    getIsDoneRTData(sdt,search_edt);
}

function cleanParams(filter){
    var query = _.clone(filter);
    for(var key in query){
        if(!query[key] && key!="offset"){
            delete query[key]
        }
    }
    return query
}

function getIsDoneRTData(startDate,endDate){
    requestURL(dataService+"/financeOptAnalyse/getIsDoneTop",{startDate:startDate,endDate:endDate}).done(function(data){
        if(data.statusText != undefined && data.statusText=='error'){

        }else{
            showPanelOrLoading(['isDone'],false);
            var filter = {
                startDate:startDate,endDate:endDate
            };
            var ajaxQuery = _.clone(filter);
            $('#is-done-table').bootstrapTable('destroy').bootstrapTable({
                pagination:true,
                sidePagination:'server',
                //pageSize:10,
                //cache:false,
                //pageNumber:1,
                //queryParamsType:'undefined',
                //contentType : "application/x-www-form-urlencoded; charset=UTF-8",
                ajax:function(params){
                    var ajaxParams = $.extend(ajaxQuery,params.data);
                    //console.log(ajaxParams);
                    getIsDoneData(ajaxParams).done(function(ret){
                        params.success(ret)
                    });
                },
                /*ajax:function(request){
                    console.log(request);
                    requestURL(dataService + "/financeOptAnalyse/getIsDoneTablePage",{limit:5,pageNo:1,startDate:startDate,endDate:endDate}).done(function(res) {
                        if (res.statusText != undefined && res.statusText == 'error') {

                        } else {
                            request.success({
                                row : res
                            });
                            $('#is-done-table').bootstrapTable('load', res);
                        }
                    });
                },*/
                //pageList: [10],
                /*queryParams:function queryParams(params){
                    var param = {
                        limit:params.pageSize,
                        pageNo:params.pageNumber
                    };
                    return param;
                },*/
                //
                onLoadSuccess: function(data){
                    //console.log(data);
                },
                //加载失败时执行
                onLoadError: function(status){
                    //console.log("加载数据失败"+status);
                },
                /*onPageChange:function(number, size){
                    //currentPageSize = size;
                    //currentPageNo = number;
                    //return false;
                    //$('#is-done-table').bootstrapTable('refreshOptions',{pageNumber:number});
                    setTimeout(function(){
                        getIsDoneRtDataNext(startDate,endDate,size,number);
                    },2000);
                },*/
                exportDataType: 'all',
                cdataExport: "CdataExport",
            });
            $("#CdataExport").click(function(){
                requestURL(dataService+"/financeOptAnalyse/exportIsDoneOptDataPro",{startDate:startDate,endDate:endDate}).done(function(result){
                    var url = Meteor.settings.public.downloadService.baseUrl+result.path;
                    console.log("url:" + url);
                    var link = document.createElement("a");
                    link.href = url;
                    link.style = "visibility:hidden";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                })
            });
            /*$("#unDonePanel").delegate('a', 'click', function (e) {
                e.stopPropagation();
                console.log('a');
            });
            $("#isDonePanel").delegate('a', 'click', function (e) {
                e.stopPropagation();
                console.log('b');
            });*/
            var seriesData={
                //loanSum:0,          //贷款总额
                unarrivalSum:0,     //未到货的贷款总额
                unpaidSum:0,        //未还款的贷款总额
                unaccountSum:0,     //买家未付款总额
                dianfuSum:0,        //垫付总额
                //paidSum:0,          //已支付卖家尾款总额
                //repaySum:0          //贷款还款总额
            };
            seriesData.unarrivalSum = data.unarrivalSum;
            seriesData.unpaidSum = data.unpaidSum;
            seriesData.unaccountSum = data.unaccountSum;
            seriesData.dianfuSum = data.dianfuSum;
            //seriesData.repaySum = data.unpaidSum;


            /*遍历结果，计算各个数值总额*/
            /*_.each(data,function(item){     //item为一个{}
                //贷款总额=贷款金额之和
                seriesData.loanSum += parseInt(item.loan);
                //未到货的贷款总额=（是否已到货=否）& 贷款金额之和
                (item.is_arrival=='未到货') ? seriesData.unarrivalSum += parseInt(item.loan) : seriesData.unarrivalSum;
                //贷款还款总额
                seriesData.repaySum += parseInt(item.repayment);
                //买家未付款总额=未到账金额之和
                seriesData.unaccountSum += parseInt(item.no_payamount);
                //垫付总额=垫付金额之和
                seriesData.dianfuSum += parseInt(item.dianfu_amount);
                //已支付卖家尾款总额=给卖家付款之和
                //seriesData.paidSum += parseInt(item.to_seller_amount)
            });*/

            //未还款的贷款总额=贷款金额-贷款还款金额
            //seriesData.unpaidSum = seriesData.loanSum - seriesData.repaySum;

            //将结果和页面id绑定
            //$('#isDoneLoanAmount').html('￥' + (seriesData.loanSum).toLocaleString());
            $('#isDoneUnarrivalAmount').html('￥' + (seriesData.unarrivalSum).toLocaleString());     //未到货的贷款总额
            $('#isDoneUnpaidAmount').html('￥' + (seriesData.unpaidSum).toLocaleString());        //未还款的贷款总额
            $('#isDoneUnaccountAmount').html('￥' + (seriesData.unaccountSum).toLocaleString());    //买家未付款总额
            $('#isDoneDianfuAmount').html('￥' + (seriesData.dianfuSum).toLocaleString());         //垫付总额
            //$('#isDonePaidAmount').html('￥' + (seriesData.paidSum).toLocaleString())               //已支付卖家尾款总额
        }
    })
}
function getIsDoneRtDataNext(startDate,endDate,limit,pageNo){
    requestURL(dataService + "/financeOptAnalyse/getIsDoneTablePage",{limit:limit,pageNo:pageNo,startDate:startDate,endDate:endDate}).done(function(ret) {
        if (ret.statusText != undefined && ret.statusText == 'error') {

        } else {
            /*request.success({
                row : ret
            });*/
            console.log(ret);
            $('#is-done-table').bootstrapTable('load', ret);
        }
    });
}
var showPanelOrLoading = function(selector_perv,on){
    _.each(selector_perv,function(ele){
        var loadingId = ele + 'Loading';
        var panelId = ele + 'Panel';
        if(on){
            //显示动画   隐藏面板
            $('#' + loadingId).show();
            $('#' + panelId).hide();
        }else{
            //显示面板   隐藏动画
            $('#' + loadingId).hide();
            $('#' + panelId).show();
        }
    });
};

var setIsDoneLoading = function(){
    //$('#isDoneLoanAmount').html('……');
    $('#isDoneUnarrivalAmount').html('……');     //未到货的贷款总额
    $('#isDoneUnpaidAmount').html('……');        //未还款的贷款总额
    $('#isDoneUnaccountAmount').html('……');    //买家未付款总额
    $('#isDoneDianfuAmount').html('……');         //垫付总额
    //$('#isDonePaidAmount').html('……')               //已支付卖家尾款总额
};


var setUnDoneLoading = function(){
    //$('#loanAmount').html('……');
    $('#badDebtAmount').html('……');
    $('#unarrivalAmount').html('……');     //未到货的贷款总额
    $('#unpaidAmount').html('……');        //未还款的贷款总额
    $('#unaccountAmount').html('……');    //买家未付款总额
    $('#dianfuAmount').html('……');         //垫付总额
    //$('#paidAmount').html('……');               //已支付卖家尾款总额
};


function  getIsDoneData(filter){
    var query = cleanParams(_.clone(filter));
    query.limit = query.limit + query.offset;
    //console.log(query);
    var dfd = $.Deferred();
    requestURL(dataService+"/financeOptAnalyse/getIsDoneTablePage",query).done(function(ret){
        dfd.resolve(ret);
    });
    return dfd.promise();
}