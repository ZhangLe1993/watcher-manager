Template.outGoodsMonitoring.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#OverseasBusinessUnitTab').addClass('active');
    $('#overseasOPC').addClass('active');
    $('#outGoodsMonitoring').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url = "http://47.97.240.5:8092/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401C05B0599C6E7C9716B17CA6EC1356650C10B559AC424EB032A22517C368864DDBB96EA047A69D05E6A9014B461C07116B2A61355A235625968FC7D51AA20A6E9CA66D552036B36C04D4CD83D1ABD193943419A59BADDBEF1AF47E27705A851E09793C66B09104ADAF8B181A92D2B60B9CD850103C5956D8E0A4C87A93C7D005C0F0020007F16D7173C80299867145AC77717E7337FBAF9B03C3B17D6348961C2480D8840D8C35D738D490B5DC2ECB8D47662D2B5235E5D9B81FF5408697F15155B1C6BD2A19F310BE87B7924F83031E5&type=dashboard"
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