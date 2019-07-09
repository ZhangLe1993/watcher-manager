Template.dayMonitor.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#OverseasBusinessUnitTab').addClass('active');
    $('#overseasOPC').addClass('active');
    $('#dayMonitor').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }

    var url = "http://47.97.240.5:8092/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D5234014B5116A75CC33C92F4E8B846FE33E193FE4CFC25B8C63C5F7073BA0AF2828A2BDA4096A8E8077930A64DC2338AE692C3B2A61355A235625968FC7D51AA20A6E92905AC1E6BE53068FE6996A983B0F1A243419A59BADDBEF1AF47E27705A851E0D0D5C6F967E6B24B84BCFC063DD89AE2957158888439EDE6BCBCE55935761DF2182E5F503AD4082F45B2FDE8C2AAC2436110F128209F9EE21C97E2950CECE5B53D0FCF877F6DEF5E018133AB812F995F2F08C4E610638DC6F3FC1FAFAEF9F5BE7CD57E60470BF553CFC38F8D93B32624&type=dashboard"
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