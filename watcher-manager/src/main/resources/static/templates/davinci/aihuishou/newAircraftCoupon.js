Template.newAircraftCoupon.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#aihuishouTab').addClass('active');
    $('#actionOperationTab').addClass('active');
    $('#newAircraftCoupon').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401A14E3C6281DEF30390B0047D26C5D78C89EC0375B0A866FFCC3E5BD097DA0118DAF0D5B1D7D4CEC8541D9BE6E5223845B2A61355A235625968FC7D51AA20A6E92B177843F61BB5E7B10334443C5D19A343419A59BADDBEF1AF47E27705A851E0649DC95944907E40826FD60B28D64DBBCBA59CD371E6E7FEE6818265606D23E56BD0E61DC6BF3D47546DBDA2F346C92BE5FB00735F4F6520404F334EE5581D11C86D441B14C534D72637A1DBD275EC4320DFBBC1CF56475FB0D0C53D9AF4BB16925CD64E7878248A13FFFACC8833526B&type=dashboard"
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