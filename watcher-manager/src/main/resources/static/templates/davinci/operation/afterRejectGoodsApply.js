Template.afterRejectGoodsApply.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operationPlatformTab').addClass('active');
    $("#rejectGoodsTab").addClass('active');
    $("#recyclerRejectGoodsTab").addClass('active');
    $('#afterRejectGoodsApply').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401DC96FA05EBCE28CDB4AC2674D0C6404ACE886B785381653DC1976D64BD31774B4AFD14DE444861E9B140DF826178A24CB2A61355A235625968FC7D51AA20A6E915D040D560B33ACB05D995B80264AD2843419A59BADDBEF1AF47E27705A851E0727D8BD0328FD940DD6EB2BEB77F13BE45D392426464C8A6EBD3B4E24D71DE11E96C93D1418F6AB2AF4862D6BA85E8439E7356AF1C92797145C2735937A37B75D7B7FC53EDA88FF24C0CA54BF0CDCA7CD2929259F8D5E664AAF02F1FA6E8F32BE785931666405F9780844DDFF76498ED&type=dashboard"
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