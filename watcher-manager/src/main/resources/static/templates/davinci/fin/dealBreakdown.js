Template.dealBreakdown.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#FinanceTab').addClass('active');
    $("#auctionHallTab").addClass('active');
    $("#toStoreServiceTab").addClass('active');
    $('#dealBreakdown').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D5234010443B8697DC00126B18B85049B5B34E8E5473C830385F9466870F071D4AC791A9C018EA217B11131F4DF1561F055F742E43B8C25177532ED344D673F546810BEDE1DE53CDF80C3B04DD38D6694790F72D7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6B93A9EE5D0E991D9B3BE669795100661770086440641711001218226CA6664370E921A2F0D4B54B9BD5F420D1EDDC05DE8ECDDB7A10E274747615DCD27B93984B122EC9E3DEFD04023EFBE291C79D411D7CCEF17DB85D386EDB99810D036D9A10&type=dashboard"
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