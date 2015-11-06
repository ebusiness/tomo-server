angular.module('tripod')
  .controller('GroupMemberController', [
    'GroupService',
    'group',
    function (
      GroupService,
      group
    ) {

    var self = this;
    self.group = group;

    self.members = {

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

          var members = this;

          GroupService.query({
            id: self.group.id,
            type: 'members',
            page: members.page
          }, function(groups) {
            members.items = members.items.concat(groups);
          });

          members.page += 1;
        }
      }
    };

  }]);
