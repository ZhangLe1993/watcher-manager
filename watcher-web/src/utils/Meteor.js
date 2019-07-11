window.Meteor = {};
window.Meteor.use = function() {
  return {
    profile: {
      name: 'test',
    },
  };
};

window.Meteor.userId = function() {
  return 'test';
};
