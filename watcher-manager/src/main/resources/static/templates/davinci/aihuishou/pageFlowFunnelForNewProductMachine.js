Template.pageFlowFunnelForNewProductMachine.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#aihuishouTab').addClass('active');
    $('#flowAnalysisTab').addClass('active');
    $('#conversionAnalysis').addClass('active');
    $('#pageFlowFunnelForNewProductMachine').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D52340126AE342062BA55945B8C91D9E89CBDE415E577C6230845395871211D933B4496611ED935FDBE1122952CC5E71DC82E26B2A61355A235625968FC7D51AA20A6E91C43B8A1EA606CB23B4B506CE96627AB43419A59BADDBEF1AF47E27705A851E0864DA238AEFBD7BA5DD958E81A8466C1B4DDA38DC77BB436112820734E491BDDE595C84D35148EF1FC432AE8E59EE7720E07203765CEDC8EFF472444E26EA337869A3CC6092B4F9BE81634C88B33276598D28EE098958027F66DB08AFDDFFE9208E1A66E5874BA6968AC907B32E66A87&type=dashboard"
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