angular.module('tripod')
  .controller('UserListController', [
    'SessionService',
    'UserService',
    function (
      SessionService,
      UserService
    ) {

    var self = this;

    self.users = {

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

          UserService.query({page: self.page}, function(users) {
            self.items = self.items.concat(users);
          });

          self.page += 1;
        }
      }
    };

  }]);
