Template.VisitCityDistribution.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#district').addClass('active');
    $('#VisitCityDistribution').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }
    /*日期设初值*/
    var nowdate=new Date().format("yyyy-MM-ddd");
    var lastnow=new Date(nowdate).getNewDate(-2);
    var todaynow=new Date(nowdate).getNewDate(-1);
    $('.webTrafficUVCityRangestart').html(todaynow);
    $('.webTrafficUVCityRangeend').html(todaynow);
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

//    query={
//    };
//    var exitData=[];
//    $.get("/getVisitCityDate",query,function(data){
//         JSON.parse(data).forEach(function(e){
//            exitData.push(new Date(e.trade_finish_date).format("yyyy-MM-dd"));
//         });
            /*开始时间*/
        $('.webTrafficUVCityRangestart').daterangepicker({
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

            /*结束时间*/
        $('.webTrafficUVCityRangeend').daterangepicker({
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
//    });

    echarts.registerMap('china', chinaMap);
    drawUVCityDistributionGeoChart();

};

dataService = Meteor.settings.public.dataService.baseUrl;

/*开始时间*/
function pickstartDateRangeCallback(start, end, label) {
//    console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    $('.webTrafficUVCityRangestart').html(start.format('YYYY-MM-DD'));
    drawUVCityDistributionGeoChart();
}
/*结束时间*/
function pickendDateRangeCallback(start, end, label) {
//    console.log("New date range selected: " + start.format('YYYY-MM-DD') + " to " + end.format('YYYY-MM-DD') + " (predefined range: " + label + ")");
    $('.webTrafficUVCityRangeend').html(start.format('YYYY-MM-DD'));
    drawUVCityDistributionGeoChart();
}

function drawUVCityDistributionGeoChart() {
        /*获取全部的城市、经纬度、个数值,数据源改变，由每个城市名累计计数得到相应的城市上门个数，此处解决异步的问题而繁杂*/
     var startDate=$('.webTrafficUVCityRangeend').html();
     var endDate=$('.webTrafficUVCityRangestart').html();

     var nowdate=new Date().format("yyyy-MM-ddd");
     var todaynow=new Date(nowdate).getNewDate(-1);

     var sd=new Date(startDate.replace(/-/g,"/"));
     var ed=new Date(endDate.replace(/-/g,"/"));
     var interdate=parseInt((ed-sd) / (1000 * 60 * 60 * 24));
     if(interdate>10){
         alert("时间间隔超过十天，请重新选择！");
         var startDate=$('.webTrafficUVCityRangeend').html(todaynow);
         var endDate=$('.webTrafficUVCityRangestart').html(todaynow);
     }else{
        query={
                "startDate":startDate,
                "endDate":endDate
        };
        var result=[];
        var max=0;
         requestURL(dataService+"/ondoorDaily/heatMap",query).done(function(data){
              var len = data.length;
             data.forEach(function(e){

                    query_city={
                         "cityName":e.cityName,
                         "startDate":startDate,
                         "endDate":endDate
                    };
                    var count=0;
                    if (e.tradeCount > max) {
                        max = e.tradeCount;
                    }
                    (function (query_city,count,max) {
                        requestURL(dataService+"/ondoorDaily/heatMapDetail",query_city).done(function(data){
                              data.forEach(function(ecount){
                                    count+=ecount.tradeCount;
                              });

                             var item = {name: e.cityName, value: [e.cityLongitude, e.cityLatitude, count]};
                             result.push(item);

                             if(result.length == len){
                                 draw(result,max);
                             }
                          });} (query_city,count,max))
            })
        });
     }
}


function draw(result,max){

    var getSymbolSize = function (value) {
                  var size = Math.sqrt(parseFloat(value[2]) / parseFloat(max)) * 45;
                  if (size < 30) {
                      return 30
                  } else {
                      return parseInt(size)
                  }
              };

              var option = {
                  backgroundColor: '#404a59',
                  title: {
                      text: '上门区域热点图',
                      subtext: '1.各个区域的上门热图(数据为提交量)\n2.点击查看区域的详细信息\n3.由于数据量过大，请勿查询时间段超过10天的信息，以免反应过慢。',
                      left: 'center',
                      textStyle: {
                          color: '#fff'
                      }
                  },
                  tooltip: {
                      trigger: 'item',
                      formatter: function (params) {
                          return params.name + ' : ' + params.value[2].toLocaleString();
                      }
                  },
                  legend: {
                      orient: 'vertical',
                      y: 'bottom',
                      x: 'right',
                      data: ['访问用户数'],
                      textStyle: {
                          color: '#fff'
                      }
                  },
                  geo: {
                      map: 'china',
                      label: {
                          emphasis: {
                              show: false
                          }
                      },
                      itemStyle: {
                          normal: {
                              areaColor: '#323c48',
                              borderColor: '#111'
                          },
                          emphasis: {
                              areaColor: '#2a333d'
                          }
                      }
                  },
                  dataRange: {
                      min: 0,
                      max: max,
                      calculable: true,
                      color: ['#d94e5d', '#eac736', '#50a3ba'],
                      textStyle: {
                          color: '#fff'
                      }
                  },
                  series: [
                      {
                          name: '访问用户数',
                          type: 'scatter',
                          coordinateSystem: 'geo',
                          data: result.slice(15, result.length),
                          symbolSize: function (val) {
                              return getSymbolSize(val);
                          },
                          hoverAnimation: false,
                          legendHoverLink: false,
                          label: {
                              normal: {
                                  formatter: '{b}',
                                  position: 'right',
                                  show: false
                              },
                              emphasis: {
                                  show: true
                              }
                          },
                          itemStyle: {
                              normal: {
                                  color: '#ddb926',
                                  opacity: 0.5
                              },
                              emphasis: {
                                  shadowBlur: 10,
                                  shadowColor: '#333',
                                  opacity: 1
                              }
                          }
                      },
                      {
                          name: 'Top 15',
                          type: 'effectScatter',
                          coordinateSystem: 'geo',
                          data: result.slice(0,15),
                          symbolSize: function (val) {
                              return getSymbolSize(val);
                          },
                          showEffectOn: 'hover',
                          rippleEffect: {
                              brushType: 'stroke'
                          },
                          hoverAnimation: false,
                          legendHoverLink: false,
                          label: {
                              normal: {
                                  formatter: '{b}',
                                  position: 'right',
                                  show: true,
                                  opacity: 1
                              }
                          },
                          itemStyle: {
                              normal: {
                                  color: '#f4e925',
                                  shadowBlur: 10,
                                  shadowColor: '#333',
                                  opacity: 0.5
                              },
                              emphasis: {
                                  shadowBlur: 10,
                                  shadowColor: '#333',
                                  opacity: 0.5
                              }
                          },
                          z: 2
                      }
                  ]
              };

              var UVCityDistributionGeoChart = echarts.init(document.getElementById('UVCityDistributionGeoChart'));
              UVCityDistributionGeoChart.setOption(option);
              window.addEventListener('resize',UVCityDistributionGeoChart.resize)
              // 处理点击事件并且条状到相应的百度地图页面
              UVCityDistributionGeoChart.on('click', function (params) {
              var todaynow=$('.webTrafficUVCityRangestart').html();
              var lastnow=$('.webTrafficUVCityRangeend').html();
                  $.fancybox.open([{
                      "type":"iframe",
                      "href":"/BaiduMapDistribution/"+params.name+"/"+params.data.value[2]+"/"+todaynow+"/"+lastnow+"/"+params.value[0]+"/"+params.value[1]
                  }],{
                      maxWidth: 1300,
                      maxHeight: 700,
                      fitToView: false,
                      width: '100%',
                      height: '100%',
                      autoSize: false,
                      closeClick: false,
                      closeBtn: true,
                      openEffect: 'elastic',
                      closeEffect: 'elastic'
                  })
             });
}