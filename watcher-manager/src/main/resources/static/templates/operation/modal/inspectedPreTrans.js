Template.inspectedPreTrans.rendered = function(){
    renderTable();
    Deps.autorun(function () {
        if (location.pathname.indexOf('inspectedPreTrans') > 0) {
            renderTable();
        }
    })
};

function  renderTable(){
    $('#table').bootstrapTable('destroy').bootstrapTable({
        exportDataType: 'all',
        data:inspectedPreTrans.find().fetch()
    });
}