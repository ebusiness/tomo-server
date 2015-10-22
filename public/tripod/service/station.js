angular.module('tripod')
  .factory('StationService', ['$resource', function($resource) {
    return $resource('/stations');
  }]);