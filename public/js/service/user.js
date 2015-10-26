angular.module('tripod')
  .factory('UserService', ['$resource', function($resource) {
    return $resource('/users/:id', {
      id: '@id'
    });
  }]);
