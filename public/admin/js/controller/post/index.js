angular.module('tripod')
  .controller('PostController', [
    'SessionService',
    'PostService',
    function (
      SessionService,
      PostService
    ) {

    var self = this;

    PostService.query(function(posts) {
      self.posts = posts;
    });

  }]);
