Template.competitionDeferredProfit.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#CompetitonPriceTab').addClass('active');
    $('#competitionDeferredProfit').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401127313E66EDE2FA77893C627EB6E227B205FCE03CE9C922BABB503E027630A64DAF0D5B1D7D4CEC8541D9BE6E5223845B2A61355A235625968FC7D51AA20A6E9DA63F5849D900B17796AD4413F5A505343419A59BADDBEF1AF47E27705A851E08ACD6516E64797C6DB0F389BFB2F8586530FC6617DB8A4A023762835581D203C7F9DCA84CA7BB1F9D809AFF808ED46C20B24D3710C0B09EC4AD3D81E7076D064AE4BCB7A90375375C4501846CEB65BD280ED71BDAC17C2F5469BB92553CD9D8F85A491FA56FBBCC4184367A0130AB5CB&type=dashboard"
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