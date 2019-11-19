Template.sendGoodsAnalysis.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operationPlatformTab').addClass('active');
    $("#houseTab").addClass('active');
    $("#sendGoodsTab").addClass('active');
    $('#sendGoodsAnalysis').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401DD81CD85A8CB58A173FEBACF41CC662106ABC9AA52E54ACEF619AF7906C73A324AFD14DE444861E9B140DF826178A24CB2A61355A235625968FC7D51AA20A6E9F5514919E49FB41BCFA2442C623FF9F143419A59BADDBEF1AF47E27705A851E0B396D290FFF904D45454C7BD342C3E9CA98EE35BB468744018102F57169E4635F1A34E7DC31726F2D6403B6D426B43221702056FC12B613D4F0D51E7412A7D5D2AC698F1B69870A4702C737822BB3533F37469E9C2FA44AF285CCC1E7235862723D26EE69AE5B5E9BE9E2684A23FDC73&type=dashboard"
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