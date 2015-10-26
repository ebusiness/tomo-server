angular.module('tripod')
  .filter('age', [function() {
    return function(value) {

      if (!value || !angular.isDate(value))
        return '';
      else
        return moment().diff(value, 'years') + '歳';
    };
  }]);