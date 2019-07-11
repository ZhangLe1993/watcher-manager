Template.AnalysisRedPack.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#AuctionTab').addClass('active');
    $('#AnalysisRedPack').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401C04825CB57C0D7233876B2FF9FE08D1B3DA9E9AB0008BDB4E787D052773AD2BA12C890B31D9A9257D3AF736FD0DB6411B2A61355A235625968FC7D51AA20A6E98024A58690D1F0C7B333785AFCF2129243419A59BADDBEF1AF47E27705A851E0D1BAB8CA4CD0AE25E7A5DA0BB713CDCAD0D4C565D0454E9DAAB80AD8817EA4DD94954FDEB728712EFAE40625CD6C5B29D48BE2E5D946BFEC8C06A87D329CE76163CAF597AACB2E83A88249CD705638DA9937F019EDFD4CBE4FFCA7444AF5A02318CB350B5443D0F8221C590C0427838D&type=dashboard"
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