angular.module('tripod')
  .directive('date', ['$filter', function($filter) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function($scope, $element, $attrs, ngModelCtrl) {

        // Handle DOM update --> Model update
        ngModelCtrl.$parsers.unshift(function(value) {

          var value = moment(value, 'YYYY/MM/DD', true);
          var valid = value.isValid();

          ngModelCtrl.$setValidity('date', valid);
          return valid ? value.toDate() : undefined;
        });

        // Handle Model Update --> DOM
        ngModelCtrl.$formatters.unshift(function(value) {
          return value ? $filter('date')(new Date(value), 'yyyy/MM/dd') : '';
        });
      }
    };
  }]);