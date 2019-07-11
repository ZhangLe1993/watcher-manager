Template.sellerBasicInformation.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#empowermentTab').addClass('active');
    $('#sellerAnalysis').addClass('active');
    $('#sellerBasicInformation').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D52340190E08A34E2AF49A37CB054DC6F171DF6F3877288A40097F96A7FCDB4146DD6CB4E5DCA8BD6408F46B5BDB2581C3E6734E43B8C25177532ED344D673F546810BEF78389095C1B2FB800938CCD12C4865FD7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6BB103AA6DC15A53BFD59047A8745FF5D3C3460A3A0EF8925E62EA3662C6541C6B15811AC4E937CC1B4E6D364C6CC10B780E816C588914859E8757ADED68541DD2F1829FA8E95E764ED7D445299D8B41B23B744A2586F4038076D91B67F476128A&type=dashboard"
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