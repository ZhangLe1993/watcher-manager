Template.stockGoodsMonitoring.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#OverseasBusinessUnitTab').addClass('active');
    $('#overseasOPC').addClass('active');
    $('#stockGoodsMonitoring').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D52340152F3FE2DFC77CE96E7886912D76304B2A0EE7FD6675AE69B6D20E5D8D4B3C1BD2B58D49C545F1C0847817C7A6A6C8641B2A61355A235625968FC7D51AA20A6E919D8E519E74AE524773FF0EC33959BA743419A59BADDBEF1AF47E27705A851E09793C66B09104ADAF8B181A92D2B60B95CE2E407A36B588D30B9AE78478F8BA943BD2118C005E8D44A23D1A9198D4358A8A94787AD088C22AA6AD890A0C6B26D7BB0A451EB0EDD0BB05CAE3C9FE66F309D9C2EBAB36E08AFA1DF0AA560BF9EFE4F0A1DEFB9A74B6442395FFF13D0BD61&type=dashboard"
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