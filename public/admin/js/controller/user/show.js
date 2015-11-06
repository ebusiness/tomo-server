angular.module('tripod')
  .controller('UserController', [
    '$state',
    'UserService',
    'user',
    function (
      $state,
      UserService,
      user
    ) {

    var self = this;
    self.user = user;

    self.showProfile = function() {
      $state.go('user.profile')
    };

    self.showPosts = function() {
      $state.go('user.posts')
    };

    self.showStatistics = function() {
      $state.go('user.statistics')
    };

  }]);
