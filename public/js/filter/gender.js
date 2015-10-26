angular.module('tripod')
  .filter('gender', [function() {
    return function(value) {

      if (value === 'male')
        return '男';
      else if (value === 'female')
        return '女';
      else
        return '';
    };
  }]);