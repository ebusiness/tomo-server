angular.module('tripod')
  .controller('ProfileController', ['user', function(user) {

    var self = this;
    self.user = user;

  }]);
