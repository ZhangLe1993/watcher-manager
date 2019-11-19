Template.newMarketFlowFunnel.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#aihuishouTab').addClass('active');
    $('#flowAnalysisTab').addClass('active');
    $('#marketChannel').addClass('active');
    $('#newMarketFlowFunnel').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D52340188843B62D39BD6B16DFA945FBBB65FAD0BF9B741D7DE42528D2F5050CBAACC8D8CD6C5ADF4D589E2274987588553E3AAB2A61355A235625968FC7D51AA20A6E9C7F7C1EA85DA7E38372FE2CF0B24BF9D43419A59BADDBEF1AF47E27705A851E0B396D290FFF904D45454C7BD342C3E9CAE6435CF74789693983B311FE9CE72B54FE360FEFCC156FD4131FA8B821334185857DE66E0C77A74FEE03BA2FC30E95CDCD7D46966AF5CB2102234958EE14AA6501151DF3D3FE5CF9C461281DB3DB4CEC50D1EB7C0B948FEC47B8710BFF5C121&type=dashboard"
        + "&_t=" + (new Date()).getTime();

    $("#frame_davinci").attr("src",url);

    $("#frame_davinci").load(function() {
        setTimeout(function() {
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