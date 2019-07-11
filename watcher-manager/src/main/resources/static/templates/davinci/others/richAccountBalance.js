Template.richAccountBalance.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#FinanceTab').addClass('active');
    $("#auctionHallTab").addClass('active');
    $('#richAccountBalance').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D5234018AFDF528791135155ABAA58BC8252BBB657895804447459683BD1FCC0BB5A86165391944018D27ED309A005B54B0DB93E43B8C25177532ED344D673F546810BE5ABA5B1B9399990B6A1D194119AAE663D7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6BA081AE9556E662150958940B98E516FDD87E3B36C8A54E3BACB5E142B5366738D65C450C43491ECD931729EF79304455EAFD490D00BA9BB2311A2D4DB821BC5D8E97DF2E86225BC8AB0CC3722A2372870382E9AA55D80A130DE766F0A82AFF69&type=dashboard"
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
    if (event.origin !== davinci) {
        return;
    }
    console.log("子页面有消息回来了");
    console.log(event);
    $("#frame_davinci").attr("height",accAdd(accMul(event.data,1),300) + 'px');
    window.removeEventListener("message", receiveMessage, false);
}