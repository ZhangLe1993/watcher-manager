Template.tsck.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#aihuishouTab').addClass('active');
    $('#stockAnalysisTab').addClass('active');
    $('#tsck').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401CCF25E5D9176D984D63B3C58BED2A5987C71464CBC4336B59EC938504040CB7D3C1A0EB6443A5A665E2B8EDBC890DE78E43B8C25177532ED344D673F546810BE8B12D3184FCC0DE240618C662F12A656D7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6B6446D2257D8020A76A24CF4206BCD6B8625D093808BC3AA25C2CE4AD480E39096B3F05D7EEDECE3D66549F15C623638888E20B1788401DD58E72ADED46E0DD56F4676E5B6E21ADDD5527E7B15B0836787AAEEDA4272A0C6BF2D67EB587598FA6&type=dashboard"
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

function receiveMessage(event) {
    console.log(event.origin);
    if (event.origin !== davinci){
        return;
    }
    console.log("子页面有消息回来了");
    console.log(event);
    $("#frame_davinci").attr("height",accAdd(accMul(event.data,1),300) + 'px');
    window.removeEventListener("message", receiveMessage, false);
}