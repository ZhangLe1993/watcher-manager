Template.warehouseAchievementsData.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#operationPlatformTab').addClass('active');
    $('#houseTab').addClass('active');
    $('#houseOverviewTab').addClass('active');
    $('#warehouseAchievementsData').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") > -1;
    var isiOS = ua.indexOf("iphone") > -1;
    if (isAndroid || isiOS) {
        $('.sidebar-toggle').click();
    }

    var url= "https://abdavinci.aihuishou.com/share.html#share/dashboard?shareInfo=DA1C3E7DAF7EC46FDC39861F361C78B7517FC6CEF4F1ED425FFF75A2CB7527D3ABD4F0725AF12462EE9485E57D5234012FA4D1F4B4025AB0E02217ED4AA0938ECFDA8F9854EFF90ADD3C42679B88DC16611ED935FDBE1122952CC5E71DC82E26B2A61355A235625968FC7D51AA20A6E914D7DD31A3D60779A44B4B0FF7ACF8B843419A59BADDBEF1AF47E27705A851E0082330FCB5F8DCAF31ED3F082AB43E31D9167C47FED1A11E50AC94A98AC9C71F01CAAC8EC6CD903CF1F867C8C56708381451F850382D73DE3AFDF73BA708A8FABCF23750DEE833E300465AA5E79A6B6D60F13238C393C2EC54789D5C42FDCD6490179121DB79E34FD66710120D37DFE8&type=dashboard"
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