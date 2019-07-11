Template.bigScreenMonthAmount.rendered = function(){
    $(".wrapper").css("background","transparent");
    $("body").css("background","transparent");
    $("html").css("background-color","transparent");


    draw();


};
//var aliService = Meteor.settings.public.aliService.baseUrl;

function draw(){
    $.getJSON("http://120.26.193.148:8806/ali/order/getSubmitAmountPerMonth", {"startDate":"2014-01-01"}, function (ret) {
        //数据处理
        var data=[];
        var value=327 ;// 12月
        ret.forEach(function(obj){
            /*if(obj.x=="2016-11-01"){
                obj.y=340//obj.y-(obj.y-value)/1.5
            }else if(obj.x=="2016-10-01"){
                obj.y=329//obj.y-(obj.y-value)/1.5
            }else if(obj.x=="2016-09-01"){
                obj.y=330//obj.y-(obj.y-value)/1.5
            }else if(obj.x=="2017-01-01"){
                obj.y=315
            }else if(obj.x=="2017-02-01"){
                obj.y=328
            }*/
            data.push(obj)

        })
        var option = {
            title: {
                /*text: '月营业额',
                x: 'center',
                y:"bottom",
                textStyle: {
                    color: "white",
                    font: 20
                }*/
            },
            tooltip: {
                trigger: 'axis',
            },
            legend: {
                data: ['月营业额'],
                y:"bottom",
                textStyle:{
                    color:"white"
                }
            },
            color:["white"],
            xAxis:[
                {
                    type : 'category',
                    boundaryGap : false,
                    data:_.map(data,function(obj){return obj.x.substring(2,7)}),
                    axisLabel:{
                        textStyle:{
                            color:"white"
                        }
                    }
                }
            ],
            yAxis : [
                {
                    type : 'value',
                    show:false
                }
            ],
            series: [
                {
                    name: '月营业额',
                    type: 'line',
                    data: _.map(data,function(obj){return obj.y}),
                    smooth:true,  //这句就是让曲线变平滑的
                    areaStyle: {
                        normal: {
                            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [{
                                offset: 0,
                                color: 'rgba(40, 182, 252, 0.85)' //深色
                            }, {
                                offset: 1,
                                color: 'rgba(28, 159, 255, 0.2)' //浅色
                            }])
                        }
                    },
                    label: {
                        normal: {
                            textStyle: {
                                color: "white"
                            }
                        }
                    },
                    /*itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }*/
                }
            ]
        };
        var monthAmountContainer = document.getElementById('monthAmount')
        var monthAmount = echarts.init(monthAmountContainer);
        monthAmountContainer.style.width = window.innerWidth + 'px';
        monthAmountContainer.style.height = window.innerHeight + 'px';

        monthAmount.setOption(option);
        monthAmount.resize();
        window.onresize = function () {
            monthAmountContainer.style.width = window.innerWidth + 'px';
            monthAmountContainer.style.height = window.innerHeight + 'px';
            monthAmount.resize();
        };
    })

}