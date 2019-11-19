Template.shopBasicInformation.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#aihuishouTab').addClass('active');
    $('#performanceStatisticsTab').addClass('active');
    $('#shopBasicInformation').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D52340181ED1396185A25721BEA24B2779E8FE443B7A7E695B0A3DA88E9DFB4A803C038E1839047ACF8250A76E8B94784E3F021E43B8C25177532ED344D673F546810BEEECB5C65C7CAE6E7CD23FAB6EC7571F5D7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6B441EA8440B2C2610991C810D8F0629E8E367B7A096E5339C178A50C1E59ED0E699152C1773AA4D7B4A8ABA998B185B022940C87F68B1E51252646D23991FF82E3301BFAD0A219CA9B8E1688783ACD8114629DBCE2A50BD39AAC7E464847A6AB7&type=dashboard"
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