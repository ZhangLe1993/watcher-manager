Template.profitDe.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#biddingPlatformTab').addClass('active');
    $('#profitAnalysisTab').addClass('active');
    $('#profitDe').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D5234013F6CBE9CFED3AD5309574517ACBB6D7C0C069E0F732DCCCC83F45DFB7EAA92927EE3115A43D658A39193CE70BEAFE9CEE43B8C25177532ED344D673F546810BE9672C055EE049AB45C79E6BAE012AED9D7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6B22D6EF1A5DC3874838026ECECF331DC0271C7258E8033BC8EED90E8A1A0151F76E75DCE8347FF53A378C6A53A894FAE469F5CBA0F2752C4C0C329F34752554AA790860C2A0E3437C53B0C8FB3DCFB879FBC428C8008A5F189DEC106740CA69D9&type=dashboard"
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