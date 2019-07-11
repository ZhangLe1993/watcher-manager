Template.riskControlVenderParentGroupDetailInfoModal.rendered = function () {
    //$('.navi-tab').removeClass('active');
    //$('#VenderTab').addClass('active');
    //$('#RiskPermissionControl').addClass('active');
    //$('#riskControlUserPackageInfo').addClass('active');
    //
    //var ua = navigator.userAgent.toLowerCase();
    //var isAndroid = ua.indexOf("android") > -1;
    //var isiOS = ua.indexOf("iphone") > -1;
    //if (isAndroid || isiOS) {
    //    $('.sidebar-toggle').click();
    //}

    vender_parent_name.push(Template.currentData().vender_parent_name);
    vender_group_name.push(Template.currentData().vender_group_name);
    startDate=Template.currentData().startDate;
    endDate=Template.currentData().endDate;
    type=Template.currentData().type;

    renderPageDay();

    };

var filter={},vender_parent_name=[],vender_group_name=[],startDate,endDate,type;

function getSelectedFilter() {
    filter.startDate=startDate;
    filter.endDate=endDate;
    filter.vender_parent_name=vender_parent_name;
    filter.vender_group_name=vender_group_name;

    return cleanParams(filter);
}

function renderPageDay() {
    //var dateGap = -15;
    var filter=getSelectedFilter();
    if(type=="总账户") {
        $("#table").hide();
        $("#loading").hide();
        var promise = getRiskControlProfitLostVenderEmbedDetailInfoStatistic(filter);
        promise.done(function (ret) {
            $("#table").show();
            $("#loading").hide();

            //renderTable
            renderTable(ret, 'venderTable');
        });
    }else if(type=="门店"){
        $("#table").hide();
        $("#loading").hide();
        var promise = getRiskControlProfitLostVenderGroupEmbedDetailInfoStatistic(filter);
        promise.done(function (ret) {
            $("#table").show();
            $("#loading").hide();

            //renderTable
            renderTable(ret, 'groupTable');
        });
    }

}

//消费者红包分析
function renderTable(data,tableName) {
    data.forEach(function (e) {
        e.mistakeCnt=eval(e.repairCnt)+ eval(e.inletCnt)+ eval(e.bootstrapCnt);
        e.mistakeRate= ((e.mistakeCnt/ eval(e.Cnt))*100).toFixed(2)+"%";
        e.tolerateRate=((eval(e.inspection_tolerate_num)/ eval(e.vender_item_quotation_price_num))*100).toFixed(2)+"%";
        e.specialNum= eval(e.special_remitted_num)+ eval(e.special_num);
        e.specialRate=(((e.specialNum)/ eval(e.vender_item_quotation_price_num))*100).toFixed(2)+"%";
        e.goldenEggBonusNum= (eval(e.golden_egg_num)+ eval(e.bonus_num)).toFixed(2);
        e.goldenEggBonusRate=((e.goldenEggBonusNum/ eval(e.vender_item_quotation_price_num))*100).toFixed(2)+"%";
    })

    if(tableName=="venderTable") {
        $('#dataTable').bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data: data,
            columns: [{
                field: 'vender_parent_name',
                title: '总账户名称',
                sortable: true
            }, {
                field: 'mistakeCnt',
                title: '拆修进水炸弹机',
                sortable: true,
                formatter:function(value,row,index){
                    //
                    //var val=value.replace(/\//g,"%2F")
                    //val=val.replace(/\?/g,"%3F")
                    //return "<a class='cus_modal' data-fancybox-type='iframe' href='/product/pageViewModal/"+val+"/"+row.idsite+"/"+area+"/"+city+"'>"+value+"</a>"
                    return "<a class='cus_modal'  data-fancybox-type='iframe' href='/vender/riskControlVenderQualityErrorAnalysisModal/"+row.vender_parent_name+"/总账户/"+startDate+"/"+endDate+"/总账户part'>"+row.mistakeCnt+"（详情）</a>"
                }
            }, {
                field: 'mistakeRate',
                title: '拆修进水炸弹机与验货订单比值',
                sortable: true
            }, {
                field: 'inspection_tolerate_num',
                title: '小微容忍金额',
                sortable: true
            }, {
                field: 'tolerateRate',
                title: '小微容忍金额与出货金额比值',
                sortable: true
            }, {
                field: 'specialNum',
                title: '特殊豁免+特殊补款金额',
                sortable: true
            }, {
                field: 'specialRate',
                title: '特殊豁免+特殊补款金额与出货价格比值',
                sortable: true
            }, {
                field: 'goldenEggBonusNum',
                title: '金蛋+红包金额',
                sortable: true
            }, {
                field: 'goldenEggBonusRate',
                title: '金蛋+红包金额与出货价格比值',
                sortable: true
            }
            //    ,{
            //    field:'#',
            //    title:'查看',
            //    sortable:true,
            //    formatter:function(value,row,index){
            //
            //        //var val=value.replace(/\//g,"%2F")
            //        //val=val.replace(/\?/g,"%3F")
            //        //return "<a class='cus_modal' data-fancybox-type='iframe' href='/product/pageViewModal/"+val+"/"+row.idsite+"/"+area+"/"+city+"'>"+value+"</a>"
            //        return "<a class='cus_modal'  data-fancybox-type='iframe' href='/vender/riskControlVenderGroupMSTRModal'>亏损订单详情</a>"
            //    }
            //}
            ]
        });
    }else if(tableName=="groupTable"){
        $('#dataTable').bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data: data,
            columns: [{
                field: 'vender_group_name',
                title: '门店名称',
                sortable: true
            }, {
                field: 'mistakeCnt',
                title: '拆修进水炸弹机',
                sortable: true,
                formatter:function(value,row,index){
                    //
                    //var val=value.replace(/\//g,"%2F")
                    //val=val.replace(/\?/g,"%3F")
                    //return "<a class='cus_modal' data-fancybox-type='iframe' href='/product/pageViewModal/"+val+"/"+row.idsite+"/"+area+"/"+city+"'>"+value+"</a>"
                    return "<a class='cus_modal'  data-fancybox-type='iframe' href='/vender/riskControlVenderQualityErrorAnalysisModal/"+vender_parent_name+"/"+row.vender_group_name+"/"+startDate+"/"+endDate+"/门店part'>"+row.mistakeCnt+"（详情）</a>"
                }
            }, {
                field: 'mistakeRate',
                title: '拆修进水炸弹机与验货订单比值',
                sortable: true
            }, {
                field: 'inspection_tolerate_num',
                title: '小微容忍金额',
                sortable: true
            }, {
                field: 'tolerateRate',
                title: '小微容忍金额与出货金额比值',
                sortable: true
            }, {
                field: 'specialNum',
                title: '特殊豁免+特殊补款金额',
                sortable: true
            }, {
                field: 'specialRate',
                title: '特殊豁免+特殊补款金额与出货价格比值',
                sortable: true
            }, {
                field: 'goldenEggBonusNum',
                title: '金蛋+红包金额',
                sortable: true
            }, {
                field: 'goldenEggBonusRate',
                title: '金蛋+红包金额与出货价格比值',
                sortable: true
            }
            //    ,{
            //    field:'#',
            //    title:'查看',
            //    sortable:true,
            //    formatter:function(value,row,index){
            //
            //        //var val=value.replace(/\//g,"%2F")
            //        //val=val.replace(/\?/g,"%3F")
            //        //return "<a class='cus_modal' data-fancybox-type='iframe' href='/product/pageViewModal/"+val+"/"+row.idsite+"/"+area+"/"+city+"'>"+value+"</a>"
            //        return "<a class='cus_modal'  data-fancybox-type='iframe' href='/vender/riskControlVenderGroupMSTRModal'>亏损订单详情</a>"
            //    }
            //}
            ]
        });
    }
}

function cleanParams(filter) {
    //clean parameters
    var query = _.clone(filter);
    for (var key in query) {
        if (!query[key] && key != "offset") {
            delete query[key]
        }
    }
    return query
}

//风控--总账户详细信息
function getRiskControlProfitLostVenderEmbedDetailInfoStatistic(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getRiskControlProfitLostVenderEmbedDetailInfoStatistic", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}

//风控--门店详细信息
function getRiskControlProfitLostVenderGroupEmbedDetailInfoStatistic(filter) {
    //clean parameters
    var query = _.clone(filter);
    var flag = query["dateType"];
    delete query["userId"];
    delete query["sign"];
    delete query["dateType"];
    var dfd = $.Deferred();
    if (flag == "daily" || !flag) {
        requestURL(dataService + "/Vender/getRiskControlProfitLostVenderGroupEmbedDetailInfoStatistic", query).done(function (ret) {
            dfd.resolve(ret)
        });
    }
    return dfd.promise()
}




