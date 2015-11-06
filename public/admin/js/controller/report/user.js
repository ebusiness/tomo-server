angular.module('tripod')
  .controller('ReportedUserListController', ['ReportService', function (ReportService) {

    var self = this;

    self.reports = {

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

          ReportService.query({
            page: self.page,
            type: 'users'
          }, function(data) {
            self.items = self.items.concat(data);
          });

          self.page += 1;
        }
      }
    };

  }]);
