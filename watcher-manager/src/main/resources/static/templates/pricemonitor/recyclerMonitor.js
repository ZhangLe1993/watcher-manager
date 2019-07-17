Template.recyclerMonitor.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#recyclerDebtbak').addClass('active');
    $('#channelSideTab').addClass('active');

    if(isMobile()){
        $('.sidebar-toggle').click();
    }
    $("#loading").show();
    $("#data-div").hide();
    drawTable();
    requestURL(dataService + "/recycler/updateRecyclerAmountNew", {}).done(function (data) {
        if (data.result != 'OK') {
            alert("更新失败！！！");
        }
        drawTable()
        $("#loading").hide();
        $("#data-div").show();
    })

    requestURL(dataService + "/recycler/getRecyclerCategory", {}).done(function (data) {

       // console.log(data);
        drawTableByCategory(data);
        $("#loading").hide();
        $("#data-div").show();
    })

};
/***
 * 10点之前 竞价显示 昨天10-24点总和的竞价 其他例如欠款之类的是实时数据
 * 10点以后 竞价显示10点以后总和的竞价  其他例如欠款之类的是实时数据
 */
function drawTable(){
    /*var flag = new Date().getHours()<10?"-10":"+10";*/
    drawTableByMaintainer(/*flag*/)
    drawTableByRecycler(/*flag*/)

    $("#rate").text((parseFloat($("#totalDebt").text().replace(/,/g,""))*100.0/parseFloat($("#qutationTotal").text().replace(/,/g,""))).toFixed(2)+"%")
    //昨日24点数据  改成  当日10点
    drawYestTable(/*flag*/)

}
function drawYestTable(/*flag*/){
    var ldt = new Date().getNewDate(-1);
    var dataByCategory = _.groupBy(recyclerStats.find({"isToPay" : "1","date":{$gte:'2018-06-27',$lte:ldt},debt: {$gt: 0}}).fetch(),function(obj){return obj.date});
    //console.log(dataByCategory);
    var data =[];
    for(var key in dataByCategory){
        var debtSum  = _.reduce(dataByCategory[key],function(num, tmp){ return num + isNaNFunc(parseFloat(tmp.debt)); }, 0);
        var creditDebtSum  = _.reduce(dataByCategory[key],function(num, tmp){ return num + (isNaNFunc(parseFloat(tmp.checkOutAmountTotal))-isNaNFunc(parseFloat(tmp.accountAmount))); }, 0)
        var quotationData = recyclerStats.find({/*flag:"+10",*/"date":new Date(key).getNewDate(0)},{"RecyclerId":1,"curQuotationAmount":1,"_id":0}).fetch();
        var quotationDataTotal = parseInt(_.reduce(quotationData,function(num, tmp){
            return num + isNaNFunc(parseFloat(tmp.curQuotationAmount));
            }, 0));
        //var curQuotationAmountSum = _.reduce(quotationDataByCategory[key],function(num, tmp){ return num + isNaNFunc(parseFloat(tmp.curQuotationAmount)); }, 0)
        data.push({
            date:key,
            debt:parseInt(debtSum),
            creditDebt:parseInt(creditDebtSum),
            quotationDataTotal:quotationDataTotal
        })
    }

    $('#YestTable').bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        pagination: true,
        //sidePagination: 'server',
        striped: true,
        sortName: 'date',
        sortOrder: 'desc',
        search: true,
        data: data,
        columns: [{
            field: 'date',
            title: '时间',
            sortable: true,
        }, {
            field: 'creditDebt',
            title: '信用欠款总额',
            sortable: true,
            formatter: function (value, row, index) {
                return value.toLocaleString()
            }

        }, {
            field: 'debt',
            title: '欠款总额',
            sortable: true,
            formatter: function (value, row, index) {
                return value.toLocaleString()
            }

        }, {
            field: 'quotationDataTotal',
            title: '竞价总额',
            sortable: true,
            formatter: function (value, row, index) {
                return value.toLocaleString()
            }

        }, {
            field: '',
            title: '欠款/竞价总额',
            formatter: function (value, row, index) {
                return (100.0*row.debt/row.quotationDataTotal).toFixed(2)+"%"
            }

        }]
    })
}
function drawTableByCategory(result){

    $('#tableByCategory').bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        pagination: true,
        //sidePagination: 'server',
        striped: true,
        sortName: 'channel',
        sortOrder: 'desc',
        data: result,
        columns: [{
            field: 'channel',
            title: '渠道',
            sortable: true,
            formatter: function (value, row, index) {
                return value
            }
        }, {
            field: 'SettleAmount',
            title: '待支付金额',
            sortable: true,
            formatter: function (value, row, index) {
                return parseInt(value).toLocaleString()
            }
        }, {
            field: 'curQuotationAmount',
            title: '当日竞价额',
            sortable: true,
            formatter: function (value, row, index) {
                return parseInt(value).toLocaleString()
            }
        }, {
            field: 'debtHour',
            title: '欠款时长(h)',
            sortable: true,
        }, {
            field: 'weight',
            title: '待支付结算金额/当日竞价额',
            sortable: true,
            formatter: function (value, row, index) {
                return parseFloat(value*100).toFixed(2) + "%"
            }
        }]
    })
}
function drawTableByRecycler(/*flag*/){
    var data = recyclerStats.find({"isToPay" : "1",/*flag:flag,*/"date":new Date().getNewDate(0),debt: {$gt: 0}}).fetch();
   /* if(flag=="-10"){
        var obj = {};
        recyclerStats.find({"isToPay" : "1",flag:"+10","date":new Date().getNewDate(-1),debt: {$gt: 0}}).fetch().forEach(function(ele){
            obj[ele.RecyclerId]=ele.curQuotationAmount
        });
        data = _.map(data,function(ele){
            ele.curQuotationAmount = isNaNFunc(parseFloat(obj[ele.RecyclerId]))
            return ele
        })
    }*/

    $('#tableByRecycler').bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        pagination: true,
        //sidePagination: 'server',
        striped: true,
        sortName: 'debt',
        sortOrder: 'desc',
        search: true,
        data: data,
        columns: [
            {
                field: 'RecyclerId',
                title: '回收商ID',
                sortable: true
            }, {
                field: 'recyclerName',
                title: '回收商',
                sortable: true,
            }, {
                field: 'maintainer',
                title: '维护人',
                sortable: true,
            }, {
                field: 'checkOutAmountTotal',
                title: '待支付结算总金额',
                sortable: true,
                formatter: function (value, row, index) {
                    return Math.floor(value==undefined?0:value).toLocaleString()
                }
            }, {
                field: 'accountAmount',
                title: '回收商账户余额',
                sortable: true,
                formatter: function (value, row, index) {
                    return Math.floor(value==undefined?0:value).toLocaleString()
                }
            },{
                field: 'creditDebt',
                title: '信用欠款',
                sortable: true,
                formatter: function (value, row, index) {
                    if (value == undefined) {
                        return 0
                    }
                    if (value > 0) {
                        var debt = Math.floor(value).toLocaleString();
                        return "<font color='red'>" + debt + "</font>"
                    } else {
                        return Math.floor(value).toLocaleString();
                    }
                }
            }, {
                field: 'debt',
                title: '欠款',
                sortable: true,
                formatter: function (value, row, index) {
                    if (value == undefined) {
                        return 0
                    }
                    if (value > 0) {
                        var debt = Math.floor(value).toLocaleString();
                        return "<font color='red'>" + debt + "</font>"
                    } else {
                        return Math.floor(value).toLocaleString();
                    }
                }
            },{
                field: 'debtHour',
                title: '欠款时长(h)',
                sortable: true,
                formatter: function (value, row, index) {
                    return parseFloat(value==undefined?0:value).toFixed(2)
                }
            },{
                field: 'curQuotationAmount',
                title: '竞价额',
                sortable: true,
                formatter: function (value, row, index) {
                    return Math.floor(value==undefined?0:value).toLocaleString()
                }
            }, {
                field: '',
                title: '欠款/当日竞价总额',
                sortable: true,
                formatter: function (value, row, index) {
                    return (100.0*row.debt/row.curQuotationAmount).toFixed(2)+"%"
                }
            },{
                field: 'telephone',
                title: '回收商联系电话',
                sortable: true,
            }
        ]
    })
}
function drawTableByMaintainer(/*flag*/){
    var quotationData = [];
    var data = [];
    /*if(flag=="-10"){*/
        quotationData = recyclerStats.find({/*flag:"+10",*/"date":new Date().getNewDate(0)},{"RecyclerId":1,"curQuotationAmount":1,"_id":0}).fetch()
        data = recyclerStats.find({"isToPay" : "1",/*flag:"-10",*/"date":new Date().getNewDate(0),debt: {$gt: 0}}).fetch();
    /*}else if(flag=="+10"){
        quotationData = recyclerStats.find({flag:"+10","date":new Date().getNewDate(0)},{"RecyclerId":1,"curQuotationAmount":1,"_id":0}).fetch()
        data = recyclerStats.find({"isToPay" : "1",flag:"+10","date":new Date().getNewDate(0),debt: {$gt: 0}}).fetch();
    }*/

    var qutationTotal = parseInt(_.reduce(quotationData,function(num, tmp){ return num + isNaNFunc(parseFloat(tmp.curQuotationAmount)); }, 0)).toLocaleString()
    $("#qutationTotal").text(qutationTotal)
    var resultTemp = {};
    var dataGroupBy = _.groupBy(data,function(obj){return obj.maintainer})
    var quotationDataGroupBy = _.groupBy(quotationData,function(obj){return obj.maintainer})
    for(var key in dataGroupBy){
        var tmpDebt= 0,tmpcurQuotationAmount= 0,tmpDebtWeight= 0,tmpCreditDebt=0
        tmpcurQuotationAmount=_.reduce(quotationDataGroupBy[key],function(num, tmp){ return num + isNaNFunc(parseFloat(tmp.curQuotationAmount)); }, 0)
        dataGroupBy[key].forEach(function(ele){
            tmpDebt+= ele.debt
            tmpCreditDebt+= ele.creditDebt
            tmpDebtWeight+=ele.debt * ele.debtHour
        })
        resultTemp[key]={
            _id: key,
            debt: tmpDebt,
            creditDebt: tmpCreditDebt,
            curQuotationAmount: tmpcurQuotationAmount,
            debtWeight: tmpDebtWeight
        }

    }
    var keys = Object.keys(resultTemp);
    var result = [];
    keys.forEach(function (e) {
        var temp = resultTemp[e];
        temp.debtHour = temp.debtWeight / temp.debt;
        result.push(resultTemp[e])
    });
    $("#totalDebt").text(parseInt(_.reduce(result,function(num, tmp){ return num + tmp["debt"] }, 0)).toLocaleString())
    $('#tableByMaintainer').bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        pagination: true,
        //sidePagination: 'server',
        striped: true,
        sortName: 'debt',
        sortOrder: 'desc',
        data: result,
        columns: [{
            field: '_id',
            title: '维护人',
            sortable: true,
            formatter: function (value, row, index) {
                return value
            }
        }, {
            field: 'creditDebt',
            title: '信用欠款',
            sortable: true,
            formatter: function (value, row, index) {
                return parseInt(value).toLocaleString()
            }
        }, {
            field: 'debt',
            title: '欠款',
            sortable: true,
            formatter: function (value, row, index) {
                return parseInt(value).toLocaleString()
            }
        }, {
            field: 'debtHour',
            title: '欠款时长(h)',
            sortable: true,
            formatter: function (value, row, index) {
                return parseInt(value).toLocaleString()
            }
        }, {
            field: 'curQuotationAmount',
            title: '竞价额',
            sortable: true,
            formatter: function (value, row, index) {
                return parseInt(value).toLocaleString()
            }
        }, {
            field: '',
            title: '欠款/当日竞价总额',
            sortable: true,
            formatter: function (value, row, index) {
                return (100.0*row.debt/row.curQuotationAmount).toFixed(2)+"%"
            }
        }]
    })
}