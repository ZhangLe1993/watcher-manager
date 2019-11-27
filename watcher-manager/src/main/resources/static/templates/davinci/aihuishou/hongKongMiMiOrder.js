Template.hongKongMiMiOrder.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#aihuishouTab').addClass('active');
    $('#specialTab').addClass('active');
    $('#hongKongMiMiOrder').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401C1FDC243B185565E0A5FB514306CDC789202EC8714F0852DF20DA6CD6E8958C19DC7737565CF41207D16525B453DA5FEE43B8C25177532ED344D673F546810BEBA9CB319E695E5C46BFBCB32557C52AED7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6B296319D92691CD934E3074B15776DD863555F2402DDB2577EC8B6A77BFAA36E3A18F9F5EC1C5F01723931630B6C1FF8AD2DAF70CA352A8C6B7EBDBB3A0EC2D7374311E103053B1EBD7EAE7E9E0D0622FFD83C5D4409EE6C8CF871255958E387E&type=dashboard"
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