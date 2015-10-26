angular.module('tripod')
  .controller('PostListController', [
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
