angular.module('tripod')
  .directive('repass', [function() {
    return {
      restrict: 'A',
      require: 'ngModel',
      scope: {
        repass: '@'
      },
      link: function($scope, $element, $attrs, ngModelCtrl) {
        // Handle DOM update --> Model update
        ngModelCtrl.$validators.repass = function(modelValue, viewValue) {
          var password = $attrs.repass;
          return valid = password ? modelValue == password : true;
        };
      }
    };
  }]);