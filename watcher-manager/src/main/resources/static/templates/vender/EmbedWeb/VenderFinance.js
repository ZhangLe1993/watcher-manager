Template.venderFinance.rendered = function () {
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }
    var listJ = Template.list;
    console.log(listJ);
    var vender_parent_key = listJ[0];

    var year = new Date().getFullYear().toString();
    var filter = {
        'startDate': "2016-09-01",
        'endDate': moment(new Date()).format("YYYY[-]MM[-]DD"),
        'vender_parent_key':vender_parent_key
    };

    getData(filter,vender_parent_key);

    $('#search').click(function () {
        var key = $('#VenderID').val();
        key = parseInt(key);
        var year = new Date().getFullYear().toString();
        if (year != '2016') {
            var filter = {
                'startDate': new Date().getFullYear().toString() + "-01-01",
                'endDate': moment(new Date()).format("YYYY[-]MM[-]DD"),
                'vender_parent_key':vender_parent_key
            };
            getData(filter, key);
        }
        else{
            var filter = {
                'startDate': new Date().getFullYear().toString() + "-09-01",
                'endDate': moment(new Date()).format("YYYY[-]MM[-]DD"),
                'vender_parent_key':vender_parent_key
            };
            getData(filter, key);

        }

    });

    function getData(filter,key){
        var query = _.clone(filter);
        requestURL(dataService+"/Vender/getVenderFinance",query).done(function (data) {
            requestURL(dataService+"/Vender/getVenderFinanceFrozenFund",query).done(function (dataFrozenFund) {
                var prepared = preprocessData(key, data,dataFrozenFund);
                inittable(prepared);
            })

        })
    }
    function preprocessData(key,data,dataFrozenFund){
        var prepared={
            "date":[],
            "monthlyComplete":[],
            "AccumulateComplete":[],
            "frozenAmount":[],
            "venderFee":[],
            "shopFee":[],
            "difference":[],
            "difference_total":[],
            "difference_ratio":[],
            "monthly_frozen":[],
            "monthly_actual":[],
            "monthly_profit":[],
            "report_link":[]
        };
        var json = [];
        var cnt = 0;
        data.forEach(function (e) {
            if(e.vender_parent_key == key){
                prepared.date.push(e.date.replace('-','年')+'月');
                prepared.monthlyComplete.push(e.order_deal_num);
                if(cnt !=0) {
                    prepared.AccumulateComplete.push(prepared.AccumulateComplete[cnt-1]+e.order_validate_success_deal_num);
                    prepared.difference_total.push(prepared.difference_total[cnt-1]+e.difference_amount);
                } else{
                    prepared.AccumulateComplete.push(e.order_validate_success_deal_num);
                    prepared.difference_total.push(e.difference_amount);
                }
                var ratio=0;
                var ratios="";
                if(prepared.AccumulateComplete[cnt] != 0) {
                    ratio = prepared.difference_total[cnt] / prepared.AccumulateComplete[cnt];
                    ratios = ((ratio * 100).toFixed(3)).toString() + "%";
                }else{
                    ratios=ratio.toString()+"%";
                }
                var frozen= 0;
                if((ratio*100-2)>= 0){
                    frozen=(prepared.AccumulateComplete[cnt]*((ratio*100-2)/100))
                }else{
                    frozen=0;
                }
                var frozenrnd = frozen.toFixed(2)
                prepared.difference_ratio.push(ratios);
                if(e.date<"2017-07") {
                    prepared.frozenAmount.push(frozenrnd);
                }else {
                    dataFrozenFund.forEach(function (d) {
                        if (e.date == moment().format('YYYY-MM') && d.date == moment().format('YYYY-MM-DD')) {
                            prepared.frozenAmount.push(d.frozen_amount.toFixed(2));
                        }else if (e.date+"-01"== moment(d.date).subtract(1, 'months').format("YYYY-MM-DD")) {
                            prepared.frozenAmount.push(d.frozen_amount.toFixed(2));
                        }
                    })
                }
                prepared.venderFee.push(e.vender_bonus);
                prepared.shopFee.push(e.shop_bonus);
                prepared.difference.push(e.difference_amount);

                var mfrozen=0;
                if(cnt !=0){
                    mfrozen=prepared.frozenAmount[cnt] - prepared.frozenAmount[cnt-1];
                    mfrozen=parseFloat(mfrozen).toFixed(2);
                }else{
                    mfrozen=prepared.frozenAmount[cnt];
                    mfrozen=parseFloat(mfrozen).toFixed(2)
                }
                prepared.monthly_frozen.push(mfrozen);

                var mactual = prepared.monthlyComplete[cnt]+prepared.shopFee[cnt]+prepared.venderFee[cnt]-prepared.monthly_frozen[cnt];
                mactual = mactual.toFixed(2);
                prepared.monthly_actual.push(mactual);

                var mprofit = prepared.shopFee[cnt]+prepared.venderFee[cnt]-prepared.monthly_frozen[cnt];
                mprofit = mprofit.toFixed(2);
                prepared.monthly_profit.push(mprofit);

                var startDate = prepared.date[cnt]+"-01";
                var endDate = moment(startDate).add(1,'months').format("YYYY[-]MM[-]DD");
                //var link = url+"?startDate="+startDate+"&endDate="+endDate; end by hank 20180308

                var sdt = startDate.replace("年","-").replace("月","")
                var edt = moment(sdt).endOf('month').format("YYYY-MM-DD")
                var link = "http://ka.aijihui.net/order/order-list?startDate="+sdt+"&endDate="+edt;
                prepared.report_link.push(link);

                json.push({"date":prepared.date[cnt],
                    'monthlyComplete':prepared.monthlyComplete[cnt],
                    'AccumulateComplete':prepared.AccumulateComplete[cnt],
                    'frozenAmount':prepared.frozenAmount[cnt],
                    'venderFee':prepared.venderFee[cnt],
                    'shopFee':prepared.shopFee[cnt],
                    'difference':prepared.difference[cnt],
                    'difference_total':prepared.difference_total[cnt],
                    'difference_ratio':prepared.difference_ratio[cnt],
                    'monthly_frozen':prepared.monthly_frozen[cnt],
                    'monthly_actual':prepared.monthly_actual[cnt],
                    'monthly_profit':prepared.monthly_profit[cnt],
                    "report_link":prepared.report_link[cnt]
                });
                cnt++;
            }
        });
        return json.reverse();
    }
    function inittable(data){
        $('#MonthlyVenderReport').bootstrapTable('destroy').bootstrapTable({
            pagination:true,
            pageSize:'All',
            // search:true,
            data:data


        })

    }


};