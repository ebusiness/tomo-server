angular.module('tripod')
  .factory('UserService', ['$resource', function($resource) {
    return $resource('/users/:id/:type', {
      id: '@id',
      type: '@type'
    });
  }]);
