Template.publicSecurityUserBehavior.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#TPDataserviceTab').addClass('active');
    $('#publicSecurityUserBehavior').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D5234016DA736BC37FFA752A122DC0F7581A6C708BC7A1695FA8138FA184BE40DDBF98C9DC7737565CF41207D16525B453DA5FEE43B8C25177532ED344D673F546810BE3A67B31EB771A830F0B553FBB999F902D7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6BDC0E70860014D1BB06DB6DB2F3A1B80EA11C3D941159FB4CE60127FFED345632A160FF931ABE46AFB2F5AE19257C1B6174CA134236A218D85616E2DC8D6A1C45FCD36FD6211DC11B9BC61C4261297B2A17B0D08462F2282FA011A7964EEDDE43&type=dashboard"
        + "&_t=" + (new Date()).getTime();

    $("#frame_davinci").attr("src", url);

    $("#frame_davinci").load(function() {
        setTimeout(function() {
            var frame = document.getElementById("frame_davinci").contentWindow;
            var message = {parentOrigin:window.origin,msg:"收到请回复"};
            frame.postMessage(JSON.stringify(message), davinci);
            console.log('发送成功');
        }, 2000);
        window.addEventListener("message", receiveMessage, false);
    });
};

function receiveMessage(event)
{
    console.log(event.origin);
    if (event.origin !== davinci) {
        return;
    }
    console.log("子页面有消息回来了");
    console.log(event);
    $("#frame_davinci").attr("height",accAdd(accMul(event.data,1),300) + 'px');
    window.removeEventListener("message", receiveMessage, false);
}