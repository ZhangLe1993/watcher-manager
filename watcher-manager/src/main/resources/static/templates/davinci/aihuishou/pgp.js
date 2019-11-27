Template.pgp.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#aihuishouTab').addClass('active');
    $('#deliverAnalysisTab').addClass('active');
    $('#qaTab').addClass('active');
    $('#pgp').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D5234016165CC1DB03E545D1323546CDB0A24C4C0BF6865C20C039EBA32A296711AE6E1682A65E06370632B470ED6C2AD26587AE43B8C25177532ED344D673F546810BE2949515E81704106CD7038F8EB755811D7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6BA1C6475182EF8C388DDE499FFCB97DC3CDDE8945EBBE968BB9899A2767325163B5821137A8890AADA1C43E0DEC234A24110826DF1F8C6DE9BFA963F056F8C0E1B80C65B6F099147FF674B377856301D8A638C8FE36EBBC271BC28966269F363D&type=dashboard"
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