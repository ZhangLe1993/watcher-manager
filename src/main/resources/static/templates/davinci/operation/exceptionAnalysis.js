Template.exceptionAnalysis.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operationPlatformTab').addClass('active');
    $('#receiveGoodsTab').addClass('active');
    $('#exceptionAnalysis').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D52340141511BAF236D83D53F7F6C5D4D71077B2D41179344A05684918C8B543D66F5410D7BAD6F5AA490947F4F1BAADCF26EF5B2A61355A235625968FC7D51AA20A6E9ACC3705CF8E1ACC6E039702FD110AA5D43419A59BADDBEF1AF47E27705A851E0BEE343D7FFF473C29D694719EF659297757911BBADC28B1F7993A4130F7714FDCB83C60663DBC7E54C7FBDAFBB7186668698B2628BFBEF4C661217A076E0920A820AC5E1C57636C10E6EEFC6F94504AC19E4205FAA0A791D7DB56A6ACA2E06C42B1608FA711371AAE3A953752D36D889&type=dashboard"
        + "&_t=" + (new Date()).getTime();

    $("#frame_davinci").attr("src",url);

    $("#frame_davinci").load(function() {
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