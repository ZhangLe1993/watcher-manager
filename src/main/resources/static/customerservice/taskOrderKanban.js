Template.taskOrderKanban.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#CustomerServiceTab').addClass('active');
    $('#newCustomerServiceMSTRTab').addClass('active');
    $('#taskOrderKanban').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }

    var url = "http://47.97.240.5:8092/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D52340197339A6FC738540054718EA3D58FF04D68AB93049F60274EB8B458C80799A329B739C3E041F6C5492CC7B3BAEA158494B2A61355A235625968FC7D51AA20A6E97926D622A2C3356259D3E848C981FE2743419A59BADDBEF1AF47E27705A851E0F9A3FEE65E889CDDC82316B9D97655D93BD75EA21F96666F373D377FCB1D4F3A56AA122BF94A11D0E327D15D896913A480FAB42E193E98E49721AC0DFE6FB350FEE89E7F03B3F909070563E9AE4CC5C6806A3C657E4CB22EFD3DA2AC111E714F8C1C44D2ECFC2965F75795288EF6B285&type=dashboard"
        + "&_t=" + (new Date()).getTime();
    $("#frame_davinci").attr("src",url);

    $("#frame_davinci").load(function(){
        setTimeout(function(){
            var frame = document.getElementById("frame_davinci").contentWindow;
            var message = {parentOrigin:window.origin,msg:"收到请回复"};
            frame.postMessage(JSON.stringify(message), davinci);
            console.log('发送成功');
        },2000);
        window.addEventListener("message", receiveMessage, false);
    });
};

function receiveMessage(event)
{
    console.log(event.origin);
    if (event.origin !== davinci){
        return;
    }
    console.log("子页面有消息回来了");
    console.log(event);
    $("#frame_davinci").attr("height",accAdd(accMul(event.data,1),300) + 'px');
    window.removeEventListener("message", receiveMessage, false);
}