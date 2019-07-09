Template.fbzj.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operationPlatformTab').addClass('active');
    $('#qualityCheckTab').addClass('active');
    $('#fbzj').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "http://47.97.240.5:8092/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D523401AF9776F96C4C69D791FFC75B942BC869A8A0A53AE0D21F6EACD76DE335EB9AA54AFD14DE444861E9B140DF826178A24CB2A61355A235625968FC7D51AA20A6E9CA16DCDF8B60A63332ED88E577F79D1543419A59BADDBEF1AF47E27705A851E0C3F7958535B62069BD9BA5D67F0A9E6C0FCF17ECD990B4A955B1BB085077B2053EDAF44007E846AEE0B9FBCC5D3C6F66C8CB0BD0AB0C8D48A8F68C51F8F28BD83EECC4C5481661F8C26C5EBDE00F1D98BDDC6B8B3A4D2C7F30EC84FDF4E48B7ABDD4F4B3ABE6E3364A75A25256B0AD5E&type=dashboard"
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