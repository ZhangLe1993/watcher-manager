Template.loveRecyclingWalletWithdrawal.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#FinanceTab').addClass('active');
    $("#financeAihuishouTab").addClass('active');
    $('#loveRecyclingWalletWithdrawal').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D5234017203C2BC959C379ED370A2D37FF04B3771758E7C4DC34C6B758A75BABD49BC3FFB0FEED14759D1D15E898052EF701396E43B8C25177532ED344D673F546810BEB33D136EE9482B27D3B28307978FE7D8D7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6B0D9550617017971BB9F2FA3ADEEB0B6A0B2C587E3E1EEF6F6131BE6BA1923F7BB0FD256FA73F67EAE78A63234A9844439E881F4C264D73DF7E1A97D35E5697DC1A7ECF7B9E15FB1A3FAA04618C6DF8D9D0F8444D535E4610F78DFB8937C0F180&type=dashboard"
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