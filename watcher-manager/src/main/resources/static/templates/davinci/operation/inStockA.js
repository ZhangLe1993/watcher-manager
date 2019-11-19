Template.inStockA.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operationPlatformTab').addClass('active');
    $('#houseTab').addClass('active');
    $('#inHouseTab').addClass('active');
    $('#inStockA').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401F2E03BEE9C55246A95520A7F7953BEF0D96B01B2BB1307DDC796B5EDD2DCCD84B739C3E041F6C5492CC7B3BAEA158494B2A61355A235625968FC7D51AA20A6E98B141409DD2FB490938BCF6FA6E6568543419A59BADDBEF1AF47E27705A851E01E3C061010AD33D91986A94B6ECCACE61B9335E9082B0771F88078341F567084B40C9F2EF88A8D17B7E7F7E6B8DC64C7C3EDA810C4C9FC58530C63B4A1379BB71717A430B506084DCD99D4C3985743D4131A0DE5DA2D7571B1C5F08E7F6308008411962EBBA52AEB743BB2E421FE0A89&type=dashboard"
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