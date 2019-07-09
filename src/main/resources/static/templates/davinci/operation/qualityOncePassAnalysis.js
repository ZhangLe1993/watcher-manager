Template.qualityOncePassAnalysis.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operationPlatformTab').addClass('active');
    $('#qualityCheckTab').addClass('active');
    $('#qualityOncePassAnalysis').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401B07D89358E90E111DEFAEC2C8B9B201E45222461257291C754F30B43D86CA264B739C3E041F6C5492CC7B3BAEA158494B2A61355A235625968FC7D51AA20A6E9268909865A7D1F29B00C9360423831B243419A59BADDBEF1AF47E27705A851E06ABD756BF7E2914356322B48FECC7C68C5AE8B56938D8FFADA5DA0EB171D1A1903555A356795219D5E7FEED195AF366C952D3989217BE8207A8D67867109A94B97516D927F79F7C553D978E0B3D4C7C7F8A6F25F7B7E71137BD8C7A5989FFC1C2728A81DF8C366CC3302726451AA67E2&type=dashboard"
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