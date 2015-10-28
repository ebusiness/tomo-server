angular.module('tripod')
  .controller('GroupListController', [
    'SessionService',
    'GroupService',
    function (
      SessionService,
      GroupService
    ) {

    var self = this;

    self.groups = {

      items: [],

      page: 0,

      getItemAtIndex: function(index) {
        if (index > this.items.length) {
          this.fetchMoreItems_(index);
          return null;
        }
        return this.items[index];
      },

      getLength: function() {
        return this.items.length + 3;
      },

      fetchMoreItems_: function(index) {

        if (this.page*20 < index) {
          var self = this;
          self.page += 1;
          GroupService.query({page: self.page}, function(groups) {
            self.items = self.items.concat(groups);
          });
        }
      }
    };

  }]);
