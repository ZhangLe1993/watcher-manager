Template.outInventoryAnalysis.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operationPlatformTab').addClass('active');
    $('#houseTab').addClass('active');
    $('#outHouseTab').addClass('active');
    $('#outInventoryAnalysis').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401F8E4EBD81667D1C4508E153DFBD090CB6041853853F889BBCDB530F09520A31BDA4096A8E8077930A64DC2338AE692C3B2A61355A235625968FC7D51AA20A6E9B7CA0EB6C9D26D2030D6D2A54713255843419A59BADDBEF1AF47E27705A851E0267C9AE5D521EE114AA85102C29FC4B6AB53CC2AE5A937633CA4AE5A7FDAE83828E45D687A19565A1F162045B90D3D95020E8257A9D287B8CC1A3CD94D6B9BC7CA353940C41BF5698D3017E88803504CB016BFB1ED01E0F0BC5291D8BE93047887283DCD0FF7052595D5ABCF526F3B7F&type=dashboard"
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