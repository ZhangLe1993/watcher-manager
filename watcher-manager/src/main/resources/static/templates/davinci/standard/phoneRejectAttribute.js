Template.phoneRejectAttribute.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operationPlatformTab').addClass('active');
    $("#rejectGoodsTab").addClass('active');
    $("#userFrontRejectGoodsTab").addClass('active');
    $('#phoneRejectAttribute').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D52340114D052044887F7217794CFB03FA174B7F9AEAFEFF651F45B94342E4A8EE8FA5EDAF0D5B1D7D4CEC8541D9BE6E5223845B2A61355A235625968FC7D51AA20A6E922150FF059C5B075EF9485623753B05443419A59BADDBEF1AF47E27705A851E0A55574D0E07A14BAF96770D15C4778F4599CDF42C6C8650F804AC905DD047855293B3C9ADB12249B635C9891055B6BEB03D083E92B51378B87B06C5874090D382675F89F9074C493A672AE0BB3FDD114E8A380C76931793B4F4683F74DD40E439B7585F2D73014316D765D3CF0D7B47C&type=dashboard"
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