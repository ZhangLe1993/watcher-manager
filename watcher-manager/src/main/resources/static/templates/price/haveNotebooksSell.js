Template.haveNotebooksSell.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#priceTab').addClass('active');
    $('#pythonTab').addClass('active');
    $('#haveNotebooksSell').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }


    var url= "https://abdavinci.aihuishou.com/share.html#/share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401F5F797ABA8F73852B8965538A886E8EB33B6207363D961D8C286962DBD299E5EDE588662A4B75FEBC7E4882483A89FC8B2A61355A235625968FC7D51AA20A6E91ECE436380A9C5791BC5C5A648ACED1E43419A59BADDBEF1AF47E27705A851E0F1188036FA7DFF89DFCCF962785A3F785E85DE48642B86461FACEA81D90995B31E3A2368EF1282E07BA18AF9044C78CCA43A80861B0B1D4E24C0AD11EEAF9DD52CF45B2F109081A7008D4206104FEF5A93AFB06F9BF68B2D5EBAABF7C188F13789D3C1ACEBC1A9C14D8193FEA2AD9149&type=dashboard"
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