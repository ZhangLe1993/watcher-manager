Template.outStockBreakdown.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#FinanceTab').addClass('active');
    $("#auctionHallTab").addClass('active');
    $("#toStoreServiceTab").addClass('active');
    $('#outStockBreakdown').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D5234012164F91477FD462AA57DCCB387B1088069AAC1AC3F6AC32605A4F3BAC25D4FCF7B9C9C1A15A48969FBAE99DFF4B40BCFE43B8C25177532ED344D673F546810BEF6E71B2EDC54AD17532411981B3AE40BD7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6B79A109E5026D5163ABC7621FF3AEECA6DBD8DDD3BB5AA40AD87F9BAD45CF30E0DD8DA3F74B9E1A6403A4B8B1DC56212EDF194F69172219FE0D1FE8FFCF5769020D347A8DD471FEB6C36E3E8A6C3B4ED87FAA3791F999CA593E4C26ED084F07EB&type=dashboard"
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
    if (event.origin !== davinci){
        return;
    }
    console.log("子页面有消息回来了");
    console.log(event);
    $("#frame_davinci").attr("height",accAdd(accMul(event.data,1),300) + 'px');
    window.removeEventListener("message", receiveMessage, false);
}