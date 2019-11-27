Template.receiveGoodsAnalysis.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operationPlatformTab').addClass('active');
    $('#receiveGoodsTab').addClass('active');
    $('#receiveGoodsAnalysis').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D52340172E47BE1C77F1B191A039682148F76EE7BED36D4D50B13A8A596ABDDECF65052E968E7891EAC234F06CF4E25A3D25D84B2A61355A235625968FC7D51AA20A6E9479D7F69E134E331D8E2974D7A4F6B4B43419A59BADDBEF1AF47E27705A851E0727D8BD0328FD940DD6EB2BEB77F13BE8FBC9E5D252CC5BD9139BB8B1A44A675DB6A3F2803B156CEE95F563B89935D74BDEE5330DEA2515E4F05EB7DB9D19702F5C0BB0B57475E2C2396821D1D52A0C582B6317805D27280C9BA77BD7586FF5C0828A1332AF5CF9F1ED09D64ABCA217D&type=dashboard"
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