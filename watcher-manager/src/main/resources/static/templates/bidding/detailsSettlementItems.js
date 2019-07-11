Template.detailsSettlementItems.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#empowermentTab').addClass('active');
    $('#buyerAnalysis').addClass('active');
    $('#detailsSettlementItems').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url = "http://47.97.240.5:8092/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D52340102A844C6C1BC129225E68763ADEF4B2600B32C8A2BB5D823D71D4F6965AA49A0BB96EA047A69D05E6A9014B461C07116B2A61355A235625968FC7D51AA20A6E9B4874B548046C3DC02887D1CB4994DFA43419A59BADDBEF1AF47E27705A851E0F1188036FA7DFF89DFCCF962785A3F7861DF58A25CA3F49E8CA12B6A11A44AA95567DCDAE31FC90FE719FC0793A973335DC3EBB6FAA80B64071AD17847B3879BC0962639D7272B76AE2D832C9FA483D6A8D4EA09D48B53410812143903DA17294BFC9F8FB6693542D66E28CAC88AAC7B&type=dashboard"
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