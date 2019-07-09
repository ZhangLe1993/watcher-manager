
Template.alirealtimeordertemplate.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#dashboard').addClass('active');
    $('#realtimeOrder').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }
    $("#mainIFrame").css("height",window.innerHeight)

};
