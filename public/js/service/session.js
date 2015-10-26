angular.module('tripod')
  .factory('SessionService', ['$http', '$q', function($http, $q) {

    function transformUser(response) {
      response.data.birthDay = response.data.birthDay ? new Date(response.data.birthDay) : null;
      response.data.lastLogin = response.data.lastLogin ? new Date(response.data.lastLogin) : null;
      response.data.createDate = response.data.createDate ? new Date(response.data.createDate) : null;

      if (response.data.visa)
        response.data.visa.expiration = response.data.visa.expiration ? new Date(response.data.visa.expiration) : null;

      if (response.data.educations && response.data.educations.length)
        angular.forEach(response.data.educations, function(value) {
          value.startDate = value.startDate ? new Date(value.startDate) : null;
          value.endDate = value.endDate ? new Date(value.endDate) : null;
        });

      if (response.data.careers && response.data.careers.length)
        angular.forEach(response.data.careers, function(value) {
          value.startDate = value.startDate ? new Date(value.startDate) : null;
          value.endDate = value.endDate ? new Date(value.endDate) : null;
        });

      return response.data;
    }

    var service = {

      user: $q.reject(),

      signup: function(user) {
        return $http.post('/signup', user);
      },

      login: function(user) {

        this.user = $http.post('/login', user, {
          ignoreAuthModule: true
        }).then(transformUser);

        return this.user;
      },

      session: function() {

        this.user = $http.get('/session').then(transformUser);
        return this.user;
      },

      logout: function() {
        var self = this;
        return $http.get('/logout').then(function(response) {
          self.user = $q.reject();
        });
      }
    };

    service.user = $http.get('/session', {
      ignoreAuthModule: true
    }).then(transformUser);

    return service;

  }]);
