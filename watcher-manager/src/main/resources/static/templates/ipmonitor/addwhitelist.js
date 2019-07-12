Template.addwhitelist.events({
    'click #addWhite': function () {
        Meteor.call("updateIdIPWhiteList",getUserName(),this.obid,this.ip,function(error,result){
            if(result){
                //alert("OPERATION_SUCCESS")
            }else{
                alert("OPERATION_FAILED")
            }
        })
    },
    'click #addIP': function () {
        Meteor.call("updateIPWhiteList",getUserName(),this.ip,function(error,result){
            if(result){
                //alert("OPERATION_SUCCESS")
            }else{
                alert("OPERATION_FAILED")
            }
        })
    },
    'click #addPerson': function () {
        Meteor.call("updateIdWhiteList",getUserName(),this.obid,function(error,result){
            if(result){
                //alert("OPERATION_SUCCESS")
            }else{
                alert("OPERATION_FAILED")
            }
        })
    }
});