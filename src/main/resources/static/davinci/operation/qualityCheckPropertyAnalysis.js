Template.qualityCheckPropertyAnalysis.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operationPlatformTab').addClass('active');
    $('#qualityCheckTab').addClass('active');
    $('#qualityCheckPropertyAnalysis').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D5234013AA811D831A92500109A6FF0C4E3576B14904AE554EB74BEA75440D4F76FC8B7E968E7891EAC234F06CF4E25A3D25D84B2A61355A235625968FC7D51AA20A6E92FE1E39E1FF883954D8F12769708356343419A59BADDBEF1AF47E27705A851E01E3C061010AD33D91986A94B6ECCACE61E391095F9802285B502FB0097C8FE720B47563A9E177B0F5406A824EE39F6393D8A5DF971EA12E3996EA514018BF3965F2A7675D7D734E3280E40ADA71CECAEE444D080517A8387C11097C9A8B5FB80624133D6786A39ECBA0EAF3CA7070BA0&type=dashboard"
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