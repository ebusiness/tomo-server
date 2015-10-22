angular.module('tripod')
  .directive('isAvaliableId', ['$http', '$q', function($http, $q) {
    return {
      restrict: 'A',
      require: 'ngModel',
      link: function($scope, $element, $attrs, ngModelCtrl) {

        ngModelCtrl.$asyncValidators.isAvaliableId = function(modelValue, viewValue) {
          return $http.post('/available', {
            email: viewValue
          }).then(function(response) {
            return true;
          }, function(response) {
            return $q.reject(response.data.errorMessage);
          });
        };
      }
    }
  }]);