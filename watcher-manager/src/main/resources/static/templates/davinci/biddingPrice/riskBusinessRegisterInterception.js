Template.riskBusinessRegisterInterception.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#biddingPlatformTab').addClass('active');
    /*$('#ebayTab').addClass('active');*/
    $('#riskControllerTab').addClass('active');
    $('#containsClearTextTab').addClass('active');
    $('#riskBusinessRegisterInterception').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401EEE5FFE4EFC633D6088244A48EBDE593F1B172BBDE7BBD7690DEDEC3FD11FB909C018EA217B11131F4DF1561F055F742E43B8C25177532ED344D673F546810BEE8432370C1645D9CD7DC8BA0226CDC05D7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6B90844A4C49EE5FA3A8DE4659538F548BE67B659A5F35A13E2874116D28527301F6E07AF324129CB01AD6969D00420C8264C54C585AD87B5BC8C30A15A3C44A4C926DA90B25399DE930F1F9CA36511569029B33300A06D807A4D0F98F734845E1&type=dashboard"
        + "&_t=" + (new Date()).getTime();

    $("#frame_davinci").attr("src",url);

    $("#frame_davinci").load(function() {
        setTimeout(function() {
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