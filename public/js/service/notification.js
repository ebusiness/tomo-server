angular.module('tripod')
  .factory('NotificationService', ['$resource', function($resource) {
    return $resource('/notifications/:id', {
      id: '@id'
    }, {
      query: {
        isArray: true,
        transformResponse: function transfromUser(data) {
          var notifications = angular.fromJson(data);
          angular.forEach(notifications, function(notification) {
            notification.createDate = notification.createDate ? new Date(notification.createDate) : null;
          });
          return notifications;
        }
      },
      count: {
        method: 'GET'
      },
      markRead: {
        method: 'PUT'
      }
    });
  }]);