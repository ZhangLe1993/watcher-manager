Template.buyerHierarchicalPortrait.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#channelSideTab').addClass('active');
    $('#BuyerRelatedDataStatement').addClass('active');
    $('#buyerHierarchicalPortrait').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D52340130F8C4665F77D6E78930A15ABD20C10C399122D1ADD3059F2D7ECD3798B5D728DE588662A4B75FEBC7E4882483A89FC8B2A61355A235625968FC7D51AA20A6E99B7DE5FECA5F0CF6F858CB77FA35688543419A59BADDBEF1AF47E27705A851E0D1BAB8CA4CD0AE25E7A5DA0BB713CDCA03C577088E2CBE59EA10B7081E4AF0DB04E8CC99B6B962AFF017614AB55E55B3D26E3AAC2667E19F3112AFB548F306D709B487D097516B68FCADC1ECA7C0F0DF2D32A892A1234283438D9746F5484E17FF3F388725823130D3FE0F89146C5765&type=dashboard"
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