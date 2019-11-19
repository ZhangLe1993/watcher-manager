Template.recoveryProfitStatement.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operationPlatformTab').addClass('active');
    $('#supplyChainTab').addClass('active');
    $('#recoveryProfitStatement').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D52340115BE941B508EF59C51B74A53502F6197F8F071C570C1EBED71D94D2174472E6ED4878908FA25F60118CEBD9B07D2C2CAE43B8C25177532ED344D673F546810BE92B8CF86A0F8829D91237297ED46027FD7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6B23AE08AFB280F0917C90191661ACC5D9FD0155B02C67BC867314642F8E889F7EA6B696AC89A52D14878921CAC6DD09BE245561468F5CFF7CF0FD3E65E08A3C7FFF0E7122069E50D20D3B1BE83287B92D35DA15DB924FB35F3F6FC97A00A1C6AF&type=dashboard"
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