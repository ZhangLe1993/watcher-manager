Template.JDRiskOrderTempl.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#RiskTab').addClass('active');
    $('#jdRiskControlTab').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }

    var columns = [{
        field: 'date',
        title: '时间',
        sortable: true
    },{
        field: 'trade_cd',
        title: '订单号',
        sortable: true,
        formatter:function(value,row,index){
            return "'"+value
        }
    },{
        field: 'user_key',
        title: 'user_key',
        sortable: true
    },{
        field: 'trade_source_type_name',
        title: '订单渠道',
        sortable: true
    },{
        field: 'trade_source_agent_name',
        title: '订单子渠道',
        sortable: true
    },{
        field: 'submit_product_name',
        title: '商品',
        sortable: true
    },{
        field: 'jd_credit_level',
        title: 'jd信用等级',
        sortable: true
    },{
        field: 'preAmount',
        title: '预付金额',
        sortable: true
    },{
        field: 'submitAmount',
        title: '提交金额',
        sortable: true
    },{
        field: 'tradeAmount',
        title: '成交金额',
        sortable: true
    },{
        field: 'tradeStatus',
        title: '交易状态',
        sortable: true
    },{
        field: 'submit_trade_address_txt',
        title: '收货地址',
        sortable: true
    },{
        field: 'ip',
        title: 'ip',
        sortable: true
    },{
        field: 'id_card',
        title: '身份证',
        sortable: true
    },{
        field: 'mobile',
        title: '手机号',
        sortable: true
    },{
        field: 'user_name',
        title: '姓名',
        sortable: true
    },{
        field: 'jd_characteristic',
        title: '行为偏好',
        sortable: true
    },{
        field: 'jd_his_performance_score',
        title: '历史履约分',
        sortable: true
    },{
        field: 'jd_prt_csm_con_num_month_12_mon',
        title: '近360天消费活跃度（月份数）',
        sortable: true
    },{
        field: 'jd_prt_csm_tol_con_cnt_12',
        title: '近360天消费频率（笔数）',
        sortable: true
    },{
        field: 'jd_prt_csm_tol_con_amt_12',
        title: '近360天消费能力(金额)',
        sortable: true
    },{
        field: 'jd_identity',
        title: '身份特质',
        sortable: true
    },{
        field: 'jd_prt_csm_max_consume_amt_12',
        title: '近360天最高消费能力（金额）',
        sortable: true
    },{
        field: 'jd_property',
        title: '资产价值',
        sortable: true
    },{
        field: 'jd_relationship_network',
        title: '关系网络',
        sortable: true
    },{
        field: 'jd_credit_score',
        title: 'jd信用分',
        sortable: true
    }]

    requestURL(dataService + "/riskcontrol/getjdCreditOrderDetail", {}).done(function (data) {
        $('#creditTable').bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data: data,
            search: true,
            columns: columns
        });
    })

    requestURL(dataService + "/riskcontrol/getjdTradeInAllowanceOrderDetail", {}).done(function (data) {
        $('#TradeInAllowanceTable').bootstrapTable('destroy').bootstrapTable({
            exportDataType: 'all',
            data: data,
            search: true,
            columns: columns.concat([
                {
                    field: 'oldtonew_pre_pay_amount',
                    title: '以旧换新预付款金额',
                    sortable: true
                },
                {
                    field: 'device_id',
                    title: '设备号',
                    sortable: true
                },
                {
                    field: 'credit_pre_pay_amount',
                    title: '信用回收预付款金额',
                    sortable: true
                },
                {
                    field: 'new_product_amount',
                    title: '新机价格',
                    sortable: true
                },
                {
                    field: 'actual_subsidy_price',
                    title: '实际补贴金额',
                    sortable: true
                },
                {
                    field: 'new_product_name',
                    title: '新机商品名称',
                    sortable: true
                }
            ])
        });
    })
};