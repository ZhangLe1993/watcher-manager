Template.SHDailyEmpty.rendered = function() {
    $('.navi-tab').removeClass('active');
    $('#BDTab').addClass('active');
    $('#SHDailyEmpty').addClass('active');
    var ua = navigator.userAgent.toLowerCase();
    var isAndroid = ua.indexOf("android") >-1;
    var isiOS = ua.indexOf("iphone") >-1;
    if(isAndroid||isiOS){
        $('.sidebar-toggle').click();
    }

    /*var updateStats = function (query) {
        requestURL(dataService + "/operationCenter/realTimeStats", query).done(function (data) {
            /!*$('#returnedCount').html(data.returnedCount);
            $('#preReturnCount').html(data.preReturnCount);
            $('#orderInspection').html(data.orderInspection);
            $('#orderPreInspection').html(data.orderPreInspection);
            $('#samplingInspection').html(data.samplingInspection);
            $('#samplingPreInspection').html(data.samplingPreInspection);*!/
            /!*$('#usedContainerCount').html(data.usedContainerCount);
            $('#freeContainerCount').html(data.freeContainerCount);
            $('#usedTrolleyCount').html(data.usedTrolleyCount);
            $('#freeTrolleyCount').html(data.freeTrolleyCount);*!/
        })
    };

    var date = new Date().format("yyyy-MM-dd");

    var query = {
        "date": date,
        "operationCenter": 1
    };*/

    //updateStats(query);
};

// Template.SHDailyEmpty.helpers({

//     transferDetailToday:function(transferType) {
//         var stats = operationStats.find({type:transferType},{sort:{date:-1}});
//         if(stats.fetch().length == 0){
//             return [{date: new Date().format('yyyy-MM-dd'),descName:transferType,count:0}];
//         }else {
//             return stats
//         }
//     },
//     transferTotalToday:function(transferType) {
//         var stats = operationStats.find({type:transferType},{sort:{date:-1}});
//         if(stats.fetch().length == 0){
//             return [{date: new Date().format('yyyy-MM-dd'),descName:transferType,count:0}];
//         }else {
//             var count = 0;
//             stats.fetch().forEach(function(e){
//                 count = count + e.count
//             });
//             return [{date:new Date().format('yyyy-MM-dd'),count:count}]
//         }
//     },
//     statsToday: function(statsType) {
//         var stats = operationStats.find({type:statsType},{sort:{date:-1}});
//         if(stats.fetch().length == 0){
//             return [{date: new Date().format('yyyy-MM-dd'),count:0,total:0,preReceive:0,orderPreInspection:0,samplingPreInspection:0}];
//         }else {
//             return stats
//         }
//     },
//     inspectionToday: function(operationName) {
//         var stats = operationStats.find({type:'inspection',operationName:operationName},{sort:{date:-1}});
//         if(stats.fetch().length == 0){
//             return [{date: new Date().format('yyyy-MM-dd'),count:0,operationName:'无'}];
//         }else {
//             return stats
//         }
//     },
//     receiptToday:function(){
//         var stats = operationStats.find({type:'receipt'},{sort:{date:-1}});
//         if(stats.fetch().length == 0){
//             return {date: new Date().format('yyyy-MM-dd'),count:0};
//         }else {
//             var count = 0;
//             stats.fetch().forEach(function(e){
//                 count = count + e.count
//             });
//             return {date:new Date().format('yyyy-MM-dd'),count:count}
//         }
//     },
//     receiptXiaoMiToday:function(){
//         var stats = operationStats.find({type:'receipt',isXiaoMi:true},{sort:{date:-1}});
//         if(stats.fetch().length == 0){
//             return {date: new Date().format('yyyy-MM-dd'),count:0};
//         }else {
//             var count = 0;
//             stats.fetch().forEach(function(e){
//                 count = count + e.count
//             });
//             return {date:new Date().format('yyyy-MM-dd'),count:count}
//         }
//     },
//     onPassageStat:function(){
//         var stats = operationStats.findOne({type:'onPassage'});
//         if(stats == undefined){
//             return {count:0,amount:0};
//         }else {
//             return stats
//         }
//     },
//     warehouseInfo:function(status){
//         var stats = warehouseInfo.find({"status":status},{sort:{date:-1}});
//         if(stats.fetch().length == 0){
//             return {date: new Date().format('yyyy-MM-dd'),total_count:0,total_price:0,arr:[]}
//         }else{
//             var total_price = 0;
//             var total_count = 0;
//             var arr = [];
//             stats.fetch().forEach(function(e){
//                 total_count = total_count + parseInt(e.count);
//                 total_price = total_price+ parseInt(e.price);
//                 arr.push(e)
//             });
//             return {"total_count":total_count,"total_price":total_price,"arr":arr,"date":stats.fetch()[0].date}
//         }
//     }

// });