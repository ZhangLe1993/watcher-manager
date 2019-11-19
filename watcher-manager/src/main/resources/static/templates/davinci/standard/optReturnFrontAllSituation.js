Template.optReturnFrontAllSituation.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operationPlatformTab').addClass('active');
    $("#rejectGoodsTab").addClass('active');
    $("#userFrontRejectGoodsTab").addClass('active');
    $('#optReturnFrontAllSituation').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401DBEC55D7585DE603385F855BFBD0AB1509186D365890541C89464413AA04C08EE968E7891EAC234F06CF4E25A3D25D84B2A61355A235625968FC7D51AA20A6E96A6C7C9659F86F30A79271239F45E80843419A59BADDBEF1AF47E27705A851E069051D1F5208EA664396F6AA86458B905A2FE65C06959ECE8764D5CE7CC4E97F86EA6D055BDC8225BFDEF0F536D6A7F69801A8D586FD548D1DC7DECE7D54A73FAD57899B2DBB3F2CBA1589B1055118BC8D9A37D2042E40176468061FAA9368D215DCE168793D1D4F92C70AF58BC50E79&type=dashboard"
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