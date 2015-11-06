angular.module('tripod')
  .controller('UserPostController', [
    'UserService',
    'user',
    function (
      UserService,
      user
    ) {

    var self = this;
    self.user = user;

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

          var posts = this;

          UserService.query({
            id: self.user.id,
            type: 'posts',
            page: posts.page
          }, function(data) {
            posts.items = posts.items.concat(data);
          });

          posts.page += 1;
        }
      }
    };

  }]);
