Template.ipqcDepAnalysisDetection.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operationPlatformTab').addClass('active');
    $("#randomCheckTab").addClass('active');
    $('#ipqcDepAnalysisDetection').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401D195CAAAC54D50B932522226C37F6DF5B596E12FB0C0C72018C947D4F3BBD0FA6217A386851B741EAC68DBA02B3DEE7FB2A61355A235625968FC7D51AA20A6E98942CB15D3BEE2273009F0E2539A877F43419A59BADDBEF1AF47E27705A851E025209315D887CE4D3F3BC9DF7EFAF7F1AFC6B163EDA222661266B76BD045FB4A7A379FD4D6CE16CA93CA026EF385707405581CE2FD0100D9C2C312FC1448242E5F4E7663349E1419550C3D556EA8E16B1A9BC6A2DDF0066012A28B937CAB3B2CF72101803D7429BEE070D2B378C1EDE6&type=dashboard"
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