angular.module('tripod')
  .controller('UserController', [
    'SessionService',
    'UserService',
    'user',
    function (
      SessionService,
      UserService,
      user
    ) {

    var self = this;
    self.user = user;

  }]);
