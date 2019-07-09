Template.listRepeatedReturns.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operationPlatformTab').addClass('active');
    $("#rejectGoodsTab").addClass('active');
    $("#recyclerRejectGoodsTab").addClass('active');
    $('#listRepeatedReturns').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D5234013D28295D20DC0F3E1A49ED5E422EBF5218A2DCC74E1AA187D11E8223C154973012C890B31D9A9257D3AF736FD0DB6411B2A61355A235625968FC7D51AA20A6E9E447EEB931D900B2DEDDBC6D7C79646843419A59BADDBEF1AF47E27705A851E0082330FCB5F8DCAF31ED3F082AB43E31318916E6B58608DB92E5BB1FA6928C0D72ED8FAAF2DAFBFEDFEFDC2F12B821E93B731F34F31650C22978AAEC425078F9C084F1A7970AD9A9E6FDD91FE2D9E8ADA139B9F07A60FB0C6A7333AEA1CB5DCDA6DD2B008439C6EE4542D5E562AEEB78&type=dashboard"
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