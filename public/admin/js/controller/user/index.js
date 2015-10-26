angular.module('tripod')
  .controller('UserListController', [
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
