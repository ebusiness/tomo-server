angular.module('tripod')
  .controller('SideNavController', ['$rootScope', '$location', 'SessionService', function($rootScope, $location, SessionService) {

    var self = this;

    self.signout = function($event) {
      SessionService.signout().then(function() {
        $rootScope.$broadcast('event:auth-logoutConfirmed');
        $location.path('/');
      });
    };

  }]);
