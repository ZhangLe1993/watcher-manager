Template.analysisReturnAuditTurnover.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operationPlatformTab').addClass('active');
    $("#rejectGoodsTab").addClass('active');
    $("#recyclerRejectGoodsTab").addClass('active');
    $('#analysisReturnAuditTurnover').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D5234018B69628D79236A6A4E8128108351AC695D47F7074CBD053C4413C9815DA404B6611ED935FDBE1122952CC5E71DC82E26B2A61355A235625968FC7D51AA20A6E9ACBD0A0D824D5D2D87EFE556A83A6F1A43419A59BADDBEF1AF47E27705A851E0B5E88970C4B8037D8FD2A18E8E7DF57648551020CA6BB789EF8AA3DC89A2AA1228A8556DEDAF4EEAC1C95E009383CDA8D7A2306869CC028912A914E056E586010BA6EA10108EF83C88E0619774D9AE7375240830D4EEE845327081228085022B044499DEEBD74FDECE69011D5F6F0DD5&type=dashboard"
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