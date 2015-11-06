angular.module('tripod')
  .controller('GroupController', [
    '$state',
    '$timeout',
    'FileUploader',
    'group',
    function (
      $state,
      $timeout,
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

    self.showMembers = function() {
      $state.go('group.members')
    }

    self.showPosts = function() {
      $state.go('group.posts')
    }

  }]);
