Template.bigScreenOperation.rendered = function(){
    $(".wrapper").css("background","transparent");
    $("body").css("background","transparent");
    $("html").css("background-color","transparent");

    window.timeOutScatterId=setTimeout( complexFunction, 0 );
    function complexFunction() {
        draw();
        window.timeOutScatterId=setTimeout( complexFunction, 120000 );
    }

};
//var aliService = Meteor.settings.public.aliService.baseUrl;
function draw(){
    $.getJSON("http://120.26.193.148:8806/ali/order/getOperationNum", {}, function (data) {
        var option = {
            title: {
                /*text: '运营中心占比',
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
            color:["rgba(6,74, 130, 1)","rgba(17,121, 183, 1)","rgba(22,187, 240, 1)","rgba(16,208, 240, 1)","rgba(93,207, 233, 1)"],
            series: [
                {
                    name: '运营中心占比',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: _.map(data,function(obj){return {"name":obj.name.substring(0,2),"value":obj.value}}),
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
        var operationContainer = document.getElementById('operation')
        var operation = echarts.init(operationContainer);
        operationContainer.style.width = window.innerWidth + 'px';
        operationContainer.style.height = window.innerHeight + 'px';

        operation.setOption(option);
        operation.resize();
        window.onresize = function () {
            operationContainer.style.width = window.innerWidth + 'px';
            operationContainer.style.height = window.innerHeight + 'px';
            operation.resize();
        };
    })

}