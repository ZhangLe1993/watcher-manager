Template.reasonsReturnSubstitutedItems.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#CompetitonPriceTab').addClass('active');
    $('#reasonsReturnSubstitutedItems').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D52340164252555C17A860FC0FDA4959C82059EA8D581E9CB011F4E769BDBB086267E88DE588662A4B75FEBC7E4882483A89FC8B2A61355A235625968FC7D51AA20A6E9F3812A0BC98C9FBF4DBAD3B3091878C343419A59BADDBEF1AF47E27705A851E0082330FCB5F8DCAF31ED3F082AB43E31F46F10F041C772CEEF1DD501462D1259D1BC84B3DBFC89054887E8DC795155470CBA292BE68C82D35DC29DE8C8B0584E0D230A3F37742A50EF57391402F34A910C081D06248170B1F9B74451091DE05796160C37D4BD121D62516DE2D476105B&type=dashboard"
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