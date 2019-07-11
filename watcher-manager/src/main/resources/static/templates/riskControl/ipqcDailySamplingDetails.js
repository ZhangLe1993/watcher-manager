Template.ipqcDailySamplingDetails.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#RiskTab').addClass('active');
    $('#ipqcDailySamplingDetails').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401227D77560ACDFB82A51153D378705687A45D1EC0664E93D76B2C0B4E4351A406BB96EA047A69D05E6A9014B461C07116B2A61355A235625968FC7D51AA20A6E9EEDA67BE8F06044757F1A07B9775F3E543419A59BADDBEF1AF47E27705A851E0B5E88970C4B8037D8FD2A18E8E7DF576685A2422B908A6A3E2FC7FAAD9C39E96CAC1264462156CDCB36E10AF830A722C3F886757AC7D62532EA205FB937B5782760C033BAF03D501C4C0DD1C19E995477B96C43E9688B61C3011AA4AB20D27BDB4A6676A3D94632742FEF5A29CD19947&type=dashboard"
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