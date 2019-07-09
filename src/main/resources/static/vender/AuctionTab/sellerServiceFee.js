Template.sellerServiceFee.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#VenderTab').addClass('active');
    $('#AuctionTab').addClass('active');
    $('#sellerServiceFee').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401A58ACD1397198BF488817F4F023B114B9D5CC1CCBEDBF14EA544940964DB4FAC2B58D49C545F1C0847817C7A6A6C8641B2A61355A235625968FC7D51AA20A6E9633EF7558229514B92F7DB58F657AD3843419A59BADDBEF1AF47E27705A851E0A55574D0E07A14BAF96770D15C4778F439F6D373DDA3BD88FE35F0CB1C787522F52BFFAF6825A9B594943B43925661CA6935DAADC535AD1FE9F1471C7944DB0923EC9793A9BD035E6E8E40061CA4F37E15072B7E33951412588F75EB56E6CC81F705F03D0DF8D42022C60432C228EED0&type=dashboard"
        + "&_t=" + (new Date()).getTime();

    $("#frame_davinci").attr("src",url);

    $("#frame_davinci").load(function() {
        setTimeout(function() {
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