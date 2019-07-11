Template.bigScreenArea.rendered = function(){
    $(".wrapper").css("background","transparent");
    $("body").css("background","transparent");
    $("html").css("background-color","transparent");

    window.timeOutScatterId=setTimeout( complexFunction, 0 );
    function complexFunction() {
        draw();
        window.timeOutScatterId=setTimeout( complexFunction, 300000 );
    }

};
//var aliService = Meteor.settings.public.aliService.baseUrl;

function draw(){
    $.getJSON("http://120.26.193.148:8806/ali/order/getAreaRank", {}, function (data) {
        var option = {
            title: {
                /*text: '各大区订单占比',
                x: 'center',
                textStyle: {
                    color: "white",
                    font: 20
                }*/
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)"
            },
            legend: {
                /*orient: 'vertical',
                 left: 'left',
                 data: ['直接访问','邮件营销','联盟广告','视频广告','搜索引擎']*/
            },

            color:["rgba(6,74, 130, 1)","rgba(17,121, 183, 1)","rgba(22,187, 240, 1)","rgba(16,208, 240, 1)"],
            series: [
                {
                    name: '大区占比',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: _.map(_.sortBy(data,function(obj){return obj.y}).reverse(), function (obj) {
                        return {"name": obj.x, "value": obj.y}
                    }),
                    label: {
                        normal: {
                            formatter:"{b}:{d}%",
                            textStyle: {
                                color: "white"
                            }
                        }
                    },
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
        var areaContainer = document.getElementById('area')
        var area = echarts.init(areaContainer);
        areaContainer.style.width = window.innerWidth + 'px';
        areaContainer.style.height = window.innerHeight + 'px';

        area.setOption(option);
        area.resize();
        window.onresize = function () {
            areaContainer.style.width = window.innerWidth + 'px';
            areaContainer.style.height = window.innerHeight + 'px';
            area.resize();
        };
    })

}