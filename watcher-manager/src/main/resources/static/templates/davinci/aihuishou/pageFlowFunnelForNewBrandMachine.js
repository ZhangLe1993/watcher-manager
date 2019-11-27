Template.pageFlowFunnelForNewBrandMachine.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#aihuishouTab').addClass('active');
    $('#flowAnalysisTab').addClass('active');
    $('#conversionAnalysis').addClass('active');
    $('#pageFlowFunnelForNewBrandMachine').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D52340169B9A9391FE4214A75C8FE19BD4556B2F2DB69C0DB721E86471F81273955DC3448BE6D0F1741943710A2739126A261C6B2A61355A235625968FC7D51AA20A6E9502FF0404A0D823F70ED126CDDC0E6CE43419A59BADDBEF1AF47E27705A851E0864DA238AEFBD7BA5DD958E81A8466C1CB05AED7B22E53EC65DCA9D25FA40DCA08EBAD3788DE8B6A3CA4DEAFC25ED59FE4F2236D22D4FEE57A1A1FE72FC2C50AEBD633DDAAF1BB8AABCAE2B85C050A418B2D5B3BE78F4F1FC13E0C79B90A903A5A57C84206BCC7FB9F6CB4A78A1C3669&type=dashboard"
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