Template.returnOverallSituation.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operationPlatformTab').addClass('active');
    $('#rejectGoodsTab').addClass('active');
    $('#recyclerRejectGoodsTab').addClass('active');
    $('#returnOverallSituation').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D52340177EAEBD82ABFDCFEDB08832386BB72E052DBCF7FA3C072EFE997E288CE7548EACB59D6C52FB0F7EE6919BB9649B7EAE5B2A61355A235625968FC7D51AA20A6E981FE6198EA2633EE9E0AE5D77825677143419A59BADDBEF1AF47E27705A851E0BEE343D7FFF473C29D694719EF6592974DE0C8BD5DBE112B5C7DDAC33615305C68807CAF5A7A53381FAF031535924CCEEDE51B3F59613F12BDAB0B7461C0E5E619FD83B0E9F974B47388BB2EB1E6ACE549D0200283E649EF9C3453B66DF2EAC8AFFA71F2B3F3D41699481AB6A616978D&type=dashboard"
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