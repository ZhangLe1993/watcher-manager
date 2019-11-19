Template.dbsx.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#aihuishouTab').addClass('active');
    $('#stockAnalysisTab').addClass('active');
    $('#dbsx').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401168E3BA82EB0D3B4E0C4FB4E6BACEFDDCA8CC9937BA3C95B43F1AF499AD5C0414AFD14DE444861E9B140DF826178A24CB2A61355A235625968FC7D51AA20A6E9E693B215D8457E45DF39523A2DDB9A6843419A59BADDBEF1AF47E27705A851E0D0D5C6F967E6B24B84BCFC063DD89AE2DACCF41D522C21C9B275EBC3D82B3AE020DB45507E83648CBC408BC1885D45DBB674862E15AFF8C3760C0A9301193570078D6B192E65B5D86153CCC06449400FB5A267CF8401FDC7E80A44649E367885E6581C4FB71A3AA34AD759BD67D21CBC&type=dashboard"
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

function receiveMessage(event) {
    console.log(event.origin);
    if (event.origin !== davinci){
        return;
    }
    console.log("子页面有消息回来了");
    console.log(event);
    $("#frame_davinci").attr("height",accAdd(accMul(event.data,1),300) + 'px');
    window.removeEventListener("message", receiveMessage, false);
}