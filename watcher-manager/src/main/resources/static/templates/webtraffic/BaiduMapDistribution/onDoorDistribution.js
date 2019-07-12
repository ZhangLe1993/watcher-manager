/**
 * Created by hsh on 2016/5/13.
 */
Template.onDoorDistribution.rendered = function () {

    city_name=Template.currentData().city_name;
    num=Template.currentData().num;
    startDate=Template.currentData().startDate;
    endDate=Template.currentData().endDate;
    lng=Template.currentData().lng;
    lat=Template.currentData().lat;

    $('.tradeNum').html("订单总数:"+num);

    /*日期设初值*/
    var nowdate=new Date().format("yyyy-MM-ddd");
    var lastnow=new Date(nowdate).getNewDate(-2);
    var todaynow=new Date(nowdate).getNewDate(-1);
    $('.onDoorDistributiondateSelectLabelend').html(startDate);
    $('.onDoorDistributiondateSelectLabelstart').html(endDate);
     /*开始日期*/
     var transformDatestart = function () {
            var lastday="2016-01-01";
           var dateStrArray = lastday.split('-');
           return dateStrArray[1] + '/' + dateStrArray[2] + '/' + dateStrArray[0]
     };
     /*截止时间*/
    var transformDateend = function () {
          var dateStrArray = new Date(nowdate).getNewDate(-1).split('-');
          return dateStrArray[1] + '/' + dateStrArray[2] + '/' + dateStrArray[0]
    };


         /*开始日期*/
        var transformDate = function () {
              var dateStrArray = new Date().format("yyyy-MM-ddd").split('-');
              return dateStrArray[1] + '/' + dateStrArray[2] + '/' + dateStrArray[0]
        };

        $('.onDoorDistributiondateSelectLabelstart').daterangepicker({
            "showDropdowns": true,
            "alwaysShowCalendars": true,
            "singleDatePicker": true,
            "autoApply": true,
            "minDate":transformDatestart(),
            "maxDate": transformDateend(),
            "locale": {
                "format": "MM/DD/YYYY",
                "separator": " - ",
                "applyLabel": "确认",
                "cancelLabel": "取消",
                "fromLabel": "从",
                "toLabel": "至",
                "customRangeLabel": "自定义",
                "daysOfWeek": [
                    "日",
                    "一",
                    "二",
                    "三",
                    "四",
                    "五",
                    "六"
                ],
                "monthNames": [
                    "一月",
                    "二月",
                    "三月",
                    "四月",
                    "五月",
                    "六月",
                    "七月",
                    "八月",
                    "九月",
                    "十月",
                    "十一月",
                    "十二月"
                ],
                "firstDay": 1
            }
        }, pickstartDateRangeCallback);

        $('.onDoorDistributiondateSelectLabelend').daterangepicker({
            "showDropdowns": true,
            "alwaysShowCalendars": true,
            "singleDatePicker": true,
            "autoApply": true,
            "minDate":transformDatestart(),
            "maxDate": transformDateend(),
            "locale": {
                "format": "MM/DD/YYYY",
                "separator": " - ",
                "applyLabel": "确认",
                "cancelLabel": "取消",
                "fromLabel": "从",
                "toLabel": "至",
                "customRangeLabel": "自定义",
                "daysOfWeek": [
                    "日",
                    "一",
                    "二",
                    "三",
                    "四",
                    "五",
                    "六"
                ],
                "monthNames": [
                    "一月",
                    "二月",
                    "三月",
                    "四月",
                    "五月",
                    "六月",
                    "七月",
                    "八月",
                    "九月",
                    "十月",
                    "十一月",
                    "十二月"
                ],
                "firstDay": 1
            }
        }, pickendDateRangeCallback);

    echarts.registerMap('china', chinaMap);
    drawBaiduMapCity();
};

// dataService = Meteor.settings.public.dataService.baseUrl;

var city_name,num,startDate,endDate,lng,lat;

function pickstartDateRangeCallback(start, end, label) {
//    console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    $('.onDoorDistributiondateSelectLabelstart').html(start.format('YYYY-MM-DD'));
    drawBaiduMapCity();
}

function pickendDateRangeCallback(start, end, label) {
//    console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    $('.onDoorDistributiondateSelectLabelend').html(start.format('YYYY-MM-DD'));
    drawBaiduMapCity();
}

function getCityShopDistribution(city_name){
    var dfd = $.Deferred()
    var query ={
        "city_name":city_name
    };
    requestURL(dataService+"/ondoorDaily/ShopCityDist",query).done(function (ret) {
        dfd.resolve(ret);
    });
    return dfd.promise()
}

function drawBaiduMapCity(){
     var startDate=$('.onDoorDistributiondateSelectLabelstart').html();
     var endDate=$('.onDoorDistributiondateSelectLabelend').html();

     var nowdate=new Date().format("yyyy-MM-ddd");
     var todaynow=new Date(nowdate).getNewDate(-1);

     var sd=new Date(startDate.replace(/-/g,"/"));
     var ed=new Date(endDate.replace(/-/g,"/"));
     var interdate=parseInt((ed-sd) / (1000 * 60 * 60 * 24));
     if(interdate>10){
         alert("时间间隔超过十天，请重新选择！");
         var startDate=$('.onDoorDistributiondateSelectLabelstart').html(todaynow);
         var endDate=$('.onDoorDistributiondateSelectLabelend').html(todaynow);
     }else{

     var map = new BMap.Map("allmap");

     map.centerAndZoom(new BMap.Point(lng,lat), 13);


     map.enableScrollWheelZoom();

     var pt=null;
     var markers = [];
     query_city={
        "cityName":city_name,
        "startDate":startDate,
        "endDate":endDate
     };
     var result=[];
     var max=0;
     var nullPosition=0;
     var aal=0;
     var total=0;
     var len=0;
     var lon_lat=0;
     if(city_name=="重庆"){lon_lat=5;}else lon_lat=3;
         requestURL(dataService+"/ondoorDaily/heatMapDetail",query_city).done(function(data){
       var dataObj = data;
       dataObj.forEach(function(e){
          len+=e.tradeCount;
       });
       dataObj.forEach(function(e){
          for(var i=0;i<e.tradeCount;i++){
            if(e.cityLatitude>0&&e.cityLongitude>0&&e.cityLongitude!=null&&e.cityLatitude!=null){
                if(Math.abs(e.cityLongitude-lng)<lon_lat&&Math.abs(e.cityLatitude-lat)<lon_lat){
                     pt=new BMap.Point(e.cityLongitude,e.cityLatitude);
                     markers.push(new BMap.Marker(pt));
                     total++;
                     if(total == len){
                          var markerClusterer = new BMapLib.MarkerClusterer(map, {markers:markers});
                          $('.tradeNum').html("订单总数:"+total);
                          $('.nullNum').html("位置不明订单总数:"+nullPosition);
                         var promise = getCityShopDistribution(city_name);
                         promise.done(function (ret) {
                             ret.forEach(function (e) {
                                 var spt = new BMap.Point(e.shop_logitude,e.shop_latitude);
                                 var icon =new BMap.Icon("https://cdn3.iconfinder.com/data/icons/streamline-icon-set-free-pack/48/Streamline-18-32.png",new BMap.Size(32,32));
                                 var Marker2 = new BMap.Marker(spt,{icon:icon});
                                 map.addOverlay(Marker2);
                                 var options = {
                                     width:200,
                                     height:100,
                                     title:e.shop_name
                                 };
                                 var infoWindow = new BMap.InfoWindow(e.shop_address_txt,options);
                                 Marker2.addEventListener("click",function () {
                                     map.openInfoWindow(infoWindow,spt);
                                     map.panTo(spt,0);
                                 });
                             })
                         })
                     }
                 }else{
                     var locat=e.cityLatitude+","+e.cityLongitude;
                     query_url={
                        "location":locat,
                        "output":"json",
                        "ak":"702632E1add3d4953d0f105f27c294b9"
                     };
                     var exeCnt = 0;
                     (function(query_url,exeCnt){
                        $.getJSON("http://api.map.baidu.com/geocoder/v2/?callback=?",query_url,function(data){

                            if(data.result.addressComponent.city.indexOf(city_name)!=-1){
                                 pt=new BMap.Point(e.cityLongitude,e.cityLatitude);
                                 markers.push(new BMap.Marker(pt));
                                 total++;
                                 if(total == len){
                                     var markerClusterer = new BMapLib.MarkerClusterer(map, {markers:markers});
                                     $('.tradeNum').html("订单总数:"+total);
                                     $('.nullNum').html("位置不明订单总数:"+nullPosition);
                                     var promise = getCityShopDistribution(city_name);
                                     promise.done(function (ret) {
                                         ret.forEach(function (e) {
                                             var spt = new BMap.Point(e.shop_logitude,e.shop_latitude);
                                             var icon =new BMap.Icon("https://cdn3.iconfinder.com/data/icons/streamline-icon-set-free-pack/48/Streamline-18-32.png",new BMap.Size(32,32));
                                             var Marker2 = new BMap.Marker(spt,{icon:icon});
                                             map.addOverlay(Marker2);
                                             var options = {
                                                 width:200,
                                                 height:100,
                                                 title:e.shop_name
                                             };
                                             var infoWindow = new BMap.InfoWindow(e.shop_address_txt,options);
                                             Marker2.addEventListener("click",function () {
                                                 map.openInfoWindow(infoWindow,spt);
                                                 map.panTo(spt,0);
                                             });
                                         })
                                     })
                                 }
                            }else{
                                 nullPosition++;
                                 total++;
                                 if(total == len){
                                 var markerClusterer = new BMapLib.MarkerClusterer(map, {markers:markers});
                                        $('.tradeNum').html("订单总数:"+total);
                                        $('.nullNum').html("位置不明订单总数:"+nullPosition);
                                     var promise1 = getCityShopDistribution(city_name);
                                     promise1.done(function (ret) {
                                         ret.forEach(function (e) {
                                             var spt = new BMap.Point(e.shop_logitude,e.shop_latitude);
                                             var icon =new BMap.Icon("https://cdn3.iconfinder.com/data/icons/streamline-icon-set-free-pack/48/Streamline-18-32.png",new BMap.Size(32,32));
                                             var Marker2 = new BMap.Marker(spt,{icon:icon});
                                             map.addOverlay(Marker2);
                                             var options = {
                                                 width:200,
                                                 height:100,
                                                 title:e.shop_name
                                             };
                                             var infoWindow = new BMap.InfoWindow(e.shop_address_txt,options);
                                             Marker2.addEventListener("click",function () {
                                                 map.openInfoWindow(infoWindow,spt);
                                                 map.panTo(spt,0);
                                             });
                                         })
                                     })
                                 }
                            }

                        })
                     }(query_url,exeCnt))
                   }
                 }else{
                     total++;
                     nullPosition++;
                     if(total == len){
                        var markerClusterer = new BMapLib.MarkerClusterer(map, {markers:markers});
                        $('.tradeNum').html("订单总数:"+total);
                        $('.nullNum').html("位置不明订单总数:"+nullPosition);
                         var promise1 = getCityShopDistribution(city_name);
                         promise1.done(function (ret) {
                             ret.forEach(function (e) {
                                 var spt = new BMap.Point(e.shop_logitude,e.shop_latitude);
                                 var icon =new BMap.Icon("https://cdn3.iconfinder.com/data/icons/streamline-icon-set-free-pack/48/Streamline-18-32.png",new BMap.Size(32,32));
                                 var Marker2 = new BMap.Marker(spt,{icon:icon});
                                 map.addOverlay(Marker2);
                                 var options = {
                                     width:200,
                                     height:100,
                                     title:e.shop_name
                                 };
                                 var infoWindow = new BMap.InfoWindow(e.shop_address_txt,options);
                                 Marker2.addEventListener("click",function () {
                                     map.openInfoWindow(infoWindow,spt);
                                     map.panTo(spt,0);
                                 });
                             })
                         })
                     }
                 }
              }
              });
         });
         }
}