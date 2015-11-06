angular.module('tripod')
  .factory('ReportService', ['$resource', function($resource) {
    return $resource('/reports/:type', {
      type: '@type'
    });
  }]);
