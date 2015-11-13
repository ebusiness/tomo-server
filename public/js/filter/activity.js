angular.module('tripod')
  .filter('activity', ['ActivityValue', function(ActivityValue) {
    return function(value) {
      var activity = _.findWhere(ActivityValue, {
        code: value
      });

      return activity ? activity.name : value;
    };
  }]);
