Template.VenderOrderLostAnalysisIframe.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#VenderOrderLostAnalysisIframe').addClass('active');

    //var url =  '/vender/VenderBussinessAnalysis/5303/成都讯捷通讯连锁有限公司';
    var url='http://192.168.31.248:3000/vender/VenderOrderLostAnalysis/8/成都英普瑞生通讯设备有限公司';
    $('#mainIFrame').attr('src',url );
};