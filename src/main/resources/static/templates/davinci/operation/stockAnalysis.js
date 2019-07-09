Template.stockAnalysis.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operationPlatformTab').addClass('active');
    $('#houseTab').addClass('active');
    $('#stockTab').addClass('active');
    $('#stockAnalysis').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401E83F4A39E41B2053451A5DBD4AE6C74AEFD5721736A0DD658FF80E30800B260A4AFD14DE444861E9B140DF826178A24CB2A61355A235625968FC7D51AA20A6E948A59972FA89D7D881B378BB9173E9DD43419A59BADDBEF1AF47E27705A851E0CEAF5DEFB0B32B028E2E4A86BA00F41C4DCAAA1D18052C233EC9497FBE60D347F6DDB39575CC51A30F4B8EAC4EBA39F0B1841C649AA5DBA8F11ED5EF1EEC6E4C9199D791733E79E899758F2A090805DE6F5B971526C2E4FA029B246AE71BDC122C686BDEFEFD95C2B07B76DCF0A7CCF1&type=dashboard"
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