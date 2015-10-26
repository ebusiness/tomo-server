angular.module('tripod')
  .controller('SignUpController', ['SessionService', '$location', '$mdDialog', '$mdToast', function(SessionService, $location, $mdDialog, $mdToast) {

    var self = this;

    this.signup = function() {
      SessionService.signup(self.user)
        .then(function() {
          $mdToast.showSimple('確認メールを送信しました、ご確認ください');
          $location.path('/');
        });
    };

    this.showTerm = function(event) {
      $mdDialog.show({
        controller: ['$mdDialog', DialogController],
        controllerAs: 'ctrl',
        templateUrl: '/template/user/term.html',
        targetEvent: event,
        clickOutsideToClose: true
      });
    };

    function DialogController($mdDialog) {
      this.cancel = function() {
        $mdDialog.cancel();
      };
    };

  }]);