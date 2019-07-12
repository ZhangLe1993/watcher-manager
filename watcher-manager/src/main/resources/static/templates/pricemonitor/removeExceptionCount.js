Template.removeExceptionCount.events({
    'click #handled': function () {
        Meteor.call("removeInquiryExceptionCount",getUserName(),this.productId,this.errorCode,function(error,result){
            if(result){
                alert("操作成功")
            }else{
                alert("OPERATION_FAILED")
            }
        })
    }
});