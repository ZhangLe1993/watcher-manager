Template.revenueExpendAccount.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#aijihuiTab').addClass('active');
    $('#financesTab').addClass('active');
    $('#revenueExpendAccount').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401E7582A7A8D995AA20CBF24D5FB661BA3C63C92861D5FC7D561B330EDBC93CA4FA08C8AAFE3BE7FA998C249B1986E15F7E43B8C25177532ED344D673F546810BE06E3AA701859A3DBC739AFE258672780D7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6B02CCC0978EEF14057679A9F588A01A725C437DED36CCFE0B861587183CED7E5A308351A7C644C2CD6704F93803AF70C2968E93DC330572C100C75FAF7D35DB4A912C7A40FA3759A23CCBC992CAD779F6B93580BF02A5D60ABB29BDE61686950F&type=dashboard"
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