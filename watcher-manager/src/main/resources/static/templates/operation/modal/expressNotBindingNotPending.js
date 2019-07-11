Template.expressNotBindingNotPending.rendered = function(){
    var operationCenter = Template.currentData().operationCenter;
    var date = new Date().format("yyyy-MM-dd");
    var query={
        "date":date,
        "operationCenter": operationCenter
    }

    requestURL(dataService + "/operationCenter/expressSerialNo", query).done(function (data) {
        renderTable(data);
    });
};

function  renderTable(data){
    $('#table').bootstrapTable('destroy').bootstrapTable({
        search:true,
        exportDataType: 'all',
        data:data
    });
}