angular.module('tripod')
  .controller('PostListController', [
    '$state',
    'PostService',
    function (
      $state,
      PostService
    ) {

    var self = this;

    self.posts = {

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

          PostService.query({page: self.page}, function(posts) {
            self.items = self.items.concat(posts);
          });

          self.page += 1;
        }
      }
    };

    self.showReported = function() {
      $state.go('reports.posts');
    };

  }]);
