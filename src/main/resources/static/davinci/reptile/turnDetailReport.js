Template.turnDetailReport.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#priceTab').addClass('active');
    $("#pythonTab").addClass('active');
    $('#turnDetailReport').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D52340147DECA1A80AC901CCDE5E9711C8D973115E577C6230845395871211D933B4496AFEEBC752CBEF88BDEF0145EFD5DEA6DE43B8C25177532ED344D673F546810BE7D4FA1F1DD3BC756CDF5FAD8F8A38A2BD7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6B947EF02594A379C8835FC26ECFDEBBA09ED9A60EB72B210972472FC9B0EE4428F70F2C7C88B0B3827CA430D35B8C701500DB5236BB1F7AA771221B08C692C57F13962220CBAB2475F1F79A422E8B9963117E9A9B5A195CDAB35E96557BDA4806&type=dashboard"
        + "&_t=" + (new Date()).getTime();

    $("#frame_davinci").attr("src",url);

    $("#frame_davinci").load(function() {
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
    if (event.origin !== davinci) {
        return;
    }
    console.log("子页面有消息回来了");
    console.log(event);
    $("#frame_davinci").attr("height",accAdd(accMul(event.data,1),300) + 'px');
    window.removeEventListener("message", receiveMessage, false);
}