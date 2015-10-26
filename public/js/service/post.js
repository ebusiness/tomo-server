angular.module('tripod')
  .factory('PostService', ['$resource', function($resource) {
    return $resource('/posts/:id', {
      id: '@id'
    });
  }]);
