Template.frontAndAfterRejectAni.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operationPlatformTab').addClass('active');
    $('#rejectGoodsTab').addClass('active');
    $('#rejectGoodsReviewTab').addClass('active');
    $('#frontAndAfterRejectAni').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401D5A06FE7A46808E1CB19F2C10618C2770C287469F12A772D4881C41D653CA4EF6217A386851B741EAC68DBA02B3DEE7FB2A61355A235625968FC7D51AA20A6E9B2A088DFB6C693862464FDAF8F8AB97E43419A59BADDBEF1AF47E27705A851E0727D8BD0328FD940DD6EB2BEB77F13BED447569A8B6E6633E1C8BBA2DD42751E1EBE949BCFF3EBF87FF9BAC18E1675EE5FDE1FEB01DFEF5CEFCC933422BE5772E95D6A97AF1DF4F2DA250F388A6ABFE78C9ECA5C387796751FEA7DDBE74E011C4C7F69E0322D6B8F530A4FDB16A10751&type=dashboard"
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