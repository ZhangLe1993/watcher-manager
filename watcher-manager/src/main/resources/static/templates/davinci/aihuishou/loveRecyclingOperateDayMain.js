Template.loveRecyclingOperateDayMain.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#aihuishouTab').addClass('active');
    $('#ahsOverviewTab').addClass('active');
    $('#loveRecyclingOperateDayMain').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D5234014978A91F96A9E976D82AF90D2496FD3D82B860E6B09DA764B915A61DE901142B88E8013E1A6D31324CD4063945D3C931E43B8C25177532ED344D673F546810BEBFD07F0C1D2D801F18057DFF35E17BADD7C1207CAA9123AB1610D5C013677811F037466E5354DBE2F9772C061D5AAC6B0FBAFDC66381A075FBE0BE4527A40F4B1177125AC1C6FB52FE2D9EE59DC1307F002F9C523D771C92176EF46E00F119146F3F3E3F5F990EF19B6AD8DC986F10414354D446C14C6952098271F14BE0A0F70D93B67AF0FF6704EC624D2CA3D84509&type=dashboard"
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