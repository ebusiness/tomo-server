angular.module('tripod')
  .controller('GlobalController', [
    '$rootScope',
    '$location',
    '$mdDialog',
    '$mdSidenav',
    '$mdMedia',
    '$mdToast',
    'SessionService',
    'NotificationService',
    'authService',
    function (
      $rootScope,
      $location,
      $mdDialog,
      $mdSidenav,
      $mdMedia,
      $mdToast,
      SessionService,
      NotificationService,
      authService
    ) {

      var self = this;

      self.$mdMedia = $mdMedia;

      SessionService.user.then(function(user) {
        self.user = user;
        getNotificatoins();
      });

      $rootScope.$on('event:auth-loginConfirmed', function($event, user) {
        self.user = user;
        getNotificatoins();
      });

      $rootScope.$on('event:auth-logoutConfirmed', function($event) {
        self.user = {};
        self.notifications = [];
        self.unreads = [];
      });

      $rootScope.$on('event:auth-loginRequired', function() {
        $mdDialog.show({
          controller: ['$mdDialog', DialogController],
          controllerAs: 'ctrl',
          templateUrl: '/admin/template/login-dialog.html',
          clickOutsideToClose: true
        }).then(function(user) {
          authService.loginConfirmed(user);
        });
      });

      function DialogController($mdDialog) {

        this.signin = function() {
          SessionService.signin(this.user)
            .then(function(user) {
              $mdToast.showSimple('已经以' + user.lastName + ' ' + user.firstName + '的身份登录');
              $mdDialog.hide(user);
              $location.path('/');
            }, function() {
              $mdToast.showSimple('登录失败，请确认您的账号和密码');
            });
        };
      };

      function getNotificatoins() {
        NotificationService.query({}, function(notis) {
          var notiGrp = _.partition(notis, function(value, index, collection) {
            return value.confirmed;
          });
          self.notifications = notis;
          self.unreads = notiGrp[1];
        });
      };

      self.markRead = function() {
        if (self.unreads.length)
          NotificationService.markRead({}, {
            ids: _.pluck(self.unreads, '_id')
          }, function() {
            self.unreads = [];
          });
      };

      self.toggleLeft = function() {
        $mdSidenav('left').toggle();
      };

      self.toggleRight = function(nav) {
        $mdSidenav(nav).toggle();
      };

      self.navigateTo = function(to) {
        $location.path(to);
      };

    }
  ]);
