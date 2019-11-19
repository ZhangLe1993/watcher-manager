Template.shsxcyfx.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operationPlatformTab').addClass('active');
    $("#frontAuditTab").addClass('active');
    $('#shsxcyfx').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D5234012F385796955D401B2339B6053FC7A002A08C0768A17BB241CD3952651D7B65470D7BAD6F5AA490947F4F1BAADCF26EF5B2A61355A235625968FC7D51AA20A6E91AA55A26D438E376431237E47A629A1643419A59BADDBEF1AF47E27705A851E04C35EE9FAE380059730C24DBBCFA12582FD63EB6E61174623A30AF5717D84C60DA5CAF11E3A2CC2DB9297F49E1ADCF514E270C37D73E2A3B62E3C2A67A653A547494EB44D24DB57154C83876A7DA36D686600E7FA267F306A8575C53A6C6311879AB8196831252952CDFFA4547D3ED86&type=dashboard"
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