angular.module('tripod')
  .factory('MeService', ['$resource', function($resource) {
    return $resource('/me');
  }]);

function transfromUser(data) {
  var users = angular.fromJson(data);
  angular.forEach(users, function(user) {
    user.birthDay = user.birthDay ? new Date(user.birthDay) : null;
    user.lastLogin = user.lastLogin ? new Date(user.lastLogin) : null;
    user.visa.expiration = user.visa.expiration ? new Date(user.visa.expiration) : null;
    user.createDate = user.createDate ? new Date(user.createDate) : null;
  });
  return users;
};