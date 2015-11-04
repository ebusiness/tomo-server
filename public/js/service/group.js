angular.module('tripod')
  .factory('GroupService', ['$resource', function($resource) {
    return $resource('/groups/:id/:type', {
      id: '@id',
      type: '@type'
    });
  }]);
