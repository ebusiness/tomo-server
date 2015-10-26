angular.module('tripod')
  .factory('GroupService', ['$resource', function($resource) {
    return $resource('/groups/:id', {
      id: '@id'
    });
  }]);
