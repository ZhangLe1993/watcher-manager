Template.businessOrderData.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#CompetitonPriceTab').addClass('active');
    $('#businessOrderData').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D52340107AC05FEFA6CC41FB2004814133808069E6636C18757692B8A7652A677694743DE588662A4B75FEBC7E4882483A89FC8B2A61355A235625968FC7D51AA20A6E9685AE1FBE31E60F85C1CD1286011AC2B43419A59BADDBEF1AF47E27705A851E0B5E88970C4B8037D8FD2A18E8E7DF576BA28772C08592100271B98C35DAD64BFD61253AE2CD7B50B82607CC7DB3515EF3A3A15765B0DFE678B1B6071344561F04E36C4510939D8A3123AC7244548FB8663089A0915655A884C59CDE4104F808304407F35BBEFB980C2437D55F0DACB34&type=dashboard"
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