angular.module('tripod')
  .controller('GroupListController', [
    'SessionService',
    'GroupService',
    function (
      SessionService,
      GroupService
    ) {

    var self = this;

    GroupService.query(function(groups) {
      self.groups = groups;
      self.page = 1;
    });

    self.loadNextPage = function() {
      GroupService.query({page: self.page}, function(groups) {
        self.groups = self.groups.concat(groups);
        self.page++;
      });
    }

  }]);
