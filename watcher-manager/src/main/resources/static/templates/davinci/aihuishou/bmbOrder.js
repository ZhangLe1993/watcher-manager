Template.bmbOrder.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#aihuishouTab').addClass('active');
    $('#specialTab').addClass('active');
    $('#bmbOrder').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401D4E1EA015F487273631D5965B6B518F7926121797BA8383CEE0C1818D73D65678CD6C5ADF4D589E2274987588553E3AAB2A61355A235625968FC7D51AA20A6E9BBF76441A1CB2EE36B5B3725420DA6C743419A59BADDBEF1AF47E27705A851E04C35EE9FAE380059730C24DBBCFA1258E0AAC681FB22B29FFA771BC64E54F4A91E277427EAB94B218DDA6D7B17FFB36728E15344AB93234EFE0332A74AD107906DA745A01A859283AD1F78A98DC2FBCB1FCB284480C2146D48C672E68CF47D9ED9EC4FBC28263F46D9297928A7886F65&type=dashboard"
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