Template.ubrw.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#aihuishouTab').addClass('active');
    $('#specialTab').addClass('active');
    $('#ubrw').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D52340131321A8F0B324067737FBEA8F410D0A1452AA4DED8731A23C56A465A72510FB3FB0FEED14759D1D15E898052EF701396E43B8C25177532ED344D673F546810BE1694FE0A8C0350E313A145E99FE7813ED7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6B54D7197D55291F02054A61CF8F7858899EE625AB723D7795309C19F2D4BE41DB895D987FCAF514B745E5C294E861A3FF0376A692AE39CEC5FB4A0F2A8ECCF476EBB615428EEB54259073C91C82E20AF389EC313A3A21325C38F6D148A3B17618&type=dashboard"
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