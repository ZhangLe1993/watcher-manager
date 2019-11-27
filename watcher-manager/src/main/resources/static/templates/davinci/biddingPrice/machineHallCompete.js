Template.machineHallCompete.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#biddingPlatformTab').addClass('active');
    $('#liveTab').addClass('active');
    $('#machineHallCompete').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D5234016146BE7FD3EF74ABC3C9E3E9312198FB4B16BCF74663DEC06745906EC68AA878074A7B838FF8D9AD0E2329046E549066E43B8C25177532ED344D673F546810BED5712A3E81733548752AE405FC7CD452D7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6B626AF23CDE598A0B96A9A3874F0E85F336B68B676B708460E25E124391BB0CF3D1C166AE0DDAC54D11CB2AF8CB1698A7973BC8D71A5B24CC5BD132E7FAC9E0D3D991F2183A8DAE5F97F675B0E1060D79C7A578575C1E76D17449464160A5118D&type=dashboard"
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