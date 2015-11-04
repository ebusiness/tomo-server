angular.module('tripod')
  .controller('GroupController', [
    '$timeout',
    'SessionService',
    'GroupService',
    'FileUploader',
    'group',
    function (
      $timeout,
      SessionService,
      GroupService,
      FileUploader,
      group
    ) {

    var self = this;
    self.group = group;

    self.uploader = new FileUploader({
      method: 'PUT',
      url: '/groups/' + self.group.id + '/cover',
    });

    self.uploader.onAfterAddingFile = function(item) {
      self.uploader.uploadAll();
    };

    self.uploader.onSuccessItem = function(item, response, status, headers) {
      self.group.cover = response.cover_ref;
    };

    // trigger photo file selection
    self.triggerFileSelection = function() {
      $timeout(function() {
        document.getElementById('fileInput').click();
      }, 0);
    }

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

          console.log("asdfasdf")

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
