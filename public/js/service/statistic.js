angular.module('tripod')
  .factory('StatisticService', ['$resource', function($resource) {
    return $resource('/statistics');
  }]);
