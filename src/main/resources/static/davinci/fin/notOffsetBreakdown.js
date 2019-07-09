Template.notOffsetBreakdown.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#FinanceTab').addClass('active');
    $("#auctionHallTab").addClass('active');
    $("#toStoreServiceTab").addClass('active');
    $('#notOffsetBreakdown').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D52340194A5198846268991431E6311F89143E24AA9FAD59A7DD56DE5633E7D8775848665391944018D27ED309A005B54B0DB93E43B8C25177532ED344D673F546810BE5FBD538002E1C4ED5F2D1C7FFC42256ED7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6B9C9A8C9CCDBBCDB687EAF8B1607AF9A82D47314991E830DD28A11B89DF54143BC6FCCA1A4750F0CA880ADA33EC6EBCC6D592DFE30915E29A3BCCB0AE5706963C9B8772EF6D96290579971F75220F77E9B807E92BBB53DB5E0404ED3CAD9D561F&type=dashboard"
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