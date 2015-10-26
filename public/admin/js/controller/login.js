angular.module('tripod')
  .controller('LoginController', ['SessionService', '$scope', '$location', '$mdToast', function(SessionService, $scope, $location, $mdToast) {

    var self = this;

    this.login = function() {

      SessionService.login(self.user)
        .then(function(user) {
          $mdToast.showSimple(user.lastName + ' ' + user.firstName + 'さん、お帰りなさい');
          $scope.$emit('event:auth-loginConfirmed', user);
          $location.path('/');
          return user;
        }, function() {
          $mdToast.showSimple('パースワードをご確認ください');
        });
    };

  }]);