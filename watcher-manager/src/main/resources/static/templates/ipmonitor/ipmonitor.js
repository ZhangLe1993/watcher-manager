Template.ipmonitor.helpers({
    userIpStats: function() {   
        return obIPRecord.find().fetch()
    },
    selector: function () {
        return {isWhite:false}; // this could be pulled from a Session var or something that is reactive
  }
});

Template.ipmonitor.rendered = function() {
   $('#whitelist').removeClass('active')
   $('#dashboard').removeClass('active')
   $('#pricemonitor').removeClass('active')
   $('#ipmonitor').addClass('active')
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }
};