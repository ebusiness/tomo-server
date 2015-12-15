angular.module('tripod')
  .controller('UserController', [
    '$state',
    'UserService',
    'user',
    '$log',
    '$http',
    function (
      $state,
      UserService,
      user,
      $log,
      $http
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

    self.pushNotification = function() {
        var url = '/users/'+self.user._id+'/notification';
        $http({
            method: 'POST',
            url: url,
            data: self.notification
        }).then(function successCallback(response) {
            $log.log('success->');
            $log.log(response);
        }, function errorCallback(response) {
            $log.log('error->');
            $log.log(response);
        });
    };
    
  }]);
