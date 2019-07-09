Template.warehouseCoreData.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operationPlatformTab').addClass('active');
    $('#houseTab').addClass('active');
    $('#houseOverviewTab').addClass('active');
    $('#warehouseCoreData').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D5234019A4CDEB7358344293C4F608B210B137F54BAE12099828F7822C0A82670172725BB96EA047A69D05E6A9014B461C07116B2A61355A235625968FC7D51AA20A6E924747572D54F5DB9B7AC5C2574964D7043419A59BADDBEF1AF47E27705A851E0082330FCB5F8DCAF31ED3F082AB43E316B157BABF6CCB3E4D8DF71B519A6182ED4C898E366D5E12B05C2B47B1E87471A504D4C51C7C6B7E204706117F2704127075E95CB9163EBEF06959FBD8C277B399EDBAEA9E984D55819F111167B23EC92707B007B3F22C6D301B7185C20AE4FF7&type=dashboard"
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