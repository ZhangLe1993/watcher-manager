Template.popYX.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#empowermentTab').addClass('active');
    $('#sellerAnalysis').addClass('active');
    $('#popYX').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url = "https://abdavinci.aihuishou.com/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401F527B44BD6AA1BEEC9D6E482874F01C1A6B129C596A642A1DB4E1ACC8D4A0C41560E1B127905E37A8FEA98A6876BC011E43B8C25177532ED344D673F546810BEE9230B2BE0DC705592F163E11D0A2C34D7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6B21267B1A2B98EA550873996A050850EA6170931EFC8A15E10511C102DD1B269F2A8284C5A7F932875334355958E26724794BE0DB2373329E5F3A58F1ADD0C5611211B1A58B8CF0F31EB99CE9D82C43139A5167E0680F46FE01714D4E0080B777&type=dashboard"
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