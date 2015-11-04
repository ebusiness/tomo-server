angular.module('tripod')
  .controller('PostController', [
    'SessionService',
    'PostService',
    'post',
    function (
      SessionService,
      PostService,
      post
    ) {

    var self = this;
    self.post = post;

  }]);
