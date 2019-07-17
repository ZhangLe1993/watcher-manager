Template.inquiryException.rendered = function () {
    $('.navi-tab').removeClass('active');
    $('#inquiryException').addClass('active');
    $('#pricemonitor').addClass('active');
};

// Template.inquiryException.helpers({
//     selector: function () {
//         return {count: {$gt: 0}}; // this could be pulled from a Session var or something that is reactive
//     }
// });