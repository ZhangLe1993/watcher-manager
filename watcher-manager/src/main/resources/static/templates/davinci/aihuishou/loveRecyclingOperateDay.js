Template.loveRecyclingOperateDay.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#aihuishouTab').addClass('active');
    $('#ahsOverviewTab').addClass('active');
    $('#loveRecyclingOperateDay').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D5234013F8621A97120C41C42A307F1EB1DD0D20F37AF696B10C02685A3E982F3583DFDDA4096A8E8077930A64DC2338AE692C3B2A61355A235625968FC7D51AA20A6E95EA0DE1BBDDCBFA0934384D9CD5BE2EC43419A59BADDBEF1AF47E27705A851E069051D1F5208EA664396F6AA86458B900E3D6C97787508065759BE2C0154ED291B5AE30E9D75F873FD10BAF3CBA837C481E10E8B87324873580E25D41C33D53C769235E25B47BE2F2C98A5BA1DB7153D0F4D81426AE98F898CC797FA8F44BB86217F300C876008128609B10CD4FE3AC2&type=dashboard"
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