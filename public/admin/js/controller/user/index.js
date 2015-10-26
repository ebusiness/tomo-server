angular.module('tripod')
  .controller('UserController', [
    'SessionService',
    'UserService',
    function (
      SessionService,
      UserService
    ) {

    var self = this;

    UserService.query(function(users) {
      self.users = users;
    });

  }]);
