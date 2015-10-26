angular.module('tripod')
  .controller('GroupController', [
    'SessionService',
    'GroupService',
    function (
      SessionService,
      GroupService
    ) {

    var self = this;

    GroupService.query(function(groups) {
      self.groups = groups;
    });

  }]);
