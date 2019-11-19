Template.replacementOrder.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#aihuishouTab').addClass('active');
    $('#goodsAnalysisTab').addClass('active');
    $('#replacementOrder').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401EBFF5601E6C34622F8748E21D511ED2E067778E712BB82DB539A0ABBFFE9A2AA12C890B31D9A9257D3AF736FD0DB6411B2A61355A235625968FC7D51AA20A6E96BF163D1CA232CEF70E7FCD7B2F245DA43419A59BADDBEF1AF47E27705A851E0649DC95944907E40826FD60B28D64DBBDF2FDDC2B7FCE6FA23A20B16A8B2E3036859612D35DD624645EC23D45490DD88CF976FBA09B9AAF62BFE6543A886D5991327232C4A2DA8F43C5B6CCA00C908AADC29A0CD1AAFB8BA464FA8EBEAA7786BC148FF26C6C92E5D23ADA026BFC9E790&type=dashboard"
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