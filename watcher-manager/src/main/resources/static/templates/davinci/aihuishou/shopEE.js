Template.shopEE.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#aihuishouTab').addClass('active');
    $('#actionOperationTab').addClass('active');
    $('#shopEE').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401493118075248EF14A9A3632829B53C88A6B129C596A642A1DB4E1ACC8D4A0C416CAEF206C4A297541BB02514FBD0A325E43B8C25177532ED344D673F546810BE564C5DFDB99E19DC0808CE40D73A6FEBD7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6BCBF6FBD23016221BB00D9FD76DF14E5BA95572EAD5E782B90BE998A38A594C015347649B81F2D67AB9FAE3418F01BE26BCFD76284F1350453E9CE68DA9299E1E5AB8813F200D75F2512639410CFAADCB78A8E0C35C29EDB2B541752B7750263A&type=dashboard"
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