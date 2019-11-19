Template.walletRechargeWithdrawal.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#FinanceTab').addClass('active');
    $("#financeAihuishouTab").addClass('active');
    $('#walletRechargeWithdrawal').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D5234010BD0855EDC3FBF12BBD1683B01006BC1499FC16A640DB286009E20FFC6301344FB0FEED14759D1D15E898052EF701396E43B8C25177532ED344D673F546810BE49974FF5043F00AC619167B85410D0FED7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6B20D62489E66CCF18EB0F02651E6DC819E5AF295B8EF39592BB5483BA0ACC7B8D329CB291D9680F1A9B2812172AF6D6FCBD13ED0AEAFF25156C433CFBBFD1ACA1A04F6DD7DB188A86AB84F620B534825C43B0B25F7972A3B0C36E918F6B286836&type=dashboard"
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